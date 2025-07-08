# Sessions Integration

This document describes the integration with the backend API for fetching and managing user conversation sessions.

## Overview

The app now fetches recent conversation sessions from your backend API running on `localhost:8080`. This allows users to see their conversation history and continue previous chats.

## Backend API Requirements

Your backend should implement the following endpoints:

### Get User Sessions

```
GET /sessions/user/{user_id}
```

**Response Format:**

```json
[
  {
    "id": "session-123",
    "title": "How to improve my productivity?",
    "created_at": "2024-01-15T14:30:00Z",
    "updated_at": "2024-01-15T14:45:00Z",
    "message_count": 12,
    "duration_minutes": 15,
    "last_message": "Thanks for the productivity tips!"
  }
]
```

### Delete Session (Optional)

```
DELETE /sessions/{session_id}
```

**Response:** HTTP 200 for success, HTTP 4xx/5xx for errors

## Configuration

### Environment Variables

Add to your `.env` file:

```env
# Optional: Override the default API base URL
EXPO_PUBLIC_API_BASE_URL=http://localhost:8080
```

If not provided, defaults to `http://localhost:8080`.

### API Configuration

The API configuration is centralized in `constants/api.ts`:

```typescript
export const API_CONFIG = {
  BASE_URL: process.env.EXPO_PUBLIC_API_BASE_URL || "http://localhost:8080",
  TIMEOUT: 10000,
  DEFAULT_HEADERS: {
    "Content-Type": "application/json",
  },
};
```

## How It Works

### 1. Session Service (`services/sessionService.ts`)

- Fetches sessions from the backend API
- Provides fallback mock data if API is unavailable
- Enhances sessions with UI properties (icons, colors)
- Handles session deletion

### 2. Custom Hook (`hooks/useSessions.ts`)

- Manages session state and loading
- Automatically fetches sessions when user ID changes
- Provides methods for deleting and refreshing sessions
- Handles errors gracefully

### 3. RecentSessions Component (`components/RecentSessions.tsx`)

- Displays up to 3 recent sessions
- Shows loading states and empty states
- Supports swipe-to-delete functionality
- Automatically refreshes when sessions change

## Features

### ✅ Implemented

- Fetch recent sessions from backend API
- Display sessions with dynamic icons and colors
- Loading states and error handling
- Swipe-to-delete functionality
- Automatic session refresh
- Fallback to mock data for development
- User authentication integration with Clerk

### 🔄 Session Data Flow

1. User logs in via Clerk authentication
2. `useSessions` hook detects user ID and fetches sessions
3. `SessionService` calls backend API with user ID
4. Sessions are enhanced with UI properties (icons, colors)
5. `RecentSessions` component displays the sessions
6. User can interact with sessions (tap to open, swipe to delete)

### 🎨 UI Enhancements

Sessions are automatically enhanced with:

- Dynamic icons: 💬, 🤖, 📅, 💡, 🎯, 📱, 🔍, ⚡
- Color themes: Multiple color schemes for visual variety
- Proper title truncation with ellipsis
- Responsive animations and gestures

## Error Handling

The integration includes robust error handling:

- **Network errors**: Falls back to mock data
- **404 responses**: Returns empty array (no sessions)
- **Authentication errors**: Handled by Clerk integration
- **API timeouts**: Configurable timeout (10 seconds default)
- **Invalid responses**: Graceful fallback with error messages

## Testing

### Backend Connection Test

You can test the backend connection by:

1. Ensure your backend is running on `localhost:8080`
2. Check the console logs for session fetch attempts
3. The app will show mock data if the backend is unavailable

### curl Test

```bash
# Test the endpoint directly
curl 'http://localhost:8080/sessions/user/{user_id}'
```

### Mock Data Fallback

If the backend API is unavailable, the app will display mock sessions:

- "How to improve my productivity?"
- "What are the latest AI trends?"
- "Help me plan my weekly schedule"

## Troubleshooting

### Common Issues

1. **Sessions not loading**

   - Check that backend is running on port 8080
   - Verify user is authenticated via Clerk
   - Check console logs for error messages

2. **Empty sessions list**

   - Backend returned 404 (no sessions for user)
   - User may not have any conversation history yet

3. **API connection errors**
   - Verify backend is accessible at configured URL
   - Check firewall and network settings
   - Ensure backend accepts CORS requests

### Debug Mode

To debug session loading:

1. Open React Developer Tools
2. Check console for session fetch logs
3. Monitor network requests in developer tools
4. Verify Clerk user ID is being passed correctly

## Future Enhancements

Potential improvements:

- Session search and filtering
- Pagination for large session lists
- Session categorization and tagging
- Session sharing and export
- Offline session caching
- Real-time session updates

## Backend Integration Notes

For backend developers:

1. **User ID Format**: Clerk provides user IDs in format `user_XXXXXXXXXX`
2. **Authentication**: Consider implementing JWT token validation
3. **Rate Limiting**: Implement rate limiting for session endpoints
4. **Pagination**: For users with many sessions, implement pagination
5. **CORS**: Ensure CORS is configured for mobile app requests

## Security Considerations

- User sessions are fetched only for authenticated users
- User ID is validated through Clerk authentication
- No sensitive data is cached locally
- All API requests use HTTPS in production
- Session deletion requires user confirmation
