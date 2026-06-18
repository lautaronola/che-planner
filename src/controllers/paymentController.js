import {
  addPayment,
  getPayments,
  calculateDebts,
} from "../services/paymentService.js";

export async function addPaymentController(req, res) {
  const { tripId, amount, description, splitBetween } = req.body;
  const payerId = req.user.id;
  try {
    const payment = await addPayment(
      tripId,
      payerId,
      amount,
      description,
      splitBetween,
    );
    res.status(201).json(payment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

export async function getTripPaymentsController(req, res) {
  const { tripId } = req.params;
  try {
    const payments = await getPayments(tripId);
    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function calculateDebtsController(req, res) {
  const { tripId } = req.params;
  try {
    const debts = await calculateDebts(tripId);
    res.status(200).json(debts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
