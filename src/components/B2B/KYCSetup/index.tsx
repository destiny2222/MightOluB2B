"use client";
import React, { useEffect } from "react";
import { useAppDispatch } from "@/redux/store";
import { useSelector } from "react-redux";
import { selectAuth, updateUserKYC, logout, fetchUserProfile } from "@/redux/features/auth-slice";
import { clearCart } from "@/redux/features/cart-slice";
import {
  submitKYCApplication,
  resubmitKYCApplication,
  selectKYC,
  clearKYCError,
  clearSuccessMessage
} from "@/redux/features/kyc-slice";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

import { useForm } from "@tanstack/react-form";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { z } from "zod";

const businessTypes = [
  { value: "restaurant", label: "Restaurant" },
  { value: "retailer", label: "Retailer" },
  { value: "caterer", label: "Caterer" },
  { value: "reseller", label: "Reseller" },
  { value: "other", label: "Other" },
] as const;

const kycSchema = z.object({
  company_name: z.string().min(1, "Company name is required"),
  company_registration_number: z.string()
    .min(1, "Company/VAT registration number is required")
    .regex(/^[A-Z0-9\-\s]{5,20}$/i, "Registration number must be 5-20 alphanumeric characters"),
  business_type: z.enum(["restaurant", "retailer", "caterer", "reseller", "other"]),
  trade_address: z.string().min(1, "Trade address is required"),
  billing_contact: z.string().min(1, "Billing contact is required"),
  estimated_monthly_order_volume: z.string().min(1, "Estimated order volume is required"),
});

type KYCFormType = z.infer<typeof kycSchema>;

const KYCSetup = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useSelector(selectAuth);
  const { isLoading, error, successMessage, kyc } = useSelector(selectKYC);

  const isResubmission = user?.kyc?.status === 'rejected' || user?.kyc?.status === 'info_requested';

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated && !authLoading) {
      toast.error("Please login to continue");
      router.push("/b2b/login");
    }
  }, [isAuthenticated, authLoading, router]);

  // Redirect if user has pending or approved KYC (only after auth loading is complete)
  useEffect(() => {
    if (!authLoading && user) {
      if (user.kyc?.status === 'pending') {
        toast.info("Your application is already pending review");
        router.push("/b2b/application-status");
      } else if (user.kyc?.status === 'approved') {
        toast.success("Your account is already approved");
        router.push("/");
      }
    }
  }, [user, authLoading, router]);

  const defaultValues: KYCFormType = {
    company_name: isResubmission && user?.kyc?.company_name ? user.kyc.company_name : "",
    company_registration_number: isResubmission && user?.kyc?.company_registration_number ? user.kyc.company_registration_number : "",
    business_type: (isResubmission && user?.kyc?.business_type) ? (user.kyc.business_type as any) : "restaurant",
    trade_address: isResubmission && user?.kyc?.trade_address ? user.kyc.trade_address : "",
    billing_contact: isResubmission && user?.kyc?.billing_contact ? user.kyc.billing_contact : "",
    estimated_monthly_order_volume: isResubmission && user?.kyc?.estimated_monthly_order_volume ? user.kyc.estimated_monthly_order_volume : "",
  };

  const form: any = useForm({
    defaultValues,
    validatorAdapter: zodValidator(),

    validators: {
      onBlur: kycSchema,
      onSubmit: kycSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        // console.log("1. Form Submitted");

        const response = isResubmission
          ? await dispatch(resubmitKYCApplication(value)).unwrap()
          : await dispatch(submitKYCApplication(value)).unwrap();

        // console.log("2. Redux Success", response);

        // Fetch user profile to ensure state updates
        await dispatch(fetchUserProfile()).unwrap();

        // console.log("3. Profile refreshed");

        toast.success("KYC Application Submitted Successfully");

        // Small delay to ensure toast is visible before redirect
        await new Promise((resolve) => setTimeout(resolve, 800));

        // Use replace instead of push to prevent going back to the form
        router.replace("/b2b/application-status");

        // console.log("4. Redirect called");
      } catch (err: any) {
        // console.error("Submit Error:", err);
        
        // Handle specific error for already having a KYC
        if (err?.error?.includes("already associated") || err?.includes("already associated")) {
          toast.error("You already have a B2B application. Refreshing your status...");
          
          // Fetch updated profile
          await dispatch(fetchUserProfile()).unwrap();
          
          // Redirect to application status
          setTimeout(() => {
            router.push("/b2b/application-status");
          }, 1000);
        } else {
          toast.error(typeof err === 'string' ? err : err?.error || "Submission failed");
        }
      }
    }
  } as any);


  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearCart());
    router.push("/b2b/login");
  };

  // Show status notes if resubmitting
  const statusNotes = user?.kyc?.status_notes;

  // Show loading while verifying auth status
  if (authLoading) {
    return (
      <section className="overflow-hidden py-20 bg-gray-2">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="max-w-[770px] w-full mx-auto rounded-xl bg-white shadow-1 p-4 sm:p-7.5 xl:p-11">
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-12 h-12 border-4 border-blue border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-gray-5">Verifying your account status...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="overflow-hidden py-20 bg-gray-2">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="max-w-[770px] w-full mx-auto rounded-xl bg-white shadow-1 p-4 sm:p-7.5 xl:p-11">
            <div className="flex justify-between items-start mb-11">
              <div className="text-left">
                <h2 className="font-semibold text-xl sm:text-2xl xl:text-heading-5 text-dark mb-1.5">
                  {isResubmission ? "Resubmit Your Application" : "Complete Your B2B Profile"}
                </h2>
                <p className="text-gray-5">
                  {isResubmission
                    ? "Please update your information and resubmit"
                    : "Provide your business details for trade account verification"}
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="text-sm font-medium text-red-600 hover:text-red-800 transition-colors px-3 py-1.5 border border-red-200 rounded-md hover:bg-red-50"
                type="button"
              >
                Logout
              </button>
            </div>

            {statusNotes && (
              <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h3 className="font-semibold text-dark mb-2 flex items-center gap-2">
                  <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  Admin Notes:
                </h3>
                <p className="text-sm text-gray-600">{statusNotes}</p>
              </div>
            )}

            <div className="mt-5.5">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  form.handleSubmit();
                }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                  <form.Field name="company_name">
                    {(field) => (
                      <div>
                        <label htmlFor={field.name} className="block mb-2.5 font-medium">
                          Company Name <span className="text-red">*</span>
                        </label>
                        <input 
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          placeholder="Enter company name"
                          className={`rounded-lg border ${field.state.meta.isTouched && field.state.meta.errors.length > 0 ? 'border-red' : 'border-gray-3'
                            } bg-gray-1 placeholder:text-dark-5 w-full py-3 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20`}
                        />
                        {field.state.meta.isTouched &&
                          field.state.meta.errors.length > 0 && (
                            <p className="text-red text-sm mt-1">
                              {field.state.meta.errors[0]?.message}
                            </p>
                          )}
                      </div>
                    )}
                   </form.Field>

                  <form.Field 
                  name="company_registration_number">
                    {(field) => (
                      <div>
                        <label htmlFor={field.name} className="block mb-2.5 font-medium">
                          Company/VAT Registration Number <span className="text-red">*</span>
                        </label>
                        <input
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          placeholder="VAT-12345-67"
                          className={`rounded-lg border ${field.state.meta.isTouched && field.state.meta.errors.length > 0 ? 'border-red' : 'border-gray-3'
                            } bg-gray-1 placeholder:text-dark-5 w-full py-3 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20`}
                        />
                        {field.state.meta.isTouched &&
                          field.state.meta.errors.length > 0 && (
                            <p className="text-red text-sm mt-1">
                              {field.state.meta.errors[0]?.message}
                            </p>
                          )}
                      </div>
                    )}
                 </form.Field>
                </div>

                <form.Field
                  name="business_type" >
                   {(field) => (
                    <div className="mb-5">
                      <label htmlFor={field.name} className="block mb-2.5 font-medium">
                        Business Type <span className="text-red">*</span>
                      </label>
                      <select
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value as any)}
                        className={`rounded-lg border ${field.state.meta.isTouched && field.state.meta.errors.length > 0 ? 'border-red' : 'border-gray-3'
                          } bg-gray-1 w-full py-3 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20`}
                      >
                        {businessTypes.map(type => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                      {field.state.meta.isTouched &&
                        field.state.meta.errors.length > 0 && (
                          <p className="text-red text-sm mt-1">
                            {field.state.meta.errors[0]?.message}
                          </p>
                        )}
                    </div>
                  )}
                </form.Field>

                <form.Field
                  name="trade_address" >
                   {(field) => (
                    <div className="mb-5">
                      <label htmlFor={field.name} className="block mb-2.5 font-medium">
                        Trade Address <span className="text-red">*</span>
                      </label>
                      <textarea  
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="Enter your business/trading address"
                        rows={3}
                        className={`rounded-lg border ${field.state.meta.isTouched && field.state.meta.errors.length > 0 ? 'border-red' : 'border-gray-3'
                          } bg-gray-1 placeholder:text-dark-5 w-full py-3 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20`}
                      />
                      {field.state.meta.isTouched &&
                        field.state.meta.errors.length > 0 && (
                          <p className="text-red text-sm mt-1">
                            {field.state.meta.errors[0]?.message}
                          </p>
                        )}
                    </div>
                  )}
                </form.Field>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                  <form.Field
                    name="billing_contact"> 
                     {(field) => (
                      <div>
                        <label htmlFor={field.name} className="block mb-2.5 font-medium">
                          Billing Contact Name <span className="text-red">*</span>
                        </label>
                        <input 
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          placeholder="Contact person name"
                          className={`rounded-lg border ${field.state.meta.isTouched && field.state.meta.errors.length > 0 ? 'border-red' : 'border-gray-3'
                            } bg-gray-1 placeholder:text-dark-5 w-full py-3 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20`}
                        />
                        {field.state.meta.isTouched &&
                          field.state.meta.errors.length > 0 && (
                            <p className="text-red text-sm mt-1">
                              {field.state.meta.errors[0]?.message}
                            </p>
                          )}
                      </div>
                    )}
                 </form.Field>

                  <form.Field
                    name="estimated_monthly_order_volume" >
                   {(field) => (
                      <div>
                        <label htmlFor={field.name} className="block mb-2.5 font-medium">
                          Est. Monthly Order Volume <span className="text-red">*</span>
                        </label>
                        <input 
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          placeholder="e.g., £5,000"
                          className={`rounded-lg border ${field.state.meta.isTouched && field.state.meta.errors.length > 0 ? 'border-red' : 'border-gray-3'
                            } bg-gray-1 placeholder:text-dark-5 w-full py-3 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20`}
                        />
                        {field.state.meta.isTouched &&
                          field.state.meta.errors.length > 0 && (
                            <p className="text-red text-sm mt-1">
                              {field.state.meta.errors[0]?.message}
                            </p>
                          )}
                      </div>
                    )}
                 </form.Field>
                </div>

                <form.Subscribe
                   selector={(state) => ({
                    isSubmitting: state.isSubmitting,
                  })}
                >
                  {({ isSubmitting }) => (
                    <button
                      type="submit"
                      disabled={isLoading || isSubmitting}
                      className="w-full flex justify-center items-center font-medium text-white bg-dark py-3 px-6 rounded-lg ease-out duration-200 hover:bg-blue mt-7.5 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading || isSubmitting ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          {isResubmission ? "Resubmitting..." : "Submitting..."}
                        </>
                      ) : (
                        isResubmission ? "Resubmit Application" : "Submit Application"
                      )}
                    </button>
                  )}
                </form.Subscribe>

                <p className="text-center mt-6 text-sm text-gray-5">
                  Your application will be reviewed by our team. You'll be notified via email once approved.
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default KYCSetup;
