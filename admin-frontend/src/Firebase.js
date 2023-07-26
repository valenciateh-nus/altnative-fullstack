import firebase from "firebase/app";
import "firebase/messaging";
import { updateNotificationToken } from "./API/notificationApi";

const firebaseConfig = {
    apiKey: "AIzaSyAtHgjNDuFKkR1ItyJcPYYJs7rXSjsoRgc",
    authDomain: "altnative-29340.firebaseapp.com",
    projectId: "altnative-29340",
    storageBucket: "altnative-29340.appspot.com",
    messagingSenderId: "598889183512",
    appId: "1:598889183512:web:42837d20a2b3169516866d"
  };

firebase.initializeApp(firebaseConfig);
let messaging = null;
if (firebase.messaging.isSupported()) {
  messaging = firebase.messaging();
}
const { REACT_APP_VAPID_KEY } = process.env.REACT_APP_VAPID_KEY
const publicKey = REACT_APP_VAPID_KEY;

export const getToken = async (setTokenFound) => {
    let currentToken = '';
    try {
      currentToken = await messaging.getToken({vapidKey: publicKey});
      if (currentToken) {
        console.log("CURR FIREBASE TOKEN: ", currentToken);

        // alert('helol')
        // const targetresponse = notificationApi.sendTargetedNotification({ target: currentToken, title: 'test notif', message: 'hello alt.native' });
        // if(targetresponse) {
        //   console.log("success" + currentToken);
        // } 
        // const subresponse = notificationApi.subscribeToTopic({ topic: 'order success', subscriber: currentToken });
        // if(subresponse) {
        //   console.log("success" + currentToken);
        // } 
        await updateNotificationToken(currentToken);
        setTokenFound(true);
      } else {
        setTokenFound(false);
      }
    } catch (error) {
      console.log('An error occurred while retrieving token.', error);
    }
    return currentToken;
  };

  export const onMessageListener = () =>
  new Promise((resolve) => {
    messaging.onMessage((payload) => {
      resolve(payload);
    });
  });
