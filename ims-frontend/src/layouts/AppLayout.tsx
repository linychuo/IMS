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
  PieChartOutlined,
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
    { key: '/report', icon: <PieChartOutlined />, label: '报表中心' },
    { key: '/sales/order', icon: <ShoppingCartOutlined />, label: '销售订单' },
    { key: '/sales/out', icon: <ShoppingCartOutlined />, label: '销售出库' },
    { key: '/sales/return', icon: <ShoppingCartOutlined />, label: '销售退货' },
    { key: '/sales/strategy', icon: <ShoppingCartOutlined />, label: '价格策略' },
    { key: '/purchase/order', icon: <ShopOutlined />, label: '采购订单' },
    { key: '/purchase/in', icon: <ShopOutlined />, label: '采购入库' },
    { key: '/purchase/return', icon: <ShopOutlined />, label: '采购退货' },
    { key: '/inventory/account', icon: <InboxOutlined />, label: '库存台账' },
    { key: '/inventory/in', icon: <InboxOutlined />, label: '入库单' },
    { key: '/inventory/out', icon: <InboxOutlined />, label: '出库单' },
    { key: '/inventory/transfer', icon: <InboxOutlined />, label: '调拨单' },
    { key: '/inventory/check', icon: <InboxOutlined />, label: '盘点单' },
    { key: '/inventory/record', icon: <InboxOutlined />, label: '库存记录' },
    { key: '/finance/in', icon: <DollarOutlined />, label: '收款单' },
    { key: '/finance/out', icon: <DollarOutlined />, label: '付款单' },
    { key: '/finance/account', icon: <DollarOutlined />, label: '账户管理' },
    { key: '/finance/receivable', icon: <DollarOutlined />, label: '应收账款' },
    { key: '/finance/payable', icon: <DollarOutlined />, label: '应付账款' },
    { key: '/finance/transaction', icon: <DollarOutlined />, label: '交易记录' },
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