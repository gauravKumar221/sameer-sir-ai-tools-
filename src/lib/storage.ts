import fs from 'fs';
import path from 'path';

// Secure directory for storing course PDFs - strictly outside of /public
const STORAGE_DIR = path.join(process.cwd(), 'storage', 'secure_pdfs');

export function ensureStorageDir() {
  if (!fs.existsSync(STORAGE_DIR)) {
    fs.mkdirSync(STORAGE_DIR, { recursive: true });
  }
}

export async function savePdfFile(buffer: Buffer, fileName: string): Promise<{ fileKey: string; fileSize: number }> {
  ensureStorageDir();
  const safeName = `${Date.now()}_${fileName.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
  const filePath = path.join(STORAGE_DIR, safeName);
  
  await fs.promises.writeFile(filePath, buffer);
  const stats = await fs.promises.stat(filePath);
  
  return {
    fileKey: safeName,
    fileSize: stats.size,
  };
}

export async function getPdfBuffer(fileKey: string): Promise<Buffer | null> {
  ensureStorageDir();
  // Prevent path traversal attacks
  const safeKey = path.basename(fileKey);
  const filePath = path.join(STORAGE_DIR, safeKey);
  
  if (!fs.existsSync(filePath)) {
    return null;
  }
  
  return fs.promises.readFile(filePath);
}

export async function deletePdfFile(fileKey: string): Promise<boolean> {
  try {
    ensureStorageDir();
    const safeKey = path.basename(fileKey);
    const filePath = path.join(STORAGE_DIR, safeKey);
    if (fs.existsSync(filePath)) {
      await fs.promises.unlink(filePath);
      return true;
    }
  } catch (err) {
    console.error('Error deleting PDF file:', err);
  }
  return false;
}
