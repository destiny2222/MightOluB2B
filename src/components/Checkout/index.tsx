"use client";
import React from "react";
import Breadcrumb from "../Common/Breadcrumb";
import Login from "./Login";
import Shipping from "./Shipping";
import ShippingMethod from "./ShippingMethod";
import PaymentMethod from "./PaymentMethod";
import Coupon from "./Coupon";
import Billing from "./Billing";
import { useKYCProtection } from "@/hooks/useKYCProtection";
import { useSelector } from "react-redux";
import { selectHasB2BAccess, selectCurrentView } from "@/redux/features/auth-slice";
import { selectCartItems, selectTotalPrice } from "@/redux/features/cart-slice";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const Checkout = () => {
  const router = useRouter();
  const hasB2BAccess = useSelector(selectHasB2BAccess);
  const currentView = useSelector(selectCurrentView);
  const isB2B = hasB2BAccess && currentView === 'business';
  const cartItems = useSelector(selectCartItems);
  const totalPrice = useSelector(selectTotalPrice);
  
  const [paymentMethod, setPaymentMethod] = React.useState("card");
  const [poNumber, setPoNumber] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  // Protect checkout - require approved KYC
  useKYCProtection({
    level: 'kyc-approved',
    redirectTo: '/b2b/application-status',
    toastMessage: 'You must have an approved B2B account to checkout'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isB2B) {
      toast.success("Consumer checkout process is not implemented in this demo.");
      return;
    }

    setIsSubmitting(true);
    try {
      const orderItems = cartItems.map(item => ({
        product_id: item.id,
        quantity: item.quantity,
        unit_price: item.discountedPrice || item.price
      }));

      const res = await fetch(`${process.env.NEXT_PUBLIC_LARAVEL_URL}/api/v1/b2b/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          payment_method: paymentMethod,
          po_number: poNumber,
          items: orderItems
        })
      });

      if (res.ok) {
        const data = await res.json();
        
        if (data.checkout_url) {
          // Redirect to Stripe checkout
          window.location.href = data.checkout_url;
        } else {
          toast.success("Purchase Order submitted successfully!");
          router.push("/b2b/orders");
        }
      } else {
        const err = await res.json();
        toast.error(err.message || "Failed to submit order");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Breadcrumb title={"Checkout"} pages={["checkout"]} />
      <section className="overflow-hidden py-20 bg-gray-2">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col lg:flex-row gap-7.5 xl:gap-11">
              {/* <!-- checkout left --> */}
              <div className="lg:max-w-[670px] w-full">
                {/* <!-- billing details --> */}
                <Billing />

                {/* <!-- address box two --> */}
                <Shipping />

                {/* <!-- others note box --> */}
                <div className="bg-white shadow-1 rounded-[10px] p-4 sm:p-8.5 mt-7.5">
                  <div>
                    <label htmlFor="notes" className="block mb-2.5">
                      Other Notes (optional)
                    </label>

                    <textarea
                      name="notes"
                      id="notes"
                      rows={5}
                      placeholder="Notes about your order, e.g. speacial notes for delivery."
                      className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full p-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                    ></textarea>
                  </div>
                </div>
              </div>

              {/* // <!-- checkout right --> */}
              <div className="max-w-[455px] w-full">
                {/* <!-- order list box --> */}
                <div className="bg-white shadow-1 rounded-[10px]">
                  <div className="border-b border-gray-3 py-5 px-4 sm:px-8.5">
                    <h3 className="font-medium text-xl text-dark">
                      Your Order
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

                    {cartItems.map((item) => (
                      <div key={item.cartItemId || item.id} className="flex items-center justify-between py-5 border-b border-gray-3">
                        <div>
                          <p className="text-dark">{item.title}</p>
                        </div>
                        <div>
                          <p className="text-dark text-right">${(item.discountedPrice * item.quantity).toFixed(2)}</p>
                        </div>
                      </div>
                    ))}

                    {/* <!-- product item --> */}
                    {/* <div className="flex items-center justify-between py-5 border-b border-gray-3">
                      <div>
                        <p className="text-dark">Shipping Fee</p>
                      </div>
                      <div>
                        <p className="text-dark text-right">$15.00</p>
                      </div>
                    </div> */}

                    {/* <!-- total --> */}
                    <div className="flex items-center justify-between pt-5">
                      <div>
                        <p className="font-medium text-lg text-dark">Total</p>
                      </div>
                      <div>
                        <p className="font-medium text-lg text-dark text-right">
                          ${(totalPrice).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div> 
                {/* <!-- shipping box --> */}
                {/* <ShippingMethod /> */}
                <PaymentMethod 
                  onPaymentMethodChange={setPaymentMethod} 
                  poNumber={poNumber} 
                  onPoNumberChange={setPoNumber} 
                />
                {/* <!-- checkout button --> */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex justify-center font-medium text-white bg-blue py-3 px-6 rounded-md ease-out duration-200 hover:bg-blue-dark mt-7.5 disabled:opacity-50"
                >
                  {isSubmitting ? "Processing..." : "Process to Checkout"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>
    </>
  );
};

export default Checkout;
