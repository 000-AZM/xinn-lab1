// js/firebase-config.js

// Firebase SDK scripts must be included in your HTML before this file

const firebaseConfig = {
  apiKey: "AIzaSyBoO7_HaCFzzEjm8G_F5O4uYf2_9O-tnik",
  authDomain: "tele-bot-xinn.firebaseapp.com",
  databaseURL: "https://tele-bot-xinn-default-rtdb.firebaseio.com",
  projectId: "tele-bot-xinn",
  storageBucket: "tele-bot-xinn.firebasestorage.app",
  messagingSenderId: "223868480659",
  appId: "1:223868480659:web:e57ebf544d55f2c8873166",
  measurementId: "G-CPGFR2DY8S"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
