import Signup from "@/components/Auth/Signup";
import React from "react";
import { ToastContainer } from "react-toastify";


import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Signup Page | B2B  B2B E-commerce",
  description: "This is Signup Page for B2B  Template",
  // other metadata
};

const SignupPage = () => {
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
      <Signup />
    </main>
  );
};

export default SignupPage;
