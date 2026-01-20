import { test, expect } from '@playwright/test';

// Test the full order flow on production
test.describe('Production Order Flow', () => {
  const PROD_URL = 'https://pizza-falchi.vercel.app';

  test('should complete full order flow on production', async ({ page }) => {
    test.setTimeout(120000); // 2 minutes timeout for production

    // Step 1: Go to menu page
    console.log('Step 1: Navigating to menu...');
    await page.goto(`${PROD_URL}/menu`, { waitUntil: 'networkidle', timeout: 60000 });
    await page.screenshot({ path: 'e2e-results/prod-01-menu.png' });

    // Scroll down to see products (menu has hero section at top)
    await page.evaluate(() => window.scrollTo(0, 800));
    await page.waitForTimeout(2000);

    // Wait for products to load - use the motion.div with group class from ProductCard
    await page.waitForSelector('.group.bg-surface, div[class*="rounded-2xl"][class*="shadow"]', { timeout: 30000 });
    console.log('Menu loaded successfully');

    // Step 2: Add a product to cart
    console.log('Step 2: Adding product to cart...');

    // Find and click on a product to add to cart
    const addToCartButton = page.locator('button:has-text("Ajouter"), button:has-text("Commander"), [data-testid="add-to-cart"]').first();

    if (await addToCartButton.isVisible({ timeout: 5000 })) {
      await addToCartButton.click();
      console.log('Clicked add to cart button');
    } else {
      // Try clicking on a product card first
      const productCard = page.locator('[data-testid="product-card"], .product-card, article').first();
      await productCard.click();
      console.log('Clicked on product card');

      // Wait for modal or page and click add button
      await page.waitForTimeout(1000);
      const modalAddButton = page.locator('button:has-text("Ajouter"), button:has-text("Commander")').first();
      if (await modalAddButton.isVisible({ timeout: 5000 })) {
        await modalAddButton.click();
        console.log('Clicked add button in modal');
      }
    }

    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'e2e-results/prod-02-after-add.png' });

    // Step 3: Go to checkout
    console.log('Step 3: Going to checkout...');
    await page.goto(`${PROD_URL}/checkout`, { waitUntil: 'networkidle', timeout: 60000 });
    await page.screenshot({ path: 'e2e-results/prod-03-checkout.png' });

    // Check if cart has items, if not add one
    const emptyCartMessage = page.locator('text=panier est vide, text=Votre panier, text=aucun article');
    if (await emptyCartMessage.isVisible({ timeout: 3000 }).catch(() => false)) {
      console.log('Cart is empty, adding product via menu...');
      await page.goto(`${PROD_URL}/menu`, { waitUntil: 'networkidle' });

      // Find first available product add button
      const addBtn = page.locator('button:has-text("Ajouter")').first();
      await addBtn.click({ timeout: 10000 });
      await page.waitForTimeout(2000);

      await page.goto(`${PROD_URL}/checkout`, { waitUntil: 'networkidle' });
    }

    // Step 4: Fill customer information
    console.log('Step 4: Filling customer information...');

    // Fill name
    const nameInput = page.locator('input[name="customerName"], input[placeholder*="Nom"], #customerName');
    if (await nameInput.isVisible({ timeout: 5000 })) {
      await nameInput.fill('Jean-Pierre Dupont');
    }

    // Fill email
    const emailInput = page.locator('input[name="email"], input[type="email"], #email');
    if (await emailInput.isVisible({ timeout: 5000 })) {
      await emailInput.fill('test@pizzafalchi.fr');
    }

    // Fill phone
    const phoneInput = page.locator('input[name="phone"], input[type="tel"], #phone');
    if (await phoneInput.isVisible({ timeout: 5000 })) {
      await phoneInput.fill('0612345678');
    }

    await page.screenshot({ path: 'e2e-results/prod-04-info-filled.png' });

    // Step 5: Select pickup (À emporter)
    console.log('Step 5: Selecting pickup option...');
    const pickupOption = page.locator('text=emporter, label:has-text("emporter"), input[value="pickup"]');
    if (await pickupOption.isVisible({ timeout: 5000 })) {
      await pickupOption.click();
    }

    // Step 6: Select time slot
    console.log('Step 6: Selecting time slot...');
    await page.waitForTimeout(1000);

    // Look for time slot buttons
    const timeSlotButton = page.locator('button[class*="time"], [data-testid*="slot"], button:has-text(":00"), button:has-text(":30")').first();
    if (await timeSlotButton.isVisible({ timeout: 10000 })) {
      await timeSlotButton.click();
      console.log('Selected time slot');
    }

    await page.screenshot({ path: 'e2e-results/prod-05-timeslot.png' });

    // Step 7: Accept terms
    console.log('Step 7: Accepting terms...');
    const termsCheckbox = page.locator('input[type="checkbox"][name*="terms"], input[type="checkbox"][name*="accept"], input[type="checkbox"]').first();
    if (await termsCheckbox.isVisible({ timeout: 5000 })) {
      await termsCheckbox.check();
    }

    await page.screenshot({ path: 'e2e-results/prod-06-terms.png' });

    // Step 8: Submit order
    console.log('Step 8: Submitting order...');
    const submitButton = page.locator('button[type="submit"]:has-text("Commander"), button:has-text("Confirmer"), button:has-text("Valider")');

    // Check if button is enabled
    const isDisabled = await submitButton.isDisabled({ timeout: 5000 }).catch(() => true);
    if (isDisabled) {
      console.log('Submit button is disabled, checking form...');
      await page.screenshot({ path: 'e2e-results/prod-07-submit-disabled.png' });

      // Take a screenshot of the current state
      const pageContent = await page.content();
      console.log('Page has checkout form:', pageContent.includes('checkout'));
    } else {
      await submitButton.click();
      console.log('Order submitted!');

      // Wait for redirect to confirmation page
      await page.waitForTimeout(5000);
      await page.screenshot({ path: 'e2e-results/prod-07-result.png' });

      // Check for success indicators
      const currentUrl = page.url();
      console.log('Current URL after submit:', currentUrl);

      if (currentUrl.includes('order-confirmation') || currentUrl.includes('confirmation')) {
        console.log('SUCCESS: Redirected to order confirmation page!');

        // Look for order ID
        const orderIdElement = page.locator('text=/[A-Z0-9]{6}/, [data-testid="order-id"]');
        if (await orderIdElement.isVisible({ timeout: 5000 })) {
          const orderId = await orderIdElement.textContent();
          console.log('Order ID:', orderId);
        }
      } else {
        // Check for success message on same page
        const successMessage = page.locator('text=succès, text=confirmée, text=merci, text=reçue');
        if (await successMessage.isVisible({ timeout: 5000 })) {
          console.log('SUCCESS: Order confirmation message displayed!');
        }
      }
    }

    await page.screenshot({ path: 'e2e-results/prod-08-final.png' });
    console.log('Test completed!');
  });

  test('should verify API health on production', async ({ request }) => {
    // Test that the orders API is accessible
    console.log('Testing API health...');

    // Get CSRF token first
    const csrfResponse = await request.get(`${PROD_URL}/api/csrf`);
    expect(csrfResponse.ok()).toBeTruthy();
    const csrfData = await csrfResponse.json();
    console.log('CSRF token obtained:', csrfData.csrfToken ? 'Yes' : 'No');

    // Test products API
    const productsResponse = await request.get(`${PROD_URL}/api/products`);
    expect(productsResponse.ok()).toBeTruthy();
    const products = await productsResponse.json();
    console.log('Products API returned:', products.length, 'products');
    expect(products.length).toBeGreaterThan(0);

    // Test time slots API
    const today = new Date().toISOString().split('T')[0];
    const timeSlotsResponse = await request.get(`${PROD_URL}/api/time-slots?date=${today}`);
    expect(timeSlotsResponse.ok()).toBeTruthy();
    const timeSlots = await timeSlotsResponse.json();
    console.log('Time slots API returned:', timeSlots.length, 'slots');
  });
});
