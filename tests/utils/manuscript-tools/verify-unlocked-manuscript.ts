import { Page, expect } from "playwright/test";
import { TestLogger } from "../logger";

// Utility functions for manuscript verification
export async function verifyUnlockedManuscript(page: Page, expectedCentury: string, logger: TestLogger) {
  logger.info(`Verifying unlocked manuscript: Siglo ${expectedCentury}`);
  
  // Find any manuscript with the expected century
  const manuscript = page.locator(`span:has-text("Siglo ${expectedCentury}")`).first();
  await expect(manuscript).toBeVisible({ timeout: 10000 });
  
  // Navigate to the parent container to find the status and button
  const manuscriptContainer = manuscript.locator('xpath=../../..');
  
  // Verify it shows "Desbloqueado"
  const unlockedStatus = manuscriptContainer.locator('span:has-text("Desbloqueado")');
  await expect(unlockedStatus).toBeVisible();
  
  // Verify "Descargar PDF" button is present
  const downloadButton = manuscriptContainer.locator('button:has-text("Descargar PDF")');
  await expect(downloadButton).toBeVisible();
  
  logger.success(`Unlocked manuscript from Siglo ${expectedCentury} verified successfully`);
}