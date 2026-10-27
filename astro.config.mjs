import { defineConfig } from 'astro/config';
import pwa from './pwa.mjs';
import searchIndex from './search-index.mjs';

export default defineConfig({
  /*
   * 사이트 주소 (대표 주소).
   *
   * dajeongri.com — 2026-10-27 가비아에서 등록 확인(RDAP 조회). www 없는 주소를
   * 대표로 쓰기로 함. www.dajeongri.com 은 클라우드플레어에서 이 주소로 넘기도록
   * 설정합니다(README "주소 연결" 참고).
   *
   * 이 값이 쓰이는 곳:
   *   - 각 페이지의 canonical 주소와 공유 미리보기(카카오톡·네이버) 그림 주소
   *   - /sitemap.xml 의 페이지 목록
   *   - public/robots.txt 의 Sitemap 줄과 같은 주소여야 합니다.
   */
  site: 'https://dajeongri.com',
  output: 'static',
  build: { format: 'directory' },
  /*
   * 웹앱(PWA): 빌드가 끝나면 오프라인용 파일 목록(dist/sw.js)을 만듭니다.
   * 자세한 설명은 pwa.mjs 맨 위 주석에 있습니다.
   * 사이트 검색 색인(dist/search-index.json)을 먼저 만들어야 오프라인 목록에 함께 들어가므로
   * searchIndex 를 pwa 보다 앞에 둡니다. 자세한 설명은 search-index.mjs 맨 위 주석에 있습니다.
   */
  integrations: [searchIndex(), pwa()],
});
