import React, { useState } from 'react';
import { Layout, Menu, Avatar, Dropdown, Button, Space } from 'antd';
const { Sider, Header, Content } = Layout;
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
  SettingOutlined,
  ContainerOutlined,
} from '@ant-design/icons';
import { useNavigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

const iconMap: Record<string, React.ReactNode> = {
  ShoppingCartOutlined: <ShoppingCartOutlined />,
  ShopOutlined: <ShopOutlined />,
  InboxOutlined: <InboxOutlined />,
  DollarOutlined: <DollarOutlined />,
  BarChartOutlined: <BarChartOutlined />,
  UserOutlined: <UserOutlined />,
  PieChartOutlined: <PieChartOutlined />,
  SettingOutlined: <SettingOutlined />,
  ContainerOutlined: <ContainerOutlined />,
};

// 默认菜单
const defaultMenuItems = [
  { key: '/dashboard', icon: <BarChartOutlined />, label: '仪表盘' },
  { key: '/report', icon: <PieChartOutlined />, label: '报表中心' },
];

const AppLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const { username, realName, menus, logout } = useAuthStore();

  // permission_code 转路由路径
  // customer:customer -> /customer, sales:order -> /sales/order
  const codeToPath = (code: string): string | null => {
    if (!code) return null;
    const segments = code.split(':');
    // 如果第二段和第一段相同，只取第一段，如 customer:customer -> /customer
    if (segments.length === 2 && segments[0] === segments[1]) {
      return '/' + segments[0];
    }
    return '/' + code.replace(/:/g, '/');
  };

  // 直接使用后端返回的菜单树
  const buildMenuItems = (menuList: any[], parentPath?: string): any[] => {
    return menuList.map((menu, idx) => {
      // 优先用path
      let effectivePath = menu.path;
      // 如果没有path，用code转路径
      if (!effectivePath && menu.permissionCode) {
        effectivePath = codeToPath(menu.permissionCode);
      }
      // 如果还是没有有效路径，用id
      if (!effectivePath) {
        effectivePath = `menu-${menu.id || idx}`;
      }
      return {
        key: effectivePath,
        label: menu.name,
        children: menu.children && menu.children.length > 0 ? buildMenuItems(menu.children, menu.path || effectivePath) : undefined,
      };
    });
  };

  const menuItems = menus && menus.length > 0
    ? buildMenuItems(menus)
    : defaultMenuItems;

  const userMenuItems = [
    { key: 'logout', icon: <LogoutOutlined />, label: '退出登录' },
  ];

  const handleMenuClick = ({ key }: { key: string }) => {
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
          onClick={handleMenuClick}
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
              <span>{realName || username || '用户'}</span>
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

export default AppLayout;