"use client";

import React, { useEffect, useState } from "react";
import Breadcrumb from "@/components/Common/Breadcrumb";
import { useSelector } from "react-redux";
import { selectCurrentView, selectHasB2BAccess } from "@/redux/features/auth-slice";
import Link from "next/link";
import { toast } from "react-toastify";

const OrdersHistoryPage = () => {
  const currentView = useSelector(selectCurrentView);
  const hasB2BAccess = useSelector(selectHasB2BAccess);
  const isB2B = hasB2BAccess && currentView === 'business';

  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isB2B) {
      fetchOrders();
    } else {
      setLoading(false);
    }
  }, [isB2B]);

  const fetchOrders = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_LARAVEL_URL}/api/v1/b2b/orders`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        }
      });
      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders);
      }
    } catch (error) {
      console.error("Failed to fetch orders", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReorder = async (orderId: string) => {
    // In a real app, this would fetch the latest prices for items in the PO
    // and add them to the cart state.
    toast.success("Items added to cart at current trade pricing!");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Submitted':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-blue/10 text-blue">Submitted</span>;
      case 'Processing':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">Processing</span>;
      case 'Dispatched':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-purple text-white">Dispatched</span>;
      case 'Delivered':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Delivered</span>;
      case 'Invoiced':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-dark text-white">Invoiced</span>;
      default:
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-gray-2 text-dark">{status}</span>;
    }
  };

  if (!isB2B) {
    return (
      <main>
        <Breadcrumb title="Order History" pages={["Home", "Order History"]} />
        <div className="max-w-[1170px] mx-auto px-4 sm:px-8 xl:px-0 py-10">
          <p className="text-center text-red">You must be logged into an approved Business Account to view this page.</p>
        </div>
      </main>
    );
  }

  return (
    <main>
      <Breadcrumb title="Purchase Orders" pages={["Home", "B2B", "Orders"]} />

      <section className="pb-20 pt-10">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="bg-white p-8 rounded-[10px] shadow-1">
            <div className="flex justify-between items-center mb-6 border-b border-gray-3 pb-4">
              <h2 className="text-2xl font-bold text-dark">Purchase Order History</h2>
              <div className="flex gap-3">
                <Link 
                  href="/b2b/orders/drafts"
                  className="bg-white border border-gray-3 text-dark px-4 py-2 rounded font-medium hover:bg-gray-1 transition text-sm flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Scheduled Drafts
                </Link>
                <Link 
                  href="/product"
                  className="bg-dark text-white px-5 py-2 rounded font-medium hover:bg-dark/90 transition text-sm"
                >
                  New Order
                </Link>
              </div>
            </div>

            {loading ? (
              <div className="py-10 text-center text-gray-5">Loading Orders...</div>
            ) : orders.length === 0 ? (
              <div className="py-12 text-center bg-gray-1 rounded-lg border border-gray-3">
                <svg className="w-12 h-12 text-gray-4 mx-auto mb-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <h3 className="text-lg font-bold text-dark mb-2">No Purchase Orders Found</h3>
                <p className="text-gray-5 mb-6">You have not submitted any business orders yet.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse whitespace-nowrap">
                  <thead>
                    <tr className="bg-gray-1 border-y border-gray-3">
                      <th className="py-3 px-4 font-semibold text-dark">Order Ref</th>
                      <th className="py-3 px-4 font-semibold text-dark">PO Number</th>
                      <th className="py-3 px-4 font-semibold text-dark">Date</th>
                      <th className="py-3 px-4 font-semibold text-dark">Payment</th>
                      <th className="py-3 px-4 font-semibold text-dark">Total</th>
                      <th className="py-3 px-4 font-semibold text-dark">Status</th>
                      <th className="py-3 px-4 font-semibold text-dark text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id} className="border-b border-gray-3 hover:bg-gray-1/50 transition">
                        <td className="py-4 px-4 font-medium text-dark">{order.internal_reference}</td>
                        <td className="py-4 px-4 text-gray-600">{order.po_number || '-'}</td>
                        <td className="py-4 px-4 text-gray-600">
                          {new Date(order.created_at).toLocaleDateString()}
                        </td>
                        <td className="py-4 px-4">
                          {order.payment_method === 'on_account' ? (
                            <span className="flex items-center gap-1 text-sm text-blue font-medium">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                              Account
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-sm text-gray-600">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                              Card
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-4 font-medium text-dark">
                          ${Number(order.total_amount).toFixed(2)}
                        </td>
                        <td className="py-4 px-4">
                          {getStatusBadge(order.status)}
                        </td>
                        <td className="py-4 px-4 text-right flex items-center justify-end gap-3">
                          <button 
                            onClick={() => handleReorder(order.id)}
                            className="text-sm font-medium text-blue hover:underline flex items-center gap-1"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Reorder
                          </button>
                          <span className="text-gray-3">|</span>
                          <Link 
                            href={`/b2b/orders/${order.id}`}
                            className="text-sm font-medium text-dark hover:underline"
                          >
                            View
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
};

export default OrdersHistoryPage;
