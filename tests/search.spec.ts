import { expect, test } from "@playwright/test";

test.describe("Pagefind search", () => {
  test("search skeleton is replaced by the searchbox", async ({ page }) => {
    await page.goto("/search");

    await expect(page.locator("#search")).toBeVisible();
    await expect(page.locator(".pf-searchbox-input")).toBeVisible();
    await expect(page.locator("#search-skeleton")).toBeHidden();
  });

  test("typing a query returns a matching result", async ({ page }) => {
    await page.goto("/search");

    await page.locator(".pf-searchbox-input").fill("markdown");

    const results = page.locator(".pf-searchbox-result");
    await expect(results.first()).toBeVisible();
    await expect(results.first()).toHaveAttribute("href", /\/posts\/markdown-style-guide/);
  });

  test("clicking a result navigates to the matching page", async ({ page }) => {
    await page.goto("/search");

    await page.locator(".pf-searchbox-input").fill("markdown");
    await page.locator(".pf-searchbox-result").first().click();

    await page.waitForURL("**/posts/markdown-style-guide**");
  });
});
