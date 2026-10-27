/*
 * 유족 해지·신고 체크리스트 항목.
 * id 는 표시 상태를 기기에 기억할 때 쓰므로, 문구를 고쳐도 id 는 바꾸지 마세요.
 * need 는 "나에게 필요한 절차만"(/tools/my-procedures/)에서 쓰는 조건입니다. 없으면 누구에게나 필요한 항목.
 * docs 는 "필요한 서류·참고" 펼침에 나옵니다. 확인되지 않은 서류는 적지 않고 기관 확인을 안내합니다.
 */
export const afterChecklist = [
  {
    title: '장례 무렵',
    items: [
      { id: 'a1', text: '사망진단서(또는 시체검안서)를 여러 부 발급받기', docs: '화장 신고, 사망신고, 보험금 청구, 휴대폰 해지 등에 원본이나 원본 확인 사본이 필요합니다.', link: '/after/first-days/' },
      { id: 'a2', text: '상조 가입 여부 확인하기', docs: '내상조 찾아줘(mysangjo.or.kr)에서 조회. 은행으로 보전하는 회사는 해당 은행에 확인.', link: '/guide/funeral-cost/' },
      { id: 'a3', text: '부고 알리기', link: '/tools/obituary/' },
      { id: 'a4', text: '고인의 예금을 찾거나 재산을 팔기 전에 멈추고 확인하기', docs: '판례는 합리적인 범위의 장례비를 상속재산에서 쓰는 비용으로 보지만(대법원 2003다30968), 그 범위를 넘어 재산을 쓰거나 팔면 상속을 그대로 받은 것으로 볼 수 있어 빚이 많을 때 포기하지 못할 수 있습니다. 빚이 있을 수 있다면 대한법률구조공단(국번 없이 132)에 먼저 물어보세요.', link: '/guide/renounce/' },
    ],
  },
  {
    title: '한 달 안에',
    items: [
      { id: 'b1', text: '사망신고 (사망 사실을 안 날부터 1개월)', docs: '주민센터·시·구청. 신고인 신분증, 사망진단서 또는 시체검안서 원본. 늦으면 과태료.', link: '/after/first-month/' },
      { id: 'b2', text: '안심상속 원스톱서비스 신청', docs: '사망신고 때 함께 신청하거나 정부24에서 온라인 신청. 금융·토지·자동차·세금·연금을 한 번에 조회.', link: '/after/first-month/' },
      { id: 'b3', need: 'nhis', text: '건강보험: 지역가입자였다면 자격상실 신고 확인', docs: '국민건강보험공단 1577-1000', link: '/after/first-month/' },
      { id: 'b4', need: 'pension', text: '국민연금을 받고 계셨다면 국민연금공단에 확인하기', docs: '사망신고를 1개월 안에 했다면 공단에 따로 신고하지 않아도 됩니다(국민연금법 제121조). 유족연금·사망일시금 대상인지는 국민연금공단 1355에 확인.', link: '/guide/insurance-pension/' },
    ],
  },
  {
    title: '해지와 명의 변경',
    items: [
      { id: 'c1', need: 'phone', text: '휴대폰 해지 (해지 전 사진·연락처 먼저 확인)', docs: '사망 사실 확인 서류, 가족관계증명서, 방문하는 가족의 신분증. 남은 단말기 할부금은 자동으로 없어지지 않습니다. 정확한 서류는 통신사에 확인.', link: '/guide/photos/' },
      { id: 'c2', need: 'utility', text: '전기·가스·수도 명의 변경 또는 해지', docs: '각 공급기관 고객센터에 확인 (전기: 한국전력 123).' },
      { id: 'c3', need: 'card', text: '신용카드 해지', docs: '카드 포인트도 상속됩니다. 해지 전에 포인트를 확인하세요. 서류는 카드사에 확인.' },
      { id: 'c4', need: 'autopay', text: '자동이체·정기결제·유료 구독 해지', docs: '엔딩노트의 "자동이체·정기결제" 칸을 참고하세요.' },
      { id: 'c5', need: 'passport', text: '여권 처리', docs: '명의인이 사망하면 여권은 효력을 잃습니다. 반납 방법은 여권 발급 기관에 확인.' },
      { id: 'c6', need: 'license', text: '운전면허 처리', docs: '처리 방법은 운전면허시험장이나 경찰서에 확인.' },
    ],
  },
  {
    title: '재산과 돈',
    items: [
      { id: 'd1', text: '재산·빚 조회 결과 확인', docs: '안심상속 결과 문자·우편, 금융감독원 누리집(금융 조회 결과).', link: '/after/first-month/' },
      { id: 'd2', text: '상속을 받을지 결정 (3개월 안)', docs: '단순승인·한정승인·상속포기. 고인의 마지막 주소지 가정법원.', link: '/after/three-months/' },
      { id: 'd3', need: 'insurance', text: '사망보험금 청구 (3년 안)', docs: '각 보험사. 사망진단서, 가족관계증명서 등.', link: '/guide/insurance-pension/' },
      { id: 'd4', need: 'pension', text: '국민연금 유족연금·사망일시금 청구 확인', docs: '국민연금공단 1355', link: '/guide/insurance-pension/' },
      { id: 'd5', text: '상속세 신고 (돌아가신 달의 말일부터 6개월)', link: '/after/six-months/' },
      { id: 'd6', need: 'house', text: '부동산 취득세 신고 (6개월)와 상속등기', link: '/after/six-months/' },
      { id: 'd7', need: 'car', text: '자동차 이전등록 (6개월, 늦으면 과태료)', link: '/after/six-months/' },
    ],
  },
  {
    title: '디지털과 유품',
    items: [
      { id: 'e1', need: 'phone', text: '휴대폰·컴퓨터의 사진과 자료 백업', link: '/guide/photos/' },
      { id: 'e2', need: 'online', text: '이메일·메신저·SNS 계정 처리 (탈퇴 전 필요한 자료 확인)', link: '/guide/digital/' },
      { id: 'e3', text: '유품 정리 (업체에 맡기기 전 서류·귀중품 먼저)', link: '/after/belongings/' },
    ],
  },
];

/* "나에게 필요한 절차만"의 질문. key 는 위 항목의 need 와 짝을 이룹니다. */
export const procedureQuestions = [
  { key: 'pension', label: '국민연금을 받고 계셨어요' },
  { key: 'nhis', label: '건강보험 지역가입자였어요', sub: '직장에 다니지 않고 보험료를 따로 내셨다면' },
  { key: 'insurance', label: '사망보험·생명보험이 있었어요' },
  { key: 'house', label: '집이나 땅이 있었어요' },
  { key: 'car', label: '자동차가 있었어요' },
  { key: 'phone', label: '휴대폰이 있었어요' },
  { key: 'card', label: '신용카드가 있었어요' },
  { key: 'autopay', label: '자동이체·정기결제·유료 구독이 있었어요' },
  { key: 'utility', label: '전기·가스·수도가 고인 이름이었어요' },
  { key: 'online', label: '이메일·메신저·SNS를 쓰셨어요' },
  { key: 'passport', label: '여권이 있었어요' },
  { key: 'license', label: '운전면허가 있었어요' },
];
