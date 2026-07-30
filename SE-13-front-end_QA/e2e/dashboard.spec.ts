import { expect, test, type Page } from "@playwright/test";

async function login(page: Page) {
  await page.goto("/login");
  await page.getByLabel("Email").fill("operator@example.com");
  await page.getByLabel("Password").fill("secure-password");
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page).toHaveURL(/\/dashboard$/);
}

test.beforeEach(async ({ page }) => {
  await login(page);
});

test("dashboard lists mock-backed incidents", async ({ page }) => {
  await expect(page.locator(".incident-card").first()).toBeVisible();
  await expect(page.locator(".incident-card")).toHaveCount(12);
});

test("operator can acknowledge an open incident", async ({ page }) => {
  const button = page.getByRole("button", { name: "Acknowledge" }).first();
  const card = button.locator("xpath=ancestor::article");
  await button.click();
  await expect(card.locator(".status-badge")).toHaveText("acknowledged");
});

test("operator can resolve an incident", async ({ page }) => {
  const button = page.getByRole("button", { name: "Resolve" }).first();
  const card = button.locator("xpath=ancestor::article");
  await button.click();
  await expect(card.locator(".status-badge")).toHaveText("resolved");
});

test("severity filter shows only matching incidents", async ({ page }) => {
  await page.getByLabel("Severity").selectOption("critical");
  const badges = page.locator(".severity-badge");
  expect(await badges.count()).toBeGreaterThan(0);
  await expect(badges).toHaveText(Array(await badges.count()).fill("critical"));
});

test("WebSocket status and mock stream are visible", async ({ page }) => {
  await expect(page.getByText("WebSocket status:")).toContainText("open");
  await page.getByRole("button", { name: "Start Mock Stream" }).click();
  await expect(page.getByText("local mock stream active")).toBeVisible();
  await expect(page.getByRole("button", { name: "Stop Mock Stream" })).toBeVisible();
});
