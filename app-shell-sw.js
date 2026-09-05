
const VERSION = "e09f1ac6041edbc2cd98";
const FILES = [".last_build_id", "assets/AssetManifest.bin", "assets/AssetManifest.bin.json", "assets/FontManifest.json", "assets/NOTICES", "assets/assets/animation/%E6%82%84%E6%82%84%E8%A9%B1%20%E5%A5%87%E6%80%AA%E7%89%88.webp", "assets/assets/animation/%E6%82%84%E6%82%84%E8%A9%B1%20%E6%AD%A3%E5%B8%B8%E7%89%88.webp", "assets/assets/animation/%E6%83%B3%E5%88%B0%E4%BA%86.webp", "assets/assets/animation/Loading%E6%83%B3%E5%88%B0%E4%BA%86.webp", "assets/assets/animation/Loading.webp", "assets/assets/fonts/NotoSansTC-OFL.txt", "assets/assets/fonts/NotoSansTC.ttf", "assets/assets/fonts/OFL.txt", "assets/assets/fonts/PlusJakartaSans-Bold.ttf", "assets/assets/fonts/PlusJakartaSans-ExtraBold.ttf", "assets/assets/fonts/PlusJakartaSans-Medium.ttf", "assets/assets/fonts/PlusJakartaSans-Regular.ttf", "assets/assets/fonts/PlusJakartaSans-SemiBold.ttf", "assets/assets/images/%E7%B5%A6%20Sender%E7%9A%84%20-%20Warning%20.webp", "assets/assets/images/%E7%B5%A6Sender%E7%9A%84-Restricted%20.webp", "assets/assets/images/%E8%AC%9B%E6%82%84%E6%82%84%E8%A9%B1.webp", "assets/assets/images/App%20Icon.webp", "assets/assets/images/NavBar%20%E4%BD%BF%E7%94%A8%E8%80%85%E4%B8%BB%E9%A0%81.webp", "assets/assets/images/NavBar%20%E6%84%9B%E5%BF%83.webp", "assets/assets/images/NavBar%20%E8%A8%8A%E6%81%AF-1.webp", "assets/assets/images/otter_background_light.webp", "assets/assets/images/otter_background_light2.webp", "assets/assets/images/otter_mascot_1.webp", "assets/assets/images/otter_mascot_2.webp", "assets/fonts/MaterialIcons-Regular.otf", "assets/packages/cupertino_icons/assets/CupertinoIcons.ttf", "assets/packages/liquid_glass_widgets/shaders/interactive_indicator.frag", "assets/packages/liquid_glass_widgets/shaders/lightweight_glass.frag", "assets/packages/liquid_glass_widgets/shaders/liquid_glass_final_render.frag", "assets/packages/liquid_glass_widgets/shaders/liquid_glass_geometry_blended.frag", "assets/shaders/ink_sparkle.frag", "assets/shaders/stretch_effect.frag", "cache_bridge.js", "canvaskit/canvaskit.js", "canvaskit/canvaskit.wasm", "canvaskit/chromium/canvaskit.js", "canvaskit/chromium/canvaskit.wasm", "canvaskit/experimental_webparagraph/canvaskit.js", "canvaskit/experimental_webparagraph/canvaskit.wasm", "canvaskit/skwasm.js", "canvaskit/skwasm.wasm", "canvaskit/skwasm_heavy.js", "canvaskit/skwasm_heavy.wasm", "canvaskit/wimp.js", "canvaskit/wimp.wasm", "favicon.png", "firebase-messaging-sw.js", "flutter.js", "flutter_bootstrap.js", "icons/Icon-192.png", "icons/Icon-512.png", "icons/Icon-maskable-192.png", "icons/Icon-maskable-512.png", "index.html", "main.dart.js", "manifest.json", "version.json"];
const PREFIX = 'folks-shell-' + new URL(self.registration.scope).pathname + '-';
const CACHE = PREFIX + VERSION;
const resources = new Set(FILES.map(file => new URL(file.split('/').map(encodeURIComponent).join('/'), self.registration.scope).href));
self.addEventListener('install', event => {
  // If any resource fails, keep the previous complete version.
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll([...resources])));
});
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    for (const key of await caches.keys()) {
      if (key.startsWith(PREFIX) && key !== CACHE) await caches.delete(key);
    }
    await self.clients.claim();
  })());
});
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  const scope = new URL(self.registration.scope);
  if (url.origin !== scope.origin) return;
  let key = url.href.split('?')[0];
  if (event.request.mode === 'navigate' && (url.pathname === scope.pathname || url.pathname === scope.pathname + 'index.html')) {
    key = new URL('index.html', scope).href;
  }
  // No API responses, credentials, user images, or unknown paths enter this cache.
  if (!resources.has(key)) return;
  event.respondWith(caches.open(CACHE).then(async cache => (await cache.match(key)) || fetch(event.request)));
});
