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
  company_name: string;
  company_registration_number: string;
  business_type: 'restaurant' | 'retailer' | 'caterer' | 'reseller' | 'other';
  trade_address: string;
  billing_contact: string;
  estimated_monthly_order_volume: string;
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
  user_id: string;
  company_name: string;
  company_registration_number: string;
  business_type: string;
  trade_address: string;
  billing_contact: string;
  estimated_monthly_order_volume: string;
  status: 'pending' | 'approved' | 'rejected' | 'info_requested';
  pricing_tier?: string;
  status_notes?: string;
  created_at: string;
  updated_at: string;
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
const getAuthHeaders = (token?: string | null): HeadersInit => {
  const headers: HeadersInit = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  };

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
 */
export async function submitKYC(data: KYCData, token?: string): Promise<{
  message: string;
  kyc: KYC;
  user: User;
}> {
  const response = await fetch(`${API_BASE_URL}${API_VERSION}/kyc`, {
    method: 'POST',
    headers: getAuthHeaders(token),
    body: JSON.stringify(data),
  });

  return handleResponse(response);
}

/**
 * Resubmit KYC details after rejection or info request
 */
export async function resubmitKYC(data: KYCData, token?: string): Promise<{
  message: string;
  kyc: KYC;
}> {
  const response = await fetch(`${API_BASE_URL}${API_VERSION}/resubmit`, {
    method: 'POST',
    headers: getAuthHeaders(token),
    body: JSON.stringify(data),
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

/**
 * Get B2B Catalog Products
 */
export async function getB2BCatalog(token?: string, page: number = 1): Promise<B2BCatalogResponse> {
  const response = await fetch(`${API_BASE_URL}${API_VERSION}/b2b/catalog?page=${page}`, {
    method: 'GET',
    headers: getAuthHeaders(token),
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

export async function deleteB2BCartItem(cartItemId: number, token?: string): Promise<{message: string}> {
  const response = await fetch(`${API_BASE_URL}${API_VERSION}/cart/${cartItemId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(token),
  });
  return handleResponse(response);
}

export async function clearB2BCart(token?: string): Promise<{message: string}> {
  const response = await fetch(`${API_BASE_URL}${API_VERSION}/cart`, {
    method: 'DELETE',
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
