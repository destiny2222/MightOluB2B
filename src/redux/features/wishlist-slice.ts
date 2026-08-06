import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import * as B2BAPI from "@/lib/api/b2b-api";
import { mapProductImages } from "@/lib/helpers/productHelpers";
import { fetchCartAsync } from "./cart-slice";

export type WishlistItem = {
  id: string;           // wishlist row id (UUID)
  productId: number;
  title: string;
  slug: string;
  price: number;
  discountedPrice: number;
  quantity?: number;
  imgs?: {
    thumbnails: string[];
    previews: string[];
  };
  minimum_order_quantity?: number;
};

type InitialState = {
  items: WishlistItem[];
  isLoading: boolean;
  error: string | null;
};

const initialState: InitialState = {
  items: [],
  isLoading: false,
  error: null,
};

const mapApiWishlistToState = (apiItems: B2BAPI.B2BWishlistItem[]): WishlistItem[] => {
  return apiItems.map((item) => ({
    id: item.id,
    productId: item.product_id,
    title: item.title,
    slug: item.slug,
    price: item.standard_price,
    discountedPrice: item.trade_price,
    minimum_order_quantity: item.minimum_order_quantity,
    imgs: mapProductImages({
      product_image: item.product_images || item.image,
      image: item.image,
    }),
  }));
};

// ==================== ASYNC THUNKS ====================

export const fetchWishlistAsync = createAsyncThunk(
  "wishlist/fetchWishlist",
  async (_, { rejectWithValue }) => {
    try {
      const token = B2BAPI.getStoredToken();
      if (!token) return rejectWithValue("Authentication required");

      const response = await B2BAPI.getB2BWishlist();
      return mapApiWishlistToState(response.data);
    } catch (error: any) {
      return rejectWithValue(error?.message || "Failed to fetch wishlist");
    }
  }
);

export const addToWishlistAsync = createAsyncThunk(
  "wishlist/addToWishlist",
  async (productId: number, { rejectWithValue, dispatch }) => {
    const token = B2BAPI.getStoredToken();
    if (!token) {
      return rejectWithValue("Authentication required. Please sign in.");
    }

    try {
      await B2BAPI.addToB2BWishlist(productId);
      await dispatch(fetchWishlistAsync());
      return true;
    } catch (error: any) {
      // Handle "already exists" gracefully
      const message =
        error?.message ||
        error?.error ||
        (error?.errors?.product_id?.[0] ?? "Failed to add to wishlist");
      return rejectWithValue(message);
    }
  }
);

export const removeFromWishlistAsync = createAsyncThunk(
  "wishlist/removeFromWishlist",
  async (wishlistId: string, { rejectWithValue, dispatch }) => {
    const token = B2BAPI.getStoredToken();
    if (!token) return rejectWithValue("Authentication required");

    try {
      await B2BAPI.removeFromB2BWishlist(wishlistId);
      await dispatch(fetchWishlistAsync());
      return true;
    } catch (error: any) {
      return rejectWithValue(error?.message || "Failed to remove from wishlist");
    }
  }
);

export const moveToCartAsync = createAsyncThunk(
  "wishlist/moveToCart",
  async (
    { wishlistId, quantity }: { wishlistId: string; quantity?: number },
    { rejectWithValue, dispatch }
  ) => {
    const token = B2BAPI.getStoredToken();
    if (!token) return rejectWithValue("Authentication required");

    try {
      await B2BAPI.moveWishlistToCart(wishlistId, { quantity });
      await dispatch(fetchWishlistAsync());
      // Optionally also refresh cart
      await dispatch(fetchCartAsync());
      return true;
    } catch (error: any) {
      return rejectWithValue(error?.message || "Failed to move to cart");
    }
  }
);

// ==================== SLICE ====================

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    clearWishlist: (state) => {
      state.items = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchWishlistAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchWishlistAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) state.items = action.payload;
      })
      .addCase(fetchWishlistAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Add
      .addCase(addToWishlistAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addToWishlistAsync.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(addToWishlistAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Remove
      .addCase(removeFromWishlistAsync.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(removeFromWishlistAsync.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(removeFromWishlistAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const selectWishlistItems = (state: RootState) => state.wishlistReducer.items;
export const selectWishlistIsLoading = (state: RootState) => state.wishlistReducer.isLoading;
export const selectWishlistError = (state: RootState) => state.wishlistReducer.error;
export const selectIsInWishlist = (productId: number) => (state: RootState) =>
  state.wishlistReducer.items.some((item) => item.productId === productId);

export const { clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;