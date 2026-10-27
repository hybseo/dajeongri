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
  ['아버지', '어머니', '엄마', '아빠', '부모님', '부모', '가족'],
  ['자식', '자녀', '아들', '딸'],
  ['돌아가시면', '돌아가신', '돌아가셨', '사망', '떠나보낸', '세상을 떠난'],
  ['해야할일', '해야 할 일', '할 일', '할일'],
  ['이장', '개장', '묘 정리'],
  ['독거', '혼자 사는', '혼자 지내는', '1인 가구'],
  ['공영장례', '무연고'],
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
  ['기간', '기한', '마감'],
  ['명의 변경', '명의 이전', '상속등기'],
  ['맡길', '맡을', '맡아'],
  ['글씨', '글자'],
  ['워드', 'word'],
  ['인출', '찾아 쓰', '꺼내 쓰'],
  ['정지', '해지', '중지'],
  ['장제비', '장례비', '장제급여'],
  ['무빈소', '빈소 없이', '가족장'],
  ['간소', '작은 장례', '가족장'],
  ['바다장', '해양장', '산분장'],
  ['반려견', '반려동물', '반려묘', '강아지', '고양이'],
  ['샘플', '예시', '양식', '견본'],
  ['설득', '말 꺼내', '이야기 꺼내', '꺼낼', '꺼내'],
  ['짐', '부담'],
  ['싫어하', '싫어', '원하지 않', '거부'],
  ['사전증여', '증여'],
  ['분할', '나누', '나눌'],
  ['분쟁', '다툼'],
  ['같이 산', '함께 산', '같이 살', '함께 살', '동거'],
  ['풀기', '해제', '열기'],
  ['아이폰', 'iphone'],
  ['사과', '미안'],
  ['기부', '기증', '나눔'],
  ['손주', '손자', '손녀', '손자녀'],
  ['인터넷 없이', '오프라인', '인터넷이 없어도', '인터넷이 끊겨도'],
];

/* 찾는 데 꼭 필요하지 않은 말(있으면 점수에 조금 보탬). 다 이런 말뿐이면 그대로 찾습니다. */
const OPTIONAL = new Set(['방법', '하는법', '쓰는법', '어떻게', '어디서', '어디', '언제', '얼마', '얼마나', '무엇', '뭐', '뭔가요',
  '하나요', '해야', '해야하나', '되나요', '있나요', '알려줘', '알려주세요', '싶어', '싶어요', '싶다', '좀', '제일', '먼저', '관련',
  '정보', '문의', '뜻', '의미', '몇', '장', '개', '번', '명', '한', '채', '어제', '오늘', '방금', '지금', '모르겠어요', '모르겠다', '모름', '부터', '뭐부터', '무엇부터', '어디부터', '법', '쓰는', '하는', '쓰기', '안', '못', '잘', '다', '더', '꼭', '미리', '준비', '하려면', '받고', '되게', '안되게', '어떡해',
  '어떡하나요', '좋은', '있어요', '없어요', '했어요', '해요', '합니다', '주세요', '들', '것', '수', '때', '경우', '하면', '하기']);

// 낱말 끝에 붙는 조사. 긴 것부터 확인합니다.
const JOSA = ['에서는', '에게서', '으로는', '이라도', '에서', '에게', '한테', '께서', '으로', '이랑', '하고', '까지', '부터', '보다', '처럼', '이나', '은', '는', '이', '가', '을', '를', '에', '의', '로', '와', '과', '도', '만', '랑', '나', '간'];
// 말끝(어미). "돌아가셨어요" → "돌아가셨"
const ENDING = ['었어요', '았어요', '셨어요', '셨는데', '습니다', '어요', '아요', '에요', '예요', '해요', '세요', '나요', '까요', '는데', '니다', '시면', '려면', '어서', '아서', '으면', '인지', '하게', '하는', '하고', '하지', '면'];

export const ns = (s) => String(s).toLowerCase().replace(/\s+/g, '');

/** 조사를 뗀 형태. 남는 글자가 두 글자 이상일 때만 뗍니다. "자식들한테" → "자식" */
export function stripJosa(w) {
  let r = w;
  for (const j of JOSA) {
    if (r.length - j.length >= 2 && r.endsWith(j)) { r = r.slice(0, -j.length); break; }
  }
  if (r.length >= 3 && r.endsWith('들')) r = r.slice(0, -1);
  return r;
}
const stripEnding = (w) => { for (const e of ENDING) if (w.length - e.length >= 2 && w.endsWith(e)) return w.slice(0, -e.length); return w; };

/**
 * 검색어 → 낱말 목록. 낱말마다 alts(이 중 하나만 있으면 됨, 띄어쓰기 없는 형태)와 optional(꼭 필요하지 않음)을 둡니다.
 * corpus: 색인 전체 글(띄어쓰기 없는 형태). 띄어 쓴 말을 붙였을 때 사이트에 있는 말이면 한 낱말로 봅니다("유언 장" → "유언장").
 */
export function parseQuery(q, corpus = '') {
  const raw = String(q || '').trim().replace(/[^\p{L}\p{N}\s·-]/gu, ' ');
  let words = raw.split(/\s+/).filter(Boolean).slice(0, 8);
  const whole = ns(raw);
  let joined = false;
  const joinedBase = words.length > 1 ? ns(words.slice(0, -1).join('') + stripJosa(words[words.length - 1])) : '';
  const synAll = new Set(SYNONYMS.flat().map(ns));
  if (words.length > 1 && joinedBase.length >= 3 && corpus) {
    const inHead = corpus.headings.includes(joinedBase) || synAll.has(joinedBase);
    const shortWord = words.some((w) => w.length === 1);
    if (inHead || (shortWord && corpus.text.includes(joinedBase))) { words = [joinedBase]; joined = true; }
  }
  const terms = [];
  const used = new Set();
  // 띄어 쓴 말이 비슷한 말 묶음에 통째로 있으면 한 낱말로 봅니다("사망 신고", "명의 변경").
  for (const group of SYNONYMS) {
    const hit = group.find((g) => g.includes(' ') && ns(words.join('')).includes(ns(g)));
    if (hit && words.length > 1) {
      terms.push({ alts: new Set(group.map(ns)), word: hit, optional: false });
      hit.split(/\s+/).forEach((p) => used.add(p));
    }
  }
  for (const w of words) {
    if (used.has(w) || used.has(stripJosa(w)) || [...used].some((u) => u.length >= 2 && w.startsWith(u))) continue;
    const cands = [...new Set([w, stripJosa(w), stripEnding(w), stripEnding(stripJosa(w))].map(ns))];
    const alts = new Set(cands);
    for (const group of SYNONYMS) {
      // 말끝을 떼고 남은 말이 묶음 안 낱말의 앞부분이어도 같은 묶음으로 봅니다. "돌아가셨어요" → "돌아가" → 돌아가신
      if (group.some((g) => cands.includes(ns(g)) || cands.some((c) => c.length >= 3 && ns(g).startsWith(c)))) group.forEach((g) => alts.add(ns(g)));
    }
    // 한 글자 낱말은 한글(예: "빚")만 씁니다. 영문 한 글자 등은 너무 많이 걸려 뺍니다.
    const list = [...alts].filter((a) => a.length > 1 || /[가-힣]/.test(a));
    if (!list.length) continue;
    // 숫자만 있는 낱말(금액, 전화번호 등)은 찾는 데 쓰지 않습니다.
    if (!list.some((a) => /[^\d\-.,#]/.test(a))) continue;
    terms.push({ alts: new Set(list), word: w, optional: cands.some((c) => OPTIONAL.has(c)) });
  }
  if (terms.length && terms.every((t) => t.optional)) terms.forEach((t) => { t.optional = false; });
  // 띄어 쓴 말을 붙인 형태("상속 포기를" → "상속포기")도 한 덩어리로 찾아 더 앞에 둡니다.
  const phrases = joinedBase && !joined ? [...new Set([whole, joinedBase])] : [];
  return { terms, whole, raw, phrases };
}

/** 색인을 검색하기 좋게 한 번만 가공합니다. 오타 고치기에 쓸 낱말 목록도 만듭니다. */
export function prepare(index) {
  const pages = index.pages.map((p) => ({
    ...p,
    tN: ns(p.t), dN: ns(p.d),
    sN: p.s.map(([a, h, t]) => ({ a, h, t, hN: ns(h), tN: ns(t) })),
  }));
  pages.forEach((p) => { p._all = p.tN + ' ' + p.dN + ' ' + p.sN.map((s) => s.hN + s.tN).join(' '); });
  const vocab = new Map();
  for (const p of index.pages) {
    for (const w of (p.t + ' ' + p.s.map((s) => s[1] + ' ' + s[2]).join(' ')).split(/[^가-힣a-z0-9]+/i)) {
      const b = stripJosa(w).toLowerCase();
      if (b.length >= 2 && /[가-힣]/.test(b)) vocab.set(b, (vocab.get(b) || 0) + 1);
    }
  }
  pages.vocab = vocab;
  pages.corpus = { text: pages.map((p) => p._all).join(' '), headings: pages.map((p) => p.tN + ' ' + p.sN.map((s) => s.hN).join(' ')).join(' ') };
  return pages;
}

/** 한 글자만 틀린 낱말 찾기(오타). 세 글자 이상에서, 한 글자의 자음·모음 하나만 다른 경우("상속포끼" → "상속포기"). */
const jamo = (c) => { const k = c.charCodeAt(0) - 0xac00; return k < 0 || k > 11171 ? null : [Math.floor(k / 588), Math.floor((k % 588) / 28), k % 28]; };
function oneJamo(a, b) {
  const x = jamo(a), y = jamo(b);
  if (!x || !y) return false;
  const diff = [0, 1, 2].filter((i) => x[i] !== y[i]);
  return diff.length === 1;
}
function fixTypo(word, vocab) {
  if (!vocab || word.length < 3 || !/^[가-힣]+$/.test(word)) return null;
  let best = null, bestN = 0;
  for (const [v, n] of vocab) {
    if (v.length !== word.length) continue;
    let d = 0, ok = true;
    for (let i = 0; i < v.length; i++) if (v[i] !== word[i]) { d++; if (d > 1 || !oneJamo(v[i], word[i])) { ok = false; break; } }
    if (ok && d === 1 && n > bestN) { best = v; bestN = n; }
  }
  return best;
}

const count = (hay, needle) => {
  if (!needle) return 0;
  let n = 0, i = hay.indexOf(needle);
  while (i !== -1 && n < 20) { n++; i = hay.indexOf(needle, i + needle.length); }
  return n;
};
const best = (hay, alts) => { let m = 0; for (const a of alts) m = Math.max(m, count(hay, a)); return m; };

/*
 * 추천 결과: 가족을 막 떠나보낸 분이 흔히 치는 말에는 날짜순 안내를 맨 앞에 둡니다.
 * test 는 검색어 원문(띄어쓰기 포함)에 대한 검사입니다.
 */
const PINS = [
  { test: (q) => /돌아가|떠나보|임종|별세|사망했/.test(q) && /어제|오늘|방금|지금|먼저|뭐부터|무엇부터|처음|당장/.test(q), url: '/after/first-days/', bonus: 20 },
  { test: (q) => /돌아가셨|떠나보냈|별세/.test(q), url: '/after/', bonus: 10 },
];

// 목록만 모아 둔 페이지는 덜 앞에 둡니다.
const HUB = new Set(['/guide/', '/tools/', '/start/']);

/**
 * @returns [{ page, score, hits: [{a, h, snippet}] }]
 *   결과 배열에 .partial(일부 낱말만 맞음), .corrected(오타를 고쳐 찾은 검색어)가 붙을 수 있습니다.
 */
export function search(prepared, q, limit = 30) {
  const parsed = parseQuery(q, prepared.corpus);
  const { whole, phrases } = parsed;
  let terms = parsed.terms;
  if (!terms.length) return [];
  const has = (h, alts) => [...alts].some((a) => h.includes(a));
  const N = prepared.length;
  let dfOf = (alts) => prepared.filter((p) => has(p._all, alts)).length;
  // 어디에도 없는 낱말은 한 글자 틀린 말(오타)인지 봅니다. "상속포끼" → "상속포기"
  let corrected = null;
  terms = terms.map((t) => {
    if (t.optional || dfOf(t.alts) > 0) return t;
    const fix = fixTypo(ns(stripJosa(t.word)), prepared.vocab);
    if (!fix) return t;
    corrected = (corrected || String(q).trim()).replace(stripJosa(t.word), fix);
    const alts = new Set([fix]);
    for (const group of SYNONYMS) if (group.some((g) => ns(g) === fix)) group.forEach((g) => alts.add(ns(g)));
    return { ...t, alts };
  });
  // 거의 모든 페이지에 나오는 말("정리" 등)은 덜 중요하게, 드문 말은 더 중요하게 셉니다.
  const dfs = terms.map((t) => dfOf(t.alts));
  const weight = dfs.map((df, i) => (terms[i].optional ? 0.1 : Math.min(1, Math.max(0.15, Math.log((N + 1) / (df + 0.5)) / Math.log(N + 1)))));
  // 꼭 있어야 하는 말: 흔한 말(절반이 넘는 페이지)과 OPTIONAL 낱말은 뺍니다. 다 빠지면 모두 필요.
  let need = terms.map((t, i) => !t.optional && dfs[i] <= N * 0.5);
  if (!need.some(Boolean)) need = terms.map((t) => !t.optional);
  if (!need.some(Boolean)) need = terms.map(() => true);
  const needCount = need.filter(Boolean).length;
  const hasPhrase = (h) => phrases.some((ph) => ph.length > 1 && h.includes(ph));
  const out = [];
  for (const p of prepared) {
    const hit = terms.map((t, i) => need[i] && has(p._all, t.alts));
    const matched = hit.filter(Boolean).length;
    if (!matched) continue;
    const matchedW = hit.reduce((n, h, i) => n + (h ? weight[i] : 0), 0);
    let score = 0;
    terms.forEach((t, i) => {
      if (has(p.tN, t.alts)) score += 12 * weight[i];
      if (has(p.dN, t.alts)) score += 3 * weight[i];
    });
    if ((whole.length > 1 && p.tN.includes(whole)) || hasPhrase(p.tN)) score += 10;
    const secs = p.sN.map((s) => {
      let v = 0, cover = 0;
      terms.forEach((t, i) => {
        const inH = has(s.hN, t.alts), inT = has(s.tN, t.alts);
        if (inH) v += 6 * weight[i];
        v += Math.min(best(s.tN, t.alts), 5) * weight[i];
        if (inH || inT) cover += weight[i];
      });
      if (hasPhrase(s.hN) || hasPhrase(s.tN)) v += 8;
      return { s, v, cover };
    }).filter((x) => x.v > 0)
      // 드문(중요한) 낱말이 들어간 소제목을 먼저 보여 줍니다. "코인 상속" → 가상자산이 나오는 칸
      .sort((a, b) => b.cover - a.cover || b.v - a.v);
    score += (secs[0]?.v || 0) + secs.slice(1, 4).reduce((n, x) => n + x.v * 0.25, 0);
    if (HUB.has(p.u)) score *= 0.6;
    for (const pin of PINS) if (pin.url === p.u && pin.test(String(q))) score += pin.bonus;
    // 강조는 꼭 필요한 낱말만, 드문(중요한) 낱말부터. 조각은 가장 드문 낱말이 나온 자리를 중심으로 자릅니다.
    const order = terms.map((t, i) => i).filter((i) => !terms[i].optional).sort((x, y) => weight[y] - weight[x]);
    const alts = order.map((i) => terms[i].alts);
    out.push({ page: p, score, matched, matchedW, hits: secs.slice(0, 2).map((x) => ({ a: x.s.a, h: x.s.h, snippet: snippet(x.s.t, alts, phrases) })) });
  }
  // 추천 결과 페이지가 낱말 조건에 걸려 빠졌어도 함께 보여 줍니다.
  for (const pin of PINS) {
    if (!pin.test(String(q))) continue;
    const have = out.find((r) => r.page.u === pin.url);
    if (have) { have.matched = needCount; have.matchedW = 99; continue; }
    const page = prepared.find((p) => p.u === pin.url);
    if (page) out.push({ page, score: pin.bonus, matched: needCount, matchedW: 99, hits: [] });
  }
  const strict = out.filter((r) => r.matched === needCount);
  let res;
  if (strict.length || needCount === 1) res = strict.sort((a, b) => b.score - a.score).slice(0, limit);
  else {
    // 모든 낱말이 들어간 글이 없으면, 중요한(드문) 낱말이 많이 들어간 글부터 보여 줍니다(화면에 "일부 낱말" 안내).
    res = out.sort((a, b) => b.matchedW - a.matchedW || b.score - a.score).slice(0, limit);
    res.partial = true;
  }
  if (corrected && res.length) res.corrected = corrected;
  return res;
}

/** 찾은 말 앞뒤로 글을 잘라 보여 줄 조각. 찾은 말은 [[ ]]로 표시해 두고 화면에서 강조합니다. */
export function snippet(text, terms, phrases = [], before = 34, after = 86) {
  // terms 는 중요한 순서(앞이 더 드문 말)로 받습니다.
  const rank = (str) => { const k = terms.findIndex((t) => t.has(str)); return k < 0 ? 99 : k; };
  const flat = [...new Set([...phrases.filter((x) => x.length > 1), ...terms.flatMap((t) => [...t]).sort((a, b) => b.length - a.length)])].filter((a) => a.length >= 1);
  // 띄어쓰기 무시 비교를 위해, 글자 위치 지도(띄어쓰기 뺀 위치 → 원래 위치)를 만듭니다.
  const map = []; let flatText = '';
  for (let i = 0; i < text.length; i++) if (!/\s/.test(text[i])) { map.push(i); flatText += text[i].toLowerCase(); }
  const marks = [];
  for (const a of flat) {
    let i = flatText.indexOf(a);
    while (i !== -1 && marks.length < 12) {
      const s = map[i], e = map[i + a.length - 1] + 1;
      if (!marks.some(([ms, me]) => s < me && e > ms)) marks.push([s, e, phrases.includes(a), rank(a)]);
      i = flatText.indexOf(a, i + a.length);
    }
  }
  // 붙인 형태(phrases)가 찾아졌으면 그 자리를, 아니면 처음 찾은 자리를 중심으로 자릅니다.
  const focus = marks.find((m) => m[2]) || marks.slice().sort((x, y) => x[3] - y[3] || x[0] - y[0])[0];
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
