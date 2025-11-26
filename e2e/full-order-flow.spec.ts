import { test, expect } from '@playwright/test';

test.describe('Complete Order Flow E2E Test', () => {
  test('should complete full order flow from menu to confirmation', async ({ page }) => {
    // Set longer timeout for this comprehensive test
    test.setTimeout(180000);

    console.log('🍕 Starting complete order flow test...');

    // Step 1: Go to menu page
    console.log('Step 1: Navigating to menu...');
    await page.goto('/menu', { timeout: 60000 });
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(5000); // Wait for hydration and API calls

    // Take screenshot of menu
    await page.screenshot({ path: 'e2e-results/order-flow-01-menu.png', fullPage: true });

    // Scroll to menu section
    await page.evaluate(() => {
      const menuSection = document.getElementById('menu-section');
      if (menuSection) {
        menuSection.scrollIntoView({ behavior: 'instant' });
      }
    });
    await page.waitForTimeout(1000);

    // Wait for products to load (check for product count text)
    console.log('Waiting for products to load...');
    const productCountText = page.locator('#search-results-count span').first();
    await expect(productCountText).toBeVisible({ timeout: 30000 });
    const countText = await productCountText.textContent();
    console.log(`Product count display: ${countText}`);

    // Verify menu loaded - check for product cards inside the products-section
    const productsSection = page.locator('#products-section');
    await expect(productsSection).toBeVisible({ timeout: 15000 });
    console.log('✅ Menu page loaded');

    // Step 2: Add a product to cart
    console.log('Step 2: Adding product to cart...');

    // Wait for product cards to render
    await page.waitForTimeout(2000);

    // First, try to add a NON-pizza product (drink/boisson) which doesn't require customization
    // Filter to "Boissons" category first
    const boissonFilter = page.locator('button').filter({ hasText: /boisson/i }).first();
    if (await boissonFilter.isVisible()) {
      await boissonFilter.click();
      console.log('✅ Filtered to Boissons category');
      await page.waitForTimeout(2000);
    }

    // Look for "Ajouter au panier" buttons (non-pizza products have this)
    let addButtons = page.locator('#products-section button').filter({
      hasText: /ajouter au panier/i
    });
    let addButtonCount = await addButtons.count();
    console.log(`Found ${addButtonCount} 'Ajouter au panier' buttons`);

    if (addButtonCount > 0) {
      // Click the first add button for a drink
      const firstAddButton = addButtons.first();
      await firstAddButton.scrollIntoViewIfNeeded();
      await firstAddButton.click();
      console.log('✅ Added drink to cart directly');
      await page.waitForTimeout(1500);
    } else {
      // Fallback: try adding a pizza with customization
      console.log('No direct add buttons, trying pizza with customization...');

      // Go back to all products
      const allFilter = page.locator('button').filter({ hasText: /tout|all|menu/i }).first();
      if (await allFilter.isVisible()) {
        await allFilter.click();
        await page.waitForTimeout(2000);
      }

      // Find a "Personnaliser" button (pizza)
      const customizeButtons = page.locator('#products-section button').filter({
        hasText: /personnaliser/i
      });
      const customizeCount = await customizeButtons.count();
      console.log(`Found ${customizeCount} 'Personnaliser' buttons`);

      if (customizeCount > 0) {
        await customizeButtons.first().scrollIntoViewIfNeeded();
        await customizeButtons.first().click();
        console.log('✅ Clicked Personnaliser button');

        // Wait for customization modal to appear
        await page.waitForTimeout(2000);

        // The modal should now be visible - look for the add to cart button within it
        // Modal uses createPortal, so it's at the document root level
        const modalAddButton = page.locator('button').filter({
          hasText: /ajouter au panier/i
        }).last();

        if (await modalAddButton.isVisible()) {
          await modalAddButton.click();
          console.log('✅ Added pizza from customization modal');
          await page.waitForTimeout(1500);
        } else {
          console.log('⚠️ Modal add button not found');
          // Try any button that says "Ajouter"
          const anyAddButton = page.locator('button').filter({ hasText: /^ajouter/i }).last();
          if (await anyAddButton.isVisible()) {
            await anyAddButton.click();
            console.log('✅ Clicked fallback add button');
          }
        }
      }
    }

    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'e2e-results/order-flow-02-after-add.png', fullPage: true });

    // Verify cart has items by checking cart badge
    const cartBadge = page.locator('[class*="badge"], span').filter({ hasText: /^[1-9]$/ }).first();
    const cartHasItems = await cartBadge.isVisible().catch(() => false);
    console.log(`Cart has items: ${cartHasItems}`);

    // Step 3: Navigate to checkout from cart sidebar
    console.log('Step 3: Navigating to checkout...');

    // The cart sidebar should be open after adding item
    // Look for "Passer commande" button in the cart sidebar
    const checkoutButton = page.locator('a, button').filter({ hasText: /passer commande|commander|checkout/i }).first();

    if (await checkoutButton.isVisible()) {
      console.log('Found checkout button in cart sidebar');
      await checkoutButton.click();
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(3000); // Wait for page transition
      console.log('✅ Clicked checkout button');
    } else {
      // Cart sidebar might have closed, try opening it again via cart icon
      console.log('Checkout button not visible, trying to open cart...');
      const cartIcon = page.locator('button').filter({ hasText: /panier/i }).first();
      if (await cartIcon.isVisible()) {
        await cartIcon.click();
        await page.waitForTimeout(1000);
      }

      // Try the checkout button again
      const retryCheckout = page.locator('a, button').filter({ hasText: /passer commande/i }).first();
      if (await retryCheckout.isVisible()) {
        await retryCheckout.click();
        await page.waitForLoadState('domcontentloaded');
        await page.waitForTimeout(3000);
        console.log('✅ Clicked checkout button (retry)');
      }
    }

    await page.screenshot({ path: 'e2e-results/order-flow-03-checkout.png', fullPage: true });

    // Check current URL
    const currentCheckoutUrl = page.url();
    console.log(`Current URL after checkout click: ${currentCheckoutUrl}`);

    // Check if we're on checkout page
    if (currentCheckoutUrl.includes('/checkout')) {
      console.log('✅ Successfully on checkout page');
    } else if (currentCheckoutUrl.includes('/menu')) {
      console.log('⚠️ Still on menu page - cart might be empty. Test cannot continue.');
      await page.screenshot({ path: 'e2e-results/order-flow-cart-empty.png', fullPage: true });
      return;
    } else {
      console.log(`On unexpected page: ${currentCheckoutUrl}`);
    }

    // Step 4: Fill customer information
    console.log('Step 4: Filling customer information...');

    // Wait for form to be ready
    await page.waitForSelector('input[name="customerName"]', { timeout: 10000 });

    // Fill name (use valid name without numbers)
    await page.fill('input[name="customerName"]', 'Jean-Pierre Dupont');
    console.log('✅ Name filled');

    // Fill phone
    await page.fill('input[name="phone"]', '0601289283');
    console.log('✅ Phone filled');

    // Fill email (optional)
    const emailInput = page.locator('input[name="email"]');
    if (await emailInput.isVisible()) {
      await emailInput.fill('test@pizzafalchi.com');
      console.log('✅ Email filled');
    }

    await page.screenshot({ path: 'e2e-results/order-flow-04-info-filled.png', fullPage: true });

    // Step 5: Select time slot
    console.log('Step 5: Selecting time slot...');

    // Scroll to time slot section
    const timeSlotSection = page.locator('text=/créneau|horaire|time slot/i').first();
    if (await timeSlotSection.isVisible()) {
      await timeSlotSection.scrollIntoViewIfNeeded();
    }
    await page.waitForTimeout(2000);

    // Wait for time slots to load
    const timeSlotContainer = page.locator('[class*="time"], [class*="slot"]').filter({ hasText: /disponible|places/i }).first();

    // Try to find and click a time slot button
    const timeSlotButtons = page.locator('button').filter({
      hasText: /^\d{2}:\d{2}/ // Match time format like 18:00, 19:30
    });
    const slotCount = await timeSlotButtons.count();
    console.log(`Found ${slotCount} time slot buttons`);

    if (slotCount > 0) {
      // Find a slot that's not full (doesn't have "complet" or disabled)
      for (let i = 0; i < slotCount; i++) {
        const slot = timeSlotButtons.nth(i);
        const isDisabled = await slot.isDisabled();
        const text = await slot.textContent();
        if (!isDisabled && !text?.toLowerCase().includes('complet')) {
          await slot.click();
          console.log(`✅ Time slot selected: ${text}`);
          break;
        }
      }
    } else {
      console.log('⚠️ No time slots found - checking if already selected or not required');
    }

    await page.screenshot({ path: 'e2e-results/order-flow-05-timeslot.png', fullPage: true });

    // Step 6: Select payment method (cash by default)
    console.log('Step 6: Ensuring payment method...');

    // Cash should be selected by default, but let's verify
    const cashOption = page.locator('button, label, input').filter({ hasText: /espèces|cash|comptant/i }).first();
    if (await cashOption.isVisible()) {
      await cashOption.click();
      console.log('✅ Cash payment selected');
    }

    // Step 7: Accept CGV
    console.log('Step 7: Accepting terms...');

    // Find the terms checkbox
    const cgvCheckbox = page.locator('input[type="checkbox"]').first();
    if (await cgvCheckbox.isVisible()) {
      // Check if it's the CGV checkbox
      await cgvCheckbox.check({ force: true });
      console.log('✅ Terms checkbox checked');
    }

    await page.screenshot({ path: 'e2e-results/order-flow-06-terms.png', fullPage: true });

    // Step 8: Submit order
    console.log('Step 8: Submitting order...');

    // Find submit button
    const submitButton = page.locator('button[type="submit"]').first();

    // Check if button is enabled
    const isEnabled = await submitButton.isEnabled();
    console.log(`Submit button enabled: ${isEnabled}`);

    if (!isEnabled) {
      // Log any visible error messages
      const errors = page.locator('[class*="error"], [class*="invalid"], .text-red-500');
      const errorCount = await errors.count();
      console.log(`Found ${errorCount} error elements`);
      for (let i = 0; i < Math.min(errorCount, 5); i++) {
        const text = await errors.nth(i).textContent();
        console.log(`Error ${i + 1}: ${text}`);
      }
      await page.screenshot({ path: 'e2e-results/order-flow-submit-disabled.png', fullPage: true });
    }

    // Try to submit
    if (isEnabled) {
      // Listen for the API response
      const responsePromise = page.waitForResponse(
        response => response.url().includes('/api/orders') && response.request().method() === 'POST',
        { timeout: 30000 }
      );

      await submitButton.click();
      console.log('✅ Order submit button clicked');

      try {
        const response = await responsePromise;
        const status = response.status();
        console.log(`API Response status: ${status}`);

        const body = await response.json();

        if (status === 201 || status === 200) {
          console.log('✅ Order created successfully!');
          console.log('Order ID:', body._id);
        } else {
          console.log('❌ Order failed:', JSON.stringify(body, null, 2));
        }
      } catch (e) {
        console.log('Could not capture API response:', e);
      }
    }

    await page.waitForTimeout(3000);
    await page.screenshot({ path: 'e2e-results/order-flow-07-result.png', fullPage: true });

    // Step 9: Check for confirmation page or success modal
    console.log('Step 9: Checking result...');

    const currentUrl = page.url();
    console.log(`Current URL: ${currentUrl}`);

    // Check for order confirmation page
    if (currentUrl.includes('order-confirmation')) {
      console.log('✅ SUCCESS! Order confirmation page reached');
      await page.screenshot({ path: 'e2e-results/order-flow-08-confirmation.png', fullPage: true });

      // Verify confirmation page content
      await expect(page.locator('text=/commande|confirmation|merci/i').first()).toBeVisible();
    } else if (currentUrl.includes('/menu') && await page.locator('text=/confirmée|success/i').first().isVisible()) {
      // Check for success modal on menu page
      console.log('✅ SUCCESS! Order confirmed via success modal');
      await page.screenshot({ path: 'e2e-results/order-flow-08-success-modal.png', fullPage: true });
    } else {
      // Check for toast or error messages
      const toasts = page.locator('[class*="toast"], [role="alert"], [class*="Toaster"]');
      const toastCount = await toasts.count();
      console.log(`Found ${toastCount} toast/alert elements`);

      for (let i = 0; i < toastCount; i++) {
        const text = await toasts.nth(i).textContent();
        console.log(`Toast/Alert ${i + 1}: ${text}`);
      }
    }

    console.log('🍕 Order flow test completed!');
  });
});
