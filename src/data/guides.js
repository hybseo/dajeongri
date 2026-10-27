/*
 * 정리 가이드 목록과 묶음.
 *
 * 가이드 첫 화면(/guide/)은 이 순서와 묶음대로 보여 줍니다.
 * 각 가이드 아래 "같은 묶음의 다른 가이드"도 여기서 찾습니다.
 *
 * 본문이 있는 곳
 *   - will, life-sustaining, digital, inheritance : src/pages/guide/<slug>.astro (먼저 만든 4개)
 *   - 나머지 : src/data/content.json 의 guides (원고에서 옮긴 것, src/pages/guide/[slug].astro 가 그림)
 */
export const groups = [
  { key: 'care', title: '의료와 돌봄', desc: '아플 때, 판단이 어려워질 때를 대비' },
  { key: 'law', title: '법과 재산', desc: '유언, 상속, 보험과 연금' },
  { key: 'digital', title: '디지털', desc: '계정, 휴대폰, 사진' },
  { key: 'funeral', title: '장례', desc: '방식, 비용, 상조' },
  { key: 'heart', title: '마음과 관계', desc: '가족과 이야기하기, 남기는 말' },
  { key: 'after', title: '떠나보낸 뒤', desc: '유족이 할 일과 기한' },
];

export const guides = [
  { slug: 'life-sustaining', short: '사전연명의료의향서', group: 'care', title: '사전연명의료의향서, 언제 어디서 쓰나', summary: '작성 대상, 등록기관 방문, 효력이 생기는 때' },
  { slug: 'hospice', short: '호스피스', group: 'care', title: '호스피스·완화의료, 어떻게 이용하나', summary: '대상 질환, 입원형·가정형·자문형, 필요한 서류' },
  { slug: 'guardianship', short: '후견 제도', group: 'care', title: '판단이 어려워질 때를 대비하는 후견 제도', summary: '성년·한정·특정·임의후견, 미리 정하는 법' },
  { slug: 'living-alone', short: '혼자 지내는 분', group: 'care', title: '혼자 지내는 분이 미리 해 둘 것', summary: '연고자가 없을 때 장례, 장례 맡을 사람 지정, 안부 확인 서비스', ill: ['alone', '창가에 앉은 어르신과 고양이'] },
  { slug: 'donation', short: '장기기증', group: 'care', title: '장기·인체조직 기증, 뜻을 남기는 법', summary: '희망등록 방법, 가족 동의, 취소' },
  { slug: 'will', short: '유언', group: 'law', title: '유언, 어떤 방식으로 남겨야 효력이 있을까', summary: '민법이 정한 다섯 가지 방식과 요건' },
  { slug: 'heirs', short: '상속 순위', group: 'law', title: '누가, 얼마나 상속받나: 상속 순위와 몫', summary: '상속 순서, 배우자의 몫, 계산 예시' },
  { slug: 'renounce', short: '상속포기', group: 'law', title: '빚이 더 많을 때: 상속포기와 한정승인', summary: '3개월 기한, 신고 법원, 주의할 점' },
  { slug: 'inheritance-tax', short: '상속세', group: 'law', title: '상속세, 우리 집은 낼까: 공제와 계산 순서', summary: '공제 한눈에, 세율, 10년 안 증여 합산, 미리 알아 둘 것' },
  { slug: 'insurance-pension', short: '보험·연금', group: 'law', title: '보험과 연금, 미리 확인할 것', summary: '수익자, 청구 기한, 유족연금' },
  { slug: 'digital', short: '디지털 유산', group: 'digital', title: '디지털 유산, 미리 해 둘 수 있는 것', summary: '계정 목록과 서비스별 사후 기능' },
  { slug: 'photos', short: '휴대폰과 사진', group: 'digital', title: '휴대폰과 사진, 가족에게 남기는 법', summary: '사진 모으기, 백업, 잠금 해제 방법 전하기' },
  { slug: 'funeral-types', short: '장례 방식', group: 'funeral', title: '장례 방식 고르기: 매장, 화장, 자연장', summary: '방식별 뜻, 신고, 작은 장례' },
  { slug: 'funeral-cost', short: '장례 비용', group: 'funeral', title: '장례 비용과 상조: 비용 한눈표와 계약 전 확인할 것', summary: '비용 한눈표, 가격 비교, 상조 확인, 폐업 시 대처' },
  { slug: 'burial', short: '모셔질 곳', group: 'funeral', title: '모셔질 곳 정하기: 봉안·자연장·산분장과 묘 정리', summary: '매장 신고와 묘지 기간, 산분장, 개장(이장) 신고' },
  { slug: 'talk-parents', short: '이야기 꺼내기', group: 'heart', title: '부모님께 정리 이야기, 어떻게 꺼낼까', summary: '좋은 때, 첫마디 예시, 피할 말' },
  { slug: 'letters', short: '편지 쓰기', group: 'heart', title: '남기는 편지, 어떻게 쓸까', summary: '쓰기 쉬운 순서와 첫 문장 예시' },
  { slug: 'inheritance', short: '상속 절차', group: 'after', title: '가족이 떠난 뒤 상속 절차와 기한', summary: '사망신고부터 상속세 신고까지' },
];
