import { processInvoice } from "../services/invoiceService.js";
import {
  INVOICE_PROCESS_FAILED_ERROR,
  INVOICE_NOT_RECEIVED_ERROR,
} from "../constants/index.js";

export async function analyzeInvoiceController(req, res) {
  if (!req.file) {
    return res.status(400).json({ error: INVOICE_NOT_RECEIVED_ERROR });
  }

  const { buffer, originalname, mimetype } = req.file;

  try {
    const result = await processInvoice(buffer, originalname, mimetype);
    res.json(result);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: INVOICE_PROCESS_FAILED_ERROR, error: error.message });
  }
}
