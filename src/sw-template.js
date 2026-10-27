/*
 * 다정리 서비스 워커 (빌드 때 pwa.mjs 가 이 틀에 파일 목록을 채워 dist/sw.js 로 만듭니다).
 *
 * 하는 일
 *   1. 처음 설치될 때 사이트 파일을 휴대폰에 저장해 둡니다(오프라인 대비).
 *   2. 페이지는 "인터넷 먼저, 안 되면 저장본" 순서로 엽니다. 그래서 가이드가
 *      고쳐지면 인터넷이 될 때 바로 새 내용을 보여 줍니다.
 *   3. 스크립트·그림은 이름에 버전 꼬리가 붙어 있어 "저장본 먼저"로 엽니다.
 *   4. 사이트를 새로 올리면 버전이 바뀌어 예전 저장본을 지웁니다.
 *
 * 하지 않는 일
 *   사용자가 쓴 엔딩노트 내용은 여기서 다루지 않습니다. 어디로도 보내지 않습니다.
 */
const VERSION = '__VERSION__';
const CACHE = `dajeongri-${VERSION}`;
const PRECACHE = __PRECACHE__;
const OFFLINE = '/offline/';

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(PRECACHE)).then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith('dajeongri-') && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return; // 글꼴 등 다른 사이트 파일은 건드리지 않습니다.

  // 페이지: 인터넷 먼저 → 저장본 → 오프라인 안내
  if (req.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const fresh = await fetch(req);
        if (fresh.ok) {
          const cache = await caches.open(CACHE);
          cache.put(url.pathname, fresh.clone());
        }
        return fresh;
      } catch {
        const cache = await caches.open(CACHE);
        return (await cache.match(url.pathname, { ignoreVary: true })) || (await cache.match(OFFLINE, { ignoreVary: true })) || Response.error();
      }
    })());
    return;
  }

  // 그 밖의 파일: 저장본 먼저 → 없으면 인터넷
  //
  // ignoreVary 를 꼭 켜 둡니다(2026-10-27 검수 때 발견). 서버가 "Vary: Origin"
  // 머리말을 붙이면, 처음 저장할 때와 스크립트를 불러올 때의 요청 모양이 달라
  // 저장본을 못 찾고 인터넷이 없을 때 작성기가 멈췄습니다.
  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const hit = await cache.match(req, { ignoreSearch: true, ignoreVary: true });
    if (hit) return hit;
    const res = await fetch(req);
    if (res.ok) cache.put(req, res.clone());
    return res;
  })());
});
