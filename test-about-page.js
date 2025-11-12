const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    console.log('Navigating to about page...');
    await page.goto('http://localhost:3002/about', {
      waitUntil: 'domcontentloaded',
      timeout: 60000
    });

    // Wait a bit for React hydration
    await page.waitForTimeout(3000);

    console.log('\n=== Checking Process Section ===');

    // Check if ProcessSection is visible
    const processSectionTitle = await page.locator('text=L\'Art de la Pizza Authentique').isVisible();
    console.log('Process section title visible:', processSectionTitle);

    // Check for the 4 steps
    const steps = [
      'Pâte Artisanale',
      'Sauce Traditionnelle',
      'Garniture Généreuse',
      'Cuisson au Feu de Bois'
    ];

    for (const step of steps) {
      const isVisible = await page.locator(`text=${step}`).first().isVisible();
      console.log(`Step "${step}" visible:`, isVisible);
    }

    // Check for step numbers
    const stepNumbers = ['01', '02', '03', '04'];
    for (const num of stepNumbers) {
      const isVisible = await page.locator(`text=${num}`).first().isVisible();
      console.log(`Step number "${num}" visible:`, isVisible);
    }

    console.log('\n=== Checking Family Story Section ===');
    const familyTitle = await page.locator('text=Une Passion Familiale').isVisible();
    console.log('Family story title visible:', familyTitle);

    const storyCards = [
      '2001 - Les Débuts',
      '2014 - La Transmission',
      'L\'Authenticité Italienne',
      'Le Savoir-Faire Artisanal'
    ];

    for (const card of storyCards) {
      const isVisible = await page.locator(`text=${card}`).first().isVisible();
      console.log(`Card "${card}" visible:`, isVisible);
    }

    // Take a screenshot
    console.log('\nTaking screenshot...');
    await page.screenshot({
      path: 'about-page-test.png',
      fullPage: true
    });
    console.log('Screenshot saved as about-page-test.png');

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await browser.close();
  }
})();
