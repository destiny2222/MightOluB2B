"use client";
import Breadcrumb from "@/components/Common/Breadcrumb";
import AuthorizedBuyersManager from "@/components/B2B/AuthorizedBuyersManager";
import React, { useEffect, useState } from "react";
import { useAppDispatch } from "@/redux/store";
import { useSelector } from "react-redux";
import { selectAuth } from "@/redux/features/auth-slice";
import { 
  fetchBusinessProfile,
  updateBusinessProfileData,
  selectKYCData,
  selectKYCLoading,
  selectKYCError,
  selectKYCSuccessMessage,
  clearKYCError,
  clearSuccessMessage
} from "@/redux/features/kyc-slice";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Metadata } from "next";
import { useKYCProtection } from "@/hooks/useKYCProtection";

const BusinessProfile = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { user, isAuthenticated } = useSelector(selectAuth);
  const kycData = useSelector(selectKYCData);
  const isLoading = useSelector(selectKYCLoading);
  const error = useSelector(selectKYCError);
  const successMessage = useSelector(selectKYCSuccessMessage);

  // Protect this page - require approved KYC
  useKYCProtection({
    level: 'kyc-approved',
    redirectTo: '/b2b/application-status',
    toastMessage: 'Only approved B2B accounts can access the business profile'
  });

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    company_name: "",
    trade_address: "",
    billing_contact: "",
  });

  useEffect(() => {
    if (isAuthenticated && user?.kyc?.status === 'approved') {
      dispatch(fetchBusinessProfile());
    }
  }, [dispatch, isAuthenticated, user]);

  useEffect(() => {
    if (kycData) {
      setFormData({
        company_name: kycData.company_name || "",
        trade_address: kycData.trade_address || "",
        billing_contact: kycData.billing_contact || "",
      });
    }
  }, [kycData]);

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(clearSuccessMessage());
      setIsEditing(false);
      dispatch(fetchBusinessProfile());
    }
  }, [successMessage, dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearKYCError());
    }
  }, [error, dispatch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(updateBusinessProfileData(formData));
  };

  const handleCancel = () => {
    if (kycData) {
      setFormData({
        company_name: kycData.company_name || "",
        trade_address: kycData.trade_address || "",
        billing_contact: kycData.billing_contact || "",
      });
    }
    setIsEditing(false);
  };

  if (!kycData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue"></div>
      </div>
    );
  }

  return (
    <>
      <Breadcrumb title="Business Profile" pages={["B2B", "Business Profile"]} />
      <section className="overflow-hidden py-20 bg-gray-2">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          
          {/* Business Information Card */}
          <div className="bg-white rounded-xl shadow-1 p-6 mb-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-dark">Business Information</h2>
              {!isEditing && user?.is_business_owner && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 text-blue hover:text-dark transition-colors font-medium"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit Profile
                </button>
              )}
            </div>

            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="company_name" className="block mb-2 font-medium">
                    Company Name
                  </label>
                  <input
                    type="text"
                    name="company_name"
                    id="company_name"
                    value={formData.company_name}
                    onChange={handleChange}
                    className="rounded-lg border border-gray-3 bg-gray-1 w-full py-3 px-5 outline-none focus:border-blue focus:ring-2 focus:ring-blue/20"
                  />
                </div>

                <div>
                  <label htmlFor="trade_address" className="block mb-2 font-medium">
                    Trade Address
                  </label>
                  <textarea
                    name="trade_address"
                    id="trade_address"
                    value={formData.trade_address}
                    onChange={handleChange}
                    rows={3}
                    className="rounded-lg border border-gray-3 bg-gray-1 w-full py-3 px-5 outline-none focus:border-blue focus:ring-2 focus:ring-blue/20"
                  />
                </div>

                <div>
                  <label htmlFor="billing_contact" className="block mb-2 font-medium">
                    Billing Contact
                  </label>
                  <input
                    type="text"
                    name="billing_contact"
                    id="billing_contact"
                    value={formData.billing_contact}
                    onChange={handleChange}
                    className="rounded-lg border border-gray-3 bg-gray-1 w-full py-3 px-5 outline-none focus:border-blue focus:ring-2 focus:ring-blue/20"
                  />
                </div>

                <div className="flex gap-3 justify-end pt-4">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-6 py-3 bg-gray-2 text-dark rounded-lg hover:bg-gray-3 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-6 py-3 bg-blue text-white rounded-lg hover:bg-dark transition-colors font-medium disabled:opacity-50"
                  >
                    {isLoading ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-5 mb-1">Company Name</p>
                    <p className="font-semibold text-dark">{kycData.company_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-5 mb-1">Registration Number</p>
                    <p className="font-semibold text-dark">{kycData.company_registration_number}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-5 mb-1">Business Type</p>
                    <p className="font-semibold text-dark capitalize">{kycData.business_type}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-5 mb-1">Pricing Tier</p>
                    <p className="font-semibold text-dark">{kycData.pricing_tier || "Standard"}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-5 mb-1">Trade Address</p>
                  <p className="font-semibold text-dark">{kycData.trade_address}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-5 mb-1">Billing Contact</p>
                    <p className="font-semibold text-dark">{kycData.billing_contact}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-5 mb-1">Est. Monthly Volume</p>
                    <p className="font-semibold text-dark">{kycData.estimated_monthly_order_volume}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Authorized Buyers Section */}
          <AuthorizedBuyersManager />
        </div>
      </section>
    </>
  );
};

export default BusinessProfile;
