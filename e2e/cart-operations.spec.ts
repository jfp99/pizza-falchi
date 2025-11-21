import { test, expect } from '@playwright/test';

/**
 * E2E Test: Cart Operations
 * Tests shopping cart functionality including add, remove, update, and persistence
 */

test.describe('Cart Operations', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test
    await page.goto('/menu');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    await page.waitForLoadState('networkidle');
  });

  test('should add product to cart', async ({ page }) => {
    // Wait for products to load
    await page.waitForResponse((response) =>
      response.url().includes('/api/products')
    );

    // Find first "Ajouter" or "Add to cart" button
    const addButton = page
      .getByRole('button', { name: /ajouter|add.*cart/i })
      .or(page.locator('button').filter({ hasText: /ajouter|add/i }));

    await addButton.first().click();

    // Wait for cart update animation
    await page.waitForTimeout(500);

    // Check cart icon has badge or count
    const cartBadge = page.locator('[data-testid="cart-badge"]').or(
      page.locator('[class*="badge"], [class*="count"]').filter({
        hasText: /\d+/,
      })
    );

    await expect(cartBadge.first()).toBeVisible();

    // Verify toast notification appears
    const toast = page.locator('[class*="toast"], [role="alert"]');
    await expect(toast.first()).toBeVisible({ timeout: 3000 });

    await page.screenshot({
      path: 'e2e-results/cart-add-product.png',
      fullPage: true,
    });
  });

  test('should open cart sidebar', async ({ page }) => {
    // Add a product first
    await page.waitForResponse((response) =>
      response.url().includes('/api/products')
    );

    const addButton = page
      .getByRole('button', { name: /ajouter|add.*cart/i })
      .or(page.locator('button').filter({ hasText: /ajouter|add/i }));
    await addButton.first().click();
    await page.waitForTimeout(500);

    // Click cart icon to open sidebar
    const cartIcon = page
      .getByRole('button', { name: /panier|cart/i })
      .or(
        page
          .locator('button, a')
          .filter({ has: page.locator('svg, [class*="cart"]') })
      );

    await cartIcon.first().click();
    await page.waitForTimeout(300);

    // Verify cart sidebar is visible
    const cartSidebar = page.locator('[data-testid="cart-sidebar"]').or(
      page.locator('[class*="sidebar"], aside, [role="dialog"]').filter({
        has: page.locator('text=/panier|cart/i'),
      })
    );

    await expect(cartSidebar.first()).toBeVisible();

    await page.screenshot({
      path: 'e2e-results/cart-sidebar-open.png',
      fullPage: true,
    });
  });

  test('should display cart items with correct details', async ({ page }) => {
    // Add a product
    await page.waitForResponse((response) =>
      response.url().includes('/api/products')
    );

    const addButton = page
      .getByRole('button', { name: /ajouter|add.*cart/i })
      .first();
    await addButton.click();
    await page.waitForTimeout(500);

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

    // Verify cart item has name, price, quantity
    const cartItem = page.locator('[data-testid="cart-item"]').or(
      page.locator('[class*="cart-item"], [class*="item"]').filter({
        has: page.locator('text=/€/'),
      })
    );

    await expect(cartItem.first()).toBeVisible();

    // Should have product name
    const itemName = cartItem.first().locator('text=/.+/').first();
    await expect(itemName).toBeVisible();

    // Should have price
    const itemPrice = cartItem.first().locator('text=/€/');
    await expect(itemPrice).toBeVisible();

    // Should have quantity indicator
    const quantity = cartItem.first().locator('text=/\d+/');
    await expect(quantity).toBeVisible();
  });

  test('should increase product quantity', async ({ page }) => {
    // Add a product
    await page.waitForResponse((response) =>
      response.url().includes('/api/products')
    );

    const addButton = page
      .getByRole('button', { name: /ajouter|add.*cart/i })
      .first();
    await addButton.click();
    await page.waitForTimeout(500);

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

    // Find increment button (usually a + button)
    const incrementButton = page
      .getByRole('button', { name: /\+|plus|increment/i })
      .or(page.locator('button').filter({ hasText: /\+/ }));

    await incrementButton.first().click();
    await page.waitForTimeout(300);

    // Verify quantity increased (should show 2)
    const quantityDisplay = page.locator('text=/[^\d]2[^\d]|^2$/');
    await expect(quantityDisplay.first()).toBeVisible();

    await page.screenshot({
      path: 'e2e-results/cart-increase-quantity.png',
      fullPage: true,
    });
  });

  test('should decrease product quantity', async ({ page }) => {
    // Add a product twice
    await page.waitForResponse((response) =>
      response.url().includes('/api/products')
    );

    const addButton = page
      .getByRole('button', { name: /ajouter|add.*cart/i })
      .first();
    await addButton.click();
    await page.waitForTimeout(300);
    await addButton.click();
    await page.waitForTimeout(300);

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

    // Find decrement button (usually a - button)
    const decrementButton = page
      .getByRole('button', { name: /\-|minus|decrement/i })
      .or(page.locator('button').filter({ hasText: /[\-−]/ }));

    await decrementButton.first().click();
    await page.waitForTimeout(300);

    // Verify quantity decreased (should show 1)
    const quantityDisplay = page.locator('text=/[^\d]1[^\d]|^1$/');
    await expect(quantityDisplay.first()).toBeVisible();

    await page.screenshot({
      path: 'e2e-results/cart-decrease-quantity.png',
      fullPage: true,
    });
  });

  test('should remove product from cart', async ({ page }) => {
    // Add a product
    await page.waitForResponse((response) =>
      response.url().includes('/api/products')
    );

    const addButton = page
      .getByRole('button', { name: /ajouter|add.*cart/i })
      .first();
    await addButton.click();
    await page.waitForTimeout(500);

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

    // Find remove/delete button
    const removeButton = page
      .getByRole('button', {
        name: /supprimer|remove|delete|retirer|trash/i,
      })
      .or(
        page.locator('button').filter({
          has: page.locator('svg[class*="trash"], [data-icon*="trash"]'),
        })
      );

    // If decrement button exists and quantity is 1, use it to remove
    const decrementButton = page
      .getByRole('button', { name: /\-|minus|decrement/i })
      .or(page.locator('button').filter({ hasText: /[\-−]/ }));

    const decrementCount = await decrementButton.count();
    const removeCount = await removeButton.count();

    if (decrementCount > 0) {
      await decrementButton.first().click();
    } else if (removeCount > 0) {
      await removeButton.first().click();
    }

    await page.waitForTimeout(500);

    // Verify cart is empty or shows empty message
    const emptyMessage = page.locator(
      'text=/panier.*vide|cart.*empty|aucun.*produit/i'
    );
    const cartItems = page.locator('[data-testid="cart-item"]');

    const isEmptyMessageVisible = await emptyMessage.isVisible();
    const cartItemCount = await cartItems.count();

    expect(isEmptyMessageVisible || cartItemCount === 0).toBeTruthy();

    await page.screenshot({
      path: 'e2e-results/cart-remove-product.png',
      fullPage: true,
    });
  });

  test('should calculate cart total correctly', async ({ page }) => {
    // Add multiple products
    await page.waitForResponse((response) =>
      response.url().includes('/api/products')
    );

    const addButtons = page
      .getByRole('button', { name: /ajouter|add.*cart/i })
      .or(page.locator('button').filter({ hasText: /ajouter|add/i }));

    // Add first product twice
    await addButtons.first().click();
    await page.waitForTimeout(300);
    await addButtons.first().click();
    await page.waitForTimeout(300);

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

    // Verify total price exists and is a valid number
    const totalPrice = page
      .locator('[data-testid="cart-total"]')
      .or(
        page
          .locator('text=/total|sous-total|subtotal/i')
          .locator('..')
          .locator('text=/€/')
      );

    await expect(totalPrice.first()).toBeVisible();

    const totalText = await totalPrice.first().textContent();
    const priceMatch = totalText?.match(/[\d,.]+/);
    expect(priceMatch).toBeTruthy();

    const price = parseFloat(priceMatch![0].replace(',', '.'));
    expect(price).toBeGreaterThan(0);

    await page.screenshot({
      path: 'e2e-results/cart-total-calculation.png',
      fullPage: true,
    });
  });

  test('should persist cart after page reload', async ({ page }) => {
    // Add a product
    await page.waitForResponse((response) =>
      response.url().includes('/api/products')
    );

    const addButton = page
      .getByRole('button', { name: /ajouter|add.*cart/i })
      .first();
    await addButton.click();
    await page.waitForTimeout(500);

    // Reload page
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Verify cart badge still shows item count
    const cartBadge = page.locator('[data-testid="cart-badge"]').or(
      page.locator('[class*="badge"], [class*="count"]').filter({
        hasText: /\d+/,
      })
    );

    await expect(cartBadge.first()).toBeVisible();

    // Open cart and verify item is still there
    const cartIcon = page
      .getByRole('button', { name: /panier|cart/i })
      .or(
        page
          .locator('button, a')
          .filter({ has: page.locator('svg, [class*="cart"]') })
      );
    await cartIcon.first().click();
    await page.waitForTimeout(300);

    const cartItem = page.locator('[data-testid="cart-item"]').or(
      page.locator('[class*="cart-item"], [class*="item"]').filter({
        has: page.locator('text=/€/'),
      })
    );

    await expect(cartItem.first()).toBeVisible();

    await page.screenshot({
      path: 'e2e-results/cart-persistence.png',
      fullPage: true,
    });
  });

  test('should navigate to checkout from cart', async ({ page }) => {
    // Add a product
    await page.waitForResponse((response) =>
      response.url().includes('/api/products')
    );

    const addButton = page
      .getByRole('button', { name: /ajouter|add.*cart/i })
      .first();
    await addButton.click();
    await page.waitForTimeout(500);

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

    // Find and click checkout button
    const checkoutButton = page
      .getByRole('button', { name: /commander|checkout|passer.*commande/i })
      .or(
        page.locator('button, a').filter({
          hasText: /commander|checkout|passer.*commande/i,
        })
      );

    await checkoutButton.first().click();
    await page.waitForLoadState('networkidle');

    // Verify navigation to checkout or cart page
    expect(page.url()).toMatch(/checkout|cart|panier/i);

    await page.screenshot({
      path: 'e2e-results/cart-navigate-checkout.png',
      fullPage: true,
    });
  });

  test('should show empty cart message when cart is empty', async ({
    page,
  }) => {
    // Open cart without adding any products
    const cartIcon = page
      .getByRole('button', { name: /panier|cart/i })
      .or(
        page
          .locator('button, a')
          .filter({ has: page.locator('svg, [class*="cart"]') })
      );

    await cartIcon.first().click();
    await page.waitForTimeout(300);

    // Verify empty message is displayed
    const emptyMessage = page.locator(
      'text=/panier.*vide|cart.*empty|aucun.*produit|no.*item/i'
    );

    await expect(emptyMessage.first()).toBeVisible();

    await page.screenshot({
      path: 'e2e-results/cart-empty-state.png',
      fullPage: true,
    });
  });

  test('should close cart sidebar', async ({ page }) => {
    // Add a product and open cart
    await page.waitForResponse((response) =>
      response.url().includes('/api/products')
    );

    const addButton = page
      .getByRole('button', { name: /ajouter|add.*cart/i })
      .first();
    await addButton.click();
    await page.waitForTimeout(500);

    const cartIcon = page
      .getByRole('button', { name: /panier|cart/i })
      .or(
        page
          .locator('button, a')
          .filter({ has: page.locator('svg, [class*="cart"]') })
      );
    await cartIcon.first().click();
    await page.waitForTimeout(300);

    // Find and click close button
    const closeButton = page
      .getByRole('button', { name: /fermer|close|×/i })
      .or(
        page.locator('button').filter({
          hasText: /×|✕|close/i,
        })
      );

    await closeButton.first().click();
    await page.waitForTimeout(300);

    // Verify cart sidebar is hidden
    const cartSidebar = page.locator('[data-testid="cart-sidebar"]').or(
      page.locator('[class*="sidebar"], aside, [role="dialog"]').filter({
        has: page.locator('text=/panier|cart/i'),
      })
    );

    await expect(cartSidebar.first()).not.toBeVisible();

    await page.screenshot({
      path: 'e2e-results/cart-close-sidebar.png',
      fullPage: true,
    });
  });

  test('should handle keyboard navigation in cart', async ({ page }) => {
    // Add a product
    await page.waitForResponse((response) =>
      response.url().includes('/api/products')
    );

    const addButton = page
      .getByRole('button', { name: /ajouter|add.*cart/i })
      .first();
    await addButton.click();
    await page.waitForTimeout(500);

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

    // Test Tab navigation
    await page.keyboard.press('Tab');
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();

    // Test Escape to close
    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);

    // Cart sidebar should be closed
    const cartSidebar = page.locator('[data-testid="cart-sidebar"]').or(
      page.locator('[class*="sidebar"], aside, [role="dialog"]').filter({
        has: page.locator('text=/panier|cart/i'),
      })
    );

    // Check if sidebar is hidden (not visible or removed from DOM)
    const isVisible = await cartSidebar.first().isVisible().catch(() => false);
    expect(isVisible).toBeFalsy();
  });

  test('should not have console errors during cart operations', async ({
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

    // Perform cart operations
    await page.waitForResponse((response) =>
      response.url().includes('/api/products')
    );

    const addButton = page
      .getByRole('button', { name: /ajouter|add.*cart/i })
      .first();
    await addButton.click();
    await page.waitForTimeout(500);

    const cartIcon = page
      .getByRole('button', { name: /panier|cart/i })
      .or(
        page
          .locator('button, a')
          .filter({ has: page.locator('svg, [class*="cart"]') })
      );
    await cartIcon.first().click();
    await page.waitForTimeout(1000);

    // Filter out hydration errors (common in development)
    const criticalErrors = consoleErrors.filter(
      (error) =>
        !error.includes('Hydration') &&
        !error.includes('hydration') &&
        !error.includes('Warning: ')
    );

    if (criticalErrors.length > 0) {
      console.log('Critical Console Errors:', criticalErrors);
    }

    expect(criticalErrors.length).toBe(0);
  });
});
