import { expect, test } from "@playwright/test";

test("unauthenticated users are redirected to login", async ({ page }) => {
  await page.goto("/dashboard");
  await expect(page).toHaveURL(/\/login$/);
  await expect(page.getByRole("heading", { name: "Sign in to Sentinel" })).toBeVisible();
});

test("valid login navigates to dashboard", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel("Email").fill("commander@example.com");
  await page.getByLabel("Password").fill("secure-password");
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page).toHaveURL(/\/dashboard$/);
  await expect(page.getByRole("heading", { name: "Incident intelligence" })).toBeVisible();
});

test("invalid credentials display an error", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel("Email").fill("invalid@example.com");
  await page.getByLabel("Password").fill("secure-password");
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page.getByRole("alert")).toContainText("Invalid email or password");
  await expect(page).toHaveURL(/\/login$/);
});

test("logout clears authentication and returns to login", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel("Email").fill("commander@example.com");
  await page.getByLabel("Password").fill("secure-password");
  await page.getByRole("button", { name: "Sign in" }).click();
  await page.getByRole("button", { name: "Log out" }).click();
  await expect(page).toHaveURL(/\/login$/);
});
