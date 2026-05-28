import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Input,
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
  ReloadOutlined,
} from '@ant-design/icons';
import { systemApi } from '../../api';
import type { PageResult } from '../../types';

interface DocumentNoRule {
  id?: number;
  bizType: string;
  bizName: string;
  prefix: string;
  dateFormat: string;
  seqLength: number;
  step: number;
  currentSeq: number;
  resetFrequency: string;
  status: number;
  remark?: string;
}

const DocumentNoRulePage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<DocumentNoRule[]>([]);
  const [pagination, setPagination] = useState({ current: 1, size: 10, total: 0 });
  const [keyword, setKeyword] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [editing, setEditing] = useState<DocumentNoRule | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchData();
  }, [pagination.current, pagination.size, keyword]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res: any = await systemApi.get('/document-no-rule/page', {
        params: {
          current: pagination.current,
          size: pagination.size,
          keyword,
        },
      });
      if (res.data.code === 200) {
        const pageResult: PageResult<DocumentNoRule> = res.data.data;
        setData(pageResult.records || []);
        setPagination(prev => ({ ...prev, total: pageResult.total || 0 }));
      }
    } catch (e) {
      message.error('获取编号规则失败');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditing(null);
    form.resetFields();
    form.setFieldsValue({
      seqLength: 5,
      step: 1,
      resetFrequency: 'DAILY',
      dateFormat: 'yyyyMMdd',
      status: 1,
    });
    setModalVisible(true);
  };

  const handleEdit = (record: DocumentNoRule) => {
    setEditing(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      const res: any = await systemApi.delete(`/document-no-rule/${id}`);
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
        ? await systemApi.put('/document-no-rule', { ...values, id: editing.id })
        : await systemApi.post('/document-no-rule', values);
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

  const handleInitDefaults = async () => {
    try {
      const res: any = await systemApi.post('/document-no-rule/init');
      if (res.data.code === 200) {
        message.success('初始化成功');
        fetchData();
      } else {
        message.error(res.data.message || '初始化失败');
      }
    } catch (e) {
      message.error('初始化失败');
    }
  };

  const resetFrequencyMap: Record<string, string> = {
    DAILY: '每日',
    MONTHLY: '每月',
    YEARLY: '每年',
    NEVER: '从不',
  };

  const columns = [
    {
      title: '业务类型',
      dataIndex: 'bizType',
      key: 'bizType',
      width: 100,
    },
    {
      title: '名称',
      dataIndex: 'bizName',
      key: 'bizName',
      width: 120,
    },
    {
      title: '前缀',
      dataIndex: 'prefix',
      key: 'prefix',
      width: 80,
    },
    {
      title: '日期格式',
      dataIndex: 'dateFormat',
      key: 'dateFormat',
      width: 100,
    },
    {
      title: '序列号位数',
      dataIndex: 'seqLength',
      key: 'seqLength',
      width: 100,
    },
    {
      title: '当前序列',
      dataIndex: 'currentSeq',
      key: 'currentSeq',
      width: 100,
    },
    {
      title: '步长',
      dataIndex: 'step',
      key: 'step',
      width: 80,
    },
    {
      title: '重置频率',
      dataIndex: 'resetFrequency',
      key: 'resetFrequency',
      width: 100,
      render: (val: string) => resetFrequencyMap[val] || val,
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
      title: '操作',
      key: 'action',
      width: 120,
      render: (_: any, record: DocumentNoRule) => (
        <Space>
          <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Popconfirm title="确定删除？" onConfirm={() => handleDelete(record.id!)}>
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
            placeholder="搜索名称"
            allowClear
            onSearch={(val) => {
              setKeyword(val);
              setPagination(prev => ({ ...prev, current: 1 }));
            }}
            style={{ width: 240 }}
          />
          <Button icon={<ReloadOutlined />} onClick={handleInitDefaults}>
            初始化默认规则
          </Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            新增规则
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
        title={editing ? '编辑编号规则' : '新增编号规则'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        okText="确定"
        cancelText="取消"
        width={500}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="bizType"
            label="业务类型编码"
            rules={[{ required: true, message: '请输入编码' }]}
          >
            <Input placeholder="如：PO, SO, PI" disabled={!!editing} />
          </Form.Item>
          <Form.Item
            name="bizName"
            label="业务类型名称"
            rules={[{ required: true, message: '请输入名称' }]}
          >
            <Input placeholder="如：采购订单" />
          </Form.Item>
          <Form.Item name="prefix" label="前缀">
            <Input placeholder="如：PO" />
          </Form.Item>
          <Form.Item name="dateFormat" label="日期格式" initialValue="yyyyMMdd">
            <Select
              options={[
                { label: 'yyyyMMdd (20260528)', value: 'yyyyMMdd' },
                { label: 'yyyyMM (202605)', value: 'yyyyMM' },
                { label: 'yyyy (2026)', value: 'yyyy' },
                { label: '无日期', value: '' },
              ]}
            />
          </Form.Item>
          <Form.Item name="seqLength" label="序列号位数" initialValue={5}>
            <Select
              options={[
                { label: '3位 (001)', value: 3 },
                { label: '4位 (0001)', value: 4 },
                { label: '5位 (00001)', value: 5 },
                { label: '6位 (000001)', value: 6 },
              ]}
            />
          </Form.Item>
          <Form.Item name="step" label="步长" initialValue={1}>
            <Select
              options={[
                { label: '1', value: 1 },
                { label: '2', value: 2 },
                { label: '5', value: 5 },
                { label: '10', value: 10 },
              ]}
            />
          </Form.Item>
          <Form.Item name="resetFrequency" label="重置频率" initialValue="DAILY">
            <Select
              options={[
                { label: '每日重置', value: 'DAILY' },
                { label: '每月重置', value: 'MONTHLY' },
                { label: '每年重置', value: 'YEARLY' },
                { label: '从不重置', value: 'NEVER' },
              ]}
            />
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
            <Input.TextArea rows={2} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default DocumentNoRulePage;
