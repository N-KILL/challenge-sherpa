import { expect, Page } from "playwright/test";
import { TestLogger } from "../logger";

// Verify the locked manuscript
export async function verifyLockedManuscript(page: Page, expectedCentury: string, logger: TestLogger, hasDocumentation: boolean = false) {
    logger.info(`Verifying locked manuscript: Siglo ${expectedCentury}`);
    
    // Find any manuscript with the expected century
    const manuscript = page.locator(`span:has-text("Siglo ${expectedCentury}")`).first();
    await expect(manuscript).toBeVisible({ timeout: 10000 });
    
    if (hasDocumentation) {
      // Navigate to the parent container to find the input and button
      const manuscriptContainer = manuscript.locator('xpath=../../..');
      
      // Verify "Ver Documentación" button is present and click it
      const documentationButton = manuscriptContainer.locator('button:has-text("Ver Documentación")');
      await expect(documentationButton).toBeVisible();
      await documentationButton.click();

      // Wait for the popup to appear
      await page.waitForTimeout(1000);
      
      // Close the popup modal
      const closeButton = page.locator('button[aria-label="Cerrar modal"]');
      await expect(closeButton).toBeVisible();
      await closeButton.click();
    }

    // Navigate to the parent container to find the input and button
    const manuscriptContainer = manuscript.locator('xpath=../../..');
    
    // Verify it has an input field for the code
    const codeInput = manuscriptContainer.locator('input[placeholder="Ingresá el código"]');
    await expect(codeInput).toBeVisible();
    
    // Verify "Desbloquear" button is present
    const unlockButton = manuscriptContainer.locator('button:has-text("Desbloquear")');
    await expect(unlockButton).toBeVisible();
    
    // Verify the help text is present
    const helpText = manuscriptContainer.locator('p:has-text("Necesitás el código del manuscrito anterior")');
    await expect(helpText).toBeVisible();
    
    logger.success(`Locked manuscript from Siglo ${expectedCentury} verified successfully`);
  }
  
  