import { test, expect } from 'playwright-test-coverage';

test('logout functionality', async ({ page }) => {
  // Mock auth for login
  await page.route('*/**/api/auth', async (route) => {
    const loginRes = { 
      user: { 
        id: 1, 
        name: '常用名字', 
        email: 'a@jwt.com', 
        roles: [{ role: 'admin' }] 
      }, 
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6IuW4uOeUqOWQjeWtlyIsImVtYWlsIjoiYUBqd3QuY29tIiwicm9sZXMiOlt7InJvbGUiOiJhZG1pbiJ9XSwiaWF0IjoxNzQwNDM4NjczfQ.lSTpMaMFjdNjydpZcGdb43WGc-BsStKKQH-F4UjtJbw'
    };
    await route.fulfill({ json: loginRes });
  });
  
  // Mock logout API
  await page.route('*/**/api/logout', async (route) => {
    const logoutRes = { success: true };
    await route.fulfill({ json: logoutRes });
  });

  // Login first to get authenticated
  await page.goto('/login');
  await page.getByPlaceholder('Email address').fill('a@jwt.com');
  await page.getByPlaceholder('Password').fill('admin');
  await page.getByRole('button', { name: 'Login' }).click();
  
  // Verify user is logged in by checking for the logout link
  // This is more reliable than checking for the username which might be displayed differently
  await expect(page.getByRole('link', { name: 'Logout' })).toBeVisible();
  
  // Wait for the page to be fully loaded
  await page.waitForLoadState('networkidle');
  
  // Click the Logout link in the navigation
  await page.getByRole('link', { name: 'Logout' }).click();
  
  // Wait for navigation to complete to the logout page
  await page.waitForURL(/.*\/logout/, { timeout: 10000 });

});