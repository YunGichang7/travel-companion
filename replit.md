# TripPick - Korean Travel Destination Discovery App

## Overview

TripPick is a travel destination discovery application focused on Korean tourism. The app provides two main ways to discover destinations: random dart-throwing on a map and Tinder-style swipe interactions. Built as a modern full-stack web application with a React frontend and Express backend, it features a Korean-language interface with bilingual destination information.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **Styling**: Tailwind CSS with custom Korean typography
- **UI Components**: Radix UI components with shadcn/ui design system
- **State Management**: TanStack Query for server state management
- **Build Tool**: Vite for development and bundling

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ESM modules
- **Database**: PostgreSQL with Drizzle ORM
- **Session Management**: In-memory storage with session-based swipe tracking
- **API**: RESTful endpoints for destinations and user interactions

### Data Storage
- **Primary Database**: PostgreSQL (configured for Neon serverless)
- **ORM**: Drizzle ORM with schema-first approach
- **Schema**: Two main tables - destinations and swipe_actions
- **Development Storage**: In-memory fallback implementation

## Key Components

### Database Schema
```typescript
// Destinations table
- id (serial primary key)
- name (English name)
- nameKorean (Korean name)
- description (Korean description)
- region, category, rating
- imageUrl, tags array
- latitude, longitude coordinates

// Swipe Actions table
- id (serial primary key)
- destinationId (foreign key)
- action ('like' or 'pass')
- sessionId (user session tracking)
```

### Core Features
1. **Random Destination Discovery**: Dart-throwing interface with region filtering
2. **Swipe Interface**: Tinder-style card interface for preference-based discovery
3. **Interactive Map**: Visual region selection for targeted recommendations
4. **Popular Destinations**: Categorized browsing with filtering
5. **Responsive Design**: Mobile-first approach with Korean typography support

### API Endpoints
- `GET /api/destinations` - All destinations
- `GET /api/destinations/region/:region` - Region-filtered destinations
- `GET /api/destinations/category/:category` - Category-filtered destinations
- `GET /api/destinations/random` - Random destination with optional region filter
- `POST /api/swipe` - Record user swipe actions
- `GET /api/liked/:sessionId` - User's liked destinations

## Data Flow

1. **User Interaction**: User selects region or category preferences
2. **API Request**: Frontend queries appropriate endpoint via TanStack Query
3. **Database Query**: Express routes use Drizzle ORM to query PostgreSQL
4. **Response Handling**: Cached responses with optimistic updates
5. **UI Updates**: React components re-render with new data
6. **Swipe Tracking**: User preferences stored by session for personalization

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL connection for Neon database
- **drizzle-orm**: Type-safe database ORM
- **@tanstack/react-query**: Server state management
- **@radix-ui/***: Accessible UI component primitives
- **tailwindcss**: Utility-first CSS framework
- **wouter**: Lightweight React router

### Development Tools
- **vite**: Build tool and development server
- **tsx**: TypeScript execution for Node.js
- **esbuild**: JavaScript bundler for production

### UI Enhancement
- **lucide-react**: Icon library
- **class-variance-authority**: Component variant management
- **embla-carousel-react**: Touch-friendly carousel component

## Deployment Strategy

### Development Environment
- **Runtime**: Node.js 20 on Replit
- **Database**: PostgreSQL 16 module
- **Port Configuration**: Internal port 5000, external port 80
- **Hot Reload**: Vite development server with HMR

### Production Build
```bash
npm run build  # Vite build + esbuild server bundling
npm run start  # Production server from dist/
```

### Environment Setup
- **DATABASE_URL**: PostgreSQL connection string (required)
- **NODE_ENV**: development/production environment flag
- **Build Output**: Client assets to dist/public, server to dist/index.js

### Replit Configuration
- **Modules**: nodejs-20, web, postgresql-16
- **Deployment**: Autoscale with optimized build process
- **Development**: Parallel workflow with port forwarding

## Changelog

Changelog:
- June 24, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.