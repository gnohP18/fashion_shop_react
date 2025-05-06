/* global self, importScripts, firebase */

importScripts("https://www.gstatic.com/firebasejs/9.22.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.22.1/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyAbiiSZqe3oyjOG2uNEKsEgLocn-AaJZAw",
  authDomain: "pbl5-5c533.firebaseapp.com",
  projectId: "pbl5-5c533",
  storageBucket: "pbl5-5c533.firebasestorage.app",
  messagingSenderId: "270133827071",
  appId: "1:270133827071:web:4d34859e6bbffb5edc03ca",
  measurementId: "G-MF4SC7N9KP"
});

// Lấy instance của messaging
const messaging = firebase.messaging();

// Xử lý background messages
messaging.onBackgroundMessage((payload) => {
  console.log("[firebase-messaging-sw.js] Received background message: ", payload);

  const notificationTitle = payload.notification.title || "Thông báo";
  const notificationOptions = {
    body: payload.notification.body,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
