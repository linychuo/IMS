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
import { procurementApi, supplierApi, warehouseApi, productApi } from '../../api';

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

interface Product {
  id: string;
  name: string;
  spec?: string;
  unit?: string;
  price?: number;
}

const PurchaseInPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<PurchaseIn[]>([]);
  const [pagination, setPagination] = useState({ current: 1, size: 10, total: 0 });
  const [keyword, setKeyword] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<PurchaseIn | null>(null);
  const [supplierList, setSupplierList] = useState<{ id: string; name: string }[]>([]);
  const [warehouseList, setWarehouseList] = useState<{ id: string; name: string }[]>([]);
  const [productList, setProductList] = useState<Product[]>([]);
  const [form] = Form.useForm();
  const [inDetails, setInDetails] = useState<PurchaseInDetail[]>([]);

  useEffect(() => {
    fetchSuppliers();
    fetchWarehouses();
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
      const res = await procurementApi.get('/purchase-in/list', { params });
      setData(res.data.data || []);
      setPagination((prev) => ({ ...prev, total: res.data.data?.length || 0 }));
    } catch (error) {
      console.error('Failed to fetch ins:', error);
      message.error('获取采购入库失败');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setKeyword(value);
    setPagination((prev) => ({ ...prev, current: 1 }));
  };

  const handleView = async (record: PurchaseIn) => {
    try {
      const res = await procurementApi.get(`/purchase-in/${record.id}`);
      if (res.data) {
        setEditingRecord(res.data);
        setViewModalVisible(true);
      }
    } catch (error) {
      message.error('获取入库单详情失败');
    }
  };

  const handleEdit = async (record: PurchaseIn) => {
    try {
      const res = await procurementApi.get(`/purchase-in/${record.id}`);
      if (res.data) {
        setEditingRecord(res.data);
        setInDetails(res.data.details || []);
        form.setFieldsValue({
          supplierId: res.data.supplierId,
          warehouseId: res.data.warehouseId,
          inDate: res.data.inDate,
          remark: res.data.remark,
        });
        setModalVisible(true);
      }
    } catch (error) {
      message.error('获取入库单详情失败');
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await procurementApi.post(`/purchase-in/${id}/approve`);
      message.success('审核成功');
      fetchData();
    } catch (error) {
      message.error('审核失败');
    }
  };

  const handleComplete = async (id: string) => {
    try {
      await procurementApi.post(`/purchase-in/${id}/complete`);
      message.success('完成入库成功');
      fetchData();
    } catch (error) {
      message.error('操作失败');
    }
  };

  const handleCancel = async (id: string) => {
    try {
      await procurementApi.post(`/purchase-in/${id}/cancel`, null, { params: { reason: '用户取消' } });
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
    setInDetails([]);
    setModalVisible(true);
  };

  const handleAddDetail = () => {
    setInDetails([...inDetails, { productId: '', productName: '', spec: '', unit: '', quantity: 1, price: 0, amount: 0 }]);
  };

  const handleRemoveDetail = (index: number) => {
    const newDetails = [...inDetails];
    newDetails.splice(index, 1);
    setInDetails(newDetails);
  };

  const handleDetailChange = (index: number, field: string, value: any) => {
    const newDetails = [...inDetails];
    newDetails[index] = { ...newDetails[index], [field]: value };
    if (field === 'quantity' || field === 'price') {
      newDetails[index].amount = (newDetails[index].quantity || 0) * (newDetails[index].price || 0);
    }
    setInDetails(newDetails);
  };

  const handleProductSelect = (index: number, productId: string) => {
    const product = productList.find(p => p.id === productId);
    if (product) {
      const newDetails = [...inDetails];
      newDetails[index] = {
        ...newDetails[index],
        productId,
        productName: product.name,
        spec: product.spec || '',
        unit: product.unit || '',
        price: product.price || 0,
        amount: (newDetails[index].quantity || 0) * (product.price || 0),
      };
      setInDetails(newDetails);
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      const inData = {
        supplierId: values.supplierId,
        supplierName: supplierList.find(s => s.id === values.supplierId)?.name || '',
        warehouseId: values.warehouseId,
        warehouseName: warehouseList.find(w => w.id === values.warehouseId)?.name || '',
        inDate: values.inDate?.format('YYYY-MM-DD'),
        remark: values.remark || '',
      };
      const res = editingRecord
        ? await procurementApi.put(`/purchase-in/${editingRecord.id}`, { ...inData, id: editingRecord.id })
        : await procurementApi.post('/purchase-in', inData);
      if (res.status === 200 || res.data.code === 200) {
        message.success(editingRecord ? '修改成功' : '创建成功');
        setModalVisible(false);
        fetchData();
      } else {
        message.error(res.data?.message || '操作失败');
      }
    } catch (error) {
      console.error('Failed to save:', error);
      message.error('操作失败');
    }
  };

  const renderStatus = (status: number) => {
    const map: Record<number, { text: string; color: string }> = {
      0: { text: '待入库', color: 'orange' },
      1: { text: '部分入库', color: 'cyan' },
      2: { text: '已完成', color: 'green' },
      9: { text: '已取消', color: 'red' },
    };
    const s = map[status] || { text: '未知', color: 'default' };
    return <Tag color={s.color}>{s.text}</Tag>;
  };

  const columns = [
    { title: '入库单号', dataIndex: 'inNo', key: 'inNo', width: 150 },
    { title: '关联订单', dataIndex: 'orderNo', key: 'orderNo', width: 150 },
    { title: '供应商', dataIndex: 'supplierName', key: 'supplierName', width: 150 },
    { title: '入库日期', dataIndex: 'inDate', key: 'inDate', width: 120 },
    { title: '仓库', dataIndex: 'warehouseName', key: 'warehouseName', width: 120 },
    { title: '入库金额', dataIndex: 'totalAmount', key: 'totalAmount', width: 120, render: (v: number) => `¥${v?.toFixed(2) || '0.00'}` },
    { title: '状态', dataIndex: 'status', key: 'status', width: 100, render: renderStatus },
    {
      title: '操作',
      key: 'action',
      width: 280,
      render: (_: any, record: PurchaseIn) => (
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
          {record.status === 1 && (
            <Button type="link" size="small" icon={<CheckCircleOutlined />} onClick={() => handleComplete(record.id)}>完成</Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h2 style={{ marginBottom: 16 }}>采购入库</h2>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <Input.Search
          placeholder="搜索入库单"
          allowClear
          onSearch={handleSearch}
          style={{ width: 200 }}
          prefix={<SearchOutlined />}
        />
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          新建入库
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
        title={editingRecord ? '编辑入库单' : '新建入库单'}
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={() => setModalVisible(false)}
        width={800}
        okText="确定"
        cancelText="取消"
      >
        <Form form={form} layout="vertical">
          <Space style={{ width: '100%' }} size="large">
            <Form.Item name="supplierId" label="供应商" rules={[{ required: true, message: '请选择供应商' }]} style={{ flex: 1 }}>
              <Select placeholder="请选择供应商">
                {supplierList.map(s => (
                  <Select.Option key={s.id} value={s.id}>{s.name}</Select.Option>
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
            <Form.Item name="inDate" label="入库日期" rules={[{ required: true, message: '请选择入库日期' }]} style={{ flex: 1 }}>
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name="remark" label="备注" style={{ flex: 1 }}>
              <Input.TextArea rows={2} placeholder="请输入备注" />
            </Form.Item>
          </Space>
        </Form>

        <Divider>入库明细</Divider>
        <Button type="dashed" onClick={handleAddDetail} style={{ marginBottom: 16 }}>
          添加商品
        </Button>
        {inDetails.map((detail, index) => (
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
        title="入库单详情"
        open={viewModalVisible}
        onCancel={() => setViewModalVisible(false)}
        footer={[<Button key="close" onClick={() => setViewModalVisible(false)}>关闭</Button>]}
        width={700}
      >
        <Descriptions column={2} size="small">
          <Descriptions.Item label="入库单号">{editingRecord?.inNo}</Descriptions.Item>
          <Descriptions.Item label="关联订单">{editingRecord?.orderNo}</Descriptions.Item>
          <Descriptions.Item label="供应商">{editingRecord?.supplierName}</Descriptions.Item>
          <Descriptions.Item label="入库日期">{editingRecord?.inDate}</Descriptions.Item>
          <Descriptions.Item label="仓库">{editingRecord?.warehouseName}</Descriptions.Item>
          <Descriptions.Item label="入库金额">¥{editingRecord?.totalAmount?.toFixed(2)}</Descriptions.Item>
          <Descriptions.Item label="状态">{renderStatus(editingRecord?.status || 0)}</Descriptions.Item>
        </Descriptions>
        {editingRecord?.details && editingRecord.details.length > 0 && (
          <>
            <Divider>入库明细</Divider>
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

export default PurchaseInPage;