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
import { financeApi, supplierApi, purchaseApi } from '../../api';

interface FinanceOut {
  id: number;
  outNo: string;
  supplierId: number;
  supplierName: string;
  orderId?: number;
  orderNo?: string;
  paymentType?: number;
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

interface PayableOrder {
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

const FinanceOutPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<FinanceOut[]>([]);
  const [pagination, setPagination] = useState({ current: 1, size: 10, total: 0 });
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<FinanceOut | null>(null);
  const [supplierList, setSupplierList] = useState<{ id: number; name: string }[]>([]);
  const [form] = Form.useForm();
  const [activeTab, setActiveTab] = useState<'all' | 'purchase' | 'advance'>('all');
  const [modalMode, setModalMode] = useState<'purchase' | 'advance'>('purchase');
  const [selectedSupplierId, setSelectedSupplierId] = useState<number | null>(null);
  const [payableOrders, setPayableOrders] = useState<PayableOrder[]>([]);
  const [writeoffItems, setWriteoffItems] = useState<WriteoffItem[]>([]);
  const [showWriteoff, setShowWriteoff] = useState(false);

  useEffect(() => {
    fetchSuppliers();
  }, []);

  useEffect(() => {
    fetchData();
  }, [pagination.current, pagination.size, activeTab]);

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
      const params: Record<string, any> = { page: pagination.current, pageSize: pagination.size };
      if (activeTab === 'purchase') params.paymentType = 1;
      if (activeTab === 'advance') params.paymentType = 2;
      const res = await financeApi.get('/finance/out/page', { params });
      if (res.data.code === 200) {
        setData(res.data.data?.records || []);
        setPagination((prev) => ({ ...prev, total: res.data.data?.total || 0 }));
      }
    } catch (error) {
      console.error('Failed to fetch out records:', error);
      message.error('获取付款单失败');
    } finally {
      setLoading(false);
    }
  };

  const handleAddPurchase = () => {
    setModalMode('purchase');
    setEditingRecord(null);
    form.resetFields();
    form.setFieldsValue({ paymentType: 1 });
    setModalVisible(true);
  };

  const handleAddAdvance = () => {
    setModalMode('advance');
    setEditingRecord(null);
    form.resetFields();
    form.setFieldsValue({ paymentType: 2 });
    setSelectedSupplierId(null);
    setPayableOrders([]);
    setWriteoffItems([]);
    setShowWriteoff(false);
    setModalVisible(true);
  };

  const handleSupplierSelectForWriteoff = async (supplierId: number) => {
    setSelectedSupplierId(supplierId);
    try {
      const res = await purchaseApi.get('/order/list', { params: { supplierId, status: 3 } });
      if (res.data?.code === 200) {
        const orders = (res.data.data || []).map((o: any) => ({
          orderId: o.id,
          orderNo: o.orderNo,
          orderAmount: o.totalAmount || 0,
          paidAmount: o.paidAmount || 0,
          pendingAmount: (o.totalAmount || 0) - (o.paidAmount || 0),
        })).filter((item: PayableOrder) => item.pendingAmount > 0);
        setPayableOrders(orders);
      }
    } catch (error) {
      console.error('Failed to fetch payable orders:', error);
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
      const order = payableOrders.find(o => o.orderId === orderId);
      if (order) {
        setWriteoffItems([...writeoffItems, { orderId, orderNo: order.orderNo, writeoffAmount: amount }]);
      }
    }
  };

  const totalWriteoffAmount = writeoffItems.reduce((sum, item) => sum + item.writeoffAmount, 0);

  const handleAudit = async (id: number) => {
    try {
      const userId = localStorage.getItem('userId');
      await financeApi.put(`/finance/out/audit/${id}`, null, { params: { auditorId: userId } });
      message.success('审核成功');
      fetchData();
    } catch (error) {
      message.error('审核失败');
    }
  };

  const handleCancel = async (id: number) => {
    try {
      await financeApi.put(`/finance/out/cancel/${id}`);
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
      if (modalMode === 'purchase' && writeoffItems.length > 0) {
        params.writeoffDetails = writeoffItems;
      }
      if (editingRecord?.id) {
        await financeApi.put(`/finance/out/${editingRecord.id}`, params);
        message.success('修改成功');
      } else {
        await financeApi.post('/finance/out', params);
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
    { title: '付款单号', dataIndex: 'outNo', key: 'outNo', width: 150 },
    { title: '供应商', dataIndex: 'supplierName', key: 'supplierName', width: 150 },
    { title: '关联订单', dataIndex: 'orderNo', key: 'orderNo', width: 150 },
    { title: '付款金额', dataIndex: 'amount', key: 'amount', width: 120, render: (v: number) => `¥${v?.toFixed(2) || '0.00'}` },
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
      render: (_: any, record: FinanceOut) => (
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
      <h2 style={{ marginBottom: 16 }}>付款单</h2>
      <Tabs
        activeKey={activeTab}
        onChange={(key) => { setActiveTab(key as any); setPagination(prev => ({ ...prev, current: 1 })); }}
        items={[
          { key: 'all', label: '全部' },
          { key: 'purchase', label: '采购付款' },
          { key: 'advance', label: '预付款' },
        ]}
        style={{ marginBottom: 16 }}
      />
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAddPurchase}>采购付款</Button>
        <Button icon={<PlusOutlined />} onClick={handleAddAdvance}>预付款</Button>
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
        title={editingRecord ? '编辑付款单' : '新建付款单'}
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={() => { setModalVisible(false); setShowWriteoff(false); setWriteoffItems([]); }}
        width={700}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="supplierId" label="供应商" rules={[{ required: true }]}>
            <Select placeholder="请选择供应商" onChange={(value) => { if (modalMode === 'purchase') handleSupplierSelectForWriteoff(value); }}>
              {supplierList.map((s) => (
                <Select.Option key={s.id} value={s.id}>{s.name}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Space style={{ width: '100%' }} size="large">
            <Form.Item name="amount" label="付款金额" rules={[{ required: true }]} style={{ flex: 1 }}>
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

          {modalMode === 'purchase' && payableOrders.length > 0 && !showWriteoff && (
            <div style={{ marginBottom: 16 }}>
              <Button type="link" icon={<DisconnectOutlined />} onClick={handleOpenWriteoff}>
                核销应付单据 (可选 {payableOrders.length} 笔)
              </Button>
            </div>
          )}

          {modalMode === 'purchase' && showWriteoff && (
            <>
              <Divider>核销应付单据</Divider>
              <Card size="small" style={{ marginBottom: 16 }}>
                {payableOrders.map(order => (
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
                    <span>共 {payableOrders.length} 笔应付</span>
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

export default FinanceOutPage;