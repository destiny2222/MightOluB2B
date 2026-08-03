import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import * as B2BAPI from "@/lib/api/b2b-api";

// Types
interface KYCState {
  kyc: B2BAPI.KYC | null;
  authorizedBuyers: B2BAPI.User[];
  isLoading: boolean;
  error: string | null;
  successMessage: string | null;
}

// Initial State
const initialState: KYCState = {
  kyc: null,
  authorizedBuyers: [],
  isLoading: false,
  error: null,
  successMessage: null,
};

// Async Thunks

// Submit KYC
export const submitKYCApplication = createAsyncThunk(
  'kyc/submit',
  async (data: B2BAPI.KYCData, { rejectWithValue }) => {
    try {
      const response = await B2BAPI.submitKYC(data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error?.errors || error?.error || 'KYC submission failed');
    }
  }
);

// Resubmit KYC
export const resubmitKYCApplication = createAsyncThunk(
  'kyc/resubmit',
  async (data: B2BAPI.KYCData, { rejectWithValue }) => {
    try {
      const response = await B2BAPI.resubmitKYC(data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error?.errors || error?.error || 'KYC resubmission failed');
    }
  }
);

// Get Business Profile
export const fetchBusinessProfile = createAsyncThunk(
  'kyc/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await B2BAPI.getBusinessProfile();
      return response;
    } catch (error: any) {
      return rejectWithValue(error?.errors || error?.error || 'Failed to fetch business profile');
    }
  }
);

// Update Business Profile
export const updateBusinessProfileData = createAsyncThunk(
  'kyc/updateProfile',
  async (data: B2BAPI.UpdateBusinessProfileData, { rejectWithValue }) => {
    try {
      const response = await B2BAPI.updateBusinessProfile(data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error?.errors || error?.error || 'Failed to update business profile');
    }
  }
);

// Get Authorized Buyers
export const fetchAuthorizedBuyers = createAsyncThunk(
  'kyc/fetchBuyers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await B2BAPI.getAuthorizedBuyers();
      return response;
    } catch (error: any) {
      return rejectWithValue(error?.errors || error?.error || 'Failed to fetch authorized buyers');
    }
  }
);

// Add Authorized Buyer
export const addNewAuthorizedBuyer = createAsyncThunk(
  'kyc/addBuyer',
  async (data: B2BAPI.AddAuthorizedBuyerData, { rejectWithValue }) => {
    try {
      const response = await B2BAPI.addAuthorizedBuyer(data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error?.errors || error?.error || 'Failed to add authorized buyer');
    }
  }
);

// Delete Authorized Buyer
export const removeAuthorizedBuyer = createAsyncThunk(
  'kyc/removeBuyer',
  async (buyerId: string, { rejectWithValue }) => {
    try {
      const response = await B2BAPI.deleteAuthorizedBuyer(buyerId);
      return { message: response.message, buyerId };
    } catch (error: any) {
      return rejectWithValue(error?.errors || error?.error || 'Failed to remove authorized buyer');
    }
  }
);

// Slice
const kycSlice = createSlice({
  name: "kyc",
  initialState,
  reducers: {
    // Clear error
    clearKYCError: (state) => {
      state.error = null;
    },
    
    // Clear success message
    clearSuccessMessage: (state) => {
      state.successMessage = null;
    },
    
    // Set KYC from user data
    setKYCFromUser: (state, action: PayloadAction<B2BAPI.KYC | null>) => {
      state.kyc = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Submit KYC
    builder
      .addCase(submitKYCApplication.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(submitKYCApplication.fulfilled, (state, action) => {
        state.isLoading = false;
        state.kyc = action.payload.kyc;
        state.successMessage = action.payload.message;
      })
      .addCase(submitKYCApplication.rejected, (state, action) => {
        state.isLoading = false;
        state.error = typeof action.payload === 'string' 
          ? action.payload 
          : JSON.stringify(action.payload);
      });

    // Resubmit KYC
    builder
      .addCase(resubmitKYCApplication.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(resubmitKYCApplication.fulfilled, (state, action) => {
        state.isLoading = false;
        state.kyc = action.payload.kyc;
        state.successMessage = action.payload.message;
      })
      .addCase(resubmitKYCApplication.rejected, (state, action) => {
        state.isLoading = false;
        state.error = typeof action.payload === 'string' 
          ? action.payload 
          : JSON.stringify(action.payload);
      });

    // Fetch Business Profile
    builder
      .addCase(fetchBusinessProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBusinessProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.kyc = action.payload.user.kyc || null;
      })
      .addCase(fetchBusinessProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = typeof action.payload === 'string' 
          ? action.payload 
          : JSON.stringify(action.payload);
      });

    // Update Business Profile
    builder
      .addCase(updateBusinessProfileData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(updateBusinessProfileData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.kyc = action.payload.kyc;
        state.successMessage = action.payload.message;
      })
      .addCase(updateBusinessProfileData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = typeof action.payload === 'string' 
          ? action.payload 
          : JSON.stringify(action.payload);
      });

    // Fetch Authorized Buyers
    builder
      .addCase(fetchAuthorizedBuyers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAuthorizedBuyers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.authorizedBuyers = action.payload.buyers;
      })
      .addCase(fetchAuthorizedBuyers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = typeof action.payload === 'string' 
          ? action.payload 
          : JSON.stringify(action.payload);
      });

    // Add Authorized Buyer
    builder
      .addCase(addNewAuthorizedBuyer.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(addNewAuthorizedBuyer.fulfilled, (state, action) => {
        state.isLoading = false;
        state.authorizedBuyers.push(action.payload.buyer);
        state.successMessage = action.payload.message;
      })
      .addCase(addNewAuthorizedBuyer.rejected, (state, action) => {
        state.isLoading = false;
        state.error = typeof action.payload === 'string' 
          ? action.payload 
          : JSON.stringify(action.payload);
      });

    // Remove Authorized Buyer
    builder
      .addCase(removeAuthorizedBuyer.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(removeAuthorizedBuyer.fulfilled, (state, action) => {
        state.isLoading = false;
        state.authorizedBuyers = state.authorizedBuyers.filter(
          buyer => buyer.id !== action.payload.buyerId
        );
        state.successMessage = action.payload.message;
      })
      .addCase(removeAuthorizedBuyer.rejected, (state, action) => {
        state.isLoading = false;
        state.error = typeof action.payload === 'string' 
          ? action.payload 
          : JSON.stringify(action.payload);
      });
  },
});

// Actions
export const { clearKYCError, clearSuccessMessage, setKYCFromUser } = kycSlice.actions;

// Selectors
export const selectKYC = (state: RootState) => state.kycReducer;
export const selectKYCData = (state: RootState) => state.kycReducer.kyc;
export const selectKYCStatus = (state: RootState) => state.kycReducer.kyc?.status;
export const selectAuthorizedBuyers = (state: RootState) => state.kycReducer.authorizedBuyers;
export const selectKYCLoading = (state: RootState) => state.kycReducer.isLoading;
export const selectKYCError = (state: RootState) => state.kycReducer.error;
export const selectKYCSuccessMessage = (state: RootState) => state.kycReducer.successMessage;

// Reducer
export default kycSlice.reducer;
