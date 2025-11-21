import { test, expect } from '@playwright/test';

/**
 * E2E Test: Complete Checkout Flow
 * Tests the end-to-end order submission process from cart to confirmation
 */

test.describe('Checkout Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage and start fresh
    await page.goto('/menu');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Add a product to cart for checkout tests
    await page.waitForResponse((response) =>
      response.url().includes('/api/products')
    );

    const addButton = page
      .getByRole('button', { name: /ajouter|add.*cart/i })
      .first();
    await addButton.click();
    await page.waitForTimeout(500);
  });

  test('should navigate to checkout page', async ({ page }) => {
    // Open cart
    const cartIcon = page
      .getByRole('button', { name: /panier|cart/i })
      .or(
        page
          .locator('button, a')
          .filter({ has: page.locator('svg, [class*="cart"]') })
      );
    await cartIcon.first().click();
    await page.waitForTimeout(300);

    // Click checkout button
    const checkoutButton = page
      .getByRole('button', { name: /commander|checkout|passer.*commande/i })
      .or(
        page.locator('button, a').filter({
          hasText: /commander|checkout|passer.*commande/i,
        })
      );

    await checkoutButton.first().click();
    await page.waitForLoadState('networkidle');

    // Verify we're on checkout/cart page
    expect(page.url()).toMatch(/checkout|cart|panier/i);

    await page.screenshot({
      path: 'e2e-results/checkout-page-loaded.png',
      fullPage: true,
    });
  });

  test('should display cart items in checkout', async ({ page }) => {
    await page.goto('/checkout');
    await page.waitForLoadState('networkidle');

    // Verify cart items are displayed
    const cartItems = page.locator('[data-testid="cart-item"]').or(
      page.locator('[class*="cart-item"], [class*="item"]').filter({
        has: page.locator('text=/€/'),
      })
    );

    // Should have at least one item
    const count = await cartItems.count();
    expect(count).toBeGreaterThan(0);

    await page.screenshot({
      path: 'e2e-results/checkout-items-displayed.png',
      fullPage: true,
    });
  });

  test('should display order summary with totals', async ({ page }) => {
    await page.goto('/checkout');
    await page.waitForLoadState('networkidle');

    // Check for subtotal
    const subtotal = page.locator('text=/sous-total|subtotal/i');
    await expect(subtotal.first()).toBeVisible();

    // Check for total
    const total = page.locator('text=/total/i');
    await expect(total.first()).toBeVisible();

    // Verify total has a price
    const totalPrice = page.locator('text=/total/i').locator('..').locator('text=/€/');
    await expect(totalPrice.first()).toBeVisible();

    await page.screenshot({
      path: 'e2e-results/checkout-order-summary.png',
      fullPage: true,
    });
  });

  test('should have customer information form', async ({ page }) => {
    await page.goto('/checkout');
    await page.waitForLoadState('networkidle');

    // Check for name input
    const nameInput = page
      .getByLabel(/nom|name/i)
      .or(page.locator('input[name*="name"], input[placeholder*="nom"]'));
    await expect(nameInput.first()).toBeVisible();

    // Check for phone input
    const phoneInput = page
      .getByLabel(/téléphone|phone/i)
      .or(
        page.locator('input[name*="phone"], input[type="tel"], input[placeholder*="téléphone"]')
      );
    await expect(phoneInput.first()).toBeVisible();

    // Check for email input (optional)
    const emailInput = page
      .getByLabel(/email|e-mail/i)
      .or(
        page.locator('input[name*="email"], input[type="email"]')
      );
    const emailCount = await emailInput.count();

    // Email might be optional, so we just check it exists if it's there
    if (emailCount > 0) {
      await expect(emailInput.first()).toBeVisible();
    }

    await page.screenshot({
      path: 'e2e-results/checkout-customer-form.png',
      fullPage: true,
    });
  });

  test('should have delivery type selection (pickup vs delivery)', async ({
    page,
  }) => {
    await page.goto('/checkout');
    await page.waitForLoadState('networkidle');

    // Check for delivery type selection
    const pickupOption = page
      .getByLabel(/à emporter|pickup|retrait/i)
      .or(
        page.locator('input[type="radio"][value*="pickup"]')
      );

    const deliveryOption = page
      .getByLabel(/livraison|delivery/i)
      .or(
        page.locator('input[type="radio"][value*="delivery"]')
      );

    // At least one delivery type option should exist
    const pickupCount = await pickupOption.count();
    const deliveryCount = await deliveryOption.count();

    expect(pickupCount + deliveryCount).toBeGreaterThan(0);

    await page.screenshot({
      path: 'e2e-results/checkout-delivery-type.png',
      fullPage: true,
    });
  });

  test('should fill customer information for pickup order', async ({
    page,
  }) => {
    await page.goto('/checkout');
    await page.waitForLoadState('networkidle');

    // Fill customer name
    const nameInput = page
      .getByLabel(/nom|name/i)
      .or(page.locator('input[name*="name"], input[placeholder*="nom"]'));
    await nameInput.first().fill('Jean Dupont');

    // Fill phone number
    const phoneInput = page
      .getByLabel(/téléphone|phone/i)
      .or(
        page.locator('input[name*="phone"], input[type="tel"]')
      );
    await phoneInput.first().fill('0612345678');

    // Select pickup if available
    const pickupOption = page
      .getByLabel(/à emporter|pickup|retrait/i)
      .or(
        page.locator('input[type="radio"][value*="pickup"]')
      );

    const pickupCount = await pickupOption.count();
    if (pickupCount > 0) {
      await pickupOption.first().click();
    }

    await page.waitForTimeout(500);

    await page.screenshot({
      path: 'e2e-results/checkout-pickup-info-filled.png',
      fullPage: true,
    });
  });

  test('should show address fields when delivery is selected', async ({
    page,
  }) => {
    await page.goto('/checkout');
    await page.waitForLoadState('networkidle');

    // Select delivery option
    const deliveryOption = page
      .getByLabel(/livraison|delivery/i)
      .or(
        page.locator('input[type="radio"][value*="delivery"]')
      );

    const deliveryCount = await deliveryOption.count();
    if (deliveryCount > 0) {
      await deliveryOption.first().click();
      await page.waitForTimeout(500);

      // Check for address fields
      const addressInput = page
        .getByLabel(/adresse|address|rue|street/i)
        .or(
          page.locator('input[name*="address"], input[placeholder*="adresse"]')
        );

      await expect(addressInput.first()).toBeVisible();

      await page.screenshot({
        path: 'e2e-results/checkout-delivery-address-fields.png',
        fullPage: true,
      });
    } else {
      // Skip test if delivery option not available
      test.skip();
    }
  });

  test('should fill complete delivery information', async ({ page }) => {
    await page.goto('/checkout');
    await page.waitForLoadState('networkidle');

    // Fill customer name
    const nameInput = page
      .getByLabel(/nom|name/i)
      .or(page.locator('input[name*="name"]'));
    await nameInput.first().fill('Marie Martin');

    // Fill phone
    const phoneInput = page
      .getByLabel(/téléphone|phone/i)
      .or(page.locator('input[name*="phone"], input[type="tel"]'));
    await phoneInput.first().fill('0623456789');

    // Select delivery
    const deliveryOption = page
      .getByLabel(/livraison|delivery/i)
      .or(page.locator('input[type="radio"][value*="delivery"]'));

    const deliveryCount = await deliveryOption.count();
    if (deliveryCount > 0) {
      await deliveryOption.first().click();
      await page.waitForTimeout(500);

      // Fill address
      const addressInput = page
        .getByLabel(/adresse|address|rue|street/i)
        .or(page.locator('input[name*="address"]'));
      await addressInput.first().fill('123 Rue de la Paix');

      // Fill city if available
      const cityInput = page.getByLabel(/ville|city/i).or(
        page.locator('input[name*="city"]')
      );
      const cityCount = await cityInput.count();
      if (cityCount > 0) {
        await cityInput.first().fill('Puyricard');
      }

      // Fill postal code if available
      const postalInput = page
        .getByLabel(/code postal|postal.*code|zip/i)
        .or(page.locator('input[name*="postal"]'));
      const postalCount = await postalInput.count();
      if (postalCount > 0) {
        await postalInput.first().fill('13540');
      }

      await page.screenshot({
        path: 'e2e-results/checkout-delivery-info-filled.png',
        fullPage: true,
      });
    } else {
      test.skip();
    }
  });

  test('should validate required fields', async ({ page }) => {
    await page.goto('/checkout');
    await page.waitForLoadState('networkidle');

    // Try to submit without filling required fields
    const submitButton = page
      .getByRole('button', { name: /commander|valider|submit|place.*order/i })
      .or(
        page.locator('button[type="submit"]')
      );

    await submitButton.first().click();
    await page.waitForTimeout(1000);

    // Should show validation errors or prevent submission
    const errorMessages = page.locator(
      'text=/requis|required|obligatoire|invalid|invalide/i'
    );
    const hasErrors = (await errorMessages.count()) > 0;

    // Or check if form has invalid state
    const invalidInputs = page.locator('input:invalid, [aria-invalid="true"]');
    const hasInvalidInputs = (await invalidInputs.count()) > 0;

    // At least one validation should trigger
    expect(hasErrors || hasInvalidInputs).toBeTruthy();

    await page.screenshot({
      path: 'e2e-results/checkout-validation-errors.png',
      fullPage: true,
    });
  });

  test('should submit pickup order successfully', async ({ page }) => {
    await page.goto('/checkout');
    await page.waitForLoadState('networkidle');

    // Fill required fields
    const nameInput = page
      .getByLabel(/nom|name/i)
      .or(page.locator('input[name*="name"]'));
    await nameInput.first().fill('Test User');

    const phoneInput = page
      .getByLabel(/téléphone|phone/i)
      .or(page.locator('input[name*="phone"], input[type="tel"]'));
    await phoneInput.first().fill('0612345678');

    // Select pickup
    const pickupOption = page
      .getByLabel(/à emporter|pickup|retrait/i)
      .or(page.locator('input[type="radio"][value*="pickup"]'));

    const pickupCount = await pickupOption.count();
    if (pickupCount > 0) {
      await pickupOption.first().click();
      await page.waitForTimeout(300);
    }

    // Submit order
    const submitButton = page
      .getByRole('button', { name: /commander|valider|submit|place.*order/i })
      .or(page.locator('button[type="submit"]'));

    // Wait for order API response
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

      console.log('Order submission status:', status);

      if (status === 201 || status === 200) {
        // Success - should navigate to confirmation page or show success message
        await page.waitForLoadState('networkidle', { timeout: 5000 });

        // Check for success indicators
        const successMessage = page.locator(
          'text=/merci|thank.*you|success|confirmé|confirmed/i'
        );
        const confirmationPage = page.url().includes('confirmation');

        const isSuccess =
          confirmationPage || (await successMessage.count()) > 0;
        expect(isSuccess).toBeTruthy();

        await page.screenshot({
          path: 'e2e-results/checkout-order-submitted.png',
          fullPage: true,
        });
      } else {
        // Handle error responses
        console.log('Order submission failed with status:', status);
        const responseBody = await orderResponse.json();
        console.log('Error response:', responseBody);

        // Check for error message display
        const errorMessage = page.locator('text=/erreur|error/i');
        await expect(errorMessage.first()).toBeVisible({ timeout: 3000 });
      }
    } catch (error) {
      console.error('Error waiting for order response:', error);
      // Take screenshot of current state
      await page.screenshot({
        path: 'e2e-results/checkout-order-error.png',
        fullPage: true,
      });
      throw error;
    }
  });

  test('should handle payment method selection', async ({ page }) => {
    await page.goto('/checkout');
    await page.waitForLoadState('networkidle');

    // Check for payment method options
    const cashOption = page
      .getByLabel(/espèces|cash|liquide/i)
      .or(page.locator('input[value*="cash"]'));

    const cardOption = page
      .getByLabel(/carte|card|cb/i)
      .or(page.locator('input[value*="card"]'));

    const paymentCount =
      (await cashOption.count()) + (await cardOption.count());

    if (paymentCount > 0) {
      // Select cash payment
      if ((await cashOption.count()) > 0) {
        await cashOption.first().click();
        await page.waitForTimeout(300);
      }

      await page.screenshot({
        path: 'e2e-results/checkout-payment-method.png',
        fullPage: true,
      });
    } else {
      // Payment method might be set by default
      console.log('No payment method selection found - might be pre-selected');
    }
  });

  test('should display delivery fee for delivery orders', async ({ page }) => {
    await page.goto('/checkout');
    await page.waitForLoadState('networkidle');

    // Select delivery option
    const deliveryOption = page
      .getByLabel(/livraison|delivery/i)
      .or(page.locator('input[type="radio"][value*="delivery"]'));

    const deliveryCount = await deliveryOption.count();
    if (deliveryCount > 0) {
      await deliveryOption.first().click();
      await page.waitForTimeout(500);

      // Check for delivery fee line item
      const deliveryFee = page.locator(
        'text=/frais.*livraison|delivery.*fee|livraison/i'
      );
      await expect(deliveryFee.first()).toBeVisible();

      await page.screenshot({
        path: 'e2e-results/checkout-delivery-fee.png',
        fullPage: true,
      });
    } else {
      test.skip();
    }
  });

  test('should handle order notes/comments', async ({ page }) => {
    await page.goto('/checkout');
    await page.waitForLoadState('networkidle');

    // Look for notes/comments textarea
    const notesInput = page
      .getByLabel(/notes|commentaire|instructions/i)
      .or(page.locator('textarea[name*="note"], textarea[placeholder*="note"]'));

    const notesCount = await notesInput.count();
    if (notesCount > 0) {
      await notesInput.first().fill('Sans oignons svp');
      await page.waitForTimeout(300);

      await page.screenshot({
        path: 'e2e-results/checkout-order-notes.png',
        fullPage: true,
      });
    } else {
      console.log('No order notes field found');
    }
  });

  test('should not have console errors during checkout', async ({ page }) => {
    const consoleErrors: string[] = [];

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    page.on('pageerror', (error) => {
      consoleErrors.push(error.message);
    });

    // Navigate and fill form
    await page.goto('/checkout');
    await page.waitForLoadState('networkidle');

    const nameInput = page
      .getByLabel(/nom|name/i)
      .or(page.locator('input[name*="name"]'));
    await nameInput.first().fill('Test User');

    const phoneInput = page
      .getByLabel(/téléphone|phone/i)
      .or(page.locator('input[name*="phone"]'));
    await phoneInput.first().fill('0612345678');

    await page.waitForTimeout(2000);

    // Filter critical errors
    const criticalErrors = consoleErrors.filter(
      (error) =>
        !error.includes('Hydration') &&
        !error.includes('hydration') &&
        !error.includes('Warning:')
    );

    if (criticalErrors.length > 0) {
      console.log('Critical Console Errors:', criticalErrors);
    }

    expect(criticalErrors.length).toBe(0);
  });

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/checkout');
    await page.waitForLoadState('networkidle');

    // Verify form is visible and usable
    const nameInput = page
      .getByLabel(/nom|name/i)
      .or(page.locator('input[name*="name"]'));
    await expect(nameInput.first()).toBeVisible();

    await page.screenshot({
      path: 'e2e-results/checkout-mobile.png',
      fullPage: true,
    });
  });
});
