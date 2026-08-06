import Signin from "@/components/Auth/Signin";
import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Business to Business Login | Trade Account Signin",
  description: "Sign in to your wholesale buyer or company account to access direct pricing and bulk order workflows.",
};

const B2BLoginPage = () => {
  return (
    <main>
      <Signin />
    </main>
  );
};

export default B2BLoginPage;
