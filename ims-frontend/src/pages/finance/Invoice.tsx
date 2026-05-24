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
  DatePicker,
  message,
  Tag,
  Card,
  Row,
  Col,
  Statistic,
} from 'antd';
import { PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { financeApi, customerApi, supplierApi } from '../../api';

interface Invoice {
  id?: number;
  invoiceNo: string;
  invoiceType: number;
  relatedType: number;
  customerId?: number;
  customerName?: string;
  supplierId?: number;
  supplierName?: string;
  orderId?: number;
  orderNo?: string;
  invoiceDate: string;
  amount: number;
  taxAmount?: number;
  status: number;
  remark?: string;
  createTime?: string;
}

const InvoicePage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Invoice[]>([]);
  const [pagination, setPagination] = useState({ current: 1, size: 10, total: 0 });
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<Invoice | null>(null);
  const [customerList, setCustomerList] = useState<{ id: number; name: string }[]>([]);
  const [supplierList, setSupplierList] = useState<{ id: number; name: string }[]>([]);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchCustomers();
    fetchSuppliers();
  }, []);

  useEffect(() => {
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

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await financeApi.get('/invoice/page', {
        params: { page: pagination.current, pageSize: pagination.size },
      });
      if (res.data.code === 200) {
        setData(res.data.data?.records || []);
        setPagination((prev) => ({ ...prev, total: res.data.data?.total || 0 }));
      }
    } catch (error) {
      message.error('获取发票列表失败');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingRecord(null);
    form.resetFields();
    form.setFieldsValue({ invoiceType: 1, relatedType: 1, status: 1 });
    setModalVisible(true);
  };

  const handleEdit = (record: Invoice) => {
    setEditingRecord(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      const res = await financeApi.delete(`/invoice/${id}`);
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
      const params = {
        ...values,
        invoiceDate: values.invoiceDate?.format('YYYY-MM-DD'),
        customerName: customerList.find(c => c.id === values.customerId)?.name || '',
        supplierName: supplierList.find(s => s.id === values.supplierId)?.name || '',
      };
      if (editingRecord?.id) {
        const res = await financeApi.put(`/invoice/${editingRecord.id}`, params);
        if (res.data.code === 200) {
          message.success('修改成功');
          setModalVisible(false);
          fetchData();
        } else {
          message.error(res.data.message || '修改失败');
        }
      } else {
        const res = await financeApi.post('/invoice', params);
        if (res.data.code === 200) {
          message.success('新增成功');
          setModalVisible(false);
          fetchData();
        } else {
          message.error(res.data.message || '新增失败');
        }
      }
    } catch (error) {
      console.error('Failed to save invoice:', error);
    }
  };

  const renderInvoiceType = (type: number) => {
    const map: Record<number, { text: string; color: string }> = {
      1: { text: '增值税专用发票', color: 'blue' },
      2: { text: '增值税普通发票', color: 'green' },
      3: { text: '电子发票', color: 'orange' },
    };
    const s = map[type] || { text: '未知', color: 'default' };
    return <Tag color={s.color}>{s.text}</Tag>;
  };

  const renderRelatedType = (type: number) => {
    const map: Record<number, string> = { 1: '销售发票', 2: '采购发票' };
    return map[type] || '-';
  };

  const renderStatus = (status: number) => {
    const map: Record<number, { text: string; color: string }> = {
      1: { text: '未认证', color: 'orange' },
      2: { text: '已认证', color: 'green' },
      3: { text: '已作废', color: 'red' },
    };
    const s = map[status] || { text: '未知', color: 'default' };
    return <Tag color={s.color}>{s.text}</Tag>;
  };

  const columns = [
    { title: '发票号码', dataIndex: 'invoiceNo', key: 'invoiceNo', width: 150 },
    { title: '发票类型', dataIndex: 'invoiceType', key: 'invoiceType', width: 130, render: renderInvoiceType },
    { title: '关联类型', dataIndex: 'relatedType', key: 'relatedType', width: 100, render: (v: number) => renderRelatedType(v) },
    { title: '客户/供应商', dataIndex: 'customerName', key: 'customerName', width: 120, render: (_: any, r: Invoice) => r.customerName || r.supplierName || '-' },
    { title: '关联单据', dataIndex: 'orderNo', key: 'orderNo', width: 130 },
    { title: '发票日期', dataIndex: 'invoiceDate', key: 'invoiceDate', width: 110 },
    { title: '发票金额', dataIndex: 'amount', key: 'amount', width: 110, render: (v: number) => `¥${v?.toFixed(2)}` },
    { title: '税额', dataIndex: 'taxAmount', key: 'taxAmount', width: 100, render: (v: number) => v ? `¥${v.toFixed(2)}` : '-' },
    { title: '状态', dataIndex: 'status', key: 'status', width: 90, render: renderStatus },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: (_: any, record: Invoice) => (
        <Space>
          <Button type="link" size="small" onClick={() => handleEdit(record)}>编辑</Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h2 style={{ marginBottom: 16 }}>发票管理</h2>
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card><Statistic title="发票总数" value={data.length} /></Card>
        </Col>
        <Col span={6}>
          <Card><Statistic title="销售发票" valueStyle={{ color: '#1890ff' }} value={data.filter(d => d.relatedType === 1).length} /></Card>
        </Col>
        <Col span={6}>
          <Card><Statistic title="采购发票" valueStyle={{ color: '#52c41a' }} value={data.filter(d => d.relatedType === 2).length} /></Card>
        </Col>
        <Col span={6}>
          <Card><Statistic title="已认证" valueStyle={{ color: '#52c41a' }} value={data.filter(d => d.status === 2).length} /></Card>
        </Col>
      </Row>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'flex-end' }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>新增发票</Button>
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

      <Modal
        title={editingRecord ? '编辑发票' : '新增发票'}
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={() => setModalVisible(false)}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Space style={{ width: '100%' }} size="large">
            <Form.Item name="invoiceNo" label="发票号码" rules={[{ required: true }]} style={{ flex: 1 }}>
              <Input placeholder="请输入发票号码" />
            </Form.Item>
            <Form.Item name="invoiceType" label="发票类型" style={{ flex: 1 }}>
              <Select>
                <Select.Option value={1}>增值税专用发票</Select.Option>
                <Select.Option value={2}>增值税普通发票</Select.Option>
                <Select.Option value={3}>电子发票</Select.Option>
              </Select>
            </Form.Item>
          </Space>
          <Space style={{ width: '100%' }} size="large">
            <Form.Item name="relatedType" label="关联类型" style={{ flex: 1 }}>
              <Select onChange={() => { form.setFieldValue('customerId', undefined); form.setFieldValue('supplierId', undefined); }}>
                <Select.Option value={1}>销售发票</Select.Option>
                <Select.Option value={2}>采购发票</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item noStyle shouldUpdate={(prev, curr) => prev.relatedType !== curr.relatedType}>
              {({ getFieldValue }) => (
                getFieldValue('relatedType') === 1 ? (
                  <Form.Item name="customerId" label="客户" style={{ flex: 1 }}>
                    <Select placeholder="选择客户" allowClear>
                      {customerList.map(c => (
                        <Select.Option key={c.id} value={c.id}>{c.name}</Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                ) : (
                  <Form.Item name="supplierId" label="供应商" style={{ flex: 1 }}>
                    <Select placeholder="选择供应商" allowClear>
                      {supplierList.map(s => (
                        <Select.Option key={s.id} value={s.id}>{s.name}</Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                )
              )}
            </Form.Item>
          </Space>
          <Space style={{ width: '100%' }} size="large">
            <Form.Item name="invoiceDate" label="发票日期" style={{ flex: 1 }}>
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name="amount" label="发票金额" rules={[{ required: true }]} style={{ flex: 1 }}>
              <InputNumber min={0} precision={2} style={{ width: '100%' }} placeholder="0.00" />
            </Form.Item>
          </Space>
          <Space style={{ width: '100%' }} size="large">
            <Form.Item name="taxAmount" label="税额" style={{ flex: 1 }}>
              <InputNumber min={0} precision={2} style={{ width: '100%' }} placeholder="0.00" />
            </Form.Item>
            <Form.Item name="status" label="状态" initialValue={1} style={{ flex: 1 }}>
              <Select>
                <Select.Option value={1}>未认证</Select.Option>
                <Select.Option value={2}>已认证</Select.Option>
                <Select.Option value={3}>已作废</Select.Option>
              </Select>
            </Form.Item>
          </Space>
          <Form.Item name="remark" label="备注">
            <Input.TextArea rows={2} placeholder="备注" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default InvoicePage;