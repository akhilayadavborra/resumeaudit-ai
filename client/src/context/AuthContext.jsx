import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import api, { getErrorMessage } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUser = useCallback(async () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const { data } = await api.get("/api/auth/me");
      setUser(data);
    } catch {
      localStorage.clear();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const persistSession = (data, rememberMe) => {
    // "Remember Me" unchecked -> still store the token so refresh works during
    // the session, but we could clear it on browser close if needed later.
    localStorage.setItem("access_token", data.access_token);
    localStorage.setItem("refresh_token", data.refresh_token);
    localStorage.setItem("remember_me", rememberMe ? "true" : "false");
    setUser(data.user);
  };

  const signup = async (fullName, email, password) => {
    try {
      const { data } = await api.post("/api/auth/signup", {
        full_name: fullName,
        email,
        password,
      });
      persistSession(data, true);
      return { success: true };
    } catch (error) {
      return { success: false, message: getErrorMessage(error) };
    }
  };

  const login = async (email, password, rememberMe = true) => {
    try {
      const { data } = await api.post("/api/auth/login", { email, password });
      persistSession(data, rememberMe);
      return { success: true };
    } catch (error) {
      return { success: false, message: getErrorMessage(error) };
    }
  };
  const loginWithGoogle = async (googleIdToken) => {
    try {
      const { data } = await api.post("/api/auth/google-login", { id_token: googleIdToken });
      persistSession(data, true);
      return { success: true };
    } catch (error) {
      return { success: false, message: getErrorMessage(error) };
    }
  };

  const logout = async () => {
    try {
      await api.post("/api/auth/logout");
    } catch {
      // ignore - proceed with client-side logout regardless
    }
    localStorage.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signup, login, loginWithGoogle, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);