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
} from 'antd';
import {
  PlusOutlined,
  SettingOutlined,
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

// ============ 权限 ============
interface Permission {
  id: number;
  permissionName: string;
  permissionCode: string;
  permissionType: string;
  parentId?: number;
  path?: string;
  icon?: string;
  children?: Permission[];
}

const SystemPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('user');

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

  // 权限状态
  const [permissionLoading, setPermissionLoading] = useState(false);
  const [permissionData, setPermissionData] = useState<Permission[]>([]);
  const [permissionModalVisible, setPermissionModalVisible] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [selectedPermissions, setSelectedPermissions] = useState<number[]>([]);

  useEffect(() => {
    if (activeTab === 'user') {
      fetchUsers();
    } else if (activeTab === 'role') {
      fetchRoles();
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

  // ============ 权限操作 ============
  const fetchPermissions = async () => {
    setPermissionLoading(true);
    try {
      const res = await systemApi.get('/permission/list');
      if (res.data.code === 200) {
        setPermissionData(res.data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch permissions:', error);
      message.error('获取权限列表失败');
    } finally {
      setPermissionLoading(false);
    }
  };

  const handleAssignPermissions = async (record: Role) => {
    setSelectedRole(record);
    setPermissionModalVisible(true);
    try {
      const res = await systemApi.get(`/role/${record.id}/permissions`);
      if (res.data.code === 200) {
        setSelectedPermissions(res.data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch role permissions:', error);
      message.error('获取角色权限失败');
    }
  };

  const handlePermissionModalOk = async () => {
    if (!selectedRole) return;
    try {
      const res = await systemApi.post(`/role/${selectedRole.id}/permissions`, selectedPermissions);
      if (res.data.code === 200) {
        message.success('权限分配成功');
        setPermissionModalVisible(false);
      } else {
        message.error(res.data.message || '分配失败');
      }
    } catch (error) {
      console.error('Failed to assign permissions:', error);
      message.error('权限分配失败');
    }
  };

  const handlePermissionCheck = (checkedKeys: number[]) => {
    setSelectedPermissions(checkedKeys);
  };

  const convertToTreeData = (permissions: Permission[]): DataNode[] => {
    return permissions.map(perm => ({
      title: perm.permissionName,
      key: perm.id,
      children: perm.children ? convertToTreeData(perm.children) : undefined,
    }));
  };

  // ============ 状态渲染 ============
  const renderUserStatus = (status: number) => {
    return <Tag color={status === 1 ? 'green' : 'red'}>{status === 1 ? '启用' : '禁用'}</Tag>;
  };

  const renderRoleStatus = (status: number) => {
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
      width: 250,
      render: (_: any, record: Role) => (
        <Space>
          <Button type="link" size="small" onClick={() => handleEditRole(record)}>编辑</Button>
          <Button type="link" size="small" icon={<SettingOutlined />} onClick={() => handleAssignPermissions(record)}>权限</Button>
          <Popconfirm title="确定删除？" onConfirm={() => handleDeleteRole(record.id)}>
            <Button type="link" size="small" danger>删除</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const permissionColumns = [
    { title: '权限名称', dataIndex: 'permissionName', key: 'permissionName', width: 200 },
    { title: '权限编码', dataIndex: 'permissionCode', key: 'permissionCode', width: 200 },
    { title: '类型', dataIndex: 'permissionType', key: 'permissionType', width: 100 },
    { title: '路由', dataIndex: 'path', key: 'path', ellipsis: true },
    { title: '图标', dataIndex: 'icon', key: 'icon', width: 80 },
  ];

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

        <TabPane tab="权限管理" key="permission">
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

      {/* 权限分配弹窗 */}
      <Modal
        title={`权限分配 - ${selectedRole?.roleName || ''}`}
        open={permissionModalVisible}
        onOk={handlePermissionModalOk}
        onCancel={() => setPermissionModalVisible(false)}
        width={500}
      >
        <Tree
          checkable
          defaultExpandAll
          checkedKeys={selectedPermissions}
          onCheck={(checked) => handlePermissionCheck(checked as number[])}
          treeData={convertToTreeData(permissionData)}
          style={{ maxHeight: 400, overflow: 'auto' }}
        />
      </Modal>
    </div>
  );
};

export default SystemPage;