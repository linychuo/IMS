import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Input,
  Space,
  Select,
  Modal,
  Form,
  DatePicker,
  message,
  Tabs,
  Tag,
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import { warehouseApi } from '../../api';

const { TabPane } = Tabs;

// ============ 库存台账 ============
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

// ============ 入库单 ============
interface InventoryIn {
  id: number;
  inNo: string;
  inType: number;
  warehouseId: number;
  warehouseName: string;
  totalAmount: number;
  status: number;
  inDate: string;
  remark?: string;
}

// ============ 出库单 ============
interface InventoryOut {
  id: number;
  outNo: string;
  outType: number;
  warehouseId: number;
  warehouseName: string;
  totalAmount: number;
  status: number;
  outDate: string;
  remark?: string;
}

// ============ 调拨单 ============
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

// ============ 盘点单 ============
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

// ============ 库存变动记录 ============
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

const InventoryPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('account');

  // 通用状态
  const [warehouseList, setWarehouseList] = useState<{ id: number; name: string }[]>([]);

  // 库存台账状态
  const [accountLoading, setAccountLoading] = useState(false);
  const [accountData, setAccountData] = useState<Inventory[]>([]);
  const [accountPagination, setAccountPagination] = useState({ current: 1, size: 10, total: 0 });
  const [accountProductId, setAccountProductId] = useState<number | null>(null);
  const [accountWarehouseId, setAccountWarehouseId] = useState<number | null>(null);

  // 入库单状态
  const [inLoading, setInLoading] = useState(false);
  const [inData, setInData] = useState<InventoryIn[]>([]);
  const [inPagination, setInPagination] = useState({ current: 1, size: 10, total: 0 });

  // 出库单状态
  const [outLoading, setOutLoading] = useState(false);
  const [outData, setOutData] = useState<InventoryOut[]>([]);
  const [outPagination, setOutPagination] = useState({ current: 1, size: 10, total: 0 });

  // 调拨单状态
  const [transferLoading, setTransferLoading] = useState(false);
  const [transferData, setTransferData] = useState<InventoryTransfer[]>([]);
  const [transferPagination, setTransferPagination] = useState({ current: 1, size: 10, total: 0 });

  // 盘点单状态
  const [checkLoading, setCheckLoading] = useState(false);
  const [checkData, setCheckData] = useState<InventoryCheck[]>([]);
  const [checkPagination, setCheckPagination] = useState({ current: 1, size: 10, total: 0 });

  // 库存变动记录状态
  const [recordLoading, setRecordLoading] = useState(false);
  const [recordData, setRecordData] = useState<InventoryRecord[]>([]);
  const [recordPagination, setRecordPagination] = useState({ current: 1, size: 10, total: 0 });
  const [recordProductId, setRecordProductId] = useState<number | null>(null);
  const [recordWarehouseId, setRecordWarehouseId] = useState<number | null>(null);
  const [recordChangeType, setRecordChangeType] = useState<string | null>(null);

  // 入库单弹窗状态
  const [inModalVisible, setInModalVisible] = useState(false);
  const [editingIn, setEditingIn] = useState<InventoryIn | null>(null);
  const [inForm] = Form.useForm();

  // 出库单弹窗状态
  const [outModalVisible, setOutModalVisible] = useState(false);
  const [editingOut, setEditingOut] = useState<InventoryOut | null>(null);
  const [outForm] = Form.useForm();

  // 调拨单弹窗状态
  const [transferModalVisible, setTransferModalVisible] = useState(false);
  const [editingTransfer, setEditingTransfer] = useState<InventoryTransfer | null>(null);
  const [transferForm] = Form.useForm();

  // 盘点单弹窗状态
  const [checkModalVisible, setCheckModalVisible] = useState(false);
  const [editingCheck, setEditingCheck] = useState<InventoryCheck | null>(null);
  const [checkForm] = Form.useForm();

  useEffect(() => {
    fetchWarehouses();
  }, []);

  useEffect(() => {
    if (activeTab === 'account') {
      fetchAccount();
    } else if (activeTab === 'in') {
      fetchIns();
    } else if (activeTab === 'out') {
      fetchOuts();
    } else if (activeTab === 'transfer') {
      fetchTransfers();
    } else if (activeTab === 'check') {
      fetchChecks();
    } else if (activeTab === 'record') {
      fetchRecords();
    }
  }, [activeTab, accountProductId, accountWarehouseId, recordProductId, recordWarehouseId, recordChangeType]);

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

  // ============ 库存台账 ============
  const fetchAccount = async () => {
    setAccountLoading(true);
    try {
      const params: Record<string, any> = {
        page: accountPagination.current,
        pageSize: accountPagination.size,
      };
      if (accountProductId) {
        params.productId = accountProductId;
      }
      if (accountWarehouseId) {
        params.warehouseId = accountWarehouseId;
      }
      const res = await warehouseApi.get('/inventory/page', { params });
      if (res.data.code === 200) {
        setAccountData(res.data.data?.records || []);
        setAccountPagination((prev) => ({ ...prev, total: res.data.data?.total || 0 }));
      }
    } catch (error) {
      console.error('Failed to fetch inventory:', error);
      message.error('获取库存台账失败');
    } finally {
      setAccountLoading(false);
    }
  };

  // ============ 入库单 ============
  const fetchIns = async () => {
    setInLoading(true);
    try {
      const res = await warehouseApi.get('/inventory/in/page', {
        params: { page: inPagination.current, pageSize: inPagination.size },
      });
      if (res.data.code === 200) {
        setInData(res.data.data?.records || []);
        setInPagination((prev) => ({ ...prev, total: res.data.data?.total || 0 }));
      }
    } catch (error) {
      console.error('Failed to fetch in records:', error);
      message.error('获取入库单失败');
    } finally {
      setInLoading(false);
    }
  };

  // ============ 出库单 ============
  const fetchOuts = async () => {
    setOutLoading(true);
    try {
      const res = await warehouseApi.get('/inventory/out/page', {
        params: { page: outPagination.current, pageSize: outPagination.size },
      });
      if (res.data.code === 200) {
        setOutData(res.data.data?.records || []);
        setOutPagination((prev) => ({ ...prev, total: res.data.data?.total || 0 }));
      }
    } catch (error) {
      console.error('Failed to fetch out records:', error);
      message.error('获取出库单失败');
    } finally {
      setOutLoading(false);
    }
  };

  // ============ 调拨单 ============
  const fetchTransfers = async () => {
    setTransferLoading(true);
    try {
      const res = await warehouseApi.get('/inventory/transfer/page', {
        params: { page: transferPagination.current, pageSize: transferPagination.size },
      });
      if (res.data.code === 200) {
        setTransferData(res.data.data?.records || []);
        setTransferPagination((prev) => ({ ...prev, total: res.data.data?.total || 0 }));
      }
    } catch (error) {
      console.error('Failed to fetch transfer records:', error);
      message.error('获取调拨单失败');
    } finally {
      setTransferLoading(false);
    }
  };

  // ============ 盘点单 ============
  const fetchChecks = async () => {
    setCheckLoading(true);
    try {
      const res = await warehouseApi.get('/inventory/check/page', {
        params: { page: checkPagination.current, pageSize: checkPagination.size },
      });
      if (res.data.code === 200) {
        setCheckData(res.data.data?.records || []);
        setCheckPagination((prev) => ({ ...prev, total: res.data.data?.total || 0 }));
      }
    } catch (error) {
      console.error('Failed to fetch check records:', error);
      message.error('获取盘点单失败');
    } finally {
      setCheckLoading(false);
    }
  };

  // ============ 状态渲染 ============
  const renderInStatus = (status: number) => {
    const map: Record<number, { text: string; color: string }> = {
      1: { text: '待审核', color: 'orange' },
      2: { text: '已审核', color: 'green' },
      3: { text: '已取消', color: 'red' },
    };
    const s = map[status] || { text: '未知', color: 'default' };
    return <Tag color={s.color}>{s.text}</Tag>;
  };

  const renderOutStatus = (status: number) => {
    const map: Record<number, { text: string; color: string }> = {
      1: { text: '待审核', color: 'orange' },
      2: { text: '已审核', color: 'green' },
      3: { text: '已取消', color: 'red' },
    };
    const s = map[status] || { text: '未知', color: 'default' };
    return <Tag color={s.color}>{s.text}</Tag>;
  };

  const renderTransferStatus = (status: number) => {
    const map: Record<number, { text: string; color: string }> = {
      0: { text: '待调拨', color: 'orange' },
      1: { text: '调拨中', color: 'blue' },
      2: { text: '已完成', color: 'green' },
      9: { text: '已取消', color: 'red' },
    };
    const s = map[status] || { text: '未知', color: 'default' };
    return <Tag color={s.color}>{s.text}</Tag>;
  };

  const renderCheckStatus = (status: number) => {
    const map: Record<number, { text: string; color: string }> = {
      0: { text: '待盘点', color: 'orange' },
      1: { text: '盘点中', color: 'blue' },
      2: { text: '已完成', color: 'green' },
      9: { text: '已取消', color: 'red' },
    };
    const s = map[status] || { text: '未知', color: 'default' };
    return <Tag color={s.color}>{s.text}</Tag>;
  };

  // ============ 审核/取消操作 ============
  const handleAuditIn = async (id: number) => {
    try {
      await warehouseApi.post(`/inventory/in/${id}/audit`);
      message.success('审核成功');
      fetchIns();
    } catch (error) {
      message.error('审核失败');
    }
  };

  const handleCancelIn = async (id: number) => {
    try {
      await warehouseApi.post(`/inventory/in/${id}/cancel`);
      message.success('取消成功');
      fetchIns();
    } catch (error) {
      message.error('取消失败');
    }
  };

  const handleAuditOut = async (id: number) => {
    try {
      await warehouseApi.post(`/inventory/out/${id}/audit`);
      message.success('审核成功');
      fetchOuts();
    } catch (error) {
      message.error('审核失败');
    }
  };

  const handleCancelOut = async (id: number) => {
    try {
      await warehouseApi.post(`/inventory/out/${id}/cancel`);
      message.success('取消成功');
      fetchOuts();
    } catch (error) {
      message.error('取消失败');
    }
  };

  const handleStartTransfer = async (id: number) => {
    try {
      await warehouseApi.put(`/inventory/transfer/${id}/start`);
      message.success('开始调拨成功');
      fetchTransfers();
    } catch (error) {
      message.error('操作失败');
    }
  };

  const handleConfirmOutTransfer = async (id: number) => {
    try {
      await warehouseApi.put(`/inventory/transfer/${id}/confirm-out`);
      message.success('确认出库成功');
      fetchTransfers();
    } catch (error) {
      message.error('操作失败');
    }
  };

  const handleConfirmInTransfer = async (id: number) => {
    try {
      await warehouseApi.put(`/inventory/transfer/${id}/confirm-in`);
      message.success('确认入库成功');
      fetchTransfers();
    } catch (error) {
      message.error('操作失败');
    }
  };

  const handleFinishTransfer = async (id: number) => {
    try {
      await warehouseApi.put(`/inventory/transfer/${id}/finish`);
      message.success('完成调拨成功');
      fetchTransfers();
    } catch (error) {
      message.error('操作失败');
    }
  };

  const handleCancelTransfer = async (id: number) => {
    try {
      await warehouseApi.put(`/inventory/transfer/${id}/cancel`, null, { params: { reason: '用户取消' } });
      message.success('取消成功');
      fetchTransfers();
    } catch (error) {
      message.error('取消失败');
    }
  };

  const handleStartCheck = async (id: number) => {
    try {
      await warehouseApi.put(`/inventory/check/${id}/start`);
      message.success('开始盘点成功');
      fetchChecks();
    } catch (error) {
      message.error('操作失败');
    }
  };

  const handleFinishCheck = async (id: number) => {
    try {
      await warehouseApi.put(`/inventory/check/${id}/finish`);
      message.success('完成盘点成功');
      fetchChecks();
    } catch (error) {
      message.error('操作失败');
    }
  };

  const handleCancelCheck = async (id: number) => {
    try {
      await warehouseApi.put(`/inventory/check/${id}/cancel`, null, { params: { reason: '用户取消' } });
      message.success('取消成功');
      fetchChecks();
    } catch (error) {
      message.error('取消失败');
    }
  };

  // ============ 新建/编辑入库 ============
  const handleAddIn = () => {
    setEditingIn(null);
    inForm.resetFields();
    setInModalVisible(true);
  };

  const handleViewIn = async (record: InventoryIn) => {
    try {
      const res = await warehouseApi.get(`/inventory/in/${record.id}`);
      if (res.data) {
        setEditingIn(res.data);
        inForm.setFieldsValue(res.data);
        setInModalVisible(true);
      }
    } catch (error) {
      message.error('获取入库单详情失败');
    }
  };

  const handleInModalOk = async () => {
    try {
      const values = await inForm.validateFields();
      if (editingIn?.id) {
        await warehouseApi.put(`/inventory/in/${editingIn.id}`, values);
        message.success('修改成功');
      } else {
        await warehouseApi.post('/inventory/in', values);
        message.success('新增成功');
      }
      setInModalVisible(false);
      fetchIns();
    } catch (error) {
      console.error('Failed to save in:', error);
    }
  };

  // ============ 新建/编辑出库 ============
  const handleAddOut = () => {
    setEditingOut(null);
    outForm.resetFields();
    setOutModalVisible(true);
  };

  const handleViewOut = async (record: InventoryOut) => {
    try {
      const res = await warehouseApi.get(`/inventory/out/${record.id}`);
      if (res.data) {
        setEditingOut(res.data);
        outForm.setFieldsValue(res.data);
        setOutModalVisible(true);
      }
    } catch (error) {
      message.error('获取出库单详情失败');
    }
  };

  const handleOutModalOk = async () => {
    try {
      const values = await outForm.validateFields();
      if (editingOut?.id) {
        await warehouseApi.put(`/inventory/out/${editingOut.id}`, values);
        message.success('修改成功');
      } else {
        await warehouseApi.post('/inventory/out', values);
        message.success('新增成功');
      }
      setOutModalVisible(false);
      fetchOuts();
    } catch (error) {
      console.error('Failed to save out:', error);
    }
  };

  // ============ 新建/编辑调拨 ============
  const handleAddTransfer = () => {
    setEditingTransfer(null);
    transferForm.resetFields();
    setTransferModalVisible(true);
  };

  const handleViewTransfer = async (record: InventoryTransfer) => {
    try {
      const res = await warehouseApi.get(`/inventory/transfer/${record.id}`);
      if (res.data) {
        setEditingTransfer(res.data);
        transferForm.setFieldsValue(res.data);
        setTransferModalVisible(true);
      }
    } catch (error) {
      message.error('获取调拨单详情失败');
    }
  };

  const handleTransferModalOk = async () => {
    try {
      const values = await transferForm.validateFields();
      if (editingTransfer?.id) {
        await warehouseApi.put(`/inventory/transfer/${editingTransfer.id}`, values);
        message.success('修改成功');
      } else {
        await warehouseApi.post('/inventory/transfer', values);
        message.success('新增成功');
      }
      setTransferModalVisible(false);
      fetchTransfers();
    } catch (error) {
      console.error('Failed to save transfer:', error);
    }
  };

  // ============ 新建/编辑盘点 ============
  const handleAddCheck = () => {
    setEditingCheck(null);
    checkForm.resetFields();
    setCheckModalVisible(true);
  };

  const handleViewCheck = async (record: InventoryCheck) => {
    try {
      const res = await warehouseApi.get(`/inventory/check/${record.id}`);
      if (res.data) {
        setEditingCheck(res.data);
        checkForm.setFieldsValue(res.data);
        setCheckModalVisible(true);
      }
    } catch (error) {
      message.error('获取盘点单详情失败');
    }
  };

  const handleCheckModalOk = async () => {
    try {
      const values = await checkForm.validateFields();
      if (editingCheck?.id) {
        await warehouseApi.put(`/inventory/check/${editingCheck.id}`, values);
        message.success('修改成功');
      } else {
        await warehouseApi.post('/inventory/check', values);
        message.success('新增成功');
      }
      setCheckModalVisible(false);
      fetchChecks();
    } catch (error) {
      console.error('Failed to save check:', error);
    }
  };

  // ============ 库存变动记录 ============
  const fetchRecords = async () => {
    setRecordLoading(true);
    try {
      const params: Record<string, any> = {
        page: recordPagination.current,
        pageSize: recordPagination.size,
      };
      if (recordProductId) {
        params.productId = recordProductId;
      }
      if (recordWarehouseId) {
        params.warehouseId = recordWarehouseId;
      }
      if (recordChangeType) {
        params.changeType = recordChangeType;
      }
      const res = await warehouseApi.get('/inventory/record/page', { params });
      if (res.data.code === 200) {
        setRecordData(res.data.data?.records || []);
        setRecordPagination((prev) => ({ ...prev, total: res.data.data?.total || 0 }));
      }
    } catch (error) {
      console.error('Failed to fetch records:', error);
      message.error('获取库存变动记录失败');
    } finally {
      setRecordLoading(false);
    }
  };

  // ============ 表格列定义 ============
  const accountColumns = [
    { title: '商品编码', dataIndex: 'productCode', key: 'productCode', width: 120 },
    { title: '商品名称', dataIndex: 'productName', key: 'productName', width: 180 },
    { title: '仓库', dataIndex: 'warehouseName', key: 'warehouseName', width: 120 },
    { title: '库位', dataIndex: 'locationName', key: 'locationName', width: 100 },
    { title: '批次号', dataIndex: 'batchNo', key: 'batchNo', width: 120 },
    { title: '库存数量', dataIndex: 'quantity', key: 'quantity', width: 100 },
    { title: '冻结数量', dataIndex: 'frozenQuantity', key: 'frozenQuantity', width: 100 },
    { title: '成本单价', dataIndex: 'cost', key: 'cost', width: 100, render: (v: number) => v ? `¥${v.toFixed(2)}` : '-' },
  ];

  const inColumns = [
    { title: '入库单号', dataIndex: 'inNo', key: 'inNo', width: 150 },
    { title: '入库类型', dataIndex: 'inType', key: 'inType', width: 100, render: (v: number) => {
      const map: Record<number, string> = { 1: '采购入库', 2: '退货入库', 3: '调拨入库' };
      return map[v] || '其他';
    }},
    { title: '仓库', dataIndex: 'warehouseName', key: 'warehouseName', width: 120 },
    { title: '入库日期', dataIndex: 'inDate', key: 'inDate', width: 180 },
    { title: '总金额', dataIndex: 'totalAmount', key: 'totalAmount', width: 120, render: (v: number) => `¥${v?.toFixed(2) || '0.00'}` },
    { title: '状态', dataIndex: 'status', key: 'status', width: 100, render: renderInStatus },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_: any, record: InventoryIn) => (
        <Space>
          <Button type="link" size="small" onClick={() => handleViewIn(record)}>查看</Button>
          {record.status === 1 && (
            <>
              <Button type="link" size="small" icon={<CheckCircleOutlined />} onClick={() => handleAuditIn(record.id)}>审核</Button>
              <Button type="link" size="small" danger icon={<CloseCircleOutlined />} onClick={() => handleCancelIn(record.id)}>取消</Button>
            </>
          )}
        </Space>
      ),
    },
  ];

  const outColumns = [
    { title: '出库单号', dataIndex: 'outNo', key: 'outNo', width: 150 },
    { title: '出库类型', dataIndex: 'outType', key: 'outType', width: 100, render: (v: number) => {
      const map: Record<number, string> = { 1: '销售出库', 2: '采购退货', 3: '调拨出库' };
      return map[v] || '其他';
    }},
    { title: '仓库', dataIndex: 'warehouseName', key: 'warehouseName', width: 120 },
    { title: '出库日期', dataIndex: 'outDate', key: 'outDate', width: 180 },
    { title: '总金额', dataIndex: 'totalAmount', key: 'totalAmount', width: 120, render: (v: number) => `¥${v?.toFixed(2) || '0.00'}` },
    { title: '状态', dataIndex: 'status', key: 'status', width: 100, render: renderOutStatus },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_: any, record: InventoryOut) => (
        <Space>
          <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => handleViewOut(record)}>查看</Button>
          {record.status === 1 && (
            <>
              <Button type="link" size="small" icon={<CheckCircleOutlined />} onClick={() => handleAuditOut(record.id)}>审核</Button>
              <Button type="link" size="small" danger icon={<CloseCircleOutlined />} onClick={() => handleCancelOut(record.id)}>取消</Button>
            </>
          )}
        </Space>
      ),
    },
  ];

  const transferColumns = [
    { title: '调拨单号', dataIndex: 'transferNo', key: 'transferNo', width: 150 },
    { title: '源仓库', dataIndex: 'fromWarehouseName', key: 'fromWarehouseName', width: 120 },
    { title: '目标仓库', dataIndex: 'toWarehouseName', key: 'toWarehouseName', width: 120 },
    { title: '调拨日期', dataIndex: 'transferDate', key: 'transferDate', width: 120 },
    { title: '调拨数量', dataIndex: 'totalQuantity', key: 'totalQuantity', width: 100 },
    { title: '调拨金额', dataIndex: 'totalAmount', key: 'totalAmount', width: 120, render: (v: number) => `¥${v?.toFixed(2) || '0.00'}` },
    { title: '状态', dataIndex: 'status', key: 'status', width: 100, render: renderTransferStatus },
    {
      title: '操作',
      key: 'action',
      width: 300,
      render: (_: any, record: InventoryTransfer) => (
        <Space>
          <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => handleViewTransfer(record)}>查看</Button>
          {record.status === 0 && (
            <Button type="link" size="small" onClick={() => handleStartTransfer(record.id)}>开始调拨</Button>
          )}
          {record.status === 1 && (
            <>
              <Button type="link" size="small" onClick={() => handleConfirmOutTransfer(record.id)}>确认出库</Button>
              <Button type="link" size="small" onClick={() => handleConfirmInTransfer(record.id)}>确认入库</Button>
              <Button type="link" size="small" onClick={() => handleFinishTransfer(record.id)}>完成</Button>
            </>
          )}
          {record.status < 2 && (
            <Button type="link" size="small" danger onClick={() => handleCancelTransfer(record.id)}>取消</Button>
          )}
        </Space>
      ),
    },
  ];

  const checkColumns = [
    { title: '盘点单号', dataIndex: 'checkNo', key: 'checkNo', width: 150 },
    { title: '盘点类型', dataIndex: 'checkType', key: 'checkType', width: 100, render: (v: string) => v === 'FULL' ? '全盘' : '抽盘' },
    { title: '仓库', dataIndex: 'warehouseName', key: 'warehouseName', width: 120 },
    { title: '盘点日期', dataIndex: 'checkDate', key: 'checkDate', width: 120 },
    { title: '盘点人', dataIndex: 'checkerName', key: 'checkerName', width: 100 },
    { title: '状态', dataIndex: 'status', key: 'status', width: 100, render: renderCheckStatus },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_: any, record: InventoryCheck) => (
        <Space>
          <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => handleViewCheck(record)}>查看</Button>
          {record.status === 0 && (
            <Button type="link" size="small" onClick={() => handleStartCheck(record.id)}>开始盘点</Button>
          )}
          {record.status === 1 && (
            <Button type="link" size="small" onClick={() => handleFinishCheck(record.id)}>完成盘点</Button>
          )}
          {record.status < 2 && (
            <Button type="link" size="small" danger onClick={() => handleCancelCheck(record.id)}>取消</Button>
          )}
        </Space>
      ),
    },
  ];

  // ============ 库存变动记录列定义 ============
  const recordColumns = [
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
      <h2 style={{ marginBottom: 16 }}>库存管理</h2>
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane tab="库存台账" key="account">
          <div style={{ marginBottom: 16, display: 'flex', gap: 16 }}>
            <Input
              placeholder="商品ID"
              allowClear
              style={{ width: 150 }}
              onChange={(e) => setAccountProductId(e.target.value ? Number(e.target.value) : null)}
            />
            <Select
              placeholder="选择仓库"
              allowClear
              style={{ width: 200 }}
              onChange={(v) => setAccountWarehouseId(v || null)}
            >
              {warehouseList.map((w) => (
                <Select.Option key={w.id} value={w.id}>{w.name}</Select.Option>
              ))}
            </Select>
            <Button type="primary" icon={<SearchOutlined />} onClick={fetchAccount}>查询</Button>
          </div>
          <Table
            columns={accountColumns}
            dataSource={accountData}
            rowKey="id"
            loading={accountLoading}
            pagination={{
              current: accountPagination.current,
              pageSize: accountPagination.size,
              total: accountPagination.total,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total) => `共 ${total} 条`,
              onChange: (current, size) => setAccountPagination({ current, size, total: accountPagination.total }),
            }}
            scroll={{ x: 1000 }}
          />
        </TabPane>

        <TabPane tab="入库单" key="in">
          <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'flex-end' }}>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAddIn}>新建入库</Button>
          </div>
          <Table
            columns={inColumns}
            dataSource={inData}
            rowKey="id"
            loading={inLoading}
            pagination={{
              current: inPagination.current,
              pageSize: inPagination.size,
              total: inPagination.total,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total) => `共 ${total} 条`,
              onChange: (current, size) => setInPagination({ current, size, total: inPagination.total }),
            }}
            scroll={{ x: 1100 }}
          />
        </TabPane>

        <TabPane tab="出库单" key="out">
          <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'flex-end' }}>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAddOut}>新建出库</Button>
          </div>
          <Table
            columns={outColumns}
            dataSource={outData}
            rowKey="id"
            loading={outLoading}
            pagination={{
              current: outPagination.current,
              pageSize: outPagination.size,
              total: outPagination.total,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total) => `共 ${total} 条`,
              onChange: (current, size) => setOutPagination({ current, size, total: outPagination.total }),
            }}
            scroll={{ x: 1100 }}
          />
        </TabPane>

        <TabPane tab="调拨单" key="transfer">
          <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'flex-end' }}>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAddTransfer}>新建调拨</Button>
          </div>
          <Table
            columns={transferColumns}
            dataSource={transferData}
            rowKey="id"
            loading={transferLoading}
            pagination={{
              current: transferPagination.current,
              pageSize: transferPagination.size,
              total: transferPagination.total,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total) => `共 ${total} 条`,
              onChange: (current, size) => setTransferPagination({ current, size, total: transferPagination.total }),
            }}
            scroll={{ x: 1200 }}
          />
        </TabPane>

        <TabPane tab="盘点单" key="check">
          <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'flex-end' }}>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAddCheck}>新建盘点</Button>
          </div>
          <Table
            columns={checkColumns}
            dataSource={checkData}
            rowKey="id"
            loading={checkLoading}
            pagination={{
              current: checkPagination.current,
              pageSize: checkPagination.size,
              total: checkPagination.total,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total) => `共 ${total} 条`,
              onChange: (current, size) => setCheckPagination({ current, size, total: checkPagination.total }),
            }}
            scroll={{ x: 1100 }}
          />
        </TabPane>

        <TabPane tab="库存变动记录" key="record">
          <div style={{ marginBottom: 16, display: 'flex', gap: 16 }}>
            <Input
              placeholder="商品ID"
              allowClear
              style={{ width: 150 }}
              onChange={(e) => setRecordProductId(e.target.value ? Number(e.target.value) : null)}
            />
            <Select
              placeholder="选择仓库"
              allowClear
              style={{ width: 200 }}
              onChange={(v) => setRecordWarehouseId(v || null)}
            >
              {warehouseList.map((w) => (
                <Select.Option key={w.id} value={w.id}>{w.name}</Select.Option>
              ))}
            </Select>
            <Select
              placeholder="变动类型"
              allowClear
              style={{ width: 150 }}
              onChange={(v) => setRecordChangeType(v || null)}
            >
              <Select.Option value="IN">入库</Select.Option>
              <Select.Option value="OUT">出库</Select.Option>
              <Select.Option value="TRANSFER_IN">调拨入库</Select.Option>
              <Select.Option value="TRANSFER_OUT">调拨出库</Select.Option>
              <Select.Option value="CHECK">盘点调整</Select.Option>
              <Select.Option value="FREEZE">冻结</Select.Option>
              <Select.Option value="UNFREEZE">解冻</Select.Option>
            </Select>
            <Button type="primary" icon={<SearchOutlined />} onClick={fetchRecords}>查询</Button>
          </div>
          <Table
            columns={recordColumns}
            dataSource={recordData}
            rowKey="id"
            loading={recordLoading}
            pagination={{
              current: recordPagination.current,
              pageSize: recordPagination.size,
              total: recordPagination.total,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total) => `共 ${total} 条`,
              onChange: (current, size) => setRecordPagination({ current, size, total: recordPagination.total }),
            }}
            scroll={{ x: 1300 }}
          />
        </TabPane>
      </Tabs>

      {/* 入库单弹窗 */}
      <Modal
        title={editingIn ? '入库单详情' : '新建入库'}
        open={inModalVisible}
        onOk={editingIn ? () => setInModalVisible(false) : handleInModalOk}
        onCancel={() => setInModalVisible(false)}
        width={600}
        footer={editingIn ? [<Button key="close" onClick={() => setInModalVisible(false)}>关闭</Button>] : undefined}
      >
        <Form form={inForm} layout="vertical">
          <Form.Item name="warehouseId" label="仓库" rules={[{ required: true }]}>
            <Select placeholder="请选择仓库">
              {warehouseList.map((w) => (
                <Select.Option key={w.id} value={w.id}>{w.name}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="inType" label="入库类型" rules={[{ required: true }]}>
            <Select placeholder="请选择">
              <Select.Option value={1}>采购入库</Select.Option>
              <Select.Option value={2}>退货入库</Select.Option>
              <Select.Option value={3}>调拨入库</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="inDate" label="入库日期">
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="remark" label="备注">
            <Input.TextArea rows={2} placeholder="请输入备注" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 出库单弹窗 */}
      <Modal
        title={editingOut ? '出库单详情' : '新建出库'}
        open={outModalVisible}
        onOk={editingOut ? () => setOutModalVisible(false) : handleOutModalOk}
        onCancel={() => setOutModalVisible(false)}
        width={600}
        footer={editingOut ? [<Button key="close" onClick={() => setOutModalVisible(false)}>关闭</Button>] : undefined}
      >
        <Form form={outForm} layout="vertical">
          <Form.Item name="warehouseId" label="仓库" rules={[{ required: true }]}>
            <Select placeholder="请选择仓库">
              {warehouseList.map((w) => (
                <Select.Option key={w.id} value={w.id}>{w.name}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="outType" label="出库类型" rules={[{ required: true }]}>
            <Select placeholder="请选择">
              <Select.Option value={1}>销售出库</Select.Option>
              <Select.Option value={2}>采购退货</Select.Option>
              <Select.Option value={3}>调拨出库</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="outDate" label="出库日期">
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="remark" label="备注">
            <Input.TextArea rows={2} placeholder="请输入备注" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 调拨单弹窗 */}
      <Modal
        title={editingTransfer ? '调拨单详情' : '新建调拨'}
        open={transferModalVisible}
        onOk={editingTransfer ? () => setTransferModalVisible(false) : handleTransferModalOk}
        onCancel={() => setTransferModalVisible(false)}
        width={600}
        footer={editingTransfer ? [<Button key="close" onClick={() => setTransferModalVisible(false)}>关闭</Button>] : undefined}
      >
        <Form form={transferForm} layout="vertical">
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
      </Modal>

      {/* 盘点单弹窗 */}
      <Modal
        title={editingCheck ? '盘点单详情' : '新建盘点'}
        open={checkModalVisible}
        onOk={editingCheck ? () => setCheckModalVisible(false) : handleCheckModalOk}
        onCancel={() => setCheckModalVisible(false)}
        width={600}
        footer={editingCheck ? [<Button key="close" onClick={() => setCheckModalVisible(false)}>关闭</Button>] : undefined}
      >
        <Form form={checkForm} layout="vertical">
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
      </Modal>
    </div>
  );
};

export default InventoryPage;