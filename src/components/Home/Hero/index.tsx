"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import HowItWorks from "./HowItWorks";
import TrustFooterBar from "./TrustFooterBar";

const Hero = () => {
  return (
    <section className="bg-gray-1 overflow-hidden pt-32 sm:pt-36 lg:pt-40 pb-16">

      {/* Full-Width Edge-to-Edge Hero Banner */}
      <div className="w-full bg-[#062111] text-white relative shadow-xl">

        {/* Subtle Africa Continent Dot Matrix Silhouette Watermark (Top Right of Left Column) */}
        <div className="absolute top-4 right-1/2 translate-x-12 sm:translate-x-24 w-[320px] sm:w-[420px] h-[400px] pointer-events-none opacity-30 z-0 hidden sm:block">
          <svg viewBox="0 0 300 320" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g fill="#4ca118">
              {/* North Africa / Horn / West Africa / Central / South Africa dots */}
              <circle cx="160" cy="40" r="3" /><circle cx="178" cy="40" r="3" /><circle cx="196" cy="42" r="3" /><circle cx="214" cy="45" r="3" /><circle cx="230" cy="50" r="3" />
              <circle cx="140" cy="55" r="3" /><circle cx="158" cy="55" r="3" /><circle cx="176" cy="55" r="3" /><circle cx="194" cy="55" r="3" /><circle cx="212" cy="58" r="3" /><circle cx="230" cy="62" r="3" /><circle cx="248" cy="68" r="3" />
              <circle cx="110" cy="70" r="3" /><circle cx="128" cy="70" r="3" /><circle cx="146" cy="70" r="3" /><circle cx="164" cy="70" r="3" /><circle cx="182" cy="70" r="3" /><circle cx="200" cy="70" r="3" /><circle cx="218" cy="72" r="3" /><circle cx="236" cy="75" r="3" /><circle cx="254" cy="80" r="3" /><circle cx="270" cy="85" r="3" />
              <circle cx="92" cy="85" r="3" /><circle cx="110" cy="85" r="3" /><circle cx="128" cy="85" r="3" /><circle cx="146" cy="85" r="3" /><circle cx="164" cy="85" r="3" /><circle cx="182" cy="85" r="3" /><circle cx="200" cy="85" r="3" /><circle cx="218" cy="88" r="3" /><circle cx="236" cy="90" r="3" /><circle cx="254" cy="95" r="3" /><circle cx="270" cy="100" r="3" /><circle cx="282" cy="105" r="3" />
              <circle cx="75" cy="100" r="3" /><circle cx="92" cy="100" r="3" /><circle cx="110" cy="100" r="3" /><circle cx="128" cy="100" r="3" /><circle cx="146" cy="100" r="3" /><circle cx="164" cy="100" r="3" /><circle cx="182" cy="100" r="3" /><circle cx="200" cy="100" r="3" /><circle cx="218" cy="102" r="3" /><circle cx="236" cy="105" r="3" /><circle cx="254" cy="110" r="3" /><circle cx="270" cy="115" r="3" />
              <circle cx="85" cy="115" r="3" /><circle cx="102" cy="115" r="3" /><circle cx="120" cy="115" r="3" /><circle cx="138" cy="115" r="3" /><circle cx="156" cy="115" r="3" /><circle cx="174" cy="115" r="3" /><circle cx="192" cy="115" r="3" /><circle cx="210" cy="118" r="3" /><circle cx="228" cy="120" r="3" /><circle cx="246" cy="125" r="3" />
              <circle cx="120" cy="130" r="3" /><circle cx="138" cy="130" r="3" /><circle cx="156" cy="130" r="3" /><circle cx="174" cy="130" r="3" /><circle cx="192" cy="132" r="3" /><circle cx="210" cy="135" r="3" /><circle cx="228" cy="140" r="3" />
              <circle cx="138" cy="145" r="3" /><circle cx="156" cy="145" r="3" /><circle cx="174" cy="145" r="3" /><circle cx="192" cy="148" r="3" /><circle cx="210" cy="150" r="3" /><circle cx="228" cy="155" r="3" />
              <circle cx="146" cy="160" r="3" /><circle cx="164" cy="160" r="3" /><circle cx="182" cy="162" r="3" /><circle cx="200" cy="165" r="3" /><circle cx="218" cy="170" r="3" />
              <circle cx="156" cy="175" r="3" /><circle cx="174" cy="175" r="3" /><circle cx="192" cy="178" r="3" /><circle cx="210" cy="180" r="3" /><circle cx="228" cy="185" r="3" />
              <circle cx="164" cy="190" r="3" /><circle cx="182" cy="190" r="3" /><circle cx="200" cy="193" r="3" /><circle cx="218" cy="195" r="3" />
              <circle cx="170" cy="205" r="3" /><circle cx="188" cy="205" r="3" /><circle cx="206" cy="208" r="3" />
              <circle cx="176" cy="220" r="3" /><circle cx="194" cy="220" r="3" /><circle cx="212" cy="223" r="3" />
              <circle cx="182" cy="235" r="3" /><circle cx="200" cy="235" r="3" />
              <circle cx="188" cy="250" r="3" /><circle cx="200" cy="250" r="3" />
              <circle cx="194" cy="265" r="3" />
              {/* Madagascar Island */}
              <circle cx="255" cy="198" r="3" /><circle cx="258" cy="214" r="3" /><circle cx="260" cy="230" r="3" />
            </g>
          </svg>
        </div>

        <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch min-h-[520px]">

            {/* Left Column: Content & CTAs (7 cols) */}
            <div className="lg:col-span-7 py-8 sm:py-12 lg:py-14 lg:pr-10 flex flex-col justify-between">
              <div>
                {/* Category Tag */}
                <span className="text-[#5ca815] font-extrabold text-xs sm:text-sm tracking-widest uppercase block mb-3">
                  BUSINESS-TO-BUSINESS
                </span>

                {/* Main Title */}
                <h1 className="text-3xl sm:text-5xl lg:text-[54px] font-black leading-[1.08] text-white tracking-tight mb-4">
                  Powering Digital <br />
                  <span className="text-[#5ca815]">African Food Commerce</span>
                </h1>

                {/* Subtitle */}
                <p className="text-white/85 text-sm sm:text-base font-normal leading-relaxed max-w-xl mb-8">
                  Business growth made possible with exclusive trade pricing, bulk ordering and reliable supply—all in one place.
                </p>

                {/* 4 Feature Items (Horizontal layout with icons) */}
                <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-x-6 gap-y-4 mb-9 text-xs sm:text-sm">
                  <div className="flex items-center gap-2.5 text-white/90 font-medium">
                    <svg className="w-4 h-4 text-[#5ca815] shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    <span>Exclusive Trade Pricing</span>
                  </div>

                  <div className="flex items-center gap-2.5 text-white/90 font-medium">
                    <svg className="w-4 h-4 text-[#5ca815] shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                    <span>Bulk Ordering Made Simple</span>
                  </div>

                  <div className="flex items-center gap-2.5 text-white/90 font-medium">
                    <svg className="w-4 h-4 text-[#5ca815] shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a2 2 0 104 0m-5 0a2 2 0 104 0" />
                    </svg>
                    <span>Reliable Nationwide Delivery</span>
                  </div>

                  <div className="flex items-center gap-2.5 text-white/90 font-medium">
                    <svg className="w-4 h-4 text-[#5ca815] shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a5 5 0 010-7.072m0 0l2.829 2.829M8.464 15.536l-2.829 2.829M3 21l3.536-3.536" />
                    </svg>
                    <span>Dedicated Business Support</span>
                  </div>
                </div>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 mb-6">
                  <Link
                    href="/signin"
                    className="bg-[#5ca815] hover:bg-[#4d900f] text-white font-extrabold px-6 py-3.5 rounded-md text-xs sm:text-sm uppercase tracking-wider transition-colors text-center shadow-md"
                  >
                    APPLY FOR BUSINESS ACCOUNT
                  </Link>
                  <Link
                    href="/signin"
                    className="bg-[#062111] border border-white/40 hover:border-white text-white font-extrabold px-6 py-3.5 rounded-md text-xs sm:text-sm uppercase tracking-wider transition-colors text-center"
                  >
                    SIGN IN TO YOUR ACCOUNT
                  </Link>
                </div>
              </div>

              {/* Security Tagline */}
              <div className="flex items-center gap-2 text-white/70 text-xs font-medium">
                <svg className="w-4 h-4 text-[#5ca815]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span>Secure. Trusted. Built for Your Business.</span>
              </div>

            </div>

            {/* Right Column: Hero Photo & Floating Trust Badge (5 cols) */}
            <div className="lg:col-span-5 relative min-h-[340px] lg:min-h-full flex items-stretch">

              <div className="relative w-full h-full min-h-[340px]">
                <Image
                  src="/hero1.jpeg"
                  alt="MightyOlu Products & Warehouse Staff"
                  fill
                  className="object-cover object-center"
                  priority
                />
              </div>

              {/* Floating Trust Card (Top Right Overlay) */}
              <div className="absolute top-6 right-6 lg:top-8 lg:right-8 z-20 w-56 sm:w-64 bg-white rounded-xl shadow-2xl p-4 border border-gray-100 text-dark">
                <div className="flex flex-col gap-2.5 text-xs">

                  <div className="flex items-start gap-2.5">
                    <svg className="w-4 h-4 text-[#062111] shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <h4 className="font-bold text-dark leading-tight">Minimum Order</h4>
                      <p className="font-extrabold text-[#062111]">£1,000</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 border-t border-gray-100 pt-2">
                    <svg className="w-4 h-4 text-[#062111] shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <div>
                      <h4 className="font-bold text-dark leading-tight">KYC Verified</h4>
                      <p className="text-gray-5">Business Accounts</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 border-t border-gray-100 pt-2">
                    <svg className="w-4 h-4 text-[#062111] shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <div>
                      <h4 className="font-bold text-dark leading-tight">Secure Payments</h4>
                      <p className="text-gray-5">& Transactions</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 border-t border-gray-100 pt-2">
                    <svg className="w-4 h-4 text-[#062111] shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a5 5 0 010-7.072m0 0l2.829 2.829M8.464 15.536l-2.829 2.829M3 21l3.536-3.536" />
                    </svg>
                    <div>
                      <h4 className="font-bold text-dark leading-tight">Fast & Reliable</h4>
                      <p className="text-gray-5">Delivery</p>
                    </div>
                  </div>

                </div>
              </div>

            </div>

          </div>
        </div>
      </div>

      {/* Main Content Container for Below-Hero Blocks */}
      <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8">

        {/* 4 Feature Bar Below Hero */}
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-5 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 divide-y sm:divide-y-0 sm:divide-x divide-gray-200">

            <div className="flex items-center gap-4 pt-3 sm:pt-0 sm:px-4 first:pl-0">
              <div className="w-12 h-12 rounded-full bg-[#062111] text-white flex items-center justify-center shrink-0 font-bold">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
              <div>
                <h3 className="font-extrabold text-xs text-dark uppercase tracking-wide">EXCLUSIVE TRADE PRICING</h3>
                <p className="text-xs text-gray-5 mt-0.5">Better pricing for registered businesses</p>
              </div>
            </div>

            <div className="flex items-center gap-4 pt-3 sm:pt-0 sm:px-4">
              <div className="w-12 h-12 rounded-full bg-[#062111] text-white flex items-center justify-center shrink-0 font-bold">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div>
                <h3 className="font-extrabold text-xs text-dark uppercase tracking-wide">BULK ORDERING</h3>
                <p className="text-xs text-gray-5 mt-0.5">Buy more, save more with flexible quantities</p>
              </div>
            </div>

            <div className="flex items-center gap-4 pt-3 sm:pt-0 sm:px-4">
              <div className="w-12 h-12 rounded-full bg-[#062111] text-white flex items-center justify-center shrink-0 font-bold">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a2 2 0 104 0m-5 0a2 2 0 104 0" />
                </svg>
              </div>
              <div>
                <h3 className="font-extrabold text-xs text-dark uppercase tracking-wide">RELIABLE DELIVERY</h3>
                <p className="text-xs text-gray-5 mt-0.5">Nationwide delivery you can count on</p>
              </div>
            </div>

            <div className="flex items-center gap-4 pt-3 sm:pt-0 sm:px-4">
              <div className="w-12 h-12 rounded-full bg-[#062111] text-white flex items-center justify-center shrink-0 font-bold">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <h3 className="font-extrabold text-xs text-dark uppercase tracking-wide">DEDICATED SUPPORT</h3>
                <p className="text-xs text-gray-5 mt-0.5">Personalised support for your business</p>
              </div>
            </div>

          </div>
        </div>

        {/* HOW IT WORKS 4-Step Section */}
        <HowItWorks />

        {/* Bottom Trust Banner */}
        <TrustFooterBar />

      </div>

    </section>
  );
};

export default Hero;
