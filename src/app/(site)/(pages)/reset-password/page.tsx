import ResetPassword from "@/components/Auth/ResetPassword";
import React, { Suspense } from "react";
import { ToastContainer } from "react-toastify";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reset Password | B2B E-commerce",
  description: "Reset your password",
};

const ResetPasswordPage = () => {
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
      <Suspense fallback={<div className="flex justify-center py-20">Loading...</div>}>
        <ResetPassword />
      </Suspense>
    </main>
  );
};

export default ResetPasswordPage;
