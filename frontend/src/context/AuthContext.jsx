import { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signOut
} from "firebase/auth";

import { auth } from "../firebase";

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

            await fetch("http://localhost:5000/api/users/me", {
              method: "GET",
              headers: {
                Authorization: `Bearer ${idToken}`
              }
            });

            console.log("User synced with MongoDB");
          } catch (error) {
            console.error(
              "Failed to sync user with MongoDB:",
              error
            );
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