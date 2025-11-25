# Gold Savings Backend - Implementation Guide

This guide provides practical examples and step-by-step instructions for implementing the Gold Savings backend API.

---

## Table of Contents

1. [Quick Start](#quick-start)
2. [Project Structure](#project-structure)
3. [Environment Setup](#environment-setup)
4. [Example Implementations](#example-implementations)
5. [Testing Examples](#testing-examples)
6. [Deployment Guide](#deployment-guide)

---

## Quick Start

### Prerequisites

- Node.js 18+ and npm/pnpm/yarn
- PostgreSQL 14+
- Redis (optional, for caching)

### Initial Setup

```bash
# Create project directory
mkdir nabung-emas-backend
cd nabung-emas-backend

# Initialize Node.js project
npm init -y

# Install dependencies
npm install express typescript @types/express @types/node
npm install prisma @prisma/client
npm install jsonwebtoken bcryptjs
npm install joi
npm install cors helmet morgan
npm install dotenv

# Install dev dependencies
npm install -D ts-node nodemon @types/jsonwebtoken @types/bcryptjs @types/cors
```

### Initialize TypeScript

```bash
npx tsc --init
```

**tsconfig.json:**
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "moduleResolution": "node"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
```

### Initialize Prisma

```bash
npx prisma init
```

---

## Project Structure

```
nabung-emas-backend/
├── src/
│   ├── config/
│   │   ├── database.ts
│   │   └── env.ts
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   ├── pocket.controller.ts
│   │   ├── transaction.controller.ts
│   │   ├── typePocket.controller.ts
│   │   ├── analytics.controller.ts
│   │   └── goldPrice.controller.ts
│   ├── middleware/
│   │   ├── auth.middleware.ts
│   │   ├── validation.middleware.ts
│   │   ├── error.middleware.ts
│   │   └── logger.middleware.ts
│   ├── models/
│   │   └── (Prisma generated)
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   ├── pocket.routes.ts
│   │   ├── transaction.routes.ts
│   │   ├── typePocket.routes.ts
│   │   ├── analytics.routes.ts
│   │   └── goldPrice.routes.ts
│   ├── services/
│   │   ├── auth.service.ts
│   │   ├── pocket.service.ts
│   │   ├── transaction.service.ts
│   │   ├── typePocket.service.ts
│   │   ├── analytics.service.ts
│   │   └── goldPrice.service.ts
│   ├── types/
│   │   ├── api.types.ts
│   │   ├── pocket.types.ts
│   │   └── transaction.types.ts
│   ├── utils/
│   │   ├── constants.ts
│   │   ├── validators.ts
│   │   └── helpers.ts
│   ├── app.ts
│   └── server.ts
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── .env
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

---

## Environment Setup

### .env.example

```env
# Server
NODE_ENV=development
PORT=3000
API_VERSION=v1

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/nabung_emas?schema=public"

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your-refresh-token-secret
JWT_REFRESH_EXPIRES_IN=30d

# CORS
CORS_ORIGIN=http://localhost:3000,http://localhost:5173

# File Upload
MAX_FILE_SIZE=5242880
UPLOAD_DIR=./uploads

# AWS S3 (for production)
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=
AWS_S3_BUCKET=

# Redis (optional)
REDIS_URL=redis://localhost:6379

# Gold Price API (if using external service)
GOLD_PRICE_API_URL=
GOLD_PRICE_API_KEY=
```

---

## Example Implementations

### 1. Prisma Schema

**prisma/schema.prisma:**

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id           String        @id @default(uuid())
  email        String        @unique
  passwordHash String        @map("password_hash")
  name         String?
  createdAt    DateTime      @default(now()) @map("created_at")
  updatedAt    DateTime      @updatedAt @map("updated_at")
  
  pockets      Pocket[]
  transactions Transaction[]

  @@map("users")
}

model TypePocket {
  id          String   @id @default(uuid())
  name        String
  description String
  icon        String
  color       String
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")
  
  pockets     Pocket[]

  @@map("type_pockets")
}

model Pocket {
  id                   String   @id @default(uuid())
  userId               String   @map("user_id")
  typePocketId         String   @map("type_pocket_id")
  name                 String
  description          String?
  aggregateTotalPrice  Decimal  @default(0) @map("aggregate_total_price") @db.Decimal(15, 2)
  aggregateTotalWeight Decimal  @default(0) @map("aggregate_total_weight") @db.Decimal(10, 3)
  targetWeight         Decimal? @map("target_weight") @db.Decimal(10, 3)
  createdAt            DateTime @default(now()) @map("created_at")
  updatedAt            DateTime @updatedAt @map("updated_at")
  
  user                 User        @relation(fields: [userId], references: [id], onDelete: Cascade)
  typePocket           TypePocket  @relation(fields: [typePocketId], references: [id])
  transactions         Transaction[]

  @@unique([userId, name])
  @@index([userId])
  @@index([typePocketId])
  @@map("pockets")
}

model Transaction {
  id              String   @id @default(uuid())
  userId          String   @map("user_id")
  pocketId        String   @map("pocket_id")
  transactionDate DateTime @map("transaction_date") @db.Date
  brand           String
  weight          Decimal  @db.Decimal(10, 3)
  pricePerGram    Decimal  @map("price_per_gram") @db.Decimal(15, 2)
  totalPrice      Decimal  @map("total_price") @db.Decimal(15, 2)
  description     String?
  receiptImage    String?  @map("receipt_image")
  createdAt       DateTime @default(now()) @map("created_at")
  updatedAt       DateTime @updatedAt @map("updated_at")
  
  user            User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  pocket          Pocket   @relation(fields: [pocketId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([pocketId])
  @@index([transactionDate])
  @@index([brand])
  @@map("transactions")
}

model GoldPrice {
  id           String   @id @default(uuid())
  date         DateTime @db.Date
  pricePerGram Decimal  @map("price_per_gram") @db.Decimal(15, 2)
  source       String
  createdAt    DateTime @default(now()) @map("created_at")

  @@unique([date, source])
  @@index([date])
  @@map("gold_prices")
}
```

### 2. Main Application Setup

**src/app.ts:**

```typescript
import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from './config/env';
import { errorHandler } from './middleware/error.middleware';

// Import routes
import authRoutes from './routes/auth.routes';
import pocketRoutes from './routes/pocket.routes';
import transactionRoutes from './routes/transaction.routes';
import typePocketRoutes from './routes/typePocket.routes';
import analyticsRoutes from './routes/analytics.routes';
import goldPriceRoutes from './routes/goldPrice.routes';

const app: Application = express();

// Middleware
app.use(helmet());
app.use(cors({
  origin: config.corsOrigin.split(','),
  credentials: true,
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
const apiPrefix = `/api/${config.apiVersion}`;
app.use(`${apiPrefix}/auth`, authRoutes);
app.use(`${apiPrefix}/pockets`, pocketRoutes);
app.use(`${apiPrefix}/transactions`, transactionRoutes);
app.use(`${apiPrefix}/type-pockets`, typePocketRoutes);
app.use(`${apiPrefix}/analytics`, analyticsRoutes);
app.use(`${apiPrefix}/gold-price`, goldPriceRoutes);

// Error handling
app.use(errorHandler);

export default app;
```

**src/server.ts:**

```typescript
import app from './app';
import { config } from './config/env';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function startServer() {
  try {
    // Test database connection
    await prisma.$connect();
    console.log('✅ Database connected successfully');

    // Start server
    app.listen(config.port, () => {
      console.log(`🚀 Server running on port ${config.port}`);
      console.log(`📝 Environment: ${config.nodeEnv}`);
      console.log(`🔗 API: http://localhost:${config.port}/api/${config.apiVersion}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});

startServer();
```

### 3. Configuration

**src/config/env.ts:**

```typescript
import dotenv from 'dotenv';

dotenv.config();

export const config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),
  apiVersion: process.env.API_VERSION || 'v1',
  
  database: {
    url: process.env.DATABASE_URL!,
  },
  
  jwt: {
    secret: process.env.JWT_SECRET!,
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    refreshSecret: process.env.JWT_REFRESH_SECRET!,
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
  },
  
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  
  upload: {
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '5242880', 10),
    uploadDir: process.env.UPLOAD_DIR || './uploads',
  },
  
  aws: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
    s3Bucket: process.env.AWS_S3_BUCKET,
  },
};
```

### 4. Middleware Examples

**src/middleware/auth.middleware.ts:**

```typescript
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/env';
import { ApiError } from '../utils/ApiError';

export interface AuthRequest extends Request {
  userId?: string;
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new ApiError(401, 'No token provided');
    }
    
    const token = authHeader.substring(7);
    
    const decoded = jwt.verify(token, config.jwt.secret) as { userId: string };
    req.userId = decoded.userId;
    
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(new ApiError(401, 'Invalid token'));
    } else {
      next(error);
    }
  }
};
```

**src/middleware/validation.middleware.ts:**

```typescript
import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { ApiError } from '../utils/ApiError';

export const validate = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });
    
    if (error) {
      const errors: Record<string, string[]> = {};
      
      error.details.forEach((detail) => {
        const key = detail.path.join('.');
        if (!errors[key]) {
          errors[key] = [];
        }
        errors[key].push(detail.message);
      });
      
      throw new ApiError(422, 'Validation failed', errors);
    }
    
    req.body = value;
    next();
  };
};
```

**src/middleware/error.middleware.ts:**

```typescript
import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors,
    });
  }
  
  console.error('Unhandled error:', err);
  
  res.status(500).json({
    success: false,
    message: 'Internal server error',
  });
};
```

### 5. Service Layer Example

**src/services/pocket.service.ts:**

```typescript
import { PrismaClient, Pocket } from '@prisma/client';
import { ApiError } from '../utils/ApiError';

const prisma = new PrismaClient();

export interface CreatePocketDto {
  typePocketId: string;
  name: string;
  description?: string;
  targetWeight?: number;
}

export interface UpdatePocketDto {
  typePocketId?: string;
  name?: string;
  description?: string;
  targetWeight?: number;
}

export class PocketService {
  async findAll(userId: string, typePocketId?: string): Promise<Pocket[]> {
    return prisma.pocket.findMany({
      where: {
        userId,
        ...(typePocketId && { typePocketId }),
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findById(id: string, userId: string) {
    const pocket = await prisma.pocket.findFirst({
      where: { id, userId },
      include: {
        typePocket: true,
        _count: {
          select: { transactions: true },
        },
      },
    });

    if (!pocket) {
      throw new ApiError(404, 'Pocket not found');
    }

    return {
      ...pocket,
      transactionCount: pocket._count.transactions,
    };
  }

  async create(userId: string, data: CreatePocketDto): Promise<Pocket> {
    // Check if type pocket exists
    const typePocket = await prisma.typePocket.findUnique({
      where: { id: data.typePocketId },
    });

    if (!typePocket) {
      throw new ApiError(404, 'Type pocket not found');
    }

    // Check for duplicate name
    const existing = await prisma.pocket.findFirst({
      where: {
        userId,
        name: data.name,
      },
    });

    if (existing) {
      throw new ApiError(400, 'Pocket with this name already exists');
    }

    return prisma.pocket.create({
      data: {
        userId,
        ...data,
      },
    });
  }

  async update(
    id: string,
    userId: string,
    data: UpdatePocketDto
  ): Promise<Pocket> {
    // Check if pocket exists and belongs to user
    const pocket = await prisma.pocket.findFirst({
      where: { id, userId },
    });

    if (!pocket) {
      throw new ApiError(404, 'Pocket not found');
    }

    // If updating name, check for duplicates
    if (data.name && data.name !== pocket.name) {
      const existing = await prisma.pocket.findFirst({
        where: {
          userId,
          name: data.name,
          id: { not: id },
        },
      });

      if (existing) {
        throw new ApiError(400, 'Pocket with this name already exists');
      }
    }

    return prisma.pocket.update({
      where: { id },
      data,
    });
  }

  async delete(id: string, userId: string): Promise<void> {
    const pocket = await prisma.pocket.findFirst({
      where: { id, userId },
      include: {
        _count: {
          select: { transactions: true },
        },
      },
    });

    if (!pocket) {
      throw new ApiError(404, 'Pocket not found');
    }

    if (pocket._count.transactions > 0) {
      throw new ApiError(
        400,
        'Cannot delete pocket with existing transactions'
      );
    }

    await prisma.pocket.delete({
      where: { id },
    });
  }

  async getStats(id: string, userId: string, currentGoldPrice: number) {
    const pocket = await prisma.pocket.findFirst({
      where: { id, userId },
    });

    if (!pocket) {
      throw new ApiError(404, 'Pocket not found');
    }

    const totalWeight = Number(pocket.aggregateTotalWeight);
    const totalValue = Number(pocket.aggregateTotalPrice);
    const averagePricePerGram = totalWeight > 0 ? totalValue / totalWeight : 0;
    const currentValue = totalWeight * currentGoldPrice;
    const profitLoss = currentValue - totalValue;
    const profitLossPercentage = totalValue > 0 ? (profitLoss / totalValue) * 100 : 0;

    return {
      totalWeight,
      totalValue,
      averagePricePerGram,
      currentValue,
      profitLoss,
      profitLossPercentage,
    };
  }
}
```

### 6. Controller Example

**src/controllers/pocket.controller.ts:**

```typescript
import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { PocketService } from '../services/pocket.service';

const pocketService = new PocketService();

export class PocketController {
  async getAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { typePocketId } = req.query;
      const pockets = await pocketService.findAll(
        req.userId!,
        typePocketId as string
      );

      res.json({
        success: true,
        data: pockets,
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const pocket = await pocketService.findById(id, req.userId!);

      res.json({
        success: true,
        data: pocket,
      });
    } catch (error) {
      next(error);
    }
  }

  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const pocket = await pocketService.create(req.userId!, req.body);

      res.status(201).json({
        success: true,
        data: pocket,
        message: 'Pocket created successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const pocket = await pocketService.update(id, req.userId!, req.body);

      res.json({
        success: true,
        data: pocket,
        message: 'Pocket updated successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await pocketService.delete(id, req.userId!);

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  async getStats(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { currentGoldPrice } = req.query;

      if (!currentGoldPrice) {
        return res.status(400).json({
          success: false,
          message: 'currentGoldPrice is required',
        });
      }

      const stats = await pocketService.getStats(
        id,
        req.userId!,
        Number(currentGoldPrice)
      );

      res.json({
        success: true,
        data: stats,
      });
    } catch (error) {
      next(error);
    }
  }
}
```

### 7. Routes Example

**src/routes/pocket.routes.ts:**

```typescript
import { Router } from 'express';
import { PocketController } from '../controllers/pocket.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';
import { pocketValidation } from '../utils/validators';

const router = Router();
const controller = new PocketController();

// All routes require authentication
router.use(authenticate);

router.get('/', controller.getAll.bind(controller));
router.get('/:id', controller.getById.bind(controller));
router.get('/:id/stats', controller.getStats.bind(controller));
router.post('/', validate(pocketValidation.create), controller.create.bind(controller));
router.patch('/:id', validate(pocketValidation.update), controller.update.bind(controller));
router.delete('/:id', controller.delete.bind(controller));

export default router;
```

### 8. Validation Schemas

**src/utils/validators.ts:**

```typescript
import Joi from 'joi';

export const pocketValidation = {
  create: Joi.object({
    typePocketId: Joi.string().uuid().required(),
    name: Joi.string().min(3).max(100).required(),
    description: Joi.string().max(500).optional(),
    targetWeight: Joi.number().positive().optional(),
  }),

  update: Joi.object({
    typePocketId: Joi.string().uuid().optional(),
    name: Joi.string().min(3).max(100).optional(),
    description: Joi.string().max(500).optional(),
    targetWeight: Joi.number().positive().optional(),
  }),
};

export const transactionValidation = {
  create: Joi.object({
    pocketId: Joi.string().uuid().required(),
    transactionDate: Joi.date().max('now').required(),
    brand: Joi.string().valid('Antam', 'UBS', 'Pegadaian', 'King Halim', 'Custom').required(),
    weight: Joi.number().min(0.1).max(1000).required(),
    pricePerGram: Joi.number().min(1000).max(10000000).required(),
    totalPrice: Joi.number().required(),
    description: Joi.string().max(500).optional(),
    receiptImage: Joi.string().optional(),
  }).custom((value, helpers) => {
    const calculatedTotal = value.weight * value.pricePerGram;
    if (Math.abs(calculatedTotal - value.totalPrice) > 0.01) {
      return helpers.error('any.invalid');
    }
    return value;
  }),

  update: Joi.object({
    transactionDate: Joi.date().max('now').optional(),
    brand: Joi.string().valid('Antam', 'UBS', 'Pegadaian', 'King Halim', 'Custom').optional(),
    weight: Joi.number().min(0.1).max(1000).optional(),
    pricePerGram: Joi.number().min(1000).max(10000000).optional(),
    totalPrice: Joi.number().optional(),
    description: Joi.string().max(500).optional(),
    receiptImage: Joi.string().optional(),
  }),
};
```

### 9. Utility Classes

**src/utils/ApiError.ts:**

```typescript
export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public errors?: Record<string, string[]>
  ) {
    super(message);
    this.name = 'ApiError';
    Error.captureStackTrace(this, this.constructor);
  }
}
```

---

## Testing Examples

### Unit Test Example

**tests/unit/pocket.service.test.ts:**

```typescript
import { PocketService } from '../../src/services/pocket.service';
import { PrismaClient } from '@prisma/client';

jest.mock('@prisma/client');

describe('PocketService', () => {
  let pocketService: PocketService;
  let prisma: PrismaClient;

  beforeEach(() => {
    prisma = new PrismaClient();
    pocketService = new PocketService();
  });

  describe('findAll', () => {
    it('should return all pockets for a user', async () => {
      const mockPockets = [
        {
          id: '1',
          userId: 'user1',
          name: 'Test Pocket',
          // ... other fields
        },
      ];

      (prisma.pocket.findMany as jest.Mock).mockResolvedValue(mockPockets);

      const result = await pocketService.findAll('user1');

      expect(result).toEqual(mockPockets);
      expect(prisma.pocket.findMany).toHaveBeenCalledWith({
        where: { userId: 'user1' },
        orderBy: { createdAt: 'desc' },
      });
    });
  });
});
```

### Integration Test Example

**tests/integration/pocket.test.ts:**

```typescript
import request from 'supertest';
import app from '../../src/app';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('Pocket API', () => {
  let authToken: string;
  let userId: string;

  beforeAll(async () => {
    // Setup: Create test user and get auth token
    const response = await request(app)
      .post('/api/v1/auth/register')
      .send({
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      });

    authToken = response.body.data.token;
    userId = response.body.data.user.id;
  });

  afterAll(async () => {
    // Cleanup: Delete test data
    await prisma.pocket.deleteMany({ where: { userId } });
    await prisma.user.delete({ where: { id: userId } });
    await prisma.$disconnect();
  });

  describe('POST /api/v1/pockets', () => {
    it('should create a new pocket', async () => {
      const response = await request(app)
        .post('/api/v1/pockets')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          typePocketId: 'some-type-id',
          name: 'Emergency Fund',
          description: 'My emergency savings',
          targetWeight: 20,
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe('Emergency Fund');
    });

    it('should return 401 without auth token', async () => {
      const response = await request(app)
        .post('/api/v1/pockets')
        .send({
          typePocketId: 'some-type-id',
          name: 'Test Pocket',
        });

      expect(response.status).toBe(401);
    });
  });
});
```

---

## Deployment Guide

### Docker Setup

**Dockerfile:**

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

RUN npx prisma generate
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

**docker-compose.yml:**

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://postgres:password@db:5432/nabung_emas
    depends_on:
      - db
    restart: unless-stopped

  db:
    image: postgres:14-alpine
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
      - POSTGRES_DB=nabung_emas
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    restart: unless-stopped

volumes:
  postgres_data:
```

### Production Checklist

- [ ] Set strong JWT secrets
- [ ] Configure CORS properly
- [ ] Enable HTTPS/SSL
- [ ] Set up database backups
- [ ] Configure logging (Winston, CloudWatch)
- [ ] Set up monitoring (Sentry, DataDog)
- [ ] Configure rate limiting
- [ ] Set up CI/CD pipeline
- [ ] Environment variables secured
- [ ] Database migrations tested
- [ ] API documentation published (Swagger)
- [ ] Load testing completed

---

## Additional Resources

### Package.json Scripts

```json
{
  "scripts": {
    "dev": "nodemon src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev",
    "prisma:seed": "ts-node prisma/seed.ts",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

### Seed Data

**prisma/seed.ts:**

```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Seed type pockets
  const typePockets = [
    {
      name: 'Emergency Fund',
      description: 'Savings for emergency situations',
      icon: 'heroicons:shield-check',
      color: 'blue',
    },
    {
      name: 'Wedding',
      description: 'Savings for wedding expenses',
      icon: 'heroicons:heart',
      color: 'pink',
    },
    {
      name: 'Investment',
      description: 'General investment savings',
      icon: 'heroicons:chart-bar',
      color: 'gold',
    },
    {
      name: 'Education',
      description: 'Savings for education expenses',
      icon: 'heroicons:academic-cap',
      color: 'green',
    },
    {
      name: 'Retirement',
      description: 'Savings for retirement',
      icon: 'heroicons:home',
      color: 'purple',
    },
  ];

  for (const typePocket of typePockets) {
    await prisma.typePocket.upsert({
      where: { name: typePocket.name },
      update: {},
      create: typePocket,
    });
  }

  console.log('✅ Seed data created successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

---

**End of Implementation Guide**
