import ForgotPassword from "@/components/Auth/ForgotPassword";
import React from "react";
import { ToastContainer } from "react-toastify";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forgot Password | Business to Business E-commerce",
  description: "Request a password reset link",
};

const ForgotPasswordPage = () => {
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
      <ForgotPassword />
    </main>
  );
};

export default ForgotPasswordPage;
