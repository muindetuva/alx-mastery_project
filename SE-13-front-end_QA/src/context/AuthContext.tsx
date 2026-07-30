import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { loginRequest } from "../services/api";
import {
  authTokensSchema,
  userSchema,
  type AuthTokens,
  type User,
} from "../types/incident";

type AuthContextValue = {
  user: User | null;
  tokens: AuthTokens | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function restoreAuth() {
  try {
    const user = userSchema.parse(JSON.parse(localStorage.getItem("user") || "null"));
    const tokens = authTokensSchema.parse(JSON.parse(localStorage.getItem("tokens") || "null"));
    return { user, tokens };
  } catch {
    localStorage.removeItem("user");
    localStorage.removeItem("tokens");
    localStorage.removeItem("accessToken");
    return { user: null, tokens: null };
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const restored = useMemo(restoreAuth, []);
  const [user, setUser] = useState<User | null>(restored.user);
  const [tokens, setTokens] = useState<AuthTokens | null>(restored.tokens);

  async function login(email: string, password: string) {
    const response = await loginRequest(email, password);
    localStorage.setItem("user", JSON.stringify(response.user));
    localStorage.setItem("tokens", JSON.stringify(response.tokens));
    localStorage.setItem("accessToken", response.tokens.accessToken);
    setUser(response.user);
    setTokens(response.tokens);
  }

  function logout() {
    localStorage.removeItem("user");
    localStorage.removeItem("tokens");
    localStorage.removeItem("accessToken");
    setUser(null);
    setTokens(null);
  }

  const value = useMemo(() => ({ user, tokens, login, logout }), [user, tokens]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used inside AuthProvider");
  return value;
}
