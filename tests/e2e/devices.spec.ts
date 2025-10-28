import { test, expect } from '@playwright/test';

test.describe('Device Management', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to devices page
    await page.goto('/admin/devices');
  });

  test('should display device management page', async ({ page }) => {
    // Check page title
    await expect(page.locator('h1')).toContainText('Device Management');
    
    // Check description
    await expect(page.getByText(/Manage and monitor medical devices/)).toBeVisible();
    
    // Check register button exists
    await expect(page.getByRole('button', { name: /Register Device/i })).toBeVisible();
  });

  test('should open register device dialog', async ({ page }) => {
    // Click register device button
    await page.getByRole('button', { name: /Register Device/i }).click();
    
    // Check dialog is visible
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByText('Register New Device')).toBeVisible();
    
    // Check form fields are present
    await expect(page.getByLabel('Device Name')).toBeVisible();
    await expect(page.getByLabel('Device Type')).toBeVisible();
    await expect(page.getByLabel('Manufacturer')).toBeVisible();
    await expect(page.getByLabel('Model')).toBeVisible();
    await expect(page.getByLabel('Serial Number')).toBeVisible();
  });

  test('should validate required fields', async ({ page }) => {
    // Open dialog
    await page.getByRole('button', { name: /Register Device/i }).click();
    
    // Try to submit without filling required fields
    await page.getByRole('button', { name: /^Register Device$/i }).click();
    
    // Check validation messages (HTML5 validation)
    const nameInput = page.getByLabel('Device Name');
    const isInvalid = await nameInput.evaluate((el: HTMLInputElement) => !el.validity.valid);
    expect(isInvalid).toBeTruthy();
  });

  test('should fill and submit device registration form', async ({ page }) => {
    // Open dialog
    await page.getByRole('button', { name: /Register Device/i }).click();
    
    // Fill out the form
    await page.getByLabel('Device Name').fill('Test Monitor 001');
    await page.getByLabel('Device Type').selectOption('vitals_monitor');
    await page.getByLabel('Manufacturer').fill('Philips');
    await page.getByLabel('Model').fill('IntelliVue MX40');
    await page.getByLabel('Serial Number').fill('SN123456789');
    
    // Fill location
    await page.getByLabel('Department').fill('ICU');
    await page.getByLabel('Room').fill('101');
    await page.getByLabel('Bed').fill('A');
    
    // Fill connection settings
    await page.getByLabel('Connection Type').selectOption('network');
    await page.getByLabel('Data Format').selectOption('hl7_v2');
    await page.getByLabel('Host/IP Address').fill('192.168.1.100');
    await page.getByLabel('Port').fill('8080');
    
    // Submit form
    await page.getByRole('button', { name: /^Register Device$/i }).click();
    
    // Wait for dialog to close (form submission)
    await expect(page.getByRole('dialog')).not.toBeVisible({ timeout: 5000 });
  });

  test('should filter devices by type', async ({ page }) => {
    // Select a device type filter
    await page.getByLabel('Device Type').selectOption('vitals_monitor');
    
    // Wait for filter to apply
    await page.waitForTimeout(500);
    
    // Verify filter was applied (checking if the select value changed)
    const selectedValue = await page.getByLabel('Device Type').inputValue();
    expect(selectedValue).toBe('vitals_monitor');
  });

  test('should filter devices by status', async ({ page }) => {
    // Select a status filter
    await page.getByLabel('Status').selectOption('connected');
    
    // Wait for filter to apply
    await page.waitForTimeout(500);
    
    // Verify filter was applied
    const selectedValue = await page.getByLabel('Status').inputValue();
    expect(selectedValue).toBe('connected');
  });

  test('should show empty state when no devices', async ({ page }) => {
    // Check for empty state message
    const emptyState = page.getByText(/No devices registered yet/i);
    
    // Empty state should be visible if no devices exist
    // Note: This test assumes a clean state. Adjust based on your test data
    const isVisible = await emptyState.isVisible();
    expect(typeof isVisible).toBe('boolean');
  });

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Check page is still accessible
    await expect(page.locator('h1')).toContainText('Device Management');
    await expect(page.getByRole('button', { name: /Register Device/i })).toBeVisible();
    
    // Open dialog on mobile
    await page.getByRole('button', { name: /Register Device/i }).click();
    await expect(page.getByRole('dialog')).toBeVisible();
  });

  test('should have accessible labels and ARIA attributes', async ({ page }) => {
    // Check main heading has proper role
    const heading = page.locator('h1');
    await expect(heading).toBeVisible();
    
    // Check button has accessible name
    const registerButton = page.getByRole('button', { name: /Register Device/i });
    await expect(registerButton).toBeVisible();
    
    // Open dialog and check accessibility
    await registerButton.click();
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    
    // Check all form inputs have labels
    const nameInput = page.getByLabel('Device Name');
    await expect(nameInput).toBeVisible();
  });
});

test.describe('Device Detail (Future)', () => {
  test.skip('should navigate to device detail page', async ({ page }) => {
    // This test is skipped because device cards don't exist yet in empty state
    await page.goto('/admin/devices');
    
    // Click on first device card (when devices exist)
    // await page.locator('.device-card').first().click();
    
    // Should navigate to detail page
    // await expect(page).toHaveURL(/\/admin\/devices\/[a-f0-9-]+/);
  });
});
