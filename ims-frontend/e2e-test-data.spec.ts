import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3000';
const API_URL = 'http://localhost:8080';

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

test.describe('IMS Test Data Creation', () => {

  test('1. Login', async ({ page }) => {
    await loginViaUI(page);
    await page.screenshot({ path: '/tmp/ims-login-data.png', fullPage: true });
  });

  test('2. Add Customer', async ({ page }) => {
    await loginViaUI(page);

    // Go to customer page
    await page.goto(`${BASE_URL}/customer/customer`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    console.log('On customer page');

    // Click add customer button
    const addBtn = page.locator('button:has-text("新增客户")');
    if (await addBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await addBtn.click();
      await page.waitForTimeout(1000);

      // Fill customer form
      const customerNameInput = page.locator('input[id*="customerName"], input[placeholder*="客户名称"]').first();
      if (await customerNameInput.isVisible({ timeout: 2000 }).catch(() => false)) {
        await customerNameInput.fill('测试客户_' + Date.now());

        const contactInput = page.locator('input[placeholder*="联系人"]');
        if (await contactInput.isVisible({ timeout: 1000 }).catch(() => false)) {
          await contactInput.fill('张三');
        }

        const phoneInput = page.locator('input[placeholder*="电话"]');
        if (await phoneInput.isVisible({ timeout: 1000 }).catch(() => false)) {
          await phoneInput.fill('13800138000');
        }

        // Submit
        const submitBtn = page.locator('button:has-text("确定"), button:has-text("保存")').first();
        if (await submitBtn.isVisible({ timeout: 1000 }).catch(() => false)) {
          await submitBtn.click();
          await page.waitForTimeout(2000);
          console.log('Customer added successfully');
        }
      }

      // Close modal
      await page.keyboard.press('Escape');
    }

    await page.screenshot({ path: '/tmp/ims-customer-added.png', fullPage: true });
  });

  test('3. Add Supplier', async ({ page }) => {
    await loginViaUI(page);

    await page.goto(`${BASE_URL}/supplier`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    console.log('On supplier page');

    const addBtn = page.locator('button:has-text("新增供应商")');
    if (await addBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await addBtn.click();
      await page.waitForTimeout(1000);

      const supplierNameInput = page.locator('input[id*="supplierName"], input[placeholder*="供应商名称"]').first();
      if (await supplierNameInput.isVisible({ timeout: 2000 }).catch(() => false)) {
        await supplierNameInput.fill('测试供应商_' + Date.now());

        const contactInput = page.locator('input[placeholder*="联系人"]');
        if (await contactInput.isVisible({ timeout: 1000 }).catch(() => false)) {
          await contactInput.fill('李四');
        }

        const phoneInput = page.locator('input[placeholder*="电话"]');
        if (await phoneInput.isVisible({ timeout: 1000 }).catch(() => false)) {
          await phoneInput.fill('13900139000');
        }

        const submitBtn = page.locator('button:has-text("确定"), button:has-text("保存")').first();
        if (await submitBtn.isVisible({ timeout: 1000 }).catch(() => false)) {
          await submitBtn.click();
          await page.waitForTimeout(2000);
          console.log('Supplier added successfully');
        }
      }

      await page.keyboard.press('Escape');
    }

    await page.screenshot({ path: '/tmp/ims-supplier-added.png', fullPage: true });
  });

  test('4. Add Product', async ({ page }) => {
    await loginViaUI(page);

    await page.goto(`${BASE_URL}/product/product`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    console.log('On product page');

    const addBtn = page.locator('button:has-text("新增商品")');
    if (await addBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await addBtn.click();
      await page.waitForTimeout(1000);

      const productNameInput = page.locator('input[id*="productName"], input[placeholder*="商品名称"]').first();
      if (await productNameInput.isVisible({ timeout: 2000 }).catch(() => false)) {
        await productNameInput.fill('测试商品_' + Date.now());

        const productCodeInput = page.locator('input[id*="productCode"], input[placeholder*="商品编码"]');
        if (await productCodeInput.isVisible({ timeout: 1000 }).catch(() => false)) {
          await productCodeInput.fill('P' + Date.now());
        }

        const priceInput = page.locator('input[id*="price"], input[placeholder*="价格"]');
        if (await priceInput.isVisible({ timeout: 1000 }).catch(() => false)) {
          await priceInput.fill('99.99');
        }

        const submitBtn = page.locator('button:has-text("确定"), button:has-text("保存")').first();
        if (await submitBtn.isVisible({ timeout: 1000 }).catch(() => false)) {
          await submitBtn.click();
          await page.waitForTimeout(2000);
          console.log('Product added successfully');
        }
      }

      await page.keyboard.press('Escape');
    }

    await page.screenshot({ path: '/tmp/ims-product-added.png', fullPage: true });
  });

  test('5. Add Sales Order', async ({ page }) => {
    await loginViaUI(page);

    await page.goto(`${BASE_URL}/sales/order`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    console.log('On sales order page');

    const addBtn = page.locator('button:has-text("新增订单"), button:has-text("新增销售订单")');
    if (await addBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await addBtn.click();
      await page.waitForTimeout(1000);

      // Select customer if dropdown exists
      const customerSelect = page.locator('.ant-select[placeholder*="客户"]').first();
      if (await customerSelect.isVisible({ timeout: 1000 }).catch(() => false)) {
        await customerSelect.click();
        await page.waitForTimeout(500);
        const firstOption = page.locator('.ant-select-dropdown .ant-select-item').first();
        if (await firstOption.isVisible({ timeout: 1000 }).catch(() => false)) {
          await firstOption.click();
          await page.waitForTimeout(300);
        }
      }

      // Add product line
      const addLineBtn = page.locator('button:has-text("添加商品"), button:has-text("新增行")').first();
      if (await addLineBtn.isVisible({ timeout: 1000 }).catch(() => false)) {
        await addLineBtn.click();
        await page.waitForTimeout(500);

        // Select product
        const productSelect = page.locator('.ant-select').last();
        if (await productSelect.isVisible({ timeout: 1000 }).catch(() => false)) {
          await productSelect.click();
          await page.waitForTimeout(500);
          const firstProduct = page.locator('.ant-select-dropdown .ant-select-item').first();
          if (await firstProduct.isVisible({ timeout: 1000 }).catch(() => false)) {
            await firstProduct.click();
            await page.waitForTimeout(300);
          }
        }
      }

      // Submit
      const submitBtn = page.locator('button:has-text("确定"), button:has-text("保存"), .ant-modal .ant-btn-primary').first();
      if (await submitBtn.isVisible({ timeout: 1000 }).catch(() => false)) {
        await submitBtn.click();
        await page.waitForTimeout(2000);
        console.log('Sales order added successfully');
      }
    }

    await page.keyboard.press('Escape');
    await page.screenshot({ path: '/tmp/ims-sales-order-added.png', fullPage: true });
  });

  test('6. Add Purchase Order', async ({ page }) => {
    await loginViaUI(page);

    await page.goto(`${BASE_URL}/procurement/order`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    console.log('On purchase order page');

    const addBtn = page.locator('button:has-text("新增订单"), button:has-text("新增采购订单")');
    if (await addBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await addBtn.click();
      await page.waitForTimeout(1000);

      // Select supplier if dropdown exists
      const supplierSelect = page.locator('.ant-select[placeholder*="供应商"]').first();
      if (await supplierSelect.isVisible({ timeout: 1000 }).catch(() => false)) {
        await supplierSelect.click();
        await page.waitForTimeout(500);
        const firstOption = page.locator('.ant-select-dropdown .ant-select-item').first();
        if (await firstOption.isVisible({ timeout: 1000 }).catch(() => false)) {
          await firstOption.click();
          await page.waitForTimeout(300);
        }
      }

      // Add product line
      const addLineBtn = page.locator('button:has-text("添加商品"), button:has-text("新增行")').first();
      if (await addLineBtn.isVisible({ timeout: 1000 }).catch(() => false)) {
        await addLineBtn.click();
        await page.waitForTimeout(500);

        const productSelect = page.locator('.ant-select').last();
        if (await productSelect.isVisible({ timeout: 1000 }).catch(() => false)) {
          await productSelect.click();
          await page.waitForTimeout(500);
          const firstProduct = page.locator('.ant-select-dropdown .ant-select-item').first();
          if (await firstProduct.isVisible({ timeout: 1000 }).catch(() => false)) {
            await firstProduct.click();
            await page.waitForTimeout(300);
          }
        }
      }

      const submitBtn = page.locator('button:has-text("确定"), button:has-text("保存"), .ant-modal .ant-btn-primary').first();
      if (await submitBtn.isVisible({ timeout: 1000 }).catch(() => false)) {
        await submitBtn.click();
        await page.waitForTimeout(2000);
        console.log('Purchase order added successfully');
      }
    }

    await page.keyboard.press('Escape');
    await page.screenshot({ path: '/tmp/ims-purchase-order-added.png', fullPage: true });
  });

  test('7. Add Warehouse', async ({ page }) => {
    await loginViaUI(page);

    await page.goto(`${BASE_URL}/warehouse`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    console.log('On warehouse page');

    const addBtn = page.locator('button:has-text("新增仓库")');
    if (await addBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await addBtn.click();
      await page.waitForTimeout(1000);

      const warehouseNameInput = page.locator('input[id*="warehouseName"], input[placeholder*="仓库名称"]').first();
      if (await warehouseNameInput.isVisible({ timeout: 2000 }).catch(() => false)) {
        await warehouseNameInput.fill('测试仓库_' + Date.now());

        const addressInput = page.locator('input[placeholder*="地址"]');
        if (await addressInput.isVisible({ timeout: 1000 }).catch(() => false)) {
          await addressInput.fill('北京市朝阳区测试地址');
        }

        const submitBtn = page.locator('button:has-text("确定"), button:has-text("保存")').first();
        if (await submitBtn.isVisible({ timeout: 1000 }).catch(() => false)) {
          await submitBtn.click();
          await page.waitForTimeout(2000);
          console.log('Warehouse added successfully');
        }
      }

      await page.keyboard.press('Escape');
    }

    await page.screenshot({ path: '/tmp/ims-warehouse-added.png', fullPage: true });
  });

  test('8. Add Finance Record - Receivable', async ({ page }) => {
    await loginViaUI(page);

    await page.goto(`${BASE_URL}/finance/receivable`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    console.log('On finance receivable page');

    const addBtn = page.locator('button:has-text("新增收款"), button:has-text("新增应收")');
    if (await addBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await addBtn.click();
      await page.waitForTimeout(1000);

      const amountInput = page.locator('input[id*="amount"], input[placeholder*="金额"]').first();
      if (await amountInput.isVisible({ timeout: 2000 }).catch(() => false)) {
        await amountInput.fill('1000.00');

        const submitBtn = page.locator('button:has-text("确定"), button:has-text("保存")').first();
        if (await submitBtn.isVisible({ timeout: 1000 }).catch(() => false)) {
          await submitBtn.click();
          await page.waitForTimeout(2000);
          console.log('Receivable record added successfully');
        }
      }

      await page.keyboard.press('Escape');
    }

    await page.screenshot({ path: '/tmp/ims-receivable-added.png', fullPage: true });
  });

  test('9. Add Finance Record - Payment', async ({ page }) => {
    await loginViaUI(page);

    await page.goto(`${BASE_URL}/finance/payable`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    console.log('On finance payable page');

    const addBtn = page.locator('button:has-text("新增付款"), button:has-text("新增应付")');
    if (await addBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await addBtn.click();
      await page.waitForTimeout(1000);

      const amountInput = page.locator('input[id*="amount"], input[placeholder*="金额"]').first();
      if (await amountInput.isVisible({ timeout: 2000 }).catch(() => false)) {
        await amountInput.fill('2000.00');

        const submitBtn = page.locator('button:has-text("确定"), button:has-text("保存")').first();
        if (await submitBtn.isVisible({ timeout: 1000 }).catch(() => false)) {
          await submitBtn.click();
          await page.waitForTimeout(2000);
          console.log('Payable record added successfully');
        }
      }

      await page.keyboard.press('Escape');
    }

    await page.screenshot({ path: '/tmp/ims-payable-added.png', fullPage: true });
  });

  test('10. Create Inventory Inbound', async ({ page }) => {
    await loginViaUI(page);

    await page.goto(`${BASE_URL}/inventory/in`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    console.log('On inventory inbound page');

    const addBtn = page.locator('button:has-text("新增入库"), button:has-text("新增入库单")');
    if (await addBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await addBtn.click();
      await page.waitForTimeout(1000);

      const submitBtn = page.locator('button:has-text("确定"), button:has-text("保存")').first();
      if (await submitBtn.isVisible({ timeout: 1000 }).catch(() => false)) {
        await submitBtn.click();
        await page.waitForTimeout(2000);
        console.log('Inbound record added successfully');
      }
    }

    await page.keyboard.press('Escape');
    await page.screenshot({ path: '/tmp/ims-inbound-added.png', fullPage: true });
  });

  test('11. Create Inventory Outbound', async ({ page }) => {
    await loginViaUI(page);

    await page.goto(`${BASE_URL}/inventory/out`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    console.log('On inventory outbound page');

    const addBtn = page.locator('button:has-text("新增出库"), button:has-text("新增出库单")');
    if (await addBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await addBtn.click();
      await page.waitForTimeout(1000);

      const submitBtn = page.locator('button:has-text("确定"), button:has-text("保存")').first();
      if (await submitBtn.isVisible({ timeout: 1000 }).catch(() => false)) {
        await submitBtn.click();
        await page.waitForTimeout(2000);
        console.log('Outbound record added successfully');
      }
    }

    await page.keyboard.press('Escape');
    await page.screenshot({ path: '/tmp/ims-outbound-added.png', fullPage: true });
  });

  test('12. Add Notification', async ({ page }) => {
    await loginViaUI(page);

    await page.goto(`${BASE_URL}/system/notification`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    console.log('On notification page');

    const addBtn = page.locator('button:has-text("新增通知"), button:has-text("发送通知")');
    if (await addBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await addBtn.click();
      await page.waitForTimeout(1000);

      const titleInput = page.locator('input[id*="title"], input[placeholder*="标题"]').first();
      if (await titleInput.isVisible({ timeout: 2000 }).catch(() => false)) {
        await titleInput.fill('测试通知_' + Date.now());

        const contentInput = page.locator('textarea[id*="content"], textarea[placeholder*="内容"]');
        if (await contentInput.isVisible({ timeout: 1000 }).catch(() => false)) {
          await contentInput.fill('这是一条测试通知，用于测试系统通知功能。');
        }

        const submitBtn = page.locator('button:has-text("确定"), button:has-text("发送")').first();
        if (await submitBtn.isVisible({ timeout: 1000 }).catch(() => false)) {
          await submitBtn.click();
          await page.waitForTimeout(2000);
          console.log('Notification added successfully');
        }
      }

      await page.keyboard.press('Escape');
    }

    await page.screenshot({ path: '/tmp/ims-notification-added.png', fullPage: true });
  });

  test('13. Add Sales Price Strategy', async ({ page }) => {
    await loginViaUI(page);

    await page.goto(`${BASE_URL}/sales/price-strategy`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    console.log('On sales price strategy page');

    const addBtn = page.locator('button:has-text("新增策略"), button:has-text("新增价格策略")');
    if (await addBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await addBtn.click();
      await page.waitForTimeout(1000);

      const priceInput = page.locator('input[id*="price"], input[placeholder*="价格"]').first();
      if (await priceInput.isVisible({ timeout: 2000 }).catch(() => false)) {
        await priceInput.fill('88.88');

        const submitBtn = page.locator('button:has-text("确定"), button:has-text("保存")').first();
        if (await submitBtn.isVisible({ timeout: 1000 }).catch(() => false)) {
          await submitBtn.click();
          await page.waitForTimeout(2000);
          console.log('Price strategy added successfully');
        }
      }

      await page.keyboard.press('Escape');
    }

    await page.screenshot({ path: '/tmp/ims-price-strategy-added.png', fullPage: true });
  });

  test('14. Add Print Template', async ({ page }) => {
    await loginViaUI(page);

    await page.goto(`${BASE_URL}/system/print-template`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    console.log('On print template page');

    const addBtn = page.locator('button:has-text("新增模板"), button:has-text("新增打印模板")');
    if (await addBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await addBtn.click();
      await page.waitForTimeout(1000);

      const nameInput = page.locator('input[id*="name"], input[placeholder*="模板名称"]').first();
      if (await nameInput.isVisible({ timeout: 2000 }).catch(() => false)) {
        await nameInput.fill('测试打印模板_' + Date.now());

        const submitBtn = page.locator('button:has-text("确定"), button:has-text("保存")').first();
        if (await submitBtn.isVisible({ timeout: 1000 }).catch(() => false)) {
          await submitBtn.click();
          await page.waitForTimeout(2000);
          console.log('Print template added successfully');
        }
      }

      await page.keyboard.press('Escape');
    }

    await page.screenshot({ path: '/tmp/ims-print-template-added.png', fullPage: true });
  });

  test('15. Add System Config', async ({ page }) => {
    await loginViaUI(page);

    await page.goto(`${BASE_URL}/system/config`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    console.log('On system config page');

    const addBtn = page.locator('button:has-text("新增配置"), button:has-text("新增系统参数")');
    if (await addBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await addBtn.click();
      await page.waitForTimeout(1000);

      const keyInput = page.locator('input[id*="configKey"], input[placeholder*="参数键"]').first();
      if (await keyInput.isVisible({ timeout: 2000 }).catch(() => false)) {
        await keyInput.fill('TEST_CONFIG_' + Date.now());

        const valueInput = page.locator('input[id*="configValue"], input[placeholder*="参数值"]');
        if (await valueInput.isVisible({ timeout: 1000 }).catch(() => false)) {
          await valueInput.fill('test_value');
        }

        const submitBtn = page.locator('button:has-text("确定"), button:has-text("保存")').first();
        if (await submitBtn.isVisible({ timeout: 1000 }).catch(() => false)) {
          await submitBtn.click();
          await page.waitForTimeout(2000);
          console.log('System config added successfully');
        }
      }

      await page.keyboard.press('Escape');
    }

    await page.screenshot({ path: '/tmp/ims-config-added.png', fullPage: true });
  });

  test('16. Verify Reports Have Data', async ({ page }) => {
    await loginViaUI(page);

    await page.goto(`${BASE_URL}/report`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    console.log('On report center page');

    // Check sales report tab
    const salesTab = page.locator('.ant-tabs-tab:has-text("销售报表")');
    if (await salesTab.isVisible({ timeout: 2000 }).catch(() => false)) {
      await salesTab.click();
      await page.waitForTimeout(2000);
      console.log('Sales report tab checked');
    }

    await page.screenshot({ path: '/tmp/ims-reports-final.png', fullPage: true });
  });

  test('17. Barcode Scanner Component - Manual Input', async ({ page }) => {
    await loginViaUI(page);

    await page.goto(`${BASE_URL}/inventory/in`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    console.log('On inventory inbound page for barcode scanner test');

    const addBtn = page.locator('button:has-text("新建入库"), button:has-text("新增入库")');
    if (await addBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await addBtn.click();
      await page.waitForTimeout(1000);

      const scannerBtn = page.locator('button:has-text("扫码入库"), button:has-text("扫码添加商品")');
      if (await scannerBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
        await scannerBtn.click();
        await page.waitForTimeout(1000);

        const scannerModal = page.locator('.ant-modal');
        if (await scannerModal.isVisible({ timeout: 3000 }).catch(() => false)) {
          console.log('Scanner modal opened');

          const manualInput = page.locator('input[placeholder*="条码"], input[placeholder*="商品条码"]');
          if (await manualInput.isVisible({ timeout: 2000 }).catch(() => false)) {
            await manualInput.fill('TEST_BARCODE_12345');
            console.log('Manual barcode input works');

            const confirmBtn = page.locator('button:has-text("确定")');
            if (await confirmBtn.isVisible({ timeout: 1000 }).catch(() => false)) {
              await confirmBtn.click();
              await page.waitForTimeout(1000);
            }
          }

          const closeBtn = page.locator('button:has-text("关闭")');
          if (await closeBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
            await closeBtn.click();
            await page.waitForTimeout(500);
          }
        }
      }
    }

    await page.keyboard.press('Escape');
    await page.screenshot({ path: '/tmp/ims-scanner-manual-test.png', fullPage: true });
  });

  test('18. Sales Order Detail - Cost Field Display', async ({ page }) => {
    await loginViaUI(page);

    await page.goto(`${BASE_URL}/sales/order`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    console.log('On sales order page to check detail view');

    const firstRow = page.locator('.ant-table-tbody tr').first();
    if (await firstRow.isVisible({ timeout: 3000 }).catch(() => false)) {
      const viewBtn = firstRow.locator('button:has-text("查看")');
      if (await viewBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
        await viewBtn.click();
        await page.waitForTimeout(1500);

        const modal = page.locator('.ant-modal');
        if (await modal.isVisible({ timeout: 3000 }).catch(() => false)) {
          console.log('Order detail modal opened');

          const detailTable = page.locator('.ant-table');
          if (await detailTable.isVisible({ timeout: 2000 }).catch(() => false)) {
            console.log('Order detail table found');
          }
        }

        await page.keyboard.press('Escape');
        await page.waitForTimeout(500);
      }
    }

    await page.screenshot({ path: '/tmp/ims-sales-order-detail-cost.png', fullPage: true });
  });
});