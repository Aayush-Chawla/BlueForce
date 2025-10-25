# Frontend-Backend Integration Guide

## 🎯 Overview

This document explains how the React frontend is integrated with the Spring Boot event-service backend. All event data is now stored in the MySQL database and managed through REST API calls.

## 🏗️ Architecture

```
Frontend (React) ←→ API Service ←→ Event Service (Spring Boot) ←→ MySQL Database
```

## 📁 Key Files Created/Modified

### 1. API Service Layer
- **`src/services/eventService.js`** - Centralized API service for all event-related operations

### 2. Context Updates
- **`src/contexts/EventContext.jsx`** - Updated to use real API instead of localStorage

### 3. Component Updates
- **`src/components/forms/EventForm.jsx`** - Enhanced with more fields matching backend API
- **`src/pages/CreateEvent.jsx`** - Updated with proper error handling and loading states
- **`src/pages/Events.jsx`** - Added loading states and error handling

### 4. Error Handling
- **`src/components/common/ErrorBoundary.jsx`** - Global error boundary for unexpected errors

### 5. Testing
- **`src/pages/TestIntegration.jsx`** - Test page to verify backend connectivity

## 🔌 API Endpoints Used

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/events` | Get all events |
| GET | `/api/events/{id}` | Get event by ID |
| POST | `/api/events` | Create new event |
| PUT | `/api/events/{id}` | Update event |
| DELETE | `/api/events/{id}` | Delete event |
| POST | `/api/events/{id}/enroll` | Enroll in event |
| GET | `/api/events/{id}/participants` | Get event participants |
| DELETE | `/api/events/{id}/participants/{participantId}` | Cancel enrollment |
| PUT | `/api/events/{id}/participants/{participantId}` | Update participant status |
| GET | `/api/health` | Health check |

## 🚀 How to Test the Integration

### 1. Start the Backend Services
```bash
# Start MySQL (if not running)
# Start Eureka Server
cd backend/eureka-server
./mvnw spring-boot:run

# Start Event Service
cd backend/event-service
./mvnw spring-boot:run
```

### 2. Start the Frontend
```bash
# In the root directory
npm run dev
```

### 3. Test Integration
1. Visit `http://localhost:5173/test-integration` to run integration tests
2. Visit `http://localhost:5173/events` to see events from the database
3. Visit `http://localhost:5173/create-event` to create new events (NGO role required)

## 📊 Data Flow

### Creating an Event
1. User fills out the EventForm
2. Form data is sent to `EventContext.addEvent()`
3. Context calls `eventService.createEvent()`
4. API service makes POST request to `/api/events`
5. Backend saves to MySQL database
6. Frontend updates local state with new event

### Joining an Event
1. User clicks "Join Event" button
2. `EventContext.joinEvent()` is called
3. Context calls `eventService.enrollInEvent()`
4. API service makes POST request to `/api/events/{id}/enroll`
5. Backend creates enrollment record in database
6. Frontend refreshes events to show updated participant count

## 🔧 Configuration

### API Base URL
The API base URL is configured in `src/services/eventService.js`:
```javascript
const API_BASE_URL = 'http://localhost:8083/api';
```

### Authentication
The service automatically includes auth tokens from localStorage:
```javascript
getAuthHeaders() {
  const token = localStorage.getItem('authToken');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
}
```

## 🛠️ Error Handling

### 1. API Level
- Network errors are caught and re-thrown with descriptive messages
- HTTP errors are handled with proper error messages

### 2. Context Level
- Loading states are managed for all operations
- Error states are stored and displayed to users
- Fallback behavior when API calls fail

### 3. Component Level
- Loading spinners during API calls
- Success/error messages for user actions
- Disabled states during loading

### 4. Global Level
- ErrorBoundary catches unexpected React errors
- Graceful fallbacks for critical failures

## 📝 Data Transformation

### Frontend to Backend
```javascript
// Frontend form data
{
  name: "Beach Cleanup",
  location: "Juhu Beach",
  date: "2024-01-15",
  time: "09:00",
  description: "Clean up the beach...",
  maxParticipants: 50
}

// Transformed for API
{
  title: "Beach Cleanup",
  location: "Juhu Beach", 
  dateTime: "2024-01-15T09:00",
  description: "Clean up the beach...",
  ngoId: 1,
  maxParticipants: 50,
  contactEmail: "ngo@example.com",
  contactPhone: "+91 98765 43210"
}
```

## 🔍 Debugging

### 1. Check Backend Logs
Look for API calls in the event-service console output.

### 2. Check Browser Network Tab
Monitor API requests and responses in browser dev tools.

### 3. Use Test Integration Page
Visit `/test-integration` to run automated tests.

### 4. Check Database
Verify data is being stored in MySQL:
```sql
SELECT * FROM events;
SELECT * FROM event_participants;
```

## 🚨 Common Issues

### 1. CORS Errors
- Ensure event-service is running on port 8083
- Check CORS configuration in backend

### 2. Authentication Errors
- Verify auth token is stored in localStorage
- Check JWT configuration in backend

### 3. Database Connection Errors
- Ensure MySQL is running
- Check database credentials in application.properties

### 4. Service Discovery Errors
- Ensure Eureka server is running
- Check service registration in Eureka dashboard

## 🎉 Success Indicators

✅ Events load from database on page refresh  
✅ Creating events saves to database  
✅ Joining events updates participant count  
✅ Error messages display properly  
✅ Loading states work correctly  
✅ Test integration page shows all green  

## 🔄 Next Steps

1. **Authentication Integration**: Connect with auth-service for proper JWT handling
2. **Real-time Updates**: Add WebSocket support for live updates
3. **File Uploads**: Add image upload for events
4. **Notifications**: Add email/SMS notifications for event updates
5. **Analytics**: Add event analytics and reporting

---

**Note**: This integration provides a solid foundation for a production-ready event management system. All CRUD operations are properly handled with error management and user feedback.
