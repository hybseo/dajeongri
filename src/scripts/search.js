/*
 * 사이트 검색 (2026-10-28 추가).
 *
 * 빌드 때 만든 /search-index.json(search-index.mjs 참고)을 받아 이 기기 안에서 찾습니다.
 * 서버에 검색어를 묻지 않습니다.
 *
 * 한국어에 맞춘 점
 *   - 띄어쓰기를 무시하고 비교합니다. "상속 포기"로 찾아도 "상속포기"가 나옵니다.
 *   - 낱말 끝의 조사(은·는·이·가·을·를·에서 …)를 뗀 형태로도 찾습니다. "상속포기를" → "상속포기"
 *   - 비슷한 말을 함께 찾습니다(SYNONYMS). "코인" → "가상자산"
 * 여러 낱말을 넣으면 모든 낱말이 한 페이지 안에 있는 결과만 보여 줍니다.
 */

/* 검색칸 아래 "자주 찾는 말" 버튼. 검색어 통계를 보고 바꿔 주세요. */
export const POPULAR = ['사망신고', '안심상속', '상속포기', '상속세', '장례 비용', '유언장', '사망보험금', '연명의료'];

/* 비슷한 말 묶음. 한 묶음 안의 말은 서로 같은 뜻으로 찾습니다. 한 글자 말은 넣지 않습니다(너무 많이 걸림). */
export const SYNONYMS = [
  ['빚', '채무', '부채', '대출', '빌린 돈'],
  ['코인', '가상자산', '암호화폐', '비트코인'],
  ['보험금', '사망보험금'],
  ['장례식', '장례'],
  ['납골당', '봉안당', '봉안'],
  ['수목장', '자연장'],
  ['묘지', '산소', '분묘'],
  ['연명치료', '연명의료'],
  ['장기기증', '장기·인체조직 기증', '인체조직 기증'],
  ['호스피스', '완화의료'],
  ['상조', '상조회사', '선불식 할부거래'],
  ['휴대폰', '핸드폰', '스마트폰', '휴대전화'],
  ['카톡', '카카오톡'],
  ['통장', '계좌', '예금'],
  ['세금', '상속세', '취득세', '국세', '지방세'],
  ['부모님', '부모'],
  ['아버지', '어머니', '부모님', '부모', '가족'],
  ['돌아가시면', '돌아가신', '돌아가셨', '사망', '떠나보낸', '세상을 떠난'],
  ['해야할일', '해야 할 일', '할 일', '할일'],
  ['이장', '개장', '묘 정리'],
  ['독거', '혼자 사는', '혼자 지내는', '1인 가구'],
  ['치매', '후견', '성년후견'],
  ['유품', '유품정리', '유품 정리'],
  ['엔딩노트', '엔딩 노트'],
  ['편지', '남기는 말'],
  ['부동산', '주택', '아파트', '토지'],
  ['자동차', '차량'],
  ['교통사고', '사고'],
  ['산재', '산업재해'],
  ['유언장', '유언'],
  ['사망신고', '사망 신고'],
  ['부고', '부고 문자'],
  ['안심상속', '원스톱서비스', '재산 조회'],
];

// 낱말 끝에 붙는 조사. 긴 것부터 확인합니다.
const JOSA = ['에서는', '에게서', '으로는', '이라도', '에서', '에게', '한테', '께서', '으로', '이랑', '하고', '까지', '부터', '보다', '처럼', '이나', '은', '는', '이', '가', '을', '를', '에', '의', '로', '와', '과', '도', '만', '랑', '나'];

export const ns = (s) => String(s).toLowerCase().replace(/\s+/g, '');

/** 조사를 뗀 형태. 남는 글자가 두 글자 이상일 때만 뗍니다. */
export function stripJosa(w) {
  for (const j of JOSA) {
    if (w.length - j.length >= 2 && w.endsWith(j)) return w.slice(0, -j.length);
  }
  return w;
}

/** 검색어 → 낱말마다 "이 중 하나만 있으면 됨" 목록(띄어쓰기 없는 형태) */
export function parseQuery(q) {
  const raw = String(q || '').trim().replace(/[^\p{L}\p{N}\s·-]/gu, ' ');
  const words = raw.split(/\s+/).filter(Boolean).slice(0, 8);
  const whole = ns(raw);
  // 낱말로 쪼개기 전에, 띄어 쓴 말이 비슷한 말 묶음에 통째로 있으면 한 낱말로 봅니다("사망 신고").
  const terms = [];
  const used = new Set();
  for (const group of SYNONYMS) {
    const hit = group.find((g) => g.includes(' ') && whole.includes(ns(g)));
    if (hit && words.length > 1) {
      terms.push(new Set(group.map(ns)));
      hit.split(/\s+/).forEach((p) => used.add(p));
    }
  }
  for (const w of words) {
    if (used.has(w)) continue;
    const alts = new Set([ns(w)]);
    const base = stripJosa(w);
    alts.add(ns(base));
    for (const group of SYNONYMS) {
      if (group.some((g) => ns(g) === ns(w) || ns(g) === ns(base))) group.forEach((g) => alts.add(ns(g)));
    }
    // 한 글자 낱말은 그대로 두되(예: "빚"), 비어 있으면 뺍니다.
    // 한 글자 낱말은 한글(예: "빚")만 씁니다. 영문 한 글자 등은 너무 많이 걸려 뺍니다.
    const list = [...alts].filter((a) => a.length > 1 || /[가-힣]/.test(a));
    if (list.length) terms.push(new Set(list));
  }
  // 띄어 쓴 말을 붙인 형태("상속 포기를" → "상속포기")도 한 덩어리로 찾아 더 앞에 둡니다.
  const phrases = words.length > 1 ? [...new Set([whole, ns(words.slice(0, -1).join('') + stripJosa(words[words.length - 1]))])] : [];
  return { terms, whole, raw, phrases };
}

/** 색인을 검색하기 좋게 한 번만 가공합니다. */
export function prepare(index) {
  return index.pages.map((p) => ({
    ...p,
    tN: ns(p.t), dN: ns(p.d),
    sN: p.s.map(([a, h, t]) => ({ a, h, t, hN: ns(h), tN: ns(t) })),
  }));
}

const count = (hay, needle) => {
  if (!needle) return 0;
  let n = 0, i = hay.indexOf(needle);
  while (i !== -1 && n < 20) { n++; i = hay.indexOf(needle, i + needle.length); }
  return n;
};
const best = (hay, alts) => { let m = 0; for (const a of alts) m = Math.max(m, count(hay, a)); return m; };

// 목록만 모아 둔 페이지는 덜 앞에 둡니다.
const HUB = new Set(['/guide/', '/tools/', '/start/', '/after/']);

/**
 * @returns [{ page, score, hits: [{a, h, snippet}] }]
 */
export function search(prepared, q, limit = 30) {
  const parsed = parseQuery(q);
  const { whole, phrases } = parsed;
  // 숫자만 있는 낱말(금액, 전화번호 등)은 찾는 데 쓰지 않습니다.
  const terms = parsed.terms.filter((alts) => [...alts].some((a) => /[^\d\-.,#]/.test(a)));
  const hasPhrase = (h) => phrases.some((ph) => ph.length > 1 && h.includes(ph));
  if (!terms.length) return [];
  const all = (p) => (p._all ??= p.tN + ' ' + p.dN + ' ' + p.sN.map((s) => s.hN + s.tN).join(' '));
  const has = (h, alts) => [...alts].some((a) => h.includes(a));
  // 거의 모든 페이지에 나오는 말("정리" 등)은 덜 중요하게, 드문 말은 더 중요하게 셉니다.
  const N = prepared.length;
  const dfs = terms.map((alts) => prepared.filter((p) => has(all(p), alts)).length);
  const weight = dfs.map((df) => Math.min(1, Math.max(0.15, Math.log((N + 1) / (df + 0.5)) / Math.log(N + 1))));
  // 절반이 넘는 페이지에 나오는 흔한 말(예: "정리")은 꼭 있어야 하는 말에서 뺍니다. 다 흔하면 모두 필요.
  let need = terms.map((_, i) => dfs[i] <= N * 0.5);
  if (!need.some(Boolean)) need = terms.map(() => true);
  const needCount = need.filter(Boolean).length;
  const out = [];
  for (const p of prepared) {
    // 기본은 모든 낱말이 페이지 어딘가(제목·설명·본문)에 있어야 합니다.
    const matched = terms.filter((alts, i) => need[i] && has(all(p), alts)).length;
    if (!matched) continue;
    let score = 0;
    terms.forEach((alts, i) => {
      if (has(p.tN, alts)) score += 12 * weight[i];
      if (has(p.dN, alts)) score += 3 * weight[i];
    });
    if ((whole.length > 1 && p.tN.includes(whole)) || hasPhrase(p.tN)) score += 10;
    const secs = p.sN.map((s) => {
      let v = 0;
      terms.forEach((alts, i) => {
        if (has(s.hN, alts)) v += 6 * weight[i];
        v += Math.min(best(s.tN, alts), 5) * weight[i];
      });
      if (hasPhrase(s.hN) || hasPhrase(s.tN)) v += 8;
      return { s, v };
    }).filter((x) => x.v > 0).sort((a, b) => b.v - a.v);
    score += (secs[0]?.v || 0) + secs.slice(1, 4).reduce((n, x) => n + x.v * 0.25, 0);
    if (HUB.has(p.u)) score *= 0.6;
    out.push({ page: p, score, matched, hits: secs.slice(0, 2).map((x) => ({ a: x.s.a, h: x.s.h, snippet: snippet(x.s.t, terms, phrases) })) });
  }
  const strict = out.filter((r) => r.matched === needCount);
  if (strict.length || needCount === 1) return strict.sort((a, b) => b.score - a.score).slice(0, limit);
  // 모든 낱말이 들어간 글이 없으면, 낱말이 많이 들어간 글부터 보여 줍니다(화면에 "일부 낱말" 안내).
  const loose = out.sort((a, b) => b.matched - a.matched || b.score - a.score).slice(0, limit);
  loose.partial = true;
  return loose;
}

/** 찾은 말 앞뒤로 글을 잘라 보여 줄 조각. 찾은 말은 [[ ]]로 표시해 두고 화면에서 강조합니다. */
export function snippet(text, terms, phrases = [], before = 34, after = 86) {
  const flat = [...new Set([...phrases.filter((x) => x.length > 1), ...terms.flatMap((t) => [...t]).sort((a, b) => b.length - a.length)])].filter((a) => a.length >= 1);
  // 띄어쓰기 무시 비교를 위해, 글자 위치 지도(띄어쓰기 뺀 위치 → 원래 위치)를 만듭니다.
  const map = []; let flatText = '';
  for (let i = 0; i < text.length; i++) if (!/\s/.test(text[i])) { map.push(i); flatText += text[i].toLowerCase(); }
  const marks = [];
  for (const a of flat) {
    let i = flatText.indexOf(a);
    while (i !== -1 && marks.length < 12) {
      const s = map[i], e = map[i + a.length - 1] + 1;
      if (!marks.some(([ms, me]) => s < me && e > ms)) marks.push([s, e, phrases.includes(a)]);
      i = flatText.indexOf(a, i + a.length);
    }
  }
  // 붙인 형태(phrases)가 찾아졌으면 그 자리를, 아니면 처음 찾은 자리를 중심으로 자릅니다.
  const focus = marks.find((m) => m[2]) || marks.slice().sort((x, y) => x[0] - y[0])[0];
  marks.sort((x, y) => x[0] - y[0]);
  const at = focus ? focus[0] : 0;
  const start = Math.max(0, at - before);
  const end = Math.min(text.length, at + after);
  let s = start;
  // 낱말 중간에서 자르지 않도록 띄어쓰기에 맞춥니다.
  if (s > 0) { const sp = text.indexOf(' ', s); if (sp !== -1 && sp < at) s = sp + 1; }
  let e = end;
  if (e < text.length) { const sp = text.lastIndexOf(' ', e); if (sp > s + 20) e = sp; }
  let res = '';
  let pos = s;
  for (const [ms, me] of marks) {
    if (me <= s || ms >= e) continue;
    res += text.slice(pos, Math.max(pos, ms)) + '[[' + text.slice(Math.max(ms, pos), Math.min(me, e)) + ']]';
    pos = Math.min(me, e);
  }
  res += text.slice(pos, e);
  return (s > 0 ? '… ' : '') + res.trim() + (e < text.length ? ' …' : '');
}

/** 통계로 보낼 검색어: 숫자와 메일 주소처럼 개인을 알아볼 수 있는 부분을 지웁니다. */
export function maskTerm(q) {
  return String(q || '')
    .replace(/\S+@\S+/g, '(메일)')
    .replace(/\d/g, '#')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 60);
}
