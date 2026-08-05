"use client";

import React, { useEffect, useState } from "react";
import Breadcrumb from "@/components/Common/Breadcrumb";
import { useSelector } from "react-redux";
import { selectCurrentView, selectHasB2BAccess } from "@/redux/features/auth-slice";
import Link from "next/link";
import { toast } from "react-toastify";

const RecurringDraftsPage = () => {
  const currentView = useSelector(selectCurrentView);
  const hasB2BAccess = useSelector(selectHasB2BAccess);
  const isB2B = hasB2BAccess && currentView === 'business';

  const [drafts, setDrafts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isApproving, setIsApproving] = useState<string | null>(null);

  useEffect(() => {
    if (isB2B) {
      fetchDrafts();
    } else {
      setLoading(false);
    }
  }, [isB2B]);

  const fetchDrafts = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_LARAVEL_URL}/api/v1/b2b/orders/drafts`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        }
      });
      if (response.ok) {
        const data = await response.json();
        setDrafts(data.drafts);
      }
    } catch (error) {
      console.error("Failed to fetch drafts", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveDraft = async (id: string) => {
    setIsApproving(id);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_LARAVEL_URL}/api/v1/b2b/orders/${id}/approve`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        }
      });

      if (response.ok) {
        toast.success("Draft approved and order submitted!");
        setDrafts(drafts.filter(d => d.id !== id));
      } else {
        const err = await response.json();
        toast.error(err.message || "Failed to approve draft");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setIsApproving(null);
    }
  };

  if (!isB2B) {
    return (
      <main>
        <Breadcrumb title="Recurring Drafts" pages={["Home", "Orders", "Drafts"]} />
        <div className="max-w-[1170px] mx-auto px-4 sm:px-8 xl:px-0 py-10">
          <p className="text-center text-red">You must be logged into an approved Business Account to view this page.</p>
        </div>
      </main>
    );
  }

  return (
    <main>
      <Breadcrumb title="Recurring Drafts" pages={["Home", "B2B", "Orders", "Drafts"]} />

      <section className="pb-20 pt-10">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="bg-white p-8 rounded-[10px] shadow-1">
            <div className="flex justify-between items-center mb-6 border-b border-gray-3 pb-4">
              <div>
                <h2 className="text-2xl font-bold text-dark">Scheduled Order Drafts</h2>
                <p className="text-sm text-gray-5 mt-1">Review and approve auto-generated drafts from your recurring schedules.</p>
              </div>
              <Link 
                href="/b2b/orders"
                className="bg-gray-1 border border-gray-3 text-dark px-4 py-2 rounded font-medium hover:bg-gray-2 transition text-sm"
              >
                Back to Orders
              </Link>
            </div>

            {loading ? (
              <div className="py-10 text-center text-gray-5">Loading drafts...</div>
            ) : drafts.length === 0 ? (
              <div className="py-12 text-center bg-gray-1 rounded-lg border border-gray-3 border-dashed">
                <svg className="w-12 h-12 text-gray-4 mx-auto mb-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
                <h3 className="text-lg font-bold text-dark mb-2">No Pending Drafts</h3>
                <p className="text-gray-5 mb-6">You don't have any auto-generated drafts waiting for approval.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {drafts.map((draft) => (
                  <div key={draft.id} className="border border-blue/30 rounded-lg p-6 bg-blue/5 relative overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <div className="absolute top-0 right-0 bg-yellow-100 text-yellow-800 text-xs font-bold px-3 py-1 rounded-bl-lg border-b border-l border-yellow-200">
                      ACTION REQUIRED
                    </div>
                    
                    <h3 className="font-bold text-dark text-lg mb-2">Draft: {draft.internal_reference}</h3>
                    
                    <div className="flex flex-col gap-2 mb-4 text-sm">
                      <span className="text-gray-600">Generated On: <strong className="text-dark">{new Date(draft.created_at).toLocaleDateString()}</strong></span>
                      <span className="text-gray-600">Total Items: <strong className="text-dark">{draft.items?.length || 0}</strong></span>
                      <span className="text-gray-600">Total Amount: <strong className="text-blue text-lg">${Number(draft.total_amount).toFixed(2)}</strong></span>
                      <span className="text-gray-600 flex items-center gap-1">
                        Payment: 
                        {draft.payment_method === 'on_account' ? 'Pay on Account' : 'Card'}
                      </span>
                    </div>

                    <div className="bg-white border border-gray-3 rounded p-4 mb-5 max-h-32 overflow-y-auto">
                      <p className="text-xs font-bold text-gray-5 uppercase mb-2 border-b border-gray-2 pb-1">Items Included</p>
                      <ul className="flex flex-col gap-1 text-sm text-dark">
                        {draft.items?.map((item: any) => (
                          <li key={item.id} className="flex justify-between">
                            <span className="truncate pr-2">{item.quantity}x {item.product?.name || `Product #${item.product_id}`}</span>
                            <span className="font-medium whitespace-nowrap">${(item.quantity * item.unit_price).toFixed(2)}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex gap-3">
                      <button 
                        onClick={() => handleApproveDraft(draft.id)}
                        disabled={isApproving === draft.id}
                        className="flex-1 bg-blue text-white py-2 rounded font-medium hover:bg-blue-dark transition disabled:opacity-50"
                      >
                        {isApproving === draft.id ? 'Approving...' : 'Approve & Submit'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
};

export default RecurringDraftsPage;
