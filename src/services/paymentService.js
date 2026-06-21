import { createPayment, getPaymentsByTrip } from "../data/paymentData.js";
import { getExpensesByTrip } from "../data/expenseData.js";
import { PAYMENT_INVALID_AMOUNT } from "../constants/index.js";

export async function addPayment(tripId, from, to, amount) {
  if (!amount || amount <= 0) throw new Error(PAYMENT_INVALID_AMOUNT);
  return await createPayment(tripId, from, to, amount);
}

export async function getPayments(tripId) {
  return await getPaymentsByTrip(tripId);
}

export async function calculateDebts(tripId) {
  const [expenses, payments] = await Promise.all([
    getExpensesByTrip(tripId),
    getPaymentsByTrip(tripId),
  ]);

  const netDebts = {};

  for (const expense of expenses) {
    const creditor = expense.paidBy.toString();
    for (const split of expense.splits) {
      const debtor = split.userId.toString();
      if (debtor === creditor) continue;
      const key = `${debtor}->${creditor}`;
      netDebts[key] = (netDebts[key] || 0) + split.amount;
    }
  }

  for (const payment of payments) {
    const from = payment.from.toString();
    const to = payment.to.toString();
    const key = `${from}->${to}`;
    const reverseKey = `${to}->${from}`;

    if (netDebts[key]) {
      netDebts[key] -= payment.amount;
      if (netDebts[key] < 0) {
        netDebts[reverseKey] = (netDebts[reverseKey] || 0) + Math.abs(netDebts[key]);
        delete netDebts[key];
      } else if (netDebts[key] === 0) {
        delete netDebts[key];
      }
    }
  }

  const debts = Object.entries(netDebts).map(([key, amount]) => {
    const [debtorId, creditorId] = key.split("->");
    return { debtorId, creditorId, amount: Math.round(amount * 100) / 100 };
  });

  const totalDebt =
    Math.round(debts.reduce((sum, d) => sum + d.amount, 0) * 100) / 100;

  return { debts, totalDebt };
}