const URI_MONGO_MISSING = "URI_MONGO is not defined";
const DATABASE_NOT_CONNECTED = "Database not connected";
const USER_ALREADY_EXISTS = "User already exists";
const USER_NOT_FOUND_ERROR = "User not found";
const LOGIN_FAILED_ERROR = "The email or password is incorrect";
const USER_REGISTER_FAILED_ERROR = "User registration failed";
const UNAUTHORIZED_ERROR = "Unauthorized";
const INVOICE_PROCESS_FAILED_ERROR = "Invoice processing failed";
const INVOICE_NOT_RECEIVED_ERROR = "Invoice not received";
const INVOICE_FORMAT_NOT_SUPPORTED_ERROR = "Invoice format not supported";

const ALLOWED_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/tiff",
];
const MAX_SIZE_INVOICE_MB = 10;

export {
  URI_MONGO_MISSING,
  DATABASE_NOT_CONNECTED,
  USER_ALREADY_EXISTS,
  LOGIN_FAILED_ERROR,
  USER_NOT_FOUND_ERROR,
  USER_REGISTER_FAILED_ERROR,
  UNAUTHORIZED_ERROR,
  INVOICE_PROCESS_FAILED_ERROR,
  INVOICE_NOT_RECEIVED_ERROR,
  ALLOWED_TYPES,
  MAX_SIZE_INVOICE_MB,
  INVOICE_FORMAT_NOT_SUPPORTED_ERROR,
};
