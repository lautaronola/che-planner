import {
  DocumentAnalysisClient,
  AzureKeyCredential,
} from "@azure/ai-form-recognizer";
import {
  BlobServiceClient,
  StorageSharedKeyCredential,
} from "@azure/storage-blob";

const ocrEndpoint = process.env["URL-OCR"];
const ocrKey = process.env["KEY-OCR"];
const blobServiceUrl = process.env["BLOB-SERVICES"];
const blobKey = process.env["KEY-BLOB"];

const accountName = new URL(blobServiceUrl).hostname.split(".")[0];

export const documentClient = new DocumentAnalysisClient(
  ocrEndpoint,
  new AzureKeyCredential(ocrKey),
);

export const blobServiceClient = new BlobServiceClient(
  blobServiceUrl,
  new StorageSharedKeyCredential(accountName, blobKey),
);
