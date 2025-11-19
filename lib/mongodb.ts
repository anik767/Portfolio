import { MongoClient, MongoClientOptions } from "mongodb";

const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error("MONGODB_URI is not set in environment variables");
  throw new Error("Please add your Mongo URI to .env.local or environment variables");
}

// MongoDB connection options
// For Vercel/serverless environments, we need to be careful with TLS
// The connection string should handle TLS automatically for mongodb+srv://
const options: MongoClientOptions = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 20000, // Increased for serverless cold starts
  socketTimeoutMS: 45000,
  connectTimeoutMS: 20000,
  // Retry options
  retryWrites: true,
  retryReads: true,
  // For serverless, don't force TLS - let the connection string handle it
  // MongoDB Atlas with mongodb+srv:// automatically uses TLS
  // Only set TLS explicitly if connection string doesn't include it
};

let clientPromise: Promise<MongoClient>;

// Extend NodeJS global type
declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

function createClient() {
  try {
    if (!uri) {
      throw new Error("MONGODB_URI is not defined");
    }
    
    console.log("Creating MongoDB client...");
    const newClient = new MongoClient(uri, options);
    
    const connectPromise = newClient.connect().then((connectedClient) => {
      console.log("MongoDB connected successfully");
      return connectedClient;
    }).catch((error) => {
      console.error("MongoDB connection failed:", error);
      // Log specific error details
      if (error.message) {
        console.error("Error message:", error.message);
      }
      if (error.stack) {
        console.error("Error stack:", error.stack);
      }
      throw error;
    });
    
    return connectPromise;
  } catch (error) {
    console.error("Error creating MongoDB client:", error);
    throw error;
  }
}

if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  if (!global._mongoClientPromise) {
    global._mongoClientPromise = createClient();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  clientPromise = createClient();
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise;
