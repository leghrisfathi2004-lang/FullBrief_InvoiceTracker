import { createContext, useContext, useEffect, useState } from "react";
import { login as apiLogin, getMe } from "../api/userAPI";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(!!token);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    const ftchUser = async () => {
      try {
        const res = await getMe();
        setUser(res.data);
      } catch {
        logout();
      } finally {
        setLoading(false);
      }
    };

    ftchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async ({ email, password }) => {
    const res = await apiLogin({ email, password });

    const newUser  = res.data.user;
    const newToken = res.data.token;

    localStorage.setItem("token", newToken);
    setToken(newToken);
    setUser(newUser);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
