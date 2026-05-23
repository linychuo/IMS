import React, { useState, useEffect } from 'react';
import { Table, Tag, message, Button, Input, Space, Modal, Form, DatePicker, Select, InputNumber } from 'antd';
import { PlusOutlined, SearchOutlined, EditOutlined } from '@ant-design/icons';
import { financeApi, supplierApi } from '../../api';

interface Payable {
  id: number;
  supplierId: number;
  supplierName: string;
  orderId?: number;
  orderNo?: string;
  amount: number;
  paidAmount?: number;
  balance: number;
  status: number;
  dueDate?: string;
  remark?: string;
}

const PayablePage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Payable[]>([]);
  const [pagination, setPagination] = useState({ current: 1, size: 10, total: 0 });
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<Payable | null>(null);
  const [supplierList, setSupplierList] = useState<{ id: string; name: string }[]>([]);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchSuppliers();
  }, []);

  useEffect(() => {
    fetchData();
  }, [pagination.current, pagination.size]);

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
      const res = await financeApi.get('/finance/payable/page', {
        params: { page: pagination.current, pageSize: pagination.size },
      });
      if (res.data.code === 200) {
        setData(res.data.data?.records || []);
        setPagination((prev) => ({ ...prev, total: res.data.data?.total || 0 }));
      }
    } catch (error) {
      console.error('Failed to fetch payables:', error);
      message.error('获取应付账款失败');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingRecord(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record: Payable) => {
    setEditingRecord(record);
    form.setFieldsValue({
      supplierId: record.supplierId,
      amount: record.amount,
      dueDate: record.dueDate,
      remark: record.remark,
    });
    setModalVisible(true);
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      const payableData = {
        supplierId: values.supplierId,
        supplierName: supplierList.find(s => s.id === values.supplierId)?.name || '',
        amount: values.amount,
        dueDate: values.dueDate?.format('YYYY-MM-DD'),
        remark: values.remark || '',
      };
      const res = editingRecord
        ? await financeApi.put(`/finance/payable/${editingRecord.id}`, payableData)
        : await financeApi.post('/finance/payable', payableData);
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
      1: { text: '未结清', color: 'orange' },
      2: { text: '部分付款', color: 'blue' },
      3: { text: '已结清', color: 'green' },
    };
    const s = map[status] || { text: '未知', color: 'default' };
    return <Tag color={s.color}>{s.text}</Tag>;
  };

  const columns = [
    { title: '供应商', dataIndex: 'supplierName', key: 'supplierName', width: 150 },
    { title: '关联订单', dataIndex: 'orderNo', key: 'orderNo', width: 150 },
    { title: '应付金额', dataIndex: 'amount', key: 'amount', width: 120, render: (v: number) => `¥${v?.toFixed(2) || '0.00'}` },
    { title: '已付金额', dataIndex: 'paidAmount', key: 'paidAmount', width: 120, render: (v: number) => v ? `¥${v.toFixed(2)}` : '-' },
    { title: '待付金额', dataIndex: 'balance', key: 'balance', width: 120, render: (v: number) => `¥${v?.toFixed(2) || '0.00'}` },
    { title: '到期日期', dataIndex: 'dueDate', key: 'dueDate', width: 120 },
    { title: '状态', dataIndex: 'status', key: 'status', width: 100, render: renderStatus },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: (_: any, record: Payable) => (
        <Space>
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)}>编辑</Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h2 style={{ marginBottom: 16 }}>应付账款</h2>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <Input.Search
          placeholder="搜索"
          allowClear
          style={{ width: 200 }}
          prefix={<SearchOutlined />}
        />
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          新增应付
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
        scroll={{ x: 1100 }}
      />

      <Modal
        title={editingRecord ? '编辑应付账款' : '新增应付账款'}
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={() => setModalVisible(false)}
        okText="确定"
        cancelText="取消"
      >
        <Form form={form} layout="vertical">
          <Form.Item name="supplierId" label="供应商" rules={[{ required: true, message: '请选择供应商' }]}>
            <Select placeholder="请选择供应商">
              {supplierList.map(s => (
                <Select.Option key={s.id} value={s.id}>{s.name}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Space style={{ width: '100%' }} size="large">
            <Form.Item name="amount" label="应付金额" rules={[{ required: true, message: '请输入金额' }]} style={{ flex: 1 }}>
              <InputNumber min={0} style={{ width: '100%' }} placeholder="请输入金额" />
            </Form.Item>
            <Form.Item name="dueDate" label="到期日期" style={{ flex: 1 }}>
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
          </Space>
          <Form.Item name="remark" label="备注">
            <Input.TextArea rows={2} placeholder="请输入备注" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default PayablePage;