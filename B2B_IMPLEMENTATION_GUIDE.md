# B2B Authentication & Account Management - Implementation Guide

This implementation provides a complete B2B (Business-to-Business) authentication and account management system integrated with your Next.js e-commerce application.

## 🚀 Features Implemented

### 1. **Authentication System**
- ✅ B2B User Registration (`/b2b/register`)
- ✅ B2B User Login (`/b2b/login`)
- ✅ User Profile Management
- ✅ Persistent authentication via localStorage
- ✅ Auto-load authentication state on app initialization

### 2. **KYC (Know Your Customer) Trade Application**
- ✅ Submit KYC Application (`/b2b/kyc-setup`)
- ✅ Resubmit KYC after rejection/info request
- ✅ Application Status Tracking (`/b2b/application-status`)
- ✅ Business Profile Management (`/b2b/business-profile`)

### 3. **Account Management**
- ✅ Switch between Personal and Business views
- ✅ Authorized Buyers Management (add/remove team members)
- ✅ User menu with profile dropdown in header
- ✅ Logout functionality

## 📁 Files Created

### API Layer
- `src/lib/api/b2b-api.ts` - Complete API utility functions for all B2B endpoints

### Redux State Management
- `src/redux/features/auth-slice.ts` - Authentication state management
- `src/redux/features/kyc-slice.ts` - KYC and buyers state management
- Updated `src/redux/store.ts` - Added new reducers
- Updated `src/redux/provider.tsx` - Auto-load auth on init

### Components
- `src/components/Auth/B2BSignup/index.tsx` - B2B registration form
- `src/components/Auth/B2BSignin/index.tsx` - B2B login form
- `src/components/B2B/KYCSetup/index.tsx` - KYC application form
- `src/components/B2B/ApplicationStatus/index.tsx` - Application status display
- `src/components/B2B/AuthorizedBuyersManager/index.tsx` - Buyers management

### Pages
- `src/app/(site)/(pages)/b2b/register/page.tsx`
- `src/app/(site)/(pages)/b2b/login/page.tsx`
- `src/app/(site)/(pages)/b2b/kyc-setup/page.tsx`
- `src/app/(site)/(pages)/b2b/application-status/page.tsx`
- `src/app/(site)/(pages)/b2b/business-profile/page.tsx`

### Updated Components
- `src/components/Header/index.tsx` - Integrated B2B auth with user menu and view switcher

## 🔧 Setup Instructions

### 1. Environment Configuration

Create a `.env.local` file in the root directory:

```bash
cp .env.local.example .env.local
```

Update with your actual API base URL:
```env
NEXT_PUBLIC_API_BASE_URL=https://api.mightyolu.com
```

### 2. Install Dependencies (if needed)

All required dependencies are already in package.json:
- `@reduxjs/toolkit` - State management
- `react-redux` - React bindings for Redux
- `react-hot-toast` - Toast notifications

### 3. Run the Application

```bash
npm run dev
```

## 📱 User Flows

### New B2B User Registration Flow

1. User visits `/b2b/register`
2. Fills registration form (name, email, password)
3. Upon successful registration:
   - Token and user data stored in localStorage
   - Automatically redirected to `/b2b/kyc-setup`
4. User completes KYC form with business details
5. Application submitted with status "pending"
6. Redirected to `/b2b/application-status` to track approval

### Existing User Login Flow

1. User visits `/b2b/login`
2. Enters credentials
3. Upon successful login:
   - Token and user data stored
   - Redirected to home page
   - Header shows user menu with profile and view switcher

### Business View Switching

1. Approved B2B users see "B2B" or "Retail" badge in header
2. Click user menu → "Switch to Business/Personal"
3. View context updated in real-time
4. Future: Can show different pricing based on current view

### Authorized Buyers Management

1. Business owner visits `/b2b/business-profile`
2. Scrolls to "Authorized Buyers" section
3. Clicks "Add Buyer" button
4. Fills form with team member details
5. New buyer can login and inherit business KYC access

## 🎨 Header Integration

The header now includes:

### Top Bar
- **When Not Authenticated**: Shows "Sign In / Register | B2B" links
- **When Authenticated**: Shows user name with dropdown menu

### User Menu Dropdown
- User name and email display
- My Account link
- Business Profile link (if B2B approved)
- View Switcher (Personal ↔ Business)
- Application Status (if KYC pending/rejected)
- Sign Out button

### Visual Indicators
- B2B/Retail badge shows current view mode
- Application status visible in menu
- Smooth transitions and hover effects

## 🔐 Authentication State Management

### Redux Selectors Available

```typescript
// In any component
import { useSelector } from "react-redux";
import { 
  selectIsAuthenticated,
  selectUser,
  selectCurrentView,
  selectB2BStatus,
  selectHasB2BAccess,
  selectIsBusinessOwner
} from "@/redux/features/auth-slice";

const isAuthenticated = useSelector(selectIsAuthenticated);
const user = useSelector(selectUser);
const currentView = useSelector(selectCurrentView); // 'personal' | 'business'
const hasB2BAccess = useSelector(selectHasB2BAccess); // true if status === 'approved'
```

### Redux Actions Available

```typescript
import { useAppDispatch } from "@/redux/store";
import { 
  registerB2BUser,
  loginB2BUser,
  fetchUserProfile,
  switchView,
  logout
} from "@/redux/features/auth-slice";

const dispatch = useAppDispatch();

// Register
dispatch(registerB2BUser({ name, email, password, password_confirmation }));

// Login
dispatch(loginB2BUser({ email, password }));

// Fetch profile
dispatch(fetchUserProfile());

// Switch view
dispatch(switchView());

// Logout
dispatch(logout());
```

## 🎯 API Endpoints Summary

All endpoints are documented in `b2b_api_docs.md`. Key endpoints:

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/v1/b2b/register` | POST | Register new B2B user |
| `/api/v1/b2b/login` | POST | Login existing user |
| `/api/v1/user/me` | GET | Get current user profile |
| `/api/v1/kyc` | POST | Submit KYC application |
| `/api/v1/resubmit` | POST | Resubmit KYC after rejection |
| `/api/v1/profile` | GET/PUT | Get/update business profile |
| `/api/v1/account/switch-context` | POST | Switch between views |
| `/api/v1/authorized-buyers` | GET/POST | Manage authorized buyers |

## 🚦 Application Statuses

KYC applications can have these statuses:

- **`pending`**: Under review by admin
- **`approved`**: Can access B2B features and wholesale pricing
- **`rejected`**: Application denied, can resubmit
- **`info_requested`**: Admin needs more information

## 🎨 Styling

All components use Tailwind CSS classes matching your existing design system:
- Gray color palette (`gray-1`, `gray-2`, `gray-3`, etc.)
- Primary blue color for CTAs
- Consistent border radius (`rounded-lg`, `rounded-xl`)
- Smooth transitions and hover effects

## 🔄 Next Steps

To complete the B2B implementation:

1. **Cart & Checkout Integration**
   - Implement B2B cart endpoints from the API docs
   - Show different pricing based on `currentView`
   - Handle minimum order quantities

2. **Product Catalog**
   - Filter/show B2B products based on `current_view`
   - Display wholesale pricing tiers
   - Show MOQ (Minimum Order Quantity) badges

3. **Orders Management**
   - B2B order history
   - Bulk order exports
   - Invoice generation

4. **Admin Dashboard** (if building)
   - Review/approve KYC applications
   - Assign pricing tiers
   - Manage authorized buyers

## 🐛 Error Handling

All components include:
- Client-side validation
- Server error parsing and display
- Toast notifications for user feedback
- Loading states during API calls
- Graceful fallbacks for edge cases

## 📝 Notes

- Authentication tokens stored in `localStorage` with key `b2b_token`
- User data cached in `localStorage` with key `b2b_user`
- All API calls auto-include bearer token from localStorage
- Redux state persists across page reloads

## 🎉 Testing the Implementation

1. **Test Registration**:
   ```
   Visit: http://localhost:3000/b2b/register
   ```

2. **Test Login**:
   ```
   Visit: http://localhost:3000/b2b/login
   ```

3. **Test KYC Submission**:
   ```
   Register → Auto-redirect to KYC Setup
   ```

4. **Test View Switching**:
   ```
   Login with approved account → Header user menu → Switch View
   ```

---

**Implementation Complete!** 🎊

All authentication, KYC, and account management endpoints have been successfully integrated into the frontend.
