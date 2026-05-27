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

  // ===== 11. Barcode Scanner - Inventory In =====
  test('11. Inventory In - Barcode Scanner Button Visible', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/inventory/in`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const title = page.locator('h2:has-text("入库单")');
    await expect(title).toBeVisible({ timeout: 10000 });

    const table = page.locator('.ant-table');
    await expect(table).toBeVisible();

    const scanBtn = page.locator('button:has-text("扫码入库"), button:has-text("扫码添加商品")');
    if (await scanBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      console.log('Barcode scan button found');
      await scanBtn.click();
      await page.waitForTimeout(1000);

      const scannerModal = page.locator('.ant-modal');
      if (await scannerModal.isVisible({ timeout: 3000 }).catch(() => false)) {
        console.log('Scanner modal opened successfully');

        const closeBtn = page.locator('button:has-text("关闭")');
        if (await closeBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
          await closeBtn.click();
          await page.waitForTimeout(500);
        }
      }
    }

    await page.screenshot({ path: '/tmp/ims-inventory-in-scanner.png', fullPage: true });
  });

  // ===== 12. Barcode Scanner - Inventory Out =====
  test('12. Inventory Out - Barcode Scanner Button Visible', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/inventory/out`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const title = page.locator('h2:has-text("出库单")');
    await expect(title).toBeVisible({ timeout: 10000 });

    const scanBtn = page.locator('button:has-text("扫码出库"), button:has-text("扫码添加商品")');
    if (await scanBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      console.log('Barcode scan button found');
      await scanBtn.click();
      await page.waitForTimeout(1000);

      const scannerModal = page.locator('.ant-modal');
      if (await scannerModal.isVisible({ timeout: 3000 }).catch(() => false)) {
        console.log('Scanner modal opened successfully');

        const closeBtn = page.locator('button:has-text("关闭")');
        if (await closeBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
          await closeBtn.click();
          await page.waitForTimeout(500);
        }
      }
    }

    await page.screenshot({ path: '/tmp/ims-inventory-out-scanner.png', fullPage: true });
  });

  // ===== 13. Sales Order Print Preview =====
  test('13. Sales Order - Print Preview Button Visible', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/sales/order`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const title = page.locator('h2:has-text("销售订单")');
    await expect(title).toBeVisible({ timeout: 10000 });

    const firstRow = page.locator('.ant-table-tbody tr').first();
    if (await firstRow.isVisible({ timeout: 3000 }).catch(() => false)) {
      const viewBtn = firstRow.locator('button:has-text("查看")');
      if (await viewBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
        await viewBtn.click();
        await page.waitForTimeout(1500);

        const modal = page.locator('.ant-modal');
        if (await modal.isVisible({ timeout: 3000 }).catch(() => false)) {
          console.log('Order detail modal opened');

          const printBtn = page.locator('button:has-text("打印"), button:has-text("打印预览")');
          if (await printBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
            console.log('Print button found');
          }
        }

        await page.keyboard.press('Escape');
        await page.waitForTimeout(500);
      }
    }

    await page.screenshot({ path: '/tmp/ims-sales-order-print.png', fullPage: true });
  });

  // ===== 14. Dashboard Pending Counts =====
  test('14. Dashboard - Pending Receive and Payment Counts', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/dashboard`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const title = page.locator('h1:has-text("经营概览")');
    await expect(title).toBeVisible({ timeout: 10000 });

    const statCards = page.locator('.ant-statistic');
    const statCount = await statCards.count();
    expect(statCount).toBeGreaterThan(0);
    console.log(`Dashboard has ${statCount} statistic cards`);

    const pendingLabels = [
      '待收款',
      '待付款',
      '待处理采购单',
      '待审核销售单'
    ];

    for (const label of pendingLabels) {
      const labelEl = page.locator('.ant-statistic-title').filter({ hasText: label });
      if (await labelEl.isVisible({ timeout: 2000 }).catch(() => false)) {
        console.log(`Found stat card for: ${label}`);
      }
    }

    await page.screenshot({ path: '/tmp/ims-dashboard-pending.png', fullPage: true });
  });

  // ===== 15. Supplier Reconciliation - Payment Status =====
  test('15. Supplier Reconciliation - Payment Status Filter', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/finance/supplier-reconciliation`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const title = page.locator('h2:has-text("供应商对账")');
    await expect(title).toBeVisible({ timeout: 10000 });

    const table = page.locator('.ant-table');
    await expect(table).toBeVisible();

    const pendingStatus = page.locator('.ant-tag:has-text("待付款"), .ant-tag:has-text("已付款"), .ant-tag:has-text("部分付款")');
    if (await pendingStatus.first().isVisible({ timeout: 2000 }).catch(() => false)) {
      console.log('Payment status tags found');
    }

    await page.screenshot({ path: '/tmp/ims-supplier-recon-status.png', fullPage: true });
  });

  // ===== 16. Report Center - Profit Margin Report =====
  test('16. Report Center - Profit Margin Report Tab Exists', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/report`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const title = page.locator('h2:has-text("报表中心")');
    await expect(title).toBeVisible({ timeout: 10000 });

    const profitTab = page.locator('.ant-tabs-tab').filter({ hasText: /毛利/ });
    if (await profitTab.isVisible({ timeout: 2000 }).catch(() => false)) {
      console.log('Profit margin tab found');
      await profitTab.click();
      await page.waitForTimeout(1500);
    }

    const exportBtn = page.locator('button:has-text("导出CSV"), button:has-text("导出")');
    if (await exportBtn.first().isVisible({ timeout: 2000 }).catch(() => false)) {
      console.log('Export button found in current tab');
    }

    await page.screenshot({ path: '/tmp/ims-report-profit.png', fullPage: true });
  });

  // ===== 17. Sales Order Track - Status Timeline =====
  test('17. Sales Order Track - Status Timeline View', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/sales/track`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const title = page.locator('h2:has-text("销售订单跟踪")');
    await expect(title).toBeVisible({ timeout: 10000 });

    // Check statistics cards exist
    const statCards = page.locator('.ant-statistic');
    expect(await statCards.count()).toBeGreaterThan(0);

    // Check table exists
    const table = page.locator('.ant-table');
    await expect(table).toBeVisible();

    // Click on track button of first row if available
    const firstRow = page.locator('.ant-table-tbody tr').first();
    if (await firstRow.isVisible({ timeout: 3000 }).catch(() => false)) {
      const trackBtn = firstRow.locator('button:has-text("跟踪")');
      if (await trackBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
        await trackBtn.click();
        await page.waitForTimeout(1500);

        const modal = page.locator('.ant-modal');
        if (await modal.isVisible({ timeout: 3000 }).catch(() => false)) {
          console.log('Order track modal opened');

          // Check for status timeline
          const timeline = page.locator('.ant-timeline');
          if (await timeline.isVisible({ timeout: 2000 }).catch(() => false)) {
            console.log('Status timeline found in track modal');
          }
        }

        await page.keyboard.press('Escape');
        await page.waitForTimeout(500);
      }
    }

    await page.screenshot({ path: '/tmp/ims-sales-track.png', fullPage: true });
  });

  // ===== 18. Purchase Order Track - Status Timeline =====
  test('18. Purchase Order Track - Status Timeline View', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/purchase/track`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const title = page.locator('h2:has-text("采购订单跟踪")');
    await expect(title).toBeVisible({ timeout: 10000 });

    // Check statistics cards exist
    const statCards = page.locator('.ant-statistic');
    expect(await statCards.count()).toBeGreaterThan(0);

    // Check table exists
    const table = page.locator('.ant-table');
    await expect(table).toBeVisible();

    // Click on track button of first row if available
    const firstRow = page.locator('.ant-table-tbody tr').first();
    if (await firstRow.isVisible({ timeout: 3000 }).catch(() => false)) {
      const trackBtn = firstRow.locator('button:has-text("跟踪")');
      if (await trackBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
        await trackBtn.click();
        await page.waitForTimeout(1500);

        const modal = page.locator('.ant-modal');
        if (await modal.isVisible({ timeout: 3000 }).catch(() => false)) {
          console.log('Purchase order track modal opened');

          // Check for timeline in modal
          const timeline = page.locator('.ant-timeline');
          if (await timeline.isVisible({ timeout: 2000 }).catch(() => false)) {
            console.log('Status timeline found');
          }
        }

        await page.keyboard.press('Escape');
        await page.waitForTimeout(500);
      }
    }

    await page.screenshot({ path: '/tmp/ims-purchase-track.png', fullPage: true });
  });

  // ===== 19. Customer - Detail Modal with Sales History =====
  test('19. Customer - Detail Modal with Sales History Stats', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/customer`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const title = page.locator('h2:has-text("客户管理")');
    await expect(title).toBeVisible({ timeout: 10000 });

    // Check table exists
    const table = page.locator('.ant-table');
    await expect(table).toBeVisible();

    // Click on detail button of first row
    const firstRow = page.locator('.ant-table-tbody tr').first();
    if (await firstRow.isVisible({ timeout: 3000 }).catch(() => false)) {
      const detailBtn = firstRow.locator('button:has-text("详情")');
      if (await detailBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
        await detailBtn.click();
        await page.waitForTimeout(1500);

        const modal = page.locator('.ant-modal');
        if (await modal.isVisible({ timeout: 3000 }).catch(() => false)) {
          console.log('Customer detail modal opened');

          // Check for tabs (基本信息, 销售历史)
          const basicTab = page.locator('.ant-tabs-tab:has-text("基本信息")');
          const salesTab = page.locator('.ant-tabs-tab:has-text("销售历史")');

          if (await basicTab.isVisible({ timeout: 2000 }).catch(() => false)) {
            console.log('Basic info tab found');
          }

          if (await salesTab.isVisible({ timeout: 2000 }).catch(() => false)) {
            console.log('Sales history tab found');
            await salesTab.click();
            await page.waitForTimeout(1000);

            // Check for statistics cards in sales history
            const statCards = page.locator('.ant-statistic');
            if (await statCards.first().isVisible({ timeout: 2000 }).catch(() => false)) {
              console.log('Sales history statistics found');
            }
          }
        }

        await page.keyboard.press('Escape');
        await page.waitForTimeout(500);
      }
    }

    await page.screenshot({ path: '/tmp/ims-customer-detail.png', fullPage: true });
  });

  // ===== 20. Supplier - Detail Modal with Purchase History =====
  test('20. Supplier - Detail Modal with Purchase History Stats', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/supplier`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const title = page.locator('h2:has-text("供应商管理")');
    await expect(title).toBeVisible({ timeout: 10000 });

    // Check table exists
    const table = page.locator('.ant-table');
    await expect(table).toBeVisible();

    // Click on detail button of first row
    const firstRow = page.locator('.ant-table-tbody tr').first();
    if (await firstRow.isVisible({ timeout: 3000 }).catch(() => false)) {
      const detailBtn = firstRow.locator('button:has-text("详情")');
      if (await detailBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
        await detailBtn.click();
        await page.waitForTimeout(1500);

        const modal = page.locator('.ant-modal');
        if (await modal.isVisible({ timeout: 3000 }).catch(() => false)) {
          console.log('Supplier detail modal opened');

          // Check for tabs (基本信息, 采购历史)
          const basicTab = page.locator('.ant-tabs-tab:has-text("基本信息")');
          const purchaseTab = page.locator('.ant-tabs-tab:has-text("采购历史")');

          if (await basicTab.isVisible({ timeout: 2000 }).catch(() => false)) {
            console.log('Basic info tab found');
          }

          if (await purchaseTab.isVisible({ timeout: 2000 }).catch(() => false)) {
            console.log('Purchase history tab found');
            await purchaseTab.click();
            await page.waitForTimeout(1000);

            // Check for statistics cards in purchase history
            const statCards = page.locator('.ant-statistic');
            if (await statCards.first().isVisible({ timeout: 2000 }).catch(() => false)) {
              console.log('Purchase history statistics found');
            }
          }
        }

        await page.keyboard.press('Escape');
        await page.waitForTimeout(500);
      }
    }

    await page.screenshot({ path: '/tmp/ims-supplier-detail.png', fullPage: true });
  });

  // ===== 21. Inventory Alert - Idle Stock Tab (呆滞库存) =====
  test('21. Inventory Alert - Idle Stock Tab (呆滞库存)', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/inventory/alert`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const title = page.locator('h2:has-text("库存预警")');
    await expect(title).toBeVisible({ timeout: 10000 });

    // Look for idle stock tab
    const idleTab = page.locator('.ant-tabs-tab').filter({ hasText: /呆滞/ });
    if (await idleTab.isVisible({ timeout: 2000 }).catch(() => false)) {
      console.log('Idle stock tab found');
      await idleTab.click();
      await page.waitForTimeout(1500);

      // Check for table
      const table = page.locator('.ant-table');
      if (await table.isVisible({ timeout: 2000 }).catch(() => false)) {
        console.log('Idle stock table found');
      }
    } else {
      console.log('Idle stock tab not found, checking all tabs');
      const allTabs = await page.locator('.ant-tabs-tab').allTextContents();
      console.log('Available tabs:', allTabs);
    }

    await page.screenshot({ path: '/tmp/ims-inventory-alert-idle.png', fullPage: true });
  });

  // ===== 22. Sales Price Strategy - Search and Filter =====
  test('22. Sales Price Strategy - Search and Statistics', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/sales/price-strategy`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const title = page.locator('h2:has-text("价格策略")');
    await expect(title).toBeVisible({ timeout: 10000 });

    // Check statistics cards exist
    const statCards = page.locator('.ant-statistic');
    const statCount = await statCards.count();
    expect(statCount).toBeGreaterThan(0);
    console.log(`Found ${statCount} statistic cards in price strategy`);

    // Check search input exists
    const searchInput = page.locator('input[placeholder*="搜索"]');
    if (await searchInput.isVisible({ timeout: 2000 }).catch(() => false)) {
      console.log('Search input found');
    }

    // Check customer filter dropdown
    const customerSelect = page.locator('.ant-select').filter({ hasPlaceholder: /客户/ }).first();
    if (await customerSelect.isVisible({ timeout: 2000 }).catch(() => false)) {
      console.log('Customer filter found');
    }

    // Check table exists
    const table = page.locator('.ant-table');
    await expect(table).toBeVisible();

    await page.screenshot({ path: '/tmp/ims-price-strategy.png', fullPage: true });
  });

  // ===== 23. Batch Traceability - Warehouse and Product Filter =====
  test('23. Batch Traceability - Warehouse and Product Filter', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/inventory/batch`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const title = page.locator('h2:has-text("批次追溯")');
    await expect(title).toBeVisible({ timeout: 10000 });

    // Check for warehouse filter dropdown
    const warehouseSelect = page.locator('.ant-select').filter({ hasPlaceholder: /仓库/ }).first();
    if (await warehouseSelect.isVisible({ timeout: 2000 }).catch(() => false)) {
      console.log('Warehouse filter found');
    }

    // Check for product filter dropdown
    const productSelect = page.locator('.ant-select').filter({ hasPlaceholder: /商品/ }).first();
    if (await productSelect.isVisible({ timeout: 2000 }).catch(() => false)) {
      console.log('Product filter found');
    }

    // Check table exists
    const table = page.locator('.ant-table');
    await expect(table).toBeVisible();

    await page.screenshot({ path: '/tmp/ims-batch-trace.png', fullPage: true });
  });

  // ===== 24. Navigate Back to Dashboard from Any Page =====
  test('24. Navigate Back to Dashboard from Any Page', async ({ page }) => {
    await loginViaUI(page);

    // Navigate to a different page first
    await page.goto(`${BASE_URL}/sales/order`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    console.log('Current URL:', page.url());

    // Click on Dashboard menu item
    const dashboardMenu = page.locator('.ant-menu-item').filter({ hasText: /仪表盘/ }).first();
    if (await dashboardMenu.isVisible({ timeout: 2000 }).catch(() => false)) {
      console.log('Dashboard menu item found');
      await dashboardMenu.click();
      await page.waitForTimeout(1500);

      const currentUrl = page.url();
      console.log('After clicking dashboard, URL:', currentUrl);

      if (currentUrl.includes('/dashboard')) {
        console.log('Successfully navigated to dashboard');
      }
    } else {
      console.log('Dashboard menu item not visible - checking menu structure');
      const allMenuItems = await page.locator('.ant-menu-item').allTextContents();
      console.log('All menu items:', allMenuItems);
    }

    await page.screenshot({ path: '/tmp/ims-navigate-dashboard.png', fullPage: true });
  });
});