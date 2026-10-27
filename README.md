# 다정리

생전정리 무료 정보·체험 사이트입니다. 엔딩노트 작성기, 체크리스트, 3분 진단, 상속 기한 계산기,
나에게 필요한 사후 절차, 부고 문자 만들기, 유족 해지·신고 체크리스트, 휴대폰 잠금 카드·지갑 긴급 카드,
정리 가이드를 제공합니다.

서치잡(searchjob.co.kr)과 같은 구조입니다. 아스트로(Astro)로 정적 사이트를 짓고,
클라우드플레어가 저장소를 받아 `npm run build` 로 빌드해서 `dist` 를 내보냅니다.

## 원칙

- **입력 내용을 서버로 보내지 않습니다.** 모든 도구는 사용자 브라우저 안에서만 동작하고,
  Word 파일과 캘린더 파일도 브라우저에서 만듭니다. 서버 저장, 회원가입, 상담 신청 폼 등을
  넣을 때는 개인정보 안내(/privacy)와 개인정보 처리 의무를 먼저 다시 검토합니다.
- **개인정보를 받지 않습니다.** 상담 신청, 운영자 소개, 유료 상품은 아직 없습니다(사이트맵 2단계).
- **확인한 정보만 씁니다.** 가이드마다 확인일과 출처를 둡니다. 내용 확인일: 2026년 10월 27일.
- **법률 출처는 국가법령정보센터로 씁니다 (2026-10-27 베타 검수 후 결정).** 법과 제도에 관한 내용의 출처는
  국가법령정보센터의 조문·판례·헌재결정례 주소로 겁니다. 주소 형식:
  `https://www.law.go.kr/법령/민법/제1019조`, `https://www.law.go.kr/판례/(2003다30968)`,
  `https://www.law.go.kr/헌재결정례/(2020헌가4)`. 법무사 위키, 비공식 조문 사본은 쓰지 않습니다.
  절차 안내는 찾기쉬운 생활법령정보·정부24·각 공공기관, 법령에 없는 사실(통계, 시범사업 등)만
  언론 보도로 쓰고 "○○ 보도"라고 표시합니다.
- **문의:** 개인정보 안내(/privacy)에 hyunbai.suh@gmail.com 을 문의처로 적었습니다.

## 디자인 (2026-10-27 개편, 최종 시안)

- 바탕·색: 흰 바탕, 남색(#2C5282 주 버튼 / #1E3A5A 제목·로고), 호박색(#E8A13A 포인트, #A35A0C 작은 강조 글자 — 2026-10-27 접근성 대비 4.5:1 맞추려고 #B5650F에서 조정),
  크림색(#FFF4E6 그림 칸), 민트(#2E9D7B 완료·안심), 연회색(#F5F7F9 구역). 값은 `src/styles/global.css` 맨 위.
- 글꼴: 프리텐다드(SIL OFL 1.1) 한 가지. `public/fonts/pretendard/` 에 넣어 두었고(글자 조각 92개),
  화면에 필요한 조각만 받습니다. 오프라인 저장 목록에서는 빼고, 쓴 조각만 그때그때 저장합니다(`pwa.mjs`).
- 그림: `public/illust/*.svg` 12장. 부모님(흰머리·안경·가디건)과 자녀(검은 머리·하늘색 스웨터) 두 사람이
  모든 장면에 같은 모습으로 나옵니다. 고칠 때는 `python3 tools/illust.py` 를 고쳐 다시 실행합니다(svg 직접 수정 금지).
- 로고·앱 아이콘·파비콘·공유 썸네일: `node tools/make-icons.mjs` (작업 컴퓨터의 playwright 사용).
- 머리말: 로고 · 처음 오셨나요 · 정리 도구 · 정리 가이드 · 떠나보낸 후 · [가족을 떠나보냈어요 →](첫 3일 안내) · [가 / 가+].

## 페이지 (52개)

| 묶음 | 주소 | 만드는 곳 |
|---|---|---|
| 첫 화면 | `/` | `src/pages/index.astro` |
| 시작하기 | `/start/`, `/start/me/`, `/start/parents/`, `/start/urgent/` | 원고 데이터 → `src/pages/[...slug].astro` |
| | `/start/after/` | `src/pages/start/after.astro` (떠나보낸 후로 안내) |
| 3분 진단 | `/check/` | `src/pages/check.astro` (질문 3개 → 할 일 순서. 규칙은 파일 안 `build()`) |
| 정리 도구 | `/tools/` | `src/pages/tools/index.astro` (세 묶음 카드) |
| | `/checklist/`, `/note/` | 각자의 파일 |
| | `/tools/deadlines/` | `src/pages/tools/deadlines.astro` + `src/components/DeadlineCalc.astro` + `src/scripts/deadlines.js` |
| | `/tools/obituary/` | `src/pages/tools/obituary.astro` |
| | `/tools/after-checklist/` | `src/pages/tools/after-checklist.astro` (항목: `src/data/after-checklist.js`) |
| | `/tools/my-procedures/` | `src/pages/tools/my-procedures.astro` (같은 항목 중 `need` 조건으로 고름, 체크 표시는 위 체크리스트와 공유) |
| | `/tools/cards/` | `src/pages/tools/cards.astro` (휴대폰 잠금 카드·지갑 긴급 카드 인쇄. 입력 저장·전송 없음, 잠금 번호는 입력받지 않음) |
| | `/tools/print/` | `src/pages/tools/print.astro` (항목은 작성기와 같은 `src/data/note.js`) |
| | `/tools/inheritance-tax/` | `src/pages/tools/inheritance-tax.astro` + `src/scripts/inheritance-tax.js` (상속세 가늠 계산기, 2026-10-27 추가. 입력 저장·전송 없음) |
| 정리 가이드 | `/guide/` | `src/pages/guide/index.astro` (묶음: `src/data/guides.js`) |
| | `/guide/will/` 등 먼저 만든 4개 | `src/pages/guide/*.astro` |
| | 새 가이드 2개 (2026-10-27): `/guide/burial/`(묘지와 안치), `/guide/living-alone/`(혼자 사는 분) | 원고 데이터 → `[slug].astro`. `/guide/funeral-cost/` 에 비용 한눈표 추가 |
| | 원고에서 옮긴 11개 + 새 2개 | 원고 데이터 → `src/pages/guide/[slug].astro` |
| | `/guide/inheritance-tax/` (상속세, 2026-10-27 추가) | 원고 데이터 → `[slug].astro` |
| | `/guide/find-estate/` (갑자기 떠나셨을 때 재산과 빚 찾기·사고사일 때 배상금, 2026-10-27 추가) | 원고 데이터 → `[slug].astro`. 한 달 안에·상속 절차·상속포기 가이드·유족 체크리스트에서 연결 |
| 사이트 검색 | `/search/` (2026-10-28 추가) | `src/pages/search.astro` + `src/scripts/search.js`, 색인은 빌드 때 `search-index.mjs` 가 만듦. 머리말 돋보기, 첫 화면·가이드 목록·404 검색칸(`src/components/SearchBox.astro`) |
| 떠나보낸 후 | `/after/` 외 5개 | 원고 데이터 → `[...slug].astro` (`/after/` 에는 기한 계산기가 들어감) |
| 다정리 안내 | `/about/`, `/glossary/` | 원고 데이터 → `[...slug].astro` |
| | `/faq/`, `/links/` | 각자의 파일 (내용: `src/data/extra.json`) |
| | `/app/`, `/privacy/`, `/offline/`, 404 | 각자의 파일 |

**원고 데이터**: `src/data/content.json`. 페이지 원고(제목, 검색 설명, 본문 블록, 출처)가 들어 있습니다.
글을 고칠 때는 이 파일의 해당 페이지를 고치면 됩니다. 블록 종류는 `src/components/Blocks.astro` 맨 위 주석 참고.

## 상속 기한 계산 규칙

`src/scripts/deadlines.js` 맨 위 주석에 있습니다. 민법 제157조(첫날 불산입), 제160조(월 단위 만료),
제161조(토·일요일이면 다음 날)를 따르고, 공휴일은 반영하지 않습니다(화면에 안내).
안심상속 원스톱서비스 신청 기한은 법정 기간이 아니라서 주말이어도 미루지 않습니다.
상속세는 돌아가신 분이나 상속인이 외국에 주소를 둔 경우 9개월(상속세 및 증여세법 제67조제4항),
취득세는 외국에 주소를 둔 상속인이 있는 경우에만 9개월(지방세법 제20조)이라 체크 칸을 둘로 나눴습니다.
날짜 확인: 돌아가신 날이 미래이거나 "안 날"이 돌아가신 날보다 앞서면 계산하지 않고 안내합니다.
"휴대폰 달력에 저장"에는 아직 지나지 않은 마감만 넣고, 달력 파일은 표준(RFC 5545)대로 75바이트마다 줄을 접습니다(`foldICS`).

## 상속세 가늠 계산 규칙 (2026-10-27)

`src/scripts/inheritance-tax.js` 맨 위 `LAW` 에 숫자가 모여 있습니다. 상속세 및 증여세법(법률 제21219호, 2026.1.1. 시행)과
시행령 제9조·제17조를 국가법령정보센터에서 2026-10-27에 확인했습니다. 과세가액(제13조) → 공제(제18~24조) → 세율(제26조)
→ 증여세액 공제(제28조) → 신고세액 공제 3%(제69조) 순서. 장례비는 500만~1천만 원 + 봉안 500만 원, 배우자 공제는
max(5억, min(실제 받는 금액, (A+C)×법정상속분, 30억)). 단순화한 것(재산 평가, 가업·영농·장애인 공제, 유증, 할증,
배우자 사전증여 E)은 화면 "이 계산기가 넣지 않은 것"에 적어 두었습니다. 법이 바뀌면(유산취득세 개편안 등)
`LAW`, 계산식, `/guide/inheritance-tax/`(content.json) 를 함께 고치고 확인일을 바꾸세요.

## 공통 기능

- 사이트 검색(2026-10-28): 빌드가 끝나면 `search-index.mjs` 가 dist 의 모든 페이지 본문을 소제목 단위로 모아
  `dist/search-index.json`(약 60KB)을 만들고, `/search/` 가 이 파일로 기기 안에서 찾습니다(서버 없음, 오프라인 가능).
  - 띄어쓰기 무시, 조사·말끝 떼기("돌아가셨어요"→"돌아가"), 비슷한 말 묶음(`src/scripts/search.js` 의 `SYNONYMS`),
    꼭 필요하지 않은 말(`OPTIONAL`: "방법·어떻게·뭐부터" 등)과 흔한 말("정리")은 필수에서 제외, 띄어 쓴 말이 사이트에 붙여 쓴 말로 있으면 한 낱말("유언 장"→"유언장"),
    한 글자 자음·모음만 틀린 오타는 고쳐 찾고 화면에 알림("상속포끼"→"상속포기"), 가족을 막 떠나보낸 분의 말("어제 돌아가셨는데…")에는 첫 3일 안내를 맨 앞에(`PINS`).
    모든 낱말이 든 글이 없으면 일부 낱말 결과를 안내와 함께 보여 줌. 2026-10-28 최종 베타에서 사용자 유형별 검색어 109개로 확인(108개 기대 결과 3위 안). 결과는 소제목으로 바로 이동(#주소 규칙은 `search-index.mjs` 주석).
  - 색인에서 빼고 싶은 묶음은 `data-nosearch` 를 붙입니다(가이드의 "함께 쓰면 좋은 도구" 등). "자주 찾는 말"은 `POPULAR`.
  - 원고 페이지(떠나보낸 뒤 등)의 소제목에는 `s1, s2 …` id 를 붙입니다(`Blocks.astro` 의 `autoId`).
  - 자주 묻는 질문은 `/faq/#q3` 처럼 들어오면 그 질문이 펼쳐집니다.

- 글자 크게 보기: 머리말의 "가+" 버튼. 설정은 그 기기에만 기억.
- 가족에게 보내기: 가이드·시작하기·떠나보낸 후 페이지. 휴대폰 공유 기능 또는 주소 복사.
- 휴대폰 하단 탭: 처음 · 엔딩노트 · 정리 도구 · 가이드.
- 엔딩노트 작성기: 왼쪽 13단계 · 가운데 한 칸씩 · 오른쪽 Word 미리보기 · 위 진행률과 저장 표시. 자동 저장은 하지 않습니다(함께 쓰는 컴퓨터 배려).
  - 로그인 없이 기기 옮기기(2026-10-27): 내려받는 Word 파일 안에 `dajeongri/note.json`(이어 쓰기 정보)을 함께 넣고
    `_rels/.rels`에 등록합니다. "내 파일 불러오기"로 그 파일을 고르면 기기 안에서 읽어 되살립니다(src/scripts/note-docx.js readNoteFile).
    Word에서 고쳐 다시 저장한 파일은 이 정보가 빠질 수 있어 안내 문구를 띄웁니다.
  - 저장하지 않은 내용이 있으면 창 닫기 경고(beforeunload). 임시저장 뒤 "파일로도 받아 두세요" 안내, 아이폰 사파리는 7일 보관 한계 안내.
  - 쓰는 동안에는 그 창(탭) 안에만 자동 보관(sessionStorage, 키 `dajeongri-note-v1-tab`). 새로고침·휴대폰이 페이지를 다시 불러와도 되살리고, 창을 닫으면 브라우저가 지움. 기기에 남는 저장은 "이 기기에 임시저장"을 눌렀을 때만(localStorage).
  - "해마다 다시 보기" 달력 파일(.ics, 1년 뒤부터 매년, 노트 내용 없음). 통계 이벤트: note_import, note_import_fail, note_reminder.
  - 방침: 회원가입·로그인을 두지 않습니다(개인정보를 서버에 두지 않기 위해).
- 가이드 공통 틀(`src/layouts/Guide.astro`): 맨 위 그림, 확인일·출처 수 배지, 소제목으로 만든 "이 가이드의 순서", 함께 쓰면 좋은 도구.
- 웹앱(PWA): 홈 화면 설치, 인터넷 없이 작동. `pwa.mjs`, `src/sw-template.js`, `public/manifest.webmanifest`.
  서비스 워커는 서버가 `Vary` 머리말을 붙여도 저장본을 찾도록 `ignoreVary` 를 씁니다.

## 접근성 (2026-10-27 마지막 베타 검수)

- axe-core 자동 검사(WCAG 2 A·AA, best-practice) 48개 페이지 PC·휴대폰 위반 0건.
- 옆으로 밀리는 표는 `tabindex="0" role="region"`과 이름을 붙여 키보드로 움직일 수 있게 했습니다.
- 3분 진단은 답을 고르면 다음 질문 제목으로 키보드 위치를 옮깁니다.

## 오프라인 미리보기 꾸러미

```bash
npm run preview:offline
```

`preview-offline/다정리_미리보기/` 가 생깁니다. 이 폴더를 통째로 다른 컴퓨터에 옮겨
"여기를 두 번 누르세요.html" 을 열면, 웹서버 없이 모든 페이지와 도구를 확인할 수 있습니다.
(링크를 상대 주소로 바꾸고 스크립트를 페이지 안에 묶어 넣은 확인용 복사본입니다. 실제 사이트와 별개이며
저장소에는 올리지 않습니다. 화면 맨 위에 "오프라인 미리보기" 줄이 보입니다.)

## 주소 (2026-10-27 설정)

- 대표 주소: **https://dajeongri.com** (`astro.config.mjs` 의 `site`, `public/robots.txt` 의 Sitemap 줄)
- 도메인 등록: 가비아, 2026-10-27 (RDAP 조회로 확인). dajeongri.co.kr 은 이날 기준 미등록.
- 주소 연결: 클라우드플레어에 dajeongri.com 을 추가하고, 가비아에서 네임서버를 클라우드플레어가 알려 주는 값으로 바꾼 뒤,
  이 사이트(Worker)에 사용자 지정 도메인으로 dajeongri.com 과 www.dajeongri.com 을 연결합니다.
  www 는 클라우드플레어 "리디렉션 규칙"으로 https://dajeongri.com 으로 301 이동시킵니다.

## 방문 통계와 검색 등록 (2026-10-27)

| 항목 | 상태 | 위치·방법 |
|---|---|---|
| 방문 통계 | 켬. 구글 애널리틱스 4, 측정 ID `G-64GMVXVKCR` | `src/site.js` 의 `GA_ID`. 계정 "다정리" → 속성 "다정리 웹사이트". 끄려면 값을 비웁니다. 개인정보 안내(/privacy)는 이 값에 따라 자동으로 바뀝니다. |
| 기능 사용 횟수 | 켬 (사건 이름만) | `src/scripts/analytics.js` 의 `track`. 엔딩노트 작성 시작·Word 내려받기·인쇄, 체크리스트·빈 노트 인쇄, 기한 계산·캘린더 저장, 부고 문안 복사·공유·문자, 가족에게 보내기, 글자 크게, 앱 설치 |
| 사이트 검색어 | 켬 (2026-10-28 대표 결정) | `view_search_results` 의 `search_term`, 결과 없으면 `search_no_result` 의 `no_result_term`. 숫자는 #, 메일 주소는 (메일)로 바꿔 보냄(`maskTerm`). 검색 화면 주소의 `?w=` 는 페이지 주소 통계에서 뺌(`Base.astro` 의 `page_location`). 개인정보 안내에 적음 |
| 애널리틱스 설정 (2026-10-28) | 내부 트래픽 제외 · 주요 이벤트 · 검색 | 대표 컴퓨터 IP(116.121.208.187/32)를 내부 트래픽으로 지정하고 Internal Traffic 데이터 필터 "사용 중"(IP가 바뀌면 규칙도 고칠 것). 주요 이벤트: check_done, deadline_ics, note_download, tax_calc. 향상된 측정의 "사이트 검색" 자동 감지는 끔(3분 진단 `?s=` 가 검색으로 잘못 잡히던 문제). 맞춤 측정기준 "결과 없는 검색어"(no_result_term) |
| 구글 서치콘솔 | 등록 완료, 사이트맵 다시 제출(개편 후 페이지 45개 확인). 2026-10-27 색인 요청: `/`, `/check/`, `/note/`, `/tools/`, `/guide/`, `/guide/burial/`, `/guide/living-alone/` | 도메인 속성. 소유확인은 클라우드플레어 DNS 의 TXT 기록(`google-site-verification=...`)으로 했으므로 사이트 코드에는 없습니다. **그 TXT 기록을 지우면 확인이 풀립니다.** |
| 네이버 서치어드바이저 | 등록·소유확인 완료, 사이트맵 제출 (2026-10-27) | `src/layouts/Base.astro` 머리말의 `naver-site-verification` 메타(값 babd2aa2…). **지우면 확인이 풀립니다.** 사이트맵 https://dajeongri.com/sitemap.xml 제출. |

## 직접 돌려 볼 때

```bash
npm install
npm run dev               # http://localhost:4321
npm run build             # dist/ 생성 (클라우드플레어가 하는 것과 같음)
npm run preview:offline   # 오프라인 미리보기 꾸러미
```
