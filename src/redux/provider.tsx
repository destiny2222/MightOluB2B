"use client";

import { store } from "./store";
import { Provider } from "react-redux";
import React, { useEffect } from "react";
import { loadAuthFromStorage } from "./features/auth-slice";

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Load auth data from localStorage on app initialization
    store.dispatch(loadAuthFromStorage());
  }, []);

  return <Provider store={store}>{children}</Provider>;
}
