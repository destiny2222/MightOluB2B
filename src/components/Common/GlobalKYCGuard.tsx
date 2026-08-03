"use client";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import { selectIsAuthenticated, selectHasKYC, selectUser } from "@/redux/features/auth-slice";
import toast from "react-hot-toast";

const GlobalKYCGuard = () => {
  const router = useRouter();
  const pathname = usePathname();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const hasKYC = useSelector(selectHasKYC);
  const user = useSelector(selectUser);

  useEffect(() => {
    // If the user is authenticated but doesn't have KYC details (kyc is null),
    // they must be redirected to the KYC setup page, unless they are already there.
    if (isAuthenticated && !hasKYC && pathname !== "/b2b/kyc-setup") {
      toast.error("Please complete your KYC details to access the platform.");
      router.push("/b2b/kyc-setup");
    }
  }, [isAuthenticated, hasKYC, pathname, router]);

  return null;
};

export default GlobalKYCGuard;
