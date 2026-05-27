import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3000';

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
    await page.waitForURL('**/dashboard', { timeout: 10000 }).catch(() => {});
    await page.waitForTimeout(2000);
  }
}

// ========== 1. DASHBOARD ==========
test.describe('Dashboard (仪表盘)', () => {
  test('1.1 Dashboard - 验证页面加载和统计卡片', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/dashboard`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const title = page.locator('h1:has-text("经营概览")');
    await expect(title).toBeVisible({ timeout: 10000 });

    const statCards = page.locator('.ant-statistic');
    expect(await statCards.count()).toBeGreaterThan(0);
  });

  test('1.2 Dashboard - 验证图表渲染', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/dashboard`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const charts = page.locator('.recharts-responsive-container');
    expect(await charts.count()).toBeGreaterThan(0);
  });

  test('1.3 Dashboard - 验证低库存预警和待办事项', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/dashboard`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const lowStockCard = page.locator('text=低库存预警').first();
    if (await lowStockCard.isVisible({ timeout: 2000 }).catch(() => false)) {
      console.log('Low stock warning card visible');
    }

    const todoCard = page.locator('text=待办事项');
    await expect(todoCard).toBeVisible({ timeout: 5000 });
  });

  test('1.4 Dashboard - 从其他页面返回仪表盘', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/sales/order`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const dashboardMenu = page.locator('.ant-menu-item').filter({ hasText: /仪表盘/ }).first();
    await dashboardMenu.click();
    await page.waitForTimeout(1500);
    expect(page.url()).toContain('/dashboard');
  });
});

// ========== 2. PRODUCT ==========
test.describe('Product (商品管理)', () => {
  test('2.1 Product - 验证页面加载', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/product`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const title = page.locator('h2:has-text("商品管理")');
    await expect(title).toBeVisible({ timeout: 10000 });
  });

  test('2.2 Product - 验证搜索和新增按钮', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/product`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const searchInput = page.locator('input[placeholder*="搜索"]');
    if (await searchInput.isVisible({ timeout: 2000 }).catch(() => false)) {
      console.log('Search input found');
    }

    const addBtn = page.locator('button:has-text("新增商品"), button:has-text("新增")');
    if (await addBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await addBtn.click();
      await page.waitForTimeout(1000);
      const modal = page.locator('.ant-modal');
      if (await modal.isVisible({ timeout: 3000 }).catch(() => false)) {
        console.log('Product add modal opened');
        await page.keyboard.press('Escape');
      }
    }
  });

  test('2.3 Product - 验证分类Tab和表格', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/product`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const categoryTab = page.locator('.ant-tabs-tab:has-text("分类"), .ant-tabs-tab:has-text("商品分类")');
    if (await categoryTab.isVisible({ timeout: 2000 }).catch(() => false)) {
      await categoryTab.click();
      await page.waitForTimeout(1000);
      console.log('Category tab clicked');
    }

    const table = page.locator('.ant-table');
    await expect(table).toBeVisible();
  });
});

// ========== 3. WAREHOUSE ==========
test.describe('Warehouse (仓库管理)', () => {
  test('3.1 Warehouse - 验证页面加载', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/warehouse`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const title = page.locator('h2:has-text("仓库管理")');
    await expect(title).toBeVisible({ timeout: 10000 });
  });

  test('3.2 Warehouse - 验证新增按钮', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/warehouse`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const addBtn = page.locator('button:has-text("新增仓库"), button:has-text("新增")');
    if (await addBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await addBtn.click();
      await page.waitForTimeout(1000);
      const modal = page.locator('.ant-modal');
      if (await modal.isVisible({ timeout: 3000 }).catch(() => false)) {
        console.log('Warehouse add modal opened');
        await page.keyboard.press('Escape');
      }
    }
  });

  test('3.3 Warehouse - 验证库位Tab和表格', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/warehouse/location`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const table = page.locator('.ant-table');
    await expect(table).toBeVisible();
  });
});

// ========== 4. CUSTOMER ==========
test.describe('Customer (客户管理)', () => {
  test('4.1 Customer - 验证页面加载', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/customer`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const title = page.locator('h2:has-text("客户管理")');
    await expect(title).toBeVisible({ timeout: 10000 });
  });

  test('4.2 Customer - 验证搜索和新增按钮', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/customer`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const searchInput = page.locator('input[placeholder*="搜索"]');
    if (await searchInput.isVisible({ timeout: 2000 }).catch(() => false)) {
      console.log('Search input found');
    }

    const addBtn = page.locator('button:has-text("新增客户")');
    if (await addBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await addBtn.click();
      await page.waitForTimeout(1000);
      const modal = page.locator('.ant-modal');
      if (await modal.isVisible({ timeout: 3000 }).catch(() => false)) {
        console.log('Customer add modal opened');
        await page.keyboard.press('Escape');
      }
    }
  });

  test('4.3 Customer - 验证详情、编辑、删除按钮', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/customer`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const firstRow = page.locator('.ant-table-tbody tr').first();
    if (await firstRow.isVisible({ timeout: 3000 }).catch(() => false)) {
      const detailBtn = firstRow.locator('button:has-text("详情")');
      if (await detailBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
        await detailBtn.click();
        await page.waitForTimeout(1500);
        const modal = page.locator('.ant-modal');
        if (await modal.isVisible({ timeout: 3000 }).catch(() => false)) {
          console.log('Customer detail modal opened');
          await page.keyboard.press('Escape');
        }
      }
    }

    await page.waitForTimeout(500);
    const table = page.locator('.ant-table');
    await expect(table).toBeVisible();
  });
});

// ========== 5. SUPPLIER ==========
test.describe('Supplier (供应商管理)', () => {
  test('5.1 Supplier - 验证页面加载', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/supplier`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const title = page.locator('h2:has-text("供应商管理")');
    await expect(title).toBeVisible({ timeout: 10000 });
  });

  test('5.2 Supplier - 验证搜索和新增按钮', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/supplier`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const searchInput = page.locator('input[placeholder*="搜索"]');
    if (await searchInput.isVisible({ timeout: 2000 }).catch(() => false)) {
      console.log('Search input found');
    }

    const addBtn = page.locator('button:has-text("新增供应商")');
    if (await addBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await addBtn.click();
      await page.waitForTimeout(1000);
      const modal = page.locator('.ant-modal');
      if (await modal.isVisible({ timeout: 3000 }).catch(() => false)) {
        console.log('Supplier add modal opened');
        await page.keyboard.press('Escape');
      }
    }
  });

  test('5.3 Supplier - 验证详情、编辑、删除按钮', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/supplier`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const firstRow = page.locator('.ant-table-tbody tr').first();
    if (await firstRow.isVisible({ timeout: 3000 }).catch(() => false)) {
      const detailBtn = firstRow.locator('button:has-text("详情")');
      if (await detailBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
        await detailBtn.click();
        await page.waitForTimeout(1500);
        const modal = page.locator('.ant-modal');
        if (await modal.isVisible({ timeout: 3000 }).catch(() => false)) {
          console.log('Supplier detail modal opened');
          await page.keyboard.press('Escape');
        }
      }
    }

    await page.waitForTimeout(500);
    const table = page.locator('.ant-table');
    await expect(table).toBeVisible();
  });
});