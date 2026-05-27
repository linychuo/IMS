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
  Tabs,
  Card,
  Row,
  Col,
  Statistic,
  Descriptions,
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, EyeOutlined, HistoryOutlined } from '@ant-design/icons';
import { supplierApi, purchaseApi } from '../../api';

interface Supplier {
  id?: string;
  code: string;
  name: string;
  contact?: string;
  phone?: string;
  address?: string;
  email?: string;
  status: number;
  remark?: string;
  payableAmount?: number;
  paidAmount?: number;
}

interface PurchaseOrder {
  id: string;
  orderNo: string;
  orderDate: string;
  totalAmount: number;
  netAmount: number;
  status: number;
}

const SupplierPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Supplier[]>([]);
  const [pagination, setPagination] = useState({ current: 1, size: 10, total: 0 });
  const [keyword, setKeyword] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<Supplier | null>(null);
  const [form] = Form.useForm();
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [viewSupplier, setViewSupplier] = useState<Supplier | null>(null);
  const [purchaseHistoryLoading, setPurchaseHistoryLoading] = useState(false);
  const [purchaseHistory, setPurchaseHistory] = useState<PurchaseOrder[]>([]);
  const [purchaseTotal, setPurchaseTotal] = useState({ orderCount: 0, totalAmount: 0 });

  useEffect(() => {
    fetchData();
  }, [pagination.current, pagination.size, keyword]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const params: Record<string, any> = {};
      if (keyword) {
        params.keyword = keyword;
      }
      const res = await supplierApi.get('/supplier/list', { params });
      if (res.data.code === 200) {
        setData(res.data.data || []);
        setPagination((prev) => ({ ...prev, total: res.data.data?.length || 0 }));
      }
    } catch (error) {
      console.error('Failed to fetch suppliers:', error);
      message.error('获取供应商列表失败');
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

  const handleEdit = (record: Supplier) => {
    setEditingRecord(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleView = async (record: Supplier) => {
    setViewSupplier(record);
    setDetailModalVisible(true);
    fetchPurchaseHistory(record.id!);
  };

  const fetchPurchaseHistory = async (supplierId: string) => {
    setPurchaseHistoryLoading(true);
    try {
      const res = await purchaseApi.get('/order/page', {
        params: { current: 1, size: 100, supplierId },
      });
      if (res.data?.code === 200) {
        const records = res.data.data?.records || [];
        setPurchaseHistory(records);
        const totalAmount = records.reduce((sum: number, item: PurchaseOrder) => sum + (item.netAmount || 0), 0);
        setPurchaseTotal({ orderCount: records.length, totalAmount });
      } else {
        setPurchaseHistory(res.data?.data?.records || []);
      }
    } catch (error) {
      console.error('Failed to fetch purchase history:', error);
    } finally {
      setPurchaseHistoryLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await supplierApi.delete(`/supplier/${id}`);
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

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingRecord?.id) {
        const res = await supplierApi.put(`/supplier/${editingRecord.id}`, values);
        if (res.data.code === 200) {
          message.success('修改成功');
          setModalVisible(false);
          fetchData();
        } else {
          message.error(res.data.message || '修改失败');
        }
      } else {
        const res = await supplierApi.post('/supplier', values);
        if (res.data.code === 200) {
          message.success('新增成功');
          setModalVisible(false);
          fetchData();
        } else {
          message.error(res.data.message || '新增失败');
        }
      }
    } catch (error) {
      console.error('Failed to save supplier:', error);
    }
  };

  const columns = [
    { title: '供应商编码', dataIndex: 'code', key: 'code', width: 120 },
    { title: '供应商名称', dataIndex: 'name', key: 'name', width: 180 },
    { title: '联系人', dataIndex: 'contact', key: 'contact', width: 100 },
    { title: '联系电话', dataIndex: 'phone', key: 'phone', width: 130 },
    { title: '地址', dataIndex: 'address', key: 'address', ellipsis: true },
    { title: '状态', dataIndex: 'status', key: 'status', width: 80, render: (status: number) => <Tag color={status === 1 ? 'green' : 'red'}>{status === 1 ? '启用' : '禁用'}</Tag> },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_: any, record: Supplier) => (
        <Space>
          <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => handleView(record)}>详情</Button>
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)}>编辑</Button>
          <Popconfirm title="确定删除？" onConfirm={() => handleDelete(record.id!)}>
            <Button type="link" size="small" danger icon={<DeleteOutlined />}>删除</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h2 style={{ marginBottom: 16 }}>供应商管理</h2>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <Input.Search
          placeholder="搜索供应商"
          allowClear
          onSearch={handleSearch}
          style={{ width: 200 }}
          prefix={<SearchOutlined />}
        />
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>新增供应商</Button>
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
        scroll={{ x: 1000 }}
      />

      <Modal
        title={editingRecord ? '编辑供应商' : '新增供应商'}
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={() => setModalVisible(false)}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Space style={{ width: '100%' }} size="large">
            <Form.Item name="code" label="供应商编码" rules={[{ required: true, message: '请输入供应商编码' }]} style={{ flex: 1 }}>
              <Input placeholder="请输入供应商编码" disabled={!!editingRecord} />
            </Form.Item>
            <Form.Item name="name" label="供应商名称" rules={[{ required: true, message: '请输入供应商名称' }]} style={{ flex: 1 }}>
              <Input placeholder="请输入供应商名称" />
            </Form.Item>
          </Space>
          <Space style={{ width: '100%' }} size="large">
            <Form.Item name="contact" label="联系人" style={{ flex: 1 }}>
              <Input placeholder="请输入联系人" />
            </Form.Item>
            <Form.Item name="phone" label="联系电话" style={{ flex: 1 }}>
              <Input placeholder="请输入联系电话" />
            </Form.Item>
          </Space>
          <Form.Item name="address" label="地址">
            <Input placeholder="请输入地址" />
          </Form.Item>
          <Form.Item name="status" label="状态" initialValue={1}>
            <Select>
              <Select.Option value={1}>启用</Select.Option>
              <Select.Option value={0}>禁用</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="remark" label="备注">
            <Input.TextArea rows={2} placeholder="请输入备注" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 供应商详情弹窗 */}
      <Modal
        title={`供应商详情 - ${viewSupplier?.name || ''}`}
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={[<Button key="close" onClick={() => setDetailModalVisible(false)}>关闭</Button>]}
        width={800}
      >
        <Tabs
          items={[
            {
              key: 'info',
              label: '基本信息',
              children: (
                <Descriptions column={2} size="small">
                  <Descriptions.Item label="供应商编码">{viewSupplier?.code}</Descriptions.Item>
                  <Descriptions.Item label="供应商名称">{viewSupplier?.name}</Descriptions.Item>
                  <Descriptions.Item label="联系人">{viewSupplier?.contact || '-'}</Descriptions.Item>
                  <Descriptions.Item label="联系电话">{viewSupplier?.phone || '-'}</Descriptions.Item>
                  <Descriptions.Item label="地址" span={2}>{viewSupplier?.address || '-'}</Descriptions.Item>
                  <Descriptions.Item label="应付总额">
                    <Tag color="orange">¥{viewSupplier?.payableAmount?.toFixed(2) || '0.00'}</Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="已付总额">
                    <Tag color="green">¥{viewSupplier?.paidAmount?.toFixed(2) || '0.00'}</Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="状态">
                    <Tag color={viewSupplier?.status === 1 ? 'green' : 'red'}>
                      {viewSupplier?.status === 1 ? '启用' : '禁用'}
                    </Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="备注" span={2}>{viewSupplier?.remark || '-'}</Descriptions.Item>
                </Descriptions>
              ),
            },
            {
              key: 'purchase',
              label: <span><HistoryOutlined /> 采购历史</span>,
              children: (
                <>
                  <Row gutter={16} style={{ marginBottom: 16 }}>
                    <Col span={8}>
                      <Card size="small">
                        <Statistic title="采购订单数" value={purchaseTotal.orderCount} prefix={<HistoryOutlined />} />
                      </Card>
                    </Col>
                    <Col span={8}>
                      <Card size="small">
                        <Statistic title="采购总额" value={purchaseTotal.totalAmount} precision={2} prefix="¥" />
                      </Card>
                    </Col>
                    <Col span={8}>
                      <Card size="small">
                        <Statistic
                          title="付款率"
                          value={purchaseTotal.totalAmount > 0
                            ? ((viewSupplier?.paidAmount || 0) / purchaseTotal.totalAmount * 100).toFixed(1)
                            : '0.0'}
                          suffix="%"
                          valueStyle={{ color: ((viewSupplier?.paidAmount || 0) / purchaseTotal.totalAmount) > 0.5 ? '#52c41a' : '#fa8c16' }}
                        />
                      </Card>
                    </Col>
                  </Row>
                  <Table
                    dataSource={purchaseHistory}
                    rowKey="id"
                    loading={purchaseHistoryLoading}
                    pagination={{ pageSize: 5 }}
                    size="small"
                    scroll={{ x: 700 }}
                    columns={[
                      { title: '订单号', dataIndex: 'orderNo', key: 'orderNo', width: 150 },
                      { title: '订单日期', dataIndex: 'orderDate', key: 'orderDate', width: 120 },
                      { title: '订单金额', dataIndex: 'totalAmount', key: 'totalAmount', width: 100, render: (v: number) => `¥${v?.toFixed(2)}` },
                      { title: '实际金额', dataIndex: 'netAmount', key: 'netAmount', width: 100, render: (v: number) => `¥${v?.toFixed(2)}` },
                      {
                        title: '状态',
                        dataIndex: 'status',
                        key: 'status',
                        width: 80,
                        render: (s: number) => {
                          const map: Record<number, { text: string; color: string }> = {
                            0: { text: '新建', color: 'default' },
                            1: { text: '待审核', color: 'orange' },
                            2: { text: '已审核', color: 'blue' },
                            5: { text: '已完成', color: 'green' },
                            9: { text: '已取消', color: 'red' },
                          };
                          const st = map[s] || { text: '未知', color: 'default' };
                          return <Tag color={st.color}>{st.text}</Tag>;
                        },
                      },
                    ]}
                  />
                </>
              ),
            },
          ]}
        />
      </Modal>
    </div>
  );
};

export default SupplierPage;