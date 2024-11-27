// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBEmbjM2Nc3IX1oCVBqyNMBOvtWTdIBEdQ",
  authDomain: "audiocleaner-5dcff.firebaseapp.com",
  projectId: "audiocleaner-5dcff",
  storageBucket: "audiocleaner-5dcff.appspot.com",
  messagingSenderId: "588873080919",
  appId: "1:588873080919:web:0b7f2910af607a42e98312",
  measurementId: "G-FGVT9R6TGG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { auth };
export { storage };