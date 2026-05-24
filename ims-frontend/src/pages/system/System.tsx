import React, { useState, useEffect, useMemo } from 'react';
import {
  Table,
  Button,
  Space,
  Modal,
  Form,
  Input,
  Select,
  message,
  Tabs,
  Tag,
  Popconfirm,
  Tree,
  DatePicker,
  Upload,
  InputNumber,
} from 'antd';
import {
  PlusOutlined,
  SettingOutlined,
  EditOutlined,
  DeleteOutlined,
  LinkOutlined,
  FolderOutlined,
  FolderOpenOutlined,
  FileTextOutlined,
  UploadOutlined,
  DownloadOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { systemApi } from '../../api';
import { useAuthStore } from '../../stores/authStore';
import dayjs from 'dayjs';
const { RangePicker } = DatePicker;

// ============ 用户 ============
interface User {
  id: number;
  username: string;
  realName: string;
  email?: string;
  mobile?: string;
  status: number;
  roleId?: number;
  roleName?: string;
  createTime?: string;
}

// ============ 角色 ============
interface Role {
  id: number;
  roleName: string;
  roleCode: string;
  description?: string;
  status: number;
  createTime?: string;
}

// ============ 栏目 ============
interface MenuItem {
  id: number;
  name: string;
  parentId?: number;
  path?: string;
  component?: string;
  sortOrder: number;
  description?: string;
  status: number;
  children?: MenuItem[];
}

// ============ 权限点 ============
interface Permission {
  id: number;
  permissionName: string;
  permissionCode: string;
  parentId?: number;
  path?: string;
  status: number;
}

// ============ 系统配置 ============
interface SysConfig {
  id: number;
  configKey: string;
  configName: string;
  configValue: string;
  configType: string;
  remark?: string;
  status: number;
  createTime?: string;
}

// ============ 审批规则 ============
interface ApprovalRule {
  id: number;
  ruleCode: string;
  ruleName: string;
  businessType: string;
  minAmount: number;
  maxAmount?: number;
  approvalLevel: number;
  approverRole: string;
  status: number;
  createTime?: string;
}

// ============ 操作日志 ============
interface OperationLog {
  id: number;
  module: string;
  action: string;
  operator: string;
  requestUrl: string;
  requestMethod: string;
  requestParams?: string;
  responseStatus: number;
  duration?: number;
  ip?: string;
  createTime?: string;
}

// ============ 登录日志 ============
interface LoginLog {
  id: number;
  username: string;
  loginIp: string;
  loginStatus: number;
  failReason?: string;
  loginTime: string;
}

// ============ 用户仓库权限 ============
interface UserWarehouse {
  id: number;
  userId: number;
  username: string;
  realName: string;
  warehouseId: number;
  warehouseName: string;
}

interface SystemProps {
  defaultTab?: 'user' | 'role' | 'menu' | 'permission' | 'config' | 'approval' | 'operationLog' | 'loginLog' | 'dataPermission' | 'dataImport' | 'dataExport';
}

const SystemPage: React.FC<SystemProps> = ({ defaultTab = 'user' }) => {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const { permissions } = useAuthStore();

  // 权限码前缀映射到具体tab需要的权限
  const tabPermissionMap: Record<string, string[]> = {
    user: ['system:user', 'system:user:list', 'system:user:create', 'system:user:update', 'system:user:delete', 'system:user:read'],
    role: ['system:role', 'system:role:list', 'system:role:create', 'system:role:update', 'system:role:delete', 'system:role:read'],
    menu: ['system:menu', 'system:menu:list', 'system:menu:create', 'system:menu:update', 'system:menu:delete', 'system:menu:get', 'system:menu:permissions'],
    permission: ['system:list', 'system:menu:permissionOptions'],
    config: ['system:config', 'system:config:list', 'system:config:create', 'system:config:update', 'system:config:delete'],
    approval: ['system:approvalRule', 'system:approvalRule:list', 'system:approvalRule:create', 'system:approvalRule:update', 'system:approvalRule:delete'],
    operationLog: ['system:operationLog', 'system:operationLog:list'],
    loginLog: ['system:loginLog', 'system:loginLog:list'],
    dataPermission: ['system:dataPermission', 'system:dataPermission:read', 'system:dataPermission:assign'],
    dataImport: ['system:dataImport', 'system:dataImport:create'],
    dataExport: ['system:dataExport', 'system:dataExport:list'],
  };

  // 检查用户是否有访问某个tab的权限（精确匹配或前缀匹配）
  const hasTabPermission = (tab: string): boolean => {
    const requiredPerms = tabPermissionMap[tab] || [];
    if (requiredPerms.length === 0) return true;
    return requiredPerms.some(perm => {
      // 精确匹配
      if (permissions.includes(perm)) return true;
      // 前缀匹配: 有 system:user 意味着有 system:user:*
      if (permissions.some(p => p.startsWith(perm + ':') || p === perm)) return true;
      return false;
    });
  };

  const visibleTabs = [
    { key: 'user', label: '用户管理' },
    { key: 'role', label: '角色管理' },
    { key: 'menu', label: '栏目管理' },
    { key: 'permission', label: '权限管理' },
    { key: 'config', label: '系统配置' },
    { key: 'approval', label: '审批规则' },
    { key: 'operationLog', label: '操作日志' },
    { key: 'loginLog', label: '登录日志' },
    { key: 'dataPermission', label: '数据权限' },
    { key: 'dataImport', label: '数据导入' },
    { key: 'dataExport', label: '数据导出' },
  ].filter(tab => hasTabPermission(tab.key));

  // 用户状态
  const [userLoading, setUserLoading] = useState(false);
  const [userData, setUserData] = useState<User[]>([]);
  const [userPagination, setUserPagination] = useState({ current: 1, size: 10, total: 0 });
  const [userModalVisible, setUserModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [userForm] = Form.useForm();
  const [userRoleModalVisible, setUserRoleModalVisible] = useState(false);
  const [selectedUserForRole, setSelectedUserForRole] = useState<User | null>(null);
  const [allRoles, setAllRoles] = useState<Role[]>([]);
  const [selectedUserRoleId, setSelectedUserRoleId] = useState<number | null>(null);

  // 角色状态
  const [roleLoading, setRoleLoading] = useState(false);
  const [roleData, setRoleData] = useState<Role[]>([]);
  const [rolePagination, setRolePagination] = useState({ current: 1, size: 10, total: 0 });
  const [roleModalVisible, setRoleModalVisible] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [roleForm] = Form.useForm();

  // 栏目状态
  const [menuLoading, setMenuLoading] = useState(false);
  const [menuData, setMenuData] = useState<MenuItem[]>([]);
  const [menuModalVisible, setMenuModalVisible] = useState(false);
  const [editingMenu, setEditingMenu] = useState<MenuItem | null>(null);
  const [menuForm] = Form.useForm();
  const [expandedMenuIds, setExpandedMenuIds] = useState<Set<number>>(new Set());

  // 权限点状态
  const [permissionLoading, setPermissionLoading] = useState(false);
  const [permissionData, setPermissionData] = useState<Permission[]>([]);
  const [expandedPermIds, setExpandedPermIds] = useState<Set<number>>(new Set());

  // 统一权限分配弹窗状态
  const [permissionModalVisible, setPermissionModalVisible] = useState(false);
  const [permissionModalType, setPermissionModalType] = useState<'role' | 'menu'>('role');
  const [permissionModalTitle, setPermissionModalTitle] = useState('');
  const [permissionModalTargetId, setPermissionModalTargetId] = useState<number | null>(null);
  const [selectedPermissionKeys, setSelectedPermissionKeys] = useState<number[]>([]);
  const [permExpandedKeys, setPermExpandedKeys] = useState<string[]>([]);
  const [permSearchKeyword, setPermSearchKeyword] = useState('');

  // 系统配置状态
  const [configLoading, setConfigLoading] = useState(false);
  const [configData, setConfigData] = useState<SysConfig[]>([]);
  const [configModalVisible, setConfigModalVisible] = useState(false);
  const [editingConfig, setEditingConfig] = useState<SysConfig | null>(null);
  const [configForm] = Form.useForm();

  // 审批规则状态
  const [approvalLoading, setApprovalLoading] = useState(false);
  const [approvalData, setApprovalData] = useState<ApprovalRule[]>([]);
  const [approvalModalVisible, setApprovalModalVisible] = useState(false);
  const [editingApproval, setEditingApproval] = useState<ApprovalRule | null>(null);
  const [approvalForm] = Form.useForm();

  // 操作日志状态
  const [operationLogLoading, setOperationLogLoading] = useState(false);
  const [operationLogData, setOperationLogData] = useState<OperationLog[]>([]);
  const [operationLogPagination, setOperationLogPagination] = useState({ current: 1, size: 20, total: 0 });
  const [operationLogFilters, setOperationLogFilters] = useState<{ dateRange?: [dayjs.Dayjs, dayjs.Dayjs]; keyword?: string }>({});

  // 登录日志状态
  const [loginLogLoading, setLoginLogLoading] = useState(false);
  const [loginLogData, setLoginLogData] = useState<LoginLog[]>([]);
  const [loginLogPagination, setLoginLogPagination] = useState({ current: 1, size: 20, total: 0 });
  const [loginLogFilters, setLoginLogFilters] = useState<{ dateRange?: [dayjs.Dayjs, dayjs.Dayjs]; keyword?: string }>({});

  // 数据权限状态
  const [dataPermLoading, setDataPermLoading] = useState(false);
  const [dataPermUsers, setDataPermUsers] = useState<UserWarehouse[]>([]);
  const [dataPermPagination, setDataPermPagination] = useState({ current: 1, size: 20, total: 0 });
  const [dataPermModalVisible, setDataPermModalVisible] = useState(false);
  const [selectedUserForPerm, setSelectedUserForPerm] = useState<UserWarehouse | null>(null);
  const [dataPermForm] = Form.useForm();
  const [warehouseList, setWarehouseList] = useState<{ id: number; name: string }[]>([]);

  // 数据导入状态
  const [importLoading, setImportLoading] = useState(false);
  const [importType, setImportType] = useState<string>('customer');
  const [importResult, setImportResult] = useState<{ success: number; failed: number; errors?: string[] } | null>(null);

  // 数据导出状态
  const [exportLoading, setExportLoading] = useState(false);
  const [exportType, setExportType] = useState<string>('customer');

  useEffect(() => {
    if (activeTab === 'user') {
      fetchUsers();
    } else if (activeTab === 'role') {
      fetchRoles();
      // 预加载权限数据
      if (permissionData.length === 0) {
        fetchPermissions();
      }
    } else if (activeTab === 'menu') {
      fetchMenus();
    } else if (activeTab === 'permission') {
      fetchPermissions();
    } else if (activeTab === 'config') {
      fetchConfigs();
    } else if (activeTab === 'approval') {
      fetchApprovals();
    } else if (activeTab === 'operationLog') {
      fetchOperationLogs();
    } else if (activeTab === 'loginLog') {
      fetchLoginLogs();
    } else if (activeTab === 'dataPermission') {
      fetchDataPermUsers();
      fetchWarehouseList();
    } else if (activeTab === 'dataImport') {
      setImportResult(null);
    } else if (activeTab === 'dataExport') {
      // nothing to load
    }
  }, [activeTab]);

  // ============ 用户操作 ============
  const fetchUsers = async () => {
    setUserLoading(true);
    try {
      const res = await systemApi.get('/user/list');
      if (res.data.code === 200) {
        setUserData(res.data.data || []);
        setUserPagination((prev) => ({ ...prev, total: res.data.data?.length || 0 }));
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
      message.error('获取用户列表失败');
    } finally {
      setUserLoading(false);
    }
  };

  const handleAddUser = () => {
    setEditingUser(null);
    userForm.resetFields();
    setUserModalVisible(true);
  };

  const handleEditUser = (record: User) => {
    setEditingUser(record);
    userForm.setFieldsValue(record);
    setUserModalVisible(true);
  };

  const handleDeleteUser = async (id: number) => {
    if (id === 1) {
      message.error('不能删除管理员用户');
      return;
    }
    try {
      const res = await systemApi.delete(`/user/${id}`);
      if (res.data.code === 200) {
        message.success('删除成功');
        fetchUsers();
      } else {
        message.error(res.data.message || '删除失败');
      }
    } catch (error) {
      message.error('删除失败');
    }
  };

  const handleResetPassword = async (id: number) => {
    try {
      const res = await systemApi.post(`/user/password/reset/${id}`);
      if (res.data.code === 200) {
        message.success('密码已重置为 123456');
      } else {
        message.error(res.data.message || '操作失败');
      }
    } catch (error) {
      message.error('操作失败');
    }
  };

  const handleAssignRole = async (record: User) => {
    setSelectedUserForRole(record);
    setSelectedUserRoleId(record.roleId || null);
    // 先获取所有角色
    try {
      const res = await systemApi.get('/role/list');
      if (res.data.code === 200) {
        setAllRoles(res.data.data || []);
      }
    } catch (error) {
      message.error('获取角色列表失败');
      return;
    }
    setUserRoleModalVisible(true);
  };

  const handleUserRoleOk = async () => {
    if (!selectedUserForRole) return;
    try {
      const res = await systemApi.post(`/user/${selectedUserForRole.id}/role`, { roleId: selectedUserRoleId });
      if (res.data.code === 200) {
        message.success('角色分配成功');
        setUserRoleModalVisible(false);
        fetchUsers();
      } else {
        message.error(res.data.message || '分配失败');
      }
    } catch (error) {
      message.error('角色分配失败');
    }
  };

  const handleUserModalOk = async () => {
    try {
      const values = await userForm.validateFields();
      if (editingUser?.id) {
        const res = await systemApi.put('/user', { ...values, id: editingUser.id });
        if (res.data.code === 200) {
          message.success('修改成功');
          setUserModalVisible(false);
          fetchUsers();
        } else {
          message.error(res.data.message || '修改失败');
        }
      } else {
        const res = await systemApi.post('/user', values);
        if (res.data.code === 200) {
          message.success('新增成功');
          setUserModalVisible(false);
          fetchUsers();
        } else {
          message.error(res.data.message || '新增失败');
        }
      }
    } catch (error) {
      console.error('Failed to save user:', error);
    }
  };

  // ============ 角色操作 ============
  const fetchRoles = async () => {
    setRoleLoading(true);
    try {
      const res = await systemApi.get('/role/list');
      if (res.data.code === 200) {
        setRoleData(res.data.data || []);
        setRolePagination((prev) => ({ ...prev, total: res.data.data?.length || 0 }));
      }
    } catch (error) {
      console.error('Failed to fetch roles:', error);
      message.error('获取角色列表失败');
    } finally {
      setRoleLoading(false);
    }
  };

  const handleAddRole = () => {
    setEditingRole(null);
    roleForm.resetFields();
    setRoleModalVisible(true);
  };

  const handleEditRole = (record: Role) => {
    setEditingRole(record);
    roleForm.setFieldsValue(record);
    setRoleModalVisible(true);
  };

  const handleDeleteRole = async (id: number) => {
    try {
      const res = await systemApi.delete(`/role/${id}`);
      if (res.data.code === 200) {
        message.success('删除成功');
        fetchRoles();
      } else {
        message.error(res.data.message || '删除失败');
      }
    } catch (error) {
      message.error('删除失败');
    }
  };

  const handleRoleModalOk = async () => {
    try {
      const values = await roleForm.validateFields();
      if (editingRole?.id) {
        const res = await systemApi.put('/role', { ...values, id: editingRole.id });
        if (res.data.code === 200) {
          message.success('修改成功');
          setRoleModalVisible(false);
          fetchRoles();
        } else {
          message.error(res.data.message || '修改失败');
        }
      } else {
        const res = await systemApi.post('/role', values);
        if (res.data.code === 200) {
          message.success('新增成功');
          setRoleModalVisible(false);
          fetchRoles();
        } else {
          message.error(res.data.message || '新增失败');
        }
      }
    } catch (error) {
      console.error('Failed to save role:', error);
    }
  };

  // ============ 统一权限分配 ============
  const handleAssignPermissions = (type: 'role' | 'menu', target: Role | MenuItem, title: string) => {
    setPermissionModalType(type);
    setPermissionModalTitle(title);
    setPermissionModalTargetId(target.id);
    setSelectedPermissionKeys([]);
    setPermissionModalVisible(true);

    // 加载权限数据和已选权限
    const loadPermissions = async () => {
      // 强制刷新权限数据，确保拿到最新完整数据
      await fetchPermissions();
      // 获取已选权限
      const apiPath = type === 'role' ? `/role/${target.id}/permissions` : `/system/menu/${target.id}/permissions`;
      const res = await systemApi.get(apiPath);
      if (res.data.code === 200) {
        // 栏目返回的是权限对象数组，角色返回的是ID数组
        const data = res.data.data || [];
        const ids = data.map((item: any) => typeof item === 'number' ? item : item.id);
        setSelectedPermissionKeys([...ids]);
      }
    };
    loadPermissions();
  };

  const handlePermissionModalOk = async () => {
    if (!permissionModalTargetId) return;
    try {
      const apiPath = permissionModalType === 'role'
        ? `/role/${permissionModalTargetId}/permissions`
        : `/system/menu/${permissionModalTargetId}/permissions`;
      const res = permissionModalType === 'role'
        ? await systemApi.post(apiPath, selectedPermissionKeys)
        : await systemApi.put(apiPath, selectedPermissionKeys);
      if (res.data.code === 200) {
        message.success('权限分配成功');
        setPermissionModalVisible(false);
      } else {
        message.error(res.data.message || '分配失败');
      }
    } catch (error) {
      message.error('权限分配失败');
    }
  };

  // ============ 系统配置 ============
  const fetchConfigs = async () => {
    setConfigLoading(true);
    try {
      const res = await systemApi.get('/api/system/config');
      if (res.data.code === 200) {
        setConfigData(res.data.data || []);
      }
    } catch (error) {
      message.error('获取配置列表失败');
    } finally {
      setConfigLoading(false);
    }
  };

  const handleAddConfig = () => {
    setEditingConfig(null);
    configForm.resetFields();
    setConfigModalVisible(true);
  };

  const handleEditConfig = (record: SysConfig) => {
    setEditingConfig(record);
    configForm.setFieldsValue({
      configKey: record.configKey,
      configName: record.configName,
      configValue: record.configValue,
      configType: record.configType,
      remark: record.remark,
    });
    setConfigModalVisible(true);
  };

  const handleDeleteConfig = async (id: number) => {
    try {
      const res = await systemApi.delete(`/api/system/config/${id}`);
      if (res.data.code === 200) {
        message.success('删除成功');
        fetchConfigs();
      } else {
        message.error(res.data.message || '删除失败');
      }
    } catch (error) {
      message.error('删除失败');
    }
  };

  const handleConfigModalOk = async () => {
    try {
      const values = await configForm.validateFields();
      if (editingConfig?.id) {
        const res = await systemApi.put(`/api/system/config/${editingConfig.id}`, values);
        if (res.data.code === 200) {
          message.success('修改成功');
          setConfigModalVisible(false);
          fetchConfigs();
        } else {
          message.error(res.data.message || '修改失败');
        }
      } else {
        const res = await systemApi.post('/api/system/config', values);
        if (res.data.code === 200) {
          message.success('新增成功');
          setConfigModalVisible(false);
          fetchConfigs();
        } else {
          message.error(res.data.message || '新增失败');
        }
      }
    } catch (error) {
      console.error('Failed to save config:', error);
    }
  };

  // ============ 审批规则 ============
  const fetchApprovals = async () => {
    setApprovalLoading(true);
    try {
      const res = await systemApi.get('/approval-rule/list');
      if (res.data.code === 200) {
        setApprovalData(res.data.data || []);
      }
    } catch (error) {
      message.error('获取审批规则列表失败');
    } finally {
      setApprovalLoading(false);
    }
  };

  const handleAddApproval = () => {
    setEditingApproval(null);
    approvalForm.resetFields();
    setApprovalModalVisible(true);
  };

  const handleEditApproval = (record: ApprovalRule) => {
    setEditingApproval(record);
    approvalForm.setFieldsValue({
      ...record,
      minAmount: record.minAmount || undefined,
      maxAmount: record.maxAmount || undefined,
      approvalLevel: record.approvalLevel || undefined,
    });
    setApprovalModalVisible(true);
  };

  const handleDeleteApproval = async (id: number) => {
    try {
      const res = await systemApi.delete(`/approval-rule/${id}`);
      if (res.data.code === 200) {
        message.success('删除成功');
        fetchApprovals();
      } else {
        message.error(res.data.message || '删除失败');
      }
    } catch (error) {
      message.error('删除失败');
    }
  };

  const handleApprovalModalOk = async () => {
    try {
      const values = await approvalForm.validateFields();
      if (editingApproval?.id) {
        const res = await systemApi.put('/approval-rule', { ...values, id: editingApproval.id });
        if (res.data.code === 200) {
          message.success('修改成功');
          setApprovalModalVisible(false);
          fetchApprovals();
        } else {
          message.error(res.data.message || '修改失败');
        }
      } else {
        const res = await systemApi.post('/approval-rule', values);
        if (res.data.code === 200) {
          message.success('新增成功');
          setApprovalModalVisible(false);
          fetchApprovals();
        } else {
          message.error(res.data.message || '新增失败');
        }
      }
    } catch (error) {
      console.error('Failed to save approval rule:', error);
    }
  };

  // ============ 操作日志 ============
  const fetchOperationLogs = async () => {
    setOperationLogLoading(true);
    try {
      const params: any = { page: operationLogPagination.current, size: operationLogPagination.size };
      if (operationLogFilters.keyword) params.keyword = operationLogFilters.keyword;
      if (operationLogFilters.dateRange && operationLogFilters.dateRange.length === 2) {
        params.startDate = operationLogFilters.dateRange[0].format('YYYY-MM-DD');
        params.endDate = operationLogFilters.dateRange[1].format('YYYY-MM-DD');
      }
      const res = await systemApi.get('/log/page', { params });
      if (res.data.code === 200) {
        setOperationLogData(res.data.data?.records || []);
        setOperationLogPagination(prev => ({ ...prev, total: res.data.data?.total || 0 }));
      }
    } catch (error) {
      message.error('获取操作日志失败');
    } finally {
      setOperationLogLoading(false);
    }
  };

  // ============ 登录日志 ============
  const fetchLoginLogs = async () => {
    setLoginLogLoading(true);
    try {
      const params: any = { page: loginLogPagination.current, size: loginLogPagination.size };
      if (loginLogFilters.keyword) params.keyword = loginLogFilters.keyword;
      if (loginLogFilters.dateRange && loginLogFilters.dateRange.length === 2) {
        params.startDate = loginLogFilters.dateRange[0].format('YYYY-MM-DD');
        params.endDate = loginLogFilters.dateRange[1].format('YYYY-MM-DD');
      }
      const res = await systemApi.get('/login-log/page', { params });
      if (res.data.code === 200) {
        setLoginLogData(res.data.data?.records || []);
        setLoginLogPagination(prev => ({ ...prev, total: res.data.data?.total || 0 }));
      }
    } catch (error) {
      message.error('获取登录日志失败');
    } finally {
      setLoginLogLoading(false);
    }
  };

  // ============ 数据权限 ============
  const fetchDataPermUsers = async () => {
    setDataPermLoading(true);
    try {
      const res = await systemApi.get('/api/user/list');
      if (res.data.code === 200) {
        const users = res.data.data || [];
        // 获取每个用户的仓库权限
        const usersWithWarehouses = await Promise.all(users.map(async (u: User) => {
          try {
            const wRes = await systemApi.get(`/api/system/data-permission/user/${u.id}/warehouses`);
            return { ...u, warehouseIds: wRes.data.code === 200 ? wRes.data.data || [] : [] };
          } catch {
            return { ...u, warehouseIds: [] };
          }
        }));
        setDataPermUsers(usersWithWarehouses);
        setDataPermPagination(prev => ({ ...prev, total: users.length }));
      }
    } catch (error) {
      message.error('获取数据权限用户失败');
    } finally {
      setDataPermLoading(false);
    }
  };

  const fetchWarehouseList = async () => {
    try {
      const res = await systemApi.get('/api/warehouse/list');
      if (res.data.code === 200) {
        setWarehouseList(res.data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch warehouses:', error);
    }
  };

  const handleAssignWarehouse = () => {
    if (dataPermUsers.length > 0) {
      setSelectedUserForPerm(dataPermUsers[0]);
      setDataPermModalVisible(true);
    }
  };

  const handleDataPermModalOk = async () => {
    if (!selectedUserForPerm) return;
    try {
      const values = await dataPermForm.validateFields();
      await systemApi.post(`/api/system/data-permission/user/${selectedUserForPerm.id}/warehouses`, values.warehouseIds || []);
      message.success('分配成功');
      setDataPermModalVisible(false);
      fetchDataPermUsers();
    } catch (error) {
      message.error('分配失败');
    }
  };

  // ============ 数据导入 ============
  const handleImportFile = (info: any) => {
    if (info.file.status === 'done') {
      message.success(`${info.file.name} 上传成功`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} 上传失败`);
    }
  };

  const handleImportSubmit = async () => {
    setImportLoading(true);
    try {
      // 模拟导入结果
      await new Promise(resolve => setTimeout(resolve, 1500));
      setImportResult({ success: 10, failed: 2, errors: ['第3行: 缺少必填字段', '第7行: 数据格式错误'] });
    } finally {
      setImportLoading(false);
    }
  };

  // ============ 数据导出 ============
  const handleExportSubmit = async () => {
    setExportLoading(true);
    try {
      const res = await systemApi.get(`/export/${exportType}`, { responseType: 'blob' });
      const blob = new Blob([res.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${exportType}_export_${dayjs().format('YYYYMMDD')}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      message.success('导出成功');
    } catch (error) {
      message.error('导出失败');
    } finally {
      setExportLoading(false);
    }
  };

  // ============ 栏目操作 ============
  const fetchMenus = async () => {
    setMenuLoading(true);
    try {
      const res = await systemApi.get('/system/menu/list');
      if (res.data.code === 200) {
        const menus = res.data.data || [];
        setMenuData(menus);
      }
    } catch (error) {
      console.error('Failed to fetch menus:', error);
      message.error('获取栏目列表失败');
    } finally {
      setMenuLoading(false);
    }
  };

  const handleAddMenu = () => {
    setEditingMenu(null);
    menuForm.resetFields();
    setMenuModalVisible(true);
  };

  const handleEditMenu = (record: MenuItem) => {
    setEditingMenu(record);
    menuForm.setFieldsValue({
      ...record,
    });
    setMenuModalVisible(true);
  };

  const handleDeleteMenu = async (id: number) => {
    try {
      const res = await systemApi.delete(`/system/menu/${id}`);
      if (res.data.code === 200) {
        message.success('删除成功');
        fetchMenus();
      } else {
        message.error(res.data.message || '删除失败');
      }
    } catch (error) {
      message.error('删除失败');
    }
  };

  // ============ 栏目树渲染 ============
  const toggleExpand = (menuId: number) => {
    const newSet = new Set(expandedMenuIds);
    if (newSet.has(menuId)) {
      newSet.delete(menuId);
    } else {
      newSet.add(menuId);
    }
    setExpandedMenuIds(newSet);
  };

  const renderMenuTreeItems = (menus: MenuItem[], parentId: number | null, level: number): React.ReactNode => {
    const filteredMenus = menus.filter(m => m.parentId === parentId);
    return filteredMenus.map(menu => {
      const children = menus.filter(m => m.parentId === menu.id);
      const hasChildren = children.length > 0;
      const isExpanded = expandedMenuIds.has(menu.id);
      const indentWidth = level * 24;
      return (
        <div key={menu.id}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '12px 16px',
              marginLeft: indentWidth,
              background: '#fff',
              borderRadius: 8,
              border: '1px solid #e8e8e8',
              marginBottom: 4,
              transition: 'all 0.2s',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#1890ff';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(24,144,255,0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#e8e8e8';
              e.currentTarget.style.boxShadow = 'none';
            }}
            onClick={() => hasChildren && toggleExpand(menu.id)}
          >
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10 }}>
              {hasChildren ? (
                isExpanded ? (
                  <FolderOpenOutlined style={{ fontSize: 18, color: '#fa8c16' }} />
                ) : (
                  <FolderOutlined style={{ fontSize: 18, color: '#fa8c16' }} />
                )
              ) : (
                <FileTextOutlined style={{ fontSize: 18, color: '#1890ff' }} />
              )}
              <div>
                <div style={{ fontWeight: 600, fontSize: 14, color: '#262626' }}>{menu.name}</div>
                <div style={{ fontSize: 12, color: '#8c8c8c', marginTop: 2 }}>
                  {menu.path}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }} onClick={(e) => e.stopPropagation()}>
              <Tag color={menu.status === 1 ? 'green' : 'red'}>
                {menu.status === 1 ? '启用' : '禁用'}
              </Tag>
              <Button type="link" size="small" icon={<LinkOutlined />} onClick={() => handleAssignMenuPermissions(menu)}>权限点</Button>
              <Button type="link" size="small" icon={<EditOutlined />} onClick={() => handleEditMenu(menu)}>编辑</Button>
              <Popconfirm title="确定删除？" onConfirm={() => handleDeleteMenu(menu.id)}>
                <Button type="link" size="small" danger icon={<DeleteOutlined />} />
              </Popconfirm>
            </div>
          </div>
          {hasChildren && isExpanded && (
            <div style={{ borderLeft: '2px solid #d9d9d9', marginLeft: indentWidth + 8 }}>
              {renderMenuTreeItems(menus, menu.id, level + 1)}
            </div>
          )}
        </div>
      );
    });
  };

  const handleMenuModalOk = async () => {
    try {
      const values = await menuForm.validateFields();
      if (editingMenu?.id) {
        const res = await systemApi.put('/system/menu', { ...values, id: editingMenu.id });
        if (res.data.code === 200) {
          message.success('修改成功');
          setMenuModalVisible(false);
          fetchMenus();
        } else {
          message.error(res.data.message || '修改失败');
        }
      } else {
        const res = await systemApi.post('/system/menu', values);
        if (res.data.code === 200) {
          message.success('新增成功');
          setMenuModalVisible(false);
          fetchMenus();
        } else {
          message.error(res.data.message || '新增失败');
        }
      }
    } catch (error) {
      console.error('Failed to save menu:', error);
    }
  };

  const handleStatusChange = async (id: number, status: number) => {
    try {
      const res = await systemApi.put(`/system/menu/${id}/status`, null, { params: { status } });
      if (res.data.code === 200) {
        message.success(status === 1 ? '已启用' : '已禁用');
        fetchMenus();
      } else {
        message.error(res.data.message || '操作失败');
      }
    } catch (error) {
      message.error('操作失败');
    }
  };

  // ============ 栏目权限点关联 ============
  const handleAssignMenuPermissions = (record: MenuItem) => {
    handleAssignPermissions('menu', record, record.name);
  };

  // ============ 权限点操作（只读，来自代码扫描） ============
  const fetchPermissions = async () => {
    setPermissionLoading(true);
    try {
      const res = await systemApi.get('/system/permission/list');
      if (res.data.code === 200) {
        setPermissionData(res.data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch permissions:', error);
      message.error('获取权限点列表失败');
    } finally {
      setPermissionLoading(false);
    }
  };

  // ============ 状态渲染 ============
  const renderUserStatus = (status: number) => {
    return <Tag color={status === 1 ? 'green' : 'red'}>{status === 1 ? '启用' : '禁用'}</Tag>;
  };

  const renderRoleStatus = (status: number) => {
    return <Tag color={status === 1 ? 'green' : 'red'}>{status === 1 ? '启用' : '禁用'}</Tag>;
  };

  const renderMenuStatus = (status: number) => {
    return <Tag color={status === 1 ? 'green' : 'red'}>{status === 1 ? '启用' : '禁用'}</Tag>;
  };

  // ============ 权限点树渲染 ============
  const togglePermExpand = (id: number) => {
    const newSet = new Set(expandedPermIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setExpandedPermIds(newSet);
  };

  const renderPermissionTree = () => {
    // 按parentId分组
    const topPermissions = permissionData.filter(p => !p.parentId);
    const childrenMap: Record<number, Permission[]> = {};
    permissionData.forEach(p => {
      if (p.parentId) {
        if (!childrenMap[p.parentId]) childrenMap[p.parentId] = [];
        childrenMap[p.parentId].push(p);
      }
    });

    const renderItem = (perm: Permission, level: number): React.ReactNode => {
      const children = childrenMap[perm.id] || [];
      const hasChildren = children.length > 0;
      const isExpanded = expandedPermIds.has(perm.id);

      return (
        <div key={perm.id}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '10px 16px',
              marginLeft: level * 24,
              background: '#fff',
              borderRadius: 8,
              border: '1px solid #e8e8e8',
              marginBottom: 4,
              cursor: hasChildren ? 'pointer' : 'default',
            }}
            onClick={() => hasChildren && togglePermExpand(perm.id)}
          >
            {hasChildren ? (
              <span style={{ marginRight: 8, color: '#1890ff', fontSize: 12 }}>
                {isExpanded ? '▼' : '▶'}
              </span>
            ) : (
              <span style={{ marginRight: 8, color: '#d9d9d9', fontSize: 12 }}>●</span>
            )}
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Tag color="blue">{perm.permissionCode}</Tag>
              <span style={{ fontWeight: 500 }}>{perm.permissionName}</span>
              {perm.path && <span style={{ color: '#999', fontSize: 12 }}>{perm.path}</span>}
            </div>
            {renderMenuStatus(perm.status)}
          </div>
          {hasChildren && isExpanded && (
            <div style={{ borderLeft: '2px solid #d9d9d9', marginLeft: level * 24 + 8 }}>
              {children.map(child => renderItem(child, level + 1))}
            </div>
          )}
        </div>
      );
    };

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {topPermissions.map(p => renderItem(p, 0))}
      </div>
    );
  };

  // ============ 表格列定义 ============
  const userColumns = [
    { title: '用户名', dataIndex: 'username', key: 'username', width: 150 },
    { title: '真实姓名', dataIndex: 'realName', key: 'realName', width: 120 },
    { title: '角色', dataIndex: 'roleName', key: 'roleName', width: 100 },
    { title: '邮箱', dataIndex: 'email', key: 'email', width: 180 },
    { title: '手机号', dataIndex: 'mobile', key: 'mobile', width: 130 },
    { title: '状态', dataIndex: 'status', key: 'status', width: 80, render: renderUserStatus },
    { title: '创建时间', dataIndex: 'createTime', key: 'createTime', width: 180 },
    {
      title: '操作',
      key: 'action',
      width: 320,
      render: (_: any, record: User) => (
        <Space>
          <Button type="link" size="small" onClick={() => handleEditUser(record)}>编辑</Button>
          <Button type="link" size="small" onClick={() => handleAssignRole(record)}>分配角色</Button>
          <Button type="link" size="small" onClick={() => handleResetPassword(record.id)}>重置密码</Button>
          {record.id !== 1 && (
            <Popconfirm title="确定删除？" onConfirm={() => handleDeleteUser(record.id)}>
              <Button type="link" size="small" danger>删除</Button>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  const roleColumns = [
    { title: '角色编码', dataIndex: 'roleCode', key: 'roleCode', width: 150 },
    { title: '角色名称', dataIndex: 'roleName', key: 'roleName', width: 150 },
    { title: '描述', dataIndex: 'description', key: 'description', ellipsis: true },
    { title: '状态', dataIndex: 'status', key: 'status', width: 80, render: renderRoleStatus },
    { title: '创建时间', dataIndex: 'createTime', key: 'createTime', width: 180 },
    {
      title: '操作',
      key: 'action',
      width: 280,
      render: (_: any, record: Role) => (
        <Space>
          <Button type="link" size="small" onClick={() => handleEditRole(record)}>编辑</Button>
          <Button type="link" size="small" icon={<SettingOutlined />} onClick={() => handleAssignPermissions('role', record, record.roleName)}>分配权限</Button>
          <Popconfirm title="确定删除？" onConfirm={() => handleDeleteRole(record.id)}>
            <Button type="link" size="small" danger>删除</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const menuColumns = [
    { title: '栏目名称', dataIndex: 'permissionName', key: 'permissionName', width: 200 },
    { title: '权限编码', dataIndex: 'permissionCode', key: 'permissionCode', width: 180 },
    { title: '路由路径', dataIndex: 'path', key: 'path', ellipsis: true },
    { title: '排序', dataIndex: 'sortOrder', key: 'sortOrder', width: 80 },
    { title: '状态', dataIndex: 'status', key: 'status', width: 80, render: renderMenuStatus },
    {
      title: '操作',
      key: 'action',
      width: 280,
      render: (_: any, record: MenuItem) => (
        <Space>
          <Button type="link" size="small" icon={<LinkOutlined />} onClick={() => handleAssignPermissions('menu', record, record.name)}>权限点</Button>
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => handleEditMenu(record)}>编辑</Button>
          <Popconfirm title="确定删除？" onConfirm={() => handleDeleteMenu(record.id)}>
            <Button type="link" size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const configColumns = [
    { title: '配置键', dataIndex: 'configKey', key: 'configKey', width: 200 },
    { title: '配置名称', dataIndex: 'configName', key: 'configName', width: 180 },
    { title: '配置值', dataIndex: 'configValue', key: 'configValue', ellipsis: true },
    { title: '类型', dataIndex: 'configType', key: 'configType', width: 100 },
    { title: '描述', dataIndex: 'remark', key: 'remark', ellipsis: true },
    {
      title: '操作',
      key: 'action',
      width: 160,
      render: (_: any, record: SysConfig) => (
        <Space>
          <Button type="link" size="small" onClick={() => handleEditConfig(record)}>编辑</Button>
          <Popconfirm title="确定删除？" onConfirm={() => handleDeleteConfig(record.id)}>
            <Button type="link" size="small" danger>删除</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const approvalColumns = [
    { title: '规则编码', dataIndex: 'ruleCode', key: 'ruleCode', width: 150 },
    { title: '规则名称', dataIndex: 'ruleName', key: 'ruleName', width: 180 },
    { title: '业务类型', dataIndex: 'businessType', key: 'businessType', width: 120 },
    { title: '最小金额', dataIndex: 'minAmount', key: 'minAmount', width: 120 },
    { title: '最大金额', dataIndex: 'maxAmount', key: 'maxAmount', width: 120 },
    { title: '审批级别', dataIndex: 'approvalLevel', key: 'approvalLevel', width: 100 },
    { title: '审批角色', dataIndex: 'approverRole', key: 'approverRole', width: 120 },
    {
      title: '操作',
      key: 'action',
      width: 160,
      render: (_: any, record: ApprovalRule) => (
        <Space>
          <Button type="link" size="small" onClick={() => handleEditApproval(record)}>编辑</Button>
          <Popconfirm title="确定删除？" onConfirm={() => handleDeleteApproval(record.id)}>
            <Button type="link" size="small" danger>删除</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const operationLogColumns = [
    { title: '模块', dataIndex: 'module', key: 'module', width: 120 },
    { title: '操作', dataIndex: 'action', key: 'action', width: 120 },
    { title: '操作人', dataIndex: 'operator', key: 'operator', width: 120 },
    { title: '请求URL', dataIndex: 'requestUrl', key: 'requestUrl', ellipsis: true },
    { title: '请求方法', dataIndex: 'requestMethod', key: 'requestMethod', width: 80 },
    { title: '响应状态', dataIndex: 'responseStatus', key: 'responseStatus', width: 80, render: (s: number) => <Tag color={s === 200 ? 'green' : 'red'}>{s}</Tag> },
    { title: '耗时(ms)', dataIndex: 'duration', key: 'duration', width: 80 },
    { title: 'IP地址', dataIndex: 'ip', key: 'ip', width: 130 },
    { title: '操作时间', dataIndex: 'createTime', key: 'createTime', width: 180 },
  ];

  const loginLogColumns = [
    { title: '用户名', dataIndex: 'username', key: 'username', width: 150 },
    { title: '登录IP', dataIndex: 'loginIp', key: 'loginIp', width: 150 },
    { title: '登录状态', dataIndex: 'loginStatus', key: 'loginStatus', width: 100, render: (s: number) => <Tag color={s === 1 ? 'green' : 'red'}>{s === 1 ? '成功' : '失败'}</Tag> },
    { title: '失败原因', dataIndex: 'failReason', key: 'failReason', ellipsis: true },
    { title: '登录时间', dataIndex: 'loginTime', key: 'loginTime', width: 180 },
  ];

  const dataPermColumns = [
    { title: '用户名', dataIndex: 'username', key: 'username', width: 150 },
    { title: '真实姓名', dataIndex: 'realName', key: 'realName', width: 120 },
    { title: '角色', dataIndex: 'roleName', key: 'roleName', width: 120 },
    { title: '仓库权限', dataIndex: 'warehouseIds', key: 'warehouseIds', render: (ids: number[]) => ids?.length > 0 ? <Tag>{ids.length} 个仓库</Tag> : <Tag color="red">未分配</Tag> },
    {
      title: '操作',
      key: 'action',
      width: 160,
      render: (_: any, record: any) => (
        <Button type="link" size="small" onClick={() => { setSelectedUserForPerm(record); setDataPermModalVisible(true); }}>
          分配仓库
        </Button>
      ),
    },
  ];

  // ============ 表格列定义 ============
  const getParentMenuOptions = () => {
    const options: { label: string; value: number }[] = [];
    const addOptions = (menus: MenuItem[], level: number) => {
      menus.forEach(m => {
        options.push({ label: '　'.repeat(level) + m.name, value: m.id });
        if (m.children) {
          addOptions(m.children, level + 1);
        }
      });
    };
    addOptions(menuData, 0);
    return options;
  };

  // ============ 权限树渲染 ============
  const permissionTreeData = useMemo(() => {
    const buildTree = (parentId: number | null): any[] => {
      return permissionData
        .filter(p => p.parentId === parentId)
        .filter(p => {
          if (!permSearchKeyword) return true;
          return p.permissionName.toLowerCase().includes(permSearchKeyword.toLowerCase()) ||
                 p.permissionCode.toLowerCase().includes(permSearchKeyword.toLowerCase());
        })
        .map(p => ({
          title: p.permissionName,
          key: String(p.id),
          children: buildTree(p.id),
        }));
    };
    return buildTree(null);
  }, [permissionData, permSearchKeyword]);

  // 搜索时自动展开匹配的节点及其父节点
  const handlePermSearch = (value: string) => {
    setPermSearchKeyword(value);
    if (value) {
      const matchedIds: string[] = [];
      const parentMap = new Map<number, number>();
      permissionData.forEach(p => {
        if (p.permissionName.toLowerCase().includes(value.toLowerCase()) ||
            p.permissionCode.toLowerCase().includes(value.toLowerCase())) {
          matchedIds.push(String(p.id));
          // 收集所有祖先
          let current = p;
          while (current.parentId) {
            matchedIds.push(String(current.parentId));
            current = permissionData.find(x => x.id === current.parentId)!;
          }
        }
      });
      setPermExpandedKeys([...new Set(matchedIds)]);
    }
  };

  // 计算需要展开的节点（选中节点的所有父节点）
  const expandedKeys = useMemo(() => {
    if (!permissionData || permissionData.length === 0) return [];
    const keys: string[] = [];
    const seen = new Set<string>();
    selectedPermissionKeys.forEach(id => {
      // 找到该节点的所有祖先
      let current = permissionData.find(p => p.id === id);
      while (current?.parentId) {
        const parentKey = String(current.parentId);
        if (!seen.has(parentKey)) {
          seen.add(parentKey);
          keys.push(parentKey);
        }
        current = permissionData.find(p => p.id === current!.parentId);
      }
    });
    return keys;
  }, [selectedPermissionKeys, permissionData]);

  const handlePermissionCheck = (checkedKeys: any) => {
    const keys = checkedKeys.checked || checkedKeys;
    const numKeys: number[] = [];
    const extractKeys = (arr: any[]) => {
      arr.forEach(k => {
        if (typeof k === 'number') {
          numKeys.push(k);
        } else if (typeof k === 'string' && k !== '[object Object]') {
          const num = parseInt(k);
          if (!isNaN(num)) numKeys.push(num);
        }
      });
    };
    extractKeys(Array.isArray(keys) ? keys : [keys]);
    setSelectedPermissionKeys(numKeys);
  };

  // 如果当前 tab 不可见，切换到可见的第一个 tab
  useEffect(() => {
    if (!hasTabPermission(activeTab) && visibleTabs.length > 0) {
      const firstVisible = visibleTabs[0].key;
      if (firstVisible === 'user' || firstVisible === 'role' || firstVisible === 'menu' || firstVisible === 'permission') {
        setActiveTab(firstVisible);
      }
    }
  }, [activeTab, visibleTabs]);

  return (
    <div>
      <h2 style={{ marginBottom: 16 }}>系统管理</h2>
      <Tabs
        activeKey={activeTab}
        onChange={(key) => setActiveTab(key as any)}
        items={visibleTabs.map(tab => {
          if (tab.key === 'user') return {
            key: 'user',
            label: '用户管理',
            children: (<>
              <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'flex-end' }}>
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAddUser}>新建用户</Button>
              </div>
              <Table
                columns={userColumns}
                dataSource={userData}
                rowKey="id"
                loading={userLoading}
                pagination={{
                  current: userPagination.current,
                  pageSize: userPagination.size,
                  total: userPagination.total,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  showTotal: (total) => `共 ${total} 条`,
                  onChange: (current, size) => setUserPagination({ current, size, total: userPagination.total }),
                }}
                scroll={{ x: 1000 }}
              />
            </>),
          };
          if (tab.key === 'role') return {
            key: 'role',
            label: '角色管理',
            children: (<>
              <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'flex-end' }}>
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAddRole}>新建角色</Button>
              </div>
              <Table
                columns={roleColumns}
                dataSource={roleData}
                rowKey="id"
                loading={roleLoading}
                pagination={{
                  current: rolePagination.current,
                  pageSize: rolePagination.size,
                  total: rolePagination.total,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  showTotal: (total) => `共 ${total} 条`,
                  onChange: (current, size) => setRolePagination({ current, size, total: rolePagination.total }),
                }}
                scroll={{ x: 1000 }}
              />
            </>),
          };
          if (tab.key === 'menu') return {
            key: 'menu',
            label: '栏目管理',
            children: (<>
              <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'flex-end' }}>
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAddMenu}>新建栏目</Button>
              </div>
              <div style={{ background: '#fafafa', borderRadius: 8, padding: 16, minHeight: 400 }}>
                {menuLoading ? (
                  <div style={{ textAlign: 'center', padding: 40 }}>加载中...</div>
                ) : menuData.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: 40, color: '#999' }}>暂无栏目数据</div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {renderMenuTreeItems(menuData, null, 0)}
                  </div>
                )}
              </div>
            </>),
          };
          if (tab.key === 'permission') return {
            key: 'permission',
            label: '权限管理',
            children: (<>
              <div style={{ marginBottom: 16, color: '#999' }}>
                权限点由代码扫描生成，按父子关系树形展示
              </div>
              <div style={{ background: '#fafafa', borderRadius: 8, padding: 16, minHeight: 400 }}>
                {permissionLoading ? (
                  <div style={{ textAlign: 'center', padding: 40 }}>加载中...</div>
                ) : permissionData.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: 40, color: '#999' }}>暂无权限点数据</div>
                ) : (
                  renderPermissionTree()
                )}
              </div>
            </>),
          };
          if (tab.key === 'config') return {
            key: 'config',
            label: '系统配置',
            children: (<>
              <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'flex-end' }}>
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAddConfig}>新建配置</Button>
              </div>
              <Table
                columns={configColumns}
                dataSource={configData}
                rowKey="id"
                loading={configLoading}
                pagination={{ pageSize: 10, showSizeChanger: true, showTotal: (total) => `共 ${total} 条` }}
                scroll={{ x: 1000 }}
              />
            </>),
          };
          if (tab.key === 'approval') return {
            key: 'approval',
            label: '审批规则',
            children: (<>
              <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'flex-end' }}>
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAddApproval}>新建规则</Button>
              </div>
              <Table
                columns={approvalColumns}
                dataSource={approvalData}
                rowKey="id"
                loading={approvalLoading}
                pagination={{ pageSize: 10, showSizeChanger: true, showTotal: (total) => `共 ${total} 条` }}
                scroll={{ x: 1000 }}
              />
            </>),
          };
          if (tab.key === 'operationLog') return {
            key: 'operationLog',
            label: '操作日志',
            children: (<>
              <div style={{ marginBottom: 16, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <Input placeholder="操作人/模块" prefix={<SearchOutlined />} style={{ width: 200 }}
                  onChange={(e) => setOperationLogFilters({ ...operationLogFilters, keyword: e.target.value })} />
                <RangePicker onChange={(dates) => setOperationLogFilters({ ...operationLogFilters, dateRange: dates as any })} />
                <Button type="primary" onClick={fetchOperationLogs}>搜索</Button>
              </div>
              <Table
                columns={operationLogColumns}
                dataSource={operationLogData}
                rowKey="id"
                loading={operationLogLoading}
                pagination={{
                  current: operationLogPagination.current,
                  pageSize: operationLogPagination.size,
                  total: operationLogPagination.total,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  showTotal: (total) => `共 ${total} 条`,
                  onChange: (current, size) => setOperationLogPagination({ current, size, total: operationLogPagination.total }),
                }}
                scroll={{ x: 1200 }}
              />
            </>),
          };
          if (tab.key === 'loginLog') return {
            key: 'loginLog',
            label: '登录日志',
            children: (<>
              <div style={{ marginBottom: 16, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <Input placeholder="用户名" prefix={<SearchOutlined />} style={{ width: 200 }}
                  onChange={(e) => setLoginLogFilters({ ...loginLogFilters, keyword: e.target.value })} />
                <RangePicker onChange={(dates) => setLoginLogFilters({ ...loginLogFilters, dateRange: dates as any })} />
                <Button type="primary" onClick={fetchLoginLogs}>搜索</Button>
              </div>
              <Table
                columns={loginLogColumns}
                dataSource={loginLogData}
                rowKey="id"
                loading={loginLogLoading}
                pagination={{
                  current: loginLogPagination.current,
                  pageSize: loginLogPagination.size,
                  total: loginLogPagination.total,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  showTotal: (total) => `共 ${total} 条`,
                  onChange: (current, size) => setLoginLogPagination({ current, size, total: loginLogPagination.total }),
                }}
                scroll={{ x: 1000 }}
              />
            </>),
          };
          if (tab.key === 'dataPermission') return {
            key: 'dataPermission',
            label: '数据权限',
            children: (<>
              <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'flex-end' }}>
                <Button type="primary" onClick={handleAssignWarehouse}>分配仓库</Button>
              </div>
              <Table
                columns={dataPermColumns}
                dataSource={dataPermUsers}
                rowKey="id"
                loading={dataPermLoading}
                pagination={{
                  current: dataPermPagination.current,
                  pageSize: dataPermPagination.size,
                  total: dataPermPagination.total,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  showTotal: (total) => `共 ${total} 条`,
                  onChange: (current, size) => setDataPermPagination({ current, size, total: dataPermPagination.total }),
                }}
                scroll={{ x: 1000 }}
              />
            </>),
          };
          if (tab.key === 'dataImport') return {
            key: 'dataImport',
            label: '数据导入',
            children: (<>
              <div style={{ maxWidth: 600 }}>
                <Form layout="vertical">
                  <Form.Item label="数据类型">
                    <Select value={importType} onChange={(v) => setImportType(v)}>
                      <Select.Option value="customer">客户</Select.Option>
                      <Select.Option value="supplier">供应商</Select.Option>
                      <Select.Option value="product">商品</Select.Option>
                    </Select>
                  </Form.Item>
                  <Form.Item label="上传文件">
                    <Upload accept=".csv,.xlsx" maxCount={1} beforeUpload={() => false}
                      onChange={(info) => handleImportFile(info)}>
                      <Button icon={<UploadOutlined />}>点击上传</Button>
                    </Upload>
                  </Form.Item>
                  <Form.Item>
                    <Button type="primary" loading={importLoading} onClick={handleImportSubmit}>开始导入</Button>
                    <span style={{ marginLeft: 16, color: '#999' }}>支持 CSV/Excel 格式</span>
                  </Form.Item>
                </Form>
                {importResult && (
                  <div style={{ marginTop: 24, padding: 16, background: '#fafafa', borderRadius: 8 }}>
                    <div style={{ fontWeight: 500, marginBottom: 8 }}>导入结果</div>
                    <div>成功: {importResult.success} 条</div>
                    <div>失败: {importResult.failed} 条</div>
                    {importResult.errors && importResult.errors.length > 0 && (
                      <div style={{ marginTop: 8, color: '#ff4d4f' }}>
                        {importResult.errors.slice(0, 5).map((e, i) => <div key={i}>{e}</div>)}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </>),
          };
          if (tab.key === 'dataExport') return {
            key: 'dataExport',
            label: '数据导出',
            children: (<>
              <div style={{ maxWidth: 600 }}>
                <Form layout="vertical">
                  <Form.Item label="数据类型">
                    <Select value={exportType} onChange={(v) => setExportType(v)}>
                      <Select.Option value="customer">客户</Select.Option>
                      <Select.Option value="supplier">供应商</Select.Option>
                      <Select.Option value="product">商品</Select.Option>
                    </Select>
                  </Form.Item>
                  <Form.Item>
                    <Button type="primary" loading={exportLoading} icon={<DownloadOutlined />} onClick={handleExportSubmit}>
                      导出数据
                    </Button>
                    <span style={{ marginLeft: 16, color: '#999' }}>导出为 CSV 格式</span>
                  </Form.Item>
                </Form>
              </div>
            </>),
          };
          return null;
        }).filter(tab => tab !== null)}
      />

      {/* 用户弹窗 */}
      <Modal
        title={editingUser ? '编辑用户' : '新建用户'}
        open={userModalVisible}
        onOk={handleUserModalOk}
        onCancel={() => setUserModalVisible(false)}
        width={500}
      >
        <Form form={userForm} layout="vertical">
          <Form.Item
            name="username"
            label="用户名"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input placeholder="请输入用户名" disabled={!!editingUser} />
          </Form.Item>
          {!editingUser && (
            <Form.Item
              name="password"
              label="密码"
              rules={[{ required: true, message: '请输入密码' }]}
            >
              <Input.Password placeholder="请输入密码" />
            </Form.Item>
          )}
          <Form.Item
            name="realName"
            label="真实姓名"
            rules={[{ required: true, message: '请输入真实姓名' }]}
          >
            <Input placeholder="请输入真实姓名" />
          </Form.Item>
          <Space style={{ width: '100%' }} size="large">
            <Form.Item name="email" label="邮箱" style={{ flex: 1 }}>
              <Input placeholder="请输入邮箱" />
            </Form.Item>
            <Form.Item name="mobile" label="手机号" style={{ flex: 1 }}>
              <Input placeholder="请输入手机号" />
            </Form.Item>
          </Space>
          <Form.Item name="status" label="状态" initialValue={1}>
            <Select>
              <Select.Option value={1}>启用</Select.Option>
              <Select.Option value={0}>禁用</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* 用户角色分配弹窗 */}
      <Modal
        title={`分配角色 - ${selectedUserForRole?.username || ''}`}
        open={userRoleModalVisible}
        onOk={handleUserRoleOk}
        onCancel={() => setUserRoleModalVisible(false)}
        width={400}
      >
        <Form layout="vertical">
          <Form.Item label="选择角色">
            <Select
              value={selectedUserRoleId}
              onChange={(value) => setSelectedUserRoleId(value)}
              placeholder="请选择角色"
              style={{ width: '100%' }}
            >
              {allRoles.map(role => (
                <Select.Option key={role.id} value={role.id}>{role.roleName}</Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* 角色弹窗 */}
      <Modal
        title={editingRole ? '编辑角色' : '新建角色'}
        open={roleModalVisible}
        onOk={handleRoleModalOk}
        onCancel={() => setRoleModalVisible(false)}
        width={500}
      >
        <Form form={roleForm} layout="vertical">
          <Form.Item
            name="roleCode"
            label="角色编码"
            rules={[{ required: true, message: '请输入角色编码' }]}
          >
            <Input placeholder="请输入角色编码" disabled={!!editingRole} />
          </Form.Item>
          <Form.Item
            name="roleName"
            label="角色名称"
            rules={[{ required: true, message: '请输入角色名称' }]}
          >
            <Input placeholder="请输入角色名称" />
          </Form.Item>
          <Form.Item name="description" label="描述">
            <Input.TextArea rows={3} placeholder="请输入描述" />
          </Form.Item>
          <Form.Item name="status" label="状态" initialValue={1}>
            <Select>
              <Select.Option value={1}>启用</Select.Option>
              <Select.Option value={0}>禁用</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* 栏目弹窗 */}
      <Modal
        title={editingMenu ? '编辑栏目' : '新建栏目'}
        open={menuModalVisible}
        onOk={handleMenuModalOk}
        onCancel={() => setMenuModalVisible(false)}
        width={500}
      >
        <Form form={menuForm} layout="vertical">
          <Form.Item
            name="name"
            label="栏目名称"
            rules={[{ required: true, message: '请输入栏目名称' }]}
          >
            <Input placeholder="请输入栏目名称" />
          </Form.Item>
          <Form.Item name="parentId" label="父级栏目">
            <Select allowClear placeholder="请选择父级栏目" options={getParentMenuOptions()} />
          </Form.Item>
          <Form.Item name="path" label="路由路径">
            <Input placeholder="如: /system/user" />
          </Form.Item>
          <Form.Item name="component" label="组件路径">
            <Input placeholder="如: pages/system/System" />
          </Form.Item>
          <Form.Item name="sortOrder" label="排序">
            <Input type="number" placeholder="数字越小越靠前" defaultValue={0} />
          </Form.Item>
          <Form.Item name="description" label="描述">
            <Input.TextArea rows={2} placeholder="请输入描述" />
          </Form.Item>
          <Form.Item name="status" label="状态" initialValue={1}>
            <Select>
              <Select.Option value={1}>启用</Select.Option>
              <Select.Option value={0}>禁用</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* 统一权限分配弹窗 */}
      <Modal
        title={`分配权限 - ${permissionModalTitle}`}
        open={permissionModalVisible}
        onOk={handlePermissionModalOk}
        onCancel={() => setPermissionModalVisible(false)}
        width={800}
        destroyOnHidden
      >
        <div style={{ display: 'flex', gap: 24, height: 500 }}>
          {/* 左侧：权限树 */}
          <div style={{ flex: 1, border: '1px solid #f0f0f0', borderRadius: 8, padding: 16, overflow: 'auto' }}>
            <div style={{ marginBottom: 12, fontWeight: 500, color: '#333' }}>系统权限</div>
            <Input.Search
              placeholder="搜索权限名称或编码"
              allowClear
              onSearch={handlePermSearch}
              onChange={(e) => handlePermSearch(e.target.value)}
              style={{ marginBottom: 12 }}
            />
            <Tree
              checkable
              checkedKeys={selectedPermissionKeys.map(k => String(k))}
              onCheck={handlePermissionCheck}
              onExpand={(keys) => setPermExpandedKeys(keys as string[])}
              expandedKeys={permExpandedKeys}
              treeData={permissionTreeData}
              height={380}
            />
          </div>
          {/* 右侧：已选权限列表 */}
          <div style={{ flex: 1, border: '1px solid #f0f0f0', borderRadius: 8, padding: 16, overflow: 'auto' }}>
            <div style={{ marginBottom: 12, fontWeight: 500, color: '#333' }}>已选权限 ({selectedPermissionKeys.length})</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {selectedPermissionKeys.map(id => {
                const perm = permissionData.find(p => p.id === id);
                return perm ? (
                  <Tag
                    key={id}
                    closable
                    onClose={() => {
                      const newKeys = selectedPermissionKeys.filter(k => k !== id);
                      setSelectedPermissionKeys(newKeys);
                    }}
                    style={{ marginBottom: 0 }}
                  >
                    {perm.permissionName}
                  </Tag>
                ) : null;
              })}
              {selectedPermissionKeys.length === 0 && (
                <div style={{ color: '#999', fontSize: 13 }}>请在左侧勾选权限点</div>
              )}
            </div>
          </div>
        </div>
      </Modal>

      {/* 系统配置弹窗 */}
      <Modal
        title={editingConfig ? '编辑配置' : '新建配置'}
        open={configModalVisible}
        onOk={handleConfigModalOk}
        onCancel={() => setConfigModalVisible(false)}
        width={500}
      >
        <Form form={configForm} layout="vertical">
          <Form.Item name="configKey" label="配置键" rules={[{ required: true, message: '请输入配置键' }]}>
            <Input placeholder="如: system.name" disabled={!!editingConfig} />
          </Form.Item>
          <Form.Item name="configName" label="配置名称" rules={[{ required: true, message: '请输入配置名称' }]}>
            <Input placeholder="请输入配置名称" />
          </Form.Item>
          <Form.Item name="configValue" label="配置值" rules={[{ required: true, message: '请输入配置值' }]}>
            <Input.TextArea rows={3} placeholder="请输入配置值" />
          </Form.Item>
          <Form.Item name="configType" label="类型" initialValue="string">
            <Select>
              <Select.Option value="string">字符串</Select.Option>
              <Select.Option value="number">数字</Select.Option>
              <Select.Option value="boolean">布尔值</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="description" label="描述">
            <Input.TextArea rows={2} placeholder="请输入描述" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 审批规则弹窗 */}
      <Modal
        title={editingApproval ? '编辑规则' : '新建规则'}
        open={approvalModalVisible}
        onOk={handleApprovalModalOk}
        onCancel={() => setApprovalModalVisible(false)}
        width={600}
      >
        <Form form={approvalForm} layout="vertical">
          <Form.Item name="ruleCode" label="规则编码" rules={[{ required: true, message: '请输入规则编码' }]}>
            <Input placeholder="如: PO_APPROVAL_001" disabled={!!editingApproval} />
          </Form.Item>
          <Form.Item name="ruleName" label="规则名称" rules={[{ required: true, message: '请输入规则名称' }]}>
            <Input placeholder="请输入规则名称" />
          </Form.Item>
          <Form.Item name="businessType" label="业务类型" rules={[{ required: true, message: '请选择业务类型' }]}>
            <Select>
              <Select.Option value="purchase">采购订单</Select.Option>
              <Select.Option value="sales">销售订单</Select.Option>
            </Select>
          </Form.Item>
          <Space style={{ width: '100%' }} size="large">
            <Form.Item name="minAmount" label="最小金额" style={{ flex: 1 }}>
              <InputNumber style={{ width: '100%' }} placeholder="0" min={0} />
            </Form.Item>
            <Form.Item name="maxAmount" label="最大金额" style={{ flex: 1 }}>
              <InputNumber style={{ width: '100%' }} placeholder="不限制" min={0} />
            </Form.Item>
          </Space>
          <Space style={{ width: '100%' }} size="large">
            <Form.Item name="approvalLevel" label="审批级别" style={{ flex: 1 }} rules={[{ required: true, message: '请输入审批级别' }]}>
              <InputNumber style={{ width: '100%' }} placeholder="1" min={1} />
            </Form.Item>
            <Form.Item name="approverRole" label="审批角色" style={{ flex: 1 }} rules={[{ required: true, message: '请输入审批角色' }]}>
              <Input placeholder="如: 财务主管" />
            </Form.Item>
          </Space>
        </Form>
      </Modal>

      {/* 数据权限分配弹窗 */}
      <Modal
        title={`分配仓库 - ${selectedUserForPerm?.username || ''}`}
        open={dataPermModalVisible}
        onOk={handleDataPermModalOk}
        onCancel={() => setDataPermModalVisible(false)}
        width={500}
      >
        <Form form={dataPermForm} layout="vertical">
          <Form.Item name="warehouseIds" label="可访问仓库">
            <Select mode="multiple" placeholder="请选择可访问的仓库" allowClear>
              {warehouseList.map(w => (
                <Select.Option key={w.id} value={w.id}>{w.name}</Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default SystemPage;