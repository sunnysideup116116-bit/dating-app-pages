// Firebase Cloud Messaging service worker for the Folks web app.
// Handles background push notifications while the app is closed or in the
// background. The Flutter app itself registers this file via
// FirebaseMessaging.getToken() (firebase_messaging_web).
//
// NOTE: the Firebase config below must match lib/firebase_options.dart (web),
// and the deployed path (/dating-app-pages/) must match the GitHub Pages repo.
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: 'AIzaSyAlDuYjKw2NvMNUAGbG_lEEMdYqckZFm4k',
  appId: '1:646275855157:web:e0de223894b88e5f7e927c',
  messagingSenderId: '646275855157',
  projectId: 'mis-project-753b3',
  authDomain: 'mis-project-753b3.firebaseapp.com',
  storageBucket: 'mis-project-753b3.firebasestorage.app',
  measurementId: 'G-69FVLMD7CW',
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  // Notification payloads are displayed automatically by FCM. Only data-only
  // messages need a manual notification, otherwise Chrome shows duplicates.
  if (payload.notification) return;
  const appRoot = new URL('../', self.registration.scope);
  self.registration.showNotification('新訊息', {
    body: payload.data?.body ?? '',
    icon: new URL('icons/Icon-192.png', appRoot).pathname,
    badge: new URL('icons/Icon-192.png', appRoot).pathname,
    data: payload.data ?? {},
    tag: payload.data?.chat_tag,
  });
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const raw = event.notification.data ?? {};
  const data = raw.FCM_MSG?.data ?? raw.data ?? raw;
  const appRoot = new URL('../', self.registration.scope);
  const openUrl = new URL(appRoot);
  for (const key of [
    'chat_surface',
    'chat_conversation_id',
    'chat_contact_id',
    'chat_contact_name',
    'chat_ai_room_id',
    'chat_message_kind',
    'chat_sender_id',
  ]) {
    openUrl.searchParams.set(`push_${key}`, data[key] ?? '');
  }
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) => {
      for (const client of list) {
        if ('focus' in client && client.url.startsWith(appRoot.href)) {
          client.postMessage({ type: 'folks-notification-click', data });
          return client.focus();
        }
      }
      return clients.openWindow(openUrl.href);
    }),
  );
});
