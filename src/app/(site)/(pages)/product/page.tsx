import React from "react";
import ShopWithSidebar from "@/components/ShopWithSidebar";
import { ToastContainer } from "react-toastify";

import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Shop Page | B2B  B2B E-commerce",
  description: "This is Shop Page for B2B  Template",
  // other metadata
};

const ShopWithSidebarPage = () => {
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
      <ShopWithSidebar />
    </main>
  );
};

export default ShopWithSidebarPage;
