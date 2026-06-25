"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  ReactNode,
} from "react";
import { cartAPI } from "@/lib/api";
import { useAuth } from "./AuthContext";
import { useUserStatus } from "./UserStatusContext";
import { guestCart } from "@/lib/guestCart";

interface CartContextType {
  cartCount: number;
  guestCount: number;
  // تعدادی که باید روی آیکون نشون داده بشه (guest یا server)
  displayCount: number;
  cartLoading: boolean;
  refreshCart: () => Promise<void>;
  incrementCart: () => void;
  decrementCart: () => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const { refresh: refreshUserStatus } = useUserStatus();

  const [cartCount, setCartCount] = useState(0);
  const [guestCount, setGuestCount] = useState(0);
  const [cartLoading, setCartLoading] = useState(true);
  const cartReady = useRef(false);

  const refreshCart = async () => {
    try {
      const response = await cartAPI.count();
      setCartCount(response.data.count ?? 0);
    } catch {
      setCartCount(0);
    }
  };

  const incrementCart = () => setCartCount((prev) => prev + 1);
  const decrementCart = () => setCartCount((prev) => Math.max(0, prev - 1));
  const clearCart = () => setCartCount(0);

  // ── شمارش سبد مهمان از localStorage ──
  useEffect(() => {
    const updateGuestCount = () => setGuestCount(user ? 0 : guestCart.count());
    updateGuestCount();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "guest_cart") updateGuestCount();
    };
    const handleGuestCartUpdate = () => updateGuestCount();

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("guestCartUpdated", handleGuestCartUpdate);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("guestCartUpdated", handleGuestCartUpdate);
    };
  }, [user]);

  // ── وقتی مهمان است: loading خاموش ──
  useEffect(() => {
    if (!authLoading && !user) {
      setCartLoading(false);
      cartReady.current = true;
    }
  }, [authLoading, user]);

  // ── وقتی کاربر لاگین کرد: merge + refresh ──
  useEffect(() => {
    if (!user) return;

    setCartLoading(true);

    const syncGuestCart = async () => {
      try {
        const guestItems = guestCart.get();
        const owner = localStorage.getItem("guest_cart_owner");

        // اگه سبد مهمان مال کاربر دیگه‌ایه → دور بریز
        if (owner && String(user.id) !== owner) {
          guestCart.clear();
          localStorage.removeItem("guest_cart_owner");
          await refreshCart();
          return;
        }

        // فقط یه بار merge کن
        if (
          guestItems.length > 0 &&
          sessionStorage.getItem("guest_cart_synced") !== "true"
        ) {
          sessionStorage.setItem("guest_cart_synced", "true");

          await cartAPI.merge(
            guestItems.map((i) => ({
              product_id: i.id,
              quantity: i.quantity,
            })),
            "replace",
          );

          guestCart.clear();
          localStorage.removeItem("guest_cart_owner");
          await refreshUserStatus();
        }

        await refreshCart();
      } catch (err) {
        console.error("Cart sync failed:", err);
      } finally {
        setCartLoading(false);
        cartReady.current = true;
      }
    };

    syncGuestCart();
  }, [user]);

  // تعداد نهایی روی آیکون
  const displayCount = !authLoading && !user ? guestCount : cartCount;

  return (
    <CartContext.Provider
      value={{
        cartCount,
        guestCount,
        displayCount,
        cartLoading,
        refreshCart,
        incrementCart,
        decrementCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}
