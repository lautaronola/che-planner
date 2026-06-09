import express from "express";
import multer from "multer";
import { analyzeInvoiceController } from "../controllers/invoiceController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { ALLOWED_TYPES, MAX_SIZE_INVOICE_MB } from "../constants/index.js";

const invoiceRouter = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_SIZE_INVOICE_MB * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (ALLOWED_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(INVOICE_FORMAT_NOT_SUPPORTED_ERROR));
    }
  },
});

invoiceRouter.post(
  "/analyze",
  authMiddleware,
  (req, res, next) => {
    upload.single("invoice")(req, res, (err) => {
      if (err) return res.status(400).json({ message: err.message });
      next();
    });
  },
  analyzeInvoiceController,
);

export default invoiceRouter;
