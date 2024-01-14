// Important: import our fixtures.
import { test, expect } from "../playwright/fixtures";

test("test", async ({ page }) => {
  console.log(await page.context().cookies());
  // page is authenticated
  await page.goto("http://localhost:3000/auth-info");
});
