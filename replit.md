# AgriAI - Agricultural Management System for Kazakhstan

## Overview
AgriAI is a full-stack agricultural management application built with React, Express, TypeScript, and PostgreSQL. The application helps farmers, agronomists, veterinarians, and managers in Kazakhstan to manage fields, livestock, weather data, and receive AI-powered recommendations via an intelligent chat assistant.

## Project Structure
- **client/**: React frontend with Vite build system
  - **src/components/**: UI components including field cards, livestock cards, weather widgets, AI chat
  - **src/pages/**: Dashboard, Fields, Livestock, Weather, Recommendations, Simulation, About, Auth, AIChat
  - **src/contexts/**: Language, Theme, and Auth contexts
  - **src/lib/**: Utility libraries including coordinate conversion (DMS format support)
- **server/**: Express backend API
  - **index.ts**: Main server entry point with session management
  - **routes.ts**: API route definitions including AI chat endpoints
  - **auth.ts**: Passport.js authentication with bcrypt password hashing
  - **gemini.ts**: Google Gemini AI integration for agricultural consulting
  - **storage.ts**: Chat history storage and retrieval
  - **db.ts**: Database connection using Drizzle ORM
  - **vite.ts**: Vite development server setup
- **shared/**: Shared TypeScript schemas and types
  - **schema.ts**: Drizzle ORM database schemas (users, fields, livestock, chat_messages)

## Technology Stack
- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, Radix UI
- **Backend**: Express, TypeScript, Passport.js
- **Database**: Neon PostgreSQL with Drizzle ORM
- **AI**: Google Gemini API for agricultural consulting
- **Authentication**: Passport Local Strategy with bcrypt
- **Session Management**: express-session with PostgreSQL store
- **State Management**: TanStack Query
- **UI Components**: Radix UI primitives with custom styling
- **Deployment**: Single server serving both API and frontend on port 5000

## Database Schema
- **users**: User authentication (id, username, password, fullName, role)
  - Roles: farmer, agronomist, veterinarian, manager
- **fields**: Agricultural fields (id, userId, name, latitude, longitude, area, cropType)
  - Supports Google Maps DMS coordinate format: e.g., 54°52'59.2"N 69°14'13.8"E
- **livestock**: Livestock management (id, userId, type, count)
- **chat_messages**: AI chat history (id, userId, role, content, timestamp)

## Key Features
1. **Role-Based Authentication**: Secure login/registration with different user roles
2. **AI Agricultural Assistant**: Full-featured chat with Gemini AI for crop and livestock consulting
3. **Field Management**: Add/edit fields with Google Maps DMS coordinate format support
4. **Livestock Tracking**: Monitor and manage livestock inventory
5. **Weather Integration**: Real-time weather data for agricultural planning
6. **Recommendations**: AI-powered agricultural recommendations
7. **Simulation Tools**: Agricultural scenario modeling

## Coordinate Format
The application accepts coordinates in Google Maps DMS (Degrees, Minutes, Seconds) format:
- Example: 54°52'59.2"N 69°14'13.8"E
- Automatically converts to decimal format for database storage
- Supports both N/S and E/W hemisphere indicators

## Development
The application runs a single Express server that:
- Serves API routes at `/api/*`
- Handles authentication at `/api/auth/*`
- Provides AI chat at `/api/chat/*`
- Serves the React frontend via Vite in development mode
- Runs on port 5000 (0.0.0.0)
- Uses session-based authentication with secure cookies

## Environment Variables
- `DATABASE_URL`: PostgreSQL connection string (required)
- `GEMINI_API_KEY`: Google Gemini API key for AI chat (required)
- `NODE_ENV`: Set to 'development' or 'production'
- `PORT`: Server port (defaults to 5000)
- `SESSION_SECRET`: Secret for session encryption (auto-generated in dev)

## Security Features
- Password hashing with bcrypt (10 rounds)
- Session-based authentication with Passport.js
- Secure session storage in PostgreSQL
- Role-based access control
- CORS configuration for secure API access

## Recent Changes
- **2024-11-08**: Initial project import to Replit environment
- **2024-11-08**: Implemented role-based authentication system (farmer, agronomist, veterinarian, manager)
- **2024-11-08**: Integrated Google Gemini AI for agricultural chat assistant
- **2024-11-08**: Added chat history storage in PostgreSQL
- **2024-11-08**: Implemented Google Maps DMS coordinate format support
- **2024-11-08**: Fixed authentication flow with proper redirect handling
- **2024-11-08**: Created full-featured AI chat page with message history
