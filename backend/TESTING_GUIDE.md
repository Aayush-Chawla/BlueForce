# BlueForce Backend Testing Guide

This comprehensive guide will help you test the BlueForce backend service thoroughly.

## 🚀 Quick Start Testing

### 1. Prerequisites
- Node.js installed
- MySQL database running
- Backend service dependencies installed

### 2. Setup Test Environment
```bash
# Navigate to backend directory
cd BlueForce/backend

# Install dependencies
npm install

# Setup environment
npm run setup

# Run database migrations
npm run migrate

# Seed test data
node test/seed-data.js

# Generate test JWT tokens
node test/test-auth.js
```

### 3. Start the Server
```bash
# Development mode
npm run dev

# Or production mode
npm start
```

## 🧪 Testing Methods

### Method 1: REST Client (VS Code Extension)
1. Install "REST Client" extension in VS Code
2. Open `test/api-tests.http`
3. Update the `@token` variable with a valid JWT token
4. Click "Send Request" above each endpoint

### Method 2: Postman
1. Import `test/test-postman.json` into Postman
2. Update the environment variables with your JWT tokens
3. Run the collection

### Method 3: cURL Script
```bash
# Make script executable (Linux/Mac)
chmod +x test/curl-tests.sh

# Run all tests
./test/curl-tests.sh

# Run basic tests only
./test/curl-tests.sh --basic

# Check server status
./test/curl-tests.sh --server
```

### Method 4: Manual cURL Commands
```bash
# Health check
curl http://localhost:4000/health

# Get all events
curl http://localhost:4000/api/events

# Get event details
curl http://localhost:4000/api/events/1

# Create event (requires authentication)
curl -X POST http://localhost:4000/api/events \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "ngo_id": 5,
    "title": "Test Beach Cleanup",
    "description": "Test event",
    "location": "Test Beach",
    "date_time": "2024-03-15T09:00:00.000Z"
  }'
```

## 🔑 Authentication Testing

### Generate Test Tokens
```bash
node test/test-auth.js
```

This will create:
- JWT tokens for all user roles
- Save tokens to `test/test-tokens.json`
- Test authentication mechanisms

### Test Credentials
After seeding data, you can use these credentials:
- **Volunteer**: `john.doe@example.com` / `password123`
- **NGO**: `contact@ecowarriors.org` / `ngo123`
- **Admin**: `admin@blueforce.com` / `admin123`

## 📊 Test Data Overview

The seed script creates:
- **8 Users**: 4 volunteers, 3 NGOs, 1 admin
- **5 Events**: Various beach cleanup events
- **12 Enrollments**: Volunteers enrolled in events

### Sample Events
1. Marina Beach Cleanup Drive (Chennai)
2. Juhu Beach Cleanup (Mumbai)
3. Goa Beach Conservation Event (Goa)
4. Kerala Coastal Cleanup (Kerala)
5. Puri Beach Cleanup (Odisha)

## 🧪 Test Scenarios

### 1. Basic Functionality Tests
- ✅ Health check endpoint
- ✅ Get all events
- ✅ Get events with filters
- ✅ Get event details
- ✅ Get non-existent event (404 error)

### 2. Authentication Tests
- ✅ Create event without authentication (401 error)
- ✅ Create event with valid NGO token
- ✅ Access protected endpoints with valid tokens
- ✅ Access protected endpoints with invalid tokens

### 3. Authorization Tests
- ✅ Volunteer can enroll in events
- ✅ NGO can create/update/delete their events
- ✅ NGO can view participants for their events
- ✅ Admin can access all endpoints
- ✅ Users cannot access other users' data

### 4. Validation Tests
- ✅ Create event with invalid data (400 error)
- ✅ Create event with past date (400 error)
- ✅ Create event with short title (400 error)
- ✅ Enroll in past event (400 error)

### 5. Business Logic Tests
- ✅ Cannot enroll twice in same event
- ✅ Cannot enroll in past events
- ✅ Can cancel enrollment
- ✅ Can mark participation as complete
- ✅ Statistics are calculated correctly

## 🔍 API Endpoint Testing Checklist

### Events API
- [ ] `GET /api/events` - List all events
- [ ] `GET /api/events?upcoming=true` - Filter upcoming events
- [ ] `GET /api/events?location=Marina` - Filter by location
- [ ] `GET /api/events?ngo_id=5` - Filter by NGO
- [ ] `GET /api/events/1` - Get event details
- [ ] `POST /api/events` - Create event (NGO only)
- [ ] `PUT /api/events/1` - Update event (NGO owner only)
- [ ] `DELETE /api/events/1` - Delete event (NGO owner only)
- [ ] `GET /api/events/ngo/5` - Get events by NGO

### Enrollments API
- [ ] `POST /api/events/1/enroll` - Enroll in event
- [ ] `GET /api/events/1/participants` - Get participants (NGO only)
- [ ] `DELETE /api/events/1/enroll` - Cancel enrollment
- [ ] `GET /api/events/users/1/events` - Get user enrollments
- [ ] `POST /api/events/1/complete` - Mark complete (NGO only)
- [ ] `GET /api/events/1/stats` - Get statistics (NGO only)

## 🐛 Common Issues & Solutions

### Issue: "Database connection failed"
**Solution**: 
- Check MySQL is running
- Verify database credentials in `.env`
- Ensure database exists

### Issue: "JWT token invalid"
**Solution**:
- Generate new tokens: `node test/test-auth.js`
- Check token expiration
- Verify JWT_SECRET in `.env`

### Issue: "Event not found"
**Solution**:
- Seed test data: `node test/seed-data.js`
- Check if event ID exists in database

### Issue: "NGO access required"
**Solution**:
- Use NGO or admin token
- Check user role in database

## 📈 Performance Testing

### Load Testing with Artillery
```bash
# Install Artillery
npm install -g artillery

# Run load test
artillery quick --count 10 --num 5 http://localhost:4000/api/events
```

### Database Performance
```sql
-- Check query performance
EXPLAIN SELECT * FROM events WHERE date_time > NOW();

-- Check indexes
SHOW INDEX FROM events;
SHOW INDEX FROM event_participants;
```

## 🔒 Security Testing

### Test Authentication Bypass
```bash
# Try accessing protected endpoint without token
curl http://localhost:4000/api/events \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"ngo_id": 5, "title": "Hack Attempt"}'
```

### Test SQL Injection
```bash
# Test with malicious input
curl "http://localhost:4000/api/events?location='; DROP TABLE events; --"
```

### Test Rate Limiting
```bash
# Make multiple requests quickly
for i in {1..10}; do curl http://localhost:4000/api/events; done
```

## 📝 Test Results Documentation

### Expected Response Formats

#### Success Response
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { ... }
}
```

#### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "details": "Additional error information"
}
```

### Test Coverage Areas
- [ ] All API endpoints
- [ ] Authentication & authorization
- [ ] Input validation
- [ ] Error handling
- [ ] Database operations
- [ ] Business logic
- [ ] Security measures

## 🚀 Automated Testing

### Unit Tests (Future Enhancement)
```bash
# Install testing framework
npm install --save-dev jest supertest

# Run tests
npm test
```

### Integration Tests
```bash
# Test database operations
node test/test-database.js

# Test API endpoints
node test/test-api.js
```

## 📋 Testing Checklist

Before deploying to production:

- [ ] All endpoints respond correctly
- [ ] Authentication works properly
- [ ] Authorization is enforced
- [ ] Input validation prevents bad data
- [ ] Error handling is comprehensive
- [ ] Database operations are secure
- [ ] Rate limiting is active
- [ ] CORS is configured correctly
- [ ] Security headers are present
- [ ] Performance is acceptable

## 🆘 Getting Help

If you encounter issues:

1. Check the server logs
2. Verify database connection
3. Check environment variables
4. Review API documentation
5. Test with sample data
6. Check authentication tokens

## 📚 Additional Resources

- [API Documentation](API_DOCUMENTATION.md)
- [README](README.md)
- [Database Schema](migrations/001_create_events_table.sql)
- [Sample Data](test/seed-data.js)

---

Happy Testing! 🧪✨
