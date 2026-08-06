import React from "react";

interface ShippingRate {
  id: number;
  delivery_type: string;
  price: number;
  weight_from: number;
  weight_to: number;
}

interface ShippingMethodProps {
  rates: ShippingRate[];
  selectedRateId: number | null;
  onSelectRate: (id: number) => void;
}

const ShippingMethod = ({ rates, selectedRateId, onSelectRate }: ShippingMethodProps) => {
  return (
    <div className="bg-white shadow-md rounded-2xl mt-7.5 border border-gray-2 overflow-hidden">
      <div className="border-b border-gray-2 bg-gray-1/50 py-5 px-6 sm:px-8.5">
        <h3 className="font-semibold text-lg text-dark flex items-center gap-2.5">Shipping Method</h3>
      </div>

      <div className="p-4 sm:p-8.5">
        <div className="flex flex-col gap-4">
          {rates && rates.length > 0 ? (
            rates.map((rate) => (
              <label
                key={rate.id}
                htmlFor={`rate-${rate.id}`}
                className={`flex cursor-pointer select-none items-center gap-4 rounded-xl border p-5 transition-all duration-200 ${
                  selectedRateId === rate.id 
                    ? "border-blue bg-blue/5 ring-1 ring-blue/20" 
                    : "border-gray-3 hover:border-blue/50 hover:bg-gray-1"
                }`}
              >
                <div className="relative">
                  <input
                    type="radio"
                    name="shippingRate"
                    id={`rate-${rate.id}`}
                    className="sr-only"
                    checked={selectedRateId === rate.id}
                    onChange={() => onSelectRate(rate.id)}
                  />
                  <div
                    className={`flex h-4 w-4 items-center justify-center rounded-full ${
                      selectedRateId === rate.id
                        ? "border-4 border-blue"
                        : "border border-gray-4"
                    }`}
                  ></div>
                </div>

                <div className="w-full">
                  <div className="flex flex-col">
                    <p className="font-semibold text-dark">${Number(rate.price).toFixed(2)}</p>
                    <p className="text-custom-xs text-gray-5">{rate.delivery_type}</p>
                    <p className="text-custom-xs text-gray-4">Weight: {rate.weight_from}g - {rate.weight_to}g</p>
                  </div>
                </div>
              </label>
            ))
          ) : (
            <p className="text-gray-5">No shipping methods available for this weight.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShippingMethod;
