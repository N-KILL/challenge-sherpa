import { Download } from "playwright/test";
import fs from "fs";
import pdfParse from "pdf-parse";
import { TestLogger } from "../logger";

// Read the PDF and extract the access code
export async function readPDFAndExtractCode(
  download: Download,
  expectedCentury: string,
  logger: TestLogger
): Promise<string> {
  logger.info(`Reading PDF for manuscript: Siglo ${expectedCentury}`);

  // Get the download path
  const downloadPath = await download.path();

  // Check if the download path is valid
  if (!downloadPath) {
    throw new Error("Download failed - no file path received");
  }

  logger.info(`PDF downloaded to: ${downloadPath}`);

  // Read the PDF file content
  const pdfBuffer = fs.readFileSync(downloadPath);

  // Try to parse with pdf-parse first
  try {
    // Try to parse with pdf-parse first
    const data = await pdfParse(pdfBuffer);
    
    // Simply search for "acceso:" and capture the value after it
    const codeMatch = data.text.match(/acceso:\s*([A-Z0-9]+)/i);
    
    // If the code is found, return it
    if (codeMatch) {
      const accessCode = codeMatch[1];
      logger.success(`Access code extracted: ${accessCode}`);
      
      // Clean up the downloaded file
      fs.unlinkSync(downloadPath);
      logger.info("Downloaded PDF file cleaned up");
      
      return accessCode;
    }
    
    // If no match found in parsed text, try alternative approaches
    logger.warn("Access code not found in parsed PDF text, trying alternative methods...");
    
  } catch (err) {
    logger.warn(`PDF parsing failed: ${err.message}, trying alternative methods...`);
  }

  // Fallback: Try to read as text file (some PDFs can be read as text)
  try {
    // Read the PDF file content as text
    const textContent = fs.readFileSync(downloadPath, 'utf8');
    const codeMatch = textContent.match(/acceso:\s*([A-Z0-9]+)/i);
    
    // If the code is found, return it
    if (codeMatch) {
      const accessCode = codeMatch[1];
      logger.success(`Access code extracted (fallback method): ${accessCode}`);
      
      fs.unlinkSync(downloadPath);
      logger.info("Downloaded PDF file cleaned up");
      
      return accessCode;
    }
  } catch (err) {
    logger.warn(`Text fallback failed: ${err.message}`);
  }

  // Final fallback: Try parsing again without options
  try {
    const data = await pdfParse(pdfBuffer);
    const codeMatch = data.text.match(/acceso:\s*([A-Z0-9]+)/i);
    
    // If the code is found, return it
    if (codeMatch) {
      const accessCode = codeMatch[1];
      logger.success(`Access code extracted (with options): ${accessCode}`);
      
      fs.unlinkSync(downloadPath);
      logger.info("Downloaded PDF file cleaned up");
      
      return accessCode;
    }
  } catch (err) {
    logger.warn(`PDF parsing with options failed: ${err.message}`);
  }

  // If all methods fail, try to extract from the raw buffer
  try {
    const bufferString = pdfBuffer.toString('utf8');
    const codeMatch = bufferString.match(/acceso:\s*([A-Z0-9]+)/i);
    
    if (codeMatch) {
      const accessCode = codeMatch[1];
      logger.success(`Access code extracted (raw buffer): ${accessCode}`);
      
      fs.unlinkSync(downloadPath);
      logger.info("Downloaded PDF file cleaned up");
      
      return accessCode;
    }
  } catch (err) {
    logger.warn(`Raw buffer extraction failed: ${err.message}`);
  }

  // Clean up the file before throwing error
  try {
    fs.unlinkSync(downloadPath);
    logger.info("Downloaded PDF file cleaned up");
  } catch (err) {
    logger.warn(`Failed to clean up file: ${err.message}`);
  }

  throw new Error("Access code not found in PDF content after trying all parsing methods");
}

