import { Page } from "@playwright/test";

// Get the book title from the page
export async function getBookTitleFromPage(page: Page, expectedCentury: string): Promise<string> {
    // Find any manuscript with the expected century
    const manuscript = page.locator(`span:has-text("Siglo ${expectedCentury}")`).first();
    await manuscript.waitFor({ state: 'visible', timeout: 10000 });
    
    // Navigate to the parent container to find the book title
    const manuscriptContainer = manuscript.locator('xpath=../../..');
    
    // Find the book title (h3 element with the book name)
    const bookTitleElement = manuscriptContainer.locator('h3.text-lg.font-medium.text-sherpa-text');
    await bookTitleElement.waitFor({ state: 'visible' });
    
    const bookTitle = await bookTitleElement.textContent();
    return bookTitle?.trim() || `Manuscrito del Siglo ${expectedCentury}`;
  }