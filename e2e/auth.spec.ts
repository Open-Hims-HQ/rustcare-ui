import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('should display login page', async ({ page }) => {
    await page.goto('/');
    
    // Check for login form elements
    await expect(page.getByRole('heading', { name: /sign in/i })).toBeVisible();
  });

  test('should navigate to home page after login', async ({ page }) => {
    await page.goto('/');
    
    // This is a placeholder - adjust based on your actual auth flow
    // For now, just check the page loads
    await expect(page).toHaveTitle(/RustCare/);
  });

  test('should be keyboard navigable', async ({ page }) => {
    await page.goto('/');
    
    // Tab through the page
    await page.keyboard.press('Tab');
    
    // Check that focus is visible
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
  });
});
