import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import * as B2BAPI from "@/lib/api/b2b-api";

// Types
interface AuthState {
  user: B2BAPI.User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  b2bStatus: 'pending' | 'approved' | 'rejected' | 'info_requested' | null;
  currentView: 'personal' | 'business';
}

// Initial State
const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  b2bStatus: null,
  currentView: 'personal',
};

// Async Thunks

// Register B2B User
export const registerB2BUser = createAsyncThunk(
  'auth/registerB2B',
  async (data: B2BAPI.RegisterData, { rejectWithValue }) => {
    try {
      const response = await B2BAPI.registerB2B(data);
      B2BAPI.storeAuthData(response.token, response.data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error?.errors || error?.error || 'Registration failed');
    }
  }
);

// Login B2B User
export const loginB2BUser = createAsyncThunk(
  'auth/loginB2B',
  async (data: B2BAPI.LoginData, { rejectWithValue }) => {
    try {
      const response = await B2BAPI.loginB2B(data);
      B2BAPI.storeAuthData(response.token, response.data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error?.errors || error?.error || 'Login failed');
    }
  }
);

// Get User Profile
export const fetchUserProfile = createAsyncThunk(
  'auth/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await B2BAPI.getUserProfile();
      // Update stored user data
      if (response.user) {
        const token = B2BAPI.getStoredToken();
        if (token) {
          B2BAPI.storeAuthData(token, response.user);
        }
      }
      return response;
    } catch (error: any) {
      return rejectWithValue(error?.errors || error?.error || 'Failed to fetch profile');
    }
  }
);

// Switch Account View
export const switchView = createAsyncThunk(
  'auth/switchView',
  async (_, { rejectWithValue }) => {
    try {
      const response = await B2BAPI.switchAccountView();
      // Update stored user data
      const token = B2BAPI.getStoredToken();
      if (token && response.user) {
        B2BAPI.storeAuthData(token, response.user);
      }
      return response;
    } catch (error: any) {
      return rejectWithValue(error?.errors || error?.error || 'Failed to switch view');
    }
  }
);

// Slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Load auth from localStorage on app init
    loadAuthFromStorage: (state) => {
      const token = B2BAPI.getStoredToken();
      const user = B2BAPI.getStoredUser();

      if (token && user) {
        state.token = token;
        state.user = user;
        state.isAuthenticated = true;
        state.currentView = user.current_view;
        state.b2bStatus = user.kyc?.status || null;
      }
    },

    // Logout
    logout: (state) => {
      B2BAPI.logoutB2B();
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.b2bStatus = null;
      state.currentView = 'personal';
      state.error = null;
    },

    // Clear error
    clearError: (state) => {
      state.error = null;
    },

    // Update user after KYC submission
    updateUserKYC: (state, action: PayloadAction<{ user: B2BAPI.User }>) => {
      state.user = action.payload.user;
      state.b2bStatus = action.payload.user.kyc?.status || null;

      // Update localStorage
      const token = B2BAPI.getStoredToken();
      if (token) {
        B2BAPI.storeAuthData(token, action.payload.user);
      }
    },
  },
  extraReducers: (builder) => {
    // Register B2B User
    builder
      .addCase(registerB2BUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerB2BUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.data;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.currentView = action.payload.data.current_view;
        state.b2bStatus = action.payload.data.kyc?.status || null;
      })
      .addCase(registerB2BUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = typeof action.payload === 'string'
          ? action.payload
          : JSON.stringify(action.payload);
      });

    // Login B2B User
    builder
      .addCase(loginB2BUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginB2BUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.data;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.currentView = action.payload.data.current_view;
        state.b2bStatus = action.payload.data.kyc?.status || null;
      })
      .addCase(loginB2BUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = typeof action.payload === 'string'
          ? action.payload
          : JSON.stringify(action.payload);
      });

    // Fetch User Profile
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.currentView = action.payload.current_view as 'personal' | 'business';
        state.b2bStatus = action.payload.b2b_status as any || action.payload.user.kyc?.status || null;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = typeof action.payload === 'string'
          ? action.payload
          : JSON.stringify(action.payload);
      });

    // Switch View
    builder
      .addCase(switchView.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(switchView.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentView = action.payload.current_view;
        state.user = action.payload.user;
      })
      .addCase(switchView.rejected, (state, action) => {
        state.isLoading = false;
        state.error = typeof action.payload === 'string'
          ? action.payload
          : JSON.stringify(action.payload);
      });
  },
});

// Actions
export const { loadAuthFromStorage, logout, clearError, updateUserKYC } = authSlice.actions;

// Selectors
export const selectAuth = (state: RootState) => state.authReducer;
export const selectUser = (state: RootState) => state.authReducer.user;
export const selectIsAuthenticated = (state: RootState) => state.authReducer.isAuthenticated;
export const selectB2BStatus = (state: RootState) => state.authReducer.b2bStatus;
export const selectCurrentView = (state: RootState) => state.authReducer.currentView;
export const selectIsBusinessOwner = (state: RootState) =>
  state.authReducer.user?.is_business_owner || false;
export const selectHasB2BAccess = (state: RootState) =>
  state.authReducer.b2bStatus === 'approved';
export const selectToken = (state: RootState) => state.authReducer.token;

// KYC-related selectors
export const selectHasKYC = (state: RootState) =>
  state.authReducer.user?.kyc_id !== null && state.authReducer.user?.kyc_id !== undefined;
export const selectKYCStatus = (state: RootState) =>
  state.authReducer.user?.kyc?.status || null;
export const selectCanPurchase = (state: RootState) => {
  const user = state.authReducer.user;
  if (!user || user.kyc_id === null) return false;
  return user.kyc?.status === 'approved';
};

// Reducer
export default authSlice.reducer;
