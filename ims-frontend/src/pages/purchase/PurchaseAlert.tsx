import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Space,
  Card,
  Row,
  Col,
  Tag,
  message,
  Tabs,
} from 'antd';
import { BellOutlined, ClockCircleOutlined, WarningOutlined } from '@ant-design/icons';
import { procurementApi } from '../../api';

interface PurchaseOrderAlert {
  id: string;
  orderNo: string;
  supplierName: string;
  expectedDate: string;
  status: number;
  totalAmount: number;
  pendingQuantity: number;
  itemCount: number;
}

const PurchaseAlertPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [incomingData, setIncomingData] = useState<PurchaseOrderAlert[]>([]);
  const [overdueData, setOverdueData] = useState<PurchaseOrderAlert[]>([]);
  const [activeTab, setActiveTab] = useState<'incoming' | 'overdue'>('incoming');

  useEffect(() => {
    fetchIncomingOrders();
    fetchOverdueOrders();
  }, []);

  const fetchIncomingOrders = async () => {
    setLoading(true);
    try {
      const res = await procurementApi.get('/purchase-order/incoming', { params: { days: 7 } });
      if (res.data?.code === 200) {
        setIncomingData(res.data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch incoming orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOverdueOrders = async () => {
    try {
      const res = await procurementApi.get('/purchase-order/overdue');
      if (res.data?.code === 200) {
        setOverdueData(res.data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch overdue orders:', error);
    }
  };

  const handleViewOrder = (orderNo: string) => {
    window.open(`/purchase/order?orderNo=${orderNo}`, '_blank');
  };

  const getStatusTag = (status: number) => {
    const map: Record<number, { text: string; color: string }> = {
      0: { text: '待审核', color: 'orange' },
      1: { text: '已审核', color: 'blue' },
      2: { text: '部分到货', color: 'cyan' },
      3: { text: '已完成', color: 'green' },
      9: { text: '已取消', color: 'red' },
    };
    const s = map[status] || { text: '未知', color: 'default' };
    return <Tag color={s.color}>{s.text}</Tag>;
  };

  const getDaysRemaining = (expectedDate: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expected = new Date(expectedDate);
    expected.setHours(0, 0, 0, 0);
    const diffTime = expected.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getDaysOverdue = (expectedDate: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expected = new Date(expectedDate);
    expected.setHours(0, 0, 0, 0);
    const diffTime = today.getTime() - expected.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const incomingColumns = [
    { title: '订单号', dataIndex: 'orderNo', key: 'orderNo', width: 150 },
    { title: '供应商', dataIndex: 'supplierName', key: 'supplierName', width: 150 },
    { title: '预计到货', dataIndex: 'expectedDate', key: 'expectedDate', width: 120 },
    { title: '订单金额', dataIndex: 'totalAmount', key: 'totalAmount', width: 120, render: (v: number) => `¥${v?.toFixed(2) || '0.00'}` },
    { title: '状态', dataIndex: 'status', key: 'status', width: 100, render: getStatusTag },
    {
      title: '剩余天数',
      key: 'daysRemaining',
      width: 100,
      render: (_: any, record: PurchaseOrderAlert) => {
        const days = getDaysRemaining(record.expectedDate);
        if (days <= 0) return <Tag color="red">已到期</Tag>;
        if (days <= 2) return <Tag color="orange">{days}天</Tag>;
        return <Tag color="green">{days}天</Tag>;
      },
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      render: (_: any, record: PurchaseOrderAlert) => (
        <Button type="link" size="small" onClick={() => handleViewOrder(record.orderNo)}>查看</Button>
      ),
    },
  ];

  const overdueColumns = [
    { title: '订单号', dataIndex: 'orderNo', key: 'orderNo', width: 150 },
    { title: '供应商', dataIndex: 'supplierName', key: 'supplierName', width: 150 },
    { title: '预计到货', dataIndex: 'expectedDate', key: 'expectedDate', width: 120 },
    { title: '订单金额', dataIndex: 'totalAmount', key: 'totalAmount', width: 120, render: (v: number) => `¥${v?.toFixed(2) || '0.00'}` },
    { title: '状态', dataIndex: 'status', key: 'status', width: 100, render: getStatusTag },
    {
      title: '逾期天数',
      key: 'daysOverdue',
      width: 100,
      render: (_: any, record: PurchaseOrderAlert) => {
        const days = getDaysOverdue(record.expectedDate);
        return <Tag color="red">{days}天</Tag>;
      },
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      render: (_: any, record: PurchaseOrderAlert) => (
        <Button type="link" size="small" onClick={() => handleViewOrder(record.orderNo)}>查看</Button>
      ),
    },
  ];

  return (
    <div>
      <h2 style={{ marginBottom: 16 }}>到货提醒</h2>
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card>
            <Space>
              <ClockCircleOutlined style={{ fontSize: 24, color: '#1890ff' }} />
              <div>
                <div style={{ color: '#8c8c8c', fontSize: 12 }}>即将到货 (7天内)</div>
                <div style={{ fontSize: 24, fontWeight: 'bold' }}>{incomingData.length}</div>
              </div>
            </Space>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Space>
              <WarningOutlined style={{ fontSize: 24, color: '#ff4d4f' }} />
              <div>
                <div style={{ color: '#8c8c8c', fontSize: 12 }}>已逾期未到货</div>
                <div style={{ fontSize: 24, fontWeight: 'bold' }}>{overdueData.length}</div>
              </div>
            </Space>
          </Card>
        </Col>
      </Row>

      <Tabs
        activeKey={activeTab}
        onChange={(key) => setActiveTab(key as any)}
        items={[
          {
            key: 'incoming',
            label: <span><ClockCircleOutlined /> 即将到货 ({incomingData.length})</span>,
            children: (
              <Table
                columns={incomingColumns}
                dataSource={incomingData}
                rowKey="id"
                loading={loading}
                pagination={{ pageSize: 10 }}
                scroll={{ x: 900 }}
              />
            ),
          },
          {
            key: 'overdue',
            label: <span><WarningOutlined /> 已逾期 ({overdueData.length})</span>,
            children: (
              <Table
                columns={overdueColumns}
                dataSource={overdueData}
                rowKey="id"
                loading={loading}
                pagination={{ pageSize: 10 }}
                scroll={{ x: 900 }}
              />
            ),
          },
        ]}
      />
    </div>
  );
};

export default PurchaseAlertPage;