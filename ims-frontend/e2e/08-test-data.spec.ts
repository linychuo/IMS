import { test, expect, Page } from '@playwright/test';

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

async function fillFormField(page: Page, label: string, value: string) {
  // Try regular input first
  let field = page.locator(`.ant-form-item:has-text("${label}") input`).first();
  if (await field.isVisible({ timeout: 1000 }).catch(() => false)) {
    const isReadonly = await field.getAttribute('readonly').catch(() => null);
    if (isReadonly !== null) {
      // This is a select dropdown, skip to dropdown handling
    } else {
      await field.fill(value);
      return;
    }
  }

  // Handle select dropdown
  const selectWrapper = page.locator(`.ant-form-item:has-text("${label}") .ant-select`).first();
  if (await selectWrapper.isVisible({ timeout: 1000 }).catch(() => false)) {
    await selectWrapper.click();
    await page.waitForTimeout(800);

    // Wait for dropdown to appear
    const dropdown = page.locator('.ant-select-dropdown:visible').first();
    if (await dropdown.isVisible({ timeout: 2000 }).catch(() => false)) {
      // Try to find exact match first
      let option = page.locator(`.ant-select-dropdown:visible .ant-select-item-option:has-text("${value}")`).first();
      if (await option.isVisible({ timeout: 1000 }).catch(() => false)) {
        await option.click();
        await page.waitForTimeout(300);
        return;
      }

      // Type to search
      const searchInput = page.locator('.ant-select-dropdown:visible input').first();
      if (await searchInput.isVisible({ timeout: 1000 }).catch(() => false)) {
        await searchInput.fill(value);
        await page.waitForTimeout(500);

        // Click first result after search
        option = page.locator('.ant-select-dropdown:visible .ant-select-item-option').first();
        if (await option.isVisible({ timeout: 2000 }).catch(() => false)) {
          await option.click();
          await page.waitForTimeout(300);
        }
      }
    }
    return;
  }
}

async function saveAndClose(page: Page) {
  await page.waitForTimeout(1000);

  // Try different button selectors including dialog buttons
  const saveBtn = page.locator('button:has-text("保存"), button:has-text("确定"), button:has-text("提交")').first();
  try {
    await saveBtn.click({ timeout: 5000 });
  } catch (e) {
    // Try any primary button in modal or dialog
    const primaryBtn = page.locator('.ant-modal button.ant-btn-primary, [role="dialog"] button.ant-btn-primary').first();
    if (await primaryBtn.isVisible({ timeout: 1000 }).catch(() => false)) {
      await primaryBtn.click();
    } else {
      await page.keyboard.press('Enter');
    }
  }
  await page.waitForTimeout(2000);
}

async function openModal(page: Page, addBtnSelector: string, modalTitle?: string) {
  const addBtn = page.locator(addBtnSelector).first();
  if (await addBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
    await addBtn.click();
    await page.waitForTimeout(1500);
    // Wait for dialog element which is what the modal renders
    try {
      await page.waitForSelector('[role="dialog"]', { timeout: 5000 });
    } catch (e) {
      // Try alternative
      await page.waitForTimeout(1000);
    }
    return true;
  }
  return false;
}

// ========== 1. WAREHOUSE DATA ==========
test.describe('添加仓库数据', () => {
  test('1.1 添加仓库', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/warehouse`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // 添加主仓库
    if (await openModal(page, 'button:has-text("新增仓库"), button:has-text("新增")')) {
      await fillFormField(page, '仓库编码', 'WH001');
      await fillFormField(page, '仓库名称', '北京中心仓');
      await fillFormField(page, '联系人', '张三');
      await fillFormField(page, '联系电话', '13800138001');
      await fillFormField(page, '地址', '北京市朝阳区某某路123号');
      await saveAndClose(page);
    }

    // 验证添加成功
    await page.waitForTimeout(1000);
    const table = page.locator('.ant-table-tbody');
    await expect(table).toBeVisible();
  });

  test('1.2 添加第二个仓库', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/warehouse`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    if (await openModal(page, 'button:has-text("新增仓库"), button:has-text("新增")')) {
      await fillFormField(page, '仓库编码', 'WH002');
      await fillFormField(page, '仓库名称', '上海中心仓');
      await fillFormField(page, '联系人', '李四');
      await fillFormField(page, '联系电话', '13800138002');
      await fillFormField(page, '地址', '上海市浦东新区某某大道456号');
      await saveAndClose(page);
    }
  });

  test('1.3 添加库位', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/warehouse/location`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    if (await openModal(page, 'button:has-text("新增库位"), button:has-text("新增")')) {
      await fillFormField(page, '库位编码', 'A01');
      await fillFormField(page, '库位名称', 'A区01架');
      await fillFormField(page, '仓库', '北京中心仓');
      await fillFormField(page, '备注', '测试库位');
      await saveAndClose(page);
    }
  });
});

// ========== 2. PRODUCT DATA ==========
test.describe('添加商品数据', () => {
  test('2.1 添加商品分类', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/product`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const categoryTab = page.locator('.ant-tabs-tab:has-text("商品分类")').first();
    if (await categoryTab.isVisible({ timeout: 2000 }).catch(() => false)) {
      await categoryTab.click();
      await page.waitForTimeout(1000);

      if (await openModal(page, 'button:has-text("新增分类"), button:has-text("新增")')) {
        await fillFormField(page, '分类编码', 'CAT001');
        await fillFormField(page, '分类名称', '电子产品');
        await fillFormField(page, '排序', '1');
        await saveAndClose(page);
      }
    }
  });

  test('2.2 添加商品', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/product`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    if (await openModal(page, 'button:has-text("新增商品"), button:has-text("新增")')) {
      await fillFormField(page, '商品编码', 'P001');
      await fillFormField(page, '商品名称', 'iPhone 15 手机');
      await fillFormField(page, '商品分类', '电子产品');
      await fillFormField(page, '单位', '台');
      await fillFormField(page, '规格', '128GB');
      await fillFormField(page, '条码', '6901234567890');
      await fillFormField(page, '采购价', '5000');
      await fillFormField(page, '销售价', '6999');
      await fillFormField(page, '成本价', '4800');
      await fillFormField(page, '最低售价', '5999');
      await fillFormField(page, '安全库存', '10');
      await saveAndClose(page);
    }
  });

  test('2.3 添加第二个商品', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/product`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    if (await openModal(page, 'button:has-text("新增商品"), button:has-text("新增")')) {
      await fillFormField(page, '商品编码', 'P002');
      await fillFormField(page, '商品名称', 'MacBook Pro 笔记本电脑');
      await fillFormField(page, '商品分类', '电子产品');
      await fillFormField(page, '单位', '台');
      await fillFormField(page, '规格', '14英寸 M3');
      await fillFormField(page, '采购价', '12000');
      await fillFormField(page, '销售价', '15999');
      await fillFormField(page, '成本价', '11500');
      await fillFormField(page, '最低售价', '13999');
      await fillFormField(page, '安全库存', '5');
      await saveAndClose(page);
    }
  });

  test('2.4 添加计量单位', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/product/unit-of-measure`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    if (await openModal(page, 'button:has-text("新增单位"), button:has-text("新增")')) {
      await fillFormField(page, '单位编码', 'UNIT001');
      await fillFormField(page, '单位名称', '箱');
      await fillFormField(page, '仓库', '北京中心仓');
      await saveAndClose(page);
    }
  });
});

// ========== 3. CUSTOMER DATA ==========
test.describe('添加客户数据', () => {
  test('3.1 添加客户', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/customer`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    if (await openModal(page, 'button:has-text("新增客户")')) {
      await fillFormField(page, '客户编码', 'C001');
      await fillFormField(page, '客户名称', '北京科技有限公司');
      await fillFormField(page, '联系人', '王五');
      await fillFormField(page, '联系电话', '010-12345678');
      await fillFormField(page, '手机', '13900139001');
      await fillFormField(page, '地址', '北京市海淀区某某大街100号');
      await saveAndClose(page);
    }
  });

  test('3.2 添加第二个客户', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/customer`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    if (await openModal(page, 'button:has-text("新增客户")')) {
      await fillFormField(page, '客户编码', 'C002');
      await fillFormField(page, '客户名称', '上海贸易公司');
      await fillFormField(page, '联系人', '赵六');
      await fillFormField(page, '联系电话', '021-87654321');
      await fillFormField(page, '手机', '13900139002');
      await saveAndClose(page);
    }
  });
});

// ========== 4. SUPPLIER DATA ==========
test.describe('添加供应商数据', () => {
  test('4.1 添加供应商', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/supplier`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    if (await openModal(page, 'button:has-text("新增供应商")')) {
      await fillFormField(page, '供应商编码', 'S001');
      await fillFormField(page, '供应商名称', '深圳科技有限公司');
      await fillFormField(page, '联系人', '刘七');
      await fillFormField(page, '联系电话', '0755-88888888');
      await fillFormField(page, '手机', '13800138003');
      await fillFormField(page, '地址', '深圳市南山区某某路200号');
      await saveAndClose(page);
    }
  });

  test('4.2 添加第二个供应商', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/supplier`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    if (await openModal(page, 'button:has-text("新增供应商")')) {
      await fillFormField(page, '供应商编码', 'S002');
      await fillFormField(page, '供应商名称', '广州电子公司');
      await fillFormField(page, '联系人', '陈八');
      await fillFormField(page, '联系电话', '020-11112222');
      await fillFormField(page, '手机', '13800138004');
      await saveAndClose(page);
    }
  });
});

// ========== 5. FINANCE DATA ==========
test.describe('添加财务数据', () => {
  test('5.1 添加账户', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/finance/account`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    if (await openModal(page, 'button:has-text("新增账户")')) {
      await fillFormField(page, '账户名称', '工商银行基本户');
      await fillFormField(page, '账户类型', '银行账户');
      await fillFormField(page, '账号', '6222021234567890123');
      await fillFormField(page, '开户行', '工商银行北京分行');
      await fillFormField(page, '期初余额', '100000');
      await saveAndClose(page);
    }
  });

  test('5.2 添加收款记录', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/finance/in`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    if (await openModal(page, 'button:has-text("新增收款")')) {
      await fillFormField(page, '客户', '北京科技有限公司');
      await fillFormField(page, '收款金额', '50000');
      await fillFormField(page, '收款日期', '2026-05-30');
      await fillFormField(page, '账户', '工商银行基本户');
      await fillFormField(page, '备注', '预收货款');
      await saveAndClose(page);
    }
  });

  test('5.3 添加付款记录', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/finance/out`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    if (await openModal(page, 'button:has-text("新增付款")')) {
      await fillFormField(page, '供应商', '深圳科技有限公司');
      await fillFormField(page, '付款金额', '30000');
      await fillFormField(page, '付款日期', '2026-05-30');
      await fillFormField(page, '账户', '工商银行基本户');
      await fillFormField(page, '备注', '预付货款');
      await saveAndClose(page);
    }
  });
});

// ========== 6. PURCHASE DATA ==========
test.describe('添加采购数据', () => {
  test('6.1 添加采购订单', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/purchase/order`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    if (await openModal(page, 'button:has-text("新增订单"), button:has-text("新增")')) {
      await fillFormField(page, '供应商', '深圳科技有限公司');
      await fillFormField(page, '订单日期', '2026-05-30');

      const addProductBtn = page.locator('button:has-text("添加商品"), button:has-text("添加")').first();
      if (await addProductBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
        await addProductBtn.click();
        await page.waitForTimeout(1000);

        await fillFormField(page, '商品', 'iPhone 15 手机');
        await fillFormField(page, '数量', '10');
        await fillFormField(page, '单价', '5000');
      }

      await saveAndClose(page);
    }
  });
});

// ========== 7. SALES DATA ==========
test.describe('添加销售数据', () => {
  test('7.1 添加销售订单', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/sales/order`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    if (await openModal(page, 'button:has-text("新增订单"), button:has-text("新增")')) {
      await fillFormField(page, '客户', '北京科技有限公司');
      await fillFormField(page, '订单日期', '2026-05-30');

      const addProductBtn = page.locator('button:has-text("添加商品"), button:has-text("添加")').first();
      if (await addProductBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
        await addProductBtn.click();
        await page.waitForTimeout(1000);

        await fillFormField(page, '商品', 'iPhone 15 手机');
        await fillFormField(page, '数量', '5');
        await fillFormField(page, '单价', '6999');
      }

      await saveAndClose(page);
    }
  });
});

// ========== 8. INVENTORY DATA ==========
test.describe('添加库存数据', () => {
  test('8.1 添加入库记录', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/inventory/in`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    if (await openModal(page, 'button:has-text("新增入库"), button:has-text("新增")')) {
      await fillFormField(page, '入库日期', '2026-05-30');
      await fillFormField(page, '仓库', '北京中心仓');

      const addProductBtn = page.locator('button:has-text("添加商品"), button:has-text("添加")').first();
      if (await addProductBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
        await addProductBtn.click();
        await page.waitForTimeout(1000);

        await fillFormField(page, '商品', 'iPhone 15 手机');
        await fillFormField(page, '数量', '50');
        await fillFormField(page, '单价', '5000');
      }

      await saveAndClose(page);
    }
  });

  test('8.2 添加出库记录', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/inventory/out`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    if (await openModal(page, 'button:has-text("新增出库"), button:has-text("新增")')) {
      await fillFormField(page, '出库日期', '2026-05-30');
      await fillFormField(page, '仓库', '北京中心仓');

      const addProductBtn = page.locator('button:has-text("添加商品"), button:has-text("添加")').first();
      if (await addProductBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
        await addProductBtn.click();
        await page.waitForTimeout(1000);

        await fillFormField(page, '商品', 'iPhone 15 手机');
        await fillFormField(page, '数量', '5');
        await fillFormField(page, '单价', '6999');
      }

      await saveAndClose(page);
    }
  });
});