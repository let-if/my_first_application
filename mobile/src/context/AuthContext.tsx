// // mobile/src/context/AuthContext.tsx
// import React, { createContext, useContext, useState, useEffect } from "react";
// import { Storage } from "../utils/storage";
// import api from "../services/api";



// export interface User {
//   id: string;
//   fullName: string;
//   phoneNumber: string;
//   email?: string | null;  // <--- Add this line
//   role: "CUSTOMER" | "PROVIDER" | "ADMIN";
// }
// interface AuthContextType {
//   user: User | null;
//   token: string | null;
//   isLoading: boolean;
//   login: (phoneNumber: string, password: string) => Promise<void>;
//   register: (
//     phoneNumber: string,
//     fullName: string,
//     password: string,
//     role: "CUSTOMER" | "PROVIDER"
//   ) => Promise<void>;
//   logout: () => Promise<void>;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [user, setUser] = useState<User | null>(null);
//   const [token, setToken] = useState<string | null>(null);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     loadStoredAuth();
//   }, []);

//   const loadStoredAuth = async () => {
//     try {
//       const storedToken = await Storage.getItem("user_token");
//       const storedUser = await Storage.getItem("user_data");

//       if (storedToken && storedUser) {
//         setToken(storedToken);
//         setUser(JSON.parse(storedUser));
//       }
//     } catch (err) {
//       console.error("Failed to load auth state", err);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const login = async (phoneNumber: string, password: string) => {
//     const res = await api.post("/auth/login", { phoneNumber, password });
//     const { user: loggedInUser, token: authToken } = res.data;

//     await Storage.setItem("user_token", authToken);
//     await Storage.setItem("user_data", JSON.stringify(loggedInUser));

//     setToken(authToken);
//     setUser(loggedInUser);
//   };

//   const register = async (
//     phoneNumber: string,
//     fullName: string,
//     password: string,
//     role: "CUSTOMER" | "PROVIDER"
//   ) => {
//     const res = await api.post("/auth/register", {
//       phoneNumber,
//       fullName,
//       password,
//       role,
//     });
//     const { user: registeredUser, token: authToken } = res.data;

//     await Storage.setItem("user_token", authToken);
//     await Storage.setItem("user_data", JSON.stringify(registeredUser));

//     setToken(authToken);
//     setUser(registeredUser);
//   };

//   const logout = async () => {
//     await Storage.removeItem("user_token");
//     await Storage.removeItem("user_data");
//     setToken(null);
//     setUser(null);
//   };

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         token,
//         isLoading,
//         login,
//         register,
//         logout,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error("useAuth must be used within an AuthProvider");
//   }
//   return context;
// };
// mobile/src/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { Storage } from "../utils/storage";
import api from "../services/api";

export interface User {
  id: string;
  fullName: string;
  phoneNumber: string;
  email?: string | null;
  role: "CUSTOMER" | "PROVIDER" | "ADMIN";
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (phoneNumber: string, password: string) => Promise<void>;
  register: (
    phoneNumber: string,
    fullName: string,
    password: string,
    role: "CUSTOMER" | "PROVIDER"
  ) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      const storedToken = await Storage.getItem("user_token");
      const storedUser = await Storage.getItem("user_data");

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch (err) {
      console.error("Failed to load auth state", err);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (phoneNumber: string, password: string) => {
    const res = await api.post("/auth/login", { phoneNumber, password });
    const { user: loggedInUser, token: authToken } = res.data;

    await Storage.setItem("user_token", authToken);
    await Storage.setItem("user_data", JSON.stringify(loggedInUser));

    setToken(authToken);
    setUser(loggedInUser);
  };

  const register = async (
    phoneNumber: string,
    fullName: string,
    password: string,
    role: "CUSTOMER" | "PROVIDER"
  ) => {
    const res = await api.post("/auth/register", {
      phoneNumber,
      fullName,
      password,
      role,
    });
    const { user: registeredUser, token: authToken } = res.data;

    await Storage.setItem("user_token", authToken);
    await Storage.setItem("user_data", JSON.stringify(registeredUser));

    setToken(authToken);
    setUser(registeredUser);
  };

  const logout = async () => {
    try {
      await Storage.removeItem("user_token");
      await Storage.removeItem("user_data");
    } catch (e) {
      console.error("Error clearing storage on logout", e);
    }
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        register,
        logout,
      }}
    >
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