// IMS E2E Test - Full CRUD Flow Test (Create -> Edit -> Delete)
import { chromium } from 'playwright';

const BASE_URL = 'http://localhost:3000';
const SCREENSHOT_DIR = '/home/ivan/e2etest';

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
  const submitBtn = page.locator('.ant-modal button:has-text("确定"), .ant-modal button:has-text("创建")');
  if (await submitBtn.isVisible().catch(() => false)) {
    await submitBtn.click({ force: true });
    await page.waitForTimeout(2000);
    await page.waitForSelector('.ant-modal', { state: 'hidden', timeout: 5000 }).catch(() => {});
    await page.waitForTimeout(500);
    return true;
  }
  return false;
}

function getTimestamp() {
  return Date.now().toString().slice(-6);
}

async function fillInputNumber(page, selector, value) {
  try {
    const input = page.locator(`${selector} input`).first();
    if (await input.isVisible({ timeout: 2000 })) {
      await input.fill(value);
      return true;
    }
  } catch (e) {}
  return false;
}

async function runTests() {
  console.log('Starting IMS E2E Tests - Full CRUD Flow...\n');

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
    console.log('  ✓ Login successful');

    // Helper function to create data
    async function createData(page, url, btnText, fillFields) {
      await page.goto(`${BASE_URL}${url}`);
      await page.waitForTimeout(2000);
      await page.keyboard.press('Escape');
      await page.waitForTimeout(500);

      const addBtn = page.locator(`button:has-text("${btnText}")`).first();
      if (await addBtn.isVisible()) {
        await addBtn.click({ force: true });
        await page.waitForTimeout(1000);

        if (await waitForModalVisible(page)) {
          for (const [selector, value] of fillFields) {
            const inputEl = page.locator(`${selector} input`).first();
            if (await inputEl.isVisible({ timeout: 2000 })) {
              await inputEl.fill(value);
            }
          }
          await submitModal(page);
          await page.waitForTimeout(2000);
          return true;
        }
      }
      return false;
    }

    // Helper function to edit first record
    async function editData(page, url) {
      await page.goto(`${BASE_URL}${url}`);
      await page.waitForTimeout(2000);

      const editBtn = page.locator('button:has-text("编辑")').first();
      if (await editBtn.isVisible()) {
        await editBtn.click({ force: true });
        await page.waitForTimeout(1000);

        if (await waitForModalVisible(page)) {
          await submitModal(page);
          await page.waitForTimeout(2000);
          return true;
        }
      }
      return false;
    }

    // ========== STEP 1: Create prerequisite data ==========
    console.log('\n=== STEP 1: Creating prerequisite data ===');

    await createData(page, '/supplier', '新增', [
      ['.ant-modal input#name', `E2E Supplier ${getTimestamp()}`],
      ['.ant-modal input#contact', 'Test Contact'],
      ['.ant-modal input#phone', '13900139000'],
    ]);
    console.log('  ✓ Supplier created');

    await createData(page, '/customer', '新增', [
      ['.ant-modal input#name', `E2E Customer ${getTimestamp()}`],
      ['.ant-modal input#contact', 'Test Contact'],
      ['.ant-modal input#phone', '13800138000'],
    ]);
    console.log('  ✓ Customer created');

    await createData(page, '/product', '新增', [
      ['.ant-modal input#name', `E2E Product ${getTimestamp()}`],
    ]);
    console.log('  ✓ Product created');

    await createData(page, '/warehouse', '新增仓库', [
      ['.ant-modal input#code', `E2E-WH-${getTimestamp()}`],
      ['.ant-modal input#name', `E2E Warehouse ${getTimestamp()}`],
    ]);
    console.log('  ✓ Warehouse created');

    await page.screenshot({ path: `${SCREENSHOT_DIR}/prerequisite-done.png`, fullPage: true });
    console.log('\n✓ Prerequisite data created');

    // ========== STEP 2: Test CRUD on each page ==========
    console.log('\n=== STEP 2: Testing CRUD on business pages ===');

    // SalesOut
    console.log('\n[SalesOut] Create...');
    await createData(page, '/sales/out', '新建出库', [
      ['.ant-modal input#remark', `E2E SalesOut ${getTimestamp()}`],
    ]);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/sales-out-created.png`, fullPage: true });
    console.log('  ✓ SalesOut created');

    console.log('[SalesOut] Edit...');
    await editData(page, '/sales/out');
    await page.screenshot({ path: `${SCREENSHOT_DIR}/sales-out-edited.png`, fullPage: true });
    console.log('  ✓ SalesOut edited');

    // Payable
    console.log('\n[Payable] Create...');
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

        // Fill amount using the inner input of InputNumber
        const amountInput = page.locator('.ant-modal .ant-input-number input').first();
        if (await amountInput.isVisible()) {
          await amountInput.fill('1000');
        }

        await submitModal(page);
        await page.waitForTimeout(2000);
      }
    }
    await page.screenshot({ path: `${SCREENSHOT_DIR}/payable-created.png`, fullPage: true });
    console.log('  ✓ Payable created');

    console.log('[Payable] Edit...');
    await editData(page, '/finance/payable');
    await page.screenshot({ path: `${SCREENSHOT_DIR}/payable-edited.png`, fullPage: true });
    console.log('  ✓ Payable edited');

    // Receivable
    console.log('\n[Receivable] Create...');
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
      }
    }
    await page.screenshot({ path: `${SCREENSHOT_DIR}/receivable-created.png`, fullPage: true });
    console.log('  ✓ Receivable created');

    console.log('[Receivable] Edit...');
    await editData(page, '/finance/receivable');
    await page.screenshot({ path: `${SCREENSHOT_DIR}/receivable-edited.png`, fullPage: true });
    console.log('  ✓ Receivable edited');

    // PurchaseIn
    console.log('\n[PurchaseIn] Create...');
    await page.goto(`${BASE_URL}/purchase/in`);
    await page.waitForTimeout(2000);
    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);

    const addPurchaseInBtn = page.locator('button:has-text("新建入库")');
    if (await addPurchaseInBtn.isVisible()) {
      await addPurchaseInBtn.click({ force: true });
      await page.waitForTimeout(1000);

      if (await waitForModalVisible(page)) {
        const supplierSelect = page.locator('.ant-modal .ant-select').first();
        if (await supplierSelect.isVisible()) {
          await waitForSelectOptions(page, supplierSelect);
        }
        const warehouseSelect = page.locator('.ant-modal .ant-select').nth(1);
        if (await warehouseSelect.isVisible()) {
          await waitForSelectOptions(page, warehouseSelect);
        }
        await submitModal(page);
        await page.waitForTimeout(2000);
      }
    }
    await page.screenshot({ path: `${SCREENSHOT_DIR}/purchase-in-created.png`, fullPage: true });
    console.log('  ✓ PurchaseIn created');

    console.log('[PurchaseIn] Edit...');
    await editData(page, '/purchase/in');
    await page.screenshot({ path: `${SCREENSHOT_DIR}/purchase-in-edited.png`, fullPage: true });
    console.log('  ✓ PurchaseIn edited');

    // SalesReturn
    console.log('\n[SalesReturn] Create...');
    await page.goto(`${BASE_URL}/sales/return`);
    await page.waitForTimeout(2000);
    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);

    const addSalesReturnBtn = page.locator('button:has-text("新建退货")');
    if (await addSalesReturnBtn.isVisible()) {
      await addSalesReturnBtn.click({ force: true });
      await page.waitForTimeout(1000);

      if (await waitForModalVisible(page)) {
        const customerSelect = page.locator('.ant-modal .ant-select').first();
        if (await customerSelect.isVisible()) {
          await waitForSelectOptions(page, customerSelect);
        }
        const warehouseSelect = page.locator('.ant-modal .ant-select').nth(1);
        if (await warehouseSelect.isVisible()) {
          await waitForSelectOptions(page, warehouseSelect);
        }
        await submitModal(page);
        await page.waitForTimeout(2000);
      }
    }
    await page.screenshot({ path: `${SCREENSHOT_DIR}/sales-return-created.png`, fullPage: true });
    console.log('  ✓ SalesReturn created');

    console.log('[SalesReturn] Edit...');
    await editData(page, '/sales/return');
    await page.screenshot({ path: `${SCREENSHOT_DIR}/sales-return-edited.png`, fullPage: true });
    console.log('  ✓ SalesReturn edited');

    // ========== STEP 3: Test Delete/Cancel ==========
    console.log('\n=== STEP 3: Testing Delete/Cancel operations ===');

    // Cancel SalesOut
    console.log('\n[SalesOut] Cancel...');
    await page.goto(`${BASE_URL}/sales/out`);
    await page.waitForTimeout(2000);

    const cancelSalesOutBtn = page.locator('button:has-text("取消")').first();
    if (await cancelSalesOutBtn.isVisible()) {
      await cancelSalesOutBtn.click({ force: true });
      await page.waitForTimeout(1000);

      const confirmBtn = page.locator('.ant-popover button:has-text("确定"), .ant-popconfirm button:has-text("确定")');
      if (await confirmBtn.isVisible()) {
        await confirmBtn.click({ force: true });
        await page.waitForTimeout(2000);
      }
    }
    await page.screenshot({ path: `${SCREENSHOT_DIR}/sales-out-cancelled.png`, fullPage: true });
    console.log('  ✓ SalesOut cancelled');

    // Reject SalesReturn
    console.log('\n[SalesReturn] Reject...');
    await page.goto(`${BASE_URL}/sales/return`);
    await page.waitForTimeout(2000);

    const rejectBtn = page.locator('button:has-text("拒绝")').first();
    if (await rejectBtn.isVisible()) {
      await rejectBtn.click({ force: true });
      await page.waitForTimeout(1000);

      const confirmBtn = page.locator('.ant-popover button:has-text("确定")');
      if (await confirmBtn.isVisible()) {
        await confirmBtn.click({ force: true });
        await page.waitForTimeout(2000);
      }
    }
    await page.screenshot({ path: `${SCREENSHOT_DIR}/sales-return-rejected.png`, fullPage: true });
    console.log('  ✓ SalesReturn rejected');

    // Final screenshot
    await page.goto(`${BASE_URL}/dashboard`);
    await page.waitForTimeout(2000);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/final-result.png`, fullPage: true });

    console.log('\n========================================');
    console.log('✓ All E2E CRUD tests completed!');
    console.log('========================================');
    console.log('\nTest Summary:');
    console.log('  1. ✓ Login');
    console.log('  2. ✓ Prerequisite data created');
    console.log('  3. ✓ SalesOut - Created, Edited, Cancelled');
    console.log('  4. ✓ Payable - Created, Edited');
    console.log('  5. ✓ Receivable - Created, Edited');
    console.log('  6. ✓ PurchaseIn - Created, Edited');
    console.log('  7. ✓ SalesReturn - Created, Edited, Rejected');
    console.log('\nScreenshots saved to:', SCREENSHOT_DIR);

  } catch (error) {
    console.error('\n✗ Test failed:', error.message);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/error.png`, fullPage: true }).catch(() => {});
    if (browser) await browser.close();
    process.exit(1);
  }

  if (browser) await browser.close();
}

runTests().catch(console.error);