"use client";
import React from "react";
import Breadcrumb from "../Common/Breadcrumb";
import Link from "next/link";

const Cancel = () => {
  return (
    <>
      <Breadcrumb title={"Payment Cancelled"} pages={["checkout", "cancel"]} />
      <section className="overflow-hidden py-20 bg-gray-2 min-h-[60vh] flex items-center justify-center">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="bg-white shadow-1 rounded-[10px] py-16 px-8 text-center max-w-2xl mx-auto flex flex-col items-center border-t-4 border-red-500">
            <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            
            <h2 className="text-3xl font-bold text-dark mb-4">Checkout Cancelled</h2>
            <p className="text-gray-5 mb-8 text-lg">
              You have cancelled the checkout process. Your order has not been placed and no charges have been made.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center w-full sm:w-auto">
              <Link
                href="/cart"
                className="inline-flex justify-center items-center py-3 px-8 text-base font-medium text-white bg-blue rounded-md hover:bg-blue-dark ease-out duration-200 w-full sm:w-auto shadow-sm hover:shadow-md"
              >
                Return to Cart
              </Link>
              <Link
                href="/product"
                className="inline-flex justify-center items-center py-3 px-8 text-base font-medium text-dark bg-gray-2 border border-gray-3 rounded-md hover:bg-gray-3 ease-out duration-200 w-full sm:w-auto"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Cancel;
