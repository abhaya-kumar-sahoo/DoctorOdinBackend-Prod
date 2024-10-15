"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const databaseName = process.env.Database;
const URL = process.env.MongoDB;
// Use nullish coalescing operator (??) to provide a default value when URL is undefined
const connectionString = URL ?? '';
// Create a MongoDB client instance and establish the connection
let option = { useUnifiedTopology: true };
const client = new mongodb_1.MongoClient(connectionString);
// This function makes the connection to the MongoDB database
async function dbConnect(collectionName) {
    try {
        await client.connect();
        const db = client.db(databaseName);
        return db.collection(collectionName); // Specify the collection name here
    }
    catch (error) {
        console.error("Error connecting to the database:", error);
        throw error; // Rethrow the error for error handling in your application
    }
}
exports.default = dbConnect;
//# sourceMappingURL=dbconnect.js.map