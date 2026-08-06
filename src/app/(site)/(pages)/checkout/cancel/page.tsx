import React from "react";
import Cancel from "@/components/Checkout/Cancel";
import { Metadata } from "next";
import { ToastContainer } from "react-toastify";


export const metadata: Metadata = {
  title: "Checkout Cancelled | B2B E-commerce",
  description: "Your checkout process has been cancelled.",
};

const CancelPage = () => {
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
      <Cancel />
    </main>
  );
};

export default CancelPage;
