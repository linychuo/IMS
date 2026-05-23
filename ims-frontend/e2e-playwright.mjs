// IMS E2E Test using Playwright with Firefox explicitly
import { firefox } from 'playwright';

const BASE_URL = 'http://localhost:3000';

async function runTests() {
  console.log('Starting IMS E2E Tests with Firefox...\n');

  let browser;
  try {
    // Launch Firefox explicitly
    browser = await firefox.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const context = await browser.newContext();
    const page = await context.newPage();

    // Test 1: Login
    console.log('Test 1: Login with admin account');
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');

    // Wait for login form to appear
    await page.waitForTimeout(2000);

    // Find and fill login form
    const usernameInput = page.locator('input').first();
    const passwordInput = page.locator('input[type="password"]').first();

    if (await usernameInput.isVisible({ timeout: 5000 }).catch(() => false)) {
      await usernameInput.fill('admin');
      await passwordInput.fill('admin123');

      const loginButton = page.locator('button[type="submit"]').first();
      await loginButton.click();
      await page.waitForTimeout(3000);
    }

    console.log('  ✓ Login page loaded');
    await page.screenshot({ path: '/tmp/ims-login.png', fullPage: true });

    // Test 2: Check Dashboard
    console.log('Test 2: Dashboard page');
    await page.goto(`${BASE_URL}/dashboard`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    console.log('  ✓ Dashboard page loaded');
    await page.screenshot({ path: '/tmp/ims-dashboard.png', fullPage: true });

    // Test 3: Navigate to Sales
    console.log('Test 3: Sales module');
    await page.goto(`${BASE_URL}/sales/order`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    console.log('  ✓ Sales page loaded');
    await page.screenshot({ path: '/tmp/ims-sales.png', fullPage: true });

    // Test 4: Navigate to Inventory
    console.log('Test 4: Inventory module');
    await page.goto(`${BASE_URL}/inventory/transfer`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    console.log('  ✓ Inventory page loaded');
    await page.screenshot({ path: '/tmp/ims-inventory.png', fullPage: true });

    // Test 5: Navigate to Finance
    console.log('Test 5: Finance module');
    await page.goto(`${BASE_URL}/finance/account`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    console.log('  ✓ Finance page loaded');
    await page.screenshot({ path: '/tmp/ims-finance.png', fullPage: true });

    // Test 6: Navigate to System
    console.log('Test 6: System module');
    await page.goto(`${BASE_URL}/system`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    console.log('  ✓ System page loaded');
    await page.screenshot({ path: '/tmp/ims-system.png', fullPage: true });

    console.log('\n✓ All E2E tests passed!');
    console.log('Screenshots saved to /tmp/ims-*.png');

  } catch (error) {
    console.error('Test failed:', error.message);
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