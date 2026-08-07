"use client";

import React from "react";

const HowItWorks = () => {
  const steps = [
    {
      num: 1,
      title: "APPLY",
      desc: "Complete our simple business registration form",
      icon: (
        <svg className="w-6 h-6 text-[#0d4726]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      )
    },
    {
      num: 2,
      title: "GET VERIFIED",
      desc: "Submit your KYC documents for approval",
      icon: (
        <svg className="w-6 h-6 text-[#0d4726]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h3" />
        </svg>
      )
    },
    {
      num: 3,
      title: "GET APPROVED",
      desc: "Our team reviews and approves your business account",
      icon: (
        <svg className="w-6 h-6 text-[#0d4726]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      )
    },
    {
      num: 4,
      title: "START ORDERING",
      desc: "Access trade prices and start shopping in bulk",
      icon: (
        <svg className="w-6 h-6 text-[#0d4726]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
        </svg>
      )
    }
  ];

  return (
    <div className="mt-12 mb-10 bg-white rounded-2xl p-8 shadow-sm border border-gray-200/80">

      {/* Title */}
      <h2 className="text-center text-dark font-black text-xl sm:text-2xl uppercase tracking-widest mb-10">
        HOW IT WORKS
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
        {steps.map((step, idx) => (
          <div key={idx} className="relative flex flex-col items-center text-center group">

            {/* Step Circle Container */}
            <div className="relative mb-4">
              <div className="w-16 h-16 rounded-full border-2 border-[#0d4726] bg-green-50/50 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform duration-200">
                {step.icon}
              </div>

              {/* Step Badge Number */}
              <span className="absolute top-0 right-0 translate-x-1.5 -translate-y-1.5 w-6 h-6 rounded-full bg-[#0d4726] text-white text-xs font-bold flex items-center justify-center shadow-sm">
                {step.num}
              </span>
            </div>

            {/* Step Title & Desc */}
            <h3 className="font-extrabold text-sm text-dark uppercase tracking-wide mb-1.5">
              {step.title}
            </h3>
            <p className="text-xs text-gray-5 max-w-[200px] leading-relaxed">
              {step.desc}
            </p>

            {/* Connecting Arrow for desktop (except last item) */}
            {idx < steps.length - 1 && (
              <div className="hidden md:block absolute top-8 left-[65%] w-[70%] h-[2px] border-t-2 border-dashed border-gray-300 pointer-events-none z-0">
                <span className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1 text-gray-400 text-xs">
                  →
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

    </div>
  );
};

export default HowItWorks;
