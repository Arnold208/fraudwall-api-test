import {
  BlobSASPermissions,
  generateBlobSASQueryParameters,
  StorageSharedKeyCredential,
  BlobServiceClient,
} from "@azure/storage-blob";
import * as dotenv from "dotenv";

dotenv.config(); // Load environment variables

export function createBlobSasUrl(
  fileUrl: string,
  expiresInMinutes = 60
): string {
  try {
    // Retrieve the connection string from environment variables
    const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;

    if (!connectionString) {
      throw new Error("Azure Storage connection string is missing.");
    }

    // Create a BlobServiceClient using the connection string
    const blobServiceClient =
      BlobServiceClient.fromConnectionString(connectionString);

    // Extract containerName and blobName from the fileUrl
    const url = new URL(fileUrl);
    const [containerName, ...blobNameParts] = url.pathname.split("/").slice(1); // Splitting and ignoring the first slash
    const blobName = blobNameParts.join("/"); // Join the remaining parts as blobName

    if (!containerName || !blobName) {
      throw new Error(
        "Invalid file URL format. Container or blob name is missing."
      );
    }

    // Parse permissions and set expiry time
    const blobSasPermissions = BlobSASPermissions.parse("r"); // Read permission
    const expiryDate = new Date();
    expiryDate.setMinutes(expiryDate.getMinutes() + expiresInMinutes);

    // Generate the SAS token
    const sasToken = generateBlobSASQueryParameters(
      {
        containerName,
        blobName,
        permissions: blobSasPermissions,
        expiresOn: expiryDate,
      },
      blobServiceClient.credential as StorageSharedKeyCredential
    ).toString();

    // Concatenate the SAS token to the original URL
    return `${fileUrl}?${sasToken}`;
  } catch (error: any) {
    throw new Error("Failed to generate SAS URL: " + error.message);
  }
}
