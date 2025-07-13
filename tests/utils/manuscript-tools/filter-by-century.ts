import { Page } from '@playwright/test';
import { TestLogger } from '../logger';

// Filter the manuscripts by the given century
export async function filterByCentury(page: Page, century: string, logger: TestLogger) {
  logger.info(`Filtering manuscripts by century: ${century}`);
  
  // Find and select the century filter dropdown
  const centuryFilter = page.locator('label:has-text("Filtrar por Siglo") + div select');
  await centuryFilter.waitFor({ state: 'visible', timeout: 10000 });
  
  // Select the specified century option from the dropdown
  await centuryFilter.selectOption(century);
  
  // Wait for the filter to be applied
  await page.waitForTimeout(2000);
  
  logger.success(`Century ${century} filter applied successfully`);
} 