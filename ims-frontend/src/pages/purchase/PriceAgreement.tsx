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
  DatePicker,
  message,
  Popconfirm,
  Tag,
  Card,
  Row,
  Col,
  Statistic,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { procurementApi, supplierApi, productApi } from '../../api';

interface SupplierPriceAgreement {
  id?: number;
  agreementNo: string;
  agreementName: string;
  supplierId: number;
  supplierName: string;
  productId: number;
  productName: string;
  productCode: string;
  startDate?: string;
  endDate?: string;
  priceType?: number;
  standardPrice?: number;
  tier1Quantity?: number;
  tier1Price?: number;
  tier2Quantity?: number;
  tier2Price?: number;
  tier3Quantity?: number;
  tier3Price?: number;
  status: number;
  remark?: string;
}

const PurchasePriceStrategyPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<SupplierPriceAgreement[]>([]);
  const [pagination, setPagination] = useState({ current: 1, size: 10, total: 0 });
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<SupplierPriceAgreement | null>(null);
  const [form] = Form.useForm();
  const [supplierList, setSupplierList] = useState<{ id: number; name: string }[]>([]);
  const [productList, setProductList] = useState<{ id: number; name: string; productCode: string }[]>([]);
  const [keyword, setKeyword] = useState('');

  useEffect(() => {
    fetchSuppliers();
    fetchProducts();
  }, []);

  useEffect(() => {
    fetchData();
  }, [pagination.current, pagination.size, keyword]);

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
      const res = await procurementApi.get('/procurement/price-agreement/list', { params });
      if (res.data.code === 200) {
        setData(res.data.data || []);
        setPagination((prev) => ({ ...prev, total: res.data.data?.length || 0 }));
      }
    } catch (error) {
      message.error('获取价格协议列表失败');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setKeyword(value);
    setPagination((prev) => ({ ...prev, current: 1 }));
  };

  const handleAdd = () => {
    setEditingRecord(null);
    form.resetFields();
    form.setFieldsValue({ priceType: 1, status: 1 });
    setModalVisible(true);
  };

  const handleEdit = (record: SupplierPriceAgreement) => {
    setEditingRecord(record);
    form.setFieldsValue({
      ...record,
      startDate: record.startDate ? record.startDate : undefined,
      endDate: record.endDate ? record.endDate : undefined,
    });
    setModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      const res = await procurementApi.delete(`/procurement/price-agreement/${id}`);
      if (res.data.code === 200) {
        message.success('删除成功');
        fetchData();
      } else {
        message.error(res.data.message || '删除失败');
      }
    } catch (error) {
      message.error('删除失败');
    }
  };

  const handleToggleStatus = async (id: number, currentStatus: number) => {
    try {
      const newStatus = currentStatus === 1 ? 0 : 1;
      const res = await procurementApi.post(`/procurement/price-agreement/${id}/status`, null, { params: { status: newStatus } });
      if (res.data.code === 200) {
        message.success(newStatus === 1 ? '已启用' : '已禁用');
        fetchData();
      } else {
        message.error(res.data.message || '操作失败');
      }
    } catch (error) {
      message.error('操作失败');
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      const agreementData = {
        ...values,
        startDate: values.startDate?.format('YYYY-MM-DD'),
        endDate: values.endDate?.format('YYYY-MM-DD'),
        supplierName: supplierList.find(s => s.id === values.supplierId)?.name || '',
        productName: productList.find(p => p.id === values.productId)?.name || '',
        productCode: productList.find(p => p.id === values.productId)?.productCode || '',
      };
      if (editingRecord?.id) {
        const res = await procurementApi.put(`/procurement/price-agreement/${editingRecord.id}`, agreementData);
        if (res.data.code === 200) {
          message.success('修改成功');
          setModalVisible(false);
          fetchData();
        } else {
          message.error(res.data.message || '修改失败');
        }
      } else {
        const res = await procurementApi.post('/procurement/price-agreement', agreementData);
        if (res.data.code === 200) {
          message.success('新增成功');
          setModalVisible(false);
          fetchData();
        } else {
          message.error(res.data.message || '新增失败');
        }
      }
    } catch (error) {
      console.error('Failed to save:', error);
    }
  };

  const renderPriceType = (type: number) => {
    return <Tag color={type === 1 ? 'blue' : 'green'}>{type === 1 ? '固定价' : '阶梯价'}</Tag>;
  };

  const renderStatus = (status: number) => {
    return <Tag color={status === 1 ? 'green' : 'red'}>{status === 1 ? '启用' : '禁用'}</Tag>;
  };

  const columns = [
    { title: '协议编号', dataIndex: 'agreementNo', key: 'agreementNo', width: 150 },
    { title: '协议名称', dataIndex: 'agreementName', key: 'agreementName', width: 180 },
    { title: '供应商', dataIndex: 'supplierName', key: 'supplierName', width: 120 },
    { title: '商品', dataIndex: 'productName', key: 'productName', width: 120 },
    { title: '商品编码', dataIndex: 'productCode', key: 'productCode', width: 100 },
    { title: '价格类型', dataIndex: 'priceType', key: 'priceType', width: 100, render: renderPriceType },
    { title: '标准价', dataIndex: 'standardPrice', key: 'standardPrice', width: 100, render: (v: number) => v ? `¥${v.toFixed(2)}` : '-' },
    { title: '有效期', dataIndex: 'startDate', key: 'dateRange', width: 200, render: (_: any, record: SupplierPriceAgreement) => `${record.startDate || '-'} ~ ${record.endDate || '-'}` },
    { title: '状态', dataIndex: 'status', key: 'status', width: 80, render: renderStatus },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_: any, record: SupplierPriceAgreement) => (
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

  return (
    <div>
      <h2 style={{ marginBottom: 16 }}>采购价格协议</h2>
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card><Statistic title="协议总数" value={data.length} /></Card>
        </Col>
        <Col span={6}>
          <Card><Statistic title="启用中" valueStyle={{ color: '#3f8600' }} value={data.filter(d => d.status === 1).length} /></Card>
        </Col>
        <Col span={6}>
          <Card><Statistic title="固定价" valueStyle={{ color: '#1890ff' }} value={data.filter(d => d.priceType === 1).length} /></Card>
        </Col>
        <Col span={6}>
          <Card><Statistic title="阶梯价" valueStyle={{ color: '#72246f' }} value={data.filter(d => d.priceType === 2).length} /></Card>
        </Col>
      </Row>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <Input.Search
          placeholder="搜索协议/供应商/商品"
          allowClear
          onSearch={handleSearch}
          style={{ width: 250 }}
          prefix={<SearchOutlined />}
        />
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>新建协议</Button>
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
        scroll={{ x: 1500 }}
      />

      <Modal
        title={editingRecord ? '编辑价格协议' : '新建价格协议'}
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={() => setModalVisible(false)}
        width={700}
      >
        <Form form={form} layout="vertical">
          <Space style={{ width: '100%' }} size="large">
            <Form.Item name="supplierId" label="供应商" rules={[{ required: true }]} style={{ flex: 1 }}>
              <Select placeholder="请选择供应商">
                {supplierList.map(s => (
                  <Select.Option key={s.id} value={s.id}>{s.name}</Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="productId" label="商品" rules={[{ required: true }]} style={{ flex: 1 }}>
              <Select placeholder="请选择商品">
                {productList.map(p => (
                  <Select.Option key={p.id} value={p.id}>{p.name} ({p.productCode})</Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Space>
          <Space style={{ width: '100%' }} size="large">
            <Form.Item name="agreementName" label="协议名称" rules={[{ required: true }]} style={{ flex: 1 }}>
              <Input placeholder="请输入协议名称" />
            </Form.Item>
            <Form.Item name="priceType" label="价格类型" initialValue={1} style={{ flex: 1 }}>
              <Select>
                <Select.Option value={1}>固定价</Select.Option>
                <Select.Option value={2}>阶梯价</Select.Option>
              </Select>
            </Form.Item>
          </Space>
          <Space style={{ width: '100%' }} size="large">
            <Form.Item name="standardPrice" label="标准采购价" rules={[{ required: true }]} style={{ flex: 1 }}>
              <InputNumber min={0} precision={2} style={{ width: '100%' }} placeholder="0.00" />
            </Form.Item>
            <Form.Item name="remark" label="备注" style={{ flex: 1 }}>
              <Input.TextArea rows={1} placeholder="备注" />
            </Form.Item>
          </Space>

          <div style={{ marginBottom: 16, fontWeight: 500, color: '#1890ff' }}>阶梯价格配置</div>
          <Space style={{ width: '100%' }} size="large">
            <Form.Item name="tier1Quantity" label="阶梯1数量" style={{ flex: 1 }}>
              <InputNumber min={0} style={{ width: '100%' }} placeholder="如: 100" />
            </Form.Item>
            <Form.Item name="tier1Price" label="阶梯1价格" style={{ flex: 1 }}>
              <InputNumber min={0} precision={2} style={{ width: '100%' }} placeholder="0.00" />
            </Form.Item>
          </Space>
          <Space style={{ width: '100%' }} size="large">
            <Form.Item name="tier2Quantity" label="阶梯2数量" style={{ flex: 1 }}>
              <InputNumber min={0} style={{ width: '100%' }} placeholder="如: 500" />
            </Form.Item>
            <Form.Item name="tier2Price" label="阶梯2价格" style={{ flex: 1 }}>
              <InputNumber min={0} precision={2} style={{ width: '100%' }} placeholder="0.00" />
            </Form.Item>
          </Space>
          <Space style={{ width: '100%' }} size="large">
            <Form.Item name="tier3Quantity" label="阶梯3数量" style={{ flex: 1 }}>
              <InputNumber min={0} style={{ width: '100%' }} placeholder="如: 1000" />
            </Form.Item>
            <Form.Item name="tier3Price" label="阶梯3价格" style={{ flex: 1 }}>
              <InputNumber min={0} precision={2} style={{ width: '100%' }} placeholder="0.00" />
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
          <Form.Item name="status" label="状态" initialValue={1}>
            <Select>
              <Select.Option value={1}>启用</Select.Option>
              <Select.Option value={0}>禁用</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default PurchasePriceStrategyPage;