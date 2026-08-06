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
  "size_variant": "20L",
  "product_variant_id": 1
}
```

#### Validation Constraints
* `product_id`: Required, integer, must exist in products table.
* `quantity`: Optional, minimum 1.
* `size_variant`: Optional, string matching a product variant size.
* `product_variant_id`: Optional, integer, must exist in product_variants table.

#### Response (201 Created)
```json
{
  "message": "Product added to B2B cart.",
  "cart_item": {
    "id": 12,
    "user_id": "019fb66f-c494-73ce-b7d6-db6a309ee12e",
    "product_id": 42,
    "product_variant_id": 1,
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
      "product_id": 42,
      "product_title": "Wholesale Cooking Oil 20L",
      "quantity": 10,
      "price": 25.5,
      "subtotal": 255.0,
      "size": "20L",
      "variant_id": null
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
  "total_price": 270.0,
  "credit_limit": 5000.0,
  "unpaid_balance": 1500.0,
  "available_credit": 3500.0
}
```

---

### 5.2 Process Checkout
Creates a purchase order and handles payment processing (Stripe checkout session for card payment or credit deduction for on_account payment).

* **Endpoint**: `POST /api/v1/checkout`
* **Headers**: Authenticated Headers Required

#### Request Payload
```json
{
  "payment_method": "card",
  "po_number": "PO-998811",
  "ship-address": "default",
  "address": "123 Business Rd",
  "city": "London",
  "state": "England",
  "country": "UK",
  "postal_code": "EC1A 1BB",
  "shipping_rate_id": 1,
  "schedule_frequency": "monthly",
  "success_url": "https://frontend.mightyolu.com/checkout/success?session_id={CHECKOUT_SESSION_ID}",
  "cancel_url": "https://frontend.mightyolu.com/checkout/cancel"
}
```

#### Validation Constraints
* `payment_method`: Required, string, must be one of: `card`, `on_account`.
* `po_number`: Optional, string, max 255.
* `ship-address`: Required, string.
* `address`: Optional, string, max 255.
* `city`: Required, string, max 255.
* `state`: Required, string, max 255.
* `country`: Required, string, max 255.
* `postal_code`: Required, string, max 10.
* `shipping_rate_id`: Required, integer, must exist in shipping_rates table.
* `schedule_frequency`: Optional, string, must be one of: `weekly`, `monthly`.
* `success_url`: Optional, url string.
* `cancel_url`: Optional, url string.

#### Response (201 Created)
```json
{
  "message": "Purchase Order submitted successfully.",
  "order": {
    "id": 15,
    "po_number": "PO-998811",
    "internal_reference": "PO-ABCD1234",
    "kyc_id": 5,
    "user_id": "019fb66f-c494-73ce-b7d6-db6a309ee12e",
    "status": "Submitted",
    "payment_method": "card",
    "total_amount": 270.0,
    "shipping_amount": 15.0,
    "is_draft": false,
    "is_recurring": true,
    "created_at": "2026-08-01T12:00:00.000000Z",
    "items": [
      {
        "id": 30,
        "purchase_order_id": 15,
        "product_id": 42,
        "product_variant_id": null,
        "quantity": 10,
        "unit_price": 25.5
      }
    ]
  },
  "checkout_url": "https://checkout.stripe.com/c/pay/cs_test_..."
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
Fetches a paginated list of all products configured for B2B.

* **Endpoint**: `GET /api/v1/b2b/catalog`
* **Headers**: Unauthenticated / Public endpoint (will dynamically resolve trade prices if authenticated via Sanctum)

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
Retrieves detailed information for a specific B2B product.

* **Endpoint**: `GET /api/v1/b2b/catalog/{slug}`
* **Headers**: Unauthenticated / Public endpoint (will dynamically resolve trade prices if authenticated via Sanctum)

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

---

## 8. B2B Shipping Addresses Management

B2B users can manage multiple shipping addresses. Authenticated headers are required, and the user must be an approved B2B user.

### 8.1 List Shipping Addresses
* **Endpoint**: `GET /api/v1/shipping-addresses`
* **Headers**: Authenticated Headers Required

#### Response (200 OK)
```json
{
  "success": true,
  "data": [
    {
      "id": 8,
      "user_id": "019fb66f-c494-73ce-b7d6-db6a309ee12e",
      "label": "Warehouse Alpha",
      "company_name": "Acme Food Services Ltd",
      "contact_name": "John Doe",
      "phone": "+447700900077",
      "address_line_1": "Unit 4, Industrial Park",
      "address_line_2": "Canning Road",
      "city": "London",
      "state": "England",
      "postal_code": "E15 3ND",
      "country": "UK",
      "is_default": true,
      "delivery_instructions": "Access via back gate after 8 AM.",
      "created_at": "2026-08-01T11:00:00.000000Z",
      "updated_at": "2026-08-01T11:00:00.000000Z"
    }
  ]
}
```

---

### 8.2 Add Shipping Address
Creates a new shipping address for the B2B user.

* **Endpoint**: `POST /api/v1/shipping-addresses`
* **Headers**: Authenticated Headers Required

#### Request Payload
```json
{
  "label": "Warehouse Beta",
  "company_name": "Acme Food Services Ltd",
  "contact_name": "Jane Doe",
  "phone": "+447700900088",
  "address_line_1": "12 East Side Ave",
  "address_line_2": "Suite B",
  "city": "London",
  "state": "England",
  "postal_code": "E16 4PF",
  "country": "UK",
  "is_default": false,
  "delivery_instructions": "Leave with reception."
}
```

#### Validation Constraints
* `label`: Optional, string, max 100.
* `company_name`: Optional, string, max 255.
* `contact_name`: Optional, string, max 255.
* `phone`: Optional, string, max 30.
* `address_line_1`: Required, string, max 255.
* `address_line_2`: Optional, string, max 255.
* `city`: Required, string, max 255.
* `state`: Optional, string, max 255.
* `postal_code`: Required, string, max 20.
* `country`: Required, string, max 100.
* `is_default`: Optional, boolean.
* `delivery_instructions`: Optional, string, max 500.

#### Response (201 Created)
```json
{
  "success": true,
  "message": "Shipping address created successfully.",
  "data": {
    "id": 9,
    "user_id": "019fb66f-c494-73ce-b7d6-db6a309ee12e",
    "label": "Warehouse Beta",
    "company_name": "Acme Food Services Ltd",
    "contact_name": "Jane Doe",
    "phone": "+447700900088",
    "address_line_1": "12 East Side Ave",
    "address_line_2": "Suite B",
    "city": "London",
    "state": "England",
    "postal_code": "E16 4PF",
    "country": "UK",
    "is_default": false,
    "delivery_instructions": "Leave with reception.",
    "created_at": "2026-08-04T22:00:00.000000Z",
    "updated_at": "2026-08-04T22:00:00.000000Z"
  }
}
```

---

### 8.3 Get Shipping Address
Retrieves a specific shipping address by ID.

* **Endpoint**: `GET /api/v1/shipping-addresses/{id}`
* **Headers**: Authenticated Headers Required

#### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "id": 9,
    "user_id": "019fb66f-c494-73ce-b7d6-db6a309ee12e",
    "label": "Warehouse Beta",
    "company_name": "Acme Food Services Ltd",
    "contact_name": "Jane Doe",
    "phone": "+447700900088",
    "address_line_1": "12 East Side Ave",
    "address_line_2": "Suite B",
    "city": "London",
    "state": "England",
    "postal_code": "E16 4PF",
    "country": "UK",
    "is_default": false,
    "delivery_instructions": "Leave with reception."
  }
}
```

---

### 8.4 Update Shipping Address
Updates an existing shipping address.

* **Endpoint**: `PUT /api/v1/shipping-addresses/{id}`
* **Headers**: Authenticated Headers Required

#### Request Payload
```json
{
  "label": "Warehouse Beta Revised",
  "contact_name": "Jane Smith",
  "is_default": true
}
```

#### Response (200 OK)
```json
{
  "success": true,
  "message": "Shipping address updated successfully.",
  "data": {
    "id": 9,
    "user_id": "019fb66f-c494-73ce-b7d6-db6a309ee12e",
    "label": "Warehouse Beta Revised",
    "company_name": "Acme Food Services Ltd",
    "contact_name": "Jane Smith",
    "phone": "+447700900088",
    "address_line_1": "12 East Side Ave",
    "address_line_2": "Suite B",
    "city": "London",
    "state": "England",
    "postal_code": "E16 4PF",
    "country": "UK",
    "is_default": true,
    "delivery_instructions": "Leave with reception."
  }
}
```

---

### 8.5 Delete Shipping Address
* **Endpoint**: `DELETE /api/v1/shipping-addresses/{id}`
* **Headers**: Authenticated Headers Required

#### Response (200 OK)
```json
{
  "success": true,
  "message": "Shipping address deleted successfully."
}
```

---

### 8.6 Set Default Shipping Address
* **Endpoint**: `POST /api/v1/shipping-addresses/{id}/set-default`
* **Headers**: Authenticated Headers Required

#### Response (200 OK)
```json
{
  "success": true,
  "message": "Default shipping address updated.",
  "data": {
    "id": 9,
    "user_id": "019fb66f-c494-73ce-b7d6-db6a309ee12e",
    "is_default": true
  }
}
```

---

## 9. B2B Wishlist Management

Provides trade accounts with the ability to save items and later move them directly into their wholesale cart. Access requires an **approved** B2B trade account.

### 9.1 Get Wishlist Items
* **Endpoint**: `GET /api/v1/wishlist`
* **Headers**: Authenticated Headers Required

#### Response (200 OK)
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "product_id": 42,
      "title": "Commercial Cooking Oil 20L",
      "slug": "commercial-cooking-oil-20l",
      "image": "b2b-product-3.jpg",
      "product_images": ["b2b-product-3.jpg"],
      "standard_price": 189.57,
      "trade_price": 170.61,
      "minimum_order_quantity": 10,
      "category": "Wholesale Produce",
      "added_at": "2026-08-05T01:00:00.000000Z"
    }
  ]
}
```

---

### 9.2 Add Product to Wishlist
Adds a B2B product to the user's wishlist.

* **Endpoint**: `POST /api/v1/wishlist`
* **Headers**: Authenticated Headers Required

#### Request Payload
```json
{
  "product_id": 42
}
```

#### Validation Constraints
* `product_id`: Required, integer, must exist in products table, must be a B2B product (`is_b2b = true`), and must not already be in the wishlist.

#### Response (201 Created)
```json
{
  "success": true,
  "message": "Product added to B2B wishlist.",
  "data": {
    "id": 1,
    "user_id": "019fb66f-c494-73ce-b7d6-db6a309ee12e",
    "product_id": 42,
    "created_at": "2026-08-05T01:00:00.000000Z"
  }
}
```

---

### 9.3 Remove Product from Wishlist
* **Endpoint**: `DELETE /api/v1/wishlist/{id}`
* **Headers**: Authenticated Headers Required

#### Response (200 OK)
```json
{
  "success": true,
  "message": "Product removed from B2B wishlist."
}
```

---

### 9.4 Move Wishlist Item to B2B Cart
Removes the item from the wishlist and places it in the B2B cart, using specified quantity and variant configuration.

* **Endpoint**: `POST /api/v1/wishlist/{id}/move-to-cart`
* **Headers**: Authenticated Headers Required

#### Request Payload
```json
{
  "quantity": 10,
  "size_variant": "20L",
  "product_variant_id": 1
}
```

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
    "unit_price": 170.61
  }
}
```

---

## 10. Request For Quotation (RFQ)

For items or volumes not in the catalog, or custom supply needs, trade users can submit an RFQ.

### 10.1 Submit RFQ
* **Endpoint**: `POST /api/v1/b2b/rfq`
* **Headers**: Authenticated Headers Required

#### Request Payload
```json
{
  "items": [
    {
      "product_id": 42,
      "product_variant_id": null,
      "quantity": 150
    }
  ],
  "delivery_frequency": "weekly",
  "notes": "Looking for a weekly contract of commercial oil."
}
```

#### Validation Constraints
* `items`: Required, array, minimum 1 item.
* `items.*.product_id`: Required, must exist in products.
* `items.*.product_variant_id`: Optional, must exist in product_variants.
* `items.*.quantity`: Required, integer, minimum 1.
* `delivery_frequency`: Optional, string, one of: `one-off`, `weekly`, `monthly`.
* `notes`: Optional, string.

#### Response (201 Created)
```json
{
  "message": "RFQ submitted successfully.",
  "rfq": {
    "id": 3,
    "reference_number": "RFQ-ABCDEFGH",
    "kyc_id": 5,
    "user_id": "019fb66f-c494-73ce-b7d6-db6a309ee12e",
    "status": "Pending",
    "delivery_frequency": "weekly",
    "notes": "Looking for a weekly contract of commercial oil.",
    "created_at": "2026-08-05T02:00:00.000000Z",
    "items": [
      {
        "id": 6,
        "rfq_id": 3,
        "product_id": 42,
        "product_variant_id": null,
        "quantity": 150
      }
    ]
  }
}
```

---

### 10.2 List RFQs
Retrieves submitted RFQs for the current B2B account.

* **Endpoint**: `GET /api/v1/b2b/rfq`
* **Headers**: Authenticated Headers Required

#### Response (200 OK)
```json
{
  "rfqs": [
    {
      "id": 3,
      "reference_number": "RFQ-ABCDEFGH",
      "kyc_id": 5,
      "status": "Pending",
      "delivery_frequency": "weekly",
      "notes": "Looking for a weekly contract of commercial oil.",
      "created_at": "2026-08-05T02:00:00.000000Z"
    }
  ]
}
```

---

### 10.3 View RFQ
Retrieves a specific RFQ.

* **Endpoint**: `GET /api/v1/b2b/rfq/{id}`
* **Headers**: Authenticated Headers Required

#### Response (200 OK)
```json
{
  "rfq": {
    "id": 3,
    "reference_number": "RFQ-ABCDEFGH",
    "kyc_id": 5,
    "user_id": "019fb66f-c494-73ce-b7d6-db6a309ee12e",
    "status": "Pending",
    "delivery_frequency": "weekly",
    "notes": "Looking for a weekly contract of commercial oil.",
    "items": [
      {
        "id": 6,
        "product_id": 42,
        "quantity": 150
      }
    ]
  }
}
```

---

### 10.4 Update RFQ Status (Customer Actions)
Allows customers to accept, decline, or request changes on a Quoted RFQ.

* **Endpoint**: `PUT /api/v1/b2b/rfq/{id}/status`
* **Headers**: Authenticated Headers Required

#### Request Payload
```json
{
  "action": "request_changes",
  "comment": "Can we reduce unit price by 2%?"
}
```

#### Validation Constraints
* `action`: Required, string, must be one of: `accept`, `decline`, `request_changes`.
* `comment`: Optional, string.

#### Response (200 OK)
```json
{
  "message": "RFQ status updated successfully.",
  "rfq": {
    "id": 3,
    "status": "Pending",
    "notes": "Looking for a weekly contract of commercial oil.\n\nChanges requested: Can we reduce unit price by 2%?"
  }
}
```

---

## 11. Purchase Orders (PO) & Recurring Schedules

Enables submitting wholesale orders directly via cards or credited on-account balances, as well as managing recurring schedule setups.

### 11.1 Submit Purchase Order
* **Endpoint**: `POST /api/v1/b2b/orders`
* **Headers**: Authenticated Headers Required

#### Request Payload
```json
{
  "po_number": "PO-9911A",
  "payment_method": "on_account",
  "items": [
    {
      "product_id": 42,
      "product_variant_id": null,
      "quantity": 20,
      "unit_price": 170.61
    }
  ],
  "schedule_frequency": "monthly"
}
```

#### Validation Constraints
* `po_number`: Optional, string, max 255.
* `payment_method`: Required, string, one of: `card`, `on_account`.
* `items`: Required, array, minimum 1.
* `items.*.product_id`: Required, exists in products.
* `items.*.product_variant_id`: Optional, exists in product_variants.
* `items.*.quantity`: Required, integer, minimum 1.
* `items.*.unit_price`: Required, numeric, minimum 0.
* `schedule_frequency`: Optional, string, one of: `weekly`, `monthly`.

#### Response (201 Created)
```json
{
  "message": "Purchase Order submitted successfully.",
  "order": {
    "id": 16,
    "po_number": "PO-9911A",
    "internal_reference": "PO-XYZ12345",
    "kyc_id": 5,
    "user_id": "019fb66f-c494-73ce-b7d6-db6a309ee12e",
    "status": "Submitted",
    "payment_method": "on_account",
    "total_amount": 3412.20,
    "is_draft": false,
    "is_recurring": true,
    "created_at": "2026-08-05T03:00:00.000000Z",
    "items": [
      {
        "id": 31,
        "product_id": 42,
        "quantity": 20,
        "unit_price": 170.61
      }
    ]
  },
  "checkout_url": null
}
```

---

### 11.2 List Purchase Orders
* **Endpoint**: `GET /api/v1/b2b/orders`
* **Headers**: Authenticated Headers Required

#### Response (200 OK)
```json
{
  "orders": [
    {
      "id": 16,
      "po_number": "PO-9911A",
      "internal_reference": "PO-XYZ12345",
      "total_amount": 3412.20,
      "status": "Submitted",
      "payment_method": "on_account",
      "created_at": "2026-08-05T03:00:00.000000Z"
    }
  ]
}
```

---

### 11.3 Show Purchase Order Details
* **Endpoint**: `GET /api/v1/b2b/orders/{id}`
* **Headers**: Authenticated Headers Required

#### Response (200 OK)
```json
{
  "order": {
    "id": 16,
    "po_number": "PO-9911A",
    "internal_reference": "PO-XYZ12345",
    "status": "Submitted",
    "payment_method": "on_account",
    "total_amount": 3412.20,
    "items": [
      {
        "id": 31,
        "product_id": 42,
        "quantity": 20,
        "unit_price": 170.61
      }
    ]
  }
}
```

---

### 11.4 Setup Recurring Schedule
Binds an existing PO to a weekly or monthly replenishment cycle.

* **Endpoint**: `POST /api/v1/b2b/orders/{id}/recurring`
* **Headers**: Authenticated Headers Required

#### Request Payload
```json
{
  "frequency": "weekly"
}
```

#### Validation Constraints
* `frequency`: Required, string, one of: `weekly`, `monthly`.

#### Response (200 OK)
```json
{
  "message": "Recurring schedule updated."
}
```

---

### 11.5 Get Order Drafts
Retrieves draft orders automatically prepared by recurring schedules that require review.

* **Endpoint**: `GET /api/v1/b2b/orders/drafts`
* **Headers**: Authenticated Headers Required

#### Response (200 OK)
```json
{
  "drafts": [
    {
      "id": 17,
      "po_number": null,
      "internal_reference": "PO-DRAFT88",
      "total_amount": 3412.20,
      "is_draft": true,
      "status": "Draft",
      "created_at": "2026-08-05T04:00:00.000000Z"
    }
  ]
}
```

---

### 11.6 Approve Order Draft
Publishes a draft order to active submitted status.

* **Endpoint**: `POST /api/v1/b2b/orders/{id}/approve`
* **Headers**: Authenticated Headers Required

#### Response (200 OK)
```json
{
  "message": "Draft approved and submitted.",
  "order": {
    "id": 17,
    "is_draft": false,
    "status": "Submitted"
  }
}
```


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
  "size_variant": "20L",
  "product_variant_id": 1
}
```

#### Validation Constraints
* `product_id`: Required, integer, must exist in products table.
* `quantity`: Optional, minimum 1.
* `size_variant`: Optional, string matching a product variant size.
* `product_variant_id`: Optional, integer, must exist in product_variants table.

#### Response (201 Created)
```json
{
  "message": "Product added to B2B cart.",
  "cart_item": {
    "id": 12,
    "user_id": "019fb66f-c494-73ce-b7d6-db6a309ee12e",
    "product_id": 42,
    "product_variant_id": 1,
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
      "product_id": 42,
      "product_title": "Wholesale Cooking Oil 20L",
      "quantity": 10,
      "price": 25.5,
      "subtotal": 255.0,
      "size": "20L",
      "variant_id": null
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
  "total_price": 270.0,
  "credit_limit": 5000.0,
  "unpaid_balance": 1500.0,
  "available_credit": 3500.0
}
```

---

### 5.2 Process Checkout
Creates a purchase order and handles payment processing (Stripe checkout session for card payment or credit deduction for on_account payment).

* **Endpoint**: `POST /api/v1/checkout`
* **Headers**: Authenticated Headers Required

#### Request Payload
```json
{
  "payment_method": "card",
  "po_number": "PO-998811",
  "ship-address": "default",
  "address": "123 Business Rd",
  "city": "London",
  "state": "England",
  "country": "UK",
  "postal_code": "EC1A 1BB",
  "shipping_rate_id": 1,
  "schedule_frequency": "monthly",
  "success_url": "https://frontend.mightyolu.com/checkout/success?session_id={CHECKOUT_SESSION_ID}",
  "cancel_url": "https://frontend.mightyolu.com/checkout/cancel"
}
```

#### Validation Constraints
* `payment_method`: Required, string, must be one of: `card`, `on_account`.
* `po_number`: Optional, string, max 255.
* `ship-address`: Required, string.
* `address`: Optional, string, max 255.
* `city`: Required, string, max 255.
* `state`: Required, string, max 255.
* `country`: Required, string, max 255.
* `postal_code`: Required, string, max 10.
* `shipping_rate_id`: Required, integer, must exist in shipping_rates table.
* `schedule_frequency`: Optional, string, must be one of: `weekly`, `monthly`.
* `success_url`: Optional, url string.
* `cancel_url`: Optional, url string.

#### Response (201 Created)
```json
{
  "message": "Purchase Order submitted successfully.",
  "order": {
    "id": 15,
    "po_number": "PO-998811",
    "internal_reference": "PO-ABCD1234",
    "kyc_id": 5,
    "user_id": "019fb66f-c494-73ce-b7d6-db6a309ee12e",
    "status": "Submitted",
    "payment_method": "card",
    "total_amount": 270.0,
    "shipping_amount": 15.0,
    "is_draft": false,
    "is_recurring": true,
    "created_at": "2026-08-01T12:00:00.000000Z",
    "items": [
      {
        "id": 30,
        "purchase_order_id": 15,
        "product_id": 42,
        "product_variant_id": null,
        "quantity": 10,
        "unit_price": 25.5
      }
    ]
  },
  "checkout_url": "https://checkout.stripe.com/c/pay/cs_test_..."
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
Fetches a paginated list of all products configured for B2B.

* **Endpoint**: `GET /api/v1/b2b/catalog`
* **Headers**: Unauthenticated / Public endpoint (will dynamically resolve trade prices if authenticated via Sanctum)

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
Retrieves detailed information for a specific B2B product.

* **Endpoint**: `GET /api/v1/b2b/catalog/{slug}`
* **Headers**: Unauthenticated / Public endpoint (will dynamically resolve trade prices if authenticated via Sanctum)

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

---

## 8. B2B Shipping Addresses Management

B2B users can manage multiple shipping addresses. Authenticated headers are required, and the user must be an approved B2B user.

### 8.1 List Shipping Addresses
* **Endpoint**: `GET /api/v1/shipping-addresses`
* **Headers**: Authenticated Headers Required

#### Response (200 OK)
```json
{
  "success": true,
  "data": [
    {
      "id": 8,
      "user_id": "019fb66f-c494-73ce-b7d6-db6a309ee12e",
      "label": "Warehouse Alpha",
      "company_name": "Acme Food Services Ltd",
      "contact_name": "John Doe",
      "phone": "+447700900077",
      "address_line_1": "Unit 4, Industrial Park",
      "address_line_2": "Canning Road",
      "city": "London",
      "state": "England",
      "postal_code": "E15 3ND",
      "country": "UK",
      "is_default": true,
      "delivery_instructions": "Access via back gate after 8 AM.",
      "created_at": "2026-08-01T11:00:00.000000Z",
      "updated_at": "2026-08-01T11:00:00.000000Z"
    }
  ]
}
```

---

### 8.2 Add Shipping Address
Creates a new shipping address for the B2B user.

* **Endpoint**: `POST /api/v1/shipping-addresses`
* **Headers**: Authenticated Headers Required

#### Request Payload
```json
{
  "label": "Warehouse Beta",
  "company_name": "Acme Food Services Ltd",
  "contact_name": "Jane Doe",
  "phone": "+447700900088",
  "address_line_1": "12 East Side Ave",
  "address_line_2": "Suite B",
  "city": "London",
  "state": "England",
  "postal_code": "E16 4PF",
  "country": "UK",
  "is_default": false,
  "delivery_instructions": "Leave with reception."
}
```

#### Validation Constraints
* `label`: Optional, string, max 100.
* `company_name`: Optional, string, max 255.
* `contact_name`: Optional, string, max 255.
* `phone`: Optional, string, max 30.
* `address_line_1`: Required, string, max 255.
* `address_line_2`: Optional, string, max 255.
* `city`: Required, string, max 255.
* `state`: Optional, string, max 255.
* `postal_code`: Required, string, max 20.
* `country`: Required, string, max 100.
* `is_default`: Optional, boolean.
* `delivery_instructions`: Optional, string, max 500.

#### Response (201 Created)
```json
{
  "success": true,
  "message": "Shipping address created successfully.",
  "data": {
    "id": 9,
    "user_id": "019fb66f-c494-73ce-b7d6-db6a309ee12e",
    "label": "Warehouse Beta",
    "company_name": "Acme Food Services Ltd",
    "contact_name": "Jane Doe",
    "phone": "+447700900088",
    "address_line_1": "12 East Side Ave",
    "address_line_2": "Suite B",
    "city": "London",
    "state": "England",
    "postal_code": "E16 4PF",
    "country": "UK",
    "is_default": false,
    "delivery_instructions": "Leave with reception.",
    "created_at": "2026-08-04T22:00:00.000000Z",
    "updated_at": "2026-08-04T22:00:00.000000Z"
  }
}
```

---

### 8.3 Get Shipping Address
Retrieves a specific shipping address by ID.

* **Endpoint**: `GET /api/v1/shipping-addresses/{id}`
* **Headers**: Authenticated Headers Required

#### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "id": 9,
    "user_id": "019fb66f-c494-73ce-b7d6-db6a309ee12e",
    "label": "Warehouse Beta",
    "company_name": "Acme Food Services Ltd",
    "contact_name": "Jane Doe",
    "phone": "+447700900088",
    "address_line_1": "12 East Side Ave",
    "address_line_2": "Suite B",
    "city": "London",
    "state": "England",
    "postal_code": "E16 4PF",
    "country": "UK",
    "is_default": false,
    "delivery_instructions": "Leave with reception."
  }
}
```

---

### 8.4 Update Shipping Address
Updates an existing shipping address.

* **Endpoint**: `PUT /api/v1/shipping-addresses/{id}`
* **Headers**: Authenticated Headers Required

#### Request Payload
```json
{
  "label": "Warehouse Beta Revised",
  "contact_name": "Jane Smith",
  "is_default": true
}
```

#### Response (200 OK)
```json
{
  "success": true,
  "message": "Shipping address updated successfully.",
  "data": {
    "id": 9,
    "user_id": "019fb66f-c494-73ce-b7d6-db6a309ee12e",
    "label": "Warehouse Beta Revised",
    "company_name": "Acme Food Services Ltd",
    "contact_name": "Jane Smith",
    "phone": "+447700900088",
    "address_line_1": "12 East Side Ave",
    "address_line_2": "Suite B",
    "city": "London",
    "state": "England",
    "postal_code": "E16 4PF",
    "country": "UK",
    "is_default": true,
    "delivery_instructions": "Leave with reception."
  }
}
```

---

### 8.5 Delete Shipping Address
* **Endpoint**: `DELETE /api/v1/shipping-addresses/{id}`
* **Headers**: Authenticated Headers Required

#### Response (200 OK)
```json
{
  "success": true,
  "message": "Shipping address deleted successfully."
}
```

---

### 8.6 Set Default Shipping Address
* **Endpoint**: `POST /api/v1/shipping-addresses/{id}/set-default`
* **Headers**: Authenticated Headers Required

#### Response (200 OK)
```json
{
  "success": true,
  "message": "Default shipping address updated.",
  "data": {
    "id": 9,
    "user_id": "019fb66f-c494-73ce-b7d6-db6a309ee12e",
    "is_default": true
  }
}
```

---

## 9. B2B Wishlist Management

Provides trade accounts with the ability to save items and later move them directly into their wholesale cart. Access requires an **approved** B2B trade account.

### 9.1 Get Wishlist Items
* **Endpoint**: `GET /api/v1/wishlist`
* **Headers**: Authenticated Headers Required

#### Response (200 OK)
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "product_id": 42,
      "title": "Commercial Cooking Oil 20L",
      "slug": "commercial-cooking-oil-20l",
      "image": "b2b-product-3.jpg",
      "product_images": ["b2b-product-3.jpg"],
      "standard_price": 189.57,
      "trade_price": 170.61,
      "minimum_order_quantity": 10,
      "category": "Wholesale Produce",
      "added_at": "2026-08-05T01:00:00.000000Z"
    }
  ]
}
```

---

### 9.2 Add Product to Wishlist
Adds a B2B product to the user's wishlist.

* **Endpoint**: `POST /api/v1/wishlist`
* **Headers**: Authenticated Headers Required

#### Request Payload
```json
{
  "product_id": 42
}
```

#### Validation Constraints
* `product_id`: Required, integer, must exist in products table, must be a B2B product (`is_b2b = true`), and must not already be in the wishlist.

#### Response (201 Created)
```json
{
  "success": true,
  "message": "Product added to B2B wishlist.",
  "data": {
    "id": 1,
    "user_id": "019fb66f-c494-73ce-b7d6-db6a309ee12e",
    "product_id": 42,
    "created_at": "2026-08-05T01:00:00.000000Z"
  }
}
```

---

### 9.3 Remove Product from Wishlist
* **Endpoint**: `DELETE /api/v1/wishlist/{id}`
* **Headers**: Authenticated Headers Required

#### Response (200 OK)
```json
{
  "success": true,
  "message": "Product removed from B2B wishlist."
}
```

---

### 9.4 Move Wishlist Item to B2B Cart
Removes the item from the wishlist and places it in the B2B cart, using specified quantity and variant configuration.

* **Endpoint**: `POST /api/v1/wishlist/{id}/move-to-cart`
* **Headers**: Authenticated Headers Required

#### Request Payload
```json
{
  "quantity": 10,
  "size_variant": "20L",
  "product_variant_id": 1
}
```

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
    "unit_price": 170.61
  }
}
```

---

## 10. Request For Quotation (RFQ)

For items or volumes not in the catalog, or custom supply needs, trade users can submit an RFQ.

### 10.1 Submit RFQ
* **Endpoint**: `POST /api/v1/b2b/rfq`
* **Headers**: Authenticated Headers Required

#### Request Payload
```json
{
  "items": [
    {
      "product_id": 42,
      "product_variant_id": null,
      "quantity": 150
    }
  ],
  "delivery_frequency": "weekly",
  "notes": "Looking for a weekly contract of commercial oil."
}
```

#### Validation Constraints
* `items`: Required, array, minimum 1 item.
* `items.*.product_id`: Required, must exist in products.
* `items.*.product_variant_id`: Optional, must exist in product_variants.
* `items.*.quantity`: Required, integer, minimum 1.
* `delivery_frequency`: Optional, string, one of: `one-off`, `weekly`, `monthly`.
* `notes`: Optional, string.

#### Response (201 Created)
```json
{
  "message": "RFQ submitted successfully.",
  "rfq": {
    "id": 3,
    "reference_number": "RFQ-ABCDEFGH",
    "kyc_id": 5,
    "user_id": "019fb66f-c494-73ce-b7d6-db6a309ee12e",
    "status": "Pending",
    "delivery_frequency": "weekly",
    "notes": "Looking for a weekly contract of commercial oil.",
    "created_at": "2026-08-05T02:00:00.000000Z",
    "items": [
      {
        "id": 6,
        "rfq_id": 3,
        "product_id": 42,
        "product_variant_id": null,
        "quantity": 150
      }
    ]
  }
}
```

---

### 10.2 List RFQs
Retrieves submitted RFQs for the current B2B account.

* **Endpoint**: `GET /api/v1/b2b/rfq`
* **Headers**: Authenticated Headers Required

#### Response (200 OK)
```json
{
  "rfqs": [
    {
      "id": 3,
      "reference_number": "RFQ-ABCDEFGH",
      "kyc_id": 5,
      "status": "Pending",
      "delivery_frequency": "weekly",
      "notes": "Looking for a weekly contract of commercial oil.",
      "created_at": "2026-08-05T02:00:00.000000Z"
    }
  ]
}
```

---

### 10.3 View RFQ
Retrieves a specific RFQ.

* **Endpoint**: `GET /api/v1/b2b/rfq/{id}`
* **Headers**: Authenticated Headers Required

#### Response (200 OK)
```json
{
  "rfq": {
    "id": 3,
    "reference_number": "RFQ-ABCDEFGH",
    "kyc_id": 5,
    "user_id": "019fb66f-c494-73ce-b7d6-db6a309ee12e",
    "status": "Pending",
    "delivery_frequency": "weekly",
    "notes": "Looking for a weekly contract of commercial oil.",
    "items": [
      {
        "id": 6,
        "product_id": 42,
        "quantity": 150
      }
    ]
  }
}
```

---

### 10.4 Update RFQ Status (Customer Actions)
Allows customers to accept, decline, or request changes on a Quoted RFQ.

* **Endpoint**: `PUT /api/v1/b2b/rfq/{id}/status`
* **Headers**: Authenticated Headers Required

#### Request Payload
```json
{
  "action": "request_changes",
  "comment": "Can we reduce unit price by 2%?"
}
```

#### Validation Constraints
* `action`: Required, string, must be one of: `accept`, `decline`, `request_changes`.
* `comment`: Optional, string.

#### Response (200 OK)
```json
{
  "message": "RFQ status updated successfully.",
  "rfq": {
    "id": 3,
    "status": "Pending",
    "notes": "Looking for a weekly contract of commercial oil.\n\nChanges requested: Can we reduce unit price by 2%?"
  }
}
```

---

## 11. Purchase Orders (PO) & Recurring Schedules

Enables submitting wholesale orders directly via cards or credited on-account balances, as well as managing recurring schedule setups.

### 11.1 Submit Purchase Order
* **Endpoint**: `POST /api/v1/b2b/orders`
* **Headers**: Authenticated Headers Required

#### Request Payload
```json
{
  "po_number": "PO-9911A",
  "payment_method": "on_account",
  "items": [
    {
      "product_id": 42,
      "product_variant_id": null,
      "quantity": 20,
      "unit_price": 170.61
    }
  ],
  "schedule_frequency": "monthly"
}
```

#### Validation Constraints
* `po_number`: Optional, string, max 255.
* `payment_method`: Required, string, one of: `card`, `on_account`.
* `items`: Required, array, minimum 1.
* `items.*.product_id`: Required, exists in products.
* `items.*.product_variant_id`: Optional, exists in product_variants.
* `items.*.quantity`: Required, integer, minimum 1.
* `items.*.unit_price`: Required, numeric, minimum 0.
* `schedule_frequency`: Optional, string, one of: `weekly`, `monthly`.

#### Response (201 Created)
```json
{
  "message": "Purchase Order submitted successfully.",
  "order": {
    "id": 16,
    "po_number": "PO-9911A",
    "internal_reference": "PO-XYZ12345",
    "kyc_id": 5,
    "user_id": "019fb66f-c494-73ce-b7d6-db6a309ee12e",
    "status": "Submitted",
    "payment_method": "on_account",
    "total_amount": 3412.20,
    "is_draft": false,
    "is_recurring": true,
    "created_at": "2026-08-05T03:00:00.000000Z",
    "items": [
      {
        "id": 31,
        "product_id": 42,
        "quantity": 20,
        "unit_price": 170.61
      }
    ]
  },
  "checkout_url": null
}
```

---

### 11.2 List Purchase Orders
* **Endpoint**: `GET /api/v1/b2b/orders`
* **Headers**: Authenticated Headers Required

#### Response (200 OK)
```json
{
  "orders": [
    {
      "id": 16,
      "po_number": "PO-9911A",
      "internal_reference": "PO-XYZ12345",
      "total_amount": 3412.20,
      "status": "Submitted",
      "payment_method": "on_account",
      "created_at": "2026-08-05T03:00:00.000000Z"
    }
  ]
}
```

---

### 11.3 Show Purchase Order Details
* **Endpoint**: `GET /api/v1/b2b/orders/{id}`
* **Headers**: Authenticated Headers Required

#### Response (200 OK)
```json
{
  "order": {
    "id": 16,
    "po_number": "PO-9911A",
    "internal_reference": "PO-XYZ12345",
    "status": "Submitted",
    "payment_method": "on_account",
    "total_amount": 3412.20,
    "items": [
      {
        "id": 31,
        "product_id": 42,
        "quantity": 20,
        "unit_price": 170.61
      }
    ]
  }
}
```

---

### 11.4 Setup Recurring Schedule
Binds an existing PO to a weekly or monthly replenishment cycle.

* **Endpoint**: `POST /api/v1/b2b/orders/{id}/recurring`
* **Headers**: Authenticated Headers Required

#### Request Payload
```json
{
  "frequency": "weekly"
}
```

#### Validation Constraints
* `frequency`: Required, string, one of: `weekly`, `monthly`.

#### Response (200 OK)
```json
{
  "message": "Recurring schedule updated."
}
```

---

### 11.5 Get Order Drafts
Retrieves draft orders automatically prepared by recurring schedules that require review.

* **Endpoint**: `GET /api/v1/b2b/orders/drafts`
* **Headers**: Authenticated Headers Required

#### Response (200 OK)
```json
{
  "drafts": [
    {
      "id": 17,
      "po_number": null,
      "internal_reference": "PO-DRAFT88",
      "total_amount": 3412.20,
      "is_draft": true,
      "status": "Draft",
      "created_at": "2026-08-05T04:00:00.000000Z"
    }
  ]
}
```

---

### 11.6 Approve Order Draft
Publishes a draft order to active submitted status.

* **Endpoint**: `POST /api/v1/b2b/orders/{id}/approve`
* **Headers**: Authenticated Headers Required

#### Response (200 OK)
```json
{
  "message": "Draft approved and submitted.",
  "order": {
    "id": 17,
    "is_draft": false,
    "status": "Submitted"
  }
}
```

---

## 12. User Profile Management

These endpoints handle updating the authenticated user's personal details and password.

### 12.1 Update Personal Details
Updates the user's first name, last name, and email address.

* **Endpoint**: `PUT /api/v1/profile`
* **Headers**: Authenticated Headers Required

#### Request Payload
```json
{
  "first_name": "James",
  "last_name": "Septimus",
  "email": "jamse@example.com"
}
```

#### Response (200 OK)
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "id": "019fb66f-c494-73ce-b7d6-db6a309ee12e",
    "first_name": "James",
    "last_name": "Septimus",
    "email": "jamse@example.com"
  }
}
```

---

### 12.2 Change Password
Updates the user's password.

* **Endpoint**: `PUT /api/v1/change-password`
* **Headers**: Authenticated Headers Required

#### Request Payload
```json
{
  "current_password": "OldPassword123!",
  "password": "NewPassword123!",
  "password_confirmation": "NewPassword123!"
}
```

#### Validation Constraints
* `current_password`: Required, must match the user's current password.
* `password`: Required, minimum 8 characters, confirmed (requires `password_confirmation` to match).

#### Response (200 OK)
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

#### Error Responses
* **422 Unprocessable Content** (Incorrect current password):
  ```json
  {
    "success": false,
    "message": "Current password is incorrect"
  }
  ```


### 1.4 Request Password Reset Link
Sends a password reset link to the user's email address if it exists in the system.

* **Endpoint**: `POST /api/v1/forgot-password`
* **Headers**: `Accept: application/json`

#### Request Payload
```json
{
  "email": "john.doe@example.com"
}
```

#### Response (200 OK)
```json
{
  "success": true,
  "message": "Password reset link sent to your email"
}
```

#### Error Responses
* **422 Unprocessable Content** (Validation failed):
  ```json
  {
    "message": "The selected email is invalid.",
    "errors": {
      "email": [
        "The selected email is invalid."
      ]
    }
  }
  ```
* **500 Internal Server Error** (Unable to send email):
  ```json
  {
    "success": false,
    "message": "Unable to send reset link"
  }
  ```

---

### 1.5 Reset Password
Resets the user's password using the token sent to their email.

* **Endpoint**: `POST /api/v1/reset-password`
* **Headers**: `Accept: application/json`

#### Request Payload
```json
{
  "token": "reset_token_received_in_email",
  "email": "john.doe@example.com",
  "password": "NewSecurePassword123!",
  "password_confirmation": "NewSecurePassword123!"
}
```

#### Validation Constraints
* `token`: Required.
* `email`: Required, valid email format, exists in users table.
* `password`: Required, minimum 8 characters, confirmed.

#### Response (200 OK)
```json
{
  "success": true,
  "message": "Password has been reset successfully"
}
```

#### Error Responses
* **422 Unprocessable Content** (Invalid token or validation failed):
  ```json
  {
    "message": "This password reset token is invalid.",
    "errors": {
      "email": [
        "This password reset token is invalid."
      ]
    }
  }
  ```
