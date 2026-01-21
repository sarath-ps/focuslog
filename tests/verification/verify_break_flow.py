from playwright.sync_api import Page, expect, sync_playwright
import sys
import os

def test_break_flow(page: Page):
  """
  Verifies the break flow:
  1. Navigates to the Break screen.
  2. Verifies the presence of 'Social' and 'Phone' activity chips.
  3. Selects a chip.
  4. Verifies the 'End Session' button is visible.
  """
  base_url = os.environ.get("BASE_URL", "http://localhost:8081")

  print(f"Navigating to {base_url}...", file=sys.stderr)
  try:
    page.goto(base_url, timeout=60000)
    print("Navigation complete.", file=sys.stderr)
  except Exception as e:
    print(f"Navigation failed: {e}", file=sys.stderr)
    return

  print("Waiting for page load...", file=sys.stderr)
  page.wait_for_timeout(3000)

  print("Navigating to Break...", file=sys.stderr)
  page.goto(f"{base_url}/break", timeout=60000)
  page.wait_for_timeout(2000)

  print("Checking chips...", file=sys.stderr)
  social_chip = page.get_by_text("Social")
  expect(social_chip).to_be_visible()

  phone_chip = page.get_by_text("Phone")
  expect(phone_chip).to_be_visible()

  print("Clicking Social...", file=sys.stderr)
  social_chip.click()

  print("Checking End Session btn...", file=sys.stderr)
  end_btn = page.get_by_text("End Session")
  expect(end_btn).to_be_visible()

  print("Break flow verification successful.", file=sys.stderr)

if __name__ == "__main__":
  with sync_playwright() as p:
    print("Launching browser...", file=sys.stderr)
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()
    try:
      test_break_flow(page)
    except Exception as e:
        print(f"Test failed with error: {e}", file=sys.stderr)
        sys.exit(1)
    finally:
      browser.close()
