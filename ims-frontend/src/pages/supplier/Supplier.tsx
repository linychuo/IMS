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
import { supplierApi } from '../../api';

interface Supplier {
  id?: number;
  code: string;
  name: string;
  contact?: string;
  phone?: string;
  mobile?: string;
  email?: string;
  address?: string;
  level?: number;
  creditLimit?: number;
  payableAmount?: number;
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
  records: Supplier[];
}

const SupplierPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Supplier[]>([]);
  const [pagination, setPagination] = useState({ current: 1, size: 10, total: 0 });
  const [keyword, setKeyword] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchSuppliers();
  }, [pagination.current, pagination.size, keyword]);

  const fetchSuppliers = async () => {
    setLoading(true);
    try {
      const params: Record<string, any> = {
        current: pagination.current,
        size: pagination.size,
      };
      if (keyword) {
        params.keyword = keyword;
      }
      const res = await supplierApi.get('/supplier/page', { params });
      if (res.data.code === 200) {
        const pageResult: PageResult = res.data.data;
        setData(pageResult.records);
        setPagination((prev) => ({ ...prev, total: pageResult.total }));
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
    setEditingSupplier(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record: Supplier) => {
    setEditingSupplier(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      const res = await supplierApi.delete(`/supplier/${id}`);
      if (res.data.code === 200) {
        message.success('删除成功');
        fetchSuppliers();
      } else {
        message.error(res.data.message || '删除失败');
      }
    } catch (error) {
      console.error('Failed to delete supplier:', error);
      message.error('删除失败');
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingSupplier?.id) {
        const res = await supplierApi.put('/supplier', { ...values, id: editingSupplier.id });
        if (res.data.code === 200) {
          message.success('修改成功');
          setModalVisible(false);
          fetchSuppliers();
        } else {
          message.error(res.data.message || '修改失败');
        }
      } else {
        const res = await supplierApi.post('/supplier', values);
        if (res.data.code === 200) {
          message.success('新增成功');
          setModalVisible(false);
          fetchSuppliers();
        } else {
          message.error(res.data.message || '新增失败');
        }
      }
    } catch (error) {
      console.error('Failed to save supplier:', error);
    }
  };

  const handleTableChange = (current: number, size: number) => {
    setPagination({ current, size, total: pagination.total });
  };

  const columns = [
    {
      title: '供应商编码',
      dataIndex: 'code',
      key: 'code',
      width: 120,
    },
    {
      title: '供应商名称',
      dataIndex: 'name',
      key: 'name',
      width: 180,
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
        const map: Record<number, string> = { 1: 'A级', 2: 'B级', 3: 'C级' };
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
      title: '应付账款',
      dataIndex: 'payableAmount',
      key: 'payableAmount',
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
      render: (_: any, record: Supplier) => (
        <Space>
          <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
            编辑
          </Button>
          <Popconfirm
            title="确定删除此供应商？"
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
        <h2>供应商管理</h2>
        <Space>
          <Input.Search
            placeholder="搜索供应商名称"
            allowClear
            onSearch={handleSearch}
            style={{ width: 200 }}
            prefix={<SearchOutlined />}
          />
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            新增供应商
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
        title={editingSupplier ? '编辑供应商' : '新增供应商'}
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={() => setModalVisible(false)}
        width={700}
      >
        <Form form={form} layout="vertical">
          <Space style={{ width: '100%' }} size="large">
            <Form.Item
              name="code"
              label="供应商编码"
              rules={[{ required: true, message: '请输入供应商编码' }]}
              style={{ flex: 1 }}
            >
              <Input placeholder="请输入供应商编码" />
            </Form.Item>
            <Form.Item
              name="name"
              label="供应商名称"
              rules={[{ required: true, message: '请输入供应商名称' }]}
              style={{ flex: 1 }}
            >
              <Input placeholder="请输入供应商名称" />
            </Form.Item>
          </Space>
          <Space style={{ width: '100%' }} size="large">
            <Form.Item name="level" label="供应商等级" initialValue={2} style={{ flex: 1 }}>
              <Select>
                <Select.Option value={1}>A级</Select.Option>
                <Select.Option value={2}>B级</Select.Option>
                <Select.Option value={3}>C级</Select.Option>
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

export default SupplierPage;