import { Injectable, Logger } from "@nestjs/common";
import {
  BlobServiceClient,
  StorageSharedKeyCredential,
  BlobSASPermissions,
  generateBlobSASQueryParameters,
} from "@azure/storage-blob";
import { v4 as uuidv4 } from "uuid";
import * as dotenv from "dotenv";

dotenv.config();

@Injectable()
export class AzureBlobService {
  private readonly logger = new Logger(AzureBlobService.name);
  private blobServiceClient: BlobServiceClient;

  constructor() {
    const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;

    if (!connectionString) {
      throw new Error("Azure Storage connection string is missing.");
    }

    this.blobServiceClient =
      BlobServiceClient.fromConnectionString(connectionString);
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    try {
      const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME;
      const containerClient =
        this.blobServiceClient.getContainerClient(containerName);
      const fileName = `${uuidv4()}-${file.originalname}`;
      const blockBlobClient = containerClient.getBlockBlobClient(fileName);

      // Convert file.buffer to a Readable stream to be used by the SDK
      const stream =
        file.buffer instanceof Buffer ? file.buffer : Buffer.from(file.buffer);

      // Upload the file to Azure Blob Storage using the SDK
      await blockBlobClient.uploadData(stream, {
        blobHTTPHeaders: { blobContentType: file.mimetype },
      });

      this.logger.log(
        `File "${fileName}" uploaded successfully to Azure Blob Storage`
      );

      return fileName;
    } catch (error) {
      this.logger.error("Error uploading file to Azure Blob Storage", error);
      throw error;
    }
  }

  async uploadFiles(files: Express.Multer.File[]): Promise<string[]> {
    try {
      const uploadedFileUrls: string[] = [];

      for (const file of files) {
        const uploadedFileName = await this.uploadFile(file);
        const publicUrl = this.getPublicUrl(uploadedFileName);
        uploadedFileUrls.push(publicUrl);
      }

      this.logger.log("Files uploaded successfully to Azure Blob Storage");

      return uploadedFileUrls;
    } catch (error) {
      this.logger.error("Error uploading files to Azure Blob Storage", error);
      throw error;
    }
  }

  public getPublicUrl(fileName: string): string {
    try {
      const publicUrl = `${process.env.AZURE_STORAGE_PUBLIC_URL}/${fileName}`;

      this.logger.log(`Generated public URL for file "${fileName}"`);

      return publicUrl;
    } catch (error) {
      this.logger.error("Error generating public URL for file", error);
      throw error;
    }
  }


  public sayHello(){
    return "Hello world";
  }


  public generateBlobSasUrl(fileUrl: string, expiresInMinutes = 60): string {
    try {
      // Extract containerName and blobName from the fileUrl
      const url = new URL(fileUrl);
      const [containerName, ...blobNameParts] = url.pathname
        .split("/")
        .slice(1); // Splitting and ignoring the first slash
      const blobName = blobNameParts.join("/"); // Join the remaining parts as blobName

      if (!containerName || !blobName) {
        throw new Error(
          "Invalid file URL format. Container or blob name is missing."
        );
      }

      const blobSasPermissions = BlobSASPermissions.parse("r"); // Read permission
      const expiryDate = new Date();
      expiryDate.setMinutes(expiryDate.getMinutes() + expiresInMinutes);

      const sasToken = generateBlobSASQueryParameters(
        {
          containerName,
          blobName,
          permissions: blobSasPermissions,
          expiresOn: expiryDate,
        },
        this.blobServiceClient.credential as StorageSharedKeyCredential
      ).toString();

      // Concatenate the SAS token to the original URL
      const sasUrl = `${fileUrl}?${sasToken}`;

      return sasUrl;
    } catch (error) {
      this.logger.error("Error generating SAS URL for blob", error);
      throw new Error("Failed to generate SAS URL");
    }
  }

  async deleteFile(fileName: string): Promise<void> {
    try {
      const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME;
      const containerClient =
        this.blobServiceClient.getContainerClient(containerName);
      const blockBlobClient = containerClient.getBlockBlobClient(fileName);

      await blockBlobClient.delete();

      this.logger.log(
        `File "${fileName}" deleted successfully from Azure Blob Storage`
      );
    } catch (error) {
      this.logger.error("Error deleting file from Azure Blob Storage", error);
      throw error;
    }
  }
}
