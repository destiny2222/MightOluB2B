import KYCSetup from "@/components/B2B/KYCSetup";
import React from "react";

import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Complete B2B Profile | KYC Setup",
  description: "Complete your B2B trade account profile to access wholesale pricing",
};

const KYCSetupPage = () => {
  return (
    <main>
      <KYCSetup />
    </main>
  );
};

export default KYCSetupPage;
