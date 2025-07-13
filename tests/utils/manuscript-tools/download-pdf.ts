import { expect, Page } from "playwright/test";
import { readPDFAndExtractCode } from "./read-pdf-and-extract-code";
import { TestLogger } from "../logger";

// Download the manuscript PDF for the given century
export async function downloadManuscriptPDF(page: Page, expectedCentury: string, logger: TestLogger): Promise<string> {
    logger.info(`Downloading PDF for manuscript: Siglo ${expectedCentury}`);
    
    const maxRetries = 5;
    let lastError: Error | null = null;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        logger.info(`Attempt ${attempt}/${maxRetries} to download PDF`);
        try {
            // Find any manuscript with the expected century
            const manuscript = page.locator(`span:has-text("Siglo ${expectedCentury}")`).first();
            await expect(manuscript).toBeVisible({ timeout: 10000 });
            
            // Navigate to the parent container to find the download button
            const manuscriptContainer = manuscript.locator('xpath=../../..');
            
            // Verify it shows "Desbloqueado" (only download if unlocked)
            const unlockedStatus = manuscriptContainer.locator('span:has-text("Desbloqueado")');
            await expect(unlockedStatus).toBeVisible();
            
            // Find and click the download button
            const downloadButton = manuscriptContainer.locator('button:has-text("Descargar PDF")');
            await expect(downloadButton).toBeVisible();
            
            // Click the download button
            logger.info('Clicking download PDF button...');
            await downloadButton.click();
            // Wait for download to complete with a timeout
            logger.info('Waiting for download to start...');
            const download = await page.waitForEvent('download');
            
            // Wait a moment to see if the error message appears
            await page.waitForTimeout(1000);
            
            // Check if the error message appears BEFORE waiting for download
            const errorMessage = page.locator('p.text-sm.text-red-400:has-text("Error al descargar el archivo")');
            const isErrorVisible = await errorMessage.isVisible();
            
            if (isErrorVisible) {
                throw new Error('Download error detected: "Error al descargar el archivo"');
            }
            
            
            // Read the PDF and extract the access code
            const accessCode = await readPDFAndExtractCode(download, expectedCentury, logger);
            
            logger.info(`PDF downloaded successfully on attempt ${attempt}`);
            return accessCode;
            
        } catch (error) {
            lastError = error as Error;
            logger.warn(`Attempt ${attempt} failed: ${error instanceof Error ? error.message : String(error)}`);
            
            if (attempt < maxRetries) {
                // Wait 15 seconds before retrying
                // Note: Some times the download throws 429 (Too Many Requests)
                logger.info(`Waiting 15 seconds before retry...`);
                await page.waitForTimeout(15000);
            }
        }
    }
    
    // If we get here, all retries failed
    logger.error(`All ${maxRetries} download attempts failed`);
    return '';  
}