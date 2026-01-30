import { createContext, useContext, useState, useEffect } from "react";
import { account } from "../lib/appwrite";
import { ID } from "appwrite";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in on mount
  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const currentUser = await account.get();
      setUser(currentUser);
    } catch (error) {
      console.log("Auth check failed:", error.message);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      await account.createEmailPasswordSession(email, password);
      const currentUser = await account.get();
      setUser(currentUser);
    } catch (error) {
      throw new Error(error.message || "Failed to sign in");
    }
  };

  const signup = async (email, password, name) => {
    try {
      await account.create(ID.unique(), email, password, name);
      await account.createEmailPasswordSession(email, password);
      const currentUser = await account.get();
      setUser(currentUser);
    } catch (error) {
      throw new Error(error.message || "Failed to create account");
    }
  };

  const logout = async () => {
    try {
      await account.deleteSession("current");
      setUser(null);
    } catch (error) {
      throw new Error(error.message || "Failed to logout");
    }
  };

  const resetPassword = async (email) => {
    try {
      const redirectUrl = `${window.location.origin}/reset-password`;
      await account.createRecovery(email, redirectUrl);
    } catch (error) {
      throw new Error(error.message || "Failed to send password reset email");
    }
  };

  const updatePassword = async (password, confirmPassword) => {
    try {
      if (password !== confirmPassword) {
        throw new Error("Passwords do not match");
      }
      await account.updatePassword(password);
    } catch (error) {
      throw new Error(error.message || "Failed to update password");
    }
  };

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    resetPassword,
    updatePassword,
    checkUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
