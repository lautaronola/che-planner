import { createPayment, getPaymentsByTrip } from "../data/paymentData.js";
import { getExpensesByTrip } from "../data/expenseData.js";
import { PAYMENT_INVALID_AMOUNT, PAYMENT_NO_DEBT } from "../constants/index.js";

export async function addPayment(tripId, from, amount, description, splitBetween) {
  if (!amount || amount <= 0) throw new Error(PAYMENT_INVALID_AMOUNT);

  const { debts } = await calculateDebts(tripId);
  const fromStr = from.toString();

  for (const to of splitBetween) {
    const toStr = to.toString();
    const hasDebt = debts.some(
      (d) =>
        (d.debtorId === fromStr && d.creditorId === toStr) ||
        (d.debtorId === toStr && d.creditorId === fromStr),
    );
    if (!hasDebt) throw new Error(PAYMENT_NO_DEBT);
  }

  const share = Math.round((amount / splitBetween.length) * 100) / 100;

  const payments = await Promise.all(
    splitBetween.map((to) => createPayment(tripId, from, to, share, description)),
  );

  return payments;
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

    if (key in netDebts) {
      netDebts[key] -= payment.amount;
      if (netDebts[key] < 0) {
        netDebts[reverseKey] = (netDebts[reverseKey] || 0) + Math.abs(netDebts[key]);
        delete netDebts[key];
      } else if (netDebts[key] === 0) {
        delete netDebts[key];
      }
    } else if (reverseKey in netDebts) {
      netDebts[reverseKey] -= payment.amount;
      if (netDebts[reverseKey] < 0) {
        netDebts[key] = Math.abs(netDebts[reverseKey]);
        delete netDebts[reverseKey];
      } else if (netDebts[reverseKey] === 0) {
        delete netDebts[reverseKey];
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