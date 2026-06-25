import { getDb } from "./connection.js";
import { ObjectId } from "mongodb";
import {
  TRIP_ALREADY_EXISTS,
  TRIP_NOT_FOUND_ERROR,
} from "../constants/index.js";

export async function createTrip(name, userId, destination) {
  const db = await getDb();

  const existingTrip = await db.collection("trips").findOne({
    name,
    createdBy: new ObjectId(userId),
  });

  if (existingTrip) {
    throw new Error(TRIP_ALREADY_EXISTS);
  }

  const result = await db.collection("trips").insertOne({
    name,
    createdBy: new ObjectId(userId),
    members: [new ObjectId(userId)],
    status: true,
    createdAt: new Date(),
    destination: destination
  });

  return result;
}

export async function getTripById(id) {
  const db = await getDb();

  const trip = await db.collection("trips").findOne({
    _id: new ObjectId(id),
  });

  if (!trip) {
    throw new Error(TRIP_NOT_FOUND_ERROR);
  }

  return trip;
}

export async function getTripWithMembers(id) {
  const db = await getDb();

  const trip = await db.collection("trips").findOne({ _id: new ObjectId(id) });

  if (!trip) throw new Error(TRIP_NOT_FOUND_ERROR);

  const memberIds = trip.members.map((m) => new ObjectId(m.toString()));
  const users = await db
    .collection("users")
    .find({ _id: { $in: memberIds } })
    .toArray();

  trip.members = users.map((u) => ({
    _id: u._id,
    name: u.name,
    email: u.email,
  }));

  return trip;
}

export async function getTripByUser(userId) {
  const db = await getDb();

  const trips = await db
    .collection("trips")
    .find({
      members: new ObjectId(userId),
    })
    .toArray();

  return trips;
}

export async function getTripsByDestination(destination) {
  const db = await getDb();

  //Búsqueda sin distinguir mayúsculas/minúsculas

  const trips = await db
    .collection("trips")
    .find({
      destination: {
        $regex: `^${destination}$`,
        $options: "i",
      },
    })
    .toArray();

  return trips;
}

export async function closeTrip(id) {
  const db = await getDb();

  const result = await db.collection("trips").updateOne(
    { _id: new ObjectId(id) },
    { $set: { status: false } },
  );

  if (result.matchedCount === 0) {
    throw new Error(TRIP_NOT_FOUND_ERROR);
  }

  return result;
}

export async function addMemberToTrip(userId, tripId) {
  const db = await getDb();

  await db.collection("trips").updateOne(
    { _id: new ObjectId(tripId) },
    { $addToSet: { members: new ObjectId(userId) } },
  );
}
