/*
 * 3분 진단 첫 질문 (2026-10-28 분리).
 * 화면을 열자마자 첫 질문이 보이도록 빌드 때 그려 두고(화면 밀림 방지), 스크립트도 같은 자료를 씁니다.
 */
export const Q1 = {
  id: 'situ', title: '지금 어떤 상황이신가요?', opts: [
    { v: 'me', label: '나를 위해 미리 정리하고 싶어요', sub: '건강할 때 천천히', ill: 'situ-me' },
    { v: 'parents', label: '부모님과 함께 정리하고 싶어요', sub: '말 꺼내는 법부터', ill: 'situ-parents' },
    { v: 'urgent', label: '시간이 많지 않아요', sub: '꼭 필요한 것만 먼저', ill: 'situ-time' },
    { v: 'after', label: '가족을 떠나보냈어요', sub: '기한이 있는 일부터', ill: 'situ-after', cls: 'loss' },
  ],
};
