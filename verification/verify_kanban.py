from playwright.sync_api import sync_playwright

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            # Navigate to the CRM page where Kanban is likely located
            # Since I don't know the exact route, I'll try the root and look for Kanban
            # Or assume /crm if valid. Let's try root first.
            page.goto("http://localhost:3000")

            # Wait for content to load
            page.wait_for_timeout(3000)

            # Take a screenshot
            page.screenshot(path="verification/kanban_screenshot.png", full_page=True)
            print("Screenshot taken")
        except Exception as e:
            print(f"Error: {e}")
        finally:
            browser.close()

if __name__ == "__main__":
    run()
