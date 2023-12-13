// Import the functions you need from the SDKs you need
// import {firebase} from "firebase"
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import firebase from "firebase/compat/app"
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCXLAsebzzSfcoXOapmY7P7VhyyCx9smtY",
  authDomain: "keoghsport-logfiles.firebaseapp.com",
  projectId: "keoghsport-logfiles",
  storageBucket: "keoghsport-logfiles.appspot.com",
  messagingSenderId: "1046833789454",
  appId: "1:1046833789454:web:5328f857faa8324a01da5f",
  measurementId: "G-TDTE7CKWK6"

  // apiKey: "AIzaSyA3fCoNxry8r-3ADna0Ii3lOxU7wx8S778",
  // authDomain: "testenviroment-aa870.firebaseapp.com",
  // projectId: "testenviroment-aa870",
  // storageBucket: "testenviroment-aa870.appspot.com",
  // messagingSenderId: "556435674214",
  // appId: "1:556435674214:web:c23bee7bab1a9c822b89a7",
  // measurementId: "G-14DVBHHEDE"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
 
export default db;