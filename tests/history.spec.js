import { test, expect } from 'playwright-test-coverage';

test('navigate to history page and verify content', async ({ page }) => {
  // Navigate to the home page
  await page.goto('http://localhost:5173/');

  // Click on the "History" link (assuming it’s in the navigation or header)
  await page.getByRole('link', { name: 'History' }).click();

  // Wait for the History page to load
  await page.waitForURL(/.*\/history/);
  await page.waitForLoadState('networkidle');

  // Verify the page title "Mama Rucci, my my" is visible
  await expect(page.getByText('Mama Rucci, my my')).toBeVisible();

  // Verify some key content from the History page to ensure it’s rendered
  await expect(page.getByText('It all started in Mama Ricci\'s kitchen')).toBeVisible();
  await expect(page.getByText('Pizza has a long and rich history that dates back thousands of years')).toBeVisible();
  await expect(page.locator('img[src="mamaRicci.png"]')).toBeVisible(); // Verify the image is present
});