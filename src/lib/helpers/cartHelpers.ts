// lib/helpers/cartHelpers.ts
import { AppDispatch } from "@/redux/store";
import { addToCartAsync } from "@/redux/features/cart-slice";
import { toast } from "react-toastify";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

interface AddToCartParams {
  dispatch: AppDispatch;
  product: {
    id: number;
    title: string;
    price?: number;
    standard_price?: number;
    trade_price?: number;
    discountedPrice?: number;
    imgs?: any;
  };
  quantity: number;
  size?: string;
  isAuthenticated: boolean;
  canPurchase: boolean;
  router: AppRouterInstance;
}

export async function handleB2BAddToCart({
  dispatch,
  product,
  quantity,
  size,
  isAuthenticated,
  canPurchase,
  router,
}: AddToCartParams) {
  if (!isAuthenticated) {
    toast.error("Please sign in to add items to cart");
    router.push("/signin");
    return false;
  }

  if (!canPurchase) {
    toast.error("Your trade account must be approved before you can purchase");
    return false;
  }

  try {
    await dispatch(
      addToCartAsync({
        id: product.id,
        title: product.title,
        price: product.standard_price || product.price || 0,
        discountedPrice: product.trade_price || product.discountedPrice || 0,
        quantity,
        size,
        imgs: product.imgs,
      })
    ).unwrap();

    toast.success("Added to cart successfully");
    return true;
  } catch (error: any) {
    toast.error(typeof error === "string" ? error : "Failed to add to cart");
    return false;
  }
}