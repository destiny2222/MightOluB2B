import ApplicationStatus from "@/components/B2B/ApplicationStatus";
import React from "react";

import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Application Status | B2B Trade Account",
  description: "Check the status of your B2B trade account application",
};

const ApplicationStatusPage = () => {
  return (
    <main>
      <ApplicationStatus />
    </main>
  );
};

export default ApplicationStatusPage;
