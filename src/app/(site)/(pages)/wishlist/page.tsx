import React from "react";
import { Wishlist } from "@/components/Wishlist";
import { Metadata } from "next";
import { ToastContainer } from "react-toastify";


export const metadata: Metadata = {
  title: "Wishlist Page | Business to Business E-commerce",
  description: "View and manage your saved wholesale food products, ingredients, and kitchen supply lists. Keep track of items to simplify your recurring business procurement.",
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
