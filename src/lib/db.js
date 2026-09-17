import mongoose from 'mongoose';

// =============================================
// Database Connection File
// =============================================
// This file connects our app to MongoDB database.
// It uses "connection caching" so we don't create
// a new connection every time a request comes in.
// Instead, we reuse the same connection (much faster!).

// Get the MongoDB URL from environment variables (.env file)
// If not set, use a default local MongoDB URL
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/pdf_course_platform';

// We store the connection in a global variable so it
// persists between hot reloads during development
let cached = global.mongooseCache;

// If there's no cached connection yet, create an empty one
if (!cached) {
  cached = global.mongooseCache = { conn: null, promise: null };
}

/**
 * Connect to MongoDB database.
 * - If already connected, returns the existing connection (fast!)
 * - If not connected, creates a new connection and caches it
 * 
 * @returns {Promise} - The mongoose connection
 */
export async function connectToDatabase() {
  // If we already have a connection, return it immediately
  if (cached.conn) {
    return cached.conn;
  }

  // If no connection is being made yet, start one
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,            // Don't queue commands if disconnected
      serverSelectionTimeoutMS: 5000,   // Wait max 5 seconds to find server
    };

    // Start connecting to MongoDB
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongooseInstance) => {
      return mongooseInstance;
    });
  }

  // Wait for the connection to complete
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    // If connection fails, reset the promise so we can try again
    cached.promise = null;
    console.error('MongoDB connection error:', e);
    throw e;
  }

  return cached.conn;
}

export default connectToDatabase;
