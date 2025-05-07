import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA3RpZNMigoAwN8NnGRbJ5o3YKIHarSImI",
  authDomain: "i-am-available.firebaseapp.com",
  projectId: "i-am-available",
  storageBucket: "i-am-available.appspot.com",
  messagingSenderId: "1007358203617",
  appId: "1:1007358203617:web:52ff965d2d525ac95349a0",
  measurementId: "G-YXB4YJQLR7",
};

// Initialize Firebase only if no app has been initialized
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

export { app, db };
