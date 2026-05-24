import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Input,
  Select,
  message,
  Modal,
  InputNumber,
  Space,
  Tag,
  Form,
} from 'antd';
import { SearchOutlined, LockOutlined, UnlockOutlined } from '@ant-design/icons';
import { inventoryApi, warehouseApi } from '../../api';

interface Inventory {
  id: number;
  productId: number;
  productName: string;
  productCode: string;
  warehouseId: number;
  warehouseName: string;
  locationId?: number;
  locationName?: string;
  quantity: number;
  frozenQuantity: number;
  cost: number;
  batchNo?: string;
}

const InventoryAccountPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Inventory[]>([]);
  const [pagination, setPagination] = useState({ current: 1, size: 10, total: 0 });
  const [productId, setProductId] = useState<number | null>(null);
  const [warehouseId, setWarehouseId] = useState<number | null>(null);
  const [warehouseList, setWarehouseList] = useState<{ id: number; name: string }[]>([]);
  const [freezeModalVisible, setFreezeModalVisible] = useState(false);
  const [selectedInventory, setSelectedInventory] = useState<Inventory | null>(null);
  const [freezeQuantity, setFreezeQuantity] = useState<number>(0);
  const [actionType, setActionType] = useState<'freeze' | 'unfreeze'>('freeze');

  useEffect(() => {
    fetchWarehouses();
  }, []);

  useEffect(() => {
    fetchData();
  }, [pagination.current, pagination.size, productId, warehouseId]);

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
      const params: Record<string, any> = {
        page: pagination.current,
        pageSize: pagination.size,
      };
      if (productId) {
        params.productId = productId;
      }
      if (warehouseId) {
        params.warehouseId = warehouseId;
      }
      const res = await inventoryApi.get('/inventory/page', { params });
      if (res.data.code === 200) {
        setData(res.data.data?.records || []);
        setPagination((prev) => ({ ...prev, total: res.data.data?.total || 0 }));
      }
    } catch (error) {
      console.error('Failed to fetch inventory:', error);
      message.error('获取库存台账失败');
    } finally {
      setLoading(false);
    }
  };

  const handleFreeze = (record: Inventory) => {
    setSelectedInventory(record);
    setActionType('freeze');
    setFreezeQuantity(record.quantity - record.frozenQuantity);
    setFreezeModalVisible(true);
  };

  const handleUnfreeze = (record: Inventory) => {
    setSelectedInventory(record);
    setActionType('unfreeze');
    setFreezeQuantity(record.frozenQuantity);
    setFreezeModalVisible(true);
  };

  const handleFreezeOk = async () => {
    if (!selectedInventory || freezeQuantity <= 0) return;
    try {
      const params = { quantity: freezeQuantity };
      if (actionType === 'freeze') {
        await inventoryApi.post(`/inventory/${selectedInventory.id}/freeze`, null, { params });
        message.success('冻结成功');
      } else {
        await inventoryApi.post(`/inventory/${selectedInventory.id}/unfreeze`, null, { params });
        message.success('解冻成功');
      }
      setFreezeModalVisible(false);
      fetchData();
    } catch (error) {
      message.error('操作失败');
    }
  };

  const columns = [
    { title: '商品编码', dataIndex: 'productCode', key: 'productCode', width: 120 },
    { title: '商品名称', dataIndex: 'productName', key: 'productName', width: 180 },
    { title: '仓库', dataIndex: 'warehouseName', key: 'warehouseName', width: 120 },
    { title: '库位', dataIndex: 'locationName', key: 'locationName', width: 100 },
    { title: '批次号', dataIndex: 'batchNo', key: 'batchNo', width: 120 },
    { title: '库存数量', dataIndex: 'quantity', key: 'quantity', width: 100 },
    { title: '冻结数量', dataIndex: 'frozenQuantity', key: 'frozenQuantity', width: 100, render: (v: number) => v > 0 ? <Tag color="orange">{v}</Tag> : v },
    { title: '可用数量', key: 'available', width: 100, render: (_: any, record: Inventory) => record.quantity - record.frozenQuantity },
    { title: '成本单价', dataIndex: 'cost', key: 'cost', width: 100, render: (v: number) => v ? `¥${v.toFixed(2)}` : '-' },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_: any, record: Inventory) => (
        <Space>
          <Button type="link" size="small" icon={<LockOutlined />} onClick={() => handleFreeze(record)}>冻结</Button>
          {record.frozenQuantity > 0 && (
            <Button type="link" size="small" icon={<UnlockOutlined />} onClick={() => handleUnfreeze(record)}>解冻</Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h2 style={{ marginBottom: 16 }}>库存台账</h2>
      <div style={{ marginBottom: 16, display: 'flex', gap: 16 }}>
        <Input
          placeholder="商品ID"
          allowClear
          style={{ width: 150 }}
          onChange={(e) => setProductId(e.target.value ? Number(e.target.value) : null)}
        />
        <Select
          placeholder="选择仓库"
          allowClear
          style={{ width: 200 }}
          onChange={(v) => setWarehouseId(v || null)}
        >
          {warehouseList.map((w) => (
            <Select.Option key={w.id} value={w.id}>{w.name}</Select.Option>
          ))}
        </Select>
        <Button type="primary" icon={<SearchOutlined />} onClick={fetchData}>查询</Button>
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
        title={actionType === 'freeze' ? '冻结库存' : '解冻库存'}
        open={freezeModalVisible}
        onOk={handleFreezeOk}
        onCancel={() => setFreezeModalVisible(false)}
        width={400}
      >
        <Space direction="vertical" style={{ width: '100%' }}>
          <div>商品：{selectedInventory?.productName}</div>
          <div>仓库：{selectedInventory?.warehouseName}</div>
          <div>当前库存：{selectedInventory?.quantity}，已冻结：{selectedInventory?.frozenQuantity}</div>
          <Form.Item label={actionType === 'freeze' ? '冻结数量' : '解冻数量'}>
            <InputNumber
              min={0}
              max={actionType === 'freeze' ? selectedInventory?.quantity! - selectedInventory?.frozenQuantity! : selectedInventory?.frozenQuantity!}
              value={freezeQuantity}
              onChange={(v) => setFreezeQuantity(v || 0)}
              style={{ width: '100%' }}
            />
          </Form.Item>
        </Space>
      </Modal>
    </div>
  );
};

export default InventoryAccountPage;