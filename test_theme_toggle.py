from playwright.sync_api import sync_playwright
import time

def test_theme_toggle():
    print("Starting theme toggle test...")

    with sync_playwright() as p:
        # Launch browser
        browser = p.chromium.launch(headless=False)  # Set to False to see the browser
        context = browser.new_context()
        page = context.new_page()

        # Capture console logs
        console_logs = []
        page.on('console', lambda msg: console_logs.append(f"[{msg.type}] {msg.text}"))

        # Navigate to the application
        print("Navigating to http://localhost:3000...")
        page.goto('http://localhost:3000')
        page.wait_for_load_state('networkidle')

        # Wait a bit for React to hydrate
        time.sleep(2)

        # Take initial screenshot
        print("Taking initial screenshot...")
        page.screenshot(path='theme_before.png', full_page=True)

        # Check initial theme
        html_element = page.locator('html')
        initial_classes = html_element.get_attribute('class') or ''
        initial_data_theme = html_element.get_attribute('data-theme') or 'none'
        print(f"Initial HTML classes: '{initial_classes}'")
        print(f"Initial data-theme: '{initial_data_theme}'")

        # Find the theme toggle button
        print("\nSearching for theme toggle button...")

        # Try multiple selectors to find the button
        button = None
        selectors = [
            'button[aria-label*="mode"]',
            'button[aria-label*="theme"]',
            'button[aria-label*="sombre"]',
            'button[aria-label*="clair"]',
            'button:has(svg.lucide-moon)',
            'button:has(svg.lucide-sun)',
        ]

        for selector in selectors:
            try:
                if page.locator(selector).count() > 0:
                    button = page.locator(selector).first
                    print(f"Found button with selector: {selector}")
                    break
            except:
                continue

        if not button:
            print("ERROR: Could not find theme toggle button!")
            print("\nAll buttons on page:")
            all_buttons = page.locator('button').all()
            for i, btn in enumerate(all_buttons):
                aria_label = btn.get_attribute('aria-label') or 'no aria-label'
                classes = btn.get_attribute('class') or 'no classes'
                print(f"  Button {i+1}: aria-label='{aria_label}', class='{classes[:50]}...'")
            browser.close()
            return

        # Get button details
        aria_label = button.get_attribute('aria-label')
        print(f"Button aria-label: '{aria_label}'")

        # Click the button
        print("\nClicking theme toggle button...")
        button.click()

        # Wait for theme change
        time.sleep(1)

        # Check theme after click
        after_classes = html_element.get_attribute('class') or ''
        after_data_theme = html_element.get_attribute('data-theme') or 'none'
        print(f"\nAfter click HTML classes: '{after_classes}'")
        print(f"After click data-theme: '{after_data_theme}'")

        # Take screenshot after toggle
        print("\nTaking screenshot after toggle...")
        page.screenshot(path='theme_after.png', full_page=True)

        # Click again to toggle back
        print("\nClicking theme toggle button again (toggle back)...")
        button.click()
        time.sleep(1)

        # Check final theme
        final_classes = html_element.get_attribute('class') or ''
        final_data_theme = html_element.get_attribute('data-theme') or 'none'
        print(f"\nFinal HTML classes: '{final_classes}'")
        print(f"Final data-theme: '{final_data_theme}'")

        # Print console logs
        print("\n" + "="*60)
        print("CONSOLE LOGS:")
        print("="*60)
        for log in console_logs:
            print(log)

        # Analyze results
        print("\n" + "="*60)
        print("TEST RESULTS:")
        print("="*60)

        success = True

        # Check if theme changed
        if initial_data_theme == after_data_theme:
            print("❌ FAILED: Theme did not change after first click")
            success = False
        else:
            print(f"✅ SUCCESS: Theme changed from '{initial_data_theme}' to '{after_data_theme}'")

        # Check if theme toggled back
        if initial_data_theme != final_data_theme:
            print("❌ FAILED: Theme did not toggle back after second click")
            success = False
        else:
            print(f"✅ SUCCESS: Theme toggled back to '{final_data_theme}'")

        # Check if classes are being applied
        if 'light' not in initial_classes and 'dark' not in initial_classes:
            print("⚠️  WARNING: No theme class on HTML element initially")
            success = False

        if 'light' not in after_classes and 'dark' not in after_classes:
            print("⚠️  WARNING: No theme class on HTML element after toggle")
            success = False

        if success:
            print("\n🎉 ALL TESTS PASSED!")
        else:
            print("\n❌ SOME TESTS FAILED - Check details above")

        # Keep browser open for inspection
        print("\nScreenshots saved:")
        print("  - theme_before.png")
        print("  - theme_after.png")

        print("\nPress Enter to close browser...")
        input()

        browser.close()

if __name__ == '__main__':
    test_theme_toggle()
