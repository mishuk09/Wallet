// firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

//connection string
const firebaseConfig = {
    apiKey: "AIzaSyCKIiMfDIhrWFI6boip05LUlhZMw-y8Q9Y",
    authDomain: "test-db-f78b1.firebaseapp.com",
    projectId: "test-db-f78b1",
    storageBucket: "test-db-f78b1.firebasestorage.app",
    messagingSenderId: "486095770828",
    appId: "1:486095770828:web:d23fa15c84534e608ade69"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
