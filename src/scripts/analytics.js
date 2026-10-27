/*
 * 익명 사용 횟수 세기.
 *
 * 사건 "이름"만 보냅니다. 사용자가 입력한 글자는 절대 넘기지 않습니다.
 * 측정 ID(src/site.js 의 GA_ID)가 비어 있으면 아무 일도 하지 않습니다.
 */
export function track(name) {
  try {
    if (typeof window.gtag === 'function') window.gtag('event', name);
  } catch (e) {
    /* 통계가 실패해도 사이트 기능에는 영향이 없어야 합니다. */
  }
}
