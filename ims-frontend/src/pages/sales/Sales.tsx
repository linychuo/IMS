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
import { salesApi, customerApi as salesCustomerApi } from '../../api';

const { TabPane } = Tabs;

// ============ 销售订单 ============
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

// ============ 销售出库 ============
interface SalesOutDetail {
  id?: string;
  outId?: string;
  productId?: string;
  productName?: string;
  spec?: string;
  unit?: string;
  quantity?: number;
  price?: number;
  amount?: number;
}

interface SalesOut {
  id: string;
  outNo: string;
  orderId?: string;
  orderNo?: string;
  customerId: string;
  customerName: string;
  outDate: string;
  warehouseId: string;
  warehouseName: string;
  status: number;
  totalAmount: number;
  remark?: string;
  details?: SalesOutDetail[];
}

// ============ 销售退货 ============
interface SalesReturnDetail {
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

interface SalesReturn {
  id: string;
  returnNo: string;
  orderId?: string;
  orderNo?: string;
  outId?: string;
  outNo?: string;
  customerId: string;
  customerName: string;
  returnDate: string;
  warehouseId: string;
  warehouseName: string;
  status: number;
  totalAmount: number;
  refundAmount?: number;
  reason?: string;
  remark?: string;
  auditedBy?: string;
  auditedAt?: string;
  details?: SalesReturnDetail[];
}

// ============ 价格策略 ============
interface PriceStrategy {
  id?: string;
  strategyNo: string;
  strategyName: string;
  customerId?: string;
  customerName?: string;
  productId?: string;
  productName?: string;
  productCategoryId?: string;
  productCategoryName?: string;
  startDate?: string;
  endDate?: string;
  priceType?: number;
  price?: number;
  discountRate?: number;
  status: number;
  remark?: string;
}

const SalesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('order');

  // 通用状态
  const [orderModalVisible, setOrderModalVisible] = useState(false);
  const [outModalVisible, setOutModalVisible] = useState(false);
  const [returnModalVisible, setReturnModalVisible] = useState(false);
  const [editingOrder, setEditingOrder] = useState<SalesOrder | null>(null);
  const [editingOut, setEditingOut] = useState<SalesOut | null>(null);
  const [editingReturn, setEditingReturn] = useState<SalesReturn | null>(null);
  const [customerList, setCustomerList] = useState<{ id: string; name: string }[]>([]);
  const [form] = Form.useForm();
  const [outForm] = Form.useForm();
  const [returnForm] = Form.useForm();

  // 订单状态
  const [orderLoading, setOrderLoading] = useState(false);
  const [orderData, setOrderData] = useState<SalesOrder[]>([]);
  const [orderPagination, setOrderPagination] = useState({ current: 1, size: 10, total: 0 });
  const [orderKeyword, setOrderKeyword] = useState('');

  // 出库状态
  const [outLoading, setOutLoading] = useState(false);
  const [outData, setOutData] = useState<SalesOut[]>([]);
  const [outPagination, setOutPagination] = useState({ current: 1, size: 10, total: 0 });
  const [outKeyword, setOutKeyword] = useState('');

  // 退货状态
  const [returnLoading, setReturnLoading] = useState(false);
  const [returnData, setReturnData] = useState<SalesReturn[]>([]);
  const [returnPagination, setReturnPagination] = useState({ current: 1, size: 10, total: 0 });
  const [returnKeyword, setReturnKeyword] = useState('');

  // 价格策略状态
  const [strategyLoading, setStrategyLoading] = useState(false);
  const [strategyData, setStrategyData] = useState<PriceStrategy[]>([]);
  const [strategyPagination, setStrategyPagination] = useState({ current: 1, size: 10, total: 0 });
  const [strategyModalVisible, setStrategyModalVisible] = useState(false);
  const [editingStrategy, setEditingStrategy] = useState<PriceStrategy | null>(null);
  const [strategyForm] = Form.useForm();

  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    if (activeTab === 'order') {
      fetchOrders();
    } else if (activeTab === 'out') {
      fetchOuts();
    } else if (activeTab === 'return') {
      fetchReturns();
    } else if (activeTab === 'strategy') {
      fetchStrategies();
    }
  }, [activeTab, orderPagination.current, outPagination.current, returnPagination.current, strategyPagination.current]);

  const fetchCustomers = async () => {
    try {
      const res = await salesCustomerApi.get('/customer/list');
      if (res.data.code === 200) {
        setCustomerList(res.data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch customers:', error);
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
      const res = await salesApi.get('/order/list', { params });
      setOrderData(res.data || []);
      setOrderPagination((prev) => ({ ...prev, total: res.data?.length || 0 }));
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      message.error('获取销售订单失败');
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

  const handleViewOrder = async (record: SalesOrder) => {
    try {
      const res = await salesApi.get(`/order/${record.id}`);
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
      await salesApi.post(`/order/${id}/approve`);
      message.success('审核成功');
      fetchOrders();
    } catch (error) {
      message.error('审核失败');
    }
  };

  const handleCancelOrder = async (id: string) => {
    try {
      await salesApi.post(`/order/${id}/cancel`, null, { params: { reason: '用户取消' } });
      message.success('取消成功');
      fetchOrders();
    } catch (error) {
      message.error('取消失败');
    }
  };

  const handleDeleteOrder = async (id: string) => {
    try {
      await salesApi.delete(`/order/${id}`);
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
        await salesApi.put(`/order/${editingOrder.id}`, values);
        message.success('修改成功');
      } else {
        await salesApi.post('/order', values);
        message.success('新增成功');
      }
      setOrderModalVisible(false);
      fetchOrders();
    } catch (error) {
      console.error('Failed to save order:', error);
    }
  };

  // ============ 出库操作 ============
  const fetchOuts = async () => {
    setOutLoading(true);
    try {
      const params: Record<string, any> = {
        page: outPagination.current,
        pageSize: outPagination.size,
      };
      if (outKeyword) {
        params.keyword = outKeyword;
      }
      const res = await salesApi.get('/out/list', { params });
      setOutData(res.data || []);
      setOutPagination((prev) => ({ ...prev, total: res.data?.length || 0 }));
    } catch (error) {
      console.error('Failed to fetch outs:', error);
      message.error('获取销售出库失败');
    } finally {
      setOutLoading(false);
    }
  };

  const handleOutSearch = (value: string) => {
    setOutKeyword(value);
    setOutPagination((prev) => ({ ...prev, current: 1 }));
  };

  const handleViewOut = async (record: SalesOut) => {
    try {
      const res = await salesApi.get(`/out/${record.id}`);
      if (res.data) {
        setEditingOut(res.data);
        outForm.setFieldsValue(res.data);
        setOutModalVisible(true);
      }
    } catch (error) {
      message.error('获取出库单详情失败');
    }
  };

  const handleApproveOut = async (id: string) => {
    try {
      await salesApi.post(`/out/${id}/approve`);
      message.success('审核成功');
      fetchOuts();
    } catch (error) {
      message.error('审核失败');
    }
  };

  const handleCompleteOut = async (id: string) => {
    try {
      await salesApi.post(`/out/${id}/complete`);
      message.success('完成出库成功');
      fetchOuts();
    } catch (error) {
      message.error('操作失败');
    }
  };

  const handleCancelOut = async (id: string) => {
    try {
      await salesApi.post(`/out/${id}/cancel`, null, { params: { reason: '用户取消' } });
      message.success('取消成功');
      fetchOuts();
    } catch (error) {
      message.error('取消失败');
    }
  };

  // ============ 退货操作 ============
  const fetchReturns = async () => {
    setReturnLoading(true);
    try {
      const params: Record<string, any> = {
        page: returnPagination.current,
        pageSize: returnPagination.size,
      };
      if (returnKeyword) {
        params.keyword = returnKeyword;
      }
      const res = await salesApi.get('/return/list', { params });
      setReturnData(res.data || []);
      setReturnPagination((prev) => ({ ...prev, total: res.data?.length || 0 }));
    } catch (error) {
      console.error('Failed to fetch returns:', error);
      message.error('获取销售退货失败');
    } finally {
      setReturnLoading(false);
    }
  };

  const handleReturnSearch = (value: string) => {
    setReturnKeyword(value);
    setReturnPagination((prev) => ({ ...prev, current: 1 }));
  };

  const handleViewReturn = async (record: SalesReturn) => {
    try {
      const res = await salesApi.get(`/return/${record.id}`);
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
      await salesApi.post(`/return/${id}/approve`);
      message.success('审核通过');
      fetchReturns();
    } catch (error) {
      message.error('审核失败');
    }
  };

  const handleRejectReturn = async (id: string) => {
    try {
      await salesApi.post(`/return/${id}/reject`, null, { params: { reason: '不符要求' } });
      message.success('已拒绝');
      fetchReturns();
    } catch (error) {
      message.error('操作失败');
    }
  };

  const handleInboundReturn = async (id: string) => {
    try {
      await salesApi.post(`/return/${id}/inbound`);
      message.success('入库成功');
      fetchReturns();
    } catch (error) {
      message.error('操作失败');
    }
  };

  // ============ 价格策略操作 ============
  const fetchStrategies = async () => {
    setStrategyLoading(true);
    try {
      const res = await salesApi.get('/price-strategy/list');
      setStrategyData(res.data || []);
      setStrategyPagination((prev) => ({ ...prev, total: res.data?.length || 0 }));
    } catch (error) {
      console.error('Failed to fetch strategies:', error);
      message.error('获取价格策略失败');
    } finally {
      setStrategyLoading(false);
    }
  };

  const handleAddStrategy = () => {
    setEditingStrategy(null);
    strategyForm.resetFields();
    setStrategyModalVisible(true);
  };

  const handleEditStrategy = (record: PriceStrategy) => {
    setEditingStrategy(record);
    strategyForm.setFieldsValue(record);
    setStrategyModalVisible(true);
  };

  const handleToggleStrategyStatus = async (id: string, currentStatus: number) => {
    const newStatus = currentStatus === 1 ? 0 : 1;
    try {
      await salesApi.post(`/price-strategy/${id}/status`, null, { params: { status: newStatus } });
      message.success(newStatus === 1 ? '启用成功' : '禁用成功');
      fetchStrategies();
    } catch (error) {
      message.error('操作失败');
    }
  };

  const handleDeleteStrategy = async (id: string) => {
    try {
      await salesApi.delete(`/price-strategy/${id}`);
      message.success('删除成功');
      fetchStrategies();
    } catch (error) {
      message.error('删除失败');
    }
  };

  const handleStrategyModalOk = async () => {
    try {
      const values = await strategyForm.validateFields();
      if (editingStrategy?.id) {
        await salesApi.put(`/price-strategy/${editingStrategy.id}`, values);
        message.success('修改成功');
      } else {
        await salesApi.post('/price-strategy', values);
        message.success('新增成功');
      }
      setStrategyModalVisible(false);
      fetchStrategies();
    } catch (error) {
      console.error('Failed to save strategy:', error);
    }
  };

  // ============ 状态渲染 ============
  const renderOrderStatus = (status: number) => {
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

  const renderOutStatus = (status: number) => {
    const map: Record<number, { text: string; color: string }> = {
      0: { text: '待出库', color: 'orange' },
      1: { text: '已审核', color: 'blue' },
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
      2: { text: '已入库', color: 'green' },
      9: { text: '已拒绝', color: 'red' },
    };
    const s = map[status] || { text: '未知', color: 'default' };
    return <Tag color={s.color}>{s.text}</Tag>;
  };

  // ============ 订单列定义 ============
  const orderColumns = [
    { title: '订单编号', dataIndex: 'orderNo', key: 'orderNo', width: 150 },
    { title: '客户', dataIndex: 'customerName', key: 'customerName', width: 150 },
    { title: '订单日期', dataIndex: 'orderDate', key: 'orderDate', width: 120 },
    { title: '要求交货日期', dataIndex: 'expectedDate', key: 'expectedDate', width: 120 },
    { title: '订单金额', dataIndex: 'totalAmount', key: 'totalAmount', width: 120, render: (v: number) => `¥${v?.toFixed(2) || '0.00'}` },
    { title: '优惠金额', dataIndex: 'discountAmount', key: 'discountAmount', width: 100, render: (v: number) => v ? `¥${v.toFixed(2)}` : '-' },
    { title: '实际金额', dataIndex: 'netAmount', key: 'netAmount', width: 120, render: (v: number) => `¥${v?.toFixed(2) || '0.00'}` },
    { title: '状态', dataIndex: 'status', key: 'status', width: 100, render: renderOrderStatus },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_: any, record: SalesOrder) => (
        <Space>
          <Button type="link" size="small" onClick={() => handleViewOrder(record)}>查看</Button>
          {record.status === 0 && (
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

  // ============ 出库列定义 ============
  const outColumns = [
    { title: '出库单号', dataIndex: 'outNo', key: 'outNo', width: 150 },
    { title: '关联订单', dataIndex: 'orderNo', key: 'orderNo', width: 150 },
    { title: '客户', dataIndex: 'customerName', key: 'customerName', width: 150 },
    { title: '出库日期', dataIndex: 'outDate', key: 'outDate', width: 120 },
    { title: '仓库', dataIndex: 'warehouseName', key: 'warehouseName', width: 120 },
    { title: '出库金额', dataIndex: 'totalAmount', key: 'totalAmount', width: 120, render: (v: number) => `¥${v?.toFixed(2) || '0.00'}` },
    { title: '状态', dataIndex: 'status', key: 'status', width: 100, render: renderOutStatus },
    {
      title: '操作',
      key: 'action',
      width: 250,
      render: (_: any, record: SalesOut) => (
        <Space>
          <Button type="link" size="small" onClick={() => handleViewOut(record)}>查看</Button>
          {record.status === 0 && (
            <>
              <Button type="link" size="small" icon={<CheckCircleOutlined />} onClick={() => handleApproveOut(record.id)}>审核</Button>
              <Popconfirm title="确定取消？" onConfirm={() => handleCancelOut(record.id)}>
                <Button type="link" size="small" danger icon={<CloseCircleOutlined />}>取消</Button>
              </Popconfirm>
            </>
          )}
          {record.status === 1 && (
            <Button type="link" size="small" icon={<CheckCircleOutlined />} onClick={() => handleCompleteOut(record.id)}>完成</Button>
          )}
        </Space>
      ),
    },
  ];

  // ============ 退货列定义 ============
  const returnColumns = [
    { title: '退货单号', dataIndex: 'returnNo', key: 'returnNo', width: 150 },
    { title: '关联订单', dataIndex: 'orderNo', key: 'orderNo', width: 150 },
    { title: '关联出库', dataIndex: 'outNo', key: 'outNo', width: 150 },
    { title: '客户', dataIndex: 'customerName', key: 'customerName', width: 120 },
    { title: '退货日期', dataIndex: 'returnDate', key: 'returnDate', width: 120 },
    { title: '仓库', dataIndex: 'warehouseName', key: 'warehouseName', width: 100 },
    { title: '退货金额', dataIndex: 'totalAmount', key: 'totalAmount', width: 100, render: (v: number) => `¥${v?.toFixed(2) || '0.00'}` },
    { title: '状态', dataIndex: 'status', key: 'status', width: 100, render: renderReturnStatus },
    {
      title: '操作',
      key: 'action',
      width: 280,
      render: (_: any, record: SalesReturn) => (
        <Space>
          <Button type="link" size="small" onClick={() => handleViewReturn(record)}>查看</Button>
          {record.status === 0 && (
            <>
              <Button type="link" size="small" icon={<CheckCircleOutlined />} onClick={() => handleApproveReturn(record.id)}>通过</Button>
              <Button type="link" size="small" danger icon={<CloseCircleOutlined />} onClick={() => handleRejectReturn(record.id)}>拒绝</Button>
            </>
          )}
          {record.status === 1 && (
            <Button type="link" size="small" icon={<CheckCircleOutlined />} onClick={() => handleInboundReturn(record.id)}>入库</Button>
          )}
        </Space>
      ),
    },
  ];

  // ============ 价格策略列定义 ============
  const strategyColumns = [
    { title: '策略编号', dataIndex: 'strategyNo', key: 'strategyNo', width: 120 },
    { title: '策略名称', dataIndex: 'strategyName', key: 'strategyName', width: 150 },
    { title: '客户', dataIndex: 'customerName', key: 'customerName', width: 120, render: (v: string) => v || '全部客户' },
    { title: '商品', dataIndex: 'productName', key: 'productName', width: 120, render: (v: string) => v || '全部商品' },
    { title: '分类', dataIndex: 'productCategoryName', key: 'productCategoryName', width: 100, render: (v: string) => v || '-' },
    { title: '价格类型', dataIndex: 'priceType', key: 'priceType', width: 100, render: (v: number) => v === 1 ? '固定价' : '折扣率' },
    { title: '价格/折扣', dataIndex: 'price', key: 'price', width: 100, render: (v: number, record: PriceStrategy) => record.priceType === 1 ? `¥${v?.toFixed(2)}` : `${v ? (v * 100).toFixed(0) : 0}%` },
    { title: '开始日期', dataIndex: 'startDate', key: 'startDate', width: 120 },
    { title: '结束日期', dataIndex: 'endDate', key: 'endDate', width: 120 },
    { title: '状态', dataIndex: 'status', key: 'status', width: 80, render: (status: number) => <Tag color={status === 1 ? 'green' : 'red'}>{status === 1 ? '启用' : '禁用'}</Tag> },
    {
      title: '操作',
      key: 'action',
      width: 180,
      render: (_: any, record: PriceStrategy) => (
        <Space>
          <Button type="link" size="small" onClick={() => handleEditStrategy(record)}>编辑</Button>
          <Button type="link" size="small" onClick={() => handleToggleStrategyStatus(record.id!, record.status)}>
            {record.status === 1 ? '禁用' : '启用'}
          </Button>
          <Popconfirm title="确定删除？" onConfirm={() => handleDeleteStrategy(record.id!)}>
            <Button type="link" size="small" danger>删除</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h2 style={{ marginBottom: 16 }}>销售管理</h2>
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane tab="销售订单" key="order">
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

        <TabPane tab="销售出库" key="out">
          <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
            <Input.Search
              placeholder="搜索出库单"
              allowClear
              onSearch={handleOutSearch}
              style={{ width: 200 }}
              prefix={<SearchOutlined />}
            />
          </div>
          <Table
            columns={outColumns}
            dataSource={outData}
            rowKey="id"
            loading={outLoading}
            pagination={{
              current: outPagination.current,
              pageSize: outPagination.size,
              total: outPagination.total,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total) => `共 ${total} 条`,
              onChange: (current, size) => setOutPagination({ current, size, total: outPagination.total }),
            }}
            scroll={{ x: 1300 }}
          />
        </TabPane>

        <TabPane tab="销售退货" key="return">
          <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
            <Input.Search
              placeholder="搜索退货单"
              allowClear
              onSearch={handleReturnSearch}
              style={{ width: 200 }}
              prefix={<SearchOutlined />}
            />
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
            scroll={{ x: 1400 }}
          />
        </TabPane>

        <TabPane tab="价格策略" key="strategy">
          <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'flex-end' }}>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAddStrategy}>新建策略</Button>
          </div>
          <Table
            columns={strategyColumns}
            dataSource={strategyData}
            rowKey="id"
            loading={strategyLoading}
            pagination={{
              current: strategyPagination.current,
              pageSize: strategyPagination.size,
              total: strategyPagination.total,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total) => `共 ${total} 条`,
              onChange: (current, size) => setStrategyPagination({ current, size, total: strategyPagination.total }),
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
            <Form.Item name="customerId" label="客户" rules={[{ required: true }]} style={{ flex: 1 }}>
              <Select placeholder="请选择客户" disabled={!!editingOrder}>
                {customerList.map((c) => (
                  <Select.Option key={c.id} value={c.id}>{c.name}</Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="orderDate" label="订单日期" style={{ flex: 1 }}>
              <DatePicker style={{ width: '100%' }} disabled={!!editingOrder} />
            </Form.Item>
          </Space>
          <Space style={{ width: '100%' }} size="large">
            <Form.Item name="expectedDate" label="要求交货日期" style={{ flex: 1 }}>
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

      {/* 出库弹窗 */}
      <Modal
        title="出库单详情"
        open={outModalVisible}
        onCancel={() => setOutModalVisible(false)}
        footer={[<Button key="close" onClick={() => setOutModalVisible(false)}>关闭</Button>]}
        width={700}
      >
        <Descriptions column={2} size="small">
          <Descriptions.Item label="出库单号">{editingOut?.outNo}</Descriptions.Item>
          <Descriptions.Item label="关联订单">{editingOut?.orderNo}</Descriptions.Item>
          <Descriptions.Item label="客户">{editingOut?.customerName}</Descriptions.Item>
          <Descriptions.Item label="出库日期">{editingOut?.outDate}</Descriptions.Item>
          <Descriptions.Item label="仓库">{editingOut?.warehouseName}</Descriptions.Item>
          <Descriptions.Item label="出库金额">¥{editingOut?.totalAmount?.toFixed(2)}</Descriptions.Item>
          <Descriptions.Item label="状态">{renderOutStatus(editingOut?.status || 0)}</Descriptions.Item>
        </Descriptions>
        {editingOut?.details && editingOut.details.length > 0 && (
          <>
            <Divider>出库明细</Divider>
            <Descriptions column={2} size="small">
              {editingOut.details.map((d, i) => (
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
        title="退货单详情"
        open={returnModalVisible}
        onCancel={() => setReturnModalVisible(false)}
        footer={[<Button key="close" onClick={() => setReturnModalVisible(false)}>关闭</Button>]}
        width={700}
      >
        <Descriptions column={2} size="small">
          <Descriptions.Item label="退货单号">{editingReturn?.returnNo}</Descriptions.Item>
          <Descriptions.Item label="关联订单">{editingReturn?.orderNo}</Descriptions.Item>
          <Descriptions.Item label="关联出库">{editingReturn?.outNo}</Descriptions.Item>
          <Descriptions.Item label="客户">{editingReturn?.customerName}</Descriptions.Item>
          <Descriptions.Item label="退货日期">{editingReturn?.returnDate}</Descriptions.Item>
          <Descriptions.Item label="仓库">{editingReturn?.warehouseName}</Descriptions.Item>
          <Descriptions.Item label="退货金额">¥{editingReturn?.totalAmount?.toFixed(2)}</Descriptions.Item>
          <Descriptions.Item label="退款金额">¥{editingReturn?.refundAmount?.toFixed(2)}</Descriptions.Item>
          <Descriptions.Item label="退货原因" span={2}>{editingReturn?.reason}</Descriptions.Item>
          <Descriptions.Item label="状态">{renderReturnStatus(editingReturn?.status || 0)}</Descriptions.Item>
        </Descriptions>
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
      </Modal>

      {/* 价格策略弹窗 */}
      <Modal
        title={editingStrategy ? '编辑价格策略' : '新建价格策略'}
        open={strategyModalVisible}
        onOk={handleStrategyModalOk}
        onCancel={() => setStrategyModalVisible(false)}
        width={600}
      >
        <Form form={strategyForm} layout="vertical">
          <Space style={{ width: '100%' }} size="large">
            <Form.Item
              name="strategyNo"
              label="策略编号"
              rules={[{ required: true, message: '请输入策略编号' }]}
              style={{ flex: 1 }}
            >
              <Input placeholder="请输入策略编号" disabled={!!editingStrategy} />
            </Form.Item>
            <Form.Item
              name="strategyName"
              label="策略名称"
              rules={[{ required: true, message: '请输入策略名称' }]}
              style={{ flex: 1 }}
            >
              <Input placeholder="请输入策略名称" />
            </Form.Item>
          </Space>
          <Space style={{ width: '100%' }} size="large">
            <Form.Item name="customerId" label="客户" style={{ flex: 1 }}>
              <Select placeholder="选择客户(空表示全部)" allowClear>
                {customerList.map((c) => (
                  <Select.Option key={c.id} value={c.id}>{c.name}</Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="productId" label="商品" style={{ flex: 1 }}>
              <Input placeholder="请输入商品ID" />
            </Form.Item>
          </Space>
          <Space style={{ width: '100%' }} size="large">
            <Form.Item name="startDate" label="开始日期" style={{ flex: 1 }}>
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name="endDate" label="结束日期" style={{ flex: 1 }}>
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
          </Space>
          <Space style={{ width: '100%' }} size="large">
            <Form.Item
              name="priceType"
              label="价格类型"
              rules={[{ required: true, message: '请选择价格类型' }]}
              style={{ flex: 1 }}
            >
              <Select placeholder="请选择">
                <Select.Option value={1}>固定价</Select.Option>
                <Select.Option value={2}>折扣率</Select.Option>
              </Select>
            </Form.Item>
          </Space>
          <Form.Item noStyle shouldUpdate={(prev, curr) => prev.priceType !== curr.priceType}>
            {({ getFieldValue }) => (
              <Space style={{ width: '100%' }} size="large">
                {getFieldValue('priceType') === 1 ? (
                  <Form.Item name="price" label="价格" rules={[{ required: true }]} style={{ flex: 1 }}>
                    <InputNumber min={0} precision={2} style={{ width: '100%' }} placeholder="请输入价格" />
                  </Form.Item>
                ) : (
                  <Form.Item name="price" label="折扣率" rules={[{ required: true }]} style={{ flex: 1 }}>
                    <InputNumber min={0} max={1} precision={2} style={{ width: '100%' }} placeholder="如: 0.85 表示85折" />
                  </Form.Item>
                )}
              </Space>
            )}
          </Form.Item>
          <Form.Item name="remark" label="备注">
            <Input.TextArea rows={2} placeholder="请输入备注" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default SalesPage;