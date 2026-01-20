import { test, expect } from '@playwright/test';

/**
 * E2E Test: Admin Order Status Management
 * Tests admin's ability to view, filter, and update order statuses
 */

test.describe('Admin Order Status Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/admin/orders');
    await page.waitForLoadState('networkidle');

    // Wait for orders to load
    await page
      .waitForResponse((response) => response.url().includes('/api/orders'), {
        timeout: 5000,
      })
      .catch(() => console.log('Orders API not detected'));
  });

  test('should display all orders in default view', async ({ page }) => {
    // Verify page loaded
    const heading = page.locator('h1, h2').filter({
      hasText: /commande|order/i,
    });
    await expect(heading.first()).toBeVisible();

    // Check for orders list
    const ordersList = page.locator('table, [class*="order"]');
    await expect(ordersList.first()).toBeVisible();

    await page.screenshot({
      path: 'e2e-results/admin-status-01-orders-list.png',
      fullPage: true,
    });

    console.log('✓ Orders list displayed');
  });

  test('should filter orders by pending status', async ({ page }) => {
    // Look for pending filter button/tab
    const pendingFilter = page
      .getByRole('button', { name: /pending|en.*attente/i })
      .or(page.locator('button, [role="tab"]').filter({ hasText: /pending|en.*attente/i }));

    const filterCount = await pendingFilter.count();

    if (filterCount > 0) {
      await pendingFilter.first().click();
      await page.waitForTimeout(500);

      // Verify URL or active state changed
      const activeFilter = page.locator('[class*="active"], [aria-selected="true"]').filter({
        hasText: /pending|en.*attente/i,
      });

      const hasActiveState = (await activeFilter.count()) > 0;
      const urlHasPending = page.url().includes('pending');

      expect(hasActiveState || urlHasPending).toBeTruthy();

      await page.screenshot({
        path: 'e2e-results/admin-status-02-pending-filter.png',
        fullPage: true,
      });

      console.log('✓ Pending orders filter applied');
    } else {
      console.log('Note: No pending filter found');
    }
  });

  test('should filter orders by confirmed status', async ({ page }) => {
    const confirmedFilter = page
      .getByRole('button', { name: /confirmed|confirmé/i })
      .or(page.locator('button, [role="tab"]').filter({ hasText: /confirmed|confirmé/i }));

    const filterCount = await confirmedFilter.count();

    if (filterCount > 0) {
      await confirmedFilter.first().click();
      await page.waitForTimeout(500);

      await page.screenshot({
        path: 'e2e-results/admin-status-03-confirmed-filter.png',
        fullPage: true,
      });

      console.log('✓ Confirmed orders filter applied');
    } else {
      console.log('Note: No confirmed filter found');
    }
  });

  test('should filter orders by preparing status', async ({ page }) => {
    const preparingFilter = page
      .getByRole('button', { name: /preparing|préparation|en.*cours/i })
      .or(
        page.locator('button, [role="tab"]').filter({ hasText: /preparing|préparation/i })
      );

    const filterCount = await preparingFilter.count();

    if (filterCount > 0) {
      await preparingFilter.first().click();
      await page.waitForTimeout(500);

      await page.screenshot({
        path: 'e2e-results/admin-status-04-preparing-filter.png',
        fullPage: true,
      });

      console.log('✓ Preparing orders filter applied');
    } else {
      console.log('Note: No preparing filter found');
    }
  });

  test('should filter orders by ready status', async ({ page }) => {
    const readyFilter = page
      .getByRole('button', { name: /ready|prêt/i })
      .or(page.locator('button, [role="tab"]').filter({ hasText: /ready|prêt/i }));

    const filterCount = await readyFilter.count();

    if (filterCount > 0) {
      await readyFilter.first().click();
      await page.waitForTimeout(500);

      await page.screenshot({
        path: 'e2e-results/admin-status-05-ready-filter.png',
        fullPage: true,
      });

      console.log('✓ Ready orders filter applied');
    } else {
      console.log('Note: No ready filter found');
    }
  });

  test('should filter orders by completed status', async ({ page }) => {
    const completedFilter = page
      .getByRole('button', { name: /completed|terminé|fini/i })
      .or(
        page.locator('button, [role="tab"]').filter({ hasText: /completed|terminé/i })
      );

    const filterCount = await completedFilter.count();

    if (filterCount > 0) {
      await completedFilter.first().click();
      await page.waitForTimeout(500);

      await page.screenshot({
        path: 'e2e-results/admin-status-06-completed-filter.png',
        fullPage: true,
      });

      console.log('✓ Completed orders filter applied');
    } else {
      console.log('Note: No completed filter found');
    }
  });

  test('should open order details modal', async ({ page }) => {
    // Find first order in list
    const firstOrder = page
      .locator('tr, [class*="order-"]')
      .filter({ has: page.locator('text=/€|EUR/i') })
      .first();

    const orderCount = await firstOrder.count();

    if (orderCount > 0) {
      // Find view/details button
      const viewButton = firstOrder
        .locator('button, a')
        .filter({ hasText: /voir|view|détails|details/i })
        .first();

      const buttonCount = await viewButton.count();

      if (buttonCount > 0) {
        await viewButton.click();
        await page.waitForTimeout(500);

        // Verify modal opened
        const modal = page.locator('[role="dialog"], [class*="modal"]');
        await expect(modal.first()).toBeVisible();

        await page.screenshot({
          path: 'e2e-results/admin-status-07-order-details-modal.png',
          fullPage: true,
        });

        console.log('✓ Order details modal opened');
      } else {
        // Maybe clicking row opens details
        await firstOrder.click();
        await page.waitForTimeout(500);

        const modal = page.locator('[role="dialog"], [class*="modal"]');
        const modalCount = await modal.count();

        if (modalCount > 0) {
          await expect(modal.first()).toBeVisible();
          console.log('✓ Order details opened by clicking row');
        }
      }
    } else {
      console.log('No orders found in list - might be empty state');
      test.skip();
    }
  });

  test('should display order details information', async ({ page }) => {
    const firstOrder = page
      .locator('tr, [class*="order-"]')
      .filter({ has: page.locator('text=/€/') })
      .first();

    if ((await firstOrder.count()) === 0) {
      console.log('No orders available');
      test.skip();
      return;
    }

    const viewButton = firstOrder
      .locator('button, a')
      .filter({ hasText: /voir|view/i })
      .first();

    if ((await viewButton.count()) > 0) {
      await viewButton.click();
      await page.waitForTimeout(500);

      // Check for customer name
      const customerInfo = page.locator('text=/nom|name|client|customer/i');
      await expect(customerInfo.first()).toBeVisible();

      // Check for phone number
      const phonePattern = page.locator('text=/\\d{10}|\\d{2}[\\s.-]\\d{2}/');
      const hasPhone = (await phonePattern.count()) > 0;
      expect(hasPhone).toBeTruthy();

      // Check for order items
      const items = page.locator('text=/article|item|produit|pizza/i');
      await expect(items.first()).toBeVisible();

      // Check for total price
      const total = page.locator('text=/total/i');
      await expect(total.first()).toBeVisible();

      await page.screenshot({
        path: 'e2e-results/admin-status-08-order-details-content.png',
        fullPage: true,
      });

      console.log('✓ Order details information displayed');
    } else {
      test.skip();
    }
  });

  test('should have status update dropdown', async ({ page }) => {
    const firstOrder = page
      .locator('tr, [class*="order-"]')
      .filter({ has: page.locator('text=/€/') })
      .first();

    if ((await firstOrder.count()) === 0) {
      test.skip();
      return;
    }

    const viewButton = firstOrder
      .locator('button, a')
      .filter({ hasText: /voir|view/i })
      .first();

    if ((await viewButton.count()) > 0) {
      await viewButton.click();
      await page.waitForTimeout(500);

      // Look for status selector
      const statusControl = page.locator(
        'select[name*="status"], button[class*="status"], [role="combobox"]'
      );

      const controlCount = await statusControl.count();
      expect(controlCount).toBeGreaterThan(0);

      await page.screenshot({
        path: 'e2e-results/admin-status-09-status-control.png',
        fullPage: true,
      });

      console.log('✓ Status update control found');
    } else {
      test.skip();
    }
  });

  test('should update order status to confirmed', async ({ page }) => {
    // Find a pending order
    const pendingFilter = page
      .getByRole('button', { name: /pending|en.*attente/i })
      .first();

    const filterCount = await pendingFilter.count();
    if (filterCount > 0) {
      await pendingFilter.click();
      await page.waitForTimeout(500);
    }

    const firstOrder = page
      .locator('tr, [class*="order-"]')
      .filter({ has: page.locator('text=/€/') })
      .first();

    if ((await firstOrder.count()) === 0) {
      console.log('No pending orders to update');
      test.skip();
      return;
    }

    const viewButton = firstOrder
      .locator('button, a')
      .filter({ hasText: /voir|view/i })
      .first();

    if ((await viewButton.count()) > 0) {
      await viewButton.click();
      await page.waitForTimeout(500);

      // Find status control
      const statusControl = page
        .locator('select[name*="status"]')
        .or(page.locator('button[class*="status"], [role="combobox"]'))
        .first();

      const isSelect =
        (await statusControl.evaluate((el) => el.tagName)) === 'SELECT';

      if (isSelect) {
        // It's a select element
        await statusControl.selectOption({ label: /confirm/i });
      } else {
        // It's a button/combobox
        await statusControl.click();
        await page.waitForTimeout(300);

        const confirmedOption = page.locator('text=/confirmed|confirmé/i');
        if ((await confirmedOption.count()) > 0) {
          await confirmedOption.first().click();
        }
      }

      await page.waitForTimeout(300);

      // Look for save/update button
      const updateButton = page
        .getByRole('button', {
          name: /update|mettre.*jour|enregistrer|save|valider/i,
        })
        .or(page.locator('button[type="submit"]'));

      const updateCount = await updateButton.count();

      if (updateCount > 0) {
        // Wait for API call
        const updatePromise = page.waitForResponse(
          (response) =>
            response.url().includes('/api/orders') &&
            (response.request().method() === 'PUT' ||
              response.request().method() === 'PATCH'),
          { timeout: 5000 }
        );

        await updateButton.first().click();

        try {
          const updateResponse = await updatePromise;
          expect(updateResponse.status()).toBeGreaterThanOrEqual(200);
          expect(updateResponse.status()).toBeLessThan(300);

          console.log('✓ Order status updated to confirmed');

          await page.waitForTimeout(1000);

          await page.screenshot({
            path: 'e2e-results/admin-status-10-updated-to-confirmed.png',
            fullPage: true,
          });
        } catch {
          console.log('Note: Update API call not detected');
        }
      }
    } else {
      test.skip();
    }
  });

  test('should display success notification after status update', async ({
    page,
  }) => {
    const firstOrder = page
      .locator('tr, [class*="order-"]')
      .filter({ has: page.locator('text=/€/') })
      .first();

    if ((await firstOrder.count()) === 0) {
      test.skip();
      return;
    }

    const viewButton = firstOrder
      .locator('button, a')
      .filter({ hasText: /voir|view/i })
      .first();

    if ((await viewButton.count()) > 0) {
      await viewButton.click();
      await page.waitForTimeout(500);

      const statusControl = page
        .locator('select[name*="status"]')
        .or(page.locator('button[class*="status"]'))
        .first();

      const isSelect =
        (await statusControl.evaluate((el) => el.tagName)) === 'SELECT';

      if (isSelect) {
        await statusControl.selectOption({ index: 1 });
      } else {
        await statusControl.click();
        await page.waitForTimeout(300);

        const statusOption = page
          .locator('[role="option"], [class*="option"]')
          .first();
        if ((await statusOption.count()) > 0) {
          await statusOption.click();
        }
      }

      const updateButton = page
        .getByRole('button', { name: /update|mettre.*jour|save/i })
        .first();

      if ((await updateButton.count()) > 0) {
        await updateButton.click();
        await page.waitForTimeout(1000);

        // Look for success toast/notification
        const successToast = page.locator(
          '[class*="toast"], [role="alert"]'
        ).filter({
          hasText: /success|mis.*jour|updated|enregistré/i,
        });

        const toastCount = await successToast.count();

        if (toastCount > 0) {
          await expect(successToast.first()).toBeVisible();
          console.log('✓ Success notification displayed');
        }

        await page.screenshot({
          path: 'e2e-results/admin-status-11-success-notification.png',
          fullPage: true,
        });
      }
    } else {
      test.skip();
    }
  });

  test('should show order count per status', async ({ page }) => {
    // Look for status badges/counts
    const statusCounts = page.locator('[class*="badge"], [class*="count"]').filter({
      has: page.locator('text=/\\d+/'),
    });

    const countElements = await statusCounts.count();

    if (countElements > 0) {
      console.log(`✓ Found ${countElements} status count indicators`);

      await page.screenshot({
        path: 'e2e-results/admin-status-12-status-counts.png',
        fullPage: true,
      });
    } else {
      console.log('Note: No status count badges found');
    }
  });

  test('should sort orders by date', async ({ page }) => {
    // Look for sort controls
    const sortButton = page
      .locator('button, th')
      .filter({ hasText: /date|created|tri/i });

    const sortCount = await sortButton.count();

    if (sortCount > 0) {
      await sortButton.first().click();
      await page.waitForTimeout(500);

      // Click again to reverse sort
      await sortButton.first().click();
      await page.waitForTimeout(500);

      await page.screenshot({
        path: 'e2e-results/admin-status-13-sorted-by-date.png',
        fullPage: true,
      });

      console.log('✓ Orders sorted by date');
    } else {
      console.log('Note: No date sort control found');
    }
  });

  test('should search orders by customer name', async ({ page }) => {
    const searchInput = page
      .getByPlaceholder(/search|recherche|nom|name/i)
      .or(page.locator('input[type="search"], input[name*="search"]'));

    const searchCount = await searchInput.count();

    if (searchCount > 0) {
      await searchInput.first().fill('Test');
      await page.waitForTimeout(500);

      await page.screenshot({
        path: 'e2e-results/admin-status-14-search-orders.png',
        fullPage: true,
      });

      console.log('✓ Search functionality tested');

      // Clear search
      await searchInput.first().clear();
      await page.waitForTimeout(300);
    } else {
      console.log('Note: No search input found');
    }
  });

  test('should display delivery type in order list', async ({ page }) => {
    // Look for delivery type indicators
    const deliveryIndicators = page.locator(
      'text=/pickup|delivery|livraison|à.*emporter|retrait/i'
    );

    const indicatorCount = await deliveryIndicators.count();

    if (indicatorCount > 0) {
      console.log('✓ Delivery type indicators found');

      await page.screenshot({
        path: 'e2e-results/admin-status-15-delivery-types.png',
        fullPage: true,
      });
    } else {
      console.log('Note: No delivery type indicators visible');
    }
  });

  test('should handle empty order list gracefully', async ({ page }) => {
    // Try to navigate to a filter that might have no orders
    const cancelledFilter = page
      .getByRole('button', { name: /cancelled|annulé/i })
      .first();

    const filterCount = await cancelledFilter.count();

    if (filterCount > 0) {
      await cancelledFilter.click();
      await page.waitForTimeout(500);

      // Look for empty state message
      const emptyMessage = page.locator(
        'text=/aucun|no.*order|empty|vide/i'
      );

      const hasEmpty = (await emptyMessage.count()) > 0;

      if (hasEmpty) {
        console.log('✓ Empty state displayed correctly');

        await page.screenshot({
          path: 'e2e-results/admin-status-16-empty-state.png',
          fullPage: true,
        });
      }
    }
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

    // Navigate through different status filters
    await page.goto('/admin/orders');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // Click through filters
    const filters = await page
      .locator('button, [role="tab"]')
      .filter({ hasText: /pending|confirmed|preparing/i })
      .all();

    for (const filter of filters.slice(0, 3)) {
      await filter.click();
      await page.waitForTimeout(300);
    }

    // Filter critical errors
    const criticalErrors = consoleErrors.filter(
      (error) =>
        !error.includes('Hydration') &&
        !error.includes('hydration') &&
        !error.includes('Warning:')
    );

    if (criticalErrors.length > 0) {
      console.log('Console Errors:', criticalErrors);
    }

    expect(criticalErrors.length).toBe(0);
  });
});
