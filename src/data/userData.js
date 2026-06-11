import { getDb } from "./connection.js";
import { ObjectId } from "mongodb";
import bcrypt from "bcrypt";
import {
  USER_ALREADY_EXISTS,
  USER_NOT_FOUND_ERROR,
  LOGIN_FAILED_ERROR,
} from "../constants/index.js";

export async function registerUser(name, email, password) {
  const db = await getDb();

  const existingUser = await db.collection("users").findOne({ email });
  if (existingUser) {
    throw new Error(USER_ALREADY_EXISTS);
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await db
    .collection("users")
    .insertOne({ email, password: hashedPassword, name });
  return newUser;
}

export async function loginUser(email, password) {
  const db = await getDb();

  const user = await db.collection("users").findOne({ email });
  if (!user) {
    throw new Error(LOGIN_FAILED_ERROR);
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error(LOGIN_FAILED_ERROR);
  }
  return user;
}

export async function getUserById(id) {
  const db = await getDb();
  const user = await db.collection("users").findOne({ _id: new ObjectId(id) });
  if (!user) {
    throw new Error(USER_NOT_FOUND_ERROR);
  }
  return user;
}

export async function getUserByEmail(email) {
  const db = await getDb();
  const user = await db.collection("users").findOne({ email });
  if (!user) {
    throw new Error(USER_NOT_FOUND_ERROR);
  }
  return user;
}