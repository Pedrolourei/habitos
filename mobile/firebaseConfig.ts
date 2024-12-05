import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyC7KNB4aaTHRanXkAhPvaLhxX8_h1_5d_E",
    authDomain: "job-app-vagas.firebaseapp.com",
    databaseURL: "https://job-app-vagas-default-rtdb.firebaseio.com",
    projectId: "job-app-vagas",
    storageBucket: "job-app-vagas.firebasestorage.app",
    messagingSenderId: "276143802130",
    appId: "1:276143802130:web:67dab5e336f0cf57f4d5cb",
    measurementId: "G-5DK7M84KH9"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const firestore = getFirestore(app);

export { auth, firestore };
