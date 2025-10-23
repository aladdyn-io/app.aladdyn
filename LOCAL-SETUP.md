# Local Development Setup Guide

This guide helps you set up local fetching between the web-app-v2 frontend and web-server backend.

## Prerequisites

1. **Web Server Running**: Make sure your web-server is running on `localhost:3001`
2. **Environment Variables**: Set up the correct API URLs

## Environment Setup

### Option 1: Create .env.local file

Create a `.env.local` file in the web-app-v2 root directory:

```bash
# Local Development Environment Variables
VITE_API_URL=http://localhost:3001/api
VITE_API_BASE_URL=http://localhost:3001/api
```

### Option 2: Set environment variables directly

You can also set these as system environment variables or pass them when starting the dev server:

```bash
VITE_API_URL=http://localhost:3001/api VITE_API_BASE_URL=http://localhost:3001/api npm run dev
```

## Testing Local Fetching

### 1. Start the Web Server

```bash
cd /Users/nishaanth/Documents/study/web-server
npm run dev
```

The server should start on `http://localhost:3001`

### 2. Start the Web App

```bash
cd /Users/nishaanth/Documents/study/web-app-v2
npm run dev
```

The app should start on `http://localhost:5173` (or another port)

### 3. Test API Connection

Run the test script to verify the connection:

```bash
cd /Users/nishaanth/Documents/study/web-app-v2
node test-local-fetch.js
```

## How Local Fetching Works

### User Data Flow

1. **Initial Load**: The `nav-user` component loads user data from localStorage
2. **Token Verification**: If a valid token exists, it verifies with the backend
3. **Fallback**: If no token or network error, it uses cached data or defaults

### API Endpoints Used

- `POST /api/auth/verify-token` - Verify user token and get fresh user data
- `GET /api/auth/me` - Get current user information
- `POST /api/auth/login` - User login
- `GET /api/genies/projects` - Get user's projects and genies

### Key Features

- **Offline Support**: Works with cached data when backend is unavailable
- **Token Refresh**: Automatically verifies tokens with the backend
- **Error Handling**: Graceful fallback to cached data on network errors
- **Local Development**: Defaults to localhost:3001 for development

## Troubleshooting

### Common Issues

1. **CORS Errors**: Make sure the web-server allows requests from localhost:5173
2. **Connection Refused**: Ensure web-server is running on localhost:3001
3. **Invalid Token**: Check if JWT_SECRET is consistent between frontend and backend

### Debug Steps

1. Check browser console for API errors
2. Verify API endpoints are accessible: `curl http://localhost:3001/api/health`
3. Check network tab in browser dev tools
4. Run the test script to verify connectivity

## Production Deployment

For production, update the environment variables:

```bash
VITE_API_URL=https://your-production-api.com/api
VITE_API_BASE_URL=https://your-production-api.com/api
```
