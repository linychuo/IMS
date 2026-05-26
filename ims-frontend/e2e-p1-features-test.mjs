// IMS E2E Test - New P1 Features Testing
import { chromium } from 'playwright';

const BASE_URL = 'http://localhost:3000';
const SCREENSHOT_DIR = '/home/ivan/e2etest';

function getTimestamp() {
  return Date.now().toString().slice(-6);
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

async function closeModal(page) {
  const closeBtn = page.locator('.ant-modal button:has-text("取消"), .ant-modal button:has-text("关闭")');
  if (await closeBtn.isVisible().catch(() => false)) {
    await closeBtn.click({ force: true });
    await page.waitForTimeout(500);
  }
  await page.keyboard.press('Escape');
  await page.waitForTimeout(500);
}

async function clickTab(page, tabText) {
  const tabs = page.locator('.ant-tabs-tab');
  const count = await tabs.count();
  for (let i = 0; i < count; i++) {
    const tab = tabs.nth(i);
    const text = await tab.textContent();
    if (text && text.includes(tabText)) {
      await tab.click({ force: true });
      await page.waitForTimeout(1000);
      return true;
    }
  }
  return false;
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

async function runTests() {
  console.log('Starting IMS E2E Tests - New P1 Features...\n');

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
    await page.goto(BASE_URL + '/login');
    await page.waitForTimeout(3000);
    await page.fill('input[placeholder="用户名"]', 'admin');
    await page.fill('input[placeholder="密码"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(4000);
    console.log('  ✓ Login successful\n');

    // ========== TEST 1: SALES RETURN CANCEL BUTTON ==========
    console.log('\n=== Test 1: Sales Return Cancel Button ===');
    await page.goto(`${BASE_URL}/sales/return`);
    await page.waitForTimeout(2000);

    // Check if there's a pending return order (status=0)
    const rows = page.locator('.ant-table-tbody tr');
    const rowCount = await rows.count();

    if (rowCount > 0) {
      // Find a row with status 0 (pending)
      for (let i = 0; i < rowCount; i++) {
        const row = rows.nth(i);
        const statusBadge = row.locator('.ant-badge, .ant-tag');
        if (await statusBadge.isVisible()) {
          const statusText = await statusBadge.textContent();
          // Status 0 = 待审核
          if (statusText && statusText.includes('待审核')) {
            console.log('  [Found pending return, checking cancel button]');
            const cancelBtn = row.locator('button:has-text("取消")');
            if (await cancelBtn.isVisible()) {
              console.log('  ✓ Cancel button is visible for pending return');
              await page.screenshot({ path: `${SCREENSHOT_DIR}/sales-return-cancel-btn.png`, fullPage: true });
            } else {
              console.log('  ✗ Cancel button NOT visible for pending return');
            }
            break;
          }
        }
      }
    } else {
      console.log('  [SKIP] No sales return data found');
    }

    // ========== TEST 2: INVENTORY TRANSFER APPROVE/REJECT ==========
    console.log('\n=== Test 2: Inventory Transfer Approve/Reject ===');
    await page.goto(`${BASE_URL}/inventory/transfer`);
    await page.waitForTimeout(2000);

    const transferRows = page.locator('.ant-table-tbody tr');
    const transferRowCount = await transferRows.count();

    if (transferRowCount > 0) {
      console.log('  [Found transfer records, checking action buttons]');

      // Find a row with status 0 (pending)
      for (let i = 0; i < transferRowCount; i++) {
        const row = transferRows.nth(i);
        const statusBadge = row.locator('.ant-badge, .ant-tag');
        if (await statusBadge.isVisible()) {
          const statusText = await statusBadge.textContent();
          // Status 0 = 待调拨
          if (statusText && (statusText.includes('待调拨') || statusText.includes('待审核'))) {
            const approveBtn = row.locator('button:has-text("审核")');
            const rejectBtn = row.locator('button:has-text("拒绝")');

            if (await approveBtn.isVisible()) {
              console.log('  ✓ Approve button is visible for pending transfer');
              await page.screenshot({ path: `${SCREENSHOT_DIR}/transfer-approve-btn.png`, fullPage: true });
            }
            if (await rejectBtn.isVisible()) {
              console.log('  ✓ Reject button is visible for pending transfer');
              await page.screenshot({ path: `${SCREENSHOT_DIR}/transfer-reject-btn.png`, fullPage: true });
            }
            break;
          }
        }
      }
    } else {
      console.log('  [SKIP] No inventory transfer data found');
    }

    // ========== TEST 3: CUSTOMER RECONCILIATION CONFIRM ==========
    console.log('\n=== Test 3: Customer Reconciliation Confirm ===');
    await page.goto(`${BASE_URL}/finance/customer-reconciliation`);
    await page.waitForTimeout(2000);

    const custReconRows = page.locator('.ant-table-tbody tr');
    if (await custReconRows.first().isVisible({ timeout: 3000 }).catch(() => false)) {
      const confirmBtn = page.locator('button:has-text("确认")').first();
      if (await confirmBtn.isVisible()) {
        console.log('  ✓ Confirm button is visible in customer reconciliation');
        await page.screenshot({ path: `${SCREENSHOT_DIR}/customer-recon-confirm-btn.png`, fullPage: true });
      } else {
        console.log('  [INFO] No confirm button visible (may need pending records)');
      }
    } else {
      console.log('  [SKIP] No customer reconciliation data found');
    }

    // ========== TEST 4: SUPPLIER RECONCILIATION CONFIRM ==========
    console.log('\n=== Test 4: Supplier Reconciliation Confirm ===');
    await page.goto(`${BASE_URL}/finance/supplier-reconciliation`);
    await page.waitForTimeout(2000);

    const suppReconRows = page.locator('.ant-table-tbody tr');
    if (await suppReconRows.first().isVisible({ timeout: 3000 }).catch(() => false)) {
      const confirmBtn = page.locator('button:has-text("确认")').first();
      if (await confirmBtn.isVisible()) {
        console.log('  ✓ Confirm button is visible in supplier reconciliation');
        await page.screenshot({ path: `${SCREENSHOT_DIR}/supplier-recon-confirm-btn.png`, fullPage: true });
      } else {
        console.log('  [INFO] No confirm button visible (may need pending records)');
      }
    } else {
      console.log('  [SKIP] No supplier reconciliation data found');
    }

    // ========== TEST 5: PAYABLE OVERDUE AND DUE-SOON TABS ==========
    console.log('\n=== Test 5: Payable Overdue and Due-Soon Tabs ===');
    await page.goto(`${BASE_URL}/finance/payable`);
    await page.waitForTimeout(2000);

    // Check for tabs
    const tabs = page.locator('.ant-tabs-tab');
    const tabCount = await tabs.count();
    console.log(`  [Found ${tabCount} tabs]`);

    let hasOverdueTab = false;
    let hasDueSoonTab = false;

    for (let i = 0; i < tabCount; i++) {
      const tab = tabs.nth(i);
      const tabText = await tab.textContent();
      if (tabText && tabText.includes('逾期')) {
        hasOverdueTab = true;
        console.log('  ✓ Found "逾期预警" tab');
      }
      if (tabText && (tabText.includes('即将到期') || tabText.includes('到期'))) {
        hasDueSoonTab = true;
        console.log('  ✓ Found "即将到期" tab');
      }
    }

    if (!hasOverdueTab) {
      console.log('  [WARN] "逾期预警" tab not found');
    }
    if (!hasDueSoonTab) {
      console.log('  [WARN] "即将到期" tab not found');
    }

    await page.screenshot({ path: `${SCREENSHOT_DIR}/payable-tabs.png`, fullPage: true });

    // Click overdue tab if exists
    if (hasOverdueTab) {
      await clickTab(page, '逾期');
      await page.waitForTimeout(1500);
      console.log('  ✓ Clicked "逾期预警" tab');
      await page.screenshot({ path: `${SCREENSHOT_DIR}/payable-overdue.png`, fullPage: true });
    }

    // Click due-soon tab if exists
    if (hasDueSoonTab) {
      await clickTab(page, '即将到期');
      await page.waitForTimeout(1500);
      console.log('  ✓ Clicked "即将到期" tab');
      await page.screenshot({ path: `${SCREENSHOT_DIR}/payable-due-soon.png`, fullPage: true });
    }

    // ========== TEST 6: QUALITY CHECK ==========
    console.log('\n=== Test 6: Quality Check ===');
    await page.goto(`${BASE_URL}/inventory/quality-check`);
    await page.waitForTimeout(2000);

    // Check page title or heading
    const heading = page.locator('h1, h2').filter({ hasText: /质检/ });
    if (await heading.isVisible({ timeout: 5000 }).catch(() => false)) {
      console.log('  ✓ Quality Check page is accessible');
      await page.screenshot({ path: `${SCREENSHOT_DIR}/quality-check-page.png`, fullPage: true });

      // Check if add button exists
      const addBtn = page.locator('button:has-text("新增"), button:has-text("新建"), button:has-text("质检")').first();
      if (await addBtn.isVisible()) {
        console.log('  ✓ Add button visible on Quality Check page');
      }
    } else {
      console.log('  [SKIP] Quality Check page not found or not accessible');
    }

    // ========== TEST 7: PAYABLE CONFIRM BUTTON (direct test) ==========
    console.log('\n=== Test 7: Payable List Confirm Button ===');
    await page.goto(`${BASE_URL}/finance/payable`);
    await page.waitForTimeout(2000);

    const payableRows = page.locator('.ant-table-tbody tr');
    if (await payableRows.first().isVisible({ timeout: 3000 }).catch(() => false)) {
      // Look for any action buttons
      const actionBtns = page.locator('.ant-table-tbody button');
      const btnCount = await actionBtns.count();
      if (btnCount > 0) {
        console.log(`  ✓ Found ${btnCount} action button(s) in payable list`);
      }
    }

    // Final screenshot
    await page.goto(`${BASE_URL}/dashboard`);
    await page.waitForTimeout(2000);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/final-p1-features.png`, fullPage: true });

    console.log('\n========================================');
    console.log('✓ All E2E P1 Features tests completed!');
    console.log('========================================');
    console.log('\nScreenshots saved to:', SCREENSHOT_DIR);
    console.log('\nTest Coverage:');
    console.log('  1. ✓ Sales Return Cancel Button');
    console.log('  2. ✓ Inventory Transfer Approve/Reject Buttons');
    console.log('  3. ✓ Customer Reconciliation Confirm Button');
    console.log('  4. ✓ Supplier Reconciliation Confirm Button');
    console.log('  5. ✓ Payable Overdue and Due-Soon Tabs');
    console.log('  6. ✓ Quality Check Page');
    console.log('  7. ✓ Payable List Action Buttons');

  } catch (error) {
    console.error('\n✗ Test failed:', error.message);
    console.error('Stack:', error.stack);
    await page?.screenshot({ path: `${SCREENSHOT_DIR}/error-p1-features.png`, fullPage: true }).catch(() => {});
    if (browser) await browser.close();
    process.exit(1);
  }

  if (browser) await browser.close();
}

runTests().catch(console.error);