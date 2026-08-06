import React, { useState } from "react";

const PaymentMethod = ({ onPaymentMethodChange, poNumber, onPoNumberChange }: any) => {
  // Set Stripe as default payment method when component mounts
  React.useEffect(() => {
    if (onPaymentMethodChange) {
      onPaymentMethodChange("card");
    }
  }, [onPaymentMethodChange]);

  return (
    <div className="bg-white shadow-md rounded-2xl mt-7.5 border border-gray-2 overflow-hidden">
      <div className="border-b border-gray-2 bg-gray-1/50 py-5 px-6 sm:px-8.5">
        <h3 className="font-semibold text-lg text-dark flex items-center gap-2.5">Payment Method</h3>
      </div>

      <div className="p-4 sm:p-8.5">
        <div className="flex flex-col gap-3">
          <label
            htmlFor="card"
            className="flex cursor-pointer select-none items-center gap-4 rounded-xl border border-blue bg-blue/5 p-5 ring-1 ring-blue/20 transition-all duration-200"
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
            <div className="w-full">
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

          {/* <div className="mt-4 pt-4 border-t border-gray-3">
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
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default PaymentMethod;

