import {
  createPayment,
  getPaymentsByTrip,
  settlePayment,
} from "../data/paymentsData.js";
import {
  PAYMENT_INVALID_AMOUNT,
  PAYMENT_INVALID_SPLIT,
  PAYMENT_NOT_FOUND,
} from "../constants/index.js";

export async function addPayment(tripId, payerId, amount, description, splitBetween) {
    // se hacen validaciònes antres de pasar la info a data (o sea que hable con mongo)
  if (!amount || amount <= 0) throw new Error(PAYMENT_INVALID_AMOUNT);
  if (!splitBetween || splitBetween.length === 0) throw new Error(PAYMENT_INVALID_SPLIT);
  return await createPayment(tripId, payerId, amount, description, splitBetween);
}

export async function getPayments(tripId) {
  return await getPaymentsByTrip(tripId);
}

export async function calculateDebts(tripId) {
  const payments = await getPaymentsByTrip(tripId);
  const netDebts = {}; // "deudorId->acreedor": amount

  for (const payment of payments) {
    if (payment.settled) continue;

    const share = payment.amount / payment.splitBetween.length;
    // creditor: persona que puso la plata
    const creditor = payment.payerId.toString();

    for (const memberId of payment.splitBetween) {
      const debtor = memberId.toString();
      if (debtor === creditor) continue;

      const key = `${debtor}->${creditor}`;
      const reverseKey = `${creditor}->${debtor}`;

      if (netDebts[reverseKey]) {
        // existe deuda al revés, compensar
        netDebts[reverseKey] -= share;
        if (netDebts[reverseKey] < 0) {
            // la deuda al revés quedó negativa, se invierte
          netDebts[key] = Math.abs(netDebts[reverseKey]);
          delete netDebts[reverseKey];
        } else if (netDebts[reverseKey] === 0) {
            // quedaron a mano, eliminar
          delete netDebts[reverseKey];
        }
      } else {
        netDebts[key] = (netDebts[key] || 0) + share;
      }
    }
  }

  return Object.entries(netDebts).map(([key, amount]) => {
    const [debtorId, creditorId] = key.split("->");
    return { debtorId, creditorId, amount: Math.round(amount * 100) / 100 };
  });
}

export async function settle(paymentId) {
  const result = await settlePayment(paymentId);
  // existe el payment?
  if (result.matchedCount === 0) throw new Error(PAYMENT_NOT_FOUND);
  return result;
}