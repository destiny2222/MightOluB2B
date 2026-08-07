import React from "react";
import Error from "@/components/Error";

import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Error Page | Business to Business E-commerce",
  description: "Something went wrong. Return to the homepage or contact our team if you are having issues accessing your wholesale order portal.",
  // other metadata
};

const ErrorPage = () => {
  return (
    <main>
      <Error />
    </main>
  );
};

export default ErrorPage;
