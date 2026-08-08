"use client";
import React, { useEffect, useState } from "react";
import { useAppDispatch } from "@/redux/store";
import { useSelector } from "react-redux";
import { selectAuth, logout, fetchUserProfile } from "@/redux/features/auth-slice";
import { clearCart } from "@/redux/features/cart-slice";
import {
  submitKYCApplication,
  resubmitKYCApplication,
  selectKYC,
} from "@/redux/features/kyc-slice";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

import { useForm } from "@tanstack/react-form";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { z } from "zod";

const businessTypeOptions = [
  { value: "limited_company", label: "Limited Company" },
  { value: "sole_trader", label: "Sole Trader" },
  { value: "partnership", label: "Partnership" },
  { value: "charity_non_profit", label: "Charity / Non-Profit" },
  { value: "restaurant", label: "Restaurant" },
  { value: "retailer", label: "Retailer" },
  { value: "caterer", label: "Caterer" },
  { value: "reseller", label: "Reseller" },
  { value: "other", label: "Other" },
] as const;

const estimatedValueOptions = [
  { value: "£1,000–£2,500", label: "£1,000 – £2,500" },
  { value: "£2,501–£5,000", label: "£2,501 – £5,000" },
  { value: "£5,001–£10,000", label: "£5,001 – £10,000" },
  { value: "Over £10,000", label: "Over £10,000" },
] as const;

const orderFrequencyOptions = [
  { value: "weekly", label: "Weekly" },
  { value: "fortnightly", label: "Fortnightly" },
  { value: "monthly", label: "Monthly" },
  { value: "ad_hoc", label: "Ad-hoc / Occasional" },
] as const;

const purposeOfPurchaseOptions = [
  { value: "restaurant_catering", label: "Restaurant / Catering" },
  { value: "retail_resale", label: "Retail / Resale" },
  { value: "distribution", label: "Wholesale / Distribution" },
  { value: "hospitality", label: "Hospitality" },
  { value: "corporate_use", label: "Corporate Use" },
  { value: "other", label: "Other" },
] as const;

const preferredContactMethodOptions = [
  { value: "email", label: "Email" },
  { value: "telephone", label: "Telephone" },
] as const;

const documentFieldLabels: Record<string, { label: string; description: string }> = {
  certificate_of_incorporation: { label: "Certificate of Incorporation", description: "Official company registration certificate" },
  proof_of_business_address: { label: "Proof of Business Address", description: "Utility bill or lease agreement under 3 months old" },
  vat_registration_certificate: { label: "VAT Registration Certificate", description: "Official HMRC or tax authority certificate" },
  business_bank_statement: { label: "Business Bank Statement", description: "Recent statement showing business name & address" },
  government_id: { label: "Director / Owner Government ID", description: "Passport or Photo Driving Licence" },
  proof_of_residential_address: { label: "Proof of Residential Address", description: "Personal utility bill or bank statement" },
  partnership_agreement: { label: "Partnership Agreement", description: "Official partnership deed or agreement" },
  sole_trader_evidence: { label: "Sole Trader Evidence", description: "HMRC UTR confirmation or tax letter" },
  other_documents: { label: "Other Supporting Documents", description: "Licenses, certifications, or supplementary proof" },
};

const STEPS = [
  { id: 1, title: "Business Info", desc: "Company Details" },
  { id: 2, title: "Address", desc: "Trade Location" },
  { id: 3, title: "Contact", desc: "Representative" },
  { id: 4, title: "Ownership", desc: "Beneficial Owner" },
  { id: 5, title: "Documents", desc: "Verification Files" },
  { id: 6, title: "Purchasing & Submit", desc: "Review & Confirm" },
];

const kycSchema = z.object({
  // Section 1: Business Info
  registered_business_name: z.string().min(1, "Registered business name is required").max(255),
  trading_name: z.string().max(255).optional().or(z.literal("")),
  business_type: z.enum([
    "sole_trader",
    "limited_company",
    "partnership",
    "charity_non_profit",
    "restaurant",
    "retailer",
    "caterer",
    "reseller",
    "other",
  ]),
  company_registration_number: z.string()
    .optional()
    .or(z.literal(""))
    .refine((val) => !val || /^[A-Z0-9\-\s]{5,20}$/i.test(val), {
      message: "Registration number must be 5-20 alphanumeric characters",
    }),
  vat_registration_number: z.string().optional().or(z.literal("")),
  date_business_established: z.string().optional().or(z.literal("")),
  nature_of_business: z.string().optional().or(z.literal("")),
  business_website: z.string().optional().or(z.literal("")),

  // Section 2: Address
  address_line_1: z.string().min(1, "Address line 1 is required"),
  address_line_2: z.string().optional().or(z.literal("")),
  city: z.string().optional().or(z.literal("")),
  postcode: z.string().optional().or(z.literal("")),
  country: z.string().optional().or(z.literal("")),

  // Section 3: Primary Contact
  primary_contact_name: z.string().min(1, "Primary contact name is required"),
  primary_contact_position: z.string().optional().or(z.literal("")),
  primary_contact_email: z.string().email("Invalid email address").optional().or(z.literal("")),
  primary_contact_phone: z.string().optional().or(z.literal("")),
  preferred_contact_method: z.enum(["email", "telephone"]).optional().or(z.literal("")),

  // Section 4: Ownership
  owner_full_name: z.string().optional().or(z.literal("")),
  owner_position: z.string().optional().or(z.literal("")),
  owner_nationality: z.string().optional().or(z.literal("")),
  owner_dob: z.string().optional().or(z.literal("")),
  owner_residential_address: z.string().optional().or(z.literal("")),

  // Section 6: Purchasing Info
  primary_products_of_interest: z.string().optional().or(z.literal("")),
  estimated_monthly_purchase_value: z.string().optional().or(z.literal("")),
  expected_order_frequency: z.string().optional().or(z.literal("")),
  purpose_of_purchase: z.string().optional().or(z.literal("")),
});

type KYCFormType = z.infer<typeof kycSchema>;

const KYCSetup = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useSelector(selectAuth);
  const { isLoading } = useSelector(selectKYC);

  const isResubmission = user?.kyc?.status === 'rejected' || user?.kyc?.status === 'info_requested';

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [maxUnlockedStep, setMaxUnlockedStep] = useState<number>(1);

  const [documentFiles, setDocumentFiles] = useState<Record<string, File | null>>({
    certificate_of_incorporation: null,
    proof_of_business_address: null,
    vat_registration_certificate: null,
    business_bank_statement: null,
    government_id: null,
    proof_of_residential_address: null,
    partnership_agreement: null,
    sole_trader_evidence: null,
    other_documents: null,
  });

  // Redirect if not authenticated
  useEffect(() => {
    const hasStoredToken = typeof window !== 'undefined' && localStorage.getItem('b2b_token');
    if (!isAuthenticated && !authLoading && !hasStoredToken) {
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
    registered_business_name: isResubmission ? (user?.kyc?.registered_business_name || user?.kyc?.company_name || "") : "",
    trading_name: isResubmission ? (user?.kyc?.trading_name || "") : "",
    business_type: isResubmission && user?.kyc?.business_type ? (user.kyc.business_type as any) : "limited_company",
    company_registration_number: isResubmission ? (user?.kyc?.company_registration_number || "") : "",
    vat_registration_number: isResubmission ? (user?.kyc?.vat_registration_number || "") : "",
    date_business_established: isResubmission ? (user?.kyc?.date_business_established || "") : "",
    nature_of_business: isResubmission ? (user?.kyc?.nature_of_business || "") : "",
    business_website: isResubmission ? (user?.kyc?.business_website || "") : "",

    address_line_1: isResubmission ? (user?.kyc?.address_line_1 || user?.kyc?.trade_address || "") : "",
    address_line_2: isResubmission ? (user?.kyc?.address_line_2 || "") : "",
    city: isResubmission ? (user?.kyc?.city || "") : "",
    postcode: isResubmission ? (user?.kyc?.postcode || "") : "",
    country: isResubmission ? (user?.kyc?.country || "United Kingdom") : "United Kingdom",

    primary_contact_name: isResubmission ? (user?.kyc?.primary_contact_name || user?.kyc?.billing_contact || "") : "",
    primary_contact_position: isResubmission ? (user?.kyc?.primary_contact_position || "") : "",
    primary_contact_email: isResubmission ? (user?.kyc?.primary_contact_email || user?.email || "") : (user?.email || ""),
    primary_contact_phone: isResubmission ? (user?.kyc?.primary_contact_phone || "") : "",
    preferred_contact_method: isResubmission && user?.kyc?.preferred_contact_method ? (user.kyc.preferred_contact_method as any) : "email",

    owner_full_name: isResubmission ? (user?.kyc?.owner_full_name || "") : "",
    owner_position: isResubmission ? (user?.kyc?.owner_position || "") : "",
    owner_nationality: isResubmission ? (user?.kyc?.owner_nationality || "") : "",
    owner_dob: isResubmission ? (user?.kyc?.owner_dob || "") : "",
    owner_residential_address: isResubmission ? (user?.kyc?.owner_residential_address || "") : "",

    primary_products_of_interest: isResubmission ? (user?.kyc?.primary_products_of_interest || "") : "",
    estimated_monthly_purchase_value: isResubmission ? (user?.kyc?.estimated_monthly_purchase_value || user?.kyc?.estimated_monthly_order_volume || "£5,001–£10,000") : "£5,001–£10,000",
    expected_order_frequency: isResubmission && user?.kyc?.expected_order_frequency ? user.kyc.expected_order_frequency : "weekly",
    purpose_of_purchase: isResubmission && user?.kyc?.purpose_of_purchase ? user.kyc.purpose_of_purchase : "restaurant_catering",
  };

  const handleFileChange = (fieldKey: string, file: File | null) => {
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`File "${file.name}" exceeds the maximum allowed size of 10MB.`);
        return;
      }
      const allowedTypes = [
        'application/pdf',
        'image/jpeg',
        'image/png',
        'image/webp',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/msword'
      ];
      if (!allowedTypes.includes(file.type) && !file.name.match(/\.(pdf|jpg|jpeg|png|webp|docx|doc)$/i)) {
        toast.error(`File "${file.name}" format is not supported. Please upload PDF, JPG, PNG, WEBP, or DOCX.`);
        return;
      }
    }
    setDocumentFiles((prev) => ({ ...prev, [fieldKey]: file }));
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
        const formData = new FormData();

        // Composite fields for backend backward compatibility
        const companyName = value.registered_business_name || value.trading_name;
        const addressParts = [
          value.address_line_1,
          value.address_line_2,
          value.city,
          value.postcode,
          value.country
        ].filter(Boolean);
        const tradeAddress = addressParts.join(", ");

        const contactParts = [
          value.primary_contact_name,
          value.primary_contact_position ? `(${value.primary_contact_position})` : null,
          value.primary_contact_email,
          value.primary_contact_phone
        ].filter(Boolean);
        const billingContact = contactParts.join(" - ");

        // Append text fields
        formData.append("registered_business_name", value.registered_business_name);
        if (companyName) formData.append("company_name", companyName);
        if (value.trading_name) formData.append("trading_name", value.trading_name);
        formData.append("business_type", value.business_type);
        if (value.company_registration_number) formData.append("company_registration_number", value.company_registration_number);
        if (value.vat_registration_number) formData.append("vat_registration_number", value.vat_registration_number);
        if (value.date_business_established) formData.append("date_business_established", value.date_business_established);
        if (value.nature_of_business) formData.append("nature_of_business", value.nature_of_business);
        if (value.business_website) formData.append("business_website", value.business_website);

        formData.append("address_line_1", value.address_line_1);
        if (value.address_line_2) formData.append("address_line_2", value.address_line_2);
        if (value.city) formData.append("city", value.city);
        if (value.postcode) formData.append("postcode", value.postcode);
        if (value.country) formData.append("country", value.country);
        if (tradeAddress) formData.append("trade_address", tradeAddress);

        formData.append("primary_contact_name", value.primary_contact_name);
        if (value.primary_contact_position) formData.append("primary_contact_position", value.primary_contact_position);
        if (value.primary_contact_email) formData.append("primary_contact_email", value.primary_contact_email);
        if (value.primary_contact_phone) formData.append("primary_contact_phone", value.primary_contact_phone);
        if (value.preferred_contact_method) formData.append("preferred_contact_method", value.preferred_contact_method);
        if (billingContact) formData.append("billing_contact", billingContact);

        if (value.owner_full_name) formData.append("owner_full_name", value.owner_full_name);
        if (value.owner_position) formData.append("owner_position", value.owner_position);
        if (value.owner_nationality) formData.append("owner_nationality", value.owner_nationality);
        if (value.owner_dob) formData.append("owner_dob", value.owner_dob);
        if (value.owner_residential_address) formData.append("owner_residential_address", value.owner_residential_address);

        if (value.primary_products_of_interest) formData.append("primary_products_of_interest", value.primary_products_of_interest);
        if (value.estimated_monthly_purchase_value) {
          formData.append("estimated_monthly_purchase_value", value.estimated_monthly_purchase_value);
          formData.append("estimated_monthly_order_volume", value.estimated_monthly_purchase_value);
        }
        if (value.expected_order_frequency) formData.append("expected_order_frequency", value.expected_order_frequency);
        if (value.purpose_of_purchase) formData.append("purpose_of_purchase", value.purpose_of_purchase);

        // Append document files
        Object.entries(documentFiles).forEach(([docKey, file]) => {
          if (file) {
            formData.append(docKey, file);
          }
        });

        const response = isResubmission
          ? await dispatch(resubmitKYCApplication(formData)).unwrap()
          : await dispatch(submitKYCApplication(formData)).unwrap();

        await dispatch(fetchUserProfile()).unwrap();
        toast.success("KYC Application Submitted Successfully");

        await new Promise((resolve) => setTimeout(resolve, 800));
        router.replace("/b2b/application-status");
      } catch (err: any) {
        if (err?.error?.includes("already associated") || err?.includes("already associated")) {
          toast.error("You already have a B2B application. Refreshing your status...");
          await dispatch(fetchUserProfile()).unwrap();
          setTimeout(() => {
            router.push("/b2b/application-status");
          }, 1000);
        } else {
          toast.error(typeof err === 'string' ? err : err?.error || "Submission failed");
        }
      }
    }
  } as any);

  const validateStep = (step: number): boolean => {
    const values = form.state.values;

    if (step === 1) {
      if (!values.registered_business_name || !values.registered_business_name.trim()) {
        toast.error("Please enter your registered business name");
        return false;
      }
      if (values.company_registration_number) {
        const isValid = /^[A-Z0-9\-\s]{5,20}$/i.test(values.company_registration_number);
        if (!isValid) {
          toast.error("Registration number must be 5-20 alphanumeric characters");
          return false;
        }
      }
    } else if (step === 2) {
      if (!values.address_line_1 || !values.address_line_1.trim()) {
        toast.error("Please enter Address Line 1");
        return false;
      }
    } else if (step === 3) {
      if (!values.primary_contact_name || !values.primary_contact_name.trim()) {
        toast.error("Please enter the primary contact name");
        return false;
      }
      if (values.primary_contact_email) {
        const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.primary_contact_email);
        if (!isEmailValid) {
          toast.error("Please enter a valid email address");
          return false;
        }
      }
    }

    return true;
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      if (nextStep > maxUnlockedStep) {
        setMaxUnlockedStep(nextStep);
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleJumpToStep = (stepId: number) => {
    if (stepId <= maxUnlockedStep) {
      setCurrentStep(stepId);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearCart());
    router.push("/b2b/login");
  };

  const statusNotes = user?.kyc?.status_notes;

  if (authLoading) {
    return (
      <section className="overflow-hidden py-20 bg-gray-2">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="max-w-[850px] w-full mx-auto rounded-xl bg-white shadow-1 p-4 sm:p-7.5 xl:p-11">
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-12 h-12 border-4 border-blue border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-gray-5">Verifying your account status...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const values = form.state.values;

  return (
    <>
      <section className="overflow-hidden py-12 bg-gray-2">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="max-w-[950px] w-full mx-auto bg-white rounded-2xl shadow-1 p-4 sm:p-8 xl:p-11 border border-gray-2">
            
            {/* Header */}
            <div className="flex justify-between items-start mb-8 pb-6 border-b border-gray-2">
              <div className="text-left">
                <span className="inline-block bg-blue/10 text-blue font-semibold text-xs px-3 py-1 rounded-full mb-2">
                  Step {currentStep} of {STEPS.length}
                </span>
                <h2 className="font-bold text-xl sm:text-2xl xl:text-3xl text-dark mb-1.5">
                  {isResubmission ? "Resubmit Business Application" : "B2B Account Verification"}
                </h2>
                <p className="text-gray-5 text-sm sm:text-base">
                  {STEPS.find(s => s.id === currentStep)?.title} — {STEPS.find(s => s.id === currentStep)?.desc}
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

            {/* Admin Status Notes */}
            {statusNotes && (
              <div className="mb-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h3 className="font-semibold text-dark mb-1 flex items-center gap-2 text-sm sm:text-base">
                  <svg className="w-5 h-5 text-yellow-600 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  Admin Review Notes:
                </h3>
                <p className="text-sm text-gray-600 pl-7">{statusNotes}</p>
              </div>
            )}

            {/* Step Wizard Bar */}
            <div className="mb-10">
              <div className="flex items-center justify-between mb-3 overflow-x-auto pb-2 scrollbar-none">
                {STEPS.map((step) => {
                  const isActive = currentStep === step.id;
                  const isCompleted = step.id < currentStep;
                  const isUnlocked = step.id <= maxUnlockedStep;

                  return (
                    <button
                      key={step.id}
                      type="button"
                      disabled={!isUnlocked}
                      onClick={() => handleJumpToStep(step.id)}
                      className={`flex flex-col items-center min-w-[110px] text-center px-2 py-1 transition-all rounded-lg ${
                        isActive
                          ? "text-blue font-semibold"
                          : isCompleted
                          ? "text-green-600 hover:bg-gray-1"
                          : isUnlocked
                          ? "text-dark hover:bg-gray-1"
                          : "text-gray-4 cursor-not-allowed"
                      }`}
                    >
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm mb-1.5 duration-200 ${
                          isActive
                            ? "bg-blue text-white ring-4 ring-blue/20"
                            : isCompleted
                            ? "bg-green-500 text-white"
                            : isUnlocked
                            ? "bg-gray-2 text-dark border border-gray-3"
                            : "bg-gray-2 text-gray-4"
                        }`}
                      >
                        {isCompleted ? (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          step.id
                        )}
                      </div>
                      <span className="text-xs font-medium whitespace-nowrap">{step.title}</span>
                    </button>
                  );
                })}
              </div>

              {/* Progress Line */}
              <div className="w-full bg-gray-2 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-blue h-full duration-300 ease-out"
                  style={{ width: `${(currentStep / STEPS.length) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Form Steps */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (currentStep === 6) {
                  form.handleSubmit();
                } else {
                  handleNextStep();
                }
              }}
            >
              {/* STEP 1: BUSINESS INFO */}
              {currentStep === 1 && (
                <div className="bg-gray-1/40 p-5 sm:p-7 rounded-xl border border-gray-2 space-y-5 animate-fadeIn">
                  <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-2">
                    <span className="flex items-center justify-center w-7 h-7 bg-blue text-white font-semibold text-sm rounded-full">
                      1
                    </span>
                    <h3 className="text-lg font-semibold text-dark">Business Information</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <form.Field name="registered_business_name">
                      {(field) => (
                        <div>
                          <label htmlFor={field.name} className="block mb-2 font-medium text-sm text-dark">
                            Registered Business Name <span className="text-red">*</span>
                          </label>
                          <input
                            id={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            placeholder="e.g. Acme Catering Supplies Ltd"
                            className={`rounded-lg border ${field.state.meta.isTouched && field.state.meta.errors.length > 0 ? 'border-red' : 'border-gray-3'
                              } bg-white placeholder:text-dark-5 w-full py-2.5 px-4 outline-none duration-200 focus:border-transparent focus:ring-2 focus:ring-blue/20`}
                          />
                          {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                            <p className="text-red text-xs mt-1">{field.state.meta.errors[0]?.message}</p>
                          )}
                        </div>
                      )}
                    </form.Field>

                    <form.Field name="trading_name">
                      {(field) => (
                        <div>
                          <label htmlFor={field.name} className="block mb-2 font-medium text-sm text-dark">
                            Trading Name  
                          </label>
                          <input
                            id={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            placeholder="e.g. Acme Foods"
                            className="rounded-lg border border-gray-3 bg-white placeholder:text-dark-5 w-full py-2.5 px-4 outline-none duration-200 focus:border-transparent focus:ring-2 focus:ring-blue/20"
                          />
                        </div>
                      )}
                    </form.Field>

                    <form.Field name="business_type">
                      {(field) => (
                        <div>
                          <label htmlFor={field.name} className="block mb-2 font-medium text-sm text-dark">
                            Business Structure / Type <span className="text-red">*</span>
                          </label>
                          <select
                            id={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value as any)}
                            className="rounded-lg border border-gray-3 bg-white w-full py-2.5 px-4 outline-none duration-200 focus:border-transparent focus:ring-2 focus:ring-blue/20"
                          >
                            {businessTypeOptions.map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                    </form.Field>

                    <form.Field name="company_registration_number">
                      {(field) => (
                        <div>
                          <label htmlFor={field.name} className="block mb-2 font-medium text-sm text-dark">
                            Company Registration Number <span className="text-xs text-gray-5">(5-20 alphanumeric)</span>
                          </label>
                          <input
                            id={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            placeholder="e.g. VAT-12345-67"
                            className={`rounded-lg border ${field.state.meta.isTouched && field.state.meta.errors.length > 0 ? 'border-red' : 'border-gray-3'
                              } bg-white placeholder:text-dark-5 w-full py-2.5 px-4 outline-none duration-200 focus:border-transparent focus:ring-2 focus:ring-blue/20`}
                          />
                          {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                            <p className="text-red text-xs mt-1">{field.state.meta.errors[0]?.message}</p>
                          )}
                        </div>
                      )}
                    </form.Field>

                    <form.Field name="vat_registration_number">
                      {(field) => (
                        <div>
                          <label htmlFor={field.name} className="block mb-2 font-medium text-sm text-dark">
                            VAT Registration Number
                          </label>
                          <input
                            id={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            placeholder="e.g. GB999888777"
                            className="rounded-lg border border-gray-3 bg-white placeholder:text-dark-5 w-full py-2.5 px-4 outline-none duration-200 focus:border-transparent focus:ring-2 focus:ring-blue/20"
                          />
                        </div>
                      )}
                    </form.Field>

                    <form.Field name="date_business_established">
                      {(field) => (
                        <div>
                          <label htmlFor={field.name} className="block mb-2 font-medium text-sm text-dark">
                            Date Business Established <span className="text-xs text-gray-5">(YYYY-MM-DD)</span>
                          </label>
                          <input
                            id={field.name}
                            type="date"
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            className="rounded-lg border border-gray-3 bg-white placeholder:text-dark-5 w-full py-2.5 px-4 outline-none duration-200 focus:border-transparent focus:ring-2 focus:ring-blue/20"
                          />
                        </div>
                      )}
                    </form.Field>

                    <form.Field name="nature_of_business">
                      {(field) => (
                        <div>
                          <label htmlFor={field.name} className="block mb-2 font-medium text-sm text-dark">
                            Nature of Business
                          </label>
                          <input
                            id={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            placeholder="e.g. Food Catering & Wholesale Services"
                            className="rounded-lg border border-gray-3 bg-white placeholder:text-dark-5 w-full py-2.5 px-4 outline-none duration-200 focus:border-transparent focus:ring-2 focus:ring-blue/20"
                          />
                        </div>
                      )}
                    </form.Field>

                    <form.Field name="business_website">
                      {(field) => (
                        <div>
                          <label htmlFor={field.name} className="block mb-2 font-medium text-sm text-dark">
                            Business Website <span className="text-xs text-gray-5">(Optional)</span>
                          </label>
                          <input
                            id={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            placeholder="https://www.acmefoods.co.uk"
                            className="rounded-lg border border-gray-3 bg-white placeholder:text-dark-5 w-full py-2.5 px-4 outline-none duration-200 focus:border-transparent focus:ring-2 focus:ring-blue/20"
                          />
                        </div>
                      )}
                    </form.Field>
                  </div>
                </div>
              )}

              {/* STEP 2: BUSINESS ADDRESS */}
              {currentStep === 2 && (
                <div className="bg-gray-1/40 p-5 sm:p-7 rounded-xl border border-gray-2 space-y-5 animate-fadeIn">
                  <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-2">
                    <span className="flex items-center justify-center w-7 h-7 bg-blue text-white font-semibold text-sm rounded-full">
                      2
                    </span>
                    <h3 className="text-lg font-semibold text-dark">Business Address</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <form.Field name="address_line_1">
                      {(field) => (
                        <div className="md:col-span-2">
                          <label htmlFor={field.name} className="block mb-2 font-medium text-sm text-dark">
                            Address Line 1 <span className="text-red">*</span>
                          </label>
                          <input
                            id={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            placeholder="e.g. 123 Commercial Way"
                            className={`rounded-lg border ${field.state.meta.isTouched && field.state.meta.errors.length > 0 ? 'border-red' : 'border-gray-3'
                              } bg-white placeholder:text-dark-5 w-full py-2.5 px-4 outline-none duration-200 focus:border-transparent focus:ring-2 focus:ring-blue/20`}
                          />
                          {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                            <p className="text-red text-xs mt-1">{field.state.meta.errors[0]?.message}</p>
                          )}
                        </div>
                      )}
                    </form.Field>

                    <form.Field name="address_line_2">
                      {(field) => (
                        <div>
                          <label htmlFor={field.name} className="block mb-2 font-medium text-sm text-dark">
                            Address Line 2 <span className="text-xs text-gray-5">(Optional)</span>
                          </label>
                          <input
                            id={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            placeholder="e.g. Suite 4B"
                            className="rounded-lg border border-gray-3 bg-white placeholder:text-dark-5 w-full py-2.5 px-4 outline-none duration-200 focus:border-transparent focus:ring-2 focus:ring-blue/20"
                          />
                        </div>
                      )}
                    </form.Field>

                    <form.Field name="city">
                      {(field) => (
                        <div>
                          <label htmlFor={field.name} className="block mb-2 font-medium text-sm text-dark">
                            Town / City 
                          </label>
                          <input
                            id={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            placeholder="e.g. London"
                            className="rounded-lg border border-gray-3 bg-white placeholder:text-dark-5 w-full py-2.5 px-4 outline-none duration-200 focus:border-transparent focus:ring-2 focus:ring-blue/20"
                          />
                        </div>
                      )}
                    </form.Field>

                    <form.Field name="postcode">
                      {(field) => (
                        <div>
                          <label htmlFor={field.name} className="block mb-2 font-medium text-sm text-dark">
                            Postcode / Zip
                          </label>
                          <input
                            id={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            placeholder="e.g. EC1A 1BB"
                            className="rounded-lg border border-gray-3 bg-white placeholder:text-dark-5 w-full py-2.5 px-4 outline-none duration-200 focus:border-transparent focus:ring-2 focus:ring-blue/20"
                          />
                        </div>
                      )}
                    </form.Field>

                    <form.Field name="country">
                      {(field) => (
                        <div>
                          <label htmlFor={field.name} className="block mb-2 font-medium text-sm text-dark">
                            Country 
                          </label>
                          <input
                            id={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            placeholder="e.g. United Kingdom"
                            className="rounded-lg border border-gray-3 bg-white placeholder:text-dark-5 w-full py-2.5 px-4 outline-none duration-200 focus:border-transparent focus:ring-2 focus:ring-blue/20"
                          />
                        </div>
                      )}
                    </form.Field>
                  </div>
                </div>
              )}

              {/* STEP 3: PRIMARY CONTACT */}
              {currentStep === 3 && (
                <div className="bg-gray-1/40 p-5 sm:p-7 rounded-xl border border-gray-2 space-y-5 animate-fadeIn">
                  <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-2">
                    <span className="flex items-center justify-center w-7 h-7 bg-blue text-white font-semibold text-sm rounded-full">
                      3
                    </span>
                    <h3 className="text-lg font-semibold text-dark">Primary Account Contact</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <form.Field name="primary_contact_name">
                      {(field) => (
                        <div>
                          <label htmlFor={field.name} className="block mb-2 font-medium text-sm text-dark">
                            Primary Contact Name <span className="text-red">*</span>
                          </label>
                          <input
                            id={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            placeholder="e.g. John Doe"
                            className={`rounded-lg border ${field.state.meta.isTouched && field.state.meta.errors.length > 0 ? 'border-red' : 'border-gray-3'
                              } bg-white placeholder:text-dark-5 w-full py-2.5 px-4 outline-none duration-200 focus:border-transparent focus:ring-2 focus:ring-blue/20`}
                          />
                          {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                            <p className="text-red text-xs mt-1">{field.state.meta.errors[0]?.message}</p>
                          )}
                        </div>
                      )}
                    </form.Field>

                    <form.Field name="primary_contact_position">
                      {(field) => (
                        <div>
                          <label htmlFor={field.name} className="block mb-2 font-medium text-sm text-dark">
                            Position / Title
                          </label>
                          <input
                            id={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            placeholder="e.g. Managing Director"
                            className="rounded-lg border border-gray-3 bg-white placeholder:text-dark-5 w-full py-2.5 px-4 outline-none duration-200 focus:border-transparent focus:ring-2 focus:ring-blue/20"
                          />
                        </div>
                      )}
                    </form.Field>

                    <form.Field name="primary_contact_email">
                      {(field) => (
                        <div>
                          <label htmlFor={field.name} className="block mb-2 font-medium text-sm text-dark">
                            Contact Email Address 
                          </label>
                          <input
                            id={field.name}
                            type="email"
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            placeholder="john.doe@acmefoods.co.uk"
                            className={`rounded-lg border ${field.state.meta.isTouched && field.state.meta.errors.length > 0 ? 'border-red' : 'border-gray-3'
                              } bg-white placeholder:text-dark-5 w-full py-2.5 px-4 outline-none duration-200 focus:border-transparent focus:ring-2 focus:ring-blue/20`}
                          />
                          {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                            <p className="text-red text-xs mt-1">{field.state.meta.errors[0]?.message}</p>
                          )}
                        </div>
                      )}
                    </form.Field>

                    <form.Field name="primary_contact_phone">
                      {(field) => (
                        <div>
                          <label htmlFor={field.name} className="block mb-2 font-medium text-sm text-dark">
                            Telephone Number 
                          </label>
                          <input
                            id={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            placeholder="+44 20 7946 0912"
                            className="rounded-lg border border-gray-3 bg-white placeholder:text-dark-5 w-full py-2.5 px-4 outline-none duration-200 focus:border-transparent focus:ring-2 focus:ring-blue/20"
                          />
                        </div>
                      )}
                    </form.Field>

                    <form.Field name="preferred_contact_method">
                      {(field) => (
                        <div>
                          <label htmlFor={field.name} className="block mb-2 font-medium text-sm text-dark">
                            Preferred Contact Method
                          </label>
                          <select
                            id={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value as any)}
                            className="rounded-lg border border-gray-3 bg-white w-full py-2.5 px-4 outline-none duration-200 focus:border-transparent focus:ring-2 focus:ring-blue/20"
                          >
                            {preferredContactMethodOptions.map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                    </form.Field>
                  </div>
                </div>
              )}

              {/* STEP 4: BENEFICIAL OWNERSHIP */}
              {currentStep === 4 && (
                <div className="bg-gray-1/40 p-5 sm:p-7 rounded-xl border border-gray-2 space-y-5 animate-fadeIn">
                  <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-2">
                    <span className="flex items-center justify-center w-7 h-7 bg-blue text-white font-semibold text-sm rounded-full">
                      4
                    </span>
                    <h3 className="text-lg font-semibold text-dark">Beneficial Owner / Director Details</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <form.Field name="owner_full_name">
                      {(field) => (
                        <div>
                          <label htmlFor={field.name} className="block mb-2 font-medium text-sm text-dark">
                            Owner / Director Full Name 
                          </label>
                          <input
                            id={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            placeholder="e.g. Johnathan Doe"
                            className="rounded-lg border border-gray-3 bg-white placeholder:text-dark-5 w-full py-2.5 px-4 outline-none duration-200 focus:border-transparent focus:ring-2 focus:ring-blue/20"
                          />
                        </div>
                      )}
                    </form.Field>

                    <form.Field name="owner_position">
                      {(field) => (
                        <div>
                          <label htmlFor={field.name} className="block mb-2 font-medium text-sm text-dark">
                            Position / Ownership Share 
                          </label>
                          <input
                            id={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            placeholder="e.g. Sole Shareholder & Director"
                            className="rounded-lg border border-gray-3 bg-white placeholder:text-dark-5 w-full py-2.5 px-4 outline-none duration-200 focus:border-transparent focus:ring-2 focus:ring-blue/20"
                          />
                        </div>
                      )}
                    </form.Field>

                    <form.Field name="owner_nationality">
                      {(field) => (
                        <div>
                          <label htmlFor={field.name} className="block mb-2 font-medium text-sm text-dark">
                            Nationality 
                          </label>
                          <input
                            id={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            placeholder="e.g. British"
                            className="rounded-lg border border-gray-3 bg-white placeholder:text-dark-5 w-full py-2.5 px-4 outline-none duration-200 focus:border-transparent focus:ring-2 focus:ring-blue/20"
                          />
                        </div>
                      )}
                    </form.Field>

                    <form.Field name="owner_dob">
                      {(field) => (
                        <div>
                          <label htmlFor={field.name} className="block mb-2 font-medium text-sm text-dark">
                            Date of Birth <span className="text-xs text-gray-5">(YYYY-MM-DD)</span>
                          </label>
                          <input
                            id={field.name}
                            type="date"
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            className="rounded-lg border border-gray-3 bg-white placeholder:text-dark-5 w-full py-2.5 px-4 outline-none duration-200 focus:border-transparent focus:ring-2 focus:ring-blue/20"
                          />
                        </div>
                      )}
                    </form.Field>

                    <form.Field name="owner_residential_address">
                      {(field) => (
                        <div className="md:col-span-2">
                          <label htmlFor={field.name} className="block mb-2 font-medium text-sm text-dark">
                            Residential Address 
                          </label>
                          <input
                            id={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            placeholder="e.g. 45 High Street, London, EC1A 2CC, UK"
                            className="rounded-lg border border-gray-3 bg-white placeholder:text-dark-5 w-full py-2.5 px-4 outline-none duration-200 focus:border-transparent focus:ring-2 focus:ring-blue/20"
                          />
                        </div>
                      )}
                    </form.Field>
                  </div>
                </div>
              )}

              {/* STEP 5: VERIFICATION DOCUMENTS */}
              {currentStep === 5 && (
                <div className="bg-gray-1/40 p-5 sm:p-7 rounded-xl border border-gray-2 space-y-5 animate-fadeIn">
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-2">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center justify-center w-7 h-7 bg-blue text-white font-semibold text-sm rounded-full">
                        5
                      </span>
                      <h3 className="text-lg font-semibold text-dark">Verification Documents</h3>
                    </div>
                    <span className="text-xs text-gray-5 font-medium">PDF, JPG, PNG, WEBP, DOCX (Max 10MB each)</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {Object.entries(documentFieldLabels).map(([key, info]) => {
                      const selectedFile = documentFiles[key];
                      return (
                        <div key={key} className="bg-white p-4 rounded-lg border border-gray-3">
                          <label className="block font-medium text-sm text-dark mb-1">
                            {info.label}
                          </label>
                          <p className="text-xs text-gray-5 mb-3">{info.description}</p>

                          {selectedFile ? (
                            <div className="flex items-center justify-between p-2.5 bg-blue/5 border border-blue/20 rounded-md">
                              <div className="flex items-center gap-2 truncate">
                                <svg className="w-5 h-5 text-blue shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <span className="text-xs font-medium text-dark truncate">{selectedFile.name}</span>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleFileChange(key, null)}
                                className="text-xs text-red hover:underline shrink-0 ml-2 font-medium"
                              >
                                Remove
                              </button>
                            </div>
                          ) : (
                            <label className="flex items-center justify-center gap-2 py-2 px-3 border border-dashed border-gray-4 rounded-md cursor-pointer hover:border-blue hover:bg-blue/5 duration-200 text-xs text-gray-6 font-medium">
                              <svg className="w-4 h-4 text-gray-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                              </svg>
                              Select File
                              <input
                                type="file"
                                accept=".pdf,.jpg,.jpeg,.png,.webp,.docx,.doc"
                                className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files?.[0] || null;
                                  handleFileChange(key, file);
                                }}
                              />
                            </label>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STEP 6: PURCHASING INFO & FINAL REVIEW */}
              {currentStep === 6 && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="bg-gray-1/40 p-5 sm:p-7 rounded-xl border border-gray-2 space-y-5">
                    <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-2">
                      <span className="flex items-center justify-center w-7 h-7 bg-blue text-white font-semibold text-sm rounded-full">
                        6
                      </span>
                      <h3 className="text-lg font-semibold text-dark">Purchasing Information</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <form.Field name="primary_products_of_interest">
                        {(field) => (
                          <div className="md:col-span-2">
                            <label htmlFor={field.name} className="block mb-2 font-medium text-sm text-dark">
                              Primary Products of Interest  
                            </label>
                            <input
                              id={field.name}
                              value={field.state.value}
                              onBlur={field.handleBlur}
                              onChange={(e) => field.handleChange(e.target.value)}
                              placeholder="e.g. African Spices, Bulk Grains, Palm Oil 20L"
                              className="rounded-lg border border-gray-3 bg-white placeholder:text-dark-5 w-full py-2.5 px-4 outline-none duration-200 focus:border-transparent focus:ring-2 focus:ring-blue/20"
                            />
                          </div>
                        )}
                      </form.Field>

                      <form.Field name="estimated_monthly_purchase_value">
                        {(field) => (
                          <div>
                            <label htmlFor={field.name} className="block mb-2 font-medium text-sm text-dark">
                              Estimated Monthly Order Volume 
                            </label>
                            <select
                              id={field.name}
                              value={field.state.value}
                              onBlur={field.handleBlur}
                              onChange={(e) => field.handleChange(e.target.value)}
                              className="rounded-lg border border-gray-3 bg-white w-full py-2.5 px-4 outline-none duration-200 focus:border-transparent focus:ring-2 focus:ring-blue/20"
                            >
                              {estimatedValueOptions.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                  {opt.label}
                                </option>
                              ))}
                            </select>
                          </div>
                        )}
                      </form.Field>

                      <form.Field name="expected_order_frequency">
                        {(field) => (
                          <div>
                            <label htmlFor={field.name} className="block mb-2 font-medium text-sm text-dark">
                              Expected Order Frequency 
                            </label>
                            <select
                              id={field.name}
                              value={field.state.value}
                              onBlur={field.handleBlur}
                              onChange={(e) => field.handleChange(e.target.value)}
                              className="rounded-lg border border-gray-3 bg-white w-full py-2.5 px-4 outline-none duration-200 focus:border-transparent focus:ring-2 focus:ring-blue/20"
                            >
                              {orderFrequencyOptions.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                  {opt.label}
                                </option>
                              ))}
                            </select>
                          </div>
                        )}
                      </form.Field>

                      <form.Field name="purpose_of_purchase">
                        {(field) => (
                          <div className="md:col-span-2">
                            <label htmlFor={field.name} className="block mb-2 font-medium text-sm text-dark">
                              Purpose of Purchase 
                            </label>
                            <select
                              id={field.name}
                              value={field.state.value}
                              onBlur={field.handleBlur}
                              onChange={(e) => field.handleChange(e.target.value)}
                              className="rounded-lg border border-gray-3 bg-white w-full py-2.5 px-4 outline-none duration-200 focus:border-transparent focus:ring-2 focus:ring-blue/20"
                            >
                              {purposeOfPurchaseOptions.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                  {opt.label}
                                </option>
                              ))}
                            </select>
                          </div>
                        )}
                      </form.Field>
                    </div>
                  </div>

                  {/* Summary Card before submission */}
                  <div className="bg-blue/5 p-5 sm:p-6 rounded-xl border border-blue/20">
                    <h4 className="font-semibold text-dark mb-4 text-base flex items-center gap-2">
                      <svg className="w-5 h-5 text-blue" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      Application Summary Review
                    </h4>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                      <div>
                        <span className="text-gray-5 block font-medium">Business Name:</span>
                        <span className="text-dark font-semibold">{values.registered_business_name || "—"}</span>
                      </div>
                      <div>
                        <span className="text-gray-5 block font-medium">Trading Name:</span>
                        <span className="text-dark font-semibold">{values.trading_name || "—"}</span>
                      </div>
                      <div>
                        <span className="text-gray-5 block font-medium">Business Type:</span>
                        <span className="text-dark font-semibold capitalize">{values.business_type?.replace('_', ' ')}</span>
                      </div>
                      <div>
                        <span className="text-gray-5 block font-medium">Registration No:</span>
                        <span className="text-dark font-semibold">{values.company_registration_number || "—"}</span>
                      </div>
                      <div className="sm:col-span-2">
                        <span className="text-gray-5 block font-medium">Trade Address:</span>
                        <span className="text-dark font-semibold">
                          {[values.address_line_1, values.address_line_2, values.city, values.postcode, values.country].filter(Boolean).join(", ")}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-5 block font-medium">Primary Contact:</span>
                        <span className="text-dark font-semibold">{values.primary_contact_name} ({values.primary_contact_email || "No email"})</span>
                      </div>
                      <div>
                        <span className="text-gray-5 block font-medium">Uploaded Files:</span>
                        <span className="text-dark font-semibold">
                          {Object.values(documentFiles).filter(Boolean).length} file(s) attached
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Wizard Navigation Controls */}
              <div className="flex items-center justify-between pt-8 border-t border-gray-2 mt-8">
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="flex items-center gap-2 font-medium text-dark bg-gray-2 hover:bg-gray-3 py-3 px-6 rounded-lg ease-out duration-200"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                    Previous Step
                  </button>
                ) : (
                  <div></div>
                )}

                {currentStep < 6 ? (
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="flex items-center gap-2 font-medium text-white bg-blue hover:bg-blue-600 py-3 px-7 rounded-lg ease-out duration-200 shadow-md ml-auto"
                  >
                    Next Step
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                ) : (
                  <form.Subscribe
                    selector={(state) => ({
                      isSubmitting: state.isSubmitting,
                    })}
                  >
                    {({ isSubmitting }) => (
                      <button
                        type="submit"
                        disabled={isLoading || isSubmitting}
                        className="flex justify-center items-center font-medium text-white bg-dark py-3.5 px-8 rounded-lg ease-out duration-200 hover:bg-blue disabled:opacity-50 disabled:cursor-not-allowed text-base shadow-md ml-auto"
                      >
                        {isLoading || isSubmitting ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            {isResubmission ? "Resubmitting Application..." : "Submitting Application..."}
                          </>
                        ) : (
                          isResubmission ? "Resubmit Application" : "Submit Verification Application"
                        )}
                      </button>
                    )}
                  </form.Subscribe>
                )}
              </div>

              <p className="text-center text-xs text-gray-5 mt-6">
                By submitting this form, you confirm that all trade information provided is accurate and verifiable.
              </p>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default KYCSetup;

;
