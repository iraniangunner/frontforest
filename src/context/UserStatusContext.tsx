// context/UserStatusContext.tsx

"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { useAuth } from "./AuthContext";
import { userAPI } from "@/lib/api";

interface UserStatusContextType {
  cartIds: number[];
  favoriteIds: number[];
  purchasedIds: number[];
  loading: boolean;
  isInCart: (productId: number) => boolean;
  isFavorite: (productId: number) => boolean;
  isPurchased: (productId: number) => boolean;
  addToCart: (productId: number) => void;
  removeFromCart: (productId: number) => void;
  toggleFavorite: (productId: number) => void;
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
      const response = await userAPI.getProductStatuses();
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
  const isInCart = useCallback(
    (productId: number) => cartIds.includes(productId),
    [cartIds],
  );
  const isFavorite = useCallback(
    (productId: number) => favoriteIds.includes(productId),
    [favoriteIds],
  );
  const isPurchased = useCallback(
    (productId: number) => purchasedIds.includes(productId),
    [purchasedIds],
  );

  // Optimistic update functions
  const addToCart = useCallback((productId: number) => {
    setCartIds((prev) => [...prev, productId]);
  }, []);

  const removeFromCart = useCallback((productId: number) => {
    setCartIds((prev) => prev.filter((id) => id !== productId));
  }, []);

  const toggleFavorite = useCallback((productId: number) => {
    setFavoriteIds((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId],
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
