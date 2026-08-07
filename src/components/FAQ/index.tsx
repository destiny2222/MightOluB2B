"use client";
import React, { useState, useEffect } from "react";
import Breadcrumb from "../Common/Breadcrumb";
import Link from "next/link";

interface FAQItem {
  id: string;
  category: string;
  question: string;
  answer: string;
}

const FAQ = () => {
  const faqData: FAQItem[] = [
    {
      id: "q1",
      category: "general",
      question: "What is Unifood Business to Business E-commerce?",
      answer: "Unifood is a technology-driven wholesale food procurement platform. We connect commercial kitchens (restaurants, hotels, caterers, and corporate dining services) directly with local growers, farms, and food manufacturers to streamline bulk food ordering, guarantee cold-chain safety, and offer competitive direct pricing."
    },
    {
      id: "q2",
      category: "general",
      question: "Who is eligible to purchase from Unifood?",
      answer: "Any registered business or commercial entity in the food service, hospitality, corporate, or educational sector is eligible. During signup, you will need to provide business identification or tax info to access our wholesale pricing catalog."
    },
    {
      id: "q3",
      category: "general",
      question: "Is there a Minimum Order Value (MOV)?",
      answer: "Yes, to maintain wholesale direct delivery routes, we require a minimum order value of £250. Orders under this amount may incur a local route surcharge, which will be calculated dynamically at checkout."
    },
    {
      id: "q4",
      category: "logistics",
      question: "How does Unifood ensure cold-chain safety during transit?",
      answer: "We operate a proprietary fleet of temperature-controlled vehicles divided into distinct climate zones (frozen, chilled, ambient). Every vehicle is equipped with live IoT temperature sensors, allowing us to monitor and record food safety compliance profiles from our warehouse hubs right to your loading dock."
    },
    {
      id: "q5",
      category: "logistics",
      question: "What are your delivery hours and cutoff times?",
      answer: "We deliver 7 days a week between 4:00 AM and 2:00 PM. To guarantee next-day delivery on standard inventory items, your order must be submitted and approved before our daily cutoff time at 8:00 PM."
    },
    {
      id: "q6",
      category: "logistics",
      question: "How do I report damaged items or incorrect weight?",
      answer: "Unifood supports a digital claims workflow. If an item is damaged or does not match the invoiced weight (common in catch-weight produce/meats), you can submit a claim via your account portal with photos within 4 hours of delivery for an instant credit adjustment."
    },
    {
      id: "q7",
      category: "billing",
      question: "What payment terms and billing methods do you offer?",
      answer: "We accept all major credit cards, bank transfers (ACH/Wire), and corporate billing. Approved companies can apply for 'On Account' credit terms, offering Net-15 or Net-30 billing cycles. Invoices are automatically generated and emailed upon delivery clearance."
    },
    {
      id: "q8",
      category: "billing",
      question: "How are custom-priced or catch-weight orders processed?",
      answer: "Some specialty cuts or seasonal farm items are priced by weight (catch-weight). For these items, you are charged an estimated amount at checkout. Once our warehouse prepares and weighs the items, your final invoice is adjusted to reflect the exact weight dispatched."
    },
    {
      id: "q9",
      category: "accounts",
      question: "Can I manage multiple buyers and set spending limits?",
      answer: "Yes. Our corporate hierarchy controls allow you to invite multiple users under a single company account. You can assign roles (Admin, Manager, General Buyer) and set individual daily, weekly, or per-order spending caps for each user."
    },
    {
      id: "q10",
      category: "accounts",
      question: "How does the multi-user order approval system work?",
      answer: "When a General Buyer compiles an order that exceeds their limit or requires review, it is placed in 'Pending Approval' status. Managers or Admins will receive an instant notification to review, modify, and click-to-approve the procurement before the shipping cutoff."
    }
  ];

  const categories = [
    { value: "all", label: "All Questions" },
    { value: "general", label: "General & MOQ" },
    { value: "logistics", label: "Logistics & Claims" },
    { value: "billing", label: "Pricing & Invoices" },
    { value: "accounts", label: "Corporate Accounts" }
  ];

  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [openId, setOpenId] = useState<string | null>("q1");

  const toggleAccordion = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  const filteredFaqs = faqData.filter((faq) => {
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "all" || faq.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  useEffect(() => {
    // Scroll reveal observers
    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.05,
    };

    const handleIntersect = (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
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
  }, [searchQuery, activeCategory]); // Re-attach observer when filters update

  return (
    <>
      <Breadcrumb title={"FAQ"} pages={["faq"]} />

      <section className="py-20 bg-white overflow-hidden">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          
          {/* Header Description & Search Bar */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-12.5 reveal-fade-up">
            <div className="max-w-[550px] w-full">
              <span className="inline-block font-semibold text-blue text-sm uppercase tracking-wider mb-3">
                HOW CAN WE HELP?
              </span>
              <h2 className="font-bold text-dark text-3xl sm:text-4xl leading-tight">
                Frequently Asked Questions
              </h2>
              <p className="text-body text-base mt-3 leading-relaxed">
                Find quick answers about delivery routes, billing compliance, corporate account structures, and order approvals.
              </p>
            </div>

            {/* Search Input Box */}
            <div className="w-full lg:max-w-[400px] relative">
              <input
                type="text"
                placeholder="Search your question here..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-5 pr-12 py-3.5 bg-gray-1 border border-gray-3 rounded-lg outline-none text-dark placeholder:text-dark-5 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20 duration-200"
              />
              <svg
                className="absolute right-4.5 top-1/2 -translate-y-1/2 text-gray-5 w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-10">
            {/* Category Side Sidebar */}
            <div className="w-full lg:max-w-[270px] shrink-0 reveal-fade-left">
              <div className="bg-gray-1 border border-gray-3 rounded-xl p-5 sticky top-28">
                <h4 className="font-bold text-dark text-lg mb-4 border-b border-gray-3 pb-3">
                  FAQ Categories
                </h4>
                <div className="flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible no-scrollbar">
                  {categories.map((cat) => (
                    <button
                      key={cat.value}
                      onClick={() => {
                        setActiveCategory(cat.value);
                        setOpenId(null); // Close active accordion
                      }}
                      className={`whitespace-nowrap text-left px-4 py-2.5 rounded-md text-sm font-semibold duration-200 ${
                        activeCategory === cat.value
                          ? "bg-blue text-white shadow-1"
                          : "text-body hover:bg-gray-3 hover:text-dark"
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Accordion Questions List */}
            <div className="w-full flex-grow reveal-fade-right">
              {filteredFaqs.length > 0 ? (
                <div className="space-y-4">
                  {filteredFaqs.map((faq, idx) => {
                    const isOpen = openId === faq.id;
                    return (
                      <div
                        key={faq.id}
                        className={`border rounded-xl duration-300 ${
                          isOpen
                            ? "border-blue/50 bg-blue/5/10 shadow-2"
                            : "border-gray-3 bg-white hover:border-gray-4 hover:shadow-1"
                        }`}
                      >
                        {/* Header Trigger */}
                        <button
                          onClick={() => toggleAccordion(faq.id)}
                          className="w-full flex items-center justify-between text-left px-5 sm:px-6 py-4.5 outline-none"
                        >
                          <span className={`font-semibold text-base sm:text-lg duration-200 ${isOpen ? "text-blue" : "text-dark"}`}>
                            {faq.question}
                          </span>
                          <span className={`ml-4 shrink-0 w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-300 ${
                            isOpen ? "bg-blue border-blue text-white rotate-180" : "bg-gray-1 border-gray-3 text-dark-3"
                          }`}>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                            </svg>
                          </span>
                        </button>

                        {/* Content Block (CSS Grid Rows Animation) */}
                        <div
                          className={`grid transition-all duration-300 ease-in-out ${
                            isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                          }`}
                        >
                          <div className="overflow-hidden">
                            <div className="px-5 sm:px-6 pb-5 pt-1 border-t border-dashed border-gray-3 text-body text-sm sm:text-base leading-relaxed">
                              {faq.answer}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-15 border border-dashed border-gray-4 rounded-xl bg-gray-1">
                  <span className="block text-4xl mb-3">🔍</span>
                  <h4 className="font-bold text-dark text-lg mb-1">No FAQs Found</h4>
                  <p className="text-body text-sm max-w-[320px] mx-auto">
                    Try searching with another keyword or change your active category tab.
                  </p>
                </div>
              )}
            </div>
          </div>

        </div>
      </section>

      {/* Help Desk Support CTA */}
      <section className="pb-20 bg-white">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="relative rounded-2xl bg-gradient-to-tr from-blue to-[#48871C] text-white p-8 sm:p-10 flex flex-col md:flex-row md:items-center justify-between gap-8 shadow-3 overflow-hidden reveal-scale-up">
            {/* Background design accents */}
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/5 blur-2xl -z-1"></div>

            <div className="max-w-[500px]">
              <h3 className="font-bold text-2xl sm:text-3xl mb-2">
                Still have questions?
              </h3>
              <p className="text-white/80 text-sm sm:text-base leading-relaxed">
                If you need custom logistics quotes, technical API integration assistance, or custom contract onboarding, our commercial support team is here.
              </p>
            </div>

            <div className="flex items-center gap-4 shrink-0">
              <Link
                href="/contact"
                className="inline-flex font-semibold text-blue bg-white py-3 px-7 rounded-md shadow-1 duration-200 hover:bg-gray-1 hover:scale-105"
              >
                Contact Support
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default FAQ;
