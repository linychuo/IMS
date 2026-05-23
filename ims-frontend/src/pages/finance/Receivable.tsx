import React, { useState, useEffect } from 'react';
import { Table, Tag, message, Button, Input, Space, Modal, Form, DatePicker, Select, InputNumber } from 'antd';
import { PlusOutlined, SearchOutlined, EditOutlined } from '@ant-design/icons';
import { financeApi, customerApi } from '../../api';

interface Receivable {
  id: number;
  customerId: number;
  customerName: string;
  orderId?: number;
  orderNo?: string;
  amount: number;
  receivedAmount?: number;
  balance: number;
  status: number;
  dueDate?: string;
  remark?: string;
}

const ReceivablePage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Receivable[]>([]);
  const [pagination, setPagination] = useState({ current: 1, size: 10, total: 0 });
  const [modalVisible, setModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<Receivable | null>(null);
  const [customerList, setCustomerList] = useState<{ id: string; name: string }[]>([]);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchCustomers();
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

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await financeApi.get('/finance/receivable/page', {
        params: { page: pagination.current, pageSize: pagination.size },
      });
      if (res.data.code === 200) {
        setData(res.data.data?.records || []);
        setPagination((prev) => ({ ...prev, total: res.data.data?.total || 0 }));
      }
    } catch (error) {
      console.error('Failed to fetch receivables:', error);
      message.error('获取应收账款失败');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingRecord(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record: Receivable) => {
    setEditingRecord(record);
    form.setFieldsValue({
      customerId: record.customerId,
      amount: record.amount,
      dueDate: record.dueDate,
      remark: record.remark,
    });
    setModalVisible(true);
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      const receivableData = {
        customerId: values.customerId,
        customerName: customerList.find(c => c.id === values.customerId)?.name || '',
        amount: values.amount,
        dueDate: values.dueDate?.format('YYYY-MM-DD'),
        remark: values.remark || '',
      };
      const res = editingRecord
        ? await financeApi.put(`/finance/receivable/${editingRecord.id}`, receivableData)
        : await financeApi.post('/finance/receivable', receivableData);
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
      2: { text: '部分收款', color: 'blue' },
      3: { text: '已结清', color: 'green' },
    };
    const s = map[status] || { text: '未知', color: 'default' };
    return <Tag color={s.color}>{s.text}</Tag>;
  };

  const columns = [
    { title: '客户', dataIndex: 'customerName', key: 'customerName', width: 150 },
    { title: '关联订单', dataIndex: 'orderNo', key: 'orderNo', width: 150 },
    { title: '应收金额', dataIndex: 'amount', key: 'amount', width: 120, render: (v: number) => `¥${v?.toFixed(2) || '0.00'}` },
    { title: '已收金额', dataIndex: 'receivedAmount', key: 'receivedAmount', width: 120, render: (v: number) => v ? `¥${v.toFixed(2)}` : '-' },
    { title: '待收金额', dataIndex: 'balance', key: 'balance', width: 120, render: (v: number) => `¥${v?.toFixed(2) || '0.00'}` },
    { title: '到期日期', dataIndex: 'dueDate', key: 'dueDate', width: 120 },
    { title: '状态', dataIndex: 'status', key: 'status', width: 100, render: renderStatus },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: (_: any, record: Receivable) => (
        <Space>
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)}>编辑</Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h2 style={{ marginBottom: 16 }}>应收账款</h2>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <Input.Search
          placeholder="搜索"
          allowClear
          style={{ width: 200 }}
          prefix={<SearchOutlined />}
        />
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          新增应收
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
        title={editingRecord ? '编辑应收账款' : '新增应收账款'}
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={() => setModalVisible(false)}
        okText="确定"
        cancelText="取消"
      >
        <Form form={form} layout="vertical">
          <Form.Item name="customerId" label="客户" rules={[{ required: true, message: '请选择客户' }]}>
            <Select placeholder="请选择客户">
              {customerList.map(c => (
                <Select.Option key={c.id} value={c.id}>{c.name}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Space style={{ width: '100%' }} size="large">
            <Form.Item name="amount" label="应收金额" rules={[{ required: true, message: '请输入金额' }]} style={{ flex: 1 }}>
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

export default ReceivablePage;