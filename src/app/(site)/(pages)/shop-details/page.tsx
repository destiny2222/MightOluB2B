import React from "react";
import ShopDetails from "@/components/ShopDetails";
import { Metadata } from "next";
import { ToastContainer } from "react-toastify";

export const metadata: Metadata = {
  title: "Shop Details Page | B2B  B2B E-commerce",
  description: "This is Shop Details Page for B2B  Template",
  // other metadata
};

const ShopDetailsPage = () => {
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
      <ShopDetails />
    </main>
  );
};

export default ShopDetailsPage;
