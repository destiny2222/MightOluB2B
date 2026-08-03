"use client";
import React, { useEffect } from "react";
import { useAppDispatch } from "@/redux/store";
import { useSelector } from "react-redux";
import { selectAuth, updateUserKYC, logout } from "@/redux/features/auth-slice";
import { 
  submitKYCApplication, 
  resubmitKYCApplication,
  selectKYC,
  clearKYCError,
  clearSuccessMessage 
} from "@/redux/features/kyc-slice";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

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
  const { user, isAuthenticated } = useSelector(selectAuth);
  const { isLoading, error, successMessage, kyc } = useSelector(selectKYC);

  const isResubmission = user?.kyc?.status === 'rejected' || user?.kyc?.status === 'info_requested';

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("Please login to continue");
      router.push("/b2b/login");
    }
  }, [isAuthenticated, router]);

  const defaultValues: KYCFormType = {
    company_name: isResubmission && user?.kyc?.company_name ? user.kyc.company_name : "",
    company_registration_number: isResubmission && user?.kyc?.company_registration_number ? user.kyc.company_registration_number : "",
    business_type: (isResubmission && user?.kyc?.business_type) ? (user.kyc.business_type as any) : "restaurant",
    trade_address: isResubmission && user?.kyc?.trade_address ? user.kyc.trade_address : "",
    billing_contact: isResubmission && user?.kyc?.billing_contact ? user.kyc.billing_contact : "",
    estimated_monthly_order_volume: isResubmission && user?.kyc?.estimated_monthly_order_volume ? user.kyc.estimated_monthly_order_volume : "",
  };

  const form = useForm({
    defaultValues,
    validatorAdapter: zodValidator(),
    validators: {
      onChange: kycSchema,
    },
    onSubmit: async ({ value }) => {
      if (isResubmission) {
        dispatch(resubmitKYCApplication(value));
      } else {
        dispatch(submitKYCApplication(value));
      }
    }
  });

  // Handle success
  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(clearSuccessMessage());
      
      // Update user in auth slice if we have the full response
      if (kyc && user) {
        dispatch(updateUserKYC({
          user: {
            ...user,
            kyc_id: kyc.id,
            kyc: kyc,
          }
        }));
      }
      
      // Redirect to dashboard or success page
      setTimeout(() => {
        router.push("/b2b/application-status");
      }, 2000);
    }
  }, [successMessage, dispatch, router, kyc, user]);

  // Handle errors
  useEffect(() => {
    if (error) {
      try {
        const errorObj = JSON.parse(error);
        if (typeof errorObj === 'object' && errorObj !== null) {
          toast.error("Please fix the validation errors");
        } else {
          toast.error(error);
        }
      } catch {
        toast.error(error);
      }
      dispatch(clearKYCError());
    }
  }, [error, dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    router.push("/b2b/login");
  };

  // Show status notes if resubmitting
  const statusNotes = user?.kyc?.status_notes;

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
                  <form.Field
                    name="company_name"
                    children={(field) => (
                      <div>
                        <label htmlFor={field.name} className="block mb-2.5 font-medium">
                          Company Name <span className="text-red">*</span>
                        </label>
                        <input
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          placeholder="Enter company name"
                          className={`rounded-lg border ${
                            field.state.meta.errors.length > 0 ? 'border-red' : 'border-gray-3'
                          } bg-gray-1 placeholder:text-dark-5 w-full py-3 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20`}
                        />
                        {field.state.meta.errors.length > 0 && (
                          <p className="text-red text-sm mt-1">{field.state.meta.errors.join(", ")}</p>
                        )}
                      </div>
                    )}
                  />

                  <form.Field
                    name="company_registration_number"
                    children={(field) => (
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
                          className={`rounded-lg border ${
                            field.state.meta.errors.length > 0 ? 'border-red' : 'border-gray-3'
                          } bg-gray-1 placeholder:text-dark-5 w-full py-3 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20`}
                        />
                        {field.state.meta.errors.length > 0 && (
                          <p className="text-red text-sm mt-1">{field.state.meta.errors.join(", ")}</p>
                        )}
                      </div>
                    )}
                  />
                </div>

                <form.Field
                  name="business_type"
                  children={(field) => (
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
                        className={`rounded-lg border ${
                          field.state.meta.errors.length > 0 ? 'border-red' : 'border-gray-3'
                        } bg-gray-1 w-full py-3 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20`}
                      >
                        {businessTypes.map(type => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                      {field.state.meta.errors.length > 0 && (
                        <p className="text-red text-sm mt-1">{field.state.meta.errors.join(", ")}</p>
                      )}
                    </div>
                  )}
                />

                <form.Field
                  name="trade_address"
                  children={(field) => (
                    <div className="mb-5">
                      <label htmlFor={field.name} className="block mb-2.5 font-medium">
                        Trade Address <span className="text-red">*</span>
                      </label>
                      <textarea
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="Enter your business/trading address"
                        rows={3}
                        className={`rounded-lg border ${
                          field.state.meta.errors.length > 0 ? 'border-red' : 'border-gray-3'
                        } bg-gray-1 placeholder:text-dark-5 w-full py-3 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20`}
                      />
                      {field.state.meta.errors.length > 0 && (
                        <p className="text-red text-sm mt-1">{field.state.meta.errors.join(", ")}</p>
                      )}
                    </div>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                  <form.Field
                    name="billing_contact"
                    children={(field) => (
                      <div>
                        <label htmlFor={field.name} className="block mb-2.5 font-medium">
                          Billing Contact Name <span className="text-red">*</span>
                        </label>
                        <input
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          placeholder="Contact person name"
                          className={`rounded-lg border ${
                            field.state.meta.errors.length > 0 ? 'border-red' : 'border-gray-3'
                          } bg-gray-1 placeholder:text-dark-5 w-full py-3 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20`}
                        />
                        {field.state.meta.errors.length > 0 && (
                          <p className="text-red text-sm mt-1">{field.state.meta.errors.join(", ")}</p>
                        )}
                      </div>
                    )}
                  />

                  <form.Field
                    name="estimated_monthly_order_volume"
                    children={(field) => (
                      <div>
                        <label htmlFor={field.name} className="block mb-2.5 font-medium">
                          Est. Monthly Order Volume <span className="text-red">*</span>
                        </label>
                        <input
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          placeholder="e.g., £5,000"
                          className={`rounded-lg border ${
                            field.state.meta.errors.length > 0 ? 'border-red' : 'border-gray-3'
                          } bg-gray-1 placeholder:text-dark-5 w-full py-3 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20`}
                        />
                        {field.state.meta.errors.length > 0 && (
                          <p className="text-red text-sm mt-1">{field.state.meta.errors.join(", ")}</p>
                        )}
                      </div>
                    )}
                  />
                </div>

                <form.Subscribe
                  selector={(state) => [state.canSubmit, state.isSubmitting]}
                  children={([canSubmit, isSubmitting]) => (
                    <button
                      type="submit"
                      disabled={isLoading || !canSubmit}
                      className="w-full flex justify-center items-center font-medium text-white bg-dark py-3 px-6 rounded-lg ease-out duration-200 hover:bg-blue mt-7.5 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
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
                />

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
