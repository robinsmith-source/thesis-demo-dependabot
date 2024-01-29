import { test, expect } from "../playwright/fixtures";

test("Create a recipe and make sure it gets created", async ({ page }) => {
  await page.goto("http://localhost:3000/recipe/create");
  await page.locator(".group > .relative > .inline-flex").first().click();
  await page.getByPlaceholder("My tasty Pizza").fill("Testing Recipe");
  await page.getByLabel("Easy,").click();
  await page.getByLabel("Medium", { exact: true }).getByText("Medium").click();
  await page.getByPlaceholder("My grandma used to make this").click();
  await page
    .getByPlaceholder("My grandma used to make this")
    .fill("Description");
  await page.getByLabel("Recipe Tags (0/10)").click();
  await page.getByLabel("Recipe Tags (0/10)").fill("tag");
  await page.getByLabel("Recipe Tags (0/10)").press("Enter");
  await page.getByRole("button", { name: "Add Step" }).click();
  await page.getByLabel("Step Description").fill("Step1");
  await page
    .getByRole("button", { name: "Add Ingredient", exact: true })
    .click();
  await page.getByLabel("Name", { exact: true }).fill("Ingredient1");
  await page.getByRole("button", { name: "Submit" }).click();

  await expect(
    page.locator("h1").filter({ hasText: "Testing Recipe" }),
  ).toBeVisible();
  await expect(
    page
      .locator("span")
      .filter({ hasText: "Testing Recipe" })
      .locator("path")
      .nth(1),
  ).toBeVisible();

  await page.waitForURL(/\/recipe\/c[a-z0-9]{24}/);

  await expect(page.getByRole("main")).toContainText("Description");
  await expect(page.getByRole("rowheader")).toContainText("1 g");
  await expect(
    page.getByLabel("Ingredient Table").locator("tbody"),
  ).toContainText("Ingredient1");
  await expect(page.getByRole("table")).toContainText("1 g Ingredient1");
  await expect(
    page
      .locator("div")
      .filter({ hasText: /^#tag$/ })
      .nth(1),
  ).toBeVisible();
});
