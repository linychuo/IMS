// IMS HTTP-based E2E Test (No browser required)
// Tests the actual HTTP endpoints for all modules

const API_URL = 'http://localhost:8080';
const FRONTEND_URL = 'http://localhost:3000';

async function httpGet(url, headers = {}) {
  try {
    const resp = await fetch(url, { headers, method: 'GET' });
    const text = await resp.text();
    return { status: resp.status, ok: resp.ok, text: text.substring(0, 500), json: () => tryParseJSON(text) };
  } catch (e) {
    return { status: 0, ok: false, text: '', error: e.message, json: () => null };
  }
}

async function httpPost(url, headers = {}, body = {}) {
  try {
    const resp = await fetch(url, {
      method: 'POST',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    const text = await resp.text();
    return { status: resp.status, ok: resp.ok, text: text.substring(0, 500), json: () => tryParseJSON(text) };
  } catch (e) {
    return { status: 0, ok: false, text: '', error: e.message, json: () => null };
  }
}

function tryParseJSON(text) {
  try { return JSON.parse(text); } catch { return null; }
}

async function runTests() {
  console.log('\n╔══════════════════════════════════════════════════════════════════╗');
  console.log('║         IMS HTTP E2E Test - All Modules                         ║');
  console.log('╚══════════════════════════════════════════════════════════════════╝\n');

  let token = '';
  let passed = 0;
  let failed = 0;
  const results = [];

  // Test 1: Frontend
  console.log('┌──────────────────────────────────────────────────────────────────┐');
  console.log('│ 1. Frontend (http://localhost:3000)                              │');
  console.log('└──────────────────────────────────────────────────────────────────┘');
  const frontend = await httpGet(FRONTEND_URL);
  if (frontend.ok && frontend.text.includes('ims')) {
    console.log('  ✓ Frontend is serving React app');
    passed++;
    results.push({ name: 'Frontend', status: 'PASS' });
  } else {
    console.log('  ✗ Frontend not responding correctly');
    failed++;
    results.push({ name: 'Frontend', status: 'FAIL' });
  }

  // Test 2: Login API
  console.log('\n┌──────────────────────────────────────────────────────────────────┐');
  console.log('│ 2. Login API (POST /auth/login)                                  │');
  console.log('└──────────────────────────────────────────────────────────────────┘');
  const loginResp = await httpPost(`${API_URL}/auth/login`, {}, { username: 'admin', password: 'admin123' });
  const loginData = loginResp.json();
  if (loginData && loginData.success && loginData.data.token) {
    token = loginData.data.token;
    console.log('  ✓ Login successful');
    console.log(`    User: ${loginData.data.username}, Role: ${loginData.data.realName}`);
    passed++;
    results.push({ name: 'Login API', status: 'PASS' });
  } else {
    console.log('  ✗ Login failed:', loginData?.message || 'Unknown error');
    failed++;
    results.push({ name: 'Login API', status: 'FAIL' });
    process.exit(1);
  }

  const headers = { 'Authorization': `Bearer ${token}` };

  // Test 3: System APIs (User/Role/Menu)
  console.log('\n┌──────────────────────────────────────────────────────────────────┐');
  console.log('│ 3. System APIs (User/Role/Menu)                                  │');
  console.log('└──────────────────────────────────────────────────────────────────┘');

  const userResp = await httpGet(`${API_URL}/user/list`, headers);
  if (userResp.ok) { console.log('  ✓ User list API'); passed++; results.push({ name: 'User List', status: 'PASS' }); }
  else { console.log('  ✗ User list API failed'); failed++; results.push({ name: 'User List', status: 'FAIL' }); }

  const roleResp = await httpGet(`${API_URL}/role/list`, headers);
  if (roleResp.ok) { console.log('  ✓ Role list API'); passed++; results.push({ name: 'Role List', status: 'PASS' }); }
  else { console.log('  ✗ Role list API failed'); failed++; results.push({ name: 'Role List', status: 'FAIL' }); }

  // Test 4: New System APIs (Config/Log/Approval)
  console.log('\n┌──────────────────────────────────────────────────────────────────┐');
  console.log('│ 4. New System APIs (Config/Approval/Log)                        │');
  console.log('└──────────────────────────────────────────────────────────────────┘');

  const configResp = await httpGet(`${API_URL}/api/system/config`, headers);
  if (configResp.ok) { console.log('  ✓ System Config API'); passed++; results.push({ name: 'System Config', status: 'PASS' }); }
  else { console.log('  ✗ System Config API failed'); failed++; results.push({ name: 'System Config', status: 'FAIL' }); }

  const approvalRuleResp = await httpGet(`${API_URL}/api/system/approval-rule`, headers);
  if (approvalRuleResp.ok) { console.log('  ✓ Approval Rule API'); passed++; results.push({ name: 'Approval Rule', status: 'PASS' }); }
  else { console.log('  ✗ Approval Rule API failed'); failed++; results.push({ name: 'Approval Rule', status: 'FAIL' }); }

  const operationLogResp = await httpGet(`${API_URL}/api/system/log/page`, headers);
  if (operationLogResp.ok) { console.log('  ✓ Operation Log API'); passed++; results.push({ name: 'Operation Log', status: 'PASS' }); }
  else { console.log('  ✗ Operation Log API failed'); failed++; results.push({ name: 'Operation Log', status: 'FAIL' }); }

  const loginLogResp = await httpGet(`${API_URL}/api/system/login-log/page`, headers);
  if (loginLogResp.ok) { console.log('  ✓ Login Log API'); passed++; results.push({ name: 'Login Log', status: 'PASS' }); }
  else { console.log('  ✗ Login Log API failed'); failed++; results.push({ name: 'Login Log', status: 'FAIL' }); }

  const dataPermResp = await httpGet(`${API_URL}/api/system/data-permission/user/1/warehouses`, headers);
  if (dataPermResp.ok) { console.log('  ✓ Data Permission API'); passed++; results.push({ name: 'Data Permission', status: 'PASS' }); }
  else { console.log('  ✗ Data Permission API failed'); failed++; results.push({ name: 'Data Permission', status: 'FAIL' }); }

  // Test 5: Product/Customer/Supplier APIs
  console.log('\n┌──────────────────────────────────────────────────────────────────┐');
  console.log('│ 5. Product/Customer/Supplier APIs                                │');
  console.log('└──────────────────────────────────────────────────────────────────┘');

  const productResp = await httpGet(`${API_URL}/api/product/page?page=1&pageSize=10`, headers);
  if (productResp.ok) { console.log('  ✓ Product API'); passed++; results.push({ name: 'Product', status: 'PASS' }); }
  else { console.log('  ✗ Product API failed'); failed++; results.push({ name: 'Product', status: 'FAIL' }); }

  const categoryResp = await httpGet(`${API_URL}/api/product/category/page?page=1&pageSize=10`, headers);
  if (categoryResp.ok) { console.log('  ✓ Product Category API'); passed++; results.push({ name: 'Product Category', status: 'PASS' }); }
  else { console.log('  ✗ Product Category API failed'); failed++; results.push({ name: 'Product Category', status: 'FAIL' }); }

  const customerResp = await httpGet(`${API_URL}/api/customer/page?page=1&pageSize=10`, headers);
  if (customerResp.ok) { console.log('  ✓ Customer API'); passed++; results.push({ name: 'Customer', status: 'PASS' }); }
  else { console.log('  ✗ Customer API failed'); failed++; results.push({ name: 'Customer', status: 'FAIL' }); }

  const supplierResp = await httpGet(`${API_URL}/api/procurement/suppliers/list`, headers);
  if (supplierResp.ok) { console.log('  ✓ Supplier API'); passed++; results.push({ name: 'Supplier', status: 'PASS' }); }
  else { console.log('  ✗ Supplier API failed'); failed++; results.push({ name: 'Supplier', status: 'FAIL' }); }

  // Test 6: Warehouse/Location APIs
  console.log('\n┌──────────────────────────────────────────────────────────────────┐');
  console.log('│ 6. Warehouse/Location APIs                                       │');
  console.log('└──────────────────────────────────────────────────────────────────┘');

  const warehouseResp = await httpGet(`${API_URL}/api/warehouse/page?page=1&pageSize=10`, headers);
  if (warehouseResp.ok) { console.log('  ✓ Warehouse API'); passed++; results.push({ name: 'Warehouse', status: 'PASS' }); }
  else { console.log('  ✗ Warehouse API failed'); failed++; results.push({ name: 'Warehouse', status: 'FAIL' }); }

  const locationResp = await httpGet(`${API_URL}/api/location/page?current=1&size=10`, headers);
  if (locationResp.ok) { console.log('  ✓ Location API'); passed++; results.push({ name: 'Location', status: 'PASS' }); }
  else { console.log('  ✗ Location API failed'); failed++; results.push({ name: 'Location', status: 'FAIL' }); }

  // Test 7: Sales APIs (Order/Out/Return/PriceStrategy/Promotion)
  console.log('\n┌──────────────────────────────────────────────────────────────────┐');
  console.log('│ 7. Sales APIs (Order/Out/Return/Promotion)                        │');
  console.log('└──────────────────────────────────────────────────────────────────┘');

  const salesOrderResp = await httpGet(`${API_URL}/api/sales/order/page?current=1&size=10`, headers);
  if (salesOrderResp.ok) { console.log('  ✓ Sales Order API'); passed++; results.push({ name: 'Sales Order', status: 'PASS' }); }
  else { console.log('  ✗ Sales Order API failed'); failed++; results.push({ name: 'Sales Order', status: 'FAIL' }); }

  const salesOutResp = await httpGet(`${API_URL}/api/sales/out/list`, headers);
  if (salesOutResp.ok) { console.log('  ✓ Sales Out API'); passed++; results.push({ name: 'Sales Out', status: 'PASS' }); }
  else { console.log('  ✗ Sales Out API failed'); failed++; results.push({ name: 'Sales Out', status: 'FAIL' }); }

  const salesReturnResp = await httpGet(`${API_URL}/api/sales/return/list`, headers);
  if (salesReturnResp.ok) { console.log('  ✓ Sales Return API'); passed++; results.push({ name: 'Sales Return', status: 'PASS' }); }
  else { console.log('  ✗ Sales Return API failed'); failed++; results.push({ name: 'Sales Return', status: 'FAIL' }); }

  const priceStrategyResp = await httpGet(`${API_URL}/api/sales/price-strategy/list`, headers);
  if (priceStrategyResp.ok) { console.log('  ✓ Sales Price Strategy API'); passed++; results.push({ name: 'Price Strategy', status: 'PASS' }); }
  else { console.log('  ✗ Sales Price Strategy API failed'); failed++; results.push({ name: 'Price Strategy', status: 'FAIL' }); }

  const promotionResp = await httpGet(`${API_URL}/api/sales/promotion`, headers);
  if (promotionResp.ok) { console.log('  ✓ Promotion API'); passed++; results.push({ name: 'Promotion', status: 'PASS' }); }
  else { console.log('  ✗ Promotion API failed'); failed++; results.push({ name: 'Promotion', status: 'FAIL' }); }

  const promotionActiveResp = await httpGet(`${API_URL}/api/sales/promotion/active`, headers);
  if (promotionActiveResp.ok) { console.log('  ✓ Promotion Active API'); passed++; results.push({ name: 'Promotion Active', status: 'PASS' }); }
  else { console.log('  ✗ Promotion Active API failed'); failed++; results.push({ name: 'Promotion Active', status: 'FAIL' }); }

  // Test 8: Procurement APIs (Order/In/Return/Agreement)
  console.log('\n┌──────────────────────────────────────────────────────────────────┐');
  console.log('│ 8. Procurement APIs (Order/In/Return/Agreement)                  │');
  console.log('└──────────────────────────────────────────────────────────────────┘');

  const purchaseOrderResp = await httpGet(`${API_URL}/api/procurement/orders`, headers);
  if (purchaseOrderResp.ok) { console.log('  ✓ Purchase Order API'); passed++; results.push({ name: 'Purchase Order', status: 'PASS' }); }
  else { console.log('  ✗ Purchase Order API failed'); failed++; results.push({ name: 'Purchase Order', status: 'FAIL' }); }

  const purchaseInResp = await httpGet(`${API_URL}/api/procurement/in/page?page=1&pageSize=10`, headers);
  if (purchaseInResp.ok) { console.log('  ✓ Purchase In API'); passed++; results.push({ name: 'Purchase In', status: 'PASS' }); }
  else { console.log('  ✗ Purchase In API failed'); failed++; results.push({ name: 'Purchase In', status: 'FAIL' }); }

  const purchaseReturnResp = await httpGet(`${API_URL}/api/procurement/return/list`, headers);
  if (purchaseReturnResp.ok) { console.log('  ✓ Purchase Return API'); passed++; results.push({ name: 'Purchase Return', status: 'PASS' }); }
  else { console.log('  ✗ Purchase Return API failed'); failed++; results.push({ name: 'Purchase Return', status: 'FAIL' }); }

  const agreementResp = await httpGet(`${API_URL}/api/procurement/agreements`, headers);
  if (agreementResp.ok) { console.log('  ✓ Supplier Agreement API'); passed++; results.push({ name: 'Supplier Agreement', status: 'PASS' }); }
  else { console.log('  ✗ Supplier Agreement API failed'); failed++; results.push({ name: 'Supplier Agreement', status: 'FAIL' }); }

  const incomingOrdersResp = await httpGet(`${API_URL}/api/procurement/orders/incoming?days=7`, headers);
  if (incomingOrdersResp.ok) { console.log('  ✓ Purchase Incoming Orders API'); passed++; results.push({ name: 'Incoming Orders', status: 'PASS' }); }
  else { console.log('  ✗ Purchase Incoming Orders API failed'); failed++; results.push({ name: 'Incoming Orders', status: 'FAIL' }); }

  const overdueOrdersResp = await httpGet(`${API_URL}/api/procurement/orders/overdue`, headers);
  if (overdueOrdersResp.ok) { console.log('  ✓ Purchase Overdue Orders API'); passed++; results.push({ name: 'Overdue Orders', status: 'PASS' }); }
  else { console.log('  ✗ Purchase Overdue Orders API failed'); failed++; results.push({ name: 'Overdue Orders', status: 'FAIL' }); }

  // Test 9: Inventory APIs (In/Out/Transfer/Check/Record)
  console.log('\n┌──────────────────────────────────────────────────────────────────┐');
  console.log('│ 9. Inventory APIs (In/Out/Transfer/Check/Record)                │');
  console.log('└──────────────────────────────────────────────────────────────────┘');

  const inventoryInResp = await httpGet(`${API_URL}/api/inventory/in/page?page=1&pageSize=10`, headers);
  if (inventoryInResp.ok) { console.log('  ✓ Inventory In API'); passed++; results.push({ name: 'Inventory In', status: 'PASS' }); }
  else { console.log('  ✗ Inventory In API failed'); failed++; results.push({ name: 'Inventory In', status: 'FAIL' }); }

  const inventoryOutResp = await httpGet(`${API_URL}/api/inventory/out/page?page=1&pageSize=10`, headers);
  if (inventoryOutResp.ok) { console.log('  ✓ Inventory Out API'); passed++; results.push({ name: 'Inventory Out', status: 'PASS' }); }
  else { console.log('  ✗ Inventory Out API failed'); failed++; results.push({ name: 'Inventory Out', status: 'FAIL' }); }

  const transferResp = await httpGet(`${API_URL}/api/inventory/transfer/page?current=1&size=10`, headers);
  if (transferResp.ok) { console.log('  ✓ Inventory Transfer API'); passed++; results.push({ name: 'Inventory Transfer', status: 'PASS' }); }
  else { console.log('  ✗ Inventory Transfer API failed'); failed++; results.push({ name: 'Inventory Transfer', status: 'FAIL' }); }

  const checkResp = await httpGet(`${API_URL}/api/inventory/check/page?page=1&pageSize=10`, headers);
  if (checkResp.ok) { console.log('  ✓ Inventory Check API'); passed++; results.push({ name: 'Inventory Check', status: 'PASS' }); }
  else { console.log('  ✗ Inventory Check API failed'); failed++; results.push({ name: 'Inventory Check', status: 'FAIL' }); }

  const recordResp = await httpGet(`${API_URL}/api/inventory/record/page?page=1&pageSize=10`, headers);
  if (recordResp.ok) { console.log('  ✓ Inventory Record API'); passed++; results.push({ name: 'Inventory Record', status: 'PASS' }); }
  else { console.log('  ✗ Inventory Record API failed'); failed++; results.push({ name: 'Inventory Record', status: 'FAIL' }); }

  const inventoryListResp = await httpGet(`${API_URL}/api/inventory/list`, headers);
  if (inventoryListResp.ok) { console.log('  ✓ Inventory List API'); passed++; results.push({ name: 'Inventory List', status: 'PASS' }); }
  else { console.log('  ✗ Inventory List API failed'); failed++; results.push({ name: 'Inventory List', status: 'FAIL' }); }

  const lowStockResp = await httpGet(`${API_URL}/api/inventory/low-stock`, headers);
  if (lowStockResp.ok) { console.log('  ✓ Low Stock Warning API'); passed++; results.push({ name: 'Low Stock Warning', status: 'PASS' }); }
  else { console.log('  ✗ Low Stock Warning API failed'); failed++; results.push({ name: 'Low Stock Warning', status: 'FAIL' }); }

  const highStockResp = await httpGet(`${API_URL}/api/inventory/high-stock`, headers);
  if (highStockResp.ok) { console.log('  ✓ High Stock Warning API'); passed++; results.push({ name: 'High Stock Warning', status: 'PASS' }); }
  else { console.log('  ✗ High Stock Warning API failed'); failed++; results.push({ name: 'High Stock Warning', status: 'FAIL' }); }

  // Test 10: Finance APIs (Account/Transaction/Receivable/Payable/Invoice/Expense/Reconciliation)
  console.log('\n┌──────────────────────────────────────────────────────────────────┐');
  console.log('│ 10. Finance APIs (Account/Receivable/Payable/Invoice/Expense)    │');
  console.log('└──────────────────────────────────────────────────────────────────┘');

  const accountResp = await httpGet(`${API_URL}/api/finance/account/page?page=1&pageSize=10`, headers);
  if (accountResp.ok) { console.log('  ✓ Finance Account API'); passed++; results.push({ name: 'Finance Account', status: 'PASS' }); }
  else { console.log('  ✗ Finance Account API failed'); failed++; results.push({ name: 'Finance Account', status: 'FAIL' }); }

  const transResp = await httpGet(`${API_URL}/api/finance/account-trans/page?page=1&pageSize=10`, headers);
  if (transResp.ok) { console.log('  ✓ Account Transaction API'); passed++; results.push({ name: 'Account Transaction', status: 'PASS' }); }
  else { console.log('  ✗ Account Transaction API failed'); failed++; results.push({ name: 'Account Transaction', status: 'FAIL' }); }

  const receivableResp = await httpGet(`${API_URL}/api/finance/receivable/page?page=1&pageSize=10`, headers);
  if (receivableResp.ok) { console.log('  ✓ Receivable API'); passed++; results.push({ name: 'Receivable', status: 'PASS' }); }
  else { console.log('  ✗ Receivable API failed'); failed++; results.push({ name: 'Receivable', status: 'FAIL' }); }

  const overdueReceivableResp = await httpGet(`${API_URL}/api/finance/receivable/overdue`, headers);
  if (overdueReceivableResp.ok) { console.log('  ✓ Overdue Receivable API'); passed++; results.push({ name: 'Overdue Receivable', status: 'PASS' }); }
  else { console.log('  ✗ Overdue Receivable API failed'); failed++; results.push({ name: 'Overdue Receivable', status: 'FAIL' }); }

  const dueSoonReceivableResp = await httpGet(`${API_URL}/api/finance/receivable/due-soon`, headers);
  if (dueSoonReceivableResp.ok) { console.log('  ✓ Due Soon Receivable API'); passed++; results.push({ name: 'Due Soon Receivable', status: 'PASS' }); }
  else { console.log('  ✗ Due Soon Receivable API failed'); failed++; results.push({ name: 'Due Soon Receivable', status: 'FAIL' }); }

  const payableResp = await httpGet(`${API_URL}/api/finance/payable/page?page=1&pageSize=10`, headers);
  if (payableResp.ok) { console.log('  ✓ Payable API'); passed++; results.push({ name: 'Payable', status: 'PASS' }); }
  else { console.log('  ✗ Payable API failed'); failed++; results.push({ name: 'Payable', status: 'FAIL' }); }

  const invoiceResp = await httpGet(`${API_URL}/api/finance/invoice/page?page=1&pageSize=10`, headers);
  if (invoiceResp.ok) { console.log('  ✓ Invoice API'); passed++; results.push({ name: 'Invoice', status: 'PASS' }); }
  else { console.log('  ✗ Invoice API failed'); failed++; results.push({ name: 'Invoice', status: 'FAIL' }); }

  const expenseResp = await httpGet(`${API_URL}/api/finance/expense/page?page=1&pageSize=10`, headers);
  if (expenseResp.ok) { console.log('  ✓ Expense API'); passed++; results.push({ name: 'Expense', status: 'PASS' }); }
  else { console.log('  ✗ Expense API failed'); failed++; results.push({ name: 'Expense', status: 'FAIL' }); }

  const customerReconciliationResp = await httpGet(`${API_URL}/api/finance/customer-reconciliation/page?page=1&pageSize=10`, headers);
  if (customerReconciliationResp.ok) { console.log('  ✓ Customer Reconciliation API'); passed++; results.push({ name: 'Customer Reconciliation', status: 'PASS' }); }
  else { console.log('  ✗ Customer Reconciliation API failed'); failed++; results.push({ name: 'Customer Reconciliation', status: 'FAIL' }); }

  const supplierReconciliationResp = await httpGet(`${API_URL}/api/finance/supplier-reconciliation/page?page=1&pageSize=10`, headers);
  if (supplierReconciliationResp.ok) { console.log('  ✓ Supplier Reconciliation API'); passed++; results.push({ name: 'Supplier Reconciliation', status: 'PASS' }); }
  else { console.log('  ✗ Supplier Reconciliation API failed'); failed++; results.push({ name: 'Supplier Reconciliation', status: 'FAIL' }); }

  // Test 11: Report APIs (Dashboard/Sales/Purchase/Inventory/Analysis)
  console.log('\n┌──────────────────────────────────────────────────────────────────┐');
  console.log('│ 11. Report APIs (Dashboard/Sales/Purchase/Analysis)             │');
  console.log('└──────────────────────────────────────────────────────────────────┘');

  const dashboardResp = await httpGet(`${API_URL}/api/report/dashboard`, headers);
  if (dashboardResp.ok) { console.log('  ✓ Dashboard API'); passed++; results.push({ name: 'Dashboard', status: 'PASS' }); }
  else { console.log('  ✗ Dashboard API failed'); failed++; results.push({ name: 'Dashboard', status: 'FAIL' }); }

  const salesReportResp = await httpGet(`${API_URL}/api/report/sales`, headers);
  if (salesReportResp.ok) { console.log('  ✓ Sales Report API'); passed++; results.push({ name: 'Sales Report', status: 'PASS' }); }
  else { console.log('  ✗ Sales Report API failed'); failed++; results.push({ name: 'Sales Report', status: 'FAIL' }); }

  const purchaseReportResp = await httpGet(`${API_URL}/api/report/purchase/summary`, headers);
  if (purchaseReportResp.ok) { console.log('  ✓ Purchase Report API'); passed++; results.push({ name: 'Purchase Report', status: 'PASS' }); }
  else { console.log('  ✗ Purchase Report API failed'); failed++; results.push({ name: 'Purchase Report', status: 'FAIL' }); }

  const inventoryReportResp = await httpGet(`${API_URL}/api/report/inventory`, headers);
  if (inventoryReportResp.ok) { console.log('  ✓ Inventory Report API'); passed++; results.push({ name: 'Inventory Report', status: 'PASS' }); }
  else { console.log('  ✗ Inventory Report API failed'); failed++; results.push({ name: 'Inventory Report', status: 'FAIL' }); }

  const customerAnalysisResp = await httpGet(`${API_URL}/api/report/analysis/customer`, headers);
  if (customerAnalysisResp.ok) { console.log('  ✓ Customer Analysis API'); passed++; results.push({ name: 'Customer Analysis', status: 'PASS' }); }
  else { console.log('  ✗ Customer Analysis API failed'); failed++; results.push({ name: 'Customer Analysis', status: 'FAIL' }); }

  const productAnalysisResp = await httpGet(`${API_URL}/api/report/analysis/product`, headers);
  if (productAnalysisResp.ok) { console.log('  ✓ Product Analysis API'); passed++; results.push({ name: 'Product Analysis', status: 'PASS' }); }
  else { console.log('  ✗ Product Analysis API failed'); failed++; results.push({ name: 'Product Analysis', status: 'FAIL' }); }

  const supplierAnalysisResp = await httpGet(`${API_URL}/api/report/analysis/supplier`, headers);
  if (supplierAnalysisResp.ok) { console.log('  ✓ Supplier Analysis API'); passed++; results.push({ name: 'Supplier Analysis', status: 'PASS' }); }
  else { console.log('  ✗ Supplier Analysis API failed'); failed++; results.push({ name: 'Supplier Analysis', status: 'FAIL' }); }

  // Test 12: New Report APIs (Inventory Turnover/Profit Margin)
  console.log('\n┌──────────────────────────────────────────────────────────────────┐');
  console.log('│ 12. New Report APIs (Turnover/Profit Margin)                      │');
  console.log('└──────────────────────────────────────────────────────────────────┘');

  const turnoverResp = await httpGet(`${API_URL}/api/report/analysis/inventory-turnover`, headers);
  if (turnoverResp.ok) { console.log('  ✓ Inventory Turnover API'); passed++; results.push({ name: 'Inventory Turnover', status: 'PASS' }); }
  else { console.log('  ✗ Inventory Turnover API failed'); failed++; results.push({ name: 'Inventory Turnover', status: 'FAIL' }); }

  const profitMarginResp = await httpGet(`${API_URL}/api/report/analysis/profit-margin`, headers);
  if (profitMarginResp.ok) { console.log('  ✓ Profit Margin API'); passed++; results.push({ name: 'Profit Margin', status: 'PASS' }); }
  else { console.log('  ✗ Profit Margin API failed'); failed++; results.push({ name: 'Profit Margin', status: 'FAIL' }); }

  // Test 13: Data Import/Export APIs
  console.log('\n┌──────────────────────────────────────────────────────────────────┐');
  console.log('│ 13. Data Import/Export APIs                                        │');
  console.log('└──────────────────────────────────────────────────────────────────┘');

  const exportCustomersResp = await httpGet(`${API_URL}/api/system/export/customers`, headers);
  if (exportCustomersResp.ok) { console.log('  ✓ Export Customers API'); passed++; results.push({ name: 'Export Customers', status: 'PASS' }); }
  else { console.log('  ✗ Export Customers API failed'); failed++; results.push({ name: 'Export Customers', status: 'FAIL' }); }

  const exportSuppliersResp = await httpGet(`${API_URL}/api/system/export/suppliers`, headers);
  if (exportSuppliersResp.ok) { console.log('  ✓ Export Suppliers API'); passed++; results.push({ name: 'Export Suppliers', status: 'PASS' }); }
  else { console.log('  ✗ Export Suppliers API failed'); failed++; results.push({ name: 'Export Suppliers', status: 'FAIL' }); }

  const exportProductsResp = await httpGet(`${API_URL}/api/system/export/products`, headers);
  if (exportProductsResp.ok) { console.log('  ✓ Export Products API'); passed++; results.push({ name: 'Export Products', status: 'PASS' }); }
  else { console.log('  ✗ Export Products API failed'); failed++; results.push({ name: 'Export Products', status: 'FAIL' }); }

  // Summary
  console.log('\n╔══════════════════════════════════════════════════════════════════╗');
  console.log('║                         Test Summary                               ║');
  console.log('╚══════════════════════════════════════════════════════════════════╝');
  console.log(`\n  Passed: ${passed}`);
  console.log(`  Failed: ${failed}`);
  console.log(`  Total:  ${passed + failed}`);
  console.log('\n  Results:');
  results.forEach(r => {
    const icon = r.status === 'PASS' ? '✓' : '✗';
    console.log(`    ${icon} ${r.name}: ${r.status}`);
  });
  console.log('\n');

  process.exit(failed > 0 ? 1 : 0);
}

runTests().catch(console.error);