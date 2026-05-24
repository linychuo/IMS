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
  message,
  Popconfirm,
  Tag,
  Card,
  Row,
  Col,
  Statistic,
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SettingOutlined } from '@ant-design/icons';
import { systemApi } from '../../api';

interface SysConfig {
  id?: number;
  configKey: string;
  configName: string;
  configValue: string;
  configType: number;
  remark?: string;
  status: number;
  createTime?: string;
}

const ConfigPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<SysConfig[]>([]);
  const [pagination, setPagination] = useState({ current: 1, size: 10, total: 0 });
  const [keyword, setKeyword] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<SysConfig | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchData();
  }, [pagination.current, pagination.size, keyword]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const params: Record<string, any> = {
        page: pagination.current,
        pageSize: pagination.size,
      };
      if (keyword) {
        params.keyword = keyword;
      }
      const res = await systemApi.get('/config/page', { params });
      if (res.data.code === 200) {
        setData(res.data.data?.records || []);
        setPagination((prev) => ({ ...prev, total: res.data.data?.total || 0 }));
      }
    } catch (error) {
      message.error('获取配置列表失败');
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

  const handleEdit = (record: SysConfig) => {
    setEditingRecord(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      const res = await systemApi.delete(`/config/${id}`);
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

  const handleToggleStatus = async (id: number, currentStatus: number) => {
    try {
      const res = await systemApi.put(`/config/${id}/status`, null, { params: { status: currentStatus === 1 ? 0 : 1 } });
      if (res.data.code === 200) {
        message.success(currentStatus === 1 ? '禁用成功' : '启用成功');
        fetchData();
      } else {
        message.error(res.data.message || '操作失败');
      }
    } catch (error) {
      message.error('操作失败');
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingRecord?.id) {
        const res = await systemApi.put(`/config/${editingRecord.id}`, values);
        if (res.data.code === 200) {
          message.success('修改成功');
          setModalVisible(false);
          fetchData();
        } else {
          message.error(res.data.message || '修改失败');
        }
      } else {
        const res = await systemApi.post('/config', values);
        if (res.data.code === 200) {
          message.success('新增成功');
          setModalVisible(false);
          fetchData();
        } else {
          message.error(res.data.message || '新增失败');
        }
      }
    } catch (error) {
      console.error('Failed to save config:', error);
    }
  };

  const renderConfigType = (type: number) => {
    const map: Record<number, { text: string; color: string }> = {
      1: { text: '系统参数', color: 'blue' },
      2: { text: '业务参数', color: 'green' },
      3: { text: '预警参数', color: 'orange' },
      4: { text: '自定义', color: 'purple' },
    };
    const s = map[type] || { text: '未知', color: 'default' };
    return <Tag color={s.color}>{s.text}</Tag>;
  };

  const columns = [
    { title: '配置Key', dataIndex: 'configKey', key: 'configKey', width: 180 },
    { title: '配置名称', dataIndex: 'configName', key: 'configName', width: 150 },
    { title: '配置值', dataIndex: 'configValue', key: 'configValue', width: 200, ellipsis: true },
    { title: '类型', dataIndex: 'configType', key: 'configType', width: 100, render: renderConfigType },
    { title: '状态', dataIndex: 'status', key: 'status', width: 80, render: (v: number) => <Tag color={v === 1 ? 'green' : 'red'}>{v === 1 ? '启用' : '禁用'}</Tag> },
    { title: '备注', dataIndex: 'remark', key: 'remark', width: 150, ellipsis: true },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_: any, record: SysConfig) => (
        <Space>
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)}>编辑</Button>
          <Button type="link" size="small" onClick={() => handleToggleStatus(record.id!, record.status)}>
            {record.status === 1 ? '禁用' : '启用'}
          </Button>
          <Popconfirm title="确定删除？" onConfirm={() => handleDelete(record.id!)}>
            <Button type="link" size="small" danger icon={<DeleteOutlined />}>删除</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h2 style={{ marginBottom: 16 }}>系统参数配置</h2>
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card><Statistic title="配置总数" value={data.length} prefix={<SettingOutlined />} /></Card>
        </Col>
        <Col span={6}>
          <Card><Statistic title="启用配置" valueStyle={{ color: '#52c41a' }} value={data.filter(d => d.status === 1).length} /></Card>
        </Col>
        <Col span={6}>
          <Card><Statistic title="禁用配置" valueStyle={{ color: '#ff4d4f' }} value={data.filter(d => d.status === 0).length} /></Card>
        </Col>
      </Row>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <Input.Search
          placeholder="搜索配置名称/key"
          allowClear
          onSearch={handleSearch}
          style={{ width: 250 }}
        />
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>新建配置</Button>
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
        title={editingRecord ? '编辑配置' : '新建配置'}
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={() => setModalVisible(false)}
        width={500}
      >
        <Form form={form} layout="vertical">
          <Space style={{ width: '100%' }} size="large">
            <Form.Item name="configKey" label="配置Key" rules={[{ required: true, message: '请输入配置Key' }]} style={{ flex: 1 }}>
              <Input placeholder="如: sys.order.auto.approve" disabled={!!editingRecord} />
            </Form.Item>
            <Form.Item name="configName" label="配置名称" rules={[{ required: true, message: '请输入配置名称' }]} style={{ flex: 1 }}>
              <Input placeholder="如: 订单自动审核" />
            </Form.Item>
          </Space>
          <Space style={{ width: '100%' }} size="large">
            <Form.Item name="configType" label="配置类型" initialValue={1} style={{ flex: 1 }}>
              <Select>
                <Select.Option value={1}>系统参数</Select.Option>
                <Select.Option value={2}>业务参数</Select.Option>
                <Select.Option value={3}>预警参数</Select.Option>
                <Select.Option value={4}>自定义</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item name="status" label="状态" initialValue={1} style={{ flex: 1 }}>
              <Select>
                <Select.Option value={1}>启用</Select.Option>
                <Select.Option value={0}>禁用</Select.Option>
              </Select>
            </Form.Item>
          </Space>
          <Form.Item name="configValue" label="配置值" rules={[{ required: true, message: '请输入配置值' }]}>
            <Input.TextArea rows={3} placeholder="请输入配置值" />
          </Form.Item>
          <Form.Item name="remark" label="备注">
            <Input.TextArea rows={2} placeholder="请输入备注" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ConfigPage;