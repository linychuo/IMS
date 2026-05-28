import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Space,
  Modal,
  Form,
  Select,
  Input,
  message,
  Tag,
  Card,
  Row,
  Col,
  Descriptions,
} from 'antd';
import { PlusOutlined, BellOutlined, EyeOutlined } from '@ant-design/icons';
import { systemApi } from '../../api';

interface Notification {
  id?: number;
  title: string;
  content: string;
  notifyType: number;
  priority: number;
  targetType: number;
  targetScope?: string;
  status: number;
  readCount?: number;
  createTime?: string;
  creatorName?: string;
}

const NotificationPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Notification[]>([]);
  const [stats, setStats] = useState({ total: 0, published: 0, todo: 0 });
  const [pagination, setPagination] = useState({ current: 1, size: 10, total: 0 });
  const [modalVisible, setModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<Notification | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchData();
  }, [pagination.current, pagination.size]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await systemApi.get('/notification/page', {
        params: { page: pagination.current, pageSize: pagination.size },
      });
      if (res.data.code === 200) {
        setData(res.data.data?.records || []);
        setPagination((prev) => ({ ...prev, total: res.data.data?.total || 0 }));
        // 重新获取统计数据（实际项目中应该单独接口）
        setStats({
          total: res.data.data?.total || 0,
          published: res.data.data?.records?.filter((d: Notification) => d.status === 1).length || 0,
          todo: res.data.data?.records?.filter((d: Notification) => d.notifyType === 5).length || 0,
        });
      }
    } catch (error) {
      message.error('获取通知列表失败');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingRecord(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleView = async (record: Notification) => {
    setEditingRecord(record);
    setViewModalVisible(true);
    // 标记已读
    if (record.id) {
      try {
        await systemApi.put(`/notification/${record.id}/read`);
      } catch (e) {
        // ignore
      }
    }
  };

  const handleRead = async (id: number) => {
    try {
      await systemApi.put(`/notification/${id}/read`);
      message.success('标记已读成功');
      fetchData();
    } catch (error) {
      message.error('操作失败');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await systemApi.delete(`/notification/${id}`);
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
        const res = await systemApi.put(`/notification/${editingRecord.id}`, values);
        if (res.data.code === 200) {
          message.success('修改成功');
          setModalVisible(false);
          fetchData();
        } else {
          message.error(res.data.message || '修改失败');
        }
      } else {
        const res = await systemApi.post('/notification', values);
        if (res.data.code === 200) {
          message.success('发送成功');
          setModalVisible(false);
          fetchData();
        } else {
          message.error(res.data.message || '发送失败');
        }
      }
    } catch (error) {
      console.error('Failed to save:', error);
    }
  };

  const renderNotifyType = (type: number) => {
    const map: Record<number, { text: string; color: string }> = {
      1: { text: '系统通知', color: 'blue' },
      2: { text: '库存预警', color: 'orange' },
      3: { text: '订单提醒', color: 'green' },
      4: { text: '财务提醒', color: 'purple' },
      5: { text: '待办提醒', color: 'cyan' },
    };
    const s = map[type] || { text: '其他', color: 'default' };
    return <Tag color={s.color}>{s.text}</Tag>;
  };

  const renderPriority = (priority: number) => {
    const map: Record<number, { text: string; color: string }> = {
      1: { text: '低', color: 'green' },
      2: { text: '中', color: 'orange' },
      3: { text: '高', color: 'red' },
    };
    const s = map[priority] || { text: '普通', color: 'default' };
    return <Tag color={s.color}>{s.text}</Tag>;
  };

  const renderStatus = (status: number) => {
    const map: Record<number, { text: string; color: string }> = {
      0: { text: '草稿', color: 'default' },
      1: { text: '已发布', color: 'green' },
      2: { text: '已下线', color: 'red' },
    };
    const s = map[status] || { text: '未知', color: 'default' };
    return <Tag color={s.color}>{s.text}</Tag>;
  };

  const columns = [
    { title: '通知标题', dataIndex: 'title', key: 'title', width: 200, ellipsis: true },
    { title: '类型', dataIndex: 'notifyType', key: 'notifyType', width: 100, render: renderNotifyType },
    { title: '优先级', dataIndex: 'priority', key: 'priority', width: 80, render: renderPriority },
    { title: '状态', dataIndex: 'status', key: 'status', width: 80, render: renderStatus },
    { title: '已读', dataIndex: 'readCount', key: 'readCount', width: 80, render: (v: number) => v || 0 },
    { title: '发布时间', dataIndex: 'createTime', key: 'createTime', width: 160 },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_: any, record: Notification) => (
        <Space>
          <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => handleView(record)}>查看</Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h2 style={{ marginBottom: 16 }}>消息通知</h2>
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card title="通知总数" extra={<BellOutlined />}>{pagination.total}</Card>
        </Col>
        <Col span={6}>
          <Card title="已发布">{stats.published}</Card>
        </Col>
        <Col span={6}>
          <Card title="待办提醒">{stats.todo}</Card>
        </Col>
      </Row>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'flex-end' }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>发送通知</Button>
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
        title={editingRecord ? '编辑通知' : '发送通知'}
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={() => setModalVisible(false)}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="title" label="通知标题" rules={[{ required: true, message: '请输入标题' }]}>
            <Input placeholder="请输入通知标题" />
          </Form.Item>
          <Space style={{ width: '100%' }} size="large">
            <Form.Item name="notifyType" label="通知类型" initialValue={1} style={{ flex: 1 }}>
              <Select>
                <Select.Option value={1}>系统通知</Select.Option>
                <Select.Option value={2}>库存预警</Select.Option>
                <Select.Option value={3}>订单提醒</Select.Option>
                <Select.Option value={4}>财务提醒</Select.Option>
                <Select.Option value={5}>待办提醒</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item name="priority" label="优先级" initialValue={1} style={{ flex: 1 }}>
              <Select>
                <Select.Option value={1}>低</Select.Option>
                <Select.Option value={2}>中</Select.Option>
                <Select.Option value={3}>高</Select.Option>
              </Select>
            </Form.Item>
          </Space>
          <Form.Item name="targetType" label="发送范围" initialValue={1}>
            <Select>
              <Select.Option value={1}>全体人员</Select.Option>
              <Select.Option value={2}>部门</Select.Option>
              <Select.Option value={3}>角色</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="content" label="通知内容" rules={[{ required: true, message: '请输入内容' }]}>
            <Input.TextArea rows={4} placeholder="请输入通知内容" />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="通知详情"
        open={viewModalVisible}
        onCancel={() => setViewModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setViewModalVisible(false)}>关闭</Button>,
        ]}
      >
        {editingRecord && (
          <>
            <Descriptions column={1} size="small">
              <Descriptions.Item label="标题">{editingRecord.title}</Descriptions.Item>
              <Descriptions.Item label="类型">{renderNotifyType(editingRecord.notifyType)}</Descriptions.Item>
              <Descriptions.Item label="优先级">{renderPriority(editingRecord.priority)}</Descriptions.Item>
              <Descriptions.Item label="状态">{renderStatus(editingRecord.status)}</Descriptions.Item>
              <Descriptions.Item label="发布时间">{editingRecord.createTime}</Descriptions.Item>
            </Descriptions>
            <div style={{ marginTop: 16, padding: 16, background: '#f5f5f5', borderRadius: 4 }}>
              <strong>通知内容：</strong>
              <p style={{ marginTop: 8 }}>{editingRecord.content}</p>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
};

export default NotificationPage;