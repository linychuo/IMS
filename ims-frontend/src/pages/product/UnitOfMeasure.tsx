import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Input,
  InputNumber,
  Space,
  Modal,
  Form,
  Select,
  message,
  Popconfirm,
  Tag,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { productApi } from '../../api';
import type { PageResult } from '../../types';

interface UnitOfMeasure {
  id?: number;
  code: string;
  name: string;
  type: number;
  status: number;
  ratio: number;
  remark?: string;
}

const UnitOfMeasurePage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<UnitOfMeasure[]>([]);
  const [pagination, setPagination] = useState({ current: 1, size: 10, total: 0 });
  const [keyword, setKeyword] = useState('');
  const [typeFilter, setTypeFilter] = useState<number | undefined>();
  const [modalVisible, setModalVisible] = useState(false);
  const [editing, setEditing] = useState<UnitOfMeasure | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchData();
  }, [pagination.current, pagination.size, keyword, typeFilter]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res: any = await productApi.get('/unit-of-measure/page', {
        params: {
          current: pagination.current,
          size: pagination.size,
          keyword,
          type: typeFilter,
        },
      });
      if (res.data.code === 200) {
        const pageResult: PageResult<UnitOfMeasure> = res.data.data;
        setData(pageResult.records || []);
        setPagination(prev => ({ ...prev, total: pageResult.total || 0 }));
      }
    } catch (e) {
      message.error('获取计量单位失败');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditing(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record: UnitOfMeasure) => {
    setEditing(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      const res: any = await productApi.delete(`/unit-of-measure/${id}`);
      if (res.data.code === 200) {
        message.success('删除成功');
        fetchData();
      } else {
        message.error(res.data.message || '删除失败');
      }
    } catch (e) {
      message.error('删除失败');
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const res: any = editing
        ? await productApi.put('/unit-of-measure', { ...values, id: editing.id })
        : await productApi.post('/unit-of-measure', values);
      if (res.data.code === 200) {
        message.success(editing ? '更新成功' : '创建成功');
        setModalVisible(false);
        fetchData();
      } else {
        message.error(res.data.message || '操作失败');
      }
    } catch (e) {
      message.error('操作失败');
    }
  };

  const columns = [
    {
      title: '编码',
      dataIndex: 'code',
      key: 'code',
      width: 120,
    },
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (type: number) => (
        <Tag color={type === 1 ? 'blue' : 'green'}>
          {type === 1 ? '基本单位' : '辅助单位'}
        </Tag>
      ),
    },
    {
      title: '换算率',
      dataIndex: 'ratio',
      key: 'ratio',
      width: 100,
      render: (ratio: number, record: UnitOfMeasure) =>
        record.type === 2 ? `1 = ${ratio}个基本单位` : '-',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (status: number) => (
        <Tag color={status === 1 ? 'success' : 'default'}>
          {status === 1 ? '启用' : '禁用'}
        </Tag>
      ),
    },
    {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: (_: any, record: UnitOfMeasure) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          />
          <Popconfirm
            title="确定删除？"
            onConfirm={() => handleDelete(record.id!)}
          >
            <Button type="link" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Space direction="vertical" style={{ width: '100%' }} size="middle">
        <Space>
          <Input.Search
            placeholder="搜索编码或名称"
            allowClear
            onSearch={(val) => {
              setKeyword(val);
              setPagination(prev => ({ ...prev, current: 1 }));
            }}
            style={{ width: 240 }}
          />
          <Select
            placeholder="单位类型"
            allowClear
            style={{ width: 120 }}
            onChange={(val) => {
              setTypeFilter(val);
              setPagination(prev => ({ ...prev, current: 1 }));
            }}
            options={[
              { label: '基本单位', value: 1 },
              { label: '辅助单位', value: 2 },
            ]}
          />
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            新增
          </Button>
        </Space>

        <Table
          columns={columns}
          dataSource={data}
          loading={loading}
          rowKey="id"
          pagination={{
            current: pagination.current,
            pageSize: pagination.size,
            total: pagination.total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条`,
            onChange: (current, size) => {
              setPagination({ current, size, total: pagination.total });
            },
          }}
        />
      </Space>

      <Modal
        title={editing ? '编辑计量单位' : '新增计量单位'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        okText="确定"
        cancelText="取消"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="code"
            label="编码"
            rules={[{ required: true, message: '请输入编码' }]}
          >
            <Input placeholder="如：PCS、KG" />
          </Form.Item>
          <Form.Item
            name="name"
            label="名称"
            rules={[{ required: true, message: '请输入名称' }]}
          >
            <Input placeholder="如：件、千克" />
          </Form.Item>
          <Form.Item
            name="type"
            label="类型"
            rules={[{ required: true, message: '请选择类型' }]}
          >
            <Select
              options={[
                { label: '基本单位', value: 1 },
                { label: '辅助单位', value: 2 },
              ]}
            />
          </Form.Item>
          <Form.Item
            name="ratio"
            label="换算率"
            extra="辅助单位相对于基本单位的换算值（基本单位填1）"
          >
            <InputNumber min={0.0001} step={0.01} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="status" label="状态" initialValue={1}>
            <Select
              options={[
                { label: '启用', value: 1 },
                { label: '禁用', value: 0 },
              ]}
            />
          </Form.Item>
          <Form.Item name="remark" label="备注">
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UnitOfMeasurePage;
