import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Input,
  Space,
  Modal,
  Form,
  InputNumber,
  Select,
  message,
  Popconfirm,
  Tabs,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { warehouseApi, locationApi } from '../../api';
import { useAuthStore } from '../../stores/authStore';

// ============ 仓库管理 ============
interface Warehouse {
  id?: number;
  code: string;
  name: string;
  type?: number;
  address?: string;
  manager?: string;
  phone?: string;
  locationCount?: number;
  status: number;
  remark?: string;
}

interface WarehousePageResult {
  current: number;
  size: number;
  total: number;
  pages: number;
  records: Warehouse[];
}

// ============ 库位管理 ============
interface Location {
  id?: number;
  code: string;
  name: string;
  warehouseId?: number;
  warehouseName?: string;
  shelfNo?: string;
  row?: number;
  col?: number;
  level?: number;
  type?: number;
  status: number;
  remark?: string;
}

interface LocationPageResult {
  current: number;
  size: number;
  total: number;
  pages: number;
  records: Location[];
}

const WarehousePage: React.FC<{ defaultTab?: string }> = ({ defaultTab }) => {
  const [activeTab, setActiveTab] = useState('warehouse');
  const { permissions } = useAuthStore();

  // Handle defaultTab prop from router
  useEffect(() => {
    if (defaultTab === 'location') {
      setActiveTab('location');
    }
  }, [defaultTab]);

  const tabPermissionMap: Record<string, string[]> = {
    warehouse: ['warehouse:warehouse', 'warehouse:warehouse:list', 'warehouse:warehouse:read'],
    location: ['warehouse:warehouse:location', 'warehouse:warehouse:location:list', 'warehouse:warehouse:location:read'],
  };

  const hasTabPermission = (tab: string): boolean => {
    const requiredPerms = tabPermissionMap[tab] || [];
    if (requiredPerms.length === 0) return true;
    return requiredPerms.some(perm => {
      if (permissions.includes(perm)) return true;
      if (permissions.some(p => p.startsWith(perm + ':') || p === perm)) return true;
      return false;
    });
  };

  const visibleTabs = [
    { key: 'warehouse', label: '仓库管理' },
    { key: 'location', label: '库位管理' },
  ].filter(tab => hasTabPermission(tab.key));

  // 如果当前 tab 不可见，切换到可见的第一个 tab
  useEffect(() => {
    if (!hasTabPermission(activeTab) && visibleTabs.length > 0) {
      setActiveTab(visibleTabs[0].key);
    }
  }, [activeTab, visibleTabs]);
  const [warehouseModalVisible, setWarehouseModalVisible] = useState(false);
  const [locationModalVisible, setLocationModalVisible] = useState(false);
  const [editingWarehouse, setEditingWarehouse] = useState<Warehouse | null>(null);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);
  const [form] = Form.useForm();
  const [locationForm] = Form.useForm();

  // 仓库状态
  const [warehouseLoading, setWarehouseLoading] = useState(false);
  const [warehouseData, setWarehouseData] = useState<Warehouse[]>([]);
  const [warehousePagination, setWarehousePagination] = useState({ current: 1, size: 10, total: 0 });
  const [warehouseKeyword, setWarehouseKeyword] = useState('');

  // 库位状态
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationData, setLocationData] = useState<Location[]>([]);
  const [locationPagination, setLocationPagination] = useState({ current: 1, size: 10, total: 0 });
  const [selectedWarehouseId, setSelectedWarehouseId] = useState<number | null>(null);
  const [warehouseList, setWarehouseList] = useState<Warehouse[]>([]);

  useEffect(() => {
    if (activeTab === 'warehouse') {
      fetchWarehouses();
      fetchWarehouseList();
    } else {
      fetchLocations();
    }
  }, [activeTab, warehousePagination.current, warehousePagination.size, warehouseKeyword, locationPagination.current, locationPagination.size, selectedWarehouseId]);

  // 获取仓库列表
  const fetchWarehouses = async () => {
    setWarehouseLoading(true);
    try {
      const params: Record<string, any> = {
        current: warehousePagination.current,
        size: warehousePagination.size,
      };
      if (warehouseKeyword) {
        params.keyword = warehouseKeyword;
      }
      const res = await warehouseApi.get('/warehouse/page', { params });
      if (res.data.code === 200) {
        const pageResult: WarehousePageResult = res.data.data;
        setWarehouseData(pageResult.records);
        setWarehousePagination((prev) => ({ ...prev, total: pageResult.total }));
      }
    } catch (error) {
      console.error('Failed to fetch warehouses:', error);
      message.error('获取仓库列表失败');
    } finally {
      setWarehouseLoading(false);
    }
  };

  // 获取仓库下拉列表
  const fetchWarehouseList = async () => {
    try {
      const res = await warehouseApi.get('/warehouse/list');
      if (res.data.code === 200) {
        setWarehouseList(res.data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch warehouse list:', error);
    }
  };

  // 获取库位列表
  const fetchLocations = async () => {
    setLocationLoading(true);
    try {
      const params: Record<string, any> = {
        current: locationPagination.current,
        size: locationPagination.size,
      };
      if (selectedWarehouseId) {
        params.warehouseId = selectedWarehouseId;
      }
      const res = await locationApi.get('/location/page', { params });
      if (res.data.code === 200) {
        const pageResult: LocationPageResult = res.data.data;
        setLocationData(pageResult.records);
        setLocationPagination((prev) => ({ ...prev, total: pageResult.total }));
      }
    } catch (error) {
      console.error('Failed to fetch locations:', error);
      message.error('获取库位列表失败');
    } finally {
      setLocationLoading(false);
    }
  };

  // 仓库操作
  const handleWarehouseSearch = (value: string) => {
    setWarehouseKeyword(value);
    setWarehousePagination((prev) => ({ ...prev, current: 1 }));
  };

  const handleAddWarehouse = () => {
    setEditingWarehouse(null);
    form.resetFields();
    setWarehouseModalVisible(true);
  };

  const handleEditWarehouse = (record: Warehouse) => {
    setEditingWarehouse(record);
    form.setFieldsValue(record);
    setWarehouseModalVisible(true);
  };

  const handleDeleteWarehouse = async (id: number) => {
    try {
      const res = await warehouseApi.delete(`/warehouse/${id}`);
      if (res.data.code === 200) {
        message.success('删除成功');
        fetchWarehouses();
      } else {
        message.error(res.data.message || '删除失败');
      }
    } catch (error) {
      console.error('Failed to delete warehouse:', error);
      message.error('删除失败');
    }
  };

  const handleWarehouseModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingWarehouse?.id) {
        const res = await warehouseApi.put('/warehouse', { ...values, id: editingWarehouse.id });
        if (res.data.code === 200) {
          message.success('修改成功');
          setWarehouseModalVisible(false);
          fetchWarehouses();
        } else {
          message.error(res.data.message || '修改失败');
        }
      } else {
        const res = await warehouseApi.post('/warehouse', values);
        if (res.data.code === 200) {
          message.success('新增成功');
          setWarehouseModalVisible(false);
          fetchWarehouses();
        } else {
          message.error(res.data.message || '新增失败');
        }
      }
    } catch (error) {
      console.error('Failed to save warehouse:', error);
    }
  };

  // 库位操作
  const handleLocationWarehouseChange = (value: number | null) => {
    setSelectedWarehouseId(value);
    setLocationPagination((prev) => ({ ...prev, current: 1 }));
  };

  const handleAddLocation = () => {
    setEditingLocation(null);
    locationForm.resetFields();
    setLocationModalVisible(true);
  };

  const handleEditLocation = (record: Location) => {
    setEditingLocation(record);
    locationForm.setFieldsValue(record);
    setLocationModalVisible(true);
  };

  const handleDeleteLocation = async (id: number) => {
    try {
      const res = await locationApi.delete(`/location/${id}`);
      if (res.data.code === 200) {
        message.success('删除成功');
        fetchLocations();
      } else {
        message.error(res.data.message || '删除失败');
      }
    } catch (error) {
      console.error('Failed to delete location:', error);
      message.error('删除失败');
    }
  };

  const handleLocationModalOk = async () => {
    try {
      const values = await locationForm.validateFields();
      if (editingLocation?.id) {
        const res = await locationApi.put('/location', { ...values, id: editingLocation.id });
        if (res.data.code === 200) {
          message.success('修改成功');
          setLocationModalVisible(false);
          fetchLocations();
        } else {
          message.error(res.data.message || '修改失败');
        }
      } else {
        const res = await locationApi.post('/location', values);
        if (res.data.code === 200) {
          message.success('新增成功');
          setLocationModalVisible(false);
          fetchLocations();
        } else {
          message.error(res.data.message || '新增失败');
        }
      }
    } catch (error) {
      console.error('Failed to save location:', error);
    }
  };

  // 仓库表格列
  const warehouseColumns = [
    {
      title: '仓库编码',
      dataIndex: 'code',
      key: 'code',
      width: 120,
    },
    {
      title: '仓库名称',
      dataIndex: 'name',
      key: 'name',
      width: 150,
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (type: number) => {
        const map: Record<number, string> = { 1: '主仓', 2: '分仓', 3: '虚拟仓' };
        return map[type] || '-';
      },
    },
    {
      title: '地址',
      dataIndex: 'address',
      key: 'address',
      ellipsis: true,
    },
    {
      title: '负责人',
      dataIndex: 'manager',
      key: 'manager',
      width: 100,
    },
    {
      title: '联系电话',
      dataIndex: 'phone',
      key: 'phone',
      width: 130,
    },
    {
      title: '库位数',
      dataIndex: 'locationCount',
      key: 'locationCount',
      width: 80,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (status: number) => (status === 0 ? '启用' : '停用'),
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_: any, record: Warehouse) => (
        <Space>
          <Button type="link" icon={<EditOutlined />} onClick={() => handleEditWarehouse(record)}>
            编辑
          </Button>
          <Popconfirm
            title="确定删除此仓库？"
            onConfirm={() => record.id && handleDeleteWarehouse(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // 库位列
  const locationColumns = [
    {
      title: '库位编码',
      dataIndex: 'code',
      key: 'code',
      width: 100,
    },
    {
      title: '库位名称',
      dataIndex: 'name',
      key: 'name',
      width: 120,
    },
    {
      title: '所属仓库',
      dataIndex: 'warehouseName',
      key: 'warehouseName',
      width: 120,
    },
    {
      title: '货架号',
      dataIndex: 'shelfNo',
      key: 'shelfNo',
      width: 100,
    },
    {
      title: '位置(行-列-层)',
      key: 'position',
      width: 120,
      render: (_: any, record: Location) => {
        const { row, col, level } = record;
        if (row !== undefined && col !== undefined && level !== undefined) {
          return `${row}-${col}-${level}`;
        }
        return '-';
      },
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (type: number) => {
        const map: Record<number, string> = { 1: '存储', 2: '拣货', 3: '暂存' };
        return map[type] || '-';
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (status: number) => {
        const map: Record<number, string> = { 0: '启用', 1: '停用', 2: '冻结' };
        return map[status] || '-';
      },
    },
    {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
      ellipsis: true,
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_: any, record: Location) => (
        <Space>
          <Button type="link" icon={<EditOutlined />} onClick={() => handleEditLocation(record)}>
            编辑
          </Button>
          <Popconfirm
            title="确定删除此库位？"
            onConfirm={() => record.id && handleDeleteLocation(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const tabItems = visibleTabs.map(tab => {
    if (tab.key === 'warehouse') {
      return {
        key: 'warehouse',
        label: '仓库管理',
        children: (
          <div>
            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
              <Space>
                <Input.Search
                  placeholder="搜索仓库名称"
                  allowClear
                  onSearch={handleWarehouseSearch}
                  style={{ width: 200 }}
                  prefix={<SearchOutlined />}
                />
              </Space>
              <Button type="primary" icon={<PlusOutlined />} onClick={handleAddWarehouse}>
                新增仓库
              </Button>
            </div>
            <Table
              columns={warehouseColumns}
              dataSource={warehouseData}
              rowKey="id"
              loading={warehouseLoading}
              pagination={{
                current: warehousePagination.current,
                pageSize: warehousePagination.size,
                total: warehousePagination.total,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total) => `共 ${total} 条`,
                onChange: (current, size) => setWarehousePagination({ current, size, total: warehousePagination.total }),
              }}
              scroll={{ x: 1200 }}
            />
          </div>
        ),
      };
    }
    if (tab.key === 'location') {
      return {
        key: 'location',
        label: '库位管理',
        children: (
          <div>
            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
              <Space>
                <span>仓库筛选：</span>
                <Select
                  placeholder="选择仓库"
                  allowClear
                  style={{ width: 200 }}
                  onChange={handleLocationWarehouseChange}
                  value={selectedWarehouseId}
                >
                  {warehouseList.map((w) => (
                    <Select.Option key={w.id} value={w.id!}>
                      {w.name}
                    </Select.Option>
                  ))}
                </Select>
              </Space>
              <Button type="primary" icon={<PlusOutlined />} onClick={handleAddLocation}>
                新增库位
              </Button>
            </div>
            <Table
              columns={locationColumns}
              dataSource={locationData}
              rowKey="id"
              loading={locationLoading}
              pagination={{
                current: locationPagination.current,
                pageSize: locationPagination.size,
                total: locationPagination.total,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total) => `共 ${total} 条`,
                onChange: (current, size) => setLocationPagination({ current, size, total: locationPagination.total }),
              }}
              scroll={{ x: 1200 }}
            />
          </div>
        ),
      };
    }
    return null;
  }).filter(Boolean) as any[];

  return (
    <div>
      <h2 style={{ marginBottom: 16 }}>仓库管理</h2>
      <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabItems} />

      {/* 仓库弹窗 */}
      <Modal
        title={editingWarehouse ? '编辑仓库' : '新增仓库'}
        open={warehouseModalVisible}
        onOk={handleWarehouseModalOk}
        onCancel={() => setWarehouseModalVisible(false)}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Space style={{ width: '100%' }} size="large">
            <Form.Item
              name="code"
              label="仓库编码"
              rules={[{ required: true, message: '请输入仓库编码' }]}
              style={{ flex: 1 }}
            >
              <Input placeholder="请输入仓库编码" />
            </Form.Item>
            <Form.Item
              name="name"
              label="仓库名称"
              rules={[{ required: true, message: '请输入仓库名称' }]}
              style={{ flex: 1 }}
            >
              <Input placeholder="请输入仓库名称" />
            </Form.Item>
          </Space>
          <Space style={{ width: '100%' }} size="large">
            <Form.Item name="type" label="仓库类型" initialValue={1} style={{ flex: 1 }}>
              <Select>
                <Select.Option value={1}>主仓</Select.Option>
                <Select.Option value={2}>分仓</Select.Option>
                <Select.Option value={3}>虚拟仓</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item name="status" label="状态" initialValue={0} style={{ flex: 1 }}>
              <Select>
                <Select.Option value={0}>启用</Select.Option>
                <Select.Option value={1}>停用</Select.Option>
              </Select>
            </Form.Item>
          </Space>
          <Form.Item name="address" label="地址">
            <Input placeholder="请输入地址" />
          </Form.Item>
          <Space style={{ width: '100%' }} size="large">
            <Form.Item name="manager" label="负责人" style={{ flex: 1 }}>
              <Input placeholder="请输入负责人" />
            </Form.Item>
            <Form.Item name="phone" label="联系电话" style={{ flex: 1 }}>
              <Input placeholder="请输入联系电话" />
            </Form.Item>
          </Space>
          <Form.Item name="remark" label="备注">
            <Input.TextArea rows={2} placeholder="请输入备注" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 库位弹窗 */}
      <Modal
        title={editingLocation ? '编辑库位' : '新增库位'}
        open={locationModalVisible}
        onOk={handleLocationModalOk}
        onCancel={() => setLocationModalVisible(false)}
        width={600}
      >
        <Form form={locationForm} layout="vertical">
          <Space style={{ width: '100%' }} size="large">
            <Form.Item
              name="warehouseId"
              label="所属仓库"
              rules={[{ required: true, message: '请选择仓库' }]}
              style={{ flex: 1 }}
            >
              <Select placeholder="请选择仓库">
                {warehouseList.map((w) => (
                  <Select.Option key={w.id} value={w.id!}>
                    {w.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name="code"
              label="库位编码"
              rules={[{ required: true, message: '请输入库位编码' }]}
              style={{ flex: 1 }}
            >
              <Input placeholder="请输入库位编码" />
            </Form.Item>
          </Space>
          <Space style={{ width: '100%' }} size="large">
            <Form.Item
              name="name"
              label="库位名称"
              rules={[{ required: true, message: '请输入库位名称' }]}
              style={{ flex: 1 }}
            >
              <Input placeholder="请输入库位名称" />
            </Form.Item>
            <Form.Item name="shelfNo" label="货架号" style={{ flex: 1 }}>
              <Input placeholder="请输入货架号" />
            </Form.Item>
          </Space>
          <Space style={{ width: '100%' }} size="large">
            <Form.Item name="row" label="行" style={{ flex: 1 }}>
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name="col" label="列" style={{ flex: 1 }}>
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name="level" label="层" style={{ flex: 1 }}>
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
          </Space>
          <Space style={{ width: '100%' }} size="large">
            <Form.Item name="type" label="库位类型" initialValue={1} style={{ flex: 1 }}>
              <Select>
                <Select.Option value={1}>存储</Select.Option>
                <Select.Option value={2}>拣货</Select.Option>
                <Select.Option value={3}>暂存</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item name="status" label="状态" initialValue={0} style={{ flex: 1 }}>
              <Select>
                <Select.Option value={0}>启用</Select.Option>
                <Select.Option value={1}>停用</Select.Option>
                <Select.Option value={2}>冻结</Select.Option>
              </Select>
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

export default WarehousePage;