/*
 * 엔딩노트 작성기의 항목 구성.
 *
 * 화면(입력칸)과 내려받는 Word 파일이 모두 이 목록을 따라 만들어집니다.
 * 항목을 고치거나 더하려면 여기만 바꾸면 됩니다.
 *
 * type
 *   fields : 정해진 칸 몇 개 (이름, 작성일 등)
 *   list   : 같은 모양의 줄을 여러 개 (은행 목록, 연락처 등). "+ 한 줄 더" 로 늘립니다.
 *
 * 칸(field / col) 의 kind
 *   text(기본) · textarea(여러 줄) · date · choice(고르기, options 필요)
 *
 * id 는 임시저장에 쓰는 이름이라, 한 번 정하면 바꾸지 않는 것이 좋습니다.
 */
export const noteSections = [
  {
    id: 'me',
    title: '나에 대해',
    type: 'fields',
    fields: [
      { id: 'name', label: '이름' },
      { id: 'date', label: '작성한 날', kind: 'date' },
      { id: 'keeper', label: '이 노트가 어디 있는지 아는 사람', hint: '믿을 수 있는 가족 한 명을 정해 알려 두세요.' },
    ],
  },
  {
    id: 'bank',
    title: '은행·증권',
    type: 'list',
    hint: '계좌번호와 비밀번호는 적지 마세요. 기관 이름만 있어도 가족이 사후에 조회할 수 있습니다.',
    cols: [
      { id: 'org', label: '기관', placeholder: '예: ○○은행, ○○증권' },
      { id: 'kind', label: '종류', placeholder: '예금, 적금, 주식, 펀드 등' },
      { id: 'memo', label: '메모', placeholder: '주로 쓰는 통장, 급여 통장 등' },
    ],
  },
  {
    id: 'insurance',
    title: '보험·연금',
    type: 'list',
    cols: [
      { id: 'org', label: '회사·기관', placeholder: '예: ○○생명, 국민연금공단' },
      { id: 'kind', label: '종류', placeholder: '종신보험, 실손보험, 개인연금 등' },
      { id: 'memo', label: '메모', placeholder: '수익자, 증권 보관 위치 등' },
    ],
  },
  {
    id: 'assets',
    title: '부동산·자동차·그 밖의 재산',
    type: 'list',
    cols: [
      { id: 'what', label: '무엇', placeholder: '아파트, 토지, 자동차, 귀금속 등' },
      { id: 'where', label: '어디에', placeholder: '주소, 보관 장소 등' },
      { id: 'memo', label: '메모' },
    ],
  },
  {
    id: 'debts',
    title: '빚·보증',
    type: 'list',
    hint: '가족이 상속을 받을지 포기할지 정할 때 꼭 필요한 정보입니다. 빌려준 돈도 함께 적어 두세요.',
    cols: [
      { id: 'who', label: '누구에게·어디에', placeholder: '○○은행, 지인 이름 등' },
      { id: 'kind', label: '내용', placeholder: '대출, 보증, 할부, 빌려준 돈 등' },
      { id: 'memo', label: '메모', placeholder: '대략의 금액, 서류 위치 등' },
    ],
  },
  {
    id: 'autopay',
    title: '자동이체·정기결제',
    type: 'list',
    cols: [
      { id: 'what', label: '항목', placeholder: '통신비, 관리비, 후원금 등' },
      { id: 'how', label: '결제 수단', placeholder: '○○카드, ○○은행 자동이체' },
      { id: 'after', label: '나중에', kind: 'choice', options: ['해지', '가족이 이어서', '모르겠음'] },
    ],
  },
  {
    id: 'digital',
    title: '디지털 계정',
    type: 'list',
    hint: '비밀번호는 적지 마세요. 서비스 이름과 아이디, 그리고 어떻게 해 주기를 바라는지만 적으면 됩니다.',
    cols: [
      { id: 'service', label: '서비스', placeholder: '네이버, 카카오톡, 구글, 인스타그램 등' },
      { id: 'account', label: '아이디·이메일' },
      { id: 'wish', label: '바라는 처리', kind: 'choice', options: ['삭제', '추모 계정으로', '사진 등은 가족이 보관', '모르겠음'] },
    ],
  },
  {
    id: 'phone',
    title: '휴대폰과 사진',
    type: 'fields',
    fields: [
      { id: 'unlock', label: '가족이 휴대폰 잠금을 풀 수 있는 방법', kind: 'textarea', hint: '비밀번호 자체가 아니라 "○○에게 알려 두었다", "봉투에 넣어 ○○에 두었다"처럼 방법을 적으세요.' },
      { id: 'photos', label: '남기고 싶은 사진·영상이 있는 곳', kind: 'textarea' },
    ],
  },
  {
    id: 'docs',
    title: '중요 서류와 물건의 위치',
    type: 'fields',
    fields: [
      { id: 'where', label: '어디에 무엇이 있나요', kind: 'textarea', hint: '신분증, 인감도장, 등기권리증, 보험증권, 유언장, 통장 등의 보관 위치' },
    ],
  },
  {
    id: 'things',
    title: '물건 나눔',
    type: 'list',
    cols: [
      { id: 'what', label: '물건' },
      { id: 'to', label: '받을 사람' },
      { id: 'why', label: '이유·부탁', kind: 'textarea' },
    ],
  },
  {
    id: 'contacts',
    title: '꼭 연락해야 할 사람',
    type: 'list',
    hint: '부고를 알려야 할 사람, 일 관계로 연락해야 할 사람 등',
    cols: [
      { id: 'name', label: '이름' },
      { id: 'rel', label: '관계' },
      { id: 'tel', label: '연락처' },
    ],
  },
  {
    id: 'wishes',
    title: '의료와 장례에 대한 바람',
    type: 'fields',
    fields: [
      { id: 'lst', label: '연명의료에 대한 생각', kind: 'choice', options: ['받고 싶다', '받고 싶지 않다', '아직 정하지 못했다'], hint: '법적 효력은 사전연명의료의향서를 등록해야 생깁니다.', guide: '/guide/life-sustaining/' },
      { id: 'lstReg', label: '사전연명의료의향서', kind: 'choice', options: ['등록했다', '아직 안 했다'] },
      { id: 'funeral', label: '장례 방식', kind: 'choice', options: ['매장', '화장', '자연장(수목장 등)', '가족에게 맡김'] },
      { id: 'rest', label: '모셔지고 싶은 곳' },
      { id: 'ritual', label: '장례 의식에 대한 바람', kind: 'textarea', hint: '종교 의식, 꼭 불러 주었으면 하는 사람, 조촐하게 등' },
      { id: 'portrait', label: '영정 사진이 있는 곳' },
      { id: 'donation', label: '장기·인체조직 기증', kind: 'choice', options: ['희망등록을 했다', '기증하고 싶다 (아직 등록 안 함)', '원하지 않는다', '아직 정하지 못했다'], hint: '기증하고 싶다면 가족에게도 꼭 알려 두세요. 실제 기증 때 가족의 동의가 필요합니다.', guide: '/guide/donation/' },
      { id: 'pet', label: '반려동물을 부탁할 사람' },
    ],
  },
  {
    id: 'letters',
    title: '남기는 말',
    type: 'list',
    hint: '고마운 마음, 미안한 마음, 부탁하고 싶은 것. 짧아도 괜찮습니다.',
    cols: [
      { id: 'to', label: '받는 사람' },
      { id: 'msg', label: '하고 싶은 말', kind: 'textarea' },
    ],
  },
];
