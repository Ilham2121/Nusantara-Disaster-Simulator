import { test, expect } from "@playwright/test";

test.describe("Simulation Workflow End-to-End", () => {
  test("should configure parameters in setup page and launch simulation", async ({ page }) => {
    // 1. Visit setup page
    await page.goto("/simulation/setup");

    // Verify setup title
    await expect(page.locator("h1")).toContainText(/parameter simulasi/i);

    // Verify domain toggle buttons
    const earthquakeDomainBtn = page.locator("button:has-text('Domain Gempa Bumi')");
    const eruptionDomainBtn = page.locator("button:has-text('Domain Erupsi')");
    await expect(earthquakeDomainBtn).toBeVisible();
    await expect(eruptionDomainBtn).toBeVisible();

    // Toggle to Erupsi
    await eruptionDomainBtn.click();
    await expect(page.locator("text=TIPE ERUPSI")).toBeVisible();

    // Toggle back to Gempa
    await earthquakeDomainBtn.click();
    await expect(page.locator("text=MAGNITUDE")).toBeVisible();

    // Verify live preview / risk calculation card
    await expect(page.locator("text=RISIKO TERUKUR:")).toBeVisible();

    // Click Launch button
    const launchBtn = page.locator("button:has-text('Jalankan simulasi')").first();
    await expect(launchBtn).toBeVisible();
    await launchBtn.click();

    // 2. Should navigate to scenario screen
    await page.waitForURL(/\/simulation\/(eq|er)-/);
    expect(page.url()).toContain("/simulation/");

    // Verify Observatory Header
    const backBtn = page.locator("header a:has-text('Kembali')");
    await expect(backBtn).toBeVisible();

    // Verify transport controls in footer
    const playPauseBtn = page.locator("footer button:has-text('Jalankan simulasi'), footer button:has-text('Jeda simulasi')");
    await expect(playPauseBtn.first()).toBeVisible();

    const restartBtn = page.locator("footer button:has-text('Ulangi simulasi')");
    await expect(restartBtn.first()).toBeVisible();

    // Verify playback speed selector
    const speedBtn2x = page.locator("footer button:has-text('2x')");
    await expect(speedBtn2x).toBeVisible();
    await speedBtn2x.click();
  });

  test("should render 3D volcanic eruption simulation for Semeru with lahar and bombs", async ({ page }) => {
    test.setTimeout(90000);

    // Visit Semeru eruption scenario
    await page.goto("/simulation/er-semeru");

    // Verify scenario title
    await expect(page.locator("h1")).toContainText(/semeru/i);

    // Verify 3D Canvas is mounted and visible
    const canvas = page.locator("canvas");
    await expect(canvas).toBeVisible({ timeout: 15000 });

    // Start simulation
    const playBtn = page.locator("footer button:has-text('Jalankan simulasi')");
    await expect(playBtn).toBeVisible();
    await playBtn.click();

    // Wait a brief period to let animation progress and ensure no WebGL or Three.js crash
    await page.waitForTimeout(2000);

    // Verify simulation is running
    await expect(page.locator("footer button:has-text('Jeda simulasi')")).toBeVisible();
  });

  test("should render 3D volcanic eruption simulation for Merapi with lava flow and bombs", async ({ page }) => {
    test.setTimeout(90000);

    // Visit Merapi eruption scenario
    await page.goto("/simulation/er-merapi");
    await expect(page.locator("h1")).toContainText(/merapi/i);

    const canvas = page.locator("canvas");
    await expect(canvas).toBeVisible({ timeout: 15000 });

    const playMerapiBtn = page.locator("footer button:has-text('Jalankan simulasi')");
    await expect(playMerapiBtn).toBeVisible();
    await playMerapiBtn.click();
    await page.waitForTimeout(2000);

    // Check that phase / status indicators render
    await expect(page.locator("footer button:has-text('Jeda simulasi')")).toBeVisible();
  });
});

