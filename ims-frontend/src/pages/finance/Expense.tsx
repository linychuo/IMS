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
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { financeApi } from '../../api';

interface Expense {
  id?: number;
  expenseNo: string;
  expenseType: number;
  expenseDate: string;
  amount: number;
  payMethod?: number;
  handler?: string;
  status: number;
  remark?: string;
  createTime?: string;
}

const ExpensePage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Expense[]>([]);
  const [pagination, setPagination] = useState({ current: 1, size: 10, total: 0 });
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<Expense | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchData();
  }, [pagination.current, pagination.size]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await financeApi.get('/expense/page', {
        params: { page: pagination.current, pageSize: pagination.size },
      });
      if (res.data.code === 200) {
        setData(res.data.data?.records || []);
        setPagination((prev) => ({ ...prev, total: res.data.data?.total || 0 }));
      }
    } catch (error) {
      message.error('获取费用列表失败');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingRecord(null);
    form.resetFields();
    form.setFieldsValue({ expenseType: 1, status: 1 });
    setModalVisible(true);
  };

  const handleEdit = (record: Expense) => {
    setEditingRecord(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      const res = await financeApi.delete(`/expense/${id}`);
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
        expenseDate: values.expenseDate?.format('YYYY-MM-DD'),
      };
      if (editingRecord?.id) {
        const res = await financeApi.put(`/expense/${editingRecord.id}`, params);
        if (res.data.code === 200) {
          message.success('修改成功');
          setModalVisible(false);
          fetchData();
        } else {
          message.error(res.data.message || '修改失败');
        }
      } else {
        const res = await financeApi.post('/expense', params);
        if (res.data.code === 200) {
          message.success('新增成功');
          setModalVisible(false);
          fetchData();
        } else {
          message.error(res.data.message || '新增失败');
        }
      }
    } catch (error) {
      console.error('Failed to save expense:', error);
    }
  };

  const renderExpenseType = (type: number) => {
    const map: Record<number, { text: string; color: string }> = {
      1: { text: '运营费用', color: 'blue' },
      2: { text: '营销费用', color: 'orange' },
      3: { text: '管理费用', color: 'purple' },
      4: { text: '财务费用', color: 'cyan' },
      5: { text: '其他费用', color: 'default' },
    };
    const s = map[type] || { text: '未知', color: 'default' };
    return <Tag color={s.color}>{s.text}</Tag>;
  };

  const renderPayMethod = (method: number) => {
    const map: Record<number, string> = { 1: '现金', 2: '银行转账', 3: '支付宝', 4: '微信' };
    return map[method] || '-';
  };

  const renderStatus = (status: number) => {
    const map: Record<number, { text: string; color: string }> = {
      1: { text: '待审核', color: 'orange' },
      2: { text: '已审核', color: 'green' },
      3: { text: '已支付', color: 'blue' },
      4: { text: '已拒绝', color: 'red' },
    };
    const s = map[status] || { text: '未知', color: 'default' };
    return <Tag color={s.color}>{s.text}</Tag>;
  };

  const columns = [
    { title: '费用单号', dataIndex: 'expenseNo', key: 'expenseNo', width: 150 },
    { title: '费用类型', dataIndex: 'expenseType', key: 'expenseType', width: 110, render: renderExpenseType },
    { title: '费用日期', dataIndex: 'expenseDate', key: 'expenseDate', width: 110 },
    { title: '金额', dataIndex: 'amount', key: 'amount', width: 110, render: (v: number) => `¥${v?.toFixed(2)}` },
    { title: '支付方式', dataIndex: 'payMethod', key: 'payMethod', width: 100, render: (v: number) => renderPayMethod(v) },
    { title: '经办人', dataIndex: 'handler', key: 'handler', width: 100 },
    { title: '状态', dataIndex: 'status', key: 'status', width: 90, render: renderStatus },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: (_: any, record: Expense) => (
        <Space>
          <Button type="link" size="small" onClick={() => handleEdit(record)}>编辑</Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h2 style={{ marginBottom: 16 }}>费用管理</h2>
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card><Statistic title="费用总数" value={data.length} /></Card>
        </Col>
        <Col span={6}>
          <Card><Statistic title="待审核" valueStyle={{ color: '#fa8c16' }} value={data.filter(d => d.status === 1).length} /></Card>
        </Col>
        <Col span={6}>
          <Card><Statistic title="已支付" valueStyle={{ color: '#52c41a' }} value={data.filter(d => d.status === 3).length} /></Card>
        </Col>
      </Row>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'flex-end' }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>新增费用</Button>
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
        title={editingRecord ? '编辑费用' : '新增费用'}
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={() => setModalVisible(false)}
        width={500}
      >
        <Form form={form} layout="vertical">
          <Space style={{ width: '100%' }} size="large">
            <Form.Item name="expenseNo" label="费用单号" rules={[{ required: true }]} style={{ flex: 1 }}>
              <Input placeholder="请输入费用单号" />
            </Form.Item>
            <Form.Item name="expenseType" label="费用类型" style={{ flex: 1 }}>
              <Select>
                <Select.Option value={1}>运营费用</Select.Option>
                <Select.Option value={2}>营销费用</Select.Option>
                <Select.Option value={3}>管理费用</Select.Option>
                <Select.Option value={4}>财务费用</Select.Option>
                <Select.Option value={5}>其他费用</Select.Option>
              </Select>
            </Form.Item>
          </Space>
          <Space style={{ width: '100%' }} size="large">
            <Form.Item name="expenseDate" label="费用日期" style={{ flex: 1 }}>
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name="amount" label="金额" rules={[{ required: true }]} style={{ flex: 1 }}>
              <InputNumber min={0} precision={2} style={{ width: '100%' }} placeholder="0.00" />
            </Form.Item>
          </Space>
          <Space style={{ width: '100%' }} size="large">
            <Form.Item name="payMethod" label="支付方式" style={{ flex: 1 }}>
              <Select placeholder="请选择" allowClear>
                <Select.Option value={1}>现金</Select.Option>
                <Select.Option value={2}>银行转账</Select.Option>
                <Select.Option value={3}>支付宝</Select.Option>
                <Select.Option value={4}>微信</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item name="handler" label="经办人" style={{ flex: 1 }}>
              <Input placeholder="请输入经办人" />
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

export default ExpensePage;