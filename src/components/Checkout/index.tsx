"use client";
import React, { useEffect } from "react";
import Breadcrumb from "../Common/Breadcrumb";
import Shipping from "./Shipping";
import ShippingMethod from "./ShippingMethod";
import PaymentMethod from "./PaymentMethod";
import { useKYCProtection } from "@/hooks/useKYCProtection";
import { useSelector } from "react-redux";
import { selectHasB2BAccess, selectCurrentView, selectToken } from "@/redux/features/auth-slice";
import { selectCartItems, selectTotalPrice } from "@/redux/features/cart-slice";
import { useAppDispatch } from "@/redux/store";
import { 
  fetchB2BCheckout, 
  submitB2BCheckout,
  selectCheckoutDetails,
  selectCheckoutSelectedAddressId,
  selectCheckoutSelectedRateId,
  selectCheckoutManualAddress,
  selectCheckoutPaymentMethod,
  selectCheckoutPoNumber,
  selectCheckoutSubmitStatus,
  setSelectedAddressId,
  setSelectedRateId,
  setManualAddress,
  setPaymentMethod,
  setPoNumber
} from "@/redux/features/b2b-checkout-slice";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const Checkout = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  
  const hasB2BAccess = useSelector(selectHasB2BAccess);
  const currentView = useSelector(selectCurrentView);
  const isB2B = hasB2BAccess && currentView === 'business';
  const token = useSelector(selectToken);
  
  const reduxCartItems = useSelector(selectCartItems);
  const reduxTotalPrice = useSelector(selectTotalPrice);

  const checkoutDetails = useSelector(selectCheckoutDetails);
  const selectedAddressId = useSelector(selectCheckoutSelectedAddressId);
  const selectedRateId = useSelector(selectCheckoutSelectedRateId);
  const manualAddress = useSelector(selectCheckoutManualAddress);
  const paymentMethod = useSelector(selectCheckoutPaymentMethod);
  const poNumber = useSelector(selectCheckoutPoNumber);
  const submitStatus = useSelector(selectCheckoutSubmitStatus);
  const isSubmitting = submitStatus === "submitting";
 

  // Protect checkout - require approved KYC
  useKYCProtection({
    level: 'kyc-approved',
    redirectTo: '/b2b/application-status',
    toastMessage: 'You must have an approved B2B account to checkout'
  });

  useEffect(() => {
    if (isB2B && token) {
      dispatch(fetchB2BCheckout(token));
    }
  }, [isB2B, token, dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isB2B) {
      toast.success("Consumer checkout process is not implemented in this demo.");
      return;
    }

    if (!selectedAddressId && (!manualAddress.address || !manualAddress.city || !manualAddress.country || !manualAddress.postal_code)) {
      toast.error("Please provide a complete shipping address.");
      return;
    }

    if (!selectedRateId) {
      toast.error("Please select a shipping method.");
      return;
    }

    if (!token) return;

    try {
      const selectedAddress = checkoutDetails?.shipping_addresses?.find((a: any) => a.id === selectedAddressId);
      
      let payload: any = {
        payment_method: paymentMethod,
        po_number: poNumber,
        shipping_rate_id: selectedRateId,
        success_url: `${window.location.origin}/checkout/success`,
        cancel_url: `${window.location.origin}/checkout/cancel`
      };

      if (selectedAddressId && selectedAddress) {
        payload["ship-address"] = "manual";
        payload.address = selectedAddress.address;
        payload.city = selectedAddress.city;
        payload.state = selectedAddress.state || "";
        payload.country = selectedAddress.country;
        payload.postal_code = selectedAddress.postal_code;
      } else {
        payload["ship-address"] = "manual";
        payload.address = manualAddress.address;
        payload.city = manualAddress.city;
        payload.state = manualAddress.state || "";
        payload.country = manualAddress.country;
        payload.postal_code = manualAddress.postal_code;
      }

      const resultAction = await dispatch(submitB2BCheckout({ token, payload }));
      
      if (submitB2BCheckout.fulfilled.match(resultAction)) {
        const data = resultAction.payload;
        if (data.checkout_url) {
          window.location.href = data.checkout_url;
        } else {
          toast.success("Purchase Order submitted successfully!");
          router.push("/b2b/orders");
        }
      } else {
        toast.error((resultAction.payload as string) || "Failed to submit order");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  const cartItems = isB2B 
    ? (checkoutDetails?.cart_items || [])
    : reduxCartItems.map((item: any) => ({
        id: item.id,
        product_title: item.title,
        quantity: item.quantity,
        subtotal: item.discountedPrice * item.quantity
      }));
  const totalPrice = isB2B ? (checkoutDetails?.total_price || 0) : reduxTotalPrice;
  const subtotal = isB2B ? (checkoutDetails?.subtotal || 0) : reduxTotalPrice;
  const deliveryFee = isB2B ? (checkoutDetails?.delivery_fee || 0) : 0;

  return (
    <>
      <Breadcrumb title={"Checkout"} pages={["checkout"]} />
      <section className="overflow-hidden py-20 bg-[#F9FAFB]">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col lg:flex-row gap-7.5 xl:gap-11">
              {/* <!-- checkout left --> */}
              <div className="lg:max-w-[670px] w-full flex flex-col gap-6">
                <Shipping 
                  addresses={checkoutDetails?.shipping_addresses || []}
                  selectedAddressId={selectedAddressId}
                  onSelectAddress={(id) => dispatch(setSelectedAddressId(id))}
                  manualAddress={manualAddress}
                  setManualAddress={(address) => dispatch(setManualAddress(address))}
                />
                
                <ShippingMethod 
                  rates={checkoutDetails?.shipping_rates || []}
                  selectedRateId={selectedRateId}
                  onSelectRate={(id) => dispatch(setSelectedRateId(id))}
                />
                
                <PaymentMethod 
                  onPaymentMethodChange={(method) => dispatch(setPaymentMethod(method))} 
                  poNumber={poNumber} 
                  onPoNumberChange={(po) => dispatch(setPoNumber(po))} 
                />
              </div>

              {/* // <!-- checkout right --> */}
              <div className="max-w-[455px] w-full relative">
                <div className="sticky top-24 bg-white shadow-lg shadow-blue/5 rounded-2xl border border-gray-2 overflow-hidden">
                  <div className="bg-gray-1/50 border-b border-gray-2 py-5 px-6 sm:px-8.5">
                    <h3 className="font-semibold text-xl text-dark">
                      Order Summary
                    </h3>
                  </div>

                  <div className="pt-2.5 pb-8.5 px-4 sm:px-8.5">
                    {/* <!-- title --> */}
                    <div className="flex items-center justify-between py-5 border-b border-gray-3">
                      <div>
                        <h4 className="font-medium text-dark">Product</h4>
                      </div>
                      <div>
                        <h4 className="font-medium text-dark text-right">
                          Subtotal
                        </h4>
                      </div>
                    </div>

                    {cartItems.map((item: any) => (
                      <div key={item.id} className="flex items-center justify-between py-5 border-b border-gray-3">
                        <div>
                          <p className="text-dark">
                            {item.product_title} 
                            <span className="text-dark-5 ml-2 bg-gray-2 px-1.5 py-0.5 rounded text-xs"> Qty: {item.quantity}</span>
                          </p>
                        </div>
                        <div>
                          <p className="text-dark text-right">${item.subtotal.toFixed(2)}</p>
                        </div>
                      </div>
                    ))}

                    <div className="flex items-center justify-between py-5 border-b border-gray-3">
                      <div>
                        <p className="text-dark">Subtotal</p>
                      </div>
                      <div>
                        <p className="text-dark text-right">${subtotal.toFixed(2)}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between py-5 border-b border-gray-3">
                      <div>
                        <p className="text-dark">Shipping Fee</p>
                      </div>
                      <div>
                        <p className="text-dark text-right">${deliveryFee.toFixed(2)}</p>
                      </div>
                    </div>

                    {/* <!-- total --> */}
                    <div className="flex items-center justify-between pt-5">
                      <div>
                        <p className="font-medium text-lg text-dark">Total</p>
                      </div>
                      <div>
                        <p className="font-medium text-lg text-dark text-right">
                          ${totalPrice.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 sm:p-8.5 pt-0 mt-4">
                    <button
                      type="submit"
                      disabled={isSubmitting || !checkoutDetails}
                      className="w-full flex items-center justify-center gap-2 font-medium text-white bg-dark py-3.5 px-6 rounded-xl ease-out duration-200 hover:bg-dark/90 hover:shadow-lg disabled:opacity-50 transition-all mt-4"
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing...
                        </>
                      ) : (
                        "Place Order"
                      )}
                    </button>
                    
                    <p className="text-center text-custom-xs text-gray-5 mt-4">
                      By placing your order, you agree to our Terms of Service and Privacy Policy.
                    </p>
                  </div>
                </div> 
              </div>
            </div>
          </form>
        </div>
      </section>
    </>
  );
};

export default Checkout;
