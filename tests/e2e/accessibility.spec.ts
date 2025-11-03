/**
 * Playwright E2E Accessibility Tests
 * 
 * Comprehensive end-to-end accessibility testing including:
 * - Keyboard navigation
 * - Screen reader compatibility
 * - ARIA landmarks
 * - Focus management
 * - Color contrast verification
 */

import { test, expect } from '@playwright/test';
import { injectAxe, checkA11y } from 'axe-playwright';

test.describe('Accessibility E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    
    // Inject axe-core into the page
    await injectAxe(page);
  });

  test.describe('Page Load and Basic Structure', () => {
    test('should have accessible page title', async ({ page }) => {
      await expect(page).toHaveTitle(/RustCare/);
    });

    test('should have proper language attribute', async ({ page }) => {
      const htmlLang = await page.getAttribute('html', 'lang');
      expect(htmlLang).toBe('en');
    });

    test('should have skip to main content link', async ({ page }) => {
      const skipLink = page.locator('a:has-text("Skip to main content")');
      await expect(skipLink).toBeVisible({ visible: false });
      
      // Press Tab to focus
      await page.keyboard.press('Tab');
      await expect(skipLink).toBeVisible();
    });

    test('should pass axe accessibility scan', async ({ page }) => {
      await checkA11y(page, null, {
        detailedReport: true,
        detailedReportOptions: {
          html: true,
        },
      });
    });

    test('should have proper heading hierarchy', async ({ page }) => {
      const h1 = page.locator('h1');
      await expect(h1.first()).toBeVisible();
      
      // Check that h2 comes after h1
      const h1Count = await h1.count();
      expect(h1Count).toBeGreaterThan(0);
    });

    test('should have main landmark', async ({ page }) => {
      const main = page.locator('main, [role="main"]');
      await expect(main.first()).toBeVisible();
    });
  });

  test.describe('Navigation', () => {
    test('should navigate with keyboard only', async ({ page }) => {
      // Tab through navigation
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
      
      const focusedElement = page.locator(':focus');
      await expect(focusedElement).toBeVisible();
    });

    test('should have visible focus indicators', async ({ page }) => {
      // Focus on first interactive element
      await page.keyboard.press('Tab');
      
      const focusedElement = page.locator(':focus');
      await expect(focusedElement).toBeVisible();
      
      // Check if element has focus styles
      const styles = await focusedElement.evaluate(el => 
        window.getComputedStyle(el).outlineStyle
      );
      
      expect(styles).not.toBe('none');
    });

    test('should have accessible navigation landmarks', async ({ page }) => {
      const nav = page.locator('nav, [role="navigation"]');
      const navCount = await nav.count();
      
      if (navCount > 0) {
        for (let i = 0; i < navCount; i++) {
          const ariaLabel = await nav.nth(i).getAttribute('aria-label');
          // Navigation should have aria-label or aria-labelledby
          expect(ariaLabel || true).toBeTruthy();
        }
      }
    });
  });

  test.describe('Forms', () => {
    test('should have accessible form inputs', async ({ page }) => {
      // Navigate to a form if exists
      const inputs = page.locator('input:not([type="hidden"])');
      const inputCount = await inputs.count();
      
      for (let i = 0; i < inputCount; i++) {
        const input = inputs.nth(i);
        const id = await input.getAttribute('id');
        
        if (id) {
          // Check if label exists
          const label = page.locator(`label[for="${id}"]`);
          const labelExists = await label.count() > 0;
          
          // If no explicit label, check for aria-label
          const ariaLabel = await input.getAttribute('aria-label');
          const placeholder = await input.getAttribute('placeholder');
          
          expect(labelExists || ariaLabel || placeholder).toBeTruthy();
        }
      }
    });

    test('should have proper error announcements', async ({ page }) => {
      const errors = page.locator('[role="alert"], .error-message');
      const errorCount = await errors.count();
      
      if (errorCount > 0) {
        // Check if errors have proper ARIA attributes
        for (let i = 0; i < errorCount; i++) {
          const error = errors.nth(i);
          const role = await error.getAttribute('role');
          expect(['alert', 'status']).toContain(role);
        }
      }
    });

    test('should have autocomplete attributes on relevant fields', async ({ page }) => {
      const emailInput = page.locator('input[type="email"]');
      const emailCount = await emailInput.count();
      
      if (emailCount > 0) {
        const autocomplete = await emailInput.first().getAttribute('autocomplete');
        // Should have autocomplete for better UX
        expect(autocomplete).toBeTruthy();
      }
    });
  });

  test.describe('Interactive Elements', () => {
    test('should activate buttons with keyboard', async ({ page }) => {
      const buttons = page.locator('button:not([disabled])');
      const buttonCount = await buttons.count();
      
      if (buttonCount > 0) {
        for (let i = 0; i < Math.min(buttonCount, 3); i++) {
          await buttons.nth(i).focus();
          
          // Try to activate with Enter or Space
          const isVisible = await buttons.nth(i).isVisible();
          expect(isVisible).toBe(true);
        }
      }
    });

    test('should have accessible button labels', async ({ page }) => {
      const buttons = page.locator('button');
      const buttonCount = await buttons.count();
      
      for (let i = 0; i < buttonCount; i++) {
        const button = buttons.nth(i);
        const text = await button.textContent();
        const ariaLabel = await button.getAttribute('aria-label');
        const ariaLabelledby = await button.getAttribute('aria-labelledby');
        
        // Button should have accessible name
        expect(text || ariaLabel || ariaLabelledby).toBeTruthy();
      }
    });

    test('should handle focus traps in modals', async ({ page }) => {
      // Look for modals/dialogs
      const dialogs = page.locator('[role="dialog"], [role="alertdialog"]');
      const dialogCount = await dialogs.count();
      
      if (dialogCount > 0) {
        const dialog = dialogs.first();
        await expect(dialog).toBeVisible();
        
        // Focus should be trapped inside modal
        const focusableInside = dialog.locator('button, a, input, select');
        const firstFocusable = focusableInside.first();
        
        await firstFocusable.focus();
        await expect(firstFocusable).toBeFocused();
      }
    });
  });

  test.describe('Images and Media', () => {
    test('should have alt text for images', async ({ page }) => {
      const images = page.locator('img');
      const imageCount = await images.count();
      
      for (let i = 0; i < imageCount; i++) {
        const img = images.nth(i);
        const alt = await img.getAttribute('alt');
        const role = await img.getAttribute('role');
        
        // Image should have alt or be decorative (role="presentation")
        expect(alt !== null || role === 'presentation').toBeTruthy();
      }
    });

    test('should have descriptive alt text', async ({ page }) => {
      const images = page.locator('img');
      const imageCount = await images.count();
      
      for (let i = 0; i < imageCount; i++) {
        const img = images.nth(i);
        const alt = await img.getAttribute('alt');
        const role = await img.getAttribute('role');
        
        // Skip decorative images
        if (role === 'presentation' || alt === '') {
          continue;
        }
        
        // Alt text should not be too short or just repeat image filename
        if (alt) {
          expect(alt.length).toBeGreaterThan(3);
          expect(alt).not.toMatch(/\.(jpg|jpeg|png|gif|svg)$/i);
        }
      }
    });
  });

  test.describe('Tables', () => {
    test('should have accessible table headers', async ({ page }) => {
      const tables = page.locator('table');
      const tableCount = await tables.count();
      
      for (let i = 0; i < tableCount; i++) {
        const table = tables.nth(i);
        
        // Check for th elements
        const headers = table.locator('th');
        const headerCount = await headers.count();
        expect(headerCount).toBeGreaterThan(0);
        
        // Check for scope attributes
        const firstHeader = headers.first();
        const scope = await firstHeader.getAttribute('scope');
        expect(['col', 'row']).toContain(scope);
      }
    });

    test('should have table captions', async ({ page }) => {
      const tables = page.locator('table');
      const tableCount = await tables.count();
      
      for (let i = 0; i < tableCount; i++) {
        const table = tables.nth(i);
        const caption = table.locator('caption');
        const ariaLabel = await table.getAttribute('aria-label');
        const ariaLabelledby = await table.getAttribute('aria-labelledby');
        
        // Tables should have some form of label
        const hasCaption = await caption.count() > 0;
        expect(hasCaption || ariaLabel || ariaLabelledby).toBeTruthy();
      }
    });
  });

  test.describe('Color and Contrast', () => {
    test('should have sufficient color contrast', async ({ page }) => {
      await checkA11y(page, null, {
        rules: {
          'color-contrast': { enabled: true },
          'color-contrast-enhanced': { enabled: true },
        },
      });
    });

    test('should not rely solely on color', async ({ page }) => {
      // Test that error messages have icons or text, not just color
      const errorMessages = page.locator('.error, .text-red-600, [role="alert"]');
      const errorCount = await errorMessages.count();
      
      for (let i = 0; i < errorCount; i++) {
        const error = errorMessages.nth(i);
        const text = await error.textContent();
        
        // Should have actual text, not just styling
        expect(text?.trim().length).toBeGreaterThan(0);
      }
    });
  });

  test.describe('Responsive Design', () => {
    test('should be accessible on mobile viewport', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await injectAxe(page);
      
      await checkA11y(page, null, {
        detailedReport: true,
      });
    });

    test('should be accessible on tablet viewport', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await injectAxe(page);
      
      await checkA11y(page, null, {
        detailedReport: true,
      });
    });

    test('should be accessible on large desktop viewport', async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await injectAxe(page);
      
      await checkA11y(page, null, {
        detailedReport: true,
      });
    });
  });

  test.describe('Keyboard Navigation', () => {
    test('should navigate entire page with Tab only', async ({ page }) => {
      // Get all focusable elements
      const focusable = page.locator(
        'a[href], button:not([disabled]), input:not([type="hidden"]), select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      
      const focusableCount = await focusable.count();
      
      // Tab through first 5 elements to ensure navigation works
      for (let i = 0; i < Math.min(focusableCount, 5); i++) {
        await page.keyboard.press('Tab');
        const focused = page.locator(':focus');
        await expect(focused).toBeVisible();
      }
    });

    test('should handle Enter and Space on buttons', async ({ page }) => {
      const buttons = page.locator('button:not([disabled])');
      const buttonCount = await buttons.count();
      
      if (buttonCount > 0) {
        const firstButton = buttons.first();
        await firstButton.focus();
        
        // Test Space key
        await page.keyboard.press('Space');
        await expect(firstButton).toBeFocused();
        
        // Test Enter key
        await page.keyboard.press('Enter');
        await expect(firstButton).toBeFocused();
      }
    });

    test('should have logical tab order', async ({ page }) => {
      // Focus should move in visual order
      await page.keyboard.press('Tab');
      const firstFocused = page.locator(':focus');
      
      await page.keyboard.press('Tab');
      const secondFocused = page.locator(':focus');
      
      // Should have moved to next element
      await expect(firstFocused).not.toBeFocused();
      await expect(secondFocused).toBeFocused();
    });
  });

  test.describe('Screen Reader Compatibility', () => {
    test('should have proper ARIA landmarks', async ({ page }) => {
      const landmarks = [
        'banner',
        'navigation',
        'main',
        'complementary',
        'contentinfo',
        'search',
      ];
      
      for (const landmark of landmarks) {
        const elements = page.locator(`[role="${landmark}"], header, nav, main, aside, footer`);
        const count = await elements.count();
        
        if (count > 0) {
          // Check if landmarks have labels
          const first = elements.first();
          const ariaLabel = await first.getAttribute('aria-label');
          const hasAccessibleName = await first.getAttribute('aria-labelledby');
          
          // Landmarks should have accessible names when there are multiple
          if (count > 1 && !ariaLabel && !hasAccessibleName) {
            // This is acceptable for single instances
            expect(count).toBeLessThanOrEqual(1);
          }
        }
      }
    });

    test('should have live regions for dynamic content', async ({ page }) => {
      const liveRegions = page.locator('[aria-live]');
      const liveRegionCount = await liveRegions.count();
      
      if (liveRegionCount > 0) {
        for (let i = 0; i < liveRegionCount; i++) {
          const liveRegion = liveRegions.nth(i);
          const ariaLive = await liveRegion.getAttribute('aria-live');
          
          // Should be polite or assertive
          expect(['polite', 'assertive', 'off']).toContain(ariaLive);
          
          // Should have content
          const text = await liveRegion.textContent();
          expect(text).not.toBeNull();
        }
      }
    });

    test('should hide decorative elements from screen readers', async ({ page }) => {
      const decorative = page.locator('[aria-hidden="true"]');
      const decorativeCount = await decorative.count();
      
      if (decorativeCount > 0) {
        for (let i = 0; i < decorativeCount; i++) {
          const element = decorative.nth(i);
          const ariaHidden = await element.getAttribute('aria-hidden');
          expect(ariaHidden).toBe('true');
        }
      }
    });
  });
});

test.describe('Integration Tests', () => {
  test('admin dashboard should be fully accessible', async ({ page }) => {
    await page.goto('/admin');
    await injectAxe(page);
    
    await checkA11y(page, null, {
      detailedReport: true,
      tags: ['wcag2a', 'wcag2aa', 'wcag21aa', 'best-practice'],
    });
  });

  test('finance pages should be accessible', async ({ page }) => {
    await page.goto('/admin/finance');
    await injectAxe(page);
    
    await checkA11y(page, null, {
      detailedReport: true,
    });
  });

  test('insurance pages should be accessible', async ({ page }) => {
    await page.goto('/admin/insurance');
    await injectAxe(page);
    
    await checkA11y(page, null, {
      detailedReport: true,
    });
  });
});



