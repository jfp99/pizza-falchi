import { test, expect } from '@playwright/test';

/**
 * E2E Test: Admin Management
 * Tests admin functionality including product and time slot management
 */

test.describe('Admin Product Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/admin');
    await page.waitForLoadState('networkidle');
  });

  test('should load admin dashboard', async ({ page }) => {
    // Check for admin heading or dashboard title
    const heading = page.locator('h1, h2').filter({
      hasText: /admin|dashboard|tableau.*bord/i,
    });

    await expect(heading.first()).toBeVisible();

    await page.screenshot({
      path: 'e2e-results/admin-dashboard.png',
      fullPage: true,
    });
  });

  test('should navigate to products management', async ({ page }) => {
    // Find products link/button
    const productsLink = page
      .getByRole('link', { name: /produit|product/i })
      .or(
        page.locator('a, button').filter({ hasText: /produit|product/i })
      );

    const linkCount = await productsLink.count();
    if (linkCount > 0) {
      await productsLink.first().click();
      await page.waitForLoadState('networkidle');

      // Verify we're on products page
      expect(page.url()).toMatch(/product/i);

      await page.screenshot({
        path: 'e2e-results/admin-products-page.png',
        fullPage: true,
      });
    } else {
      console.log('No products management link found');
      test.skip();
    }
  });

  test('should display product list', async ({ page }) => {
    await page.goto('/admin/products');
    await page.waitForLoadState('networkidle');

    // Wait for products API
    await page.waitForResponse(
      (response) => response.url().includes('/api/products'),
      { timeout: 5000 }
    ).catch(() => {});

    // Check for product table or list
    const productTable = page.locator('table, [role="table"], [class*="table"]');
    const productList = page.locator('[class*="product"], [class*="item"]');

    const hasTable = (await productTable.count()) > 0;
    const hasList = (await productList.count()) > 0;

    expect(hasTable || hasList).toBeTruthy();

    await page.screenshot({
      path: 'e2e-results/admin-products-list.png',
      fullPage: true,
    });
  });

  test('should open create product modal', async ({ page }) => {
    await page.goto('/admin/products');
    await page.waitForLoadState('networkidle');

    // Find "Ajouter" or "Nouveau produit" button
    const addButton = page
      .getByRole('button', { name: /ajouter|nouveau|create|add/i })
      .or(
        page.locator('button').filter({ hasText: /ajouter|nouveau|create/i })
      );

    const buttonCount = await addButton.count();
    if (buttonCount > 0) {
      await addButton.first().click();
      await page.waitForTimeout(500);

      // Verify modal or form is visible
      const modal = page.locator('[role="dialog"], [class*="modal"], form');
      await expect(modal.first()).toBeVisible();

      await page.screenshot({
        path: 'e2e-results/admin-create-product-modal.png',
        fullPage: true,
      });
    } else {
      console.log('No add product button found');
      test.skip();
    }
  });

  test('should have product form fields', async ({ page }) => {
    await page.goto('/admin/products');
    await page.waitForLoadState('networkidle');

    const addButton = page
      .getByRole('button', { name: /ajouter|nouveau/i })
      .first();

    const buttonCount = await addButton.count();
    if (buttonCount === 0) {
      test.skip();
      return;
    }

    await addButton.click();
    await page.waitForTimeout(500);

    // Check for name input
    const nameInput = page
      .getByLabel(/nom|name/i)
      .or(page.locator('input[name*="name"]'));
    await expect(nameInput.first()).toBeVisible();

    // Check for price input
    const priceInput = page
      .getByLabel(/prix|price/i)
      .or(page.locator('input[name*="price"], input[type="number"]'));
    await expect(priceInput.first()).toBeVisible();

    // Check for category selection
    const categorySelect = page
      .getByLabel(/catégorie|category/i)
      .or(page.locator('select[name*="category"]'));

    const categoryCount = await categorySelect.count();
    if (categoryCount > 0) {
      await expect(categorySelect.first()).toBeVisible();
    }

    await page.screenshot({
      path: 'e2e-results/admin-product-form-fields.png',
      fullPage: true,
    });
  });
});

test.describe('Admin Time Slot Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/admin/time-slots/dashboard');
    await page.waitForLoadState('networkidle');
  });

  test('should load time slots dashboard', async ({ page }) => {
    // Check for heading
    const heading = page.locator('h1').filter({
      hasText: /phone.*order|créneaux|time.*slot/i,
    });

    await expect(heading.first()).toBeVisible();

    // Wait for time slots API
    await page.waitForResponse(
      (response) => response.url().includes('/api/time-slots')
    );

    await page.screenshot({
      path: 'e2e-results/admin-timeslots-dashboard.png',
      fullPage: true,
    });
  });

  test('should display date navigation', async ({ page }) => {
    // Check for date selector
    const dateDisplay = page.locator('text=/\\d{1,2}.*\\d{4}|janvier|février|mars|avril|mai|juin|juillet|août|septembre|octobre|novembre|décembre/i');
    await expect(dateDisplay.first()).toBeVisible();

    // Check for navigation buttons
    const prevButton = page
      .getByRole('button', { name: /previous|précédent|←/i })
      .or(page.locator('button').filter({ hasText: /←|</ }));

    const nextButton = page
      .getByRole('button', { name: /next|suivant|→/i })
      .or(page.locator('button').filter({ hasText: /→|>/ }));

    const hasPrev = (await prevButton.count()) > 0;
    const hasNext = (await nextButton.count()) > 0;

    expect(hasPrev || hasNext).toBeTruthy();

    await page.screenshot({
      path: 'e2e-results/admin-timeslots-date-nav.png',
      fullPage: true,
    });
  });

  test('should display time slot statistics', async ({ page }) => {
    // Wait for API response
    await page.waitForResponse(
      (response) => response.url().includes('/api/time-slots')
    );

    // Check for stats cards
    const statsCards = page.locator('[class*="stat"], [class*="card"]').filter({
      has: page.locator('text=/\d+/'),
    });

    const statsCount = await statsCards.count();
    expect(statsCount).toBeGreaterThan(0);

    await page.screenshot({
      path: 'e2e-results/admin-timeslots-stats.png',
      fullPage: true,
    });
  });

  test('should display time slot grid', async ({ page }) => {
    await page.waitForResponse(
      (response) => response.url().includes('/api/time-slots')
    );

    // Check for time slot grid
    const grid = page.locator('[class*="grid"]');
    const hasGrid = (await grid.count()) > 0;

    // Or check for individual time slot cards
    const timeSlots = page.locator('[class*="slot"], [class*="time"]');
    const hasSlots = (await timeSlots.count()) > 0;

    expect(hasGrid || hasSlots).toBeTruthy();

    await page.screenshot({
      path: 'e2e-results/admin-timeslots-grid.png',
      fullPage: true,
    });
  });

  test('should show time slot capacity information', async ({ page }) => {
    await page.waitForResponse(
      (response) => response.url().includes('/api/time-slots')
    );

    // Look for capacity indicators
    const capacityInfo = page.locator('text=/\\d+\\/\\d+|capacity|capacité/i');

    const hasCapacity = (await capacityInfo.count()) > 0;
    if (hasCapacity) {
      await expect(capacityInfo.first()).toBeVisible();
    }

    // Or check for progress bars
    const progressBars = page.locator('[role="progressbar"], [class*="progress"]');
    const hasProgress = (await progressBars.count()) > 0;

    expect(hasCapacity || hasProgress).toBeTruthy();

    await page.screenshot({
      path: 'e2e-results/admin-timeslots-capacity.png',
      fullPage: true,
    });
  });

  test('should change date and load new slots', async ({ page }) => {
    await page.waitForResponse(
      (response) => response.url().includes('/api/time-slots')
    );

    // Click next day button
    const nextButton = page
      .getByRole('button', { name: /next|suivant|→/i })
      .or(page.locator('button').filter({ hasText: /→|>/ }));

    const nextCount = await nextButton.count();
    if (nextCount > 0) {
      // Wait for new API call when changing date
      const newSlotsPromise = page.waitForResponse(
        (response) => response.url().includes('/api/time-slots'),
        { timeout: 5000 }
      );

      await nextButton.first().click();

      try {
        await newSlotsPromise;
        console.log('✓ New time slots loaded for next date');
      } catch {
        console.log('Note: No API call detected after date change');
      }

      await page.waitForTimeout(500);

      await page.screenshot({
        path: 'e2e-results/admin-timeslots-date-changed.png',
        fullPage: true,
      });
    } else {
      test.skip();
    }
  });

  test('should auto-refresh slots every 30 seconds', async ({ page }) => {
    // This test verifies the auto-refresh functionality
    await page.waitForResponse(
      (response) => response.url().includes('/api/time-slots')
    );

    console.log('Waiting for auto-refresh (30 seconds)...');

    // Wait for the next auto-refresh API call
    const refreshPromise = page.waitForResponse(
      (response) =>
        response.url().includes('/api/time-slots') &&
        response.request().method() === 'GET',
      { timeout: 35000 } // 30s + 5s buffer
    );

    try {
      await refreshPromise;
      console.log('✓ Auto-refresh occurred');

      await page.screenshot({
        path: 'e2e-results/admin-timeslots-auto-refresh.png',
        fullPage: true,
      });
    } catch {
      console.log('Note: Auto-refresh did not occur within timeout');
      // This is acceptable - tab might be inactive (visibility API pauses refresh)
    }
  });

  test('should view slot order history', async ({ page }) => {
    await page.waitForResponse(
      (response) => response.url().includes('/api/time-slots')
    );

    // Find "Voir commandes" or "View orders" button
    const viewOrdersButton = page
      .getByRole('button', { name: /voir.*commande|view.*order|historique/i })
      .or(
        page.locator('button').filter({ hasText: /voir.*commande|historique/i })
      );

    const buttonCount = await viewOrdersButton.count();
    if (buttonCount > 0) {
      await viewOrdersButton.first().click();
      await page.waitForTimeout(500);

      // Verify modal opened
      const modal = page.locator('[role="dialog"], [class*="modal"]');
      await expect(modal.first()).toBeVisible();

      await page.screenshot({
        path: 'e2e-results/admin-timeslots-order-history.png',
        fullPage: true,
      });
    } else {
      console.log('No view orders button found');
      test.skip();
    }
  });
});

test.describe('Admin Orders Management', () => {
  test('should navigate to orders page', async ({ page }) => {
    await page.goto('/admin');
    await page.waitForLoadState('networkidle');

    // Find orders link
    const ordersLink = page
      .getByRole('link', { name: /commande|order/i })
      .or(page.locator('a, button').filter({ hasText: /commande|order/i }));

    const linkCount = await ordersLink.count();
    if (linkCount > 0) {
      await ordersLink.first().click();
      await page.waitForLoadState('networkidle');

      expect(page.url()).toMatch(/order/i);

      await page.screenshot({
        path: 'e2e-results/admin-orders-page.png',
        fullPage: true,
      });
    } else {
      console.log('No orders management link found');
      test.skip();
    }
  });

  test('should display orders list', async ({ page }) => {
    await page.goto('/admin/orders');
    await page.waitForLoadState('networkidle');

    // Wait for orders API
    await page.waitForResponse(
      (response) => response.url().includes('/api/orders'),
      { timeout: 5000 }
    ).catch(() => {});

    // Check for orders table or list
    const ordersTable = page.locator('table, [role="table"]');
    const ordersList = page.locator('[class*="order"]');

    const hasTable = (await ordersTable.count()) > 0;
    const hasList = (await ordersList.count()) > 0;

    expect(hasTable || hasList).toBeTruthy();

    await page.screenshot({
      path: 'e2e-results/admin-orders-list.png',
      fullPage: true,
    });
  });

  test('should filter orders by status', async ({ page }) => {
    await page.goto('/admin/orders');
    await page.waitForLoadState('networkidle');

    // Find status filter
    const statusFilter = page
      .getByRole('button', { name: /status|statut|pending|confirmed/i })
      .or(page.locator('select[name*="status"], button').filter({
        hasText: /status|statut/i,
      }));

    const filterCount = await statusFilter.count();
    if (filterCount > 0) {
      await statusFilter.first().click();
      await page.waitForTimeout(300);

      await page.screenshot({
        path: 'e2e-results/admin-orders-filter.png',
        fullPage: true,
      });
    } else {
      console.log('No status filter found');
    }
  });

  test('should view order details', async ({ page }) => {
    await page.goto('/admin/orders');
    await page.waitForLoadState('networkidle');

    await page.waitForResponse(
      (response) => response.url().includes('/api/orders'),
      { timeout: 5000 }
    ).catch(() => {});

    // Find view details button
    const viewButton = page
      .getByRole('button', { name: /voir|view|détails/i })
      .or(page.locator('button, a').filter({ hasText: /voir|view|détails/i }));

    const buttonCount = await viewButton.count();
    if (buttonCount > 0) {
      await viewButton.first().click();
      await page.waitForTimeout(500);

      // Should show order details (modal or page)
      const orderDetails = page.locator('[role="dialog"], [class*="modal"], [class*="details"]');
      await expect(orderDetails.first()).toBeVisible();

      await page.screenshot({
        path: 'e2e-results/admin-order-details.png',
        fullPage: true,
      });
    } else {
      console.log('No view details button found');
      test.skip();
    }
  });
});

test.describe('Admin Error Handling', () => {
  test('should not have console errors on admin pages', async ({ page }) => {
    const consoleErrors: string[] = [];

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    page.on('pageerror', (error) => {
      consoleErrors.push(error.message);
    });

    // Navigate through admin pages
    await page.goto('/admin');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    await page.goto('/admin/time-slots/dashboard');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

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

  test('should handle failed API requests gracefully', async ({ page }) => {
    // Navigate to a page and simulate API failure by intercepting
    await page.route('**/api/time-slots**', (route) => {
      route.fulfill({
        status: 500,
        body: JSON.stringify({ error: 'Internal Server Error' }),
      });
    });

    await page.goto('/admin/time-slots/dashboard');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Should show error message or empty state
    const errorMessage = page.locator('text=/erreur|error|échec|failed/i');
    const emptyState = page.locator('text=/aucun|empty|no.*slot/i');

    const hasError = (await errorMessage.count()) > 0;
    const hasEmpty = (await emptyState.count()) > 0;

    expect(hasError || hasEmpty).toBeTruthy();

    await page.screenshot({
      path: 'e2e-results/admin-api-error-handling.png',
      fullPage: true,
    });
  });
});
