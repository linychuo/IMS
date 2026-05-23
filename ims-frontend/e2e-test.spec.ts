import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3000';
const API_URL = 'http://localhost:8080';

test.describe('IMS E2E Tests - Admin Login', () => {
  let token: string;
  let headers: Record<string, string>;

  test('1. Login with admin account', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');

    console.log('Page loaded, URL:', page.url());

    // Try to find login form
    const usernameInput = page.locator('input[type="text"], input[placeholder*="用户"], input[name="username"]').first();
    const passwordInput = page.locator('input[type="password"]').first();

    if (await usernameInput.isVisible({ timeout: 5000 }).catch(() => false)) {
      await usernameInput.fill('admin');
      await passwordInput.fill('admin123');

      const loginButton = page.locator('button[type="submit"], button:has-text("登录"), button:has-text("登录")').first();
      await loginButton.click();

      await page.waitForTimeout(3000);
    }

    console.log('After login, URL:', page.url());
    await page.screenshot({ path: '/tmp/ims-login.png', fullPage: true });
  });

  test('2. Test Dashboard access', async ({ page }) => {
    // First login via API
    const loginResp = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'admin', password: 'admin123' })
    });
    const loginData = await loginResp.json();
    token = loginData.data.token;
    headers = { 'Authorization': `Bearer ${token}` };

    // Navigate to dashboard
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    await page.screenshot({ path: '/tmp/ims-dashboard.png', fullPage: true });
  });

  test('3. Test Warehouse page', async ({ page }) => {
    // Login first
    const loginResp = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'admin', password: 'admin123' })
    });
    const loginData = await loginResp.json();
    token = loginData.data.token;

    // Navigate to warehouse
    await page.goto(`${BASE_URL}/warehouse`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    await page.screenshot({ path: '/tmp/ims-warehouse.png', fullPage: true });
  });

  test('4. Test Sales page', async ({ page }) => {
    const loginResp = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'admin', password: 'admin123' })
    });
    const loginData = await loginResp.json();
    token = loginData.data.token;

    await page.goto(`${BASE_URL}/sales`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    await page.screenshot({ path: '/tmp/ims-sales.png', fullPage: true });
  });

  test('5. Test Finance page', async ({ page }) => {
    const loginResp = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'admin', password: 'admin123' })
    });
    const loginData = await loginResp.json();
    token = loginData.data.token;

    await page.goto(`${BASE_URL}/finance`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    await page.screenshot({ path: '/tmp/ims-finance.png', fullPage: true });
  });

  test('6. API Health Check', async () => {
    const resp = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'admin', password: 'admin123' })
    });
    const data = await resp.json();
    console.log('Login API response:', JSON.stringify(data, null, 2));
    expect(data.success).toBe(true);
    expect(data.data.token).toBeDefined();
  });
});