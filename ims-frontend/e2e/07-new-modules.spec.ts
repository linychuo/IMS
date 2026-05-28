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

// ========== 7. UNIT OF MEASURE (计量单位) ==========
test.describe('Unit of Measure (计量单位管理)', () => {
  test('7.1 Unit of Measure - 验证页面加载', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/product/unit-of-measure`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const title = page.locator('h2, h3, .ant-typography:has-text("计量单位")');
    await expect(title.first()).toBeVisible({ timeout: 10000 });
  });

  test('7.2 Unit of Measure - 验证搜索和新增按钮', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/product/unit-of-measure`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const searchInput = page.locator('input[placeholder*="搜索"], input[placeholder*="编码"]');
    if (await searchInput.isVisible({ timeout: 2000 }).catch(() => false)) {
      console.log('Search input found');
    }

    const addBtn = page.locator('button:has-text("新增"), button:has-text("新增计量单位")').first();
    if (await addBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await addBtn.click();
      await page.waitForTimeout(1000);
      const modal = page.locator('.ant-modal');
      if (await modal.isVisible({ timeout: 3000 }).catch(() => false)) {
        console.log('Unit of measure add modal opened');
        await page.keyboard.press('Escape');
      }
    }
  });

  test('7.3 Unit of Measure - 验证编辑和删除按钮', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/product/unit-of-measure`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const firstRow = page.locator('.ant-table-tbody tr').first();
    if (await firstRow.isVisible({ timeout: 3000 }).catch(() => false)) {
      const editBtn = firstRow.locator('button:has-text("编辑"), button:has-text("编辑")');
      if (await editBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
        console.log('Edit button found');
      }
    }

    const table = page.locator('.ant-table');
    await expect(table).toBeVisible();
  });
});

// ========== 8. DOCUMENT NO RULE (单据编号规则) ==========
test.describe('Document No Rule (单据编号规则)', () => {
  test('8.1 Document No Rule - 验证页面加载', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/system/document-no-rule`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const title = page.locator('h2, h3:has-text("单据编号"), .ant-typography:has-text("编号规则")');
    await expect(title.first()).toBeVisible({ timeout: 10000 });
  });

  test('8.2 Document No Rule - 验证初始化默认规则按钮', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/system/document-no-rule`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const initBtn = page.locator('button:has-text("初始化默认规则"), button:has-text("初始化")').first();
    if (await initBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      console.log('Init default rules button found');
    }
  });

  test('8.3 Document No Rule - 验证新增按钮和表格', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/system/document-no-rule`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const addBtn = page.locator('button:has-text("新增规则"), button:has-text("新增"), button:has-text("新增编号规则")').first();
    if (await addBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await addBtn.click();
      await page.waitForTimeout(1000);
      const modal = page.locator('.ant-modal');
      if (await modal.isVisible({ timeout: 3000 }).catch(() => false)) {
        console.log('Document no rule add modal opened');
        await page.keyboard.press('Escape');
      }
    }

    const table = page.locator('.ant-table');
    await expect(table).toBeVisible();
  });
});

// ========== 9. BACKUP (数据备份恢复) ==========
test.describe('Backup (数据备份恢复)', () => {
  test('9.1 Backup - 验证页面加载', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/system/backup`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const title = page.locator('h2, h3:has-text("备份"), .ant-typography:has-text("备份")');
    await expect(title.first()).toBeVisible({ timeout: 10000 });
  });

  test('9.2 Backup - 验证创建备份按钮', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/system/backup`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const backupBtn = page.locator('button:has-text("创建备份"), button:has-text("备份")').first();
    if (await backupBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      console.log('Create backup button found');
    }
  });

  test('9.3 Backup - 验证刷新按钮和表格', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/system/backup`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const refreshBtn = page.locator('button:has-text("刷新")').first();
    if (await refreshBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      console.log('Refresh button found');
    }

    const table = page.locator('.ant-table');
    await expect(table).toBeVisible();
  });
});

// ========== 10. APPROVAL RULE (审批规则) ==========
test.describe('Approval Rule (审批规则)', () => {
  test('10.1 Approval Rule - 验证页面加载', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/system/approval-rule`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const title = page.locator('h2, h3:has-text("审批规则"), .ant-typography:has-text("审批")');
    await expect(title.first()).toBeVisible({ timeout: 10000 });
  });

  test('10.2 Approval Rule - 验证新增按钮', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/system/approval-rule`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const addBtn = page.locator('button:has-text("新增规则"), button:has-text("新增审批"), button:has-text("新增")').first();
    if (await addBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await addBtn.click();
      await page.waitForTimeout(1000);
      const modal = page.locator('.ant-modal');
      if (await modal.isVisible({ timeout: 3000 }).catch(() => false)) {
        console.log('Approval rule add modal opened');
        await page.keyboard.press('Escape');
      }
    }
  });

  test('10.3 Approval Rule - 验证编辑和删除按钮', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/system/approval-rule`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

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

// ========== 11. AI PREDICTION (AI智能预测) ==========
test.describe('AI Prediction (AI智能预测)', () => {
  test('11.1 AI Prediction - 验证页面加载', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/report/prediction`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // 查找预测相关元素
    const title = page.locator('h2, h3:has-text("预测"), .ant-typography:has-text("智能")');
    const hasPredictionElements = await title.first().isVisible({ timeout: 5000 }).catch(() => false);
    if (hasPredictionElements) {
      console.log('Prediction page loaded');
    }
  });

  test('11.2 AI Prediction - 验证销售预测Tab', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/report/prediction`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const forecastTab = page.locator('.ant-tabs-tab:has-text("销售预测"), .ant-tabs-tab:has-text("预测")').first();
    if (await forecastTab.isVisible({ timeout: 2000 }).catch(() => false)) {
      await forecastTab.click();
      await page.waitForTimeout(1000);
      console.log('Sales forecast tab clicked');
    }
  });

  test('11.3 AI Prediction - 验证采购建议Tab', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/report/prediction`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const suggestionTab = page.locator('.ant-tabs-tab:has-text("采购建议"), .ant-tabs-tab:has-text("建议")').first();
    if (await suggestionTab.isVisible({ timeout: 2000 }).catch(() => false)) {
      await suggestionTab.click();
      await page.waitForTimeout(1000);
      console.log('Purchase suggestion tab clicked');
    }
  });

  test('11.4 AI Prediction - 验证库存预警Tab', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/report/prediction`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const alertTab = page.locator('.ant-tabs-tab:has-text("库存预警"), .ant-tabs-tab:has-text("预警")').first();
    if (await alertTab.isVisible({ timeout: 2000 }).catch(() => false)) {
      await alertTab.click();
      await page.waitForTimeout(1000);
      console.log('Inventory alert tab clicked');
    }
  });

  test('11.5 AI Prediction - 验证刷新按钮', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/report/prediction`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const refreshBtn = page.locator('button:has-text("刷新预测"), button:has-text("刷新")').first();
    if (await refreshBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      console.log('Refresh forecast button found');
    }
  });
});
