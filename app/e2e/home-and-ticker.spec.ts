import { test, expect } from "@playwright/test";

test.describe("Home Page & Seismic Ticker", () => {
  test("should load landing page with hero, navigation, and seismic ticker", async ({ page }) => {
    await page.goto("/");

    // Verify main page title / heading
    await expect(page).toHaveTitle(/Nusantara/i);

    // Verify presence of Seismic Ticker
    const ticker = page.locator("text=SEISMIK");
    await expect(ticker.first()).toBeVisible();

    // Verify live / real-time badge in ticker
    const tickerBadge = page.locator("text=/LIVE BMKG|TERKINI/i");
    await expect(tickerBadge.first()).toBeVisible();

    // Verify primary navigation links
    const setupLink = page.locator('a[href*="/simulation/setup"]').first();
    await expect(setupLink).toBeVisible();

    const educationLink = page.locator('a[href*="/education"]').first();
    await expect(educationLink).toBeVisible();

    const aboutLink = page.locator('a[href*="/about"]').first();
    await expect(aboutLink).toBeVisible();
  });

  test("should navigate to simulation setup from hero CTA button", async ({ page }) => {
    await page.goto("/");

    // Find and click the main CTA button
    const ctaButton = page.locator('section a[href="/simulation/setup"]:has-text("Mulai simulasi")').first();
    await ctaButton.click();

    // Verify URL transitioned to setup
    await expect(page).toHaveURL(/\/simulation\/setup/, { timeout: 15000 });
    await expect(page.locator("h1")).toContainText(/parameter simulasi/i);
  });
});
