import B2BSignup from "@/components/Auth/Signup";
import React from "react";

import { Metadata } from "next";
export const metadata: Metadata = {
  title: "B2B Registration | Trade Account Signup",
  description: "Register for a B2B trade account to access wholesale pricing and bulk ordering",
};

const B2BSignupPage = () => {
  return (
    <main>
      <B2BSignup />
    </main>
  );
};

export default B2BSignupPage;
