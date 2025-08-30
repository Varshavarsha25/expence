# Expense Management Backend

A robust backend API for the Expense Management application built with Express.js, TypeScript, Prisma, and Neon PostgreSQL.

## 🚀 Features

- **RESTful API** for expense and project management
- **TypeScript** for type safety
- **Prisma ORM** for database operations
- **Neon PostgreSQL** as the database
- **CORS** enabled for frontend integration
- **Input validation** and error handling
- **Health check** endpoint

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- A Neon PostgreSQL database

## 🛠️ Setup Instructions

### 1. Neon Database Setup

1. Go to [Neon Console](https://console.neon.tech/)
2. Create a new project or use an existing one
3. Create a new database
4. Copy the connection string from the dashboard

### 2. Environment Configuration

1. Copy the environment template:
   ```bash
   cp .env.example .env
   ```

2. Update the `.env` file with your Neon database URL:
   ```env
   DATABASE_URL="postgresql://username:password@hostname:port/database?sslmode=require"
   PORT=3001
   NODE_ENV=development
   FRONTEND_URL=http://localhost:3000
   ```

### 3. Database Setup

1. Generate Prisma client:
   ```bash
   npm run db:generate
   ```

2. Push the schema to your database:
   ```bash
   npm run db:push
   ```

   Or if you prefer migrations:
   ```bash
   npm run db:migrate
   ```

### 4. Running the Server

**Development mode:**
```bash
npm run dev
```

**Production mode:**
```bash
npm run build
npm start
```

The server will start on `http://localhost:3001`

## 📚 API Endpoints

### Health Check
- `GET /health` - Check if the API is running

### Expenses
- `GET /api/expenses` - Get all expenses
- `GET /api/expenses/:id` - Get expense by ID
- `POST /api/expenses` - Create new expense
- `PUT /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense
- `GET /api/expenses/stats/summary` - Get expense statistics

### Projects
- `GET /api/projects` - Get all projects
- `GET /api/projects/:id` - Get project by ID
- `POST /api/projects` - Create new project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Feature Flags
- `GET /api/feature-flags` - List all feature flags
- `GET /api/feature-flags/:key` - Get a specific feature flag by key

Current flags:
- `gpt5_preview`: Enable GPT-5 (Preview) for all clients (always `enabled: true` in this static config).

## 📊 Database Schema

### Expense
- `id` (String, Primary Key)
- `date` (DateTime)
- `project` (String)
- `payee` (String)
- `referenceNo` (String, Optional)
- `subtotal` (Float)
- `totalDiscount` (Float)
- `totalTax` (Float)
- `grandTotal` (Float)
- `projectId` (String, Optional Foreign Key)
- `lineItems` (Relation to LineItem[])

### LineItem
- `id` (String, Primary Key)
- `description` (String)
- `quantity` (Float)
- `rate` (Float)
- `discount` (Float)
- `tax` (Float)
- `amount` (Float)
- `expenseId` (String, Foreign Key)

### Project
- `id` (String, Primary Key)
- `name` (String)
- `description` (String, Optional)
- `expenses` (Relation to Expense[])

## 🧪 Testing the API

You can test the API using tools like:
- **Postman**
- **Thunder Client** (VS Code extension)
- **curl** commands

Example request to create an expense:
```bash
curl -X POST http://localhost:3001/api/expenses \
  -H "Content-Type: application/json" \
  -d '{
    "date": "2024-01-15",
    "project": "Website Development",
    "payee": "Office Supplies Inc",
    "referenceNo": "REF-001",
    "lineItems": [
      {
        "description": "Office Chair",
        "quantity": 1,
        "rate": 250.00,
        "amount": 250.00
      }
    ],
    "subtotal": 250.00,
    "grandTotal": 250.00
  }'
```

## 🔧 Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema changes to database
- `npm run db:migrate` - Run database migrations
- `npm run db:studio` - Open Prisma Studio

## 🌐 CORS Configuration

The API is configured to accept requests from `http://localhost:3000` by default. Update the `FRONTEND_URL` environment variable to match your frontend URL.

## 📝 Next Steps

1. Set up your Neon database and update the `.env` file
2. Run the database setup commands
3. Start the development server
4. Test the API endpoints
5. Integrate with your React frontend
6. Query feature flags at `/api/feature-flags` to drive conditional UI (e.g., GPT-5 preview capabilities)
