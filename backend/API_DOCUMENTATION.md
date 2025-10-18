# BlueForce API Documentation

## Base URL
```
http://localhost:4000/api
```

## Authentication
All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## Authentication API

### Register User
**POST** `/api/auth/register`

Register a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password123!",
  "role": "volunteer"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "volunteer",
      "created_at": "2024-01-15T10:30:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Login User
**POST** `/api/auth/login`

Authenticate user and get JWT token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "Password123!"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "volunteer",
      "created_at": "2024-01-15T10:30:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Get Current User
**GET** `/api/auth/me`

Get current user information.

**Headers:**
- `Authorization: Bearer <token>` (required)

**Response:**
```json
{
  "success": true,
  "message": "User information retrieved successfully",
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "volunteer",
      "created_at": "2024-01-15T10:30:00.000Z",
      "updated_at": "2024-01-15T10:30:00.000Z"
    }
  }
}
```

### Update Profile
**PUT** `/api/auth/profile`

Update user profile information.

**Headers:**
- `Authorization: Bearer <token>` (required)
- `Content-Type: application/json`

**Request Body:**
```json
{
  "name": "John Smith",
  "email": "johnsmith@example.com"
}
```

### Change Password
**PUT** `/api/auth/change-password`

Change user password.

**Headers:**
- `Authorization: Bearer <token>` (required)
- `Content-Type: application/json`

**Request Body:**
```json
{
  "currentPassword": "OldPassword123!",
  "newPassword": "NewPassword123!"
}
```

### Logout
**POST** `/api/auth/logout`

Logout user (client-side token removal).

**Headers:**
- `Authorization: Bearer <token>` (required)

### Get All Users (Admin Only)
**GET** `/api/auth/users`

Get list of all users with optional filtering.

**Headers:**
- `Authorization: Bearer <admin_token>` (required)

**Query Parameters:**
- `role` (string): Filter by user role
- `search` (string): Search by name or email

**Response:**
```json
{
  "success": true,
  "message": "Users retrieved successfully",
  "data": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "volunteer",
      "created_at": "2024-01-15T10:30:00.000Z"
    }
  ],
  "count": 1
}
```

### Get User Statistics (Admin Only)
**GET** `/api/auth/stats`

Get user statistics.

**Headers:**
- `Authorization: Bearer <admin_token>` (required)

**Response:**
```json
{
  "success": true,
  "message": "User statistics retrieved successfully",
  "data": {
    "total_users": 8,
    "volunteers": 4,
    "ngos": 3,
    "admins": 1
  }
}
```

### Delete User (Admin Only)
**DELETE** `/api/auth/users/:id`

Delete a user account.

**Headers:**
- `Authorization: Bearer <admin_token>` (required)

---

## Response Format
All API responses follow this format:
```json
{
  "success": true/false,
  "message": "Description of the result",
  "data": {}, // Present on success
  "errors": [] // Present on validation errors
}
```

---

## Events API

### Create Event
**POST** `/api/events`

Create a new beach cleanup event (NGO only).

**Headers:**
- `Authorization: Bearer <token>` (required)
- `Content-Type: application/json`

**Request Body:**
```json
{
  "ngo_id": 1,
  "title": "Beach Cleanup at Marina Beach",
  "description": "Join us for a beach cleanup drive to keep our beaches clean and beautiful.",
  "location": "Marina Beach, Chennai",
  "date_time": "2024-02-15T09:00:00.000Z"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Event created successfully",
  "data": {
    "id": 1,
    "ngo_id": 1,
    "title": "Beach Cleanup at Marina Beach",
    "description": "Join us for a beach cleanup drive...",
    "location": "Marina Beach, Chennai",
    "date_time": "2024-02-15T09:00:00.000Z",
    "created_at": "2024-01-15T10:30:00.000Z",
    "ngo_name": "Eco Warriors",
    "participant_count": 0
  }
}
```

### Get All Events
**GET** `/api/events`

Retrieve all events with optional filtering.

**Query Parameters:**
- `upcoming` (boolean): Filter for future events only
- `ngo_id` (integer): Filter by NGO ID
- `location` (string): Filter by location (partial match)

**Example:**
```
GET /api/events?upcoming=true&location=Marina
```

**Response:**
```json
{
  "success": true,
  "message": "Events retrieved successfully",
  "data": [
    {
      "id": 1,
      "ngo_id": 1,
      "title": "Beach Cleanup at Marina Beach",
      "description": "Join us for a beach cleanup drive...",
      "location": "Marina Beach, Chennai",
      "date_time": "2024-02-15T09:00:00.000Z",
      "created_at": "2024-01-15T10:30:00.000Z",
      "ngo_name": "Eco Warriors",
      "participant_count": 5
    }
  ],
  "count": 1
}
```

### Get Event Details
**GET** `/api/events/:id`

Get detailed information about a specific event.

**Response:**
```json
{
  "success": true,
  "message": "Event details retrieved successfully",
  "data": {
    "id": 1,
    "ngo_id": 1,
    "title": "Beach Cleanup at Marina Beach",
    "description": "Join us for a beach cleanup drive...",
    "location": "Marina Beach, Chennai",
    "date_time": "2024-02-15T09:00:00.000Z",
    "created_at": "2024-01-15T10:30:00.000Z",
    "ngo_name": "Eco Warriors",
    "participant_count": 5,
    "participants": [
      {
        "id": 1,
        "event_id": 1,
        "user_id": 2,
        "enrolled_at": "2024-01-16T08:00:00.000Z",
        "status": "enrolled",
        "name": "John Doe",
        "email": "john@example.com",
        "role": "volunteer"
      }
    ],
    "stats": {
      "enrolled_count": 5,
      "cancelled_count": 0,
      "completed_count": 0,
      "total_count": 5
    }
  }
}
```

### Update Event
**PUT** `/api/events/:id`

Update an existing event (NGO owner or admin only).

**Headers:**
- `Authorization: Bearer <token>` (required)
- `Content-Type: application/json`

**Request Body:**
```json
{
  "title": "Updated Beach Cleanup at Marina Beach",
  "description": "Updated description...",
  "location": "Marina Beach, Chennai - Updated Location",
  "date_time": "2024-02-20T09:00:00.000Z"
}
```

### Delete Event
**DELETE** `/api/events/:id`

Delete an event (NGO owner or admin only).

**Headers:**
- `Authorization: Bearer <token>` (required)

---

## Enrollment API

### Enroll in Event
**POST** `/api/events/:id/enroll`

Enroll a volunteer in an event.

**Headers:**
- `Authorization: Bearer <token>` (required)

**Response:**
```json
{
  "success": true,
  "message": "Successfully enrolled in event",
  "data": {
    "id": 1,
    "event_id": 1,
    "user_id": 2,
    "enrolled_at": "2024-01-16T08:00:00.000Z",
    "status": "enrolled",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

### Get Event Participants
**GET** `/api/events/:id/participants`

Get list of all participants for an event (NGO owner or admin only).

**Headers:**
- `Authorization: Bearer <token>` (required)

**Response:**
```json
{
  "success": true,
  "message": "Participants retrieved successfully",
  "data": {
    "participants": [
      {
        "id": 1,
        "event_id": 1,
        "user_id": 2,
        "enrolled_at": "2024-01-16T08:00:00.000Z",
        "status": "enrolled",
        "name": "John Doe",
        "email": "john@example.com",
        "role": "volunteer"
      }
    ],
    "stats": {
      "enrolled_count": 5,
      "cancelled_count": 0,
      "completed_count": 0,
      "total_count": 5
    },
    "event": {
      "id": 1,
      "title": "Beach Cleanup at Marina Beach",
      "date_time": "2024-02-15T09:00:00.000Z",
      "location": "Marina Beach, Chennai"
    }
  }
}
```

### Cancel Enrollment
**DELETE** `/api/events/:id/enroll`

Cancel enrollment in an event.

**Headers:**
- `Authorization: Bearer <token>` (required)

### Get User Enrollments
**GET** `/api/events/users/:userId/events`

Get all events a user is enrolled in.

**Headers:**
- `Authorization: Bearer <token>` (required)

**Response:**
```json
{
  "success": true,
  "message": "User enrollments retrieved successfully",
  "data": [
    {
      "id": 1,
      "event_id": 1,
      "user_id": 2,
      "enrolled_at": "2024-01-16T08:00:00.000Z",
      "status": "enrolled",
      "title": "Beach Cleanup at Marina Beach",
      "description": "Join us for a beach cleanup drive...",
      "location": "Marina Beach, Chennai",
      "date_time": "2024-02-15T09:00:00.000Z",
      "ngo_name": "Eco Warriors"
    }
  ],
  "count": 1
}
```

### Mark Participation Complete
**POST** `/api/events/:id/complete`

Mark a participant's attendance as completed (NGO only).

**Headers:**
- `Authorization: Bearer <token>` (required)
- `Content-Type: application/json`

**Request Body:**
```json
{
  "user_id": 2
}
```

### Get Event Statistics
**GET** `/api/events/:id/stats`

Get enrollment statistics for an event (NGO owner or admin only).

**Headers:**
- `Authorization: Bearer <token>` (required)

**Response:**
```json
{
  "success": true,
  "message": "Event statistics retrieved successfully",
  "data": {
    "event": {
      "id": 1,
      "title": "Beach Cleanup at Marina Beach",
      "date_time": "2024-02-15T09:00:00.000Z",
      "location": "Marina Beach, Chennai"
    },
    "stats": {
      "enrolled_count": 5,
      "cancelled_count": 0,
      "completed_count": 0,
      "total_count": 5,
      "current_enrolled": 5
    }
  }
}
```

---

## Error Responses

### Validation Error (400)
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "title",
      "message": "Title must be between 3 and 255 characters",
      "value": "ab"
    }
  ]
}
```

### Unauthorized (401)
```json
{
  "success": false,
  "message": "Access token required"
}
```

### Forbidden (403)
```json
{
  "success": false,
  "message": "NGO access required"
}
```

### Not Found (404)
```json
{
  "success": false,
  "message": "Event not found"
}
```

### Conflict (409)
```json
{
  "success": false,
  "message": "You are already enrolled in this event"
}
```

### Rate Limit (429)
```json
{
  "success": false,
  "message": "Too many requests from this IP, please try again later."
}
```

### Server Error (500)
```json
{
  "success": false,
  "message": "Internal Server Error"
}
```

---

## User Roles

- **volunteer**: Can enroll in events and view their enrollments
- **ngo**: Can create, update, and delete their own events, view participants
- **admin**: Full access to all operations

---

## Rate Limiting

- 100 requests per 15 minutes per IP address
- Configurable via environment variables

---

## Health Check

**GET** `/health`

Check if the service is running.

**Response:**
```json
{
  "success": true,
  "message": "BlueForce Backend Service is running",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "version": "1.0.0"
}
```
