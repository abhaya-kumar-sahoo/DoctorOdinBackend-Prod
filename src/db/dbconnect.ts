import { MongoClient, Collection, Db } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();


const databaseName= process.env.Database;
const URL: string | undefined = process.env.MongoDB;

// Use nullish coalescing operator (??) to provide a default value when URL is undefined
const connectionString: string = URL ?? '';

// Create a MongoDB client instance and establish the connection
 let option={ useUnifiedTopology: true };
const client = new MongoClient(connectionString);

// This function makes the connection to the MongoDB database
async function dbConnect(collectionName: string): Promise<Collection> {
  try {
    await client.connect();
    const db: Db = client.db(databaseName);
    return db.collection(collectionName); // Specify the collection name here
  } catch (error) {
    console.error("Error connecting to the database:", error);
    throw error; // Rethrow the error for error handling in your application
  }
}

export default dbConnect;

