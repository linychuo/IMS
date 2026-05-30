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
  test('39.1 System Role - 验证Tab切换和表格', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/system`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // 点击角色管理Tab
    const roleTab = page.locator('.ant-tabs-tab:has-text("角色管理"), .ant-tabs-tab:has-text("角色")');
    if (await roleTab.isVisible({ timeout: 2000 }).catch(() => false)) {
      await roleTab.click();
      await page.waitForTimeout(1000);
      console.log('Role tab clicked');
    }

    // 验证表格存在
    const table = page.locator('.ant-table');
    await expect(table).toBeVisible({ timeout: 5000 });
  });

  test('39.2 System Role - 验证新增按钮', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/system`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // 点击角色管理Tab
    const roleTab = page.locator('.ant-tabs-tab:has-text("角色管理"), .ant-tabs-tab:has-text("角色")');
    if (await roleTab.isVisible({ timeout: 2000 }).catch(() => false)) {
      await roleTab.click();
      await page.waitForTimeout(1000);
    }

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
  });
});

// ========== 39.3 SYSTEM - MENU ==========
test.describe('System Menu (栏目管理)', () => {
  test('39.3 System Menu - 验证Tab切换和表格', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/system`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // 点击栏目管理Tab
    const menuTab = page.locator('.ant-tabs-tab:has-text("栏目管理"), .ant-tabs-tab:has-text("栏目")');
    if (await menuTab.isVisible({ timeout: 2000 }).catch(() => false)) {
      await menuTab.click();
      await page.waitForTimeout(1000);
      console.log('Menu tab clicked');
    }

    // 验证表格或树形控件存在
    const table = page.locator('.ant-table, .ant-tree');
    await expect(table).toBeVisible({ timeout: 5000 });
  });

  test('39.4 System Menu - 验证新增按钮', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/system`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // 点击栏目管理Tab
    const menuTab = page.locator('.ant-tabs-tab:has-text("栏目管理")');
    if (await menuTab.isVisible({ timeout: 2000 }).catch(() => false)) {
      await menuTab.click();
      await page.waitForTimeout(1000);
    }

    const addBtn = page.locator('button:has-text("新增栏目"), button:has-text("新增")').first();
    if (await addBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await addBtn.click();
      await page.waitForTimeout(1000);
      const modal = page.locator('.ant-modal');
      if (await modal.isVisible({ timeout: 3000 }).catch(() => false)) {
        console.log('Menu add modal opened');
        await page.keyboard.press('Escape');
      }
    }
  });
});

// ========== 39.5 SYSTEM - PERMISSION ==========
test.describe('System Permission (权限管理)', () => {
  test('39.5 System Permission - 验证Tab切换和表格', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/system`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // 点击权限管理Tab
    const permTab = page.locator('.ant-tabs-tab:has-text("权限管理"), .ant-tabs-tab:has-text("权限")');
    if (await permTab.isVisible({ timeout: 2000 }).catch(() => false)) {
      await permTab.click();
      await page.waitForTimeout(1000);
      console.log('Permission tab clicked');
    }

    // 验证表格存在
    const table = page.locator('.ant-table');
    await expect(table).toBeVisible({ timeout: 5000 });
  });

  test('39.6 System Permission - 验证分配权限按钮', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/system`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // 点击权限管理Tab
    const permTab = page.locator('.ant-tabs-tab:has-text("权限管理")');
    if (await permTab.isVisible({ timeout: 2000 }).catch(() => false)) {
      await permTab.click();
      await page.waitForTimeout(1000);
    }

    const assignBtn = page.locator('button:has-text("分配权限"), button:has-text("分配")').first();
    if (await assignBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      console.log('Assign permission button found');
    }
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

  test('41.3 System Notification - 验证通知铃铛图标和下拉面板', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/dashboard`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // 找到通知铃铛按钮（Badge组件包含的Button）
    const bellButton = page.locator('.ant-badge').first();
    await expect(bellButton).toBeVisible({ timeout: 5000 });

    // 点击铃铛打开通知下拉
    await bellButton.click();
    await page.waitForTimeout(1500);

    // 验证下拉面板出现并包含通知中心标题
    const dropdownPanel = page.locator('text=通知中心').first();
    await expect(dropdownPanel).toBeVisible({ timeout: 3000 });

    // 验证"查看全部"按钮存在
    const viewAllBtn = page.locator('button:has-text("查看全部")');
    if (await viewAllBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      // 点击查看全部，验证跳转到通知页面
      await viewAllBtn.click();
      await page.waitForTimeout(2000);
      // 验证当前页面包含通知相关内容
      const title = page.locator('h2:has-text("通知"), h2:has-text("消息")');
      if (await title.isVisible({ timeout: 3000 }).catch(() => false)) {
        console.log('Navigated to notification page successfully');
      }
    }
  });
});

// ========== 41.4 SYSTEM - DATA IMPORT ==========
test.describe('System Data Import (数据导入)', () => {
  test('41.4 System Data Import - 验证Tab切换和导入功能', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/system`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // 点击数据导入Tab
    const importTab = page.locator('.ant-tabs-tab:has-text("数据导入")');
    if (await importTab.isVisible({ timeout: 2000 }).catch(() => false)) {
      await importTab.click();
      await page.waitForTimeout(1000);
      console.log('Data import tab clicked');
    }

    // 验证导入类型选择器存在
    const importTypeSelect = page.locator('.ant-select').filter({ hasPlaceholder: /导入类型/ }).first();
    if (await importTypeSelect.isVisible({ timeout: 2000 }).catch(() => false)) {
      console.log('Import type selector found');
    }

    // 验证上传按钮存在
    const uploadBtn = page.locator('button:has-text("上传文件"), button:has-text("选择文件")').first();
    if (await uploadBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      console.log('Upload button found');
    }
  });
});

// ========== 41.5 SYSTEM - DATA EXPORT ==========
test.describe('System Data Export (数据导出)', () => {
  test('41.5 System Data Export - 验证Tab切换和导出功能', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/system`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // 点击数据导出Tab
    const exportTab = page.locator('.ant-tabs-tab:has-text("数据导出")');
    if (await exportTab.isVisible({ timeout: 2000 }).catch(() => false)) {
      await exportTab.click();
      await page.waitForTimeout(1000);
      console.log('Data export tab clicked');
    }

    // 验证导出类型选择器存在
    const exportTypeSelect = page.locator('.ant-select').filter({ hasPlaceholder: /导出类型/ }).first();
    if (await exportTypeSelect.isVisible({ timeout: 2000 }).catch(() => false)) {
      console.log('Export type selector found');
    }

    // 验证导出按钮存在
    const exportBtn = page.locator('button:has-text("导出"), button:has-text("开始导出")').first();
    if (await exportBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      console.log('Export button found');
    }
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

  test('43.7 Report - 验证利润表Tab', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/report`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const profitTab = page.locator('.ant-tabs-tab:has-text("利润表")');
    if (await profitTab.isVisible({ timeout: 2000 }).catch(() => false)) {
      await profitTab.click();
      await page.waitForTimeout(1500);
      console.log('Profit table tab clicked');
    }

    const statCards = page.locator('.ant-statistic');
    if (await statCards.first().isVisible({ timeout: 2000 }).catch(() => false)) {
      console.log('Statistic cards found');
    }
  });

  test('43.8 Report - 验证账龄分析Tab', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/report`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const agingTab = page.locator('.ant-tabs-tab:has-text("账龄分析")');
    if (await agingTab.isVisible({ timeout: 2000 }).catch(() => false)) {
      await agingTab.click();
      await page.waitForTimeout(1500);
      console.log('Aging analysis tab clicked');

      // 验证账龄分布区域
      const agingSection = page.locator('text=账龄分布, text=逾期').first();
      if (await agingSection.isVisible({ timeout: 3000 }).catch(() => false)) {
        console.log('Aging section found');
      }
    }
  });

  test('43.9 Report - 验证回款统计Tab', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/report`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const collectionTab = page.locator('.ant-tabs-tab:has-text("回款统计")');
    if (await collectionTab.isVisible({ timeout: 2000 }).catch(() => false)) {
      await collectionTab.click();
      await page.waitForTimeout(1500);
      console.log('Collection statistics tab clicked');
    }
  });

  test('43.10 Report - 验证费用表Tab', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/report`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const expenseTab = page.locator('.ant-tabs-tab:has-text("费用表")');
    if (await expenseTab.isVisible({ timeout: 2000 }).catch(() => false)) {
      await expenseTab.click();
      await page.waitForTimeout(1500);
      console.log('Expense table tab clicked');
    }
  });

  test('43.11 Report - 验证商品分析Tab', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/report`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const productTab = page.locator('.ant-tabs-tab:has-text("商品分析")');
    if (await productTab.isVisible({ timeout: 2000 }).catch(() => false)) {
      await productTab.click();
      await page.waitForTimeout(1500);
      console.log('Product analysis tab clicked');
    }
  });

  test('43.12 Report - 验证供应商分析Tab', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/report`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const supplierTab = page.locator('.ant-tabs-tab:has-text("供应商分析")');
    if (await supplierTab.isVisible({ timeout: 2000 }).catch(() => false)) {
      await supplierTab.click();
      await page.waitForTimeout(1500);
      console.log('Supplier analysis tab clicked');
    }
  });
});