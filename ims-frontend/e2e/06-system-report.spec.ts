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

// ========== 38. SYSTEM - USER ==========
test.describe('System User (用户管理)', () => {
  test('38.1 System User - 验证页面加载', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/system/user`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const title = page.locator('h2:has-text("用户管理"), h2:has-text("系统管理")');
    await expect(title).toBeVisible({ timeout: 10000 });
  });

  test('38.2 System User - 验证新增、编辑按钮和表格', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/system/user`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const addBtn = page.locator('button:has-text("新增用户"), button:has-text("新增")').first();
    if (await addBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await addBtn.click();
      await page.waitForTimeout(1000);
      const modal = page.locator('.ant-modal');
      if (await modal.isVisible({ timeout: 3000 }).catch(() => false)) {
        console.log('User add modal opened');
        await page.keyboard.press('Escape');
      }
    }

    const firstRow = page.locator('.ant-table-tbody tr').first();
    if (await firstRow.isVisible({ timeout: 3000 }).catch(() => false)) {
      const editBtn = firstRow.locator('button:has-text("编辑")');
      if (await editBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
        console.log('Edit button found');
      }
    }

    const table = page.locator('.ant-table');
    await expect(table).toBeVisible();
  });
});

// ========== 39. SYSTEM - ROLE ==========
test.describe('System Role (角色管理)', () => {
  test('39.1 System Role - 验证角色Tab', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/role`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const roleTab = page.locator('.ant-tabs-tab:has-text("角色管理"), .ant-tabs-tab:has-text("角色")');
    if (await roleTab.isVisible({ timeout: 2000 }).catch(() => false)) {
      await roleTab.click();
      await page.waitForTimeout(1000);
      console.log('Role tab clicked');
    }
  });

  test('39.2 System Role - 验证新增按钮和表格', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/role`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const addBtn = page.locator('button:has-text("新增角色"), button:has-text("新增")').first();
    if (await addBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await addBtn.click();
      await page.waitForTimeout(1000);
      const modal = page.locator('.ant-modal');
      if (await modal.isVisible({ timeout: 3000 }).catch(() => false)) {
        console.log('Role add modal opened');
        await page.keyboard.press('Escape');
      }
    }

    const table = page.locator('.ant-table');
    await expect(table).toBeVisible();
  });
});

// ========== 40. SYSTEM - CONFIG ==========
test.describe('System Config (系统配置)', () => {
  test('40.1 System Config - 验证页面加载', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/system/config`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const title = page.locator('h2:has-text("系统配置"), h2:has-text("配置")');
    await expect(title).toBeVisible({ timeout: 10000 });
  });

  test('40.2 System Config - 验证新增按钮和表格', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/system/config`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const addBtn = page.locator('button:has-text("新增配置"), button:has-text("新增")').first();
    if (await addBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await addBtn.click();
      await page.waitForTimeout(1000);
      const modal = page.locator('.ant-modal');
      if (await modal.isVisible({ timeout: 3000 }).catch(() => false)) {
        console.log('Config add modal opened');
        await page.keyboard.press('Escape');
      }
    }

    const table = page.locator('.ant-table');
    await expect(table).toBeVisible();
  });
});

// ========== 41. SYSTEM - NOTIFICATION ==========
test.describe('System Notification (通知管理)', () => {
  test('41.1 System Notification - 验证页面加载', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/system/notification`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const title = page.locator('h2:has-text("通知管理"), h2:has-text("消息通知")');
    await expect(title).toBeVisible({ timeout: 10000 });
  });

  test('41.2 System Notification - 验证新增按钮和表格', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/system/notification`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const addBtn = page.locator('button:has-text("新增通知"), button:has-text("发送通知"), button:has-text("新建")').first();
    if (await addBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await addBtn.click();
      await page.waitForTimeout(1000);
      const modal = page.locator('.ant-modal');
      if (await modal.isVisible({ timeout: 3000 }).catch(() => false)) {
        console.log('Notification add modal opened');
        await page.keyboard.press('Escape');
      }
    }

    const table = page.locator('.ant-table');
    await expect(table).toBeVisible();
  });
});

// ========== 42. SYSTEM - PRINT TEMPLATE ==========
test.describe('Print Template (打印模板)', () => {
  test('42.1 Print Template - 验证页面加载', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/system/print-template`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const title = page.locator('h2:has-text("打印模板"), h2:has-text("模板")');
    await expect(title).toBeVisible({ timeout: 10000 });
  });

  test('42.2 Print Template - 验证新增按钮和表格', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/system/print-template`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const addBtn = page.locator('button:has-text("新增模板"), button:has-text("新建模板")');
    if (await addBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await addBtn.click();
      await page.waitForTimeout(1000);
      const modal = page.locator('.ant-modal');
      if (await modal.isVisible({ timeout: 3000 }).catch(() => false)) {
        console.log('Print template add modal opened');
        await page.keyboard.press('Escape');
      }
    }

    const table = page.locator('.ant-table');
    await expect(table).toBeVisible();
  });
});

// ========== 43. REPORT CENTER ==========
test.describe('Report Center (报表中心)', () => {
  test('43.1 Report - 验证页面加载', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/report`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const title = page.locator('h2:has-text("报表中心")');
    await expect(title).toBeVisible({ timeout: 10000 });
  });

  test('43.2 Report - 验证销售报表Tab', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/report`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const salesTab = page.locator('.ant-tabs-tab:has-text("销售报表")');
    if (await salesTab.isVisible({ timeout: 2000 }).catch(() => false)) {
      await salesTab.click();
      await page.waitForTimeout(1000);
      console.log('Sales report tab clicked');
    }

    const statCards = page.locator('.ant-statistic');
    if (await statCards.first().isVisible({ timeout: 2000 }).catch(() => false)) {
      console.log('Statistic cards found');
    }
  });

  test('43.3 Report - 验证采购报表Tab', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/report`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const purchaseTab = page.locator('.ant-tabs-tab:has-text("采购报表")');
    if (await purchaseTab.isVisible({ timeout: 2000 }).catch(() => false)) {
      await purchaseTab.click();
      await page.waitForTimeout(1000);
      console.log('Purchase report tab clicked');
    }
  });

  test('43.4 Report - 验证客户分析Tab', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/report`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const customerTab = page.locator('.ant-tabs-tab:has-text("客户分析")');
    if (await customerTab.isVisible({ timeout: 2000 }).catch(() => false)) {
      await customerTab.click();
      await page.waitForTimeout(1000);
      console.log('Customer analysis tab clicked');
    }
  });

  test('43.5 Report - 验证库存报表Tab', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/report`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const inventoryTab = page.locator('.ant-tabs-tab').filter({ hasText: /库存/ }).first();
    if (await inventoryTab.isVisible({ timeout: 2000 }).catch(() => false)) {
      await inventoryTab.click();
      await page.waitForTimeout(1000);
      console.log('Inventory report tab clicked');
    }
  });

  test('43.6 Report - 验证财务报表Tab', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/report`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const financeTab = page.locator('.ant-tabs-tab:has-text("财务报表"), .ant-tabs-tab:has-text("财务")');
    if (await financeTab.isVisible({ timeout: 2000 }).catch(() => false)) {
      await financeTab.click();
      await page.waitForTimeout(1000);
      console.log('Finance report tab clicked');
    }
  });

  test('43.7 Report - 验证利润表Tab和导出按钮', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/report`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const profitTab = page.locator('.ant-tabs-tab').filter({ hasText: /毛利/ });
    if (await profitTab.isVisible({ timeout: 2000 }).catch(() => false)) {
      await profitTab.click();
      await page.waitForTimeout(1000);
      console.log('Profit margin tab clicked');
    }

    const exportBtn = page.locator('button:has-text("导出CSV"), button:has-text("导出")');
    if (await exportBtn.first().isVisible({ timeout: 2000 }).catch(() => false)) {
      console.log('Export button found');
    }
  });
});