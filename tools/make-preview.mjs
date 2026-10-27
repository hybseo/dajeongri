/*
 * 오프라인 미리보기 꾸러미 만들기.
 *
 * 왜 필요한가
 *   실제 사이트(dist)는 웹서버에서 열리도록 "/note/" 같은 절대 주소와
 *   모듈 스크립트를 씁니다. 이 상태로는 내 컴퓨터에서 파일을 두 번 눌러 열면
 *   링크와 기능이 동작하지 않습니다(브라우저가 파일 주소에서 막음).
 *
 * 이 스크립트가 하는 일
 *   1. dist 를 복사해 preview-offline/다정리_미리보기/site 에 둡니다.
 *   2. 모든 링크를 파일끼리 찾아갈 수 있는 상대 주소로 바꿉니다 ("/note/" → "../note/index.html").
 *   3. 모듈 스크립트를 하나로 묶어 페이지 안에 넣습니다(Word 만들기 기능 포함).
 *   4. 웹서버에서만 쓰는 것(오프라인 저장용 서비스 워커, 설치 정보)은 뺍니다.
 *   5. 맨 위에 "여기를 두 번 누르세요.html" 을 만듭니다.
 *
 * 쓰는 법: npm run preview:offline
 * 실제 사이트(dist)는 바뀌지 않습니다. 미리보기 폴더는 저장소에 올리지 않습니다(.gitignore).
 */
import { build } from 'esbuild';
import { cp, mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const outRoot = join(root, 'preview-offline', '다정리_미리보기');
const site = join(outRoot, 'site');

async function walk(dir) {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(p)));
    else out.push(p);
  }
  return out;
}

const bundles = new Map();
async function bundle(entryAbs) {
  if (bundles.has(entryAbs)) return bundles.get(entryAbs);
  const r = await build({ entryPoints: [entryAbs], bundle: true, format: 'iife', target: 'es2019', minify: true, write: false, logLevel: 'silent' });
  const code = r.outputFiles[0].text.replace(/<\/script/gi, '<\\/script');
  bundles.set(entryAbs, code);
  return code;
}

function relPath(fromFile, target) {
  // target: 사이트 안 절대 주소 (예: "/note/", "/_astro/a.css", "/after/#x")
  const m = target.match(/^([^?#]*)(.*)$/);
  let p = m[1];
  const rest = m[2];
  if (p === '/' || p === '') p = '/index.html';
  else if (p.endsWith('/')) p = p + 'index.html';
  const depth = relative(site, dirname(fromFile)).split(sep).filter(Boolean).length;
  const prefix = depth ? '../'.repeat(depth) : './';
  return prefix + p.slice(1) + rest;
}

await rm(outRoot, { recursive: true, force: true });
await mkdir(site, { recursive: true });
await cp(dist, site, { recursive: true });
await rm(join(site, 'sw.js'), { force: true });

const files = (await walk(site)).filter((f) => f.endsWith('.html'));
for (const file of files) {
  let html = await readFile(file, 'utf8');

  // 웹서버 전용 요소 빼기
  html = html.replace(/<script data-sw>[\s\S]*?<\/script>/g, '');
  html = html.replace(/<link rel="manifest"[^>]*>/g, '');

  // 모듈 스크립트 → 묶어서 본문 끝에
  const tails = [];
  const srcRe = /<script type="module" src="(\/[^"]+)"><\/script>/g;
  for (const m of [...html.matchAll(srcRe)]) tails.push(await bundle(join(site, m[1])));
  html = html.replace(srcRe, '');
  const inlineRe = /<script type="module">([\s\S]*?)<\/script>/g;
  for (const m of [...html.matchAll(inlineRe)]) {
    const r = await build({ stdin: { contents: m[1], resolveDir: join(site, '_astro'), loader: 'js' }, bundle: true, format: 'iife', target: 'es2019', minify: true, write: false, logLevel: 'silent' });
    tails.push(r.outputFiles[0].text.replace(/<\/script/gi, '<\\/script'));
  }
  html = html.replace(inlineRe, '');

  // 절대 주소 → 상대 주소 (외부 주소 "//", "https:" 는 그대로)
  html = html.replace(/(href|src)="(\/(?!\/)[^"]*)"/g, (_, a, p) => `${a}="${relPath(file, p)}"`);

  // 스크립트 안에서 만드는 링크(예: 계산기의 "자세히 보기")를 위한 주소 변환 도우미
  const depth = relative(site, dirname(file)).split(sep).filter(Boolean).length;
  const base = depth ? '../'.repeat(depth) : './';
  const helper = `<script>window.__href=function(p){var m=p.match(/^([^?#]*)(.*)$/);var q=m[1];if(q==='/'||q==='')q='/index.html';else if(q.charAt(q.length-1)==='/')q+='index.html';return ${JSON.stringify(base)}+q.slice(1)+m[2];};</script>`;
  const banner = '<div style="position:sticky;top:0;z-index:20;background:#b5643c;color:#fff;font:600 14px/1.4 sans-serif;padding:6px 12px;text-align:center">오프라인 미리보기 · 실제 사이트에서는 이 줄이 보이지 않습니다</div>';
  html = html.replace(/<body([^>]*)>/, `<body$1>${banner}`);
  // 함수로 바꿔 넣습니다. 문자열로 넣으면 스크립트 안의 "$&" 같은 글자를 바꾸기 기호로 읽어 코드가 깨집니다(2026-10-27 검수에서 발견).
  const tail = `${helper}${tails.map((c) => `<script>${c}</script>`).join('')}</body>`;
  html = html.replace('</body>', () => tail);
  await writeFile(file, html);
}

// 페이지 안에 묶어 넣었으니 원래 스크립트 파일은 지웁니다(남겨 두면 헷갈림).
for (const js of (await walk(join(site, '_astro'))).filter((f) => f.endsWith('.js'))) await rm(js);

// CSS 안의 절대 주소도 상대 주소로 (있을 경우)
for (const css of (await walk(site)).filter((f) => f.endsWith('.css'))) {
  let s = await readFile(css, 'utf8');
  s = s.replace(/url\(\/(?!\/)([^)]+)\)/g, (_, p) => `url(${relPath(css, '/' + p)})`);
  await writeFile(css, s);
}

await writeFile(join(outRoot, '여기를 두 번 누르세요.html'),
  `<!doctype html><meta charset="utf-8"><meta http-equiv="refresh" content="0; url=site/index.html"><title>다정리 미리보기</title><p style="font:18px sans-serif;padding:24px">다정리 미리보기를 여는 중입니다. 열리지 않으면 <a href="site/index.html">여기</a>를 누르세요.</p>`);

console.log(`미리보기 완성: 페이지 ${files.length}개, 묶은 스크립트 ${bundles.size}개 → ${relative(root, outRoot)}`);
