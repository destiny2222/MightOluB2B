import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

interface Address {
  id: number;
  label?: string | null;
  company_name?: string | null;
  contact_name?: string | null;
  phone?: string | null;
  address_line_1?: string;
  address_line_2?: string | null;
  address?: string;
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
  const { user } = useSelector((state: RootState) => state.authReducer);
  const [useManual, setUseManual] = useState(false);

  const handleManualChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setManualAddress({
      ...manualAddress,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="bg-white shadow-md rounded-2xl mt-7.5 border border-gray-2 overflow-hidden">
      <div className="border-b border-gray-2 bg-gray-1/50 py-5 px-6 sm:px-8.5">
        <h3 className="font-semibold text-lg text-dark flex items-center gap-2.5">Shipping Address</h3>
      </div>
      <div className="p-4 sm:p-8.5">
        {addresses && addresses.length > 0 && (
          <div className="flex flex-col gap-4 mb-6">
            {addresses.map((addr) => (
              <label
                key={addr.id}
                htmlFor={`addr-${addr.id}`}
                className={`flex cursor-pointer select-none items-start gap-4 rounded-xl border p-5 transition-all duration-200 ${
                  selectedAddressId === addr.id && !useManual 
                    ? "border-blue bg-blue/5 ring-1 ring-blue/20" 
                    : "border-gray-3 hover:border-blue/50 hover:bg-gray-1"
                }`}
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
                <div className="flex-1">
                  <p className="flex items-center gap-2.5 text-custom-sm font-medium text-dark">
                    <svg className="fill-current shrink-0" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" clipRule="evenodd" d="M9.0001 0.9375C7.03259 0.9375 5.4376 2.53249 5.4376 4.5C5.4376 6.46751 7.03259 8.0625 9.0001 8.0625C10.9676 8.0625 12.5626 6.46751 12.5626 4.5C12.5626 2.53249 10.9676 0.9375 9.0001 0.9375ZM6.5626 4.5C6.5626 3.15381 7.65391 2.0625 9.0001 2.0625C10.3463 2.0625 11.4376 3.15381 11.4376 4.5C11.4376 5.84619 10.3463 6.9375 9.0001 6.9375C7.65391 6.9375 6.5626 5.84619 6.5626 4.5Z" fill=""/>
                      <path fillRule="evenodd" clipRule="evenodd" d="M9.0001 9.1875C7.26494 9.1875 5.66629 9.58191 4.48169 10.2483C3.31471 10.9047 2.4376 11.8995 2.4376 13.125L2.43755 13.2015C2.4367 14.0729 2.43564 15.1665 3.39491 15.9477C3.86701 16.3321 4.52746 16.6055 5.41976 16.7861C6.31455 16.9672 7.48077 17.0625 9.0001 17.0625C10.5194 17.0625 11.6857 16.9672 12.5804 16.7861C13.4727 16.6055 14.1332 16.3321 14.6053 15.9477C15.5646 15.1665 15.5635 14.0729 15.5626 13.2015L15.5626 13.125C15.5626 11.8995 14.6855 10.9047 13.5185 10.2483C12.3339 9.58191 10.7353 9.1875 9.0001 9.1875ZM3.5626 13.125C3.5626 12.4865 4.02863 11.7939 5.03323 11.2288C6.0202 10.6736 7.42156 10.3125 9.0001 10.3125C10.5786 10.3125 11.98 10.6736 12.967 11.2288C13.9716 11.7939 14.4376 12.4865 14.4376 13.125C14.4376 14.1059 14.4074 14.658 13.8949 15.0753C13.617 15.3016 13.1525 15.5225 12.3573 15.6835C11.5645 15.8439 10.4808 15.9375 9.0001 15.9375C7.51943 15.9375 6.43565 15.8439 5.64294 15.6835C4.84774 15.5225 4.38319 15.3016 4.10529 15.0753C3.59284 14.658 3.5626 14.1059 3.5626 13.125Z" fill=""/>
                    </svg>
                    <span>{addr.label || addr.company_name || addr.contact_name || user?.name}</span>
                  </p>
                  
                  {addr.phone && (
                    <p className="flex items-center gap-2.5 text-custom-sm mt-1 text-gray-5">
                      <svg className="fill-current shrink-0" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" clipRule="evenodd" d="M3.75559 3.30519C5.01564 2.04514 7.142 2.14093 8.01936 3.71302L8.50612 4.58522C9.07906 5.61183 8.8349 6.90714 7.99618 7.75612C7.98501 7.77142 7.92581 7.85762 7.91843 8.00823C7.90902 8.20047 7.97729 8.64506 8.66611 9.33388C9.35471 10.0225 9.79924 10.0909 9.99156 10.0816C10.1423 10.0742 10.2286 10.015 10.2439 10.0038C11.0929 9.16509 12.3882 8.92094 13.4148 9.49387L14.287 9.98063C15.8591 10.858 15.9549 12.9844 14.6948 14.2444C14.0208 14.9184 13.1246 15.5173 12.0715 15.5572C10.5108 15.6164 7.91935 15.2133 5.35301 12.647C2.78667 10.0806 2.38363 7.48922 2.4428 5.92852C2.48272 4.87537 3.08159 3.97918 3.75559 3.30519ZM7.03699 4.26127C6.58773 3.45626 5.38046 3.27131 4.55108 4.10068C3.96957 4.6822 3.59152 5.32406 3.56699 5.97114C3.51765 7.27264 3.83898 9.54196 6.14851 11.8515C8.45803 14.161 10.7273 14.4823 12.0289 14.433C12.6759 14.4085 13.3178 14.0304 13.8993 13.4489C14.7287 12.6195 14.5437 11.4123 13.7387 10.963L12.8665 10.4762C12.324 10.1735 11.5619 10.2767 11.0269 10.8117C10.9743 10.8642 10.6398 11.1764 10.0462 11.2052C9.43855 11.2348 8.703 10.9618 7.87062 10.1294C7.03796 9.29672 6.76502 8.56097 6.79478 7.95322C6.82384 7.35958 7.13601 7.02538 7.18824 6.97314C7.72323 6.43815 7.82654 5.67602 7.52375 5.13346L7.03699 4.26127Z" fill=""/>
                      </svg>
                      <span>{addr.phone}</span>
                    </p>
                  )}

                  <p className="flex gap-2.5 text-custom-sm mt-1 text-gray-5">
                    <svg className="fill-current shrink-0 mt-0.5" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <g clipPath="url(#clip0_100_6003)">
                        <path fillRule="evenodd" clipRule="evenodd" d="M3.1875 6.38598C3.1875 3.33948 5.8286 0.9375 9 0.9375C12.1714 0.9375 14.8125 3.33948 14.8125 6.38598C14.8125 9.24433 13.0403 12.6 10.1811 13.8219C9.43046 14.1427 8.56954 14.1427 7.81891 13.8219C4.95967 12.6 3.1875 9.24433 3.1875 6.38598ZM9 2.0625C6.37241 2.0625 4.3125 4.03557 4.3125 6.38598C4.3125 8.88223 5.89157 11.7749 8.26099 12.7874C8.72925 12.9875 9.27075 12.9875 9.73901 12.7874C12.1084 11.7749 13.6875 8.88223 13.6875 6.38598C13.6875 4.03557 11.6276 2.0625 9 2.0625ZM9 5.8125C8.48223 5.8125 8.0625 6.23223 8.0625 6.75C8.0625 7.26777 8.48223 7.6875 9 7.6875C9.51777 7.6875 9.9375 7.26777 9.9375 6.75C9.9375 6.23223 9.51777 5.8125 9 5.8125ZM6.9375 6.75C6.9375 5.61091 7.86091 4.6875 9 4.6875C10.1391 4.6875 11.0625 5.61091 11.0625 6.75C11.0625 7.88909 10.1391 8.8125 9 8.8125C7.86091 8.8125 6.9375 7.88909 6.9375 6.75ZM2.69656 11.2474C2.90508 11.4777 2.88744 11.8334 2.65716 12.042C2.23139 12.4275 2.0625 12.7965 2.0625 13.125C2.0625 13.6978 2.60551 14.4036 3.92753 14.9985C5.19675 15.5697 6.98964 15.9375 9 15.9375C11.0104 15.9375 12.8032 15.5697 14.0725 14.9985C15.3945 14.4036 15.9375 13.6978 15.9375 13.125C15.9375 12.7966 15.7686 12.4275 15.3428 12.042C15.1126 11.8334 15.0949 11.4777 15.3034 11.2474C15.512 11.0172 15.8677 10.9995 16.098 11.208C16.6702 11.7262 17.0625 12.3758 17.0625 13.125C17.0625 14.4162 15.9266 15.3978 14.5341 16.0244C13.0889 16.6748 11.1318 17.0625 9 17.0625C6.86823 17.0625 4.91111 16.6748 3.46587 16.0244C2.07342 15.3978 0.9375 14.4162 0.9375 13.125C0.9375 12.3758 1.32979 11.7262 1.90204 11.208C2.13232 10.9995 2.48804 11.0172 2.69656 11.2474Z" fill=""/>
                      </g>
                    </svg>
                    <span>
                      {addr.address_line_1 || addr.address} {addr.address_line_2 && `, ${addr.address_line_2}`}<br />
                      {addr.city}, {addr.state} {addr.postal_code}<br />
                      {addr.country}
                    </span>
                  </p>
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
