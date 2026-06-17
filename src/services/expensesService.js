import {
  createExpense,
  getExpensesByTrip,
  getExpenseById,
} from "../data/expensesData.js";
import {
  EXPENSE_INVALID_AMOUNT,
  EXPENSE_INVALID_SPLIT,
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
  if (!splitBetween || splitBetween.length === 0)
    throw new Error(EXPENSE_INVALID_SPLIT);

  const share = Math.round((totalAmount / splitBetween.length) * 100) / 100;
  const splits = splitBetween.map((userId) => ({ userId, amount: share }));

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
