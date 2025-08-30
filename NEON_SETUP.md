# Neon Database Setup Guide

## Step 1: Create Neon Account and Database

1. Go to [Neon Console](https://console.neon.tech/)
2. Sign up or log in
3. Click "Create a project"
4. Choose your settings:
   - Project name: `expense-management`
   - Database name: `expense_db`
   - Region: Choose closest to your location
5. Click "Create project"

## Step 2: Get Connection String

After creating the project:

1. In your Neon dashboard, click on your project
2. Go to the "Dashboard" tab
3. Find the "Connection string" section
4. Copy the connection string (it looks like):
   ```
   postgresql://username:password@hostname:port/database?sslmode=require
   ```

## Step 3: Configure Backend Environment

1. Navigate to the backend folder:
   ```bash
   cd backend
   ```

2. Copy the environment template:
   ```bash
   cp .env.example .env
   ```

3. Edit the `.env` file and replace the DATABASE_URL with your Neon connection string:
   ```env
   DATABASE_URL="your_neon_connection_string_here"
   PORT=3001
   NODE_ENV=development
   FRONTEND_URL=http://localhost:3000
   ```

## Step 4: Setup Database Schema

1. Install dependencies (if not already done):
   ```bash
   npm install
   ```

2. Generate Prisma client:
   ```bash
   npm run db:generate
   ```

3. Push the schema to your Neon database:
   ```bash
   npm run db:push
   ```

   This will create the following tables:
   - `expenses` - Main expense records
   - `line_items` - Individual line items for each expense
   - `projects` - Optional project management

## Step 5: Start the Backend Server

```bash
npm run dev
```

The server will start on http://localhost:3001

## Step 6: Test the Connection

You can test if everything is working by:

1. Opening http://localhost:3001/health in your browser
2. You should see a JSON response indicating the API is running

## Step 7: Start Frontend with Backend Integration

1. Go back to the main project folder:
   ```bash
   cd ..
   ```

2. Start the frontend (if not already running):
   ```bash
   npm run dev
   ```

3. Open http://localhost:3000
4. You should see a green "Connected" status in the header

## Troubleshooting

### Connection Issues
- Make sure your Neon database is active (not in sleep mode)
- Verify the connection string is correct
- Check that your IP is allowed (Neon allows all IPs by default)

### CORS Issues
- Ensure FRONTEND_URL in backend .env matches your frontend URL
- Default is http://localhost:3000

### Database Schema Issues
- Run `npm run db:push` to sync schema changes
- Use `npm run db:studio` to view your database in Prisma Studio

## Database Schema Overview

### Expenses Table
- Stores main expense information
- Links to line items and optionally to projects
- Includes totals and calculations

### Line Items Table
- Individual items within an expense
- Includes quantity, rate, discounts, tax
- Automatically deleted when parent expense is deleted

### Projects Table
- Optional project management
- Can group multiple expenses
- Includes expense count

## Example Data Flow

1. User fills expense form in frontend
2. Data is sent to backend API at `/api/expenses`
3. Prisma validates and saves to Neon PostgreSQL
4. Success response sent back to frontend
5. Frontend updates the expense list automatically

Your expense management application is now fully integrated with a cloud database!
