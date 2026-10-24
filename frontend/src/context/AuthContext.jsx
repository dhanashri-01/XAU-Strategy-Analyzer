import { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signOut
} from "firebase/auth";

import { auth } from "../firebase";
import api from "../services/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (currentUser) => {
        setUser(currentUser);
        setLoading(false);

        if (currentUser) {
          try {
            const idToken = await currentUser.getIdToken();

            const response = await api.get("/users/me", {
              headers: { Authorization: `Bearer ${idToken}` },
            });
            if (!response.data?.success) {
              throw new Error("The account could not be synced with the API.");
            }
          } catch (error) {
            console.error("Failed to sync user with the API:", error);
          }
        }
      }
    );

    return unsubscribe;
  }, []);

  const logout = () => signOut(auth);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
