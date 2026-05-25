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
  Radio,
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  EditOutlined,
  ClockCircleOutlined,
  PrinterOutlined,
} from '@ant-design/icons';
import {
  Timeline,
  Card,
  Steps,
  Typography,
  Row,
  Col,
} from 'antd';
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

interface StatusHistory {
  id: string;
  orderId: string;
  orderNo: string;
  fromStatus: number;
  toStatus: number;
  operatorId: string;
  operatorName: string;
  operateTime: string;
  remark: string;
}

const { Text } = Typography;

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
  const [statusHistory, setStatusHistory] = useState<StatusHistory[]>([]);
  const [customerLevel, setCustomerLevel] = useState<number>(0);
  const [selectedCustomerCredit, setSelectedCustomerCredit] = useState<{ creditLimit: number; receivableAmount: number } | null>(null);
  const [printModalVisible, setPrintModalVisible] = useState(false);
  const [printTemplates, setPrintTemplates] = useState<{ id: number; templateName: string }[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<number | null>(null);
  const [printLoading, setPrintLoading] = useState(false);

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
        // 获取状态历史
        try {
          const historyRes = await salesApi.get(`/sales/order/${record.id}/status-history`);
          if (historyRes.data?.code === 200) {
            setStatusHistory(historyRes.data.data || []);
          } else {
            setStatusHistory([]);
          }
        } catch (e) {
          setStatusHistory([]);
        }
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
        setStatusHistory([]);
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

  // 打印相关
  const handlePrint = async (record: SalesOrder) => {
    try {
      setPrintLoading(true);
      const res = await salesApi.get(`/order/${record.id}/print-data`);
      if (res.data?.code === 200) {
        const data = res.data.data;
        setPrintTemplates(data.templates || []);
        setSelectedTemplateId(data.defaultTemplateId || null);
        setEditingRecord(data.order);
        setPrintModalVisible(true);
      } else {
        message.error(res.data?.message || '获取打印数据失败');
      }
    } catch (error) {
      console.error('Failed to fetch print data:', error);
      message.error('获取打印数据失败');
    } finally {
      setPrintLoading(false);
    }
  };

  const handlePreview = async () => {
    if (!editingRecord) return;
    const win = window.open('', '_blank');
    if (!win) {
      message.error('无法打开打印预览，请检查浏览器弹窗设置');
      return;
    }
    try {
      const url = `/api/sales/order/${editingRecord.id}/print-preview${selectedTemplateId ? '?templateId=' + selectedTemplateId : ''}`;
      const res = await salesApi.get(url, { responseType: 'text' });
      win.document.write(res.data);
      win.document.close();
    } catch (error) {
      console.error('Failed to load print preview:', error);
      message.error('加载打印预览失败');
      win.close();
    }
  };

  const handleDirectPrint = async () => {
    if (!editingRecord) return;
    const win = window.open('', '_blank');
    if (!win) {
      message.error('无法打开打印，请检查浏览器弹窗设置');
      return;
    }
    try {
      const url = `/api/sales/order/${editingRecord.id}/print-preview${selectedTemplateId ? '?templateId=' + selectedTemplateId : ''}`;
      const res = await salesApi.get(url, { responseType: 'text' });
      win.document.write(res.data);
      win.document.close();
      win.print();
    } catch (error) {
      console.error('Failed to print:', error);
      message.error('打印失败');
      win.close();
    }
  };

  // 新增订单相关
  const handleAddOrder = () => {
    form.resetFields();
    setOrderDetails([]);
    setStatusHistory([]);
    setEditingRecord(null);
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

  const handleCustomerSelect = (customerId: string) => {
    const customer = customerList.find(c => c.id === customerId);
    if (customer) {
      // 调用接口获取客户完整的信用信息
      customerApi.get(`/customer/${customerId}`).then(res => {
        if (res.data?.code === 200 && res.data.data) {
          setSelectedCustomerCredit({
            creditLimit: res.data.data.creditLimit || 0,
            receivableAmount: res.data.data.receivableAmount || 0,
          });
        }
      }).catch(() => {});
    }
  };

  const handleProductSelect = async (index: number, productId: string) => {
    const product = productList.find(p => p.id === productId);
    if (product) {
      const customerId = form.getFieldValue('customerId');
      let finalPrice = product.price || 0;

      // 获取客户等级价格
      if (customerId && productId) {
        try {
          const res = await salesApi.get('/sales/price-strategy/price', {
            params: {
              customerId: customerId,
              productId: productId,
              standardPrice: product.price || 0
            }
          });
          if (res.data?.code === 200 && res.data.data) {
            finalPrice = res.data.data;
          }
        } catch (e) {
          console.error('获取等级价格失败', e);
        }
      }

      const newDetails = [...orderDetails];
      newDetails[index] = {
        ...newDetails[index],
        productId,
        productName: product.name,
        spec: product.spec || '',
        unit: product.unit || '',
        price: finalPrice,
        amount: (newDetails[index].quantity || 1) * finalPrice,
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

  const getStatusName = (status: number): string => {
    const map: Record<number, string> = {
      0: '新建',
      1: '已审核',
      2: '部分出库',
      3: '已完成',
      9: '已取消',
    };
    return map[status] || `状态${status}`;
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
          <Button type="link" size="small" icon={<PrinterOutlined />} onClick={() => handlePrint(record)}>打印</Button>
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
              <Select placeholder="请选择客户" onChange={handleCustomerSelect}>
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
          {selectedCustomerCredit && (
            <div style={{ background: '#f5f5f5', padding: '12px 16px', borderRadius: 4, marginBottom: 16 }}>
              <Space size="large">
                <span>信用额度: <strong style={{ color: '#1890ff' }}>¥{selectedCustomerCredit.creditLimit?.toFixed(2) || '0.00'}</strong></span>
                <span>已用额度: <strong style={{ color: '#ff4d4f' }}>¥{selectedCustomerCredit.receivableAmount?.toFixed(2) || '0.00'}</strong></span>
                <span>可用额度: <strong style={{ color: '#52c41a' }}>¥{((selectedCustomerCredit.creditLimit || 0) - (selectedCustomerCredit.receivableAmount || 0)).toFixed(2)}</strong></span>
              </Space>
            </div>
          )}
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
        onOk={() => { setViewModalVisible(false); setStatusHistory([]); }}
        onCancel={() => { setViewModalVisible(false); setStatusHistory([]); }}
        footer={[<Button key="close" onClick={() => { setViewModalVisible(false); setStatusHistory([]); }}>关闭</Button>]}
        width={700}
      >
        <Descriptions column={2} size="small">
          <Descriptions.Item label="订单编号">{editingRecord?.orderNo}</Descriptions.Item>
          <Descriptions.Item label="客户">{editingRecord?.customerName}</Descriptions.Item>
          <Descriptions.Item label="订单日期">{editingRecord?.orderDate}</Descriptions.Item>
          <Descriptions.Item label="要求交货日期">{editingRecord?.expectedDate || '-'}</Descriptions.Item>
          <Descriptions.Item label="订单金额">¥{editingRecord?.totalAmount?.toFixed(2)}</Descriptions.Item>
          <Descriptions.Item label="优惠金额">¥{editingRecord?.discountAmount?.toFixed(2) || '-'}</Descriptions.Item>
          <Descriptions.Item label="实际金额"><Text strong>¥{editingRecord?.netAmount?.toFixed(2)}</Text></Descriptions.Item>
          <Descriptions.Item label="状态">{renderStatus(editingRecord?.status || 0)}</Descriptions.Item>
          <Descriptions.Item label="审核人">{editingRecord?.auditedBy || '-'}</Descriptions.Item>
          <Descriptions.Item label="审核时间">{editingRecord?.auditedAt || '-'}</Descriptions.Item>
          {editingRecord?.remark && <Descriptions.Item label="备注" span={2}>{editingRecord.remark}</Descriptions.Item>}
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
        {statusHistory.length > 0 && (
          <>
            <Divider>订单跟踪</Divider>
            <Card size="small" style={{ marginBottom: 16 }}>
              <Steps
                current={statusHistory.length - 1}
                size="small"
                items={statusHistory.map(h => ({
                  title: getStatusName(h.toStatus),
                  description: (
                    <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                      {h.operatorName} {h.operateTime}
                    </Typography.Text>
                  ),
                  status: h.toStatus === 9 ? 'error' : h.toStatus === 3 ? 'finish' : 'process',
                }))}
              />
            </Card>
            <Card size="small" title="操作记录" style={{ maxHeight: 200, overflow: 'auto' }}>
              <Timeline
                items={statusHistory.map(h => ({
                  color: h.toStatus === 9 ? 'red' : h.toStatus === 3 ? 'green' : 'blue',
                  children: (
                    <div>
                      <div>
                        <Tag color={h.toStatus === 9 ? 'red' : h.toStatus === 3 ? 'green' : 'blue'}>
                          {getStatusName(h.fromStatus)} → {getStatusName(h.toStatus)}
                        </Tag>
                      </div>
                      <div style={{ fontSize: 12, color: '#888' }}>
                        操作人: {h.operatorName} | {h.operateTime}
                        {h.remark && ` | ${h.remark}`}
                      </div>
                    </div>
                  ),
                }))}
              />
            </Card>
          </>
        )}
      </Modal>

      {/* 打印弹窗 */}
      <Modal
        title="打印销售订单"
        open={printModalVisible}
        onCancel={() => { setPrintModalVisible(false); setPrintTemplates([]); setSelectedTemplateId(null); }}
        footer={[
          <Button key="cancel" onClick={() => setPrintModalVisible(false)}>关闭</Button>,
          <Button key="preview" onClick={handlePreview}>预览</Button>,
          <Button key="print" type="primary" icon={<PrinterOutlined />} onClick={handleDirectPrint}>直接打印</Button>,
        ]}
        width={500}
      >
        {printTemplates.length > 0 ? (
          <div>
            <p style={{ marginBottom: 12 }}>选择打印模板：</p>
            <Radio.Group
              value={selectedTemplateId}
              onChange={(e) => setSelectedTemplateId(e.target.value)}
              style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
            >
              {printTemplates.map(t => (
                <Radio key={t.id} value={t.id}>{t.templateName}</Radio>
              ))}
            </Radio.Group>
          </div>
        ) : (
          <p style={{ color: '#888' }}>暂无可用模板，将使用默认格式打印</p>
        )}
      </Modal>
    </div>
  );
};

export default SalesOrderPage;