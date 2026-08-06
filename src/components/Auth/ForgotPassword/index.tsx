"use client";
import Breadcrumb from "@/components/Common/Breadcrumb";
import Link from "next/link";
import React, { useState } from "react";
import { forgotPassword } from "@/lib/api/b2b-api";
import { toast } from "react-toastify";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [validationError, setValidationError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError("");

    if (!email.trim()) {
      setValidationError("Email is required");
      return;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setValidationError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    try {
      const res = await forgotPassword({ email });
      if (res.success) {
        setIsSuccess(true);
        toast.success(res.message || "Password reset link sent to your email");
      }
    } catch (err: any) {
      if (err.errors && err.errors.email) {
        setValidationError(err.errors.email[0]);
        toast.error("Invalid email address");
      } else {
        toast.error(err.message || "Unable to send reset link");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Breadcrumb title={"Forgot Password"} pages={["Forgot Password"]} />
      <section className="overflow-hidden py-20 bg-gray-2">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="max-w-[570px] w-full mx-auto rounded-xl bg-white shadow-1 p-4 sm:p-7.5 xl:p-11">
            
            <div className="text-center mb-11">
              <h2 className="font-semibold text-xl sm:text-2xl xl:text-heading-5 text-dark mb-1.5">
                Reset Your Password
              </h2>
              <p className="text-gray-5">
                Enter your email address and we'll send you a link to reset your password.
              </p>
            </div>

            {isSuccess ? (
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-dark mb-2">Check your email</h3>
                <p className="text-gray-5 mb-6">
                  We have sent a password reset link to <span className="font-medium text-dark">{email}</span>.
                </p>
                <Link
                  href="/signin"
                  className="w-full inline-flex justify-center font-medium text-white bg-dark py-3 px-6 rounded-lg ease-out duration-200 hover:bg-blue"
                >
                  Return to Sign In
                </Link>
              </div>
            ) : (
              <div>
                <form onSubmit={handleSubmit}>
                  <div className="mb-6">
                    <label htmlFor="email" className="block mb-2.5 font-medium">
                      Email Address <span className="text-red">*</span>
                    </label>

                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setValidationError("");
                      }}
                      placeholder="Enter your email"
                      className={`rounded-lg border ${
                        validationError ? 'border-red' : 'border-gray-3'
                      } bg-gray-1 placeholder:text-dark-5 w-full py-3 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20`}
                    />
                    {validationError && (
                      <p className="text-red text-sm mt-1">{validationError}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex justify-center items-center font-medium text-white bg-dark py-3 px-6 rounded-lg ease-out duration-200 hover:bg-blue disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending Link...
                      </>
                    ) : (
                      "Send Reset Link"
                    )}
                  </button>

                  <p className="text-center mt-6">
                    Remember your password?
                    <Link
                      href="/signin"
                      className="text-dark ease-out duration-200 hover:text-blue pl-2 font-medium"
                    >
                      Sign In
                    </Link>
                  </p>
                </form>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default ForgotPassword;
