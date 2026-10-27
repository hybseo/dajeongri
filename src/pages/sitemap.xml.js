/*
 * 사이트맵 (검색엔진 제출용).
 *
 * 전체 주소가 들어가야 해서 astro.config.mjs 의 site 값이 비어 있는 동안에는
 * 빈 목록을 내보냅니다. 도메인을 확정해 site 를 채우면 아래 페이지가 모두 들어갑니다.
 * 페이지 목록은 데이터에서 자동으로 모으므로, 원고 페이지를 더하면 함께 늘어납니다.
 */
import { guides } from '../data/guides.js';
import content from '../data/content.json';

const fixed = ['/', '/checklist/', '/note/', '/tools/deadlines/', '/tools/obituary/', '/tools/after-checklist/', '/tools/print/',
  '/guide/', '/faq/', '/links/', '/app/', '/privacy/'];
const fromContent = content.pages.filter((p) => p.id !== 'start-after').map((p) => p.url);
const fromGuides = guides.map((g) => `/guide/${g.slug}/`);
const paths = [...new Set([...fixed, ...fromContent, ...fromGuides])];

export function GET({ site }) {
  const base = site ? site.href.replace(/\/$/, '') : '';
  const urls = base ? paths.map((p) => `  <url><loc>${base}${p}</loc></url>`).join('\n') : '';
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}
