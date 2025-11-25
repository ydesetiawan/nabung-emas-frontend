# Gold Savings (Nabung Emas) - Backend API Specification

**Version:** 1.0.0  
**Last Updated:** 2025-11-25  
**Base URL:** `/api`

---

## Table of Contents

1. [Overview](#overview)
2. [Authentication](#authentication)
3. [Common Response Formats](#common-response-formats)
4. [Error Handling](#error-handling)
5. [API Endpoints](#api-endpoints)
   - [Type Pockets (Categories)](#type-pockets-categories)
   - [Pockets](#pockets)
   - [Transactions](#transactions)
   - [Analytics](#analytics)
   - [Gold Price](#gold-price)
6. [Data Models](#data-models)
7. [Business Rules & Validation](#business-rules--validation)
8. [Database Schema](#database-schema)

---

## Overview

The Gold Savings API is a RESTful API that manages gold savings accounts (pockets), transactions, and analytics for users tracking their gold investments. The application supports multiple pocket categories, transaction tracking, and comprehensive analytics.

### Key Features
- Multiple gold savings pockets with categories
- Transaction management with receipt uploads
- Real-time portfolio analytics
- Multi-language support (English/Indonesian)
- Dark mode support

---

## Authentication

**Note:** The current frontend implementation uses localStorage for data persistence. For the backend, implement JWT-based authentication.

### Recommended Authentication Flow

```
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
POST /api/auth/refresh
GET  /api/auth/me
```

**Headers:**
```
Authorization: Bearer <jwt_token>
```

All protected endpoints require a valid JWT token in the Authorization header.

---

## Common Response Formats

### Success Response

```typescript
{
  "success": true,
  "data": T,
  "message": "Optional success message"
}
```

### Paginated Response

```typescript
{
  "success": true,
  "data": T[],
  "pagination": {
    "page": number,
    "limit": number,
    "total": number,
    "totalPages": number
  }
}
```

### Error Response

```typescript
{
  "success": false,
  "message": "Error message",
  "errors": {
    "field_name": ["Error 1", "Error 2"]
  }
}
```

---

## Error Handling

### HTTP Status Codes

| Code | Description |
|------|-------------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 204 | No Content - Request successful, no content to return |
| 400 | Bad Request - Invalid input data |
| 401 | Unauthorized - Authentication required |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource not found |
| 422 | Unprocessable Entity - Validation failed |
| 500 | Internal Server Error - Server error |

### Error Response Examples

**Validation Error (422):**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "name": ["Name is required", "Name must be at least 3 characters"],
    "weight": ["Weight must be greater than 0.1 grams"]
  }
}
```

**Not Found Error (404):**
```json
{
  "success": false,
  "message": "Pocket not found"
}
```

---

## API Endpoints

### Type Pockets (Categories)

Type Pockets represent categories for organizing gold savings (e.g., Emergency Fund, Wedding, Investment).

#### Get All Type Pockets

```
GET /api/type-pockets
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Emergency Fund",
      "description": "Savings for emergency situations",
      "icon": "heroicons:shield-check",
      "color": "blue",
      "createdAt": "2025-11-25T10:00:00.000Z",
      "updatedAt": "2025-11-25T10:00:00.000Z"
    }
  ]
}
```

#### Get Type Pocket by ID

```
GET /api/type-pockets/:id
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Emergency Fund",
    "description": "Savings for emergency situations",
    "icon": "heroicons:shield-check",
    "color": "blue",
    "createdAt": "2025-11-25T10:00:00.000Z",
    "updatedAt": "2025-11-25T10:00:00.000Z"
  }
}
```

#### Create Type Pocket

```
POST /api/type-pockets
```

**Request Body:**
```json
{
  "name": "Education",
  "description": "Savings for education expenses",
  "icon": "heroicons:academic-cap",
  "color": "green"
}
```

**Response:** (201 Created)
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Education",
    "description": "Savings for education expenses",
    "icon": "heroicons:academic-cap",
    "color": "green",
    "createdAt": "2025-11-25T10:00:00.000Z",
    "updatedAt": "2025-11-25T10:00:00.000Z"
  },
  "message": "Type pocket created successfully"
}
```

#### Update Type Pocket

```
PATCH /api/type-pockets/:id
```

**Request Body:**
```json
{
  "name": "Education Fund",
  "description": "Updated description"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Education Fund",
    "description": "Updated description",
    "icon": "heroicons:academic-cap",
    "color": "green",
    "createdAt": "2025-11-25T10:00:00.000Z",
    "updatedAt": "2025-11-25T10:05:00.000Z"
  },
  "message": "Type pocket updated successfully"
}
```

#### Delete Type Pocket

```
DELETE /api/type-pockets/:id
```

**Response:** (204 No Content)

---

### Pockets

Pockets are individual gold savings accounts belonging to a user.

#### Get All Pockets

```
GET /api/pockets
```

**Query Parameters:**
- `typePocketId` (optional): Filter by type pocket ID
- `page` (optional, default: 1): Page number
- `limit` (optional, default: 20): Items per page

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "typePocketId": "uuid",
      "name": "Emergency Fund - 2025",
      "description": "My emergency gold savings",
      "aggregateTotalPrice": 15000000,
      "aggregateTotalWeight": 14.5,
      "targetWeight": 20.0,
      "createdAt": "2025-11-25T10:00:00.000Z",
      "updatedAt": "2025-11-25T10:00:00.000Z"
    }
  ]
}
```

#### Get Pocket by ID (with Relations)

```
GET /api/pockets/:id
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "typePocketId": "uuid",
    "name": "Emergency Fund - 2025",
    "description": "My emergency gold savings",
    "aggregateTotalPrice": 15000000,
    "aggregateTotalWeight": 14.5,
    "targetWeight": 20.0,
    "createdAt": "2025-11-25T10:00:00.000Z",
    "updatedAt": "2025-11-25T10:00:00.000Z",
    "typePocket": {
      "id": "uuid",
      "name": "Emergency Fund",
      "description": "Savings for emergency situations",
      "icon": "heroicons:shield-check",
      "color": "blue",
      "createdAt": "2025-11-25T10:00:00.000Z",
      "updatedAt": "2025-11-25T10:00:00.000Z"
    },
    "transactionCount": 12
  }
}
```

#### Get Pocket Statistics

```
GET /api/pockets/:id/stats
```

**Query Parameters:**
- `currentGoldPrice` (required): Current market price per gram for profit/loss calculation

**Response:**
```json
{
  "success": true,
  "data": {
    "totalWeight": 14.5,
    "totalValue": 15000000,
    "averagePricePerGram": 1034482.76,
    "currentValue": 15297500,
    "profitLoss": 297500,
    "profitLossPercentage": 1.98
  }
}
```

#### Create Pocket

```
POST /api/pockets
```

**Request Body:**
```json
{
  "typePocketId": "uuid",
  "name": "Wedding Fund",
  "description": "Saving for my wedding",
  "targetWeight": 50.0
}
```

**Validation:**
- `typePocketId`: Required, must be a valid UUID
- `name`: Required, 3-100 characters
- `description`: Optional, max 500 characters
- `targetWeight`: Optional, must be > 0 if provided

**Response:** (201 Created)
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "typePocketId": "uuid",
    "name": "Wedding Fund",
    "description": "Saving for my wedding",
    "aggregateTotalPrice": 0,
    "aggregateTotalWeight": 0,
    "targetWeight": 50.0,
    "createdAt": "2025-11-25T10:00:00.000Z",
    "updatedAt": "2025-11-25T10:00:00.000Z"
  },
  "message": "Pocket created successfully"
}
```

#### Update Pocket

```
PATCH /api/pockets/:id
```

**Request Body:**
```json
{
  "name": "Wedding Fund 2026",
  "targetWeight": 60.0
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "typePocketId": "uuid",
    "name": "Wedding Fund 2026",
    "description": "Saving for my wedding",
    "aggregateTotalPrice": 5000000,
    "aggregateTotalWeight": 4.8,
    "targetWeight": 60.0,
    "createdAt": "2025-11-25T10:00:00.000Z",
    "updatedAt": "2025-11-25T10:30:00.000Z"
  },
  "message": "Pocket updated successfully"
}
```

#### Delete Pocket

```
DELETE /api/pockets/:id
```

**Note:** Should check if pocket has transactions. Either:
1. Prevent deletion if transactions exist
2. Cascade delete all related transactions (with confirmation)

**Response:** (204 No Content)

---

### Transactions

Transactions represent gold purchases added to pockets.

#### Get All Transactions

```
GET /api/transactions
```

**Query Parameters:**
- `pocketId` (optional): Filter by pocket ID
- `startDate` (optional): Filter transactions from this date (ISO 8601)
- `endDate` (optional): Filter transactions until this date (ISO 8601)
- `brand` (optional): Filter by gold brand
- `page` (optional, default: 1): Page number
- `limit` (optional, default: 20): Items per page
- `sortBy` (optional, default: 'transactionDate'): Sort field
- `sortOrder` (optional, default: 'desc'): 'asc' or 'desc'

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "pocketId": "uuid",
      "transactionDate": "2025-11-20T00:00:00.000Z",
      "brand": "Antam",
      "weight": 2.5,
      "pricePerGram": 1050000,
      "totalPrice": 2625000,
      "description": "Monthly gold purchase",
      "receiptImage": "https://storage.example.com/receipts/abc123.jpg",
      "createdAt": "2025-11-25T10:00:00.000Z",
      "updatedAt": "2025-11-25T10:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "totalPages": 3
  }
}
```

#### Get Transaction by ID (with Pocket Info)

```
GET /api/transactions/:id
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "pocketId": "uuid",
    "transactionDate": "2025-11-20T00:00:00.000Z",
    "brand": "Antam",
    "weight": 2.5,
    "pricePerGram": 1050000,
    "totalPrice": 2625000,
    "description": "Monthly gold purchase",
    "receiptImage": "https://storage.example.com/receipts/abc123.jpg",
    "createdAt": "2025-11-25T10:00:00.000Z",
    "updatedAt": "2025-11-25T10:00:00.000Z",
    "pocket": {
      "id": "uuid",
      "name": "Emergency Fund - 2025",
      "typePocketId": "uuid"
    }
  }
}
```

#### Create Transaction

```
POST /api/transactions
```

**Request Body:**
```json
{
  "pocketId": "uuid",
  "transactionDate": "2025-11-25",
  "brand": "Antam",
  "weight": 2.5,
  "pricePerGram": 1050000,
  "totalPrice": 2625000,
  "description": "Monthly gold purchase",
  "receiptImage": "base64_encoded_image_or_url"
}
```

**Validation:**
- `pocketId`: Required, must be a valid UUID and exist
- `transactionDate`: Required, valid date (not future)
- `brand`: Required, one of: Antam, UBS, Pegadaian, King Halim, Custom
- `weight`: Required, 0.1 - 1000 grams
- `pricePerGram`: Required, 1000 - 10000000 IDR
- `totalPrice`: Required, must equal weight * pricePerGram
- `description`: Optional, max 500 characters
- `receiptImage`: Optional, valid image URL or base64

**Response:** (201 Created)
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "pocketId": "uuid",
    "transactionDate": "2025-11-25T00:00:00.000Z",
    "brand": "Antam",
    "weight": 2.5,
    "pricePerGram": 1050000,
    "totalPrice": 2625000,
    "description": "Monthly gold purchase",
    "receiptImage": "https://storage.example.com/receipts/abc123.jpg",
    "createdAt": "2025-11-25T10:00:00.000Z",
    "updatedAt": "2025-11-25T10:00:00.000Z"
  },
  "message": "Transaction created successfully"
}
```

**Side Effects:**
- Update pocket's `aggregateTotalPrice` and `aggregateTotalWeight`

#### Update Transaction

```
PATCH /api/transactions/:id
```

**Request Body:**
```json
{
  "weight": 3.0,
  "pricePerGram": 1055000,
  "totalPrice": 3165000,
  "description": "Updated monthly gold purchase"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "pocketId": "uuid",
    "transactionDate": "2025-11-25T00:00:00.000Z",
    "brand": "Antam",
    "weight": 3.0,
    "pricePerGram": 1055000,
    "totalPrice": 3165000,
    "description": "Updated monthly gold purchase",
    "receiptImage": "https://storage.example.com/receipts/abc123.jpg",
    "createdAt": "2025-11-25T10:00:00.000Z",
    "updatedAt": "2025-11-25T10:30:00.000Z"
  },
  "message": "Transaction updated successfully"
}
```

**Side Effects:**
- Recalculate and update pocket's `aggregateTotalPrice` and `aggregateTotalWeight`

#### Delete Transaction

```
DELETE /api/transactions/:id
```

**Response:** (204 No Content)

**Side Effects:**
- Recalculate and update pocket's `aggregateTotalPrice` and `aggregateTotalWeight`

#### Upload Receipt Image

```
POST /api/transactions/:id/receipt
```

**Request:** (multipart/form-data)
```
receipt: <file>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "receiptImage": "https://storage.example.com/receipts/abc123.jpg"
  },
  "message": "Receipt uploaded successfully"
}
```

---

### Analytics

Analytics endpoints provide aggregated data and insights about the user's gold portfolio.

#### Get Dashboard Summary

```
GET /api/analytics/dashboard
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalValue": 15000000,
    "totalWeight": 14.5,
    "totalPockets": 3,
    "totalTransactions": 12,
    "averagePricePerGram": 1034482.76,
    "recentTransactions": [
      {
        "id": "uuid",
        "pocketId": "uuid",
        "transactionDate": "2025-11-20T00:00:00.000Z",
        "brand": "Antam",
        "weight": 2.5,
        "totalPrice": 2625000,
        "pocket": {
          "id": "uuid",
          "name": "Emergency Fund - 2025"
        }
      }
    ]
  }
}
```

#### Get Portfolio Analytics

```
GET /api/analytics/portfolio
```

**Query Parameters:**
- `currentGoldPrice` (optional): Current market price for profit/loss calculation

**Response:**
```json
{
  "success": true,
  "data": {
    "totalValue": 15000000,
    "totalWeight": 14.5,
    "averagePricePerGram": 1034482.76,
    "currentMarketPrice": 1055000,
    "currentValue": 15297500,
    "profitLoss": 297500,
    "profitLossPercentage": 1.98,
    "distribution": [
      {
        "pocketId": "uuid",
        "pocketName": "Emergency Fund - 2025",
        "typePocketName": "Emergency Fund",
        "weight": 8.5,
        "value": 8500000,
        "percentage": 56.67
      },
      {
        "pocketId": "uuid",
        "pocketName": "Wedding Fund",
        "typePocketName": "Wedding",
        "weight": 6.0,
        "value": 6500000,
        "percentage": 43.33
      }
    ]
  }
}
```

#### Get Monthly Purchase Analytics

```
GET /api/analytics/monthly-purchases
```

**Query Parameters:**
- `months` (optional, default: 6): Number of months to include
- `pocketId` (optional): Filter by specific pocket

**Response:**
```json
{
  "success": true,
  "data": {
    "monthlyData": [
      {
        "month": "2025-06",
        "weight": 3.5,
        "amount": 3675000,
        "count": 2,
        "averagePricePerGram": 1050000
      },
      {
        "month": "2025-07",
        "weight": 2.5,
        "amount": 2625000,
        "count": 1,
        "averagePricePerGram": 1050000
      }
    ],
    "averageMonthlyPurchase": 3150000,
    "totalPeriodWeight": 6.0,
    "totalPeriodAmount": 6300000
  }
}
```

#### Get Brand Distribution

```
GET /api/analytics/brand-distribution
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "brand": "Antam",
      "weight": 10.5,
      "value": 11025000,
      "transactionCount": 8,
      "percentage": 72.41
    },
    {
      "brand": "UBS",
      "weight": 4.0,
      "value": 3975000,
      "transactionCount": 4,
      "percentage": 27.59
    }
  ]
}
```

#### Get Transaction Trends

```
GET /api/analytics/trends
```

**Query Parameters:**
- `period` (optional, default: '6m'): '1m', '3m', '6m', '1y', 'all'
- `groupBy` (optional, default: 'month'): 'day', 'week', 'month'

**Response:**
```json
{
  "success": true,
  "data": {
    "trends": [
      {
        "period": "2025-06",
        "totalWeight": 3.5,
        "totalValue": 3675000,
        "transactionCount": 2,
        "averagePricePerGram": 1050000
      }
    ],
    "summary": {
      "totalWeight": 14.5,
      "totalValue": 15000000,
      "transactionCount": 12,
      "averagePricePerGram": 1034482.76,
      "lowestPricePerGram": 1020000,
      "highestPricePerGram": 1055000
    }
  }
}
```

---

### Gold Price

External gold price tracking and historical data.

#### Get Current Gold Price

```
GET /api/gold-price/current
```

**Response:**
```json
{
  "success": true,
  "data": {
    "pricePerGram": 1055000,
    "currency": "IDR",
    "source": "Antam",
    "lastUpdated": "2025-11-25T10:00:00.000Z",
    "change24h": 5000,
    "changePercentage24h": 0.48
  }
}
```

#### Get Historical Gold Prices

```
GET /api/gold-price/history
```

**Query Parameters:**
- `startDate` (optional): Start date (ISO 8601)
- `endDate` (optional): End date (ISO 8601)
- `period` (optional, default: '1m'): '1w', '1m', '3m', '6m', '1y'

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "date": "2025-11-25",
      "pricePerGram": 1055000,
      "source": "Antam"
    },
    {
      "date": "2025-11-24",
      "pricePerGram": 1050000,
      "source": "Antam"
    }
  ]
}
```

---

## Data Models

### TypePocket

```typescript
interface TypePocket {
  id: string                // UUID
  name: string              // e.g., "Emergency Fund"
  description: string       // Category description
  icon: string              // Icon identifier (e.g., "heroicons:shield-check")
  color: string             // Color identifier (e.g., "blue")
  createdAt: Date
  updatedAt: Date
}
```

### Pocket

```typescript
interface Pocket {
  id: string                    // UUID
  userId: string                // UUID (from auth)
  typePocketId: string          // UUID, foreign key to TypePocket
  name: string                  // User-defined pocket name
  description: string           // Optional description
  aggregateTotalPrice: number   // Sum of all transaction totalPrice
  aggregateTotalWeight: number  // Sum of all transaction weight
  targetWeight?: number         // Optional target weight goal
  createdAt: Date
  updatedAt: Date
}
```

### Transaction

```typescript
interface Transaction {
  id: string                // UUID
  userId: string            // UUID (from auth)
  pocketId: string          // UUID, foreign key to Pocket
  transactionDate: Date     // Date of gold purchase
  brand: string             // Gold brand (Antam, UBS, etc.)
  weight: number            // Weight in grams
  pricePerGram: number      // Price per gram in IDR
  totalPrice: number        // Total price (weight * pricePerGram)
  description?: string      // Optional notes
  receiptImage?: string     // URL to receipt image
  createdAt: Date
  updatedAt: Date
}
```

### GoldPrice

```typescript
interface GoldPrice {
  id: string                // UUID
  date: Date                // Price date
  pricePerGram: number      // Price per gram in IDR
  source: string            // Source (e.g., "Antam", "UBS")
  createdAt: Date
}
```

---

## Business Rules & Validation

### Transaction Validation

```typescript
const BUSINESS_RULES = {
  // Transaction constraints
  minTransactionWeight: 0.1,      // grams
  maxTransactionWeight: 1000,     // grams
  minPricePerGram: 1000,          // IDR
  maxPricePerGram: 10000000,      // IDR

  // Pocket constraints
  minPocketNameLength: 3,
  maxPocketNameLength: 100,
  maxDescriptionLength: 500,

  // Pagination
  defaultPageSize: 20,
  maxPageSize: 100,
}
```

### Validation Rules

#### Pocket Creation/Update
- `name`: Required, 3-100 characters, unique per user
- `description`: Optional, max 500 characters
- `typePocketId`: Required, must exist in TypePocket table
- `targetWeight`: Optional, must be > 0 if provided

#### Transaction Creation/Update
- `pocketId`: Required, must exist and belong to user
- `transactionDate`: Required, cannot be in the future
- `brand`: Required, must be one of the valid brands
- `weight`: Required, 0.1 - 1000 grams
- `pricePerGram`: Required, 1000 - 10,000,000 IDR
- `totalPrice`: Required, must equal `weight * pricePerGram`
- `description`: Optional, max 500 characters
- `receiptImage`: Optional, valid image format (jpg, png, webp), max 5MB

### Aggregate Calculations

When a transaction is created, updated, or deleted:

```typescript
// Recalculate pocket aggregates
pocket.aggregateTotalWeight = SUM(transactions.weight WHERE pocketId = pocket.id)
pocket.aggregateTotalPrice = SUM(transactions.totalPrice WHERE pocketId = pocket.id)
```

---

## Database Schema

### Recommended PostgreSQL Schema

```sql
-- Users table (from authentication system)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Type Pockets (Categories)
CREATE TABLE type_pockets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  icon VARCHAR(100),
  color VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Pockets
CREATE TABLE pockets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type_pocket_id UUID NOT NULL REFERENCES type_pockets(id),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  aggregate_total_price DECIMAL(15, 2) DEFAULT 0,
  aggregate_total_weight DECIMAL(10, 3) DEFAULT 0,
  target_weight DECIMAL(10, 3),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT unique_pocket_name_per_user UNIQUE(user_id, name)
);

-- Transactions
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  pocket_id UUID NOT NULL REFERENCES pockets(id) ON DELETE CASCADE,
  transaction_date DATE NOT NULL,
  brand VARCHAR(50) NOT NULL,
  weight DECIMAL(10, 3) NOT NULL CHECK (weight >= 0.1 AND weight <= 1000),
  price_per_gram DECIMAL(15, 2) NOT NULL CHECK (price_per_gram >= 1000 AND price_per_gram <= 10000000),
  total_price DECIMAL(15, 2) NOT NULL,
  description TEXT,
  receipt_image TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT check_total_price CHECK (total_price = weight * price_per_gram)
);

-- Gold Prices (for historical tracking)
CREATE TABLE gold_prices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL,
  price_per_gram DECIMAL(15, 2) NOT NULL,
  source VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT unique_price_per_date_source UNIQUE(date, source)
);

-- Indexes for performance
CREATE INDEX idx_pockets_user_id ON pockets(user_id);
CREATE INDEX idx_pockets_type_pocket_id ON pockets(type_pocket_id);
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_pocket_id ON transactions(pocket_id);
CREATE INDEX idx_transactions_date ON transactions(transaction_date);
CREATE INDEX idx_transactions_brand ON transactions(brand);
CREATE INDEX idx_gold_prices_date ON gold_prices(date);

-- Triggers to update aggregate values
CREATE OR REPLACE FUNCTION update_pocket_aggregates()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    UPDATE pockets
    SET 
      aggregate_total_weight = COALESCE((
        SELECT SUM(weight) FROM transactions WHERE pocket_id = OLD.pocket_id
      ), 0),
      aggregate_total_price = COALESCE((
        SELECT SUM(total_price) FROM transactions WHERE pocket_id = OLD.pocket_id
      ), 0),
      updated_at = CURRENT_TIMESTAMP
    WHERE id = OLD.pocket_id;
    RETURN OLD;
  ELSE
    UPDATE pockets
    SET 
      aggregate_total_weight = COALESCE((
        SELECT SUM(weight) FROM transactions WHERE pocket_id = NEW.pocket_id
      ), 0),
      aggregate_total_price = COALESCE((
        SELECT SUM(total_price) FROM transactions WHERE pocket_id = NEW.pocket_id
      ), 0),
      updated_at = CURRENT_TIMESTAMP
    WHERE id = NEW.pocket_id;
    RETURN NEW;
  END IF;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_pocket_aggregates
AFTER INSERT OR UPDATE OR DELETE ON transactions
FOR EACH ROW
EXECUTE FUNCTION update_pocket_aggregates();

-- Seed data for type_pockets
INSERT INTO type_pockets (name, description, icon, color) VALUES
  ('Emergency Fund', 'Savings for emergency situations', 'heroicons:shield-check', 'blue'),
  ('Wedding', 'Savings for wedding expenses', 'heroicons:heart', 'pink'),
  ('Investment', 'General investment savings', 'heroicons:chart-bar', 'gold'),
  ('Education', 'Savings for education expenses', 'heroicons:academic-cap', 'green'),
  ('Retirement', 'Savings for retirement', 'heroicons:home', 'purple');
```

---

## Implementation Notes

### Technology Stack Recommendations

**Backend Framework:**
- Node.js with Express.js or NestJS
- TypeScript for type safety

**Database:**
- PostgreSQL (recommended for ACID compliance and complex queries)
- Alternative: MySQL/MariaDB

**ORM:**
- Prisma (recommended for TypeScript)
- TypeORM
- Sequelize

**File Storage:**
- AWS S3 for receipt images
- Cloudinary for image optimization
- Local storage for development

**Authentication:**
- JWT tokens
- Passport.js or custom middleware
- bcrypt for password hashing

**Validation:**
- Joi or Zod for request validation
- class-validator with class-transformer

### API Best Practices

1. **Versioning**: Consider API versioning (e.g., `/api/v1/pockets`)
2. **Rate Limiting**: Implement rate limiting to prevent abuse
3. **Caching**: Cache frequently accessed data (type pockets, gold prices)
4. **Logging**: Implement comprehensive logging (Winston, Pino)
5. **Error Handling**: Centralized error handling middleware
6. **Testing**: Unit tests, integration tests, E2E tests
7. **Documentation**: Auto-generate API docs with Swagger/OpenAPI
8. **Security**: 
   - CORS configuration
   - Helmet.js for security headers
   - Input sanitization
   - SQL injection prevention (use parameterized queries)
   - XSS protection

### Performance Optimization

1. **Database Indexing**: Proper indexes on foreign keys and frequently queried fields
2. **Pagination**: Always paginate list endpoints
3. **Lazy Loading**: Load relations only when needed
4. **Caching**: Redis for session storage and frequently accessed data
5. **Database Connection Pooling**: Configure appropriate pool sizes
6. **Query Optimization**: Use database triggers for aggregate calculations

### Future Enhancements

1. **Real-time Updates**: WebSocket support for live gold price updates
2. **Notifications**: Email/push notifications for price alerts
3. **Export**: CSV/Excel export functionality
4. **Multi-currency**: Support for multiple currencies
5. **Social Features**: Share portfolio performance
6. **Goals**: Advanced goal tracking and recommendations
7. **Marketplace**: Integration with gold marketplaces
8. **Tax Reports**: Generate tax reports for gold investments

---

## Appendix

### Gold Brands

```typescript
const GOLD_BRANDS = [
  'Antam',
  'UBS',
  'Pegadaian',
  'King Halim',
  'Custom'
] as const;
```

### Supported Locales

```typescript
const LOCALES = ['en', 'id'] as const;
```

### Date Formats

```typescript
const DATE_FORMATS = {
  display: 'dd MMM yyyy',
  displayWithTime: 'dd MMM yyyy HH:mm',
  input: 'yyyy-MM-dd',
  api: "yyyy-MM-dd'T'HH:mm:ss.SSSxxx",
} as const;
```

---

**End of API Specification**
