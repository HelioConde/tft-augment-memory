const { test, expect } = require("@playwright/test");

test.describe("Live Riot smoke", () => {
  test.skip(process.env.LIVE_RIOT_SMOKE !== "1", "Dedicated production smoke only.");

  test("loads real TFT augment history from production", async ({ page }) => {
    await page.goto("./?riot=AlchemyFlames%23BR1&server=br1&period=month", { waitUntil: "domcontentloaded" });
    await expect(page.locator("#status")).toHaveText(/Dados Riot carregados\.|Nenhuma partida TFT encontrada/, { timeout: 25000 });
    if ((await page.locator("#status").textContent() || "").includes("Dados Riot")) {
      await expect(page.locator("#result")).toBeVisible();
      await expect(page.locator("#player-name")).toContainText("AlchemyFlames#BR1");
      await expect(page.locator("#metric-games")).not.toHaveText("—");
    }
  });
});
