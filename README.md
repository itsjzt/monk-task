# Discount Service Project

_Note_: BXGY coupons don't auto-apply you have to add both the buy products and get products for the discount to be applicable

## Folder Structure

- **build/**: Compiled JavaScript files
- **src/**: TypeScript source code
  - controllers/: API endpoint handlers
  - data/: Data models and storage, use in-memory storage for coupons
  - schemas/: Zod validation schemas and typescript types
  - services/: Core business logic
  - utils/: Helper functions
  - main.ts: Application entry point
  - routes.ts: API route definitions
- **.vscode/**: VS Code configuration

## Features Implemented

### Discount System

- Multiple discount types supported:
  - Cart-wide percentage discounts (CART_WISE)
  - Product-specific discounts (PRODUCT_WISE)
  - Buy X Get Y promotions (BXGY)
- Coupon management API (CRUD operations)
- Validation using Zod schemas for all inputs
- Cart total calculation with discount application
- Error handling and response standardization

### API Endpoints

- **Coupon Management:**

  - `GET /api/coupons` - List all coupons
  - `GET /api/coupons/:couponId` - Get a specific coupon
  - `POST /api/coupons` - Create a new coupon
  - `PUT /api/coupons/:couponId` - Update a coupon
  - `DELETE /api/coupons/:couponId` - Delete a coupon

- **Discount Application:**
  - `POST /api/applicable-coupons` - Find applicable coupons for a cart
  - `POST /api/apply-coupon/:couponId` - Apply a specific coupon to a cart

### Utilities

- Error masking for internal server errors
- Cart total calculation
- Coupon expiration checking
- HTTP response standardization

## Future Features

Based on the codebase, these features could be implemented next:

1. **Database Integration** - Replace in-memory storage with a persistent database
2. **Authentication & Authorization** - Secure coupon management endpoints
3. **Advanced Discount Rules** - Implement more complex eligibility rules
4. **Discount Stacking** - Allow multiple compatible discounts to be combined
5. **Usage Analytics** - Track coupon usage and effectiveness
6. **User-specific Discounts** - Target discounts to specific user segments
7. **Discount Code Generation** - Create unique discount codes for marketing campaigns

## Constraints and Issues

- **In-memory Storage** - Currently using array-based storage that resets on service restart
- **Single Discount Application** - Only applies one discount at a time (most beneficial)
- **No Authentication** - API endpoints lack proper security
- **Limited Validation** - Some edge cases might not be fully handled
- **Error Handling** - Could be more comprehensive for specific error types
- **Testing** - No automated tests visible in the codebase
- **UX** - BXGY coupons don't auto-apply you have to add both the buy products and get products for the discount to be applicable

## How to Run

### Prerequisites

- Node.js (recent version)
- npm or yarn

### Setup and Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Build the TypeScript code:

```bash
npm run build
```

4. Start the server:

```bash
npm start
```

For development with auto-restart:

```bash
npm run dev
```

The server will run on http://localhost:3000/api by default. You can modify the port by setting the PORT environment variable.

### Testing the API

You can use tools like Postman or curl to test the API endpoints:

#### Coupon Management

```bash
# List all coupons (including expired)
curl "http://localhost:3000/api/coupons?showExpired=true"

# List only active coupons
curl http://localhost:3000/api/coupons

# Get a specific coupon by ID
curl http://localhost:3000/api/coupons/your-coupon-id

# Create a new cart-wide discount coupon
curl -X POST http://localhost:3000/api/coupons \
  -H "Content-Type: application/json" \
  -d '{
    "discountType": "CART_WISE",
    "discountPercentage": 10,
    "threshold": 100,
    "endDate": "2024-12-31"
  }'

# Create a product-specific discount coupon
curl -X POST http://localhost:3000/api/coupons \
  -H "Content-Type: application/json" \
  -d '{
    "discountType": "PRODUCT_WISE",
    "discountPercentage": 15,
    "productWiseProducts": [
      {
        "productId": "prod-123",
        "quantity": 1
      },
      {
        "productId": "prod-456",
        "quantity": 2
      }
    ],
    "threshold": 50,
    "endDate": "2024-12-31"
  }'

# Create a Buy X Get Y promotion
curl -X POST http://localhost:3000/api/coupons \
  -H "Content-Type: application/json" \
  -d '{
    "discountType": "BXGY",
    "buyProducts": [
      {
        "productId": "prod-123",
        "quantity": 2
      }
    ],
    "getProducts": [
      {
        "productId": "prod-456",
        "quantity": 1
      }
    ],
    "endDate": "2024-12-31"
  }'

# Update an existing coupon
curl -X PUT http://localhost:3000/api/coupons/your-coupon-id \
  -H "Content-Type: application/json" \
  -d '{
    "discountType": "CART_WISE",
    "discountPercentage": 20,
    "threshold": 150,
    "endDate": "2024-12-31"
  }'

# Delete a coupon
curl -X DELETE http://localhost:3000/api/coupons/your-coupon-id
```

#### Discount Application

```bash
# Find applicable coupons for a cart
curl -X POST http://localhost:3000/api/applicable-coupons \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      {
        "productId": "prod-123",
        "quantity": 2,
        "price": 50
      },
      {
        "productId": "prod-456",
        "quantity": 1,
        "price": 75
      }
    ]
  }'

# Apply a specific coupon to a cart
curl -X POST http://localhost:3000/api/apply-coupon/your-coupon-id \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      {
        "productId": "prod-123",
        "quantity": 2,
        "price": 50
      },
      {
        "productId": "prod-456",
        "quantity": 1,
        "price": 75
      }
    ]
  }'
```

#### Example Workflow

Here's a complete workflow to test the discount system:

1. Create a cart-wide 10% discount coupon:

```bash
curl -X POST http://localhost:3000/api/coupons \
  -H "Content-Type: application/json" \
  -d '{
    "discountType": "CART_WISE",
    "discountPercentage": 10,
    "threshold": 100,
    "endDate": "2024-12-31"
  }'
```

Response will include a coupon ID that we'll use in subsequent requests.

2. Check if the coupon applies to our cart:

```bash
curl -X POST http://localhost:3000/api/applicable-coupons \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      {
        "productId": "prod-123",
        "quantity": 3,
        "price": 40
      }
    ]
  }'
```

3. Apply the coupon to the cart:

```bash
curl -X POST http://localhost:3000/api/apply-coupon/GENERATED_COUPON_ID \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      {
        "productId": "prod-123",
        "quantity": 3,
        "price": 40
      }
    ]
  }'
```

The response will contain the cart with applied discounts, including the original price, discount amount, and final price.

#### Health Check

```bash
# Check if the API is running
curl http://localhost:3000/api/health
```
