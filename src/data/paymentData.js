import { getDb } from "./connection.js";
import { ObjectId } from "mongodb";

export async function createPayment(tripId, from, to, amount) {
  const db = await getDb();
  const newPayment = {
    tripId: new ObjectId(tripId),
    from: new ObjectId(from),
    to: new ObjectId(to),
    amount,
    date: new Date(),
  };
  const result = await db.collection("payments").insertOne(newPayment);
  return { _id: result.insertedId, ...newPayment };
}

export async function getPaymentsByTrip(tripId) {
  const db = await getDb();
  return db
    .collection("payments")
    .find({ tripId: new ObjectId(tripId) })
    .toArray();
}
