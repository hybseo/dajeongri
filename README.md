# 다정리

생전정리 무료 정보·체험 사이트입니다. 엔딩노트 작성기, 체크리스트, 상속 기한 계산기,
부고 문자 만들기, 유족 해지·신고 체크리스트, 정리 가이드 15종을 제공합니다.

서치잡(searchjob.co.kr)과 같은 구조입니다. 아스트로(Astro)로 정적 사이트를 짓고,
클라우드플레어가 저장소를 받아 `npm run build` 로 빌드해서 `dist` 를 내보냅니다.

## 원칙

- **입력 내용을 서버로 보내지 않습니다.** 모든 도구는 사용자 브라우저 안에서만 동작하고,
  Word 파일과 캘린더 파일도 브라우저에서 만듭니다. 서버 저장, 회원가입, 상담 신청 폼 등을
  넣을 때는 개인정보 안내(/privacy)와 개인정보 처리 의무를 먼저 다시 검토합니다.
- **개인정보를 받지 않습니다.** 상담 신청, 운영자 소개, 유료 상품은 아직 없습니다(사이트맵 2단계).
- **확인한 정보만 씁니다.** 가이드마다 확인일과 출처를 둡니다. 내용 확인일: 2026년 10월 27일.

## 페이지 (43개)

| 묶음 | 주소 | 만드는 곳 |
|---|---|---|
| 첫 화면 | `/` | `src/pages/index.astro` |
| 시작하기 | `/start/`, `/start/me/`, `/start/parents/`, `/start/urgent/` | 원고 데이터 → `src/pages/[...slug].astro` |
| | `/start/after/` | `src/pages/start/after.astro` (떠나보낸 후로 안내) |
| 정리 도구 | `/tools/` | 원고 데이터 → `[...slug].astro` |
| | `/checklist/`, `/note/` | 각자의 파일 |
| | `/tools/deadlines/` | `src/pages/tools/deadlines.astro` + `src/components/DeadlineCalc.astro` + `src/scripts/deadlines.js` |
| | `/tools/obituary/` | `src/pages/tools/obituary.astro` |
| | `/tools/after-checklist/` | `src/pages/tools/after-checklist.astro` (항목: `src/data/after-checklist.js`) |
| | `/tools/print/` | `src/pages/tools/print.astro` (항목은 작성기와 같은 `src/data/note.js`) |
| 정리 가이드 | `/guide/` | `src/pages/guide/index.astro` (묶음: `src/data/guides.js`) |
| | `/guide/will/` 등 먼저 만든 4개 | `src/pages/guide/*.astro` |
| | 원고에서 옮긴 11개 | 원고 데이터 → `src/pages/guide/[slug].astro` |
| 떠나보낸 후 | `/after/` 외 5개 | 원고 데이터 → `[...slug].astro` (`/after/` 에는 기한 계산기가 들어감) |
| 다정리 안내 | `/about/`, `/glossary/` | 원고 데이터 → `[...slug].astro` |
| | `/faq/`, `/links/` | 각자의 파일 (내용: `src/data/extra.json`) |
| | `/app/`, `/privacy/`, `/offline/`, 404 | 각자의 파일 |

**원고 데이터**: `src/data/content.json`. 페이지 원고(제목, 검색 설명, 본문 블록, 출처)가 들어 있습니다.
글을 고칠 때는 이 파일의 해당 페이지를 고치면 됩니다. 블록 종류는 `src/components/Blocks.astro` 맨 위 주석 참고.

## 상속 기한 계산 규칙

`src/scripts/deadlines.js` 맨 위 주석에 있습니다. 민법 제157조(첫날 불산입), 제160조(월 단위 만료),
제161조(토·일요일이면 다음 날)를 따르고, 공휴일은 반영하지 않습니다(화면에 안내).

## 공통 기능

- 글자 크게 보기: 머리말의 "가+" 버튼. 설정은 그 기기에만 기억.
- 가족에게 보내기: 가이드·시작하기·떠나보낸 후 페이지. 휴대폰 공유 기능 또는 주소 복사.
- 휴대폰 하단 탭: 처음 · 엔딩노트 · 정리 도구 · 가이드.
- 웹앱(PWA): 홈 화면 설치, 인터넷 없이 작동. `pwa.mjs`, `src/sw-template.js`, `public/manifest.webmanifest`.
  서비스 워커는 서버가 `Vary` 머리말을 붙여도 저장본을 찾도록 `ignoreVary` 를 씁니다.

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
| 구글 서치콘솔 | 등록 완료, 사이트맵 제출(페이지 40개 확인) | 도메인 속성. 소유확인은 클라우드플레어 DNS 의 TXT 기록(`google-site-verification=...`)으로 했으므로 사이트 코드에는 없습니다. **그 TXT 기록을 지우면 확인이 풀립니다.** |
| 네이버 서치어드바이저 | 대기 | 사이트 등록 후 받은 HTML 태그 값을 `src/layouts/Base.astro` 머리말에 `naver-site-verification` 메타로 넣고, 사이트맵을 제출합니다. |

## 직접 돌려 볼 때

```bash
npm install
npm run dev               # http://localhost:4321
npm run build             # dist/ 생성 (클라우드플레어가 하는 것과 같음)
npm run preview:offline   # 오프라인 미리보기 꾸러미
```
