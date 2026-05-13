import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import { reportApi } from '../../api';

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
}

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

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const res = await reportApi.get('/report/dashboard');
      if (res.data.code === 200) {
        setData(res.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 style={{ marginBottom: 24 }}>仪表盘</h1>
      <Row gutter={16}>
        <Col span={6}>
          <Card>
            <Statistic
              title="今日销售额"
              value={data.todaySalesAmount}
              precision={2}
              prefix="¥"
              loading={loading}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="今日采购额"
              value={data.todayPurchaseAmount}
              precision={2}
              prefix="¥"
              loading={loading}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="库存金额"
              value={data.totalInventoryCount}
              precision={2}
              prefix="¥"
              loading={loading}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="今日收款"
              value={data.todayReceiveAmount}
              precision={2}
              prefix="¥"
              loading={loading}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginTop: 24 }}>
        <Col span={12}>
          <Card title="销售趋势">
            <p>近30天销售趋势图表</p>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="库存预警">
            <p>低库存商品预警列表</p>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;