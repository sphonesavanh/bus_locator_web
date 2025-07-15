import { useState, ReactNode } from "react";
import axios from "axios";
import AuthContext from "./AuthContext";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return !!localStorage.getItem("user");
  });

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const response = await axios.post("http://localhost:4000/api/login", {
        username,
        password,
      });
  
      if (response.status === 200) {
        localStorage.setItem("user", response.data.token);
        setIsLoggedIn(true);
        return true; // ✅ return success
      } else {
        setIsLoggedIn(false);
        return false;
      }
    } catch (error) {
      console.error(error);
      setIsLoggedIn(false);
      return false;
    }
  };
  

  const logout = () => {
    localStorage.removeItem("user");
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
