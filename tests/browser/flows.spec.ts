import { test, expect } from "@playwright/test";
test("sample admin creates and manages a user without real requests", async ({
  page,
}, testInfo) => {
  const apiCalls: string[] = [];
  page.on("request", (r) => {
    if (r.url().includes("/api/")) apiCalls.push(r.url());
  });
  await page.goto("/demo/admin");
  await expect(
    page.getByRole("heading", { name: "A clear view of your workspace." }),
  ).toBeVisible();
  await page.screenshot({
    path: `test-results/admin-${testInfo.project.name}.png`,
    fullPage: true,
  });
  await page.getByRole("button", { name: "Create business & user" }).click();
  await page.getByLabel("Business name", { exact: true }).fill("Demo Bakery");
  await page.getByLabel("User's full name").fill("Demo User");
  await page.getByLabel("Login email").fill("demo@example.com");
  await page
    .getByRole("button", { name: "Create account", exact: true })
    .click();
  await expect(page.getByRole("status")).toContainText("No real user or email");
  await page.getByLabel("Search businesses or users").fill("Demo Bakery");
  await expect(
    page.getByRole("cell", { name: "Demo User demo@example.com" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Manage Demo Bakery" }).click();
  await page.getByLabel("Reason for access change").fill("Sample access test");
  await page.getByRole("button", { name: "Disable user", exact: true }).click();
  await expect(
    page.getByRole("cell", { name: "Disabled", exact: true }),
  ).toBeVisible();
  expect(apiCalls).toEqual([]);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});
test("sample order overrides price and preserves its draft", async ({
  page,
}, testInfo) => {
  await page.goto("/demo/order");
  await page
    .getByRole("button", { name: "Harbor Market Sample customer" })
    .click();
  await expect(
    page.getByText("Out of stock · Ordering allowed", { exact: true }),
  ).toBeVisible();
  await expect(page.locator(".grand-total")).toContainText("$48.00");
  await page
    .getByRole("button", { name: "Edit price for Colombian coffee · 12 oz" })
    .click();
  await page.getByLabel("Unit price ($)").fill("10.00");
  await page.getByRole("button", { name: "Apply price" }).click();
  await expect(page.locator(".grand-total")).toContainText("$44.00");
  await page.getByRole("button", { name: "Review order", exact: true }).click();
  await page.getByLabel("Comments").fill("Sample delivery note");
  await page.getByRole("button", { name: "Save sample order" }).click();
  await expect(
    page.getByRole("heading", { name: "Your sample order is saved." }),
  ).toBeVisible();
  await page.screenshot({
    path: `test-results/order-${testInfo.project.name}.png`,
    fullPage: true,
  });
  await page.reload();
  await page
    .getByRole("button", { name: "Harbor Market Sample customer" })
    .click();
  await expect(page.locator(".grand-total")).toContainText("$44.00");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});
test("unconfigured login is honest and usable by keyboard", async ({
  page,
}, testInfo) => {
  await page.goto("/admin/login");
  await expect(
    page.getByRole("heading", { name: "Welcome back, creator." }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Sign in", exact: true }),
  ).toBeDisabled();
  await page.getByLabel("Email address").fill("test@example.com");
  await page.getByLabel("Password", { exact: true }).fill("private-password");
  await page.getByRole("button", { name: "Show", exact: true }).click();
  await expect(page.getByLabel("Password", { exact: true })).toHaveAttribute(
    "type",
    "text",
  );
  await page.getByLabel("Email address").fill("");
  await page.getByLabel("Password", { exact: true }).fill("");
  await page.getByRole("button", { name: "Hide", exact: true }).click();
  await page.screenshot({
    path: `test-results/login-${testInfo.project.name}.png`,
    fullPage: true,
  });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});
