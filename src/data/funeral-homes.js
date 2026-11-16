/*
 * 장례식장 찾기 데이터 (2026-11-16 추가)
 * =====================================================================
 * 원자료: 공공데이터포털 「보건복지부_장례식장 현황」 (파일데이터, 1년에 한 번 갱신)
 *   https://www.data.go.kr/data/15143467/fileData.do
 *   기준일 2026-04-01 · 1,080곳 · 이용허락범위 제한 없음 · 2026-11-16 받음
 * 가격 항목은 원자료에 없습니다. 가격은 e하늘 장사정보시스템으로 안내합니다.
 *
 * 새 자료가 나오면: 포털에서 CSV를 받아
 *   python3 tools/funeral-homes-import.py 받은파일.csv 2027-04-01
 *   python3 tools/funeral-homes-match.py   (e하늘 시설번호 다시 붙이기)
 * 을 돌리면 funeral-homes.json 이 바뀝니다(기준일을 두 번째 값으로 적습니다).
 * 시도 이름이 바뀌면(통합·개편) 아래 SIDO 에 이름을 더하세요. 목록에 없는 시도는 빌드가 멈춥니다.
 */
import raw from './funeral-homes.json';

export const meta = raw.meta;

// 주소(slug)는 한 번 정하면 바꾸지 않습니다(검색엔진에 등록된 주소).
export const SIDO = [
  { name: '서울특별시', short: '서울', slug: 'seoul' },
  { name: '부산광역시', short: '부산', slug: 'busan' },
  { name: '대구광역시', short: '대구', slug: 'daegu' },
  { name: '인천광역시', short: '인천', slug: 'incheon' },
  { name: '광주광역시', short: '광주', slug: 'gwangju' },
  { name: '대전광역시', short: '대전', slug: 'daejeon' },
  { name: '울산광역시', short: '울산', slug: 'ulsan' },
  { name: '세종특별자치시', short: '세종', slug: 'sejong' },
  { name: '경기도', short: '경기', slug: 'gyeonggi' },
  { name: '강원특별자치도', short: '강원', slug: 'gangwon' },
  { name: '충청북도', short: '충북', slug: 'chungbuk' },
  { name: '충청남도', short: '충남', slug: 'chungnam' },
  { name: '전북특별자치도', short: '전북', slug: 'jeonbuk' },
  { name: '전라남도', short: '전남', slug: 'jeonnam' },
  { name: '경상북도', short: '경북', slug: 'gyeongbuk' },
  { name: '경상남도', short: '경남', slug: 'gyeongnam' },
  { name: '제주특별자치도', short: '제주', slug: 'jeju' },
];

// 편의시설 f 문자열의 자리 순서 (1 = 설치)
export const FACILITIES = ['식당', '매점', '주차장', '유족대기실', '장애인 편의시설'];

// 원자료 홈페이지 칸에는 점이 빠진 주소, 전화번호 같은 값이 섞여 있습니다. 주소 꼴인 것만 링크로 씁니다.
export function webUrl(v) {
  const s = String(v || '').trim();
  if (!s || /[\s,]/.test(s)) return null;
  const withScheme = /^https?:\/\//i.test(s) ? s : `http://${s}`;
  try {
    const u = new URL(withScheme);
    if (!u.hostname.includes('.') || /^[\d.-]+$/.test(u.hostname)) return null;
    return u.href;
  } catch {
    return null;
  }
}

const bySido = new Map(SIDO.map((s) => [s.name, s]));
for (const it of raw.items) {
  if (!bySido.has(it.sido)) throw new Error(`funeral-homes: 목록에 없는 시도 "${it.sido}" — SIDO 에 더하세요`);
}

export const items = raw.items.map((it) => ({
  ...it,
  web: webUrl(it.web),
  facilities: FACILITIES.filter((_, i) => it.f[i] === '1'),
}));

export function itemsOf(sidoName) {
  return items.filter((it) => it.sido === sidoName);
}

// 시군구별로 묶기 (원자료 순서 = 시군구 가나다순)
export function groupBySgg(list) {
  const m = new Map();
  for (const it of list) {
    if (!m.has(it.sgg)) m.set(it.sgg, []);
    m.get(it.sgg).push(it);
  }
  return [...m.entries()].map(([sgg, list]) => ({ sgg, list }));
}

// e하늘: 지역을 고르면 장례식장별 시설사용료·장례용품 가격이 나오는 목록 화면
export const EHANEUL_LIST = 'https://www.15774129.go.kr/portal/esky/fnlfac/fac_list.do?menuId=M0001000100000000';
export const EHANEUL_ITEMS = 'https://www.15774129.go.kr/portal/esky/fnlfac/funeral_item_list.do?menuId=M0001000200000000';

// 장례식장별 e하늘 가격 화면. eh(시설번호)는 tools/funeral-homes-match.py 가 붙입니다.
// sanbundiv=N 이 빠지면 화면은 열려도 가격이 안 불러와집니다(2026-11-16 확인).
export const ehUrl = (it) => (it.eh
  ? `https://www.15774129.go.kr/portal/esky/fnlfac/fac_view.do?menuId=M0001000100000000&facilitycd=${it.eh}&facilitygroupcd=TBC0700001&loc=price&sanbundiv=N`
  : null);
export const mapUrl = (it) => `https://map.naver.com/p/search/${encodeURIComponent(`${it.sgg} ${it.name}`)}`;
export const telUrl = (t) => (t && /\d/.test(t) ? `tel:${t.replace(/[^\d+]/g, '')}` : null);
export const asOfText = (d = meta.asOf) => { const [y, m, dd] = d.split('-').map(Number); return `${y}년 ${m}월 ${dd}일`; };
