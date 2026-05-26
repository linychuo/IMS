import React, { useState, useEffect } from 'react';
import { Table, Button, Space, message, Tag, DatePicker, Card, Row, Col, Statistic, Input, Typography } from 'antd';
const { Text } = Typography;
import { financeApi, supplierApi } from '../../api';
import dayjs from 'dayjs';

interface ReconRecord {
  id: number;
  supplierId: number;
  supplierName: string;
  beginAmount: number;
  currentAmount: number;
  paidAmount: number;
  pendingAmount: number;
  reconciliationDate: string;
  status: number;
}

interface Supplier {
  id: number;
  name: string;
}

const SupplierReconciliationPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ReconRecord[]>([]);
  const [pagination, setPagination] = useState({ current: 1, size: 10, total: 0 });
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(null);
  const [supplierList, setSupplierList] = useState<Supplier[]>([]);
  const [selectedSupplier, setSelectedSupplier] = useState<number | null>(null);
  const [keyword, setKeyword] = useState('');

  useEffect(() => {
    fetchSuppliers();
  }, []);

  useEffect(() => {
    fetchData();
  }, [pagination.current, pagination.size, selectedSupplier, keyword]);

  const fetchSuppliers = async () => {
    try {
      const res = await supplierApi.get('/supplier/list');
      if (res.data.code === 200) {
        setSupplierList(res.data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch suppliers:', error);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await financeApi.get('/supplier-reconciliation/page', {
        params: {
          page: pagination.current,
          pageSize: pagination.size,
          startDate: dateRange?.[0]?.format('YYYY-MM-DD'),
          endDate: dateRange?.[1]?.format('YYYY-MM-DD'),
          supplierId: selectedSupplier,
          keyword: keyword || undefined,
        },
      });
      if (res.data.code === 200) {
        setData(res.data.data?.records || []);
        setPagination(prev => ({ ...prev, total: res.data.data?.total || 0 }));
      }
    } catch (error) {
      message.error('获取供应商对账失败');
    } finally {
      setLoading(false);
    }
  };

  const handleReconcile = async (id: number) => {
    try {
      const res = await financeApi.post(`/supplier-reconciliation/${id}/confirm`);
      if (res.data.code === 200) {
        message.success('对账成功');
        fetchData();
      }
    } catch (error) {
      message.error('对账失败');
    }
  };

  const getSummary = () => {
    const totalBegin = data.reduce((sum, d) => sum + d.beginAmount, 0);
    const totalCurrent = data.reduce((sum, d) => sum + d.currentAmount, 0);
    const totalPaid = data.reduce((sum, d) => sum + d.paidAmount, 0);
    const totalPending = data.reduce((sum, d) => sum + d.pendingAmount, 0);
    return { totalBegin, totalCurrent, totalPaid, totalPending };
  };

  const summary = getSummary();

  const columns = [
    { title: '供应商名称', dataIndex: 'supplierName', key: 'supplierName', width: 180 },
    { title: '期初余额', dataIndex: 'beginAmount', key: 'beginAmount', width: 130, render: (v: number) => `¥${v?.toLocaleString()}` },
    { title: '本期发生', dataIndex: 'currentAmount', key: 'currentAmount', width: 130, render: (v: number) => `¥${v?.toLocaleString()}` },
    { title: '已付款', dataIndex: 'paidAmount', key: 'paidAmount', width: 130, render: (v: number) => <Tag color="green">¥{v?.toLocaleString()}</Tag> },
    { title: '待付款', dataIndex: 'pendingAmount', key: 'pendingAmount', width: 130, render: (v: number) => <Tag color={v > 0 ? 'orange' : 'default'}>¥{v?.toLocaleString()}</Tag> },
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
      <h2 style={{ marginBottom: 16 }}>供应商对账</h2>
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card><Statistic title="对账供应商数" value={data.length} /></Card>
        </Col>
        <Col span={6}>
          <Card><Statistic title="应付总额" value={summary.totalCurrent} precision={2} prefix="¥" valueStyle={{ color: '#1890ff' }} /></Card>
        </Col>
        <Col span={6}>
          <Card><Statistic title="已付款" value={summary.totalPaid} precision={2} prefix="¥" valueStyle={{ color: '#52c41a' }} /></Card>
        </Col>
        <Col span={6}>
          <Card><Statistic title="待付款" value={summary.totalPending} precision={2} prefix="¥" valueStyle={{ color: summary.totalPending > 0 ? '#faad14' : '#52c41a' }} /></Card>
        </Col>
      </Row>
      <div style={{ marginBottom: 16, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <Space>
          <DatePicker.RangePicker onChange={(dates) => setDateRange(dates as any)} />
          <Button type="primary" onClick={fetchData}>搜索</Button>
        </Space>
        <Space>
          <Input.Search placeholder="搜索供应商" onSearch={setKeyword} style={{ width: 200 }} allowClear />
          <select
            style={{ width: 150, padding: '4px 8px', borderRadius: 6, border: '1px solid #d9d9d9' }}
            onChange={(e) => setSelectedSupplier(e.target.value ? Number(e.target.value) : null)}
          >
            <option value="">全部供应商</option>
            {supplierList.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
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
        scroll={{ x: 1100 }}
        summary={() => (
          <Table.Summary fixed>
            <Table.Summary.Row>
              <Table.Summary.Cell index={0}><Text strong>合计</Text></Table.Summary.Cell>
              <Table.Summary.Cell index={1}>¥{summary.totalBegin.toLocaleString()}</Table.Summary.Cell>
              <Table.Summary.Cell index={2}>¥{summary.totalCurrent.toLocaleString()}</Table.Summary.Cell>
              <Table.Summary.Cell index={3}><Text strong style={{ color: '#52c41a' }}>¥{summary.totalPaid.toLocaleString()}</Text></Table.Summary.Cell>
              <Table.Summary.Cell index={4}><Text strong style={{ color: summary.totalPending > 0 ? '#faad14' : '#52c41a' }}>¥{summary.totalPending.toLocaleString()}</Text></Table.Summary.Cell>
              <Table.Summary.Cell index={5}></Table.Summary.Cell>
              <Table.Summary.Cell index={6}></Table.Summary.Cell>
              <Table.Summary.Cell index={7}></Table.Summary.Cell>
            </Table.Summary.Row>
          </Table.Summary>
        )}
      />
    </div>
  );
};

export default SupplierReconciliationPage;