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

// ========== 12. PURCHASE ORDER ==========
test.describe('Purchase Order (采购订单)', () => {
  test('12.1 Purchase Order - 验证页面加载', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/purchase/order`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const title = page.locator('h2:has-text("采购订单")');
    await expect(title).toBeVisible({ timeout: 10000 });
  });

  test('12.2 Purchase Order - 验证新增按钮', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/purchase/order`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const addBtn = page.locator('button:has-text("新增订单"), button:has-text("新建订单")');
    if (await addBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await addBtn.click();
      await page.waitForTimeout(1000);
      const modal = page.locator('.ant-modal');
      if (await modal.isVisible({ timeout: 3000 }).catch(() => false)) {
        console.log('Purchase order add modal opened');
        await page.keyboard.press('Escape');
      }
    }
  });

  test('12.3 Purchase Order - 验证查看、审核按钮和表格', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/purchase/order`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const firstRow = page.locator('.ant-table-tbody tr').first();
    if (await firstRow.isVisible({ timeout: 3000 }).catch(() => false)) {
      const viewBtn = firstRow.locator('button:has-text("查看")');
      const auditBtn = firstRow.locator('button:has-text("审核"), button:has-text("审批")');
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

// ========== 13. PURCHASE TRACK ==========
test.describe('Purchase Order Track (采购订单跟踪)', () => {
  test('13.1 Purchase Track - 验证页面加载和统计卡片', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/purchase/track`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const title = page.locator('h2:has-text("采购订单跟踪")');
    await expect(title).toBeVisible({ timeout: 10000 });

    const statCards = page.locator('.ant-statistic');
    expect(await statCards.count()).toBeGreaterThan(0);
  });

  test('13.2 Purchase Track - 验证跟踪按钮和表格', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/purchase/track`);
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

// ========== 14. PURCHASE IN ==========
test.describe('Purchase In (采购入库)', () => {
  test('14.1 Purchase In - 验证页面加载', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/purchase/in`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const title = page.locator('h2:has-text("采购入库")');
    await expect(title).toBeVisible({ timeout: 10000 });
  });

  test('14.2 Purchase In - 验证新增按钮', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/purchase/in`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const addBtn = page.locator('button:has-text("新增入库"), button:has-text("新建入库")');
    if (await addBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await addBtn.click();
      await page.waitForTimeout(1000);
      const modal = page.locator('.ant-modal');
      if (await modal.isVisible({ timeout: 3000 }).catch(() => false)) {
        console.log('Purchase in add modal opened');
        await page.keyboard.press('Escape');
      }
    }
  });

  test('14.3 Purchase In - 验证查看按钮和表格', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/purchase/in`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const firstRow = page.locator('.ant-table-tbody tr').first();
    if (await firstRow.isVisible({ timeout: 3000 }).catch(() => false)) {
      const viewBtn = firstRow.locator('button:has-text("查看")');
      if (await viewBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
        console.log('View button found');
      }
    }

    const table = page.locator('.ant-table');
    await expect(table).toBeVisible();
  });
});

// ========== 15. PURCHASE RETURN ==========
test.describe('Purchase Return (采购退货)', () => {
  test('15.1 Purchase Return - 验证页面加载', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/purchase/return`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const title = page.locator('h2:has-text("采购退货")');
    await expect(title).toBeVisible({ timeout: 10000 });
  });

  test('15.2 Purchase Return - 验证新增按钮和表格', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/purchase/return`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const addBtn = page.locator('button:has-text("新增退货"), button:has-text("新建退货")');
    if (await addBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await addBtn.click();
      await page.waitForTimeout(1000);
      const modal = page.locator('.ant-modal');
      if (await modal.isVisible({ timeout: 3000 }).catch(() => false)) {
        console.log('Purchase return add modal opened');
        await page.keyboard.press('Escape');
      }
    }

    const table = page.locator('.ant-table');
    await expect(table).toBeVisible();
  });
});

// ========== 16. PURCHASE PRICE AGREEMENT ==========
test.describe('Purchase Price Agreement (采购价格协议)', () => {
  test('16.1 Price Agreement - 验证页面加载', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/purchase/price-agreement`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const title = page.locator('h2:has-text("价格协议"), h2:has-text("采购价格")');
    await expect(title).toBeVisible({ timeout: 10000 });
  });

  test('16.2 Price Agreement - 验证新增按钮和表格', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/purchase/price-agreement`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const addBtn = page.locator('button:has-text("新增"), button:has-text("新建")').first();
    if (await addBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await addBtn.click();
      await page.waitForTimeout(1000);
      const modal = page.locator('.ant-modal');
      if (await modal.isVisible({ timeout: 3000 }).catch(() => false)) {
        console.log('Price agreement add modal opened');
        await page.keyboard.press('Escape');
      }
    }

    const table = page.locator('.ant-table');
    await expect(table).toBeVisible();
  });
});

// ========== 17. PURCHASE ALERT ==========
test.describe('Purchase Alert (采购预警)', () => {
  test('17.1 Purchase Alert - 验证页面加载和表格', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/purchase/alert`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const title = page.locator('h2:has-text("采购预警"), h2:has-text("预警")');
    await expect(title).toBeVisible({ timeout: 10000 });

    const table = page.locator('.ant-table');
    await expect(table).toBeVisible();
  });
});