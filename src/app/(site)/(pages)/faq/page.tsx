import FAQ from "@/components/FAQ";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Frequently Asked Questions | Unifood Business to Business E-commerce",
  description: "Find answers to frequently asked questions about wholesale order cutoffs, cold-chain safety monitoring, invoices, payment terms, and buyer approvals.",
};

const FAQPage = () => {
  return (
    <main>
      <FAQ />
    </main>
  );
};

export default FAQPage;
