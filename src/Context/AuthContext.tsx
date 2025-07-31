import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, onSnapshot, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

export interface User {
  uid: string;
  username: string;
  pfpUrl: string;
  ThrashID: number;
  bal: number;
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  loading: boolean;
  logOut: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true); // ✅ loading state

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        const uid = fbUser.uid;
        const userRef = doc(db, "users", uid);

        const userSnap = await getDoc(userRef);
        let baseUser: User;

        if (userSnap.exists()) {
          baseUser = userSnap.data() as User;
        } else {
          baseUser = {
            bal: 0,
            uid,
            username: fbUser.displayName || "Anonymous",
            pfpUrl: fbUser.photoURL || "",
            ThrashID: Math.floor(10000 + Math.random() * 90000),
          };
          await setDoc(userRef, baseUser);
        }

        setUser(baseUser);
        setLoggedIn(true);

        const unsubscribeSnapshot = onSnapshot(userRef, (docSnap) => {
          if (docSnap.exists()) {
            const updatedData = docSnap.data() as User;
            setUser((prev) => (prev ? { ...prev, bal: updatedData.bal } : updatedData));
          }
        });

        setLoading(false); // ✅ done loading after setup
        return unsubscribeSnapshot;
      } else {
        setUser(null);
        setLoggedIn(false);
        setLoading(false); // ✅ done loading even if user is null
      }
    });

    return () => unsubscribeAuth();
  }, []);

  const logOut = () => {
    signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, loading, logOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within AuthProvider");
  }
  return context;
};
