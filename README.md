# Storyly Platform

A comprehensive content experience platform for delivering Instagram/TikTok-style stories to mobile applications.

## Overview

Storyly is a full-stack platform that enables you to create, manage, and deliver engaging story content to mobile apps. It consists of:

- **Android SDK**: Modern library for displaying stories in Android apps
- **Backend API**: Node.js/Express RESTful API for content management
- **Web Dashboard**: React-based admin panel for managing stories and analytics
- **Analytics System**: Track user engagement and story performance

## Tech Stack

| Component | Technology |
|-----------|-----------|
| Android SDK | Kotlin, Jetpack Compose, Retrofit, ExoPlayer |
| Backend API | Node.js, Express, TypeScript, Prisma |
| Database | PostgreSQL |
| Cache | Redis |
| Dashboard | React, TypeScript, TailwindCSS, Vite |
| Media Storage | Local filesystem (configurable for S3) |

## Quick Start

### Prerequisites

- **Node.js** 18+
- **PostgreSQL** 14+ (or use Docker Compose)
- **Android Studio** (for SDK development)
- **Docker** (optional, for easy database setup)

### 1. Clone and Setup

```bash
# Navigate to the storyly directory
cd /Users/E2289/Documents/claudecode/storyly

# Start PostgreSQL and Redis with Docker
docker-compose up -d
```

### 2. Setup Backend

```bash
cd backend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Generate Prisma Client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate

# Start development server
npm run dev
```

Backend will run on `http://localhost:3000`

### 3. Setup Dashboard

```bash
cd dashboard

# Install dependencies
npm install

# Start development server
npm run dev
```

Dashboard will run on `http://localhost:5173`

### 4. Setup Android SDK

Open the `android-sdk` folder in Android Studio.

## Project Structure

```
storyly/
├── android-sdk/          # Android SDK library
│   └── storyly/         # SDK module
├── backend/             # Node.js backend API
│   ├── prisma/         # Database schema
│   └── src/            # Source code
├── dashboard/           # React web dashboard
│   └── src/            # Source code
├── database/            # Database utilities
├── docker/              # Docker configurations
├── docs/                # Documentation
├── ARCHITECTURE.md      # Detailed architecture docs
├── docker-compose.yml   # Local development services
└── README.md            # This file
```

## Key Features

### Android SDK
- Full-screen story viewer with swipe gestures
- Image and video support
- Automatic progress indicators
- Offline caching
- Analytics tracking
- Customizable UI

### Backend API
- RESTful API design
- JWT authentication
- Media upload handling
- Analytics event tracking
- API key management for SDK
- Rate limiting and security

### Web Dashboard
- User authentication
- Story creation and management
- Media library with drag & drop upload
- Analytics visualization
- API key generation
- Responsive design

### Analytics
- Story impressions and views
- Completion rates
- Click-through tracking
- Device and platform breakdown
- Time-based insights

## Development Workflow

### Database Management

```bash
# Open Prisma Studio (visual database editor)
cd backend
npm run prisma:studio

# Create a new migration after schema changes
npm run prisma:migrate

# Reset database (WARNING: destroys all data)
npx prisma migrate reset
```

### Running All Services

```bash
# Terminal 1: Database services
docker-compose up

# Terminal 2: Backend
cd backend && npm run dev

# Terminal 3: Dashboard
cd dashboard && npm run dev
```

## API Documentation

### SDK Endpoints (Public)

```
GET  /api/v1/sdk/stories              - Fetch published stories
GET  /api/v1/sdk/collections          - Fetch story collections
POST /api/v1/sdk/analytics            - Track analytics event
POST /api/v1/sdk/analytics/batch      - Batch track events
```

**Headers Required**: `X-API-Key: your-api-key`

### Dashboard Endpoints (Protected)

See individual component READMEs for detailed API documentation:
- [Backend API Docs](./backend/README.md)
- [Android SDK Docs](./android-sdk/README.md)
- [Dashboard Docs](./dashboard/README.md)

## Environment Variables

### Backend (.env)
```
PORT=3000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/storyly
JWT_SECRET=your-secret-key
UPLOAD_DIR=./uploads
CORS_ORIGIN=http://localhost:5173
```

### Dashboard (.env)
```
VITE_API_URL=http://localhost:3000/api/v1
```

## First Steps After Setup

1. **Access Dashboard**: Go to `http://localhost:5173` and login with demo credentials

2. **Create API Key**: Navigate to Settings → API Keys and generate a new key for your Android app

3. **Upload Media**: Go to Media Library and upload some images/videos

4. **Create Story**: Create your first story using the uploaded media

5. **Publish Story**: Change story status to "Published"

6. **Test SDK**: Use the API key in your Android app to fetch and display stories

## Deployment

### Backend
```bash
cd backend
npm run build
npm start
```

### Dashboard
```bash
cd dashboard
npm run build
# Deploy the dist/ folder to your hosting service
```

## Testing the SDK

A demo Android app is planned for `demo-app/` directory to showcase SDK integration.

## Troubleshooting

### Database Connection Issues
- Ensure PostgreSQL is running: `docker-compose ps`
- Check `DATABASE_URL` in backend/.env
- Verify port 5432 is not in use by another process

### API Connection Issues
- Verify backend is running on port 3000
- Check CORS settings in backend/.env
- Ensure firewall allows connections

### Android SDK Issues
- Verify `baseUrl` in StorylyConfig points to correct backend
- For emulator, use `10.0.2.2` instead of `localhost`
- Check API key is valid and active

## Contributing

This is a proprietary project. For internal development guidelines, see CONTRIBUTING.md (to be created).

## License

Proprietary - All rights reserved

## Support

For issues and questions, contact the development team.

## Architecture

For detailed architecture documentation, see [ARCHITECTURE.md](./ARCHITECTURE.md)

## Next Steps

- [ ] Implement complete authentication system
- [ ] Add media processing (thumbnail generation, video transcoding)
- [ ] Implement full story viewer UI in Android SDK
- [ ] Add analytics dashboard with charts
- [ ] Implement A/B testing
- [ ] Add push notifications
- [ ] Deploy to production environment
