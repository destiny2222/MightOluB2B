"use client";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import { selectIsAuthenticated, selectHasKYC, selectUser, selectAuth } from "@/redux/features/auth-slice";
import { toast } from "react-toastify";

const GlobalKYCGuard = () => {
  const router = useRouter();
  const pathname = usePathname();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const hasKYC = useSelector(selectHasKYC);
  const user = useSelector(selectUser);
  const { isLoading } = useSelector(selectAuth);

  useEffect(() => {
    // Don't redirect while authentication state is still loading
    if (isLoading) return;

    // If the user is authenticated but doesn't have KYC details (kyc is null),
    // they must be redirected to the KYC setup page, unless they are already there
    // or on the application status page.
    if (isAuthenticated && !hasKYC && pathname !== "/b2b/kyc-setup" && pathname !== "/b2b/application-status") {
      toast.error("Please complete your KYC details to access the platform.");
      router.replace("/b2b/kyc-setup");
    }
  }, [isAuthenticated, hasKYC, pathname, router, isLoading]);

  return null;
};

export default GlobalKYCGuard;
