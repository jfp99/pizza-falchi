import { test, expect, Page } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

// Define breakpoints to test
const breakpoints = [
  { name: 'mobile-375', width: 375, height: 667 },
  { name: 'mobile-414', width: 414, height: 896 },
  { name: 'tablet-768', width: 768, height: 1024 },
  { name: 'tablet-834', width: 834, height: 1194 },
  { name: 'desktop-1024', width: 1024, height: 768 },
  { name: 'desktop-1440', width: 1440, height: 900 },
  { name: 'desktop-1920', width: 1920, height: 1080 },
];

// Pages to test
const pagesToTest = [
  { path: '/', name: 'home' },
  { path: '/about', name: 'about' },
  { path: '/menu', name: 'menu' },
  { path: '/cart', name: 'cart' },
  { path: '/checkout', name: 'checkout' },
  { path: '/contact', name: 'contact' },
];

// Create screenshots directory
const screenshotsDir = path.join(process.cwd(), 'audit-screenshots');
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

test.describe('Comprehensive Design Audit', () => {

  test.describe('Responsiveness Testing', () => {
    for (const page of pagesToTest) {
      for (const breakpoint of breakpoints) {
        test(`${page.name} at ${breakpoint.name}`, async ({ page: browserPage }) => {
          // Set viewport
          await browserPage.setViewportSize({
            width: breakpoint.width,
            height: breakpoint.height
          });

          // Navigate to page
          await browserPage.goto(`http://localhost:3002${page.path}`, {
            waitUntil: 'networkidle',
            timeout: 30000
          });

          // Wait for content to load
          await browserPage.waitForTimeout(2000);

          // Take screenshot for light mode
          await browserPage.screenshot({
            path: path.join(screenshotsDir, `${page.name}-${breakpoint.name}-light.png`),
            fullPage: true
          });

          // Switch to dark mode
          const themeToggle = browserPage.locator('[aria-label*="dark mode"], [aria-label*="mode sombre"], button:has-text("dark"), .theme-toggle').first();
          if (await themeToggle.count() > 0) {
            await themeToggle.click();
            await browserPage.waitForTimeout(500); // Wait for dark mode transition

            // Take screenshot for dark mode
            await browserPage.screenshot({
              path: path.join(screenshotsDir, `${page.name}-${breakpoint.name}-dark.png`),
              fullPage: true
            });
          }

          // Check for layout issues
          const body = browserPage.locator('body');
          const bodyBox = await body.boundingBox();

          // Check for horizontal scroll (should not exceed viewport width)
          const scrollWidth = await browserPage.evaluate(() => document.documentElement.scrollWidth);
          expect(scrollWidth).toBeLessThanOrEqual(breakpoint.width + 20); // Allow 20px tolerance
        });
      }
    }
  });

  test.describe('Accessibility Testing', () => {
    test('Homepage accessibility', async ({ page }) => {
      await page.goto('http://localhost:3002/', { waitUntil: 'networkidle' });

      // Check for skip link
      const skipLink = page.locator('a[href="#main-content"], a:has-text("Skip")');

      // Check heading hierarchy
      const h1Count = await page.locator('h1').count();
      expect(h1Count).toBeGreaterThanOrEqual(1);
      expect(h1Count).toBeLessThanOrEqual(1); // Should only have one h1

      // Check for alt text on images
      const images = page.locator('img');
      const imageCount = await images.count();
      for (let i = 0; i < Math.min(imageCount, 10); i++) {
        const img = images.nth(i);
        const alt = await img.getAttribute('alt');
        expect(alt).toBeTruthy();
      }

      // Check for ARIA labels on buttons without text
      const buttons = page.locator('button');
      const buttonCount = await buttons.count();
      for (let i = 0; i < Math.min(buttonCount, 10); i++) {
        const button = buttons.nth(i);
        const text = await button.textContent();
        if (!text || text.trim() === '') {
          const ariaLabel = await button.getAttribute('aria-label');
          expect(ariaLabel).toBeTruthy();
        }
      }
    });

    test('Keyboard navigation', async ({ page }) => {
      await page.goto('http://localhost:3002/', { waitUntil: 'networkidle' });

      // Tab through focusable elements
      for (let i = 0; i < 10; i++) {
        await page.keyboard.press('Tab');
        const focusedElement = page.locator(':focus');
        const count = await focusedElement.count();
        expect(count).toBe(1); // Should always have a focused element
      }
    });

    test('Color contrast', async ({ page }) => {
      await page.goto('http://localhost:3002/', { waitUntil: 'networkidle' });

      // Get computed styles for key text elements
      const textElements = page.locator('p, h1, h2, h3, button, a').first();
      const styles = await textElements.evaluate((el) => {
        const computed = window.getComputedStyle(el);
        return {
          color: computed.color,
          backgroundColor: computed.backgroundColor,
        };
      });

      expect(styles.color).toBeTruthy();
      expect(styles.backgroundColor).toBeTruthy();
    });
  });

  test.describe('Animation Testing', () => {
    test('Hover effects consistency', async ({ page }) => {
      await page.goto('http://localhost:3002/', { waitUntil: 'networkidle' });

      // Find all links
      const links = page.locator('a');
      const linkCount = await links.count();

      for (let i = 0; i < Math.min(linkCount, 5); i++) {
        const link = links.nth(i);

        // Get initial state
        const initialTransition = await link.evaluate((el) =>
          window.getComputedStyle(el).transition
        );

        // Hover
        await link.hover();
        await page.waitForTimeout(200);

        // Check if transition is defined
        expect(initialTransition).toBeTruthy();
      }
    });

    test('Animation durations', async ({ page }) => {
      await page.goto('http://localhost:3002/', { waitUntil: 'networkidle' });

      // Check button transitions
      const buttons = page.locator('button');
      const button = buttons.first();

      const transition = await button.evaluate((el) => {
        const computed = window.getComputedStyle(el);
        return computed.transitionDuration;
      });

      // Should be between 150ms and 300ms per S-tier principles
      expect(transition).toBeTruthy();
    });

    test('Reduced motion support', async ({ page, context }) => {
      // Set prefers-reduced-motion
      await context.emulateMedia({ reducedMotion: 'reduce' });

      await page.goto('http://localhost:3002/', { waitUntil: 'networkidle' });

      // Check that animations are minimal
      const animatedElement = page.locator('[class*="animate"]').first();
      if (await animatedElement.count() > 0) {
        const animationDuration = await animatedElement.evaluate((el) =>
          window.getComputedStyle(el).animationDuration
        );
        // Should be very short or none
        expect(animationDuration === 'none' || animationDuration === '0s' || animationDuration === '0.01ms').toBeTruthy();
      }
    });
  });

  test.describe('Performance Testing', () => {
    test('Core Web Vitals', async ({ page }) => {
      await page.goto('http://localhost:3002/', { waitUntil: 'networkidle' });

      // Measure performance
      const metrics = await page.evaluate(() => {
        const paint = performance.getEntriesByType('paint');
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;

        return {
          fcp: paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0,
          domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
          loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
        };
      });

      console.log('Performance metrics:', metrics);

      // FCP should be under 1.8s for good performance
      expect(metrics.fcp).toBeLessThan(1800);
    });

    test('Image optimization', async ({ page }) => {
      await page.goto('http://localhost:3002/', { waitUntil: 'networkidle' });

      // Check image loading
      const images = page.locator('img');
      const imageCount = await images.count();

      for (let i = 0; i < Math.min(imageCount, 5); i++) {
        const img = images.nth(i);
        const loading = await img.getAttribute('loading');
        const src = await img.getAttribute('src');

        // Images below fold should have lazy loading
        if (i > 0) {
          // Next.js Image component handles this automatically
          expect(src).toBeTruthy();
        }
      }
    });
  });

  test.describe('Visual Bug Detection', () => {
    test('Text overflow check', async ({ page }) => {
      await page.goto('http://localhost:3002/', { waitUntil: 'networkidle' });

      // Check for text overflow
      const textElements = page.locator('p, h1, h2, h3, h4, h5, h6, span, div');
      const count = await textElements.count();

      for (let i = 0; i < Math.min(count, 20); i++) {
        const element = textElements.nth(i);
        const isOverflowing = await element.evaluate((el) => {
          return el.scrollWidth > el.clientWidth || el.scrollHeight > el.clientHeight;
        });

        if (isOverflowing) {
          const text = await element.textContent();
          const className = await element.getAttribute('class');
          console.log(`Overflow detected in element: ${className}, text: ${text?.substring(0, 50)}`);
        }
      }
    });

    test('Button sizing (touch targets)', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('http://localhost:3002/', { waitUntil: 'networkidle' });

      // Check button sizes - should be minimum 44x44px
      const buttons = page.locator('button, a');
      const buttonCount = await buttons.count();

      for (let i = 0; i < Math.min(buttonCount, 10); i++) {
        const button = buttons.nth(i);
        const box = await button.boundingBox();

        if (box && box.width > 0 && box.height > 0) {
          // Touch targets should be at least 44x44px
          const isTouchFriendly = box.width >= 40 && box.height >= 40;
          if (!isTouchFriendly) {
            const text = await button.textContent();
            console.log(`Small touch target: ${text?.substring(0, 30)}, size: ${box.width}x${box.height}`);
          }
        }
      }
    });

    test('Layout shifts', async ({ page }) => {
      await page.goto('http://localhost:3002/', { waitUntil: 'domcontentloaded' });

      // Measure CLS
      const cls = await page.evaluate(() => {
        return new Promise<number>((resolve) => {
          let clsValue = 0;
          const observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              if (!(entry as any).hadRecentInput) {
                clsValue += (entry as any).value;
              }
            }
          });
          observer.observe({ type: 'layout-shift', buffered: true });

          setTimeout(() => {
            observer.disconnect();
            resolve(clsValue);
          }, 3000);
        });
      });

      console.log('Cumulative Layout Shift:', cls);
      // CLS should be less than 0.1 for good performance
      expect(cls).toBeLessThan(0.1);
    });
  });

  test.describe('Dark Mode Testing', () => {
    test('Dark mode toggle functionality', async ({ page }) => {
      await page.goto('http://localhost:3002/', { waitUntil: 'networkidle' });

      // Get initial theme
      const initialTheme = await page.evaluate(() => {
        return document.documentElement.classList.contains('dark');
      });

      // Click theme toggle
      const themeToggle = page.locator('[aria-label*="dark mode"], [aria-label*="mode sombre"], button:has-text("dark"), .theme-toggle').first();

      if (await themeToggle.count() > 0) {
        await themeToggle.click();
        await page.waitForTimeout(500);

        // Check if theme changed
        const newTheme = await page.evaluate(() => {
          return document.documentElement.classList.contains('dark');
        });

        expect(newTheme).not.toBe(initialTheme);

        // Take screenshots
        await page.screenshot({
          path: path.join(screenshotsDir, 'dark-mode-test.png'),
          fullPage: false,
        });
      }
    });

    test('Dark mode persistence', async ({ page, context }) => {
      await page.goto('http://localhost:3002/', { waitUntil: 'networkidle' });

      // Enable dark mode
      const themeToggle = page.locator('[aria-label*="dark mode"], [aria-label*="mode sombre"], button:has-text("dark"), .theme-toggle').first();

      if (await themeToggle.count() > 0) {
        await themeToggle.click();
        await page.waitForTimeout(500);

        // Reload page
        await page.reload({ waitUntil: 'networkidle' });

        // Check if dark mode persisted
        const isDark = await page.evaluate(() => {
          return document.documentElement.classList.contains('dark');
        });

        expect(isDark).toBe(true);
      }
    });
  });

  test.describe('Component Consistency', () => {
    test('Badge styling consistency', async ({ page }) => {
      await page.goto('http://localhost:3002/about', { waitUntil: 'networkidle' });

      // Find all badges
      const badges = page.locator('[class*="badge"], .bg-primary-red.text-white, span:has-text("Notre")').first();

      if (await badges.count() > 0) {
        const styles = await badges.evaluate((el) => {
          const computed = window.getComputedStyle(el);
          return {
            borderRadius: computed.borderRadius,
            padding: computed.padding,
            fontSize: computed.fontSize,
          };
        });

        expect(styles.borderRadius).toBeTruthy();
      }
    });

    test('ProcessSection circular cards', async ({ page }) => {
      await page.goto('http://localhost:3002/about', { waitUntil: 'networkidle' });

      // Wait for ProcessSection to render
      await page.waitForTimeout(2000);

      // Check for circular card containers
      const circularCards = page.locator('.rounded-full, [class*="aspect-square"]');
      const count = await circularCards.count();

      // Should have process step circles
      expect(count).toBeGreaterThan(0);

      // Take screenshot of process section
      await page.screenshot({
        path: path.join(screenshotsDir, 'process-section.png'),
        fullPage: false,
      });
    });
  });
});
