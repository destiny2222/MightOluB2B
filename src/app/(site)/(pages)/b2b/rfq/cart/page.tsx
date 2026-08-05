"use client";

import React, { useState } from "react";
import Breadcrumb from "@/components/Common/Breadcrumb";
import { useSelector } from "react-redux";
import { selectCurrentView, selectHasB2BAccess } from "@/redux/features/auth-slice";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const RfqCartPage = () => {
  const router = useRouter();
  const currentView = useSelector(selectCurrentView);
  const hasB2BAccess = useSelector(selectHasB2BAccess);
  const isB2B = hasB2BAccess && currentView === 'business';

  // In a real implementation, this would be fetched from a Redux state or local storage for the RFQ cart
  const [rfqItems, setRfqItems] = useState([
    // Mock data for demo purposes, since phase 1 we might not have a fully persistent RFQ cart backend
    { id: 1, product_id: 1, title: "Desktop Computer Model X", quantity: 50 },
    { id: 2, product_id: 2, title: "Office Chair Ergonomic", quantity: 100 },
  ]);

  const [deliveryFrequency, setDeliveryFrequency] = useState("one-off");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isB2B) {
    return (
      <main>
        <Breadcrumb title="Request for Quotation" pages={["Home", "RFQ"]} />
        <div className="max-w-[1170px] mx-auto px-4 sm:px-8 xl:px-0 py-10">
          <p className="text-center text-red">You must be logged into an approved Business Account to view this page.</p>
        </div>
      </main>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rfqItems.length === 0) {
      toast.error("Your RFQ list is empty.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_LARAVEL_URL}/api/v1/b2b/rfq`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          items: rfqItems.map(item => ({ product_id: item.product_id, quantity: item.quantity })),
          delivery_frequency: deliveryFrequency,
          notes: notes,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        toast.success("RFQ submitted successfully!");
        // Clear RFQ Cart (mocked here)
        setRfqItems([]);
        router.push(`/b2b/rfq/success?ref=${data.rfq.reference_number}`);
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to submit RFQ");
      }
    } catch (error) {
      toast.error("An error occurred while submitting RFQ");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main>
      <Breadcrumb title="Request for Quotation" pages={["Home", "B2B", "RFQ"]} />

      <section className="pb-20 pt-10">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="bg-white p-8 rounded-[10px] shadow-1">
            <h2 className="text-2xl font-bold text-dark mb-6">Your Request for Quotation</h2>
            
            {rfqItems.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-gray-500 mb-4">You have not added any items to your RFQ list.</p>
                <button 
                  onClick={() => router.push('/product')}
                  className="bg-blue text-white px-6 py-2 rounded font-medium hover:bg-blue-dark transition"
                >
                  Browse Products
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-gray-3">
                        <th className="py-4 px-4 font-semibold text-dark">Product</th>
                        <th className="py-4 px-4 font-semibold text-dark">Quantity</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rfqItems.map((item, index) => (
                        <tr key={index} className="border-b border-gray-3">
                          <td className="py-4 px-4 text-dark font-medium">{item.title}</td>
                          <td className="py-4 px-4">
                            <input 
                              type="number" 
                              min="1"
                              value={item.quantity}
                              onChange={(e) => {
                                const newItems = [...rfqItems];
                                newItems[index].quantity = parseInt(e.target.value) || 1;
                                setRfqItems(newItems);
                              }}
                              className="w-20 border border-gray-3 rounded px-2 py-1 text-center"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-dark font-semibold mb-2">Delivery Frequency (Optional)</label>
                    <select 
                      value={deliveryFrequency}
                      onChange={(e) => setDeliveryFrequency(e.target.value)}
                      className="w-full border border-gray-3 rounded px-4 py-2 bg-gray-1 focus:border-blue focus:outline-none"
                    >
                      <option value="one-off">One-off delivery</option>
                      <option value="weekly">Weekly delivery</option>
                      <option value="monthly">Monthly delivery</option>
                    </select>
                    <p className="text-sm text-gray-5 mt-2">Useful for recurring bulk orders.</p>
                  </div>

                  <div>
                    <label className="block text-dark font-semibold mb-2">Additional Notes</label>
                    <textarea 
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="e.g. Special packaging required, delivery constraints, target price..."
                      className="w-full border border-gray-3 rounded px-4 py-2 bg-gray-1 h-32 focus:border-blue focus:outline-none resize-none"
                    ></textarea>
                  </div>
                </div>

                <div className="mt-8 flex justify-end">
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-dark text-white px-8 py-3 rounded font-bold hover:bg-dark/90 transition disabled:opacity-70"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Request for Quotation'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>
    </main>
  );
};

export default RfqCartPage;
