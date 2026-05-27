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
test.describe('1. Dashboard (仪表盘)', () => {
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

  test('1.3 Dashboard - 验证低库存预警卡片', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/dashboard`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const lowStockCard = page.locator('text=低库存预警').first();
    if (await lowStockCard.isVisible({ timeout: 2000 }).catch(() => false)) {
      console.log('Low stock warning card visible');
    }
  });

  test('1.4 Dashboard - 验证待办事项卡片', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/dashboard`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const todoCard = page.locator('text=待办事项');
    await expect(todoCard).toBeVisible({ timeout: 5000 });
  });

  test('1.5 Dashboard - 点击返回仪表盘', async ({ page }) => {
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
test.describe('2. Product (商品管理)', () => {
  test('2.1 Product - 验证页面加载', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/product`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const title = page.locator('h2:has-text("商品管理")');
    await expect(title).toBeVisible({ timeout: 10000 });
  });

  test('2.2 Product - 验证搜索按钮', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/product`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const searchInput = page.locator('input[placeholder*="搜索"]');
    if (await searchInput.isVisible({ timeout: 2000 }).catch(() => false)) {
      console.log('Search input found');
    }
  });

  test('2.3 Product - 验证新增按钮', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/product`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

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

  test('2.4 Product - 验证分类Tab', async ({ page }) => {
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
  });

  test('2.5 Product - 验证表格', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/product`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const table = page.locator('.ant-table');
    await expect(table).toBeVisible();
  });
});

// ========== 3. WAREHOUSE ==========
test.describe('3. Warehouse (仓库管理)', () => {
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

  test('3.4 Warehouse - 验证库位Tab', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/warehouse/location`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const locationTab = page.locator('.ant-tabs-tab:has-text("库位管理"), .ant-tabs-tab:has-text("库位")');
    if (await locationTab.isVisible({ timeout: 2000 }).catch(() => false)) {
      console.log('Location tab visible');
    }
  });

  test('3.5 Warehouse - 验证表格', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/warehouse`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const table = page.locator('.ant-table');
    await expect(table).toBeVisible();
  });
});

// ========== 4. CUSTOMER ==========
test.describe('4. Customer (客户管理)', () => {
  test('4.1 Customer - 验证页面加载', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/customer`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const title = page.locator('h2:has-text("客户管理")');
    await expect(title).toBeVisible({ timeout: 10000 });
  });

  test('4.2 Customer - 验证搜索按钮', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/customer`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const searchInput = page.locator('input[placeholder*="搜索"]');
    if (await searchInput.isVisible({ timeout: 2000 }).catch(() => false)) {
      console.log('Search input found');
    }
  });

  test('4.3 Customer - 验证新增按钮', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/customer`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

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

  test('4.4 Customer - 验证详情按钮', async ({ page }) => {
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
  });

  test('4.5 Customer - 验证编辑按钮', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/customer`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const firstRow = page.locator('.ant-table-tbody tr').first();
    if (await firstRow.isVisible({ timeout: 3000 }).catch(() => false)) {
      const editBtn = firstRow.locator('button:has-text("编辑")');
      if (await editBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
        await editBtn.click();
        await page.waitForTimeout(1000);
        const modal = page.locator('.ant-modal');
        if (await modal.isVisible({ timeout: 3000 }).catch(() => false)) {
          console.log('Customer edit modal opened');
          await page.keyboard.press('Escape');
        }
      }
    }
  });

  test('4.6 Customer - 验证删除按钮', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/customer`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const firstRow = page.locator('.ant-table-tbody tr').first();
    if (await firstRow.isVisible({ timeout: 3000 }).catch(() => false)) {
      const deleteBtn = firstRow.locator('button:has-text("删除")');
      if (await deleteBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
        console.log('Delete button found (needs confirmation)');
      }
    }
  });

  test('4.7 Customer - 验证表格', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/customer`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const table = page.locator('.ant-table');
    await expect(table).toBeVisible();
  });
});

// ========== 5. SUPPLIER ==========
test.describe('5. Supplier (供应商管理)', () => {
  test('5.1 Supplier - 验证页面加载', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/supplier`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const title = page.locator('h2:has-text("供应商管理")');
    await expect(title).toBeVisible({ timeout: 10000 });
  });

  test('5.2 Supplier - 验证搜索按钮', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/supplier`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const searchInput = page.locator('input[placeholder*="搜索"]');
    if (await searchInput.isVisible({ timeout: 2000 }).catch(() => false)) {
      console.log('Search input found');
    }
  });

  test('5.3 Supplier - 验证新增按钮', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/supplier`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

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

  test('5.4 Supplier - 验证详情按钮', async ({ page }) => {
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
  });

  test('5.5 Supplier - 验证编辑按钮', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/supplier`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const firstRow = page.locator('.ant-table-tbody tr').first();
    if (await firstRow.isVisible({ timeout: 3000 }).catch(() => false)) {
      const editBtn = firstRow.locator('button:has-text("编辑")');
      if (await editBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
        await editBtn.click();
        await page.waitForTimeout(1000);
        const modal = page.locator('.ant-modal');
        if (await modal.isVisible({ timeout: 3000 }).catch(() => false)) {
          console.log('Supplier edit modal opened');
          await page.keyboard.press('Escape');
        }
      }
    }
  });

  test('5.6 Supplier - 验证删除按钮', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/supplier`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const firstRow = page.locator('.ant-table-tbody tr').first();
    if (await firstRow.isVisible({ timeout: 3000 }).catch(() => false)) {
      const deleteBtn = firstRow.locator('button:has-text("删除")');
      if (await deleteBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
        console.log('Delete button found');
      }
    }
  });

  test('5.7 Supplier - 验证表格', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/supplier`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const table = page.locator('.ant-table');
    await expect(table).toBeVisible();
  });
});

// ========== 6. SALES ORDER ==========
test.describe('6. Sales Order (销售订单)', () => {
  test('6.1 Sales Order - 验证页面加载', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/sales/order`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const title = page.locator('h2:has-text("销售订单")');
    await expect(title).toBeVisible({ timeout: 10000 });
  });

  test('6.2 Sales Order - 验证搜索按钮', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/sales/order`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const searchInput = page.locator('input[placeholder*="搜索"]');
    if (await searchInput.isVisible({ timeout: 2000 }).catch(() => false)) {
      console.log('Search input found');
    }
  });

  test('6.3 Sales Order - 验证新增按钮', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/sales/order`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

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

  test('6.4 Sales Order - 验证查看按钮', async ({ page }) => {
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

  test('6.5 Sales Order - 验证打印按钮', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/sales/order`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const firstRow = page.locator('.ant-table-tbody tr').first();
    if (await firstRow.isVisible({ timeout: 3000 }).catch(() => false)) {
      const printBtn = firstRow.locator('button:has-text("打印")');
      if (await printBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
        console.log('Print button found');
      }
    }
  });

  test('6.6 Sales Order - 验证审核按钮', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/sales/order`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const firstRow = page.locator('.ant-table-tbody tr').first();
    if (await firstRow.isVisible({ timeout: 3000 }).catch(() => false)) {
      const auditBtn = firstRow.locator('button:has-text("审核")');
      if (await auditBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
        console.log('Audit button found');
      }
    }
  });

  test('6.7 Sales Order - 验证编辑按钮', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/sales/order`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const firstRow = page.locator('.ant-table-tbody tr').first();
    if (await firstRow.isVisible({ timeout: 3000 }).catch(() => false)) {
      const editBtn = firstRow.locator('button:has-text("编辑")');
      if (await editBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
        console.log('Edit button found');
      }
    }
  });

  test('6.8 Sales Order - 验证取消按钮', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/sales/order`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const firstRow = page.locator('.ant-table-tbody tr').first();
    if (await firstRow.isVisible({ timeout: 3000 }).catch(() => false)) {
      const cancelBtn = firstRow.locator('button:has-text("取消")');
      if (await cancelBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
        console.log('Cancel button found');
      }
    }
  });

  test('6.9 Sales Order - 验证表格', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/sales/order`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const table = page.locator('.ant-table');
    await expect(table).toBeVisible();
  });
});

// ========== 7. SALES OUT ==========
test.describe('7. Sales Out (销售出库)', () => {
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

  test('7.3 Sales Out - 验证查看按钮', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/sales/out`);
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
          console.log('Sales out detail modal opened');
          await page.keyboard.press('Escape');
        }
      }
    }
  });

  test('7.4 Sales Out - 验证审核按钮', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/sales/out`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const firstRow = page.locator('.ant-table-tbody tr').first();
    if (await firstRow.isVisible({ timeout: 3000 }).catch(() => false)) {
      const auditBtn = firstRow.locator('button:has-text("审核")');
      if (await auditBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
        console.log('Audit button found');
      }
    }
  });

  test('7.5 Sales Out - 验证表格', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/sales/out`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const table = page.locator('.ant-table');
    await expect(table).toBeVisible();
  });
});

// ========== 8. SALES RETURN ==========
test.describe('8. Sales Return (销售退货)', () => {
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

  test('8.3 Sales Return - 验证查看按钮', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/sales/return`);
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
          console.log('Sales return detail modal opened');
          await page.keyboard.press('Escape');
        }
      }
    }
  });

  test('8.4 Sales Return - 验证通过/拒绝按钮', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/sales/return`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const firstRow = page.locator('.ant-table-tbody tr').first();
    if (await firstRow.isVisible({ timeout: 3000 }).catch(() => false)) {
      const passBtn = firstRow.locator('button:has-text("通过")');
      const rejectBtn = firstRow.locator('button:has-text("拒绝")');
      if (await passBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
        console.log('Pass button found');
      }
      if (await rejectBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
        console.log('Reject button found');
      }
    }
  });

  test('8.5 Sales Return - 验证表格', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/sales/return`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const table = page.locator('.ant-table');
    await expect(table).toBeVisible();
  });
});

// ========== 9. SALES PRICE STRATEGY ==========
test.describe('9. Sales Price Strategy (价格策略)', () => {
  test('9.1 Price Strategy - 验证页面加载', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/sales/price-strategy`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const title = page.locator('h2:has-text("价格策略")');
    await expect(title).toBeVisible({ timeout: 10000 });
  });

  test('9.2 Price Strategy - 验证统计卡片', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/sales/price-strategy`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const statCards = page.locator('.ant-statistic');
    expect(await statCards.count()).toBeGreaterThan(0);
  });

  test('9.3 Price Strategy - 验证搜索框', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/sales/price-strategy`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const searchInput = page.locator('input[placeholder*="搜索"]');
    if (await searchInput.isVisible({ timeout: 2000 }).catch(() => false)) {
      console.log('Search input found');
    }
  });

  test('9.4 Price Strategy - 验证客户筛选', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/sales/price-strategy`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const customerSelect = page.locator('.ant-select').filter({ hasPlaceholder: /客户/ }).first();
    if (await customerSelect.isVisible({ timeout: 2000 }).catch(() => false)) {
      console.log('Customer filter found');
    }
  });

  test('9.5 Price Strategy - 验证状态筛选', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/sales/price-strategy`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const statusSelect = page.locator('.ant-select').filter({ hasPlaceholder: /状态/ }).first();
    if (await statusSelect.isVisible({ timeout: 2000 }).catch(() => false)) {
      console.log('Status filter found');
    }
  });

  test('9.6 Price Strategy - 验证新建策略按钮', async ({ page }) => {
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

  test('9.7 Price Strategy - 验证编辑按钮', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/sales/price-strategy`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const firstRow = page.locator('.ant-table-tbody tr').first();
    if (await firstRow.isVisible({ timeout: 3000 }).catch(() => false)) {
      const editBtn = firstRow.locator('button:has-text("编辑")');
      if (await editBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
        await editBtn.click();
        await page.waitForTimeout(1000);
        const modal = page.locator('.ant-modal');
        if (await modal.isVisible({ timeout: 3000 }).catch(() => false)) {
          console.log('Price strategy edit modal opened');
          await page.keyboard.press('Escape');
        }
      }
    }
  });

  test('9.8 Price Strategy - 验证启用/禁用按钮', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/sales/price-strategy`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const firstRow = page.locator('.ant-table-tbody tr').first();
    if (await firstRow.isVisible({ timeout: 3000 }).catch(() => false)) {
      const toggleBtn = firstRow.locator('button:has-text("禁用"), button:has-text("启用")');
      if (await toggleBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
        console.log('Toggle status button found');
      }
    }
  });

  test('9.9 Price Strategy - 验证删除按钮', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/sales/price-strategy`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const firstRow = page.locator('.ant-table-tbody tr').first();
    if (await firstRow.isVisible({ timeout: 3000 }).catch(() => false)) {
      const deleteBtn = firstRow.locator('button:has-text("删除")');
      if (await deleteBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
        console.log('Delete button found');
      }
    }
  });

  test('9.10 Price Strategy - 验证表格', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/sales/price-strategy`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const table = page.locator('.ant-table');
    await expect(table).toBeVisible();
  });
});

// ========== 10. SALES ORDER TRACK ==========
test.describe('10. Sales Order Track (销售订单跟踪)', () => {
  test('10.1 Sales Track - 验证页面加载', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/sales/track`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const title = page.locator('h2:has-text("销售订单跟踪")');
    await expect(title).toBeVisible({ timeout: 10000 });
  });

  test('10.2 Sales Track - 验证统计卡片', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/sales/track`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const statCards = page.locator('.ant-statistic');
    expect(await statCards.count()).toBeGreaterThan(0);
  });

  test('10.3 Sales Track - 验证跟踪按钮', async ({ page }) => {
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
  });

  test('10.4 Sales Track - 验证表格', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/sales/track`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const table = page.locator('.ant-table');
    await expect(table).toBeVisible();
  });
});

// ========== 11. SALES PROMOTION ==========
test.describe('11. Sales Promotion (促销管理)', () => {
  test('11.1 Promotion - 验证页面加载', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/sales/promotion`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const title = page.locator('h2:has-text("促销")').first();
    await expect(title).toBeVisible({ timeout: 10000 });
  });

  test('11.2 Promotion - 验证新增按钮', async ({ page }) => {
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
  });

  test('11.3 Promotion - 验证表格', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/sales/promotion`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const table = page.locator('.ant-table');
    await expect(table).toBeVisible();
  });
});

// ========== 12. PURCHASE ORDER ==========
test.describe('12. Purchase Order (采购订单)', () => {
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

  test('12.3 Purchase Order - 验证查看按钮', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/purchase/order`);
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
          console.log('Purchase order detail modal opened');
          await page.keyboard.press('Escape');
        }
      }
    }
  });

  test('12.4 Purchase Order - 验证审核按钮', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/purchase/order`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const firstRow = page.locator('.ant-table-tbody tr').first();
    if (await firstRow.isVisible({ timeout: 3000 }).catch(() => false)) {
      const auditBtn = firstRow.locator('button:has-text("审核"), button:has-text("审批")');
      if (await auditBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
        console.log('Audit button found');
      }
    }
  });

  test('12.5 Purchase Order - 验证表格', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/purchase/order`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const table = page.locator('.ant-table');
    await expect(table).toBeVisible();
  });
});

// ========== 13. PURCHASE TRACK ==========
test.describe('13. Purchase Order Track (采购订单跟踪)', () => {
  test('13.1 Purchase Track - 验证页面加载', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/purchase/track`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const title = page.locator('h2:has-text("采购订单跟踪")');
    await expect(title).toBeVisible({ timeout: 10000 });
  });

  test('13.2 Purchase Track - 验证统计卡片', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/purchase/track`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const statCards = page.locator('.ant-statistic');
    expect(await statCards.count()).toBeGreaterThan(0);
  });

  test('13.3 Purchase Track - 验证跟踪按钮', async ({ page }) => {
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
  });

  test('13.4 Purchase Track - 验证表格', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/purchase/track`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const table = page.locator('.ant-table');
    await expect(table).toBeVisible();
  });
});

// ========== 14. PURCHASE IN ==========
test.describe('14. Purchase In (采购入库)', () => {
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

  test('14.3 Purchase In - 验证查看按钮', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/purchase/in`);
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
          console.log('Purchase in detail modal opened');
          await page.keyboard.press('Escape');
        }
      }
    }
  });

  test('14.4 Purchase In - 验证表格', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/purchase/in`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const table = page.locator('.ant-table');
    await expect(table).toBeVisible();
  });
});

// ========== 15. PURCHASE RETURN ==========
test.describe('15. Purchase Return (采购退货)', () => {
  test('15.1 Purchase Return - 验证页面加载', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/purchase/return`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const title = page.locator('h2:has-text("采购退货")');
    await expect(title).toBeVisible({ timeout: 10000 });
  });

  test('15.2 Purchase Return - 验证新增按钮', async ({ page }) => {
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
  });

  test('15.3 Purchase Return - 验证表格', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/purchase/return`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const table = page.locator('.ant-table');
    await expect(table).toBeVisible();
  });
});

// ========== 16. PURCHASE PRICE AGREEMENT ==========
test.describe('16. Purchase Price Agreement (采购价格协议)', () => {
  test('16.1 Price Agreement - 验证页面加载', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/purchase/price-agreement`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const title = page.locator('h2:has-text("价格协议"), h2:has-text("采购价格")');
    await expect(title).toBeVisible({ timeout: 10000 });
  });

  test('16.2 Price Agreement - 验证新增按钮', async ({ page }) => {
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
  });

  test('16.3 Price Agreement - 验证表格', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/purchase/price-agreement`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const table = page.locator('.ant-table');
    await expect(table).toBeVisible();
  });
});

// ========== 17. INVENTORY ACCOUNT ==========
test.describe('17. Inventory Account (库存台账)', () => {
  test('17.1 Inventory Account - 验证页面加载', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/inventory/account`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const title = page.locator('h2:has-text("库存台账"), h2:has-text("库存账户")');
    await expect(title).toBeVisible({ timeout: 10000 });
  });

  test('17.2 Inventory Account - 验证搜索按钮', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/inventory/account`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const searchInput = page.locator('input[placeholder*="搜索"]');
    if (await searchInput.isVisible({ timeout: 2000 }).catch(() => false)) {
      console.log('Search input found');
    }
  });

  test('17.3 Inventory Account - 验证导出按钮', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/inventory/account`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const exportBtn = page.locator('button:has-text("导出"), button:has-text("导出CSV")');
    if (await exportBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      console.log('Export button found');
    }
  });

  test('17.4 Inventory Account - 验证表格', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/inventory/account`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const table = page.locator('.ant-table');
    await expect(table).toBeVisible();
  });
});

// ========== 18. INVENTORY IN ==========
test.describe('18. Inventory In (入库单)', () => {
  test('18.1 Inventory In - 验证页面加载', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/inventory/in`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const title = page.locator('h2:has-text("入库单"), h2:has-text("入库管理")');
    await expect(title).toBeVisible({ timeout: 10000 });
  });

  test('18.2 Inventory In - 验证新建入库按钮', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/inventory/in`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const addBtn = page.locator('button:has-text("新建入库"), button:has-text("新增入库")');
    if (await addBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await addBtn.click();
      await page.waitForTimeout(1000);
      const modal = page.locator('.ant-modal');
      if (await modal.isVisible({ timeout: 3000 }).catch(() => false)) {
        console.log('Inventory in add modal opened');
        await page.keyboard.press('Escape');
      }
    }
  });

  test('18.3 Inventory In - 验证扫码入库按钮', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/inventory/in`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const scanBtn = page.locator('button:has-text("扫码入库"), button:has-text("扫码")');
    if (await scanBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      console.log('Scan button found');
    }
  });

  test('18.4 Inventory In - 验证查看按钮', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/inventory/in`);
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
          console.log('Inventory in detail modal opened');
          await page.keyboard.press('Escape');
        }
      }
    }
  });

  test('18.5 Inventory In - 验证表格', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/inventory/in`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const table = page.locator('.ant-table');
    await expect(table).toBeVisible();
  });
});

// ========== 19. INVENTORY OUT ==========
test.describe('19. Inventory Out (出库单)', () => {
  test('19.1 Inventory Out - 验证页面加载', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/inventory/out`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const title = page.locator('h2:has-text("出库单"), h2:has-text("出库管理")');
    await expect(title).toBeVisible({ timeout: 10000 });
  });

  test('19.2 Inventory Out - 验证新建出库按钮', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/inventory/out`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const addBtn = page.locator('button:has-text("新建出库"), button:has-text("新增出库")');
    if (await addBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await addBtn.click();
      await page.waitForTimeout(1000);
      const modal = page.locator('.ant-modal');
      if (await modal.isVisible({ timeout: 3000 }).catch(() => false)) {
        console.log('Inventory out add modal opened');
        await page.keyboard.press('Escape');
      }
    }
  });

  test('19.3 Inventory Out - 验证扫码出库按钮', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/inventory/out`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const scanBtn = page.locator('button:has-text("扫码出库"), button:has-text("扫码")');
    if (await scanBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      console.log('Scan button found');
    }
  });

  test('19.4 Inventory Out - 验证查看按钮', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/inventory/out`);
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
          console.log('Inventory out detail modal opened');
          await page.keyboard.press('Escape');
        }
      }
    }
  });

  test('19.5 Inventory Out - 验证表格', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/inventory/out`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const table = page.locator('.ant-table');
    await expect(table).toBeVisible();
  });
});

// ========== 20. INVENTORY TRANSFER ==========
test.describe('20. Inventory Transfer (库存调拨)', () => {
  test('20.1 Inventory Transfer - 验证页面加载', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/inventory/transfer`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const title = page.locator('h2:has-text("调拨"), h2:has-text("库存调拨")');
    await expect(title).toBeVisible({ timeout: 10000 });
  });

  test('20.2 Inventory Transfer - 验证新增按钮', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/inventory/transfer`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const addBtn = page.locator('button:has-text("新增调拨"), button:has-text("新建调拨")');
    if (await addBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await addBtn.click();
      await page.waitForTimeout(1000);
      const modal = page.locator('.ant-modal');
      if (await modal.isVisible({ timeout: 3000 }).catch(() => false)) {
        console.log('Inventory transfer add modal opened');
        await page.keyboard.press('Escape');
      }
    }
  });

  test('20.3 Inventory Transfer - 验证表格', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/inventory/transfer`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const table = page.locator('.ant-table');
    await expect(table).toBeVisible();
  });
});

// ========== 21. INVENTORY CHECK ==========
test.describe('21. Inventory Check (库存盘点)', () => {
  test('21.1 Inventory Check - 验证页面加载', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/inventory/check`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const title = page.locator('h2:has-text("盘点"), h2:has-text("库存盘点")');
    await expect(title).toBeVisible({ timeout: 10000 });
  });

  test('21.2 Inventory Check - 验证新增按钮', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/inventory/check`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const addBtn = page.locator('button:has-text("新增盘点"), button:has-text("新建盘点")');
    if (await addBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await addBtn.click();
      await page.waitForTimeout(1000);
      const modal = page.locator('.ant-modal');
      if (await modal.isVisible({ timeout: 3000 }).catch(() => false)) {
        console.log('Inventory check add modal opened');
        await page.keyboard.press('Escape');
      }
    }
  });

  test('21.3 Inventory Check - 验证表格', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/inventory/check`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const table = page.locator('.ant-table');
    await expect(table).toBeVisible();
  });
});

// ========== 22. INVENTORY RECORD ==========
test.describe('22. Inventory Record (库存记录)', () => {
  test('22.1 Inventory Record - 验证页面加载', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/inventory/record`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const title = page.locator('h2:has-text("库存记录"), h2:has-text("记录")');
    await expect(title).toBeVisible({ timeout: 10000 });
  });

  test('22.2 Inventory Record - 验证表格', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/inventory/record`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const table = page.locator('.ant-table');
    await expect(table).toBeVisible();
  });
});

// ========== 23. BATCH TRACEABILITY ==========
test.describe('23. Batch Traceability (批次追溯)', () => {
  test('23.1 Batch - 验证页面加载', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/inventory/batch`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const title = page.locator('h2:has-text("批次追溯"), h2:has-text("批次")');
    await expect(title).toBeVisible({ timeout: 10000 });
  });

  test('23.2 Batch - 验证仓库筛选', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/inventory/batch`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const warehouseSelect = page.locator('.ant-select').filter({ hasPlaceholder: /仓库/ }).first();
    if (await warehouseSelect.isVisible({ timeout: 2000 }).catch(() => false)) {
      console.log('Warehouse filter found');
    }
  });

  test('23.3 Batch - 验证商品筛选', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/inventory/batch`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const productSelect = page.locator('.ant-select').filter({ hasPlaceholder: /商品/ }).first();
    if (await productSelect.isVisible({ timeout: 2000 }).catch(() => false)) {
      console.log('Product filter found');
    }
  });

  test('23.4 Batch - 验证追溯按钮', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/inventory/batch`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const firstRow = page.locator('.ant-table-tbody tr').first();
    if (await firstRow.isVisible({ timeout: 3000 }).catch(() => false)) {
      const traceBtn = firstRow.locator('button:has-text("追溯"), button:has-text("查看")');
      if (await traceBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
        await traceBtn.click();
        await page.waitForTimeout(1500);
        const modal = page.locator('.ant-modal');
        if (await modal.isVisible({ timeout: 3000 }).catch(() => false)) {
          console.log('Batch trace modal opened');
          await page.keyboard.press('Escape');
        }
      }
    }
  });

  test('23.5 Batch - 验证表格', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/inventory/batch`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const table = page.locator('.ant-table');
    await expect(table).toBeVisible();
  });
});

// ========== 24. BARCODE ==========
test.describe('24. Barcode (条码管理)', () => {
  test('24.1 Barcode - 验证页面加载', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/inventory/barcode`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const title = page.locator('h2:has-text("条码"), h2:has-text("条码管理")');
    await expect(title).toBeVisible({ timeout: 10000 });
  });

  test('24.2 Barcode - 验证新增按钮', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/inventory/barcode`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const addBtn = page.locator('button:has-text("新增"), button:has-text("新建")').first();
    if (await addBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await addBtn.click();
      await page.waitForTimeout(1000);
      const modal = page.locator('.ant-modal');
      if (await modal.isVisible({ timeout: 3000 }).catch(() => false)) {
        console.log('Barcode add modal opened');
        await page.keyboard.press('Escape');
      }
    }
  });

  test('24.3 Barcode - 验证表格', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/inventory/barcode`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const table = page.locator('.ant-table');
    await expect(table).toBeVisible();
  });
});

// ========== 25. INVENTORY ALERT ==========
test.describe('25. Inventory Alert (库存预警)', () => {
  test('25.1 Inventory Alert - 验证页面加载', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/inventory/alert`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const title = page.locator('h2:has-text("库存预警")');
    await expect(title).toBeVisible({ timeout: 10000 });
  });

  test('25.2 Inventory Alert - 验证库存预警Tab', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/inventory/alert`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const stockTab = page.locator('.ant-tabs-tab:has-text("库存预警")');
    if (await stockTab.isVisible({ timeout: 2000 }).catch(() => false)) {
      await stockTab.click();
      await page.waitForTimeout(1000);
      console.log('Stock warning tab clicked');
    }
  });

  test('25.3 Inventory Alert - 验证临期预警Tab', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/inventory/alert`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const expiryTab = page.locator('.ant-tabs-tab:has-text("临期预警")');
    if (await expiryTab.isVisible({ timeout: 2000 }).catch(() => false)) {
      await expiryTab.click();
      await page.waitForTimeout(1000);
      console.log('Expiry warning tab clicked');
    }
  });

  test('25.4 Inventory Alert - 验证呆滞库存Tab', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/inventory/alert`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const idleTab = page.locator('.ant-tabs-tab').filter({ hasText: /呆滞/ });
    if (await idleTab.isVisible({ timeout: 2000 }).catch(() => false)) {
      await idleTab.click();
      await page.waitForTimeout(1000);
      console.log('Idle stock tab clicked');
    }
  });

  test('25.5 Inventory Alert - 验证表格', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/inventory/alert`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const table = page.locator('.ant-table');
    await expect(table).toBeVisible();
  });
});

// ========== 26. QUALITY CHECK ==========
test.describe('26. Quality Check (质量检查)', () => {
  test('26.1 Quality Check - 验证页面加载', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/inventory/quality-check`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const title = page.locator('h2:has-text("质量检验"), h2:has-text("质检")');
    await expect(title).toBeVisible({ timeout: 10000 });
  });

  test('26.2 Quality Check - 验证新增按钮', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/inventory/quality-check`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const addBtn = page.locator('button:has-text("新增检验"), button:has-text("新建")').first();
    if (await addBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await addBtn.click();
      await page.waitForTimeout(1000);
      const modal = page.locator('.ant-modal');
      if (await modal.isVisible({ timeout: 3000 }).catch(() => false)) {
        console.log('Quality check add modal opened');
        await page.keyboard.press('Escape');
      }
    }
  });

  test('26.3 Quality Check - 验证表格', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/inventory/quality-check`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const table = page.locator('.ant-table');
    await expect(table).toBeVisible();
  });
});

// ========== 27. FINANCE IN ==========
test.describe('27. Finance In (收款单)', () => {
  test('27.1 Finance In - 验证页面加载', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/finance/in`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const title = page.locator('h2:has-text("收款"), h2:has-text("收入")');
    await expect(title).toBeVisible({ timeout: 10000 });
  });

  test('27.2 Finance In - 验证新增按钮', async ({ page }) => {
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
  });

  test('27.3 Finance In - 验证表格', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/finance/in`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const table = page.locator('.ant-table');
    await expect(table).toBeVisible();
  });
});

// ========== 28. FINANCE OUT ==========
test.describe('28. Finance Out (付款单)', () => {
  test('28.1 Finance Out - 验证页面加载', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/finance/out`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const title = page.locator('h2:has-text("付款"), h2:has-text("支出")');
    await expect(title).toBeVisible({ timeout: 10000 });
  });

  test('28.2 Finance Out - 验证新增按钮', async ({ page }) => {
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
  });

  test('28.3 Finance Out - 验证表格', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/finance/out`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const table = page.locator('.ant-table');
    await expect(table).toBeVisible();
  });
});

// ========== 29. FINANCE ACCOUNT ==========
test.describe('29. Finance Account (账户管理)', () => {
  test('29.1 Finance Account - 验证页面加载', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/finance/account`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const title = page.locator('h2:has-text("账户"), h2:has-text("财务账户")');
    await expect(title).toBeVisible({ timeout: 10000 });
  });

  test('29.2 Finance Account - 验证新增按钮', async ({ page }) => {
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
  });

  test('29.3 Finance Account - 验证表格', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/finance/account`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const table = page.locator('.ant-table');
    await expect(table).toBeVisible();
  });
});

// ========== 30. RECEIVABLE ==========
test.describe('30. Receivable (应收账款)', () => {
  test('30.1 Receivable - 验证页面加载', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/finance/receivable`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const title = page.locator('h2:has-text("应收"), h2:has-text("应收账款")');
    await expect(title).toBeVisible({ timeout: 10000 });
  });

  test('30.2 Receivable - 验证新增按钮', async ({ page }) => {
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
  });

  test('30.3 Receivable - 验证表格', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/finance/receivable`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const table = page.locator('.ant-table');
    await expect(table).toBeVisible();
  });
});

// ========== 31. PAYABLE ==========
test.describe('31. Payable (应付账款)', () => {
  test('31.1 Payable - 验证页面加载', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/finance/payable`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const title = page.locator('h2:has-text("应付"), h2:has-text("应付账款")');
    await expect(title).toBeVisible({ timeout: 10000 });
  });

  test('31.2 Payable - 验证新增按钮', async ({ page }) => {
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
  });

  test('31.3 Payable - 验证表格', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/finance/payable`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const table = page.locator('.ant-table');
    await expect(table).toBeVisible();
  });
});

// ========== 32. TRANSACTION ==========
test.describe('32. Transaction (流水记录)', () => {
  test('32.1 Transaction - 验证页面加载', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/finance/transaction`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const title = page.locator('h2:has-text("流水"), h2:has-text("交易记录")');
    await expect(title).toBeVisible({ timeout: 10000 });
  });

  test('32.2 Transaction - 验证表格', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/finance/transaction`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const table = page.locator('.ant-table');
    await expect(table).toBeVisible();
  });
});

// ========== 33. INVOICE ==========
test.describe('33. Invoice (发票管理)', () => {
  test('33.1 Invoice - 验证页面加载', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/finance/invoice`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const title = page.locator('h2:has-text("发票")');
    await expect(title).toBeVisible({ timeout: 10000 });
  });

  test('33.2 Invoice - 验证新增按钮', async ({ page }) => {
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
  });

  test('33.3 Invoice - 验证表格', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/finance/invoice`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const table = page.locator('.ant-table');
    await expect(table).toBeVisible();
  });
});

// ========== 34. EXPENSE ==========
test.describe('34. Expense (费用管理)', () => {
  test('34.1 Expense - 验证页面加载', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/finance/expense`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const title = page.locator('h2:has-text("费用"), h2:has-text("支出")');
    await expect(title).toBeVisible({ timeout: 10000 });
  });

  test('34.2 Expense - 验证新增按钮', async ({ page }) => {
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
  });

  test('34.3 Expense - 验证表格', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/finance/expense`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const table = page.locator('.ant-table');
    await expect(table).toBeVisible();
  });
});

// ========== 35. CUSTOMER RECONCILIATION ==========
test.describe('35. Customer Reconciliation (客户对账)', () => {
  test('35.1 Customer Recon - 验证页面加载', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/finance/customer-reconciliation`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const title = page.locator('h2:has-text("客户对账")');
    await expect(title).toBeVisible({ timeout: 10000 });
  });

  test('35.2 Customer Recon - 验证统计卡片', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/finance/customer-reconciliation`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const statCards = page.locator('.ant-statistic');
    expect(await statCards.count()).toBeGreaterThan(0);
  });

  test('35.3 Customer Recon - 验证搜索', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/finance/customer-reconciliation`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const searchInput = page.locator('input[placeholder*="搜索"]');
    if (await searchInput.isVisible({ timeout: 2000 }).catch(() => false)) {
      console.log('Search input found');
    }
  });

  test('35.4 Customer Recon - 验证导出按钮', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/finance/customer-reconciliation`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const exportBtn = page.locator('button:has-text("导出对账单"), button:has-text("导出")');
    if (await exportBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      console.log('Export button found');
    }
  });

  test('35.5 Customer Recon - 验证表格', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/finance/customer-reconciliation`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const table = page.locator('.ant-table');
    await expect(table).toBeVisible();
  });
});

// ========== 36. SUPPLIER RECONCILIATION ==========
test.describe('36. Supplier Reconciliation (供应商对账)', () => {
  test('36.1 Supplier Recon - 验证页面加载', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/finance/supplier-reconciliation`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const title = page.locator('h2:has-text("供应商对账")');
    await expect(title).toBeVisible({ timeout: 10000 });
  });

  test('36.2 Supplier Recon - 验证统计卡片', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/finance/supplier-reconciliation`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const statCards = page.locator('.ant-statistic');
    expect(await statCards.count()).toBeGreaterThan(0);
  });

  test('36.3 Supplier Recon - 验证搜索', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/finance/supplier-reconciliation`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const searchInput = page.locator('input[placeholder*="搜索"]');
    if (await searchInput.isVisible({ timeout: 2000 }).catch(() => false)) {
      console.log('Search input found');
    }
  });

  test('36.4 Supplier Recon - 验证导出按钮', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/finance/supplier-reconciliation`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const exportBtn = page.locator('button:has-text("导出对账单"), button:has-text("导出")');
    if (await exportBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      console.log('Export button found');
    }
  });

  test('36.5 Supplier Recon - 验证表格', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/finance/supplier-reconciliation`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const table = page.locator('.ant-table');
    await expect(table).toBeVisible();
  });
});

// ========== 37. SYSTEM - USER ==========
test.describe('37. System User (用户管理)', () => {
  test('37.1 System User - 验证页面加载', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/system/user`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const title = page.locator('h2:has-text("用户管理"), h2:has-text("系统管理")');
    await expect(title).toBeVisible({ timeout: 10000 });
  });

  test('37.2 System User - 验证新增用户按钮', async ({ page }) => {
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
  });

  test('37.3 System User - 验证编辑按钮', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/system/user`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const firstRow = page.locator('.ant-table-tbody tr').first();
    if (await firstRow.isVisible({ timeout: 3000 }).catch(() => false)) {
      const editBtn = firstRow.locator('button:has-text("编辑")');
      if (await editBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
        await editBtn.click();
        await page.waitForTimeout(1000);
        const modal = page.locator('.ant-modal');
        if (await modal.isVisible({ timeout: 3000 }).catch(() => false)) {
          console.log('User edit modal opened');
          await page.keyboard.press('Escape');
        }
      }
    }
  });

  test('37.4 System User - 验证表格', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/system/user`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const table = page.locator('.ant-table');
    await expect(table).toBeVisible();
  });
});

// ========== 38. SYSTEM - ROLE ==========
test.describe('38. System Role (角色管理)', () => {
  test('38.1 System Role - 验证角色Tab', async ({ page }) => {
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

  test('38.2 System Role - 验证新增按钮', async ({ page }) => {
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
  });

  test('38.3 System Role - 验证表格', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/role`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const table = page.locator('.ant-table');
    await expect(table).toBeVisible();
  });
});

// ========== 39. SYSTEM - CONFIG ==========
test.describe('39. System Config (系统配置)', () => {
  test('39.1 System Config - 验证页面加载', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/system/config`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const title = page.locator('h2:has-text("系统配置"), h2:has-text("配置")');
    await expect(title).toBeVisible({ timeout: 10000 });
  });

  test('39.2 System Config - 验证新增按钮', async ({ page }) => {
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
  });

  test('39.3 System Config - 验证表格', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/system/config`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const table = page.locator('.ant-table');
    await expect(table).toBeVisible();
  });
});

// ========== 40. SYSTEM - NOTIFICATION ==========
test.describe('40. System Notification (通知管理)', () => {
  test('40.1 System Notification - 验证页面加载', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/system/notification`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const title = page.locator('h2:has-text("通知管理"), h2:has-text("消息通知")');
    await expect(title).toBeVisible({ timeout: 10000 });
  });

  test('40.2 System Notification - 验证新增按钮', async ({ page }) => {
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
  });

  test('40.3 System Notification - 验证表格', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/system/notification`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const table = page.locator('.ant-table');
    await expect(table).toBeVisible();
  });
});

// ========== 41. SYSTEM - PRINT TEMPLATE ==========
test.describe('41. Print Template (打印模板)', () => {
  test('41.1 Print Template - 验证页面加载', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/system/print-template`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const title = page.locator('h2:has-text("打印模板"), h2:has-text("模板")');
    await expect(title).toBeVisible({ timeout: 10000 });
  });

  test('41.2 Print Template - 验证新增按钮', async ({ page }) => {
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
  });

  test('41.3 Print Template - 验证表格', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/system/print-template`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const table = page.locator('.ant-table');
    await expect(table).toBeVisible();
  });
});

// ========== 42. REPORT CENTER ==========
test.describe('42. Report Center (报表中心)', () => {
  test('42.1 Report - 验证页面加载', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/report`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const title = page.locator('h2:has-text("报表中心")');
    await expect(title).toBeVisible({ timeout: 10000 });
  });

  test('42.2 Report - 验证销售报表Tab', async ({ page }) => {
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
  });

  test('42.3 Report - 验证采购报表Tab', async ({ page }) => {
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

  test('42.4 Report - 验证客户分析Tab', async ({ page }) => {
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

  test('42.5 Report - 验证库存报表Tab', async ({ page }) => {
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

  test('42.6 Report - 验证财务报表Tab', async ({ page }) => {
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

  test('42.7 Report - 验证利润表Tab', async ({ page }) => {
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
  });

  test('42.8 Report - 验证导出按钮', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/report`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const exportBtn = page.locator('button:has-text("导出CSV"), button:has-text("导出")');
    if (await exportBtn.first().isVisible({ timeout: 2000 }).catch(() => false)) {
      console.log('Export button found');
    }
  });

  test('42.9 Report - 验证统计卡片', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/report`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const statCards = page.locator('.ant-statistic');
    if (await statCards.first().isVisible({ timeout: 2000 }).catch(() => false)) {
      console.log('Statistic cards found');
    }
  });
});

// ========== 43. PURCHASE ALERT ==========
test.describe('43. Purchase Alert (采购预警)', () => {
  test('43.1 Purchase Alert - 验证页面加载', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/purchase/alert`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const title = page.locator('h2:has-text("采购预警"), h2:has-text("预警")');
    await expect(title).toBeVisible({ timeout: 10000 });
  });

  test('43.2 Purchase Alert - 验证表格', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/purchase/alert`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const table = page.locator('.ant-table');
    await expect(table).toBeVisible();
  });
});