import { Page } from '@playwright/test';

// Logger class for the tests
export class TestLogger {
  private testName: string;
  private startTime: number;

  constructor(testName: string) {
    this.testName = testName;
    this.startTime = Date.now();
  }

  log(message: string, level: 'info' | 'warn' | 'error' | 'success' = 'info') {
    const timestamp = new Date().toISOString();
    const elapsed = Date.now() - this.startTime;
    const emoji = this.getEmoji(level);
    const prefix = this.getPrefix(level);
    
    console.log(`${emoji} [${timestamp}] [${elapsed}ms] ${prefix} [${this.testName}] ${message}`);
  }

  info(message: string) {
    this.log(message, 'info');
  }

  warn(message: string) {
    this.log(message, 'warn');
  }

  error(message: string) {
    this.log(message, 'error');
  }

  success(message: string) {
    this.log(message, 'success');
  }

  async logPageInfo(page: Page) {
    const url = page.url();
    const title = await page.title();
    
    this.info(`Current page: ${title} (${url})`);
  }

  async logElementInfo(page: Page, selector: string, description: string) {
    try {
      const element = page.locator(selector);
      const isVisible = await element.isVisible();
      const text = await element.textContent();
      
      this.info(`${description}: visible=${isVisible}, text="${text?.substring(0, 50)}${text && text.length > 50 ? '...' : ''}"`);
    } catch (error) {
      this.warn(`${description}: element not found or error - ${error}`);
    }
  }

  private getEmoji(level: string): string {
    switch (level) {
      case 'info': return 'ℹ️';
      case 'warn': return '⚠️';
      case 'error': return '❌';
      case 'success': return '✅';
      default: return 'ℹ️';
    }
  }

  private getPrefix(level: string): string {
    switch (level) {
      case 'info': return 'INFO';
      case 'warn': return 'WARN';
      case 'error': return 'ERROR';
      case 'success': return 'SUCCESS';
      default: return 'INFO';
    }
  }
}

// Helper function to create a logger for a test
export function createLogger(testName: string): TestLogger {
  return new TestLogger(testName);
} 