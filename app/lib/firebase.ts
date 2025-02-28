import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, updateProfile } from 'firebase/auth';
import { getReactNativePersistence } from 'firebase/auth/react-native';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);

// Initialize Auth with React Native persistence
const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
});

const db = getFirestore(app);

const storage = getStorage(app);

// Function to update user profile
const updateUserProfile = async (displayName: string, photoURL?: string) => {
    const user = auth.currentUser;
    if (user) {
        try {
            await updateProfile(user, { 
                displayName,
                photoURL: photoURL || user.photoURL 
            });
            return true;
        } catch (error) {
            console.error("Error updating profile: ", error);
            throw error;
        }
    }
    return false;
};

export { auth, db, storage, updateUserProfile }; 