import { AppDispatch } from "@/redux/store";
import { addToCartAsync } from "@/redux/features/cart-slice";
import toast from "react-hot-toast";
import { NavigateOptions } from "next/dist/shared/lib/app-router-context.shared-runtime";

interface KYCCheckParams {
  isAuthenticated: boolean;
  canPurchase: boolean;
  kycStatus: 'pending' | 'approved' | 'rejected' | 'info_requested' | null;
  router: {
    push: (href: string, options?: NavigateOptions) => void;
  };
}

interface AddToCartParams {
  dispatch: AppDispatch;
  item: any;
  quantity: number;
  kycCheck: KYCCheckParams;
}

/**
 * Helper function to add items to cart with KYC verification
 */
export const addToCartWithKYCCheck = async ({
  dispatch,
  item,
  quantity,
  kycCheck
}: AddToCartParams): Promise<boolean> => {
  const { isAuthenticated, canPurchase, kycStatus, router } = kycCheck;

  if (!isAuthenticated) {
    toast.error("Please sign in to add items to cart");
    router.push("/signin");
    return false;
  }

  if (!canPurchase) {
    if (kycStatus === null) {
      toast.error("Please complete KYC verification to make purchases");
      router.push("/b2b/kyc-setup");
    } else if (kycStatus === 'pending') {
      toast.error("Your KYC application is pending approval");
      router.push("/b2b/application-status");
    } else if (kycStatus === 'rejected') {
      toast.error("Your KYC application was rejected. Please resubmit");
      router.push("/b2b/application-status");
    } else {
      toast.error("Your KYC requires additional information");
      router.push("/b2b/application-status");
    }
    return false;
  }

  try {
    await dispatch(
      addToCartAsync({
        ...item,
        quantity,
      })
    ).unwrap();
    toast.success("Item added to cart");
    return true;
  } catch (error: any) {
    toast.error(error || "Failed to add item to cart");
    return false;
  }
};

/**
 * Get KYC status message for UI display
 */
export const getKYCStatusMessage = (
  kycStatus: 'pending' | 'approved' | 'rejected' | 'info_requested' | null
): { message: string; type: 'warning' | 'error' | 'success' | 'info' } | null => {
  if (kycStatus === null) {
    return {
      message: 'Complete KYC verification to make purchases',
      type: 'warning'
    };
  }

  if (kycStatus === 'pending') {
    return {
      message: 'Your KYC application is pending approval',
      type: 'info'
    };
  }

  if (kycStatus === 'rejected') {
    return {
      message: 'Your KYC application was rejected. Please resubmit',
      type: 'error'
    };
  }

  if (kycStatus === 'info_requested') {
    return {
      message: 'Additional information required for your KYC application',
      type: 'warning'
    };
  }

  return null;
};
