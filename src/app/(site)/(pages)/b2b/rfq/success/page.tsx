"use client";

import React, { useEffect, useState } from "react";
import Breadcrumb from "@/components/Common/Breadcrumb";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

const RfqSuccessPage = () => {
  const searchParams = useSearchParams();
  const [reference, setReference] = useState<string | null>(null);

  useEffect(() => {
    setReference(searchParams.get("ref"));
  }, [searchParams]);

  return (
    <main>
      <Breadcrumb title="RFQ Submitted" pages={["Home", "B2B", "RFQ Success"]} />

      <section className="pb-20 pt-10">
        <div className="max-w-[800px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="bg-white p-10 rounded-[10px] shadow-1 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            <h2 className="text-3xl font-bold text-dark mb-4">Request Submitted Successfully!</h2>
            
            <div className="bg-gray-1 rounded-md p-4 inline-block mb-6 border border-gray-3">
              <p className="text-sm text-gray-5 uppercase tracking-wider font-semibold mb-1">Reference Number</p>
              <p className="text-xl font-bold text-dark">{reference || "RFQ-PENDING"}</p>
            </div>

            <p className="text-gray-5 mb-8 max-w-lg mx-auto">
              Thank you for your Request for Quotation. Our Mightyolu trade sales team has received your request and will review it shortly. 
              You can expect a quote within <span className="font-bold text-dark">2 business days</span>.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                href="/b2b/rfq/history"
                className="bg-dark text-white px-8 py-3 rounded font-medium hover:bg-dark/90 transition w-full sm:w-auto text-center"
              >
                View RFQ History
              </Link>
              <Link 
                href="/product"
                className="bg-white text-dark border border-gray-3 px-8 py-3 rounded font-medium hover:bg-gray-1 transition w-full sm:w-auto text-center"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default RfqSuccessPage;
