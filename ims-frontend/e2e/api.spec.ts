import { test, expect } from '@playwright/test';

const API_URL = 'http://localhost:8080';

async function loginApi(request: any) {
  const resp = await request.post(`${API_URL}/auth/login`, {
    data: { username: 'admin', password: 'admin123' }
  });
  const data = await resp.json();
  return data.data?.token as string;
}

// ========== 1. AUTH MODULE ==========
test.describe('Auth Module (认证模块)', () => {
  test('1.1 Login', async ({ request }) => {
    const resp = await request.post(`${API_URL}/auth/login`, {
      data: { username: 'admin', password: 'admin123' }
    });
    const data = await resp.json();
    expect(data.success).toBe(true);
    expect(data.data.token).toBeDefined();
  });

  test('1.2 Validate Token', async ({ request }) => {
    const token = await loginApi(request);
    const resp = await request.get(`${API_URL}/auth/validate`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await resp.json();
    expect(data.success).toBe(true);
  });

  test('1.3 Logout', async ({ request }) => {
    const token = await loginApi(request);
    const resp = await request.post(`${API_URL}/auth/logout`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await resp.json();
    expect(data.success).toBe(true);
  });
});

// ========== 2. SYSTEM MODULE ==========
test.describe('System Module (系统管理)', () => {
  let token: string;

  test.beforeAll(async ({ request }) => {
    token = await loginApi(request);
  });

  test('2.1 User List', async ({ request }) => {
    const resp = await request.get(`${API_URL}/user/list`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await resp.json();
    expect(data.code === 200 || data.success).toBe(true);
  });

  test('2.2 Role List', async ({ request }) => {
    const resp = await request.get(`${API_URL}/role/list`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await resp.json();
    expect(data.code === 200 || data.success).toBe(true);
  });

  test('2.3 Menu List', async ({ request }) => {
    const resp = await request.get(`${API_URL}/system/menu/list`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await resp.json();
    expect(data.code === 200 || data.success).toBe(true);
  });

  test('2.4 Config List', async ({ request }) => {
    const resp = await request.get(`${API_URL}/system/config/list`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await resp.json();
    expect(data.code === 200 || data.success).toBe(true);
  });

  test('2.5 Notification List', async ({ request }) => {
    const resp = await request.get(`${API_URL}/system/notification/list`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await resp.json();
    expect(data.code === 200 || data.success).toBe(true);
  });

  test('2.6 Print Template List', async ({ request }) => {
    const resp = await request.get(`${API_URL}/system/print-template/list`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await resp.json();
    expect(data.code === 200 || data.success).toBe(true);
  });
});

// ========== 3. PRODUCT MODULE ==========
test.describe('Product Module (商品管理)', () => {
  let token: string;

  test.beforeAll(async ({ request }) => {
    token = await loginApi(request);
  });

  test('3.1 Product List', async ({ request }) => {
    const resp = await request.get(`${API_URL}/api/product/list`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await resp.json();
    expect(data.code === 200).toBe(true);
  });

  test('3.2 Product Page', async ({ request }) => {
    const resp = await request.get(`${API_URL}/api/product/page?current=1&size=10`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await resp.json();
    expect(data.code === 200).toBe(true);
  });

  test('3.3 Category List', async ({ request }) => {
    const resp = await request.get(`${API_URL}/api/product/category/list`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await resp.json();
    expect(data.code === 200).toBe(true);
  });

  test('3.4 Product Detail', async ({ request }) => {
    // First get a product ID
    const listResp = await request.get(`${API_URL}/api/product/list`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const listData = await listResp.json();
    const productId = listData.data?.[0]?.id;

    if (productId) {
      const resp = await request.get(`${API_URL}/api/product/${productId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await resp.json();
      expect(data.code === 200 || data.success).toBe(true);
    }
  });
});

// ========== 4. CUSTOMER MODULE ==========
test.describe('Customer Module (客户管理)', () => {
  let token: string;

  test.beforeAll(async ({ request }) => {
    token = await loginApi(request);
  });

  test('4.1 Customer List', async ({ request }) => {
    const resp = await request.get(`${API_URL}/api/customer/list`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await resp.json();
    expect(data.code === 200).toBe(true);
  });

  test('4.2 Customer Page', async ({ request }) => {
    const resp = await request.get(`${API_URL}/api/customer/page?current=1&size=10`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await resp.json();
    expect(data.code === 200).toBe(true);
  });

  test('4.3 Customer Detail', async ({ request }) => {
    const listResp = await request.get(`${API_URL}/api/customer/list`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const listData = await listResp.json();
    const customerId = listData.data?.[0]?.id;

    if (customerId) {
      const resp = await request.get(`${API_URL}/api/customer/${customerId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await resp.json();
      expect(data.code === 200 || data.success).toBe(true);
    }
  });
});

// ========== 5. SUPPLIER MODULE ==========
test.describe('Supplier Module (供应商管理)', () => {
  let token: string;

  test.beforeAll(async ({ request }) => {
    token = await loginApi(request);
  });

  test('5.1 Supplier List', async ({ request }) => {
    const resp = await request.get(`${API_URL}/api/supplier/list`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await resp.json();
    expect(data.code === 200).toBe(true);
  });

  test('5.2 Supplier Page', async ({ request }) => {
    const resp = await request.get(`${API_URL}/api/supplier/page?current=1&size=10`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await resp.json();
    expect(data.code === 200 || data.success).toBe(true);
  });

  test('5.3 Supplier Detail', async ({ request }) => {
    const listResp = await request.get(`${API_URL}/api/supplier/list`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const listData = await listResp.json();
    const supplierId = listData.data?.[0]?.id;

    if (supplierId) {
      const resp = await request.get(`${API_URL}/api/supplier/${supplierId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await resp.json();
      expect(data.code === 200 || data.success).toBe(true);
    }
  });
});

// ========== 6. WAREHOUSE MODULE ==========
test.describe('Warehouse Module (仓库管理)', () => {
  let token: string;

  test.beforeAll(async ({ request }) => {
    token = await loginApi(request);
  });

  test('6.1 Warehouse List', async ({ request }) => {
    const resp = await request.get(`${API_URL}/api/warehouse/list`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await resp.json();
    expect(data.code === 200).toBe(true);
  });

  test('6.2 Location Page', async ({ request }) => {
    const resp = await request.get(`${API_URL}/api/location/page?current=1&size=10`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await resp.json();
    expect(data.code === 200 || data.success).toBe(true);
  });

  test('6.3 Location List', async ({ request }) => {
    const resp = await request.get(`${API_URL}/api/location/list`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await resp.json();
    expect(data.code === 200 || data.success).toBe(true);
  });
});

// ========== 7. SALES MODULE ==========
test.describe('Sales Module (销售管理)', () => {
  let token: string;

  test.beforeAll(async ({ request }) => {
    token = await loginApi(request);
  });

  test('7.1 Sales Order List', async ({ request }) => {
    const resp = await request.get(`${API_URL}/api/sales/order/list`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await resp.json();
    expect(data.code === 200 || data.success).toBe(true);
  });

  test('7.2 Sales Order Page', async ({ request }) => {
    const resp = await request.get(`${API_URL}/api/sales/order/page?current=1&size=10`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await resp.json();
    expect(data.code === 200 || data.success).toBe(true);
  });

  test('7.3 Sales Order Detail', async ({ request }) => {
    const listResp = await request.get(`${API_URL}/api/sales/order/list`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const listData = await listResp.json();
    const orderId = listData.data?.[0]?.id;

    if (orderId) {
      const resp = await request.get(`${API_URL}/api/sales/order/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await resp.json();
      expect(data.code === 200 || data.success).toBe(true);
    }
  });

  test('7.4 Sales Order Status History', async ({ request }) => {
    const listResp = await request.get(`${API_URL}/api/sales/order/list`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const listData = await listResp.json();
    const orderId = listData.data?.[0]?.id;

    if (orderId) {
      const resp = await request.get(`${API_URL}/api/sales/order/${orderId}/status-history`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await resp.json();
      expect(data.code === 200 || data.success).toBe(true);
    }
  });

  test('7.5 Sales Out List', async ({ request }) => {
    const resp = await request.get(`${API_URL}/api/sales/out/list`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await resp.json();
    expect(data.code === 200 || data.success).toBe(true);
  });

  test('7.6 Sales Out Page', async ({ request }) => {
    const resp = await request.get(`${API_URL}/api/sales/out/page?current=1&size=10`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await resp.json();
    expect(data.code === 200 || data.success).toBe(true);
  });

  test('7.7 Sales Return List', async ({ request }) => {
    const resp = await request.get(`${API_URL}/api/sales/return/list`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await resp.json();
    expect(data.code === 200 || data.success).toBe(true);
  });

  test('7.8 Sales Return Page', async ({ request }) => {
    const resp = await request.get(`${API_URL}/api/sales/return/page?current=1&size=10`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await resp.json();
    expect(data.code === 200 || data.success).toBe(true);
  });

  test('7.9 Price Strategy List', async ({ request }) => {
    const resp = await request.get(`${API_URL}/api/sales/price-strategy/list`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await resp.json();
    expect(data.code === 200 || data.success).toBe(true);
  });

  test('7.10 Promotion List', async ({ request }) => {
    const resp = await request.get(`${API_URL}/api/sales/promotion/list`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await resp.json();
    expect(data.code === 200 || data.success).toBe(true);
  });

  test('7.11 Order Track List', async ({ request }) => {
    const resp = await request.get(`${API_URL}/api/sales/order/page?current=1&size=10`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await resp.json();
    expect(data.code === 200 || data.success).toBe(true);
  });
});

// ========== 8. PROCUREMENT MODULE ==========
test.describe('Procurement Module (采购管理)', () => {
  let token: string;

  test.beforeAll(async ({ request }) => {
    token = await loginApi(request);
  });

  test('8.1 Purchase Order List', async ({ request }) => {
    const resp = await request.get(`${API_URL}/api/procurement/order/list`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await resp.json();
    expect(data.code === 200 || data.success).toBe(true);
  });

  test('8.2 Purchase Order Page', async ({ request }) => {
    const resp = await request.get(`${API_URL}/api/procurement/order/page?current=1&size=10`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await resp.json();
    expect(data.code === 200 || data.success).toBe(true);
  });

  test('8.3 Purchase In List', async ({ request }) => {
    const resp = await request.get(`${API_URL}/api/procurement/in/list`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await resp.json();
    expect(data.code === 200 || data.success).toBe(true);
  });

  test('8.4 Purchase Return List', async ({ request }) => {
    const resp = await request.get(`${API_URL}/api/procurement/return/list`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await resp.json();
    expect(data.code === 200 || data.success).toBe(true);
  });

  test('8.5 Price Agreement List', async ({ request }) => {
    const resp = await request.get(`${API_URL}/api/procurement/price-agreement/list`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await resp.json();
    expect(data.code === 200 || data.success).toBe(true);
  });

  test('8.6 Purchase Alert List', async ({ request }) => {
    const resp = await request.get(`${API_URL}/api/procurement/alert/list`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await resp.json();
    expect(data.code === 200 || data.success).toBe(true);
  });

  test('8.7 Supplier List (via procurement)', async ({ request }) => {
    const resp = await request.get(`${API_URL}/api/procurement/supplier/list`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await resp.json();
    expect(data.code === 200 || data.success).toBe(true);
  });
});

// ========== 9. INVENTORY MODULE ==========
test.describe('Inventory Module (库存管理)', () => {
  let token: string;

  test.beforeAll(async ({ request }) => {
    token = await loginApi(request);
  });

  test('9.1 Inventory Account Page', async ({ request }) => {
    const resp = await request.get(`${API_URL}/api/inventory/account/page?current=1&size=10`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await resp.json();
    expect(data.code === 200 || data.success).toBe(true);
  });

  test('9.2 Inventory Account List', async ({ request }) => {
    const resp = await request.get(`${API_URL}/api/inventory/account/list`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await resp.json();
    expect(data.code === 200 || data.success).toBe(true);
  });

  test('9.3 Inventory In Page', async ({ request }) => {
    const resp = await request.get(`${API_URL}/api/inventory/in/page?current=1&size=10`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await resp.json();
    expect(data.code === 200 || data.success).toBe(true);
  });

  test('9.4 Inventory Out Page', async ({ request }) => {
    const resp = await request.get(`${API_URL}/api/inventory/out/page?current=1&size=10`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await resp.json();
    expect(data.code === 200 || data.success).toBe(true);
  });

  test('9.5 Inventory Transfer Page', async ({ request }) => {
    const resp = await request.get(`${API_URL}/api/inventory/transfer/page?current=1&size=10`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await resp.json();
    expect(data.code === 200 || data.success).toBe(true);
  });

  test('9.6 Inventory Check Page', async ({ request }) => {
    const resp = await request.get(`${API_URL}/api/inventory/check/page?current=1&size=10`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await resp.json();
    expect(data.code === 200 || data.success).toBe(true);
  });

  test('9.7 Inventory Record Page', async ({ request }) => {
    const resp = await request.get(`${API_URL}/api/inventory/record/page?current=1&size=10`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await resp.json();
    expect(data.code === 200 || data.success).toBe(true);
  });

  test('9.8 Batch List', async ({ request }) => {
    const resp = await request.get(`${API_URL}/api/inventory/batch/list`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await resp.json();
    expect(data.code === 200 || data.success).toBe(true);
  });

  test('9.9 Batch Detail', async ({ request }) => {
    const listResp = await request.get(`${API_URL}/api/inventory/batch/list`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const listData = await listResp.json();
    const batchId = listData.data?.[0]?.id;

    if (batchId) {
      const resp = await request.get(`${API_URL}/api/inventory/batch/${batchId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await resp.json();
      expect(data.code === 200 || data.success).toBe(true);
    }
  });

  test('9.10 Batch Traceability', async ({ request }) => {
    const listResp = await request.get(`${API_URL}/api/inventory/batch/list`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const listData = await listResp.json();
    const batchId = listData.data?.[0]?.id;

    if (batchId) {
      const resp = await request.get(`${API_URL}/api/inventory/batch/${batchId}/trace`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await resp.json();
      expect(data.code === 200 || data.success).toBe(true);
    }
  });

  test('9.11 Barcode List', async ({ request }) => {
    const resp = await request.get(`${API_URL}/api/inventory/barcode/list`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await resp.json();
    expect(data.code === 200 || data.success).toBe(true);
  });

  test('9.12 Inventory Alert - Stock Warning', async ({ request }) => {
    const resp = await request.get(`${API_URL}/api/inventory/warning`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await resp.json();
    expect(data.code === 200 || data.success).toBe(true);
  });

  test('9.13 Inventory Alert - Expiry Warning', async ({ request }) => {
    const resp = await request.get(`${API_URL}/api/inventory/expiry`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await resp.json();
    expect(data.code === 200 || data.success).toBe(true);
  });

  test('9.14 Inventory Alert - Idle Stock', async ({ request }) => {
    const resp = await request.get(`${API_URL}/api/inventory/idle`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await resp.json();
    expect(data.code === 200 || data.success).toBe(true);
  });

  test('9.15 Quality Check List', async ({ request }) => {
    const resp = await request.get(`${API_URL}/api/inventory/quality-check/list`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await resp.json();
    expect(data.code === 200 || data.success).toBe(true);
  });
});

// ========== 10. FINANCE MODULE ==========
test.describe('Finance Module (财务管理)', () => {
  let token: string;

  test.beforeAll(async ({ request }) => {
    token = await loginApi(request);
  });

  test('10.1 Finance Account List', async ({ request }) => {
    const resp = await request.get(`${API_URL}/api/finance/account/list`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await resp.json();
    expect(data.code === 200 || data.success).toBe(true);
  });

  test('10.2 Finance Account Page', async ({ request }) => {
    const resp = await request.get(`${API_URL}/api/finance/account/page?current=1&size=10`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await resp.json();
    expect(data.code === 200 || data.success).toBe(true);
  });

  test('10.3 Finance In List', async ({ request }) => {
    const resp = await request.get(`${API_URL}/api/finance/in/list`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await resp.json();
    expect(data.code === 200 || data.success).toBe(true);
  });

  test('10.4 Finance Out List', async ({ request }) => {
    const resp = await request.get(`${API_URL}/api/finance/out/list`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await resp.json();
    expect(data.code === 200 || data.success).toBe(true);
  });

  test('10.5 Receivable List', async ({ request }) => {
    const resp = await request.get(`${API_URL}/api/finance/receivable/list`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await resp.json();
    expect(data.code === 200 || data.success).toBe(true);
  });

  test('10.6 Receivable Page', async ({ request }) => {
    const resp = await request.get(`${API_URL}/api/finance/receivable/page?current=1&size=10`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await resp.json();
    expect(data.code === 200 || data.success).toBe(true);
  });

  test('10.7 Payable List', async ({ request }) => {
    const resp = await request.get(`${API_URL}/api/finance/payable/list`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await resp.json();
    expect(data.code === 200 || data.success).toBe(true);
  });

  test('10.8 Payable Page', async ({ request }) => {
    const resp = await request.get(`${API_URL}/api/finance/payable/page?current=1&size=10`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await resp.json();
    expect(data.code === 200 || data.success).toBe(true);
  });

  test('10.9 Account Transaction List', async ({ request }) => {
    const resp = await request.get(`${API_URL}/api/finance/account-trans/list`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await resp.json();
    expect(data.code === 200 || data.success).toBe(true);
  });

  test('10.10 Invoice List', async ({ request }) => {
    const resp = await request.get(`${API_URL}/api/finance/invoice/list`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await resp.json();
    expect(data.code === 200 || data.success).toBe(true);
  });

  test('10.11 Expense List', async ({ request }) => {
    const resp = await request.get(`${API_URL}/api/finance/expense/list`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await resp.json();
    expect(data.code === 200 || data.success).toBe(true);
  });

  test('10.12 Customer Reconciliation', async ({ request }) => {
    const resp = await request.get(`${API_URL}/api/finance/customer-reconciliation/list`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await resp.json();
    expect(data.code === 200 || data.success).toBe(true);
  });

  test('10.13 Supplier Reconciliation', async ({ request }) => {
    const resp = await request.get(`${API_URL}/api/finance/supplier-reconciliation/list`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await resp.json();
    expect(data.code === 200 || data.success).toBe(true);
  });
});

// ========== 11. REPORT MODULE ==========
test.describe('Report Module (报表管理)', () => {
  let token: string;

  test.beforeAll(async ({ request }) => {
    token = await loginApi(request);
  });

  test('11.1 Dashboard Report', async ({ request }) => {
    const resp = await request.get(`${API_URL}/api/report/dashboard`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await resp.json();
    expect(data.code === 200 || data.success).toBe(true);
  });

  test('11.2 Sales Report', async ({ request }) => {
    const resp = await request.get(`${API_URL}/api/report/sales`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await resp.json();
    expect(data.code === 200 || data.success).toBe(true);
  });

  test('11.3 Purchase Report', async ({ request }) => {
    const resp = await request.get(`${API_URL}/api/report/purchase`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await resp.json();
    expect(data.code === 200 || data.success).toBe(true);
  });

  test('11.4 Inventory Report', async ({ request }) => {
    const resp = await request.get(`${API_URL}/api/report/inventory`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await resp.json();
    expect(data.code === 200 || data.success).toBe(true);
  });

  test('11.5 Finance Report', async ({ request }) => {
    const resp = await request.get(`${API_URL}/api/report/finance`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await resp.json();
    expect(data.code === 200 || data.success).toBe(true);
  });

  test('11.6 Customer Analysis', async ({ request }) => {
    const resp = await request.get(`${API_URL}/api/report/customer`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await resp.json();
    expect(data.code === 200 || data.success).toBe(true);
  });

  test('11.7 Supplier Analysis', async ({ request }) => {
    const resp = await request.get(`${API_URL}/api/report/supplier`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await resp.json();
    expect(data.code === 200 || data.success).toBe(true);
  });

  test('11.8 Profit Margin Report', async ({ request }) => {
    const resp = await request.get(`${API_URL}/api/report/profit-margin`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await resp.json();
    expect(data.code === 200 || data.success).toBe(true);
  });

  test('11.9 Low Stock Report', async ({ request }) => {
    const resp = await request.get(`${API_URL}/api/report/low-stock`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await resp.json();
    expect(data.code === 200 || data.success).toBe(true);
  });
});