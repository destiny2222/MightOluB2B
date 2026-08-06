import React from "react";
import Success from "@/components/Checkout/Success";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Checkout Success | B2B E-commerce",
  description: "Your checkout was successful.",
};

const SuccessPage = () => {
  return (
    <main>
      <Success />
    </main>
  );
};

export default SuccessPage;
