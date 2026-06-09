import { Readable } from "stream";
import { documentClient, blobServiceClient } from "../data/azureClients.js";

const CONTAINER_NAME = process.env.BLOB_CONTAINER_NAME || "facturas";

export async function processInvoice(buffer, originalname, mimetype) {
  const [blobUrl, invoice] = await Promise.all([
    uploadToBlob(buffer, originalname, mimetype),
    analyzeWithOCR(buffer, mimetype),
  ]);
  return { blobUrl, invoice };
}

async function uploadToBlob(buffer, originalname, mimetype) {
  const containerClient = blobServiceClient.getContainerClient(CONTAINER_NAME);
  await containerClient.createIfNotExists();

  const blobName = `${Date.now()}-${originalname}`;
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);

  await blockBlobClient.uploadData(buffer, {
    blobHTTPHeaders: { blobContentType: mimetype },
  });

  return blockBlobClient.url;
}

async function analyzeWithOCR(buffer, mimetype) {
  const stream = bufferToStream(buffer);
  const poller = await documentClient.beginAnalyzeDocument(
    "prebuilt-invoice",
    stream,
    {
      contentType: mimetype,
    },
  );
  const { documents } = await poller.pollUntilDone();

  if (!documents || documents.length === 0) {
    throw new Error("No se pudo extraer información de la factura");
  }

  return simplifyInvoice(documents[0].fields);
}

function bufferToStream(buffer) {
  const readable = new Readable();
  readable.push(buffer);
  readable.push(null);
  return readable;
}

function simplifyInvoice(fields) {
  return {
    vendorName: fields.VendorName?.value ?? null,
    vendorAddress: fields.VendorAddress?.value?.streetAddress ?? null,
    customerName: fields.CustomerName?.value ?? null,
    invoiceId: fields.InvoiceId?.value ?? null,
    invoiceDate: fields.InvoiceDate?.value ?? null,
    dueDate: fields.DueDate?.value ?? null,
    subTotal: fields.SubTotal?.value?.amount ?? null,
    totalTax: fields.TotalTax?.value?.amount ?? null,
    invoiceTotal: fields.InvoiceTotal?.value?.amount ?? null,
    amountDue: fields.AmountDue?.value?.amount ?? null,
    currency: fields.InvoiceTotal?.value?.currencySymbol ?? null,
    items:
      fields.Items?.values?.map((item) => ({
        description: item.value?.Description?.value ?? null,
        quantity: item.value?.Quantity?.value ?? null,
        unit: item.value?.Unit?.value ?? null,
        unitPrice: item.value?.UnitPrice?.value?.amount ?? null,
        amount: item.value?.Amount?.value?.amount ?? null,
      })) ?? [],
  };
}
