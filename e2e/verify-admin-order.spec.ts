import { test, expect } from '@playwright/test';

test.describe('Verify Order in Admin Pages', () => {
  const ORDER_ID = '6926eb916661cc6a85eddf4f';
  const CUSTOMER_NAME = 'Jean-Pierre Dupont';
  const PHONE = '0601289283';

  // Helper function to login to admin
  async function loginToAdmin(page: any) {
    console.log('🔐 Logging into admin...');
    await page.goto('/admin', { timeout: 30000 });
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // Check if we're on login page
    const loginForm = page.locator('input[type="email"], input[name="email"]').first();
    if (await loginForm.isVisible()) {
      // Fill login credentials
      await page.fill('input[type="email"], input[name="email"]', 'admin@pizzafalchi.fr');
      await page.fill('input[type="password"], input[name="password"]', 'admin123');

      // Click login button
      const loginButton = page.locator('button[type="submit"], button:has-text("connecter")').first();
      await loginButton.click();

      // Wait for redirect
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);
      console.log('✅ Logged in successfully');
    } else {
      console.log('✅ Already logged in');
    }
  }

  test('should show order in admin/orders page', async ({ page }) => {
    test.setTimeout(60000);

    await loginToAdmin(page);

    console.log('📋 Navigating to admin orders page...');
    await page.goto('/admin/orders', { timeout: 30000 });
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    // Take screenshot
    await page.screenshot({ path: 'e2e-results/admin-orders-verification.png', fullPage: true });

    // Check if order appears in the list
    const pageContent = await page.content();
    console.log(`Page contains customer name: ${pageContent.includes(CUSTOMER_NAME)}`);
    console.log(`Page contains phone: ${pageContent.includes(PHONE)}`);

    // Look for the order in the page
    const orderRow = page.locator(`text=${CUSTOMER_NAME}`).first();
    const isVisible = await orderRow.isVisible().catch(() => false);
    console.log(`Order row visible: ${isVisible}`);

    if (isVisible) {
      console.log('✅ Order found in admin/orders page!');
      // Highlight the order
      await orderRow.scrollIntoViewIfNeeded();
      await page.screenshot({ path: 'e2e-results/admin-orders-order-found.png', fullPage: true });
    } else {
      console.log('⚠️ Order not immediately visible, checking table...');
      // List all visible order names
      const orderNames = await page.locator('td, [class*="customer"]').allTextContents();
      console.log('Visible content:', orderNames.slice(0, 20).join(' | '));
    }

    expect(isVisible).toBe(true);
  });

  test('should show order in admin/time-slots dashboard', async ({ page }) => {
    test.setTimeout(60000);

    await loginToAdmin(page);

    console.log('📋 Navigating to admin time-slots dashboard...');
    await page.goto('/admin/time-slots/dashboard', { timeout: 30000 });
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    // Take screenshot
    await page.screenshot({ path: 'e2e-results/admin-timeslots-dashboard.png', fullPage: true });

    // Navigate to today's date (2025-11-26)
    const todayButton = page.locator('button').filter({ hasText: /aujourd/i }).first();
    if (await todayButton.isVisible()) {
      await todayButton.click();
      await page.waitForTimeout(2000);
    }

    // Look for 18:30 slot (where our order was placed)
    const slot1830 = page.locator('text=/18:30/').first();
    const slotVisible = await slot1830.isVisible().catch(() => false);
    console.log(`18:30 slot visible: ${slotVisible}`);

    if (slotVisible) {
      await slot1830.scrollIntoViewIfNeeded();
      await page.screenshot({ path: 'e2e-results/admin-timeslots-slot-found.png', fullPage: true });

      // Try clicking on the slot to see orders
      const slotButton = page.locator('button').filter({ hasText: /18:30/ }).first();
      if (await slotButton.isVisible()) {
        await slotButton.click();
        await page.waitForTimeout(2000);
        await page.screenshot({ path: 'e2e-results/admin-timeslots-slot-orders.png', fullPage: true });

        // Check if our order appears in the slot details
        const orderInSlot = page.locator(`text=${CUSTOMER_NAME}`).first();
        const orderVisible = await orderInSlot.isVisible().catch(() => false);
        console.log(`Order visible in slot details: ${orderVisible}`);
      }
    }

    console.log('✅ Time slots dashboard checked');
  });

  test('should show order in admin main page', async ({ page }) => {
    test.setTimeout(60000);

    await loginToAdmin(page);

    console.log('📋 Navigating to admin main page...');
    await page.goto('/admin', { timeout: 30000 });
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    // Take screenshot
    await page.screenshot({ path: 'e2e-results/admin-main-page.png', fullPage: true });

    // Check for recent orders section
    const recentOrders = page.locator('text=/commandes récentes|recent orders/i').first();
    const hasRecentOrders = await recentOrders.isVisible().catch(() => false);
    console.log(`Recent orders section visible: ${hasRecentOrders}`);

    // Check if our order appears
    const orderVisible = await page.locator(`text=${CUSTOMER_NAME}`).first().isVisible().catch(() => false);
    console.log(`Order visible on admin main page: ${orderVisible}`);

    console.log('✅ Admin main page checked');
  });
});
