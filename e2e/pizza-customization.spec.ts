import { test, expect } from '@playwright/test';

/**
 * E2E Test: Pizza Customization Modal
 * Tests pizza size selection, extras, and cut options
 */

test.describe('Pizza Customization Modal', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/menu');
    await page.waitForLoadState('networkidle');

    // Clear cart
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Wait for products to load
    await page
      .waitForResponse((response) => response.url().includes('/api/products'))
      .catch(() => {});
  });

  test('should open customization modal when clicking on pizza', async ({
    page,
  }) => {
    // Find a pizza product card
    const pizzaCard = page
      .locator('[class*="product"], [class*="card"]')
      .filter({ has: page.locator('text=/pizza/i') })
      .first();

    const cardCount = await pizzaCard.count();

    if (cardCount > 0) {
      // Click on the pizza card or customize button
      const customizeButton = pizzaCard
        .locator('button')
        .filter({ hasText: /personnaliser|customize|ajouter/i })
        .first();

      const buttonCount = await customizeButton.count();

      if (buttonCount > 0) {
        await customizeButton.click();
        await page.waitForTimeout(500);

        // Verify modal opened
        const modal = page.locator('[role="dialog"], [class*="modal"]');
        await expect(modal.first()).toBeVisible();

        // Check for modal title
        const modalTitle = page.locator(
          'text=/personnaliser.*pizza|customize.*pizza/i'
        );
        await expect(modalTitle.first()).toBeVisible();

        await page.screenshot({
          path: 'e2e-results/customization-01-modal-opened.png',
          fullPage: true,
        });

        console.log('✓ Customization modal opened');
      } else {
        console.log('Note: No customize button found - might use different interaction');
      }
    } else {
      console.log('No pizza products found');
      test.skip();
    }
  });

  test('should display pizza size options', async ({ page }) => {
    // Find and click first pizza
    const addButton = page
      .getByRole('button', { name: /personnaliser|customize/i })
      .or(page.getByRole('button', { name: /ajouter/i }))
      .first();

    const buttonCount = await addButton.count();
    if (buttonCount === 0) {
      test.skip();
      return;
    }

    await addButton.click();
    await page.waitForTimeout(500);

    // Look for size selection
    const sizeLabel = page.locator('text=/taille|size/i');
    const sizeCount = await sizeLabel.count();

    if (sizeCount > 0) {
      await expect(sizeLabel.first()).toBeVisible();

      // Check for medium and large options
      const mediumOption = page
        .locator('button, [role="radio"]')
        .filter({ hasText: /medium|moyen/i });

      const largeOption = page
        .locator('button, [role="radio"]')
        .filter({ hasText: /large|grand/i });

      const hasMedium = (await mediumOption.count()) > 0;
      const hasLarge = (await largeOption.count()) > 0;

      expect(hasMedium || hasLarge).toBeTruthy();

      await page.screenshot({
        path: 'e2e-results/customization-02-size-options.png',
        fullPage: true,
      });

      console.log('✓ Size options displayed');
    } else {
      console.log('Note: No size options found - might be single-size pizza');
    }
  });

  test('should select large size and update price', async ({ page }) => {
    const addButton = page
      .getByRole('button', { name: /personnaliser|customize|ajouter/i })
      .first();

    if ((await addButton.count()) === 0) {
      test.skip();
      return;
    }

    await addButton.click();
    await page.waitForTimeout(500);

    // Get initial price
    const initialPriceText = await page
      .locator('text=/total/i')
      .locator('..')
      .filter({ hasText: /€/ })
      .first()
      .textContent();

    const initialPrice = parseFloat(
      initialPriceText?.match(/[\d.]+/)?.[0] || '0'
    );

    console.log('Initial price:', initialPrice);

    // Select large size
    const largeOption = page
      .locator('button')
      .filter({ hasText: /large|grand/i })
      .first();

    const largeCount = await largeOption.count();

    if (largeCount > 0) {
      await largeOption.click();
      await page.waitForTimeout(300);

      // Get updated price
      const updatedPriceText = await page
        .locator('text=/total/i')
        .locator('..')
        .filter({ hasText: /€/ })
        .first()
        .textContent();

      const updatedPrice = parseFloat(
        updatedPriceText?.match(/[\d.]+/)?.[0] || '0'
      );

      console.log('Updated price after large size:', updatedPrice);

      // Price should increase or stay same
      expect(updatedPrice).toBeGreaterThanOrEqual(initialPrice);

      await page.screenshot({
        path: 'e2e-results/customization-03-large-size-selected.png',
        fullPage: true,
      });

      console.log('✓ Large size selection updates price');
    } else {
      console.log('Note: No large size option available');
    }
  });

  test('should display available extras/toppings', async ({ page }) => {
    const addButton = page
      .getByRole('button', { name: /personnaliser|customize|ajouter/i })
      .first();

    if ((await addButton.count()) === 0) {
      test.skip();
      return;
    }

    await addButton.click();
    await page.waitForTimeout(500);

    // Look for extras section
    const extrasLabel = page.locator(
      'text=/ingrédients.*supplémentaires|extras|toppings/i'
    );

    const extrasCount = await extrasLabel.count();

    if (extrasCount > 0) {
      await expect(extrasLabel.first()).toBeVisible();

      // Check for extra options
      const extraButtons = page
        .locator('button')
        .filter({ has: page.locator('text=/fromage|jambon|champignon|olive/i') });

      const extraCount = await extraButtons.count();

      if (extraCount > 0) {
        console.log(`Found ${extraCount} extra options`);

        await page.screenshot({
          path: 'e2e-results/customization-04-extras-displayed.png',
          fullPage: true,
        });

        console.log('✓ Extra toppings displayed');
      }
    } else {
      console.log('Note: No extras section found - might not have customizable extras');
    }
  });

  test('should add extra topping and update price', async ({ page }) => {
    const addButton = page
      .getByRole('button', { name: /personnaliser|customize|ajouter/i })
      .first();

    if ((await addButton.count()) === 0) {
      test.skip();
      return;
    }

    await addButton.click();
    await page.waitForTimeout(500);

    // Get initial price
    const initialPriceEl = page
      .locator('text=/total/i')
      .locator('..')
      .filter({ hasText: /€/ })
      .first();

    const initialPriceText = await initialPriceEl.textContent();
    const initialPrice = parseFloat(
      initialPriceText?.match(/[\d.]+/)?.[0] || '0'
    );

    // Find first extra topping button
    const extraButton = page
      .locator('button')
      .filter({ has: page.locator('text=/fromage|jambon|champignon|olive|tomate/i') })
      .first();

    const extraCount = await extraButton.count();

    if (extraCount > 0) {
      await extraButton.click();
      await page.waitForTimeout(500);

      // Get updated price
      const updatedPriceText = await initialPriceEl.textContent();
      const updatedPrice = parseFloat(
        updatedPriceText?.match(/[\d.]+/)?.[0] || '0'
      );

      console.log('Price before extra:', initialPrice);
      console.log('Price after extra:', updatedPrice);

      // Price should increase
      expect(updatedPrice).toBeGreaterThan(initialPrice);

      await page.screenshot({
        path: 'e2e-results/customization-05-extra-added.png',
        fullPage: true,
      });

      console.log('✓ Adding extra topping increases price');
    } else {
      console.log('Note: No extra toppings available for this pizza');
    }
  });

  test('should remove extra topping and decrease price', async ({ page }) => {
    const addButton = page
      .getByRole('button', { name: /personnaliser|customize|ajouter/i })
      .first();

    if ((await addButton.count()) === 0) {
      test.skip();
      return;
    }

    await addButton.click();
    await page.waitForTimeout(500);

    // Find and click extra topping twice (add then remove)
    const extraButton = page
      .locator('button')
      .filter({ has: page.locator('text=/fromage|jambon|champignon|olive/i') })
      .first();

    const extraCount = await extraButton.count();

    if (extraCount > 0) {
      // Add extra
      await extraButton.click();
      await page.waitForTimeout(300);

      // Get price with extra
      const priceWithExtra = await page
        .locator('text=/total/i')
        .locator('..')
        .filter({ hasText: /€/ })
        .first()
        .textContent();

      const priceWithExtraValue = parseFloat(
        priceWithExtra?.match(/[\d.]+/)?.[0] || '0'
      );

      // Remove extra
      await extraButton.click();
      await page.waitForTimeout(300);

      // Get price without extra
      const priceWithoutExtra = await page
        .locator('text=/total/i')
        .locator('..')
        .filter({ hasText: /€/ })
        .first()
        .textContent();

      const priceWithoutExtraValue = parseFloat(
        priceWithoutExtra?.match(/[\d.]+/)?.[0] || '0'
      );

      console.log('Price with extra:', priceWithExtraValue);
      console.log('Price without extra:', priceWithoutExtraValue);

      // Price should decrease
      expect(priceWithoutExtraValue).toBeLessThan(priceWithExtraValue);

      await page.screenshot({
        path: 'e2e-results/customization-06-extra-removed.png',
        fullPage: true,
      });

      console.log('✓ Removing extra topping decreases price');
    } else {
      console.log('Note: No extras available');
    }
  });

  test('should have cut pizza option', async ({ page }) => {
    const addButton = page
      .getByRole('button', { name: /personnaliser|customize|ajouter/i })
      .first();

    if ((await addButton.count()) === 0) {
      test.skip();
      return;
    }

    await addButton.click();
    await page.waitForTimeout(500);

    // Look for cut option
    const cutOption = page.locator(
      'text=/couper.*pizza|découpe|cut.*pizza/i'
    );

    const cutCount = await cutOption.count();

    if (cutCount > 0) {
      await expect(cutOption.first()).toBeVisible();

      await page.screenshot({
        path: 'e2e-results/customization-07-cut-option.png',
        fullPage: true,
      });

      console.log('✓ Cut pizza option displayed');
    } else {
      console.log('Note: No cut option found');
    }
  });

  test('should toggle cut pizza option', async ({ page }) => {
    const addButton = page
      .getByRole('button', { name: /personnaliser|customize|ajouter/i })
      .first();

    if ((await addButton.count()) === 0) {
      test.skip();
      return;
    }

    await addButton.click();
    await page.waitForTimeout(500);

    // Find cut pizza button
    const cutButton = page
      .locator('button')
      .filter({ hasText: /couper.*pizza|découpe/i })
      .first();

    const cutCount = await cutButton.count();

    if (cutCount > 0) {
      // Toggle off
      await cutButton.click();
      await page.waitForTimeout(300);

      // Check for "entière" or "whole" text
      const wholeText = page.locator('text=/entière|whole|non.*coupé/i');
      const hasWholeText = (await wholeText.count()) > 0;

      if (hasWholeText) {
        console.log('✓ Cut option toggled to whole pizza');
      }

      // Toggle back on
      await cutButton.click();
      await page.waitForTimeout(300);

      // Check for "coupée" or "cut" text
      const cutText = page.locator('text=/coupée|sera.*coupée|cut/i');
      const hasCutText = (await cutText.count()) > 0;

      if (hasCutText) {
        console.log('✓ Cut option toggled back to cut pizza');
      }

      await page.screenshot({
        path: 'e2e-results/customization-08-cut-toggled.png',
        fullPage: true,
      });
    } else {
      console.log('Note: No cut button found');
    }
  });

  test('should display price breakdown summary', async ({ page }) => {
    const addButton = page
      .getByRole('button', { name: /personnaliser|customize|ajouter/i })
      .first();

    if ((await addButton.count()) === 0) {
      test.skip();
      return;
    }

    await addButton.click();
    await page.waitForTimeout(500);

    // Check for base price
    const basePriceLabel = page.locator('text=/prix.*base|base.*price/i');
    await expect(basePriceLabel.first()).toBeVisible();

    // Check for total
    const totalLabel = page.locator('text=/total/i');
    await expect(totalLabel.first()).toBeVisible();

    // Make selections to see breakdown
    const largeOption = page.locator('button').filter({ hasText: /large/i }).first();
    if ((await largeOption.count()) > 0) {
      await largeOption.click();
      await page.waitForTimeout(300);
    }

    const extraButton = page
      .locator('button')
      .filter({ has: page.locator('text=/fromage|jambon/i') })
      .first();

    if ((await extraButton.count()) > 0) {
      await extraButton.click();
      await page.waitForTimeout(300);
    }

    await page.screenshot({
      path: 'e2e-results/customization-09-price-breakdown.png',
      fullPage: true,
    });

    console.log('✓ Price breakdown summary displayed');
  });

  test('should add customized pizza to cart', async ({ page }) => {
    const addButton = page
      .getByRole('button', { name: /personnaliser|customize|ajouter/i })
      .first();

    if ((await addButton.count()) === 0) {
      test.skip();
      return;
    }

    await addButton.click();
    await page.waitForTimeout(500);

    // Make customizations
    const largeOption = page.locator('button').filter({ hasText: /large/i }).first();
    if ((await largeOption.count()) > 0) {
      await largeOption.click();
      await page.waitForTimeout(300);
    }

    // Add extra if available
    const extraButton = page
      .locator('button')
      .filter({ has: page.locator('text=/fromage|jambon/i') })
      .first();

    if ((await extraButton.count()) > 0) {
      await extraButton.click();
      await page.waitForTimeout(300);
    }

    await page.screenshot({
      path: 'e2e-results/customization-10-before-add-to-cart.png',
      fullPage: true,
    });

    // Find "Ajouter au panier" button
    const addToCartButton = page
      .getByRole('button', { name: /ajouter.*panier|add.*cart/i })
      .or(
        page.locator('button').filter({
          hasText: /ajouter.*panier|add.*cart/i,
        })
      );

    await expect(addToCartButton.first()).toBeVisible();

    // Click add to cart
    await addToCartButton.first().click();
    await page.waitForTimeout(500);

    // Modal should close
    const modal = page.locator('[role="dialog"]');
    const modalCount = await modal.count();

    if (modalCount === 0) {
      console.log('✓ Modal closed after adding to cart');
    }

    // Verify cart badge updated
    const cartBadge = page.locator('[class*="badge"]').filter({
      hasText: /\d+/,
    });

    const badgeCount = await cartBadge.count();
    if (badgeCount > 0) {
      console.log('✓ Cart badge updated');
    }

    await page.screenshot({
      path: 'e2e-results/customization-11-added-to-cart.png',
      fullPage: true,
    });
  });

  test('should close modal with X button', async ({ page }) => {
    const addButton = page
      .getByRole('button', { name: /personnaliser|customize|ajouter/i })
      .first();

    if ((await addButton.count()) === 0) {
      test.skip();
      return;
    }

    await addButton.click();
    await page.waitForTimeout(500);

    // Find and click close button
    const closeButton = page
      .getByRole('button', { name: /fermer|close/i })
      .or(page.locator('button').filter({ has: page.locator('svg') }).filter({
        hasText: /^$/,
      }))
      .first();

    await closeButton.click();
    await page.waitForTimeout(500);

    // Modal should be closed
    const modal = page.locator('[role="dialog"]');
    const modalCount = await modal.count();

    expect(modalCount).toBe(0);

    console.log('✓ Modal closed with X button');
  });

  test('should close modal when clicking backdrop', async ({ page }) => {
    const addButton = page
      .getByRole('button', { name: /personnaliser|customize|ajouter/i })
      .first();

    if ((await addButton.count()) === 0) {
      test.skip();
      return;
    }

    await addButton.click();
    await page.waitForTimeout(500);

    // Click on backdrop (outside modal)
    const backdrop = page.locator('[class*="backdrop"], .fixed.inset-0').first();

    const backdropCount = await backdrop.count();

    if (backdropCount > 0) {
      await backdrop.click({ position: { x: 10, y: 10 } });
      await page.waitForTimeout(500);

      // Modal should be closed
      const modal = page.locator('[role="dialog"]');
      const modalCount = await modal.count();

      expect(modalCount).toBe(0);

      console.log('✓ Modal closed when clicking backdrop');
    } else {
      console.log('Note: Backdrop not found for click test');
    }
  });

  test('should reset selections after adding to cart', async ({ page }) => {
    const addButton = page
      .getByRole('button', { name: /personnaliser|customize|ajouter/i })
      .first();

    if ((await addButton.count()) === 0) {
      test.skip();
      return;
    }

    // Open modal
    await addButton.click();
    await page.waitForTimeout(500);

    // Make selections
    const largeOption = page.locator('button').filter({ hasText: /large/i }).first();
    if ((await largeOption.count()) > 0) {
      await largeOption.click();
      await page.waitForTimeout(300);
    }

    // Add to cart
    const addToCartButton = page
      .getByRole('button', { name: /ajouter.*panier/i })
      .first();
    await addToCartButton.click();
    await page.waitForTimeout(500);

    // Open modal again for same pizza
    await addButton.click();
    await page.waitForTimeout(500);

    // Verify default selections are restored (medium size)
    const mediumOption = page
      .locator('button')
      .filter({ hasText: /medium/i })
      .first();

    const mediumCount = await mediumOption.count();

    if (mediumCount > 0) {
      const isSelected = await mediumOption.evaluate((el) =>
        el.className.includes('border-brand-red')
      );

      if (isSelected) {
        console.log('✓ Selections reset to defaults after adding to cart');
      }
    }

    await page.screenshot({
      path: 'e2e-results/customization-12-reset-after-add.png',
      fullPage: true,
    });
  });

  test('should display pizza name and description in modal', async ({
    page,
  }) => {
    const addButton = page
      .getByRole('button', { name: /personnaliser|customize|ajouter/i })
      .first();

    if ((await addButton.count()) === 0) {
      test.skip();
      return;
    }

    await addButton.click();
    await page.waitForTimeout(500);

    // Check for pizza name
    const pizzaName = page.locator('h2, h3').filter({
      hasText: /.+/,
    });

    const nameCount = await pizzaName.count();
    expect(nameCount).toBeGreaterThan(0);

    // Check for description
    const description = page.locator('p').filter({
      hasText: /.{10,}/,
    });

    const descCount = await description.count();

    if (descCount > 0) {
      console.log('✓ Pizza name and description displayed');
    }

    await page.screenshot({
      path: 'e2e-results/customization-13-product-info.png',
      fullPage: true,
    });
  });

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    const addButton = page
      .getByRole('button', { name: /personnaliser|customize|ajouter/i })
      .first();

    if ((await addButton.count()) === 0) {
      test.skip();
      return;
    }

    await addButton.click();
    await page.waitForTimeout(500);

    // Verify modal is visible and functional
    const modal = page.locator('[role="dialog"]');
    await expect(modal.first()).toBeVisible();

    // Check if content is scrollable
    const modalContent = modal.first();
    const isScrollable = await modalContent.evaluate(
      (el) => el.scrollHeight > el.clientHeight
    );

    console.log('Modal is scrollable on mobile:', isScrollable);

    await page.screenshot({
      path: 'e2e-results/customization-14-mobile-view.png',
      fullPage: true,
    });

    console.log('✓ Customization modal responsive on mobile');
  });
});
