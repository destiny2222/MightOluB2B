"use client";
import React, { useEffect } from "react";
import Breadcrumb from "../Common/Breadcrumb";
import Link from "next/link";

const About = () => {
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.1,
    };

    const handleIntersect = (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
          // Optionally unobserve after animating in
          observer.unobserve(entry.target);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, observerOptions);
    const elementsToReveal = document.querySelectorAll(
      ".reveal-fade-up, .reveal-fade-left, .reveal-fade-right, .reveal-scale-up"
    );

    elementsToReveal.forEach((el) => observer.observe(el));

    return () => {
      elementsToReveal.forEach((el) => observer.unobserve(el));
    };
  }, []);

  const stats = [
    { value: "500+", label: "Verified Farms & Suppliers", desc: "Sourcing directly from local and international certified partners." },
    { value: "15,000+", label: "Premium Products", desc: "Fresh produce, dry goods, dairy, meat, and pantry essentials." },
    { value: "99.8%", label: "On-Time Delivery Rate", desc: "Proprietary logistics routing ensuring your kitchen never stops." },
    { value: "£120M+", label: "Annual Transactions", desc: "Trusted by thousands of restaurants, hotels, and caterers." }
  ];

  const values = [
    {
      title: "Direct From Source",
      desc: "We eliminate unnecessary middle-men, connecting food businesses directly with growers to guarantee maximum freshness and fair pricing.",
      icon: (
        <svg className="w-8 h-8 text-blue animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
        </svg>
      )
    },
    {
      title: "Smart Cold-Chain Logistics",
      desc: "Our state-of-the-art temperature-controlled fleet and hubs ensure that perishable goods reach your business in pristine condition.",
      icon: (
        <svg className="w-8 h-8 text-blue animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    },
    {
      title: "Compliance & Safety First",
      desc: "Every product in our catalog passes rigorous safety and quality checks, meeting all USDA and local food standard regulations.",
      icon: (
        <svg className="w-8 h-8 text-blue animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      )
    },
    {
      title: "Dedicated Account Management",
      desc: "No bots, no endless wait times. Our commercial clients receive dedicated 1-on-1 account managers who understand restaurant operations.",
      icon: (
        <svg className="w-8 h-8 text-blue animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    }
  ];

  const team = [
    {
      name: "Marcus Vance",
      role: "CEO & Co-Founder",
      desc: "Former logistics director with 15+ years in agricultural supply chain management.",
      avatar: (
        <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-blue/20 to-blue/40 flex items-center justify-center text-blue font-bold text-3xl shadow-inner mx-auto mb-6">
          <span>MV</span>
        </div>
      )
    },
    {
      name: "Sophia Chen",
      role: "VP of Quality & Sourcing",
      desc: "Agricultural scientist specializing in sustainable farming partnerships and QA systems.",
      avatar: (
        <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-teal/20 to-teal/40 flex items-center justify-center text-teal font-bold text-3xl shadow-inner mx-auto mb-6">
          <span>SC</span>
        </div>
      )
    },
    {
      name: "David Kross",
      role: "Chief of Logistics",
      desc: "Cold-chain specialist ensuring seamless routing, fleet efficiency, and warehouse compliance.",
      avatar: (
        <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-red-light/20 to-red-light/40 flex items-center justify-center text-red font-bold text-3xl shadow-inner mx-auto mb-6">
          <span>DK</span>
        </div>
      )
    },
    {
      name: "Elena Rostova",
      role: "Head of Customer Success",
      desc: "Passionate about restaurant and hotel operations, guiding client onboardings and bulk supply plans.",
      avatar: (
        <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-yellow/20 to-yellow/40 flex items-center justify-center text-yellow-dark font-bold text-3xl shadow-inner mx-auto mb-6">
          <span>ER</span>
        </div>
      )
    }
  ];

  return (
    <>
      <Breadcrumb title={"About Us"} pages={["about"]} />

      {/* Hero & Story Section */}
      <section className="py-20 bg-white overflow-hidden">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="flex flex-col lg:flex-row items-center gap-12.5">
            <div className="w-full lg:w-1/2 reveal-fade-left">
              <span className="inline-block font-semibold text-blue text-sm uppercase tracking-wider mb-3">
                WHO WE ARE
              </span>
              <h2 className="font-bold text-dark text-3xl sm:text-4xl lg:text-[40px] leading-tight mb-6">
                Revolutionizing Food Sourcing For Modern Kitchens.
              </h2>
              <p className="text-body text-base mb-5.5 leading-relaxed">
                Founded in 2021, Unifood was created to bridge the massive gap between small-to-midsize farms and commercial kitchens. Traditional food distribution models are slow, opaque, and prone to extreme price fluctuations. 
              </p>
              <p className="text-body text-base mb-8 leading-relaxed">
                We built a smart, tech-driven platform that streamlines order management, tracks cold-chain compliance in real-time, and delivers wholesale products at direct-to-farm prices. Our goal is to empower restaurants, caterers, and food service managers to focus on what they do best: creating incredible food.
              </p>
              <div className="flex items-center gap-4 sm:gap-6">
                <Link
                  href="/shop-details"
                  className="inline-flex font-medium text-white bg-blue py-3 px-6 rounded-md duration-200 hover:bg-blue-dark shadow-1 hover:scale-105 transition-transform"
                >
                  Explore Catalog
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex font-medium text-dark bg-gray-2 py-3 px-6 rounded-md duration-200 hover:bg-gray-3 hover:scale-105 transition-transform"
                >
                  Contact Sales
                </Link>
              </div>
            </div>

            {/* Visual Grid Collage */}
            <div className="w-full lg:w-1/2 grid grid-cols-2 gap-4 reveal-fade-right">
              <div className="space-y-4">
                <div className="relative rounded-2xl overflow-hidden bg-gray-2 h-[220px] flex items-center justify-center p-6 border border-gray-3 hover:shadow-2 hover:-translate-y-2 transition duration-300">
                  <div className="text-center">
                    <span className="block text-4xl mb-2 hover:scale-110 transition-transform duration-300">🥬</span>
                    <span className="font-semibold text-dark text-sm block">Farm Fresh Sourcing</span>
                    <span className="text-xs text-body mt-1 block">Picked & delivered within 24h</span>
                  </div>
                </div>
                <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-blue/5 to-blue/20 h-[160px] flex items-center justify-center p-6 border border-blue/10 hover:shadow-2 hover:-translate-y-2 transition duration-300">
                  <div className="text-center">
                    <span className="block text-4xl mb-2 hover:scale-110 transition-transform duration-300">🚛</span>
                    <span className="font-semibold text-dark text-sm block">Smart Logistics</span>
                    <span className="text-xs text-body mt-1 block">Cold-chain tracked fleet</span>
                  </div>
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-teal/5 to-teal/20 h-[160px] flex items-center justify-center p-6 border border-teal/10 hover:shadow-2 hover:-translate-y-2 transition duration-300">
                  <div className="text-center">
                    <span className="block text-4xl mb-2 hover:scale-110 transition-transform duration-300">🛡️</span>
                    <span className="font-semibold text-dark text-sm block">Certified Safety</span>
                    <span className="text-xs text-body mt-1 block">USDA & Local compliance</span>
                  </div>
                </div>
                <div className="relative rounded-2xl overflow-hidden bg-gray-2 h-[220px] flex items-center justify-center p-6 border border-gray-3 hover:shadow-2 hover:-translate-y-2 transition duration-300">
                  <div className="text-center">
                    <span className="block text-4xl mb-2 hover:scale-110 transition-transform duration-300">💼</span>
                    <span className="font-semibold text-dark text-sm block">Business to Business Workflow</span>
                    <span className="text-xs text-body mt-1 block">Role-based accounts</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Counter Section */}
      <section className="py-16 bg-gray-2 border-y border-gray-3 overflow-hidden">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, idx) => (
              <div
                key={idx}
                className="bg-white p-6 rounded-xl border border-gray-3 shadow-1 hover:-translate-y-2 transition duration-300 text-center reveal-fade-up"
                style={{ transitionDelay: `${idx * 150}ms` }}
              >
                <span className="block font-bold text-blue text-4xl lg:text-[40px] mb-2 hover:scale-105 transition-transform">
                  {stat.value}
                </span>
                <h4 className="font-semibold text-dark text-base mb-1">
                  {stat.label}
                </h4>
                <p className="text-xs text-body">
                  {stat.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-20 bg-white overflow-hidden">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="text-center max-w-[600px] mx-auto mb-15 reveal-fade-up">
            <span className="font-semibold text-blue text-sm uppercase tracking-wider mb-2 block">
              OUR VALUES
            </span>
            <h2 className="font-bold text-dark text-3xl sm:text-[36px] mb-4">
              Commitments That Define Us
            </h2>
            <p className="text-body text-sm leading-relaxed">
              We stand behind these core principles that guide our day-to-day operations and partnerships across the entire food supply chain.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((val, idx) => (
              <div
                key={idx}
                className="flex gap-5 p-6 rounded-xl border border-gray-3 bg-gray-1 hover:bg-white hover:shadow-2 hover:-translate-y-1 transition duration-300 reveal-fade-up"
                style={{ transitionDelay: `${idx * 150}ms` }}
              >
                <div className="w-12 h-12 rounded-lg bg-blue/10 flex items-center justify-center shrink-0">
                  {val.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-dark text-lg mb-2">
                    {val.title}
                  </h3>
                  <p className="text-body text-sm leading-relaxed">
                    {val.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership / Team Section */}
      {/* <section className="py-20 bg-gray-2 border-t border-gray-3">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="text-center max-w-[600px] mx-auto mb-15">
            <span className="font-semibold text-blue text-sm uppercase tracking-wider mb-2 block">
              LEADERSHIP TEAM
            </span>
            <h2 className="font-bold text-dark text-3xl sm:text-[36px] mb-4">
              Meet Our Visionaries
            </h2>
            <p className="text-body text-sm leading-relaxed">
              Our diverse leadership brings decades of collective experience in farm operations, tech, cold logistics, and business operations.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7.5">
            {team.map((member, idx) => (
              <div key={idx} className="bg-white rounded-xl border border-gray-3 p-6 text-center hover:shadow-2 transition duration-300">
                {member.avatar}
                <h4 className="font-bold text-dark text-lg mb-1">{member.name}</h4>
                <p className="text-blue text-xs font-semibold uppercase tracking-wider mb-3">{member.role}</p>
                <p className="text-body text-xs leading-relaxed">{member.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* Call to Action Section */}
      <section className="py-20 bg-white overflow-hidden">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="relative rounded-2xl bg-dark text-white p-8 sm:p-12 lg:p-16 overflow-hidden reveal-scale-up">
            {/* Ambient gradients */}
            <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-blue/10 blur-3xl -z-1"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-teal/10 blur-3xl -z-1"></div>

            <div className="max-w-[650px] relative z-1">
              <span className="inline-block font-semibold text-blue text-sm uppercase tracking-wider mb-3">
                PARTNER WITH UNIFOOD
              </span>
              <h2 className="font-bold text-white text-3xl sm:text-4xl lg:text-[40px] leading-tight mb-4">
                Ready to Optimize Your Kitchen's Supply Chain?
              </h2>
              <p className="text-gray-400 text-base mb-8 leading-relaxed">
                Join thousands of food service operators who trust Unifood for their weekly procurement. Create a corporate account today to access custom prices, hierarchical buyer permissions, and automated billing.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <Link
                  href="/signup"
                  className="inline-flex font-medium text-white bg-blue py-3 px-8 rounded-md duration-200 hover:bg-blue-dark shadow-1 hover:scale-105 transition-transform"
                >
                  Create Company Account
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex font-medium text-white border border-gray-6 hover:border-white py-3 px-8 rounded-md duration-200 hover:scale-105 transition-transform"
                >
                  Schedule Consultation
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default About;
