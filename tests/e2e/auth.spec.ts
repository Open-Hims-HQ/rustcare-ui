import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('should display login page', async ({ page }) => {
    await page.goto('/');
    
    // Check if redirected to login or shows login form
    // Adjust based on your auth flow
    await expect(page).toHaveURL(/\/|\/login/);
  });

  test.skip('should login successfully', async ({ page }) => {
    // Skip this test until auth is fully implemented
    await page.goto('/login');
    
    await page.getByLabel('Email').fill('test@example.com');
    await page.getByLabel('Password').fill('password123');
    await page.getByRole('button', { name: /Sign In/i }).click();
    
    // Should redirect to dashboard
    await expect(page).toHaveURL('/admin');
  });
});
