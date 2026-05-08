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
  message,
  Popconfirm,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { customerApi } from '../../api';

interface Customer {
  id?: number;
  code: string;
  name: string;
  type?: number;
  contact?: string;
  phone?: string;
  mobile?: string;
  email?: string;
  address?: string;
  level?: number;
  creditLimit?: number;
  receivableAmount?: number;
  settlePeriod?: number;
  bankName?: string;
  bankAccount?: string;
  taxNo?: string;
  status: number;
  remark?: string;
}

interface PageResult {
  current: number;
  size: number;
  total: number;
  pages: number;
  records: Customer[];
}

const CustomerPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Customer[]>([]);
  const [pagination, setPagination] = useState({ current: 1, size: 10, total: 0 });
  const [keyword, setKeyword] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchCustomers();
  }, [pagination.current, pagination.size, keyword]);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const params: Record<string, any> = {
        current: pagination.current,
        size: pagination.size,
      };
      if (keyword) {
        params.keyword = keyword;
      }
      const res = await customerApi.get('/customer/page', { params });
      if (res.data.code === 200) {
        const pageResult: PageResult = res.data.data;
        setData(pageResult.records);
        setPagination((prev) => ({ ...prev, total: pageResult.total }));
      }
    } catch (error) {
      console.error('Failed to fetch customers:', error);
      message.error('获取客户列表失败');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setKeyword(value);
    setPagination((prev) => ({ ...prev, current: 1 }));
  };

  const handleAdd = () => {
    setEditingCustomer(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record: Customer) => {
    setEditingCustomer(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      const res = await customerApi.delete(`/customer/${id}`);
      if (res.data.code === 200) {
        message.success('删除成功');
        fetchCustomers();
      } else {
        message.error(res.data.message || '删除失败');
      }
    } catch (error) {
      console.error('Failed to delete customer:', error);
      message.error('删除失败');
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingCustomer?.id) {
        const res = await customerApi.put('/customer', { ...values, id: editingCustomer.id });
        if (res.data.code === 200) {
          message.success('修改成功');
          setModalVisible(false);
          fetchCustomers();
        } else {
          message.error(res.data.message || '修改失败');
        }
      } else {
        const res = await customerApi.post('/customer', values);
        if (res.data.code === 200) {
          message.success('新增成功');
          setModalVisible(false);
          fetchCustomers();
        } else {
          message.error(res.data.message || '新增失败');
        }
      }
    } catch (error) {
      console.error('Failed to save customer:', error);
    }
  };

  const handleTableChange = (current: number, size: number) => {
    setPagination({ current, size, total: pagination.total });
  };

  const columns = [
    {
      title: '客户编码',
      dataIndex: 'code',
      key: 'code',
      width: 120,
    },
    {
      title: '客户名称',
      dataIndex: 'name',
      key: 'name',
      width: 180,
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: 80,
      render: (type: number) => (type === 1 ? '个人' : '企业'),
    },
    {
      title: '联系人',
      dataIndex: 'contact',
      key: 'contact',
      width: 100,
    },
    {
      title: '联系电话',
      dataIndex: 'phone',
      key: 'phone',
      width: 130,
    },
    {
      title: '手机号',
      dataIndex: 'mobile',
      key: 'mobile',
      width: 130,
    },
    {
      title: '等级',
      dataIndex: 'level',
      key: 'level',
      width: 80,
      render: (level: number) => {
        const map: Record<number, string> = { 1: 'VIP', 2: '普通', 3: '潜在' };
        return map[level] || '-';
      },
    },
    {
      title: '信用额度',
      dataIndex: 'creditLimit',
      key: 'creditLimit',
      width: 120,
      render: (value: number) => value ? `¥${value.toFixed(2)}` : '-',
    },
    {
      title: '应收账款',
      dataIndex: 'receivableAmount',
      key: 'receivableAmount',
      width: 120,
      render: (value: number) => value ? `¥${value.toFixed(2)}` : '-',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (status: number) => (status === 0 ? '启用' : '停用'),
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_: any, record: Customer) => (
        <Space>
          <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
            编辑
          </Button>
          <Popconfirm
            title="确定删除此客户？"
            onConfirm={() => record.id && handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <h2>客户管理</h2>
        <Space>
          <Input.Search
            placeholder="搜索客户名称"
            allowClear
            onSearch={handleSearch}
            style={{ width: 200 }}
            prefix={<SearchOutlined />}
          />
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            新增客户
          </Button>
        </Space>
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
          onChange: handleTableChange,
        }}
        scroll={{ x: 1500 }}
      />

      <Modal
        title={editingCustomer ? '编辑客户' : '新增客户'}
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={() => setModalVisible(false)}
        width={700}
      >
        <Form form={form} layout="vertical">
          <Space style={{ width: '100%' }} size="large">
            <Form.Item
              name="code"
              label="客户编码"
              rules={[{ required: true, message: '请输入客户编码' }]}
              style={{ flex: 1 }}
            >
              <Input placeholder="请输入客户编码" />
            </Form.Item>
            <Form.Item
              name="name"
              label="客户名称"
              rules={[{ required: true, message: '请输入客户名称' }]}
              style={{ flex: 1 }}
            >
              <Input placeholder="请输入客户名称" />
            </Form.Item>
          </Space>
          <Space style={{ width: '100%' }} size="large">
            <Form.Item name="type" label="客户类型" initialValue={1} style={{ flex: 1 }}>
              <Select>
                <Select.Option value={1}>个人</Select.Option>
                <Select.Option value={2}>企业</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item name="level" label="客户等级" initialValue={2} style={{ flex: 1 }}>
              <Select>
                <Select.Option value={1}>VIP</Select.Option>
                <Select.Option value={2}>普通</Select.Option>
                <Select.Option value={3}>潜在</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item name="status" label="状态" initialValue={0} style={{ flex: 1 }}>
              <Select>
                <Select.Option value={0}>启用</Select.Option>
                <Select.Option value={1}>停用</Select.Option>
              </Select>
            </Form.Item>
          </Space>
          <Space style={{ width: '100%' }} size="large">
            <Form.Item name="contact" label="联系人" style={{ flex: 1 }}>
              <Input placeholder="请输入联系人" />
            </Form.Item>
            <Form.Item name="phone" label="联系电话" style={{ flex: 1 }}>
              <Input placeholder="请输入联系电话" />
            </Form.Item>
            <Form.Item name="mobile" label="手机号" style={{ flex: 1 }}>
              <Input placeholder="请输入手机号" />
            </Form.Item>
          </Space>
          <Form.Item name="email" label="电子邮箱">
            <Input placeholder="请输入电子邮箱" />
          </Form.Item>
          <Form.Item name="address" label="地址">
            <Input.TextArea rows={2} placeholder="请输入地址" />
          </Form.Item>
          <Space style={{ width: '100%' }} size="large">
            <Form.Item name="creditLimit" label="信用额度" style={{ flex: 1 }}>
              <InputNumber min={0} precision={2} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name="settlePeriod" label="结账周期(天)" style={{ flex: 1 }}>
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
          </Space>
          <Space style={{ width: '100%' }} size="large">
            <Form.Item name="bankName" label="开户银行" style={{ flex: 1 }}>
              <Input placeholder="请输入开户银行" />
            </Form.Item>
            <Form.Item name="bankAccount" label="银行账号" style={{ flex: 1 }}>
              <Input placeholder="请输入银行账号" />
            </Form.Item>
            <Form.Item name="taxNo" label="税号" style={{ flex: 1 }}>
              <Input placeholder="请输入税号" />
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

export default CustomerPage;