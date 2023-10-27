import { initializeApp } from "firebase/app";
import { getDatabase, connectDatabaseEmulator, ref, set } from "firebase/database";


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

import { getAuth, connectAuthEmulator } from "firebase/auth";

const auth = getAuth();
connectAuthEmulator(auth, "http://127.0.0.1:9099");

// Get a reference to the database service
// const db = getDatabase(app);
// if (window.location.hostname === "127.0.0.1") {
//   connectDatabaseEmulator(db, "127.0.0.1", 9000); 
// }
// Create a reference
// const dbRef = ref(db, 'discussion_log'); 


// /* mock/stub firebase */

// //DEFINE INITIAL DATA STORAGE
// const MOCK_INITIAL_DATA = {
//   "alex": {
//     "0": {
//       "dislikes": 0,
//       "likes": 100,
//       "numPosts": 45,
//       "post": "Hey there, I just wanted to share how impressed I am with ChatGPT! As an administrator, I'm constantly looking for ways to streamline our workflow and improve our communication, and ChatGPT has been a game-changer. Its natural language processing and ability to generate human-like responses is truly amazing. I'm blown away by the way ChatGPT can understand and interpret complex questions and provide thoughtful answers. It has saved us so much time and effort, and has greatly enhanced our ability to serve our clients. Thank you, ChatGPT, for being such an innovative and valuable tool!",
//       "timestamp": 1320224640000,
//       "topic": "ChatGPT is so cool!",
//       "totalPoints": 4586,
//       "userId": "User1",
//       "userImg": "/img/User1.jpg",
//       "userName": "Ashley Williams",
//       "userRole": "System Administrator"
//     },
//     "1": {
//       "dislikes": 0,
//       "likes": 10,
//       "numPosts": 450,
//       "post": "As a data scientist, I'm constantly exploring new ways to extract insights from data. ChatGPT has been an incredible resource in this regard. Its ability to process and analyze large volumes of text data has greatly expanded our capabilities in natural language processing and sentiment analysis. With ChatGPT, we've been able to quickly and accurately analyze customer feedback and social media conversations, gaining valuable insights into our clients' needs and preferences. It's been amazing to see how ChatGPT's advanced algorithms and machine learning capabilities can help us uncover patterns and trends that would have been nearly impossible to detect otherwise. I'm truly grateful for the contributions ChatGPT has made to our data science efforts, and I look forward to continuing to explore all the ways it can help us make better decisions and drive better outcomes.",
//       "timestamp": 1320162120000,
//       "topic": "ChatGPT is so useful!",
//       "totalPoints": 1234,
//       "userId": "User2",
//       "userImg": "/img/User2.jpg",
//       "userName": "Brandon Nguyen",
//       "userRole": "Data Scientist"
//     },
//     "2": {
//       "dislikes": 0,
//       "likes": 0,
//       "numPosts": 100,
//       "post": "As a product manager, I'm always on the lookout for ways to enhance our products and services and meet our customers' evolving needs. ChatGPT has been an incredible asset in this regard. Its natural language processing and machine learning capabilities have enabled us to create highly personalized and engaging user experiences. By integrating ChatGPT into our customer service and support channels, we've been able to improve our response times, increase customer satisfaction, and reduce overall support costs. Additionally, ChatGPT has allowed us to gain deeper insights into customer behavior and preferences, which has informed our product development and marketing efforts. I'm continually impressed by the flexibility and power of ChatGPT, and I'm excited to explore all the ways it can help us drive innovation and growth across our product portfolio.",
//       "timestamp": 1320161040000,
//       "topic": "AI is advancing for the better",
//       "totalPoints": 10000,
//       "userId": "User3",
//       "userImg": "/img/User3.jpg",
//       "userName": "Rachel Davis",
//       "userRole": "Product Manager"
//     },
//     "-NQPgf2uVdHWc7zFiw-p": {
//       "dislikes": 0,
//       "likes": 0,
//       "post": "I love using chatgpt :D",
//       "timestamp": 1678706389215,
//       "topic": "ChatGPT IS AWESOME!",
//       "userId": "DCq5rd3SARQE3jhKsBvmCKldFDO2",
//       "userImg": "https://lh3.googleusercontent.com/a/AGNmyxbq5ufVicjRtof1zRHonZZsaVA8RvN8aDLTEaC3=s96-c",
//       "userName": "Joseph K N Tran",
//       "userRole": ""
//     },
//     "-NQR6jMWSCRHxi1hhGO5": {
//       "dislikes": 0,
//       "likes": 0,
//       "post": "So very cool ",
//       "timestamp": 1678730261974,
//       "topic": "SO cool",
//       "userId": "4eoENSBx4XeyMafUnLfdlx4nykd2",
//       "userImg": "/img/null.png",
//       "userName": "HP",
//       "userRole": ""
//     },
//     "-NQTQY-uIYdvonZxuIaW": {
//       "dislikes": 0,
//       "likes": 0,
//       "post": "Pro: One of the most significant positive reasons to use ChatGPT is its ability to provide quick and accurate responses to a wide range of queries. As a language model trained on vast amounts of data, ChatGPT can provide high-quality responses to a diverse range of questions, including general knowledge questions, medical inquiries, technical problems, and more. ChatGPT can be an excellent resource for people who need fast and reliable answers to their questions.\n\nCon: One of the negative reasons to use ChatGPT is that it can sometimes provide incomplete or inaccurate responses to queries. While ChatGPT is an advanced language model that has been trained on vast amounts of data, it is still an artificial intelligence system and may not always understand the nuances of language or the context of a given question. As a result, ChatGPT may occasionally provide incorrect or incomplete information, which could potentially lead to confusion or misinformation. Users should always exercise caution and verify information provided by ChatGPT with additional sources where necessary.",
//       "timestamp": 1678769008660,
//       "topic": "PRO/CONS of ChatGPT",
//       "userId": "sbEV8SEXgUQrNeOJO81DSOWr6Vp2",
//       "userImg": "/img/null.png",
//       "userName": "Vivian Hung",
//       "userRole": ""
//     },
//     "-NQXAm7-ti-9xj3v3gW8": {
//       "dislikes": 0,
//       "likes": 0,
//       "post": "s",
//       "timestamp": 1678831985807,
//       "topic": "s",
//       "userId": "zPsSOUexajbKKYakEQU7I0KHxSn2",
//       "userImg": "/img/null.png",
//       "userName": "s",
//       "userRole": ""
//     },
//     "-NQXOkEiyIXVBrmaBoz2": {
//       "dislikes": 0,
//       "likes": 0,
//       "post": "Did this post work? Would chatgpt help me?",
//       "timestamp": 1678835646980,
//       "topic": "Tims question about ChatGPT (while grading)",
//       "userId": "OjXXPQD98mTfio0rr0WO7IT8Ezl1",
//       "userImg": "/img/null.png",
//       "userName": "D User",
//       "userRole": ""
//     }
//   },
// }

// //DEFINE LOGGED IN USER
// const MOCK_USER = {
//   displayName: "Dr. Mock",
//   email: "mock@mock.com",
//   photoUrl: null,
//   uid: "ABCDEF123456789"
// }

// /////////////////////////////

// class MockDatabase {
//   constructor() {
//     this.data = MOCK_INITIAL_DATA;
//     this.listeners = [];
//   }

//   register(ref, callback) {
//     const index = this.listeners.push({ ref: ref, callback: callback })
//     const off = (() => {
//       this.listeners[index] = null; //remove
//     }).bind(this);
//     return off;
//   }

//   notifyAll() {
//     for (const listenerObj of this.listeners) {
//       if (listenerObj) {
//         listenerObj.callback(new MockSnapshot(listenerObj.ref));
//       }
//     }
//   }

//   set(pathSegments, newData) {
//     let pointer = this.data;
//     for (let i = 0; i < pathSegments.length - 1; i++) {
//       pointer = pointer[pathSegments[i]]
//     }
//     pointer[pathSegments[pathSegments.length - 1]] = newData

//     this.notifyAll();
//   }

//   push(pathSegments, newData) {
//     let pointer = this.data;
//     for (let i = 0; i < pathSegments.length; i++) {
//       pointer = pointer[pathSegments[i]]
//     }
//     const mockHash = `mock${Object.keys(pointer).length}`
//     pointer[mockHash] = newData; //assign!

//     this.notifyAll();
//   }
//  }

// class MockRef {
//   constructor(db, path) {
//     this.db = db;
//     this.pathSegments = path.split('/');
//   }

//   register(callback) {
//     return this.db.register(this, callback)
//   }

//   set(obj) {
//     this.db.set(this.pathSegments, obj)
//   }
//   push(obj) {
//     this.db.push(this.pathSegments, obj)
//   }

//   _getPathString() {
//     return this.pathSegments.join('/')
//   }

// }

// class MockSnapshot {
//   constructor(ref) {
//     this.ref = ref
//   }

//   val() {
//     const value = this.ref.pathSegments.reduce((acc, child) => {
//       return acc ? acc[child] : null
//     }, this.ref.db.data) //access data directly
//     return value;
//   }
// }

// jest.mock('firebase/database', () => {

//   console.log("initializing mock firebase");

//   const db = new MockDatabase();

//   const mockDatabase = {
//     getDatabase: () => {
//       return db; //return object for debugging
//     },
//     ref: (db, path) => new MockRef(db, path),
//     child: (oldRef, path) => new MockRef(oldRef.db, oldRef._getPathString()+"/"+path),
//     set: (ref, obj) => {
//       return new Promise((resolve, reject) => {
//         ref.set(obj)
//       })
//     },
//     push: (ref, obj) => {
//       return new Promise((resolve, reject) => {
//         ref.push(obj)
//       })
//     },
//     onValue: (ref, callback) => {
//       //NOTE: all listeners are at db level, not at reference level
//       const off = ref.register(callback)
//       callback(new MockSnapshot(ref)); //execute callback initially!
//       return off; //off function
//     },
//     get: (ref) => {
//       return new Promise((resolve, reject) => {
//         resolve(new MockSnapshot(ref))
//       })
//     }
//   }
//   return mockDatabase;
// })


// class MockAuth { }

// jest.mock('firebase/auth', () => {

//   const auth = new MockAuth();

//   return {
//     getAuth: () => {
//       return auth;
//     },
//     signOut: async () => {},
//     onAuthStateChanged: (auth, callback) => {
//       callback(MOCK_USER); //"log in" the mock user
//       return () => { } //off
//     },
//     EmailAuthProvider: { PROVIDER_ID: 1 },
//     GoogleAuthProvider: { PROVIDER_ID: 2 }
//   }
// })
