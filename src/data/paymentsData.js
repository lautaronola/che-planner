import { getDb } from "./connection.js";
import { ObjectId } from "mongodb";

export async function createPayment(tripId, payerId, amount, description, splitBetween) {
  const db = await getDb();
  const newPayment = {
    tripId: new ObjectId(tripId),
    payerId: new ObjectId(payerId),
    amount,
    description,
    splitBetween: splitBetween.map((id) => new ObjectId(id)),
    settled: false,
    createdAt: new Date(),
  };
  const result = await db.collection("payments").insertOne(newPayment);
  return { _id: result.insertedId, ...newPayment };
}

export async function getPaymentsByTrip(tripId) {
  const db = await getDb();
  return db.collection("payments").find({ tripId: new ObjectId(tripId) }).toArray();
}

// Marcar pago saldados

export async function settlePayment(paymentId) {
  const db = await getDb();
  return db.collection("payments").updateOne(
    { _id: new ObjectId(paymentId) },
    { $set: { settled: true } } 
  );
}