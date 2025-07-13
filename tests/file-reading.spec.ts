import { test, expect, Browser, BrowserContext, Page } from '@playwright/test';
import { verifyUnlockedManuscript, verifyLockedManuscript, filterByCentury, unlockManuscriptWithCode, unlockManuscriptWithAPI } from './utils/manuscript-tools';
import { createLogger } from './utils/logger';
import { downloadManuscriptPDF } from './utils/manuscript-tools/download-pdf';


// This is the description of the file reading tests
test.describe.serial('File Reading Tests', () => {
  let browser: Browser;
  let context: BrowserContext;
  let page: Page;
  let currentAccessCode: string = '';
  let shouldSkipRemainingTests: boolean = false;

  test.beforeAll(async ({ browser: testBrowser }) => {
    const logger = createLogger('File Reading Setup');
    
    logger.info('Starting login process...');
    
    // Create a new browser context and page with download handling
    browser = testBrowser;
    context = await browser.newContext({
      acceptDownloads: true
    });
    page = await context.newPage();
    
    // Navigate to login page
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    
    // Fill in login credentials
    logger.info('Filling login credentials...');
    await page.fill('#email, input[type="email"][placeholder="monje@sherpa.local"], .sherpa-input[type="email"]', 'monje@sherpa.local');
    await page.fill('#password, input[type="password"], .sherpa-input[type="password"]', 'cript@123');
    
    // Submit login form
    logger.info('Submitting login form...');
    await page.click('button[type="submit"], input[type="submit"], .login-button');
    
    // Wait for navigation after login
    await page.waitForLoadState('networkidle');
    
    // Wait additional time for redirect to complete
    await page.waitForTimeout(3000);
    
    // Verify login was successful
    const currentUrl = page.url();
    if (currentUrl.includes('/login')) {
      logger.error('Login failed - still on login page');
      throw new Error('Login failed');
    }
    
    logger.success('Login successful!');
    
    logger.success('Setup completed - ready for tests');
  });

  test.afterAll(async () => {
    await context?.close();
  });

  // Download the PDF for the manuscript from century XIV, and extract the access code
  test('Check century XIV', async () => {
    const logger = createLogger('Century XIV test');
    
    logger.info('Starting century XIV test');
    
    // Verify that we're on the portal page
    logger.info('Verifying URL...');
    await expect(page).toHaveURL(/.*\/portal$/);
    
    // Check if page title or main heading is present
    logger.info('Looking for page title...');
    const pageTitle = page.locator('h1.text-2xl.font-bold.text-sherpa-text');
    await expect(pageTitle).toBeVisible({ timeout: 10000 });
    
    // Filter manuscripts by century XIV
    await filterByCentury(page, 'XIV', logger);
    
    // Verify the unlocked manuscript from century XIV
    await verifyUnlockedManuscript(page, 'XIV', logger);
    
    // Download the PDF if the manuscript is unlocked and extract access code
    currentAccessCode = await downloadManuscriptPDF(page, 'XIV', logger);
    
    // Check if access code was obtained successfully
    if (!currentAccessCode || currentAccessCode.trim() === '') {
      logger.error('Could not obtain access code for century XIV. The following tests will be skipped.');
      shouldSkipRemainingTests = true;
    } else {
      logger.success(`Access code obtained successfully: ${currentAccessCode}`);
    }
  });

  // Unlocks the manuscript from century XV, download the PDF, and extract the access code
  test('Check century XV', async () => {
    // Skip this test if the previous test failed to get access code
    if (shouldSkipRemainingTests) {
      return; // Early return to skip the test
    }
    
    const logger = createLogger('Century XV test');
    logger.info('Starting century XV test');

    // Check if the access code is empty and skip the test if it is
    if (currentAccessCode.trim() === '') {
      logger.error('Could not obtain access code for century XV. The following tests will be skipped.');
      shouldSkipRemainingTests = true;
    }    
    
    // Verify that we're on the portal page
    logger.info('Verifying URL...');
    await expect(page).toHaveURL(/.*\/portal$/);
    
    // Check if page title or main heading is present
    logger.info('Looking for page title...');
    const pageTitle = page.locator('h1.text-2xl.font-bold.text-sherpa-text');
    await expect(pageTitle).toBeVisible({ timeout: 10000 });
    
    // Filter manuscripts by century XIV
    await filterByCentury(page, 'XV', logger);
    
    // Verify the unlocked manuscript from century XV
    await verifyLockedManuscript(page, 'XV', logger);

    // Unlock the manuscript with the access code
    await unlockManuscriptWithCode(page, 'XV', currentAccessCode, logger);

    // Verify the unlocked manuscript from century XV
    await verifyUnlockedManuscript(page, 'XV', logger);
    
    // Download the PDF if the manuscript is unlocked and extract access code
    currentAccessCode = await downloadManuscriptPDF(page, 'XV', logger);

    // Check if access code was obtained successfully
    if (!currentAccessCode || currentAccessCode.trim() === '') {
      logger.error('Could not obtain access code for century XV. The following tests will be skipped.');
      shouldSkipRemainingTests = true;
    } else {
      logger.success(`Access code obtained successfully: ${currentAccessCode}`);
    }
  });

  // Unlocks the manuscript from century XVI, download the PDF, and extract the access code
  test('Check century XVI', async () => {
    // Skip this test if the previous test failed to get access code
    if (shouldSkipRemainingTests) {
      return; // Early return to skip the test
    }
    
    const logger = createLogger('Century XVI test');
    logger.info('Starting century XVI test');

    // Check if the access code is empty and skip the test if it is
    if (currentAccessCode.trim() === '') {
      logger.error('Could not obtain access code for century XVI. The following tests will be skipped.');
      shouldSkipRemainingTests = true;
    }    
    
    // Verify that we're on the portal page
    logger.info('Verifying URL...');
    await expect(page).toHaveURL(/.*\/portal$/);
    
    // Check if page title or main heading is present
    logger.info('Looking for page title...');
    const pageTitle = page.locator('h1.text-2xl.font-bold.text-sherpa-text');
    await expect(pageTitle).toBeVisible({ timeout: 10000 });
    
    // Filter manuscripts by century XIV
    await filterByCentury(page, 'XVI', logger);
    
    // Verify the unlocked manuscript from century XV
    await verifyLockedManuscript(page, 'XVI', logger);

    // Unlock the manuscript with the access code
    await unlockManuscriptWithCode(page, 'XVI', currentAccessCode, logger);

    // Verify the unlocked manuscript from century XV
    await verifyUnlockedManuscript(page, 'XVI', logger);
    
    // Download the PDF if the manuscript is unlocked and extract access code
    currentAccessCode = await downloadManuscriptPDF(page, 'XVI', logger);

    // Check if access code was obtained successfully
    if (!currentAccessCode || currentAccessCode.trim() === '') {
      logger.error('Could not obtain access code for century XVI. The following tests will be skipped.');
      shouldSkipRemainingTests = true;
    } else {
      logger.success(`Access code obtained successfully: ${currentAccessCode}`);
    }
  });

  // Unlocks the manuscript from century XVII using API, download the PDF, and extract the access code
  test('Check century XVII', async () => {
    // Skip this test if the previous test failed to get access code
    if (shouldSkipRemainingTests) {
      return; // Early return to skip the test
    }

    const logger = createLogger('Century XVII test');
    logger.info('Starting century XVII test');

    // Check if the access code is empty and skip the test if it is
    if (currentAccessCode.trim() === '') {
      logger.error('Could not obtain access code for century XVII. The following tests will be skipped.');
      shouldSkipRemainingTests = true;
    }    
    
    // Verify that we're on the portal page
    logger.info('Verifying URL...');
    await expect(page).toHaveURL(/.*\/portal$/);
    
    // Check if page title or main heading is present
    logger.info('Looking for page title...');
    const pageTitle = page.locator('h1.text-2xl.font-bold.text-sherpa-text');
    await expect(pageTitle).toBeVisible({ timeout: 10000 });
    
    // Filter manuscripts by century XVII
    await filterByCentury(page, 'XVII', logger);
    
    // Verify the locked manuscript from century XVII
    await verifyLockedManuscript(page, 'XVII', logger, true);

    // Unlock the manuscript with the access code from API
    await unlockManuscriptWithAPI(page, 'XVII', currentAccessCode, logger);

    // Verify the unlocked manuscript from century XVII
    await verifyUnlockedManuscript(page, 'XVII', logger);
    
   // Download the PDF if the manuscript is unlocked and extract access code
   currentAccessCode = await downloadManuscriptPDF(page, 'XV', logger);

   // Check if access code was obtained successfully
   if (!currentAccessCode || currentAccessCode.trim() === '') {
     logger.error('Could not obtain access code for century XV. The following tests will be skipped.');
     shouldSkipRemainingTests = true;
   } else {
     logger.success(`Access code obtained successfully: ${currentAccessCode}`);
   }
  });

  // Unlocks the manuscript from century XVIII using API, download the PDF, and extract the access code
  test('Check century XVIII', async () => {
    // Skip this test if the previous test failed to get access code
    if (shouldSkipRemainingTests) {
      return; // Early return to skip the test
    }

    const logger = createLogger('Century XVIII test');
    logger.info('Starting century XVIII test');

    // Check if the access code is empty and skip the test if it is
    if (currentAccessCode.trim() === '') {
      logger.error('Could not obtain access code for century XVIII. The following tests will be skipped.');
      shouldSkipRemainingTests = true;
    }    
    
    // Verify that we're on the portal page
    logger.info('Verifying URL...');
    await expect(page).toHaveURL(/.*\/portal$/);
    
    // Check if page title or main heading is present
    logger.info('Looking for page title...');
    const pageTitle = page.locator('h1.text-2xl.font-bold.text-sherpa-text');
    await expect(pageTitle).toBeVisible({ timeout: 10000 });
    
    // Filter manuscripts by century XVIII
    await filterByCentury(page, 'XVIII', logger);
    
    // Verify the locked manuscript from century XVIII
    await verifyLockedManuscript(page, 'XVIII', logger, true);

    // Unlock the manuscript with the access code from API
    await unlockManuscriptWithAPI(page, 'XVIII', currentAccessCode, logger);

    // Verify the unlocked manuscript from century XVIII
    await verifyUnlockedManuscript(page, 'XVIII', logger);
    
    logger.success('All tests have been completed successfully');
  });
});





