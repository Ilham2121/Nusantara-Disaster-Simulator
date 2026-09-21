import { test, expect } from "@playwright/test";

test.describe("Mobile Viewport Diagnostics & Validation", () => {
  test.use({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });

  test("validate mobile issues and simulation overlay tidiness", async ({ page }) => {
    test.setTimeout(90000);
    page.on("console", (msg) => console.log(`[Browser Console ${msg.type()}]: ${msg.text()}`));
    page.on("pageerror", (err) => console.log(`[Browser Uncaught Error]: ${err.message}`));

    await page.goto("/");

    // 1. Check mobile navbar toggle and simulation button
    const mobileMenuBtn = page.locator('button[aria-label="Toggle menu"]');
    await expect(mobileMenuBtn).toBeVisible();

    await mobileMenuBtn.click();
    const mobileSimLink = page.locator('div.md\\:hidden a[href="/simulation/setup"]').first();
    await expect(mobileSimLink).toBeVisible();
    await mobileMenuBtn.click(); // close menu

    // 2. Check "Alur Eksplorasi" / How it works section
    const step1Heading = page.getByRole("heading", { name: "Pilih skenario" });
    await step1Heading.scrollIntoViewIfNeeded();
    await expect(step1Heading).toBeVisible();

    const step1Opacity = await step1Heading.evaluate((el) => {
      const parent = el.closest(".p-6");
      return parent ? parseFloat(window.getComputedStyle(parent).opacity) : 0;
    });
    console.log("Step 1 Computed Opacity:", step1Opacity);
    expect(step1Opacity).toBeGreaterThanOrEqual(0.9);

    // 3. Check Disaster Cards ("Pilihan Domain")
    const eqHeading = page.getByRole("heading", { name: "Gempa Bumi" });
    await eqHeading.scrollIntoViewIfNeeded();
    await expect(eqHeading).toBeVisible();

    const eqOpacity = await eqHeading.evaluate((el) => {
      const parent = el.closest(".flex-1");
      return parent ? parseFloat(window.getComputedStyle(parent).opacity) : 0;
    });
    console.log("Earthquake card Computed Opacity:", eqOpacity);
    expect(eqOpacity).toBeGreaterThanOrEqual(0.9);

    // 4. Check Tectonic Map
    const mapHeader = page.getByText("Titik Temu Tiga Lempeng Raksasa Dunia");
    await mapHeader.scrollIntoViewIfNeeded();
    await expect(mapHeader).toBeVisible();

    const tectonicCanvas = page.locator("section:has-text('Titik Temu Tiga Lempeng') canvas");
    await expect(tectonicCanvas).toBeVisible();

    // 5. Test clicking simulation setup from mobile menu
    await page.evaluate(() => window.scrollTo(0, 0));
    await mobileMenuBtn.click();
    await mobileSimLink.click();
    await page.waitForURL(/\/simulation\/setup/);

    // Check mobile sticky bottom bar launch button
    const stickyBarLaunchBtn = page.locator("div.fixed.bottom-0 button:has-text('Jalankan simulasi')");
    await expect(stickyBarLaunchBtn).toBeVisible();

    // Click launch button to start simulation
    await stickyBarLaunchBtn.click();
    await page.waitForURL(/\/simulation\/(eq|er)-/);
    console.log("Navigated to scenario screen:", page.url());

    // 6. VERIFY SIMULATION OVERLAYS DO NOT OVERLAP ON MOBILE
    const hudElement = page.locator("div.absolute.top-3.left-3");
    await expect(hudElement).toBeVisible();

    const cameraControls = page.locator("div.absolute.top-3.right-3");
    await expect(cameraControls).toBeVisible();

    const hudBox = await hudElement.boundingBox();
    const cameraBox = await cameraControls.boundingBox();

    if (hudBox && cameraBox) {
      console.log("HUD right edge:", hudBox.x + hudBox.width, "Camera controls left edge:", cameraBox.x);
      // Ensure HUD and camera controls do not horizontally collide (at least separated or within margin)
      expect(hudBox.x + hudBox.width).toBeLessThanOrEqual(cameraBox.x + 2);
    }

    // 7. Test transport control playback
    const playPauseBtn = page.locator("footer button:has-text('Jalankan'), footer button:has-text('Jeda')");
    await expect(playPauseBtn.first()).toBeVisible();
    await playPauseBtn.first().click();

    // Wait a brief moment for simulation to tick
    await page.waitForTimeout(2000);

    // Verify footer scrubber timeline is running
    const timeDisplay = page.locator("footer span.font-mono").first();
    const timeText = await timeDisplay.innerText();
    console.log("Simulation time:", timeText);
  });
});
