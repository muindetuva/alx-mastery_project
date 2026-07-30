import { createContext, useContext, useMemo, useState } from "react";

const STORAGE_KEY = "pulseboard-user";
const AuthContext = createContext(null);

function restoreUser() {
  try {
    const savedUser = localStorage.getItem(STORAGE_KEY);
    return savedUser ? JSON.parse(savedUser) : null;
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(restoreUser);

  function login(account) {
    const nextUser = {
      email: account.email,
      name: account.name || account.email.split("@")[0],
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser));
    setUser(nextUser);
    return nextUser;
  }

  function logout() {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  }

  const value = useMemo(
    () => ({ user, login, logout, isAuthenticated: Boolean(user) }),
    [user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}
