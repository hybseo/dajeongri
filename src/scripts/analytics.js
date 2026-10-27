/*
 * 익명 사용 횟수 세기.
 *
 * 사건 "이름"만 보냅니다. 사용자가 입력한 글자는 넘기지 않습니다.
 * 예외 하나: 사이트 검색어(2026-10-28 대표 결정). 무엇을 찾는지 알아 가이드를 보완하려고
 * 숫자와 메일 주소를 지운 검색어를 params.search_term 으로 보냅니다(src/scripts/search.js maskTerm,
 * /search/ 화면). 개인정보 안내(/privacy/)에 적어 두었습니다.
 * 측정 ID(src/site.js 의 GA_ID)가 비어 있으면 아무 일도 하지 않습니다.
 */
export function track(name, params) {
  try {
    if (typeof window.gtag === 'function') window.gtag('event', name, params || {});
  } catch (e) {
    /* 통계가 실패해도 사이트 기능에는 영향이 없어야 합니다. */
  }
}
