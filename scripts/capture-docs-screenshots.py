"""Capture console screenshots for waumail.my/docs.

Run against a local console seeded with DemoSeeder (fictional "Acme Inc" data, demo user
admin@example.com / password with the superadmin role removed, DEBUGBAR_ENABLED=false):

    python3 -I scripts/capture-docs-screenshots.py http://127.0.0.1:8123 public/screenshots
"""
import sys
from playwright.sync_api import sync_playwright

BASE, OUT = sys.argv[1], sys.argv[2]

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_context(viewport={"width": 1440, "height": 900}, device_scale_factor=2).new_page()

    def shot(name):
        page.wait_for_timeout(600)
        # Show the production console origin instead of the local one.
        page.evaluate("""o => { const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
            while (w.nextNode()) w.currentNode.nodeValue = w.currentNode.nodeValue.replaceAll(o, 'https://console.waumail.my'); }""", BASE)
        page.screenshot(path=f"{OUT}/{name}.png")
        print("saved", name)

    page.goto(BASE + "/register"); shot("register")
    page.goto(BASE + "/login")
    page.fill("input[type=email]", "admin@example.com"); page.fill("input[type=password]", "password")
    page.locator("button[type=submit]").first.click(); page.wait_for_load_state("networkidle")

    page.goto(BASE + "/sandboxes"); page.wait_for_load_state("networkidle"); shot("inbox")
    page.get_by_role("button", name="SMTP settings and code samples").click(); shot("smtp-settings")
    page.goto(BASE + "/sandboxes"); page.wait_for_load_state("networkidle")
    page.locator("[wire\\:click^=selectMessage]").first.click(); page.wait_for_load_state("networkidle"); shot("message")
    for tab in ["headers", "spam"]:
        page.locator(f"#msg-tab-{tab}").dispatch_event("click"); page.wait_for_selector(f"#msg-tab-{tab}[aria-selected=true]"); shot(f"message-{tab}")

    page.goto(BASE + "/settings/api-tokens"); page.wait_for_load_state("networkidle"); shot("api-tokens")
    page.goto(BASE + "/settings/mcp"); page.wait_for_load_state("networkidle"); shot("mcp")
    page.mouse.move(1100, 700); page.mouse.wheel(0, 700); shot("mcp-config")
    browser.close()
