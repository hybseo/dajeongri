/*
 * 상속세 가늠 계산 (2026-10-27 추가).
 *
 * 근거: 상속세 및 증여세법(법률 제21219호, 2025.12.23. 개정, 2026.1.1. 시행 기준 확인)
 *   제13조 과세가액, 제14조 공과금·장례비·채무(시행령 제9조 장례비 한도), 제18조 기초공제,
 *   제19조 배우자 상속공제, 제20조 그 밖의 인적공제, 제21조 일괄공제, 제22조 금융재산 상속공제,
 *   제23조의2 동거주택 상속공제, 제24조 공제 한도, 제25조 과세표준, 제26조 세율,
 *   제28조 증여세액 공제, 제69조 신고세액 공제.
 * 법이 바뀌면 아래 숫자(LAW)와 가이드(/guide/inheritance-tax/)를 함께 고쳐 주세요.
 *
 * 일부러 단순하게 계산하는 것 (화면에도 안내합니다)
 *   - 재산 가액은 입력한 금액 그대로(실제로는 시가·기준시가 등 평가 규정을 따름)
 *   - 비상속인 유증, 공익 출연, 가업·영농상속공제, 장애인공제, 세대 생략 할증, 감정평가 수수료는 넣지 않음
 *   - 배우자 공제 한도의 E(배우자가 사전 증여받은 재산의 과세표준)는 0으로 봄
 * 모든 금액 단위는 원입니다.
 */

export const LAW = {
  basic: 2e8,            // 제18조 기초공제
  child: 5e7,            // 제20조 ① 1호 자녀 1명
  minorPerYear: 1e7,     // 제20조 ① 2호 미성년자 1천만원 × 19세까지 연수
  senior: 5e7,           // 제20조 ① 3호 65세 이상
  lump: 5e8,             // 제21조 일괄공제
  spouseMin: 5e8,        // 제19조 ④
  spouseMax: 30e8,       // 제19조 ① 2호
  finSmall: 2e7,         // 제22조 2천만원
  finRate: 0.2,
  finMax: 2e8,
  houseMax: 6e8,         // 제23조의2
  funeralMin: 5e6,       // 시행령 제9조 ② 1호
  funeralMax: 1e7,
  burialMax: 5e6,        // 시행령 제9조 ② 2호
  giftAddLine: 5e8,      // 제24조 단서·제28조 단서 (과세가액 5억원)
  minimumBase: 5e5,      // 제25조 ② 과세표준 50만원 미만 비과세
  filingRate: 0.03,      // 제69조
  installmentLine: 2e7,  // 제71조 연부연납 (납부세액 2천만원 초과)
  brackets: [            // 제26조
    [1e8, 0.1, 0],
    [5e8, 0.2, 1e7],
    [10e8, 0.3, 9e7],
    [30e8, 0.4, 2.4e8],
    [Infinity, 0.5, 10.4e8],
  ],
};

const n = (v) => { const x = Number(v); return Number.isFinite(x) && x > 0 ? x : 0; };

/** 제26조 세율 적용 */
export function rateTax(base) {
  let prev = 0;
  for (const [upto, rate, acc] of LAW.brackets) {
    if (base <= upto) return { tax: Math.floor(acc + (base - prev) * rate), rate, from: prev };
    prev = upto;
  }
  return { tax: 0, rate: 0, from: 0 };
}

/**
 * @param {object} i 입력
 *  realEstate, financial, other : 재산(원)
 *  debts : 갚을 빚·미납 세금 합계, finDebts : 그중 은행 등 금융회사 빚
 *  funeral : 장례에 쓴 돈, burial : 봉안당·자연장지에 쓴 돈
 *  giftsHeirs : 돌아가시기 전 10년 안에 상속인에게 준 재산, giftsOthers : 5년 안에 상속인 아닌 사람에게 준 재산
 *  giftDeducted : 그 증여 때 공제받은 금액 합계, giftTaxPaid : 그 증여 때 낸(산출) 증여세
 *  spouse : 배우자 있음, spouseMode : 'legal' | 'amount' | 'min', spouseAmount
 *  children : 자녀 수, parents : (자녀가 없을 때) 살아 계신 돌아가신 분의 부모 수
 *  minorAges : 미성년 상속인·동거가족 나이 배열, seniors : 65세 이상 상속인(배우자 제외)·동거가족 수
 *  house : 동거주택 공제 요건 충족, houseValue, houseLoan
 */
export function computeInheritanceTax(i) {
  const gross = n(i.realEstate) + n(i.financial) + n(i.other);
  const debts = n(i.debts);
  const finDebts = Math.min(n(i.finDebts), debts);
  const funeralDed = Math.min(Math.max(n(i.funeral), LAW.funeralMin), LAW.funeralMax) + Math.min(n(i.burial), LAW.burialMax);
  const minus = debts + funeralDed;
  const netEstate = Math.max(0, gross - minus);                       // 제13조 ① 후단
  const giftsHeirs = n(i.giftsHeirs), giftsOthers = n(i.giftsOthers);
  const gifts = giftsHeirs + giftsOthers;
  const giftDeducted = Math.min(n(i.giftDeducted), gifts);
  const taxable = netEstate + gifts;                                    // 상속세 과세가액

  // 인적공제
  const children = Math.max(0, Math.floor(n(i.children)));
  const parents = Math.min(2, Math.max(0, Math.floor(n(i.parents))));
  const minorAges = (i.minorAges || []).map(Number).filter((a) => Number.isFinite(a) && a >= 0 && a < 19);
  const minorDed = minorAges.reduce((s, a) => s + LAW.minorPerYear * Math.max(1, Math.ceil(19 - a)), 0);
  const seniorDed = LAW.senior * Math.max(0, Math.floor(n(i.seniors)));
  const childDed = LAW.child * children;
  const basicPlus = LAW.basic + childDed + minorDed + seniorDed;
  const spouseSole = !!i.spouse && children === 0 && parents === 0;    // 배우자 단독 상속
  const personal = spouseSole ? basicPlus : Math.max(basicPlus, LAW.lump);
  const usedLump = !spouseSole && LAW.lump >= basicPlus;

  // 배우자 상속공제
  let spouseDed = 0, spouseShare = 0, spouseLimit = 0, spouseActual = 0;
  if (i.spouse) {
    spouseShare = children > 0 ? 1.5 / (1.5 + children) : parents > 0 ? 1.5 / (1.5 + parents) : 1;
    const A = Math.max(0, gross - debts);                               // 시행령 제17조 ① (장례비는 빼지 않음)
    spouseLimit = Math.min(Math.floor((A + giftsHeirs) * spouseShare), LAW.spouseMax);
    spouseActual = i.spouseMode === 'amount' ? n(i.spouseAmount) : i.spouseMode === 'min' ? 0 : Math.floor(A * spouseShare);
    spouseDed = Math.max(LAW.spouseMin, Math.min(spouseActual, spouseLimit));
  }

  // 금융재산 상속공제
  const netFin = Math.max(0, n(i.financial) - finDebts);
  const finDed = netFin <= LAW.finSmall ? netFin : Math.min(LAW.finMax, Math.max(Math.floor(netFin * LAW.finRate), LAW.finSmall));

  // 동거주택 상속공제
  const houseDed = i.house ? Math.min(LAW.houseMax, Math.max(0, n(i.houseValue) - n(i.houseLoan))) : 0;

  const totalDed = personal + spouseDed + finDed + houseDed;
  const giftNet = Math.max(0, gifts - giftDeducted);
  const limit = Math.max(0, taxable - (taxable > LAW.giftAddLine ? giftNet : 0)); // 제24조
  const appliedDed = Math.min(totalDed, limit);
  let base = Math.max(0, taxable - appliedDed);
  const belowMinimum = base > 0 && base < LAW.minimumBase;
  if (belowMinimum) base = 0;

  const { tax: computed, rate } = rateTax(base);
  const giftCredit = taxable > LAW.giftAddLine && base > 0 && n(i.giftTaxPaid) > 0
    ? Math.min(n(i.giftTaxPaid), Math.floor(computed * Math.min(1, giftNet / base))) : 0;  // 제28조
  const filingCredit = Math.floor(Math.max(0, computed - giftCredit) * LAW.filingRate);      // 제69조
  const payable = Math.max(0, computed - giftCredit - filingCredit);

  return {
    gross, debts, funeralDed, minus, netEstate, gifts, taxable,
    personal, usedLump, spouseSole, basicPlus, childDed, minorDed, seniorDed,
    spouseDed, spouseShare, spouseLimit, spouseActual,
    finDed, netFin, houseDed, totalDed, limit, appliedDed, cutByLimit: totalDed > limit,
    base, belowMinimum, rate, computed, giftCredit, filingCredit, payable,
    installment: payable > LAW.installmentLine,
    // 공제를 다 받고도 얼마나 여유가 있는지 (세금이 없을 때)
    margin: Math.max(0, totalDed - taxable),
  };
}
