# Gold Savings API - Testing & Quick Reference

This document provides API testing examples, Postman collection structure, and a quick reference guide.

---

## Table of Contents

1. [Postman Collection](#postman-collection)
2. [cURL Examples](#curl-examples)
3. [API Quick Reference](#api-quick-reference)
4. [Common Use Cases](#common-use-cases)
5. [Error Scenarios](#error-scenarios)

---

## Postman Collection

### Collection Structure

```
Gold Savings API
├── Auth
│   ├── Register
│   ├── Login
│   ├── Refresh Token
│   └── Get Current User
├── Type Pockets
│   ├── Get All Type Pockets
│   ├── Get Type Pocket by ID
│   ├── Create Type Pocket
│   ├── Update Type Pocket
│   └── Delete Type Pocket
├── Pockets
│   ├── Get All Pockets
│   ├── Get Pocket by ID
│   ├── Get Pocket Stats
│   ├── Create Pocket
│   ├── Update Pocket
│   └── Delete Pocket
├── Transactions
│   ├── Get All Transactions
│   ├── Get Transaction by ID
│   ├── Create Transaction
│   ├── Update Transaction
│   ├── Delete Transaction
│   └── Upload Receipt
├── Analytics
│   ├── Dashboard Summary
│   ├── Portfolio Analytics
│   ├── Monthly Purchases
│   ├── Brand Distribution
│   └── Transaction Trends
└── Gold Price
    ├── Current Price
    └── Historical Prices
```

### Environment Variables

```json
{
  "baseUrl": "http://localhost:3000/api/v1",
  "authToken": "",
  "userId": "",
  "pocketId": "",
  "transactionId": "",
  "typePocketId": ""
}
```

### Pre-request Script (Collection Level)

```javascript
// Auto-set auth token for all requests
if (pm.environment.get("authToken")) {
  pm.request.headers.add({
    key: "Authorization",
    value: "Bearer " + pm.environment.get("authToken")
  });
}
```

### Test Script Examples

**Login Request:**

```javascript
// Save token after successful login
if (pm.response.code === 200) {
  const response = pm.response.json();
  pm.environment.set("authToken", response.data.token);
  pm.environment.set("userId", response.data.user.id);
  
  pm.test("Login successful", function() {
    pm.expect(response.success).to.be.true;
    pm.expect(response.data.token).to.exist;
  });
}
```

**Create Pocket Request:**

```javascript
if (pm.response.code === 201) {
  const response = pm.response.json();
  pm.environment.set("pocketId", response.data.id);
  
  pm.test("Pocket created successfully", function() {
    pm.expect(response.success).to.be.true;
    pm.expect(response.data.name).to.exist;
  });
}
```

---

## cURL Examples

### Authentication

#### Register

```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePassword123!",
    "name": "John Doe"
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "John Doe"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "Registration successful"
}
```

#### Login

```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePassword123!"
  }'
```

### Type Pockets

#### Get All Type Pockets

```bash
curl -X GET http://localhost:3000/api/v1/type-pockets \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### Create Type Pocket

```bash
curl -X POST http://localhost:3000/api/v1/type-pockets \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Travel Fund",
    "description": "Savings for travel and vacation",
    "icon": "heroicons:globe-alt",
    "color": "teal"
  }'
```

### Pockets

#### Get All Pockets

```bash
curl -X GET http://localhost:3000/api/v1/pockets \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### Get Pockets by Type

```bash
curl -X GET "http://localhost:3000/api/v1/pockets?typePocketId=TYPE_POCKET_UUID" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### Create Pocket

```bash
curl -X POST http://localhost:3000/api/v1/pockets \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "typePocketId": "uuid",
    "name": "Emergency Fund 2025",
    "description": "My emergency gold savings",
    "targetWeight": 20.0
  }'
```

#### Get Pocket by ID

```bash
curl -X GET http://localhost:3000/api/v1/pockets/POCKET_UUID \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### Get Pocket Statistics

```bash
curl -X GET "http://localhost:3000/api/v1/pockets/POCKET_UUID/stats?currentGoldPrice=1055000" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### Update Pocket

```bash
curl -X PATCH http://localhost:3000/api/v1/pockets/POCKET_UUID \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Emergency Fund 2025 Updated",
    "targetWeight": 25.0
  }'
```

#### Delete Pocket

```bash
curl -X DELETE http://localhost:3000/api/v1/pockets/POCKET_UUID \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Transactions

#### Get All Transactions

```bash
curl -X GET http://localhost:3000/api/v1/transactions \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### Get Transactions with Filters

```bash
curl -X GET "http://localhost:3000/api/v1/transactions?pocketId=POCKET_UUID&startDate=2025-01-01&endDate=2025-12-31&brand=Antam&page=1&limit=20" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### Create Transaction

```bash
curl -X POST http://localhost:3000/api/v1/transactions \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "pocketId": "uuid",
    "transactionDate": "2025-11-25",
    "brand": "Antam",
    "weight": 2.5,
    "pricePerGram": 1050000,
    "totalPrice": 2625000,
    "description": "Monthly gold purchase"
  }'
```

#### Update Transaction

```bash
curl -X PATCH http://localhost:3000/api/v1/transactions/TRANSACTION_UUID \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "weight": 3.0,
    "pricePerGram": 1055000,
    "totalPrice": 3165000,
    "description": "Updated monthly gold purchase"
  }'
```

#### Delete Transaction

```bash
curl -X DELETE http://localhost:3000/api/v1/transactions/TRANSACTION_UUID \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Analytics

#### Dashboard Summary

```bash
curl -X GET http://localhost:3000/api/v1/analytics/dashboard \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### Portfolio Analytics

```bash
curl -X GET "http://localhost:3000/api/v1/analytics/portfolio?currentGoldPrice=1055000" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### Monthly Purchases

```bash
curl -X GET "http://localhost:3000/api/v1/analytics/monthly-purchases?months=6" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### Brand Distribution

```bash
curl -X GET http://localhost:3000/api/v1/analytics/brand-distribution \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### Transaction Trends

```bash
curl -X GET "http://localhost:3000/api/v1/analytics/trends?period=6m&groupBy=month" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Gold Price

#### Current Gold Price

```bash
curl -X GET http://localhost:3000/api/v1/gold-price/current \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### Historical Prices

```bash
curl -X GET "http://localhost:3000/api/v1/gold-price/history?period=1m" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## API Quick Reference

### Base URL

```
http://localhost:3000/api/v1
```

### Authentication Header

```
Authorization: Bearer <jwt_token>
```

### Common Query Parameters

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `page` | number | Page number for pagination | `?page=1` |
| `limit` | number | Items per page (max 100) | `?limit=20` |
| `sortBy` | string | Field to sort by | `?sortBy=createdAt` |
| `sortOrder` | string | Sort direction (asc/desc) | `?sortOrder=desc` |

### Response Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Success |
| 201 | Created - Resource created |
| 204 | No Content - Success, no response body |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Authentication required |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource doesn't exist |
| 422 | Unprocessable Entity - Validation error |
| 500 | Internal Server Error |

---

## Common Use Cases

### Use Case 1: New User Registration & First Pocket

```bash
# Step 1: Register
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@example.com",
    "password": "SecurePass123!",
    "name": "New User"
  }'

# Save the token from response

# Step 2: Get available type pockets
curl -X GET http://localhost:3000/api/v1/type-pockets \
  -H "Authorization: Bearer YOUR_TOKEN"

# Step 3: Create first pocket
curl -X POST http://localhost:3000/api/v1/pockets \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "typePocketId": "TYPE_POCKET_UUID",
    "name": "My First Gold Savings",
    "description": "Starting my gold investment journey",
    "targetWeight": 10.0
  }'
```

### Use Case 2: Adding a Transaction

```bash
# Step 1: Get user's pockets
curl -X GET http://localhost:3000/api/v1/pockets \
  -H "Authorization: Bearer YOUR_TOKEN"

# Step 2: Create transaction
curl -X POST http://localhost:3000/api/v1/transactions \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "pocketId": "POCKET_UUID",
    "transactionDate": "2025-11-25",
    "brand": "Antam",
    "weight": 1.0,
    "pricePerGram": 1050000,
    "totalPrice": 1050000,
    "description": "First gold purchase"
  }'

# Step 3: Verify pocket was updated
curl -X GET http://localhost:3000/api/v1/pockets/POCKET_UUID \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Use Case 3: Viewing Portfolio Analytics

```bash
# Step 1: Get dashboard summary
curl -X GET http://localhost:3000/api/v1/analytics/dashboard \
  -H "Authorization: Bearer YOUR_TOKEN"

# Step 2: Get detailed portfolio analytics
curl -X GET "http://localhost:3000/api/v1/analytics/portfolio?currentGoldPrice=1055000" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Step 3: Get monthly purchase trends
curl -X GET "http://localhost:3000/api/v1/analytics/monthly-purchases?months=6" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Step 4: Get brand distribution
curl -X GET http://localhost:3000/api/v1/analytics/brand-distribution \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Use Case 4: Editing a Transaction

```bash
# Step 1: Get transaction details
curl -X GET http://localhost:3000/api/v1/transactions/TRANSACTION_UUID \
  -H "Authorization: Bearer YOUR_TOKEN"

# Step 2: Update transaction
curl -X PATCH http://localhost:3000/api/v1/transactions/TRANSACTION_UUID \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "weight": 1.5,
    "pricePerGram": 1055000,
    "totalPrice": 1582500,
    "description": "Updated purchase details"
  }'

# Step 3: Verify pocket aggregates updated
curl -X GET http://localhost:3000/api/v1/pockets/POCKET_UUID \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Use Case 5: Deleting a Pocket

```bash
# Step 1: Check if pocket has transactions
curl -X GET http://localhost:3000/api/v1/pockets/POCKET_UUID \
  -H "Authorization: Bearer YOUR_TOKEN"

# Step 2: If no transactions, delete pocket
curl -X DELETE http://localhost:3000/api/v1/pockets/POCKET_UUID \
  -H "Authorization: Bearer YOUR_TOKEN"

# If pocket has transactions, you'll get an error:
# {
#   "success": false,
#   "message": "Cannot delete pocket with existing transactions"
# }
```

---

## Error Scenarios

### Validation Error Example

**Request:**
```bash
curl -X POST http://localhost:3000/api/v1/pockets \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "AB",
    "targetWeight": -5
  }'
```

**Response (422):**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "typePocketId": ["typePocketId is required"],
    "name": ["name must be at least 3 characters"],
    "targetWeight": ["targetWeight must be a positive number"]
  }
}
```

### Authentication Error

**Request:**
```bash
curl -X GET http://localhost:3000/api/v1/pockets
```

**Response (401):**
```json
{
  "success": false,
  "message": "No token provided"
}
```

### Not Found Error

**Request:**
```bash
curl -X GET http://localhost:3000/api/v1/pockets/invalid-uuid \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response (404):**
```json
{
  "success": false,
  "message": "Pocket not found"
}
```

### Business Logic Error

**Request:**
```bash
curl -X POST http://localhost:3000/api/v1/transactions \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "pocketId": "uuid",
    "transactionDate": "2025-11-25",
    "brand": "Antam",
    "weight": 2.5,
    "pricePerGram": 1050000,
    "totalPrice": 9999999
  }'
```

**Response (422):**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "totalPrice": ["totalPrice must equal weight * pricePerGram"]
  }
}
```

### Duplicate Resource Error

**Request:**
```bash
curl -X POST http://localhost:3000/api/v1/pockets \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "typePocketId": "uuid",
    "name": "Emergency Fund"
  }'
```

**Response (400):**
```json
{
  "success": false,
  "message": "Pocket with this name already exists"
}
```

---

## Testing Workflow

### 1. Initial Setup

```bash
# 1. Start the server
npm run dev

# 2. Run database migrations
npx prisma migrate dev

# 3. Seed initial data
npx prisma db seed
```

### 2. Test Authentication Flow

```bash
# Register a new user
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!",
    "name": "Test User"
  }'

# Login
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!"
  }'

# Save the token and use it for subsequent requests
export TOKEN="your_jwt_token_here"
```

### 3. Test CRUD Operations

```bash
# Create
curl -X POST http://localhost:3000/api/v1/pockets \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "typePocketId": "uuid",
    "name": "Test Pocket",
    "targetWeight": 10
  }'

# Read
curl -X GET http://localhost:3000/api/v1/pockets \
  -H "Authorization: Bearer $TOKEN"

# Update
curl -X PATCH http://localhost:3000/api/v1/pockets/POCKET_UUID \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Test Pocket"
  }'

# Delete
curl -X DELETE http://localhost:3000/api/v1/pockets/POCKET_UUID \
  -H "Authorization: Bearer $TOKEN"
```

### 4. Test Analytics Endpoints

```bash
# Dashboard
curl -X GET http://localhost:3000/api/v1/analytics/dashboard \
  -H "Authorization: Bearer $TOKEN"

# Portfolio
curl -X GET "http://localhost:3000/api/v1/analytics/portfolio?currentGoldPrice=1055000" \
  -H "Authorization: Bearer $TOKEN"

# Monthly Purchases
curl -X GET "http://localhost:3000/api/v1/analytics/monthly-purchases?months=6" \
  -H "Authorization: Bearer $TOKEN"
```

---

## Performance Testing

### Load Testing with Apache Bench

```bash
# Test login endpoint
ab -n 1000 -c 10 -p login.json -T application/json \
  http://localhost:3000/api/v1/auth/login

# Test authenticated endpoint (requires token in header file)
ab -n 1000 -c 10 -H "Authorization: Bearer TOKEN" \
  http://localhost:3000/api/v1/pockets
```

### Load Testing with Artillery

**artillery.yml:**

```yaml
config:
  target: "http://localhost:3000"
  phases:
    - duration: 60
      arrivalRate: 10
      name: "Warm up"
    - duration: 120
      arrivalRate: 50
      name: "Sustained load"

scenarios:
  - name: "Get pockets"
    flow:
      - post:
          url: "/api/v1/auth/login"
          json:
            email: "test@example.com"
            password: "Test123!"
          capture:
            - json: "$.data.token"
              as: "token"
      - get:
          url: "/api/v1/pockets"
          headers:
            Authorization: "Bearer {{ token }}"
```

Run with:
```bash
artillery run artillery.yml
```

---

## Monitoring & Debugging

### Health Check

```bash
curl http://localhost:3000/health
```

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-11-25T10:00:00.000Z"
}
```

### Database Connection Check

Add to your health endpoint:

```typescript
app.get('/health', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({
      status: 'ok',
      database: 'connected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(503).json({
      status: 'error',
      database: 'disconnected',
      timestamp: new Date().toISOString()
    });
  }
});
```

---

## Postman Collection JSON

Save this as `gold-savings-api.postman_collection.json`:

```json
{
  "info": {
    "name": "Gold Savings API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Auth",
      "item": [
        {
          "name": "Register",
          "request": {
            "method": "POST",
            "header": [],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"email\": \"user@example.com\",\n  \"password\": \"SecurePass123!\",\n  \"name\": \"John Doe\"\n}",
              "options": {
                "raw": {
                  "language": "json"
                }
              }
            },
            "url": {
              "raw": "{{baseUrl}}/auth/register",
              "host": ["{{baseUrl}}"],
              "path": ["auth", "register"]
            }
          }
        },
        {
          "name": "Login",
          "event": [
            {
              "listen": "test",
              "script": {
                "exec": [
                  "if (pm.response.code === 200) {",
                  "  const response = pm.response.json();",
                  "  pm.environment.set(\"authToken\", response.data.token);",
                  "  pm.environment.set(\"userId\", response.data.user.id);",
                  "}"
                ]
              }
            }
          ],
          "request": {
            "method": "POST",
            "header": [],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"email\": \"user@example.com\",\n  \"password\": \"SecurePass123!\"\n}",
              "options": {
                "raw": {
                  "language": "json"
                }
              }
            },
            "url": {
              "raw": "{{baseUrl}}/auth/login",
              "host": ["{{baseUrl}}"],
              "path": ["auth", "login"]
            }
          }
        }
      ]
    }
  ]
}
```

---

**End of Testing & Quick Reference Guide**
