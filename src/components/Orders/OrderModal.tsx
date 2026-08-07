import React, { useRef, useEffect } from "react";
import OrderDetails from "./OrderDetails";
import EditOrder from "./EditOrder";

const OrderModal = ({ showDetails, showEdit, toggleModal, order }: any) => {
  if (!showDetails && !showEdit) {
    return null;
  }

  return (
    <>
      <div
        className={`backdrop-filter-sm visible fixed left-0 top-0 z-[99999] flex min-h-screen w-full justify-center items-center bg-[#000]/50 px-4 py-8 sm:px-8 overflow-y-auto`}
      >
        <div className="shadow-2xl relative w-full max-w-[700px] max-h-[90vh] overflow-y-auto rounded-[16px] bg-white p-6 sm:p-8 transition-all flex flex-col">
          <button
            onClick={() => toggleModal(false)}
            aria-label="Close modal"
            className="text-gray-5 hover:text-dark hover:bg-gray-1 absolute right-5 top-5 z-[9999] flex h-8 w-8 items-center justify-center rounded-full border border-gray-3 bg-white shadow-xs transition"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <>
            {showDetails && <OrderDetails orderItem={order} />}

            {showEdit && <EditOrder order={order} toggleModal={toggleModal} />}
          </>
        </div>
      </div>
    </>
  );
};

export default OrderModal;
