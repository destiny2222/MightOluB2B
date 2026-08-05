"use client";
import { selectTotalPrice } from "@/redux/features/cart-slice";
import { useAppSelector } from "@/redux/store";
import React from "react";
import { useSelector } from "react-redux";
import { selectIsAuthenticated, selectCanPurchase, selectKYCStatus } from "@/redux/features/auth-slice";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Link from "next/link";

const OrderSummary = () => {
  const router = useRouter();
  const cartItems = useAppSelector((state) => state.cartReducer.items);
  const totalPrice = useSelector(selectTotalPrice);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const canPurchase = useSelector(selectCanPurchase);
  const kycStatus = useSelector(selectKYCStatus);

  const handleCheckout = (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast.error("Please sign in to checkout");
      router.push("/signin");
      return;
    }

    if (!canPurchase) {
      if (kycStatus === null) {
        toast.error("Please complete KYC verification to checkout");
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
      return;
    }

    router.push("/checkout");
  };

  const getKYCWarningMessage = () => {
    if (!isAuthenticated) return null;
    
    if (kycStatus === null) {
      return (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-sm text-yellow-800">
            <strong>KYC Required:</strong> You must complete business verification before checkout.{" "}
            <Link href="/b2b/kyc-setup" className="text-blue underline font-medium">
              Complete KYC now
            </Link>
          </p>
        </div>
      );
    }
    
    if (kycStatus === 'pending') {
      return (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-sm text-blue-800">
            <strong>KYC Pending:</strong> Your application is under review. You&apos;ll be able to checkout once approved.{" "}
            <Link href="/b2b/application-status" className="text-blue underline font-medium">
              Check status
            </Link>
          </p>
        </div>
      );
    }
    
    if (kycStatus === 'rejected' || kycStatus === 'info_requested') {
      return (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-800">
            <strong>Action Required:</strong> Please update your KYC application to continue.{" "}
            <Link href="/b2b/application-status" className="text-blue underline font-medium">
              View details
            </Link>
          </p>
        </div>
      );
    }
    
    return null;
  };

  return (
    <div className="lg:max-w-[455px] w-full">
      {/* <!-- order list box --> */}
      <div className="bg-white shadow-1 rounded-[10px]">
        <div className="border-b border-gray-3 py-5 px-4 sm:px-8.5">
          <h3 className="font-medium text-xl text-dark">Order Summary</h3>
        </div>

        <div className="pt-2.5 pb-8.5 px-4 sm:px-8.5">
          {/* <!-- title --> */}
          <div className="flex items-center justify-between py-5 border-b border-gray-3">
            <div>
              <h4 className="font-medium text-dark">Product</h4>
            </div>
            <div>
              <h4 className="font-medium text-dark text-right">Subtotal</h4>
            </div>
          </div>

          {/* <!-- product item --> */}
          {cartItems.map((item, key) => (
            <div key={key} className="flex items-center justify-between py-5 border-b border-gray-3">
              <div>
                <p className="text-dark">{item.title}</p>
              </div>
              <div>
                <p className="text-dark text-right">
                  ${Number(item.discountedPrice * item.quantity).toFixed(2)}
                </p>
              </div>
            </div>
          ))}

          {/* <!-- total --> */}
          <div className="flex items-center justify-between pt-5">
            <div>
              <p className="font-medium text-lg text-dark">Total</p>
            </div>
            <div>
              <p className="font-medium text-lg text-dark text-right">
                ${Number(totalPrice).toFixed(2)}
              </p>
            </div>
          </div>

          {/* <!-- checkout button --> */}
          <button
            type="button"
            onClick={handleCheckout}
            disabled={!isAuthenticated || !canPurchase}
            className={`w-full flex justify-center font-medium text-white py-3 px-6 rounded-md ease-out duration-200 mt-7.5 ${
              isAuthenticated && canPurchase
                ? "bg-blue hover:bg-blue-dark cursor-pointer"
                : "bg-gray-400 cursor-not-allowed opacity-60"
            }`}
          >
            {!isAuthenticated 
              ? "Sign In to Checkout" 
              : !canPurchase 
              ? "KYC Required for Checkout"
              : "Proceed to Checkout"}
          </button>
          
          {/* KYC Warning Message */}
          {getKYCWarningMessage()}
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
