import React, { useState } from "react";
import { toast } from "react-toastify";

const EditOrder = ({ order, toggleModal }: any) => {
  const [currentStatus, setCurrentStatus] = useState(order?.status?.toLowerCase() || "submitted");

  const handleChange = (e: any) => {
    setCurrentStatus(e.target.value);
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();

    if (!currentStatus) {
      toast.error("Please select a status");
      return;
    }

    if (order) {
      order.status = currentStatus;
    }
    toast.success(`Order status updated to ${currentStatus}`);
    toggleModal(false);
  };

  return (
    <div className="w-full">
      <h3 className="text-xl font-bold text-dark mb-4">Update Order Status</h3>
      <div className="w-full flex flex-col gap-4">
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-dark mb-2">
            Select Status
          </label>
          <select
            className="w-full rounded-[10px] border border-gray-3 bg-gray-1 text-dark py-3 px-4 text-custom-sm focus:border-blue outline-none"
            name="status"
            id="status"
            value={currentStatus}
            required
            onChange={handleChange}
          >
            <option value="submitted">Submitted</option>
            <option value="processing">Processing</option>
            <option value="dispatched">Dispatched</option>
            <option value="delivered">Delivered</option>
            <option value="on-hold">On Hold</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <button
          className="w-full font-medium text-white py-3 px-6 rounded-md bg-blue hover:bg-blue-dark transition duration-200"
          onClick={handleSubmit}
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default EditOrder;
