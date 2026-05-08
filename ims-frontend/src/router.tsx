import { createBrowserRouter, Navigate } from 'react-router-dom';
import AppLayout from './layouts/AppLayout';
import Login from './pages/login/Login';
import Dashboard from './pages/dashboard/Dashboard';
import ProductPage from './pages/product/Product';
import WarehousePage from './pages/warehouse/Warehouse';
import CustomerPage from './pages/customer/Customer';
import SupplierPage from './pages/supplier/Supplier';
import SalesPage from './pages/sales/Sales';
import PurchasePage from './pages/purchase/Purchase';
import InventoryPage from './pages/inventory/Inventory';
import FinancePage from './pages/finance/Finance';
import SystemPage from './pages/system/System';
import ReportPage from './pages/report/Report';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'product', element: <ProductPage /> },
      { path: 'warehouse', element: <WarehousePage /> },
      { path: 'customer', element: <CustomerPage /> },
      { path: 'supplier', element: <SupplierPage /> },
      { path: 'sales', element: <SalesPage /> },
      { path: 'purchase', element: <PurchasePage /> },
      { path: 'inventory', element: <InventoryPage /> },
      { path: 'finance', element: <FinancePage /> },
      { path: 'system', element: <SystemPage /> },
      { path: 'report', element: <ReportPage /> },
    ],
  },
]);