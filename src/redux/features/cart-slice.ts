import { createSelector, createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../store";
import * as B2BAPI from "@/lib/api/b2b-api";
import { mapProductImages } from "@/lib/helpers/productHelpers";

type InitialState = {
  items: CartItem[];
  isLoading: boolean;
  error: string | null;
};

export type CartItem = {
  id: number;
  cartItemId?: number;
  title: string;
  price: number;
  discountedPrice: number;
  quantity: number;
  size?: string;
  imgs?: {
    thumbnails: string[];
    previews: string[];
  };
};

const initialState: InitialState = {
  items: [],
  isLoading: false,
  error: null,
};

const mapApiCartToState = (apiItems: B2BAPI.B2BCartItem[]): CartItem[] => {
  return apiItems.map((item) => ({
    id: item.product_id,
    cartItemId: item.id,
    title: item.product_title,
    price: item.price,
    discountedPrice: item.price,
    quantity: item.quantity,
    size: item.size,
    imgs: mapProductImages({
      product_image: item.product_image,
      image: item.product_image, // Fallback keys just in case
    }),
  }));
};

// Async Thunks
export const fetchCartAsync = createAsyncThunk(
  "cart/fetchCart",
  async (_, { rejectWithValue }) => {
    try {
      const token = B2BAPI.getStoredToken();
      if (!token) {
        return rejectWithValue("Authentication required");
      }
      const response = await B2BAPI.getB2BCart();
      return mapApiCartToState(response.items);
    } catch (error: any) {
      return rejectWithValue(error?.message || "Failed to fetch cart");
    }
  }
);

export const addToCartAsync = createAsyncThunk(
  "cart/addToCart",
  async (item: CartItem, { rejectWithValue, dispatch }) => {
    const token = B2BAPI.getStoredToken();
    if (!token) {
      return rejectWithValue("Authentication required. Please sign in to add items to cart.");
    }
    
    try {
      await B2BAPI.addToB2BCart({
        product_id: item.id,
        quantity: item.quantity,
        size_variant: item.size,
      });
      // Re-fetch cart from server
      await dispatch(fetchCartAsync());
      return true;
    } catch (error: any) {
      return rejectWithValue(error?.error || "Failed to add to cart");
    }
  }
);

export const updateQuantityAsync = createAsyncThunk(
  "cart/updateQuantity",
  async ({ id, quantity, cartItemId }: { id: number; quantity: number; cartItemId?: number }, { rejectWithValue, dispatch }) => {
    const token = B2BAPI.getStoredToken();
    if (!token) {
      return rejectWithValue("Authentication required");
    }
    if (!cartItemId) {
      return rejectWithValue("Cart item ID is required");
    }
    
    try {
      await B2BAPI.updateB2BCartItem(cartItemId, { quantity });
      await dispatch(fetchCartAsync());
      return true;
    } catch (error: any) {
      return rejectWithValue(error?.message || "Failed to update quantity");
    }
  }
);

export const removeFromCartAsync = createAsyncThunk(
  "cart/removeFromCart",
  async ({ id, cartItemId }: { id: number; cartItemId?: number }, { rejectWithValue, dispatch }) => {
    const token = B2BAPI.getStoredToken();
    if (!token) {
      return rejectWithValue("Authentication required");
    }
    if (!cartItemId) {
      return rejectWithValue("Cart item ID is required");
    }
    
    try {
      await B2BAPI.deleteB2BCartItem(cartItemId);
      await dispatch(fetchCartAsync());
      return true;
    } catch (error: any) {
      return rejectWithValue(error?.message || "Failed to remove item");
    }
  }
);

export const cart = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItemToCart: (state, action: PayloadAction<CartItem>) => {
      const { id, title, price, quantity, discountedPrice, imgs, size } =
        action.payload;
      const existingItem = state.items.find((item) => item.id === id && item.size === size);

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.items.push({
          id,
          title,
          price,
          quantity,
          discountedPrice,
          imgs,
          size,
        });
      }
    },
    removeItemFromCart: (state, action: PayloadAction<number>) => {
      const itemId = action.payload;
      state.items = state.items.filter((item) => item.id !== itemId);
    },
    updateCartItemQuantity: (
      state,
      action: PayloadAction<{ id: number; quantity: number }>
    ) => {
      const { id, quantity } = action.payload;
      const existingItem = state.items.find((item) => item.id === id);

      if (existingItem) {
        existingItem.quantity = quantity;
      }
    },

    removeAllItemsFromCart: (state) => {
      state.items = [];
    },
    clearCart: (state) => {
      state.items = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCartAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCartAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          state.items = action.payload;
        }
      })
      .addCase(fetchCartAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(addToCartAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addToCartAsync.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(addToCartAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(updateQuantityAsync.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateQuantityAsync.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(updateQuantityAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(removeFromCartAsync.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(removeFromCartAsync.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(removeFromCartAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  }
});

export const selectCartItems = (state: RootState) => state.cartReducer.items;
export const selectCartIsLoading = (state: RootState) => state.cartReducer.isLoading;
export const selectCartError = (state: RootState) => state.cartReducer.error;

export const selectTotalPrice = createSelector([selectCartItems], (items) => {
  return items.reduce((total, item) => {
    return total + item.discountedPrice * item.quantity;
  }, 0);
});

export const {
  clearCart,
  removeAllItemsFromCart,
} = cart.actions;

// Internal reducers - not exported for direct use
const { addItemToCart, removeItemFromCart, updateCartItemQuantity } = cart.actions;

export default cart.reducer;
