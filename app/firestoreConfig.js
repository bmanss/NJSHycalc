import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { connectFirestoreEmulator } from "firebase/firestore";
export const firebaseConfig = {
  apiKey: "AIzaSyCj7xZR1OTL4JQsPOR3D6vEG1dJmjZ3VQ4",
  authDomain: "hycalc-6a04e.firebaseapp.com",
  projectId: "hycalc-6a04e",
  storageBucket: "hycalc-6a04e.appspot.com",
  messagingSenderId: 927962648295,
  appId: "1:927962648295:web:de4d4f95caf1c9077e5c42",
  measurementId: "543bfc94-e9c7-4f1e-8a52-c46747d0b1eb",
};

let firestoreDB;
export function getFirestoreDB() {
  if (!firestoreDB) {
    // Check if any Firebase apps have been initialized
    if (!getApps().length) {
      // If not, initialize Firebase with the config object
      initializeApp(firebaseConfig);
    } else {
      // If already initialized, use the existing app
      getApp();
    }

    // Get the Firestore instance from the initialized app
    firestoreDB = getFirestore();

    // Connect to the Firestore emulator in development mode
    if (process.env.NODE_ENV === "development") {
      connectFirestoreEmulator(firestoreDB, "localhost", 8080);
    }
  }

  return firestoreDB;
}
