import { test, expect } from '@playwright/test';

/**
 * E2E Test: Phone Orders Dashboard
 * Tests the time slots dashboard functionality
 */

test.describe('Phone Orders Dashboard', () => {
  test('should load the dashboard and fetch time slots', async ({ page }) => {
    // Navigate to the dashboard
    await page.goto('/admin/time-slots/dashboard');

    // Wait for the page to load
    await page.waitForLoadState('networkidle');

    // Check if the page title is correct
    await expect(page.locator('h1')).toContainText('Phone Orders');

    // Check if stats cards are visible
    const statsCards = page.locator('[class*="grid"]').first();
    await expect(statsCards).toBeVisible();

    // Wait for the API call to complete
    const slotsResponse = page.waitForResponse(
      (response) =>
        response.url().includes('/api/time-slots') &&
        response.status() === 200
    );

    // Verify the response
    const response = await slotsResponse;
    const responseBody = await response.json();

    console.log('API Response Status:', response.status());
    console.log('API Response Body:', JSON.stringify(responseBody, null, 2));

    // Check if the response is successful
    expect(response.status()).toBe(200);

    // Check if the response has the expected structure
    expect(responseBody).toHaveProperty('success');
    expect(responseBody).toHaveProperty('slots');

    // Log the number of slots
    console.log(`Found ${responseBody.slots?.length || 0} time slots`);

    // Take a screenshot for debugging
    await page.screenshot({
      path: 'e2e-results/dashboard-loaded.png',
      fullPage: true
    });
  });

  test('should display date selector', async ({ page }) => {
    await page.goto('/admin/time-slots/dashboard');
    await page.waitForLoadState('networkidle');

    // Check for date selector buttons
    const prevButton = page.getByRole('button', { name: /previous/i }).or(page.locator('button').filter({ hasText: /←|précédent/i }));
    const nextButton = page.getByRole('button', { name: /next/i }).or(page.locator('button').filter({ hasText: /→|suivant/i }));

    // At least one of these should exist
    const hasDateNav = (await prevButton.count() > 0) || (await nextButton.count() > 0);
    expect(hasDateNav).toBeTruthy();
  });

  test('should show time slot grid or empty state', async ({ page }) => {
    await page.goto('/admin/time-slots/dashboard');

    // Wait for API response
    await page.waitForResponse(
      (response) => response.url().includes('/api/time-slots')
    );

    await page.waitForLoadState('networkidle');

    // Check if time slots grid exists OR empty state message
    const hasTimeSlots = await page.locator('[class*="grid"]').count() > 0;
    const hasEmptyMessage = await page.locator('text=/aucun|no.*slot|empty/i').count() > 0;

    expect(hasTimeSlots || hasEmptyMessage).toBeTruthy();

    await page.screenshot({
      path: 'e2e-results/time-slots-display.png',
      fullPage: true
    });
  });

  test('should check for console errors', async ({ page }) => {
    const consoleErrors: string[] = [];

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    page.on('pageerror', (error) => {
      consoleErrors.push(error.message);
    });

    await page.goto('/admin/time-slots/dashboard');
    await page.waitForLoadState('networkidle');

    // Wait a bit to catch any async errors
    await page.waitForTimeout(2000);

    // Log all console errors
    if (consoleErrors.length > 0) {
      console.log('Console Errors Found:');
      consoleErrors.forEach((error, index) => {
        console.log(`${index + 1}. ${error}`);
      });
    } else {
      console.log('No console errors found');
    }

    await page.screenshot({
      path: 'e2e-results/final-state.png',
      fullPage: true
    });
  });

  test('should test API endpoint directly', async ({ request }) => {
    const today = new Date().toISOString().split('T')[0];
    const response = await request.get(`/api/time-slots?date=${today}`);

    console.log('Direct API Test:');
    console.log('Status:', response.status());
    console.log('Status Text:', response.statusText());

    const body = await response.json();
    console.log('Response Body:', JSON.stringify(body, null, 2));

    // Verify response
    expect(response.status()).toBe(200);
    expect(body).toHaveProperty('success');
    expect(body).toHaveProperty('slots');
  });
});
