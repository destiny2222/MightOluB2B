"use client";

import React from "react";

const TrustFooterBar = () => {
  return (
    <div className="bg-[#052212] text-white py-4 px-6 sm:px-8 rounded-2xl border border-white/15 shadow-xl">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 divide-y sm:divide-y-0 lg:divide-x divide-white/15">

        <div className="flex items-center gap-3 pt-3 sm:pt-0 sm:px-3 first:pl-0">
          <div className="w-8 h-8 rounded-lg bg-[#7ece19]/15 text-[#7ece19] flex items-center justify-center shrink-0">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <span className="text-xs sm:text-sm font-bold text-white tracking-wide">
            Trusted by Businesses Across the UK
          </span>
        </div>

        <div className="flex items-center gap-3 pt-3 sm:pt-0 sm:px-3">
          <div className="w-8 h-8 rounded-lg bg-[#7ece19]/15 text-[#7ece19] flex items-center justify-center shrink-0">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
          </div>
          <span className="text-xs sm:text-sm font-bold text-white tracking-wide">
            Quality African Products
          </span>
        </div>

        <div className="flex items-center gap-3 pt-3 sm:pt-0 sm:px-3">
          <div className="w-8 h-8 rounded-lg bg-[#7ece19]/15 text-[#7ece19] flex items-center justify-center shrink-0">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <span className="text-xs sm:text-sm font-bold text-white tracking-wide">
            Secure & Encrypted Transactions
          </span>
        </div>

        <div className="flex items-center gap-3 pt-3 sm:pt-0 sm:px-3">
          <div className="w-8 h-8 rounded-lg bg-[#7ece19]/15 text-[#7ece19] flex items-center justify-center shrink-0">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <span className="text-xs sm:text-sm font-bold text-white tracking-wide">
            Your Growth, Our Priority
          </span>
        </div>

      </div>
    </div>
  );
};

export default TrustFooterBar;
