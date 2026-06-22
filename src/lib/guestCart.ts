// lib/guestCart.ts

export interface GuestCartItem {
  id: number;
  quantity: number;
  slug: string;
  title: string;
  thumbnail: string | null;
  price: number;
  sale_price: number | null;
  current_price: number;
  stock: number;
}

const KEY = "guest_cart";

export const guestCart = {
  get(): GuestCartItem[] {
    if (typeof window === "undefined") return [];
    try {
      return JSON.parse(localStorage.getItem(KEY) || "[]");
    } catch {
      return [];
    }
  },

  add(item: GuestCartItem) {
    const items = guestCart.get();
    const existing = items.find((i) => i.id === item.id);
    if (existing) {
      existing.quantity += item.quantity;
    } else {
      items.push(item);
    }
    localStorage.setItem(KEY, JSON.stringify(items));
    window.dispatchEvent(new Event("guestCartUpdated"));
  },

  remove(id: number) {
    const items = guestCart.get().filter((i) => i.id !== id);
    localStorage.setItem(KEY, JSON.stringify(items));
    window.dispatchEvent(new Event("guestCartUpdated"));
  },

  clear() {
    localStorage.removeItem(KEY);
    window.dispatchEvent(new Event("guestCartUpdated"));
  },

  count(): number {
    return guestCart.get().length;
  },

  isEmpty(): boolean {
    return guestCart.get().length === 0;
  },
};
