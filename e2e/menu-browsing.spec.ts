import { test, expect } from '@playwright/test';

/**
 * E2E Test: Menu Browsing and Category Filtering
 * Tests the menu page functionality including product display and category filters
 */

test.describe('Menu Browsing', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/menu');
    await page.waitForLoadState('networkidle');
  });

  test('should load menu page successfully', async ({ page }) => {
    // Check page title
    await expect(page).toHaveTitle(/menu|carte/i);

    // Check for main heading
    const heading = page.locator('h1');
    await expect(heading).toBeVisible();

    // Wait for products to load
    await page.waitForResponse(
      (response) =>
        response.url().includes('/api/products') && response.status() === 200
    );

    // Take screenshot
    await page.screenshot({
      path: 'e2e-results/menu-loaded.png',
      fullPage: true,
    });
  });

  test('should display product cards', async ({ page }) => {
    // Wait for products API response
    const productsResponse = await page.waitForResponse(
      (response) => response.url().includes('/api/products')
    );

    const products = await productsResponse.json();
    expect(products.length).toBeGreaterThan(0);

    // Check if product cards are visible
    const productCards = page.locator('[data-testid="product-card"]').or(
      page.locator('article, [class*="product"], [class*="card"]').filter({
        has: page.locator('img'),
      })
    );

    const count = await productCards.count();
    expect(count).toBeGreaterThan(0);

    // Verify first product card has required elements
    const firstCard = productCards.first();
    await expect(firstCard).toBeVisible();

    // Should have image
    const image = firstCard.locator('img');
    await expect(image).toBeVisible();

    // Should have product name
    const name = firstCard.locator('h2, h3, [class*="name"], [class*="title"]');
    await expect(name).toBeVisible();

    // Should have price
    const price = firstCard.locator('text=/€|EUR/i');
    await expect(price).toBeVisible();
  });

  test('should filter products by Pizza category', async ({ page }) => {
    // Find and click Pizza category filter
    const pizzaFilter = page
      .getByRole('button', { name: /pizza/i })
      .or(page.locator('button, a').filter({ hasText: /pizza/i }));

    await pizzaFilter.first().click();
    await page.waitForTimeout(500); // Wait for filter animation

    // Wait for filtered response
    await page.waitForResponse(
      (response) =>
        response.url().includes('/api/products') &&
        response.url().includes('category=pizza')
    );

    // Verify URL has pizza filter
    expect(page.url()).toContain('pizza');

    await page.screenshot({
      path: 'e2e-results/menu-pizza-filter.png',
      fullPage: true,
    });
  });

  test('should filter products by Boisson category', async ({ page }) => {
    // Find and click Boisson category filter
    const boissonFilter = page
      .getByRole('button', { name: /boisson|drink/i })
      .or(page.locator('button, a').filter({ hasText: /boisson|drink/i }));

    await boissonFilter.first().click();
    await page.waitForTimeout(500);

    // Verify URL has boisson filter
    expect(page.url()).toContain('boisson');

    await page.screenshot({
      path: 'e2e-results/menu-boisson-filter.png',
      fullPage: true,
    });
  });

  test('should filter products by Dessert category', async ({ page }) => {
    // Find and click Dessert category filter
    const dessertFilter = page
      .getByRole('button', { name: /dessert/i })
      .or(page.locator('button, a').filter({ hasText: /dessert/i }));

    await dessertFilter.first().click();
    await page.waitForTimeout(500);

    // Verify URL has dessert filter
    expect(page.url()).toContain('dessert');

    await page.screenshot({
      path: 'e2e-results/menu-dessert-filter.png',
      fullPage: true,
    });
  });

  test('should filter products by Accompagnement category', async ({ page }) => {
    // Find and click Accompagnement category filter
    const accompagnementFilter = page
      .getByRole('button', { name: /accompagnement|side/i })
      .or(
        page.locator('button, a').filter({ hasText: /accompagnement|side/i })
      );

    await accompagnementFilter.first().click();
    await page.waitForTimeout(500);

    // Verify URL has accompagnement filter
    expect(page.url()).toContain('accompagnement');

    await page.screenshot({
      path: 'e2e-results/menu-accompagnement-filter.png',
      fullPage: true,
    });
  });

  test('should show all products when clicking "Tous" filter', async ({
    page,
  }) => {
    // First apply a filter
    const pizzaFilter = page
      .getByRole('button', { name: /pizza/i })
      .or(page.locator('button, a').filter({ hasText: /pizza/i }));
    await pizzaFilter.first().click();
    await page.waitForTimeout(500);

    // Then click "Tous" to show all products
    const allFilter = page
      .getByRole('button', { name: /tous|all/i })
      .or(page.locator('button, a').filter({ hasText: /tous|all/i }));

    await allFilter.first().click();
    await page.waitForTimeout(500);

    // Verify URL doesn't have category filter
    expect(page.url()).not.toContain('category=');

    await page.screenshot({
      path: 'e2e-results/menu-all-filter.png',
      fullPage: true,
    });
  });

  test('should display product details', async ({ page }) => {
    // Wait for products to load
    await page.waitForResponse((response) =>
      response.url().includes('/api/products')
    );

    // Find product cards
    const productCards = page.locator('[data-testid="product-card"]').or(
      page.locator('article, [class*="product"], [class*="card"]').filter({
        has: page.locator('img'),
      })
    );

    const firstCard = productCards.first();
    await firstCard.waitFor({ state: 'visible' });

    // Verify product has description or ingredients
    const hasDescription =
      (await firstCard.locator('p, [class*="description"]').count()) > 0;
    const hasIngredients =
      (await firstCard.locator('text=/ingrédient|ingredient/i').count()) > 0;

    // At least one should be visible
    expect(hasDescription || hasIngredients).toBeTruthy();
  });

  test('should have accessible navigation', async ({ page }) => {
    // Check keyboard navigation
    await page.keyboard.press('Tab');
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();

    // Check ARIA labels
    const buttons = page.locator('button');
    const buttonCount = await buttons.count();

    for (let i = 0; i < Math.min(buttonCount, 5); i++) {
      const button = buttons.nth(i);
      const ariaLabel = await button.getAttribute('aria-label');
      const text = await button.textContent();

      // Button should have either aria-label or text content
      expect(ariaLabel || text).toBeTruthy();
    }
  });

  test('should handle empty product list gracefully', async ({ page }) => {
    // Try to filter to a category that might be empty
    await page.goto('/menu?category=nonexistent');
    await page.waitForLoadState('networkidle');

    // Should show either products or an empty state message
    const hasProducts =
      (await page
        .locator('[data-testid="product-card"]')
        .or(page.locator('article, [class*="product"]'))
        .count()) > 0;
    const hasEmptyMessage =
      (await page.locator('text=/aucun produit|no product|empty/i').count()) >
      0;

    // Either should be true
    expect(hasProducts || hasEmptyMessage).toBeTruthy();
  });

  test('should not have console errors', async ({ page }) => {
    const consoleErrors: string[] = [];

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    page.on('pageerror', (error) => {
      consoleErrors.push(error.message);
    });

    await page.waitForTimeout(2000);

    if (consoleErrors.length > 0) {
      console.log('Console Errors Found:', consoleErrors);
    }

    // Allow hydration errors in development
    const criticalErrors = consoleErrors.filter(
      (error) => !error.includes('Hydration') && !error.includes('hydration')
    );

    expect(criticalErrors.length).toBe(0);
  });

  test('should have responsive design', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForLoadState('networkidle');

    const productCards = page.locator('[data-testid="product-card"]').or(
      page.locator('article, [class*="product"]')
    );
    await expect(productCards.first()).toBeVisible();

    await page.screenshot({
      path: 'e2e-results/menu-mobile.png',
      fullPage: true,
    });

    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForLoadState('networkidle');
    await expect(productCards.first()).toBeVisible();

    await page.screenshot({
      path: 'e2e-results/menu-tablet.png',
      fullPage: true,
    });

    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.waitForLoadState('networkidle');
    await expect(productCards.first()).toBeVisible();

    await page.screenshot({
      path: 'e2e-results/menu-desktop.png',
      fullPage: true,
    });
  });
});
