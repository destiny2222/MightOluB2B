import React from "react";

const OrderDetails = ({ orderItem }: any) => {
  const displayId = String(orderItem.orderId || orderItem.id || "00000000").slice(-8);
  const rawOrder = orderItem.rawOrder || {};
  const items = rawOrder.items || [];
  const status = (orderItem.status || rawOrder.status || "Submitted").toLowerCase();

  const getStatusStep = (status: string) => {
    const s = (status || "").toLowerCase().trim();
    if (s === 'submitted' || s === 'pending') return 0;
    if (s === 'processing' || s === 'approved') return 1;
    if (s === 'dispatched' || s === 'shipped') return 2;
    if (s === 'delivered' || s === 'completed') return 3;
    return 0;
  };

  const currentStep = getStatusStep(status);
  const statusSteps = ["Submitted", "Processing", "Dispatched", "Delivered"];

  const address = rawOrder.address 
    ? `${rawOrder.address}${rawOrder.city ? `, ${rawOrder.city}` : ''}${rawOrder.state ? `, ${rawOrder.state}` : ''} ${rawOrder.postal_code || ''} ${rawOrder.country || ''}`
    : rawOrder.shipping_address
    ? `${rawOrder.shipping_address.address || ''}, ${rawOrder.shipping_address.city || ''} ${rawOrder.shipping_address.postal_code || ''}`
    : "Standard Direct Shipping Address";

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Header */}
      <div className="border-b border-gray-3 pb-4 pr-12">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-xl font-bold text-dark">
            Order <span className="text-blue">#{displayId}</span>
          </h3>
          <span className={`px-3 py-1 text-xs font-semibold rounded-full capitalize ${
            status === 'delivered' ? 'bg-green-100 text-green-800' :
            status === 'dispatched' ? 'bg-purple/10 text-purple' :
            status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
            'bg-blue/10 text-blue'
          }`}>
            {orderItem.status || "Submitted"}
          </span>
        </div>
        <p className="text-xs text-gray-5 mt-1">
          Placed on: <span className="text-dark font-medium">{orderItem.createdAt}</span>
        </p>
      </div>

      {/* Visual Tracking Progress */}
      <div className="bg-gray-1 p-5 rounded-xl border border-gray-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-dark mb-4">Order Progress</h4>
        <div className="relative flex justify-between items-center">
          {/* Progress background line */}
          <div className="absolute top-1/2 left-4 right-4 -translate-y-1/2 h-1 bg-gray-3 z-0"></div>
          {/* Progress active line */}
          <div 
            className="absolute top-1/2 left-4 -translate-y-1/2 h-1 bg-blue transition-all duration-300 z-0"
            style={{ width: `calc(${(currentStep / 3) * 100}% - 1rem)` }}
          ></div>

          {statusSteps.map((stepTitle, idx) => {
            const isCompleted = currentStep > idx;
            const isCurrent = currentStep === idx;
            return (
              <div key={idx} className="relative z-10 flex flex-col items-center gap-1.5">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition ${
                  isCompleted
                    ? "bg-blue text-white"
                    : isCurrent
                    ? "bg-blue text-white ring-4 ring-blue/20"
                    : "bg-gray-3 text-gray-5"
                }`}>
                  {isCompleted ? (
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    idx + 1
                  )}
                </div>
                <span className={`text-[11px] font-semibold ${isCurrent || isCompleted ? "text-dark" : "text-gray-5"}`}>
                  {stepTitle}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Items List */}
      {items.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-gray-1 border-y border-gray-3 text-xs uppercase font-semibold text-gray-6">
                <th className="py-2.5 px-3">Product</th>
                <th className="py-2.5 px-3 text-center">Qty</th>
                <th className="py-2.5 px-3 text-right">Unit Price</th>
                <th className="py-2.5 px-3 text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item: any, key: number) => (
                <tr key={key} className="border-b border-gray-3">
                  <td className="py-3 px-3 font-medium text-dark">{item.product?.title || item.product?.name || `Item #${item.product_id}`}</td>
                  <td className="py-3 px-3 text-center">{item.quantity}</td>
                  <td className="py-3 px-3 text-right">£{Number(item.unit_price || 0).toFixed(2)}</td>
                  <td className="py-3 px-3 text-right font-semibold text-dark">£{(item.quantity * (item.unit_price || 0)).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex justify-between items-center bg-gray-1 p-4 rounded-lg">
          <span className="text-sm font-medium text-dark">{orderItem.title}</span>
          <span className="text-sm font-bold text-blue">{orderItem.total}</span>
        </div>
      )}

      {/* Total & Shipping Info */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-gray-1 p-4 rounded-xl border border-gray-3 gap-3">
        <div>
          <p className="text-xs font-bold uppercase text-gray-5 mb-0.5">Shipping Address</p>
          <p className="text-sm text-dark font-medium">{address}</p>
        </div>
        <div className="text-right">
          <p className="text-xs font-bold uppercase text-gray-5 mb-0.5">Total Amount</p>
          <p className="text-xl font-bold text-blue">{orderItem.total}</p>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
