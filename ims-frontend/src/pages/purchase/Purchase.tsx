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
  Tabs,
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
import { procurementApi, supplierApi as procSupplierApi, warehouseApi } from '../../api';

const { TabPane } = Tabs;

// ============ 采购订单 ============
interface PurchaseOrderDetail {
  id?: string;
  orderId?: string;
  productId?: string;
  productName?: string;
  spec?: string;
  unit?: string;
  quantity?: number;
  price?: number;
  amount?: number;
}

interface PurchaseOrder {
  id: string;
  orderNo: string;
  supplierId: string;
  supplierName: string;
  orderDate: string;
  expectedDate?: string;
  status: number;
  totalAmount: number;
  discountAmount?: number;
  netAmount: number;
  remark?: string;
  auditedBy?: string;
  auditedAt?: string;
  details?: PurchaseOrderDetail[];
}

// ============ 采购入库 ============
interface PurchaseInDetail {
  id?: string;
  inId?: string;
  productId?: string;
  productName?: string;
  spec?: string;
  unit?: string;
  quantity?: number;
  price?: number;
  amount?: number;
}

interface PurchaseIn {
  id: string;
  inNo: string;
  orderId?: string;
  orderNo?: string;
  supplierId: string;
  supplierName: string;
  inDate: string;
  warehouseId: string;
  warehouseName: string;
  status: number;
  totalAmount: number;
  remark?: string;
  auditedBy?: string;
  auditedAt?: string;
  details?: PurchaseInDetail[];
}

// ============ 采购退货 ============
interface PurchaseReturnDetail {
  id?: string;
  returnId?: string;
  productId?: string;
  productName?: string;
  spec?: string;
  unit?: string;
  quantity?: number;
  price?: number;
  amount?: number;
}

interface PurchaseReturn {
  id: string;
  returnNo: string;
  purchaseInId?: string;
  purchaseInNo?: string;
  supplierId: string;
  supplierName: string;
  warehouseId: string;
  warehouseName: string;
  returnDate: string;
  returnBy?: string;
  returnByName?: string;
  status: number;
  totalAmount: number;
  refundAmount: number;
  reason?: string;
  remark?: string;
  auditedBy?: string;
  auditedAt?: string;
  details?: PurchaseReturnDetail[];
}

const PurchasePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('order');

  // 通用状态
  const [orderModalVisible, setOrderModalVisible] = useState(false);
  const [inModalVisible, setInModalVisible] = useState(false);
  const [editingOrder, setEditingOrder] = useState<PurchaseOrder | null>(null);
  const [editingIn, setEditingIn] = useState<PurchaseIn | null>(null);
  const [supplierList, setSupplierList] = useState<{ id: string; name: string }[]>([]);
  const [warehouseList, setWarehouseList] = useState<{ id: string; name: string }[]>([]);
  const [form] = Form.useForm();
  const [inForm] = Form.useForm();
  const [returnForm] = Form.useForm();

  // 订单状态
  const [orderLoading, setOrderLoading] = useState(false);
  const [orderData, setOrderData] = useState<PurchaseOrder[]>([]);
  const [orderPagination, setOrderPagination] = useState({ current: 1, size: 10, total: 0 });
  const [orderKeyword, setOrderKeyword] = useState('');

  // 入库状态
  const [inLoading, setInLoading] = useState(false);
  const [inData, setInData] = useState<PurchaseIn[]>([]);
  const [inPagination, setInPagination] = useState({ current: 1, size: 10, total: 0 });
  const [inKeyword, setInKeyword] = useState('');

  // 退货状态
  const [returnLoading, setReturnLoading] = useState(false);
  const [returnData, setReturnData] = useState<PurchaseReturn[]>([]);
  const [returnPagination, setReturnPagination] = useState({ current: 1, size: 10, total: 0 });
  const [returnModalVisible, setReturnModalVisible] = useState(false);
  const [editingReturn, setEditingReturn] = useState<PurchaseReturn | null>(null);

  useEffect(() => {
    fetchSuppliers();
    fetchWarehouses();
  }, []);

  useEffect(() => {
    if (activeTab === 'order') {
      fetchOrders();
    } else if (activeTab === 'in') {
      fetchIns();
    } else if (activeTab === 'return') {
      fetchReturns();
    }
  }, [activeTab, orderPagination.current, inPagination.current, returnPagination.current]);

  const fetchWarehouses = async () => {
    try {
      const res = await warehouseApi.get('/warehouse/list');
      if (res.data.code === 200) {
        setWarehouseList(res.data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch warehouses:', error);
    }
  };

  const fetchSuppliers = async () => {
    try {
      const res = await procSupplierApi.get('/supplier/list');
      if (res.data.code === 200) {
        setSupplierList(res.data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch suppliers:', error);
    }
  };

  // ============ 订单操作 ============
  const fetchOrders = async () => {
    setOrderLoading(true);
    try {
      const params: Record<string, any> = {
        page: orderPagination.current,
        pageSize: orderPagination.size,
      };
      if (orderKeyword) {
        params.keyword = orderKeyword;
      }
      const res = await procurementApi.get('/orders', { params });
      setOrderData(res.data || []);
      setOrderPagination((prev) => ({ ...prev, total: res.data?.length || 0 }));
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      message.error('获取采购订单失败');
    } finally {
      setOrderLoading(false);
    }
  };

  const handleOrderSearch = (value: string) => {
    setOrderKeyword(value);
    setOrderPagination((prev) => ({ ...prev, current: 1 }));
  };

  const handleAddOrder = () => {
    setEditingOrder(null);
    form.resetFields();
    setOrderModalVisible(true);
  };

  const handleViewOrder = async (record: PurchaseOrder) => {
    try {
      const res = await procurementApi.get(`/orders/${record.id}`);
      if (res.data) {
        setEditingOrder(res.data);
        form.setFieldsValue(res.data);
        setOrderModalVisible(true);
      }
    } catch (error) {
      message.error('获取订单详情失败');
    }
  };

  const handleApproveOrder = async (id: string) => {
    try {
      await procurementApi.post(`/orders/${id}/approve`);
      message.success('审核成功');
      fetchOrders();
    } catch (error) {
      message.error('审核失败');
    }
  };

  const handleCancelOrder = async (id: string) => {
    try {
      await procurementApi.post(`/orders/${id}/cancel`, null, { params: { reason: '用户取消' } });
      message.success('取消成功');
      fetchOrders();
    } catch (error) {
      message.error('取消失败');
    }
  };

  const handleDeleteOrder = async (id: string) => {
    try {
      await procurementApi.delete(`/orders/${id}`);
      message.success('删除成功');
      fetchOrders();
    } catch (error) {
      message.error('删除失败');
    }
  };

  const handleOrderModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingOrder?.id) {
        await procurementApi.put(`/orders/${editingOrder.id}`, values);
        message.success('修改成功');
      } else {
        await procurementApi.post('/orders', values);
        message.success('新增成功');
      }
      setOrderModalVisible(false);
      fetchOrders();
    } catch (error) {
      console.error('Failed to save order:', error);
    }
  };

  // ============ 入库操作 ============
  const fetchIns = async () => {
    setInLoading(true);
    try {
      const params: Record<string, any> = {
        page: inPagination.current,
        pageSize: inPagination.size,
      };
      if (inKeyword) {
        params.keyword = inKeyword;
      }
      const res = await procurementApi.get('/purchase-in/list', { params });
      setInData(res.data || []);
      setInPagination((prev) => ({ ...prev, total: res.data?.length || 0 }));
    } catch (error) {
      console.error('Failed to fetch ins:', error);
      message.error('获取采购入库失败');
    } finally {
      setInLoading(false);
    }
  };

  const handleInSearch = (value: string) => {
    setInKeyword(value);
    setInPagination((prev) => ({ ...prev, current: 1 }));
  };

  const handleViewIn = async (record: PurchaseIn) => {
    try {
      const res = await procurementApi.get(`/purchase-in/${record.id}`);
      if (res.data) {
        setEditingIn(res.data);
        inForm.setFieldsValue(res.data);
        setInModalVisible(true);
      }
    } catch (error) {
      message.error('获取入库单详情失败');
    }
  };

  const handleApproveIn = async (id: string) => {
    try {
      await procurementApi.post(`/purchase-in/${id}/approve`);
      message.success('审核成功');
      fetchIns();
    } catch (error) {
      message.error('审核失败');
    }
  };

  const handleCompleteIn = async (id: string) => {
    try {
      await procurementApi.post(`/purchase-in/${id}/complete`);
      message.success('完成入库成功');
      fetchIns();
    } catch (error) {
      message.error('操作失败');
    }
  };

  const handleCancelIn = async (id: string) => {
    try {
      await procurementApi.post(`/purchase-in/${id}/cancel`, null, { params: { reason: '用户取消' } });
      message.success('取消成功');
      fetchIns();
    } catch (error) {
      message.error('取消失败');
    }
  };

  // ============ 退货操作 ============
  const fetchReturns = async () => {
    setReturnLoading(true);
    try {
      const res = await procurementApi.get('/return', {
        params: { page: returnPagination.current, pageSize: returnPagination.size },
      });
      if (res.data.code === 200) {
        setReturnData(res.data.data?.records || []);
        setReturnPagination((prev) => ({ ...prev, total: res.data.data?.total || 0 }));
      }
    } catch (error) {
      console.error('Failed to fetch returns:', error);
      message.error('获取采购退货失败');
    } finally {
      setReturnLoading(false);
    }
  };

  const handleAddReturn = () => {
    setEditingReturn(null);
    returnForm.resetFields();
    setReturnModalVisible(true);
  };

  const handleViewReturn = async (record: PurchaseReturn) => {
    try {
      const res = await procurementApi.get(`/return/${record.id}`);
      if (res.data) {
        setEditingReturn(res.data);
        returnForm.setFieldsValue(res.data);
        setReturnModalVisible(true);
      }
    } catch (error) {
      message.error('获取退货单详情失败');
    }
  };

  const handleApproveReturn = async (id: string) => {
    try {
      await procurementApi.post(`/return/${id}/approve`);
      message.success('审核成功');
      fetchReturns();
    } catch (error) {
      message.error('审核失败');
    }
  };

  const handleRejectReturn = async (id: string) => {
    try {
      await procurementApi.post(`/return/${id}/reject`, null, { params: { reason: '用户拒绝' } });
      message.success('拒绝成功');
      fetchReturns();
    } catch (error) {
      message.error('拒绝失败');
    }
  };

  const handleOutboundReturn = async (id: string) => {
    try {
      await procurementApi.post(`/return/${id}/outbound`);
      message.success('退货出库成功');
      fetchReturns();
    } catch (error) {
      message.error('操作失败');
    }
  };

  const handleReturnModalOk = async () => {
    try {
      const values = await returnForm.validateFields();
      if (editingReturn?.id) {
        await procurementApi.put(`/return/${editingReturn.id}`, values);
        message.success('修改成功');
      } else {
        await procurementApi.post('/return', values);
        message.success('新增成功');
      }
      setReturnModalVisible(false);
      fetchReturns();
    } catch (error) {
      console.error('Failed to save return:', error);
    }
  };

  // ============ 状态渲染 ============
  const renderOrderStatus = (status: number) => {
    const map: Record<number, { text: string; color: string }> = {
      0: { text: '新建', color: 'default' },
      1: { text: '待审核', color: 'orange' },
      2: { text: '已审核', color: 'blue' },
      3: { text: '待发货', color: 'cyan' },
      4: { text: '部分发货', color: 'purple' },
      5: { text: '已完成', color: 'green' },
      9: { text: '已取消', color: 'red' },
    };
    const s = map[status] || { text: '未知', color: 'default' };
    return <Tag color={s.color}>{s.text}</Tag>;
  };

  const renderInStatus = (status: number) => {
    const map: Record<number, { text: string; color: string }> = {
      0: { text: '待入库', color: 'orange' },
      1: { text: '部分入库', color: 'cyan' },
      2: { text: '已完成', color: 'green' },
      9: { text: '已取消', color: 'red' },
    };
    const s = map[status] || { text: '未知', color: 'default' };
    return <Tag color={s.color}>{s.text}</Tag>;
  };

  const renderReturnStatus = (status: number) => {
    const map: Record<number, { text: string; color: string }> = {
      0: { text: '待审核', color: 'orange' },
      1: { text: '已审核', color: 'blue' },
      2: { text: '已退货', color: 'green' },
      9: { text: '已拒绝', color: 'red' },
    };
    const s = map[status] || { text: '未知', color: 'default' };
    return <Tag color={s.color}>{s.text}</Tag>;
  };

  // ============ 订单列定义 ============
  const orderColumns = [
    { title: '订单编号', dataIndex: 'orderNo', key: 'orderNo', width: 150 },
    { title: '供应商', dataIndex: 'supplierName', key: 'supplierName', width: 150 },
    { title: '订单日期', dataIndex: 'orderDate', key: 'orderDate', width: 120 },
    { title: '要求到货日期', dataIndex: 'expectedDate', key: 'expectedDate', width: 120 },
    { title: '订单金额', dataIndex: 'totalAmount', key: 'totalAmount', width: 120, render: (v: number) => `¥${v?.toFixed(2) || '0.00'}` },
    { title: '优惠金额', dataIndex: 'discountAmount', key: 'discountAmount', width: 100, render: (v: number) => v ? `¥${v.toFixed(2)}` : '-' },
    { title: '应付金额', dataIndex: 'netAmount', key: 'netAmount', width: 120, render: (v: number) => `¥${v?.toFixed(2) || '0.00'}` },
    { title: '状态', dataIndex: 'status', key: 'status', width: 100, render: renderOrderStatus },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_: any, record: PurchaseOrder) => (
        <Space>
          <Button type="link" size="small" onClick={() => handleViewOrder(record)}>查看</Button>
          {record.status <= 1 && (
            <>
              <Button type="link" size="small" icon={<CheckCircleOutlined />} onClick={() => handleApproveOrder(record.id)}>审核</Button>
              <Popconfirm title="确定取消？" onConfirm={() => handleCancelOrder(record.id)}>
                <Button type="link" size="small" danger icon={<CloseCircleOutlined />}>取消</Button>
              </Popconfirm>
            </>
          )}
          {record.status === 0 && (
            <Popconfirm title="确定删除？" onConfirm={() => handleDeleteOrder(record.id)}>
              <Button type="link" size="small" danger>删除</Button>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  // ============ 入库列定义 ============
  const inColumns = [
    { title: '入库单号', dataIndex: 'inNo', key: 'inNo', width: 150 },
    { title: '关联订单', dataIndex: 'orderNo', key: 'orderNo', width: 150 },
    { title: '供应商', dataIndex: 'supplierName', key: 'supplierName', width: 150 },
    { title: '入库日期', dataIndex: 'inDate', key: 'inDate', width: 120 },
    { title: '仓库', dataIndex: 'warehouseName', key: 'warehouseName', width: 120 },
    { title: '入库金额', dataIndex: 'totalAmount', key: 'totalAmount', width: 120, render: (v: number) => `¥${v?.toFixed(2) || '0.00'}` },
    { title: '状态', dataIndex: 'status', key: 'status', width: 100, render: renderInStatus },
    {
      title: '操作',
      key: 'action',
      width: 250,
      render: (_: any, record: PurchaseIn) => (
        <Space>
          <Button type="link" size="small" onClick={() => handleViewIn(record)}>查看</Button>
          {record.status === 0 && (
            <>
              <Button type="link" size="small" icon={<CheckCircleOutlined />} onClick={() => handleApproveIn(record.id)}>审核</Button>
              <Popconfirm title="确定取消？" onConfirm={() => handleCancelIn(record.id)}>
                <Button type="link" size="small" danger icon={<CloseCircleOutlined />}>取消</Button>
              </Popconfirm>
            </>
          )}
          {record.status === 1 && (
            <Button type="link" size="small" icon={<CheckCircleOutlined />} onClick={() => handleCompleteIn(record.id)}>完成</Button>
          )}
        </Space>
      ),
    },
  ];

  // ============ 退货列定义 ============
  const returnColumns = [
    { title: '退货单号', dataIndex: 'returnNo', key: 'returnNo', width: 150 },
    { title: '供应商', dataIndex: 'supplierName', key: 'supplierName', width: 150 },
    { title: '仓库', dataIndex: 'warehouseName', key: 'warehouseName', width: 120 },
    { title: '退货日期', dataIndex: 'returnDate', key: 'returnDate', width: 120 },
    { title: '退货金额', dataIndex: 'refundAmount', key: 'refundAmount', width: 120, render: (v: number) => `¥${v?.toFixed(2) || '0.00'}` },
    { title: '退货原因', dataIndex: 'reason', key: 'reason', ellipsis: true },
    { title: '状态', dataIndex: 'status', key: 'status', width: 100, render: renderReturnStatus },
    {
      title: '操作',
      key: 'action',
      width: 250,
      render: (_: any, record: PurchaseReturn) => (
        <Space>
          <Button type="link" size="small" onClick={() => handleViewReturn(record)}>查看</Button>
          {record.status === 0 && (
            <>
              <Button type="link" size="small" icon={<CheckCircleOutlined />} onClick={() => handleApproveReturn(record.id)}>审核</Button>
              <Button type="link" size="small" danger icon={<CloseCircleOutlined />} onClick={() => handleRejectReturn(record.id)}>拒绝</Button>
            </>
          )}
          {record.status === 1 && (
            <Button type="link" size="small" icon={<CheckCircleOutlined />} onClick={() => handleOutboundReturn(record.id)}>退货出库</Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h2 style={{ marginBottom: 16 }}>采购管理</h2>
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane tab="采购订单" key="order">
          <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
            <Input.Search
              placeholder="搜索订单"
              allowClear
              onSearch={handleOrderSearch}
              style={{ width: 200 }}
              prefix={<SearchOutlined />}
            />
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAddOrder}>新建订单</Button>
          </div>
          <Table
            columns={orderColumns}
            dataSource={orderData}
            rowKey="id"
            loading={orderLoading}
            pagination={{
              current: orderPagination.current,
              pageSize: orderPagination.size,
              total: orderPagination.total,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total) => `共 ${total} 条`,
              onChange: (current, size) => setOrderPagination({ current, size, total: orderPagination.total }),
            }}
            scroll={{ x: 1300 }}
          />
        </TabPane>

        <TabPane tab="采购入库" key="in">
          <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
            <Input.Search
              placeholder="搜索入库单"
              allowClear
              onSearch={handleInSearch}
              style={{ width: 200 }}
              prefix={<SearchOutlined />}
            />
          </div>
          <Table
            columns={inColumns}
            dataSource={inData}
            rowKey="id"
            loading={inLoading}
            pagination={{
              current: inPagination.current,
              pageSize: inPagination.size,
              total: inPagination.total,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total) => `共 ${total} 条`,
              onChange: (current, size) => setInPagination({ current, size, total: inPagination.total }),
            }}
            scroll={{ x: 1300 }}
          />
        </TabPane>

        <TabPane tab="采购退货" key="return">
          <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'flex-end' }}>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAddReturn}>新建退货</Button>
          </div>
          <Table
            columns={returnColumns}
            dataSource={returnData}
            rowKey="id"
            loading={returnLoading}
            pagination={{
              current: returnPagination.current,
              pageSize: returnPagination.size,
              total: returnPagination.total,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total) => `共 ${total} 条`,
              onChange: (current, size) => setReturnPagination({ current, size, total: returnPagination.total }),
            }}
            scroll={{ x: 1300 }}
          />
        </TabPane>
      </Tabs>

      {/* 订单弹窗 */}
      <Modal
        title={editingOrder ? '订单详情' : '新建订单'}
        open={orderModalVisible}
        onOk={editingOrder ? () => setOrderModalVisible(false) : handleOrderModalOk}
        onCancel={() => setOrderModalVisible(false)}
        width={700}
        footer={editingOrder ? [<Button key="close" onClick={() => setOrderModalVisible(false)}>关闭</Button>] : undefined}
      >
        <Form form={form} layout="vertical">
          <Space style={{ width: '100%' }} size="large">
            <Form.Item name="supplierId" label="供应商" rules={[{ required: true }]} style={{ flex: 1 }}>
              <Select placeholder="请选择供应商" disabled={!!editingOrder}>
                {supplierList.map((s) => (
                  <Select.Option key={s.id} value={s.id}>{s.name}</Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="orderDate" label="订单日期" style={{ flex: 1 }}>
              <DatePicker style={{ width: '100%' }} disabled={!!editingOrder} />
            </Form.Item>
          </Space>
          <Space style={{ width: '100%' }} size="large">
            <Form.Item name="expectedDate" label="要求到货日期" style={{ flex: 1 }}>
              <DatePicker style={{ width: '100%' }} disabled={!!editingOrder} />
            </Form.Item>
            <Form.Item name="discountAmount" label="优惠金额" style={{ flex: 1 }}>
              <InputNumber min={0} precision={2} style={{ width: '100%' }} disabled={!!editingOrder} />
            </Form.Item>
          </Space>
          <Form.Item name="remark" label="备注">
            <Input.TextArea rows={2} disabled={!!editingOrder} />
          </Form.Item>
          {editingOrder?.details && editingOrder.details.length > 0 && (
            <>
              <Divider>订单明细</Divider>
              <Descriptions column={2} size="small">
                {editingOrder.details.map((d, i) => (
                  <Descriptions.Item key={i} label={d.productName}>
                    {d.quantity} {d.unit} × ¥{d.price?.toFixed(2)} = ¥{d.amount?.toFixed(2)}
                  </Descriptions.Item>
                ))}
              </Descriptions>
            </>
          )}
        </Form>
      </Modal>

      {/* 入库弹窗 */}
      <Modal
        title="入库单详情"
        open={inModalVisible}
        onCancel={() => setInModalVisible(false)}
        footer={[<Button key="close" onClick={() => setInModalVisible(false)}>关闭</Button>]}
        width={700}
      >
        <Descriptions column={2} size="small">
          <Descriptions.Item label="入库单号">{editingIn?.inNo}</Descriptions.Item>
          <Descriptions.Item label="关联订单">{editingIn?.orderNo}</Descriptions.Item>
          <Descriptions.Item label="供应商">{editingIn?.supplierName}</Descriptions.Item>
          <Descriptions.Item label="入库日期">{editingIn?.inDate}</Descriptions.Item>
          <Descriptions.Item label="仓库">{editingIn?.warehouseName}</Descriptions.Item>
          <Descriptions.Item label="入库金额">¥{editingIn?.totalAmount?.toFixed(2)}</Descriptions.Item>
          <Descriptions.Item label="状态">{renderInStatus(editingIn?.status || 0)}</Descriptions.Item>
        </Descriptions>
        {editingIn?.details && editingIn.details.length > 0 && (
          <>
            <Divider>入库明细</Divider>
            <Descriptions column={2} size="small">
              {editingIn.details.map((d, i) => (
                <Descriptions.Item key={i} label={d.productName}>
                  {d.quantity} {d.unit} × ¥{d.price?.toFixed(2)} = ¥{d.amount?.toFixed(2)}
                </Descriptions.Item>
              ))}
            </Descriptions>
          </>
        )}
      </Modal>

      {/* 退货弹窗 */}
      <Modal
        title={editingReturn ? '退货详情' : '新建退货'}
        open={returnModalVisible}
        onOk={editingReturn ? () => setReturnModalVisible(false) : handleReturnModalOk}
        onCancel={() => setReturnModalVisible(false)}
        width={700}
        footer={editingReturn ? [<Button key="close" onClick={() => setReturnModalVisible(false)}>关闭</Button>] : undefined}
      >
        <Form form={returnForm} layout="vertical">
          <Space style={{ width: '100%' }} size="large">
            <Form.Item name="supplierId" label="供应商" rules={[{ required: true }]} style={{ flex: 1 }}>
              <Select placeholder="请选择供应商" disabled={!!editingReturn}>
                {supplierList.map((s) => (
                  <Select.Option key={s.id} value={s.id}>{s.name}</Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="warehouseId" label="仓库" rules={[{ required: true }]} style={{ flex: 1 }}>
              <Select placeholder="请选择仓库" disabled={!!editingReturn}>
                {warehouseList.map((w) => (
                  <Select.Option key={w.id} value={w.id}>{w.name}</Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Space>
          <Space style={{ width: '100%' }} size="large">
            <Form.Item name="returnDate" label="退货日期" style={{ flex: 1 }}>
              <DatePicker style={{ width: '100%' }} disabled={!!editingReturn} />
            </Form.Item>
            <Form.Item name="refundAmount" label="退款金额" rules={[{ required: true }]} style={{ flex: 1 }}>
              <InputNumber min={0} precision={2} style={{ width: '100%' }} disabled={!!editingReturn} />
            </Form.Item>
          </Space>
          <Form.Item name="reason" label="退货原因">
            <Input.TextArea rows={2} disabled={!!editingReturn} />
          </Form.Item>
          {editingReturn?.details && editingReturn.details.length > 0 && (
            <>
              <Divider>退货明细</Divider>
              <Descriptions column={2} size="small">
                {editingReturn.details.map((d, i) => (
                  <Descriptions.Item key={i} label={d.productName}>
                    {d.quantity} {d.unit} × ¥{d.price?.toFixed(2)} = ¥{d.amount?.toFixed(2)}
                  </Descriptions.Item>
                ))}
              </Descriptions>
            </>
          )}
        </Form>
      </Modal>
    </div>
  );
};

export default PurchasePage;