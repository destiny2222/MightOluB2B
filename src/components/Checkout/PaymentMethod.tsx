import React, { useState } from "react";
import Image from "next/image";
import { useSelector } from "react-redux";
import { selectUser, selectHasB2BAccess, selectCurrentView } from "@/redux/features/auth-slice";

const PaymentMethod = ({ onPaymentMethodChange, poNumber, onPoNumberChange }: any) => {
  const [payment, setPayment] = useState("card");
  const user = useSelector(selectUser);
  const hasB2BAccess = useSelector(selectHasB2BAccess);
  const currentView = useSelector(selectCurrentView);
  
  const isB2B = hasB2BAccess && currentView === 'business';
  
  // Set Stripe as default payment method when component mounts
  React.useEffect(() => {
    if (onPaymentMethodChange) {
      onPaymentMethodChange("card");
    }
  }, [onPaymentMethodChange]);

  return (
    <div className="bg-white shadow-1 rounded-[10px] mt-7.5">
      <div className="border-b border-gray-3 py-5 px-4 sm:px-8.5">
        <h3 className="font-medium text-xl text-dark">Payment Method</h3>
      </div>

      <div className="p-4 sm:p-8.5">
        <div className="flex flex-col gap-3">
          <label
            htmlFor="card"
            className="flex cursor-pointer select-none items-center gap-4"
          >
            <div className="relative">
              <input
                type="checkbox"
                name="card"
                id="card"
                className="sr-only"
                checked={true}
                readOnly
              />
              <div
                className={`flex h-4 w-4 items-center justify-center rounded-full border-4 border-blue`}
              ></div>
            </div>
            <div
              className={`rounded-md border-[0.5px] py-3.5 px-5 ease-out duration-200 border-transparent bg-gray-2 min-w-[240px]`}
            >
              <div className="flex items-center">
                <div className="pr-2.5 flex items-center justify-center gap-1">
                  <svg className="w-8 h-8 text-dark" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                  </svg>
                </div>

                <div className="border-l border-gray-4 pl-2.5">
                  <p>Credit Card (Stripe)</p>
                </div>
              </div>
            </div>
          </label>

          {/* {isB2B && (
            <div className="mt-4 pt-4 border-t border-gray-3">
              <label htmlFor="po_number" className="block text-dark font-medium mb-2 text-sm">
                Purchase Order Number / Reference
              </label>
              <input
                type="text"
                id="po_number"
                value={poNumber || ''}
                onChange={(e) => onPoNumberChange && onPoNumberChange(e.target.value)}
                placeholder="Enter your internal PO number"
                className="w-full rounded-md border border-gray-3 px-4 py-2 text-sm outline-none focus:border-blue"
              />
              <p className="text-xs text-gray-5 mt-1">Optional. For your internal record keeping.</p>
            </div>
          )} */}
        </div>
      </div>
    </div>
  );
};

export default PaymentMethod;
