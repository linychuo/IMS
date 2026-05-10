import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Input,
  Space,
  Modal,
  Form,
  InputNumber,
  Select,
  DatePicker,
  message,
  Popconfirm,
  Tag,
  Descriptions,
  Divider,
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import { salesApi, customerApi } from '../../api';

interface SalesOrderDetail {
  id?: string;
  orderId?: string;
  productId?: string;
  productName?: string;
  spec?: string;
  unit?: string;
  quantity?: number;
  price?: number;
  amount?: number;
  outQuantity?: number;
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
  remark?: string;
  auditedBy?: string;
  auditedAt?: string;
  details?: SalesOrderDetail[];
}

const SalesOrderPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<SalesOrder[]>([]);
  const [pagination, setPagination] = useState({ current: 1, size: 10, total: 0 });
  const [keyword, setKeyword] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<SalesOrder | null>(null);
  const [customerList, setCustomerList] = useState<{ id: string; name: string }[]>([]);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    fetchData();
  }, [pagination.current, pagination.size, keyword]);

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
      const res = await salesApi.get('/order/list', { params });
      setData(res.data || []);
      setPagination((prev) => ({ ...prev, total: res.data?.length || 0 }));
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      message.error('获取销售订单失败');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setKeyword(value);
    setPagination((prev) => ({ ...prev, current: 1 }));
  };

  const handleView = async (record: SalesOrder) => {
    try {
      const res = await salesApi.get(`/order/${record.id}`);
      if (res.data) {
        setEditingRecord(res.data);
        setViewModalVisible(true);
      }
    } catch (error) {
      message.error('获取订单详情失败');
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await salesApi.post(`/order/${id}/approve`);
      message.success('审核成功');
      fetchData();
    } catch (error) {
      message.error('审核失败');
    }
  };

  const handleCancel = async (id: string) => {
    try {
      await salesApi.post(`/order/${id}/cancel`, null, { params: { reason: '用户取消' } });
      message.success('取消成功');
      fetchData();
    } catch (error) {
      message.error('取消失败');
    }
  };

  const renderStatus = (status: number) => {
    const map: Record<number, { text: string; color: string }> = {
      0: { text: '待审核', color: 'orange' },
      1: { text: '已审核', color: 'blue' },
      2: { text: '部分出库', color: 'cyan' },
      3: { text: '已完成', color: 'green' },
      9: { text: '已取消', color: 'red' },
    };
    const s = map[status] || { text: '未知', color: 'default' };
    return <Tag color={s.color}>{s.text}</Tag>;
  };

  const columns = [
    { title: '订单编号', dataIndex: 'orderNo', key: 'orderNo', width: 150 },
    { title: '客户', dataIndex: 'customerName', key: 'customerName', width: 150 },
    { title: '订单日期', dataIndex: 'orderDate', key: 'orderDate', width: 120 },
    { title: '要求交货日期', dataIndex: 'expectedDate', key: 'expectedDate', width: 120 },
    { title: '订单金额', dataIndex: 'totalAmount', key: 'totalAmount', width: 120, render: (v: number) => `¥${v?.toFixed(2) || '0.00'}` },
    { title: '优惠金额', dataIndex: 'discountAmount', key: 'discountAmount', width: 100, render: (v: number) => v ? `¥${v.toFixed(2)}` : '-' },
    { title: '实际金额', dataIndex: 'netAmount', key: 'netAmount', width: 120, render: (v: number) => `¥${v?.toFixed(2) || '0.00'}` },
    { title: '状态', dataIndex: 'status', key: 'status', width: 100, render: renderStatus },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_: any, record: SalesOrder) => (
        <Space>
          <Button type="link" size="small" onClick={() => handleView(record)}>查看</Button>
          {record.status === 0 && (
            <>
              <Button type="link" size="small" icon={<CheckCircleOutlined />} onClick={() => handleApprove(record.id)}>审核</Button>
              <Popconfirm title="确定取消？" onConfirm={() => handleCancel(record.id)}>
                <Button type="link" size="small" danger icon={<CloseCircleOutlined />}>取消</Button>
              </Popconfirm>
            </>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h2 style={{ marginBottom: 16 }}>销售订单</h2>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <Input.Search
          placeholder="搜索订单"
          allowClear
          onSearch={handleSearch}
          style={{ width: 200 }}
          prefix={<SearchOutlined />}
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
        scroll={{ x: 1300 }}
      />

      <Modal
        title="订单详情"
        open={viewModalVisible}
        onOk={() => setViewModalVisible(false)}
        onCancel={() => setViewModalVisible(false)}
        footer={[<Button key="close" onClick={() => setViewModalVisible(false)}>关闭</Button>]}
        width={700}
      >
        <Descriptions column={2} size="small">
          <Descriptions.Item label="订单编号">{editingRecord?.orderNo}</Descriptions.Item>
          <Descriptions.Item label="客户">{editingRecord?.customerName}</Descriptions.Item>
          <Descriptions.Item label="订单日期">{editingRecord?.orderDate}</Descriptions.Item>
          <Descriptions.Item label="要求交货日期">{editingRecord?.expectedDate}</Descriptions.Item>
          <Descriptions.Item label="订单金额">¥{editingRecord?.totalAmount?.toFixed(2)}</Descriptions.Item>
          <Descriptions.Item label="优惠金额">¥{editingRecord?.discountAmount?.toFixed(2) || '-'}</Descriptions.Item>
          <Descriptions.Item label="实际金额">¥{editingRecord?.netAmount?.toFixed(2)}</Descriptions.Item>
          <Descriptions.Item label="状态">{renderStatus(editingRecord?.status || 0)}</Descriptions.Item>
        </Descriptions>
        {editingRecord?.details && editingRecord.details.length > 0 && (
          <>
            <Divider>订单明细</Divider>
            <Descriptions column={2} size="small">
              {editingRecord.details.map((d, i) => (
                <Descriptions.Item key={i} label={d.productName}>
                  {d.quantity} {d.unit} × ¥{d.price?.toFixed(2)} = ¥{d.amount?.toFixed(2)}
                </Descriptions.Item>
              ))}
            </Descriptions>
          </>
        )}
      </Modal>
    </div>
  );
};

export default SalesOrderPage;