import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { STORAGE_AUTH_FCM_TOKEN } from "../constants/authentication";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STOGARE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};


const app = initializeApp(firebaseConfig);

const database = getDatabase(app);
const messaging = getMessaging(app);


export const requestPermissionAndGetToken = async () => {
  try {
    const token = await getToken(messaging, {
      vapidKey: process.env.REACT_APP_FIREBASE_VAPID_KEY
    });
    console.log("FCM Token:", token);
    localStorage.setItem(STORAGE_AUTH_FCM_TOKEN, token)
    return token;
  } catch (err) {
    console.error("Error getting FCM token:", err);
    return null;
  }
};

export const onForegroundMessage = (callback) => {
  return onMessage(messaging, (payload) => {
    console.log("FCM foreground message:", payload);
    callback(payload);
  });
};


export {
  app,
  database,
  messaging,
};
