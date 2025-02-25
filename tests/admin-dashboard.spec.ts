import { test, expect } from 'playwright-test-coverage';

test('admin dashboard functionality', async ({ page }) => {
  await page.route('*/**/api/auth', async (route) => {
    const loginReq = { email: 'a@jwt.com', password: 'admin' };
    const loginRes = { 
      user: { 
        id: 1, 
        name: '常用名字', 
        email: 'a@jwt.com', 
        roles: [{ role: 'admin' }] 
      }, 
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6IuW4uOeUqOWQjeWtlyIsImVtYWlsIjoiYUBqd3QuY29tIiwicm9sZXMiOlt7InJvbGUiOiJhZG1pbiJ9XSwiaWF0IjoxNzQwNDM4NjczfQ.lSTpMaMFjdNjydpZcGdb43WGc-BsStKKQH-F4UjtJbw'
    };
    expect(route.request().method()).toBe('PUT');
    expect(route.request().postDataJSON()).toMatchObject(loginReq);
    await route.fulfill({ json: loginRes });
  });
  
  await page.route('*/**/api/franchise', async (route) => {
    const franchisesRes = [
      {
        id: 1,
        name: 'pizzaPocket',
        admins: [],
        stores: [
          { id: 1, name: 'SLC', totalRevenue: 0 }
        ]
      }
    ];
    await route.fulfill({ json: franchisesRes });
  });

  await page.goto('/login');
  await page.getByPlaceholder('Email address').fill('a@jwt.com');
  await page.getByPlaceholder('Password').fill('admin');
  await page.getByRole('button', { name: 'Login' }).click();
  
  await page.goto('/admin-dashboard');
  
  await expect(page.getByText("Mama Ricci's kitchen")).toBeVisible();
  await expect(page.getByText("Keep the dough rolling and the franchises signing up.")).toBeVisible();
  
  await expect(page.locator('table')).toBeVisible();
  await expect(page.locator('thead')).toBeVisible();
  
  const expectedHeaders = ['Franchise', 'Franchisee', 'Store', 'Revenue', 'Action'];
  for (const header of expectedHeaders) {
    await expect(page.locator(`thead`).getByText(header, { exact: true })).toBeVisible();
  }
  
  await expect(page.getByText('pizzaPocket')).toBeVisible();
  await expect(page.getByText('SLC')).toBeVisible();
  await expect(page.getByText('₿')).toBeVisible();
  
  await page.getByRole('button', { name: 'Add Franchise', exact: true }).click();
  await expect(page).toHaveURL('/admin-dashboard/create-franchise');
  

  await page.goto('/admin-dashboard');
  

  await page.locator('tbody tr').first().getByRole('button', { name: 'Close' }).click();
  await expect(page).toHaveURL('/admin-dashboard/close-franchise');
  

  await page.goto('/admin-dashboard');
  
  await page.locator('tbody tr:not(:first-child)').first().getByRole('button', { name: 'Close' }).click();
  await expect(page).toHaveURL('/admin-dashboard/close-store');
});