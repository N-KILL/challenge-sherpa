import { expect, Page } from '@playwright/test';
import { getBookTitleFromPage } from './get-title';
import { decodePassword } from './decode-password';
import { TestLogger } from '../logger';
import axios from 'axios';

// Unlock the manuscript with the given code
export async function unlockManuscriptWithCode(page: Page, expectedCentury: string, accessCode: string, logger: TestLogger, usedApi: boolean = false) {
  logger.info(`Unlocking manuscript from Siglo ${expectedCentury} with code: ${accessCode}`);
  
  // Find any manuscript with the expected century
  const manuscript = page.locator(`span:has-text("Siglo ${expectedCentury}")`).first();
  await manuscript.waitFor({ state: 'visible', timeout: 10000 });
  
  // Navigate to the parent container to find the input and button
  const manuscriptContainer = manuscript.locator('xpath=../../..');
  
  // Find the input field for the code
  const codeInput = manuscriptContainer.locator('input[placeholder="Ingresá el código"]');
  await codeInput.waitFor({ state: 'visible' });
  await codeInput.clear();
  await codeInput.fill(accessCode);
  
  // Trigger input event to ensure the form validation runs
  await codeInput.dispatchEvent('input');
  await codeInput.dispatchEvent('change');
  
  // Wait a bit for validation to complete
  await page.waitForTimeout(1000);

  // Find the unlock button
  const unlockButton = manuscriptContainer.locator('button:has-text("Desbloquear")');
  await unlockButton.waitFor({ state: 'visible' });
  
  // Wait for the button to become enabled (with longer timeout)
  await expect(unlockButton).toBeEnabled({ timeout: 10000 });
  
  // Click the unlock button
  logger.info('Clicking unlock button...');
  await unlockButton.click();
  
  // Wait for the unlock process to complete
  await page.waitForTimeout(3000);

  if (usedApi) {
    
    // Close the "¡Manuscrito Desbloqueado!" popup
    const unlockCloseButton = page.locator('button[aria-label="Cerrar modal"]');
    await expect(unlockCloseButton).toBeVisible();
    await unlockCloseButton.click();
    await page.waitForTimeout(1000);
  }
  
  
  // Verify that the manuscript is now unlocked
  const unlockedStatus = manuscriptContainer.locator('span:has-text("Desbloqueado")');
  await unlockedStatus.waitFor({ state: 'visible', timeout: 2000 });
  
  // Verify "Descargar PDF" button is now present
  const downloadButton = manuscriptContainer.locator('button:has-text("Descargar PDF")');
  await downloadButton.waitFor({ state: 'visible' });
  
  logger.success(`Manuscript from Siglo ${expectedCentury} verified successfully`);
}

// Unlock the manuscript with the given API code
export async function unlockManuscriptWithAPI(page: Page, expectedCentury: string, unlockCode: string, logger: TestLogger) {
  logger.info(`Getting unlock code from API for Siglo ${expectedCentury} with unlock code: ${unlockCode}`);
  
  try {
    // Automatically detect the book title from the page
    const bookTitle = await getBookTitleFromPage(page, expectedCentury);
    logger.info(`Detected book title: ${bookTitle}`);
    
    const codeFromAPI = await getUnlockCodeFromAPI(bookTitle, unlockCode, logger);
    logger.info(`Password obtained from API: ${codeFromAPI}`);
    
    // Use the API code to unlock the manuscript
    logger.info(`Unlocking manuscript with code: ${codeFromAPI}`);
    await unlockManuscriptWithCode(page, expectedCentury, codeFromAPI, logger, true);
  } catch (error) {
    logger.error(`Failed to get unlock code from API: ${error}`);
    throw error;
  }
}

// Get the unlock code from the API
async function getUnlockCodeFromAPI(bookTitle: string, unlockCode: string, logger: TestLogger): Promise<string> {
  logger.info(`Getting unlock code from API for book title: ${bookTitle} with unlock code: ${unlockCode}`);
  
  try {
    const response = await axios.get(`https://backend-production-9d875.up.railway.app/api/cipher/challenge`, {
      params: {
        bookTitle: bookTitle,
        unlockCode: unlockCode
      }
    });
    
    logger.info(`API response status: ${response.status}`);
    const data = response.data;
    logger.info(`Data received from API`);

    logger.info(`Decoding password...`);
    const password = decodePassword(data.challenge);
    logger.info(`Password decoded: ${password}`);

    return password;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`API request failed: ${error.response?.status} ${error.response?.statusText}`);
    }
    throw error;
  }
}

