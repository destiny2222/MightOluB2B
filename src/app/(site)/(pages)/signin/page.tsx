import Signin from "@/components/Auth/Signin";
import React from "react";
import { Metadata } from "next";
import { ToastContainer } from "react-toastify";


export const metadata: Metadata = {
  title: "Signin Page | Business to Business E-commerce",
  description: "Sign in to your wholesale buyer or company account. Access exclusive direct-from-farm catalog pricing, manage user permissions, and order food supplies.",
  // other metadata
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
      <Signin />
    </main>
  );
};

export default SigninPage;
