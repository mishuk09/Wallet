// firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Your Firebase configuration object
const firebaseConfig = {
    apiKey: "AIzaSyCuYZu7rIuXjFftjLA5e6Gn6sYcPD2snVg",
    authDomain: "restaurant-app-25f83.firebaseapp.com",
    databaseURL: "https://restaurant-app-25f83.firebaseio.com",
    projectId: "restaurant-app-25f83",
    storageBucket: "restaurant-app-25f83.appspot.com",
    messagingSenderId: "774165530793",
    appId: "1:774165530793:web:a1765e1a2be6a6644801b8",
    measurementId: "G-EJB6J2E21C"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
