// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAxOl9oiiwXVP3GOYrl7-PjIKi9gfmusW0",
    authDomain: "clarity-ai-c96ca.firebaseapp.com",
    projectId: "clarity-ai-c96ca",
    storageBucket: "clarity-ai-c96ca.firebasestorage.app",
    messagingSenderId: "186653284224",
    appId: "1:186653284224:web:15a0f6584509c387d75365"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export { app } 
