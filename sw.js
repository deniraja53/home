// Memuat Pustaka Workbox
importScripts(
  "https://gcore.jsdelivr.net/npm/workbox-sw@latest/build/workbox-sw.js"
);

// ==================== Konfigurasi Kontrol Versi ====================
const APP_VERSION = "v2.1.1";
const CACHE_PREFIX = "Deni";

// Pengaturan Aturan Penamaan Cache
workbox.core.setCacheNameDetails({
  prefix: CACHE_PREFIX,
  suffix: APP_VERSION,
});

workbox.core.skipWaiting();
workbox.core.clientsClaim();

// Paksa kontrol halaman diambil alih sekarang
self.addEventListener("activate", (event) => {
  event.waitUntil(
    self.clients.claim().then(() => {
      // Segera beri tahu semua halaman setelah aktif
      self.clients.matchAll().then((clients) => {
        clients.forEach((client) => {
          client.postMessage({
            type: "VERSION_INFO",
            version: APP_VERSION,
          });
        });
      });
    })
  );
});

//Dengarkan pesan dan kembalikan versi
self.addEventListener("message", (event) => {
  if (event.data.type === "GET_VERSION") {
    event.source.postMessage({
      type: "VERSION_INFO",
      version: APP_VERSION, // Teruskan nomor versi
    });
  }
});

// ==================== Logika pembersihan cache ====================
self.addEventListener("activate", (event) => {
  const cacheWhitelist = [CACHE_PREFIX + "-" + APP_VERSION];

  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (!cacheWhitelist.some((v) => cacheName.includes(v))) {
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log(`[SW ${APP_VERSION}] 旧缓存清理完成`);
      })
  );
});

// ==================== Konfigurasi Pra-cache ====================
workbox.precaching.precacheAndRoute([
  { url: "/", revision: APP_VERSION },
  { url: "/index.html", revision: APP_VERSION },
]);

// ==================== Strategi Cache Dinamis ====================

// 1. halaman HTML - Jaringan Pertama
workbox.routing.registerRoute(
  ({ request }) => request.destination === "document",
  new workbox.strategies.NetworkFirst({
    cacheName: `${CACHE_PREFIX}-html-${APP_VERSION}`,
    networkTimeoutSeconds: 2,
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 15,
        maxAgeSeconds: 12 * 60 * 60,
      }),
    ],
  })
);

// 2. Sumber Daya Statis (JS/CSS) - segar saat diperbarui
workbox.routing.registerRoute(
  ({ request }) => ["script", "style"].includes(request.destination),
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: `${CACHE_PREFIX}-static-${APP_VERSION}`,
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 40,
        maxAgeSeconds: 30 * 24 * 60 * 60,
      }),
    ],
  })
);

// 3. Gambar - Cache Pertama
workbox.routing.registerRoute(
  ({ request }) => request.destination === "image",
  new workbox.strategies.CacheFirst({
    cacheName: `${CACHE_PREFIX}-images-${APP_VERSION}`,
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 60,
        maxAgeSeconds: 60 * 24 * 60 * 60,
        maxSizeBytes: 10 * 1024 * 1024, // 10MB batas
      }),
    ],
  })
);

// 4. CDN Sumber Daya - Cache Pertama
workbox.routing.registerRoute(
  /^https:\/\/gcore\.jsdelivr\.net/,
  new workbox.strategies.CacheFirst({
    cacheName: `${CACHE_PREFIX}-cdn-${APP_VERSION}`,
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 30,
        maxAgeSeconds: 60 * 24 * 60 * 60,
        maxSizeBytes: 5 * 1024 * 1024, // 5MB batas
      }),
    ],
  })
);

// ==================== Memeriksa Konsol Browser ====================
console.log(`[Service Worker ${APP_VERSION}] aktif dan berjalan`);

// Display versi di konsol
// console.clear();
let styleTitle1 = `
font-size: 20px;
font-weight: 600;
color: rgb(244,167,89);
`;
let styleTitle2 = `
font-size:16px;
color: rgb(244,167,89);
`;
let styleContent = `
color: rgb(30,152,255);
`;
let title1 = "DeniのHome";
let title2 = `
==============================
#   #    #   #   # #   # #####
#   #   # #   # #  ##  # #
# # #  #####   #   # # # #####
## ##  #   #   #   #  ## #
#   #  #   #   #   #   # #####
==============================
`;
let content = `
Nomor Versi: ${APP_VERSION}
Tangga Pembaruan: 2025-07-25

Halaman Utama:  https://home.3301.qzz.io
Github:  https://github.com/deniraja53
`;
console.log(
  `%c${title1} %c${title2}
%c${content}`,
  styleTitle1,
  styleTitle2,
  styleContent
);
