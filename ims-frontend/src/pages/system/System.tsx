import React, { useState, useEffect } from 'react';
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
  TreeDataNode,
  Transfer,
} from 'antd';
import {
  PlusOutlined,
  SettingOutlined,
  EditOutlined,
  DeleteOutlined,
  LinkOutlined,
} from '@ant-design/icons';
import { systemApi } from '../../api';
import type { DataNode } from 'antd/es/tree';

const { TabPane } = Tabs;

// ============ 用户 ============
interface User {
  id: number;
  username: string;
  realName: string;
  email?: string;
  mobile?: string;
  status: number;
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
  permissionName: string;
  permissionCode: string;
  parentId?: number;
  path?: string;
  component?: string;
  sortOrder: number;
  description?: string;
  status: number;
  source?: string;
  children?: MenuItem[];
}

// ============ 权限点 ============
interface Permission {
  id: number;
  permissionName: string;
  permissionCode: string;
  path?: string;
  status: number;
}

interface SystemProps {
  defaultTab?: 'user' | 'role' | 'menu' | 'permission';
}

const SystemPage: React.FC<SystemProps> = ({ defaultTab = 'user' }) => {
  const [activeTab, setActiveTab] = useState(defaultTab);

  // 用户状态
  const [userLoading, setUserLoading] = useState(false);
  const [userData, setUserData] = useState<User[]>([]);
  const [userPagination, setUserPagination] = useState({ current: 1, size: 10, total: 0 });
  const [userModalVisible, setUserModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [userForm] = Form.useForm();

  // 角色状态
  const [roleLoading, setRoleLoading] = useState(false);
  const [roleData, setRoleData] = useState<Role[]>([]);
  const [rolePagination, setRolePagination] = useState({ current: 1, size: 10, total: 0 });
  const [roleModalVisible, setRoleModalVisible] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [roleForm] = Form.useForm();
  const [rolePermissionModalVisible, setRolePermissionModalVisible] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [rolePermissionData, setRolePermissionData] = useState<Permission[]>([]);
  const [selectedPermissionKeys, setSelectedPermissionKeys] = useState<number[]>([]);

  // 栏目状态
  const [menuLoading, setMenuLoading] = useState(false);
  const [menuData, setMenuData] = useState<MenuItem[]>([]);
  const [menuModalVisible, setMenuModalVisible] = useState(false);
  const [editingMenu, setEditingMenu] = useState<MenuItem | null>(null);
  const [menuForm] = Form.useForm();
  const [menuTreeData, setMenuTreeData] = useState<DataNode[]>([]);
  const [menuPermissionModalVisible, setMenuPermissionModalVisible] = useState(false);
  const [menuPermissionData, setMenuPermissionData] = useState<Permission[]>([]);

  // 权限点状态
  const [permissionLoading, setPermissionLoading] = useState(false);
  const [permissionData, setPermissionData] = useState<Permission[]>([]);

  useEffect(() => {
    if (activeTab === 'user') {
      fetchUsers();
    } else if (activeTab === 'role') {
      fetchRoles();
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

  // ============ 角色权限分配 ============
  const handleAssignPermissions = async (record: Role) => {
    setSelectedRole(record);
    setRolePermissionModalVisible(true);
    setRolePermissionData(permissionData);
    try {
      const res = await systemApi.get(`/role/${record.id}/permissions`);
      if (res.data.code === 200) {
        setSelectedPermissionKeys(res.data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch role permissions:', error);
      message.error('获取角色权限失败');
    }
  };

  const handleRolePermissionOk = async () => {
    if (!selectedRole) return;
    try {
      const res = await systemApi.post(`/role/${selectedRole.id}/permissions`, selectedPermissionKeys);
      if (res.data.code === 200) {
        message.success('权限分配成功');
        setRolePermissionModalVisible(false);
      } else {
        message.error(res.data.message || '分配失败');
      }
    } catch (error) {
      console.error('Failed to assign permissions:', error);
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
        setMenuTreeData(convertToTreeData(menus));
      }
    } catch (error) {
      console.error('Failed to fetch menus:', error);
      message.error('获取栏目列表失败');
    } finally {
      setMenuLoading(false);
    }
  };

  const convertToTreeData = (menus: MenuItem[]): DataNode[] => {
    const map: Record<number, MenuItem> = {};
    const roots: MenuItem[] = [];

    menus.forEach(m => {
      map[m.id] = { ...m, children: [] };
    });

    menus.forEach(m => {
      if (m.parentId && map[m.parentId]) {
        map[m.parentId].children!.push(map[m.id]);
      } else {
        roots.push(map[m.id]);
      }
    });

    const buildTree = (items: MenuItem[]): DataNode[] => {
      return items.map(item => ({
        title: (
          <span>
            {item.permissionName}
            <span style={{ color: '#999', marginLeft: 8, fontSize: 12 }}>
              {item.path || '-'}
            </span>
          </span>
        ),
        key: item.id,
        children: item.children && item.children.length > 0 ? buildTree(item.children) : undefined,
      }));
    };

    return buildTree(roots);
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
  const handleAssignMenuPermissions = async (record: MenuItem) => {
    setEditingMenu(record);
    setMenuPermissionModalVisible(true);
    try {
      const res = await systemApi.get(`/system/menu/permission-options`);
      if (res.data.code === 200) {
        setMenuPermissionData(res.data.data || []);
      }
      const permRes = await systemApi.get(`/system/menu/${record.id}/permissions`);
      if (permRes.data.code === 200) {
        setSelectedPermissionKeys(permRes.data.data.map((p: Permission) => p.id));
      } else {
        setSelectedPermissionKeys([]);
      }
    } catch (error) {
      console.error('Failed to fetch menu permissions:', error);
      message.error('获取栏目权限失败');
    }
  };

  const handleMenuPermissionOk = async () => {
    if (!editingMenu) return;
    try {
      const res = await systemApi.put(`/system/menu/${editingMenu.id}/permissions`, selectedPermissionKeys);
      if (res.data.code === 200) {
        message.success('权限点分配成功');
        setMenuPermissionModalVisible(false);
      } else {
        message.error(res.data.message || '分配失败');
      }
    } catch (error) {
      console.error('Failed to assign menu permissions:', error);
      message.error('权限点分配失败');
    }
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

  // ============ 表格列定义 ============
  const userColumns = [
    { title: '用户名', dataIndex: 'username', key: 'username', width: 150 },
    { title: '真实姓名', dataIndex: 'realName', key: 'realName', width: 120 },
    { title: '邮箱', dataIndex: 'email', key: 'email', width: 180 },
    { title: '手机号', dataIndex: 'mobile', key: 'mobile', width: 130 },
    { title: '状态', dataIndex: 'status', key: 'status', width: 80, render: renderUserStatus },
    { title: '创建时间', dataIndex: 'createTime', key: 'createTime', width: 180 },
    {
      title: '操作',
      key: 'action',
      width: 250,
      render: (_: any, record: User) => (
        <Space>
          <Button type="link" size="small" onClick={() => handleEditUser(record)}>编辑</Button>
          <Button type="link" size="small" onClick={() => handleResetPassword(record.id)}>重置密码</Button>
          <Popconfirm title="确定删除？" onConfirm={() => handleDeleteUser(record.id)}>
            <Button type="link" size="small" danger>删除</Button>
          </Popconfirm>
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
          <Button type="link" size="small" icon={<SettingOutlined />} onClick={() => handleAssignPermissions(record)}>分配权限</Button>
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
          <Button type="link" size="small" icon={<LinkOutlined />} onClick={() => handleAssignMenuPermissions(record)}>权限点</Button>
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => handleEditMenu(record)}>编辑</Button>
          <Popconfirm title="确定删除？" onConfirm={() => handleDeleteMenu(record.id)}>
            <Button type="link" size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const permissionColumns = [
    { title: '权限名称', dataIndex: 'permissionName', key: 'permissionName', width: 200 },
    { title: '权限编码', dataIndex: 'permissionCode', key: 'permissionCode', width: 250 },
    { title: '路由', dataIndex: 'path', key: 'path', ellipsis: true },
    { title: '状态', dataIndex: 'status', key: 'status', width: 80, render: renderMenuStatus },
  ];

  // ============ Parent menu options for form ============
  const getParentMenuOptions = () => {
    const options: { label: string; value: number }[] = [];
    const addOptions = (menus: MenuItem[], level: number) => {
      menus.forEach(m => {
        options.push({ label: '　'.repeat(level) + m.permissionName, value: m.id });
        if (m.children) {
          addOptions(m.children, level + 1);
        }
      });
    };
    addOptions(menuData, 0);
    return options;
  };

  // ============ Transfer 数据源 ============
  const getTransferData = () => {
    return menuPermissionData.map(p => ({
      key: p.id,
      title: `${p.permissionName} (${p.permissionCode})`,
    }));
  };

  const getTransferTargetKeys = () => {
    return selectedPermissionKeys;
  };

  const handleTransferChange = (targetKeys: string[]) => {
    setSelectedPermissionKeys(targetKeys.map(k => parseInt(k)));
  };

  return (
    <div>
      <h2 style={{ marginBottom: 16 }}>系统管理</h2>
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane tab="用户管理" key="user">
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
        </TabPane>

        <TabPane tab="角色管理" key="role">
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
        </TabPane>

        <TabPane tab="栏目管理" key="menu">
          <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'flex-end' }}>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAddMenu}>新建栏目</Button>
          </div>
          <Table
            columns={menuColumns}
            dataSource={menuData}
            rowKey="id"
            loading={menuLoading}
            pagination={{ pageSize: 20 }}
            scroll={{ x: 900 }}
          />
        </TabPane>

        <TabPane tab="权限管理" key="permission">
          <div style={{ marginBottom: 16, color: '#999' }}>
            权限点由代码扫描生成，不可手动编辑
          </div>
          <Table
            columns={permissionColumns}
            dataSource={permissionData}
            rowKey="id"
            loading={permissionLoading}
            pagination={{ pageSize: 20 }}
            scroll={{ x: 800 }}
          />
        </TabPane>
      </Tabs>

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
            name="permissionName"
            label="栏目名称"
            rules={[{ required: true, message: '请输入栏目名称' }]}
          >
            <Input placeholder="请输入栏目名称" />
          </Form.Item>
          <Form.Item
            name="permissionCode"
            label="权限编码"
            rules={[{ required: true, message: '请输入权限编码' }]}
          >
            <Input placeholder="如: system:user" disabled={!!editingMenu} />
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

      {/* 角色权限分配弹窗 */}
      <Modal
        title={`权限分配 - ${selectedRole?.roleName || ''}`}
        open={rolePermissionModalVisible}
        onOk={handleRolePermissionOk}
        onCancel={() => setRolePermissionModalVisible(false)}
        width={600}
      >
        <Transfer
          dataSource={getTransferData()}
          targetKeys={getTransferTargetKeys()}
          onChange={handleTransferChange}
          render={(item) => item.title}
          titles={['可分配权限', '已分配权限']}
          listStyle={{ width: 250, height: 400 }}
        />
      </Modal>

      {/* 栏目权限点分配弹窗 */}
      <Modal
        title={`分配权限点 - ${editingMenu?.permissionName || ''}`}
        open={menuPermissionModalVisible}
        onOk={handleMenuPermissionOk}
        onCancel={() => setMenuPermissionModalVisible(false)}
        width={600}
      >
        <div style={{ marginBottom: 16, color: '#999' }}>
          选择该栏目关联的权限点（来自权限管理中的权限点数据）
        </div>
        <Transfer
          dataSource={getTransferData()}
          targetKeys={getTransferTargetKeys().map(k => k.toString())}
          onChange={(keys) => handleTransferChange(keys)}
          render={(item) => item.title}
          titles={['可用权限点', '已选权限点']}
          listStyle={{ width: 250, height: 400 }}
        />
      </Modal>
    </div>
  );
};

export default SystemPage;