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
  Card,
  Row,
  Col,
  Statistic,
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import { salesApi, customerApi, productApi } from '../../api';
import type { SelectProps } from 'antd';

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

const SalesPriceStrategyPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<PriceStrategy[]>([]);
  const [filteredData, setFilteredData] = useState<PriceStrategy[]>([]);
  const [pagination, setPagination] = useState({ current: 1, size: 10, total: 0 });
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<PriceStrategy | null>(null);
  const [customerList, setCustomerList] = useState<{ id: string; name: string }[]>([]);
  const [productList, setProductList] = useState<{ id: number; name: string; productCode: string }[]>([]);
  const [categoryList, setCategoryList] = useState<{ id: number; name: string }[]>([]);
  const [form] = Form.useForm();
  const [keyword, setKeyword] = useState('');
  const [customerFilter, setCustomerFilter] = useState<string | undefined>(undefined);
  const [statusFilter, setStatusFilter] = useState<number | undefined>(undefined);

  useEffect(() => {
    fetchCustomers();
    fetchProducts();
    fetchCategories();
    fetchData();
  }, [pagination.current, pagination.size]);

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

  const fetchCategories = async () => {
    try {
      const res = await productApi.get('/category/list');
      if (res.data.code === 200) {
        setCategoryList(res.data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await salesApi.get('/sales/price-strategy/list');
      const allData = res.data.data || [];
      setData(allData);
      setPagination((prev) => ({ ...prev, total: allData.length }));
      applyFilters(allData);
    } catch (error) {
      console.error('Failed to fetch strategies:', error);
      message.error('获取价格策略失败');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = (allData: PriceStrategy[]) => {
    let filtered = allData;
    if (keyword) {
      filtered = filtered.filter(item =>
        item.strategyName?.toLowerCase().includes(keyword.toLowerCase()) ||
        item.strategyNo?.toLowerCase().includes(keyword.toLowerCase()) ||
        item.customerName?.toLowerCase().includes(keyword.toLowerCase()) ||
        item.productName?.toLowerCase().includes(keyword.toLowerCase())
      );
    }
    if (customerFilter) {
      filtered = filtered.filter(item => item.customerId === customerFilter);
    }
    if (statusFilter !== undefined) {
      filtered = filtered.filter(item => item.status === statusFilter);
    }
    setFilteredData(filtered);
  };

  const handleSearch = (value: string) => {
    setKeyword(value);
    applyFilters(data);
  };

  const handleCustomerFilterChange = (value: string | undefined) => {
    setCustomerFilter(value);
    applyFilters(data);
  };

  const handleStatusFilterChange = (value: number | undefined) => {
    setStatusFilter(value);
    applyFilters(data);
  };

  const handleAdd = () => {
    setEditingRecord(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record: PriceStrategy) => {
    setEditingRecord(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleToggleStatus = async (id: string, currentStatus: number) => {
    const newStatus = currentStatus === 1 ? 0 : 1;
    try {
      await salesApi.post(`/sales/price-strategy/${id}/status`, null, { params: { status: newStatus } });
      message.success(newStatus === 1 ? '启用成功' : '禁用成功');
      fetchData();
    } catch (error) {
      message.error('操作失败');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await salesApi.delete(`/sales/price-strategy/${id}`);
      message.success('删除成功');
      fetchData();
    } catch (error) {
      message.error('删除失败');
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      const params: Record<string, any> = {
        ...values,
        customerName: customerList.find(c => c.id === values.customerId)?.name || '',
        productName: productList.find(p => p.id === values.productId)?.name || '',
        productCategoryName: categoryList.find(c => c.id === values.productCategoryId)?.name || '',
      };
      if (editingRecord?.id) {
        await salesApi.put(`/sales/price-strategy/${editingRecord.id}`, params);
        message.success('修改成功');
      } else {
        await salesApi.post('/sales/price-strategy', params);
        message.success('新增成功');
      }
      setModalVisible(false);
      fetchData();
    } catch (error) {
      console.error('Failed to save strategy:', error);
    }
  };

  const columns = [
    { title: '策略编号', dataIndex: 'strategyNo', key: 'strategyNo', width: 120 },
    { title: '策略名称', dataIndex: 'strategyName', key: 'strategyName', width: 150 },
    { title: '客户', dataIndex: 'customerName', key: 'customerName', width: 120, render: (v: string) => v || '全部客户' },
    { title: '商品', dataIndex: 'productName', key: 'productName', width: 120, render: (v: string) => v || '全部商品' },
    { title: '分类', dataIndex: 'productCategoryName', key: 'productCategoryName', width: 100, render: (v: string) => v || '-' },
    { title: '价格类型', dataIndex: 'priceType', key: 'priceType', width: 100, render: (v: number) => v === 1 ? '固定价' : '折扣率' },
    { title: '价格/折扣', dataIndex: 'price', key: 'price', width: 100, render: (v: number, record: PriceStrategy) => record.priceType === 1 ? `¥${v?.toFixed(2)}` : `${record.discountRate ? (record.discountRate * 100).toFixed(0) : 0}%` },
    { title: '开始日期', dataIndex: 'startDate', key: 'startDate', width: 120 },
    { title: '结束日期', dataIndex: 'endDate', key: 'endDate', width: 120 },
    { title: '状态', dataIndex: 'status', key: 'status', width: 80, render: (status: number) => <Tag color={status === 1 ? 'green' : 'red'}>{status === 1 ? '启用' : '禁用'}</Tag> },
    {
      title: '操作',
      key: 'action',
      width: 180,
      render: (_: any, record: PriceStrategy) => (
        <Space>
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)}>编辑</Button>
          <Button type="link" size="small" onClick={() => handleToggleStatus(record.id!, record.status)}>
            {record.status === 1 ? '禁用' : '启用'}
          </Button>
          <Popconfirm title="确定删除？" onConfirm={() => handleDelete(record.id!)}>
            <Button type="link" size="small" danger icon={<DeleteOutlined />}>删除</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const activeStrategies = data.filter(d => d.status === 1);
  const customerSpecific = data.filter(d => d.customerId);
  const productSpecific = data.filter(d => d.productId);

  return (
    <div>
      <h2 style={{ marginBottom: 16 }}>价格策略</h2>
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card size="small">
            <Statistic title="策略总数" value={data.length} prefix={<SearchOutlined />} />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic title="启用中" value={activeStrategies.length} valueStyle={{ color: '#52c41a' }} />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic title="客户专价" value={customerSpecific.length} valueStyle={{ color: '#1890ff' }} />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic title="商品专价" value={productSpecific.length} valueStyle={{ color: '#722ed1' }} />
          </Card>
        </Col>
      </Row>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <Space wrap>
          <Input.Search
            placeholder="搜索策略/客户/商品"
            allowClear
            onSearch={handleSearch}
            style={{ width: 200 }}
            prefix={<SearchOutlined />}
          />
          <Select
            allowClear
            placeholder="选择客户"
            style={{ width: 150 }}
            onChange={handleCustomerFilterChange}
            showSearch
            filterOption={(input, option) =>
              (option?.label as unknown as string)?.toLowerCase().includes(input.toLowerCase())
            }
            options={customerList.map(c => ({ value: c.id, label: c.name }))}
          />
          <Select
            allowClear
            placeholder="状态筛选"
            style={{ width: 100 }}
            onChange={handleStatusFilterChange}
          >
            <Select.Option value={1}>启用</Select.Option>
            <Select.Option value={0}>禁用</Select.Option>
          </Select>
        </Space>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>新建策略</Button>
      </div>
      <Table
        columns={columns}
        dataSource={filteredData}
        rowKey="id"
        loading={loading}
        pagination={{
          current: pagination.current,
          pageSize: pagination.size,
          total: filteredData.length,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 条`,
          onChange: (current, size) => setPagination({ current, size, total: filteredData.length }),
        }}
        scroll={{ x: 1300 }}
      />

      <Modal
        title={editingRecord ? '编辑价格策略' : '新建价格策略'}
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={() => setModalVisible(false)}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Space style={{ width: '100%' }} size="large">
            <Form.Item
              name="strategyNo"
              label="策略编号"
              rules={[{ required: true, message: '请输入策略编号' }]}
              style={{ flex: 1 }}
            >
              <Input placeholder="请输入策略编号" disabled={!!editingRecord} />
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
              <Select
                placeholder="选择商品(空表示全部)"
                allowClear
                showSearch
                filterOption={(input, option) =>
                  (option?.label as any)?.toLowerCase().includes(input.toLowerCase())
                }
                options={productList.map(p => ({ value: p.id, label: `${p.name} (${p.productCode})` }))}
              />
            </Form.Item>
          </Space>
          <Space style={{ width: '100%' }} size="large">
            <Form.Item name="productCategoryId" label="商品分类" style={{ flex: 1 }}>
              <Select
                placeholder="选择分类(空表示全部)"
                allowClear
                onChange={() => form.setFieldValue('productId', undefined)}
                options={categoryList.map(c => ({ value: c.id, label: c.name }))}
              />
            </Form.Item>
            <Form.Item name="priceType" label="价格类型" rules={[{ required: true, message: '请选择价格类型' }]} style={{ flex: 1 }}>
              <Select placeholder="请选择">
                <Select.Option value={1}>固定价</Select.Option>
                <Select.Option value={2}>折扣率</Select.Option>
              </Select>
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
          <Form.Item noStyle shouldUpdate={(prev, curr) => prev.priceType !== curr.priceType}>
            {({ getFieldValue }) => (
              <Space style={{ width: '100%' }} size="large">
                {getFieldValue('priceType') === 1 ? (
                  <Form.Item name="price" label="价格" rules={[{ required: true }]} style={{ flex: 1 }}>
                    <InputNumber min={0} precision={2} style={{ width: '100%' }} placeholder="请输入价格" />
                  </Form.Item>
                ) : (
                  <Form.Item name="discountRate" label="折扣率" rules={[{ required: true }]} style={{ flex: 1 }}>
                    <InputNumber min={0} max={100} precision={2} style={{ width: '100%' }} placeholder="如: 85 表示85折" />
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

export default SalesPriceStrategyPage;