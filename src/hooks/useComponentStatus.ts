// hooks/useComponentStatus.ts

"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { cartAPI, favoritesAPI, ordersAPI } from "@/lib/api";

interface ComponentStatus {
  inCart: boolean;
  purchased: boolean;
  isFavorite: boolean;
  loading: boolean;
}

export function useComponentStatus(componentId: number): ComponentStatus {
  const { user } = useAuth();
  const [status, setStatus] = useState<ComponentStatus>({
    inCart: false,
    purchased: false,
    isFavorite: false,
    loading: true,
  });

  useEffect(() => {
    // If no user logged in, reset status and stop loading
    if (!user) {
      setStatus({
        inCart: false,
        purchased: false,
        isFavorite: false,
        loading: false,
      });
      return;
    }

    // Fetch user-specific status for this component
    const fetchStatus = async () => {
      setStatus((prev) => ({ ...prev, loading: true }));

      try {
        // Fetch all three statuses in parallel
        const [cartRes, favRes, purchaseRes] = await Promise.all([
          cartAPI.check(componentId).catch(() => ({ data: { in_cart: false } })),
          favoritesAPI.check(componentId).catch(() => ({ data: { is_favorite: false } })),
          ordersAPI.check(componentId).catch(() => ({ data: { purchased: false } })),
        ]);

        setStatus({
          inCart: cartRes.data.in_cart || false,
          purchased: purchaseRes.data.purchased || false,
          isFavorite: favRes.data.is_favorite || false,
          loading: false,
        });
      } catch (error) {
        console.error("Error fetching component status:", error);
        setStatus({
          inCart: false,
          purchased: false,
          isFavorite: false,
          loading: false,
        });
      }
    };

    fetchStatus();
  }, [user, componentId]);

  return status;
}