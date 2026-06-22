import {
  createExpense,
  getExpensesByTrip,
  getExpenseById,
} from "../data/expenseData.js";
import { getTripById } from "../data/tripData.js";
import {
  EXPENSE_INVALID_AMOUNT,
  EXPENSE_NOT_FOUND,
} from "../constants/index.js";

export async function addExpense(
  tripId,
  description,
  totalAmount,
  paidBy,
  splitBetween,
  receiptImageUrl,
  items,
) {
  if (!totalAmount || totalAmount <= 0) throw new Error(EXPENSE_INVALID_AMOUNT);

  let participants = splitBetween;
  if (!participants || participants.length === 0) {
    const trip = await getTripById(tripId);
    participants = trip.members.map((m) => m.toString());
  }

  const share = Math.round((totalAmount / participants.length) * 100) / 100;
  const splits = participants.map((userId) => ({ userId, amount: share }));

  return await createExpense(
    tripId,
    description,
    totalAmount,
    paidBy,
    splits,
    receiptImageUrl,
    items,
  );
}

export async function getExpenses(tripId) {
  return await getExpensesByTrip(tripId);
}

export async function getExpenseDetail(expenseId) {
  const expense = await getExpenseById(expenseId);
  if (!expense) throw new Error(EXPENSE_NOT_FOUND);
  return expense;
}
