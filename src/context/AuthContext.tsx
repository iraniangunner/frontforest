// // context/AuthContext.tsx
// "use client";
// import { createContext, useContext, useState, ReactNode, useEffect } from "react";
// import { authAPI } from "@/lib/api";

// interface User {
//   id: number;
//   name: string;
//   email:string;
//   mobile: string;
//   is_admin:boolean;
//   bank_card_number:string;
//   bank_card_owner:string;
// }

// interface AuthContextType {
//   user: User | null;
//   setUser: (user: User | null) => void;
//   loading: boolean;
//   refreshUser: () => Promise<void>;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export function AuthProvider({ children }: { children: ReactNode }) {
//   const [user, setUser] = useState<User | null>(null);
//   const [loading, setLoading] = useState(true);

//   const refreshUser = async () => {
//     try {
//       const response = await authAPI.me();

//       // Handle different response structures
//       if (response.data.data) {
//         setUser(response.data.data);
//       } else if (response.data.user) {
//         setUser(response.data.user);
//       } else {
//         setUser(response.data);
//       }
//     } catch (error: any) {
//       console.error("Auth check error:", error);
//       setUser(null);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     refreshUser();
//   }, []);

//   return (
//     <AuthContext.Provider value={{ user, setUser, loading, refreshUser }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export function useAuth() {
//   const context = useContext(AuthContext);
//   if (!context) throw new Error("useAuth must be used within AuthProvider");
//   return context;
// }

// context/AuthContext.tsx
"use client";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
} from "react";
import { authAPI } from "@/lib/api";
import { useRouter } from "next/navigation";

interface User {
  id: number;
  name: string;
  email: string;
  mobile: string;
  is_admin: boolean;
  bank_card_number: string;
  bank_card_owner: string;
}

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  loading: boolean;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const refreshUser = useCallback(async () => {
    try {
      const response = await authAPI.me();
      if (response.data.data) {
        setUser(response.data.data);
      } else if (response.data.user) {
        setUser(response.data.user);
      } else {
        setUser(response.data);
      }
    } catch (error: any) {
      console.error("Auth check error:", error);
      setUser(null);
      // اگه 401 بود یعنی نشست revoke شده
      // if (error.response?.status === 401) {
      //   router.push("/");
      // }
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    refreshUser();
  }, []);

  // ── polling هر ۳ دقیقه ──
  useEffect(() => {
    const interval = setInterval(
      () => {
        refreshUser();
      },
      3 * 60 * 1000,
    );

    return () => clearInterval(interval);
  }, [refreshUser]);

  useEffect(() => {
    const handleLogout = () => setUser(null);
    window.addEventListener("auth:logout", handleLogout);
    return () => window.removeEventListener("auth:logout", handleLogout);
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
