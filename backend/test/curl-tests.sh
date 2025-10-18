#!/bin/bash

# BlueForce API Testing Script
# This script provides curl commands to test all API endpoints

# Configuration
BASE_URL="http://localhost:4000"
API_URL="$BASE_URL/api"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Check if server is running
check_server() {
    print_status "Checking if server is running..."
    if curl -s "$BASE_URL/health" > /dev/null; then
        print_success "Server is running"
    else
        print_error "Server is not running. Please start the server first."
        exit 1
    fi
}

# Test health endpoint
test_health() {
    print_status "Testing health endpoint..."
    curl -s "$BASE_URL/health" | jq '.' 2>/dev/null || curl -s "$BASE_URL/health"
    echo ""
}

# Test get all events
test_get_events() {
    print_status "Testing GET /api/events..."
    curl -s "$API_URL/events" | jq '.' 2>/dev/null || curl -s "$API_URL/events"
    echo ""
}

# Test get events with filters
test_get_events_filtered() {
    print_status "Testing GET /api/events with filters..."
    
    print_status "  - Upcoming events only:"
    curl -s "$API_URL/events?upcoming=true" | jq '.' 2>/dev/null || curl -s "$API_URL/events?upcoming=true"
    echo ""
    
    print_status "  - Events by location (Marina):"
    curl -s "$API_URL/events?location=Marina" | jq '.' 2>/dev/null || curl -s "$API_URL/events?location=Marina"
    echo ""
}

# Test get event details
test_get_event_details() {
    print_status "Testing GET /api/events/1..."
    curl -s "$API_URL/events/1" | jq '.' 2>/dev/null || curl -s "$API_URL/events/1"
    echo ""
}

# Test create event (requires authentication)
test_create_event() {
    print_status "Testing POST /api/events (requires authentication)..."
    print_warning "This test requires a valid JWT token. Please update the TOKEN variable."
    
    # You need to replace this with a valid token
    TOKEN="your_jwt_token_here"
    
    if [ "$TOKEN" = "your_jwt_token_here" ]; then
        print_warning "Please run 'node test/test-auth.js' to generate test tokens first"
        return
    fi
    
    curl -s -X POST "$API_URL/events" \
        -H "Authorization: Bearer $TOKEN" \
        -H "Content-Type: application/json" \
        -d '{
            "ngo_id": 5,
            "title": "Test Beach Cleanup",
            "description": "This is a test event created via curl",
            "location": "Test Beach, Test City",
            "date_time": "2024-03-15T09:00:00.000Z"
        }' | jq '.' 2>/dev/null || echo "Response received"
    echo ""
}

# Test enroll in event (requires authentication)
test_enroll_event() {
    print_status "Testing POST /api/events/1/enroll (requires authentication)..."
    print_warning "This test requires a valid JWT token. Please update the TOKEN variable."
    
    TOKEN="your_jwt_token_here"
    
    if [ "$TOKEN" = "your_jwt_token_here" ]; then
        print_warning "Please run 'node test/test-auth.js' to generate test tokens first"
        return
    fi
    
    curl -s -X POST "$API_URL/events/1/enroll" \
        -H "Authorization: Bearer $TOKEN" \
        -H "Content-Type: application/json" | jq '.' 2>/dev/null || echo "Response received"
    echo ""
}

# Test get event participants (requires authentication)
test_get_participants() {
    print_status "Testing GET /api/events/1/participants (requires authentication)..."
    print_warning "This test requires a valid JWT token. Please update the TOKEN variable."
    
    TOKEN="your_jwt_token_here"
    
    if [ "$TOKEN" = "your_jwt_token_here" ]; then
        print_warning "Please run 'node test/test-auth.js' to generate test tokens first"
        return
    fi
    
    curl -s "$API_URL/events/1/participants" \
        -H "Authorization: Bearer $TOKEN" | jq '.' 2>/dev/null || echo "Response received"
    echo ""
}

# Test error cases
test_error_cases() {
    print_status "Testing error cases..."
    
    print_status "  - Get non-existent event:"
    curl -s "$API_URL/events/999" | jq '.' 2>/dev/null || curl -s "$API_URL/events/999"
    echo ""
    
    print_status "  - Create event without authentication:"
    curl -s -X POST "$API_URL/events" \
        -H "Content-Type: application/json" \
        -d '{
            "ngo_id": 5,
            "title": "Unauthorized Event",
            "description": "This should fail",
            "location": "Test Location",
            "date_time": "2024-03-15T09:00:00.000Z"
        }' | jq '.' 2>/dev/null || echo "Response received"
    echo ""
    
    print_status "  - Create event with invalid data:"
    curl -s -X POST "$API_URL/events" \
        -H "Content-Type: application/json" \
        -d '{
            "ngo_id": 5,
            "title": "ab",
            "description": "This should fail validation",
            "location": "Test Location",
            "date_time": "2020-01-01T09:00:00.000Z"
        }' | jq '.' 2>/dev/null || echo "Response received"
    echo ""
}

# Main test function
run_tests() {
    print_status "Starting BlueForce API Tests..."
    echo ""
    
    check_server
    echo ""
    
    test_health
    test_get_events
    test_get_events_filtered
    test_get_event_details
    test_create_event
    test_enroll_event
    test_get_participants
    test_error_cases
    
    print_success "All tests completed!"
    echo ""
    print_status "Note: Some tests require authentication tokens."
    print_status "Run 'node test/test-auth.js' to generate test tokens."
}

# Help function
show_help() {
    echo "BlueForce API Testing Script"
    echo ""
    echo "Usage: $0 [option]"
    echo ""
    echo "Options:"
    echo "  -h, --help     Show this help message"
    echo "  -s, --server   Check server status only"
    echo "  -a, --all      Run all tests (default)"
    echo "  -b, --basic    Run basic tests only (no auth required)"
    echo ""
    echo "Examples:"
    echo "  $0              # Run all tests"
    echo "  $0 --basic      # Run basic tests only"
    echo "  $0 --server     # Check server status"
}

# Parse command line arguments
case "${1:-}" in
    -h|--help)
        show_help
        exit 0
        ;;
    -s|--server)
        check_server
        exit 0
        ;;
    -b|--basic)
        print_status "Running basic tests only..."
        check_server
        test_health
        test_get_events
        test_get_events_filtered
        test_get_event_details
        test_error_cases
        print_success "Basic tests completed!"
        ;;
    -a|--all|"")
        run_tests
        ;;
    *)
        print_error "Unknown option: $1"
        show_help
        exit 1
        ;;
esac
