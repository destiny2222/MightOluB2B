import React, { useEffect, useState } from "react";
import SingleOrder from "./SingleOrder";
import { getPurchaseOrders } from "@/lib/api/b2b-api";
import { toast } from "react-toastify";

const Orders = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getPurchaseOrders();
        if (data.orders) {
          const mappedOrders = data.orders.map((po: any) => ({
            id: po.id,
            orderId: po.po_number,
            createdAt: new Date(po.created_at).toLocaleDateString(),
            status: po.status,
            title: po.internal_reference || `Order ${po.po_number}`,
            total: `£${parseFloat(po.total_amount).toFixed(2)}`,
            rawOrder: po
          }));
          setOrders(mappedOrders);
        }
      } catch (err: any) {
        console.error("Error fetching orders:", err);
        toast.error("Failed to load order history");
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <>
      <div className="w-full overflow-x-auto">
        {isLoading ? (
          <div className="py-9.5 px-4 sm:px-7.5 xl:px-10 text-center">Loading orders...</div>
        ) : (
          <div className="min-w-[770px]">
            {orders.length > 0 && (
              <div className="items-center justify-between py-4.5 px-7.5 hidden md:flex ">
                <div className="min-w-[111px]">
                  <p className="text-custom-sm text-dark">Order</p>
                </div>
                <div className="min-w-[175px]">
                  <p className="text-custom-sm text-dark">Date</p>
                </div>

                <div className="min-w-[128px]">
                  <p className="text-custom-sm text-dark">Status</p>
                </div>

                <div className="min-w-[213px]">
                  <p className="text-custom-sm text-dark">Title</p>
                </div>

                <div className="min-w-[113px]">
                  <p className="text-custom-sm text-dark">Total</p>
                </div>

                <div className="min-w-[113px]">
                  <p className="text-custom-sm text-dark">Action</p>
                </div>
              </div>
            )}
            {orders.length > 0 ? (
              orders.map((orderItem, key) => (
                <SingleOrder key={key} orderItem={orderItem} smallView={false} />
              ))
            ) : (
              <p className="py-9.5 px-4 sm:px-7.5 xl:px-10">
                You don't have any orders!
              </p>
            )}
          </div>
        )}

        {orders.length > 0 &&
          orders.map((orderItem, key) => (
            <SingleOrder key={key} orderItem={orderItem} smallView={true} />
          ))}
      </div>
    </>
  );
};

export default Orders;
