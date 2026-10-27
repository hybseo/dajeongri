/*
 * 앱 아이콘·파비콘·공유 썸네일(og.png) 만들기 (2026-10-27 개편 로고).
 *   node tools/make-icons.mjs
 * 로고: 남색 둥근 공책 + 흰 줄 3개 + 호박색 점. 머리말 로고(src/layouts/Base.astro)와 같은 모양입니다.
 * 공유 썸네일은 첫 화면 식탁 그림(public/illust/hero-table.svg)과 카피로 만듭니다.
 */
import { createRequire } from 'node:module';
const { chromium } = createRequire(import.meta.url)('playwright'); // 작업 컴퓨터에 설치된 playwright 사용 (사이트 빌드에는 쓰지 않음)
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const pub = join(root, 'public');
const mark = (pad = 0) => {
  const s = 64 - pad * 2;
  const k = s / 64;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect x="${pad}" y="${pad}" width="${s}" height="${s}" rx="${14 * k}" fill="#1E3A5A"/>
  <path d="M${pad + 18 * k} ${pad + 24 * k}h${28 * k}M${pad + 18 * k} ${pad + 34 * k}h${28 * k}M${pad + 18 * k} ${pad + 44 * k}h${16 * k}" stroke="#fff" stroke-width="${5 * k}" stroke-linecap="round"/>
  <circle cx="${pad + 50 * k}" cy="${pad + 14 * k}" r="${7.5 * k}" fill="#E8A13A"/>
</svg>`;
};
await writeFile(join(pub, 'favicon.svg'), mark(0));

const b = await chromium.launch();
const page = await b.newPage();
async function png(svg, size, out, bg = 'transparent') {
  await page.setViewportSize({ width: size, height: size });
  await page.setContent(`<html><body style="margin:0;background:${bg}">${svg.replace('<svg ', `<svg width="${size}" height="${size}" `)}</body></html>`);
  await page.screenshot({ path: join(pub, out), omitBackground: bg === 'transparent' });
}
await png(mark(0), 192, 'icon-192.png');
await png(mark(0), 512, 'icon-512.png');
await png(mark(0), 180, 'apple-touch-icon.png', '#ffffff');
// 마스커블: 가장자리가 잘려도 되도록 바탕을 꽉 채우고 안쪽에 로고
await png(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" fill="#1E3A5A"/><g transform="translate(12 12) scale(0.625)">${mark(0).replace(/<\/?svg[^>]*>/g, '').replace('fill="#1E3A5A"', 'fill="#1E3A5A"')}</g></svg>`, 512, 'icon-maskable-512.png');
await png(mark(0), 48, 'favicon-48.png');

// 공유 썸네일 1200x630
const hero = await readFile(join(pub, 'illust', 'hero-table.svg'), 'utf8');
const fontCss = await readFile(join(pub, 'fonts', 'pretendard', 'pretendard.css'), 'utf8');
await page.setViewportSize({ width: 1200, height: 630 });
await page.setContent(`<html><head><style>${fontCss.replaceAll('url(/fonts/', `url(file://${pub}/fonts/`)}
body{margin:0;width:1200px;height:630px;background:#fff;font-family:'Pretendard Variable';display:grid;grid-template-columns:560px 640px;align-items:center;overflow:hidden}
.t{padding:0 0 0 72px}.lg{display:flex;align-items:center;gap:14px;font-weight:800;font-size:40px;color:#1E3A5A;letter-spacing:-.04em;margin-bottom:40px}
h1{font-size:62px;line-height:1.24;letter-spacing:-.05em;margin:0;color:#16212c;font-weight:800}h1 span{color:#2C5282}
p{font-size:23px;color:#5b6876;margin:28px 0 0}.w{background:#FFF4E6;height:630px;display:flex;align-items:flex-end}.w svg{width:640px;height:auto}
</style></head><body><div class="t"><div class="lg">${mark(0).replace('<svg ', '<svg width="52" height="52" ')}다정리</div>
<h1>남은 사람이<br>헤매지 않도록,<br><span>지금 다정하게</span><br>정리해 두세요</h1><p>무료 엔딩노트 · 3분 진단 · 기한 계산기</p></div><div class="w">${hero}</div></body></html>`);
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(300);
await page.screenshot({ path: join(pub, 'og.png') });
await b.close();
console.log('아이콘·썸네일 완료');
