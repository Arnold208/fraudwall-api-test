import * as crypto from "crypto";

import { randomBytes } from "crypto";

const algorithm = "aes-256-cbc";
import * as dotenv from "dotenv";
dotenv.config();

function isEncrypted(value: string): boolean {
  return typeof value === "string" && value.includes(":") && value.length > 32;
}
// Load the secret key
const secretKey =
  process.env.ENCRYPTION_SECRET_KEY;
if (secretKey.length !== 32) {
  throw new Error("The secret key must be 32 bytes long");
}

// Encrypt function
export function encryptText(text: string): string {
  try {
    // Validate the input
    if (typeof text !== "string") {
      throw new Error("Input must be a string");
    }

    // Generate a new random IV for each encryption
    const iv = randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, Buffer.from(secretKey), iv);
    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");

    return `${iv.toString("hex")}:${encrypted}`;
  } catch (error: any) {
    throw new Error(`Encryption error: ${error.message}`);
  }
}

// Decrypt function
export function decryptText(hash: string): string {
  try {
    // Split the hash into the iv and the encrypted text
    const [ivHex, encryptedText] = hash.split(":");

    if (!ivHex || !encryptedText) {
      return hash; // Return original value if it doesn't match expected format
    }
    // Check if the hash is valid
    if (!ivHex || !encryptedText) {
      throw new Error("Invalid hash format");
    }

    // Create decipher with the algorithm, secretKey, and iv
    const iv = Buffer.from(ivHex, "hex");
    const decipher = crypto.createDecipheriv(
      algorithm,
      Buffer.from(secretKey),
      iv
    );

    // Decrypt the text
    let decrypted = decipher.update(encryptedText, "hex", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
  } catch (error) {
    throw new Error("Decryption error");
  }
}

// Encryption function for file
export function encryptFileContent(fileContent: Buffer): string {
  try {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(
      "aes-256-cbc",
      process.env.ENCRYPTION_SECRET_KEY,
      iv
    );

    let encrypted = cipher.update(fileContent);
    encrypted = Buffer.concat([encrypted, cipher.final()]);

    return `${iv.toString("hex")}:${encrypted.toString("hex")}`;
  } catch (error: any) {
    throw new Error(`File encryption failed: ${error.message}`);
  }
}

// Decryption function for file 
export function decryptFileContent(encryptedData: string): Buffer {
  try {
    const [ivHex, encryptedHex] = encryptedData.split(":");
    if (!ivHex || !encryptedHex) {
      throw new Error("Invalid encrypted data format");
    }

    const iv = Buffer.from(ivHex, "hex");
    const encrypted = Buffer.from(encryptedHex, "hex");

    const decipher = crypto.createDecipheriv(
      "aes-256-cbc",
      process.env.ENCRYPTION_SECRET_KEY,
      iv
    );

    let decrypted = decipher.update(encrypted);
    decrypted = Buffer.concat([decrypted, decipher.final()]);

    return decrypted;
  } catch (error: any) {
    throw new Error(`File decryption failed: ${error.message}`);
  }
}
