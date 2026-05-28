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
} from '@ant-design/icons';
import { systemApi } from '../../api';

interface ApprovalRule {
  id?: number;
  ruleCode: string;
  ruleName: string;
  businessType: string;
  minAmount?: number;
  maxAmount?: number;
  approvalLevel?: number;
  approverRole?: string;
  approverUser?: string;
  status: number;
  remark?: string;
}

const ApprovalRulePage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ApprovalRule[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editing, setEditing] = useState<ApprovalRule | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res: any = await systemApi.get('/system/approval-rule');
      if (res.data.code === 200) {
        setData(res.data.data || []);
      }
    } catch (e) {
      message.error('获取审批规则失败');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditing(null);
    form.resetFields();
    form.setFieldsValue({ status: 1, approvalLevel: 1 });
    setModalVisible(true);
  };

  const handleEdit = (record: ApprovalRule) => {
    setEditing(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      const res: any = await systemApi.delete(`/system/approval-rule/${id}`);
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
      if (editing?.id) {
        const res: any = await systemApi.put(`/system/approval-rule/${editing.id}`, values);
        if (res.data.code === 200) {
          message.success('更新成功');
          setModalVisible(false);
          fetchData();
        } else {
          message.error(res.data.message || '操作失败');
        }
      } else {
        const res: any = await systemApi.post('/system/approval-rule', values);
        if (res.data.code === 200) {
          message.success('创建成功');
          setModalVisible(false);
          fetchData();
        } else {
          message.error(res.data.message || '操作失败');
        }
      }
    } catch (e) {
      message.error('操作失败');
    }
  };

  const businessTypeMap: Record<string, string> = {
    PURCHASE_ORDER: '采购订单',
    SALES_ORDER: '销售订单',
    PURCHASE_RETURN: '采购退货',
    SALES_RETURN: '销售退货',
  };

  const columns = [
    { title: '规则编码', dataIndex: 'ruleCode', key: 'ruleCode', width: 120 },
    { title: '规则名称', dataIndex: 'ruleName', key: 'ruleName', width: 150 },
    {
      title: '业务类型',
      dataIndex: 'businessType',
      key: 'businessType',
      width: 100,
      render: (type: string) => businessTypeMap[type] || type,
    },
    { title: '最小金额', dataIndex: 'minAmount', key: 'minAmount', width: 100 },
    { title: '最大金额', dataIndex: 'maxAmount', key: 'maxAmount', width: 100 },
    { title: '审批级别', dataIndex: 'approvalLevel', key: 'approvalLevel', width: 100 },
    { title: '审批角色', dataIndex: 'approverRole', key: 'approverRole', width: 100 },
    { title: '审批人', dataIndex: 'approverUser', key: 'approverUser', width: 100 },
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
      render: (_: any, record: ApprovalRule) => (
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
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            新增规则
          </Button>
        </Space>

        <Table
          columns={columns}
          dataSource={data}
          loading={loading}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </Space>

      <Modal
        title={editing ? '编辑审批规则' : '新增审批规则'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        okText="确定"
        cancelText="取消"
        width={600}
      >
        <Form form={form} layout="vertical">
          <Space style={{ width: '100%' }} size="large">
            <Form.Item name="ruleCode" label="规则编码" rules={[{ required: true }]} style={{ flex: 1 }}>
              <Input placeholder="如：PO_APPROVE_1" />
            </Form.Item>
            <Form.Item name="ruleName" label="规则名称" rules={[{ required: true }]} style={{ flex: 1 }}>
              <Input placeholder="如：采购订单一级审批" />
            </Form.Item>
          </Space>
          <Space style={{ width: '100%' }} size="large">
            <Form.Item name="businessType" label="业务类型" rules={[{ required: true }]} style={{ flex: 1 }}>
              <Select>
                <Select.Option value="PURCHASE_ORDER">采购订单</Select.Option>
                <Select.Option value="SALES_ORDER">销售订单</Select.Option>
                <Select.Option value="PURCHASE_RETURN">采购退货</Select.Option>
                <Select.Option value="SALES_RETURN">销售退货</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item name="approvalLevel" label="审批级别" initialValue={1} style={{ flex: 1 }}>
              <Select>
                <Select.Option value={1}>一级审批</Select.Option>
                <Select.Option value={2}>二级审批</Select.Option>
                <Select.Option value={3}>三级审批</Select.Option>
              </Select>
            </Form.Item>
          </Space>
          <Space style={{ width: '100%' }} size="large">
            <Form.Item name="minAmount" label="最小金额" style={{ flex: 1 }}>
              <Input type="number" placeholder="0" />
            </Form.Item>
            <Form.Item name="maxAmount" label="最大金额" style={{ flex: 1 }}>
              <Input type="number" placeholder="不限制" />
            </Form.Item>
          </Space>
          <Space style={{ width: '100%' }} size="large">
            <Form.Item name="approverRole" label="审批角色" style={{ flex: 1 }}>
              <Input placeholder="如：MANAGER" />
            </Form.Item>
            <Form.Item name="approverUser" label="审批人" style={{ flex: 1 }}>
              <Input placeholder="指定用户ID，多个用逗号分隔" />
            </Form.Item>
          </Space>
          <Form.Item name="status" label="状态" initialValue={1}>
            <Select>
              <Select.Option value={1}>启用</Select.Option>
              <Select.Option value={0}>禁用</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="remark" label="备注">
            <Input.TextArea rows={2} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ApprovalRulePage;
