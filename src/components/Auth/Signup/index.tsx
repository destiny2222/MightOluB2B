"use client";

import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "@tanstack/react-form";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { toast } from "react-toastify";

import { useAppDispatch } from "@/redux/store";
import { registerB2BUser } from "@/redux/features/auth-slice";

const signupSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters"),
    password_confirmation: z.string(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords do not match",
    path: ["password_confirmation"],
  });

const Signup = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [apiErrors, setApiErrors] = useState<any>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form: any = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      password_confirmation: "",
    },

    validatorAdapter: zodValidator(),

    validators: {
      onBlur: signupSchema,
      onSubmit: signupSchema,
    },

    onSubmit: async ({ value }) => {
      setApiErrors(null);
      try {
        await dispatch(registerB2BUser(value)).unwrap();

        toast.success("Account created successfully!");

        setTimeout(() => {
          window.location.href = "/b2b/kyc-setup";
        }, 2000);
      } catch (error: any) {
        setApiErrors(error);
        
        let toastMsg = "Unable to create account.";
        if (typeof error === "string") {
          toastMsg = error;
        } else if (error && typeof error === "object") {
          const firstKey = Object.keys(error)[0];
          if (firstKey && Array.isArray(error[firstKey]) && error[firstKey].length > 0) {
            toastMsg = error[firstKey][0];
          } else if (error.message) {
            toastMsg = error.message;
          }
        }
        toast.error(toastMsg);
      }
    },
  } as any);

  return (
    <section className="overflow-hidden py-20 pt-64 bg-gray-2">
      <div className="max-w-[1170px] mx-auto px-4 sm:px-8 xl:px-0">
        <div className="max-w-[570px] mx-auto rounded-xl bg-white shadow-1 p-4 sm:p-7.5 xl:p-11">
          <div className="text-center mb-11">
            <h2 className="font-semibold text-xl sm:text-2xl xl:text-heading-5 text-dark mb-1.5">
              Create B2B Trade Account
            </h2>

            <p className="text-gray-5">
              Register for wholesale pricing and bulk orders
            </p>
          </div>

          {/* error message here */}
          {form.state.errors?.length > 0 && (
            <p className="text-red text-sm mt-1 mb-3">
              {form.state.errors[0]?.message}
            </p>
          )}

          {apiErrors && (
            <div className="mb-5 p-4 rounded-lg bg-red-light-6 border border-red-light-4 text-red text-sm">
              {typeof apiErrors === "string" ? (
                apiErrors
              ) : typeof apiErrors === "object" ? (
                Object.keys(apiErrors).map((key) => {
                  const msgs = apiErrors[key];
                  return (
                    <div key={key} className="mt-1 first:mt-0 font-medium">
                      {Array.isArray(msgs) ? msgs.join(" ") : String(msgs)}
                    </div>
                  );
                })
              ) : (
                "An unexpected error occurred."
              )}
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
          >
            {/* NAME */}
            <div className="mb-5">
              <label
                htmlFor="name"
                className="block mb-2.5 font-medium"
              >
                Full Name <span className="text-red">*</span>
              </label>

              <form.Field name="name">
                {(field) => (
                  <>
                    <input
                      name={field.name}
                      id={field.name}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      placeholder="Full Name"
                      className={`rounded-lg border w-full py-3 px-5 ${
                        field.state.meta.isTouched &&
                        field.state.meta.errors.length
                          ? "border-red"
                          : "border-gray-300"
                      }`}
                    />

                    {field.state.meta.isTouched &&
                      field.state.meta.errors.length > 0 && (
                        <p className="text-red text-sm mt-1">
                          {field.state.meta.errors[0]?.message}
                        </p>
                      )}
                  </>
                )}
              </form.Field>
            </div>

            {/* EMAIL */}
            <div className="mb-5">
              <label
                htmlFor="email"
                className="block mb-2.5 font-medium"
              >
                Email Address <span className="text-red">*</span>
              </label>

              <form.Field name="email">
                {(field) => (
                  <>
                    <input
                      id={field.name}
                      name={field.name}
                      type="email"
                      value={field.state.value}
                      onChange={(e) =>
                        field.handleChange(e.target.value)
                      }
                      onBlur={field.handleBlur}
                      placeholder="Business email address"
                      className={`rounded-lg border w-full py-3 px-5 ${
                        field.state.meta.isTouched &&
                        field.state.meta.errors.length
                          ? "border-red"
                          : "border-gray-300"
                      }`}
                    />

                    {field.state.meta.isTouched &&
                      field.state.meta.errors.length > 0 && (
                        <p className="text-red text-sm mt-1">
                          {field.state.meta.errors[0]?.message}
                        </p>
                      )}
                  </>
                )}
              </form.Field>
            </div>

            {/* PASSWORD */}
            <div className="mb-5">
              <label
                htmlFor="password"
                className="block mb-2.5 font-medium"
              >
                Password <span className="text-red">*</span>
              </label>

              <form.Field name="password">
                {(field) => (
                  <>
                    <div className="relative">
                      <input
                        id={field.name}
                        name={field.name}
                        type={showPassword ? "text" : "password"}
                        value={field.state.value}
                        onChange={(e) =>
                          field.handleChange(e.target.value)
                        }
                        onBlur={field.handleBlur}
                        autoComplete="new-password"
                        placeholder="Enter your password (min. 8 characters)"
                        className={`rounded-lg border w-full py-3 px-5 pr-12 ${
                          field.state.meta.isTouched &&
                          field.state.meta.errors.length
                            ? "border-red"
                            : "border-gray-300"
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-5 hover:text-dark transition-colors"
                        aria-label="Toggle password visibility"
                      >
                        {showPassword ? (
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        )}
                      </button>
                    </div>

                    {field.state.meta.isTouched &&
                      field.state.meta.errors.length > 0 && (
                        <p className="text-red text-sm mt-1">
                          {field.state.meta.errors[0]?.message}
                        </p>
                      )}
                  </>
                )}
              </form.Field>
            </div>

            {/* CONFIRM PASSWORD */}
            <div className="mb-5">
              <label
                htmlFor="password_confirmation"
                className="block mb-2.5 font-medium"
              >
                Confirm Password <span className="text-red">*</span>
              </label>

              <form.Field name="password_confirmation">
                {(field) => (
                  <>
                    <div className="relative">
                      <input
                        id={field.name}
                        name={field.name}
                        type={showConfirmPassword ? "text" : "password"}
                        value={field.state.value}
                        onChange={(e) =>
                          field.handleChange(e.target.value)
                        }
                        onBlur={field.handleBlur}
                        autoComplete="new-password"
                        placeholder="Confirm password"
                        className={`rounded-lg border w-full py-3 px-5 pr-12 ${
                          field.state.meta.isTouched &&
                          field.state.meta.errors.length
                            ? "border-red"
                            : "border-gray-300"
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-5 hover:text-dark transition-colors"
                        aria-label="Toggle confirm password visibility"
                      >
                        {showConfirmPassword ? (
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        )}
                      </button>
                    </div>

                    {field.state.meta.isTouched &&
                      field.state.meta.errors.length > 0 && (
                        <p className="text-red text-sm mt-1">
                          {field.state.meta.errors[0]?.message}
                        </p>
                      )}
                  </>
                )}
              </form.Field>
            </div>

            <div className="mb-6 p-4 bg-blue/5 border border-blue/10 rounded-lg">
              <p className="text-sm text-dark-5">
                <span className="font-medium">
                  Note:
                </span>{" "}
                After registration you'll need to complete your
                business verification (KYC) before accessing
                wholesale pricing.
              </p> 
            </div>

            <form.Subscribe
              selector={(state) => ({
                isSubmitting: state.isSubmitting,
              })}
            >
              {({ isSubmitting }) => (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center bg-dark text-white py-3 px-6 rounded-lg hover:bg-blue disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5 mr-3"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <circle
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          className="opacity-25"
                        />
                        <path
                          fill="currentColor"
                          className="opacity-75"
                          d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4z"
                        />
                      </svg>

                      Creating Account...
                    </>
                  ) : (
                    "Create B2B Account"
                  )}
                </button>
              )}
            </form.Subscribe>

            <p className="text-center mt-6">
              Already have an account?
              <Link
                href="/signin"
                className="pl-2 font-medium text-dark hover:text-blue"
              >
                Sign In Now
              </Link>
            </p>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Signup;