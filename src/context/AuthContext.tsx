import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import axios from "axios";
import toast from 'react-hot-toast';

import { User, AuthContextType } from "../types";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(
    JSON.parse(localStorage.getItem("user") || "null")
  );
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );

  const fetchRandomUser = async (retryCount = 2): Promise<User | null> => {
    try {
      const response = await axios.get("https://randomuser.me/api/", {
        timeout: 5000,
      });
      return response.data.results[0] as User;
    } catch (error) {
      if (retryCount > 0) {
        return fetchRandomUser(retryCount - 1);
      }
      return null;
    }
  };

  const login = async () => {
    if (!token && !user) {
      setLoading(true);
      const randomUser = await fetchRandomUser();
      
      if (randomUser) {
        const mockToken = `mock-jwt-${Date.now()}`;
        setUser(randomUser);
        setToken(mockToken);
        localStorage.setItem("user", JSON.stringify(randomUser));
        localStorage.setItem("token", mockToken);
        toast.success(`Welcome, ${randomUser.name.first}!`);
      } else {
        toast.error("This api failed most of the time. Please try again or refresh!");
      }
      setLoading(false);
    }
  };

  const logout = () => {
    setLoading(true);
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged out successfully!");
    setLoading(false);
  };

  useEffect(() => {
    if (token && !user) {
      login();
    }
  }, [token]);

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
