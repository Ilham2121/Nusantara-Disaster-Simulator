import { test, expect } from "@playwright/test";

test.describe("Simulation Result and Interactive Quiz", () => {
  test("should show friendly empty state on result page when visited directly", async ({ page }) => {
    await page.goto("/simulation/result");
    await expect(page.locator("h1")).toContainText(/Belum Ada Hasil Simulasi/i);

    const setupBtn = page.locator('a[href="/simulation/setup"]');
    await expect(setupBtn).toBeVisible();
  });

  test("should allow navigating, filtering, and answering quiz questions", async ({ page }) => {
    // 1. Visit quiz page
    await page.goto("/quiz");

    await expect(page.locator("h1")).toContainText(/memahami skenarionya/i);

    // Verify category switchers
    const eqCategoryBtn = page.locator("button:has-text('Gempa Bumi')");
    await expect(eqCategoryBtn).toBeVisible();
    await eqCategoryBtn.click();

    // Verify question is displayed
    const questionText = page.locator("h3");
    await expect(questionText).toBeVisible();

    // Verify options are available
    const firstOption = page.locator("div[class*='cursor-pointer']:has(span.font-mono)").first();
    await expect(firstOption).toBeVisible();

    // Select the first option
    await firstOption.click();

    // Submit button should become enabled
    const submitBtn = page.locator("button:has-text('Pilih jawaban')");
    await expect(submitBtn).toBeEnabled();
    await submitBtn.click();

    // Verify feedback explanation appears
    await expect(page.locator("text=/Penjelasan Ilmiah:/i")).toBeVisible();

    // Verify next question button appears
    const nextBtn = page.locator("button:has-text('Pertanyaan berikutnya'), button:has-text('Lihat ringkasan evaluasi')");
    await expect(nextBtn).toBeVisible();
    await nextBtn.click();

    // Progress counter should advance or complete
    await expect(page.locator("text=/Pertanyaan 2 dari/i")).toBeVisible();
  });
});
