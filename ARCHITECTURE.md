# Storyly Platform Architecture

## Overview
A comprehensive content experience platform for delivering Instagram/TikTok-style stories to mobile applications, with full management and analytics capabilities.

## System Components

### 1. Android SDK (Story Viewer)
**Purpose**: Library that apps integrate to display stories

**Key Features**:
- Full-screen, swipeable story viewer
- Support for images, videos, and interactive content
- Progress indicators and automatic progression
- Gesture controls (tap to skip, swipe to navigate)
- Customizable UI themes
- Offline caching
- Analytics event tracking
- Deep linking support

**Tech Stack**:
- Kotlin
- Jetpack Compose for modern UI
- Retrofit for API communication
- Coil for image loading
- ExoPlayer for video playback
- Room for local caching

**Architecture Pattern**: MVVM (Model-View-ViewModel)

### 2. Backend API
**Purpose**: Core service managing stories, users, and analytics

**Key Endpoints**:
```
Story Management:
- POST   /api/v1/stories              - Create story
- GET    /api/v1/stories              - List stories
- GET    /api/v1/stories/{id}         - Get story details
- PUT    /api/v1/stories/{id}         - Update story
- DELETE /api/v1/stories/{id}         - Delete story
- POST   /api/v1/stories/{id}/publish - Publish story

Media Management:
- POST   /api/v1/media/upload         - Upload media file
- GET    /api/v1/media/{id}           - Get media details
- DELETE /api/v1/media/{id}           - Delete media

Story Collections:
- POST   /api/v1/collections          - Create collection
- GET    /api/v1/collections          - List collections
- PUT    /api/v1/collections/{id}     - Update collection

SDK Endpoints (Public):
- GET    /api/v1/sdk/stories          - Fetch stories for app
- POST   /api/v1/sdk/analytics        - Track events

Analytics:
- GET    /api/v1/analytics/stories/{id} - Story performance
- GET    /api/v1/analytics/overview     - Platform overview
- POST   /api/v1/analytics/events       - Batch event ingestion
```

**Tech Stack Options**:

**Option A - Node.js/TypeScript**:
- Express.js or Fastify for API
- Prisma ORM for database
- Bull for job queues
- Redis for caching
- JWT for authentication

**Option B - Java/Spring Boot**:
- Spring Boot for API
- Spring Data JPA
- Spring Security
- Redis integration

**Recommended**: Node.js/TypeScript for rapid development and JavaScript ecosystem compatibility with the dashboard.

### 3. Web Dashboard
**Purpose**: Management interface for uploading and organizing stories

**Key Features**:
- User authentication and authorization
- Media upload (drag & drop, bulk upload)
- Story creation and organization
- Story collections management
- Real-time preview
- Analytics dashboard with charts
- A/B testing configuration
- User segmentation
- Campaign scheduling

**Tech Stack**:
- React 18 with TypeScript
- Vite for build tooling
- TailwindCSS for styling
- React Query for data fetching
- Zustand for state management
- Chart.js/Recharts for analytics visualization
- React Dropzone for file uploads

### 4. Database
**Schema Design**:

```sql
-- Users table
users:
  - id (UUID, primary key)
  - email (string, unique)
  - password_hash (string)
  - name (string)
  - role (enum: admin, editor, viewer)
  - created_at (timestamp)
  - updated_at (timestamp)

-- Stories table
stories:
  - id (UUID, primary key)
  - title (string)
  - description (text)
  - status (enum: draft, published, archived)
  - order (integer)
  - collection_id (UUID, foreign key)
  - created_by (UUID, foreign key to users)
  - published_at (timestamp, nullable)
  - created_at (timestamp)
  - updated_at (timestamp)

-- Story items table (individual slides)
story_items:
  - id (UUID, primary key)
  - story_id (UUID, foreign key)
  - media_id (UUID, foreign key)
  - type (enum: image, video)
  - duration (integer, seconds)
  - order (integer)
  - action_url (string, nullable)
  - action_text (string, nullable)
  - created_at (timestamp)

-- Media table
media:
  - id (UUID, primary key)
  - filename (string)
  - original_filename (string)
  - mime_type (string)
  - size (bigint, bytes)
  - width (integer, nullable)
  - height (integer, nullable)
  - storage_path (string)
  - cdn_url (string)
  - thumbnail_url (string, nullable)
  - uploaded_by (UUID, foreign key to users)
  - created_at (timestamp)

-- Collections table
collections:
  - id (UUID, primary key)
  - name (string)
  - description (text)
  - icon_url (string, nullable)
  - order (integer)
  - created_by (UUID, foreign key)
  - created_at (timestamp)
  - updated_at (timestamp)

-- Analytics events table
analytics_events:
  - id (UUID, primary key)
  - event_type (enum: impression, view, click, complete, dismiss)
  - story_id (UUID, foreign key)
  - story_item_id (UUID, foreign key, nullable)
  - user_id (string, app user identifier)
  - device_id (string)
  - app_id (string)
  - session_id (string)
  - timestamp (timestamp)
  - metadata (jsonb)

-- API keys table (for SDK authentication)
api_keys:
  - id (UUID, primary key)
  - key (string, unique, indexed)
  - app_name (string)
  - app_id (string)
  - platform (enum: android, ios, web)
  - is_active (boolean)
  - created_by (UUID, foreign key)
  - created_at (timestamp)
  - last_used_at (timestamp, nullable)
```

**Database**: PostgreSQL (recommended for JSONB support and scalability)

### 5. Media Storage
**Options**:
- AWS S3 (recommended for production)
- Google Cloud Storage
- Local filesystem (development only)

**Media Processing Pipeline**:
1. Upload to temporary storage
2. Validate file type and size
3. Generate thumbnails for images
4. Transcode videos to optimized formats (H.264, different resolutions)
5. Upload to CDN/cloud storage
6. Store metadata in database
7. Delete temporary files

**CDN**: CloudFront (AWS) or Cloud CDN (Google) for fast delivery

### 6. Analytics System
**Real-time Processing**:
- Events batched from SDK
- Ingested via API endpoint
- Stored in analytics_events table
- Aggregated periodically into summary tables

**Metrics Tracked**:
- Story impressions (shown in feed)
- Story views (opened)
- Story completion rate
- Click-through rate
- Average view time
- Engagement by time of day
- Device/platform breakdown

**Aggregation Tables** (for performance):
```sql
story_analytics_daily:
  - story_id (UUID)
  - date (date)
  - impressions (integer)
  - views (integer)
  - completions (integer)
  - clicks (integer)
  - avg_view_time (decimal)
```

## System Architecture Diagram

```
┌─────────────────┐
│  Mobile App     │
│  (Client)       │
└────────┬────────┘
         │
         │ Android SDK Integration
         │
         ▼
┌─────────────────┐
│  Android SDK    │◄──────────────┐
│  (Storyly)      │               │
└────────┬────────┘               │
         │                        │
         │ REST API               │
         │                        │
         ▼                        │
┌─────────────────┐               │
│                 │               │
│  Load Balancer  │               │
│                 │               │
└────────┬────────┘               │
         │                        │
         ▼                        │
┌─────────────────┐               │
│  Backend API    │               │
│  (Node.js/      │               │
│   Express)      │               │
└─┬───────┬───────┘               │
  │       │                       │
  │       │                       │
  │       └──────────┐            │
  │                  │            │
  ▼                  ▼            │
┌──────────┐   ┌──────────┐      │
│PostgreSQL│   │  Redis   │      │
│          │   │  Cache   │      │
└──────────┘   └──────────┘      │
                                 │
┌──────────────────┐             │
│  Media Storage   │             │
│  (S3 / CDN)      │◄────────────┤
└──────────────────┘             │
                                 │
┌──────────────────┐             │
│  Web Dashboard   │             │
│  (React)         │─────────────┘
└──────────────────┘
```

## Security Considerations

### SDK Authentication
- API keys for each app/platform
- Rate limiting per API key
- Request signing for sensitive operations

### Dashboard Authentication
- JWT-based authentication
- Role-based access control (RBAC)
- Session management
- Password requirements and hashing (bcrypt)

### Media Upload
- File type validation
- File size limits
- Virus scanning (ClamAV integration)
- Signed upload URLs (presigned S3 URLs)

### API Security
- HTTPS only
- CORS configuration
- Input validation and sanitization
- SQL injection prevention (parameterized queries)
- Rate limiting (per IP, per API key)

## Deployment Architecture

### Development
```
- Local PostgreSQL
- Local Redis
- Local media storage
- Backend on localhost:3000
- Dashboard on localhost:5173
```

### Production
```
- AWS/GCP infrastructure
- PostgreSQL RDS or Cloud SQL
- Redis ElastiCache or MemoryStore
- S3/GCS + CloudFront/Cloud CDN
- Backend on containerized infrastructure (Docker + ECS/GKE)
- Dashboard on static hosting (S3 + CloudFront / Netlify / Vercel)
```

## Development Phases

### Phase 1: Foundation (Weeks 1-2)
- Set up project structure for all components
- Database schema implementation
- Basic backend API setup
- Simple dashboard authentication

### Phase 2: Core Features (Weeks 3-4)
- Media upload and storage
- Story CRUD operations
- Basic Android SDK with story viewer
- Dashboard story management UI

### Phase 3: Viewer Polish (Weeks 5-6)
- Enhanced story viewer UI
- Gesture controls
- Video playback
- Offline caching
- Interactive elements

### Phase 4: Analytics (Weeks 7-8)
- Analytics event tracking in SDK
- Event ingestion API
- Analytics dashboard
- Real-time metrics

### Phase 5: Advanced Features (Weeks 9-10)
- Story collections
- A/B testing
- User segmentation
- Campaign scheduling
- Performance optimization

### Phase 6: Testing & Polish (Weeks 11-12)
- End-to-end testing
- Performance optimization
- Security audit
- Documentation
- Demo app

## Technology Summary

| Component | Technology |
|-----------|-----------|
| Android SDK | Kotlin, Jetpack Compose, Retrofit, ExoPlayer |
| Backend API | Node.js, Express, TypeScript, Prisma |
| Database | PostgreSQL |
| Cache | Redis |
| Dashboard | React, TypeScript, TailwindCSS, Vite |
| Media Storage | AWS S3 + CloudFront |
| Authentication | JWT |
| Real-time | WebSockets (Socket.io) for live updates |

## Next Steps

1. Confirm technology choices
2. Set up development environment
3. Initialize all project repositories
4. Begin Phase 1 implementation
