from playwright.sync_api import sync_playwright
import time

with sync_playwright() as p:
    browser = p.chromium.launch(headless=False)
    page = browser.new_page()

    print("Opening http://localhost:3006...")
    page.goto('http://localhost:3006')
    page.wait_for_load_state('networkidle')
    time.sleep(2)

    # Check HTML element
    html = page.locator('html')
    html_class = html.get_attribute('class') or 'NO CLASS'
    html_data_theme = html.get_attribute('data-theme') or 'NO DATA-THEME'

    print(f"\nHTML element:")
    print(f"  class: '{html_class}'")
    print(f"  data-theme: '{html_data_theme}'")

    # Check for theme toggle button
    buttons = page.locator('button').all()
    print(f"\nFound {len(buttons)} buttons on page")

    theme_button = None
    for i, btn in enumerate(buttons):
        aria = btn.get_attribute('aria-label') or ''
        if 'mode' in aria.lower() or 'theme' in aria.lower() or 'sombre' in aria.lower() or 'clair' in aria.lower():
            print(f"  Button {i+1}: {aria} [THEME BUTTON]")
            theme_button = btn

    if theme_button:
        print(f"\nClicking theme button...")
        page.screenshot(path='before_click.png', full_page=True)
        theme_button.click()
        time.sleep(1)

        html_class_after = html.get_attribute('class') or 'NO CLASS'
        html_data_theme_after = html.get_attribute('data-theme') or 'NO DATA-THEME'

        print(f"\nAfter click:")
        print(f"  class: '{html_class_after}'")
        print(f"  data-theme: '{html_data_theme_after}'")

        page.screenshot(path='after_click.png', full_page=True)

        print(f"\nScreenshots saved:")
        print(f"  before_click.png")
        print(f"  after_click.png")

        if html_class != html_class_after:
            print(f"\n[SUCCESS] HTML class CHANGED: '{html_class}' -> '{html_class_after}'")
        else:
            print(f"\n[FAIL] HTML class DID NOT CHANGE (still '{html_class}')")
    else:
        print("\n[FAIL] NO THEME BUTTON FOUND!")
        page.screenshot(path='page.png', full_page=True)

    print("\nPress Enter to close...")
    input()
    browser.close()
