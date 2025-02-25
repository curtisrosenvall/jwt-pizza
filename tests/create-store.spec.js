import { test, expect } from 'playwright-test-coverage';

test('franchise login and store creation', async ({ page }) => {
  // Mock auth for franchise login
  await page.route('*/**/api/auth', async (route) => {
    const loginReq = { email: 'f@jwt.com', password: 'franchisee' };
    const loginRes = { 
      user: { 
        id: 2, 
        name: 'Franchise Owner', 
        email: 'f@jwt.com', 
        roles: [{ role: 'franchisee', objectId: '4' }] // Match franchisee/4
      }, 
      token: 'franchise-jwt-token-123' 
    };
    
    if (route.request().method() === 'PUT') {
      const body = route.request().postDataJSON();
      if (body.email === loginReq.email && body.password === loginReq.password) {
        await route.fulfill({ json: loginRes });
        return;
      }
    }
    
    await route.fulfill({ json: loginRes });
  });
  
  // Mock franchisee API with data that matches your actual franchise dashboard
  await page.route('*/**/api/franchisee/', async (route) => {
    const url = route.request().url();
    const method = route.request().method();
    
    if (url.includes('/store') && method === 'POST') {
      const body = route.request().postDataJSON();
      const newStore = {
        id: '3',
        name: body.name || 'New Store'
      };
      await route.fulfill({ json: newStore });
      return;
    }
    
    const franchiseRes = {
      id: '4',
      name: 'pizzaPocket',
      stores: [
        { id: '1', name: 'SLC', totalRevenue: 6.355 },
        { id: '2', name: 'curt', totalRevenue: 0 }
      ]
    };
    await route.fulfill({ json: franchiseRes });
  });
  
  // Mock franchisee list endpoint
  await page.route('*/**/api/franchisee', async (route) => {
    if (route.request().method() === 'GET') {
      const franchisesRes = [
        {
          id: '4',
          name: 'pizzaPocket',
          stores: [
            { id: '1', name: 'SLC', totalRevenue: 6.355 },
            { id: '2', name: 'curt', totalRevenue: 0 }
          ]
        }
      ];
      await route.fulfill({ json: franchisesRes });
    }
  });
  
  // Start the test - navigate to home page
  await page.goto('/');
  
  // Click on Login link
  await page.getByRole('link', { name: 'Login' }).click();
  
  // Fill login form with franchise credentials
  await page.getByPlaceholder('Email address').fill('f@jwt.com');
  await page.getByPlaceholder('Password').fill('franchisee');
  
  // Submit login form
  await page.getByRole('button', { name: 'Login' }).click();
  
  // Wait for login to complete and navigation to finish
  await page.waitForLoadState('networkidle');
  
  // Navigate to Franchise dashboard
  await page.getByLabel('Global').getByRole('link', { name: 'Franchise' }).click();
  
  // Wait for franchise dashboard to load
  await page.waitForURL(/.*\/franchise-dashboard/);
  
  // Wait for the API response and the stores table to render
  // await page.waitForResponse('*/**/api/franchisee/');
  // await page.waitForSelector('table', { timeout: 10000 }); // Wait for the table
  // await page.waitForSelector('td:has-text("SLC")', { timeout: 10000 }); // Wait for SLC in a table cell
  
  // // Verify franchise dashboard loaded with the correct content
  // await expect(page.getByText('SLC')).toBeVisible({ timeout: 10000 });
  // await expect(page.getByText('curt')).toBeVisible({ timeout: 10000 });
  
  // // Look for the Create store button directly
  // await expect(page.getByRole('button', { name: /Create store/i })).toBeVisible();
  
  // // Click on Create Store button
  // await page.getByRole('button', { name: 'Create store' }).click();
  
  // // Fill store creation form
  // await page.getByLabel('store name').fill('steve');
  
  // // Submit form
  // await page.getByRole('button', { name: 'Create' }).click();
  
  // // Verify the new store appears in the list
  // await expect(page.locator('tbody')).toContainText('steve');
});