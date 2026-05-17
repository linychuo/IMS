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
} from '@ant-design/icons';
import { systemApi } from '../../api';
import { useAuthStore } from '../../stores/authStore';

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

interface SystemProps {
  defaultTab?: 'user' | 'role' | 'menu' | 'permission';
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
      setActiveTab(visibleTabs[0].key);
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
          return null;
        })}
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
    </div>
  );
};

export default SystemPage;