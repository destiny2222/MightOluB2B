"use client";

import Link from "next/link";
import React from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "@tanstack/react-form";
import { zodValidator } from "@tanstack/zod-form-adapter";
import toast from "react-hot-toast";

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

  const form = useForm({
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
      try {
        await dispatch(registerB2BUser(value)).unwrap();

        toast.success("Account created successfully!");

        setTimeout(() => {
          router.push("/b2b/kyc-setup");
        }, 2000);
      } catch (error: any) {
        toast.error(
          error?.message ||
            error?.payload?.message ||
            "Unable to create account."
        );
      }
    },
  });

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
                    <input
                      id={field.name}
                      name={field.name}
                      type="password"
                      value={field.state.value}
                      onChange={(e) =>
                        field.handleChange(e.target.value)
                      }
                      onBlur={field.handleBlur}
                      autoComplete="new-password"
                      placeholder="Enter your password (min. 8 characters)"
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
                    <input
                      id={field.name}
                      name={field.name}
                      type="password"
                      value={field.state.value}
                      onChange={(e) =>
                        field.handleChange(e.target.value)
                      }
                      onBlur={field.handleBlur}
                      autoComplete="new-password"
                      placeholder="Confirm password"
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