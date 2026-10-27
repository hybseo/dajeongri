/*
 * 사이트 검색용 색인 만들기 (2026-10-28 추가).
 *
 * 사이트를 다 지은 뒤(빌드 끝) dist 폴더의 페이지(html)를 읽어
 * dist/search-index.json 을 만듭니다. 검색 화면(/search/)은 이 파일 하나만 받아
 * 휴대폰·PC 안에서 검색합니다. 검색할 때 서버에 묻지 않으므로 인터넷이 끊겨도 됩니다.
 *
 * 왜 빌드 때 만드나: 글을 고치면 다음 빌드에서 색인도 저절로 새로 만들어집니다.
 * 손으로 목록을 관리하지 않아도 됩니다.
 *
 * 무엇을 넣나: 각 페이지의 제목, 설명, 본문(<main>)을 소제목 단위로 나눈 글.
 * 빼는 것: 머리말·꼬리말·메뉴, 출처 목록, "함께 쓰면 좋은 도구" 같은 반복 묶음(data-nosearch),
 *          버튼·선택칸 글자, 숨겨 둔 칸(hidden), 스크립트.
 *
 * 소제목으로 바로 가는 주소(#...) 규칙은 화면 쪽과 같아야 합니다.
 *   1) 소제목에 id 가 있으면 그 id
 *   2) 엔딩노트처럼 [data-section] 안의 소제목이면 그 값 (/note/#bank)
 *   3) 가이드 본문([data-guide-body])의 h2 는 Guide.astro 가 붙이는 s1, s2 … (id 없을 때)
 *   4) 자주 묻는 질문은 질문 칸(details)의 id
 * pwa.mjs 보다 먼저 실행되어야 오프라인 저장 목록에 색인이 들어갑니다(astro.config.mjs 순서).
 */
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { fromHtml } from 'hast-util-from-html';

async function walk(dir) {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(p)));
    else if (e.name.endsWith('.html')) out.push(p);
  }
  return out;
}

// 검색 결과에 나오지 않을 페이지
const SKIP_PAGES = new Set(['/', '/404.html', '/offline/', '/search/']);
// 글자를 모으지 않을 태그
const SKIP_TAGS = new Set(['script', 'style', 'svg', 'noscript', 'template', 'button', 'select', 'option', 'textarea', 'input', 'header', 'footer', 'nav', 'img']);
// 덩어리(줄)를 나누는 태그: 사이에 띄어쓰기를 넣습니다.
const BLOCK = new Set(['p', 'li', 'div', 'section', 'article', 'td', 'th', 'tr', 'dt', 'dd', 'br', 'h1', 'h2', 'h3', 'h4', 'summary', 'details', 'ol', 'ul', 'table', 'label', 'span', 'b', 'small', 'a']);

const cls = (n) => {
  const c = n.properties?.className;
  return Array.isArray(c) ? c : [];
};
const skipNode = (n) =>
  n.type === 'element' && (
    SKIP_TAGS.has(n.tagName) ||
    n.properties?.hidden !== undefined && n.properties?.hidden !== false ||
    n.properties?.dataNosearch !== undefined ||
    n.properties?.ariaHidden === 'true' ||
    cls(n).some((c) => ['sources', 'badges', 'crumb', 'share-row', 'toc', 'sr', 'skip', 'sec-no'].includes(c))
  );

const textOf = (n) => {
  if (n.type === 'text') return n.value;
  if (n.type !== 'element' || skipNode(n)) return '';
  return (n.children || []).map(textOf).join(BLOCK.has(n.tagName) ? ' ' : '');
};
const squash = (s) => s.replace(/\s+/g, ' ').trim();

function find(n, pred) {
  if (pred(n)) return n;
  for (const c of n.children || []) { const r = find(c, pred); if (r) return r; }
  return null;
}

function group(url) {
  if (url.startsWith('/guide/')) return '정리 가이드';
  if (url.startsWith('/after/')) return '떠나보낸 뒤';
  if (url.startsWith('/start/') || url === '/check/') return '처음 오셨나요';
  if (url.startsWith('/tools/') || url === '/note/' || url === '/checklist/') return '정리 도구';
  return '다정리 안내';
}

function indexPage(html, url) {
  const tree = fromHtml(html);
  const titleEl = find(tree, (n) => n.tagName === 'title');
  const title = squash(textOf(titleEl || { type: 'text', value: '' })).replace(/\s*\|\s*다정리$/, '');
  const metaDesc = find(tree, (n) => n.tagName === 'meta' && n.properties?.name === 'description');
  const desc = metaDesc?.properties?.content || '';
  const robots = find(tree, (n) => n.tagName === 'meta' && n.properties?.name === 'robots');
  if (String(robots?.properties?.content || '').includes('noindex')) return null;
  const main = find(tree, (n) => n.tagName === 'main');
  if (!main) return null;

  const sections = [];
  let cur = { a: '', h: '', parts: [] };
  const push = () => {
    const t = squash(cur.parts.join(' '));
    if (t || cur.h) sections.push([cur.a, cur.h, t]);
  };
  let guideH2 = 0;

  // 문서 순서대로 걸어 가며 소제목을 만나면 새 칸을 시작합니다.
  function visit(n, ctx) {
    if (n.type === 'text') { cur.parts.push(n.value); return; }
    if (n.type !== 'element' || skipNode(n)) return;
    const next = { ...ctx };
    if (n.properties?.dataGuideBody !== undefined) next.guide = true;
    if (n.properties?.dataSection) next.section = n.properties.dataSection;
    if (n.tagName === 'details' && n.properties?.id) next.details = n.properties.id;
    next.detailsSelf = n.tagName === 'details' && !!n.properties?.id;

    // 접었다 펴는 칸(summary)은 자주 묻는 질문처럼 칸에 id 가 있을 때만 소제목으로 봅니다.
    const isHead = n.tagName === 'h2' || n.tagName === 'h3' || (n.tagName === 'summary' && !!ctx.detailsSelf);
    if (isHead) {
      push();
      let a = n.properties?.id || '';
      if (!a && n.tagName === 'h2' && next.guide) a = `s${guideH2 + 1}`;
      if (!a && next.section) a = next.section;
      if (!a && n.tagName === 'summary' && next.details) a = next.details;
      // h3 처럼 id 가 없는 작은 소제목은 바로 위 소제목의 주소를 이어 씁니다.
      if (!a && n.tagName === 'h3') a = cur.a;
      if (n.tagName === 'h2' && next.guide) guideH2++;
      cur = { a, h: squash(textOf(n)).replace(/^\d+\.?\s+/, ''), parts: [] };
      return;
    }
    if (n.tagName === 'h1') return; // 제목은 따로 둡니다.
    const block = BLOCK.has(n.tagName);
    if (block) cur.parts.push(' ');
    for (const c of n.children || []) visit(c, next);
    if (block) cur.parts.push(' ');
  }
  visit(main, {});
  push();
  return { u: url, t: title, d: desc, g: group(url), s: sections.filter((s) => s[1] || s[2].length > 1) };
}

export default function searchIndex() {
  return {
    name: 'dajeongri-search-index',
    hooks: {
      'astro:build:done': async ({ dir, logger }) => {
        const root = fileURLToPath(dir);
        const pages = [];
        for (const f of (await walk(root)).sort()) {
          const rel = relative(root, f).split(sep).join('/');
          const url = rel === 'index.html' ? '/' : rel.endsWith('/index.html') ? '/' + rel.slice(0, -'index.html'.length) : '/' + rel;
          if (SKIP_PAGES.has(url)) continue;
          const p = indexPage(await readFile(f, 'utf8'), url);
          if (p) pages.push(p);
        }
        const json = JSON.stringify({ v: 1, pages });
        await writeFile(join(root, 'search-index.json'), json);
        logger.info(`search-index.json 생성: 페이지 ${pages.length}개, ${Math.round(json.length / 1024)}KB`);
      },
    },
  };
}
