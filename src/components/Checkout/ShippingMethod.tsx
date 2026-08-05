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
    <div className="bg-white shadow-1 rounded-[10px] mt-7.5">
      <div className="border-b border-gray-3 py-5 px-4 sm:px-8.5">
        <h3 className="font-medium text-xl text-dark">Shipping Method</h3>
      </div>

      <div className="p-4 sm:p-8.5">
        <div className="flex flex-col gap-4">
          {rates && rates.length > 0 ? (
            rates.map((rate) => (
              <label
                key={rate.id}
                htmlFor={`rate-${rate.id}`}
                className="flex cursor-pointer select-none items-center gap-3.5"
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

                <div className="rounded-md border-[0.5px] py-3.5 px-5 ease-out duration-200 hover:bg-gray-2 hover:border-transparent hover:shadow-none w-full max-w-[280px]">
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
