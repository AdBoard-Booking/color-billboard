# Holi OOH Interactive Platform

A production-ready platform for real-time digital billboard interactions during Holi.

## Tech Stack
- **Frontend/Backend**: Next.js (App Router) + Socket.IO
- **Real-time**: Custom HTTP Server with Websockets
- **Database**: PostgreSQL (Prisma ORM)
- **Cache**: Redis (Rate limiting)
- **Styling**: Tailwind CSS + Framer Motion

## Project Structure
- `src/app/api/interaction`: Backend logic for processing "throws"
- `src/app/throw/[id]`: Mobile web experience (QR destination)
- `src/app/billboard/[id]`: Billboard display application
- `src/app/admin`: Admin dashboard for brands & publishers
- `server.ts`: Custom Next.js server with Socket.IO integration

## Getting Started

### 1. Prerequisites
- Node.js 20+
- PostgreSQL
- Redis

### 2. Installation
```bash
npm install
```

### 3. Setup Environment
Create a `.env` file (see `.env.example` or use the provided one) and configure:
- `DATABASE_URL`
- `REDIS_URL`

### 4. Database Setup & Seeding
```bash
# Generate Prisma Client
npx prisma generate

# Create tables (ensure DB is running)
npx prisma db push

# Seed data for demo
npm run seed
```

### 5. Running the Application
```bash
# Start the custom server (handles Next.js + Socket.IO)
npm run dev
```

## Demo Access
- **Mobile Throw**: `http://localhost:3000/throw/screen_1`
- **Billboard**: `http://localhost:3000/billboard/screen_1`
- **Admin**: `http://localhost:3000/admin` (admin@holi-ooh.com / admin123)

## Non-Functional Features
- **Rate Limiting**: 1 interaction per 10 mins per device (using Redis)
- **Real-time**: Sub-100ms latency for color splash broadcasting
- **Persistence**: All interactions logged for brand attribution reports
