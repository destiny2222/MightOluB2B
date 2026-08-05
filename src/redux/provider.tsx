"use client";

import { store } from "./store";
import { Provider } from "react-redux";
import React, { useEffect } from "react";
import { loadAuthFromStorage, fetchUserProfile } from "./features/auth-slice";
import { fetchCartAsync } from "./features/cart-slice";
import { fetchWishlistAsync } from "./features/wishlist-slice";

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Load auth data from localStorage on app initialization
    store.dispatch(loadAuthFromStorage());
    
    // Fetch fresh user profile from backend (updates KYC status)
    const token = localStorage.getItem('b2b_token');
    if (token) {
      store.dispatch(fetchUserProfile());
    }
    
    // Fetch cart data from backend API (requires authentication) 
    if (token) {
      store.dispatch(fetchCartAsync());
      store.dispatch(fetchWishlistAsync());
    }
  }, []);

  return <Provider store={store}>{children}</Provider>;
}
