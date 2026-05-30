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
  let field = page.locator(`.ant-form-item:has-text("${label}") input`).first();
  if (await field.isVisible({ timeout: 1000 }).catch(() => false)) {
    const isReadonly = await field.getAttribute('readonly').catch(() => null);
    if (isReadonly === null) {
      await field.fill(value);
      return;
    }
  }

  const selectWrapper = page.locator(`.ant-form-item:has-text("${label}") .ant-select`).first();
  if (await selectWrapper.isVisible({ timeout: 1000 }).catch(() => false)) {
    await selectWrapper.click();
    await page.waitForTimeout(800);

    const dropdown = page.locator('.ant-select-dropdown:visible').first();
    if (await dropdown.isVisible({ timeout: 2000 }).catch(() => false)) {
      let option = page.locator(`.ant-select-dropdown:visible .ant-select-item-option:has-text("${value}")`).first();
      if (await option.isVisible({ timeout: 1000 }).catch(() => false)) {
        await option.click();
        await page.waitForTimeout(300);
        return;
      }

      const searchInput = page.locator('.ant-select-dropdown:visible input').first();
      if (await searchInput.isVisible({ timeout: 1000 }).catch(() => false)) {
        await searchInput.fill(value);
        await page.waitForTimeout(500);
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
  await page.waitForTimeout(500);
  const saveBtn = page.locator('[role="dialog"] button.ant-btn-primary').first();
  try {
    await saveBtn.click({ timeout: 3000 });
  } catch (e) {
    // 如果没有主按钮，尝试其他保存按钮
    const altBtn = page.locator('button:has-text("保存"), button:has-text("确定"), button:has-text("提交")').first();
    if (await altBtn.isVisible({ timeout: 1000 }).catch(() => false)) {
      await altBtn.click({ timeout: 3000 });
    }
  }
  // 等待保存完成或错误弹窗出现
  await page.waitForTimeout(1500);
  // 关闭可能出现的错误提示
  const errorModal = page.locator('.ant-modal-error, [role="alertdialog"]').first();
  if (await errorModal.isVisible({ timeout: 1000 }).catch(() => false)) {
    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);
  }
  // 关闭弹窗
  const closeBtn = page.locator('[role="dialog"] button.ant-modal-close, [role="dialog"] .ant-modal-close').first();
  if (await closeBtn.isVisible({ timeout: 1000 }).catch(() => false)) {
    await closeBtn.click();
    await page.waitForTimeout(500);
  }
}

async function openModal(page: Page, addBtnSelector: string) {
  // 先关闭可能存在的错误提示弹窗
  const closeErrorModal = async () => {
    const errorModal = page.locator('.ant-modal-error, [role="alertdialog"]').first();
    if (await errorModal.isVisible({ timeout: 1000 }).catch(() => false)) {
      await page.keyboard.press('Escape');
      await page.waitForTimeout(500);
    }
    const closeBtn = page.locator('[role="dialog"] button.ant-modal-close, [role="dialog"] .ant-modal-close').first();
    if (await closeBtn.isVisible({ timeout: 1000 }).catch(() => false)) {
      await closeBtn.click();
      await page.waitForTimeout(500);
    }
  };

  await closeErrorModal();

  const addBtn = page.locator(addBtnSelector).first();
  if (await addBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
    await addBtn.click();
    await page.waitForTimeout(1500);
    try {
      await page.waitForSelector('[role="dialog"]', { timeout: 5000 });
    } catch (e) {
      await page.waitForTimeout(1000);
    }
    return true;
  }
  return false;
}

async function addProductToForm(page: Page) {
  const addProductBtn = page.locator('button:has-text("添加商品"), button:has-text("添加")').first();
  if (await addProductBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
    await addProductBtn.click();
    await page.waitForTimeout(1000);
    await fillFormField(page, '商品', 'iPhone 15 手机');
    await fillFormField(page, '数量', '5');
    await fillFormField(page, '单价', '5000');
  }
}

// ========== 1. 基础数据 ==========
test.describe('1. 基础数据', () => {
  test('1.1 仓库', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/warehouse`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // 添加第一个仓库
    if (await openModal(page, 'button:has-text("新增仓库"), button:has-text("新增")')) {
      await fillFormField(page, '仓库编码', 'WH001');
      await fillFormField(page, '仓库名称', '北京中心仓');
      await fillFormField(page, '联系人', '张三');
      await fillFormField(page, '联系电话', '13800138001');
      await saveAndClose(page);
    }

    // 添加第二个仓库
    if (await openModal(page, 'button:has-text("新增仓库"), button:has-text("新增")')) {
      await fillFormField(page, '仓库编码', 'WH002');
      await fillFormField(page, '仓库名称', '上海中心仓');
      await fillFormField(page, '联系人', '李四');
      await saveAndClose(page);
    }
  });

  test('1.2 库位', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/warehouse/location`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    if (await openModal(page, 'button:has-text("新增库位"), button:has-text("新增")')) {
      await fillFormField(page, '库位编码', 'A01');
      await fillFormField(page, '库位名称', 'A区01架');
      await fillFormField(page, '仓库', '北京中心仓');
      await saveAndClose(page);
    }
  });

  test('1.3 商品分类', async ({ page }) => {
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
        await saveAndClose(page);
      }
    }
  });

  test('1.4 商品', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/product`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // 添加第一个商品
    if (await openModal(page, 'button:has-text("新增商品"), button:has-text("新增")')) {
      await fillFormField(page, '商品编码', 'P001');
      await fillFormField(page, '商品名称', 'iPhone 15 手机');
      await fillFormField(page, '商品分类', '电子产品');
      await fillFormField(page, '单位', '台');
      await fillFormField(page, '规格', '128GB');
      await fillFormField(page, '采购价', '5000');
      await fillFormField(page, '销售价', '6999');
      await saveAndClose(page);
    }

    // 添加第二个商品
    if (await openModal(page, 'button:has-text("新增商品"), button:has-text("新增")')) {
      await fillFormField(page, '商品编码', 'P002');
      await fillFormField(page, '商品名称', 'MacBook Pro');
      await fillFormField(page, '商品分类', '电子产品');
      await fillFormField(page, '单位', '台');
      await fillFormField(page, '采购价', '12000');
      await fillFormField(page, '销售价', '15999');
      await saveAndClose(page);
    }
  });

  test('1.5 计量单位', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/product/unit-of-measure`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    if (await openModal(page, 'button:has-text("新增单位"), button:has-text("新增")')) {
      await fillFormField(page, '单位编码', 'UNIT001');
      await fillFormField(page, '单位名称', '箱');
      await saveAndClose(page);
    }
  });

  test('1.6 客户', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/customer`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    if (await openModal(page, 'button:has-text("新增客户")')) {
      await fillFormField(page, '客户编码', 'C001');
      await fillFormField(page, '客户名称', '北京科技有限公司');
      await fillFormField(page, '联系人', '王五');
      await fillFormField(page, '联系电话', '010-12345678');
      await saveAndClose(page);
    }

    if (await openModal(page, 'button:has-text("新增客户")')) {
      await fillFormField(page, '客户编码', 'C002');
      await fillFormField(page, '客户名称', '上海贸易公司');
      await fillFormField(page, '联系人', '赵六');
      await saveAndClose(page);
    }
  });

  test('1.7 供应商', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/supplier`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    if (await openModal(page, 'button:has-text("新增供应商")')) {
      await fillFormField(page, '供应商编码', 'S001');
      await fillFormField(page, '供应商名称', '深圳科技有限公司');
      await fillFormField(page, '联系人', '刘七');
      await fillFormField(page, '联系电话', '0755-88888888');
      await saveAndClose(page);
    }

    if (await openModal(page, 'button:has-text("新增供应商")')) {
      await fillFormField(page, '供应商编码', 'S002');
      await fillFormField(page, '供应商名称', '广州电子公司');
      await fillFormField(page, '联系人', '陈八');
      await saveAndClose(page);
    }
  });
});

// ========== 2. 财务数据 ==========
test.describe('2. 财务数据', () => {
  test('2.1 账户', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/finance/account`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    if (await openModal(page, 'button:has-text("新增账户")')) {
      await fillFormField(page, '账户名称', '工商银行基本户');
      await fillFormField(page, '账户类型', '银行账户');
      await fillFormField(page, '账号', '6222021234567890123');
      await saveAndClose(page);
    }
  });

  test('2.2 收款记录', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/finance/in`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    if (await openModal(page, 'button:has-text("新增收款")')) {
      await fillFormField(page, '客户', '北京科技有限公司');
      await fillFormField(page, '收款金额', '50000');
      await fillFormField(page, '账户', '工商银行基本户');
      await saveAndClose(page);
    }
  });

  test('2.3 付款记录', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/finance/out`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    if (await openModal(page, 'button:has-text("新增付款")')) {
      await fillFormField(page, '供应商', '深圳科技有限公司');
      await fillFormField(page, '付款金额', '30000');
      await fillFormField(page, '账户', '工商银行基本户');
      await saveAndClose(page);
    }
  });

  test('2.4 应收账款', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/finance/receivable`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    if (await openModal(page, 'button:has-text("新增应收")')) {
      await fillFormField(page, '客户', '北京科技有限公司');
      await fillFormField(page, '应收金额', '10000');
      await saveAndClose(page);
    }
  });

  test('2.5 应付账款', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/finance/payable`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    if (await openModal(page, 'button:has-text("新增应付")')) {
      await fillFormField(page, '供应商', '深圳科技有限公司');
      await fillFormField(page, '应付金额', '20000');
      await saveAndClose(page);
    }
  });
});

// ========== 3. 销售数据 ==========
test.describe('3. 销售数据', () => {
  test('3.1 销售订单', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/sales/order`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    if (await openModal(page, 'button:has-text("新增订单"), button:has-text("新增")')) {
      await fillFormField(page, '客户', '北京科技有限公司');
      await addProductToForm(page);
      await saveAndClose(page);
    }
  });

  test('3.2 销售出库', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/sales/out`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    if (await openModal(page, 'button:has-text("新增出库"), button:has-text("新增")')) {
      await fillFormField(page, '客户', '北京科技有限公司');
      await addProductToForm(page);
      await saveAndClose(page);
    }
  });

  test('3.3 销售退货', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/sales/return`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    if (await openModal(page, 'button:has-text("新增退货"), button:has-text("新增")')) {
      await fillFormField(page, '客户', '北京科技有限公司');
      await fillFormField(page, '退货数量', '1');
      await saveAndClose(page);
    }
  });

  test('3.4 销售价格策略', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/sales/price-strategy`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    if (await openModal(page, 'button:has-text("新增策略"), button:has-text("新增")')) {
      await fillFormField(page, '策略名称', '批发价策略');
      await fillFormField(page, '商品', 'iPhone 15 手机');
      await fillFormField(page, '价格类型', '批发价');
      await fillFormField(page, '价格', '5500');
      await saveAndClose(page);
    }
  });

  test('3.5 促销', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/sales/promotion`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    if (await openModal(page, 'button:has-text("新增促销"), button:has-text("新增")')) {
      await fillFormField(page, '促销名称', 'iPhone优惠');
      await fillFormField(page, '促销类型', '商品促销');
      await fillFormField(page, '折扣类型', '百分比');
      await saveAndClose(page);
    }
  });
});

// ========== 4. 采购数据 ==========
test.describe('4. 采购数据', () => {
  test('4.1 采购订单', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/purchase/order`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    if (await openModal(page, 'button:has-text("新增订单"), button:has-text("新增")')) {
      await fillFormField(page, '供应商', '深圳科技有限公司');
      await addProductToForm(page);
      await saveAndClose(page);
    }
  });

  test('4.2 采购入库', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/purchase/in`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    if (await openModal(page, 'button:has-text("新增入库"), button:has-text("新增")')) {
      await fillFormField(page, '供应商', '深圳科技有限公司');
      await fillFormField(page, '仓库', '北京中心仓');
      await addProductToForm(page);
      await saveAndClose(page);
    }
  });

  test('4.3 采购退货', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/purchase/return`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    if (await openModal(page, 'button:has-text("新增退货"), button:has-text("新增")')) {
      await fillFormField(page, '供应商', '深圳科技有限公司');
      await fillFormField(page, '仓库', '北京中心仓');
      await fillFormField(page, '退货数量', '1');
      await saveAndClose(page);
    }
  });
});

// ========== 5. 库存数据 ==========
test.describe('5. 库存数据', () => {
  test('5.1 入库记录', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/inventory/in`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    if (await openModal(page, 'button:has-text("新增入库"), button:has-text("新增")')) {
      await fillFormField(page, '仓库', '北京中心仓');
      await addProductToForm(page);
      await saveAndClose(page);
    }
  });

  test('5.2 出库记录', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/inventory/out`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    if (await openModal(page, 'button:has-text("新增出库"), button:has-text("新增")')) {
      await fillFormField(page, '仓库', '北京中心仓');
      await addProductToForm(page);
      await saveAndClose(page);
    }
  });

  test('5.3 库存调拨', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/inventory/transfer`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    if (await openModal(page, 'button:has-text("新增调拨"), button:has-text("新增")')) {
      await fillFormField(page, '调拨日期', '2026-05-30');
      await fillFormField(page, '调出仓库', '北京中心仓');
      await fillFormField(page, '调入仓库', '上海中心仓');
      await saveAndClose(page);
    }
  });

  test('5.4 库存盘点', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/inventory/check`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    if (await openModal(page, 'button:has-text("新增盘点"), button:has-text("新增")')) {
      await fillFormField(page, '仓库', '北京中心仓');
      await saveAndClose(page);
    }
  });

  test('5.5 质检管理', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/inventory/quality-check`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    if (await openModal(page, 'button:has-text("新增质检"), button:has-text("新增")')) {
      await fillFormField(page, '质检类型', '采购入库质检');
      await fillFormField(page, '供应商', '深圳科技有限公司');
      await fillFormField(page, '仓库', '北京中心仓');
      await saveAndClose(page);
    }
  });
});

// ========== 6. 报表中心 ==========
test.describe('6. 报表中心', () => {
  test('6.1 经营概览', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/dashboard`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    // 主要验证页面加载
    const title = page.locator('h1:has-text("经营概览")');
    await expect(title).toBeVisible({ timeout: 5000 });
  });

  test('6.2 利润表', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/report/dashboard`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const profitTab = page.locator('.ant-tabs-tab:has-text("利润表")').first();
    if (await profitTab.isVisible({ timeout: 2000 }).catch(() => false)) {
      await profitTab.click();
      await page.waitForTimeout(1000);
    }
  });

  test('6.3 AI预测', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/report/prediction`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const predictTab = page.locator('.ant-tabs-tab:has-text("销售预测")').first();
    if (await predictTab.isVisible({ timeout: 2000 }).catch(() => false)) {
      await predictTab.click();
      await page.waitForTimeout(1000);
    }
  });
});

// ========== 7. 系统管理 ==========
test.describe('7. 系统管理', () => {
  test('7.1 用户管理', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/system/user`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    // 验证页面加载 - 系统管理主标题和用户管理tab
    const title = page.locator('h2:has-text("系统管理")');
    await expect(title).toBeVisible({ timeout: 5000 });
    const userTab = page.locator('.ant-tabs-tab:has-text("用户管理")');
    await expect(userTab).toBeVisible({ timeout: 3000 });
  });

  test('7.2 角色管理', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/role`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    const title = page.locator('h2:has-text("系统管理")');
    await expect(title).toBeVisible({ timeout: 5000 });
    const roleTab = page.locator('.ant-tabs-tab:has-text("角色管理")');
    await expect(roleTab).toBeVisible({ timeout: 3000 });
  });

  test('7.3 菜单管理', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/system/user`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    // 先切换到栏目管理tab
    const menuTab = page.locator('.ant-tabs-tab:has-text("栏目管理")');
    if (await menuTab.isVisible({ timeout: 3000 }).catch(() => false)) {
      await menuTab.click();
      await page.waitForTimeout(1000);
    }
    const title = page.locator('h2:has-text("系统管理")');
    await expect(title).toBeVisible({ timeout: 5000 });
  });

  test('7.4 登录日志', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/system/user`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    // 先切换到登录日志tab
    const logTab = page.locator('.ant-tabs-tab:has-text("登录日志")');
    if (await logTab.isVisible({ timeout: 3000 }).catch(() => false)) {
      await logTab.click();
      await page.waitForTimeout(1000);
    }
    const title = page.locator('h2:has-text("系统管理")');
    await expect(title).toBeVisible({ timeout: 5000 });
  });

  test('7.5 操作日志', async ({ page }) => {
    await loginViaUI(page);
    await page.goto(`${BASE_URL}/system/user`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    // 先切换到操作日志tab
    const logTab = page.locator('.ant-tabs-tab:has-text("操作日志")');
    if (await logTab.isVisible({ timeout: 3000 }).catch(() => false)) {
      await logTab.click();
      await page.waitForTimeout(1000);
    }
    const title = page.locator('h2:has-text("系统管理")');
    await expect(title).toBeVisible({ timeout: 5000 });
  });
});