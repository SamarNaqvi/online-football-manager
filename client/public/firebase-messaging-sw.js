// online-football-manager/client/public/firebase-messaging-sw.js

importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyAa2Jox3xi6QiBOYxzd3gf8NewrldMu5K4",
  authDomain: "football-manager-db452.firebaseapp.com",
  projectId: "football-manager-db452",
  storageBucket: "football-manager-db452.firebasestorage.app",
  messagingSenderId: "985029294117",
  appId: "1:985029294117:web:76536f85e850216f3b67cc",
  measurementId: "G-ZBCS998C7M"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  // Customize notification here
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/firebase-logo.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});