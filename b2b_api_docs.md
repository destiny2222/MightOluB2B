# Mightyolu B2B Trade Accounts - Frontend Integration Guide

This guide details all the API endpoints for B2B Registration, Login, KYC (Know Your Customer) trade applications, Cart, and Checkout flows for integrating into the Next.js frontend.

> [!TIP]
> A ready-to-import Postman Collection file is available in the root folder: [b2b_api_postman_collection.json](file:///Users/mac/Documents/unifood/b2b_api_postman_collection.json). Import it into Postman to test all endpoints. It includes a script that automatically captures your login/registration token and sets it as the `{{token}}` variable!

---

## Base Configuration & Headers

All API requests must target the `/api/v1/` prefix.

### Required Headers
* **Unauthenticated Requests**:
  ```http
  Accept: application/json
  ```
* **Authenticated Requests**:
  ```http
  Accept: application/json
  Authorization: Bearer <token>
  ```

---

## 1. Authentication Endpoints

### 1.1 B2B User Registration
Creates a new standard user account. Once registered, the user should be logged in automatically and prompted to complete their KYC profile.

* **Endpoint**: `POST /api/v1/b2b/register`
* **Headers**: `Accept: application/json`

#### Request Payload
```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "SecurePassword123!",
  "password_confirmation": "SecurePassword123!"
}
```

#### Validation Constraints
* `name`: Required, string, max 255.
* `email`: Required, valid email format, max 255. If this email belongs to an existing personal (B2C) account, the system will attempt to link it to a new B2B profile.
* `password`: Required, minimum 8 characters, must contain letters, numbers, and symbols, and match `password_confirmation`. If linking an existing personal account, this must match the existing account's password.

#### Response (201 Created)
```json
{
  "message": "Registration successful.",
  "token": "1|abCDeFGhiJklMnOpQrStUvWxYz1234567890",
  "token_type": "Bearer",
  "data": {
    "id": "019fb66f-c494-73ce-b7d6-db6a309ee12e",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "kyc_id": null,
    "is_business_owner": 0,
    "current_view": "personal",
    "created_at": "2026-07-31T04:30:05.000000Z",
    "updated_at": "2026-07-31T04:30:05.000000Z"
  }
}
```

#### Validation Errors (422 Unprocessable Content)
```json
{
  "errors": {
    "password": ["This email belongs to an existing personal account. Please enter your correct password to link it, or log in first."],
    "email": ["This email is already associated with a B2B account. Please log in."]
  }
}
```

#### Response (200 OK) - Existing Personal Account Linked
If the email already belongs to a standard personal account and the password matches, the account is linked and authenticated.
```json
{
  "message": "Account linked successfully. Please complete your B2B profile.",
  "token": "1|abCDeFGhiJklMnOpQrStUvWxYz1234567890",
  "token_type": "Bearer",
  "data": {
    "id": "019fb66f-c494-73ce-b7d6-db6a309ee12e",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "kyc_id": null,
    "is_business_owner": 0,
    "current_view": "personal"
  }
}
```

---

### 1.2 B2B User Login
Logs in an existing user and returns their profile along with B2B status.

* **Endpoint**: `POST /api/v1/b2b/login`
* **Headers**: `Accept: application/json`

#### Request Payload
```json
{
  "email": "john.doe@example.com",
  "password": "SecurePassword123!"
}
```

#### Response (200 OK)
```json
{
  "message": "Login successful.",
  "token": "2|xyZAbCDeFGhiJklMnOpQrStUvWxYz9876543210",
  "data": {
    "id": "019fb66f-c494-73ce-b7d6-db6a309ee12e",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "kyc_id": 4,
    "is_business_owner": 1,
    "current_view": "business",
    "created_at": "2026-07-31T04:30:05.000000Z",
    "updated_at": "2026-07-31T04:30:05.000000Z",
    "kyc": {
      "id": 4,
      "user_id": "019fb66f-c494-73ce-b7d6-db6a309ee12e",
      "company_name": "Acme Corp",
      "company_registration_number": "VAT-12345-67",
      "business_type": "restaurant",
      "trade_address": "123 Business Rd, London",
      "billing_contact": "John Doe",
      "estimated_monthly_order_volume": "£5,000",
      "status": "pending",
      "pricing_tier": "Wholesale Tier 1",
      "status_notes": null
    }
  }
}
```

---

### 1.3 Get User Profile and Status
Returns the logged-in user profile, current view context, and their associated KYC status details.

* **Endpoint**: `GET /api/v1/user/me`
* **Headers**: Authenticated Headers Required

#### Response (200 OK) - With KYC
```json
{
  "user": {
    "id": "019fb66f-c494-73ce-b7d6-db6a309ee12e",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "kyc_id": 5,
    "is_business_owner": 1,
    "current_view": "business",
    "created_at": "2026-07-31T04:30:05.000000Z",
    "updated_at": "2026-07-31T04:30:05.000000Z",
    "kyc": {
      "id": 5,
      "user_id": "019fb66f-c494-73ce-b7d6-db6a309ee12e",
      "company_name": "Acme Corp",
      "company_registration_number": "VAT-12345-67",
      "business_type": "restaurant",
      "trade_address": "123 Business Rd, London",
      "billing_contact": "John Doe",
      "estimated_monthly_order_volume": "£5,000",
      "status": "pending"
    }
  },
  "b2b_status": "pending",
  "current_view": "business"
}
```

#### Response (200 OK) - No KYC (e.g., Standard Personal Account)
```json
{
  "user": {
    "id": "019fb66f-c494-73ce-b7d6-db6a309ee12e",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "kyc_id": null,
    "is_business_owner": 0,
    "current_view": "personal",
    "created_at": "2026-07-31T04:30:05.000000Z",
    "updated_at": "2026-07-31T04:30:05.000000Z",
    "kyc": null
  },
  "b2b_status": "none",
  "current_view": "personal"
}
```

---

## 2. KYC (Know Your Customer) Endpoints

### 2.1 Submit KYC Details
Submits company credentials for trade account review. This must be called after the user is authenticated and has no existing KYC record.

* **Endpoint**: `POST /api/v1/kyc`
* **Headers**: Authenticated Headers Required

#### Request Payload
```json
{
  "company_name": "Acme Corp",
  "company_registration_number": "VAT-12345-67",
  "business_type": "restaurant",
  "trade_address": "123 Business Rd, London",
  "billing_contact": "John Doe",
  "estimated_monthly_order_volume": "£5,000"
}
```

#### Validation Constraints
* `company_name`: Required, string, max 255.
* `company_registration_number`: Required, alphanumeric (letters and numbers only, hyphens, and spaces allowed), between 5 and 20 characters (Regex: `/^[A-Z0-9\-\s]{5,20}$/i`).
* `business_type`: Required, must be one of: `restaurant`, `retailer`, `caterer`, `reseller`, `other`.
* `trade_address`: Required, string.
* `billing_contact`: Required, string, max 255.
* `estimated_monthly_order_volume`: Required, string, max 255.

#### Response (201 Created)
```json
{
  "message": "Your application has been received and is pending review.",
  "kyc": {
    "id": 5,
    "user_id": "019fb66f-c494-73ce-b7d6-db6a309ee12e",
    "company_name": "Acme Corp",
    "company_registration_number": "VAT-12345-67",
    "business_type": "restaurant",
    "trade_address": "123 Business Rd, London",
    "billing_contact": "John Doe",
    "estimated_monthly_order_volume": "£5,000",
    "status": "pending",
    "created_at": "2026-07-31T04:40:00.000000Z",
    "updated_at": "2026-07-31T04:40:00.000000Z"
  },
  "user": {
    "id": "019fb66f-c494-73ce-b7d6-db6a309ee12e",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "kyc_id": 5,
    "is_business_owner": 1,
    "current_view": "business",
    "kyc": {
      "id": 5,
      "user_id": "019fb66f-c494-73ce-b7d6-db6a309ee12e",
      "company_name": "Acme Corp",
      "company_registration_number": "VAT-12345-67",
      "business_type": "restaurant",
      "status": "pending"
    }
  }
}
```

#### Error Responses
* **400 Bad Request** (Already associated with B2B):
  ```json
  {
    "error": "You are already associated with a B2B trade account."
  }
  ```
* **422 Unprocessable Content** (Validation failed):
  ```json
  {
    "errors": {
      "company_registration_number": [
        "The company/VAT number format is invalid. It should be alphanumeric, between 5 and 20 characters."
      ]
    }
  }
  ```

---

### 2.2 Resubmit KYC Details
Resubmits a rejected or info-requested B2B KYC application with corrected details.

* **Endpoint**: `POST /api/v1/resubmit`
* **Headers**: Authenticated Headers Required

#### Request Payload
Same fields and validation constraints as **Submit KYC Details** (Section 2.1).

#### Response (200 OK)
```json
{
  "message": "Your application has been successfully updated and resubmitted for review.",
  "kyc": {
    "id": 5,
    "user_id": "019fb66f-c494-73ce-b7d6-db6a309ee12e",
    "company_name": "Acme Corp Updated",
    "company_registration_number": "VAT-12345-67",
    "business_type": "restaurant",
    "trade_address": "123 Business Rd, London",
    "billing_contact": "John Doe",
    "estimated_monthly_order_volume": "£5,000",
    "status": "pending",
    "status_notes": null,
    "updated_at": "2026-08-01T09:00:00.000000Z"
  }
}
```

---

### 2.3 Get Business Profile
Retrieves the logged-in user profile loaded with B2B KYC details.

* **Endpoint**: `GET /api/v1/profile`
* **Headers**: Authenticated Headers Required

#### Response (200 OK)
```json
{
  "user": {
    "id": "019fb66f-c494-73ce-b7d6-db6a309ee12e",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "kyc_id": 5,
    "is_business_owner": 1,
    "current_view": "business",
    "kyc": {
      "id": 5,
      "company_name": "Acme Corp",
      "company_registration_number": "VAT-12345-67",
      "business_type": "restaurant",
      "trade_address": "123 Business Rd, London",
      "billing_contact": "John Doe",
      "estimated_monthly_order_volume": "£5,000",
      "status": "approved",
      "pricing_tier": "Wholesale Tier 1"
    }
  }
}
```

---

### 2.4 Update Business Profile
Allows approved business account owners to update specific business contact information.

* **Endpoint**: `PUT /api/v1/profile`
* **Headers**: Authenticated Headers Required

#### Request Payload
```json
{
  "company_name": "Acme Corp Updated",
  "trade_address": "456 Main St, London",
  "billing_contact": "Johnathan Doe"
}
```

#### Response (200 OK)
```json
{
  "message": "Business details updated successfully.",
  "kyc": {
    "id": 5,
    "company_name": "Acme Corp Updated",
    "trade_address": "456 Main St, London",
    "billing_contact": "Johnathan Doe",
    "status": "approved"
  }
}
```

#### Error Responses
* **403 Forbidden** (Not approved or not owner):
  ```json
  {
    "error": "Only approved business accounts can update details."
  }
  ```

---

### 2.5 Switch Account View Context
Allows B2B trade account holders to toggle their view mode between standard retail (`personal`) and wholesale (`business`).

* **Endpoint**: `POST /api/v1/account/switch-context` (or `POST /api/v1/switch-view`)
* **Headers**: Authenticated Headers Required

#### Response (200 OK)
```json
{
  "message": "Switched view to business mode successfully.",
  "current_view": "business",
  "user": {
    "id": "019fb66f-c494-73ce-b7d6-db6a309ee12e",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "kyc_id": 5,
    "current_view": "business",
    "kyc": {
      "id": 5,
      "status": "approved"
    }
  }
}
```

---

## 3. Authorized Buyers Management

Authorized buyers are additional user logins tied to the main approved B2B business account. Only the business owner can manage these buyers.

### 3.1 Get Authorized Buyers
* **Endpoint**: `GET /api/v1/authorized-buyers`
* **Headers**: Authenticated Headers Required

#### Response (200 OK)
```json
{
  "buyers": [
    {
      "id": "019fb77f-d123-74cf-a8e6-db6a309ff21a",
      "name": "Jane Smith",
      "email": "jane.smith@example.com",
      "kyc_id": 5,
      "is_business_owner": 0,
      "current_view": "business"
    }
  ]
}
```

---

### 3.2 Add Authorized Buyer
Creates an additional login that inherits the same business KYC ID.

* **Endpoint**: `POST /api/v1/authorized-buyers`
* **Headers**: Authenticated Headers Required

#### Request Payload
```json
{
  "name": "Jane Smith",
  "email": "jane.smith@example.com",
  "password": "SecurePassword987!",
  "password_confirmation": "SecurePassword987!"
}
```

#### Response (201 Created)
```json
{
  "message": "Authorized buyer added successfully.",
  "buyer": {
    "id": "019fb77f-d123-74cf-a8e6-db6a309ff21a",
    "name": "Jane Smith",
    "email": "jane.smith@example.com",
    "kyc_id": 5,
    "is_business_owner": false,
    "current_view": "business"
  }
}
```

#### Error Responses
* **403 Forbidden** (If the account is not approved or caller is not owner):
  ```json
  {
    "error": "Only the business account owner can add authorized buyers."
  }
  ```

---

## 4. B2B Cart Management

The B2B cart operates independently for B2B products (products where `is_b2b` is true). Accessing these endpoints requires an **approved** B2B status.

### 4.1 Get B2B Cart
* **Endpoint**: `GET /api/v1/cart`
* **Headers**: Authenticated Headers Required

#### Response (200 OK)
```json
{
  "items": [
    {
      "id": 12,
      "product_id": 42,
      "product_title": "Wholesale Cooking Oil 20L",
      "product_slug": "wholesale-cooking-oil-20l",
      "product_image": ["oil_img.png"],
      "quantity": 10,
      "price": 25.5,
      "subtotal": 255.0,
      "size": "20L",
      "category_name": "Ingredients"
    }
  ],
  "total_price": 255.0,
  "total_quantity": 10
}
```

---

### 4.2 Add Product to B2B Cart
Adds a B2B product or variant to the cart. It automatically validates against minimum order quantities.

* **Endpoint**: `POST /api/v1/cart`
* **Headers**: Authenticated Headers Required

#### Request Payload
```json
{
  "product_id": 42,
  "quantity": 10,
  "size_variant": "20L"
}
```

#### Validation Constraints
* `product_id`: Required, integer, must exist in products table.
* `quantity`: Optional, minimum 1.
* `size_variant`: Optional, string matching a product variant size.

#### Response (201 Created)
```json
{
  "message": "Product added to B2B cart.",
  "cart_item": {
    "id": 12,
    "user_id": "019fb66f-c494-73ce-b7d6-db6a309ee12e",
    "product_id": 42,
    "quantity": 10,
    "size": "20L",
    "price": "25.50",
    "created_at": "2026-08-01T10:00:00.000000Z",
    "updated_at": "2026-08-01T10:00:00.000000Z"
  }
}
```

#### Error Responses
* **400 Bad Request** (Under MOQ):
  ```json
  {
    "error": "This product has a minimum order quantity of 10. You must select at least 10 units."
  }
  ```

---

### 4.3 Update Cart Item Quantity
* **Endpoint**: `PUT /api/v1/cart/{cart_item_id}`
* **Headers**: Authenticated Headers Required

#### Request Payload
```json
{
  "quantity": 15
}
```

#### Response (200 OK)
```json
{
  "message": "Cart updated successfully.",
  "cart_item": {
    "id": 12,
    "quantity": 15,
    "price": "25.50"
  }
}
```

---

### 4.4 Delete Cart Item
* **Endpoint**: `DELETE /api/v1/cart/{cart_item_id}`
* **Headers**: Authenticated Headers Required

#### Response (200 OK)
```json
{
  "message": "Cart item removed successfully."
}
```

---

### 4.5 Clear Cart
Removes all B2B items from the user's cart.

* **Endpoint**: `DELETE /api/v1/cart`
* **Headers**: Authenticated Headers Required

#### Response (200 OK)
```json
{
  "message": "B2B cart cleared successfully."
}
```

---

## 5. B2B Checkout Flow

Approved trade account holders checkout through a structured multi-step flow using their saved shipping details and Stripe payments.

### 5.1 Get Checkout Details
Retrieves current items, shipping addresses, available rates based on weight, and price calculations.

* **Endpoint**: `GET /api/v1/checkout`
* **Headers**: Authenticated Headers Required

#### Response (200 OK)
```json
{
  "cart_items": [
    {
      "id": 12,
      "product_title": "Wholesale Cooking Oil 20L",
      "quantity": 10,
      "price": 25.5,
      "subtotal": 255.0,
      "size": "20L"
    }
  ],
  "shipping_addresses": [
    {
      "id": 8,
      "address": "123 Business Rd",
      "city": "London",
      "state": "England",
      "country": "UK",
      "postal_code": "EC1A 1BB",
      "is_default": true
    }
  ],
  "shipping_rates": [
    {
      "id": 1,
      "delivery_type": "Standard Wholesale Delivery",
      "price": 15.0,
      "weight_from": 0,
      "weight_to": 500
    }
  ],
  "total_weight": 200.0,
  "subtotal": 255.0,
  "delivery_fee": 15.0,
  "total_price": 270.0
}
```

---

### 5.2 Process Checkout
Initiates an order invoice, logs items, and returns a Stripe payment url.

* **Endpoint**: `POST /api/v1/checkout`
* **Headers**: Authenticated Headers Required

#### Request Payload
```json
{
  "ship-address": "default",
  "address": "123 Business Rd",
  "city": "London",
  "state": "England",
  "country": "UK",
  "postal_code": "EC1A 1BB",
  "shipping_rate_id": 1,
  "success_url": "https://frontend.mightyolu.com/checkout/success?session_id={CHECKOUT_SESSION_ID}",
  "cancel_url": "https://frontend.mightyolu.com/checkout/cancel"
}
```

#### Response (200 OK)
```json
{
  "message": "Order initiated successfully.",
  "invoice_number": "INV-20260803-912A",
  "stripe_checkout_url": "https://checkout.stripe.com/c/pay/cs_test_..."
}
```

---

## 6. Frontend Integration Guidelines

1. **State Handling (`current_view`)**:
   * Inspect the `data.current_view` parameter (from registration/login) or `user.current_view` (from `/user/me`).
   * When `current_view` is `'business'`, show wholesale pricing, minimum order quantities, and B2B products.
   * Toggle between personal and business mode by calling the view context switch endpoint.
2. **KYC Registration Redirection**:
   * Once a new user registers via `/b2b/register`, the `kyc_id` will be `null`.
   * **Guideline**: The frontend should automatically route the user to `/b2b/kyc-setup` to fill in company registration details.
3. **Approved Checkout block**:
   * If a user's B2B status is `'pending'`, `'rejected'`, or `'info_requested'`, checkout endpoints return a `403 Forbidden` response. Ensure your UI informs the user and prevents clicking "Checkout".
7. **Token Handling**:
   * Store the token response and send it under the `Authorization: Bearer <token>` header for all authenticated endpoints.

---

## 7. B2B Product Catalog

The B2B Product Catalog provides trade pricing and volume discount details dynamically resolved based on the logged-in user's approved KYC pricing tier.

### 7.1 Get All B2B Products
Fetches a paginated list of all products configured for B2B, along with the user's specific trade pricing and minimum order quantities.

* **Endpoint**: `GET /api/v1/b2b/catalog`
* **Headers**: Authenticated Headers Required (`b2b.approved` middleware protects this route)

#### Response (200 OK)
```json
{
  "current_page": 1,
  "data": [
    {
      "id": 42,
      "title": "Commercial Cooking Oil 20L",
      "slug": "commercial-cooking-oil-20l",
      "images": ["b2b-product-3.jpg"],
      "standard_price": 189.57,
      "trade_price": 170.61,
      "minimum_order_quantity": 10,
      "has_volume_discounts": true
    }
  ],
  "first_page_url": "http://localhost:8000/api/v1/b2b/catalog?page=1",
  "from": 1,
  "last_page": 2,
  "last_page_url": "http://localhost:8000/api/v1/b2b/catalog?page=2",
  "links": [...],
  "next_page_url": "http://localhost:8000/api/v1/b2b/catalog?page=2",
  "path": "http://localhost:8000/api/v1/b2b/catalog",
  "per_page": 15,
  "prev_page_url": null,
  "to": 15,
  "total": 23
}
```

---

### 7.2 Get B2B Product Details
Retrieves detailed information for a specific B2B product, including a breakdown of available volume discounts.

* **Endpoint**: `GET /api/v1/b2b/catalog/{slug}`
* **Headers**: Authenticated Headers Required (`b2b.approved` middleware protects this route)

#### Response (200 OK)
```json
{
  "id": 42,
  "title": "Commercial Cooking Oil 20L",
  "slug": "commercial-cooking-oil-20l",
  "description": "Perfect for restaurants and catering businesses.",
  "images": ["b2b-product-3.jpg"],
  "category": "Wholesale Produce",
  "standard_price": 189.57,
  "trade_price": 170.61,
  "minimum_order_quantity": 10,
  "volume_discounts": [
    {
      "minimum_quantity": 20,
      "discount_percentage": 5.0
    },
    {
      "minimum_quantity": 50,
      "discount_percentage": 10.0
    },
    {
      "minimum_quantity": 100,
      "discount_percentage": 15.0
    }
  ]
}
```

#### Error Responses
* **404 Not Found** (If the product does not exist or `is_b2b` is false):
  ```json
  {
    "message": "Product not found or not available for B2B"
  }
  ```
* **403 Forbidden** (If the user's KYC status is not approved):
  ```json
  {
    "message": "Your B2B application is pending or unapproved. Trade catalog access is restricted."
  }
  ```
