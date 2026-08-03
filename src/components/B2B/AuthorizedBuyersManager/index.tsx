"use client";
import React, { useEffect, useState } from "react";
import { useAppDispatch } from "@/redux/store";
import { useSelector } from "react-redux";
import { selectAuth } from "@/redux/features/auth-slice";
import {
  fetchAuthorizedBuyers,
  addNewAuthorizedBuyer,
  removeAuthorizedBuyer,
  selectAuthorizedBuyers,
  selectKYCLoading,
  selectKYCError,
  selectKYCSuccessMessage,
  clearKYCError,
  clearSuccessMessage,
} from "@/redux/features/kyc-slice";
import toast from "react-hot-toast";

const AuthorizedBuyersManager = () => {
  const dispatch = useAppDispatch();
  const { user } = useSelector(selectAuth);
  const buyers = useSelector(selectAuthorizedBuyers);
  const isLoading = useSelector(selectKYCLoading);
  const error = useSelector(selectKYCError);
  const successMessage = useSelector(selectKYCSuccessMessage);

  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({});

  const isBusinessOwner = user?.is_business_owner;
  const isApproved = user?.kyc?.status === 'approved';

  useEffect(() => {
    if (isBusinessOwner && isApproved) {
      dispatch(fetchAuthorizedBuyers());
    }
  }, [dispatch, isBusinessOwner, isApproved]);

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(clearSuccessMessage());
      setShowAddForm(false);
      setFormData({ name: "", email: "", password: "", password_confirmation: "" });
      setValidationErrors({});
    }
  }, [successMessage, dispatch]);

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
      dispatch(clearKYCError());
    }
  }, [error, dispatch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationErrors({});

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

    dispatch(addNewAuthorizedBuyer(formData));
  };

  const handleRemoveBuyer = (buyerId: string, buyerName: string) => {
    if (confirm(`Are you sure you want to remove ${buyerName} as an authorized buyer?`)) {
      dispatch(removeAuthorizedBuyer(buyerId));
    }
  };

  if (!isBusinessOwner || !isApproved) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-5">
        <p className="text-yellow-800 font-medium">
          Only approved business account owners can manage authorized buyers.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-3 p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-semibold text-dark mb-1">Authorized Buyers</h3>
          <p className="text-sm text-gray-5">
            Add team members who can place orders on behalf of your business
          </p>
        </div>
        {!showAddForm && (
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 bg-blue text-white px-4 py-2 rounded-lg hover:bg-dark transition-colors duration-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add Buyer
          </button>
        )}
      </div>

      {showAddForm && (
        <div className="bg-gray-1 rounded-lg p-5 mb-6">
          <h4 className="font-semibold text-dark mb-4">Add New Authorized Buyer</h4>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="buyer_name" className="block mb-2 text-sm font-medium">
                  Full Name <span className="text-red">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  id="buyer_name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter buyer's full name"
                  className={`rounded-lg border ${
                    validationErrors.name ? 'border-red' : 'border-gray-3'
                  } bg-white placeholder:text-dark-5 w-full py-2.5 px-4 outline-none duration-200 focus:border-blue focus:ring-2 focus:ring-blue/20`}
                />
                {validationErrors.name && (
                  <p className="text-red text-sm mt-1">{validationErrors.name[0]}</p>
                )}
              </div>

              <div>
                <label htmlFor="buyer_email" className="block mb-2 text-sm font-medium">
                  Email Address <span className="text-red">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  id="buyer_email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="buyer@company.com"
                  className={`rounded-lg border ${
                    validationErrors.email ? 'border-red' : 'border-gray-3'
                  } bg-white placeholder:text-dark-5 w-full py-2.5 px-4 outline-none duration-200 focus:border-blue focus:ring-2 focus:ring-blue/20`}
                />
                {validationErrors.email && (
                  <p className="text-red text-sm mt-1">{validationErrors.email[0]}</p>
                )}
              </div>

              <div>
                <label htmlFor="buyer_password" className="block mb-2 text-sm font-medium">
                  Password <span className="text-red">*</span>
                </label>
                <input
                  type="password"
                  name="password"
                  id="buyer_password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Min 8 characters"
                  autoComplete="new-password"
                  className={`rounded-lg border ${
                    validationErrors.password ? 'border-red' : 'border-gray-3'
                  } bg-white placeholder:text-dark-5 w-full py-2.5 px-4 outline-none duration-200 focus:border-blue focus:ring-2 focus:ring-blue/20`}
                />
                {validationErrors.password && (
                  <p className="text-red text-sm mt-1">{validationErrors.password[0]}</p>
                )}
              </div>

              <div>
                <label htmlFor="buyer_password_confirmation" className="block mb-2 text-sm font-medium">
                  Confirm Password <span className="text-red">*</span>
                </label>
                <input
                  type="password"
                  name="password_confirmation"
                  id="buyer_password_confirmation"
                  value={formData.password_confirmation}
                  onChange={handleChange}
                  placeholder="Re-enter password"
                  autoComplete="new-password"
                  className={`rounded-lg border ${
                    validationErrors.password_confirmation ? 'border-red' : 'border-gray-3'
                  } bg-white placeholder:text-dark-5 w-full py-2.5 px-4 outline-none duration-200 focus:border-blue focus:ring-2 focus:ring-blue/20`}
                />
                {validationErrors.password_confirmation && (
                  <p className="text-red text-sm mt-1">{validationErrors.password_confirmation[0]}</p>
                )}
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  setFormData({ name: "", email: "", password: "", password_confirmation: "" });
                  setValidationErrors({});
                }}
                className="px-5 py-2.5 bg-gray-2 text-dark rounded-lg hover:bg-gray-3 transition-colors duration-200 font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-5 py-2.5 bg-blue text-white rounded-lg hover:bg-dark transition-colors duration-200 font-medium disabled:opacity-50"
              >
                {isLoading ? "Adding..." : "Add Buyer"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Buyers List */}
      <div className="space-y-3">
        {isLoading && buyers.length === 0 ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue"></div>
            <p className="mt-3 text-gray-5">Loading authorized buyers...</p>
          </div>
        ) : buyers.length === 0 ? (
          <div className="text-center py-8 bg-gray-1 rounded-lg">
            <svg className="w-12 h-12 mx-auto text-gray-4 mb-3" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
            </svg>
            <p className="text-gray-5 font-medium">No authorized buyers yet</p>
            <p className="text-sm text-gray-5 mt-1">Add team members to help manage orders</p>
          </div>
        ) : (
          buyers.map(buyer => (
            <div
              key={buyer.id}
              className="flex items-center justify-between p-4 bg-gray-1 rounded-lg hover:bg-gray-2 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue/10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-dark">{buyer.name}</p>
                  <p className="text-sm text-gray-5">{buyer.email}</p>
                </div>
              </div>
              <button
                onClick={() => handleRemoveBuyer(buyer.id, buyer.name)}
                disabled={isLoading}
                className="text-red hover:bg-red/10 p-2 rounded-lg transition-colors duration-200 disabled:opacity-50"
                title="Remove buyer"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AuthorizedBuyersManager;
