import Signin from "@/components/Auth/Signin";
import React, { Suspense } from "react";
import { Metadata } from "next";
import { ToastContainer } from "react-toastify";

export const metadata: Metadata = {
  title: "Signin Page | Business to Business E-commerce",
  description: "Sign in to your wholesale buyer or company account. Access exclusive direct-from-farm catalog pricing, manage user permissions, and order food supplies.",
};

const SigninPage = () => {
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
          <p className="text-gray-5">Loading signin...</p>
        </div>
      }>
        <Signin />
      </Suspense>
    </main>
  );
};

export default SigninPage;
