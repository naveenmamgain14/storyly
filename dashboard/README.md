# Storyly Dashboard

Web dashboard for managing Storyly content, analytics, and settings.

## Features

- Story creation and management
- Media library with upload
- Analytics and insights
- API key management
- User authentication
- Responsive design

## Tech Stack

- **Framework**: React 18
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS
- **State Management**: Zustand
- **Data Fetching**: TanStack Query (React Query)
- **Routing**: React Router v6
- **Charts**: Recharts

## Prerequisites

- Node.js 18+
- npm or yarn

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

Create a `.env` file (optional):

```bash
VITE_API_URL=http://localhost:3000/api/v1
```

### 3. Start Development Server

```bash
npm run dev
```

The dashboard will be available at `http://localhost:5173`

## Build for Production

```bash
npm run build
```

Output will be in the `dist/` directory.

## Project Structure

```
dashboard/
├── src/
│   ├── components/      # Reusable UI components
│   ├── pages/           # Page components
│   ├── hooks/           # Custom React hooks
│   ├── services/        # API service functions
│   ├── store/           # Zustand state stores
│   ├── types/           # TypeScript types
│   ├── styles/          # Global styles
│   ├── App.tsx          # Main app component
│   └── main.tsx         # Entry point
├── public/              # Static assets
├── index.html           # HTML template
└── package.json
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Features by Page

### Dashboard
- Overview statistics
- Recent stories
- Analytics summary

### Stories
- List all stories
- Create new story
- Edit/delete stories
- Publish/unpublish

### Media
- Upload images and videos
- Media library grid view
- Delete media files
- View media details

### Analytics
- Story performance metrics
- Engagement charts
- User insights

### Settings
- API key management
- User profile
- Account settings

## License

Proprietary
