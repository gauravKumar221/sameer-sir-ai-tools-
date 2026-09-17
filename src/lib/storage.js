import fs from 'fs';
import path from 'path';

// =============================================
// Secure PDF Storage Helper
// =============================================
// This file handles saving, reading, and deleting PDF files
// on the server's file system.
//
// IMPORTANT: Files are stored in a PRIVATE folder (not in /public)
// so users can't download them directly by guessing the URL.
// Only authorized users can access PDFs through our API.

// Path to the secure storage folder (outside of /public for security)
const STORAGE_DIR = path.join(process.cwd(), 'storage', 'secure_pdfs');

/**
 * Make sure the storage folder exists.
 * If it doesn't exist, create it automatically.
 */
export function ensureStorageDir() {
  if (!fs.existsSync(STORAGE_DIR)) {
    fs.mkdirSync(STORAGE_DIR, { recursive: true }); // recursive = create parent folders too
  }
}

/**
 * Save a PDF file to secure storage.
 * 
 * @param {Buffer} buffer - The PDF file data (binary content)
 * @param {string} fileName - Original name of the file
 * @returns {Promise<Object>} - { fileKey: unique file name, fileSize: size in bytes }
 */
export async function savePdfFile(buffer, fileName) {
  ensureStorageDir();

  // Create a safe unique file name using timestamp + cleaned original name
  // This prevents duplicate names and removes special characters
  const safeName = `${Date.now()}_${fileName.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
  const filePath = path.join(STORAGE_DIR, safeName);

  // Write the file to disk
  await fs.promises.writeFile(filePath, buffer);

  // Get file info (like size)
  const stats = await fs.promises.stat(filePath);

  return {
    fileKey: safeName,      // Unique identifier to find this file later
    fileSize: stats.size,   // File size in bytes
  };
}

/**
 * Read a PDF file from secure storage and return its data.
 * 
 * @param {string} fileKey - The unique file identifier (from savePdfFile)
 * @returns {Promise<Buffer|null>} - File data as Buffer, or null if not found
 */
export async function getPdfBuffer(fileKey) {
  ensureStorageDir();

  // SECURITY: Use path.basename to prevent "path traversal" attacks
  // (stops hackers from using "../" to access other files on the server)
  const safeKey = path.basename(fileKey);
  const filePath = path.join(STORAGE_DIR, safeKey);

  // Check if the file exists
  if (!fs.existsSync(filePath)) {
    return null;
  }

  // Read and return the file data
  return fs.promises.readFile(filePath);
}

/**
 * Delete a PDF file from secure storage.
 * 
 * @param {string} fileKey - The unique file identifier
 * @returns {Promise<boolean>} - true if deleted successfully, false otherwise
 */
export async function deletePdfFile(fileKey) {
  try {
    ensureStorageDir();
    const safeKey = path.basename(fileKey);
    const filePath = path.join(STORAGE_DIR, safeKey);

    if (fs.existsSync(filePath)) {
      await fs.promises.unlink(filePath); // unlink = delete the file
      return true;
    }
  } catch (err) {
    console.error('Error deleting PDF file:', err);
  }
  return false;
}
