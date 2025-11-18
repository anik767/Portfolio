import { MongoClient, MongoClientOptions } from "mongodb";

const uri = process.env.MONGODB_URI!;

if (!uri) {
  throw new Error("Please add your Mongo URI to .env.local");
}

// MongoDB connection options
// Note: SSL/TLS is automatically handled by the connection string for MongoDB Atlas
const options: MongoClientOptions = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 10000, // Increased timeout
  socketTimeoutMS: 45000,
  // Retry options
  retryWrites: true,
  retryReads: true,
  // Let MongoDB driver handle SSL from connection string
  // Don't force TLS if connection string doesn't specify it
};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

// Extend NodeJS global type
declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect().catch((error) => {
      console.error("MongoDB connection error:", error);
      throw error;
    });
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options);
  clientPromise = client.connect().catch((error) => {
    console.error("MongoDB connection error:", error);
    throw error;
  });
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise;
