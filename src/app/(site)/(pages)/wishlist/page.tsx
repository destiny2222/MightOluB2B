import React from "react";
import { Wishlist } from "@/components/Wishlist";
import { Metadata } from "next";
import { ToastContainer } from "react-toastify";


export const metadata: Metadata = {
  title: "Wishlist Page | B2B  B2B E-commerce",
  description: "This is Wishlist Page for B2B  Template",
  // other metadata
};

const WishlistPage = () => {
  return (
    <main>
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
      <Wishlist />
    </main>
  );
};

export default WishlistPage;
