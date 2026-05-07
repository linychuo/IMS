import React, { useState } from 'react';
import { Layout, Menu, Avatar, Dropdown, Button } from 'antd';
import {
  ShoppingCartOutlined,
  ShopOutlined,
  InboxOutlined,
  DollarOutlined,
  BarChartOutlined,
  UserOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { useNavigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

const { Header, Sider, Content } = Layout;

const AppLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const { username, logout } = useAuthStore();

  const menuItems = [
    { key: '/dashboard', icon: <BarChartOutlined />, label: '仪表盘' },
    { key: '/sales', icon: <ShoppingCartOutlined />, label: '销售管理' },
    { key: '/purchase', icon: <ShopOutlined />, label: '采购管理' },
    { key: '/inventory', icon: <InboxOutlined />, label: '库存管理' },
    { key: '/finance', icon: <DollarOutlined />, label: '财务管理' },
    { key: '/product', icon: <ShopOutlined />, label: '商品管理' },
    { key: '/customer', icon: <UserOutlined />, label: '客户管理' },
    { key: '/supplier', icon: <ShopOutlined />, label: '供应商管理' },
    { key: '/warehouse', icon: <InboxOutlined />, label: '仓库管理' },
    { key: '/system', icon: <UserOutlined />, label: '系统管理' },
  ];

  const userMenuItems = [
    { key: 'logout', icon: <LogoutOutlined />, label: '退出登录' },
  ];

  const handleMenuClick = (key: string) => {
    navigate(key);
  };

  const handleUserMenuClick = ({ key }: { key: string }) => {
    if (key === 'logout') {
      logout();
      navigate('/login');
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div style={{
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: collapsed ? 14 : 18,
          fontWeight: 'bold',
        }}>
          {collapsed ? 'IMS' : '进销存系统'}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['/dashboard']}
          items={menuItems}
          onClick={({ key }) => handleMenuClick(key)}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: '0 16px', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
          />
          <Dropdown menu={{ items: userMenuItems, onClick: handleUserMenuClick }}>
            <Space>
              <Avatar icon={<UserOutlined />} />
              <span>{username || '用户'}</span>
            </Space>
          </Dropdown>
        </Header>
        <Content style={{ margin: 16, padding: 24, background: '#fff' }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

const Space = ({ children }: { children: React.ReactNode }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
    {children}
  </div>
);

export default AppLayout;