import { test, expect } from '@playwright/test';

test.describe('Device Management', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to devices page
    await page.goto('/admin/devices');
  });

  test('should display devices page', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Device Management');
  });

  test('should open register device dialog', async ({ page }) => {
    // Click register device button
    await page.getByRole('button', { name: /register device/i }).click();

    // Check dialog is visible
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByText('Register New Device')).toBeVisible();
  });

  test('should show device filters', async ({ page }) => {
    await expect(page.getByLabel(/device type/i)).toBeVisible();
    await expect(page.getByLabel(/status/i)).toBeVisible();
    await expect(page.getByLabel(/location/i)).toBeVisible();
  });

  test('should handle device registration form validation', async ({ page }) => {
    // Open dialog
    await page.getByRole('button', { name: /register device/i }).click();

    // Try to submit without filling required fields
    await page.getByRole('button', { name: /^register device$/i }).click();

    // Check for validation (HTML5 validation will prevent submission)
    const nameInput = page.getByLabel(/device name/i);
    await expect(nameInput).toHaveAttribute('required');
  });

  test('should fill device registration form', async ({ page }) => {
    // Open dialog
    await page.getByRole('button', { name: /register device/i }).click();

    // Fill basic information
    await page.getByLabel(/device name/i).fill('Test Monitor 1');
    await page.getByLabel(/device type/i).selectOption('vitals_monitor');
    await page.getByLabel(/manufacturer/i).fill('Philips');
    await page.getByLabel(/^model$/i).fill('IntelliVue MP70');
    await page.getByLabel(/serial number/i).fill('SN123456789');

    // Fill location
    await page.getByLabel(/department/i).fill('ICU');
    await page.getByLabel(/room/i).fill('101');

    // Fill connection config
    await page.getByLabel(/connection type/i).selectOption('network');
    await page.getByLabel(/data format/i).selectOption('hl7_v2');
    await page.getByLabel(/host/i).fill('192.168.1.100');
    await page.getByLabel(/port/i).fill('8080');

    // Verify form is filled
    await expect(page.getByLabel(/device name/i)).toHaveValue('Test Monitor 1');
  });

  test('should be accessible', async ({ page }) => {
    // Check page title
    await expect(page).toHaveTitle(/RustCare/);

    // Check main heading
    const heading = page.getByRole('heading', { level: 1 });
    await expect(heading).toBeVisible();

    // Check button accessibility
    const registerButton = page.getByRole('button', { name: /register device/i });
    await expect(registerButton).toBeVisible();
    await expect(registerButton).toBeEnabled();
  });
});
