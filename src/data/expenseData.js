import { getDb } from "./connection.js";
import { ObjectId } from "mongodb";

export async function createExpense(
  tripId,
  description,
  totalAmount,
  paidBy,
  splits,
  receiptImageUrl,
  items,
) {
  const db = await getDb();

  const newExpense = {
    tripId: new ObjectId(tripId),
    description,
    totalAmount,
    date: new Date(),
    paidBy: new ObjectId(paidBy),
    splits: splits.map((s) => ({
      userId: new ObjectId(s.userId),
      amount: s.amount,
    })),
    receiptImageUrl: receiptImageUrl || null,
    items: items || [],
    createdAt: new Date(),
  };

  const result = await db.collection("expenses").insertOne(newExpense);

  return { _id: result.insertedId, ...newExpense };
}

export async function getExpensesByTrip(tripId) {
  const db = await getDb();
  return db
    .collection("expenses")
    .find({ tripId: new ObjectId(tripId) })
    .toArray();
}

export async function getExpenseById(expenseId) {
  const db = await getDb();
  return db.collection("expenses").findOne({ _id: new ObjectId(expenseId) });
}
