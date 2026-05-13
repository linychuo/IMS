import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Space,
  Modal,
  Form,
  Select,
  DatePicker,
  Input,
  message,
  Tag,
  Descriptions,
} from 'antd';
import { PlusOutlined, EyeOutlined } from '@ant-design/icons';
import { inventoryApi, warehouseApi } from '../../api';

interface InventoryCheck {
  id: number;
  checkNo: string;
  warehouseId: number;
  warehouseName: string;
  checkType: string;
  checkDate: string;
  status: number;
  checkerName?: string;
  remark?: string;
}

const InventoryCheckPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<InventoryCheck[]>([]);
  const [pagination, setPagination] = useState({ current: 1, size: 10, total: 0 });
  const [warehouseList, setWarehouseList] = useState<{ id: number; name: string }[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<InventoryCheck | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchWarehouses();
    fetchData();
  }, [pagination.current, pagination.size]);

  const fetchWarehouses = async () => {
    try {
      const res = await inventoryApi.get('/warehouse/list');
      if (res.data.code === 200) {
        setWarehouseList(res.data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch warehouses:', error);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await inventoryApi.get('/inventory/check/page', {
        params: { page: pagination.current, pageSize: pagination.size },
      });
      if (res.data.code === 200) {
        setData(res.data.data?.records || []);
        setPagination((prev) => ({ ...prev, total: res.data.data?.total || 0 }));
      }
    } catch (error) {
      console.error('Failed to fetch check records:', error);
      message.error('获取盘点单失败');
    } finally {
      setLoading(false);
    }
  };

  const handleView = async (record: InventoryCheck) => {
    try {
      const res = await inventoryApi.get(`/inventory/check/${record.id}`);
      if (res.data) {
        setEditingRecord(res.data);
        setModalVisible(true);
      }
    } catch (error) {
      message.error('获取盘点单详情失败');
    }
  };

  const handleStart = async (id: number) => {
    try {
      await inventoryApi.put(`/inventory/check/${id}/start`);
      message.success('开始盘点成功');
      fetchData();
    } catch (error) {
      message.error('操作失败');
    }
  };

  const handleFinish = async (id: number) => {
    try {
      await inventoryApi.put(`/inventory/check/${id}/finish`);
      message.success('完成盘点成功');
      fetchData();
    } catch (error) {
      message.error('操作失败');
    }
  };

  const handleCancel = async (id: number) => {
    try {
      await inventoryApi.put(`/inventory/check/${id}/cancel`, null, { params: { reason: '用户取消' } });
      message.success('取消成功');
      fetchData();
    } catch (error) {
      message.error('取消失败');
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      await inventoryApi.post('/inventory/check', values);
      message.success('新增成功');
      setModalVisible(false);
      fetchData();
    } catch (error) {
      console.error('Failed to save:', error);
    }
  };

  const renderStatus = (status: number) => {
    const map: Record<number, { text: string; color: string }> = {
      0: { text: '待盘点', color: 'orange' },
      1: { text: '盘点中', color: 'blue' },
      2: { text: '已完成', color: 'green' },
      9: { text: '已取消', color: 'red' },
    };
    const s = map[status] || { text: '未知', color: 'default' };
    return <Tag color={s.color}>{s.text}</Tag>;
  };

  const columns = [
    { title: '盘点单号', dataIndex: 'checkNo', key: 'checkNo', width: 150 },
    { title: '盘点类型', dataIndex: 'checkType', key: 'checkType', width: 100, render: (v: string) => v === 'FULL' ? '全盘' : '抽盘' },
    { title: '仓库', dataIndex: 'warehouseName', key: 'warehouseName', width: 120 },
    { title: '盘点日期', dataIndex: 'checkDate', key: 'checkDate', width: 120 },
    { title: '盘点人', dataIndex: 'checkerName', key: 'checkerName', width: 100 },
    { title: '状态', dataIndex: 'status', key: 'status', width: 100, render: renderStatus },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_: any, record: InventoryCheck) => (
        <Space>
          <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => handleView(record)}>查看</Button>
          {record.status === 0 && (
            <Button type="link" size="small" onClick={() => handleStart(record.id)}>开始盘点</Button>
          )}
          {record.status === 1 && (
            <Button type="link" size="small" onClick={() => handleFinish(record.id)}>完成盘点</Button>
          )}
          {record.status < 2 && (
            <Button type="link" size="small" danger onClick={() => handleCancel(record.id)}>取消</Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h2 style={{ marginBottom: 16 }}>盘点单</h2>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'flex-end' }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => { form.resetFields(); setEditingRecord(null); setModalVisible(true); }}>新建盘点</Button>
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
        title={editingRecord ? '盘点单详情' : '新建盘点'}
        open={modalVisible}
        onOk={editingRecord ? () => setModalVisible(false) : handleModalOk}
        onCancel={() => setModalVisible(false)}
        width={600}
        footer={editingRecord ? [<Button key="close" onClick={() => setModalVisible(false)}>关闭</Button>] : undefined}
      >
        {editingRecord ? (
          <Descriptions column={2} size="small">
            <Descriptions.Item label="盘点单号">{editingRecord.checkNo}</Descriptions.Item>
            <Descriptions.Item label="盘点类型">{editingRecord.checkType === 'FULL' ? '全盘' : '抽盘'}</Descriptions.Item>
            <Descriptions.Item label="仓库">{editingRecord.warehouseName}</Descriptions.Item>
            <Descriptions.Item label="盘点日期">{editingRecord.checkDate}</Descriptions.Item>
            <Descriptions.Item label="盘点人">{editingRecord.checkerName}</Descriptions.Item>
            <Descriptions.Item label="状态">{renderStatus(editingRecord.status)}</Descriptions.Item>
          </Descriptions>
        ) : (
          <Form form={form} layout="vertical">
            <Form.Item name="warehouseId" label="仓库" rules={[{ required: true }]}>
              <Select placeholder="请选择仓库">
                {warehouseList.map((w) => (
                  <Select.Option key={w.id} value={w.id}>{w.name}</Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="checkType" label="盘点类型" rules={[{ required: true }]}>
              <Select placeholder="请选择">
                <Select.Option value="FULL">全盘</Select.Option>
                <Select.Option value="SPOT">抽盘</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item name="checkDate" label="盘点日期">
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name="remark" label="备注">
              <Input.TextArea rows={2} placeholder="请输入备注" />
            </Form.Item>
          </Form>
        )}
      </Modal>
    </div>
  );
};

export default InventoryCheckPage;