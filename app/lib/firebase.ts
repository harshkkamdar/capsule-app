import { initializeApp } from '@firebase/app';
import { getAuth, browserLocalPersistence, setPersistence } from '@firebase/auth';
import { getFirestore } from '@firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
    apiKey: "AIzaSyDq_xOoQukJBGz6ajDX0yCkSDcF17I_fKA",
    authDomain: "capsule-app-439d9.firebaseapp.com",
    projectId: "capsule-app-439d9",
    storageBucket: "capsule-app-439d9.firebasestorage.app",
    messagingSenderId: "835211786495",
    appId: "1:835211786495:web:39b77c91a3a51f824274ca"
};

const app = initializeApp(firebaseConfig);

// Initialize Auth
const auth = getAuth(app);

// Set persistence using the correct type
setPersistence(auth, browserLocalPersistence);

const db = getFirestore(app);

export { auth, db }; 