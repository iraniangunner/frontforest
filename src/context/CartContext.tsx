"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { cartAPI } from "@/lib/api";

interface CartContextType {
  cartCount: number;
  refreshCart: () => Promise<void>;
  incrementCart: () => void;
  decrementCart: () => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartCount, setCartCount] = useState(0);

  // توجه: دیگه روی mount خودکار صدا زده نمیشه.
  // Header.tsx خودش با چک `if (user) refreshCart()` این رو موقع لاگین صدا میزنه.

  const refreshCart = async () => {
    try {
      const response = await cartAPI.count();
      setCartCount(response.data.count ?? 0);
    } catch (error) {
      setCartCount(0);
    }
  };

  const incrementCart = () => setCartCount((prev) => prev + 1);
  const decrementCart = () => setCartCount((prev) => Math.max(0, prev - 1));
  const clearCart = () => setCartCount(0);

  return (
    <CartContext.Provider value={{ cartCount, refreshCart, incrementCart, decrementCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}
