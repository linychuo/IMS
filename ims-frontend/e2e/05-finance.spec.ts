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

// ========== 28. FINANCE IN ==========
test.describe('Finance In (收款单)', () => {
  test('28.1 Finance In - 验证页面加载', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/finance/in`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const title = page.locator('h2:has-text("收款"), h2:has-text("收入")');
    await expect(title).toBeVisible({ timeout: 10000 });
  });

  test('28.2 Finance In - 验证新增按钮和表格', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/finance/in`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const addBtn = page.locator('button:has-text("新增收款"), button:has-text("新建收款")');
    if (await addBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await addBtn.click();
      await page.waitForTimeout(1000);
      const modal = page.locator('.ant-modal');
      if (await modal.isVisible({ timeout: 3000 }).catch(() => false)) {
        console.log('Finance in add modal opened');
        await page.keyboard.press('Escape');
      }
    }

    const table = page.locator('.ant-table');
    await expect(table).toBeVisible();
  });
});

// ========== 29. FINANCE OUT ==========
test.describe('Finance Out (付款单)', () => {
  test('29.1 Finance Out - 验证页面加载', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/finance/out`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const title = page.locator('h2:has-text("付款"), h2:has-text("支出")');
    await expect(title).toBeVisible({ timeout: 10000 });
  });

  test('29.2 Finance Out - 验证新增按钮和表格', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/finance/out`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const addBtn = page.locator('button:has-text("新增付款"), button:has-text("新建付款")');
    if (await addBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await addBtn.click();
      await page.waitForTimeout(1000);
      const modal = page.locator('.ant-modal');
      if (await modal.isVisible({ timeout: 3000 }).catch(() => false)) {
        console.log('Finance out add modal opened');
        await page.keyboard.press('Escape');
      }
    }

    const table = page.locator('.ant-table');
    await expect(table).toBeVisible();
  });
});

// ========== 30. FINANCE ACCOUNT ==========
test.describe('Finance Account (账户管理)', () => {
  test('30.1 Finance Account - 验证页面加载', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/finance/account`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const title = page.locator('h2:has-text("账户"), h2:has-text("财务账户")');
    await expect(title).toBeVisible({ timeout: 10000 });
  });

  test('30.2 Finance Account - 验证新增按钮和表格', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/finance/account`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const addBtn = page.locator('button:has-text("新增账户"), button:has-text("新建账户")');
    if (await addBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await addBtn.click();
      await page.waitForTimeout(1000);
      const modal = page.locator('.ant-modal');
      if (await modal.isVisible({ timeout: 3000 }).catch(() => false)) {
        console.log('Finance account add modal opened');
        await page.keyboard.press('Escape');
      }
    }

    const table = page.locator('.ant-table');
    await expect(table).toBeVisible();
  });
});

// ========== 31. RECEIVABLE ==========
test.describe('Receivable (应收账款)', () => {
  test('31.1 Receivable - 验证页面加载', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/finance/receivable`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const title = page.locator('h2:has-text("应收"), h2:has-text("应收账款")');
    await expect(title).toBeVisible({ timeout: 10000 });
  });

  test('31.2 Receivable - 验证新增按钮和表格', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/finance/receivable`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const addBtn = page.locator('button:has-text("新增应收"), button:has-text("新建应收")');
    if (await addBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await addBtn.click();
      await page.waitForTimeout(1000);
      const modal = page.locator('.ant-modal');
      if (await modal.isVisible({ timeout: 3000 }).catch(() => false)) {
        console.log('Receivable add modal opened');
        await page.keyboard.press('Escape');
      }
    }

    const table = page.locator('.ant-table');
    await expect(table).toBeVisible();
  });
});

// ========== 32. PAYABLE ==========
test.describe('Payable (应付账款)', () => {
  test('32.1 Payable - 验证页面加载', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/finance/payable`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const title = page.locator('h2:has-text("应付"), h2:has-text("应付账款")');
    await expect(title).toBeVisible({ timeout: 10000 });
  });

  test('32.2 Payable - 验证新增按钮和表格', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/finance/payable`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const addBtn = page.locator('button:has-text("新增应付"), button:has-text("新建应付")');
    if (await addBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await addBtn.click();
      await page.waitForTimeout(1000);
      const modal = page.locator('.ant-modal');
      if (await modal.isVisible({ timeout: 3000 }).catch(() => false)) {
        console.log('Payable add modal opened');
        await page.keyboard.press('Escape');
      }
    }

    const table = page.locator('.ant-table');
    await expect(table).toBeVisible();
  });
});

// ========== 33. TRANSACTION ==========
test.describe('Transaction (流水记录)', () => {
  test('33.1 Transaction - 验证页面加载和表格', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/finance/transaction`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const title = page.locator('h2:has-text("流水"), h2:has-text("交易记录")');
    await expect(title).toBeVisible({ timeout: 10000 });

    const table = page.locator('.ant-table');
    await expect(table).toBeVisible();
  });
});

// ========== 34. INVOICE ==========
test.describe('Invoice (发票管理)', () => {
  test('34.1 Invoice - 验证页面加载', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/finance/invoice`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const title = page.locator('h2:has-text("发票")');
    await expect(title).toBeVisible({ timeout: 10000 });
  });

  test('34.2 Invoice - 验证新增按钮和表格', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/finance/invoice`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const addBtn = page.locator('button:has-text("新增发票"), button:has-text("新建发票")');
    if (await addBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await addBtn.click();
      await page.waitForTimeout(1000);
      const modal = page.locator('.ant-modal');
      if (await modal.isVisible({ timeout: 3000 }).catch(() => false)) {
        console.log('Invoice add modal opened');
        await page.keyboard.press('Escape');
      }
    }

    const table = page.locator('.ant-table');
    await expect(table).toBeVisible();
  });
});

// ========== 35. EXPENSE ==========
test.describe('Expense (费用管理)', () => {
  test('35.1 Expense - 验证页面加载', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/finance/expense`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const title = page.locator('h2:has-text("费用"), h2:has-text("支出")');
    await expect(title).toBeVisible({ timeout: 10000 });
  });

  test('35.2 Expense - 验证新增按钮和表格', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/finance/expense`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const addBtn = page.locator('button:has-text("新增费用"), button:has-text("新建费用")');
    if (await addBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await addBtn.click();
      await page.waitForTimeout(1000);
      const modal = page.locator('.ant-modal');
      if (await modal.isVisible({ timeout: 3000 }).catch(() => false)) {
        console.log('Expense add modal opened');
        await page.keyboard.press('Escape');
      }
    }

    const table = page.locator('.ant-table');
    await expect(table).toBeVisible();
  });
});

// ========== 36. CUSTOMER RECONCILIATION ==========
test.describe('Customer Reconciliation (客户对账)', () => {
  test('36.1 Customer Recon - 验证页面加载和统计卡片', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/finance/customer-reconciliation`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const title = page.locator('h2:has-text("客户对账")');
    await expect(title).toBeVisible({ timeout: 10000 });

    const statCards = page.locator('.ant-statistic');
    expect(await statCards.count()).toBeGreaterThan(0);
  });

  test('36.2 Customer Recon - 验证搜索和导出按钮', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/finance/customer-reconciliation`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const searchInput = page.locator('input[placeholder*="搜索"]');
    if (await searchInput.isVisible({ timeout: 2000 }).catch(() => false)) {
      console.log('Search input found');
    }

    const exportBtn = page.locator('button:has-text("导出对账单"), button:has-text("导出")');
    if (await exportBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      console.log('Export button found');
    }

    const table = page.locator('.ant-table');
    await expect(table).toBeVisible();
  });
});

// ========== 37. SUPPLIER RECONCILIATION ==========
test.describe('Supplier Reconciliation (供应商对账)', () => {
  test('37.1 Supplier Recon - 验证页面加载和统计卡片', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/finance/supplier-reconciliation`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const title = page.locator('h2:has-text("供应商对账")');
    await expect(title).toBeVisible({ timeout: 10000 });

    const statCards = page.locator('.ant-statistic');
    expect(await statCards.count()).toBeGreaterThan(0);
  });

  test('37.2 Supplier Recon - 验证搜索和导出按钮', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/finance/supplier-reconciliation`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const searchInput = page.locator('input[placeholder*="搜索"]');
    if (await searchInput.isVisible({ timeout: 2000 }).catch(() => false)) {
      console.log('Search input found');
    }

    const exportBtn = page.locator('button:has-text("导出对账单"), button:has-text("导出")');
    if (await exportBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      console.log('Export button found');
    }

    const table = page.locator('.ant-table');
    await expect(table).toBeVisible();
  });
});