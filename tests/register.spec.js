import { test, expect } from 'playwright-test-coverage';

test('register a new user', async ({ page }) => {
  // Mock the API endpoint for registration (POST /api/auth)
  await page.route('*/**/api/auth', async (route) => {
    const registerReq = {
      name: 'curtis rosenvall',
      email: 'curt@test.com',
      password: 'curt'
    };
    const registerRes = {
      user: {
        name: 'curtis rosenvall',
        email: 'curt@test.com',
        roles: [{ role: 'diner' }],
        id: 7
      },
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiY3VydGlzIHJvc2VudmFsbCIsImVtYWlsIjoiY3VydEB0ZXN0LmNvbSIsInJvbGVzIjpbeyJyb2xlIjoiZGluZXIifV0sImlkIjo3LCJpYXQiOjE3NDA0NDMxMzV9.HoV6tLPFnvOuLW4cxHcoHUGO9pKxyRgagd-M8zyiE7g'
    };
    
    expect(route.request().method()).toBe('POST');
    expect(route.request().postDataJSON()).toMatchObject(registerReq);
    await route.fulfill({ json: registerRes });
  });

  // Navigate to the home page
  await page.goto('http://localhost:5173/');

  // Click on the Register link
  await page.getByRole('link', { name: 'Register' }).click();

  // Fill in the registration form
  await page.getByRole('textbox', { name: 'Full name' }).fill('curtis rosenvall');
  await page.getByRole('textbox', { name: 'Email address' }).fill('curt@test.com');
  await page.getByRole('textbox', { name: 'Password' }).fill('curt');

  // Submit the registration form
  await page.getByRole('button', { name: 'Register' }).click();

  // Wait for the API response to ensure registration is processed
  await page.waitForResponse('http://localhost:3000/api/auth');

  // Wait for the page to update after registration (e.g., navigation or UI changes)
  await page.waitForLoadState('networkidle');

  // Verify the user is logged in by checking for their initials in the global navigation
  await expect(page.getByLabel('Global')).toContainText('cr');
});