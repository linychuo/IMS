import React, { useState, useMemo } from 'react';
import { Layout, Menu, Avatar, Dropdown, Button, Space } from 'antd';
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
} from '@ant-design/icons';
import { useNavigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

// 图标映射
const iconMap: Record<string, React.ReactNode> = {
  ShoppingCartOutlined: <ShoppingCartOutlined />,
  ShopOutlined: <ShopOutlined />,
  InboxOutlined: <InboxOutlined />,
  DollarOutlined: <DollarOutlined />,
  BarChartOutlined: <BarChartOutlined />,
  UserOutlined: <UserOutlined />,
  PieChartOutlined: <PieChartOutlined />,
  SettingOutlined: <SettingOutlined />,
};

// 默认菜单（未登录或无菜单数据时显示）
const defaultMenuItems = [
  { key: '/dashboard', icon: <BarChartOutlined />, label: '仪表盘' },
  { key: '/report', icon: <PieChartOutlined />, label: '报表中心' },
];

const AppLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const { username, realName, menus, logout } = useAuthStore();

  // 将后端菜单数据转换为 antd Menu 格式
  const menuItems = useMemo(() => {
    if (!menus || menus.length === 0) {
      return defaultMenuItems;
    }

    const items: { key: string; icon?: React.ReactNode; label: string }[] = [];

    for (const menu of menus) {
      // 一级菜单
      const menuItem: { key: string; icon?: React.ReactNode; label: string; children?: any[] } = {
        key: menu.path || `menu_${menu.id}`,
        label: menu.name,
      };

      // 添加图标
      if (menu.icon && iconMap[menu.icon]) {
        menuItem.icon = iconMap[menu.icon];
      }

      // 添加子菜单
      if (menu.children && menu.children.length > 0) {
        menuItem.children = menu.children.map((child: any) => ({
          key: child.path || `menu_${child.id}`,
          label: child.name,
          icon: child.icon && iconMap[child.icon] ? iconMap[child.icon] : undefined,
        }));
      }

      items.push(menuItem);
    }

    return items;
  }, [menus]);

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