// UserContext.js
import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";
import { User } from "../interfaces/UserInterfaces";
import axiosInstance from "../config/axiosConfig";
import { useNavigate } from "react-router-dom";

// Define the type for the context value
interface UserContextType {
  user: User;
  updateUser: (updatedUser: User) => void;
  login: (id: string, email: string, name: string, imageUrl: string) => void;
  logout: () => void;
}

// Create the context with the defined type
const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
};

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const initialUserFromLocalStorage = localStorage.getItem("user");

  const initialUser: User = initialUserFromLocalStorage
    ? JSON.parse(initialUserFromLocalStorage)
    : null;

  const [user, setPlayer] = useState<User>(initialUser);

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(user));
  }, [user]);

  const updateUser = (updatedUser: User) => {
    setPlayer(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  const login = (id: string, email: string, name: string, imageUrl: string) => {
    console.log({ id, email, name, imageUrl })
    axiosInstance
      .post(
        "/api/v1/login",
        { id, email, name, imageUrl }
      )
      .then((response) => {
        updateUser(response.data.records);
      });
  };

  const logout = () => {
    localStorage.clear();
    window.location.reload();
  };

  // Create the context value
  const contextValue: UserContextType = {
    user,
    updateUser,
    login,
    logout,
  };

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};
