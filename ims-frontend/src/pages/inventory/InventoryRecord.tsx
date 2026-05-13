import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Input,
  Space,
  Select,
  message,
} from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { inventoryApi, warehouseApi } from '../../api';

interface InventoryRecord {
  id: number;
  productId: number;
  productName: string;
  warehouseId: number;
  warehouseName: string;
  locationId?: number;
  locationName?: string;
  changeType: string;
  changeQuantity: number;
  beforeQuantity: number;
  afterQuantity: number;
  orderType?: string;
  orderId?: number;
  orderNo?: string;
  batchNo?: string;
  remark?: string;
  createTime?: string;
}

const InventoryRecordPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<InventoryRecord[]>([]);
  const [pagination, setPagination] = useState({ current: 1, size: 10, total: 0 });
  const [productId, setProductId] = useState<number | null>(null);
  const [warehouseId, setWarehouseId] = useState<number | null>(null);
  const [changeType, setChangeType] = useState<string | null>(null);
  const [warehouseList, setWarehouseList] = useState<{ id: number; name: string }[]>([]);

  useEffect(() => {
    fetchWarehouses();
  }, []);

  useEffect(() => {
    fetchData();
  }, [pagination.current, pagination.size, productId, warehouseId, changeType]);

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
      if (changeType) {
        params.changeType = changeType;
      }
      const res = await inventoryApi.get('/inventory/record/page', { params });
      if (res.data.code === 200) {
        setData(res.data.data?.records || []);
        setPagination((prev) => ({ ...prev, total: res.data.data?.total || 0 }));
      }
    } catch (error) {
      console.error('Failed to fetch records:', error);
      message.error('获取库存变动记录失败');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { title: '商品名称', dataIndex: 'productName', key: 'productName', width: 150 },
    { title: '仓库', dataIndex: 'warehouseName', key: 'warehouseName', width: 120 },
    { title: '库位', dataIndex: 'locationName', key: 'locationName', width: 100 },
    { title: '变动类型', dataIndex: 'changeType', key: 'changeType', width: 100, render: (v: string) => {
      const map: Record<string, string> = {
        'IN': '入库',
        'OUT': '出库',
        'TRANSFER_IN': '调拨入库',
        'TRANSFER_OUT': '调拨出库',
        'CHECK': '盘点调整',
        'FREEZE': '冻结',
        'UNFREEZE': '解冻',
      };
      return map[v] || v;
    }},
    { title: '变动数量', dataIndex: 'changeQuantity', key: 'changeQuantity', width: 100, render: (v: number) => v > 0 ? `+${v}` : v.toString() },
    { title: '变动前', dataIndex: 'beforeQuantity', key: 'beforeQuantity', width: 80 },
    { title: '变动后', dataIndex: 'afterQuantity', key: 'afterQuantity', width: 80 },
    { title: '单据类型', dataIndex: 'orderType', key: 'orderType', width: 120 },
    { title: '单据号', dataIndex: 'orderNo', key: 'orderNo', width: 150 },
    { title: '批次号', dataIndex: 'batchNo', key: 'batchNo', width: 120 },
    { title: '变动时间', dataIndex: 'createTime', key: 'createTime', width: 180 },
  ];

  return (
    <div>
      <h2 style={{ marginBottom: 16 }}>库存变动记录</h2>
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
        <Select
          placeholder="变动类型"
          allowClear
          style={{ width: 150 }}
          onChange={(v) => setChangeType(v || null)}
        >
          <Select.Option value="IN">入库</Select.Option>
          <Select.Option value="OUT">出库</Select.Option>
          <Select.Option value="TRANSFER_IN">调拨入库</Select.Option>
          <Select.Option value="TRANSFER_OUT">调拨出库</Select.Option>
          <Select.Option value="CHECK">盘点调整</Select.Option>
          <Select.Option value="FREEZE">冻结</Select.Option>
          <Select.Option value="UNFREEZE">解冻</Select.Option>
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
        scroll={{ x: 1300 }}
      />
    </div>
  );
};

export default InventoryRecordPage;