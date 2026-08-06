"use client";

import React, { useState } from "react";
import Breadcrumb from "../Common/Breadcrumb";
import { toast } from "react-toastify";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear validation error when user types
    if (errors[name]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) {
      newErrors.name = "Full name is required";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!formData.message.trim()) {
      newErrors.message = "Message content is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.mightyolu.com";
      const response = await fetch(`${apiBaseUrl}/api/v1/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success(data.message || "Message sent successfully!");
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        });
      } else {
        toast.error(data.message || "Failed to send message. Please check the fields and try again.");
      }
    } catch (error) {
      console.error("Contact Form Submit Error:", error);
      toast.error(
        "An error occurred while sending the message. Please try again later."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Breadcrumb title={"Contact"} pages={["contact"]} />

      <section className="overflow-hidden py-20 bg-gray-2">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="flex flex-col xl:flex-row gap-7.5">
            {/* Contact Details sidebar */}
            <div className="xl:max-w-[370px] w-full bg-white rounded-xl shadow-1 self-start">
              <div className="py-5 px-4 sm:px-7.5 border-b border-gray-3">
                <p className="font-medium text-xl text-dark">
                  Contact Information
                </p>
              </div>

              <div className="p-4 sm:p-7.5">
                <div className="flex flex-col gap-6">
                  {/* Name */}
                  <div className="flex gap-4 items-start">
                    <svg
                      className="mt-0.5 shrink-0"
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#40872A"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                    <div>
                      <p className="text-custom-xs text-gray-5 font-medium uppercase tracking-wider mb-0.5">Name</p>
                      <p className="text-dark font-medium">James Septimus</p>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex gap-4 items-start">
                    <svg
                      className="mt-0.5 shrink-0"
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#40872A"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                    <div>
                      <p className="text-custom-xs text-gray-5 font-medium uppercase tracking-wider mb-0.5">Call Us</p>
                      <a href="tel:07867986338" className="text-dark font-medium hover:text-blue transition-colors">
                        07867986338
                      </a>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex gap-4 items-start">
                    <svg
                      className="mt-0.5 shrink-0"
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#40872A"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect width="20" height="16" x="2" y="4" rx="2" />
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                    <div>
                      <p className="text-custom-xs text-gray-5 font-medium uppercase tracking-wider mb-0.5">Email Address</p>
                      <a href="mailto:inquiry@mightyolu.com" className="text-dark font-medium hover:text-blue transition-colors break-all">
                        inquiry@mightyolu.com
                      </a>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="flex gap-4 items-start">
                    <svg
                      className="mt-0.5 shrink-0"
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#40872A"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    <div>
                      <p className="text-custom-xs text-gray-5 font-medium uppercase tracking-wider mb-0.5">Office Location</p>
                      <p className="text-dark font-medium">
                        Unit 10 Western Hales Plaza,<br />
                        Edinburgh, EH14 1SW,<br />
                        Wester Hailes.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form input cards */}
            <div className="xl:max-w-[770px] w-full bg-white rounded-xl shadow-1 p-4 sm:p-7.5 xl:p-10">
              <form onSubmit={handleSubmit} noValidate>
                <div className="flex flex-col lg:flex-row gap-5 sm:gap-8 mb-5">
                  {/* Name field */}
                  <div className="w-full">
                    <label htmlFor="name" className="block mb-2.5 font-medium text-dark">
                      Full Name <span className="text-red">*</span>
                    </label>

                    <input
                      type="text"
                      name="name"
                      id="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      className={`rounded-md border bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20 ${
                        errors.name ? "border-red" : "border-gray-3"
                      }`}
                    />
                    {errors.name && (
                      <p className="text-red text-custom-xs mt-1.5 font-medium">{errors.name}</p>
                    )}
                  </div>

                  {/* Email field */}
                  <div className="w-full">
                    <label htmlFor="email" className="block mb-2.5 font-medium text-dark">
                      Email Address <span className="text-red">*</span>
                    </label>

                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="johndoe@example.com"
                      className={`rounded-md border bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20 ${
                        errors.email ? "border-red" : "border-gray-3"
                      }`}
                    />
                    {errors.email && (
                      <p className="text-red text-custom-xs mt-1.5 font-medium">{errors.email}</p>
                    )}
                  </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-5 sm:gap-8 mb-5">
                  {/* Subject field */}
                  <div className="w-full">
                    <label htmlFor="subject" className="block mb-2.5 font-medium text-dark">
                      Subject
                    </label>

                    <input
                      type="text"
                      name="subject"
                      id="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="Bulk Quote Request"
                      className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                    />
                  </div>

                  {/* Phone field */}
                  <div className="w-full">
                    <label htmlFor="phone" className="block mb-2.5 font-medium text-dark">
                      Phone Number
                    </label>

                    <input
                      type="text"
                      name="phone"
                      id="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="e.g., 07867986338"
                      className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                    />
                  </div>
                </div>

                {/* Message field */}
                <div className="mb-7.5">
                  <label htmlFor="message" className="block mb-2.5 font-medium text-dark">
                    Message <span className="text-red">*</span>
                  </label>

                  <textarea
                    name="message"
                    id="message"
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="We would like to request a bulk price quote..."
                    className={`rounded-md border bg-gray-1 placeholder:text-dark-5 w-full p-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20 ${
                      errors.message ? "border-red" : "border-gray-3"
                    }`}
                  ></textarea>
                  {errors.message && (
                    <p className="text-red text-custom-xs mt-1.5 font-medium">{errors.message}</p>
                  )}
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2.5 font-medium text-white bg-blue py-3 px-7 rounded-md ease-out duration-200 hover:bg-blue-dark disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting && (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  )}
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Contact;
