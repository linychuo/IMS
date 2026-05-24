import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Space,
  Modal,
  Form,
  Input,
  Select,
  message,
  Tag,
  Card,
  Row,
  Col,
  Tabs,
  Popconfirm,
} from 'antd';
import { PrinterOutlined, FileTextOutlined, PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { systemApi } from '../../api';

interface PrintTemplate {
  id: number;
  templateCode: string;
  templateName: string;
  templateType: number;
  content: string;
  isDefault: number;
  status: number;
  createTime?: string;
}

const PrintTemplatePage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<PrintTemplate[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<PrintTemplate | null>(null);
  const [form] = Form.useForm();
  const [activeTab, setActiveTab] = useState<string>('order');

  const templateTypes = [
    { value: 1, label: '采购订单', key: 'order' },
    { value: 2, label: '销售订单', key: 'sales' },
    { value: 3, label: '入库单', key: 'inbound' },
    { value: 4, label: '出库单', key: 'outbound' },
    { value: 5, label: '标签', key: 'label' },
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await systemApi.get('/print-template/list');
      if (res.data.code === 200) {
        setData(res.data.data || []);
      }
    } catch (error) {
      message.error('获取打印模板列表失败');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingRecord(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record: PrintTemplate) => {
    setEditingRecord(record);
    form.setFieldsValue({
      templateCode: record.templateCode,
      templateName: record.templateName,
      templateType: record.templateType,
      content: record.content,
      isDefault: record.isDefault,
      status: record.status,
    });
    setModalVisible(true);
  };

  const handleView = (record: PrintTemplate) => {
    setEditingRecord(record);
    setViewModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      const res = await systemApi.delete(`/print-template/${id}`);
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
      if (editingRecord?.id) {
        const res = await systemApi.put(`/print-template/${editingRecord.id}`, values);
        if (res.data.code === 200) {
          message.success('修改成功');
          setModalVisible(false);
          fetchData();
        } else {
          message.error(res.data.message || '修改失败');
        }
      } else {
        const res = await systemApi.post('/print-template', values);
        if (res.data.code === 200) {
          message.success('创建成功');
          setModalVisible(false);
          fetchData();
        } else {
          message.error(res.data.message || '创建失败');
        }
      }
    } catch (error) {
      console.error('Failed to save:', error);
    }
  };

  const getTypeName = (type: number) => {
    const map: Record<number, string> = {
      1: '采购订单',
      2: '销售订单',
      3: '入库单',
      4: '出库单',
      5: '标签',
    };
    return map[type] || '其他';
  };

  const getTypeColor = (type: number) => {
    const map: Record<number, string> = {
      1: 'blue',
      2: 'green',
      3: 'cyan',
      4: 'orange',
      5: 'purple',
    };
    return map[type] || 'default';
  };

  const columns = [
    { title: '模板编码', dataIndex: 'templateCode', key: 'templateCode', width: 150 },
    { title: '模板名称', dataIndex: 'templateName', key: 'templateName', width: 180 },
    { title: '类型', dataIndex: 'templateType', key: 'templateType', width: 100, render: (t: number) => <Tag color={getTypeColor(t)}>{getTypeName(t)}</Tag> },
    { title: '默认', dataIndex: 'isDefault', key: 'isDefault', width: 80, render: (v: number) => v === 1 ? <Tag color="green">是</Tag> : <Tag>否</Tag> },
    { title: '状态', dataIndex: 'status', key: 'status', width: 80, render: (v: number) => <Tag color={v === 1 ? 'green' : 'red'}>{v === 1 ? '启用' : '禁用'}</Tag> },
    { title: '创建时间', dataIndex: 'createTime', key: 'createTime', width: 180 },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_: any, record: PrintTemplate) => (
        <Space>
          <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => handleView(record)}>预览</Button>
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)}>编辑</Button>
          <Popconfirm title="确定删除？" onConfirm={() => handleDelete(record.id)}>
            <Button type="link" size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const filteredData = activeTab === 'all'
    ? data
    : data.filter(d => {
        const typeMap: Record<string, number> = { order: 1, sales: 2, inbound: 3, outbound: 4, label: 5 };
        return d.templateType === typeMap[activeTab];
      });

  return (
    <div>
      <h2 style={{ marginBottom: 16 }}>打印模板</h2>
      <Row gutter={16} style={{ marginBottom: 16 }}>
        {templateTypes.map(t => (
          <Col span={4} key={t.key}>
            <Card size="small">
              <Space>
                <FileTextOutlined style={{ color: '#1890ff' }} />
                <div>
                  <div style={{ color: '#8c8c8c', fontSize: 12 }}>{t.label}</div>
                  <div style={{ fontSize: 18, fontWeight: 'bold' }}>{data.filter(d => d.templateType === t.value).length}</div>
                </div>
              </Space>
            </Card>
          </Col>
        ))}
      </Row>

      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'flex-end' }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>新建模板</Button>
      </div>

      <Tabs
        activeKey={activeTab}
        onChange={(key) => setActiveTab(key)}
        items={[
          { key: 'all', label: '全部' },
          ...templateTypes.map(t => ({ key: t.key, label: t.label })),
        ]}
      />

      <Table
        columns={columns}
        dataSource={filteredData}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10, showSizeChanger: true, showTotal: (total) => `共 ${total} 条` }}
        scroll={{ x: 1000 }}
      />

      <Modal
        title={editingRecord ? '编辑模板' : '新建模板'}
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={() => setModalVisible(false)}
        width={700}
      >
        <Form form={form} layout="vertical">
          <Space style={{ width: '100%' }} size="large">
            <Form.Item name="templateCode" label="模板编码" rules={[{ required: true, message: '请输入模板编码' }]} style={{ flex: 1 }}>
              <Input placeholder="如: PO_PRINT_001" disabled={!!editingRecord} />
            </Form.Item>
            <Form.Item name="templateName" label="模板名称" rules={[{ required: true, message: '请输入模板名称' }]} style={{ flex: 1 }}>
              <Input placeholder="请输入模板名称" />
            </Form.Item>
          </Space>
          <Space style={{ width: '100%' }} size="large">
            <Form.Item name="templateType" label="模板类型" rules={[{ required: true, message: '请选择模板类型' }]} style={{ flex: 1 }}>
              <Select>
                {templateTypes.map(t => (
                  <Select.Option key={t.value} value={t.value}>{t.label}</Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="isDefault" label="设为默认" initialValue={0} style={{ flex: 1 }}>
              <Select>
                <Select.Option value={1}>是</Select.Option>
                <Select.Option value={0}>否</Select.Option>
              </Select>
            </Form.Item>
          </Space>
          <Form.Item name="content" label="模板内容" rules={[{ required: true, message: '请输入模板内容' }]}>
            <Input.TextArea rows={10} placeholder="支持 HTML 模板语法，可使用变量: ${orderNo}, ${customerName}, ${totalAmount} 等" />
          </Form.Item>
          <Form.Item name="status" label="状态" initialValue={1}>
            <Select>
              <Select.Option value={1}>启用</Select.Option>
              <Select.Option value={0}>禁用</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="模板预览"
        open={viewModalVisible}
        onCancel={() => setViewModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setViewModalVisible(false)}>关闭</Button>,
          <Button key="print" type="primary" icon={<PrinterOutlined />} onClick={() => {
            const printContent = editingRecord?.content || '';
            const win = window.open('', '_blank');
            if (win) {
              win.document.write(`<html><head><title>${editingRecord?.templateName}</title><style>body{padding:20px;font-family:simsun;}table{width:100%;border-collapse:collapse;}td,th{border:1px solid #ccc;padding:8px;}</style></head><body>${printContent}</body></html>`);
              win.document.close();
              win.print();
            }
          }}>打印</Button>,
        ]}
        width={800}
      >
        {editingRecord && (
          <div>
            <div style={{ marginBottom: 12 }}>
              <Tag color={getTypeColor(editingRecord.templateType)}>{getTypeName(editingRecord.templateType)}</Tag>
              <span style={{ marginLeft: 8, fontWeight: 500 }}>{editingRecord.templateName}</span>
            </div>
            <div
              style={{
                padding: 16,
                border: '1px solid #e8e8e8',
                borderRadius: 8,
                background: '#fff',
                minHeight: 400,
              }}
              dangerouslySetInnerHTML={{ __html: editingRecord.content || '' }}
            />
          </div>
        )}
      </Modal>
    </div>
  );
};

export default PrintTemplatePage;