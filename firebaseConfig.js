// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCvbM6YypaUU2nPMHwx9qbNB_7P1JZyLDI",
  authDomain: "applocacao-adroid-ios-g.firebaseapp.com",
  projectId: "applocacao-adroid-ios-g",
  storageBucket: "applocacao-adroid-ios-g.appspot.com",
  messagingSenderId: "1033125349700",
  appId: "1:1033125349700:web:b39e62383bbc26383eef11",
  measurementId: "G-9FRRYXNK1S"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
