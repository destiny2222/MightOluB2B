"use client";

import React, { useEffect, useState } from "react";
import Breadcrumb from "@/components/Common/Breadcrumb";
import { useSelector } from "react-redux";
import { selectCurrentView, selectHasB2BAccess } from "@/redux/features/auth-slice";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";

const RfqDetailPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const currentView = useSelector(selectCurrentView);
  const hasB2BAccess = useSelector(selectHasB2BAccess);
  const isB2B = hasB2BAccess && currentView === 'business';

  const [rfq, setRfq] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Status Update State
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [actionType, setActionType] = useState<'accept' | 'decline' | 'request_changes' | null>(null);
  const [comment, setComment] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (isB2B && id) {
      fetchRfqDetails();
    } else {
      setLoading(false);
    }
  }, [isB2B, id]);

  const fetchRfqDetails = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_LARAVEL_URL}/api/v1/b2b/rfq/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        }
      });
      if (response.ok) {
        const data = await response.json();
        setRfq(data.rfq);
      } else {
        toast.error("Failed to load RFQ details");
        router.push("/b2b/rfq/history");
      }
    } catch (error) {
      console.error("Failed to fetch RFQ details", error);
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    if (!actionType) return;
    
    if (actionType === 'request_changes' && !comment.trim()) {
      toast.error("Please provide a comment detailing the requested changes.");
      return;
    }

    setIsUpdating(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_LARAVEL_URL}/api/v1/b2b/rfq/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          action: actionType,
          comment: comment
        })
      });

      if (response.ok) {
        const data = await response.json();
        toast.success(data.message || "RFQ updated successfully");
        setRfq(data.rfq);
        setShowCommentModal(false);
        setComment("");
        setActionType(null);
      } else {
        const err = await response.json();
        toast.error(err.message || "Failed to update RFQ");
      }
    } catch (error) {
      toast.error("An error occurred while updating RFQ status");
    } finally {
      setIsUpdating(false);
    }
  };

  const openModal = (type: 'accept' | 'decline' | 'request_changes') => {
    setActionType(type);
    if (type === 'accept') {
      // Direct accept, or show confirmation modal
      if (window.confirm("Are you sure you want to accept this quote? This may generate a Purchase Order.")) {
        handleStatusUpdate(); // Call directly for accept
      }
    } else {
      setShowCommentModal(true);
    }
  };

  if (!isB2B) {
    return (
      <main>
        <Breadcrumb title="RFQ Details" pages={["Home", "RFQ"]} />
        <div className="max-w-[1170px] mx-auto px-4 sm:px-8 xl:px-0 py-10">
          <p className="text-center text-red">You must be logged into an approved Business Account to view this page.</p>
        </div>
      </main>
    );
  }

  if (loading) {
    return <div className="py-20 text-center">Loading...</div>;
  }

  if (!rfq) {
    return <div className="py-20 text-center">RFQ not found.</div>;
  }

  return (
    <main>
      <Breadcrumb title={`RFQ: ${rfq.reference_number}`} pages={["Home", "B2B", "RFQ", rfq.reference_number]} />

      <section className="pb-20 pt-10">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          
          {/* Header Section */}
          <div className="bg-white p-6 md:p-8 rounded-[10px] shadow-1 mb-6 flex flex-col md:flex-row justify-between items-start md:items-center border-l-4 border-blue">
            <div>
              <h2 className="text-2xl font-bold text-dark mb-2">Request Details</h2>
              <p className="text-gray-5 flex items-center gap-2">
                Reference: <span className="font-bold text-dark">{rfq.reference_number}</span>
                <span className="w-1 h-1 rounded-full bg-gray-4 mx-2"></span>
                Submitted on: {new Date(rfq.created_at).toLocaleDateString()}
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <span className={`px-4 py-1.5 text-sm font-bold rounded-full uppercase tracking-wide
                ${rfq.status === 'Quoted' ? 'bg-blue text-white' : 
                  rfq.status === 'Accepted' ? 'bg-green-100 text-green-800' :
                  rfq.status === 'Declined' ? 'bg-red text-white' :
                  rfq.status === 'Expired' ? 'bg-gray-3 text-gray-700' :
                  'bg-yellow-100 text-yellow-800'}`}
              >
                {rfq.status}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Column: Items */}
            <div className="lg:col-span-2">
              <div className="bg-white p-6 md:p-8 rounded-[10px] shadow-1">
                <h3 className="text-xl font-bold text-dark mb-6 border-b border-gray-3 pb-3">Requested Items</h3>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-gray-1 border-y border-gray-3">
                        <th className="py-3 px-4 font-semibold text-dark">Product</th>
                        <th className="py-3 px-4 font-semibold text-dark text-center">Quantity</th>
                        {rfq.status === 'Quoted' || rfq.status === 'Accepted' ? (
                          <>
                            <th className="py-3 px-4 font-semibold text-dark text-right">Unit Price</th>
                            <th className="py-3 px-4 font-semibold text-dark text-right">Subtotal</th>
                          </>
                        ) : null}
                      </tr>
                    </thead>
                    <tbody>
                      {rfq.items && rfq.items.map((item: any) => (
                        <tr key={item.id} className="border-b border-gray-3">
                          <td className="py-4 px-4 font-medium text-dark">{item.product?.name || `Product #${item.product_id}`}</td>
                          <td className="py-4 px-4 text-center">{item.quantity}</td>
                          {rfq.status === 'Quoted' || rfq.status === 'Accepted' ? (
                            <>
                              <td className="py-4 px-4 text-right">${Number(item.unit_price || 0).toFixed(2)}</td>
                              <td className="py-4 px-4 text-right font-semibold text-dark">${(item.quantity * (item.unit_price || 0)).toFixed(2)}</td>
                            </>
                          ) : null}
                        </tr>
                      ))}
                    </tbody>
                    {(rfq.status === 'Quoted' || rfq.status === 'Accepted') && (
                      <tfoot>
                        <tr>
                          <td colSpan={3} className="py-4 px-4 text-right font-bold text-dark text-lg">Total Amount:</td>
                          <td className="py-4 px-4 text-right font-bold text-blue text-xl">${Number(rfq.total_amount || 0).toFixed(2)}</td>
                        </tr>
                      </tfoot>
                    )}
                  </table>
                </div>
              </div>
            </div>

            {/* Right Column: Terms & Actions */}
            <div className="lg:col-span-1 flex flex-col gap-6">
              
              {/* Quote Terms (if quoted) */}
              {(rfq.status === 'Quoted' || rfq.status === 'Accepted') && (
                <div className="bg-white p-6 rounded-[10px] shadow-1 border border-blue/20">
                  <h3 className="text-lg font-bold text-dark mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-blue" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Quotation Details
                  </h3>
                  
                  <div className="flex flex-col gap-4">
                    {rfq.valid_until && (
                      <div>
                        <span className="block text-xs uppercase font-bold text-gray-5 mb-1">Valid Until</span>
                        <span className={`font-semibold ${new Date(rfq.valid_until) < new Date() ? 'text-red' : 'text-dark'}`}>
                          {new Date(rfq.valid_until).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                    
                    {rfq.terms && (
                      <div>
                        <span className="block text-xs uppercase font-bold text-gray-5 mb-1">Terms & Conditions</span>
                        <p className="text-sm text-gray-600 bg-gray-1 p-3 rounded italic">{rfq.terms}</p>
                      </div>
                    )}
                  </div>

                  {/* Actions for Quoted RFQ */}
                  {rfq.status === 'Quoted' && (
                    <div className="mt-6 flex flex-col gap-3 border-t border-gray-3 pt-6">
                      <button 
                        onClick={() => openModal('accept')}
                        className="w-full bg-blue text-white py-2.5 rounded font-bold hover:bg-blue-dark transition shadow-sm"
                      >
                        Accept Quote & Proceed
                      </button>
                      <button 
                        onClick={() => openModal('request_changes')}
                        className="w-full bg-white text-dark border border-gray-3 py-2.5 rounded font-medium hover:bg-gray-1 transition"
                      >
                        Request Changes
                      </button>
                      <button 
                        onClick={() => openModal('decline')}
                        className="w-full text-red hover:underline py-2 text-sm font-medium transition"
                      >
                        Decline Quote
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Initial Request Details */}
              <div className="bg-white p-6 rounded-[10px] shadow-1">
                <h3 className="text-lg font-bold text-dark mb-4">Initial Request</h3>
                <div className="flex flex-col gap-4">
                  <div>
                    <span className="block text-xs uppercase font-bold text-gray-5 mb-1">Delivery Frequency</span>
                    <span className="text-dark capitalize font-medium">{rfq.delivery_frequency || 'One-off'}</span>
                  </div>
                  <div>
                    <span className="block text-xs uppercase font-bold text-gray-5 mb-1">Requested By</span>
                    <span className="text-dark font-medium">{rfq.user?.name || 'Authorized Buyer'}</span>
                  </div>
                  {rfq.notes && (
                    <div>
                      <span className="block text-xs uppercase font-bold text-gray-5 mb-1">Notes</span>
                      <p className="text-sm text-gray-600 bg-gray-1 p-3 rounded">{rfq.notes}</p>
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Comment Modal for Request Changes / Decline */}
      {showCommentModal && (
        <div className="fixed inset-0 z-[9999] bg-dark/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-[10px] max-w-md w-full p-6 shadow-2xl relative">
            <button 
              onClick={() => setShowCommentModal(false)}
              className="absolute top-4 right-4 text-gray-5 hover:text-dark transition"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <h3 className="text-xl font-bold text-dark mb-2">
              {actionType === 'request_changes' ? 'Request Changes to Quote' : 'Decline Quote'}
            </h3>
            <p className="text-gray-5 text-sm mb-4">
              {actionType === 'request_changes' 
                ? 'Please provide details on what you would like changed (e.g. better pricing, different quantities).' 
                : 'Please let us know why you are declining this quote (optional).'}
            </p>
            
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full border border-gray-3 rounded px-4 py-3 bg-gray-1 h-32 focus:border-blue focus:outline-none resize-none mb-4"
              placeholder={actionType === 'request_changes' ? 'Describe requested changes...' : 'Reason for declining...'}
            ></textarea>
            
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setShowCommentModal(false)}
                className="px-5 py-2 rounded border border-gray-3 text-dark font-medium hover:bg-gray-1 transition"
              >
                Cancel
              </button>
              <button 
                onClick={handleStatusUpdate}
                disabled={isUpdating}
                className={`px-5 py-2 rounded text-white font-bold transition ${
                  actionType === 'decline' ? 'bg-red hover:bg-red/90' : 'bg-blue hover:bg-blue-dark'
                }`}
              >
                {isUpdating ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default RfqDetailPage;
