import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Card, Statistic, message, Tag, DatePicker, Input } from 'antd';
import { DollarOutlined, CheckCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { financeApi } from '../../api';
import dayjs from 'dayjs';

interface ReconRecord {
  id: number;
  customerName: string;
  beginAmount: number;
  currentAmount: number;
  paidAmount: number;
  pendingAmount: number;
  reconciliationDate: string;
  status: number;
}

const CustomerReconciliationPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ReconRecord[]>([]);
  const [pagination, setPagination] = useState({ current: 1, size: 10, total: 0 });
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(null);

  useEffect(() => {
    fetchData();
  }, [pagination.current, pagination.size]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await financeApi.get('/customer-reconciliation/page', {
        params: {
          page: pagination.current,
          size: pagination.size,
          startDate: dateRange?.[0]?.format('YYYY-MM-DD'),
          endDate: dateRange?.[1]?.format('YYYY-MM-DD'),
        },
      });
      if (res.data.code === 200) {
        setData(res.data.data?.records || []);
        setPagination(prev => ({ ...prev, total: res.data.data?.total || 0 }));
      }
    } catch (error) {
      message.error('获取客户对账失败');
    } finally {
      setLoading(false);
    }
  };

  const handleReconcile = async (id: number) => {
    try {
      const res = await financeApi.post(`/customer-reconciliation/${id}/reconcile`);
      if (res.data.code === 200) {
        message.success('对账成功');
        fetchData();
      }
    } catch (error) {
      message.error('对账失败');
    }
  };

  const columns = [
    { title: '客户名称', dataIndex: 'customerName', key: 'customerName', width: 180 },
    { title: '期初余额', dataIndex: 'beginAmount', key: 'beginAmount', width: 120, render: (v: number) => `¥${v?.toLocaleString()}` },
    { title: '本期发生', dataIndex: 'currentAmount', key: 'currentAmount', width: 120, render: (v: number) => `¥${v?.toLocaleString()}` },
    { title: '已收款', dataIndex: 'paidAmount', key: 'paidAmount', width: 120, render: (v: number) => <Tag color="green">¥{v?.toLocaleString()}</Tag> },
    { title: '待收款', dataIndex: 'pendingAmount', key: 'pendingAmount', width: 120, render: (v: number) => <Tag color="orange">¥{v?.toLocaleString()}</Tag> },
    { title: '对账日期', dataIndex: 'reconciliationDate', key: 'reconciliationDate', width: 120 },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (s: number) => s === 1 ? <Tag color="green">已对账</Tag> : <Tag color="default">未对账</Tag>,
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: (_: any, record: ReconRecord) => (
        record.status !== 1 && (
          <Button type="link" size="small" onClick={() => handleReconcile(record.id)}>
            确认对账
          </Button>
        )
      ),
    },
  ];

  return (
    <div>
      <h2 style={{ marginBottom: 16 }}>客户对账</h2>
      <div style={{ marginBottom: 16, display: 'flex', gap: 16, alignItems: 'center' }}>
        <Space>
          <DatePicker.RangePicker onChange={(dates) => setDateRange(dates as any)} />
          <Button type="primary" onClick={fetchData}>搜索</Button>
        </Space>
      </div>
      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        loading={loading}
        pagination={{
          current: pagination.current,
          pageSize: pagination.size,
          total: pagination.total,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 条`,
          onChange: (current, size) => setPagination({ current, size, total: pagination.total }),
        }}
        scroll={{ x: 1000 }}
      />
    </div>
  );
};

export default CustomerReconciliationPage;