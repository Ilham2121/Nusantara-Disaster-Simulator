import { test, expect } from "@playwright/test";

test.describe("Education Knowledge Hub", () => {
  test("should render articles and support category filtering", async ({ page }) => {
    await page.goto("/education");

    // Verify header
    await expect(page.locator("h1")).toContainText(/Dasar sains gempa dan erupsi/i);

    // Verify filter buttons exist
    const allBtn = page.locator("button:has-text('Semua Materi')");
    const eqBtn = page.locator("button:has-text('Gempa Bumi')");
    const erBtn = page.locator("button:has-text('Erupsi Gunung Api')");

    await expect(allBtn).toBeVisible();
    await expect(eqBtn).toBeVisible();
    await expect(erBtn).toBeVisible();

    // Verify articles are rendered
    const articleCards = page.locator("div.grid > div");
    const initialCount = await articleCards.count();
    expect(initialCount).toBeGreaterThan(0);

    // Filter by Earthquake
    await eqBtn.click();
    await page.waitForTimeout(200);
    const eqCount = await articleCards.count();
    expect(eqCount).toBeGreaterThan(0);

    // Filter by Volcano
    await erBtn.click();
    await page.waitForTimeout(200);
    const erCount = await articleCards.count();
    expect(erCount).toBeGreaterThan(0);

    // Filter back to all
    await allBtn.click();
    await page.waitForTimeout(200);
    const resetCount = await articleCards.count();
    expect(resetCount).toBe(initialCount);
  });
});
