import B2BSignin from "@/components/Auth/B2BSignin";
import React from "react";

import { Metadata } from "next";
export const metadata: Metadata = {
  title: "B2B Login | Trade Account Access",
  description: "Login to your B2B trade account to access wholesale pricing and manage orders",
};

const B2BSigninPage = () => {
  return (
    <main>
      <B2BSignin />
    </main>
  );
};

export default B2BSigninPage;
