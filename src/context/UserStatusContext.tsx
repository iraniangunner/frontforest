// context/UserStatusContext.tsx

"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { useAuth } from "./AuthContext";
import { userAPI } from "@/lib/api";

interface UserStatusContextType {
  cartIds: number[];
  favoriteIds: number[];
  purchasedIds: number[];
  loading: boolean;
  isInCart: (componentId: number) => boolean;
  isFavorite: (componentId: number) => boolean;
  isPurchased: (componentId: number) => boolean;
  addToCart: (componentId: number) => void;
  removeFromCart: (componentId: number) => void;
  toggleFavorite: (componentId: number) => void;
  refresh: () => Promise<void>;
}

const UserStatusContext = createContext<UserStatusContextType | null>(null);

export function UserStatusProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [cartIds, setCartIds] = useState<number[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);
  const [purchasedIds, setPurchasedIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch all statuses in one API call
  const fetchStatuses = useCallback(async () => {
    if (!user) {
      setCartIds([]);
      setFavoriteIds([]);
      setPurchasedIds([]);
      setLoading(false);
      return;
    }
  
    try {
      const response = await userAPI.getComponentStatuses();
      const data = response.data;
  
      // تبدیل رشته‌ها به عدد
      setCartIds((data.cart || []).map(Number));
      setFavoriteIds((data.favorites || []).map(Number));
      setPurchasedIds((data.purchases || []).map(Number));
    } catch (error) {
      console.error("Error fetching user statuses:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchStatuses();
  }, [fetchStatuses]);

  // Check functions
  const isInCart = useCallback((componentId: number) => cartIds.includes(componentId), [cartIds]);
  const isFavorite = useCallback((componentId: number) => favoriteIds.includes(componentId), [favoriteIds]);
  const isPurchased = useCallback((componentId: number) => purchasedIds.includes(componentId), [purchasedIds]);

  // Optimistic update functions
  const addToCart = useCallback((componentId: number) => {
    setCartIds((prev) => [...prev, componentId]);
  }, []);

  const removeFromCart = useCallback((componentId: number) => {
    setCartIds((prev) => prev.filter((id) => id !== componentId));
  }, []);

  const toggleFavorite = useCallback((componentId: number) => {
    setFavoriteIds((prev) =>
      prev.includes(componentId)
        ? prev.filter((id) => id !== componentId)
        : [...prev, componentId]
    );
  }, []);

  const refresh = useCallback(async () => {
    setLoading(true);
    await fetchStatuses();
  }, [fetchStatuses]);

  return (
    <UserStatusContext.Provider
      value={{
        cartIds,
        favoriteIds,
        purchasedIds,
        loading,
        isInCart,
        isFavorite,
        isPurchased,
        addToCart,
        removeFromCart,
        toggleFavorite,
        refresh,
      }}
    >
      {children}
    </UserStatusContext.Provider>
  );
}

export function useUserStatus() {
  const context = useContext(UserStatusContext);
  if (!context) {
    throw new Error("useUserStatus must be used within UserStatusProvider");
  }
  return context;
}