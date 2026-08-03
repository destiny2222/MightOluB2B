"use client";
import Breadcrumb from "@/components/Common/Breadcrumb";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useAppDispatch } from "@/redux/store";
import { useSelector } from "react-redux";
import { registerB2BUser, selectAuth, clearError } from "@/redux/features/auth-slice";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const B2BSignup = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { isLoading, error, isAuthenticated, user } = useSelector(selectAuth);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({});

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      // If user doesn't have KYC, redirect to KYC setup
      if (!user.kyc_id) {
        toast.success("Registration successful! Please complete your B2B profile.");
        router.push("/b2b/kyc-setup");
      } else {
        router.push("/");
      }
    }
  }, [isAuthenticated, user, router]);

  // Handle errors
  useEffect(() => {
    if (error) {
      try {
        const errorObj = JSON.parse(error);
        if (typeof errorObj === 'object' && errorObj !== null) {
          setValidationErrors(errorObj);
          toast.error("Please fix the validation errors");
        } else {
          toast.error(error);
        }
      } catch {
        toast.error(error);
      }
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationErrors({});

    // Client-side validation
    const errors: Record<string, string[]> = {};
    
    if (!formData.name.trim()) {
      errors.name = ["Name is required"];
    }
    
    if (!formData.email.trim()) {
      errors.email = ["Email is required"];
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = ["Please enter a valid email address"];
    }
    
    if (!formData.password) {
      errors.password = ["Password is required"];
    } else if (formData.password.length < 8) {
      errors.password = ["Password must be at least 8 characters"];
    }
    
    if (formData.password !== formData.password_confirmation) {
      errors.password_confirmation = ["Passwords do not match"];
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      toast.error("Please fix the validation errors");
      return;
    }

    // Dispatch registration action
    dispatch(registerB2BUser(formData));
  };

  return (
    <>
      <Breadcrumb title={"B2B Registration"} pages={["B2B Registration"]} />
      <section className="overflow-hidden py-20 bg-gray-2">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="max-w-[570px] w-full mx-auto rounded-xl bg-white shadow-1 p-4 sm:p-7.5 xl:p-11">
            <div className="text-center mb-11">
              <h2 className="font-semibold text-xl sm:text-2xl xl:text-heading-5 text-dark mb-1.5">
                Create B2B Trade Account
              </h2>
              <p className="text-gray-5">Register for wholesale pricing and bulk ordering</p>
            </div>

            <div className="mt-5.5">
              <form onSubmit={handleSubmit}>
                <div className="mb-5">
                  <label htmlFor="name" className="block mb-2.5 font-medium">
                    Full Name <span className="text-red">*</span>
                  </label>

                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className={`rounded-lg border ${
                      validationErrors.name ? 'border-red' : 'border-gray-3'
                    } bg-gray-1 placeholder:text-dark-5 w-full py-3 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20`}
                  />
                  {validationErrors.name && (
                    <p className="text-red text-sm mt-1">{validationErrors.name[0]}</p>
                  )}
                </div>

                <div className="mb-5">
                  <label htmlFor="email" className="block mb-2.5 font-medium">
                    Email Address <span className="text-red">*</span>
                  </label>

                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your business email"
                    className={`rounded-lg border ${
                      validationErrors.email ? 'border-red' : 'border-gray-3'
                    } bg-gray-1 placeholder:text-dark-5 w-full py-3 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20`}
                  />
                  {validationErrors.email && (
                    <p className="text-red text-sm mt-1">{validationErrors.email[0]}</p>
                  )}
                </div>

                <div className="mb-5">
                  <label htmlFor="password" className="block mb-2.5 font-medium">
                    Password <span className="text-red">*</span>
                  </label>

                  <input
                    type="password"
                    name="password"
                    id="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password (min 8 characters)"
                    autoComplete="new-password"
                    className={`rounded-lg border ${
                      validationErrors.password ? 'border-red' : 'border-gray-3'
                    } bg-gray-1 placeholder:text-dark-5 w-full py-3 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20`}
                  />
                  {validationErrors.password && (
                    <p className="text-red text-sm mt-1">{validationErrors.password[0]}</p>
                  )}
                </div>

                <div className="mb-5.5">
                  <label htmlFor="password_confirmation" className="block mb-2.5 font-medium">
                    Confirm Password <span className="text-red">*</span>
                  </label>

                  <input
                    type="password"
                    name="password_confirmation"
                    id="password_confirmation"
                    value={formData.password_confirmation}
                    onChange={handleChange}
                    placeholder="Re-enter your password"
                    autoComplete="new-password"
                    className={`rounded-lg border ${
                      validationErrors.password_confirmation ? 'border-red' : 'border-gray-3'
                    } bg-gray-1 placeholder:text-dark-5 w-full py-3 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20`}
                  />
                  {validationErrors.password_confirmation && (
                    <p className="text-red text-sm mt-1">{validationErrors.password_confirmation[0]}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center items-center font-medium text-white bg-dark py-3 px-6 rounded-lg ease-out duration-200 hover:bg-blue mt-7.5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating Account...
                    </>
                  ) : (
                    "Create B2B Account"
                  )}
                </button>

                <p className="text-center mt-6">
                  Already have an account?
                  <Link
                    href="/b2b/login"
                    className="text-dark ease-out duration-200 hover:text-blue pl-2 font-medium"
                  >
                    Sign in Now
                  </Link>
                </p>

                <p className="text-center mt-3 text-sm text-gray-5">
                  Looking for regular shopping?
                  <Link
                    href="/signup"
                    className="text-dark ease-out duration-200 hover:text-blue pl-2 font-medium"
                  >
                    Create Personal Account
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default B2BSignup;
