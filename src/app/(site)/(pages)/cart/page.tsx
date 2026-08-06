import React from "react";
import Cart from "@/components/Cart";
import { ToastContainer } from "react-toastify";

import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Cart Page | B2B  B2B E-commerce",
  description: "This is Cart Page for B2B  Template",
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
