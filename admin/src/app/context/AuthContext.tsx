// "use client";

// import React, { createContext, useContext, useEffect, useState } from "react";
// import axios from "axios";

// interface AuthContextType {
//   isAuthenticated: boolean;
//   username: string | null;
//   checkAuth: () => Promise<void>;
//   logout: () => Promise<void>;
// }

// const AuthContext = createContext<AuthContextType>({
//   isAuthenticated: false,
//   username: null,
//   checkAuth: async () => {},
//   logout: async () => {},
// });

// export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [username, setUsername] = useState<string | null>(null);

//   const checkAuth = async () => {
//     try {
//       const res = await axios.get("http://127.0.0.1:8000/api/admin-auth/check/", {
//         withCredentials: true,
//       });
//       setIsAuthenticated(true);
//       setUsername(res.data.username);
//     } catch {
//       setIsAuthenticated(false);
//       setUsername(null);
//     }
//   };

//   const logout = async () => {
//     try {
//       await axios.post("http://127.0.0.1:8000/api/admin-auth/logout/", {}, {
//         withCredentials: true,
//       });
//       setIsAuthenticated(false);
//       setUsername(null);
//     } catch {}
//   };

//   useEffect(() => {
//     checkAuth();
//   }, []);

//   return (
//     <AuthContext.Provider value={{ isAuthenticated, username, checkAuth, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);

"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

// Define the response type for the admin check API
interface CheckAuthResponse {
  username: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  username: string | null;
  checkAuth: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  username: null,
  checkAuth: async () => {},
  logout: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState<string | null>(null);

  const checkAuth = async () => {
    try {
      const res = await axios.get<CheckAuthResponse>(
        "http://127.0.0.1:8000/api/admin-auth/check/",
        {
          withCredentials: true,
        }
      );
      // TypeScript now knows res.data has type CheckAuthResponse
      setIsAuthenticated(true);
      setUsername(res.data.username);
    } catch {
      setIsAuthenticated(false);
      setUsername(null);
    }
  };

  const logout = async () => {
    try {
      await axios.post(
        "http://127.0.0.1:8000/api/admin-auth/logout/",
        {},
        { withCredentials: true }
      );
      setIsAuthenticated(false);
      setUsername(null);
    } catch {}
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, username, checkAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
