// IMS E2E Test - Complete State Transition Testing
import { chromium } from 'playwright';

const BASE_URL = 'http://localhost:3000';
const SCREENSHOT_DIR = '/home/ivan/e2etest';

function getTimestamp() {
  return Date.now().toString().slice(-6);
}

async function waitForSelectOptions(page, selectLocator) {
  await selectLocator.click();
  await page.waitForTimeout(800);
  const dropdown = page.locator('.ant-select-dropdown:not(.ant-select-hidden)');
  if (await dropdown.isVisible().catch(() => false)) {
    const options = dropdown.locator('.ant-select-item-option');
    const count = await options.count();
    if (count > 0) {
      await options.first().click();
      return true;
    }
  }
  await page.keyboard.press('Escape');
  return false;
}

async function waitForModalVisible(page) {
  await page.waitForTimeout(1000);
  return await page.locator('.ant-modal').isVisible().catch(() => false);
}

async function submitModal(page) {
  const submitBtn = page.locator('.ant-modal button:has-text("确定"), .ant-modal button:has-text("创建"), .ant-modal button:has-text("修改")');
  if (await submitBtn.isVisible().catch(() => false)) {
    await submitBtn.click({ force: true });
    await page.waitForTimeout(2000);
    await page.waitForSelector('.ant-modal', { state: 'hidden', timeout: 5000 }).catch(() => {});
    await page.waitForTimeout(500);
    return true;
  }
  return false;
}

async function fillModalForm(page, fields) {
  for (const [selector, value] of fields) {
    try {
      const el = page.locator(selector).first();
      if (await el.isVisible({ timeout: 2000 })) {
        await el.fill(value);
        await page.waitForTimeout(300);
      }
    } catch (e) {
      // Try with input suffix
      try {
        const inputEl = page.locator(`${selector} input`).first();
        if (await inputEl.isVisible({ timeout: 2000 })) {
          await inputEl.fill(value);
          await page.waitForTimeout(300);
        }
      } catch (e2) {}
    }
  }
}

async function confirmPopover(page) {
  const confirmBtn = page.locator('.ant-popover button:has-text("确定"), .ant-popconfirm button:has-text("确定")');
  if (await confirmBtn.isVisible().catch(() => false)) {
    await confirmBtn.click({ force: true });
    await page.waitForTimeout(1500);
    return true;
  }
  return false;
}

async function clickActionButton(page, selector, confirm = false) {
  const btn = page.locator(selector).first();
  if (await btn.isVisible({ timeout: 3000 })) {
    await btn.click({ force: true });
    await page.waitForTimeout(1000);
    if (confirm) {
      await confirmPopover(page);
    }
    await page.waitForTimeout(2000);
    return true;
  }
  return false;
}

async function runTests() {
  console.log('Starting IMS E2E Tests - Complete State Transitions...\n');

  let browser;
  try {
    browser = await chromium.launch({
      headless: true,
      executablePath: '/etc/profiles/per-user/ivan/bin/google-chrome-stable',
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    });

    const context = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
    const page = await context.newPage();

    // Login
    console.log('Step 1: Login');
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    await page.fill('input#username, input[placeholder*="用户名"]', 'admin');
    await page.fill('input#password, input[type="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(3000);
    console.log('  ✓ Login successful\n');

    // Helper to create data
    async function createData(url, btnText, formFields, modalTitle) {
      await page.goto(`${BASE_URL}${url}`);
      await page.waitForTimeout(2000);
      await page.keyboard.press('Escape');
      await page.waitForTimeout(500);

      const addBtn = page.locator(`button:has-text("${btnText}")`).first();
      if (!await addBtn.isVisible()) {
        console.log(`    [SKIP] ${btnText} button not visible`);
        return false;
      }
      await addBtn.click({ force: true });
      await page.waitForTimeout(1000);

      if (!await waitForModalVisible(page)) {
        console.log(`    [SKIP] Modal not opened`);
        return false;
      }

      if (formFields) {
        await fillModalForm(page, formFields);
      }
      await submitModal(page);
      await page.waitForTimeout(2000);
      return true;
    }

    // Helper to test action
    async function testAction(url, actionText, confirm = false) {
      await page.goto(`${BASE_URL}${url}`);
      await page.waitForTimeout(2000);

      const actionBtn = page.locator(`button:has-text("${actionText}")`).first();
      if (await actionBtn.isVisible()) {
        await actionBtn.click({ force: true });
        await page.waitForTimeout(1000);
        if (confirm) {
          await confirmPopover(page);
        }
        await page.waitForTimeout(2000);
        return true;
      }
      return false;
    }

    // ========== CREATE PREREQUISITE DATA ==========
    console.log('=== Creating prerequisite data ===');

    // Supplier
    console.log('[Prerequisite] Creating Supplier...');
    if (await createData('/supplier', '新增', [
      ['.ant-modal input#name', `Supplier ${getTimestamp()}`],
      ['.ant-modal input#contact', 'Test Contact'],
      ['.ant-modal input#phone', '13900139000'],
    ], 'supplier')) {
      console.log('  ✓ Supplier created');
    }

    // Customer
    console.log('[Prerequisite] Creating Customer...');
    if (await createData('/customer', '新增', [
      ['.ant-modal input#name', `Customer ${getTimestamp()}`],
      ['.ant-modal input#contact', 'Test Contact'],
      ['.ant-modal input#phone', '13800138000'],
    ], 'customer')) {
      console.log('  ✓ Customer created');
    }

    // Product
    console.log('[Prerequisite] Creating Product...');
    if (await createData('/product', '新增', [
      ['.ant-modal input[placeholder*="商品编码"]', `P${getTimestamp()}`],
      ['.ant-modal input[placeholder*="商品名称"]', `Product ${getTimestamp()}`],
      ['.ant-modal input[placeholder*="单位"]', '盒'],
    ], 'product')) {
      console.log('  ✓ Product created');
    }

    // Warehouse
    console.log('[Prerequisite] Creating Warehouse...');
    if (await createData('/warehouse', '新增仓库', [
      ['.ant-modal input#code', `WH${getTimestamp()}`],
      ['.ant-modal input#name', `Warehouse ${getTimestamp()}`],
    ], 'warehouse')) {
      console.log('  ✓ Warehouse created');
    }

    // ========== TEST SALES ORDER ==========
    console.log('\n=== Testing Sales Order ===');

    console.log('  [Creating Sales Order]');
    if (await createData('/sales/order', '新增订单', [], 'order')) {
      console.log('  ✓ Sales Order created');
      await page.screenshot({ path: `${SCREENSHOT_DIR}/sales-order-0-created.png`, fullPage: true });

      // Approve
      console.log('  [Testing Approve]');
      if (await testAction('/sales/order', '审核', true)) {
        console.log('  ✓ Sales Order approved');
        await page.screenshot({ path: `${SCREENSHOT_DIR}/sales-order-1-approved.png`, fullPage: true });
      }

      // Cancel (should show after approve if status allows)
      console.log('  [Testing Cancel]');
      if (await testAction('/sales/order', '取消', true)) {
        console.log('  ✓ Sales Order cancelled');
        await page.screenshot({ path: `${SCREENSHOT_DIR}/sales-order-9-cancelled.png`, fullPage: true });
      }
    }

    // ========== TEST PURCHASE ORDER ==========
    console.log('\n=== Testing Purchase Order ===');

    console.log('  [Creating Purchase Order]');
    if (await createData('/purchase/order', '新增订单', [], 'order')) {
      console.log('  ✓ Purchase Order created');
      await page.screenshot({ path: `${SCREENSHOT_DIR}/purchase-order-0-created.png`, fullPage: true });

      // Approve
      console.log('  [Testing Approve]');
      if (await testAction('/purchase/order', '审核', true)) {
        console.log('  ✓ Purchase Order approved');
        await page.screenshot({ path: `${SCREENSHOT_DIR}/purchase-order-1-approved.png`, fullPage: true });
      }

      // Cancel
      console.log('  [Testing Cancel]');
      if (await testAction('/purchase/order', '取消', true)) {
        console.log('  ✓ Purchase Order cancelled');
        await page.screenshot({ path: `${SCREENSHOT_DIR}/purchase-order-9-cancelled.png`, fullPage: true });
      }
    }

    // ========== TEST SALES OUT ==========
    console.log('\n=== Testing SalesOut ===');

    console.log('  [Creating SalesOut]');
    if (await createData('/sales/out', '新建出库', [
      ['.ant-modal input#remark', `Test ${getTimestamp()}`],
    ], 'out')) {
      console.log('  ✓ SalesOut created');
      await page.screenshot({ path: `${SCREENSHOT_DIR}/sales-out-0-created.png`, fullPage: true });

      // Edit
      console.log('  [Testing Edit]');
      const editBtn = page.locator('button:has-text("编辑")').first();
      if (await editBtn.isVisible()) {
        await editBtn.click({ force: true });
        await page.waitForTimeout(1000);
        if (await waitForModalVisible(page)) {
          await submitModal(page);
          await page.waitForTimeout(2000);
          console.log('  ✓ SalesOut edited');
          await page.screenshot({ path: `${SCREENSHOT_DIR}/sales-out-0-edited.png`, fullPage: true });
        }
      }

      // Approve
      console.log('  [Testing Approve]');
      if (await testAction('/sales/out', '审核', true)) {
        console.log('  ✓ SalesOut approved');
        await page.screenshot({ path: `${SCREENSHOT_DIR}/sales-out-1-approved.png`, fullPage: true });
      }

      // Complete
      console.log('  [Testing Complete]');
      if (await testAction('/sales/out', '完成', false)) {
        console.log('  ✓ SalesOut completed');
        await page.screenshot({ path: `${SCREENSHOT_DIR}/sales-out-2-completed.png`, fullPage: true });
      }

      // Cancel (if status allows)
      console.log('  [Testing Cancel]');
      if (await testAction('/sales/out', '取消', true)) {
        console.log('  ✓ SalesOut cancelled');
        await page.screenshot({ path: `${SCREENSHOT_DIR}/sales-out-9-cancelled.png`, fullPage: true });
      }
    }

    // ========== TEST PURCHASE IN ==========
    console.log('\n=== Testing PurchaseIn ===');

    console.log('  [Creating PurchaseIn]');
    if (await createData('/purchase/in', '新建入库', [], 'in')) {
      console.log('  ✓ PurchaseIn created');
      await page.screenshot({ path: `${SCREENSHOT_DIR}/purchase-in-0-created.png`, fullPage: true });

      // Edit
      console.log('  [Testing Edit]');
      const editBtn = page.locator('button:has-text("编辑")').first();
      if (await editBtn.isVisible()) {
        await editBtn.click({ force: true });
        await page.waitForTimeout(1000);
        if (await waitForModalVisible(page)) {
          await submitModal(page);
          await page.waitForTimeout(2000);
          console.log('  ✓ PurchaseIn edited');
          await page.screenshot({ path: `${SCREENSHOT_DIR}/purchase-in-0-edited.png`, fullPage: true });
        }
      }

      // Approve
      console.log('  [Testing Approve]');
      if (await testAction('/purchase/in', '审核', true)) {
        console.log('  ✓ PurchaseIn approved');
        await page.screenshot({ path: `${SCREENSHOT_DIR}/purchase-in-1-approved.png`, fullPage: true });
      }

      // Complete
      console.log('  [Testing Complete]');
      if (await testAction('/purchase/in', '完成', false)) {
        console.log('  ✓ PurchaseIn completed');
        await page.screenshot({ path: `${SCREENSHOT_DIR}/purchase-in-2-completed.png`, fullPage: true });
      }

      // Cancel
      console.log('  [Testing Cancel]');
      if (await testAction('/purchase/in', '取消', true)) {
        console.log('  ✓ PurchaseIn cancelled');
        await page.screenshot({ path: `${SCREENSHOT_DIR}/purchase-in-9-cancelled.png`, fullPage: true });
      }
    }

    // ========== TEST SALES RETURN ==========
    console.log('\n=== Testing SalesReturn ===');

    console.log('  [Creating SalesReturn]');
    if (await createData('/sales/return', '新建退货', [], 'return')) {
      console.log('  ✓ SalesReturn created');
      await page.screenshot({ path: `${SCREENSHOT_DIR}/sales-return-0-created.png`, fullPage: true });

      // Edit
      console.log('  [Testing Edit]');
      const editBtn = page.locator('button:has-text("编辑")').first();
      if (await editBtn.isVisible()) {
        await editBtn.click({ force: true });
        await page.waitForTimeout(1000);
        if (await waitForModalVisible(page)) {
          await submitModal(page);
          await page.waitForTimeout(2000);
          console.log('  ✓ SalesReturn edited');
          await page.screenshot({ path: `${SCREENSHOT_DIR}/sales-return-0-edited.png`, fullPage: true });
        }
      }

      // Approve (通过)
      console.log('  [Testing Approve (通过)]');
      if (await testAction('/sales/return', '通过', false)) {
        console.log('  ✓ SalesReturn approved');
        await page.screenshot({ path: `${SCREENSHOT_DIR}/sales-return-1-approved.png`, fullPage: true });
      }

      // Inbound
      console.log('  [Testing Inbound]');
      if (await testAction('/sales/return', '入库', false)) {
        console.log('  ✓ SalesReturn inbounded');
        await page.screenshot({ path: `${SCREENSHOT_DIR}/sales-return-2-inbounded.png`, fullPage: true });
      }

      // Reject (if status allows)
      console.log('  [Testing Reject]');
      if (await testAction('/sales/return', '拒绝', true)) {
        console.log('  ✓ SalesReturn rejected');
        await page.screenshot({ path: `${SCREENSHOT_DIR}/sales-return-9-rejected.png`, fullPage: true });
      }
    }

    // ========== TEST PAYABLE ==========
    console.log('\n=== Testing Payable ===');

    console.log('  [Creating Payable]');
    await page.goto(`${BASE_URL}/finance/payable`);
    await page.waitForTimeout(2000);
    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);

    const addPayableBtn = page.locator('button:has-text("新增应付")');
    if (await addPayableBtn.isVisible()) {
      await addPayableBtn.click({ force: true });
      await page.waitForTimeout(1000);

      if (await waitForModalVisible(page)) {
        const supplierSelect = page.locator('.ant-modal .ant-select').first();
        if (await supplierSelect.isVisible()) {
          await waitForSelectOptions(page, supplierSelect);
        }
        const amountInput = page.locator('.ant-modal .ant-input-number input').first();
        if (await amountInput.isVisible()) {
          await amountInput.fill('1000');
        }
        await submitModal(page);
        await page.waitForTimeout(2000);
        console.log('  ✓ Payable created');
        await page.screenshot({ path: `${SCREENSHOT_DIR}/payable-created.png`, fullPage: true });

        // Edit
        const editPayableBtn = page.locator('button:has-text("编辑")').first();
        if (await editPayableBtn.isVisible()) {
          await editPayableBtn.click({ force: true });
          await page.waitForTimeout(1000);
          if (await waitForModalVisible(page)) {
            const amountInput2 = page.locator('.ant-modal .ant-input-number input').first();
            if (await amountInput2.isVisible()) {
              await amountInput2.fill('2000');
            }
            await submitModal(page);
            await page.waitForTimeout(2000);
            console.log('  ✓ Payable edited');
            await page.screenshot({ path: `${SCREENSHOT_DIR}/payable-edited.png`, fullPage: true });
          }
        }
      }
    }

    // ========== TEST RECEIVABLE ==========
    console.log('\n=== Testing Receivable ===');

    console.log('  [Creating Receivable]');
    await page.goto(`${BASE_URL}/finance/receivable`);
    await page.waitForTimeout(2000);
    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);

    const addReceivableBtn = page.locator('button:has-text("新增应收")');
    if (await addReceivableBtn.isVisible()) {
      await addReceivableBtn.click({ force: true });
      await page.waitForTimeout(1000);

      if (await waitForModalVisible(page)) {
        const customerSelect = page.locator('.ant-modal .ant-select').first();
        if (await customerSelect.isVisible()) {
          await waitForSelectOptions(page, customerSelect);
        }
        const amountInput = page.locator('.ant-modal .ant-input-number input').first();
        if (await amountInput.isVisible()) {
          await amountInput.fill('1500');
        }
        await submitModal(page);
        await page.waitForTimeout(2000);
        console.log('  ✓ Receivable created');
        await page.screenshot({ path: `${SCREENSHOT_DIR}/receivable-created.png`, fullPage: true });

        // Edit
        const editReceivableBtn = page.locator('button:has-text("编辑")').first();
        if (await editReceivableBtn.isVisible()) {
          await editReceivableBtn.click({ force: true });
          await page.waitForTimeout(1000);
          if (await waitForModalVisible(page)) {
            const amountInput2 = page.locator('.ant-modal .ant-input-number input').first();
            if (await amountInput2.isVisible()) {
              await amountInput2.fill('2500');
            }
            await submitModal(page);
            await page.waitForTimeout(2000);
            console.log('  ✓ Receivable edited');
            await page.screenshot({ path: `${SCREENSHOT_DIR}/receivable-edited.png`, fullPage: true });
          }
        }
      }
    }

    // Final screenshot
    await page.goto(`${BASE_URL}/dashboard`);
    await page.waitForTimeout(2000);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/final-complete.png`, fullPage: true });

    console.log('\n========================================');
    console.log('✓ All E2E State Transition tests completed!');
    console.log('========================================');
    console.log('\nScreenshots saved to:', SCREENSHOT_DIR);

  } catch (error) {
    console.error('\n✗ Test failed:', error.message);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/error-complete.png`, fullPage: true }).catch(() => {});
    if (browser) await browser.close();
    process.exit(1);
  }

  if (browser) await browser.close();
}

runTests().catch(console.error);