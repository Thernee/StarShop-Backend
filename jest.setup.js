// This file is used to configure the test environment
process.env.NODE_ENV = 'test';

// Mock environment variables
process.env.PUSHER_APP_ID = 'test-app-id';
process.env.PUSHER_KEY = 'test-key';
process.env.PUSHER_SECRET = 'test-secret';
process.env.PUSHER_CLUSTER = 'test-cluster';
process.env.JWT_SECRET = 'test-jwt-secret'; 