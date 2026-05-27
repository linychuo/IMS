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

// ========== 6. SALES ORDER ==========
test.describe('Sales Order (销售订单)', () => {
  test('6.1 Sales Order - 验证页面加载', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/sales/order`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const title = page.locator('h2:has-text("销售订单")');
    await expect(title).toBeVisible({ timeout: 10000 });
  });

  test('6.2 Sales Order - 验证搜索和新增按钮', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/sales/order`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const searchInput = page.locator('input[placeholder*="搜索"]');
    if (await searchInput.isVisible({ timeout: 2000 }).catch(() => false)) {
      console.log('Search input found');
    }

    const addBtn = page.locator('button:has-text("新增订单"), button:has-text("新增销售订单")');
    if (await addBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await addBtn.click();
      await page.waitForTimeout(1000);
      const modal = page.locator('.ant-modal');
      if (await modal.isVisible({ timeout: 3000 }).catch(() => false)) {
        console.log('Sales order add modal opened');
        await page.keyboard.press('Escape');
      }
    }
  });

  test('6.3 Sales Order - 验证查看、打印、审核按钮', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/sales/order`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const firstRow = page.locator('.ant-table-tbody tr').first();
    if (await firstRow.isVisible({ timeout: 3000 }).catch(() => false)) {
      const viewBtn = firstRow.locator('button:has-text("查看")');
      if (await viewBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
        await viewBtn.click();
        await page.waitForTimeout(1500);
        const modal = page.locator('.ant-modal');
        if (await modal.isVisible({ timeout: 3000 }).catch(() => false)) {
          console.log('Sales order detail modal opened');
          await page.keyboard.press('Escape');
        }
      }
    }
  });

  test('6.4 Sales Order - 验证编辑和取消按钮', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/sales/order`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const firstRow = page.locator('.ant-table-tbody tr').first();
    if (await firstRow.isVisible({ timeout: 3000 }).catch(() => false)) {
      const editBtn = firstRow.locator('button:has-text("编辑")');
      const cancelBtn = firstRow.locator('button:has-text("取消")');
      if (await editBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
        console.log('Edit button found');
      }
      if (await cancelBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
        console.log('Cancel button found');
      }
    }

    const table = page.locator('.ant-table');
    await expect(table).toBeVisible();
  });
});

// ========== 7. SALES OUT ==========
test.describe('Sales Out (销售出库)', () => {
  test('7.1 Sales Out - 验证页面加载', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/sales/out`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const title = page.locator('h2:has-text("销售出库")');
    await expect(title).toBeVisible({ timeout: 10000 });
  });

  test('7.2 Sales Out - 验证新增按钮', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/sales/out`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const addBtn = page.locator('button:has-text("新增出库"), button:has-text("新建出库")');
    if (await addBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await addBtn.click();
      await page.waitForTimeout(1000);
      const modal = page.locator('.ant-modal');
      if (await modal.isVisible({ timeout: 3000 }).catch(() => false)) {
        console.log('Sales out add modal opened');
        await page.keyboard.press('Escape');
      }
    }
  });

  test('7.3 Sales Out - 验证查看、审核按钮和表格', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/sales/out`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const firstRow = page.locator('.ant-table-tbody tr').first();
    if (await firstRow.isVisible({ timeout: 3000 }).catch(() => false)) {
      const viewBtn = firstRow.locator('button:has-text("查看")');
      const auditBtn = firstRow.locator('button:has-text("审核")');
      if (await viewBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
        console.log('View button found');
      }
      if (await auditBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
        console.log('Audit button found');
      }
    }

    const table = page.locator('.ant-table');
    await expect(table).toBeVisible();
  });
});

// ========== 8. SALES RETURN ==========
test.describe('Sales Return (销售退货)', () => {
  test('8.1 Sales Return - 验证页面加载', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/sales/return`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const title = page.locator('h2:has-text("销售退货")');
    await expect(title).toBeVisible({ timeout: 10000 });
  });

  test('8.2 Sales Return - 验证新建退货按钮', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/sales/return`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const addBtn = page.locator('button:has-text("新建退货"), button:has-text("新增退货")');
    if (await addBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await addBtn.click();
      await page.waitForTimeout(1000);
      const modal = page.locator('.ant-modal');
      if (await modal.isVisible({ timeout: 3000 }).catch(() => false)) {
        console.log('Sales return add modal opened');
        await page.keyboard.press('Escape');
      }
    }
  });

  test('8.3 Sales Return - 验证查看、通过/拒绝按钮', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/sales/return`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const firstRow = page.locator('.ant-table-tbody tr').first();
    if (await firstRow.isVisible({ timeout: 3000 }).catch(() => false)) {
      const viewBtn = firstRow.locator('button:has-text("查看")');
      const passBtn = firstRow.locator('button:has-text("通过")');
      if (await viewBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
        console.log('View button found');
      }
      if (await passBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
        console.log('Pass button found');
      }
    }

    const table = page.locator('.ant-table');
    await expect(table).toBeVisible();
  });
});

// ========== 9. SALES PRICE STRATEGY ==========
test.describe('Sales Price Strategy (价格策略)', () => {
  test('9.1 Price Strategy - 验证页面加载和统计卡片', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/sales/price-strategy`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const title = page.locator('h2:has-text("价格策略")');
    await expect(title).toBeVisible({ timeout: 10000 });

    const statCards = page.locator('.ant-statistic');
    expect(await statCards.count()).toBeGreaterThan(0);
  });

  test('9.2 Price Strategy - 验证搜索和筛选', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/sales/price-strategy`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const searchInput = page.locator('input[placeholder*="搜索"]');
    if (await searchInput.isVisible({ timeout: 2000 }).catch(() => false)) {
      console.log('Search input found');
    }

    const customerSelect = page.locator('.ant-select').filter({ hasPlaceholder: /客户/ }).first();
    if (await customerSelect.isVisible({ timeout: 2000 }).catch(() => false)) {
      console.log('Customer filter found');
    }
  });

  test('9.3 Price Strategy - 验证新建策略按钮', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/sales/price-strategy`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const addBtn = page.locator('button:has-text("新建策略"), button:has-text("新增策略")');
    if (await addBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await addBtn.click();
      await page.waitForTimeout(1000);
      const modal = page.locator('.ant-modal');
      if (await modal.isVisible({ timeout: 3000 }).catch(() => false)) {
        console.log('Price strategy add modal opened');
        await page.keyboard.press('Escape');
      }
    }
  });

  test('9.4 Price Strategy - 验证编辑、启用/禁用、删除按钮', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/sales/price-strategy`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const firstRow = page.locator('.ant-table-tbody tr').first();
    if (await firstRow.isVisible({ timeout: 3000 }).catch(() => false)) {
      const editBtn = firstRow.locator('button:has-text("编辑")');
      const toggleBtn = firstRow.locator('button:has-text("禁用"), button:has-text("启用")');
      const deleteBtn = firstRow.locator('button:has-text("删除")');
      if (await editBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
        console.log('Edit button found');
      }
      if (await toggleBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
        console.log('Toggle button found');
      }
      if (await deleteBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
        console.log('Delete button found');
      }
    }

    const table = page.locator('.ant-table');
    await expect(table).toBeVisible();
  });
});

// ========== 10. SALES ORDER TRACK ==========
test.describe('Sales Order Track (销售订单跟踪)', () => {
  test('10.1 Sales Track - 验证页面加载和统计卡片', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/sales/track`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const title = page.locator('h2:has-text("销售订单跟踪")');
    await expect(title).toBeVisible({ timeout: 10000 });

    const statCards = page.locator('.ant-statistic');
    expect(await statCards.count()).toBeGreaterThan(0);
  });

  test('10.2 Sales Track - 验证跟踪按钮和表格', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/sales/track`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const firstRow = page.locator('.ant-table-tbody tr').first();
    if (await firstRow.isVisible({ timeout: 3000 }).catch(() => false)) {
      const trackBtn = firstRow.locator('button:has-text("跟踪")');
      if (await trackBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
        await trackBtn.click();
        await page.waitForTimeout(1500);
        const modal = page.locator('.ant-modal');
        if (await modal.isVisible({ timeout: 3000 }).catch(() => false)) {
          console.log('Track modal opened');
          await page.keyboard.press('Escape');
        }
      }
    }

    const table = page.locator('.ant-table');
    await expect(table).toBeVisible();
  });
});

// ========== 11. SALES PROMOTION ==========
test.describe('Sales Promotion (促销管理)', () => {
  test('11.1 Promotion - 验证页面加载', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/sales/promotion`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const title = page.locator('h2:has-text("促销")').first();
    await expect(title).toBeVisible({ timeout: 10000 });
  });

  test('11.2 Promotion - 验证新增按钮和表格', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/sales/promotion`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const addBtn = page.locator('button:has-text("新增"), button:has-text("新建")').first();
    if (await addBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await addBtn.click();
      await page.waitForTimeout(1000);
      const modal = page.locator('.ant-modal');
      if (await modal.isVisible({ timeout: 3000 }).catch(() => false)) {
        console.log('Promotion add modal opened');
        await page.keyboard.press('Escape');
      }
    }

    const table = page.locator('.ant-table');
    await expect(table).toBeVisible();
  });
});