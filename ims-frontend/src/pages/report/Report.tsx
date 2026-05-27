import React, { useState, useEffect } from 'react';
import {
  Table,
  Card,
  Row,
  Col,
  DatePicker,
  Button,
  Space,
  Statistic,
  Tabs,
  Tag,
  message,
  Dropdown,
} from 'antd';
import {
  BarChartOutlined,
  LineChartOutlined,
  PieChartOutlined,
  TableOutlined,
  DownOutlined,
} from '@ant-design/icons';
import { reportApi, financeApi } from '../../api';
import { useAuthStore } from '../../stores/authStore';
import { useExportTemplateStore } from '../../stores/exportTemplateStore';
import ExportFieldSelector from '../../components/ExportFieldSelector';
import dayjs from 'dayjs';
const { RangePicker } = DatePicker;

// 报表字段配置
const reportFieldsConfig: Record<string, { key: string; title: string }[]> = {
  sales: [
    { key: 'reportDate', title: '日期' },
    { key: 'totalSalesAmount', title: '销售额' },
    { key: 'totalOrderCount', title: '订单数' },
    { key: 'avgOrderAmount', title: '平均订单金额' },
    { key: 'discountAmount', title: '折扣金额' },
    { key: 'returnAmount', title: '退货金额' },
    { key: 'netAmount', title: '净销售额' },
  ],
  purchase: [
    { key: 'reportDate', title: '日期' },
    { key: 'totalPurchaseAmount', title: '采购额' },
    { key: 'totalOrderCount', title: '订单数' },
    { key: 'avgOrderAmount', title: '平均订单金额' },
    { key: 'returnAmount', title: '退货金额' },
    { key: 'netAmount', title: '净采购额' },
  ],
  customerAnalysis: [
    { key: 'customerName', title: '客户名称' },
    { key: 'totalSalesAmount', title: '销售总额' },
    { key: 'orderCount', title: '订单数' },
    { key: 'avgOrderAmount', title: '平均订单金额' },
    { key: 'paymentReceived', title: '已收款' },
    { key: 'paymentRate', title: '收款率' },
  ],
  productAnalysis: [
    { key: 'productCode', title: '商品编码' },
    { key: 'productName', title: '商品名称' },
    { key: 'categoryName', title: '分类' },
    { key: 'totalSalesAmount', title: '销售额' },
    { key: 'totalPurchaseAmount', title: '采购额' },
    { key: 'profit', title: '利润' },
    { key: 'profitRate', title: '利润率' },
  ],
  supplierAnalysis: [
    { key: 'supplierName', title: '供应商名称' },
    { key: 'totalPurchaseAmount', title: '采购总额' },
    { key: 'orderCount', title: '订单数' },
    { key: 'avgOrderAmount', title: '平均订单金额' },
    { key: 'paymentMade', title: '已付款' },
    { key: 'paymentRate', title: '付款率' },
  ],
  lowStock: [
    { key: 'productCode', title: '商品编码' },
    { key: 'productName', title: '商品名称' },
    { key: 'warehouseName', title: '仓库' },
    { key: 'quantity', title: '当前库存' },
    { key: 'minQuantity', title: '最低库存' },
    { key: 'level', title: '预警等级' },
  ],
};

// CSV导出工具函数
const exportToCSV = (columns: any[], data: any[], filename: string, selectedFields?: string[]) => {
  if (data.length === 0) {
    message.warning('没有数据可导出');
    return;
  }
  // 如果指定了字段，只导出选中字段
  const colsToExport = selectedFields
    ? columns.filter(c => selectedFields.includes(c.key))
    : columns;
  const headers = colsToExport.map(c => c.title).join(',');
  const rows = data.map((row: any) =>
    colsToExport.map(c => {
      const val = c.render ? c.render(row[c.dataIndex], row) : (row[c.dataIndex] ?? '');
      const str = typeof val === 'string' ? val.replace(/,/g, ' ') : val;
      return str;
    }).join(',')
  );
  const csv = [headers, ...rows].join('\n');
  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}_${dayjs().format('YYYYMMDD')}.csv`;
  link.click();
  URL.revokeObjectURL(url);
  message.success('导出成功');
};

// ============ 销售报表数据类型 ============
interface SalesReport {
  reportDate: string;
  totalSalesAmount: number;
  totalOrderCount: number;
  avgOrderAmount: number;
  discountAmount: number;
  returnAmount: number;
  netAmount: number;
}

// ============ 采购报表数据类型 ============
interface PurchaseReport {
  reportDate: string;
  totalPurchaseAmount: number;
  totalOrderCount: number;
  avgOrderAmount: number;
  returnAmount: number;
  netAmount: number;
}

// ============ 库存报表数据类型 ============
interface InventoryReport {
  productId: number;
  productName: string;
  productCode: string;
  warehouseName: string;
  quantity: number;
  minQuantity: number;
  maxQuantity: number;
  idleDays: number;
  status: string;
}

interface LowStockAlert {
  productId: number;
  productName: string;
  productCode: string;
  warehouseName: string;
  quantity: number;
  minQuantity: number;
}

// ============ 财务分析数据类型 ============
interface FinanceSummary {
  totalIncome: number;
  totalExpense: number;
  netProfit: number;
  profitMargin?: number;
}

// ============ 客户分析数据类型 ============
interface CustomerAnalysis {
  customerId: number;
  customerName: string;
  totalSalesAmount: number;
  orderCount: number;
  avgOrderAmount: number;
  paymentReceived: number;
  paymentRate: number;
}

// ============ 商品分析数据类型 ============
interface ProductAnalysis {
  productId: number;
  productName: string;
  productCode: string;
  categoryName: string;
  totalSalesAmount: number;
  totalPurchaseAmount: number;
  profit: number;
  profitRate: number;
}

// ============ 供应商分析数据类型 ============
interface SupplierAnalysis {
  supplierId: number;
  supplierName: string;
  totalPurchaseAmount: number;
  orderCount: number;
  avgOrderAmount: number;
  paymentMade: number;
  paymentRate: number;
}

// ============ 账龄分析数据类型 ============
interface ReceivableAging {
  customerId: number;
  customerName: string;
  totalAmount: number;
  amount0to30: number;
  amount31to60: number;
  amount61to90: number;
  amountOver90: number;
  overdueAmount: number;
}

interface PayableAging {
  supplierId: number;
  supplierName: string;
  totalAmount: number;
  amount0to30: number;
  amount31to60: number;
  amount61to90: number;
  amountOver90: number;
  overdueAmount: number;
}

const ReportPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('sales');
  const { permissions } = useAuthStore();
  const { templates, addTemplate, getTemplatesByType } = useExportTemplateStore();

  // 导出模态框状态
  const [exportModalVisible, setExportModalVisible] = useState(false);
  const [exportModalData, setExportModalData] = useState<{
    reportType: string;
    columns: any[];
    data: any[];
    filename: string;
  } | null>(null);

  const tabPermissionMap: Record<string, string[]> = {
    sales: ['report:dashboard', 'report:dashboard:read'],
    purchase: ['purchase:order', 'purchase:order:read'],
    inventory: ['inventory:account', 'inventory:account:read'],
    finance: ['finance:stat', 'finance:stat:read'],
    customerAnalysis: ['customer:customer', 'customer:customer:read'],
    productAnalysis: ['product:product', 'product:product:read'],
    supplierAnalysis: ['supplier', 'supplier:read'],
    aging: ['finance:receivable', 'finance:payable'],
  };

  const hasTabPermission = (tab: string): boolean => {
    const requiredPerms = tabPermissionMap[tab] || [];
    if (requiredPerms.length === 0) return true;
    return requiredPerms.some(perm => {
      if (permissions.includes(perm)) return true;
      if (permissions.some(p => p.startsWith(perm + ':') || p === perm)) return true;
      return false;
    });
  };

  const visibleTabs = [
    { key: 'sales', label: '销售报表', icon: <BarChartOutlined /> },
    { key: 'purchase', label: '采购报表', icon: <LineChartOutlined /> },
    { key: 'inventory', label: '库存报表', icon: <PieChartOutlined /> },
    { key: 'finance', label: '财务分析', icon: <TableOutlined /> },
    { key: 'aging', label: '账龄分析', icon: <BarChartOutlined /> },
    { key: 'customerAnalysis', label: '客户分析', icon: <BarChartOutlined /> },
    { key: 'productAnalysis', label: '商品分析', icon: <LineChartOutlined /> },
    { key: 'supplierAnalysis', label: '供应商分析', icon: <PieChartOutlined /> },
  ].filter(tab => hasTabPermission(tab.key));

  useEffect(() => {
    if (!hasTabPermission(activeTab) && visibleTabs.length > 0) {
      setActiveTab(visibleTabs[0].key);
    }
  }, [activeTab, visibleTabs]);

  // 日期范围
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(null);

  // 销售报表状态
  const [salesLoading, setSalesLoading] = useState(false);
  const [salesData, setSalesData] = useState<SalesReport[]>([]);
  const [salesSummary, setSalesSummary] = useState<SalesReport | null>(null);

  // 采购报表状态
  const [purchaseLoading, setPurchaseLoading] = useState(false);
  const [purchaseData, setPurchaseData] = useState<PurchaseReport[]>([]);
  const [purchaseSummary, setPurchaseSummary] = useState<PurchaseReport | null>(null);

  // 库存报表状态
  const [inventoryLoading, setInventoryLoading] = useState(false);
  const [inventoryData, setInventoryData] = useState<InventoryReport[]>([]);
  const [lowStockData, setLowStockData] = useState<LowStockAlert[]>([]);

  // 财务分析状态
  const [financeLoading, setFinanceLoading] = useState(false);
  const [financeSummary, setFinanceSummary] = useState<FinanceSummary | null>(null);

  // 客户分析状态
  const [customerAnalysisLoading, setCustomerAnalysisLoading] = useState(false);
  const [customerAnalysisData, setCustomerAnalysisData] = useState<CustomerAnalysis[]>([]);

  // 商品分析状态
  const [productAnalysisLoading, setProductAnalysisLoading] = useState(false);
  const [productAnalysisData, setProductAnalysisData] = useState<ProductAnalysis[]>([]);

  // 供应商分析状态
  const [supplierAnalysisLoading, setSupplierAnalysisLoading] = useState(false);
  const [supplierAnalysisData, setSupplierAnalysisData] = useState<SupplierAnalysis[]>([]);

  // 账龄分析状态
  const [agingLoading, setAgingLoading] = useState(false);
  const [receivableAgingData, setReceivableAgingData] = useState<ReceivableAging[]>([]);
  const [payableAgingData, setPayableAgingData] = useState<PayableAging[]>([]);

  useEffect(() => {
    fetchSalesReport();
    fetchPurchaseReport();
    fetchInventoryReport();
    fetchLowStock();
    fetchFinanceSummary();
    fetchCustomerAnalysis();
    fetchProductAnalysis();
    fetchSupplierAnalysis();
  }, []);

  const getDateParams = () => {
    if (dateRange) {
      return {
        startDate: dateRange[0].format('YYYY-MM-DD'),
        endDate: dateRange[1].format('YYYY-MM-DD'),
      };
    }
    return {};
  };

  // ============ 销售报表 ============
  const fetchSalesReport = async () => {
    setSalesLoading(true);
    try {
      const res = await reportApi.get('/report/sales/summary', { params: getDateParams() });
      if (res.data?.code === 200) {
        const data = res.data.data || [];
        setSalesData(data);
        if (data.length > 0) {
          const summary = data[data.length - 1];
          setSalesSummary({
            reportDate: '汇总',
            totalSalesAmount: data.reduce((sum: number, item: SalesReport) => sum + (item.totalSalesAmount || 0), 0),
            totalOrderCount: data.reduce((sum: number, item: SalesReport) => sum + (item.totalOrderCount || 0), 0),
            avgOrderAmount: summary.avgOrderAmount || 0,
            discountAmount: data.reduce((sum: number, item: SalesReport) => sum + (item.discountAmount || 0), 0),
            returnAmount: data.reduce((sum: number, item: SalesReport) => sum + (item.returnAmount || 0), 0),
            netAmount: data.reduce((sum: number, item: SalesReport) => sum + (item.netAmount || 0), 0),
          });
        }
      }
    } catch (error) {
      console.error('Failed to fetch sales report:', error);
    } finally {
      setSalesLoading(false);
    }
  };

  // ============ 采购报表 ============
  const fetchPurchaseReport = async () => {
    setPurchaseLoading(true);
    try {
      const res = await reportApi.get('/report/purchase/summary', { params: getDateParams() });
      if (res.data?.code === 200) {
        const data = res.data.data || [];
        setPurchaseData(data);
        if (data.length > 0) {
          setPurchaseSummary({
            reportDate: '汇总',
            totalPurchaseAmount: data.reduce((sum: number, item: PurchaseReport) => sum + (item.totalPurchaseAmount || 0), 0),
            totalOrderCount: data.reduce((sum: number, item: PurchaseReport) => sum + (item.totalOrderCount || 0), 0),
            avgOrderAmount: data[0].avgOrderAmount || 0,
            returnAmount: data.reduce((sum: number, item: PurchaseReport) => sum + (item.returnAmount || 0), 0),
            netAmount: data.reduce((sum: number, item: PurchaseReport) => sum + (item.netAmount || 0), 0),
          });
        }
      }
    } catch (error) {
      console.error('Failed to fetch purchase report:', error);
    } finally {
      setPurchaseLoading(false);
    }
  };

  // ============ 库存报表 ============
  const fetchInventoryReport = async () => {
    setInventoryLoading(true);
    try {
      const res = await reportApi.get('/report/inventory/list');
      if (res.data?.code === 200) {
        setInventoryData(res.data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch inventory report:', error);
    } finally {
      setInventoryLoading(false);
    }
  };

  const fetchLowStock = async () => {
    try {
      const res = await reportApi.get('/report/inventory/low-stock');
      if (res.data?.code === 200) {
        setLowStockData(res.data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch low stock:', error);
    }
  };

  // ============ 财务分析 ============
  const fetchFinanceSummary = async () => {
    setFinanceLoading(true);
    try {
      const res = await reportApi.get('/report/finance/summary', { params: getDateParams() });
      if (res.data?.code === 200) {
        const data = res.data.data;
        if (data) {
          const totalIncome = data.totalIncome || 0;
          const totalExpense = data.totalExpense || 0;
          const netProfit = data.netProfit || 0;
          const profitMargin = totalIncome > 0 ? (netProfit / totalIncome) : 0;
          setFinanceSummary({
            totalIncome,
            totalExpense,
            netProfit,
            profitMargin,
          });
        }
      }
    } catch (error) {
      console.error('Failed to fetch finance summary:', error);
    } finally {
      setFinanceLoading(false);
    }
  };

  // ============ 客户分析 ============
  const fetchCustomerAnalysis = async () => {
    setCustomerAnalysisLoading(true);
    try {
      const res = await reportApi.get('/report/analysis/customer', { params: getDateParams() });
      if (res.data?.code === 200) {
        setCustomerAnalysisData(res.data.data || []);
      } else {
        setCustomerAnalysisData(res.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch customer analysis:', error);
    } finally {
      setCustomerAnalysisLoading(false);
    }
  };

  // ============ 商品分析 ============
  const fetchProductAnalysis = async () => {
    setProductAnalysisLoading(true);
    try {
      const res = await reportApi.get('/report/analysis/product', { params: getDateParams() });
      if (res.data?.code === 200) {
        setProductAnalysisData(res.data.data || []);
      } else {
        setProductAnalysisData(res.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch product analysis:', error);
    } finally {
      setProductAnalysisLoading(false);
    }
  };

  // ============ 供应商分析 ============
  const fetchSupplierAnalysis = async () => {
    setSupplierAnalysisLoading(true);
    try {
      const res = await reportApi.get('/report/analysis/supplier', { params: getDateParams() });
      if (res.data?.code === 200) {
        setSupplierAnalysisData(res.data.data || []);
      } else {
        setSupplierAnalysisData(res.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch supplier analysis:', error);
    } finally {
      setSupplierAnalysisLoading(false);
    }
  };

  // ============ 账龄分析 ============
  const fetchReceivableAging = async () => {
    setAgingLoading(true);
    try {
      const res = await financeApi.get('/receivable/aging');
      if (res.data?.code === 200) {
        setReceivableAgingData(res.data.data || []);
      } else {
        setReceivableAgingData(res.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch receivable aging:', error);
    } finally {
      setAgingLoading(false);
    }
  };

  const fetchPayableAging = async () => {
    try {
      const res = await financeApi.get('/payable/aging');
      if (res.data?.code === 200) {
        setPayableAgingData(res.data.data || []);
      } else {
        setPayableAgingData(res.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch payable aging:', error);
    }
  };

  const handleSearch = () => {
    if (activeTab === 'sales') {
      fetchSalesReport();
    } else if (activeTab === 'purchase') {
      fetchPurchaseReport();
    } else if (activeTab === 'finance') {
      fetchFinanceSummary();
    } else if (activeTab === 'aging') {
      fetchReceivableAging();
      fetchPayableAging();
    } else if (activeTab === 'customerAnalysis') {
      fetchCustomerAnalysis();
    } else if (activeTab === 'productAnalysis') {
      fetchProductAnalysis();
    } else if (activeTab === 'supplierAnalysis') {
      fetchSupplierAnalysis();
    }
  };

  // ============ 表格列定义 ============
  const salesColumns = [
    { title: '日期', dataIndex: 'reportDate', key: 'reportDate', width: 120 },
    { title: '销售额', dataIndex: 'totalSalesAmount', key: 'totalSalesAmount', width: 120, render: (v: number) => `¥${v?.toFixed(2) || '0.00'}` },
    { title: '订单数', dataIndex: 'totalOrderCount', key: 'totalOrderCount', width: 80 },
    { title: '平均订单金额', dataIndex: 'avgOrderAmount', key: 'avgOrderAmount', width: 130, render: (v: number) => `¥${v?.toFixed(2) || '0.00'}` },
    { title: '折扣金额', dataIndex: 'discountAmount', key: 'discountAmount', width: 100, render: (v: number) => v ? `¥${v.toFixed(2)}` : '-' },
    { title: '退货金额', dataIndex: 'returnAmount', key: 'returnAmount', width: 100, render: (v: number) => v ? `¥${v.toFixed(2)}` : '-' },
    { title: '净销售额', dataIndex: 'netAmount', key: 'netAmount', width: 120, render: (v: number) => `¥${v?.toFixed(2) || '0.00'}` },
  ];

  const purchaseColumns = [
    { title: '日期', dataIndex: 'reportDate', key: 'reportDate', width: 120 },
    { title: '采购额', dataIndex: 'totalPurchaseAmount', key: 'totalPurchaseAmount', width: 120, render: (v: number) => `¥${v?.toFixed(2) || '0.00'}` },
    { title: '订单数', dataIndex: 'totalOrderCount', key: 'totalOrderCount', width: 80 },
    { title: '平均订单金额', dataIndex: 'avgOrderAmount', key: 'avgOrderAmount', width: 130, render: (v: number) => `¥${v?.toFixed(2) || '0.00'}` },
    { title: '退货金额', dataIndex: 'returnAmount', key: 'returnAmount', width: 100, render: (v: number) => v ? `¥${v.toFixed(2)}` : '-' },
    { title: '净采购额', dataIndex: 'netAmount', key: 'netAmount', width: 120, render: (v: number) => `¥${v?.toFixed(2) || '0.00'}` },
  ];

  const inventoryColumns = [
    { title: '商品编码', dataIndex: 'productCode', key: 'productCode', width: 120 },
    { title: '商品名称', dataIndex: 'productName', key: 'productName', width: 180 },
    { title: '仓库', dataIndex: 'warehouseName', key: 'warehouseName', width: 120 },
    { title: '当前库存', dataIndex: 'quantity', key: 'quantity', width: 100 },
    { title: '最小库存', dataIndex: 'minQuantity', key: 'minQuantity', width: 100 },
    { title: '最大库存', dataIndex: 'maxQuantity', key: 'maxQuantity', width: 100 },
    { title: '闲置天数', dataIndex: 'idleDays', key: 'idleDays', width: 100 },
    { title: '状态', dataIndex: 'status', key: 'status', width: 100, render: (v: string) => {
      const map: Record<string, { text: string; color: string }> = {
        'NORMAL': { text: '正常', color: 'green' },
        'LOW': { text: '偏低', color: 'orange' },
        'HIGH': { text: '偏高', color: 'blue' },
        'IDLE': { text: '呆滞', color: 'red' },
      };
      const s = map[v] || { text: v, color: 'default' };
      return <Tag color={s.color}>{s.text}</Tag>;
    }},
  ];

  const lowStockColumns = [
    { title: '商品编码', dataIndex: 'productCode', key: 'productCode', width: 120 },
    { title: '商品名称', dataIndex: 'productName', key: 'productName', width: 180 },
    { title: '仓库', dataIndex: 'warehouseName', key: 'warehouseName', width: 120 },
    { title: '当前库存', dataIndex: 'quantity', key: 'quantity', width: 100 },
    { title: '最低库存', dataIndex: 'minQuantity', key: 'minQuantity', width: 100 },
    {
      title: '预警等级',
      key: 'level',
      width: 100,
      render: (_: any, record: LowStockAlert) => {
        const ratio = record.quantity / record.minQuantity;
        if (ratio <= 0.5) return <Tag color="red">严重不足</Tag>;
        if (ratio <= 1) return <Tag color="orange">即将断货</Tag>;
        return <Tag color="green">需要补充</Tag>;
      },
    },
  ];

  // ============ 分析报表列定义 ============
  const customerAnalysisColumns = [
    { title: '客户名称', dataIndex: 'customerName', key: 'customerName', width: 180 },
    { title: '销售总额', dataIndex: 'totalSalesAmount', key: 'totalSalesAmount', width: 120, render: (v: number) => `¥${v?.toFixed(2) || '0.00'}` },
    { title: '订单数', dataIndex: 'orderCount', key: 'orderCount', width: 80 },
    { title: '平均订单金额', dataIndex: 'avgOrderAmount', key: 'avgOrderAmount', width: 130, render: (v: number) => `¥${v?.toFixed(2) || '0.00'}` },
    { title: '已收款', dataIndex: 'paymentReceived', key: 'paymentReceived', width: 120, render: (v: number) => `¥${v?.toFixed(2) || '0.00'}` },
    { title: '收款率', dataIndex: 'paymentRate', key: 'paymentRate', width: 100, render: (v: number) => v ? `${(v * 100).toFixed(1)}%` : '-' },
  ];

  const productAnalysisColumns = [
    { title: '商品编码', dataIndex: 'productCode', key: 'productCode', width: 120 },
    { title: '商品名称', dataIndex: 'productName', key: 'productName', width: 180 },
    { title: '分类', dataIndex: 'categoryName', key: 'categoryName', width: 120 },
    { title: '销售额', dataIndex: 'totalSalesAmount', key: 'totalSalesAmount', width: 120, render: (v: number) => `¥${v?.toFixed(2) || '0.00'}` },
    { title: '采购额', dataIndex: 'totalPurchaseAmount', key: 'totalPurchaseAmount', width: 120, render: (v: number) => `¥${v?.toFixed(2) || '0.00'}` },
    { title: '利润', dataIndex: 'profit', key: 'profit', width: 100, render: (v: number) => v ? `¥${v.toFixed(2)}` : '-' },
    { title: '利润率', dataIndex: 'profitRate', key: 'profitRate', width: 100, render: (v: number) => v ? `${(v * 100).toFixed(1)}%` : '-' },
  ];

  const supplierAnalysisColumns = [
    { title: '供应商名称', dataIndex: 'supplierName', key: 'supplierName', width: 180 },
    { title: '采购总额', dataIndex: 'totalPurchaseAmount', key: 'totalPurchaseAmount', width: 120, render: (v: number) => `¥${v?.toFixed(2) || '0.00'}` },
    { title: '订单数', dataIndex: 'orderCount', key: 'orderCount', width: 80 },
    { title: '平均订单金额', dataIndex: 'avgOrderAmount', key: 'avgOrderAmount', width: 130, render: (v: number) => `¥${v?.toFixed(2) || '0.00'}` },
    { title: '已付款', dataIndex: 'paymentMade', key: 'paymentMade', width: 120, render: (v: number) => `¥${v?.toFixed(2) || '0.00'}` },
    { title: '付款率', dataIndex: 'paymentRate', key: 'paymentRate', width: 100, render: (v: number) => v ? `${(v * 100).toFixed(1)}%` : '-' },
  ];

  return (
    <div>
      <h2 style={{ marginBottom: 16 }}>报表中心</h2>

      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <Space>
          <RangePicker onChange={(dates) => setDateRange(dates as any)} />
          <Button type="primary" onClick={handleSearch}>查询</Button>
        </Space>
      </div>

      <Tabs activeKey={activeTab} onChange={setActiveTab as any} items={visibleTabs.map(tab => {
        if (tab.key === 'sales') return {
          key: 'sales',
          label: <span><BarChartOutlined /> 销售报表</span>,
          children: (<>
            <Row gutter={16} style={{ marginBottom: 16 }}>
              <Col span={6}><Card><Statistic title="总销售额" value={salesSummary?.totalSalesAmount || 0} precision={2} prefix="¥" loading={salesLoading} /></Card></Col>
              <Col span={6}><Card><Statistic title="净销售额" value={salesSummary?.netAmount || 0} precision={2} prefix="¥" loading={salesLoading} /></Card></Col>
              <Col span={6}><Card><Statistic title="总订单数" value={salesSummary?.totalOrderCount || 0} loading={salesLoading} /></Card></Col>
              <Col span={6}><Card><Statistic title="退货金额" value={salesSummary?.returnAmount || 0} precision={2} prefix="¥" loading={salesLoading} /></Card></Col>
            </Row>
            <div style={{ marginBottom: 8, textAlign: 'right' }}>
              <Button onClick={() => {
                setExportModalData({ reportType: 'sales', columns: salesColumns, data: salesData, filename: 'sales_report' });
                setExportModalVisible(true);
              }}>导出CSV</Button>
            </div>
            <Table title={() => '销售汇总'} columns={salesColumns} dataSource={salesData} rowKey="reportDate" loading={salesLoading} pagination={{ pageSize: 10 }} scroll={{ x: 800 }} />
          </>),
        };
        if (tab.key === 'purchase') return {
          key: 'purchase',
          label: <span><LineChartOutlined /> 采购报表</span>,
          children: (<>
            <Row gutter={16} style={{ marginBottom: 16 }}>
              <Col span={6}><Card><Statistic title="总采购额" value={purchaseSummary?.totalPurchaseAmount || 0} precision={2} prefix="¥" loading={purchaseLoading} /></Card></Col>
              <Col span={6}><Card><Statistic title="净采购额" value={purchaseSummary?.netAmount || 0} precision={2} prefix="¥" loading={purchaseLoading} /></Card></Col>
              <Col span={6}><Card><Statistic title="总订单数" value={purchaseSummary?.totalOrderCount || 0} loading={purchaseLoading} /></Card></Col>
              <Col span={6}><Card><Statistic title="退货金额" value={purchaseSummary?.returnAmount || 0} precision={2} prefix="¥" loading={purchaseLoading} /></Card></Col>
            </Row>
            <div style={{ marginBottom: 8, textAlign: 'right' }}>
              <Button onClick={() => {
                setExportModalData({ reportType: 'purchase', columns: purchaseColumns, data: purchaseData, filename: 'purchase_report' });
                setExportModalVisible(true);
              }}>导出CSV</Button>
            </div>
            <Table title={() => '采购汇总'} columns={purchaseColumns} dataSource={purchaseData} rowKey="reportDate" loading={purchaseLoading} pagination={{ pageSize: 10 }} scroll={{ x: 700 }} />
          </>),
        };
        if (tab.key === 'inventory') return {
          key: 'inventory',
          label: <span><PieChartOutlined /> 库存报表</span>,
          children: (<>
            <Row gutter={16} style={{ marginBottom: 16 }}>
              <Col span={8}><Card title="库存概览"><Statistic title="库存商品种类" value={inventoryData.length} loading={inventoryLoading} /></Card></Col>
              <Col span={8}><Card title="低库存预警"><Statistic title="预警商品数" value={lowStockData.length} loading={inventoryLoading} valueStyle={{ color: lowStockData.length > 0 ? '#cf1322' : '#3f8600' }} /></Card></Col>
              <Col span={8}><Card title="呆滞库存"><Statistic title="呆滞商品数" value={inventoryData.filter(item => item.status === 'IDLE').length} loading={inventoryLoading} /></Card></Col>
            </Row>
            <div style={{ marginBottom: 8, textAlign: 'right' }}>
              <Button onClick={() => {
                setExportModalData({ reportType: 'lowStock', columns: lowStockColumns, data: lowStockData, filename: 'low_stock' });
                setExportModalVisible(true);
              }}>导出低库存</Button>
            </div>
            <Table title={() => '低库存预警'} columns={lowStockColumns} dataSource={lowStockData} rowKey="productId" loading={inventoryLoading} pagination={{ pageSize: 10 }} scroll={{ x: 800 }} />
            <Table title={() => '库存列表'} columns={inventoryColumns} dataSource={inventoryData} rowKey="productId" loading={inventoryLoading} pagination={{ pageSize: 10 }} scroll={{ x: 900 }} style={{ marginTop: 16 }} />
          </>),
        };
        if (tab.key === 'finance') return {
          key: 'finance',
          label: <span><TableOutlined /> 财务分析</span>,
          children: (<>
            <Row gutter={16} style={{ marginBottom: 16 }}>
              <Col span={6}><Card><Statistic title="总收入" value={financeSummary?.totalIncome || 0} precision={2} prefix="¥" loading={financeLoading} valueStyle={{ color: '#3f8600' }} /></Card></Col>
              <Col span={6}><Card><Statistic title="总支出" value={financeSummary?.totalExpense || 0} precision={2} prefix="¥" loading={financeLoading} valueStyle={{ color: '#cf1322' }} /></Card></Col>
              <Col span={6}><Card><Statistic title="净利润" value={financeSummary?.netProfit || 0} precision={2} prefix="¥" loading={financeLoading} valueStyle={{ color: (financeSummary?.netProfit || 0) >= 0 ? '#3f8600' : '#cf1322' }} /></Card></Col>
              <Col span={6}><Card><Statistic title="毛利率" value={financeSummary?.profitMargin ? (financeSummary.profitMargin * 100).toFixed(1) : '0.0'} suffix="%" loading={financeLoading} valueStyle={{ color: (financeSummary?.profitMargin || 0) >= 0 ? '#3f8600' : '#cf1322' }} /></Card></Col>
            </Row>
          </>),
        };
        if (tab.key === 'customerAnalysis') return {
          key: 'customerAnalysis',
          label: <span><BarChartOutlined /> 客户分析</span>,
          children: (<>
            <div style={{ marginBottom: 8, textAlign: 'right' }}>
              <Button onClick={() => {
                setExportModalData({ reportType: 'customerAnalysis', columns: customerAnalysisColumns, data: customerAnalysisData, filename: 'customer_analysis' });
                setExportModalVisible(true);
              }}>导出CSV</Button>
            </div>
            <Table title={() => '客户销售排行'} columns={customerAnalysisColumns} dataSource={customerAnalysisData} rowKey="customerId" loading={customerAnalysisLoading} pagination={{ pageSize: 10 }} scroll={{ x: 1000 }} />
          </>),
        };
        if (tab.key === 'productAnalysis') return {
          key: 'productAnalysis',
          label: <span><LineChartOutlined /> 商品分析</span>,
          children: (<>
            <div style={{ marginBottom: 8, textAlign: 'right' }}>
              <Button onClick={() => {
                setExportModalData({ reportType: 'productAnalysis', columns: productAnalysisColumns, data: productAnalysisData, filename: 'product_analysis' });
                setExportModalVisible(true);
              }}>导出CSV</Button>
            </div>
            <Table title={() => '商品销售利润分析'} columns={productAnalysisColumns} dataSource={productAnalysisData} rowKey="productId" loading={productAnalysisLoading} pagination={{ pageSize: 10 }} scroll={{ x: 1200 }} />
          </>),
        };
        if (tab.key === 'supplierAnalysis') return {
          key: 'supplierAnalysis',
          label: <span><PieChartOutlined /> 供应商分析</span>,
          children: (<>
            <div style={{ marginBottom: 8, textAlign: 'right' }}>
              <Button onClick={() => {
                setExportModalData({ reportType: 'supplierAnalysis', columns: supplierAnalysisColumns, data: supplierAnalysisData, filename: 'supplier_analysis' });
                setExportModalVisible(true);
              }}>导出CSV</Button>
            </div>
            <Table title={() => '供应商采购排行'} columns={supplierAnalysisColumns} dataSource={supplierAnalysisData} rowKey="supplierId" loading={supplierAnalysisLoading} pagination={{ pageSize: 10 }} scroll={{ x: 1000 }} />
          </>),
        };
        if (tab.key === 'aging') return {
          key: 'aging',
          label: <span><BarChartOutlined /> 账龄分析</span>,
          children: (
            <>
              <Card title="应收账款账龄" style={{ marginBottom: 16 }}>
                <Table
                  columns={[
                    { title: '客户名称', dataIndex: 'customerName', key: 'customerName', width: 150 },
                    { title: '应收总额', dataIndex: 'totalAmount', key: 'totalAmount', width: 120, render: (v: number) => `¥${v?.toFixed(2) || '0.00'}` },
                    { title: '0-30天', dataIndex: 'amount0to30', key: 'amount0to30', width: 100, render: (v: number) => `¥${v?.toFixed(2) || '0.00'}` },
                    { title: '31-60天', dataIndex: 'amount31to60', key: 'amount31to60', width: 100, render: (v: number) => `¥${v?.toFixed(2) || '0.00'}` },
                    { title: '61-90天', dataIndex: 'amount61to90', key: 'amount61to90', width: 100, render: (v: number) => `¥${v?.toFixed(2) || '0.00'}` },
                    { title: '90天以上', dataIndex: 'amountOver90', key: 'amountOver90', width: 100, render: (v: number) => `¥${v?.toFixed(2) || '0.00'}` },
                    { title: '逾期金额', dataIndex: 'overdueAmount', key: 'overdueAmount', width: 100, render: (v: number) => v > 0 ? <Tag color="red">¥{v?.toFixed(2)}</Tag> : '-' },
                  ]}
                  dataSource={receivableAgingData}
                  rowKey="customerId"
                  loading={agingLoading}
                  pagination={{ pageSize: 5 }}
                  scroll={{ x: 800 }}
                />
              </Card>
              <Card title="应付账款账龄">
                <Table
                  columns={[
                    { title: '供应商名称', dataIndex: 'supplierName', key: 'supplierName', width: 150 },
                    { title: '应付总额', dataIndex: 'totalAmount', key: 'totalAmount', width: 120, render: (v: number) => `¥${v?.toFixed(2) || '0.00'}` },
                    { title: '0-30天', dataIndex: 'amount0to30', key: 'amount0to30', width: 100, render: (v: number) => `¥${v?.toFixed(2) || '0.00'}` },
                    { title: '31-60天', dataIndex: 'amount31to60', key: 'amount31to60', width: 100, render: (v: number) => `¥${v?.toFixed(2) || '0.00'}` },
                    { title: '61-90天', dataIndex: 'amount61to90', key: 'amount61to90', width: 100, render: (v: number) => `¥${v?.toFixed(2) || '0.00'}` },
                    { title: '90天以上', dataIndex: 'amountOver90', key: 'amountOver90', width: 100, render: (v: number) => `¥${v?.toFixed(2) || '0.00'}` },
                    { title: '逾期金额', dataIndex: 'overdueAmount', key: 'overdueAmount', width: 100, render: (v: number) => v > 0 ? <Tag color="red">¥{v?.toFixed(2)}</Tag> : '-' },
                  ]}
                  dataSource={payableAgingData}
                  rowKey="supplierId"
                  loading={agingLoading}
                  pagination={{ pageSize: 5 }}
                  scroll={{ x: 800 }}
                />
              </Card>
            </>
          ),
        };
        return null;
      }).filter(Boolean) as any[]} />

      {/* 导出字段选择模态框 */}
      <ExportFieldSelector
        visible={exportModalVisible}
        onClose={() => setExportModalVisible(false)}
        onExport={(selectedFields) => {
          if (exportModalData) {
            exportToCSV(exportModalData.columns, exportModalData.data, exportModalData.filename, selectedFields);
          }
        }}
        fields={exportModalData ? (reportFieldsConfig[exportModalData.reportType] || []) : []}
        reportType={exportModalData?.reportType || ''}
        savedTemplates={exportModalData ? getTemplatesByType(exportModalData.reportType).map(t => ({ id: t.id, name: t.name, fields: t.fields })) : []}
        onSaveTemplate={(name, fields) => {
          if (exportModalData) {
            addTemplate(name, exportModalData.reportType, fields);
          }
        }}
        onLoadTemplate={(templateId) => {
          const template = templates.find(t => t.id === templateId);
          if (template) {
            setExportModalData(prev => prev ? { ...prev, columns: prev.columns.map(col => ({ ...col, key: col.key || col.dataIndex })) } : null);
          }
        }}
      />
    </div>
  );
};

export default ReportPage;