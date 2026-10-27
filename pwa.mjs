/*
 * 웹앱(PWA) 오프라인 파일 목록 만들기.
 *
 * 사이트를 다 지은 뒤(빌드 끝) dist 폴더의 파일 목록을 읽어 dist/sw.js 를
 * 만듭니다. sw.js 는 휴대폰에 사이트 파일을 저장해 두었다가, 인터넷이
 * 끊겨도 작성기·체크리스트·가이드가 열리게 해 주는 작은 프로그램입니다.
 *
 * 왜 빌드 때 만드나:
 *   아스트로는 빌드할 때마다 스크립트 파일 이름 뒤에 무작위 꼬리를 붙입니다
 *   (예: note-docx.Bw1O0kFQ.js). 손으로 목록을 적어 두면 다음 빌드에서
 *   이름이 바뀌어 오프라인이 깨집니다. 그래서 매번 실제 파일을 읽어 씁니다.
 *
 * 무엇을 저장하나: 사이트 파일(페이지, 글꼴 제외 스크립트·스타일, 아이콘)뿐입니다.
 * 사용자가 쓴 내용은 저장하지 않습니다.
 */
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join, relative, sep } from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';

async function walk(dir) {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(p)));
    else out.push(p);
  }
  return out;
}

// 오프라인에 필요 없는 파일. 공유 썸네일과 검색엔진용 파일은 빼서 용량을 줄입니다.
const SKIP = new Set(['og.png', 'robots.txt', 'sitemap.xml', 'sw.js', 'favicon.ico', '404.html']);

export default function pwa() {
  return {
    name: 'dajeongri-pwa',
    hooks: {
      'astro:build:done': async ({ dir, logger }) => {
        const root = fileURLToPath(dir);
        const files = (await walk(root)).map((f) => relative(root, f).split(sep).join('/'));
        const urls = [];
        const hash = createHash('sha256');
        for (const f of files.sort()) {
          if (SKIP.has(f)) continue;
          // 글꼴 조각(약 90개, 3MB)은 미리 받지 않습니다. 페이지가 실제로 쓰는 조각만 그때그때 저장됩니다.
          if (f.startsWith('fonts/')) continue;
          // 페이지는 /note/index.html → /note/ 처럼 실제 주소로 저장합니다.
          const url = f === 'index.html' ? '/' : f.endsWith('/index.html') ? '/' + f.slice(0, -'index.html'.length) : '/' + f;
          urls.push(url);
          hash.update(url);
          hash.update(await readFile(join(root, f)));
        }
        const version = hash.digest('hex').slice(0, 12);
        const template = await readFile(new URL('./src/sw-template.js', import.meta.url), 'utf8');
        const sw = template
          .replace('__VERSION__', version)
          .replace('__PRECACHE__', JSON.stringify(urls, null, 2));
        await writeFile(join(root, 'sw.js'), sw);
        logger.info(`sw.js 생성: 파일 ${urls.length}개, 버전 ${version}`);
      },
    },
  };
}
