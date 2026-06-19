import { MongoClient } from "mongodb";
import {
  URI_MONGO_MISSING,
  DATABASE_NOT_CONNECTED,
} from "../constants/index.js";

const uri = process.env.MONGO_URI;

if (!uri) {
  throw new Error(URI_MONGO_MISSING);
}

let client;
let db;

export async function connectToDatabase() {
  if (!client) {
    try {
      client = new MongoClient(uri);
      await client.connect();
      db = client.db();
    } catch (error) {
      throw new Error(`Error connecting to MongoDB: ${error.message}`);
    }
  }
  return db;
}

export async function getDb() {
  if (!db) {
    throw new Error(DATABASE_NOT_CONNECTED);
  }
  return db;
}