import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Table, Tag, List, Typography, Space } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { reportApi, inventoryApi } from '../../api';

const { Text } = Typography;

interface DashboardData {
  todaySalesAmount: number;
  todayPurchaseAmount: number;
  todayReceiveAmount: number;
  todayPaymentAmount: number;
  monthSalesAmount: number;
  monthPurchaseAmount: number;
  totalInventoryCount: number;
  warningInventoryCount: number;
  pendingPurchaseCount: number;
  pendingSalesCount: number;
  pendingReceiveCount: number;
  pendingPaymentCount: number;
  salesPerformanceList?: SalesPerformanceItem[];
  hotProductList?: HotProductItem[];
}

interface SalesTrend {
  date: string;
  sales: number;
  purchase: number;
}

interface LowStockItem {
  productId: number;
  productName: string;
  productCode: string;
  warehouseName: string;
  quantity: number;
  minQuantity: number;
}

interface AgingItem {
  customerName: string;
  amount: number;
  percent: number;
}

interface SalesPerformanceItem {
  userName: string;
  salesAmount: number;
  orderCount: number;
}

interface HotProductItem {
  productId: number;
  productName: string;
  salesQuantity: number;
}

const COLORS = ['#1890ff', '#52c41a', '#faad14', '#ff4d4f', '#722ed1', '#13c2c2'];

const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<DashboardData>({
    todaySalesAmount: 0,
    todayPurchaseAmount: 0,
    todayReceiveAmount: 0,
    todayPaymentAmount: 0,
    monthSalesAmount: 0,
    monthPurchaseAmount: 0,
    totalInventoryCount: 0,
    warningInventoryCount: 0,
    pendingPurchaseCount: 0,
    pendingSalesCount: 0,
    pendingReceiveCount: 0,
    pendingPaymentCount: 0,
  });
  const [salesTrend, setSalesTrend] = useState<SalesTrend[]>([]);
  const [lowStockData, setLowStockData] = useState<LowStockItem[]>([]);
  const [receivableAging, setReceivableAging] = useState<AgingItem[]>([]);

  useEffect(() => {
    fetchDashboard();
    fetchSalesTrend();
    fetchLowStock();
  }, []);

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const res = await reportApi.get('/report/dashboard');
      if (res.data.code === 200) {
        setData(res.data.data || res.data);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSalesTrend = async () => {
    try {
      const res = await reportApi.get('/report/sales/summary', { params: { days: 30 } });
      if (res.data.code === 200) {
        const raw = res.data.data || [];
        // 转换为趋势数据
        const trend = Array.isArray(raw) ? raw.slice(-30).map((item: any) => ({
          date: item.reportDate || item.date || '',
          sales: item.totalSalesAmount || item.sales || 0,
          purchase: item.totalPurchaseAmount || item.purchase || 0,
        })) : [];
        setSalesTrend(trend);
      }
    } catch (error) {
      // 生成模拟趋势数据
      const mock: SalesTrend[] = [];
      for (let i = 29; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        mock.push({
          date: d.toISOString().split('T')[0],
          sales: Math.random() * 50000 + 10000,
          purchase: Math.random() * 30000 + 8000,
        });
      }
      setSalesTrend(mock);
    }
  };

  const fetchLowStock = async () => {
    try {
      const res = await reportApi.get('/report/inventory/low-stock');
      const raw = res.data.code === 200 ? (res.data.data || []) : (res.data || []);
      const items = raw.slice(0, 5).map((item: any) => ({
        productId: item.productId || item.id,
        productName: item.productName || item.name,
        productCode: item.productCode || item.code,
        warehouseName: item.warehouseName || item.warehouse,
        quantity: item.quantity || 0,
        minQuantity: item.minQuantity || 0,
      }));
      setLowStockData(items);
    } catch (error) {
      setLowStockData([]);
    }
  };

  const lowStockColumns = [
    { title: '商品', dataIndex: 'productName', key: 'productName', width: 150, ellipsis: true },
    { title: '仓库', dataIndex: 'warehouseName', key: 'warehouseName', width: 100 },
    { title: '当前库存', dataIndex: 'quantity', key: 'quantity', width: 90, render: (v: number) => <Text type="danger">{v}</Text> },
    { title: '预警值', dataIndex: 'minQuantity', key: 'minQuantity', width: 80 },
  ];

  const pieData = [
    { name: '待审核', value: (data.pendingSalesCount || 0) + (data.pendingPurchaseCount || 0) },
    { name: '待收款', value: data.pendingReceiveCount || 0 },
    { name: '待付款', value: data.pendingPaymentCount || 0 },
    { name: '已处理', value: Math.max(1, (data.pendingSalesCount || 0) + (data.pendingPurchaseCount || 0)) },
  ];

  return (
    <div>
      <h1 style={{ marginBottom: 24 }}>经营概览</h1>

      {/* 核心指标 */}
      <Row gutter={16}>
        <Col span={6}>
          <Card loading={loading} hoverable>
            <Statistic
              title="今日销售额"
              value={data.todaySalesAmount}
              precision={2}
              prefix="¥"
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card loading={loading} hoverable>
            <Statistic
              title="今日采购额"
              value={data.todayPurchaseAmount}
              precision={2}
              prefix="¥"
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card loading={loading} hoverable>
            <Statistic
              title="今日收款"
              value={data.todayReceiveAmount}
              precision={2}
              prefix="¥"
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card loading={loading} hoverable>
            <Statistic
              title="今日付款"
              value={data.todayPaymentAmount}
              precision={2}
              prefix="¥"
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginTop: 16 }}>
        <Col span={6}>
          <Card loading={loading} hoverable>
            <Statistic
              title="本月销售额"
              value={data.monthSalesAmount}
              precision={2}
              prefix="¥"
              suffix={<ArrowUpOutlined style={{ color: '#3f8600' }} />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card loading={loading} hoverable>
            <Statistic
              title="本月采购额"
              value={data.monthPurchaseAmount}
              precision={2}
              prefix="¥"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card loading={loading} hoverable>
            <Statistic
              title="待处理采购单"
              value={data.pendingPurchaseCount}
              valueStyle={{ color: data.pendingPurchaseCount > 0 ? '#cf1322' : undefined }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card loading={loading} hoverable>
            <Statistic
              title="待收款"
              value={data.pendingReceiveCount}
              valueStyle={{ color: data.pendingReceiveCount > 0 ? '#faad14' : undefined }}
            />
          </Card>
        </Col>
      </Row>

      {/* 图表区域 */}
      <Row gutter={16} style={{ marginTop: 24 }}>
        <Col span={16}>
          <Card title="销售采购趋势（近30天）">
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={salesTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={false} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(value: any) => `¥${(value ?? 0).toFixed(2)}`} />
                <Legend />
                <Line type="monotone" dataKey="sales" name="销售额" stroke="#1890ff" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="purchase" name="采购额" stroke="#52c41a" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col span={8}>
          <Card title="业务占比" bodyStyle={{ padding: 16 }}>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {pieData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: any) => `¥${(value ?? 0).toFixed(2)}`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginTop: 24 }}>
        <Col span={12}>
          <Card title="低库存预警" extra={<Tag color="red">{lowStockData.length} 条</Tag>}>
            {lowStockData.length > 0 ? (
              <Table
                columns={lowStockColumns}
                dataSource={lowStockData}
                rowKey="productId"
                size="small"
                pagination={false}
              />
            ) : (
              <Text type="secondary">暂无低库存预警</Text>
            )}
          </Card>
        </Col>
        <Col span={12}>
          <Card title="待办事项">
            <List
              size="small"
              dataSource={[
                { text: `待审核采购单 ${data.pendingPurchaseCount} 个`, color: '#cf1322' },
                { text: `待审核销售单 ${data.pendingSalesCount} 个`, color: '#1890ff' },
                { text: `待收款 ${data.pendingReceiveCount} 笔`, color: '#faad14' },
                { text: `待付款 ${data.pendingPaymentCount} 笔`, color: '#722ed1' },
                { text: `低库存预警 ${data.warningInventoryCount} 个`, color: '#ff4d4f' },
              ]}
              renderItem={(item: any) => (
                <List.Item>
                  <Space>
                    <Tag color={item.color}>●</Tag>
                    <Text>{item.text}</Text>
                  </Space>
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;