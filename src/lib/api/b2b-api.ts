// B2B API Utility Functions
// Base URL configuration - Update this to your actual API base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const API_VERSION = '/api/v1';

// Type Definitions
export interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface KYCData {
  registered_business_name?: string;
  company_name?: string;
  trading_name?: string;
  business_type: 'sole_trader' | 'limited_company' | 'partnership' | 'charity_non_profit' | 'restaurant' | 'retailer' | 'caterer' | 'reseller' | 'other' | string;
  company_registration_number?: string;
  vat_registration_number?: string;
  date_business_established?: string;
  nature_of_business?: string;
  business_website?: string;

  address_line_1?: string;
  address_line_2?: string;
  city?: string;
  postcode?: string;
  country?: string;
  trade_address?: string;

  primary_contact_name?: string;
  primary_contact_position?: string;
  primary_contact_email?: string;
  primary_contact_phone?: string;
  preferred_contact_method?: 'email' | 'telephone' | string;
  billing_contact?: string;

  owner_full_name?: string;
  owner_position?: string;
  owner_nationality?: string;
  owner_dob?: string;
  owner_residential_address?: string;

  certificate_of_incorporation?: any;
  proof_of_business_address?: any;
  vat_registration_certificate?: any;
  business_bank_statement?: any;
  government_id?: any;
  proof_of_residential_address?: any;
  partnership_agreement?: any;
  sole_trader_evidence?: any;
  other_documents?: any;

  primary_products_of_interest?: string;
  estimated_monthly_purchase_value?: string;
  estimated_monthly_order_volume?: string;
  expected_order_frequency?: 'weekly' | 'fortnightly' | 'monthly' | 'ad_hoc' | string;
  purpose_of_purchase?: 'retail_resale' | 'restaurant_catering' | 'distribution' | 'hospitality' | 'corporate_use' | 'other' | string;
}

export interface UpdateBusinessProfileData {
  company_name?: string;
  trade_address?: string;
  billing_contact?: string;
}

export interface AddAuthorizedBuyerData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface KYC {
  id: number;
  user_id?: string;
  company_name?: string;
  registered_business_name?: string;
  trading_name?: string;
  business_type?: string;
  company_registration_number?: string | null;
  vat_registration_number?: string | null;
  date_business_established?: string | null;
  nature_of_business?: string | null;
  business_website?: string | null;
  trade_address?: string;
  address_line_1?: string;
  address_line_2?: string;
  city?: string;
  postcode?: string;
  country?: string;
  billing_contact?: string;
  primary_contact_name?: string;
  primary_contact_position?: string;
  primary_contact_email?: string;
  primary_contact_phone?: string;
  preferred_contact_method?: string;
  owner_full_name?: string;
  owner_position?: string;
  owner_nationality?: string;
  owner_dob?: string;
  owner_residential_address?: string;
  certificate_of_incorporation?: string | null;
  proof_of_business_address?: string | null;
  vat_registration_certificate?: string | null;
  business_bank_statement?: string | null;
  government_id?: string | null;
  proof_of_residential_address?: string | null;
  partnership_agreement?: string | null;
  sole_trader_evidence?: string | null;
  other_documents?: string | null;
  primary_products_of_interest?: string | null;
  estimated_monthly_purchase_value?: string | null;
  estimated_monthly_order_volume?: string | null;
  expected_order_frequency?: string | null;
  purpose_of_purchase?: string | null;
  status: 'pending' | 'approved' | 'rejected' | 'info_requested';
  pricing_tier?: string | null;
  status_notes?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  kyc_id: number | null;
  is_business_owner: number | boolean;
  current_view: 'personal' | 'business';
  created_at: string;
  updated_at: string;
  kyc?: KYC;
}

export interface AuthResponse {
  message: string;
  token: string;
  token_type: string;
  data: User;
}

export interface ProfileResponse {
  user: User;
  b2b_status?: string;
  current_view: string;
}

export interface ApiError {
  error?: string;
  errors?: Record<string, string[]>;
  message?: string;
}

export interface VolumeDiscount {
  minimum_quantity: number;
  discount_percentage: number;
}

export interface B2BProduct {
  id: number;
  title: string;
  slug: string;
  description?: string;
  images: string[];
  category?: string;
  standard_price: number;
  trade_price: number;
  minimum_order_quantity: number;
  has_volume_discounts?: boolean;
  volume_discounts?: VolumeDiscount[];
}

export interface B2BCatalogResponse {
  current_page: number;
  data: B2BProduct[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: any[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

export interface B2BCartItem {
  id: number;
  product_id: number;
  product_title: string;
  product_slug: string;
  product_image: string[];
  quantity: number;
  price: number;
  subtotal: number;
  size?: string;
  category_name?: string;
}

export interface B2BCartResponse {
  items: B2BCartItem[];
  total_price: number;
  total_quantity: number;
}

export interface AddToCartData {
  product_id: number;
  quantity?: number;
  size_variant?: string;
}

export interface AddToCartResponse {
  message: string;
  cart_item: any;
}

export interface UpdateCartData {
  quantity: number;
}

export interface UpdateCartResponse {
  message: string;
  cart_item: any;
}

// Helper function to get auth headers
export const getAuthHeaders = (token?: string | null, isFormData = false): HeadersInit => {
  const headers: Record<string, string> = {
    'Accept': 'application/json',
  };

  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }

  const authToken = token || (typeof window !== 'undefined' ? localStorage.getItem('b2b_token') : null);

  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  return headers;
};

// Helper function to handle API responses
async function handleResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get('content-type');
  const isJson = contentType?.includes('application/json');

  const data = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    const error: ApiError = isJson ? data : { message: data };
    throw error;
  }

  return data;
}

// ==================== AUTHENTICATION ENDPOINTS ====================

/**
 * Register a new B2B user account
 */
export async function registerB2B(data: RegisterData): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}${API_VERSION}/b2b/register`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  return handleResponse<AuthResponse>(response);
}

/**
 * Login to B2B account
 */
export async function loginB2B(data: LoginData): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}${API_VERSION}/b2b/login`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  return handleResponse<AuthResponse>(response);
}

/**
 * Get current user profile and B2B status
 */
export async function getUserProfile(token?: string): Promise<ProfileResponse> {
  const response = await fetch(`${API_BASE_URL}${API_VERSION}/user/me`, {
    method: 'GET',
    headers: getAuthHeaders(token),
  });

  return handleResponse<ProfileResponse>(response);
}

/**
 * Logout user (client-side token removal)
 */
export function logoutB2B(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('b2b_token');
    localStorage.removeItem('b2b_user');
  }
}

// ==================== KYC ENDPOINTS ====================

/**
 * Submit KYC details for trade account approval
 * Supports application/json or multipart/form-data for document attachments.
 */
export async function submitKYC(data: KYCData | FormData, token?: string): Promise<{
  message: string;
  data?: KYC;
  kyc?: KYC;
  user?: User;
}> {
  const isFormData = typeof FormData !== 'undefined' && data instanceof FormData;
  const response = await fetch(`${API_BASE_URL}${API_VERSION}/kyc`, {
    method: 'POST',
    headers: getAuthHeaders(token, isFormData),
    body: isFormData ? (data as FormData) : JSON.stringify(data),
  });

  return handleResponse(response);
}

/**
 * Resubmit KYC details after rejection or info request
 * Supports application/json or multipart/form-data for document attachments.
 */
export async function resubmitKYC(data: KYCData | FormData, token?: string): Promise<{
  message: string;
  kyc?: KYC;
  data?: KYC;
}> {
  const isFormData = typeof FormData !== 'undefined' && data instanceof FormData;
  const response = await fetch(`${API_BASE_URL}${API_VERSION}/resubmit`, {
    method: 'POST',
    headers: getAuthHeaders(token, isFormData),
    body: isFormData ? (data as FormData) : JSON.stringify(data),
  });

  return handleResponse(response);
}

/**
 * Get business profile with KYC details
 */
export async function getBusinessProfile(token?: string): Promise<{
  user: User;
}> {
  const response = await fetch(`${API_BASE_URL}${API_VERSION}/profile`, {
    method: 'GET',
    headers: getAuthHeaders(token),
  });

  return handleResponse(response);
}

/**
 * Update business profile (for approved accounts only)
 */
export async function updateBusinessProfile(
  data: UpdateBusinessProfileData,
  token?: string
): Promise<{
  message: string;
  kyc: KYC;
}> {
  const response = await fetch(`${API_BASE_URL}${API_VERSION}/profile`, {
    method: 'PUT',
    headers: getAuthHeaders(token),
    body: JSON.stringify(data),
  });

  return handleResponse(response);
}

// ==================== CATALOG & PRODUCTS ENDPOINTS ====================

export interface B2BCatalogParams {
  token?: string;
  page?: number;
  perPage?: number;
  search?: string;
  category?: string;
  sort?: string;
  minPrice?: number;
  maxPrice?: number;
}

/**
 * Get B2B Catalog Products
 */
export async function getB2BCatalog(
  paramsOrToken?: B2BCatalogParams | string,
  page: number = 1,
  perPage?: number
): Promise<B2BCatalogResponse> {
  let token: string | undefined;
  let params: B2BCatalogParams = {};

  if (typeof paramsOrToken === 'string') {
    token = paramsOrToken;
    params = { page, perPage };
  } else if (paramsOrToken && typeof paramsOrToken === 'object') {
    token = paramsOrToken.token;
    params = paramsOrToken;
  }

  const url = new URL(`${API_BASE_URL}${API_VERSION}/b2b/catalog`);
  if (params.page) url.searchParams.set('page', params.page.toString());
  if (params.perPage) url.searchParams.set('per_page', params.perPage.toString());
  if (params.search) url.searchParams.set('search', params.search);
  if (params.category) url.searchParams.set('category', params.category);
  if (params.sort) url.searchParams.set('sort', params.sort);
  if (params.minPrice !== undefined) url.searchParams.set('min_price', params.minPrice.toString());
  if (params.maxPrice !== undefined) url.searchParams.set('max_price', params.maxPrice.toString());

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: getAuthHeaders(token),
  });

  return handleResponse(response);
}

/**
 * Get B2B Categories list with product counts
 */
export async function getB2BCategories(): Promise<{ id: number; title: string; slug: string; products_count: number }[]> {
  const response = await fetch(`${API_BASE_URL}${API_VERSION}/b2b/categories`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  return handleResponse(response);
}

/**
 * Get B2B Product Details by slug
 */
export async function getB2BProductDetails(slug: string, token?: string): Promise<B2BProduct> {
  const response = await fetch(`${API_BASE_URL}${API_VERSION}/b2b/catalog/${slug}`, {
    method: 'GET',
    headers: getAuthHeaders(token),
  });

  return handleResponse(response);
}

// ==================== ACCOUNT MANAGEMENT ENDPOINTS ====================

/**
 * Switch account view between personal and business mode
 */
export async function switchAccountView(token?: string): Promise<{
  message: string;
  current_view: 'personal' | 'business';
  user: User;
}> {
  const response = await fetch(`${API_BASE_URL}${API_VERSION}/account/switch-context`, {
    method: 'POST',
    headers: getAuthHeaders(token),
  });

  return handleResponse(response);
}

/**
 * Get list of authorized buyers
 */
export async function getAuthorizedBuyers(token?: string): Promise<{
  buyers: User[];
}> {
  const response = await fetch(`${API_BASE_URL}${API_VERSION}/authorized-buyers`, {
    method: 'GET',
    headers: getAuthHeaders(token),
  });

  return handleResponse(response);
}

/**
 * Add a new authorized buyer
 */
export async function addAuthorizedBuyer(
  data: AddAuthorizedBuyerData,
  token?: string
): Promise<{
  message: string;
  buyer: User;
}> {
  const response = await fetch(`${API_BASE_URL}${API_VERSION}/authorized-buyers`, {
    method: 'POST',
    headers: getAuthHeaders(token),
    body: JSON.stringify(data),
  });

  return handleResponse(response);
}

/**
 * Delete an authorized buyer
 */
export async function deleteAuthorizedBuyer(
  buyerId: string,
  token?: string
): Promise<{
  message: string;
}> {
  const response = await fetch(`${API_BASE_URL}${API_VERSION}/authorized-buyers/${buyerId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(token),
  });

  return handleResponse(response);
}

// ==================== CART ENDPOINTS ====================

export async function getB2BCart(token?: string): Promise<B2BCartResponse> {
  const response = await fetch(`${API_BASE_URL}${API_VERSION}/cart`, {
    method: 'GET',
    headers: getAuthHeaders(token),
  });
  return handleResponse(response);
}

export async function addToB2BCart(data: AddToCartData, token?: string): Promise<AddToCartResponse> {
  const response = await fetch(`${API_BASE_URL}${API_VERSION}/cart`, {
    method: 'POST',
    headers: getAuthHeaders(token),
    body: JSON.stringify(data),
  });
  return handleResponse(response);
}

export async function updateB2BCartItem(cartItemId: number, data: UpdateCartData, token?: string): Promise<UpdateCartResponse> {
  const response = await fetch(`${API_BASE_URL}${API_VERSION}/cart/${cartItemId}`, {
    method: 'PUT',
    headers: getAuthHeaders(token),
    body: JSON.stringify(data),
  });
  return handleResponse(response);
}

export async function deleteB2BCartItem(cartItemId: number, token?: string): Promise<{ message: string }> {
  const response = await fetch(`${API_BASE_URL}${API_VERSION}/cart/${cartItemId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(token),
  });
  return handleResponse(response);
}

export async function clearB2BCart(token?: string): Promise<{ message: string }> {
  const response = await fetch(`${API_BASE_URL}${API_VERSION}/cart`, {
    method: 'DELETE',
    headers: getAuthHeaders(token),
  });
  return handleResponse(response);
}



// ==================== WISHLIST ENDPOINTS ====================

export interface B2BWishlistItem {
  id: string;
  product_id: number;
  title: string;
  slug: string;
  image: string;
  product_images?: string[];
  standard_price: number;
  trade_price: number;
  minimum_order_quantity?: number;
  category?: string;
  added_at?: string;
}

export interface B2BWishlistResponse {
  success: boolean;
  data: B2BWishlistItem[];
}

export async function getB2BWishlist(token?: string): Promise<B2BWishlistResponse> {
  const response = await fetch(`${API_BASE_URL}${API_VERSION}/wishlist`, {
    method: 'GET',
    headers: getAuthHeaders(token),
  });
  return handleResponse(response);
}

export async function addToB2BWishlist(
  productId: number,
  token?: string
): Promise<{ success: boolean; message: string; data?: any }> {
  const response = await fetch(`${API_BASE_URL}${API_VERSION}/wishlist`, {
    method: 'POST',
    headers: getAuthHeaders(token),
    body: JSON.stringify({ product_id: productId }),
  });
  return handleResponse(response);
}

export async function removeFromB2BWishlist(
  wishlistId: string,
  token?: string
): Promise<{ success: boolean; message: string }> {
  const response = await fetch(`${API_BASE_URL}${API_VERSION}/wishlist/${wishlistId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(token),
  });
  return handleResponse(response);
}

export async function moveWishlistToCart(
  wishlistId: string,
  data: { quantity?: number; size_variant?: string } = {},
  token?: string
): Promise<any> {
  const response = await fetch(
    `${API_BASE_URL}${API_VERSION}/b2b/wishlist/${wishlistId}/move-to-cart`,
    {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify(data),
    }
  );
  return handleResponse(response);
}

// ==================== SHIPPING ADDRESS ENDPOINTS ====================

export interface ShippingAddress {
  id: number;
  user_id: string;
  label?: string;
  company_name?: string;
  contact_name?: string;
  phone?: string;
  address_line_1: string;
  address_line_2?: string;
  city: string;
  state?: string;
  postal_code: string;
  country: string;
  is_default: boolean;
  delivery_instructions?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ShippingAddressData {
  label?: string;
  company_name?: string;
  contact_name?: string;
  phone?: string;
  address_line_1: string;
  address_line_2?: string;
  city: string;
  state?: string;
  postal_code: string;
  country: string;
  is_default?: boolean;
  delivery_instructions?: string;
}

export async function getShippingAddresses(token?: string): Promise<{ success: boolean; data: ShippingAddress[] }> {
  const response = await fetch(`${API_BASE_URL}${API_VERSION}/shipping-addresses`, {
    method: 'GET',
    headers: getAuthHeaders(token),
  });
  return handleResponse(response);
}

export async function addShippingAddress(data: ShippingAddressData, token?: string): Promise<{ success: boolean; message: string; data: ShippingAddress }> {
  const response = await fetch(`${API_BASE_URL}${API_VERSION}/shipping-addresses`, {
    method: 'POST',
    headers: getAuthHeaders(token),
    body: JSON.stringify(data),
  });
  return handleResponse(response);
}

export async function updateShippingAddress(id: number, data: Partial<ShippingAddressData>, token?: string): Promise<{ success: boolean; message: string; data: ShippingAddress }> {
  const response = await fetch(`${API_BASE_URL}${API_VERSION}/shipping-addresses/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(token),
    body: JSON.stringify(data),
  });
  return handleResponse(response);
}

export async function deleteShippingAddress(id: number, token?: string): Promise<{ success: boolean; message: string }> {
  const response = await fetch(`${API_BASE_URL}${API_VERSION}/shipping-addresses/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(token),
  });
  return handleResponse(response);
}

export async function setDefaultShippingAddress(id: number, token?: string): Promise<{ success: boolean; message: string; data: ShippingAddress }> {
  const response = await fetch(`${API_BASE_URL}${API_VERSION}/shipping-addresses/${id}/set-default`, {
    method: 'POST',
    headers: getAuthHeaders(token),
  });
  return handleResponse(response);
}

// ==================== UTILITY FUNCTIONS ====================

/**
 * Store authentication token and user data
 */
export function storeAuthData(token: string, user: User): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('b2b_token', token);
    localStorage.setItem('b2b_user', JSON.stringify(user));
  }
}

/**
 * Get stored authentication token
 */
export function getStoredToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('b2b_token');
  }
  return null;
}

/**
 * Get stored user data
 */
export function getStoredUser(): User | null {
  if (typeof window !== 'undefined') {
    const userData = localStorage.getItem('b2b_user');
    return userData ? JSON.parse(userData) : null;
  }
  return null;
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  return !!getStoredToken();
}

/**
 * Check if user has B2B access (approved status)
 */
export function hasB2BAccess(user: User | null): boolean {
  return user?.kyc?.status === 'approved';
}

/**
 * Check if user is business owner
 */
export function isBusinessOwner(user: User | null): boolean {
  return !!(user?.is_business_owner);
}

export async function updateUserProfile(data: { first_name: string; last_name: string; email: string }, token?: string): Promise<{ success: boolean; message: string; data?: any }> {
  const response = await fetch(`${API_BASE_URL}${API_VERSION}/profile`, {
    method: "PUT",
    headers: getAuthHeaders(token),
    body: JSON.stringify(data),
  });
  return handleResponse(response);
}

export async function changeUserPassword(data: any, token?: string): Promise<{ success: boolean; message: string }> {
  const response = await fetch(`${API_BASE_URL}${API_VERSION}/change-password`, {
    method: "PUT",
    headers: getAuthHeaders(token),
    body: JSON.stringify(data),
  });
  return handleResponse(response);
}

export async function forgotPassword(data: { email: string }): Promise<{ success: boolean; message: string }> {
  const response = await fetch(`${API_BASE_URL}${API_VERSION}/forgot-password`, {
    method: "POST",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data),
  });
  return handleResponse(response);
}

export async function resetPassword(data: any): Promise<{ success: boolean; message: string }> {
  const response = await fetch(`${API_BASE_URL}${API_VERSION}/reset-password`, {
    method: "POST",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data),
  });
  return handleResponse(response);
}

export async function getPurchaseOrders(): Promise<{ orders: any[] }> {
  const response = await fetch(`${API_BASE_URL}${API_VERSION}/b2b/orders`, {
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
}

export async function getPurchaseOrderDetails(id: string | number): Promise<{ order: any }> {
  const response = await fetch(`${API_BASE_URL}${API_VERSION}/b2b/orders/${id}`, {
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
}
