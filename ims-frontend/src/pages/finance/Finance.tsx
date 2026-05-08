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
  Tabs,
  Tag,
  Popconfirm,
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import { warehouseApi, customerApi, supplierApi } from '../../api';

const { TabPane } = Tabs;

// ============ 收款单 ============
interface FinanceIn {
  id: number;
  inNo: string;
  customerId: number;
  customerName: string;
  orderId?: number;
  orderNo?: string;
  amount: number;
  discountAmount?: number;
  payMethod?: number;
  bankAccount?: string;
  bankName?: string;
  status: number;
  remark?: string;
  createTime?: string;
  auditTime?: string;
}

// ============ 付款单 ============
interface FinanceOut {
  id: number;
  outNo: string;
  supplierId: number;
  supplierName: string;
  orderId?: number;
  orderNo?: string;
  amount: number;
  discountAmount?: number;
  payMethod?: number;
  bankAccount?: string;
  bankName?: string;
  status: number;
  remark?: string;
  createTime?: string;
  auditTime?: string;
}

// ============ 账户 ============
interface Account {
  id: number;
  accountName: string;
  accountType: number;
  bankName?: string;
  bankAccount?: string;
  balance: number;
  status: number;
  remark?: string;
}

// ============ 应收账款 ============
interface Receivable {
  id: number;
  customerId: number;
  customerName: string;
  orderId?: number;
  orderNo?: string;
  amount: number;
  receivedAmount?: number;
  balance: number;
  status: number;
  dueDate?: string;
  remark?: string;
}

// ============ 应付账款 ============
interface Payable {
  id: number;
  supplierId: number;
  supplierName: string;
  orderId?: number;
  orderNo?: string;
  amount: number;
  paidAmount?: number;
  balance: number;
  status: number;
  dueDate?: string;
  remark?: string;
}

// ============ 账户交易记录 ============
interface AccountTransaction {
  id: number;
  accountId: number;
  accountName?: string;
  transType: string;
  transAmount: number;
  balanceBefore: number;
  balanceAfter: number;
  orderType?: string;
  orderId?: number;
  orderNo?: string;
  remark?: string;
  createTime?: string;
}

const FinancePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('in');

  // 通用状态
  const [customerList, setCustomerList] = useState<{ id: number; name: string }[]>([]);
  const [supplierList, setSupplierList] = useState<{ id: number; name: string }[]>([]);

  // 收款单状态
  const [inLoading, setInLoading] = useState(false);
  const [inData, setInData] = useState<FinanceIn[]>([]);
  const [inPagination, setInPagination] = useState({ current: 1, size: 10, total: 0 });
  const [inModalVisible, setInModalVisible] = useState(false);
  const [editingIn, setEditingIn] = useState<FinanceIn | null>(null);
  const [inForm] = Form.useForm();

  // 付款单状态
  const [outLoading, setOutLoading] = useState(false);
  const [outData, setOutData] = useState<FinanceOut[]>([]);
  const [outPagination, setOutPagination] = useState({ current: 1, size: 10, total: 0 });
  const [outModalVisible, setOutModalVisible] = useState(false);
  const [editingOut, setEditingOut] = useState<FinanceOut | null>(null);
  const [outForm] = Form.useForm();

  // 账户状态
  const [accountLoading, setAccountLoading] = useState(false);
  const [accountData, setAccountData] = useState<Account[]>([]);
  const [accountPagination, setAccountPagination] = useState({ current: 1, size: 10, total: 0 });
  const [accountModalVisible, setAccountModalVisible] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [accountForm] = Form.useForm();

  // 应收账款状态
  const [receivableLoading, setReceivableLoading] = useState(false);
  const [receivableData, setReceivableData] = useState<Receivable[]>([]);
  const [receivablePagination, setReceivablePagination] = useState({ current: 1, size: 10, total: 0 });

  // 应付账款状态
  const [payableLoading, setPayableLoading] = useState(false);
  const [payableData, setPayableData] = useState<Payable[]>([]);
  const [payablePagination, setPayablePagination] = useState({ current: 1, size: 10, total: 0 });

  // 账户交易记录状态
  const [transLoading, setTransLoading] = useState(false);
  const [transData, setTransData] = useState<AccountTransaction[]>([]);
  const [transPagination, setTransPagination] = useState({ current: 1, size: 10, total: 0 });
  const [transAccountId, setTransAccountId] = useState<number | null>(null);

  useEffect(() => {
    fetchCustomers();
    fetchSuppliers();
  }, []);

  useEffect(() => {
    if (activeTab === 'in') {
      fetchIns();
    } else if (activeTab === 'out') {
      fetchOuts();
    } else if (activeTab === 'account') {
      fetchAccounts();
    } else if (activeTab === 'receivable') {
      fetchReceivables();
    } else if (activeTab === 'payable') {
      fetchPayables();
    } else if (activeTab === 'transaction') {
      fetchTransactions();
    }
  }, [activeTab]);

  const fetchCustomers = async () => {
    try {
      const res = await customerApi.get('/customer/list');
      if (res.data.code === 200) {
        setCustomerList(res.data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch customers:', error);
    }
  };

  const fetchSuppliers = async () => {
    try {
      const res = await supplierApi.get('/supplier/list');
      if (res.data.code === 200) {
        setSupplierList(res.data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch suppliers:', error);
    }
  };

  // ============ 收款单 ============
  const fetchIns = async () => {
    setInLoading(true);
    try {
      const res = await warehouseApi.get('/finance/in/page', {
        params: { page: inPagination.current, pageSize: inPagination.size },
      });
      if (res.data.code === 200) {
        setInData(res.data.data?.records || []);
        setInPagination((prev) => ({ ...prev, total: res.data.data?.total || 0 }));
      }
    } catch (error) {
      console.error('Failed to fetch in records:', error);
      message.error('获取收款单失败');
    } finally {
      setInLoading(false);
    }
  };

  const handleAddIn = () => {
    setEditingIn(null);
    inForm.resetFields();
    setInModalVisible(true);
  };

  const handleAuditIn = async (id: number) => {
    try {
      await warehouseApi.put(`/finance/in/audit/${id}`);
      message.success('审核成功');
      fetchIns();
    } catch (error) {
      message.error('审核失败');
    }
  };

  const handleCancelIn = async (id: number) => {
    try {
      await warehouseApi.put(`/finance/in/cancel/${id}`);
      message.success('取消成功');
      fetchIns();
    } catch (error) {
      message.error('取消失败');
    }
  };

  const handleDeleteIn = async (id: number) => {
    try {
      await warehouseApi.delete(`/finance/in/${id}`);
      message.success('删除成功');
      fetchIns();
    } catch (error) {
      message.error('删除失败');
    }
  };

  const handleInModalOk = async () => {
    try {
      const values = await inForm.validateFields();
      if (editingIn?.id) {
        await warehouseApi.put(`/finance/in/${editingIn.id}`, values);
        message.success('修改成功');
      } else {
        await warehouseApi.post('/finance/in', values);
        message.success('新增成功');
      }
      setInModalVisible(false);
      fetchIns();
    } catch (error) {
      console.error('Failed to save in:', error);
    }
  };

  // ============ 付款单 ============
  const fetchOuts = async () => {
    setOutLoading(true);
    try {
      const res = await warehouseApi.get('/finance/out/page', {
        params: { page: outPagination.current, pageSize: outPagination.size },
      });
      if (res.data.code === 200) {
        setOutData(res.data.data?.records || []);
        setOutPagination((prev) => ({ ...prev, total: res.data.data?.total || 0 }));
      }
    } catch (error) {
      console.error('Failed to fetch out records:', error);
      message.error('获取付款单失败');
    } finally {
      setOutLoading(false);
    }
  };

  const handleAddOut = () => {
    setEditingOut(null);
    outForm.resetFields();
    setOutModalVisible(true);
  };

  const handleAuditOut = async (id: number) => {
    try {
      await warehouseApi.put(`/finance/out/audit/${id}`);
      message.success('审核成功');
      fetchOuts();
    } catch (error) {
      message.error('审核失败');
    }
  };

  const handleCancelOut = async (id: number) => {
    try {
      await warehouseApi.put(`/finance/out/cancel/${id}`);
      message.success('取消成功');
      fetchOuts();
    } catch (error) {
      message.error('取消失败');
    }
  };

  const handleDeleteOut = async (id: number) => {
    try {
      await warehouseApi.delete(`/finance/out/${id}`);
      message.success('删除成功');
      fetchOuts();
    } catch (error) {
      message.error('删除失败');
    }
  };

  const handleOutModalOk = async () => {
    try {
      const values = await outForm.validateFields();
      if (editingOut?.id) {
        await warehouseApi.put(`/finance/out/${editingOut.id}`, values);
        message.success('修改成功');
      } else {
        await warehouseApi.post('/finance/out', values);
        message.success('新增成功');
      }
      setOutModalVisible(false);
      fetchOuts();
    } catch (error) {
      console.error('Failed to save out:', error);
    }
  };

  // ============ 账户 ============
  const fetchAccounts = async () => {
    setAccountLoading(true);
    try {
      const res = await warehouseApi.get('/finance/account/page', {
        params: { page: accountPagination.current, pageSize: accountPagination.size },
      });
      if (res.data.code === 200) {
        setAccountData(res.data.data?.records || []);
        setAccountPagination((prev) => ({ ...prev, total: res.data.data?.total || 0 }));
      }
    } catch (error) {
      console.error('Failed to fetch accounts:', error);
      message.error('获取账户失败');
    } finally {
      setAccountLoading(false);
    }
  };

  const handleAddAccount = () => {
    setEditingAccount(null);
    accountForm.resetFields();
    setAccountModalVisible(true);
  };

  const handleEditAccount = (record: Account) => {
    setEditingAccount(record);
    accountForm.setFieldsValue(record);
    setAccountModalVisible(true);
  };

  const handleEnableAccount = async (id: number) => {
    try {
      await warehouseApi.put(`/finance/account/enable/${id}`);
      message.success('启用成功');
      fetchAccounts();
    } catch (error) {
      message.error('操作失败');
    }
  };

  const handleDisableAccount = async (id: number) => {
    try {
      await warehouseApi.put(`/finance/account/disable/${id}`);
      message.success('停用成功');
      fetchAccounts();
    } catch (error) {
      message.error('操作失败');
    }
  };

  const handleDeleteAccount = async (id: number) => {
    try {
      await warehouseApi.delete(`/finance/account/${id}`);
      message.success('删除成功');
      fetchAccounts();
    } catch (error) {
      message.error('删除失败');
    }
  };

  const handleAccountModalOk = async () => {
    try {
      const values = await accountForm.validateFields();
      if (editingAccount?.id) {
        await warehouseApi.put(`/finance/account/${editingAccount.id}`, values);
        message.success('修改成功');
      } else {
        await warehouseApi.post('/finance/account', values);
        message.success('新增成功');
      }
      setAccountModalVisible(false);
      fetchAccounts();
    } catch (error) {
      console.error('Failed to save account:', error);
    }
  };

  // ============ 应收账款 ============
  const fetchReceivables = async () => {
    setReceivableLoading(true);
    try {
      const res = await warehouseApi.get('/finance/receivable/page', {
        params: { page: receivablePagination.current, pageSize: receivablePagination.size },
      });
      if (res.data.code === 200) {
        setReceivableData(res.data.data?.records || []);
        setReceivablePagination((prev) => ({ ...prev, total: res.data.data?.total || 0 }));
      }
    } catch (error) {
      console.error('Failed to fetch receivables:', error);
      message.error('获取应收账款失败');
    } finally {
      setReceivableLoading(false);
    }
  };

  // ============ 应付账款 ============
  const fetchPayables = async () => {
    setPayableLoading(true);
    try {
      const res = await warehouseApi.get('/finance/payable/page', {
        params: { page: payablePagination.current, pageSize: payablePagination.size },
      });
      if (res.data.code === 200) {
        setPayableData(res.data.data?.records || []);
        setPayablePagination((prev) => ({ ...prev, total: res.data.data?.total || 0 }));
      }
    } catch (error) {
      console.error('Failed to fetch payables:', error);
      message.error('获取应付账款失败');
    } finally {
      setPayableLoading(false);
    }
  };

  // ============ 账户交易记录 ============
  const fetchTransactions = async () => {
    setTransLoading(true);
    try {
      const params: Record<string, any> = {
        page: transPagination.current,
        pageSize: transPagination.size,
      };
      if (transAccountId) {
        params.accountId = transAccountId;
      }
      const res = await warehouseApi.get('/finance/account-trans/page', { params });
      if (res.data.code === 200) {
        setTransData(res.data.data?.records || []);
        setTransPagination((prev) => ({ ...prev, total: res.data.data?.total || 0 }));
      }
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
      message.error('获取交易记录失败');
    } finally {
      setTransLoading(false);
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

  const renderAccountStatus = (status: number) => {
    const map: Record<number, { text: string; color: string }> = {
      1: { text: '启用', color: 'green' },
      2: { text: '停用', color: 'red' },
    };
    const s = map[status] || { text: '未知', color: 'default' };
    return <Tag color={s.color}>{s.text}</Tag>;
  };

  const renderReceivableStatus = (status: number) => {
    const map: Record<number, { text: string; color: string }> = {
      1: { text: '未结清', color: 'orange' },
      2: { text: '部分收款', color: 'blue' },
      3: { text: '已结清', color: 'green' },
    };
    const s = map[status] || { text: '未知', color: 'default' };
    return <Tag color={s.color}>{s.text}</Tag>;
  };

  const renderPayableStatus = (status: number) => {
    const map: Record<number, { text: string; color: string }> = {
      1: { text: '未结清', color: 'orange' },
      2: { text: '部分付款', color: 'blue' },
      3: { text: '已结清', color: 'green' },
    };
    const s = map[status] || { text: '未知', color: 'default' };
    return <Tag color={s.color}>{s.text}</Tag>;
  };

  // ============ 表格列定义 ============
  const inColumns = [
    { title: '收款单号', dataIndex: 'inNo', key: 'inNo', width: 150 },
    { title: '客户', dataIndex: 'customerName', key: 'customerName', width: 150 },
    { title: '关联订单', dataIndex: 'orderNo', key: 'orderNo', width: 150 },
    { title: '收款金额', dataIndex: 'amount', key: 'amount', width: 120, render: (v: number) => `¥${v?.toFixed(2) || '0.00'}` },
    { title: '优惠金额', dataIndex: 'discountAmount', key: 'discountAmount', width: 100, render: (v: number) => v ? `¥${v.toFixed(2)}` : '-' },
    { title: '支付方式', dataIndex: 'payMethod', key: 'payMethod', width: 100, render: (v: number) => {
      const map: Record<number, string> = { 1: '现金', 2: '银行转账', 3: '支付宝', 4: '微信', 5: '其他' };
      return map[v] || '-';
    }},
    { title: '状态', dataIndex: 'status', key: 'status', width: 100, render: renderInStatus },
    { title: '创建时间', dataIndex: 'createTime', key: 'createTime', width: 180 },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_: any, record: FinanceIn) => (
        <Space>
          {record.status === 1 && (
            <>
              <Button type="link" size="small" icon={<CheckCircleOutlined />} onClick={() => handleAuditIn(record.id)}>审核</Button>
              <Button type="link" size="small" danger icon={<CloseCircleOutlined />} onClick={() => handleCancelIn(record.id)}>取消</Button>
              <Popconfirm title="确定删除？" onConfirm={() => handleDeleteIn(record.id)}>
                <Button type="link" size="small" danger>删除</Button>
              </Popconfirm>
            </>
          )}
        </Space>
      ),
    },
  ];

  const outColumns = [
    { title: '付款单号', dataIndex: 'outNo', key: 'outNo', width: 150 },
    { title: '供应商', dataIndex: 'supplierName', key: 'supplierName', width: 150 },
    { title: '关联订单', dataIndex: 'orderNo', key: 'orderNo', width: 150 },
    { title: '付款金额', dataIndex: 'amount', key: 'amount', width: 120, render: (v: number) => `¥${v?.toFixed(2) || '0.00'}` },
    { title: '优惠金额', dataIndex: 'discountAmount', key: 'discountAmount', width: 100, render: (v: number) => v ? `¥${v.toFixed(2)}` : '-' },
    { title: '支付方式', dataIndex: 'payMethod', key: 'payMethod', width: 100, render: (v: number) => {
      const map: Record<number, string> = { 1: '现金', 2: '银行转账', 3: '支付宝', 4: '微信', 5: '其他' };
      return map[v] || '-';
    }},
    { title: '状态', dataIndex: 'status', key: 'status', width: 100, render: renderOutStatus },
    { title: '创建时间', dataIndex: 'createTime', key: 'createTime', width: 180 },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_: any, record: FinanceOut) => (
        <Space>
          {record.status === 1 && (
            <>
              <Button type="link" size="small" icon={<CheckCircleOutlined />} onClick={() => handleAuditOut(record.id)}>审核</Button>
              <Button type="link" size="small" danger icon={<CloseCircleOutlined />} onClick={() => handleCancelOut(record.id)}>取消</Button>
              <Popconfirm title="确定删除？" onConfirm={() => handleDeleteOut(record.id)}>
                <Button type="link" size="small" danger>删除</Button>
              </Popconfirm>
            </>
          )}
        </Space>
      ),
    },
  ];

  const accountColumns = [
    { title: '账户名称', dataIndex: 'accountName', key: 'accountName', width: 150 },
    { title: '账户类型', dataIndex: 'accountType', key: 'accountType', width: 100, render: (v: number) => {
      const map: Record<number, string> = { 1: '现金', 2: '银行', 3: '支付宝', 4: '微信', 5: '其他' };
      return map[v] || '-';
    }},
    { title: '开户行', dataIndex: 'bankName', key: 'bankName', width: 150 },
    { title: '银行账号', dataIndex: 'bankAccount', key: 'bankAccount', width: 180 },
    { title: '余额', dataIndex: 'balance', key: 'balance', width: 120, render: (v: number) => `¥${v?.toFixed(2) || '0.00'}` },
    { title: '状态', dataIndex: 'status', key: 'status', width: 80, render: renderAccountStatus },
    {
      title: '操作',
      key: 'action',
      width: 180,
      render: (_: any, record: Account) => (
        <Space>
          <Button type="link" size="small" onClick={() => handleEditAccount(record)}>编辑</Button>
          {record.status === 1 ? (
            <Button type="link" size="small" danger onClick={() => handleDisableAccount(record.id)}>停用</Button>
          ) : (
            <Button type="link" size="small" onClick={() => handleEnableAccount(record.id)}>启用</Button>
          )}
          {record.status === 1 && (
            <Popconfirm title="确定删除？" onConfirm={() => handleDeleteAccount(record.id)}>
              <Button type="link" size="small" danger>删除</Button>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  const receivableColumns = [
    { title: '客户', dataIndex: 'customerName', key: 'customerName', width: 150 },
    { title: '关联订单', dataIndex: 'orderNo', key: 'orderNo', width: 150 },
    { title: '应收金额', dataIndex: 'amount', key: 'amount', width: 120, render: (v: number) => `¥${v?.toFixed(2) || '0.00'}` },
    { title: '已收金额', dataIndex: 'receivedAmount', key: 'receivedAmount', width: 120, render: (v: number) => v ? `¥${v.toFixed(2)}` : '-' },
    { title: '待收金额', dataIndex: 'balance', key: 'balance', width: 120, render: (v: number) => `¥${v?.toFixed(2) || '0.00'}` },
    { title: '到期日期', dataIndex: 'dueDate', key: 'dueDate', width: 120 },
    { title: '状态', dataIndex: 'status', key: 'status', width: 100, render: renderReceivableStatus },
  ];

  const payableColumns = [
    { title: '供应商', dataIndex: 'supplierName', key: 'supplierName', width: 150 },
    { title: '关联订单', dataIndex: 'orderNo', key: 'orderNo', width: 150 },
    { title: '应付金额', dataIndex: 'amount', key: 'amount', width: 120, render: (v: number) => `¥${v?.toFixed(2) || '0.00'}` },
    { title: '已付金额', dataIndex: 'paidAmount', key: 'paidAmount', width: 120, render: (v: number) => v ? `¥${v.toFixed(2)}` : '-' },
    { title: '待付金额', dataIndex: 'balance', key: 'balance', width: 120, render: (v: number) => `¥${v?.toFixed(2) || '0.00'}` },
    { title: '到期日期', dataIndex: 'dueDate', key: 'dueDate', width: 120 },
    { title: '状态', dataIndex: 'status', key: 'status', width: 100, render: renderPayableStatus },
  ];

  const transColumns = [
    { title: '账户', dataIndex: 'accountName', key: 'accountName', width: 120 },
    { title: '交易类型', dataIndex: 'transType', key: 'transType', width: 100, render: (v: string) => {
      const map: Record<string, string> = { 'IN': '收款', 'OUT': '付款', 'ADJUST': '调整', 'TRANSFER': '转账' };
      return map[v] || v;
    }},
    { title: '交易金额', dataIndex: 'transAmount', key: 'transAmount', width: 120, render: (v: number) => `¥${v?.toFixed(2) || '0.00'}` },
    { title: '变动前余额', dataIndex: 'balanceBefore', key: 'balanceBefore', width: 120, render: (v: number) => `¥${v?.toFixed(2) || '0.00'}` },
    { title: '变动后余额', dataIndex: 'balanceAfter', key: 'balanceAfter', width: 120, render: (v: number) => `¥${v?.toFixed(2) || '0.00'}` },
    { title: '单据类型', dataIndex: 'orderType', key: 'orderType', width: 100 },
    { title: '单据号', dataIndex: 'orderNo', key: 'orderNo', width: 150 },
    { title: '备注', dataIndex: 'remark', key: 'remark', ellipsis: true },
    { title: '交易时间', dataIndex: 'createTime', key: 'createTime', width: 180 },
  ];

  return (
    <div>
      <h2 style={{ marginBottom: 16 }}>财务管理</h2>
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane tab="收款单" key="in">
          <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'flex-end' }}>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAddIn}>新建收款单</Button>
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
            scroll={{ x: 1300 }}
          />
        </TabPane>

        <TabPane tab="付款单" key="out">
          <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'flex-end' }}>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAddOut}>新建付款单</Button>
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
            scroll={{ x: 1300 }}
          />
        </TabPane>

        <TabPane tab="账户管理" key="account">
          <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'flex-end' }}>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAddAccount}>新建账户</Button>
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
            scroll={{ x: 1200 }}
          />
        </TabPane>

        <TabPane tab="应收账款" key="receivable">
          <Table
            columns={receivableColumns}
            dataSource={receivableData}
            rowKey="id"
            loading={receivableLoading}
            pagination={{
              current: receivablePagination.current,
              pageSize: receivablePagination.size,
              total: receivablePagination.total,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total) => `共 ${total} 条`,
              onChange: (current, size) => setReceivablePagination({ current, size, total: receivablePagination.total }),
            }}
            scroll={{ x: 1100 }}
          />
        </TabPane>

        <TabPane tab="应付账款" key="payable">
          <Table
            columns={payableColumns}
            dataSource={payableData}
            rowKey="id"
            loading={payableLoading}
            pagination={{
              current: payablePagination.current,
              pageSize: payablePagination.size,
              total: payablePagination.total,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total) => `共 ${total} 条`,
              onChange: (current, size) => setPayablePagination({ current, size, total: payablePagination.total }),
            }}
            scroll={{ x: 1100 }}
          />
        </TabPane>

        <TabPane tab="交易记录" key="transaction">
          <div style={{ marginBottom: 16, display: 'flex', gap: 16 }}>
            <Select
              placeholder="选择账户"
              allowClear
              style={{ width: 200 }}
              onChange={(v) => setTransAccountId(v || null)}
            >
              {accountData.map((a) => (
                <Select.Option key={a.id} value={a.id}>{a.accountName}</Select.Option>
              ))}
            </Select>
            <Button type="primary" icon={<SearchOutlined />} onClick={fetchTransactions}>查询</Button>
          </div>
          <Table
            columns={transColumns}
            dataSource={transData}
            rowKey="id"
            loading={transLoading}
            pagination={{
              current: transPagination.current,
              pageSize: transPagination.size,
              total: transPagination.total,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total) => `共 ${total} 条`,
              onChange: (current, size) => setTransPagination({ current, size, total: transPagination.total }),
            }}
            scroll={{ x: 1200 }}
          />
        </TabPane>
      </Tabs>

      {/* 收款单弹窗 */}
      <Modal
        title={editingIn ? '编辑收款单' : '新建收款单'}
        open={inModalVisible}
        onOk={handleInModalOk}
        onCancel={() => setInModalVisible(false)}
        width={600}
      >
        <Form form={inForm} layout="vertical">
          <Form.Item name="customerId" label="客户" rules={[{ required: true }]}>
            <Select placeholder="请选择客户">
              {customerList.map((c) => (
                <Select.Option key={c.id} value={c.id}>{c.name}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Space style={{ width: '100%' }} size="large">
            <Form.Item name="amount" label="收款金额" rules={[{ required: true }]} style={{ flex: 1 }}>
              <InputNumber min={0} precision={2} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name="discountAmount" label="优惠金额" style={{ flex: 1 }}>
              <InputNumber min={0} precision={2} style={{ width: '100%' }} />
            </Form.Item>
          </Space>
          <Space style={{ width: '100%' }} size="large">
            <Form.Item name="payMethod" label="支付方式" style={{ flex: 1 }}>
              <Select placeholder="请选择">
                <Select.Option value={1}>现金</Select.Option>
                <Select.Option value={2}>银行转账</Select.Option>
                <Select.Option value={3}>支付宝</Select.Option>
                <Select.Option value={4}>微信</Select.Option>
                <Select.Option value={5}>其他</Select.Option>
              </Select>
            </Form.Item>
          </Space>
          <Space style={{ width: '100%' }} size="large">
            <Form.Item name="bankName" label="开户行" style={{ flex: 1 }}>
              <Input placeholder="请输入开户行" />
            </Form.Item>
            <Form.Item name="bankAccount" label="银行账号" style={{ flex: 1 }}>
              <Input placeholder="请输入银行账号" />
            </Form.Item>
          </Space>
          <Form.Item name="remark" label="备注">
            <Input.TextArea rows={2} placeholder="请输入备注" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 付款单弹窗 */}
      <Modal
        title={editingOut ? '编辑付款单' : '新建付款单'}
        open={outModalVisible}
        onOk={handleOutModalOk}
        onCancel={() => setOutModalVisible(false)}
        width={600}
      >
        <Form form={outForm} layout="vertical">
          <Form.Item name="supplierId" label="供应商" rules={[{ required: true }]}>
            <Select placeholder="请选择供应商">
              {supplierList.map((s) => (
                <Select.Option key={s.id} value={s.id}>{s.name}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Space style={{ width: '100%' }} size="large">
            <Form.Item name="amount" label="付款金额" rules={[{ required: true }]} style={{ flex: 1 }}>
              <InputNumber min={0} precision={2} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name="discountAmount" label="优惠金额" style={{ flex: 1 }}>
              <InputNumber min={0} precision={2} style={{ width: '100%' }} />
            </Form.Item>
          </Space>
          <Space style={{ width: '100%' }} size="large">
            <Form.Item name="payMethod" label="支付方式" style={{ flex: 1 }}>
              <Select placeholder="请选择">
                <Select.Option value={1}>现金</Select.Option>
                <Select.Option value={2}>银行转账</Select.Option>
                <Select.Option value={3}>支付宝</Select.Option>
                <Select.Option value={4}>微信</Select.Option>
                <Select.Option value={5}>其他</Select.Option>
              </Select>
            </Form.Item>
          </Space>
          <Space style={{ width: '100%' }} size="large">
            <Form.Item name="bankName" label="开户行" style={{ flex: 1 }}>
              <Input placeholder="请输入开户行" />
            </Form.Item>
            <Form.Item name="bankAccount" label="银行账号" style={{ flex: 1 }}>
              <Input placeholder="请输入银行账号" />
            </Form.Item>
          </Space>
          <Form.Item name="remark" label="备注">
            <Input.TextArea rows={2} placeholder="请输入备注" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 账户弹窗 */}
      <Modal
        title={editingAccount ? '编辑账户' : '新建账户'}
        open={accountModalVisible}
        onOk={handleAccountModalOk}
        onCancel={() => setAccountModalVisible(false)}
        width={600}
      >
        <Form form={accountForm} layout="vertical">
          <Form.Item name="accountName" label="账户名称" rules={[{ required: true }]}>
            <Input placeholder="请输入账户名称" />
          </Form.Item>
          <Space style={{ width: '100%' }} size="large">
            <Form.Item name="accountType" label="账户类型" rules={[{ required: true }]} style={{ flex: 1 }}>
              <Select placeholder="请选择">
                <Select.Option value={1}>现金</Select.Option>
                <Select.Option value={2}>银行</Select.Option>
                <Select.Option value={3}>支付宝</Select.Option>
                <Select.Option value={4}>微信</Select.Option>
                <Select.Option value={5}>其他</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item name="balance" label="余额" style={{ flex: 1 }}>
              <InputNumber min={0} precision={2} style={{ width: '100%' }} />
            </Form.Item>
          </Space>
          <Space style={{ width: '100%' }} size="large">
            <Form.Item name="bankName" label="开户行" style={{ flex: 1 }}>
              <Input placeholder="请输入开户行" />
            </Form.Item>
            <Form.Item name="bankAccount" label="银行账号" style={{ flex: 1 }}>
              <Input placeholder="请输入银行账号" />
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

export default FinancePage;