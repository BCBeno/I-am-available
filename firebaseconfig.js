import {getApp, getApps, initializeApp} from "firebase/app";
import {getFirestore} from 'firebase/firestore';
import {getReactNativePersistence, initializeAuth} from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
    apiKey: "AIzaSyA3RpZNMigoAwN8NnGRbJ5o3YKIHarSImI",
    authDomain: "i-am-available.firebaseapp.com",
    databaseURL: "https://i-am-available-default-rtdb.firebaseio.com/",
    projectId: "i-am-available",
    storageBucket: "i-am-available.appspot.com",
    messagingSenderId: "1007358203617",
    appId: "1:1007358203617:web:52ff965d2d525ac95349a0",
    measurementId: "G-YXB4YJQLR7"
};

//  Initialize Firebase app once
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

//  Always use initializeAuth (never getAuth)
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

//  Firestore setup
const db = getFirestore(app);

export { app, db, auth };
