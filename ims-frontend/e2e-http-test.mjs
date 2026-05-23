// IMS HTTP-based E2E Test (No browser required)
// Tests the actual HTTP endpoints and verifies HTML responses

const API_URL = 'http://localhost:8080';
const FRONTEND_URL = 'http://localhost:3000';

async function httpGet(url, headers = {}) {
  try {
    const resp = await fetch(url, { headers, method: 'GET' });
    const text = await resp.text();
    return { status: resp.status, ok: resp.ok, text: text.substring(0, 500) };
  } catch (e) {
    return { status: 0, ok: false, text: '', error: e.message };
  }
}

async function runTests() {
  console.log('\n╔══════════════════════════════════════════════════════════════════╗');
  console.log('║         IMS HTTP-based E2E Test (Browser-free)                   ║');
  console.log('╚══════════════════════════════════════════════════════════════════╝\n');

  let token = '';
  let passed = 0;
  let failed = 0;

  // Test 1: Frontend
  console.log('┌──────────────────────────────────────────────────────────────────┐');
  console.log('│ 1. Frontend (http://localhost:3000)                              │');
  console.log('└──────────────────────────────────────────────────────────────────┘');
  const frontend = await httpGet(FRONTEND_URL);
  if (frontend.ok && frontend.text.includes('ims-frontend')) {
    console.log('  ✓ Frontend is serving React app');
    passed++;
  } else {
    console.log('  ✗ Frontend not responding correctly');
    failed++;
  }

  // Test 2: Login API
  console.log('\n┌──────────────────────────────────────────────────────────────────┐');
  console.log('│ 2. Login API (POST /auth/login)                                  │');
  console.log('└──────────────────────────────────────────────────────────────────┘');
  const loginResp = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'admin', password: 'admin123' })
  });
  const loginData = await loginResp.json();
  if (loginData.success && loginData.data.token) {
    token = loginData.data.token;
    console.log('  ✓ Login successful');
    console.log(`    User: ${loginData.data.username}, Role: ${loginData.data.realName}`);
    passed++;
  } else {
    console.log('  ✗ Login failed:', loginData.message);
    failed++;
  }

  const headers = { 'Authorization': `Bearer ${token}` };

  // Test 3: Menu is returned in login response, not a separate API
  // This is by design - menus are included in the login response
  console.log('\n┌──────────────────────────────────────────────────────────────────┐');
  console.log('│ 3. Login Response (includes menus)                                │');
  console.log('└──────────────────────────────────────────────────────────────────┘');
  if (loginData.data.menus && loginData.data.menus.length > 0) {
    console.log('  ✓ Login response contains menus');
    console.log(`    Menu count: ${loginData.data.menus.length} top-level menus`);
    passed++;
  } else {
    console.log('  ✗ Login response missing menus');
    failed++;
  }

  // Test 4: System APIs
  console.log('\n┌──────────────────────────────────────────────────────────────────┐');
  console.log('│ 4. System APIs                                                   │');
  console.log('└──────────────────────────────────────────────────────────────────┘');
  const userResp = await httpGet(`${API_URL}/user/list`, headers);
  if (userResp.ok && userResp.text.includes('username')) {
    console.log('  ✓ User list API works');
    passed++;
  } else {
    console.log('  ✗ User list API failed');
    failed++;
  }

  const roleResp = await httpGet(`${API_URL}/role/list`, headers);
  if (roleResp.ok) {
    console.log('  ✓ Role list API works');
    passed++;
  } else {
    console.log('  ✗ Role list API failed');
    failed++;
  }

  // Test 5: Inventory APIs
  console.log('\n┌──────────────────────────────────────────────────────────────────┐');
  console.log('│ 5. Inventory APIs                                                │');
  console.log('└──────────────────────────────────────────────────────────────────┘');
  const inResp = await httpGet(`${API_URL}/api/inventory/in/page?page=1&pageSize=10`, headers);
  if (inResp.ok) {
    console.log('  ✓ Inventory In API works');
    passed++;
  } else {
    console.log('  ✗ Inventory In API failed');
    failed++;
  }

  const transferResp = await httpGet(`${API_URL}/api/inventory/transfer/page?current=1&size=10`, headers);
  if (transferResp.ok) {
    console.log('  ✓ Inventory Transfer API works');
    passed++;
  } else {
    console.log('  ✗ Inventory Transfer API failed');
    failed++;
  }

  // Test 6: Sales APIs
  console.log('\n┌──────────────────────────────────────────────────────────────────┐');
  console.log('│ 6. Sales APIs                                                     │');
  console.log('└──────────────────────────────────────────────────────────────────┘');
  const salesResp = await httpGet(`${API_URL}/api/sales/order/page?current=1&size=10`, headers);
  if (salesResp.ok) {
    console.log('  ✓ Sales Order API works');
    passed++;
  } else {
    console.log('  ✗ Sales Order API failed');
    failed++;
  }

  // Test 7: Finance APIs
  console.log('\n┌──────────────────────────────────────────────────────────────────┐');
  console.log('│ 7. Finance APIs                                                   │');
  console.log('└──────────────────────────────────────────────────────────────────┘');
  const accountResp = await httpGet(`${API_URL}/api/finance/account/page?page=1&pageSize=10`, headers);
  if (accountResp.ok) {
    console.log('  ✓ Finance Account API works');
    passed++;
  } else {
    console.log('  ✗ Finance Account API failed');
    failed++;
  }

  const transResp = await httpGet(`${API_URL}/api/finance/account-trans/page?page=1&pageSize=10&accountId=1`, headers);
  if (transResp.ok) {
    console.log('  ✓ Account Transaction API works');
    passed++;
  } else {
    console.log('  ✗ Account Transaction API failed');
    failed++;
  }

  // Test 8: Report APIs
  console.log('\n┌──────────────────────────────────────────────────────────────────┐');
  console.log('│ 8. Report APIs                                                    │');
  console.log('└──────────────────────────────────────────────────────────────────┘');
  const salesReportResp = await httpGet(`${API_URL}/api/report/sales`, headers);
  if (salesReportResp.ok) {
    console.log('  ✓ Sales Report API works');
    passed++;
  } else {
    console.log('  ✗ Sales Report API failed');
    failed++;
  }

  const financeReportResp = await httpGet(`${API_URL}/api/report/finance`, headers);
  if (financeReportResp.ok) {
    console.log('  ✓ Finance Report API works');
    passed++;
  } else {
    console.log('  ✗ Finance Report API failed');
    failed++;
  }

  // Test 9: Product/Customer APIs
  console.log('\n┌──────────────────────────────────────────────────────────────────┐');
  console.log('│ 9. Product & Customer APIs                                        │');
  console.log('└──────────────────────────────────────────────────────────────────┘');
  const productResp = await httpGet(`${API_URL}/api/product/page?page=1&pageSize=10`, headers);
  if (productResp.ok) {
    console.log('  ✓ Product API works');
    passed++;
  } else {
    console.log('  ✗ Product API failed');
    failed++;
  }

  const customerResp = await httpGet(`${API_URL}/api/customer/page?page=1&pageSize=10`, headers);
  if (customerResp.ok) {
    console.log('  ✓ Customer API works');
    passed++;
  } else {
    console.log('  ✗ Customer API failed');
    failed++;
  }

  // Test 10: Supplier/Procurement APIs
  console.log('\n┌──────────────────────────────────────────────────────────────────┐');
  console.log('│ 10. Procurement APIs                                               │');
  console.log('└──────────────────────────────────────────────────────────────────┘');
  const supplierResp = await httpGet(`${API_URL}/api/procurement/suppliers/list`, headers);
  if (supplierResp.ok) {
    console.log('  ✓ Supplier API works');
    passed++;
  } else {
    console.log('  ✗ Supplier API failed');
    failed++;
  }

  const purchaseResp = await httpGet(`${API_URL}/api/procurement/orders`, headers);
  if (purchaseResp.ok) {
    console.log('  ✓ Purchase Order API works');
    passed++;
  } else {
    console.log('  ✗ Purchase Order API failed');
    failed++;
  }

  // Test 11: Warehouse API
  console.log('\n┌──────────────────────────────────────────────────────────────────┐');
  console.log('│ 11. Warehouse APIs                                                │');
  console.log('└──────────────────────────────────────────────────────────────────┘');
  const locationResp = await httpGet(`${API_URL}/api/location/page?current=1&size=10`, headers);
  if (locationResp.ok) {
    console.log('  ✓ Warehouse Location API works');
    passed++;
  } else {
    console.log('  ✗ Warehouse Location API failed');
    failed++;
  }

  // Summary
  console.log('\n╔══════════════════════════════════════════════════════════════════╗');
  console.log('║                         Test Summary                               ║');
  console.log('╚══════════════════════════════════════════════════════════════════╝');
  console.log(`\n  Passed: ${passed}`);
  console.log(`  Failed: ${failed}`);
  console.log(`  Total:  ${passed + failed}`);
  console.log('\n  Note: This is an HTTP-level test. For full E2E with browser,');
  console.log('  install GTK libraries: sudo apt-get install libgtk-3-0 libglib2.0-0\n');

  process.exit(failed > 0 ? 1 : 0);
}

runTests().catch(console.error);