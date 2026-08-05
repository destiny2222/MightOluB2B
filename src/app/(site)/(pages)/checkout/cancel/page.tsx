import React from "react";
import Cancel from "@/components/Checkout/Cancel";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Checkout Cancelled | B2B E-commerce",
  description: "Your checkout process has been cancelled.",
};

const CancelPage = () => {
  return (
    <main>
      <Cancel />
    </main>
  );
};

export default CancelPage;
