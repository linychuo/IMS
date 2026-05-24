import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Space,
  Modal,
  Form,
  InputNumber,
  Select,
  DatePicker,
  message,
  Popconfirm,
  Tag,
  Input,
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { salesApi } from '../../api';
import dayjs from 'dayjs';

interface Promotion {
  id?: number;
  promotionNo: string;
  promotionName: string;
  promotionType: number;
  discountType?: number;
  discountValue?: number;
  minPurchaseAmount?: number;
  buyQuantity?: number;
  giftQuantity?: number;
  startDate?: string;
  endDate?: string;
  status: number;
  remark?: string;
}

const PromotionPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Promotion[]>([]);
  const [pagination, setPagination] = useState({ current: 1, size: 10, total: 0 });
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<Promotion | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchData();
  }, [pagination.current, pagination.size]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await salesApi.get('/promotion/list');
      if (res.data.code === 200) {
        setData(res.data.data || []);
        setPagination(prev => ({ ...prev, total: res.data.data?.length || 0 }));
      }
    } catch (error) {
      message.error('获取促销列表失败');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingRecord(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record: Promotion) => {
    setEditingRecord(record);
    form.setFieldsValue({
      ...record,
      startDate: record.startDate ? dayjs(record.startDate) : null,
      endDate: record.endDate ? dayjs(record.endDate) : null,
    });
    setModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      const res = await salesApi.delete(`/promotion/${id}`);
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
    const newStatus = currentStatus === 1 ? 0 : 1;
    try {
      const res = await salesApi.post(`/promotion/${id}/status`, null, { params: { status: newStatus } });
      if (res.data.code === 200) {
        message.success(newStatus === 1 ? '启用成功' : '禁用成功');
        fetchData();
      }
    } catch (error) {
      message.error('操作失败');
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      const params = {
        ...values,
        startDate: values.startDate?.format('YYYY-MM-DD'),
        endDate: values.endDate?.format('YYYY-MM-DD'),
      };
      if (editingRecord?.id) {
        const res = await salesApi.put('/promotion', { ...params, id: editingRecord.id });
        if (res.data.code === 200) {
          message.success('修改成功');
          setModalVisible(false);
          fetchData();
        } else {
          message.error(res.data.message || '修改失败');
        }
      } else {
        const res = await salesApi.post('/promotion', params);
        if (res.data.code === 200) {
          message.success('新增成功');
          setModalVisible(false);
          fetchData();
        } else {
          message.error(res.data.message || '新增失败');
        }
      }
    } catch (error) {
      console.error('Failed to save promotion:', error);
    }
  };

  const renderStatus = (status: number) => {
    return <Tag color={status === 1 ? 'green' : 'red'}>{status === 1 ? '生效中' : '已失效'}</Tag>;
  };

  const renderPromotionType = (type: number) => {
    const map: Record<number, string> = { 1: '折扣', 2: '满减', 3: '买赠', 4: '限时特价' };
    return map[type] || '未知';
  };

  const renderDiscountType = (type: number) => {
    const map: Record<number, string> = { 1: '百分比', 2: '固定金额' };
    return map[type] || '-';
  };

  const columns = [
    { title: '促销编号', dataIndex: 'promotionNo', key: 'promotionNo', width: 150 },
    { title: '促销名称', dataIndex: 'promotionName', key: 'promotionName', width: 200 },
    { title: '促销类型', dataIndex: 'promotionType', key: 'promotionType', width: 100, render: (t: number) => <Tag color="blue">{renderPromotionType(t)}</Tag> },
    { title: '优惠方式', dataIndex: 'discountType', key: 'discountType', width: 100, render: (t: number, r: Promotion) => r.promotionType === 1 ? renderDiscountType(t) : '-' },
    { title: '优惠值', dataIndex: 'discountValue', key: 'discountValue', width: 100, render: (v: number, r: Promotion) => r.promotionType === 1 && r.discountType === 1 ? `${v}%` : r.promotionType === 1 && r.discountType === 2 ? `¥${v}` : r.discountValue || '-' },
    { title: '最低消费', dataIndex: 'minPurchaseAmount', key: 'minPurchaseAmount', width: 100 },
    { title: '买X赠Y', dataIndex: 'buyQuantity', key: 'buyQuantity', width: 100, render: (b: number, r: Promotion) => r.promotionType === 3 && b ? `买${b}赠${r.giftQuantity}` : '-' },
    { title: '开始日期', dataIndex: 'startDate', key: 'startDate', width: 120 },
    { title: '结束日期', dataIndex: 'endDate', key: 'endDate', width: 120 },
    { title: '状态', dataIndex: 'status', key: 'status', width: 80, render: renderStatus },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_: any, record: Promotion) => (
        <Space>
          <Button type="link" size="small" onClick={() => handleEdit(record)}>编辑</Button>
          <Popconfirm title="确定删除？" onConfirm={() => handleDelete(record.id!)}>
            <Button type="link" size="small" danger>删除</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h2 style={{ marginBottom: 16 }}>促销管理</h2>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>新建促销</Button>
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
        scroll={{ x: 1400 }}
      />
      <Modal
        title={editingRecord ? '编辑促销' : '新建促销'}
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={() => setModalVisible(false)}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="promotionName" label="促销名称" rules={[{ required: true, message: '请输入促销名称' }]}>
            <Input placeholder="请输入促销名称" />
          </Form.Item>
          <Form.Item name="promotionType" label="促销类型" rules={[{ required: true, message: '请选择促销类型' }]}>
            <Select onChange={() => form.setFieldValue('discountType', undefined)}>
              <Select.Option value={1}>折扣</Select.Option>
              <Select.Option value={2}>满减</Select.Option>
              <Select.Option value={3}>买赠</Select.Option>
              <Select.Option value={4}>限时特价</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item noStyle shouldUpdate={(prev, curr) => prev.promotionType !== curr.promotionType}>
            {() => {
              const pType = form.getFieldValue('promotionType');
              if (pType === 1) {
                return (
                  <Space style={{ width: '100%' }} size="large">
                    <Form.Item name="discountType" label="优惠方式" style={{ flex: 1 }} rules={[{ required: true, message: '请选择' }]}>
                      <Select placeholder="请选择">
                        <Select.Option value={1}>百分比折扣</Select.Option>
                        <Select.Option value={2}>固定金额</Select.Option>
                      </Select>
                    </Form.Item>
                    <Form.Item name="discountValue" label="优惠值" style={{ flex: 1 }} rules={[{ required: true, message: '请输入' }]}>
                      <InputNumber style={{ width: '100%' }} placeholder="请输入" min={0} />
                    </Form.Item>
                  </Space>
                );
              }
              if (pType === 2) {
                return (
                  <Space style={{ width: '100%' }} size="large">
                    <Form.Item name="minPurchaseAmount" label="最低消费" style={{ flex: 1 }} rules={[{ required: true, message: '请输入' }]}>
                      <InputNumber style={{ width: '100%' }} placeholder="满多少" min={0} />
                    </Form.Item>
                    <Form.Item name="discountValue" label="减多少" style={{ flex: 1 }} rules={[{ required: true, message: '请输入' }]}>
                      <InputNumber style={{ width: '100%' }} placeholder="减多少" min={0} />
                    </Form.Item>
                  </Space>
                );
              }
              if (pType === 3) {
                return (
                  <Space style={{ width: '100%' }} size="large">
                    <Form.Item name="buyQuantity" label="购买数量" style={{ flex: 1 }} rules={[{ required: true, message: '请输入' }]}>
                      <InputNumber style={{ width: '100%' }} placeholder="买几件" min={1} />
                    </Form.Item>
                    <Form.Item name="giftQuantity" label="赠送数量" style={{ flex: 1 }} rules={[{ required: true, message: '请输入' }]}>
                      <InputNumber style={{ width: '100%' }} placeholder="送几件" min={1} />
                    </Form.Item>
                  </Space>
                );
              }
              if (pType === 4) {
                return (
                  <Form.Item name="discountValue" label="特价金额" rules={[{ required: true, message: '请输入' }]}>
                    <InputNumber style={{ width: '100%' }} placeholder="请输入特价金额" min={0} />
                  </Form.Item>
                );
              }
              return null;
            }}
          </Form.Item>
          <Space style={{ width: '100%' }} size="large">
            <Form.Item name="startDate" label="开始日期" style={{ flex: 1 }}>
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name="endDate" label="结束日期" style={{ flex: 1 }}>
              <DatePicker style={{ width: '100%' }} />
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

export default PromotionPage;