importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js");

const firebaseConfig = {
    apiKey: "AIzaSyAtHgjNDuFKkR1ItyJcPYYJs7rXSjsoRgc",
    authDomain: "altnative-29340.firebaseapp.com",
    projectId: "altnative-29340",
    storageBucket: "altnative-29340.appspot.com",
    messagingSenderId: "598889183512",
    appId: "1:598889183512:web:42837d20a2b3169516866d"
  };
firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();
messaging.onBackgroundMessage(function (payload) {
  console.log("Received background message ", payload);
  const notificationTitle = payload.data.title;
    const notificationOptions = {
      body: payload.data.body,
      icon: "icon-512.png",
      tag: "notification-1"
  };
return self.registration.showNotification(
    notificationTitle,
    notificationOptions
  );
});