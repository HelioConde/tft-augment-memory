const { test, expect } = require("@playwright/test");

test("validation, period controls and language stay usable", async ({ page }) => {
  await page.goto("/");

  await expect(page.locator("[data-period]")).toHaveCount(3);
  await page.locator("#riot-id").fill("invalid");
  await page.locator("#lookup-form").getByRole("button").click();
  await expect(page.locator("#status")).not.toHaveText("");

  await page.locator("#language-toggle").click();
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
});
