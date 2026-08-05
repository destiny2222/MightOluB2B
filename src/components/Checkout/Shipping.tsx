import React, { useState } from "react";

interface Address {
  id: number;
  address: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;
  is_default: boolean;
}

interface ShippingProps {
  addresses: Address[];
  selectedAddressId: number | null;
  onSelectAddress: (id: number) => void;
  manualAddress: any;
  setManualAddress: (addr: any) => void;
}

const Shipping = ({ addresses, selectedAddressId, onSelectAddress, manualAddress, setManualAddress }: ShippingProps) => {
  const [dropdown, setDropdown] = useState(false);
  const [useManual, setUseManual] = useState(false);

  const handleManualChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setManualAddress({
      ...manualAddress,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="bg-white shadow-1 rounded-[10px] mt-7.5">
      <div className="border-b border-gray-3 py-5 px-4 sm:px-8.5">
        <h3 className="font-medium text-xl text-dark">Shipping Address</h3>
      </div>
      <div className="p-4 sm:p-8.5">
        {addresses && addresses.length > 0 && (
          <div className="flex flex-col gap-4 mb-6">
            {addresses.map((addr) => (
              <label
                key={addr.id}
                htmlFor={`addr-${addr.id}`}
                className="flex cursor-pointer select-none items-start gap-3.5"
              >
                <div className="relative mt-1">
                  <input
                    type="radio"
                    name="shippingAddress"
                    id={`addr-${addr.id}`}
                    className="sr-only"
                    checked={selectedAddressId === addr.id && !useManual}
                    onChange={() => {
                      onSelectAddress(addr.id);
                      setUseManual(false);
                    }}
                  />
                  <div
                    className={`flex h-4 w-4 items-center justify-center rounded-full ${
                      selectedAddressId === addr.id && !useManual
                        ? "border-4 border-blue"
                        : "border border-gray-4"
                    }`}
                  ></div>
                </div>
                <div>
                  <p className="font-medium text-dark">{addr.address}</p>
                  <p className="text-gray-5">{addr.city}, {addr.state} {addr.postal_code}, {addr.country}</p>
                </div>
              </label>
            ))}
          </div>
        )}

        <label
          htmlFor="manualAddr"
          className="flex cursor-pointer select-none items-center gap-3.5"
        >
          <div className="relative">
            <input
              type="radio"
              name="shippingAddress"
              id="manualAddr"
              className="sr-only"
              checked={useManual || (!addresses || addresses.length === 0)}
              onChange={() => setUseManual(true)}
            />
            <div
              className={`flex h-4 w-4 items-center justify-center rounded-full ${
                useManual || (!addresses || addresses.length === 0)
                  ? "border-4 border-blue"
                  : "border border-gray-4"
              }`}
            ></div>
          </div>
          Ship to a different address?
        </label>

        {/* <!-- manual address form --> */}
        <div className={`mt-5 ${useManual || (!addresses || addresses.length === 0) ? "block" : "hidden"}`}>
          <div className="mb-5">
            <label htmlFor="country" className="block mb-2.5">
              Country <span className="text-red">*</span>
            </label>
            <input
              type="text"
              name="country"
              value={manualAddress?.country || ''}
              onChange={handleManualChange}
              className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
            />
          </div>

          <div className="mb-5">
            <label htmlFor="address" className="block mb-2.5">
              Street Address <span className="text-red">*</span>
            </label>
            <input
              type="text"
              name="address"
              value={manualAddress?.address || ''}
              onChange={handleManualChange}
              placeholder="House number and street name"
              className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
            />
          </div>

          <div className="mb-5">
            <label htmlFor="city" className="block mb-2.5">
              Town/ City <span className="text-red">*</span>
            </label>
            <input
              type="text"
              name="city"
              value={manualAddress?.city || ''}
              onChange={handleManualChange}
              className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
            />
          </div>

          <div className="mb-5 flex gap-4">
            <div className="w-1/2">
              <label htmlFor="state" className="block mb-2.5">
                State/ Province <span className="text-red">*</span>
              </label>
              <input
                type="text"
                name="state"
                value={manualAddress?.state || ''}
                onChange={handleManualChange}
                className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
              />
            </div>
            <div className="w-1/2">
              <label htmlFor="postal_code" className="block mb-2.5">
                Postal Code <span className="text-red">*</span>
              </label>
              <input
                type="text"
                name="postal_code"
                value={manualAddress?.postal_code || ''}
                onChange={handleManualChange}
                className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shipping;
