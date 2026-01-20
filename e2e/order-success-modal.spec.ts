import { test, expect } from '@playwright/test';

/**
 * E2E Test: Order Success Modal Flow
 * Tests that after completing an order and returning to menu, the success modal appears
 */

test.describe('Order Success Modal', () => {
  test('should show success modal when returning to menu from order confirmation', async ({
    page,
  }) => {
    // Step 1: Clear storage and go to menu
    await page.goto('/menu');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Step 2: Add a product to cart
    console.log('📦 Adding product to cart...');
    await page.waitForResponse((response) =>
      response.url().includes('/api/products')
    );

    const addButton = page
      .getByRole('button', { name: /ajouter|add.*cart/i })
      .first();
    await addButton.click();
    await page.waitForTimeout(500);

    // Step 3: Navigate to checkout
    console.log('🛒 Navigating to checkout...');
    await page.goto('/checkout');
    await page.waitForLoadState('networkidle');

    // Wait for time slots to load
    await page.waitForResponse(
      (response) =>
        response.url().includes('/api/time-slots') &&
        response.status() === 200,
      { timeout: 10000 }
    );
    await page.waitForTimeout(1000);

    // Step 4: Fill required fields
    console.log('📝 Filling checkout form...');
    const nameInput = page
      .getByLabel(/nom|name/i)
      .or(page.locator('input[name*="name"]'));
    await nameInput.first().fill('E2E Test User');

    const phoneInput = page
      .getByLabel(/téléphone|phone/i)
      .or(page.locator('input[name*="phone"], input[type="tel"]'));
    await phoneInput.first().fill('0612345678');

    // Select pickup
    const pickupOption = page
      .getByLabel(/à emporter|pickup|retrait/i)
      .or(page.locator('button, [role="button"]').filter({ hasText: /à emporter/i }));

    const pickupCount = await pickupOption.count();
    if (pickupCount > 0) {
      await pickupOption.first().click();
      await page.waitForTimeout(500);
    }

    // Select first available time slot
    console.log('⏰ Selecting time slot...');
    const timeSlotButtons = page.locator('button').filter({
      hasText: /\d{2}h\d{2}/,
    });
    const timeSlotCount = await timeSlotButtons.count();

    if (timeSlotCount > 0) {
      // Find an available (not disabled) time slot
      for (let i = 0; i < timeSlotCount; i++) {
        const slot = timeSlotButtons.nth(i);
        const isDisabled = await slot.isDisabled();
        if (!isDisabled) {
          await slot.click();
          await page.waitForTimeout(500);
          console.log(`✅ Selected time slot ${i + 1}`);
          break;
        }
      }
    }

    // Accept CGV
    console.log('✅ Accepting terms...');
    const cgvCheckbox = page.locator('input[type="checkbox"]').filter({
      hasText: /conditions.*générales|cgv|accepte/i,
    });
    const cgvCount = await cgvCheckbox.count();
    if (cgvCount > 0) {
      await cgvCheckbox.first().check();
      await page.waitForTimeout(300);
    } else {
      // Try finding checkbox near CGV text
      const cgvLabel = page.locator('label, span').filter({
        hasText: /conditions.*générales|cgv/i,
      });
      const labelCount = await cgvLabel.count();
      if (labelCount > 0) {
        const checkbox = page
          .locator('input[type="checkbox"]')
          .near(cgvLabel.first());
        await checkbox.check();
        await page.waitForTimeout(300);
      }
    }

    // Take screenshot before submission
    await page.screenshot({
      path: 'e2e-results/order-success-modal-before-submit.png',
      fullPage: true,
    });

    // Step 5: Submit order
    console.log('🚀 Submitting order...');
    const submitButton = page
      .getByRole('button', { name: /commander|valider|confirmer.*commande/i })
      .or(page.locator('button[type="submit"]'));

    const orderResponsePromise = page.waitForResponse(
      (response) =>
        response.url().includes('/api/orders') &&
        response.request().method() === 'POST',
      { timeout: 15000 }
    );

    await submitButton.first().click();

    try {
      const orderResponse = await orderResponsePromise;
      const status = orderResponse.status();
      console.log('📨 Order submission status:', status);

      if (status === 201 || status === 200) {
        const responseData = await orderResponse.json();
        const orderId = responseData._id;
        console.log('✅ Order created successfully with ID:', orderId);

        // Wait for redirect to confirmation page
        await page.waitForURL(/order-confirmation/i, { timeout: 10000 });
        await page.waitForLoadState('networkidle');

        console.log('📄 On order confirmation page:', page.url());

        // Take screenshot of confirmation page
        await page.screenshot({
          path: 'e2e-results/order-success-modal-confirmation-page.png',
          fullPage: true,
        });

        // Step 6: Click "Commander à nouveau" button
        console.log('🔄 Clicking "Commander à nouveau"...');

        // Listen for console logs to debug
        const consoleLogs: string[] = [];
        page.on('console', (msg) => {
          const text = msg.text();
          consoleLogs.push(text);
          console.log('🖥️ Browser console:', text);
        });

        const commanderButton = page
          .getByRole('button', { name: /commander.*nouveau|order.*again/i })
          .or(page.locator('button, a').filter({ hasText: /commander.*nouveau/i }));

        await commanderButton.first().click();

        // Wait for navigation to menu page
        await page.waitForURL(/\/menu/, { timeout: 10000 });
        await page.waitForLoadState('networkidle');

        console.log('📍 Navigated to:', page.url());
        console.log('📜 Console logs captured:', consoleLogs);

        // Wait a bit for modal to appear
        await page.waitForTimeout(2000);

        // Step 7: Verify success modal appears
        console.log('🔍 Checking for success modal...');

        // Check for modal with multiple possible selectors
        const modal = page.locator('[role="dialog"]').or(
          page.locator('.fixed').filter({
            has: page.locator('text=/commande.*confirmée|order.*confirmed|success/i'),
          })
        );

        const modalVisible = await modal.isVisible();
        console.log('👁️ Modal visible:', modalVisible);

        // Also check for specific modal elements
        const checkmarkIcon = page.locator('svg').filter({
          hasText: /check|✓/i,
        });
        const successText = page.locator('text=/commande.*confirmée|confirmé/i');
        const orderIdDisplay = page.locator(`text=/#?${orderId.slice(-8).toUpperCase()}/i`);

        const hasCheckmark = (await checkmarkIcon.count()) > 0;
        const hasSuccessText = (await successText.count()) > 0;
        const hasOrderId = (await orderIdDisplay.count()) > 0;

        console.log('✅ Has checkmark:', hasCheckmark);
        console.log('✅ Has success text:', hasSuccessText);
        console.log('✅ Has order ID:', hasOrderId);

        // Take screenshot
        await page.screenshot({
          path: 'e2e-results/order-success-modal-shown.png',
          fullPage: true,
        });

        // Assertions
        expect(
          modalVisible || hasSuccessText,
          'Success modal should be visible'
        ).toBeTruthy();

        if (hasOrderId) {
          console.log('🎉 Order ID displayed in modal!');
        }

        // Verify modal can be closed
        const closeButton = page
          .getByRole('button', { name: /fermer|close/i })
          .or(page.locator('button').filter({ has: page.locator('svg') }).first());

        const closeButtonCount = await closeButton.count();
        if (closeButtonCount > 0) {
          console.log('🔘 Closing modal...');
          await closeButton.first().click();
          await page.waitForTimeout(500);

          // Verify modal is gone
          const modalStillVisible = await modal.isVisible().catch(() => false);
          expect(modalStillVisible).toBeFalsy();
          console.log('✅ Modal closed successfully');

          await page.screenshot({
            path: 'e2e-results/order-success-modal-closed.png',
            fullPage: true,
          });
        }
      } else {
        throw new Error(`Order submission failed with status: ${status}`);
      }
    } catch (error) {
      console.error('❌ Error during order flow:', error);
      await page.screenshot({
        path: 'e2e-results/order-success-modal-error.png',
        fullPage: true,
      });
      throw error;
    }
  });

  test('should show correct order ID in success modal', async ({ page }) => {
    // This test verifies the order ID is correctly passed and displayed

    // Navigate directly to menu with mock params
    const testOrderId = 'A1B2C3D4';
    await page.goto(`/menu?orderSuccess=true&orderId=${testOrderId}`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Check if modal appears with the correct order ID
    const orderIdText = page.locator(`text=/#?${testOrderId}/i`);
    const orderIdVisible = await orderIdText.first().isVisible();

    console.log('🔍 Order ID visible in modal:', orderIdVisible);

    if (!orderIdVisible) {
      // Log what we can see
      const bodyText = await page.locator('body').textContent();
      console.log('📄 Page content includes:', bodyText?.substring(0, 500));
    }

    await page.screenshot({
      path: 'e2e-results/order-success-modal-direct-url.png',
      fullPage: true,
    });

    expect(orderIdVisible).toBeTruthy();
  });
});
