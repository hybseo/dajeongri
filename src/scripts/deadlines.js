/*
 * 상속 관련 기한 계산.
 *
 * 민법의 기간 계산 규칙을 따릅니다.
 *   - 첫날은 세지 않습니다(제157조). "안 날부터 3개월"은 다음 날부터 셉니다.
 *   - 월·년으로 정한 기간은 마지막 달에서 시작한 날에 해당하는 날의 전날에 끝납니다(제160조).
 *     그 달에 해당하는 날이 없으면 그 달의 말일에 끝납니다.
 *   - 마지막 날이 토요일이나 일요일이면 다음 평일로 미룹니다(제161조).
 *     공휴일(설·추석 등)은 반영하지 않으므로 화면에 안내 문구를 둡니다.
 *
 * "돌아가신 달의 말일부터 6개월"처럼 말일에서 시작하는 기한은
 * 다음 달 1일부터 세므로, 6개월 뒤 달의 말일에 끝납니다.
 *
 * 날짜는 모두 사용자 기기의 시간대 기준 "날짜"로만 다룹니다(시각 없음).
 */

const DAY = 24 * 60 * 60 * 1000;
export const ymd = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
export const parse = (s) => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
const addDays = (d, n) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
const lastDayOf = (y, m) => new Date(y, m + 1, 0); // m: 0~11

/** 첫날 불산입 + 월 단위 기간의 만료일 */
export function afterMonths(base, months) {
  const start = addDays(base, 1);
  const y = start.getFullYear();
  const m = start.getMonth() + months;
  const target = new Date(y, m, 1);
  const last = lastDayOf(target.getFullYear(), target.getMonth()).getDate();
  if (start.getDate() > last) return lastDayOf(target.getFullYear(), target.getMonth());
  return addDays(new Date(target.getFullYear(), target.getMonth(), start.getDate()), -1);
}
/** 돌아가신 달의 말일부터 N개월 → N개월 뒤 달의 말일 */
export function fromMonthEnd(base, months) {
  return lastDayOf(base.getFullYear(), base.getMonth() + months);
}
/** 첫날 불산입 + 일 단위 */
export function afterDays(base, days) { return addDays(base, days); }

/** 토·일이면 다음 월요일로 */
export function rollWeekend(d) {
  const w = d.getDay();
  if (w === 6) return addDays(d, 2);
  if (w === 0) return addDays(d, 1);
  return d;
}

/**
 * 기한 목록을 만듭니다.
 * @param {string} death  돌아가신 날 (YYYY-MM-DD)
 * @param {string} [knew] 사망·상속 사실을 안 날 (없으면 돌아가신 날)
 * @param {{heirAbroad?: boolean, deceasedAbroad?: boolean}|boolean} [opt]
 *   heirAbroad: 상속인 중 외국에 주소를 둔 사람이 있음 → 상속세·취득세 9개월
 *   deceasedAbroad: 돌아가신 분이 외국에 주소를 두었음 → 상속세 9개월 (상속세 및 증여세법 제67조제4항)
 *   (예전처럼 true/false 하나만 넘기면 heirAbroad 로 봅니다.)
 */
export function computeDeadlines(death, knew, opt = {}) {
  const o = typeof opt === 'boolean' ? { heirAbroad: opt } : opt;
  const d = parse(death);
  const k = knew ? parse(knew) : d;
  const taxMonths = o.heirAbroad || o.deceasedAbroad ? 9 : 6;
  const acqMonths = o.heirAbroad ? 9 : 6;
  const items = [
    { key: 'death-report', title: '사망신고', rule: '사망 사실을 안 날부터 1개월', date: afterMonths(k, 1), where: '주민센터·시·구청', link: '/after/first-month/' },
    // 자격은 사망한 날의 다음 날 잃고(국민건강보험법 제10조), 그날부터 14일 안에 신고합니다.
    // 자격 상실일은 0시부터 시작하므로 그날을 첫날로 셉니다(민법 제157조 단서) → 사망일 + 14일.
    { key: 'nhis', title: '건강보험 자격상실 신고 (지역가입자 세대주, 필요한지 공단에 확인)', rule: '자격을 잃은 날(사망 다음 날)부터 14일', date: afterDays(d, 14), where: '국민건강보험공단 1577-1000', link: '/after/first-month/' },
    { key: 'renounce', title: '단순승인·한정승인·상속포기 결정', rule: '상속이 시작된 것을 안 날부터 3개월', date: afterMonths(k, 3), where: '가정법원', link: '/guide/renounce/' },
    { key: 'tax', title: '상속세 신고·납부 (내야 할 세금이 있을 때)', rule: `돌아가신 달의 말일부터 ${taxMonths}개월`, date: fromMonthEnd(d, taxMonths), where: '세무서·홈택스', link: '/after/six-months/' },
    { key: 'acq', title: '상속 부동산 취득세 신고·납부', rule: `돌아가신 달의 말일부터 ${acqMonths}개월`, date: fromMonthEnd(d, acqMonths), where: '시·군·구청·위택스', link: '/after/six-months/' },
    { key: 'car', title: '상속 자동차 이전등록', rule: '돌아가신 달의 말일부터 6개월', date: fromMonthEnd(d, 6), where: '차량등록사업소', link: '/after/six-months/' },
    // 법이 정한 기간이 아니라 서비스 신청 기준이므로 주말이어도 미루지 않습니다.
    { key: 'safe', title: '안심상속 원스톱서비스 신청 (늦어도)', rule: '돌아가신 달의 말일부터 1년', date: fromMonthEnd(d, 12), where: '주민센터·정부24', link: '/after/first-month/', noRoll: true },
    { key: 'insurance', title: '사망보험금 청구', rule: '보험금을 청구할 수 있는 때(보통 돌아가신 날)부터 3년', date: afterMonths(d, 36), where: '각 보험사', link: '/guide/insurance-pension/' },
  ];
  return items
    .map((it) => {
      const due = it.noRoll ? it.date : rollWeekend(it.date);
      return { ...it, due, moved: due.getTime() !== it.date.getTime() };
    })
    .sort((a, b) => a.due - b.due);
}

/** 입력 날짜 확인. 문제가 있으면 안내 문장을, 없으면 '' 를 돌려줍니다. */
export function checkDates(death, knew, today = new Date()) {
  if (!death) return '돌아가신 날을 넣어 주세요.';
  const d = parse(death);
  if (isNaN(d.getTime())) return '날짜를 다시 확인해 주세요.';
  const t = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  if (d > t) return '돌아가신 날이 오늘보다 뒤입니다. 날짜를 다시 확인해 주세요.';
  if (d.getFullYear() < 1950) return '날짜를 다시 확인해 주세요.';
  if (knew) {
    const k = parse(knew);
    if (isNaN(k.getTime())) return '"안 날"을 다시 확인해 주세요.';
    if (k < d) return '"사망·상속 사실을 안 날"은 돌아가신 날과 같거나 그 뒤여야 합니다.';
    if (k > t) return '"사망·상속 사실을 안 날"이 오늘보다 뒤입니다. 날짜를 다시 확인해 주세요.';
  }
  return '';
}

export function daysLeft(due, today = new Date()) {
  const t = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  return Math.round((due - t) / DAY);
}

export const korean = (d) => `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일 (${'일월화수목금토'[d.getDay()]})`;

/**
 * 달력 파일 한 줄이 75바이트를 넘으면 표준(RFC 5545)대로 접습니다.
 * 한글이 중간에서 잘리지 않도록 글자 단위로 셉니다.
 */
export function foldICS(text) {
  const enc = new TextEncoder();
  return text.split('\r\n').map((line) => {
    if (enc.encode(line).length <= 75) return line;
    const out = []; let cur = ''; let size = 0; let limit = 75;
    for (const ch of line) {
      const n = enc.encode(ch).length;
      if (size + n > limit) { out.push(cur); cur = ''; size = 0; limit = 74; }
      cur += ch; size += n;
    }
    out.push(cur);
    return out.join('\r\n ');
  }).join('\r\n');
}

/** 달력 파일(.ics) 내용 */
export function toICS(items) {
  const esc = (s) => String(s).replace(/[\\,;]/g, (m) => '\\' + m);
  const stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d+Z$/, 'Z');
  const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//dajeongri//deadlines//KO', 'CALSCALE:GREGORIAN'];
  items.forEach((it, i) => {
    const s = ymd(it.due).replace(/-/g, '');
    const e = ymd(addDays(it.due, 1)).replace(/-/g, '');
    lines.push('BEGIN:VEVENT', `UID:dajeongri-${it.key}-${s}-${i}`, `DTSTAMP:${stamp}`,
      `DTSTART;VALUE=DATE:${s}`, `DTEND;VALUE=DATE:${e}`,
      `SUMMARY:${esc('[마감] ' + it.title)}`, `DESCRIPTION:${esc(it.rule + ' · ' + it.where + ' · 다정리 상속 기한 계산기(참고용)')}`,
      'BEGIN:VALARM', 'TRIGGER:-P7D', 'ACTION:DISPLAY', `DESCRIPTION:${esc('7일 뒤 마감: ' + it.title)}`, 'END:VALARM',
      'END:VEVENT');
  });
  lines.push('END:VCALENDAR');
  return foldICS(lines.join('\r\n'));
}
