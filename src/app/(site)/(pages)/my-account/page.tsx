import MyAccount from "@/components/MyAccount";
import React from "react";
import { ToastContainer } from "react-toastify";


import { Metadata } from "next";
export const metadata: Metadata = {
  title: "My Account | B2B  B2B E-commerce",
  description: "This is My Account page for B2B  Template",
  // other metadata
};

const MyAccountPage = () => {
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
      <MyAccount />
    </main>
  );
};

export default MyAccountPage;
