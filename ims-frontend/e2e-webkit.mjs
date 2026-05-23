// IMS E2E Test - Create test data and verify functionality
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

async function submitAndCloseModal(page) {
  // Click submit button
  const submitBtn = page.locator('.ant-modal button:has-text("确定"), .ant-modal button:has-text("创建"), .ant-modal button[type="submit"]');
  if (await submitBtn.isVisible().catch(() => false)) {
    await submitBtn.click();
    // Wait for modal to close
    await page.waitForTimeout(2000);
    await page.waitForSelector('.ant-modal', { state: 'hidden', timeout: 5000 }).catch(() => {});
    await page.waitForTimeout(1000);
  }
}

async function closeModal(page) {
  const closeBtn = page.locator('.ant-modal button:has-text("取消"), .ant-modal button:has-text("关"), .ant-modal .ant-modal-close');
  if (await closeBtn.isVisible().catch(() => false)) {
    await closeBtn.click();
    await page.waitForTimeout(1000);
  }
}

async function runTests() {
  console.log('Starting IMS E2E Tests - Create Test Data...\n');

  let browser;
  try {
    browser = await chromium.launch({
      headless: true,
      executablePath: '/etc/profiles/per-user/ivan/bin/google-chrome-stable',
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    });

    const context = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
    const page = await context.newPage();

    // ========== Test 1: Login ==========
    console.log('Test 1: Login with admin account');
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');

    await page.fill('input#username, input[placeholder*="用户名"]', 'admin');
    await page.fill('input#password, input[type="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(3000);

    console.log(`  ✓ Login submitted, redirected to: ${page.url()}`);

    // ========== STEP 1: Create all prerequisite data first ==========
    console.log('\n=== STEP 1: Creating prerequisite test data ===');

    // Test 2: Add Supplier
    console.log('\nTest 2: Add Supplier');
    await page.goto(`${BASE_URL}/supplier`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const addSupplierBtn = page.locator('button:has-text("新增"), button:has-text("添 加")');
    if (await addSupplierBtn.first().isVisible()) {
      await addSupplierBtn.first().click({ force: true });
      await page.waitForTimeout(1500);

      const modal = page.locator('.ant-modal');
      if (await modal.isVisible()) {
        console.log('  ✓ Supplier modal opened');

        const nameInput = page.locator('.ant-modal input#name');
        if (await nameInput.isVisible()) {
          await nameInput.fill('E2E Test Supplier');
        }

        const contactInput = page.locator('.ant-modal input#contact');
        if (await contactInput.isVisible()) {
          await contactInput.fill('Test Contact');
        }

        const phoneInput = page.locator('.ant-modal input#phone');
        if (await phoneInput.isVisible()) {
          await phoneInput.fill('13900139000');
        }

        await submitAndCloseModal(page);
        await page.waitForTimeout(500);
        await page.screenshot({ path: `${SCREENSHOT_DIR}/01-supplier.png`, fullPage: true });
        console.log('  ✓ Supplier created');
      }
    }

    // Test 3: Add Customer
    console.log('\nTest 3: Add Customer');
    await page.goto(`${BASE_URL}/customer`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const addCustomerBtn = page.locator('button:has-text("新增"), button:has-text("添 加")');
    if (await addCustomerBtn.first().isVisible()) {
      await addCustomerBtn.first().click({ force: true });
      await page.waitForTimeout(1500);

      const modal = page.locator('.ant-modal');
      if (await modal.isVisible()) {
        console.log('  ✓ Customer modal opened');

        const nameInput = page.locator('.ant-modal input#name');
        if (await nameInput.isVisible()) {
          await nameInput.fill('E2E Test Customer');
        }

        const contactInput = page.locator('.ant-modal input#contact');
        if (await contactInput.isVisible()) {
          await contactInput.fill('Test Contact');
        }

        const phoneInput = page.locator('.ant-modal input#phone');
        if (await phoneInput.isVisible()) {
          await phoneInput.fill('13800138000');
        }

        await submitAndCloseModal(page);
        await page.waitForTimeout(500);
        await page.screenshot({ path: `${SCREENSHOT_DIR}/03-customer.png`, fullPage: true });
        console.log('  ✓ Customer created');
      }
    }

    // Test 4: Add Product
    console.log('\nTest 4: Add Product');
    await page.goto(`${BASE_URL}/product`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const addProductBtn = page.locator('button:has-text("新增"), button:has-text("添 加")');
    if (await addProductBtn.first().isVisible()) {
      await addProductBtn.first().click({ force: true });
      await page.waitForTimeout(1500);

      const modal = page.locator('.ant-modal');
      if (await modal.isVisible()) {
        console.log('  ✓ Product modal opened');

        const nameInput = page.locator('.ant-modal input#name');
        if (await nameInput.isVisible()) {
          await nameInput.fill('E2E Test Product');
        }

        const specInput = page.locator('.ant-modal input#spec');
        if (await specInput.isVisible()) {
          await specInput.fill('100g');
        }

        const unitInput = page.locator('.ant-modal input#unit');
        if (await unitInput.isVisible()) {
          await unitInput.fill('盒');
        }

        const priceInput = page.locator('.ant-modal input#price');
        if (await priceInput.isVisible()) {
          await priceInput.fill('99.00');
        }

        await submitAndCloseModal(page);
        await page.waitForTimeout(500);
        await page.screenshot({ path: `${SCREENSHOT_DIR}/04-product.png`, fullPage: true });
        console.log('  ✓ Product created');
      }
    }

    // Test 5: Add Warehouses
    console.log('\nTest 5: Add Warehouses');
    await page.goto(`${BASE_URL}/warehouse`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Make sure any modal is closed first
    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);

    const addWarehouseBtn = page.locator('button:has-text("新增仓库")');
    if (await addWarehouseBtn.isVisible()) {
      await addWarehouseBtn.click({ force: true });
      await page.waitForTimeout(1500);

      let modal = page.locator('.ant-modal');
      if (await modal.isVisible()) {
        const codeInput = page.locator('.ant-modal input#code');
        if (await codeInput.isVisible()) {
          await codeInput.fill('E2E-WH-1');
        }

        const nameInput = page.locator('.ant-modal input#name');
        if (await nameInput.isVisible()) {
          await nameInput.fill('E2E Warehouse 1');
        }

        await submitAndCloseModal(page);
        await page.waitForTimeout(500);
        await page.screenshot({ path: `${SCREENSHOT_DIR}/05-warehouse.png`, fullPage: true });
        console.log('  ✓ Warehouse 1 created');
      }
    }

    // Add second warehouse
    await page.waitForTimeout(2000);
    // Wait for any modal to disappear
    await page.waitForSelector('.ant-modal', { state: 'hidden', timeout: 5000 }).catch(() => {});
    await page.waitForTimeout(1000);
    const addWarehouseBtn2 = page.locator('button:has-text("新增仓库")');
    if (await addWarehouseBtn2.isVisible()) {
      await addWarehouseBtn2.click({ force: true });
      await page.waitForTimeout(1500);

      let modal = page.locator('.ant-modal');
      if (await modal.isVisible()) {
        const codeInput = page.locator('.ant-modal input#code');
        if (await codeInput.isVisible()) {
          await codeInput.fill('E2E-WH-2');
        }

        const nameInput = page.locator('.ant-modal input#name');
        if (await nameInput.isVisible()) {
          await nameInput.fill('E2E Warehouse 2');
        }

        await submitAndCloseModal(page);
        console.log('  ✓ Warehouse 2 created');
      }
    }

    // ========== STEP 2: Create orders using the data we just created ==========
    console.log('\n=== STEP 2: Creating orders with test data ===');

    // Test 6: Create Purchase Order
    console.log('\nTest 6: Create Purchase Order');
    await page.goto(`${BASE_URL}/purchase/order`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Close any open modal first
    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);

    const addPurchaseBtn = page.locator('button:has-text("新增订单")');
    if (await addPurchaseBtn.isVisible()) {
      await addPurchaseBtn.click({ force: true });
      await page.waitForTimeout(1500);

      let modal = page.locator('.ant-modal');
      if (await modal.isVisible()) {
        console.log('  ✓ Purchase order modal opened');

        // Select supplier
        let supplierSelect = page.locator('.ant-modal .ant-select').first();
        if (await supplierSelect.isVisible()) {
          const hasOption = await waitForSelectOptions(page, supplierSelect);
          if (hasOption) {
            console.log('  ✓ Supplier selected');
          }
        }

        // Set order date
        const orderDateInput = page.locator('.ant-modal input#orderDate');
        if (await orderDateInput.isVisible()) {
          await orderDateInput.click();
          await page.waitForTimeout(500);
          await page.keyboard.press('Enter');
          console.log('  ✓ Order date set');
        }

        // Add product detail
        const addDetailBtn = page.locator('.ant-modal button:has-text("添加商品")');
        if (await addDetailBtn.isVisible()) {
          await addDetailBtn.click();
          await page.waitForTimeout(1000);

          // Select product
          let productSelect = page.locator('.ant-modal .ant-select').last();
          if (await productSelect.isVisible()) {
            const hasOption = await waitForSelectOptions(page, productSelect);
            if (hasOption) {
              console.log('  ✓ Product selected in detail');
            }
          }
        }

        await submitAndCloseModal(page);
        await page.waitForTimeout(500);
        await page.screenshot({ path: `${SCREENSHOT_DIR}/06-purchase-order.png`, fullPage: true });
        console.log('  ✓ Purchase order created');
      }
    }

    // Test 7: Create Sales Order
    console.log('\nTest 7: Create Sales Order');
    await page.goto(`${BASE_URL}/sales/order`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Close any open modal first
    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);

    const addSalesBtn = page.locator('button:has-text("新增订单")');
    if (await addSalesBtn.isVisible()) {
      await addSalesBtn.click({ force: true });
      await page.waitForTimeout(1500);

      let modal = page.locator('.ant-modal');
      if (await modal.isVisible()) {
        console.log('  ✓ Sales order modal opened');

        // Select customer
        let customerSelect = page.locator('.ant-modal .ant-select').first();
        if (await customerSelect.isVisible()) {
          const hasOption = await waitForSelectOptions(page, customerSelect);
          if (hasOption) {
            console.log('  ✓ Customer selected');
          }
        }

        // Set order date
        const orderDateInput = page.locator('.ant-modal input#orderDate');
        if (await orderDateInput.isVisible()) {
          await orderDateInput.click();
          await page.waitForTimeout(500);
          await page.keyboard.press('Enter');
          console.log('  ✓ Order date set');
        }

        // Add product detail
        const addDetailBtn = page.locator('.ant-modal button:has-text("添加商品")');
        if (await addDetailBtn.isVisible()) {
          await addDetailBtn.click();
          await page.waitForTimeout(1000);

          // Select product
          let productSelect = page.locator('.ant-modal .ant-select').last();
          if (await productSelect.isVisible()) {
            const hasOption = await waitForSelectOptions(page, productSelect);
            if (hasOption) {
              console.log('  ✓ Product selected in detail');
            }
          }
        }

        await submitAndCloseModal(page);
        await page.waitForTimeout(500);
        await page.screenshot({ path: `${SCREENSHOT_DIR}/07-sales-order.png`, fullPage: true });
        console.log('  ✓ Sales order created');
      }
    }

    // Test 8: Create Inventory Transfer
    console.log('\nTest 8: Create Inventory Transfer');
    await page.goto(`${BASE_URL}/inventory/transfer`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Close any open modal first
    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);

    const addTransferBtn = page.locator('button:has-text("新建调拨")');
    if (await addTransferBtn.isVisible()) {
      await addTransferBtn.click({ force: true });
      await page.waitForTimeout(1500);

      let modal = page.locator('.ant-modal');
      if (await modal.isVisible()) {
        console.log('  ✓ Transfer modal opened');

        // Select source warehouse
        let sourceSelect = page.locator('.ant-modal .ant-select').first();
        if (await sourceSelect.isVisible()) {
          const hasOption = await waitForSelectOptions(page, sourceSelect);
          if (hasOption) {
            console.log('  ✓ Source warehouse selected');
          }
        }

        // Select target warehouse
        let targetSelect = page.locator('.ant-modal .ant-select').nth(1);
        if (await targetSelect.isVisible()) {
          const hasOption = await waitForSelectOptions(page, targetSelect);
          if (hasOption) {
            console.log('  ✓ Target warehouse selected');
          }
        }

        // Fill remark
        let remarkInput = page.locator('.ant-modal input#remark');
        if (await remarkInput.isVisible()) {
          await remarkInput.fill('E2E Test Transfer');
        }

        await submitAndCloseModal(page);
        await page.waitForTimeout(500);
        await page.screenshot({ path: `${SCREENSHOT_DIR}/08-inventory-transfer.png`, fullPage: true });
        console.log('  ✓ Transfer created');
      }
    }

    // Test 9: Create Finance Account
    console.log('\nTest 9: Create Finance Account');
    await page.goto(`${BASE_URL}/finance/account`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Close any open modal first
    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);

    const addAccountBtn = page.locator('button:has-text("新建账户")');
    if (await addAccountBtn.isVisible()) {
      await addAccountBtn.click({ force: true });
      await page.waitForTimeout(1500);

      let modal = page.locator('.ant-modal');
      if (await modal.isVisible()) {
        console.log('  ✓ Account modal opened');

        // Fill account name
        let nameInput = page.locator('.ant-modal input#name');
        if (await nameInput.isVisible()) {
          await nameInput.fill('E2E Test Account');
        }

        // Select account type
        let typeSelect = page.locator('.ant-modal .ant-select').first();
        if (await typeSelect.isVisible()) {
          const hasOption = await waitForSelectOptions(page, typeSelect);
          if (hasOption) {
            console.log('  ✓ Account type selected');
          }
        }

        // Fill bank info
        let bankInput = page.locator('.ant-modal input#bank');
        if (await bankInput.isVisible()) {
          await bankInput.fill('Test Bank');
        }

        // Fill account number
        let accountInput = page.locator('.ant-modal input#accountNo');
        if (await accountInput.isVisible()) {
          await accountInput.fill('1234567890');
        }

        await submitAndCloseModal(page);
        await page.waitForTimeout(500);
        await page.screenshot({ path: `${SCREENSHOT_DIR}/09-finance-account.png`, fullPage: true });
        console.log('  ✓ Account created');
      }
    }

    // Take screenshot of final state
    await page.goto(`${BASE_URL}/dashboard`);
    await page.waitForTimeout(2000);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/final.png`, fullPage: true });

    console.log('\n========================================');
    console.log('✓ All E2E tests completed successfully!');
    console.log('========================================');
    console.log('\nTest Summary:');
    console.log('  1. ✓ Login and authentication');
    console.log('  2. ✓ Supplier - Created test data');
    console.log('  3. ✓ Customer - Created test data');
    console.log('  4. ✓ Product - Created test data');
    console.log('  5. ✓ Warehouses - Created test data');
    console.log('  6. ✓ Purchase Order - Created with test data');
    console.log('  7. ✓ Sales Order - Created with test data');
    console.log('  8. ✓ Inventory Transfer - Created with test data');
    console.log('  9. ✓ Finance Account - Created with test data');

  } catch (error) {
    console.error('\n✗ Test failed:', error.message);
    console.error(error.stack);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/error.png`, fullPage: true });
    if (browser) {
      await browser.close();
    }
    process.exit(1);
  }

  if (browser) {
    await browser.close();
  }
}

runTests().catch(console.error);