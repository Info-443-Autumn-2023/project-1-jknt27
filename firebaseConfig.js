import firebase from 'firebase/app';
// import { initializeApp } from "firebase/app";

import 'firebase/auth';
import 'firebase/firestore';

export const firebaseConfig = {
    apiKey: "AIzaSyC6b_eRytm05CFQ8ISFhdOGqe1DdaFeXCo",
    authDomain: "chatgpt-a-brief-rendition.firebaseapp.com",
    databaseURL: "https://chatgpt-a-brief-rendition-default-rtdb.firebaseio.com",
    projectId: "chatgpt-a-brief-rendition",
    storageBucket: "chatgpt-a-brief-rendition.appspot.com",
    messagingSenderId: "1033318203301",
    appId: "1:1033318203301:web:c6b335e82eeabbc3f1724c"
};
  
if (process.env.NODE_ENV === 'development') {
    firebaseConfig.authEmulatorHost = 'localhost:9099';
    firebaseConfig.databaseURL = 'http://localhost:9000?ns=YOUR_NAMESPACE';
}

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

  export const auth = app.auth();
  export const firestore = app.firestore();
  export const database = firebase.database();