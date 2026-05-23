import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Input,
  Space,
  Modal,
  Form,
  DatePicker,
  Select,
  InputNumber,
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
  DeleteOutlined,
} from '@ant-design/icons';
import { salesApi, customerApi, warehouseApi, productApi } from '../../api';

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

interface Product {
  id: string;
  name: string;
  spec?: string;
  unit?: string;
  price?: number;
}

const SalesOutPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<SalesOut[]>([]);
  const [pagination, setPagination] = useState({ current: 1, size: 10, total: 0 });
  const [keyword, setKeyword] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<SalesOut | null>(null);
  const [form] = Form.useForm();
  const [outDetails, setOutDetails] = useState<SalesOutDetail[]>([]);
  const [customerList, setCustomerList] = useState<{ id: string; name: string }[]>([]);
  const [warehouseList, setWarehouseList] = useState<{ id: string; name: string }[]>([]);
  const [productList, setProductList] = useState<Product[]>([]);

  useEffect(() => {
    fetchCustomers();
    fetchWarehouses();
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
      const res = await salesApi.get('/out/list', { params });
      setData(res.data.data || []);
      setPagination((prev) => ({ ...prev, total: res.data.data?.length || 0 }));
    } catch (error) {
      console.error('Failed to fetch outs:', error);
      message.error('获取销售出库失败');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setKeyword(value);
    setPagination((prev) => ({ ...prev, current: 1 }));
  };

  const handleView = async (record: SalesOut) => {
    try {
      const res = await salesApi.get(`/out/${record.id}`);
      if (res.data) {
        setEditingRecord(res.data);
        setViewModalVisible(true);
      }
    } catch (error) {
      message.error('获取出库单详情失败');
    }
  };

  const handleEdit = async (record: SalesOut) => {
    try {
      const res = await salesApi.get(`/out/${record.id}`);
      if (res.data) {
        setEditingRecord(res.data);
        setOutDetails(res.data.details || []);
        form.setFieldsValue({
          customerId: res.data.customerId,
          warehouseId: res.data.warehouseId,
          outDate: res.data.outDate,
          remark: res.data.remark,
        });
        setModalVisible(true);
      }
    } catch (error) {
      message.error('获取出库单详情失败');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await salesApi.delete(`/out/${id}`);
      message.success('删除成功');
      fetchData();
    } catch (error) {
      message.error('删除失败');
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await salesApi.post(`/out/${id}/approve`);
      message.success('审核成功');
      fetchData();
    } catch (error) {
      message.error('审核失败');
    }
  };

  const handleComplete = async (id: string) => {
    try {
      await salesApi.post(`/out/${id}/complete`);
      message.success('完成出库成功');
      fetchData();
    } catch (error) {
      message.error('操作失败');
    }
  };

  const handleCancel = async (id: string) => {
    try {
      await salesApi.post(`/out/${id}/cancel`, null, { params: { reason: '用户取消' } });
      message.success('取消成功');
      fetchData();
    } catch (error) {
      message.error('取消失败');
    }
  };

  // 新增/编辑
  const handleAdd = () => {
    setEditingRecord(null);
    form.resetFields();
    setOutDetails([]);
    setModalVisible(true);
  };

  const handleAddDetail = () => {
    setOutDetails([...outDetails, { productId: '', productName: '', spec: '', unit: '', quantity: 1, price: 0, amount: 0 }]);
  };

  const handleRemoveDetail = (index: number) => {
    const newDetails = [...outDetails];
    newDetails.splice(index, 1);
    setOutDetails(newDetails);
  };

  const handleDetailChange = (index: number, field: string, value: any) => {
    const newDetails = [...outDetails];
    newDetails[index] = { ...newDetails[index], [field]: value };
    if (field === 'quantity' || field === 'price') {
      newDetails[index].amount = (newDetails[index].quantity || 0) * (newDetails[index].price || 0);
    }
    setOutDetails(newDetails);
  };

  const handleProductSelect = (index: number, productId: string) => {
    const product = productList.find(p => p.id === productId);
    if (product) {
      const newDetails = [...outDetails];
      newDetails[index] = {
        ...newDetails[index],
        productId,
        productName: product.name,
        spec: product.spec || '',
        unit: product.unit || '',
        price: product.price || 0,
        amount: (newDetails[index].quantity || 0) * (product.price || 0),
      };
      setOutDetails(newDetails);
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      const outData = {
        customerId: values.customerId,
        customerName: customerList.find(c => c.id === values.customerId)?.name || '',
        warehouseId: values.warehouseId,
        warehouseName: warehouseList.find(w => w.id === values.warehouseId)?.name || '',
        outDate: values.outDate?.format('YYYY-MM-DD'),
        remark: values.remark || '',
      };
      const res = editingRecord
        ? await salesApi.put(`/out/${editingRecord.id}`, { ...outData, id: editingRecord.id, details: outDetails })
        : await salesApi.post('/out', { salesOut: outData, details: outDetails });
      if (res.data.code === 200) {
        message.success(editingRecord ? '修改成功' : '创建成功');
        setModalVisible(false);
        fetchData();
      } else {
        message.error(res.data.message || '操作失败');
      }
    } catch (error) {
      console.error('Failed to save:', error);
      message.error('操作失败');
    }
  };

  const renderStatus = (status: number) => {
    const map: Record<number, { text: string; color: string }> = {
      0: { text: '待出库', color: 'orange' },
      1: { text: '已审核', color: 'blue' },
      2: { text: '已完成', color: 'green' },
      9: { text: '已取消', color: 'red' },
    };
    const s = map[status] || { text: '未知', color: 'default' };
    return <Tag color={s.color}>{s.text}</Tag>;
  };

  const columns = [
    { title: '出库单号', dataIndex: 'outNo', key: 'outNo', width: 150 },
    { title: '关联订单', dataIndex: 'orderNo', key: 'orderNo', width: 150 },
    { title: '客户', dataIndex: 'customerName', key: 'customerName', width: 150 },
    { title: '出库日期', dataIndex: 'outDate', key: 'outDate', width: 120 },
    { title: '仓库', dataIndex: 'warehouseName', key: 'warehouseName', width: 120 },
    { title: '出库金额', dataIndex: 'totalAmount', key: 'totalAmount', width: 120, render: (v: number) => `¥${v?.toFixed(2) || '0.00'}` },
    { title: '状态', dataIndex: 'status', key: 'status', width: 100, render: renderStatus },
    {
      title: '操作',
      key: 'action',
      width: 280,
      render: (_: any, record: SalesOut) => (
        <Space>
          <Button type="link" size="small" onClick={() => handleView(record)}>查看</Button>
          {record.status === 0 && (
            <>
              <Button type="link" size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)}>编辑</Button>
              <Popconfirm title="确定删除？" onConfirm={() => handleDelete(record.id)}>
                <Button type="link" size="small" danger icon={<DeleteOutlined />}>删除</Button>
              </Popconfirm>
              <Button type="link" size="small" icon={<CheckCircleOutlined />} onClick={() => handleApprove(record.id)}>审核</Button>
              <Popconfirm title="确定取消？" onConfirm={() => handleCancel(record.id)}>
                <Button type="link" size="small" danger icon={<CloseCircleOutlined />}>取消</Button>
              </Popconfirm>
            </>
          )}
          {record.status === 1 && (
            <Button type="link" size="small" icon={<CheckCircleOutlined />} onClick={() => handleComplete(record.id)}>完成</Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h2 style={{ marginBottom: 16 }}>销售出库</h2>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <Input.Search
          placeholder="搜索出库单"
          allowClear
          onSearch={handleSearch}
          style={{ width: 200 }}
          prefix={<SearchOutlined />}
        />
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          新建出库
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

      {/* 新增/编辑弹窗 */}
      <Modal
        title={editingRecord ? '编辑出库单' : '新建出库单'}
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={() => setModalVisible(false)}
        width={800}
        okText="确定"
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
            <Form.Item name="warehouseId" label="仓库" rules={[{ required: true, message: '请选择仓库' }]} style={{ flex: 1 }}>
              <Select placeholder="请选择仓库">
                {warehouseList.map(w => (
                  <Select.Option key={w.id} value={w.id}>{w.name}</Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Space>
          <Space style={{ width: '100%' }} size="large">
            <Form.Item name="outDate" label="出库日期" rules={[{ required: true, message: '请选择出库日期' }]} style={{ flex: 1 }}>
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name="remark" label="备注" style={{ flex: 1 }}>
              <Input.TextArea rows={2} placeholder="请输入备注" />
            </Form.Item>
          </Space>
        </Form>

        <Divider>出库明细</Divider>
        <Button type="dashed" onClick={handleAddDetail} style={{ marginBottom: 16 }}>
          添加商品
        </Button>
        {outDetails.map((detail, index) => (
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

      {/* 查看详情弹窗 */}
      <Modal
        title="出库单详情"
        open={viewModalVisible}
        onCancel={() => setViewModalVisible(false)}
        footer={[<Button key="close" onClick={() => setViewModalVisible(false)}>关闭</Button>]}
        width={700}
      >
        <Descriptions column={2} size="small">
          <Descriptions.Item label="出库单号">{editingRecord?.outNo}</Descriptions.Item>
          <Descriptions.Item label="关联订单">{editingRecord?.orderNo}</Descriptions.Item>
          <Descriptions.Item label="客户">{editingRecord?.customerName}</Descriptions.Item>
          <Descriptions.Item label="出库日期">{editingRecord?.outDate}</Descriptions.Item>
          <Descriptions.Item label="仓库">{editingRecord?.warehouseName}</Descriptions.Item>
          <Descriptions.Item label="出库金额">¥{editingRecord?.totalAmount?.toFixed(2)}</Descriptions.Item>
          <Descriptions.Item label="状态">{renderStatus(editingRecord?.status || 0)}</Descriptions.Item>
        </Descriptions>
        {editingRecord?.details && editingRecord.details.length > 0 && (
          <>
            <Divider>出库明细</Divider>
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

export default SalesOutPage;