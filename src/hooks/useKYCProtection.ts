"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { selectIsAuthenticated, selectUser, selectHasKYC, selectKYCStatus } from "@/redux/features/auth-slice";
import toast from "react-hot-toast";

export type KYCProtectionLevel = 'none' | 'kyc-required' | 'kyc-approved';

interface UseKYCProtectionOptions {
  level: KYCProtectionLevel;
  redirectTo?: string;
  showToast?: boolean;
  toastMessage?: string;
}

/**
 * Hook to protect pages/features based on KYC status
 * 
 * @param level - Protection level:
 *   - 'none': No protection, just check
 *   - 'kyc-required': User must have submitted KYC (any status)
 *   - 'kyc-approved': User must have approved KYC
 * 
 * @returns Object with KYC status information
 */
export const useKYCProtection = (options: UseKYCProtectionOptions) => {
  const router = useRouter();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);
  const hasKYC = useSelector(selectHasKYC);
  const kycStatus = useSelector(selectKYCStatus);

  const {
    level,
    redirectTo,
    showToast = true,
    toastMessage
  } = options;

  useEffect(() => {
    if (!isAuthenticated) {
      if (showToast) {
        toast.error("Please sign in to continue");
      }
      router.push("/signin");
      return;
    }

    if (level === 'kyc-required' || level === 'kyc-approved') {
      if (!hasKYC) {
        if (showToast) {
          toast.error(toastMessage || "You must complete KYC verification to access this feature");
        }
        router.push(redirectTo || "/b2b/kyc-setup");
        return;
      }

      if (level === 'kyc-approved' && kycStatus !== 'approved') {
        if (showToast) {
          const message = kycStatus === 'pending' 
            ? "Your KYC application is pending approval"
            : kycStatus === 'rejected'
            ? "Your KYC application was rejected. Please resubmit with correct information"
            : "Your KYC application requires additional information";
          toast.error(toastMessage || message);
        }
        router.push(redirectTo || "/b2b/application-status");
        return;
      }
    }
  }, [isAuthenticated, hasKYC, kycStatus, level, router, redirectTo, showToast, toastMessage]);

  return {
    isAuthenticated,
    hasKYC,
    kycStatus,
    canPurchase: kycStatus === 'approved',
    isKYCPending: kycStatus === 'pending',
    isKYCRejected: kycStatus === 'rejected',
    needsKYC: !hasKYC,
  };
};
