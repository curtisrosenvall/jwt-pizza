import { test, expect } from 'playwright-test-coverage';

test('diner dashboard functionality', async ({ page }) => {
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
  
  // Mock user profile API if needed
  await page.route('*/**/api/user/profile', async (route) => {
    const profileRes = {
      id: 1,
      name: '常用名字',
      email: 'a@jwt.com',
      roles: [{ role: 'admin' }],
      // Add any other profile data that might be used in the dashboard
      ordersCount: 5,
      favoriteItems: ['Pepperoni', 'Veggie']
    };
    await route.fulfill({ json: profileRes });
  });
  
  // Mock order history API if needed
  await page.route('*/**/api/user/orders', async (route) => {
    const ordersRes = [
      {
        id: 101,
        date: '2025-02-20T15:30:00Z',
        items: [
          { name: 'Pepperoni', price: 0.0042 }
        ],
        total: 0.0042,
        status: 'delivered'
      },
      {
        id: 102,
        date: '2025-02-23T12:15:00Z',
        items: [
          { name: 'Veggie', price: 0.0038 },
          { name: 'Margarita', price: 0.0035 }
        ],
        total: 0.0073,
        status: 'delivered'
      }
    ];
    await route.fulfill({ json: ordersRes });
  });

  // Login first
  await page.goto('/login');
  await page.getByPlaceholder('Email address').fill('a@jwt.com');
  await page.getByPlaceholder('Password').fill('admin');
  await page.getByRole('button', { name: 'Login' }).click();
  
  // Navigate to diner dashboard
  await page.goto('/diner-dashboard');
  
  // Wait for page to load fully
  await page.waitForLoadState('networkidle');
  
  // Verify dashboard title
  await expect(page.getByText('Your pizza kitchen')).toBeVisible();
  
  // Verify user information is displayed
  await expect(page.getByText('name:')).toBeVisible();
  await expect(page.getByText('常用名字')).toBeVisible();
  await expect(page.getByText('email:')).toBeVisible();
  await expect(page.getByText('a@jwt.com')).toBeVisible();
  await expect(page.getByText('role:')).toBeVisible();
  
  // Use a very specific selector for the admin role text that won't conflict with the Admin navigation link
  // This finds a span element that contains the exact text "admin" (not "Admin")
//   await expect(page.locator('span').filter({ hasText: /^admin$/ })).toBeVisible();
  
  // Verify the call-to-action is present
//   await expect(page.getByText('How have you lived this long without having a pizza?')).toBeVisible();
  
  // Check if "Buy one" link is present and clickable
//   const buyOneLink = page.getByRole('link', { name: 'Buy one' });
//   await expect(buyOneLink).toBeVisible();
  
  // Test navigation to order page when clicking "Buy one"
//   await buyOneLink.click();
//   await expect(page).toHaveURL(/.*\/menu/);
  
  // Navigate back to diner dashboard
  await page.goto('/diner-dashboard');
  
  // Verify footer navigation links
  await expect(page.getByRole('link', { name: 'Franchise' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'About' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'History' })).toBeVisible();
  
  // Verify copyright information
  await expect(page.getByText(/© 2024 JWT Pizza LTD/)).toBeVisible();
});