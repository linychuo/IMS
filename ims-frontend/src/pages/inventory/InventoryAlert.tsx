import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Input,
  Space,
  Modal,
  Form,
  Select,
  InputNumber,
  message,
  Tag,
  Card,
  Row,
  Col,
  Statistic,
  Tabs,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  SearchOutlined,
  AlertOutlined,
  ClockCircleOutlined,
  DisconnectOutlined,
} from '@ant-design/icons';
import { productApi, warehouseApi, inventoryApi } from '../../api';
import { useAuthStore } from '../../stores/authStore';

interface Product {
  id: number;
  productCode: string;
  productName: string;
  lowStockWarning: number;
  highStockWarning: number;
  unit?: string;
  categoryName?: string;
}

interface Warehouse {
  id: number;
  name: string;
}

interface ExpiringProduct {
  productId: number;
  productName: string;
  productCode: string;
  warehouseName: string;
  batchNo: string;
  quantity: number;
  expiryDate: string;
  daysUntilExpiry: number;
}

interface IdleStock {
  productId: number;
  productName: string;
  productCode: string;
  warehouseId: number;
  warehouseName: string;
  quantity: number;
  lastOutDate: string;
  idleDays: number;
}

interface AlertConfig {
  minStock: number;
  maxStock: number;
  alertDays: number;
}

const InventoryAlertPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [expiringLoading, setExpiringLoading] = useState(false);
  const [data, setData] = useState<Product[]>([]);
  const [expiringData, setExpiringData] = useState<ExpiringProduct[]>([]);
  const [pagination, setPagination] = useState({ current: 1, size: 10, total: 0 });
  const [keyword, setKeyword] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<Product | null>(null);
  const [form] = Form.useForm();
  const [warehouseList, setWarehouseList] = useState<Warehouse[]>([]);
  const [activeTab, setActiveTab] = useState<'stock' | 'expiring' | 'idle'>('stock');
  const [expiryDays, setExpiryDays] = useState<number>(30);
  const [selectedWarehouseId, setSelectedWarehouseId] = useState<number | null>(null);
  const [idleData, setIdleData] = useState<IdleStock[]>([]);
  const [idleLoading, setIdleLoading] = useState(false);
  const [idleDays, setIdleDays] = useState<number>(90);

  useEffect(() => {
    fetchWarehouseList();
  }, []);

  useEffect(() => {
    if (activeTab === 'stock') {
      fetchData();
    } else if (activeTab === 'expiring') {
      fetchExpiringProducts();
    } else {
      fetchIdleStock();
    }
  }, [pagination.current, pagination.size, keyword, activeTab, expiryDays, selectedWarehouseId, idleDays]);

  const fetchExpiringProducts = async () => {
    setExpiringLoading(true);
    try {
      const params: Record<string, any> = { days: expiryDays };
      if (selectedWarehouseId) {
        params.warehouseId = selectedWarehouseId;
      }
      const res = await inventoryApi.get('/inventory/expiring', { params });
      if (res.data?.code === 200) {
        setExpiringData(res.data.data || []);
      } else {
        setExpiringData(res.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch expiring products:', error);
    } finally {
      setExpiringLoading(false);
    }
  };

  const fetchWarehouseList = async () => {
    try {
      const res = await warehouseApi.get('/warehouse/list');
      if (res.data.code === 200) {
        setWarehouseList(res.data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch warehouses:', error);
    }
  };

  const fetchIdleStock = async () => {
    setIdleLoading(true);
    try {
      const params: Record<string, any> = { days: idleDays };
      if (selectedWarehouseId) {
        params.warehouseId = selectedWarehouseId;
      }
      const res = await inventoryApi.get('/inventory/idle', { params });
      if (res.data?.code === 200) {
        setIdleData(res.data.data || []);
      } else {
        setIdleData(res.data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch idle stock:', error);
    } finally {
      setIdleLoading(false);
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
      const res = await productApi.get('/product/list', { params });
      if (res.data.code === 200) {
        setData(res.data.data || []);
        setPagination((prev) => ({ ...prev, total: res.data.data?.length || 0 }));
      }
    } catch (error) {
      message.error('获取商品列表失败');
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
    setModalVisible(true);
  };

  const handleEdit = (record: Product) => {
    setEditingRecord(record);
    form.setFieldsValue({
      productCode: record.productCode,
      productName: record.productName,
      lowStockWarning: record.lowStockWarning || 10,
      highStockWarning: record.highStockWarning || 1000,
    });
    setModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    // 本地删除，实际应该调用更新接口
    message.success('重置成功');
    fetchData();
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      // 调用后端更新商品预警配置
      if (editingRecord) {
        await productApi.put('/product', {
          id: editingRecord.id,
          lowStockWarning: values.lowStockWarning,
          highStockWarning: values.highStockWarning,
        });
        message.success('修改成功');
      }
      setModalVisible(false);
      fetchData();
    } catch (error) {
      console.error('Failed to save:', error);
      message.error('操作失败');
    }
  };

  const columns = [
    { title: '商品编码', dataIndex: 'productCode', key: 'productCode', width: 120 },
    { title: '商品名称', dataIndex: 'productName', key: 'productName', width: 180 },
    { title: '分类', dataIndex: 'categoryName', key: 'categoryName', width: 100 },
    { title: '单位', dataIndex: 'unit', key: 'unit', width: 80 },
    { title: '最低库存预警', dataIndex: 'lowStockWarning', key: 'lowStockWarning', width: 120, render: (v: number) => v ? <Tag color="orange">{v}</Tag> : '-' },
    { title: '最高库存预警', dataIndex: 'highStockWarning', key: 'highStockWarning', width: 120, render: (v: number) => v ? <Tag color="blue">{v}</Tag> : '-' },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_: any, record: Product) => (
        <Space>
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)}>配置</Button>
        </Space>
      ),
    },
  ];

  const expiringColumns = [
    { title: '商品编码', dataIndex: 'productCode', key: 'productCode', width: 120 },
    { title: '商品名称', dataIndex: 'productName', key: 'productName', width: 180 },
    { title: '仓库', dataIndex: 'warehouseName', key: 'warehouseName', width: 100 },
    { title: '批次', dataIndex: 'batchNo', key: 'batchNo', width: 100 },
    { title: '数量', dataIndex: 'quantity', key: 'quantity', width: 80 },
    { title: '有效期至', dataIndex: 'expiryDate', key: 'expiryDate', width: 120 },
    {
      title: '剩余天数',
      key: 'daysUntilExpiry',
      width: 100,
      render: (_: any, record: ExpiringProduct) => {
        if (record.daysUntilExpiry <= 0) return <Tag color="red">已过期</Tag>;
        if (record.daysUntilExpiry <= 7) return <Tag color="red">{record.daysUntilExpiry}天</Tag>;
        if (record.daysUntilExpiry <= 15) return <Tag color="orange">{record.daysUntilExpiry}天</Tag>;
        return <Tag color="green">{record.daysUntilExpiry}天</Tag>;
      },
    },
  ];

  return (
    <div>
      <h2 style={{ marginBottom: 16 }}>库存预警配置</h2>
      <Tabs
        activeKey={activeTab}
        onChange={(key) => { setActiveTab(key as any); setPagination(prev => ({ ...prev, current: 1 })); }}
        items={[
          {
            key: 'stock',
            label: <span><AlertOutlined /> 库存预警</span>,
            children: (<>
              <Row gutter={16} style={{ marginBottom: 16 }}>
                <Col span={6}>
                  <Card><Statistic title="商品总数" value={data.length} prefix={<AlertOutlined />} /></Card>
                </Col>
                <Col span={6}>
                  <Card><Statistic title="已配置预警" value={data.filter(d => d.lowStockWarning > 0 || d.highStockWarning > 0).length} valueStyle={{ color: '#1890ff' }} /></Card>
                </Col>
                <Col span={6}>
                  <Card><Statistic title="未配置预警" value={data.filter(d => !d.lowStockWarning && !d.highStockWarning).length} valueStyle={{ color: '#fa8c16' }} /></Card>
                </Col>
              </Row>
              <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
                <Input.Search
                  placeholder="搜索商品名称/编码"
                  allowClear
                  onSearch={handleSearch}
                  style={{ width: 250 }}
                  prefix={<SearchOutlined />}
                />
                <Button type="primary" onClick={handleAdd}>批量配置</Button>
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
                scroll={{ x: 900 }}
              />
            </>),
          },
          {
            key: 'expiring',
            label: <span><ClockCircleOutlined /> 临期预警</span>,
            children: (<>
              <Row gutter={16} style={{ marginBottom: 16 }}>
                <Col span={6}>
                  <Card><Statistic title="临期商品" value={expiringData.length} prefix={<ClockCircleOutlined />} valueStyle={{ color: expiringData.length > 0 ? '#cf1322' : '#3f8600' }} /></Card>
                </Col>
                <Col span={6}>
                  <Card><Statistic title="预警天数" value={expiryDays} suffix="天" /></Card>
                </Col>
              </Row>
              <div style={{ marginBottom: 16, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <InputNumber min={1} max={365} value={expiryDays} onChange={(v) => setExpiryDays(v || 30)} addonBefore="预警天数" style={{ width: 150 }} />
                <Select allowClear placeholder="选择仓库" style={{ width: 150 }} onChange={(v) => setSelectedWarehouseId(v)}>
                  {warehouseList.map(w => <Select.Option key={w.id} value={w.id}>{w.name}</Select.Option>)}
                </Select>
                <Button type="primary" onClick={fetchExpiringProducts}>刷新</Button>
              </div>
              <Table
                columns={expiringColumns}
                dataSource={expiringData}
                rowKey="productId"
                loading={expiringLoading}
                pagination={{ pageSize: 10, showSizeChanger: true, showTotal: (total) => `共 ${total} 条` }}
                scroll={{ x: 900 }}
              />
            </>),
          },
          {
            key: 'idle',
            label: <span><DisconnectOutlined /> 呆滞库存</span>,
            children: (<>
              <Row gutter={16} style={{ marginBottom: 16 }}>
                <Col span={6}>
                  <Card><Statistic title="呆滞商品" value={idleData.length} prefix={<DisconnectOutlined />} valueStyle={{ color: idleData.length > 0 ? '#cf1322' : '#3f8600' }} /></Card>
                </Col>
                <Col span={6}>
                  <Card><Statistic title="呆滞天数" value={idleDays} suffix="天" /></Card>
                </Col>
              </Row>
              <div style={{ marginBottom: 16, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <InputNumber min={1} max={365} value={idleDays} onChange={(v) => setIdleDays(v || 90)} addonBefore="呆滞天数" style={{ width: 150 }} />
                <Select allowClear placeholder="选择仓库" style={{ width: 150 }} onChange={(v) => setSelectedWarehouseId(v)}>
                  {warehouseList.map(w => <Select.Option key={w.id} value={w.id}>{w.name}</Select.Option>)}
                </Select>
                <Button type="primary" onClick={fetchIdleStock}>刷新</Button>
              </div>
              <Table
                dataSource={idleData}
                rowKey="productId"
                loading={idleLoading}
                pagination={{ pageSize: 10, showSizeChanger: true, showTotal: (total) => `共 ${total} 条` }}
                scroll={{ x: 900 }}
                columns={[
                  { title: '商品编码', dataIndex: 'productCode', key: 'productCode', width: 120 },
                  { title: '商品名称', dataIndex: 'productName', key: 'productName', width: 180 },
                  { title: '仓库', dataIndex: 'warehouseName', key: 'warehouseName', width: 100 },
                  { title: '数量', dataIndex: 'quantity', key: 'quantity', width: 80 },
                  {
                    title: '最后出库',
                    dataIndex: 'lastOutDate',
                    key: 'lastOutDate',
                    width: 120,
                    render: (v: string) => v || '-',
                  },
                  {
                    title: '呆滞天数',
                    key: 'idleDays',
                    width: 100,
                    render: (_: any, record: IdleStock) => {
                      if (record.idleDays >= 90) return <Tag color="red">{record.idleDays}天</Tag>;
                      if (record.idleDays >= 60) return <Tag color="orange">{record.idleDays}天</Tag>;
                      if (record.idleDays >= 30) return <Tag color="yellow">{record.idleDays}天</Tag>;
                      return <Tag color="green">{record.idleDays}天</Tag>;
                    },
                  },
                ]}
              />
            </>),
          },
        ]}
      />

      <Modal
        title={editingRecord ? '编辑预警配置' : '批量配置预警'}
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={() => setModalVisible(false)}
        width={500}
      >
        <Form form={form} layout="vertical">
          {editingRecord && (
            <Space style={{ width: '100%' }} size="large">
              <Form.Item label="商品编码" style={{ flex: 1 }}>
                <Input value={editingRecord.productCode} disabled />
              </Form.Item>
              <Form.Item label="商品名称" style={{ flex: 1 }}>
                <Input value={editingRecord.productName} disabled />
              </Form.Item>
            </Space>
          )}
          {!editingRecord && (
            <Form.Item name="productIds" label="选择商品" rules={[{ required: true, message: '请选择商品' }]}>
              <Select mode="multiple" placeholder="选择商品" style={{ width: '100%' }}>
                {data.map(p => (
                  <Select.Option key={p.id} value={p.id}>{p.productName} ({p.productCode})</Select.Option>
                ))}
              </Select>
            </Form.Item>
          )}
          <Space style={{ width: '100%' }} size="large">
            <Form.Item
              name="lowStockWarning"
              label="最低库存预警"
              rules={[{ required: true, message: '请输入最低库存预警值' }]}
              style={{ flex: 1 }}
              extra="当库存低于此值时提醒"
            >
              <InputNumber min={0} style={{ width: '100%' }} placeholder="如: 10" />
            </Form.Item>
            <Form.Item
              name="highStockWarning"
              label="最高库存预警"
              style={{ flex: 1 }}
              extra="当库存高于此值时提醒"
            >
              <InputNumber min={0} style={{ width: '100%' }} placeholder="如: 1000" />
            </Form.Item>
          </Space>
        </Form>
      </Modal>
    </div>
  );
};

export default InventoryAlertPage;