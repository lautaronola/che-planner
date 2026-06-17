import {
  addExpense,
  getExpenses,
  getExpenseDetail,
} from "../services/expenseService.js";

export async function addExpenseController(req, res) {
  const {
    tripId,
    description,
    totalAmount,
    paidBy,
    splitBetween,
    receiptImageUrl,
    items,
  } = req.body;
  try {
    const expense = await addExpense(
      tripId,
      description,
      totalAmount,
      paidBy,
      splitBetween,
      receiptImageUrl,
      items,
    );
    res.status(201).json(expense);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

export async function getTripExpensesController(req, res) {
  const { tripId } = req.params;
  try {
    const expenses = await getExpenses(tripId);
    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function getExpenseDetailController(req, res) {
  const { expenseId } = req.params;
  try {
    const expense = await getExpenseDetail(expenseId);
    res.status(200).json(expense);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
}
