// redux/features/b2b-checkout-slice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import * as B2BAPI from "@/lib/api/b2b-api";
import { RootState } from "../store";

interface ManualAddress {
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postal_code?: string;
}

interface CheckoutState {
  details: any | null;
  selectedAddressId: number | null;
  selectedRateId: number | null;
  manualAddress: ManualAddress;
  paymentMethod: string;
  poNumber: string;
  notes: string;
  status: "idle" | "loading" | "succeeded" | "failed";
  submitStatus: "idle" | "submitting" | "succeeded" | "failed";
  error: string | null;
}

const initialState: CheckoutState = {
  details: null,
  selectedAddressId: null,
  selectedRateId: null,
  manualAddress: {},
  paymentMethod: "card",
  poNumber: "",
  notes: "",
  status: "idle",
  submitStatus: "idle",
  error: null,
};

export const fetchB2BCheckout = createAsyncThunk(
  "b2bCheckout/fetch",
  async (token: string, { rejectWithValue }) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/checkout`,
        { headers: B2BAPI.getAuthHeaders(token) }
      );
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        return rejectWithValue(err.message || "Failed to fetch checkout");
      }
      return await res.json();
    } catch (e: any) {
      return rejectWithValue(e.message || "Network error");
    }
  }
);

export const submitB2BCheckout = createAsyncThunk(
  "b2bCheckout/submit",
  async (
    { token, payload }: { token: string; payload: Record<string, any> },
    { rejectWithValue }
  ) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/checkout`,
        {
          method: "POST",
          headers: B2BAPI.getAuthHeaders(token),
          body: JSON.stringify(payload),
        }
      );
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        return rejectWithValue(err.message || "Failed to submit order");
      }
      return await res.json();
    } catch (e: any) {
      return rejectWithValue(e.message || "Network error");
    }
  }
);

const b2bCheckoutSlice = createSlice({
  name: "b2bCheckout",
  initialState,
  reducers: {
    setSelectedAddressId(state, action: PayloadAction<number | null>) {
      state.selectedAddressId = action.payload;
    },
    setSelectedRateId(state, action: PayloadAction<number | null>) {
      state.selectedRateId = action.payload;
    },
    setManualAddress(state, action: PayloadAction<ManualAddress>) {
      state.manualAddress = action.payload;
    },
    setPaymentMethod(state, action: PayloadAction<string>) {
      state.paymentMethod = action.payload;
    },
    setPoNumber(state, action: PayloadAction<string>) {
      state.poNumber = action.payload;
    },
    setNotes(state, action: PayloadAction<string>) {
      state.notes = action.payload;
    },
    resetCheckout() {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchB2BCheckout.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchB2BCheckout.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.details = action.payload;
        const addresses = action.payload?.shipping_addresses || [];
        const defaultAddr = addresses.find((a: any) => a.is_default);
        state.selectedAddressId = defaultAddr ? defaultAddr.id : addresses[0]?.id ?? null;
        const rates = action.payload?.shipping_rates || [];
        state.selectedRateId = rates[0]?.id ?? null;
      })
      .addCase(fetchB2BCheckout.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(submitB2BCheckout.pending, (state) => {
        state.submitStatus = "submitting";
        state.error = null;
      })
      .addCase(submitB2BCheckout.fulfilled, (state) => {
        state.submitStatus = "succeeded";
      })
      .addCase(submitB2BCheckout.rejected, (state, action) => {
        state.submitStatus = "failed";
        state.error = action.payload as string;
      });
  },
});

export const {
  setSelectedAddressId,
  setSelectedRateId,
  setManualAddress,
  setPaymentMethod,
  setPoNumber,
  setNotes,
  resetCheckout,
} = b2bCheckoutSlice.actions;

// Selectors
export const selectCheckoutDetails = (state: RootState) => state.b2bCheckoutReducer.details;
export const selectCheckoutSelectedAddressId = (state: RootState) => state.b2bCheckoutReducer.selectedAddressId;
export const selectCheckoutSelectedRateId = (state: RootState) => state.b2bCheckoutReducer.selectedRateId;
export const selectCheckoutManualAddress = (state: RootState) => state.b2bCheckoutReducer.manualAddress;
export const selectCheckoutPaymentMethod = (state: RootState) => state.b2bCheckoutReducer.paymentMethod;
export const selectCheckoutPoNumber = (state: RootState) => state.b2bCheckoutReducer.poNumber;
export const selectCheckoutNotes = (state: RootState) => state.b2bCheckoutReducer.notes;
export const selectCheckoutStatus = (state: RootState) => state.b2bCheckoutReducer.status;
export const selectCheckoutSubmitStatus = (state: RootState) => state.b2bCheckoutReducer.submitStatus;
export const selectCheckoutError = (state: RootState) => state.b2bCheckoutReducer.error;

export default b2bCheckoutSlice.reducer;