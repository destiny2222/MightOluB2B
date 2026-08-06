import React from "react";
import Cart from "@/components/Cart";
import { ToastContainer } from "react-toastify";

import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Cart Page | Business to Business E-commerce",
  description: "Review items in your wholesale shopping cart, adjust quantities, and proceed to checkout to finalize your business food supplies order.",
  // other metadata
};

const CartPage = () => {
  return (
    <>
      <ToastContainer 
       position="top-right"
       autoClose={3000}
       hideProgressBar={false}
       newestOnTop={false}
       closeOnClick
       rtl={false}
       pauseOnFocusLoss
       draggable
       pauseOnHover
       theme="colored"
      />
      <Cart />
    </>
  );
};

export default CartPage;
