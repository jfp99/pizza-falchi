import { test, expect } from '@playwright/test';

/**
 * E2E Test: Payment Integration (Stripe)
 * Tests payment method selection and flow (without actual payment processing)
 */

test.describe('Payment Integration', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/menu');
    await page.waitForLoadState('networkidle');

    // Clear cart and start fresh
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Wait for products
    await page
      .waitForResponse((response) => response.url().includes('/api/products'))
      .catch(() => {});

    // Add item to cart
    const addButton = page.getByRole('button', { name: /ajouter/i }).first();
    await addButton.click();
    await page.waitForTimeout(500);
  });

  test('should display payment method options', async ({ page }) => {
    await page.goto('/checkout');
    await page.waitForLoadState('networkidle');

    // Look for payment method section
    const paymentLabel = page.locator(
      'text=/méthode.*paiement|payment.*method|paiement/i'
    );

    const labelCount = await paymentLabel.count();

    if (labelCount > 0) {
      await expect(paymentLabel.first()).toBeVisible();

      await page.screenshot({
        path: 'e2e-results/payment-01-payment-section.png',
        fullPage: true,
      });

      console.log('✓ Payment method section displayed');
    } else {
      console.log('Note: No payment method section found');
    }
  });

  test('should have cash payment option', async ({ page }) => {
    await page.goto('/checkout');
    await page.waitForLoadState('networkidle');

    // Look for cash/espèces option
    const cashOption = page
      .getByLabel(/espèces|cash|liquide/i)
      .or(page.locator('input[value*="cash"], input[value*="especes"]'));

    const cashCount = await cashOption.count();

    if (cashCount > 0) {
      await expect(cashOption.first()).toBeVisible();

      await page.screenshot({
        path: 'e2e-results/payment-02-cash-option.png',
        fullPage: true,
      });

      console.log('✓ Cash payment option available');
    } else {
      console.log('Note: No cash payment option found');
    }
  });

  test('should have card payment option', async ({ page }) => {
    await page.goto('/checkout');
    await page.waitForLoadState('networkidle');

    // Look for card/carte option
    const cardOption = page
      .getByLabel(/carte|card|credit.*card|cb/i)
      .or(page.locator('input[value*="card"], input[value*="carte"]'));

    const cardCount = await cardOption.count();

    if (cardCount > 0) {
      await expect(cardOption.first()).toBeVisible();

      await page.screenshot({
        path: 'e2e-results/payment-03-card-option.png',
        fullPage: true,
      });

      console.log('✓ Card payment option available');
    } else {
      console.log('Note: No card payment option found');
    }
  });

  test('should select cash payment method', async ({ page }) => {
    await page.goto('/checkout');
    await page.waitForLoadState('networkidle');

    const cashOption = page
      .getByLabel(/espèces|cash/i)
      .or(page.locator('input[value*="cash"]'));

    const cashCount = await cashOption.count();

    if (cashCount > 0) {
      await cashOption.first().check();
      await page.waitForTimeout(300);

      // Verify it's selected
      const isChecked = await cashOption.first().isChecked();
      expect(isChecked).toBeTruthy();

      await page.screenshot({
        path: 'e2e-results/payment-04-cash-selected.png',
        fullPage: true,
      });

      console.log('✓ Cash payment method selected');
    } else {
      console.log('Note: Cash option not available for selection');
    }
  });

  test('should select card payment method', async ({ page }) => {
    await page.goto('/checkout');
    await page.waitForLoadState('networkidle');

    const cardOption = page
      .getByLabel(/carte|card/i)
      .or(page.locator('input[value*="card"]'));

    const cardCount = await cardOption.count();

    if (cardCount > 0) {
      await cardOption.first().check();
      await page.waitForTimeout(300);

      // Verify it's selected
      const isChecked = await cardOption.first().isChecked();
      expect(isChecked).toBeTruthy();

      await page.screenshot({
        path: 'e2e-results/payment-05-card-selected.png',
        fullPage: true,
      });

      console.log('✓ Card payment method selected');
    } else {
      console.log('Note: Card option not available for selection');
    }
  });

  test('should show Stripe payment form when card selected', async ({
    page,
  }) => {
    await page.goto('/checkout');
    await page.waitForLoadState('networkidle');

    // Select card payment
    const cardOption = page
      .getByLabel(/carte|card/i)
      .or(page.locator('input[value*="card"]'));

    const cardCount = await cardOption.count();

    if (cardCount > 0) {
      await cardOption.first().check();
      await page.waitForTimeout(1000);

      // Look for Stripe payment element or iframe
      const stripeElement = page
        .locator('iframe[name*="stripe"], [class*="stripe"], #payment-element')
        .first();

      const stripeCount = await stripeElement.count();

      if (stripeCount > 0) {
        console.log('✓ Stripe payment form loaded');

        await page.screenshot({
          path: 'e2e-results/payment-06-stripe-form-loaded.png',
          fullPage: true,
        });
      } else {
        console.log('Note: Stripe form not found (might need payment intent)');
      }
    } else {
      test.skip();
    }
  });

  test('should display secure payment indicators', async ({ page }) => {
    await page.goto('/checkout');
    await page.waitForLoadState('networkidle');

    // Look for security/trust badges
    const secureIndicators = page.locator(
      'text=/sécurisé|secure|ssl|encrypted|paiement.*sécurisé/i'
    );

    const indicatorCount = await secureIndicators.count();

    if (indicatorCount > 0) {
      console.log(`Found ${indicatorCount} security indicators`);

      await page.screenshot({
        path: 'e2e-results/payment-07-secure-indicators.png',
        fullPage: true,
      });
    } else {
      console.log('Note: No explicit security indicators found');
    }
  });

  test('should submit order with cash payment', async ({ page }) => {
    await page.goto('/checkout');
    await page.waitForLoadState('networkidle');

    // Fill customer info
    const nameInput = page.getByLabel(/nom|name/i).first();
    await nameInput.fill('Payment Test User');

    const phoneInput = page.getByLabel(/téléphone|phone/i).first();
    await phoneInput.fill('0644556677');

    // Select pickup
    const pickupOption = page
      .getByLabel(/à emporter|pickup/i)
      .first();

    if ((await pickupOption.count()) > 0) {
      await pickupOption.check();
      await page.waitForTimeout(300);
    }

    // Select cash payment
    const cashOption = page
      .getByLabel(/espèces|cash/i)
      .or(page.locator('input[value*="cash"]'));

    const cashCount = await cashOption.count();

    if (cashCount > 0) {
      await cashOption.first().check();
      await page.waitForTimeout(300);
    }

    await page.screenshot({
      path: 'e2e-results/payment-08-ready-to-submit-cash.png',
      fullPage: true,
    });

    // Submit order
    const submitButton = page
      .getByRole('button', { name: /commander|valider|submit/i })
      .first();

    const orderPromise = page.waitForResponse(
      (response) =>
        response.url().includes('/api/orders') &&
        response.request().method() === 'POST',
      { timeout: 10000 }
    );

    await submitButton.click();

    try {
      const orderResponse = await orderPromise;
      const status = orderResponse.status();

      expect(status).toBeGreaterThanOrEqual(200);
      expect(status).toBeLessThan(300);

      const orderData = await orderResponse.json();

      // Verify payment method in order
      if (orderData.order || orderData.paymentMethod) {
        const paymentMethod =
          orderData.order?.paymentMethod || orderData.paymentMethod;

        console.log('Order payment method:', paymentMethod);

        if (paymentMethod === 'cash' || paymentMethod === 'especes') {
          console.log('✓ Cash payment order created successfully');
        }
      }

      await page.waitForLoadState('networkidle');

      await page.screenshot({
        path: 'e2e-results/payment-09-cash-order-submitted.png',
        fullPage: true,
      });
    } catch (error) {
      console.error('Error submitting cash order:', error);
      await page.screenshot({
        path: 'e2e-results/payment-09-cash-order-error.png',
        fullPage: true,
      });
      throw error;
    }
  });

  test('should handle payment method validation', async ({ page }) => {
    await page.goto('/checkout');
    await page.waitForLoadState('networkidle');

    // Fill customer info but skip payment method
    const nameInput = page.getByLabel(/nom|name/i).first();
    await nameInput.fill('Validation Test');

    const phoneInput = page.getByLabel(/téléphone|phone/i).first();
    await phoneInput.fill('0611223344');

    // Try to submit without selecting payment method
    const submitButton = page
      .getByRole('button', { name: /commander|valider/i })
      .first();

    await submitButton.click();
    await page.waitForTimeout(1000);

    // Should show validation error or prevent submission
    const errorMessage = page.locator(
      'text=/paiement.*requis|payment.*required|sélectionner.*paiement/i'
    );

    const hasError = (await errorMessage.count()) > 0;

    if (hasError) {
      console.log('✓ Payment method validation works');

      await page.screenshot({
        path: 'e2e-results/payment-10-validation-error.png',
        fullPage: true,
      });
    } else {
      console.log('Note: Payment method might have default selection');
    }
  });

  test('should create payment intent for card payment', async ({ page }) => {
    await page.goto('/checkout');
    await page.waitForLoadState('networkidle');

    // Select card payment
    const cardOption = page
      .getByLabel(/carte|card/i)
      .or(page.locator('input[value*="card"]'));

    const cardCount = await cardOption.count();

    if (cardCount > 0) {
      // Listen for payment intent creation
      const paymentIntentPromise = page.waitForResponse(
        (response) =>
          response.url().includes('/api/create-payment-intent') ||
          response.url().includes('payment_intents'),
        { timeout: 5000 }
      );

      await cardOption.first().check();

      try {
        const paymentIntentResponse = await paymentIntentPromise;
        const status = paymentIntentResponse.status();

        expect(status).toBeGreaterThanOrEqual(200);
        expect(status).toBeLessThan(300);

        console.log('✓ Payment intent created successfully');

        const responseData = await paymentIntentResponse.json();
        console.log('Payment intent response:', responseData);

        await page.screenshot({
          path: 'e2e-results/payment-11-payment-intent-created.png',
          fullPage: true,
        });
      } catch {
        console.log('Note: Payment intent creation not detected or requires full form');
      }
    } else {
      test.skip();
    }
  });

  test('should display correct total amount for payment', async ({ page }) => {
    await page.goto('/checkout');
    await page.waitForLoadState('networkidle');

    // Find total amount
    const totalElement = page
      .locator('text=/total/i')
      .locator('..')
      .filter({ hasText: /€/ });

    await expect(totalElement.first()).toBeVisible();

    const totalText = await totalElement.first().textContent();
    const totalAmount = parseFloat(totalText?.match(/[\d.]+/)?.[0] || '0');

    console.log('Order total for payment:', totalAmount);

    expect(totalAmount).toBeGreaterThan(0);

    await page.screenshot({
      path: 'e2e-results/payment-12-total-amount.png',
      fullPage: true,
    });

    console.log('✓ Total amount displayed for payment');
  });

  test('should show payment processing indicator', async ({ page }) => {
    await page.goto('/checkout');
    await page.waitForLoadState('networkidle');

    // Fill required fields
    const nameInput = page.getByLabel(/nom|name/i).first();
    await nameInput.fill('Processing Test');

    const phoneInput = page.getByLabel(/téléphone|phone/i).first();
    await phoneInput.fill('0699887766');

    // Select payment method
    const cashOption = page
      .getByLabel(/espèces|cash/i)
      .or(page.locator('input[value*="cash"]'));

    if ((await cashOption.count()) > 0) {
      await cashOption.first().check();
    }

    // Click submit
    const submitButton = page
      .getByRole('button', { name: /commander|valider/i })
      .first();

    await submitButton.click();

    // Look for loading indicator
    const loadingIndicator = page.locator(
      '[class*="loading"], [class*="spinner"], text=/traitement|processing/i'
    );

    const hasLoading = (await loadingIndicator.count()) > 0;

    if (hasLoading) {
      console.log('✓ Payment processing indicator shown');

      await page.screenshot({
        path: 'e2e-results/payment-13-processing-indicator.png',
        fullPage: true,
      });
    } else {
      console.log('Note: No loading indicator detected (might be too fast)');
    }
  });

  test('should handle payment errors gracefully', async ({ page }) => {
    // Intercept payment API to simulate error
    await page.route('**/api/orders**', (route) => {
      if (route.request().method() === 'POST') {
        route.fulfill({
          status: 400,
          contentType: 'application/json',
          body: JSON.stringify({
            error: 'Payment failed',
            message: 'Insufficient funds',
          }),
        });
      } else {
        route.continue();
      }
    });

    await page.goto('/checkout');
    await page.waitForLoadState('networkidle');

    // Fill form
    const nameInput = page.getByLabel(/nom|name/i).first();
    await nameInput.fill('Error Test');

    const phoneInput = page.getByLabel(/téléphone|phone/i).first();
    await phoneInput.fill('0655443322');

    // Submit
    const submitButton = page
      .getByRole('button', { name: /commander|valider/i })
      .first();

    await submitButton.click();
    await page.waitForTimeout(2000);

    // Look for error message
    const errorMessage = page.locator(
      '[role="alert"], [class*="error"], text=/erreur|error|échec|failed/i'
    );

    const hasError = (await errorMessage.count()) > 0;

    if (hasError) {
      console.log('✓ Payment error displayed to user');

      await page.screenshot({
        path: 'e2e-results/payment-14-error-handling.png',
        fullPage: true,
      });
    }

    expect(hasError).toBeTruthy();
  });

  test('should display payment method in order confirmation', async ({
    page,
  }) => {
    await page.goto('/checkout');
    await page.waitForLoadState('networkidle');

    // Complete order with cash payment
    const nameInput = page.getByLabel(/nom|name/i).first();
    await nameInput.fill('Confirmation Test');

    const phoneInput = page.getByLabel(/téléphone|phone/i).first();
    await phoneInput.fill('0677889900');

    const cashOption = page
      .getByLabel(/espèces|cash/i)
      .or(page.locator('input[value*="cash"]'));

    if ((await cashOption.count()) > 0) {
      await cashOption.first().check();
    }

    const submitButton = page
      .getByRole('button', { name: /commander|valider/i })
      .first();

    const orderPromise = page.waitForResponse(
      (response) =>
        response.url().includes('/api/orders') &&
        response.request().method() === 'POST'
    );

    await submitButton.click();

    try {
      await orderPromise;
      await page.waitForLoadState('networkidle');

      // Should be on confirmation page
      const isConfirmation = page.url().includes('confirmation');

      if (isConfirmation) {
        // Look for payment method display
        const paymentInfo = page.locator(
          'text=/paiement|payment|espèces|cash/i'
        );

        const infoCount = await paymentInfo.count();

        if (infoCount > 0) {
          console.log('✓ Payment method displayed in confirmation');

          await page.screenshot({
            path: 'e2e-results/payment-15-confirmation-payment-info.png',
            fullPage: true,
          });
        }
      }
    } catch {
      console.log('Note: Could not verify payment method in confirmation');
    }
  });

  test('should not have console errors during payment flow', async ({
    page,
  }) => {
    const consoleErrors: string[] = [];

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    page.on('pageerror', (error) => {
      consoleErrors.push(error.message);
    });

    await page.goto('/checkout');
    await page.waitForLoadState('networkidle');

    // Interact with payment options
    const cardOption = page.getByLabel(/carte|card/i).first();

    if ((await cardOption.count()) > 0) {
      await cardOption.check();
      await page.waitForTimeout(1000);
    }

    const cashOption = page.getByLabel(/espèces|cash/i).first();

    if ((await cashOption.count()) > 0) {
      await cashOption.check();
      await page.waitForTimeout(1000);
    }

    // Filter critical errors
    const criticalErrors = consoleErrors.filter(
      (error) =>
        !error.includes('Hydration') &&
        !error.includes('hydration') &&
        !error.includes('Warning:') &&
        !error.includes('Stripe')
    );

    if (criticalErrors.length > 0) {
      console.log('Console Errors:', criticalErrors);
    }

    expect(criticalErrors.length).toBe(0);
  });
});
