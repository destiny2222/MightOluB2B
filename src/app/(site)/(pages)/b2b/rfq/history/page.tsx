"use client";

import React, { useEffect, useState } from "react";
import Breadcrumb from "@/components/Common/Breadcrumb";
import { useSelector } from "react-redux";
import { selectCurrentView, selectHasB2BAccess } from "@/redux/features/auth-slice";
import Link from "next/link";

const RfqHistoryPage = () => {
  const currentView = useSelector(selectCurrentView);
  const hasB2BAccess = useSelector(selectHasB2BAccess);
  const isB2B = hasB2BAccess && currentView === 'business';

  const [rfqs, setRfqs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isB2B) {
      fetchRfqs();
    } else {
      setLoading(false);
    }
  }, [isB2B]);

  const fetchRfqs = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_LARAVEL_URL}/api/v1/b2b/rfq`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        }
      });
      if (response.ok) {
        const data = await response.json();
        setRfqs(data.rfqs);
      }
    } catch (error) {
      console.error("Failed to fetch RFQs", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Pending':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">Pending</span>;
      case 'Quoted':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-blue text-white">Quoted</span>;
      case 'Accepted':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Accepted</span>;
      case 'Declined':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-red/10 text-red">Declined</span>;
      case 'Expired':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-gray-3 text-gray-600">Expired</span>;
      default:
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-gray-2 text-dark">{status}</span>;
    }
  };

  if (!isB2B) {
    return (
      <main>
        <Breadcrumb title="RFQ History" pages={["Home", "RFQ History"]} />
        <div className="max-w-[1170px] mx-auto px-4 sm:px-8 xl:px-0 py-10">
          <p className="text-center text-red">You must be logged into an approved Business Account to view this page.</p>
        </div>
      </main>
    );
  }

  return (
    <main>
      <Breadcrumb title="RFQ History" pages={["Home", "B2B", "RFQ History"]} />

      <section className="pb-20 pt-10">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="bg-white p-8 rounded-[10px] shadow-1">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-dark">RFQ History</h2>
              <Link 
                href="/b2b/rfq/cart"
                className="bg-dark text-white px-5 py-2 rounded font-medium hover:bg-dark/90 transition text-sm"
              >
                Create New RFQ
              </Link>
            </div>

            {loading ? (
              <div className="py-10 text-center text-gray-5">Loading RFQs...</div>
            ) : rfqs.length === 0 ? (
              <div className="py-12 text-center bg-gray-1 rounded-lg border border-gray-3">
                <svg className="w-12 h-12 text-gray-4 mx-auto mb-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="text-lg font-bold text-dark mb-2">No Quotation Requests Found</h3>
                <p className="text-gray-5 mb-6">You have not submitted any Requests for Quotation yet.</p>
                <Link 
                  href="/product"
                  className="bg-blue text-white px-6 py-2 rounded font-medium hover:bg-blue-dark transition"
                >
                  Browse Products
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse whitespace-nowrap">
                  <thead>
                    <tr className="bg-gray-1 border-y border-gray-3">
                      <th className="py-3 px-4 font-semibold text-dark">Reference #</th>
                      <th className="py-3 px-4 font-semibold text-dark">Date Submitted</th>
                      <th className="py-3 px-4 font-semibold text-dark">Items</th>
                      <th className="py-3 px-4 font-semibold text-dark">Status</th>
                      <th className="py-3 px-4 font-semibold text-dark">Total</th>
                      <th className="py-3 px-4 font-semibold text-dark text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rfqs.map((rfq) => (
                      <tr key={rfq.id} className="border-b border-gray-3 hover:bg-gray-1/50 transition">
                        <td className="py-4 px-4 font-medium text-dark">{rfq.reference_number}</td>
                        <td className="py-4 px-4 text-gray-600">
                          {new Date(rfq.created_at).toLocaleDateString()}
                        </td>
                        <td className="py-4 px-4 text-gray-600">
                          {rfq.items ? rfq.items.length : 0} items
                        </td>
                        <td className="py-4 px-4">
                          {getStatusBadge(rfq.status)}
                        </td>
                        <td className="py-4 px-4 font-medium text-dark">
                          {rfq.total_amount ? `$${Number(rfq.total_amount).toFixed(2)}` : '-'}
                        </td>
                        <td className="py-4 px-4 text-right">
                          <Link 
                            href={`/b2b/rfq/${rfq.id}`}
                            className="text-blue font-medium hover:underline"
                          >
                            View Details
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

export default RfqHistoryPage;
