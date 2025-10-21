import { test, expect } from '@playwright/test';

// Set the base URL, which can be automatically switched during runtime
const BASE_URL =
  process.env.TEST_URL || 'http://localhost:3000';

// Test 1: Check whether the "tests" page can be loaded successfully
test('Test page loads successfully', async ({ page }) => {
  await page.goto(`${BASE_URL}/tests`);
  // Test page titile
  await expect(page.locator('h2')).toContainText('System Test Dashboard');
});

// Test 2: Click the button and verify if it is visible
test('Run API Test button is visible and clickable', async ({ page }) => {
  await page.goto(`${BASE_URL}/tests`);
  const button = page.locator('text=Run API Test');
  await expect(button).toBeVisible();
  await button.click();
});