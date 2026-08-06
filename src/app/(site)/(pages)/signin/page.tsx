import Signin from "@/components/Auth/Signin";
import React from "react";
import { Metadata } from "next";
import { ToastContainer } from "react-toastify";


export const metadata: Metadata = {
  title: "Signin Page | B2B  B2B E-commerce",
  description: "This is Signin Page for B2B  Template",
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
