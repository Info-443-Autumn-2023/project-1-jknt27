import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getDatabase, connectDatabaseEmulator } from "firebase/database";

// Web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC6b_eRytm05CFQ8ISFhdOGqe1DdaFeXCo",
  authDomain: "chatgpt-a-brief-rendition.firebaseapp.com",
  databaseURL: "http://127.0.0.1:9000/?ns=chatgpt-a-brief-rendition",
  projectId: "chatgpt-a-brief-rendition",
  storageBucket: "chatgpt-a-brief-rendition.appspot.com",
  messagingSenderId: "1033318203301",
  appId: "1:1033318203301:web:c6b335e82eeabbc3f1724c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getDatabase();
if (window.location.hostname === "localhost") {
  connectDatabaseEmulator(db, "127.0.0.1", 9000);
}


const auth = getAuth();
connectAuthEmulator(auth, "http://127.0.0.1:9099");
