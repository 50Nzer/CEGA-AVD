import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAAG5lGEyykwtX66xrAqofN8EodfSI-Qs0",
  authDomain: "centro-estudiantes-5b396.firebaseapp.com",
  projectId: "centro-estudiantes-5b396",
  storageBucket: "centro-estudiantes-5b396.firebasestorage.app",
  messagingSenderId: "514117428974",
  appId: "1:514117428974:web:9f0502906fb0f1f90e75ff",
  measurementId: "G-FWTPPBK7NM"
};

const app = initializeApp(firebaseConfig);
const analytics = typeof window !== "undefined" ? getAnalytics(app) : null;
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export { auth, db, googleProvider, analytics };
