import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Festeja Kids/);
});

test('shows login page when not authenticated', async ({ page }) => {
  await page.goto('/');
  // Usually redirects to /login or shows login form

  // Expect text related to login or client area
  await expect(page.getByText(/Entrar|Login|Sign in|Acessar|Área do Cliente/i)).toBeVisible();
});
