import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import * as B2BAPI from "@/lib/api/b2b-api";
import { RootState } from "../store";

interface B2BOrdersState {
  orders: any[];
  drafts: any[];
  currentOrder: any | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  draftsStatus: "idle" | "loading" | "succeeded" | "failed";
  detailsStatus: "idle" | "loading" | "succeeded" | "failed";
  recurringStatus: "idle" | "scheduling" | "succeeded" | "failed";
  error: string | null;
}

const initialState: B2BOrdersState = {
  orders: [],
  drafts: [],
  currentOrder: null,
  status: "idle",
  draftsStatus: "idle",
  detailsStatus: "idle",
  recurringStatus: "idle",
  error: null,
};

export const fetchB2BOrders = createAsyncThunk(
  "b2bOrders/fetchOrders",
  async (_, { rejectWithValue }) => {
    try {
      const response = await B2BAPI.getPurchaseOrders();
      return response.orders;
    } catch (err: any) {
      return rejectWithValue(err.message || "Failed to fetch orders");
    }
  }
);

export const fetchB2BOrderDetails = createAsyncThunk(
  "b2bOrders/fetchOrderDetails",
  async (id: string | number, { rejectWithValue }) => {
    try {
      const response = await B2BAPI.getPurchaseOrderDetails(id);
      return response.order;
    } catch (err: any) {
      return rejectWithValue(err.message || "Failed to fetch order details");
    }
  }
);

// We define a fallback fetch call here since setupRecurringOrder might not be in the API utility yet.
export const fetchB2BDrafts = createAsyncThunk(
  "b2bOrders/fetchDrafts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/b2b/orders/drafts`, {
        headers: B2BAPI.getAuthHeaders()
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || "Failed to fetch drafts");
      }
      const data = await response.json();
      return data.drafts;
    } catch (err: any) {
      return rejectWithValue(err.message || "Failed to fetch drafts");
    }
  }
);

export const approveB2BDraft = createAsyncThunk(
  "b2bOrders/approveDraft",
  async (id: string | number, { rejectWithValue }) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/b2b/orders/${id}/approve`, {
        method: 'POST',
        headers: B2BAPI.getAuthHeaders()
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || "Failed to approve draft");
      }
      return id; // return id so we can filter it out of the array
    } catch (err: any) {
      return rejectWithValue(err.message || "Failed to approve draft");
    }
  }
);

export const setupRecurringOrder = createAsyncThunk(
  "b2bOrders/setupRecurringOrder",
  async (
    { id, frequency }: { id: string | number; frequency: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/b2b/orders/${id}/recurring`, {
        method: 'POST',
        headers: B2BAPI.getAuthHeaders(),
        body: JSON.stringify({ frequency })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to setup recurring order");
      }
      
      return frequency;
    } catch (err: any) {
      return rejectWithValue(err.message || "An error occurred");
    }
  }
);

const b2bOrdersSlice = createSlice({
  name: "b2bOrders",
  initialState,
  reducers: {
    clearCurrentOrder(state) {
      state.currentOrder = null;
      state.detailsStatus = "idle";
    },
    clearOrdersError(state) {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Drafts
      .addCase(fetchB2BDrafts.pending, (state) => {
        state.draftsStatus = "loading";
        state.error = null;
      })
      .addCase(fetchB2BDrafts.fulfilled, (state, action) => {
        state.draftsStatus = "succeeded";
        state.drafts = action.payload;
      })
      .addCase(fetchB2BDrafts.rejected, (state, action) => {
        state.draftsStatus = "failed";
        state.error = action.payload as string;
      })
      // Approve Draft
      .addCase(approveB2BDraft.fulfilled, (state, action) => {
        state.drafts = state.drafts.filter((d: any) => d.id !== action.payload);
      })
      
      // Fetch Orders
      .addCase(fetchB2BOrders.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchB2BOrders.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.orders = action.payload;
      })
      .addCase(fetchB2BOrders.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      // Fetch Order Details
      .addCase(fetchB2BOrderDetails.pending, (state) => {
        state.detailsStatus = "loading";
        state.error = null;
      })
      .addCase(fetchB2BOrderDetails.fulfilled, (state, action) => {
        state.detailsStatus = "succeeded";
        state.currentOrder = action.payload;
      })
      .addCase(fetchB2BOrderDetails.rejected, (state, action) => {
        state.detailsStatus = "failed";
        state.error = action.payload as string;
      })
      // Setup Recurring Order
      .addCase(setupRecurringOrder.pending, (state) => {
        state.recurringStatus = "scheduling";
        state.error = null;
      })
      .addCase(setupRecurringOrder.fulfilled, (state, action) => {
        state.recurringStatus = "succeeded";
        // Optimistically update the current order if needed
        if (state.currentOrder) {
          state.currentOrder.is_recurring = true;
          state.currentOrder.recurring_frequency = action.payload;
        }
      })
      .addCase(setupRecurringOrder.rejected, (state, action) => {
        state.recurringStatus = "failed";
        state.error = action.payload as string;
      });
  },
});

export const { clearCurrentOrder, clearOrdersError } = b2bOrdersSlice.actions;

export const selectB2BOrders = (state: RootState) => state.b2bOrdersReducer.orders;
export const selectB2BOrdersStatus = (state: RootState) => state.b2bOrdersReducer.status;
export const selectB2BCurrentOrder = (state: RootState) => state.b2bOrdersReducer.currentOrder;
export const selectB2BOrderDetailsStatus = (state: RootState) => state.b2bOrdersReducer.detailsStatus;
export const selectB2BRecurringStatus = (state: RootState) => state.b2bOrdersReducer.recurringStatus;
export const selectB2BOrdersError = (state: RootState) => state.b2bOrdersReducer.error;
export const selectB2BDrafts = (state: RootState) => state.b2bOrdersReducer.drafts;
export const selectB2BDraftsStatus = (state: RootState) => state.b2bOrdersReducer.draftsStatus;

export default b2bOrdersSlice.reducer;
