import { createContext, useContext, useEffect, useState } from "react";
import { formatApiError } from "@/services/ApiClient";
import { authService } from "@/services/AuthService";

const AuthContext = createContext({
  user: null, token: null, loading: true,
  login: async () => {}, register: async () => {}, logout: () => {},
});

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => {
    try { return localStorage.getItem("elitec_token") || null; } catch { return null; }
  });
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function refresh() {
      if (!token) { setUser(null); setLoading(false); return; }
      try {
        const currentUser = await authService.getCurrentUser();
        if (!cancelled) setUser(currentUser);
      } catch {
        try { localStorage.removeItem("elitec_token"); } catch {}
        if (!cancelled) { setToken(null); setUser(null); }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    refresh();
    return () => { cancelled = true; };
  }, [token]);

  const login = async (email, password) => {
    try {
      const data = await authService.login(email, password);
      setToken(data.token);
      setUser(data.user);
      return data.user;
    } catch (err) {
      throw new Error(formatApiError(err, "Invalid credentials"));
    }
  };

  const register = async (payload) => {
    try {
      const data = await authService.register(payload);
      setToken(data.token);
      setUser(data.user);
      return data.user;
    } catch (err) {
      throw new Error(formatApiError(err, "Registration failed"));
    }
  };

  const logout = () => {
    authService.logout();
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
