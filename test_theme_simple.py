from playwright.sync_api import sync_playwright
import time

def test_theme():
    print("Testing theme toggle...")

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Navigate
        page.goto('http://localhost:3000')
        page.wait_for_load_state('networkidle')
        time.sleep(2)

        # Get initial state
        html = page.locator('html')
        main_div = page.locator('div.min-h-screen').first

        initial_class = html.get_attribute('class') or 'none'
        initial_bg = main_div.evaluate('el => window.getComputedStyle(el).backgroundColor')

        print(f"\nInitial state:")
        print(f"  HTML class: '{initial_class}'")
        print(f"  Background color: {initial_bg}")

        # Find and click button
        button = page.locator('button[aria-label*="mode"]').first
        print(f"\nClicking button...")
        button.click()
        time.sleep(1)

        # Get state after click
        after_class = html.get_attribute('class') or 'none'
        after_bg = main_div.evaluate('el => window.getComputedStyle(el).backgroundColor')

        print(f"\nAfter click:")
        print(f"  HTML class: '{after_class}'")
        print(f"  Background color: {after_bg}")

        # Analysis
        print(f"\n{'='*60}")
        if initial_class != after_class:
            print(f"SUCCESS: HTML class changed from '{initial_class}' to '{after_class}'")
        else:
            print(f"FAILED: HTML class did not change (still '{initial_class}')")

        if initial_bg != after_bg:
            print(f"SUCCESS: Background color changed from {initial_bg} to {after_bg}")
        else:
            print(f"FAILED: Background color did not change (still {initial_bg})")

        browser.close()

if __name__ == '__main__':
    test_theme()
