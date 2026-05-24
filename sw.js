// =============================================
// Service Worker – LKW & Bus Quiz PWA
// الإصدار: غيّر هذا الرقم كلما عدّلت الملفات
// =============================================
const CACHE_NAME = 'lkw-quiz-v1';

// الملفات التي سيتم تخزينها offline
const FILES_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json'
];

// ===== INSTALL: يحدث مرة واحدة عند أول تحميل =====
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  // ينشّط الـ SW فوراً بدون انتظار
  self.skipWaiting();
});

// ===== ACTIVATE: يحذف الكاش القديم عند التحديث =====
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keyList) =>
      Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

// ===== FETCH: يعيد الملف من الكاش لو موجود، وإلا من الإنترنت =====
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // لو موجود في الكاش → رجّعه فوراً (offline يشتغل)
      if (cachedResponse) {
        return cachedResponse;
      }
      // لو مش موجود → اجلبه من الإنترنت
      return fetch(event.request);
    })
  );
});
