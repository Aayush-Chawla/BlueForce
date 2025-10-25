import React, { useState, useEffect } from 'react';
import { eventService } from '../services/eventService';
import { CheckCircle, XCircle, Loader } from 'lucide-react';

const TestIntegration = () => {
  const [testResults, setTestResults] = useState({});
  const [loading, setLoading] = useState(false);

  const runTests = async () => {
    setLoading(true);
    const results = {};

    try {
      // Test 1: Health Check
      console.log('Testing health check...');
      const healthResponse = await eventService.healthCheck();
      results.healthCheck = {
        status: 'success',
        message: 'Health check passed',
        data: healthResponse
      };
    } catch (error) {
      results.healthCheck = {
        status: 'error',
        message: error.message
      };
    }

    try {
      // Test 2: Get Events
      console.log('Testing get events...');
      const eventsResponse = await eventService.getEvents();
      results.getEvents = {
        status: 'success',
        message: `Found ${eventsResponse?.length || 0} events`,
        data: eventsResponse
      };
    } catch (error) {
      results.getEvents = {
        status: 'error',
        message: error.message
      };
    }

    try {
      // Test 3: Create Event (if we have auth)
      const authToken = localStorage.getItem('authToken');
      if (authToken) {
        console.log('Testing create event...');
        const testEvent = {
          title: 'Test Event from Frontend',
          description: 'This is a test event created from the frontend integration',
          location: 'Test Beach, Mumbai',
          dateTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
          ngoId: 1,
          maxParticipants: 10,
          contactEmail: 'test@example.com',
          contactPhone: '+91 98765 43210'
        };
        
        const createResponse = await eventService.createEvent(testEvent);
        results.createEvent = {
          status: 'success',
          message: 'Event created successfully',
          data: createResponse
        };
      } else {
        results.createEvent = {
          status: 'skipped',
          message: 'Skipped - No auth token found'
        };
      }
    } catch (error) {
      results.createEvent = {
        status: 'error',
        message: error.message
      };
    }

    setTestResults(results);
    setLoading(false);
  };

  useEffect(() => {
    runTests();
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'skipped':
        return <div className="w-5 h-5 rounded-full bg-yellow-500" />;
      default:
        return <Loader className="w-5 h-5 text-gray-500 animate-spin" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success':
        return 'text-green-700 bg-green-50 border-green-200';
      case 'error':
        return 'text-red-700 bg-red-50 border-red-200';
      case 'skipped':
        return 'text-yellow-700 bg-yellow-50 border-yellow-200';
      default:
        return 'text-gray-700 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-teal-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Event Service Integration Test</h1>
            <p className="text-gray-600">
              Testing the connection between frontend and event-service backend
            </p>
          </div>

          {loading && (
            <div className="text-center py-8">
              <Loader className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Running tests...</p>
            </div>
          )}

          <div className="space-y-4">
            {Object.entries(testResults).map(([testName, result]) => (
              <div
                key={testName}
                className={`p-4 rounded-lg border ${getStatusColor(result.status)}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(result.status)}
                    <div>
                      <h3 className="font-semibold capitalize">
                        {testName.replace(/([A-Z])/g, ' $1').trim()}
                      </h3>
                      <p className="text-sm opacity-75">{result.message}</p>
                    </div>
                  </div>
                  <span className="text-sm font-medium uppercase">
                    {result.status}
                  </span>
                </div>
                
                {result.data && (
                  <details className="mt-3">
                    <summary className="cursor-pointer text-sm font-medium">
                      View Response Data
                    </summary>
                    <pre className="mt-2 p-2 bg-white bg-opacity-50 rounded text-xs overflow-auto">
                      {JSON.stringify(result.data, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={runTests}
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Running Tests...' : 'Run Tests Again'}
            </button>
          </div>

          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">Integration Status</h3>
            <p className="text-blue-700 text-sm">
              This page tests the connection between your React frontend and the Spring Boot event-service.
              Make sure the event-service is running on port 8083 for the tests to pass.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestIntegration;
