// Import the functions you need from the SDKs you need
const { initializeApp } = require("firebase/app");
const {getAuth,createUserWithEmailAndPassword, signInWithEmailAndPassword,sendEmailVerification,deleteUser,updatePassword,sendPasswordResetEmail} =require("firebase/auth");
const { getStorage, ref, uploadBytes, uploadString, getDownloadURL, deleteObject  } = require('firebase/storage');
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDfVolhAVMPANn8NSBPD6cjcy3XR6-9wJU",
  authDomain: "propple-565a5.firebaseapp.com",
  projectId: "propple-565a5",
  storageBucket: "propple-565a5.appspot.com",
  messagingSenderId: "650017521239",
  appId: "1:650017521239:web:ec56ac1582c3326d48ad12",
  measurementId: "G-890R13248R"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const myStorage = getStorage(app, 'propple-565a5.appspot.com')
const storageRef = ref(myStorage)
const myAuth = getAuth(app);
module.exports = {
  storageRef,
  ref,
  uploadBytes,
  uploadString,
  myAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  deleteUser,
  updatePassword,
  sendPasswordResetEmail,
  getDownloadURL,
  deleteObject
}