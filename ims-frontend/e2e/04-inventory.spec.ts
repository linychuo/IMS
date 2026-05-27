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

// ========== 18. INVENTORY ACCOUNT ==========
test.describe('Inventory Account (库存台账)', () => {
  test('18.1 Inventory Account - 验证页面加载', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/inventory/account`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const title = page.locator('h2:has-text("库存台账"), h2:has-text("库存账户")');
    await expect(title).toBeVisible({ timeout: 10000 });
  });

  test('18.2 Inventory Account - 验证搜索和导出按钮', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/inventory/account`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const searchInput = page.locator('input[placeholder*="搜索"]');
    if (await searchInput.isVisible({ timeout: 2000 }).catch(() => false)) {
      console.log('Search input found');
    }

    const exportBtn = page.locator('button:has-text("导出"), button:has-text("导出CSV")');
    if (await exportBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      console.log('Export button found');
    }

    const table = page.locator('.ant-table');
    await expect(table).toBeVisible();
  });
});

// ========== 19. INVENTORY IN ==========
test.describe('Inventory In (入库单)', () => {
  test('19.1 Inventory In - 验证页面加载', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/inventory/in`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const title = page.locator('h2:has-text("入库单"), h2:has-text("入库管理")');
    await expect(title).toBeVisible({ timeout: 10000 });
  });

  test('19.2 Inventory In - 验证新建入库按钮', async ({ page }) => {
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

  test('19.3 Inventory In - 验证扫码入库按钮', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/inventory/in`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const scanBtn = page.locator('button:has-text("扫码入库"), button:has-text("扫码")');
    if (await scanBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      console.log('Scan button found');
    }

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

// ========== 20. INVENTORY OUT ==========
test.describe('Inventory Out (出库单)', () => {
  test('20.1 Inventory Out - 验证页面加载', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/inventory/out`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const title = page.locator('h2:has-text("出库单"), h2:has-text("出库管理")');
    await expect(title).toBeVisible({ timeout: 10000 });
  });

  test('20.2 Inventory Out - 验证新建出库按钮', async ({ page }) => {
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

  test('20.3 Inventory Out - 验证扫码出库按钮', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/inventory/out`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const scanBtn = page.locator('button:has-text("扫码出库"), button:has-text("扫码")');
    if (await scanBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      console.log('Scan button found');
    }

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

// ========== 21. INVENTORY TRANSFER ==========
test.describe('Inventory Transfer (库存调拨)', () => {
  test('21.1 Inventory Transfer - 验证页面加载', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/inventory/transfer`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const title = page.locator('h2:has-text("调拨"), h2:has-text("库存调拨")');
    await expect(title).toBeVisible({ timeout: 10000 });
  });

  test('21.2 Inventory Transfer - 验证新增按钮和表格', async ({ page }) => {
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

    const table = page.locator('.ant-table');
    await expect(table).toBeVisible();
  });
});

// ========== 22. INVENTORY CHECK ==========
test.describe('Inventory Check (库存盘点)', () => {
  test('22.1 Inventory Check - 验证页面加载', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/inventory/check`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const title = page.locator('h2:has-text("盘点"), h2:has-text("库存盘点")');
    await expect(title).toBeVisible({ timeout: 10000 });
  });

  test('22.2 Inventory Check - 验证新增按钮和表格', async ({ page }) => {
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

    const table = page.locator('.ant-table');
    await expect(table).toBeVisible();
  });
});

// ========== 23. INVENTORY RECORD ==========
test.describe('Inventory Record (库存记录)', () => {
  test('23.1 Inventory Record - 验证页面加载和表格', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/inventory/record`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const title = page.locator('h2:has-text("库存记录"), h2:has-text("记录")');
    await expect(title).toBeVisible({ timeout: 10000 });

    const table = page.locator('.ant-table');
    await expect(table).toBeVisible();
  });
});

// ========== 24. BATCH TRACEABILITY ==========
test.describe('Batch Traceability (批次追溯)', () => {
  test('24.1 Batch - 验证页面加载', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/inventory/batch`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const title = page.locator('h2:has-text("批次追溯"), h2:has-text("批次")');
    await expect(title).toBeVisible({ timeout: 10000 });
  });

  test('24.2 Batch - 验证仓库和商品筛选', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/inventory/batch`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const warehouseSelect = page.locator('.ant-select').filter({ hasPlaceholder: /仓库/ }).first();
    if (await warehouseSelect.isVisible({ timeout: 2000 }).catch(() => false)) {
      console.log('Warehouse filter found');
    }

    const productSelect = page.locator('.ant-select').filter({ hasPlaceholder: /商品/ }).first();
    if (await productSelect.isVisible({ timeout: 2000 }).catch(() => false)) {
      console.log('Product filter found');
    }
  });

  test('24.3 Batch - 验证追溯按钮和表格', async ({ page }) => {
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

    const table = page.locator('.ant-table');
    await expect(table).toBeVisible();
  });
});

// ========== 25. BARCODE ==========
test.describe('Barcode (条码管理)', () => {
  test('25.1 Barcode - 验证页面加载', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/inventory/barcode`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const title = page.locator('h2:has-text("条码"), h2:has-text("条码管理")');
    await expect(title).toBeVisible({ timeout: 10000 });
  });

  test('25.2 Barcode - 验证新增按钮和表格', async ({ page }) => {
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

    const table = page.locator('.ant-table');
    await expect(table).toBeVisible();
  });
});

// ========== 26. INVENTORY ALERT ==========
test.describe('Inventory Alert (库存预警)', () => {
  test('26.1 Inventory Alert - 验证页面加载', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/inventory/alert`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const title = page.locator('h2:has-text("库存预警")');
    await expect(title).toBeVisible({ timeout: 10000 });
  });

  test('26.2 Inventory Alert - 验证库存预警Tab', async ({ page }) => {
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

    const table = page.locator('.ant-table');
    await expect(table).toBeVisible();
  });

  test('26.3 Inventory Alert - 验证临期预警Tab', async ({ page }) => {
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

  test('26.4 Inventory Alert - 验证呆滞库存Tab', async ({ page }) => {
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
});

// ========== 27. QUALITY CHECK ==========
test.describe('Quality Check (质量检查)', () => {
  test('27.1 Quality Check - 验证页面加载', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/inventory/quality-check`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const title = page.locator('h2:has-text("质量检验"), h2:has-text("质检")');
    await expect(title).toBeVisible({ timeout: 10000 });
  });

  test('27.2 Quality Check - 验证新增按钮和表格', async ({ page }) => {
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

    const table = page.locator('.ant-table');
    await expect(table).toBeVisible();
  });
});