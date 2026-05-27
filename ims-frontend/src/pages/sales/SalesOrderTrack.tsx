import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Input,
  Space,
  Modal,
  Tag,
  DatePicker,
  Select,
  Card,
  Row,
  Col,
  Statistic,
  Timeline,
  Typography,
  Descriptions,
  message,
} from 'antd';
import {
  SearchOutlined,
  EyeOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import { salesApi, customerApi } from '../../api';
import dayjs from 'dayjs';

const { Text } = Typography;

interface StatusHistory {
  id: string;
  orderId: string;
  orderNo: string;
  fromStatus: number;
  toStatus: number;
  operatorId: string;
  operatorName: string;
  operateTime: string;
  remark?: string;
}

interface SalesOrder {
  id: string;
  orderNo: string;
  customerId: string;
  customerName: string;
  orderDate: string;
  expectedDate?: string;
  status: number;
  totalAmount: number;
  discountAmount?: number;
  netAmount: number;
  auditedBy?: string;
  auditedAt?: string;
  completedAt?: string;
}

const statusMap: Record<number, { text: string; color: string }> = {
  0: { text: '待审核', color: 'orange' },
  1: { text: '已审核', color: 'blue' },
  2: { text: '部分出库', color: 'cyan' },
  3: { text: '已完成', color: 'green' },
  9: { text: '已取消', color: 'red' },
};

const statusTextMap: Record<number, string> = {
  0: '新建',
  1: '已审核',
  2: '部分出库',
  3: '已完成',
  9: '已取消',
};

const SalesOrderTrackPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<SalesOrder[]>([]);
  const [pagination, setPagination] = useState({ current: 1, size: 10, total: 0 });
  const [keyword, setKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState<number | undefined>(undefined);
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(null);
  const [customerList, setCustomerList] = useState<{ id: string; name: string }[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | undefined>(undefined);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<SalesOrder | null>(null);
  const [statusHistory, setStatusHistory] = useState<StatusHistory[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    fetchData();
  }, [pagination.current, pagination.size, keyword, statusFilter, selectedCustomerId, dateRange]);

  const fetchCustomers = async () => {
    try {
      const res = await customerApi.get('/customer/list');
      if (res.data.code === 200) {
        setCustomerList(res.data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch customers:', error);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const params: Record<string, any> = {
        page: pagination.current,
        pageSize: pagination.size,
      };
      if (keyword) {
        params.keyword = keyword;
      }
      if (statusFilter !== undefined) {
        params.status = statusFilter;
      }
      if (selectedCustomerId) {
        params.customerId = selectedCustomerId;
      }
      if (dateRange) {
        params.startDate = dateRange[0].format('YYYY-MM-DD');
        params.endDate = dateRange[1].format('YYYY-MM-DD');
      }
      const res = await salesApi.get('/order/list', { params });
      if (res.data?.code === 200) {
        setData(res.data.data?.records || res.data.data || []);
        setPagination((prev) => ({
          ...prev,
          total: res.data.data?.total || (Array.isArray(res.data.data) ? res.data.data.length : 0),
        }));
      } else {
        setData(res.data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      message.error('获取订单列表失败');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setKeyword(value);
    setPagination((prev) => ({ ...prev, current: 1 }));
  };

  const handleView = async (record: SalesOrder) => {
    setSelectedOrder(record);
    setViewModalVisible(true);
    fetchStatusHistory(record.id);
  };

  const fetchStatusHistory = async (orderId: string) => {
    setHistoryLoading(true);
    try {
      const res = await salesApi.get(`/sales/order/${orderId}/status-history`);
      if (res.data?.code === 200) {
        setStatusHistory(res.data.data || []);
      } else {
        setStatusHistory([]);
      }
    } catch (error) {
      console.error('Failed to fetch status history:', error);
      setStatusHistory([]);
    } finally {
      setHistoryLoading(false);
    }
  };

  const renderStatus = (status: number) => {
    const s = statusMap[status] || { text: '未知', color: 'default' };
    return <Tag color={s.color}>{s.text}</Tag>;
  };

  const getStatusIcon = (status: number) => {
    switch (status) {
      case 0: return <ClockCircleOutlined style={{ color: '#fa8c16' }} />;
      case 1: return <CheckCircleOutlined style={{ color: '#1890ff' }} />;
      case 2: return <ExclamationCircleOutlined style={{ color: '#13c2c2' }} />;
      case 3: return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
      case 9: return <CloseCircleOutlined style={{ color: '#f5222d' }} />;
      default: return <ClockCircleOutlined />;
    }
  };

  const columns = [
    { title: '订单编号', dataIndex: 'orderNo', key: 'orderNo', width: 150 },
    { title: '客户', dataIndex: 'customerName', key: 'customerName', width: 150 },
    { title: '订单日期', dataIndex: 'orderDate', key: 'orderDate', width: 120 },
    { title: '要求交货日期', dataIndex: 'expectedDate', key: 'expectedDate', width: 120 },
    { title: '订单金额', dataIndex: 'totalAmount', key: 'totalAmount', width: 120, render: (v: number) => `¥${v?.toFixed(2) || '0.00'}` },
    { title: '实际金额', dataIndex: 'netAmount', key: 'netAmount', width: 120, render: (v: number) => `¥${v?.toFixed(2) || '0.00'}` },
    { title: '状态', dataIndex: 'status', key: 'status', width: 100, render: renderStatus },
    {
      title: '操作',
      key: 'action',
      width: 100,
      render: (_: any, record: SalesOrder) => (
        <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => handleView(record)}>
          跟踪
        </Button>
      ),
    },
  ];

  const statCards = [
    { title: '全部订单', value: data.length, color: '#1890ff', icon: <ClockCircleOutlined /> },
    { title: '待审核', value: data.filter(d => d.status === 0).length, color: '#fa8c16', icon: <ClockCircleOutlined /> },
    { title: '已审核', value: data.filter(d => d.status === 1).length, color: '#1890ff', icon: <CheckCircleOutlined /> },
    { title: '已完成', value: data.filter(d => d.status === 3).length, color: '#52c41a', icon: <CheckCircleOutlined /> },
    { title: '已取消', value: data.filter(d => d.status === 9).length, color: '#f5222d', icon: <CloseCircleOutlined /> },
  ];

  return (
    <div>
      <h2 style={{ marginBottom: 16 }}>销售订单跟踪</h2>

      <Row gutter={16} style={{ marginBottom: 16 }}>
        {statCards.map((stat, index) => (
          <Col span={4} key={index}>
            <Card size="small">
              <Statistic
                title={stat.title}
                value={stat.value}
                prefix={<span style={{ color: stat.color }}>{stat.icon}</span>}
                valueStyle={{ color: stat.color }}
              />
            </Card>
          </Col>
        ))}
      </Row>

      <div style={{ marginBottom: 16, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <Input.Search
          placeholder="搜索订单号/客户"
          allowClear
          onSearch={handleSearch}
          style={{ width: 200 }}
          prefix={<SearchOutlined />}
        />
        <Select
          allowClear
          placeholder="选择客户"
          style={{ width: 150 }}
          onChange={(value) => { setSelectedCustomerId(value); setPagination(prev => ({ ...prev, current: 1 })); }}
        >
          {customerList.map(c => (
            <Select.Option key={c.id} value={c.id}>{c.name}</Select.Option>
          ))}
        </Select>
        <Select
          allowClear
          placeholder="订单状态"
          style={{ width: 120 }}
          onChange={(value) => { setStatusFilter(value); setPagination(prev => ({ ...prev, current: 1 })); }}
        >
          <Select.Option value={0}>待审核</Select.Option>
          <Select.Option value={1}>已审核</Select.Option>
          <Select.Option value={2}>部分出库</Select.Option>
          <Select.Option value={3}>已完成</Select.Option>
          <Select.Option value={9}>已取消</Select.Option>
        </Select>
        <DatePicker.RangePicker
          onChange={(dates) => { setDateRange(dates as any); setPagination(prev => ({ ...prev, current: 1 })); }}
        />
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
      />

      <Modal
        title={`订单跟踪 - ${selectedOrder?.orderNo}`}
        open={viewModalVisible}
        onCancel={() => { setViewModalVisible(false); setStatusHistory([]); }}
        footer={[<Button key="close" onClick={() => { setViewModalVisible(false); setStatusHistory([]); }}>关闭</Button>]}
        width={700}
      >
        {selectedOrder && (
          <>
            <Descriptions column={2} size="small" style={{ marginBottom: 16 }}>
              <Descriptions.Item label="订单编号">{selectedOrder.orderNo}</Descriptions.Item>
              <Descriptions.Item label="客户">{selectedOrder.customerName}</Descriptions.Item>
              <Descriptions.Item label="订单日期">{selectedOrder.orderDate}</Descriptions.Item>
              <Descriptions.Item label="要求交货日期">{selectedOrder.expectedDate || '-'}</Descriptions.Item>
              <Descriptions.Item label="订单金额">¥{selectedOrder.totalAmount?.toFixed(2)}</Descriptions.Item>
              <Descriptions.Item label="实际金额"><Text strong>¥{selectedOrder.netAmount?.toFixed(2)}</Text></Descriptions.Item>
              <Descriptions.Item label="状态">{renderStatus(selectedOrder.status)}</Descriptions.Item>
              <Descriptions.Item label="审核人">{selectedOrder.auditedBy || '-'}</Descriptions.Item>
            </Descriptions>

            <Card size="small" title="状态流转" style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                {statusHistory.length === 0 ? (
                  <Text type="secondary">暂无状态记录</Text>
                ) : (
                  statusHistory.map((h, index) => (
                    <React.Fragment key={h.id}>
                      <Tag color={statusMap[h.toStatus]?.color || 'default'} style={{ fontSize: 12, padding: '4px 8px' }}>
                        {getStatusIcon(h.toStatus)} {statusTextMap[h.toStatus] || h.toStatus}
                      </Tag>
                      {index < statusHistory.length - 1 && <span style={{ color: '#d9d9d9' }}>→</span>}
                    </React.Fragment>
                  ))
                )}
              </div>
            </Card>

            <Card size="small" title="操作记录" loading={historyLoading} style={{ maxHeight: 300, overflow: 'auto' }}>
              {statusHistory.length === 0 ? (
                <Text type="secondary">暂无操作记录</Text>
              ) : (
                <Timeline
                  items={statusHistory.map(h => ({
                    color: h.toStatus === 9 ? 'red' : h.toStatus === 3 ? 'green' : 'blue',
                    children: (
                      <div>
                        <div style={{ marginBottom: 4 }}>
                          <Tag color={statusMap[h.toStatus]?.color || 'default'}>
                            {statusTextMap[h.fromStatus] || '新建'} → {statusTextMap[h.toStatus] || '未知'}
                          </Tag>
                        </div>
                        <div style={{ fontSize: 12, color: '#888' }}>
                          操作人: {h.operatorName} | {h.operateTime}
                          {h.remark && <Text type="secondary"> | {h.remark}</Text>}
                        </div>
                      </div>
                    ),
                  }))}
                />
              )}
            </Card>
          </>
        )}
      </Modal>
    </div>
  );
};

export default SalesOrderTrackPage;
