/*
 * RSS 피드 만들기 (2026-11-17 추가) — https://dajeongri.com/rss.xml
 *
 * 왜: 네이버 서치어드바이저는 사이트맵과 함께 RSS 를 제출하면 새 글을 더 빨리 가져갑니다.
 *     (2026-11-17 확인 당시 네이버 검색에는 첫 화면 하나만 수집돼 있었음)
 *
 * 어떻게: 빌드가 끝나면 dist/sitemap.xml 의 주소마다 지어진 페이지(html)를 열어
 *   제목(<title>)과 설명(meta description)을 그대로 가져옵니다. 손으로 목록을 관리하지 않아도
 *   페이지를 더하면 사이트맵을 거쳐 RSS 에도 저절로 들어갑니다.
 *
 * 날짜: 각 글의 "처음 올린 날"은 src/data/rss-dates.json 에 있습니다.
 *   새 페이지를 만들면 빌드 뒤 `python3 tools/rss-dates.py` 로 날짜를 채워 함께 올리세요.
 *   날짜가 없는 페이지는 RSS 에서 빠지고 빌드 기록에 경고가 나옵니다(빌드는 멈추지 않음).
 *
 * pwa.mjs 보다 뒤에 두어 오프라인 저장 목록에는 넣지 않습니다(astro.config.mjs 순서).
 */
import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

// RSS 에 넣지 않을 주소
const SKIP = new Set(['/', '/privacy/']);

const unescape = (s) => s.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
// 'YYYY-MM-DD' → 'Tue, 27 Oct 2026 09:00:00 +0900' (한국 시각 오전 9시로 둡니다)
const rfc822 = (d) => {
  const [y, m, dd] = d.split('-').map(Number);
  const wd = new Date(Date.UTC(y, m - 1, dd)).getUTCDay();
  return `${DAYS[wd]}, ${String(dd).padStart(2, '0')} ${MONTHS[m - 1]} ${y} 09:00:00 +0900`;
};
const nowKst = () => {
  const t = new Date(Date.now() + 9 * 3600e3);
  const p = (n) => String(n).padStart(2, '0');
  return `${DAYS[t.getUTCDay()]}, ${p(t.getUTCDate())} ${MONTHS[t.getUTCMonth()]} ${t.getUTCFullYear()} ${p(t.getUTCHours())}:${p(t.getUTCMinutes())}:${p(t.getUTCSeconds())} +0900`;
};

export default function rss() {
  return {
    name: 'dajeongri-rss',
    hooks: {
      'astro:build:done': async ({ dir, logger }) => {
        const dist = fileURLToPath(dir);
        const root = join(dist, '..');
        const sitemap = await readFile(join(dist, 'sitemap.xml'), 'utf8');
        const dates = JSON.parse(await readFile(join(root, 'src', 'data', 'rss-dates.json'), 'utf8'));
        const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
        const origin = new URL(urls[0]).origin;

        const page = async (path) => {
          const html = await readFile(join(dist, path, 'index.html'), 'utf8');
          const title = unescape((html.match(/<title>([^<]*)<\/title>/) || [])[1] || '').replace(/ \| 다정리$/, '').trim();
          const desc = unescape((html.match(/<meta name="description" content="([^"]*)"/) || [])[1] || '').trim();
          return { title, desc };
        };

        const home = await page('/');
        const items = [];
        const missing = [];
        for (const url of urls) {
          const path = new URL(url).pathname;
          if (SKIP.has(path)) continue;
          if (!dates[path]) { missing.push(path); continue; }
          const { title, desc } = await page(path);
          items.push({ url, title, desc, date: dates[path] });
        }
        // 새 글이 위로 (같은 날이면 사이트맵 순서)
        items.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));

        const body = items.map((it) => [
          '    <item>',
          `      <title>${esc(it.title)}</title>`,
          `      <link>${esc(it.url)}</link>`,
          `      <guid isPermaLink="true">${esc(it.url)}</guid>`,
          `      <description>${esc(it.desc)}</description>`,
          `      <pubDate>${rfc822(it.date)}</pubDate>`,
          '    </item>',
        ].join('\n')).join('\n');

        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>다정리</title>
    <link>${origin}/</link>
    <atom:link href="${origin}/rss.xml" rel="self" type="application/rss+xml" />
    <description>${esc(home.desc)}</description>
    <language>ko</language>
    <lastBuildDate>${nowKst()}</lastBuildDate>
${body}
  </channel>
</rss>
`;
        await writeFile(join(dist, 'rss.xml'), xml, 'utf8');
        logger.info(`rss.xml 생성: 글 ${items.length}개`);
        if (missing.length) logger.warn(`날짜 없음(RSS 에서 뺌) — python3 tools/rss-dates.py 로 채우세요: ${missing.join(' ')}`);
      },
    },
  };
}
