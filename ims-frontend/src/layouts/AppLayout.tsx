import React, { useState, useMemo } from 'react';
import { Layout, Menu, Avatar, Dropdown, Button, Space } from 'antd';
import type { MenuProps } from 'antd';
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
  BankOutlined,
  TeamOutlined,
  ContainerOutlined,
  FileTextOutlined,
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
  BankOutlined: <BankOutlined />,
  TeamOutlined: <TeamOutlined />,
  ContainerOutlined: <ContainerOutlined />,
  FileTextOutlined: <FileTextOutlined />,
};

// 默认菜单（未登录或无菜单数据时显示）
const defaultMenuItems = [
  { key: '/dashboard', icon: <BarChartOutlined />, label: '仪表盘' },
  { key: '/report', icon: <PieChartOutlined />, label: '报表中心' },
];

// 菜单分组配置 - 将多个相关菜单合并为一个分组
const menuGroups = {
  '基础资料': {
    icon: <ShopOutlined />,
    routes: ['/product', '/warehouse', '/customer', '/supplier'],
  },
  '销售管理': {
    icon: <ShoppingCartOutlined />,
    routes: ['/sales/order', '/sales/out', '/sales/return', '/sales/strategy'],
  },
  '采购管理': {
    icon: <ContainerOutlined />,
    routes: ['/purchase/order', '/purchase/in', '/purchase/return'],
  },
  '库存管理': {
    icon: <InboxOutlined />,
    routes: ['/inventory/account', '/inventory/in', '/inventory/out', '/inventory/transfer', '/inventory/check', '/inventory/record'],
  },
  '财务报表': {
    icon: <DollarOutlined />,
    routes: ['/finance/in', '/finance/out', '/finance/account', '/finance/receivable', '/finance/payable', '/finance/transaction'],
  },
  '系统管理': {
    icon: <SettingOutlined />,
    routes: ['/system'],
  },
};

// 路由到分组名的映射
const routeToGroup = Object.entries(menuGroups).reduce((acc, [groupName, config]) => {
  config.routes.forEach(route => {
    acc[route] = groupName;
  });
  return acc;
}, {} as Record<string, string>);

const AppLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const { username, realName, menus, logout } = useAuthStore();

  // 将后端菜单数据按分组组织
  const menuItems = useMemo(() => {
    if (!menus || menus.length === 0) {
      return defaultMenuItems;
    }

    // 构建路由到菜单项的映射
    const routeMenuMap = new Map<string, any>();
    const buildRouteMap = (menuList: any[], parentPath = '') => {
      for (const menu of menuList) {
        if (menu.path) {
          routeMenuMap.set(menu.path, menu);
        }
        if (menu.children && menu.children.length > 0) {
          buildRouteMap(menu.children, menu.path);
        }
      }
    };
    buildRouteMap(menus);

    // 按分组组织菜单
    const groupedMenus: Record<string, any[]> = {};
    for (const [groupName, config] of Object.entries(menuGroups)) {
      groupedMenus[groupName] = [];
    }

    // 将菜单分配到分组
    routeMenuMap.forEach((menu, path) => {
      const groupName = routeToGroup[path];
      if (groupName && groupedMenus[groupName]) {
        groupedMenus[groupName].push(menu);
      }
    });

    // 构建 antd 菜单项
    const items: { key: string; icon?: React.ReactNode; label: string; children?: any[] }[] = [];

    for (const [groupName, config] of Object.entries(menuGroups)) {
      const groupMenus = groupedMenus[groupName];
      if (groupMenus.length === 0) continue;

      // 检查用户是否有该分组的任何菜单权限
      const hasAccess = groupMenus.some(m => routeMenuMap.has(m.path));
      if (!hasAccess) continue;

      const groupItem: typeof items[0] = {
        key: groupName,
        label: groupName,
        icon: config.icon,
        children: groupMenus.map(menu => ({
          key: menu.path,
          label: menu.name,
          icon: menu.icon && iconMap[menu.icon] ? iconMap[menu.icon] : undefined,
        })),
      };

      items.push(groupItem);
    }

    // 添加不在任何分组中的独立菜单（如仪表盘、报表）
    const standaloneRoutes = ['/dashboard', '/report'];
    for (const route of standaloneRoutes) {
      const menu = routeMenuMap.get(route);
      if (menu) {
        items.push({
          key: route,
          label: menu.name,
          icon: menu.icon && iconMap[menu.icon] ? iconMap[menu.icon] : <BarChartOutlined />,
        });
      }
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