import MyAccount from "@/components/MyAccount";
import React, { Suspense } from "react";
import { ToastContainer } from "react-toastify";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Account | Business to Business E-commerce",
  description: "Manage your wholesale profile, configure corporate billing and shipping details, add authorized buyers, check KYC status, and track purchase orders.",
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
      <Suspense fallback={
        <div className="py-20 text-center text-dark">
          <p className="text-gray-5">Loading account...</p>
        </div>
      }>
        <MyAccount />
      </Suspense>
    </main>
  );
};

export default MyAccountPage;
