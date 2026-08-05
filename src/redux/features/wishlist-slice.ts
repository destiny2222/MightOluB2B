import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type InitialState = {
  items: WishListItem[];
};

type WishListItem = {
  id: number;
  title: string;
  price: number;
  discountedPrice: number;
  quantity: number;
  status?: string;
  imgs?: {
    thumbnails: string[];
    previews: string[];
  };
};

const initialState: InitialState = {
  items: [],
};

const saveWishlistToStorage = (items: WishListItem[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("wishlistItems", JSON.stringify(items));
  }
};

export const wishlist = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    addItemToWishlist: (state, action: PayloadAction<WishListItem>) => {
      const { id, title, price, quantity, imgs, discountedPrice, status } =
        action.payload;
      const existingItem = state.items.find((item) => item.id === id);

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.items.push({
          id,
          title,
          price,
          quantity,
          imgs,
          discountedPrice,
          status,
        });
      }
      saveWishlistToStorage(state.items);
    },
    removeItemFromWishlist: (state, action: PayloadAction<number>) => {
      const itemId = action.payload;
      state.items = state.items.filter((item) => item.id !== itemId);
      saveWishlistToStorage(state.items);
    },

    removeAllItemsFromWishlist: (state) => {
      state.items = [];
      saveWishlistToStorage(state.items);
    },
    loadWishlistFromStorage: (state) => {
      if (typeof window !== "undefined") {
        const storedWishlist = localStorage.getItem("wishlistItems");
        if (storedWishlist) {
          try {
            state.items = JSON.parse(storedWishlist);
          } catch (e) {
            console.error("Failed to parse wishlist items from local storage");
          }
        }
      }
    },
  },
});

export const {
  addItemToWishlist,
  removeItemFromWishlist,
  removeAllItemsFromWishlist,
  loadWishlistFromStorage,
} = wishlist.actions;
export default wishlist.reducer;
