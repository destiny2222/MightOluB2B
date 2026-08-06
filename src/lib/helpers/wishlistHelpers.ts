import { AppDispatch } from "@/redux/store";
import {
  addToWishlistAsync,
  removeFromWishlistAsync,
} from "@/redux/features/wishlist-slice"; // or b2b-wishlist-slice
import { toast } from "react-toastify";

import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

interface WishlistParams {
  dispatch: AppDispatch;
  productId: number;
  isAuthenticated: boolean;
  router: AppRouterInstance;
}

export async function handleB2BAddToWishlist({
  dispatch,
  productId,
  isAuthenticated,
  router,
}: WishlistParams) {
  if (!isAuthenticated) {
    toast.error("Please sign in to add items to wishlist");
    router.push("/signin");
    return false;
  }

  try {
    await dispatch(addToWishlistAsync(productId)).unwrap();
    toast.success("Added to wishlist");
    return true;
  } catch (error: any) {
    toast.error(typeof error === "string" ? error : "Failed to add to wishlist");
    return false;
  }
}

export async function handleB2BRemoveFromWishlist({
  dispatch,
  wishlistId,
}: {
  dispatch: AppDispatch;
  wishlistId: string;
}) {
  try {
    await dispatch(removeFromWishlistAsync(wishlistId)).unwrap();
    toast.success("Removed from wishlist");
    return true;
  } catch (error: any) {
    toast.error(typeof error === "string" ? error : "Failed to remove from wishlist");
    return false;
  }
}