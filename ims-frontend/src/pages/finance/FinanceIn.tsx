import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Space,
  Modal,
  Form,
  InputNumber,
  Select,
  Input,
  message,
  Popconfirm,
  Tag,
  Tabs,
  Divider,
  Card,
} from 'antd';
import { PlusOutlined, CheckCircleOutlined, CloseCircleOutlined, DisconnectOutlined } from '@ant-design/icons';
import { financeApi, customerApi, salesApi } from '../../api';

interface FinanceIn {
  id: number;
  inNo: string;
  customerId: number;
  customerName: string;
  orderId?: number;
  orderNo?: string;
  receiptType?: number;
  amount: number;
  discountAmount?: number;
  writeoffAmount?: number;
  payMethod?: number;
  bankAccount?: string;
  bankName?: string;
  status: number;
  remark?: string;
  createTime?: string;
}

interface ReceivableOrder {
  orderId: string;
  orderNo: string;
  orderAmount: number;
  paidAmount: number;
  pendingAmount: number;
}

interface WriteoffItem {
  orderId: string;
  orderNo: string;
  writeoffAmount: number;
}

const FinanceInPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<FinanceIn[]>([]);
  const [pagination, setPagination] = useState({ current: 1, size: 10, total: 0 });
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<FinanceIn | null>(null);
  const [customerList, setCustomerList] = useState<{ id: number; name: string }[]>([]);
  const [form] = Form.useForm();
  const [activeTab, setActiveTab] = useState<'all' | 'sales' | 'advance'>('all');
  const [modalMode, setModalMode] = useState<'sales' | 'advance'>('sales');
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(null);
  const [receivableOrders, setReceivableOrders] = useState<ReceivableOrder[]>([]);
  const [writeoffItems, setWriteoffItems] = useState<WriteoffItem[]>([]);
  const [showWriteoff, setShowWriteoff] = useState(false);

  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    fetchData();
  }, [pagination.current, pagination.size, activeTab]);

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
      const params: Record<string, any> = { page: pagination.current, pageSize: pagination.size };
      // 根据Tab筛选收款类型
      if (activeTab === 'sales') params.receiptType = 1;
      if (activeTab === 'advance') params.receiptType = 2;
      const res = await financeApi.get('/finance/in/page', { params });
      if (res.data.code === 200) {
        setData(res.data.data?.records || []);
        setPagination((prev) => ({ ...prev, total: res.data.data?.total || 0 }));
      }
    } catch (error) {
      console.error('Failed to fetch in records:', error);
      message.error('获取收款单失败');
    } finally {
      setLoading(false);
    }
  };

  const handleAddSales = () => {
    setModalMode('sales');
    setEditingRecord(null);
    form.resetFields();
    form.setFieldsValue({ receiptType: 1 });
    setModalVisible(true);
  };

  const handleAddAdvance = () => {
    setModalMode('advance');
    setEditingRecord(null);
    form.resetFields();
    form.setFieldsValue({ receiptType: 2 });
    setSelectedCustomerId(null);
    setReceivableOrders([]);
    setWriteoffItems([]);
    setShowWriteoff(false);
    setModalVisible(true);
  };

  const handleCustomerSelectForWriteoff = async (customerId: number) => {
    setSelectedCustomerId(customerId);
    try {
      const res = await salesApi.get('/order/list', { params: { customerId, status: 3 } });
      if (res.data?.code === 200) {
        const orders = (res.data.data || []).map((o: any) => ({
          orderId: o.id,
          orderNo: o.orderNo,
          orderAmount: o.totalAmount || 0,
          paidAmount: o.paidAmount || 0,
          pendingAmount: (o.totalAmount || 0) - (o.paidAmount || 0),
        })).filter((item: ReceivableOrder) => item.pendingAmount > 0);
        setReceivableOrders(orders);
      }
    } catch (error) {
      console.error('Failed to fetch receivable orders:', error);
    }
  };

  const handleOpenWriteoff = () => {
    setShowWriteoff(true);
  };

  const handleWriteoffAmountChange = (orderId: string, amount: number) => {
    const existing = writeoffItems.find(w => w.orderId === orderId);
    if (existing) {
      setWriteoffItems(writeoffItems.map(w => w.orderId === orderId ? { ...w, writeoffAmount: amount } : w));
    } else {
      const order = receivableOrders.find(o => o.orderId === orderId);
      if (order) {
        setWriteoffItems([...writeoffItems, { orderId, orderNo: order.orderNo, writeoffAmount: amount }]);
      }
    }
  };

  const totalWriteoffAmount = writeoffItems.reduce((sum, item) => sum + item.writeoffAmount, 0);

  const handleAudit = async (id: number) => {
    try {
      const userId = localStorage.getItem('userId');
      await financeApi.put(`/finance/in/audit/${id}`, null, { params: { auditorId: userId } });
      message.success('审核成功');
      fetchData();
    } catch (error) {
      message.error('审核失败');
    }
  };

  const handleCancel = async (id: number) => {
    try {
      await financeApi.put(`/finance/in/cancel/${id}`);
      message.success('取消成功');
      fetchData();
    } catch (error) {
      message.error('取消失败');
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      const params: any = { ...values };
      // 添加核销明细
      if (modalMode === 'sales' && writeoffItems.length > 0) {
        params.writeoffDetails = writeoffItems;
      }
      if (editingRecord?.id) {
        await financeApi.put(`/finance/in/${editingRecord.id}`, params);
        message.success('修改成功');
      } else {
        await financeApi.post('/finance/in', params);
        message.success('新增成功');
      }
      setModalVisible(false);
      setWriteoffItems([]);
      setShowWriteoff(false);
      fetchData();
    } catch (error) {
      console.error('Failed to save:', error);
    }
  };

  const renderStatus = (status: number) => {
    const map: Record<number, { text: string; color: string }> = {
      1: { text: '待审核', color: 'orange' },
      2: { text: '已审核', color: 'green' },
      3: { text: '已取消', color: 'red' },
    };
    const s = map[status] || { text: '未知', color: 'default' };
    return <Tag color={s.color}>{s.text}</Tag>;
  };

  const columns = [
    { title: '收款单号', dataIndex: 'inNo', key: 'inNo', width: 150 },
    { title: '客户', dataIndex: 'customerName', key: 'customerName', width: 150 },
    { title: '关联订单', dataIndex: 'orderNo', key: 'orderNo', width: 150 },
    { title: '收款金额', dataIndex: 'amount', key: 'amount', width: 120, render: (v: number) => `¥${v?.toFixed(2) || '0.00'}` },
    { title: '优惠金额', dataIndex: 'discountAmount', key: 'discountAmount', width: 100, render: (v: number) => v ? `¥${v.toFixed(2)}` : '-' },
    { title: '支付方式', dataIndex: 'payMethod', key: 'payMethod', width: 100, render: (v: number) => {
      const map: Record<number, string> = { 1: '现金', 2: '银行转账', 3: '支付宝', 4: '微信', 5: '其他' };
      return map[v] || '-';
    }},
    { title: '状态', dataIndex: 'status', key: 'status', width: 100, render: renderStatus },
    { title: '创建时间', dataIndex: 'createTime', key: 'createTime', width: 180 },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_: any, record: FinanceIn) => (
        <Space>
          {record.status === 1 && (
            <>
              <Button type="link" size="small" icon={<CheckCircleOutlined />} onClick={() => handleAudit(record.id)}>审核</Button>
              <Button type="link" size="small" danger icon={<CloseCircleOutlined />} onClick={() => handleCancel(record.id)}>取消</Button>
            </>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h2 style={{ marginBottom: 16 }}>收款单</h2>
      <Tabs
        activeKey={activeTab}
        onChange={(key) => { setActiveTab(key as any); setPagination(prev => ({ ...prev, current: 1 })); }}
        items={[
          { key: 'all', label: '全部' },
          { key: 'sales', label: '销售收款' },
          { key: 'advance', label: '预收款' },
        ]}
        style={{ marginBottom: 16 }}
      />
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAddSales}>销售收款</Button>
        <Button icon={<PlusOutlined />} onClick={handleAddAdvance}>预收款</Button>
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
        title={editingRecord ? '编辑收款单' : '新建收款单'}
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={() => { setModalVisible(false); setShowWriteoff(false); setWriteoffItems([]); }}
        width={700}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="customerId" label="客户" rules={[{ required: true }]}>
            <Select placeholder="请选择客户" onChange={(value) => { if (modalMode === 'sales') handleCustomerSelectForWriteoff(value); }}>
              {customerList.map((c) => (
                <Select.Option key={c.id} value={c.id}>{c.name}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Space style={{ width: '100%' }} size="large">
            <Form.Item name="amount" label="收款金额" rules={[{ required: true }]} style={{ flex: 1 }}>
              <InputNumber min={0} precision={2} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name="discountAmount" label="优惠金额" style={{ flex: 1 }}>
              <InputNumber min={0} precision={2} style={{ width: '100%' }} />
            </Form.Item>
          </Space>
          <Space style={{ width: '100%' }} size="large">
            <Form.Item name="payMethod" label="支付方式" style={{ flex: 1 }}>
              <Select placeholder="请选择">
                <Select.Option value={1}>现金</Select.Option>
                <Select.Option value={2}>银行转账</Select.Option>
                <Select.Option value={3}>支付宝</Select.Option>
                <Select.Option value={4}>微信</Select.Option>
                <Select.Option value={5}>其他</Select.Option>
              </Select>
            </Form.Item>
          </Space>
          <Space style={{ width: '100%' }} size="large">
            <Form.Item name="bankName" label="开户行" style={{ flex: 1 }}>
              <Input placeholder="请输入开户行" />
            </Form.Item>
            <Form.Item name="bankAccount" label="银行账号" style={{ flex: 1 }}>
              <Input placeholder="请输入银行账号" />
            </Form.Item>
          </Space>

          {modalMode === 'sales' && receivableOrders.length > 0 && !showWriteoff && (
            <div style={{ marginBottom: 16 }}>
              <Button type="link" icon={<DisconnectOutlined />} onClick={handleOpenWriteoff}>
                核销应收单据 (可选 {receivableOrders.length} 笔)
              </Button>
            </div>
          )}

          {modalMode === 'sales' && showWriteoff && (
            <>
              <Divider>核销应收单据</Divider>
              <Card size="small" style={{ marginBottom: 16 }}>
                {receivableOrders.map(order => (
                  <div key={order.orderId} style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                    <span style={{ width: 150 }}>{order.orderNo}</span>
                    <span style={{ width: 100 }}>应付: ¥{order.orderAmount?.toFixed(2)}</span>
                    <span style={{ width: 100 }}>已付: ¥{order.paidAmount?.toFixed(2)}</span>
                    <span style={{ width: 100, color: '#ff4d4f' }}>待付: ¥{order.pendingAmount?.toFixed(2)}</span>
                    <InputNumber
                      min={0}
                      max={order.pendingAmount}
                      precision={2}
                      placeholder="核销金额"
                      onChange={(value) => handleWriteoffAmountChange(order.orderId, value || 0)}
                      style={{ width: 120 }}
                    />
                  </div>
                ))}
                <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: 8, marginTop: 8 }}>
                  <Space size="large">
                    <span>共 {receivableOrders.length} 笔应收</span>
                    <span>本次核销总额: <strong style={{ color: '#1890ff' }}>¥{totalWriteoffAmount.toFixed(2)}</strong></span>
                  </Space>
                </div>
              </Card>
            </>
          )}

          <Form.Item name="remark" label="备注">
            <Input.TextArea rows={2} placeholder="请输入备注" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default FinanceInPage;