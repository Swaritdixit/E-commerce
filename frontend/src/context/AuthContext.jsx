import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(false);

  const saveSession = (token, nextUser) => {
    localStorage.setItem("token", token);
    if (nextUser) {
      localStorage.setItem("user", JSON.stringify(nextUser));
      setUser(nextUser);
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      const { data } = await api.post("/users/login", { email, password });

      const storedUser = {
        ...(data.user || {}),
        email: data.email || data.user?.email || email,
        name: data.name || data.user?.name,
        role: data.role || data.user?.role || "Customer",
        id: data.user?._id || data.user?.id || data.user,
      };

      saveSession(data.token, storedUser);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const register = async (form) => {
    setLoading(true);
    try {
      const { data } = await api.post("/users/register", form);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  useEffect(() => {
    const onStorage = () => {
      const saved = localStorage.getItem("user");
      setUser(saved ? JSON.parse(saved) : null);
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);