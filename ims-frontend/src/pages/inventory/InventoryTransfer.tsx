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
import { warehouseApi } from '../../api';

interface InventoryTransfer {
  id: number;
  transferNo: string;
  fromWarehouseId: number;
  fromWarehouseName: string;
  toWarehouseId: number;
  toWarehouseName: string;
  transferDate: string;
  status: number;
  totalQuantity: number;
  totalAmount: number;
  remark?: string;
}

const InventoryTransferPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<InventoryTransfer[]>([]);
  const [pagination, setPagination] = useState({ current: 1, size: 10, total: 0 });
  const [warehouseList, setWarehouseList] = useState<{ id: number; name: string }[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<InventoryTransfer | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchWarehouses();
    fetchData();
  }, [pagination.current, pagination.size]);

  const fetchWarehouses = async () => {
    try {
      const res = await warehouseApi.get('/warehouse/list');
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
      const res = await warehouseApi.get('/inventory/transfer/page', {
        params: { page: pagination.current, pageSize: pagination.size },
      });
      if (res.data.code === 200) {
        setData(res.data.data?.records || []);
        setPagination((prev) => ({ ...prev, total: res.data.data?.total || 0 }));
      }
    } catch (error) {
      console.error('Failed to fetch transfer records:', error);
      message.error('获取调拨单失败');
    } finally {
      setLoading(false);
    }
  };

  const handleView = async (record: InventoryTransfer) => {
    try {
      const res = await warehouseApi.get(`/inventory/transfer/${record.id}`);
      if (res.data) {
        setEditingRecord(res.data);
        setModalVisible(true);
      }
    } catch (error) {
      message.error('获取调拨单详情失败');
    }
  };

  const handleStart = async (id: number) => {
    try {
      await warehouseApi.put(`/inventory/transfer/${id}/start`);
      message.success('开始调拨成功');
      fetchData();
    } catch (error) {
      message.error('操作失败');
    }
  };

  const handleConfirmOut = async (id: number) => {
    try {
      await warehouseApi.put(`/inventory/transfer/${id}/confirm-out`);
      message.success('确认出库成功');
      fetchData();
    } catch (error) {
      message.error('操作失败');
    }
  };

  const handleConfirmIn = async (id: number) => {
    try {
      await warehouseApi.put(`/inventory/transfer/${id}/confirm-in`);
      message.success('确认入库成功');
      fetchData();
    } catch (error) {
      message.error('操作失败');
    }
  };

  const handleFinish = async (id: number) => {
    try {
      await warehouseApi.put(`/inventory/transfer/${id}/finish`);
      message.success('完成调拨成功');
      fetchData();
    } catch (error) {
      message.error('操作失败');
    }
  };

  const handleCancel = async (id: number) => {
    try {
      await warehouseApi.put(`/inventory/transfer/${id}/cancel`, null, { params: { reason: '用户取消' } });
      message.success('取消成功');
      fetchData();
    } catch (error) {
      message.error('取消失败');
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      await warehouseApi.post('/inventory/transfer', values);
      message.success('新增成功');
      setModalVisible(false);
      fetchData();
    } catch (error) {
      console.error('Failed to save:', error);
    }
  };

  const renderStatus = (status: number) => {
    const map: Record<number, { text: string; color: string }> = {
      0: { text: '待调拨', color: 'orange' },
      1: { text: '调拨中', color: 'blue' },
      2: { text: '已完成', color: 'green' },
      9: { text: '已取消', color: 'red' },
    };
    const s = map[status] || { text: '未知', color: 'default' };
    return <Tag color={s.color}>{s.text}</Tag>;
  };

  const columns = [
    { title: '调拨单号', dataIndex: 'transferNo', key: 'transferNo', width: 150 },
    { title: '源仓库', dataIndex: 'fromWarehouseName', key: 'fromWarehouseName', width: 120 },
    { title: '目标仓库', dataIndex: 'toWarehouseName', key: 'toWarehouseName', width: 120 },
    { title: '调拨日期', dataIndex: 'transferDate', key: 'transferDate', width: 120 },
    { title: '调拨数量', dataIndex: 'totalQuantity', key: 'totalQuantity', width: 100 },
    { title: '调拨金额', dataIndex: 'totalAmount', key: 'totalAmount', width: 120, render: (v: number) => `¥${v?.toFixed(2) || '0.00'}` },
    { title: '状态', dataIndex: 'status', key: 'status', width: 100, render: renderStatus },
    {
      title: '操作',
      key: 'action',
      width: 300,
      render: (_: any, record: InventoryTransfer) => (
        <Space>
          <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => handleView(record)}>查看</Button>
          {record.status === 0 && (
            <Button type="link" size="small" onClick={() => handleStart(record.id)}>开始调拨</Button>
          )}
          {record.status === 1 && (
            <>
              <Button type="link" size="small" onClick={() => handleConfirmOut(record.id)}>确认出库</Button>
              <Button type="link" size="small" onClick={() => handleConfirmIn(record.id)}>确认入库</Button>
              <Button type="link" size="small" onClick={() => handleFinish(record.id)}>完成</Button>
            </>
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
      <h2 style={{ marginBottom: 16 }}>调拨单</h2>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'flex-end' }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => { form.resetFields(); setEditingRecord(null); setModalVisible(true); }}>新建调拨</Button>
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
        scroll={{ x: 1200 }}
      />

      <Modal
        title={editingRecord ? '调拨单详情' : '新建调拨'}
        open={modalVisible}
        onOk={editingRecord ? () => setModalVisible(false) : handleModalOk}
        onCancel={() => setModalVisible(false)}
        width={600}
        footer={editingRecord ? [<Button key="close" onClick={() => setModalVisible(false)}>关闭</Button>] : undefined}
      >
        {editingRecord ? (
          <Descriptions column={2} size="small">
            <Descriptions.Item label="调拨单号">{editingRecord.transferNo}</Descriptions.Item>
            <Descriptions.Item label="状态">{renderStatus(editingRecord.status)}</Descriptions.Item>
            <Descriptions.Item label="源仓库">{editingRecord.fromWarehouseName}</Descriptions.Item>
            <Descriptions.Item label="目标仓库">{editingRecord.toWarehouseName}</Descriptions.Item>
            <Descriptions.Item label="调拨日期">{editingRecord.transferDate}</Descriptions.Item>
            <Descriptions.Item label="调拨数量">{editingRecord.totalQuantity}</Descriptions.Item>
            <Descriptions.Item label="调拨金额">¥{editingRecord.totalAmount?.toFixed(2)}</Descriptions.Item>
          </Descriptions>
        ) : (
          <Form form={form} layout="vertical">
            <Form.Item name="fromWarehouseId" label="源仓库" rules={[{ required: true }]}>
              <Select placeholder="请选择源仓库">
                {warehouseList.map((w) => (
                  <Select.Option key={w.id} value={w.id}>{w.name}</Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="toWarehouseId" label="目标仓库" rules={[{ required: true }]}>
              <Select placeholder="请选择目标仓库">
                {warehouseList.map((w) => (
                  <Select.Option key={w.id} value={w.id}>{w.name}</Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="transferDate" label="调拨日期">
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

export default InventoryTransferPage;