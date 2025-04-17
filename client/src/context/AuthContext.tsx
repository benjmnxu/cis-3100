import { createContext, useContext, useState, ReactNode } from "react";

type User = {
  id: number;
  email: string;
  created_at?: string;
};

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const BASE_URL = "http://localhost:8000/api";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string) => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) throw new Error("Login failed");

    const { id } = await res.json();

    const profileRes = await fetch(`${BASE_URL}/user/${id}`, {
      credentials: "include",
    });

    if (!profileRes.ok) throw new Error("Failed to fetch user profile");

    const fullUser = await profileRes.json();
    setUser(fullUser);
  };

  const signup = async (email: string, password: string) => {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) throw new Error("Signup failed");

    await login(email, password); // auto-login after signup
  };

  const logout = async () => {
    await fetch(`${BASE_URL}/auth/logout`, {
      method: "GET",
      credentials: "include",
    });

    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
