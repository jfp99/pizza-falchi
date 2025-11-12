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

    // Wait for content to load
    await page.waitForTimeout(3000);

    // Check if ProcessSection is present
    const processSectionExists = await page.locator('text=L\'Art de la Pizza Authentique').count();
    console.log('\nProcess section found:', processSectionExists > 0);

    if (processSectionExists > 0) {
      // Get the position of the section
      const sectionElement = await page.locator('text=L\'Art de la Pizza Authentique').first();
      const boundingBox = await sectionElement.boundingBox();

      if (boundingBox) {
        console.log('Section position:', {
          x: boundingBox.x,
          y: boundingBox.y,
          width: boundingBox.width,
          height: boundingBox.height
        });
      }

      // Check visibility
      const isVisible = await sectionElement.isVisible();
      console.log('Section is visible:', isVisible);

      // Get computed styles
      const bgColor = await page.evaluate(() => {
        const section = document.querySelector('section.bg-surface');
        if (section) {
          const styles = window.getComputedStyle(section);
          return {
            backgroundColor: styles.backgroundColor,
            display: styles.display,
            visibility: styles.visibility,
            opacity: styles.opacity
          };
        }
        return null;
      });
      console.log('Section styles:', bgColor);
    }

    // Take a full page screenshot
    console.log('\nTaking full page screenshot...');
    await page.screenshot({
      path: 'about-page-full.png',
      fullPage: true
    });
    console.log('Screenshot saved as about-page-full.png');

    // Take a screenshot of just the process section
    const processSection = await page.locator('text=L\'Art de la Pizza Authentique').first();
    if (await processSection.isVisible()) {
      console.log('Taking process section screenshot...');
      await processSection.screenshot({
        path: 'process-section-only.png'
      });
      console.log('Process section screenshot saved as process-section-only.png');
    }

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await browser.close();
  }
})();
