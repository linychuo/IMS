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
  message,
  Tag,
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { financeApi } from '../../api';

interface Account {
  id: number;
  accountName: string;
  accountType: number;
  bankName?: string;
  bankAccount?: string;
  balance: number;
  status: number;
  remark?: string;
}

const AccountPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Account[]>([]);
  const [pagination, setPagination] = useState({ current: 1, size: 10, total: 0 });
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<Account | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchData();
  }, [pagination.current, pagination.size]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await financeApi.get('/finance/account/page', {
        params: { page: pagination.current, pageSize: pagination.size },
      });
      if (res.data.code === 200) {
        setData(res.data.data?.records || []);
        setPagination((prev) => ({ ...prev, total: res.data.data?.total || 0 }));
      }
    } catch (error) {
      console.error('Failed to fetch accounts:', error);
      message.error('获取账户失败');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingRecord(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record: Account) => {
    setEditingRecord(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleEnable = async (id: number) => {
    try {
      await financeApi.put(`/finance/account/enable/${id}`);
      message.success('启用成功');
      fetchData();
    } catch (error) {
      message.error('操作失败');
    }
  };

  const handleDisable = async (id: number) => {
    try {
      await financeApi.put(`/finance/account/disable/${id}`);
      message.success('停用成功');
      fetchData();
    } catch (error) {
      message.error('操作失败');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await financeApi.delete(`/finance/account/${id}`);
      message.success('删除成功');
      fetchData();
    } catch (error) {
      message.error('删除失败');
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingRecord?.id) {
        await financeApi.put(`/finance/account/${editingRecord.id}`, values);
        message.success('修改成功');
      } else {
        await financeApi.post('/finance/account', values);
        message.success('新增成功');
      }
      setModalVisible(false);
      fetchData();
    } catch (error) {
      console.error('Failed to save account:', error);
    }
  };

  const renderStatus = (status: number) => {
    const map: Record<number, { text: string; color: string }> = {
      1: { text: '启用', color: 'green' },
      2: { text: '停用', color: 'red' },
    };
    const s = map[status] || { text: '未知', color: 'default' };
    return <Tag color={s.color}>{s.text}</Tag>;
  };

  const columns = [
    { title: '账户名称', dataIndex: 'accountName', key: 'accountName', width: 150 },
    { title: '账户类型', dataIndex: 'accountType', key: 'accountType', width: 100, render: (v: number) => {
      const map: Record<number, string> = { 1: '现金', 2: '银行', 3: '支付宝', 4: '微信', 5: '其他' };
      return map[v] || '-';
    }},
    { title: '开户行', dataIndex: 'bankName', key: 'bankName', width: 150 },
    { title: '银行账号', dataIndex: 'bankAccount', key: 'bankAccount', width: 180 },
    { title: '余额', dataIndex: 'balance', key: 'balance', width: 120, render: (v: number) => `¥${v?.toFixed(2) || '0.00'}` },
    { title: '状态', dataIndex: 'status', key: 'status', width: 80, render: renderStatus },
    {
      title: '操作',
      key: 'action',
      width: 180,
      render: (_: any, record: Account) => (
        <Space>
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)}>编辑</Button>
          {record.status === 1 ? (
            <Button type="link" size="small" danger onClick={() => handleDisable(record.id)}>停用</Button>
          ) : (
            <Button type="link" size="small" onClick={() => handleEnable(record.id)}>启用</Button>
          )}
          {record.status === 1 && (
            <Button type="link" size="small" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)}>删除</Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h2 style={{ marginBottom: 16 }}>账户管理</h2>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'flex-end' }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>新建账户</Button>
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
        scroll={{ x: 1200 }}
      />

      <Modal
        title={editingRecord ? '编辑账户' : '新建账户'}
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={() => setModalVisible(false)}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="accountName" label="账户名称" rules={[{ required: true }]}>
            <Input placeholder="请输入账户名称" />
          </Form.Item>
          <Space style={{ width: '100%' }} size="large">
            <Form.Item name="accountType" label="账户类型" rules={[{ required: true }]} style={{ flex: 1 }}>
              <Select placeholder="请选择">
                <Select.Option value={1}>现金</Select.Option>
                <Select.Option value={2}>银行</Select.Option>
                <Select.Option value={3}>支付宝</Select.Option>
                <Select.Option value={4}>微信</Select.Option>
                <Select.Option value={5}>其他</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item name="balance" label="余额" style={{ flex: 1 }}>
              <InputNumber min={0} precision={2} style={{ width: '100%' }} />
            </Form.Item>
          </Space>
          <Space style={{ width: '100%' }} size="large">
            <Form.Item name="bankName" label="开户行" style={{ flex: 1 }}>
              <Input placeholder="请输入开户行" />
            </Form.Item>
            <Form.Item name="bankAccount" label="银行账号" style={{ flex: 1 }}>
              <Input placeholder="请输入银行账号" />
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

export default AccountPage;