# Storyly Backend API

Node.js/TypeScript backend for the Storyly platform.

## Features

- RESTful API for story management
- JWT authentication
- Media upload handling
- Analytics event tracking
- API key management for SDK
- PostgreSQL database with Prisma ORM
- Rate limiting
- CORS support

## Tech Stack

- **Runtime**: Node.js 18+
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT

## Prerequisites

- Node.js 18+
- PostgreSQL 14+
- npm or yarn

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Update the following variables:
- `DATABASE_URL`: Your PostgreSQL connection string
- `JWT_SECRET`: Random secret key for JWT
- `PORT`: API port (default: 3000)

### 3. Database Setup

```bash
# Generate Prisma Client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# (Optional) Open Prisma Studio to view data
npm run prisma:studio
```

### 4. Start Development Server

```bash
npm run dev
```

The API will be available at `http://localhost:3000`

## API Endpoints

### Public SDK Endpoints

```
GET  /api/v1/sdk/stories              - Get published stories
GET  /api/v1/sdk/collections          - Get story collections
POST /api/v1/sdk/analytics            - Track analytics event
POST /api/v1/sdk/analytics/batch      - Batch track events
```

**Headers**: `X-API-Key: your-api-key`

### Dashboard Endpoints (Protected)

```
Auth:
POST /api/v1/auth/login               - User login
POST /api/v1/auth/register            - User registration
GET  /api/v1/auth/me                  - Get current user

Stories:
GET    /api/v1/stories                - List stories
POST   /api/v1/stories                - Create story
GET    /api/v1/stories/:id            - Get story
PUT    /api/v1/stories/:id            - Update story
DELETE /api/v1/stories/:id            - Delete story
POST   /api/v1/stories/:id/publish    - Publish story

Media:
POST   /api/v1/media/upload           - Upload media
GET    /api/v1/media                  - List media
GET    /api/v1/media/:id              - Get media
DELETE /api/v1/media/:id              - Delete media

Collections:
GET    /api/v1/collections            - List collections
POST   /api/v1/collections            - Create collection
PUT    /api/v1/collections/:id        - Update collection
DELETE /api/v1/collections/:id        - Delete collection

Analytics:
GET    /api/v1/analytics/stories/:id  - Story analytics
GET    /api/v1/analytics/overview     - Platform overview

API Keys:
GET    /api/v1/api-keys               - List API keys
POST   /api/v1/api-keys               - Create API key
DELETE /api/v1/api-keys/:id           - Delete API key
```

## Database Schema

See `prisma/schema.prisma` for the complete database schema.

Key tables:
- `users` - Dashboard users
- `stories` - Story content
- `story_items` - Individual story slides
- `media` - Uploaded media files
- `collections` - Story groupings
- `analytics_events` - User interaction tracking
- `api_keys` - SDK authentication

## Development

```bash
# Run in development mode with auto-reload
npm run dev

# Build for production
npm run build

# Run production build
npm start

# Generate Prisma client after schema changes
npm run prisma:generate

# Create and run migrations
npm run prisma:migrate
```

## Project Structure

```
backend/
├── prisma/
│   └── schema.prisma        # Database schema
├── src/
│   ├── controllers/         # Request handlers
│   ├── middleware/          # Express middleware
│   ├── routes/              # API route definitions
│   ├── services/            # Business logic
│   ├── types/               # TypeScript types
│   └── index.ts             # Entry point
├── uploads/                 # Uploaded media files
└── package.json
```

## License

Proprietary
