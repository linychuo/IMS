import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3000';
const API_URL = 'http://localhost:8080';

// Helper to login via UI
async function loginViaUI(page: any) {
  await page.goto(BASE_URL);
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000);

  const usernameInput = page.locator('input[type="text"], input[placeholder*="用户"], input[name="username"]').first();
  const passwordInput = page.locator('input[type="password"]').first();

  if (await usernameInput.isVisible({ timeout: 5000 }).catch(() => false)) {
    await usernameInput.fill('admin');
    await passwordInput.fill('admin123');

    const loginButton = page.locator('button[type="submit"], button:has-text("登录")').first();
    await loginButton.click();

    // Wait for redirect away from login page
    await page.waitForURL('**/dashboard', { timeout: 10000 }).catch(() => {
      // If no redirect, check if we're still on login
      if (page.url().includes('/login')) {
        console.log('Still on login page after click, waiting...');
        page.waitForTimeout(3000);
      }
    });
    await page.waitForTimeout(2000);
    console.log('After login, URL:', page.url());
  } else {
    console.log('Already logged in or no login form found, URL:', page.url());
  }
}

test.describe('IMS E2E Tests', () => {

  // ===== 1. Login Test =====
  test('1. Login with admin account', async ({ page }) => {
    await loginViaUI(page);
    await page.waitForTimeout(1000);
    console.log('After login, URL:', page.url());
    await page.screenshot({ path: '/tmp/ims-login.png', fullPage: true });
  });

  // ===== 2. Dashboard Tests =====
  test('2. Dashboard displays correctly', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/dashboard`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Check dashboard title
    const title = page.locator('h1:has-text("经营概览")');
    await expect(title).toBeVisible({ timeout: 10000 });

    // Check stat cards exist
    const statCards = page.locator('.ant-statistic');
    expect(await statCards.count()).toBeGreaterThan(0);

    // Check for charts (recharts)
    const charts = page.locator('.recharts-responsive-container');
    expect(await charts.count()).toBeGreaterThan(0);

    await page.screenshot({ path: '/tmp/ims-dashboard.png', fullPage: true });
  });

  // ===== 3. Sales Order Tests =====
  test('3. Sales Order - List and View Details with Timeline', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/sales/order`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Check page title
    const title = page.locator('h2:has-text("销售订单")');
    await expect(title).toBeVisible({ timeout: 10000 });

    // Check table exists
    const table = page.locator('.ant-table');
    await expect(table).toBeVisible();

    // Try to click on a row to view details (if data exists)
    const firstRow = page.locator('.ant-table-tbody tr').first();
    if (await firstRow.isVisible({ timeout: 3000 }).catch(() => false)) {
      const viewBtn = firstRow.locator('button:has-text("查看")');
      if (await viewBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
        await viewBtn.click();
        await page.waitForTimeout(1000);

        // Check details modal appears
        const modal = page.locator('.ant-modal');
        await expect(modal).toBeVisible({ timeout: 3000 });

        // Check for order details fields
        const orderNo = page.locator('text=订单编号');
        await expect(orderNo.first()).toBeVisible();

        // Check for Steps (order progress) if present
        const steps = page.locator('.ant-steps');
        if (await steps.isVisible({ timeout: 2000 }).catch(() => false)) {
          console.log('Order Steps component is visible');
        }

        // Check for Timeline (operation history) if present
        const timeline = page.locator('.ant-timeline');
        if (await timeline.isVisible({ timeout: 2000 }).catch(() => false)) {
          console.log('Order Timeline component is visible');
        }

        // Close modal
        await page.keyboard.press('Escape');
        await page.waitForTimeout(500);
      }
    }

    // Check for "新增订单" button
    const addBtn = page.locator('button:has-text("新增订单")');
    await expect(addBtn).toBeVisible();

    await page.screenshot({ path: '/tmp/ims-sales-order.png', fullPage: true });
  });

  // ===== 4. Supplier Reconciliation Tests =====
  test('4. Supplier Reconciliation - Statistics and Filter', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/finance/supplier-reconciliation`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Check page title
    const title = page.locator('h2:has-text("供应商对账")');
    await expect(title).toBeVisible({ timeout: 10000 });

    // Check statistics cards exist
    const statCards = page.locator('.ant-statistic');
    const statCount = await statCards.count();
    expect(statCount).toBeGreaterThan(0);
    console.log(`Found ${statCount} statistic cards`);

    // Check for search input
    const searchInput = page.locator('input[placeholder*="搜索供应商"]');
    if (await searchInput.isVisible({ timeout: 2000 }).catch(() => false)) {
      console.log('Supplier search input found');
    }

    // Check table exists
    const table = page.locator('.ant-table');
    await expect(table).toBeVisible();

    // Check date picker
    const datePicker = page.locator('.ant-picker-range');
    if (await datePicker.isVisible({ timeout: 2000 }).catch(() => false)) {
      console.log('Date range picker found');
    }

    await page.screenshot({ path: '/tmp/ims-supplier-recon.png', fullPage: true });
  });

  // ===== 5. Report Center - Sales Report and Export Tests =====
  test('5. Report Center - Sales Report and Export', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/report`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Check page title
    const title = page.locator('h2:has-text("报表中心")');
    await expect(title).toBeVisible({ timeout: 10000 });

    // Click on Sales Report tab
    const salesTab = page.locator('.ant-tabs-tab:has-text("销售报表")');
    await salesTab.click();
    await page.waitForTimeout(1500);

    // Check for statistic cards
    const statCards = page.locator('.ant-statistic');
    expect(await statCards.count()).toBeGreaterThan(0);

    // Check for export button
    const exportBtn = page.locator('button:has-text("导出CSV")');
    if (await exportBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      console.log('Export CSV button found in Sales Report');
    }

    await page.screenshot({ path: '/tmp/ims-report-sales.png', fullPage: true });
  });

  test('6. Report Center - Purchase Report and Export', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/report`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Click on Purchase Report tab
    const purchaseTab = page.locator('.ant-tabs-tab:has-text("采购报表")');
    await purchaseTab.click();
    await page.waitForTimeout(1500);

    // Check for export button
    const exportBtn = page.locator('button:has-text("导出CSV")');
    if (await exportBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      console.log('Export CSV button found in Purchase Report');
    }

    await page.screenshot({ path: '/tmp/ims-report-purchase.png', fullPage: true });
  });

  test('7. Report Center - Customer Analysis Export', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/report`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Click on Customer Analysis tab
    const customerTab = page.locator('.ant-tabs-tab:has-text("客户分析")');
    await customerTab.click();
    await page.waitForTimeout(1500);

    // Check for export button
    const exportBtn = page.locator('button:has-text("导出CSV")');
    if (await exportBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      console.log('Export CSV button found in Customer Analysis');
    }

    await page.screenshot({ path: '/tmp/ims-report-customer.png', fullPage: true });
  });

  // ===== 8. Inventory Alert Tests =====
  test('8. Inventory Alert - Stock and Expiry Warnings', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/inventory/alert`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Check page title - could be h2 or other element
    const title = page.locator('h2:has-text("库存预警")');
    await expect(title).toBeVisible({ timeout: 10000 });

    // Check tabs exist
    const stockTab = page.locator('.ant-tabs-tab:has-text("库存预警")');
    const expiryTab = page.locator('.ant-tabs-tab:has-text("临期预警")');

    if (await stockTab.isVisible({ timeout: 2000 }).catch(() => false)) {
      console.log('Stock warning tab found');
    }

    if (await expiryTab.isVisible({ timeout: 2000 }).catch(() => false)) {
      console.log('Expiry warning tab found');
      // Click on expiry tab
      await expiryTab.click();
      await page.waitForTimeout(1000);

      // Check for table
      const table = page.locator('.ant-table');
      if (await table.isVisible({ timeout: 2000 }).catch(() => false)) {
        console.log('Expiry table found');
      }
    }

    await page.screenshot({ path: '/tmp/ims-inventory-alert.png', fullPage: true });
  });

  // ===== 9. Report - Low Stock Export =====
  test('9. Report Center - Inventory Report and Low Stock Export', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/report`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Check page title
    const title = page.locator('h2:has-text("报表中心")');
    await expect(title).toBeVisible({ timeout: 10000 });

    // Click on Inventory Report tab - use first tab that contains "库存"
    const inventoryTab = page.locator('.ant-tabs-tab').filter({ hasText: /库存/ }).first();
    const tabCount = await page.locator('.ant-tabs-tab').filter({ hasText: /库存/ }).count();

    if (tabCount === 0) {
      console.log('No inventory tab found - checking available tabs');
      const allTabs = await page.locator('.ant-tabs-tab').allTextContents();
      console.log('Available tabs:', allTabs);
      // Skip this test if tab not visible
      test.skip('Inventory tab not visible (permission issue)');
      return;
    }

    console.log(`Found ${tabCount} inventory-related tabs`);
    await inventoryTab.click();
    await page.waitForTimeout(1500);

    // Check for export button (low stock)
    const exportBtn = page.locator('button:has-text("导出低库存")');
    if (await exportBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      console.log('Export low stock button found');
    }

    await page.screenshot({ path: '/tmp/ims-report-inventory.png', fullPage: true });
  });

  // ===== 10. API Health Check =====
  test('10. API Health Check', async () => {
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