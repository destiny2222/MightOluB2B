"use client";
import Breadcrumb from "@/components/Common/Breadcrumb";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectAuth, fetchUserProfile } from "@/redux/features/auth-slice";
import { useRouter } from "next/navigation";
import { AppDispatch } from "@/redux/store";
import PreLoader from "@/components/Common/PreLoader";

const ApplicationStatus = () => {
  const { user, isAuthenticated, isLoading } = useSelector(selectAuth);
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [isRefreshing, setIsRefreshing] = useState(true);
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    // Don't redirect if still loading auth state
    if (isLoading) return;

    if (!isAuthenticated) {
      router.replace("/b2b/login");
      return;
    }

    // Only fetch once
    if (hasFetched) return;

    // Fetch the latest profile to ensure KYC status is up-to-date
    const loadProfile = async () => {
      try {
        await dispatch(fetchUserProfile()).unwrap();
        setHasFetched(true);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      } finally {
        setIsRefreshing(false);
      }
    };

    loadProfile();
  }, [isAuthenticated, isLoading, dispatch, router, hasFetched]);

  // Show loading spinner while refreshing or auth is loading
  if (isLoading || isRefreshing) {
    return (
      <PreLoader />
    );
  }

  // If not authenticated after loading, return null (useEffect will redirect)
  if (!user) {
    return null;
  }

  // If no KYC data found, show a message
  if (!user.kyc) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-2">
        <div className="text-center max-w-md mx-auto p-8 bg-white rounded-xl shadow-1">
          <h2 className="text-2xl font-semibold text-dark mb-4">
            No KYC Application Found
          </h2>
          <p className="text-gray-5 mb-6">
            You haven't submitted a KYC application yet. Please complete the KYC process to access B2B features.
          </p>
          <Link
            href="/b2b/kyc-setup"
            className="inline-block bg-blue text-white px-6 py-3 rounded-lg font-medium hover:bg-dark transition-colors"
          >
            Complete KYC
          </Link>
        </div>
      </div>
    );
  }

  const { kyc } = user;
  const statusConfig = {
    pending: {
      title: "Application Under Review",
      icon: "⏳",
      color: "bg-yellow-50 border-yellow-200",
      textColor: "text-yellow-800",
      message: "Your B2B trade account application is currently being reviewed by our team.",
    },
    approved: {
      title: "Application Approved!",
      icon: "✅",
      color: "bg-green-50 border-green-200",
      textColor: "text-green-800",
      message: "Congratulations! Your B2B trade account has been approved. You now have access to wholesale pricing.",
    },
    rejected: {
      title: "Application Rejected",
      icon: "❌",
      color: "bg-red-50 border-red-200",
      textColor: "text-red-800",
      message: "Unfortunately, your application was not approved at this time.",
    },
    info_requested: {
      title: "Additional Information Required",
      icon: "ℹ️",
      color: "bg-blue-50 border-blue-200",
      textColor: "text-blue-800",
      message: "We need some additional information to process your application.",
    },
  };

  // Fallback to pending if status is unknown
  const config = statusConfig[kyc.status] ?? statusConfig.pending;

  return (
    <>
      {/* <Breadcrumb title="Application Status" pages={["B2B", "Application Status"]} /> */}
      <section className="overflow-hidden pt-75 pb-20 bg-gray-2 min-h-screen">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="max-w-[770px] w-full mx-auto rounded-xl bg-white shadow-1 p-4 sm:p-7.5 xl:p-11 relative">
            
            {/* Loading Overlay */}
            {isRefreshing && (
              <div className="absolute inset-0 bg-white/70 z-10 flex items-center justify-center rounded-xl backdrop-blur-sm">
                <div className="w-8 h-8 border-4 border-blue border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}

            {/* Status Card */}
            <div className={`${config.color} border-2 rounded-lg p-6 mb-8`}>
              <div className="text-center">
                <div className="text-5xl mb-4">{config.icon}</div>
                <h2 className={`font-semibold text-2xl ${config.textColor} mb-3`}>
                  {config.title}
                </h2>
                <p className="text-gray-600 mb-4">{config.message}</p>
              </div>
            </div>

            {/* Application Details */}
            <div className="bg-gray-1 rounded-lg p-6 mb-6">
              <h3 className="font-semibold text-lg text-dark mb-4">Application Details</h3>
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-gray-3">
                  <span className="text-gray-5 font-medium">Company Name:</span>
                  <span className="text-dark font-semibold">{kyc.company_name}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-3">
                  <span className="text-gray-5 font-medium">Registration Number:</span>
                  <span className="text-dark font-semibold">{kyc.company_registration_number}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-3">
                  <span className="text-gray-5 font-medium">Business Type:</span>
                  <span className="text-dark font-semibold capitalize">{kyc.business_type}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-3">
                  <span className="text-gray-5 font-medium">Status:</span>
                  <span className={`font-bold capitalize ${config.textColor}`}>
                    {kyc.status.replace('_', ' ')}
                  </span>
                </div>
                {kyc.pricing_tier && (
                  <div className="flex justify-between py-2 border-b border-gray-3">
                    <span className="text-gray-5 font-medium">Pricing Tier:</span>
                    <span className="text-dark font-semibold">{kyc.pricing_tier}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Admin Notes */}
            {kyc.status_notes && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-5 mb-6">
                <h4 className="font-semibold text-dark mb-2 flex items-center gap-2">
                  <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  Admin Notes:
                </h4>
                <p className="text-sm text-gray-700">{kyc.status_notes}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              {(kyc.status === 'rejected' || kyc.status === 'info_requested') && (
                <Link
                  href="/b2b/kyc-setup"
                  className="flex-1 flex justify-center items-center font-medium text-white bg-blue py-3 px-6 rounded-lg ease-out duration-200 hover:bg-dark"
                >
                  Resubmit Application
                </Link>
              )}
              
              {kyc.status === 'approved' && (
                <>
                  <Link
                    href="/product"
                    className="flex-1 flex justify-center items-center font-medium text-white bg-blue py-3 px-6 rounded-lg ease-out duration-200 hover:bg-dark"
                  >
                    Start Shopping
                  </Link>
                  <Link
                    href="/b2b/business-profile"
                    className="flex-1 flex justify-center items-center font-medium text-dark bg-gray-1 border border-gray-3 py-3 px-6 rounded-lg ease-out duration-200 hover:bg-gray-2"
                  >
                    Manage Profile
                  </Link>
                </>
              )}
              
              {kyc.status === 'pending' && (
                <Link
                  href="/"
                  className="flex-1 flex justify-center items-center font-medium text-dark bg-gray-1 border border-gray-3 py-3 px-6 rounded-lg ease-out duration-200 hover:bg-gray-2"
                >
                  Return to Home
                </Link>
              )}
            </div>

            {/* Help Section */}
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-5 mb-2">
                Have questions about your application?
              </p>
              <Link
                href="/contact"
                className="text-blue hover:text-dark font-medium text-sm transition-colors"
              >
                Contact Our Support Team
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ApplicationStatus;
