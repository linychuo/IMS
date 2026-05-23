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
  EditOutlined,
} from '@ant-design/icons';
import { salesApi, customerApi, productApi } from '../../api';

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

interface Product {
  id: string;
  name: string;
  spec?: string;
  unit?: string;
  price?: number;
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
  const [productList, setProductList] = useState<Product[]>([]);
  const [form] = Form.useForm();
  const [orderDetails, setOrderDetails] = useState<SalesOrderDetail[]>([]);

  useEffect(() => {
    fetchCustomers();
    fetchProducts();
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

  const fetchProducts = async () => {
    try {
      const res = await productApi.get('/product/list');
      if (res.data.code === 200) {
        setProductList(res.data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
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
      setData(res.data.data || []);
      setPagination((prev) => ({ ...prev, total: res.data.data?.length || 0 }));
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

  const handleEdit = async (record: SalesOrder) => {
    try {
      const res = await salesApi.get(`/order/${record.id}`);
      if (res.data) {
        setEditingRecord(res.data);
        setOrderDetails(res.data.details || []);
        form.setFieldsValue({
          customerId: res.data.customerId,
          orderDate: res.data.orderDate,
          expectedDate: res.data.expectedDate,
          remark: res.data.remark,
        });
        setModalVisible(true);
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

  // 新增订单相关
  const handleAddOrder = () => {
    form.resetFields();
    setOrderDetails([]);
    setModalVisible(true);
  };

  const handleAddDetail = () => {
    setOrderDetails([...orderDetails, { productId: '', productName: '', spec: '', unit: '', quantity: 1, price: 0, amount: 0 }]);
  };

  const handleRemoveDetail = (index: number) => {
    const newDetails = [...orderDetails];
    newDetails.splice(index, 1);
    setOrderDetails(newDetails);
  };

  const handleDetailChange = (index: number, field: string, value: any) => {
    const newDetails = [...orderDetails];
    newDetails[index] = { ...newDetails[index], [field]: value };
    if (field === 'quantity' || field === 'price') {
      newDetails[index].amount = (newDetails[index].quantity || 0) * (newDetails[index].price || 0);
    }
    setOrderDetails(newDetails);
  };

  const handleProductSelect = (index: number, productId: string) => {
    const product = productList.find(p => p.id === productId);
    if (product) {
      const newDetails = [...orderDetails];
      newDetails[index] = {
        ...newDetails[index],
        productId,
        productName: product.name,
        spec: product.spec || '',
        unit: product.unit || '',
        price: product.price || 0,
        amount: (newDetails[index].quantity || 0) * (product.price || 0),
      };
      setOrderDetails(newDetails);
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      const orderData = {
        customerId: values.customerId,
        customerName: customerList.find(c => c.id === values.customerId)?.name || '',
        orderDate: values.orderDate?.format('YYYY-MM-DD'),
        expectedDate: values.expectedDate?.format('YYYY-MM-DD'),
        remark: values.remark || '',
      };
      let res;
      if (editingRecord) {
        res = await salesApi.put(`/order/${editingRecord.id}`, { salesOrder: orderData, details: orderDetails });
      } else {
        res = await salesApi.post('/order', { salesOrder: orderData, details: orderDetails });
      }
      if (res.data.code === 200) {
        message.success(editingRecord ? '修改成功' : '创建成功');
        setModalVisible(false);
        fetchData();
      } else {
        message.error(res.data.message || '操作失败');
      }
    } catch (error) {
      console.error('Failed to save order:', error);
      message.error('操作失败');
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
      width: 240,
      render: (_: any, record: SalesOrder) => (
        <Space>
          <Button type="link" size="small" onClick={() => handleView(record)}>查看</Button>
          {record.status === 0 && (
            <>
              <Button type="link" size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)}>编辑</Button>
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
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAddOrder}>
          新增订单
        </Button>
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

      {/* 新增/编辑订单弹窗 */}
      <Modal
        title={editingRecord ? '编辑销售订单' : '新增销售订单'}
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={() => setModalVisible(false)}
        width={800}
        okText={editingRecord ? '修改' : '创建'}
        cancelText="取消"
      >
        <Form form={form} layout="vertical">
          <Space style={{ width: '100%' }} size="large">
            <Form.Item name="customerId" label="客户" rules={[{ required: true, message: '请选择客户' }]} style={{ flex: 1 }}>
              <Select placeholder="请选择客户">
                {customerList.map(c => (
                  <Select.Option key={c.id} value={c.id}>{c.name}</Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="orderDate" label="订单日期" rules={[{ required: true, message: '请选择订单日期' }]} style={{ flex: 1 }}>
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
          </Space>
          <Space style={{ width: '100%' }} size="large">
            <Form.Item name="expectedDate" label="要求交货日期" style={{ flex: 1 }}>
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name="remark" label="备注" style={{ flex: 1 }}>
              <Input.TextArea rows={2} placeholder="请输入备注" />
            </Form.Item>
          </Space>
        </Form>

        <Divider>订单明细</Divider>
        <Button type="dashed" onClick={handleAddDetail} style={{ marginBottom: 16 }}>
          添加商品
        </Button>
        {orderDetails.map((detail, index) => (
          <Space key={index} style={{ display: 'flex', marginBottom: 8 }} size="middle">
            <Select
              placeholder="选择商品"
              style={{ width: 200 }}
              value={detail.productId || undefined}
              onChange={(value) => handleProductSelect(index, value)}
            >
              {productList.map(p => (
                <Select.Option key={p.id} value={p.id}>{p.name} {p.spec || ''}</Select.Option>
              ))}
            </Select>
            <InputNumber
              placeholder="数量"
              min={1}
              value={detail.quantity}
              onChange={(value) => handleDetailChange(index, 'quantity', value)}
              style={{ width: 80 }}
            />
            <InputNumber
              placeholder="单价"
              min={0}
              value={detail.price}
              onChange={(value) => handleDetailChange(index, 'price', value)}
              style={{ width: 100 }}
            />
            <span style={{ width: 100 }}>金额: ¥{(detail.amount || 0).toFixed(2)}</span>
            <Button type="link" danger onClick={() => handleRemoveDetail(index)}>删除</Button>
          </Space>
        ))}
      </Modal>

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