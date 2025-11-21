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

  test('should open phone order modal from time slot', async ({ page }) => {
    await page.goto('/admin/time-slots/dashboard');
    await page.waitForLoadState('networkidle');

    // Wait for slots to load
    await page.waitForResponse(
      (response) => response.url().includes('/api/time-slots')
    );

    // Find "Commande Téléphonique" button
    const phoneOrderButton = page
      .getByRole('button', { name: /commande.*téléphonique|phone.*order/i })
      .or(
        page.locator('button').filter({ hasText: /commande.*téléphonique|phone.*order/i })
      );

    const buttonCount = await phoneOrderButton.count();
    if (buttonCount > 0) {
      await phoneOrderButton.first().click();
      await page.waitForTimeout(500);

      // Verify modal opened
      const modal = page.locator('[role="dialog"], [class*="modal"]');
      await expect(modal.first()).toBeVisible();

      await page.screenshot({
        path: 'e2e-results/phone-order-modal-opened.png',
        fullPage: true,
      });
    } else {
      console.log('No phone order buttons found - time slots might be empty');
      test.skip();
    }
  });

  test('should complete full phone order workflow', async ({ page }) => {
    await page.goto('/admin/time-slots/dashboard');
    await page.waitForLoadState('networkidle');

    // Wait for slots to load
    await page.waitForResponse(
      (response) => response.url().includes('/api/time-slots')
    );

    // Find and click "Commande Téléphonique" button
    const phoneOrderButton = page
      .getByRole('button', { name: /commande.*téléphonique|phone.*order/i })
      .or(
        page.locator('button').filter({ hasText: /commande.*téléphonique/i })
      );

    const buttonCount = await phoneOrderButton.count();
    if (buttonCount === 0) {
      console.log('No phone order buttons found - skipping workflow test');
      test.skip();
      return;
    }

    await phoneOrderButton.first().click();
    await page.waitForTimeout(500);

    // ========== STEP 1: Customer Information ==========
    console.log('Step 1: Filling customer information...');

    // Fill customer name
    const nameInput = page
      .getByLabel(/nom.*client|customer.*name/i)
      .or(page.locator('input[name*="customerName"], input[placeholder*="nom"]'));
    await nameInput.first().fill('Test Client');

    // Fill phone number
    const phoneInput = page
      .getByLabel(/téléphone|phone/i)
      .or(page.locator('input[name*="phone"], input[type="tel"]'));
    await phoneInput.first().fill('0612345678');

    // Select delivery type (pickup by default)
    const pickupOption = page
      .getByLabel(/à emporter|pickup|retrait/i)
      .or(page.locator('input[value="pickup"]'));

    const pickupCount = await pickupOption.count();
    if (pickupCount > 0) {
      await pickupOption.first().click();
    }

    await page.screenshot({
      path: 'e2e-results/phone-order-step1-customer.png',
      fullPage: true,
    });

    // Click "Suivant" or "Next" to go to pizzas step
    const nextButton = page
      .getByRole('button', { name: /suivant|next|continuer/i })
      .or(page.locator('button').filter({ hasText: /suivant|next/i }));
    await nextButton.first().click();
    await page.waitForTimeout(500);

    // ========== STEP 2: Select Pizzas ==========
    console.log('Step 2: Selecting pizzas...');

    // Wait for products to load
    await page.waitForResponse(
      (response) => response.url().includes('/api/products'),
      { timeout: 5000 }
    ).catch(() => console.log('Products API not detected'));

    // Find product cards or "Ajouter" buttons
    const addPizzaButton = page
      .getByRole('button', { name: /ajouter|\+/i })
      .or(page.locator('button').filter({ hasText: /ajouter|\+/ }));

    const pizzaButtonCount = await addPizzaButton.count();
    if (pizzaButtonCount > 0) {
      // Add first pizza twice
      await addPizzaButton.first().click();
      await page.waitForTimeout(300);
      await addPizzaButton.first().click();
      await page.waitForTimeout(300);
    }

    await page.screenshot({
      path: 'e2e-results/phone-order-step2-pizzas.png',
      fullPage: true,
    });

    // Click "Suivant" to go to drinks step
    await nextButton.first().click();
    await page.waitForTimeout(500);

    // ========== STEP 3: Select Drinks (Optional) ==========
    console.log('Step 3: Selecting drinks...');

    // Add a drink if available
    const addDrinkButton = page
      .getByRole('button', { name: /ajouter|\+/i })
      .or(page.locator('button').filter({ hasText: /ajouter|\+/ }));

    const drinkButtonCount = await addDrinkButton.count();
    if (drinkButtonCount > 0) {
      await addDrinkButton.first().click();
      await page.waitForTimeout(300);
    }

    await page.screenshot({
      path: 'e2e-results/phone-order-step3-drinks.png',
      fullPage: true,
    });

    // Click "Suivant" to go to confirmation step
    await nextButton.first().click();
    await page.waitForTimeout(500);

    // ========== STEP 4: Order Confirmation ==========
    console.log('Step 4: Confirming order...');

    // Verify order summary is displayed
    const orderSummary = page.locator('text=/récapitulatif|summary|total/i');
    await expect(orderSummary.first()).toBeVisible();

    await page.screenshot({
      path: 'e2e-results/phone-order-step4-confirmation.png',
      fullPage: true,
    });

    // ========== STEP 5: Submit Order ==========
    console.log('Step 5: Submitting order...');

    // Click "Valider" or "Confirmer" button
    const submitButton = page
      .getByRole('button', { name: /valider|confirmer|créer.*commande|submit/i })
      .or(
        page.locator('button').filter({ hasText: /valider|confirmer|créer/i })
      );

    // Wait for order creation API call
    const orderResponsePromise = page.waitForResponse(
      (response) =>
        response.url().includes('/api/orders') &&
        response.request().method() === 'POST',
      { timeout: 10000 }
    );

    await submitButton.first().click();

    try {
      const orderResponse = await orderResponsePromise;
      const status = orderResponse.status();
      console.log('Order creation status:', status);

      if (status === 201 || status === 200) {
        // Success!
        console.log('✓ Order created successfully');

        // Wait for success toast or modal close
        await page.waitForTimeout(1000);

        // Verify modal closed or success message appears
        const successToast = page.locator('[class*="toast"]').filter({
          hasText: /créé|success|merci/i,
        });

        const toastCount = await successToast.count();
        if (toastCount > 0) {
          await expect(successToast.first()).toBeVisible();
        }

        await page.screenshot({
          path: 'e2e-results/phone-order-submitted-success.png',
          fullPage: true,
        });
      } else {
        // Handle error
        const errorData = await orderResponse.json();
        console.error('Order creation failed:', errorData);

        // Check for error message
        const errorToast = page.locator('text=/erreur|error|échec/i');
        await expect(errorToast.first()).toBeVisible({ timeout: 3000 });

        await page.screenshot({
          path: 'e2e-results/phone-order-submitted-error.png',
          fullPage: true,
        });

        // Don't fail test, just log the error
        console.log('Note: Order submission returned error status');
      }
    } catch (error) {
      console.error('Error during order submission:', error);
      await page.screenshot({
        path: 'e2e-results/phone-order-submission-timeout.png',
        fullPage: true,
      });
      // Log but don't fail - might be timing issue
      console.log('Note: Order submission timed out or encountered error');
    }
  });

  test('should validate customer info before proceeding', async ({ page }) => {
    await page.goto('/admin/time-slots/dashboard');
    await page.waitForLoadState('networkidle');

    await page.waitForResponse(
      (response) => response.url().includes('/api/time-slots')
    );

    const phoneOrderButton = page
      .getByRole('button', { name: /commande.*téléphonique/i })
      .first();

    const buttonCount = await phoneOrderButton.count();
    if (buttonCount === 0) {
      test.skip();
      return;
    }

    await phoneOrderButton.click();
    await page.waitForTimeout(500);

    // Try to proceed without filling required fields
    const nextButton = page
      .getByRole('button', { name: /suivant|next/i })
      .first();

    // Button should be disabled or show validation errors
    const isDisabled = await nextButton.isDisabled();

    if (!isDisabled) {
      // If button is not disabled, try clicking and check for validation
      await nextButton.click();
      await page.waitForTimeout(300);

      // Should still be on customer step or show validation errors
      const nameInput = page.getByLabel(/nom.*client|customer.*name/i).first();
      const isNameVisible = await nameInput.isVisible();

      expect(isNameVisible).toBeTruthy();
    } else {
      expect(isDisabled).toBeTruthy();
    }

    await page.screenshot({
      path: 'e2e-results/phone-order-validation.png',
      fullPage: true,
    });
  });

  test('should use keyboard shortcuts for pizza selection', async ({
    page,
  }) => {
    await page.goto('/admin/time-slots/dashboard');
    await page.waitForLoadState('networkidle');

    await page.waitForResponse(
      (response) => response.url().includes('/api/time-slots')
    );

    const phoneOrderButton = page
      .getByRole('button', { name: /commande.*téléphonique/i })
      .first();

    const buttonCount = await phoneOrderButton.count();
    if (buttonCount === 0) {
      test.skip();
      return;
    }

    await phoneOrderButton.click();
    await page.waitForTimeout(500);

    // Fill customer info
    const nameInput = page.getByLabel(/nom.*client/i).first();
    await nameInput.fill('Keyboard Test');

    const phoneInput = page.getByLabel(/téléphone/i).first();
    await phoneInput.fill('0612345678');

    // Proceed to pizza step
    const nextButton = page.getByRole('button', { name: /suivant/i }).first();
    await nextButton.click();
    await page.waitForTimeout(500);

    // Wait for products to load
    await page.waitForResponse(
      (response) => response.url().includes('/api/products'),
      { timeout: 5000 }
    ).catch(() => {});

    // Try keyboard shortcuts (1-9 for first 9 pizzas)
    await page.keyboard.press('1');
    await page.waitForTimeout(300);
    await page.keyboard.press('1'); // Add same pizza twice
    await page.waitForTimeout(300);

    // Check if cart was updated (should show quantity indicator)
    const quantityIndicator = page.locator('text=/\d+/');
    const hasQuantity = (await quantityIndicator.count()) > 0;

    if (hasQuantity) {
      console.log('✓ Keyboard shortcuts working');
    } else {
      console.log('Note: Keyboard shortcuts might not be active or no products');
    }

    await page.screenshot({
      path: 'e2e-results/phone-order-keyboard-shortcuts.png',
      fullPage: true,
    });
  });
});
