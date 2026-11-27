
import { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";

const AppContext = createContext();

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(
    localStorage.getItem("ss_token")
  );
  const [loading, setLoading] = useState(true);

  // Configure API token
  useEffect(() => {
    if (token) {
      api.defaults.headers.common.Authorization = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common.Authorization;
    }
  }, [token]);

  // Check logged-in user
  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await api.get("/user");
        setUser(response.data.user ?? response.data);
      } catch (error) {
        console.error("Authentication check failed:", error);
        localStorage.removeItem("ss_token");
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [token]);

  // Login
  const login = async (email, password) => {
    const response = await api.post("/login", {
      email,
      password,
    });

    const newToken = response.data.token;

    localStorage.setItem("ss_token", newToken);
    setToken(newToken);

    const userResponse = await api.get("/user", {
      headers: {
        Authorization: `Bearer ${newToken}`,
      },
    });

    setUser(userResponse.data.user ?? userResponse.data);

    return userResponse.data;
  };



  // Register
  const register = async (name, email, password, password_confirmation) => {
    const response = await api.post("/register", {
      name,
      email,
      password,
      password_confirmation,
    });

    const newToken = response.data.token;

    localStorage.setItem("ss_token", newToken);
    setToken(newToken);

    const userResponse = await api.get("/user", {
      headers: {
        Authorization: `Bearer ${newToken}`,
      },
    });

    setUser(userResponse.data.user ?? userResponse.data);

    return userResponse.data;
  };



  // Logout
  const logout = async () => {
    try {
      await api.post("/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("ss_token");
      setToken(null);
      setUser(null);
    }
  };

  return (
    <AppContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!token && !!user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}
