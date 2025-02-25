import { test, expect } from 'playwright-test-coverage';

test('navigate to about page and verify content', async ({ page }) => {
  // Navigate to the home page
  await page.goto('http://localhost:5173/');

  // Click on the "About" link (assuming it’s in the navigation or header)
  await page.getByRole('link', { name: 'About' }).click();

  // Wait for the About page to load
  await page.waitForURL(/.*\/about/);
  await page.waitForLoadState('networkidle');

  // Verify the page title "The secret sauce" is visible
  await expect(page.getByText('The secret sauce')).toBeVisible();

  // Verify some key content from the About page to ensure it’s rendered
  await expect(page.getByText('At JWT Pizza, our amazing employees are the secret behind our delicious pizzas')).toBeVisible();
  
  // Use getByRole to target the heading "Our employees" specifically
  await expect(page.getByRole('heading', { name: 'Our employees' })).toBeVisible();

  // Verify the 4 employee images
  await expect(page.locator('img[alt="Employee stock photo"]')).toHaveCount(4);
});