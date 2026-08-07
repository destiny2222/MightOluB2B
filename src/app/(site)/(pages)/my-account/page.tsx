import MyAccount from "@/components/MyAccount";
import React from "react";
import { ToastContainer } from "react-toastify";


import { Metadata } from "next";
export const metadata: Metadata = {
  title: "My Account | Business to Business E-commerce",
  description: "Manage your wholesale profile, configure corporate billing and shipping details, add authorized buyers, check KYC status, and track purchase orders.",
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
