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

// 菜单路径对应的图标名称映射（自动分配，不需要在栏目管理中维护）
const pathIconMap: Record<string, string> = {
  '/dashboard': 'BarChartOutlined',
  '/report': 'PieChartOutlined',
  '/warehouse': 'ContainerOutlined',
  '/product': 'ShoppingCartOutlined',
  '/customer': 'UserOutlined',
  '/supplier': 'ShopOutlined',
  '/sales': 'ShoppingCartOutlined',
  '/purchase': 'InboxOutlined',
  '/inventory': 'InboxOutlined',
  '/finance': 'DollarOutlined',
  '/system': 'SettingOutlined',
  '/sales/order': 'ShoppingCartOutlined',
  '/sales/out': 'ShoppingCartOutlined',
  '/sales/return': 'ShoppingCartOutlined',
  '/sales/price-strategy': 'DollarOutlined',
  '/purchase/order': 'InboxOutlined',
  '/purchase/in': 'InboxOutlined',
  '/purchase/return': 'InboxOutlined',
  '/inventory/account': 'BarChartOutlined',
  '/inventory/in': 'InboxOutlined',
  '/inventory/out': 'InboxOutlined',
  '/inventory/transfer': 'ContainerOutlined',
  '/inventory/check': 'BarChartOutlined',
  '/inventory/record': 'BarChartOutlined',
  '/finance/in': 'DollarOutlined',
  '/finance/out': 'DollarOutlined',
  '/finance/account': 'DollarOutlined',
  '/finance/receivable': 'DollarOutlined',
  '/finance/payable': 'DollarOutlined',
  '/finance/transaction': 'BarChartOutlined',
};

const getIconForPath = (path: string): React.ReactNode | undefined => {
  // 先精确匹配
  if (pathIconMap[path]) {
    return iconMap[pathIconMap[path]];
  }
  // 再匹配前缀
  const segments = path.split('/');
  if (segments.length >= 2) {
    const parentPath = '/' + segments[1];
    if (pathIconMap[parentPath]) {
      return iconMap[pathIconMap[parentPath]];
    }
  }
  return undefined;
};

// 默认菜单
const defaultMenuItems = [
  { key: '/dashboard', icon: <BarChartOutlined />, label: '仪表盘' },
  { key: '/report', icon: <PieChartOutlined />, label: '报表中心' },
];

const AppLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [openKeys, setOpenKeys] = useState<string[]>([]);
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
        icon: getIconForPath(menu.path || effectivePath),
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

  // 手风琴效果：只保留一个展开的子菜单
  const handleOpenChange = (keys: string[]) => {
    // 如果要打开的子菜单已展开，则保持；否则只保留最新打开的
    if (keys.length > 0 && openKeys.includes(keys[keys.length - 1])) {
      setOpenKeys(keys);
    } else {
      setOpenKeys(keys.slice(-1)); // 只保留最后一个
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          zIndex: 100,
        }}
      >
        <div style={{
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: collapsed ? 14 : 18,
          fontWeight: 'bold',
          position: 'sticky',
          top: 0,
          zIndex: 101,
          background: '#001529',
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
        }}>
          {collapsed ? 'IMS' : '进销存系统'}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['/dashboard']}
          openKeys={openKeys}
          onOpenChange={handleOpenChange}
          items={menuItems}
          onClick={handleMenuClick}
        />
      </Sider>
      <Layout>
        <Header style={{
          padding: '0 16px',
          background: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        }}>
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