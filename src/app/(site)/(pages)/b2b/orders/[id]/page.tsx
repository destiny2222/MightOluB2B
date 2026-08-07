"use client";

import React, { useEffect, useState } from "react";
import Breadcrumb from "@/components/Common/Breadcrumb";
import { useSelector, useDispatch } from "react-redux";
import { selectCurrentView, selectHasB2BAccess } from "@/redux/features/auth-slice";
import { 
  fetchB2BOrderDetails, 
  setupRecurringOrder,
  selectB2BCurrentOrder,
  selectB2BOrderDetailsStatus,
  selectB2BRecurringStatus,
  clearCurrentOrder
} from "@/redux/features/b2b-orders-slice";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { AppDispatch } from "@/redux/store";

const OrderDetailPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  
  const currentView = useSelector(selectCurrentView);
  const hasB2BAccess = useSelector(selectHasB2BAccess);
  const isB2B = hasB2BAccess && currentView === 'business';

  const order = useSelector(selectB2BCurrentOrder);
  const detailsStatus = useSelector(selectB2BOrderDetailsStatus);
  const recurringStatus = useSelector(selectB2BRecurringStatus);
  
  const loading = detailsStatus === 'loading' || detailsStatus === 'idle';
  
  // Recurring Schedule State
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [frequency, setFrequency] = useState('weekly');
  const isScheduling = recurringStatus === 'scheduling';

  useEffect(() => {
    if (isB2B && id) {
      dispatch(fetchB2BOrderDetails(id as string))
        .unwrap()
        .catch((err) => {
          toast.error(err || "Failed to load order details");
          router.push("/b2b/orders");
        });
    }
    
    return () => {
      dispatch(clearCurrentOrder());
    };
  }, [isB2B, id, dispatch, router]);

  const handleSetupRecurring = async () => {
    if (!id) return;
    
    try {
      await dispatch(setupRecurringOrder({ id: id as string, frequency })).unwrap();
      toast.success(`Recurring order scheduled ${frequency}!`);
      setShowScheduleModal(false);
      // It optimistically updates or you could re-fetch:
      // dispatch(fetchB2BOrderDetails(id as string));
    } catch (err: any) {
      toast.error(err || "Failed to setup schedule");
    }
  };

  const getStatusStep = (status: string) => {
    const s = (status || "").toLowerCase().trim();
    if (s === 'submitted' || s === 'pending') return 0;
    if (s === 'processing' || s === 'approved') return 1;
    if (s === 'dispatched' || s === 'shipped') return 2;
    if (s === 'delivered' || s === 'completed') return 3;
    return 0;
  };

  if (!isB2B) {
    return (
      <main>
        <Breadcrumb title="Order Details" pages={["Home", "Order"]} />
        <div className="max-w-[1170px] mx-auto px-4 sm:px-8 xl:px-0 py-10">
          <p className="text-center text-red">You must be logged into an approved Business Account to view this page.</p>
        </div>
      </main>
    );
  }

  if (loading) {
    return <div className="py-20 text-center text-dark font-medium">Loading order details...</div>;
  }

  if (!order) {
    return <div className="py-20 text-center text-dark font-medium">Order not found.</div>;
  }

  const currentStep = getStatusStep(order.status);
  const statusSteps = [
    { title: "Submitted", desc: "Order placed & received" },
    { title: "Processing", desc: "Warehouse packing" },
    { title: "Dispatched", desc: "Out for delivery" },
    { title: "Delivered", desc: "Fulfilled & completed" }
  ];

  return (
    <main>
      <Breadcrumb title={`Order: ${order.internal_reference}`} pages={["Home", "Business to Business", "Orders", order.internal_reference]} />

      <section className="pb-20 pt-10 bg-gray-2/50 min-h-screen">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          
          {/* Header Section */}
          <div className="bg-white p-6 md:p-8 rounded-[12px] shadow-1 mb-6 flex flex-col md:flex-row justify-between items-start md:items-center border border-gray-3/60">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold text-dark">Purchase Order Details</h2>
                <span className={`px-3 py-1 text-xs font-semibold rounded-full capitalize ${
                  order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                  order.status === 'dispatched' ? 'bg-purple/10 text-purple' :
                  order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-blue/10 text-blue'
                }`}>
                  {order.status}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-sm text-gray-5">
                <span>Ref: <strong className="text-dark">{order.internal_reference}</strong></span>
                {order.po_number && (
                  <>
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-4"></span>
                    <span>PO Number: <strong className="text-dark">{order.po_number}</strong></span>
                  </>
                )}
                <span className="w-1.5 h-1.5 rounded-full bg-gray-4"></span>
                <span>Date: <strong className="text-dark">{new Date(order.created_at).toLocaleDateString()}</strong></span>
              </div>
            </div>
            
            <div className="mt-4 md:mt-0 flex items-center gap-3">
              {order.is_recurring ? (
                <span className="bg-green-100 text-green-800 px-3.5 py-2 rounded-full text-xs font-bold uppercase flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Recurring Active
                </span>
              ) : (
                <button 
                  onClick={() => setShowScheduleModal(true)}
                  className="bg-white border border-gray-3 text-dark px-4 py-2.5 rounded-lg font-medium hover:bg-gray-1 transition text-sm flex items-center gap-2 shadow-xs"
                >
                  <svg className="w-4 h-4 text-blue" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Setup Recurring
                </button>
              )}
            </div>
          </div>

          {/* Status Tracker */}
          <div className="bg-white p-6 md:p-8 rounded-[12px] shadow-1 mb-6 border border-gray-3/60">
            <h3 className="font-bold text-dark text-lg mb-6">Tracking Order Progress</h3>
            
            <div className="relative py-4 px-2 sm:px-6">
              {/* Progress Line Background */}
              <div className="absolute top-1/2 left-8 right-8 -translate-y-1/2 h-1.5 bg-gray-2 rounded-full z-0 hidden sm:block"></div>
              {/* Progress Active Line */}
              <div 
                className="absolute top-1/2 left-8 -translate-y-1/2 h-1.5 bg-blue transition-all duration-500 rounded-full z-0 hidden sm:block" 
                style={{ width: `calc(${(currentStep / 3) * 100}% - 4rem)` }}
              ></div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 relative z-10">
                {statusSteps.map((step, idx) => {
                  const isCompleted = currentStep > idx;
                  const isCurrent = currentStep === idx;
                  return (
                    <div key={idx} className="flex sm:flex-col items-center sm:text-center gap-4 sm:gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all shadow-sm shrink-0 ${
                        isCompleted
                          ? "bg-blue text-white"
                          : isCurrent
                          ? "bg-blue text-white ring-4 ring-blue/20"
                          : "bg-gray-2 text-gray-5 border border-gray-3"
                      }`}>
                        {isCompleted ? (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          idx + 1
                        )}
                      </div>
                      <div>
                        <p className={`font-semibold text-sm ${isCurrent || isCompleted ? "text-dark" : "text-gray-5"}`}>
                          {step.title}
                        </p>
                        <p className="text-xs text-gray-5 hidden sm:block mt-0.5">{step.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Column: Items */}
            <div className="lg:col-span-2">
              <div className="bg-white p-6 md:p-8 rounded-[12px] shadow-1 border border-gray-3/60">
                <h3 className="text-xl font-bold text-dark mb-6 border-b border-gray-3 pb-3">Order Items</h3>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-gray-1 border-y border-gray-3 text-xs uppercase font-semibold text-gray-6">
                        <th className="py-3.5 px-4">Product</th>
                        <th className="py-3.5 px-4 text-center">Quantity</th>
                        <th className="py-3.5 px-4 text-right">Unit Price</th>
                        <th className="py-3.5 px-4 text-right">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.items && order.items.map((item: any) => (
                        <tr key={item.id} className="border-b border-gray-3 hover:bg-gray-1/40 transition">
                          <td className="py-4 px-4 font-medium text-dark">{item.product?.title || item.product?.name || `Product #${item.product_id}`}</td>
                          <td className="py-4 px-4 text-center text-dark font-medium">{item.quantity}</td>
                          <td className="py-4 px-4 text-right text-gray-6">£{Number(item.unit_price || 0).toFixed(2)}</td>
                          <td className="py-4 px-4 text-right font-bold text-dark">£{(item.quantity * (item.unit_price || 0)).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colSpan={3} className="py-4 px-4 text-right font-bold text-dark text-lg border-t border-gray-3">Total Amount:</td>
                        <td className="py-4 px-4 text-right font-bold text-blue text-xl border-t border-gray-3">£{Number(order.total_amount || 0).toFixed(2)}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>

            {/* Right Column: Order Info */}
            <div className="lg:col-span-1 flex flex-col gap-6">
              
              <div className="bg-white p-6 rounded-[12px] shadow-1 border border-gray-3/60">
                <h3 className="text-lg font-bold text-dark mb-4 border-b border-gray-3 pb-3">Payment & Customer Info</h3>
                <div className="flex flex-col gap-4">
                  <div>
                    <span className="block text-xs uppercase font-bold text-gray-5 mb-1">Payment Method</span>
                    {order.payment_method === 'on_account' ? (
                      <span className="text-dark font-medium flex items-center gap-2">
                        <svg className="w-5 h-5 text-blue shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        Pay on Account (Terms)
                      </span>
                    ) : (
                      <span className="text-dark font-medium flex items-center gap-2">
                        <svg className="w-5 h-5 text-gray-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                        Card Payment
                      </span>
                    )}
                  </div>
                  <div>
                    <span className="block text-xs uppercase font-bold text-gray-5 mb-1">Ordered By</span>
                    <span className="text-dark font-medium">{order.user?.name || 'Authorized Buyer'}</span>
                  </div>
                </div>
              </div>

              {(order.address || order.city || order.country) && (
                <div className="bg-white p-6 rounded-[12px] shadow-1 border border-gray-3/60">
                  <h3 className="text-lg font-bold text-dark mb-4 border-b border-gray-3 pb-3">Shipping Destination</h3>
                  <p className="text-sm text-dark font-medium leading-relaxed">
                    {order.address && <span>{order.address}<br /></span>}
                    {order.city && <span>{order.city}{order.state ? `, ${order.state}` : ''} {order.postal_code}<br /></span>}
                    {order.country && <span>{order.country}</span>}
                  </p>
                </div>
              )}

            </div>
          </div>
        </div>
      </section>

      {/* Setup Recurring Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-[9999] bg-dark/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-[10px] max-w-md w-full p-6 shadow-2xl relative">
            <button 
              onClick={() => setShowScheduleModal(false)}
              className="absolute top-4 right-4 text-gray-5 hover:text-dark transition"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <h3 className="text-xl font-bold text-dark mb-2">Setup Recurring Order</h3>
            <p className="text-gray-5 text-sm mb-6">
              This will automatically generate a draft order with these exact items on your chosen schedule. You will be able to review and approve it before it is submitted.
            </p>
            
            <div className="mb-6">
              <label className="block text-dark font-medium mb-2 text-sm">Frequency</label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                className="w-full border border-gray-3 rounded px-4 py-3 bg-white focus:border-blue outline-none"
              >
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
            
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setShowScheduleModal(false)}
                className="px-5 py-2 rounded border border-gray-3 text-dark font-medium hover:bg-gray-1 transition"
              >
                Cancel
              </button>
              <button 
                onClick={handleSetupRecurring}
                disabled={isScheduling}
                className="px-5 py-2 rounded text-white font-bold transition bg-blue hover:bg-blue-dark disabled:opacity-50"
              >
                {isScheduling ? 'Saving...' : 'Save Schedule'}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default OrderDetailPage;
