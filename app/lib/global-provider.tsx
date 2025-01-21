import React, { createContext, useContext, ReactNode, useEffect, useState } from "react";
import { User } from "firebase/auth";
import { auth, db } from "./firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { router } from "expo-router";

interface GlobalContextType {
  isLogged: boolean;
  user: ExtendedUser | null;
  loading: boolean;
  refetch: () => void;
  signOut: () => Promise<void>;
}

interface ExtendedUser {
  $id: string;
  name: string;
  email: string;
  avatar: string;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

interface GlobalProviderProps {
  children: ReactNode;
}

export const GlobalProvider = ({ children }: GlobalProviderProps) => {
  const [user, setUser] = useState<ExtendedUser | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserData = async (firebaseUser: User) => {
    try {
      const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
      
      const userData = {
        $id: firebaseUser.uid,
        name: firebaseUser.displayName || "",
        email: firebaseUser.email || "",
        avatar: firebaseUser.photoURL || "",
      };

      if (!userDoc.exists()) {
        // Create user document if it doesn't exist
        await setDoc(doc(db, "users", firebaseUser.uid), userData);
      }

      setUser(userData);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        await fetchUserData(firebaseUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const refetch = async () => {
    if (auth.currentUser) {
      await fetchUserData(auth.currentUser);
    }
  };

  const signOut = async () => {
    try {
      await auth.signOut();
      setUser(null);
      router.replace('/sign-in');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <GlobalContext.Provider
      value={{
        isLogged: !!user,
        user,
        loading,
        refetch,
        signOut,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = (): GlobalContextType => {
  const context = useContext(GlobalContext);
  if (!context)
    throw new Error("useGlobalContext must be used within a GlobalProvider");
  return context;
};

export default GlobalProvider;
