import { createContext, useContext, useEffect, useState } from "react";
import { loginUser, registerUser } from "../api/axios";

const AuthContext = createContext({
  user: null,
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
});

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setLoading(false);
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);
  const login = async (email, password) => {
    return loginUser(email, password)
      .then((response) => {
        const { user } = response.data;
        setUser(user);
        setIsAuthenticated(true);
        return response;
      })
      .catch((error) => {
        throw error;
      });
  };

  const logout = async () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("user");
  };

  const register = async (user) => {
    return registerUser(user)
      .then((response) => {
        return response;
      })
      .catch((error) => {
        throw error;
      });
  };

  const isLoggedIn = () => {
    return user !== null;
  };

  useEffect(() => {
    setIsAuthenticated(user !== null);
  }, [user]);

  const values = {
    user,
    login,
    logout,
    register,
    isLoggedIn,
    isAuthenticated,
  };

  return (
    <AuthContext.Provider value={values}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined)
    throw new Error("useAuth must be used within an AuthProvider");
  return context;
}

export { AuthProvider, useAuth };
