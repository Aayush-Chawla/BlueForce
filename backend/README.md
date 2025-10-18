# BlueForce Backend Service

A comprehensive backend service for managing beach cleanup events, volunteer enrollments, and NGO coordination.

## Features

- **Event Management**: Create, read, update, and delete beach cleanup events
- **Volunteer Enrollment**: Allow volunteers to enroll in events and track participation
- **NGO Management**: NGOs can create and manage their events
- **Authentication & Authorization**: JWT-based authentication with role-based access control
- **Data Validation**: Comprehensive input validation and error handling
- **Database Integration**: MySQL database with proper relationships and constraints

## API Endpoints

### Events
- `POST /api/events` - Create new beach cleanup drive (NGO only)
- `GET /api/events` - List all upcoming events
- `GET /api/events/:id` - Get event details
- `PUT /api/events/:id` - Update event (NGO owner or admin only)
- `DELETE /api/events/:id` - Delete event (NGO owner or admin only)
- `GET /api/events/ngo/:ngo_id` - Get events by NGO

### Enrollments
- `POST /api/events/:id/enroll` - Volunteer enrolls in event
- `GET /api/events/:id/participants` - List enrolled volunteers
- `DELETE /api/events/:id/enroll` - Cancel enrollment
- `GET /api/events/users/:userId/events` - Get all events a user is enrolled in
- `POST /api/events/:id/complete` - Mark participation as completed (NGO only)
- `GET /api/events/:id/stats` - Get enrollment statistics

## Database Schema

### Events Table
```sql
CREATE TABLE events (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    ngo_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    location VARCHAR(255) NOT NULL,
    date_time DATETIME NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Event Participants Table
```sql
CREATE TABLE event_participants (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    event_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    enrolled_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    status ENUM('enrolled', 'cancelled', 'completed') DEFAULT 'enrolled',
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_enrollment (event_id, user_id)
);
```

## Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Setup**
   Create a `.env` file in the backend directory:
   ```env
   # Database Configuration
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=blueforce_db
   DB_PORT=3306

   # Server Configuration
   PORT=4000
   NODE_ENV=development

   # JWT Configuration
   JWT_SECRET=your_jwt_secret_key_here
   JWT_EXPIRES_IN=7d
   ```

3. **Database Setup**
   ```bash
   # Run migrations to create tables
   npm run migrate
   ```

4. **Start the Server**
   ```bash
   # Development mode
   npm run dev

   # Production mode
   npm start
   ```

## Project Structure

```
backend/
├── config/
│   └── database.js          # Database configuration
├── middleware/
│   ├── auth.js              # Authentication middleware
│   ├── errorHandler.js      # Error handling middleware
│   └── validation.js        # Input validation middleware
├── models/
│   ├── Event.js             # Event model
│   └── EventParticipant.js  # Event participant model
├── routes/
│   ├── events.js            # Event routes
│   └── enrollments.js       # Enrollment routes
├── migrations/
│   ├── 001_create_events_table.sql
│   └── migrate.js           # Migration runner
├── server.js                # Main server file
├── package.json
└── README.md
```

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## User Roles

- **volunteer**: Can enroll in events and view their enrollments
- **ngo**: Can create, update, and delete their own events, view participants
- **admin**: Full access to all operations

## Error Handling

All API responses follow a consistent format:

```json
{
  "success": true/false,
  "message": "Description of the result",
  "data": {}, // Present on success
  "errors": [] // Present on validation errors
}
```

## Rate Limiting

The API implements rate limiting:
- 100 requests per 15 minutes per IP address
- Configurable via environment variables

## Security Features

- Helmet.js for security headers
- CORS configuration
- Input validation and sanitization
- SQL injection prevention
- JWT token validation
- Role-based access control

## Development

### Running Tests
```bash
npm test
```

### Database Migrations
```bash
npm run migrate
```

### Code Linting
```bash
npm run lint
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details
