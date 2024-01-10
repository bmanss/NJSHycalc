import { initializeApp, getApps } from "firebase/app";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";

export const firebaseConfig = {
  apiKey: "AIzaSyCj7xZR1OTL4JQsPOR3D6vEG1dJmjZ3VQ4",
  authDomain: "hycalc-6a04e.firebaseapp.com",
  projectId: "hycalc-6a04e",
  storageBucket: "hycalc-6a04e.appspot.com",
  messagingSenderId: 927962648295,
  appId: "1:927962648295:web:de4d4f95caf1c9077e5c42",
  measurementId: "543bfc94-e9c7-4f1e-8a52-c46747d0b1eb",
};

function initLocalFirebase() {
  initializeApp(firebaseConfig);
  const firestoreDB = getFirestore();
  if (!firestoreDB._settingsFrozen) connectFirestoreEmulator(firestoreDB, "localhost", 8080);
}

export function getLocalFirestore() {
  const apps = getApps();
  if (!apps.length) initLocalFirebase();
  return getFirestore();
}
