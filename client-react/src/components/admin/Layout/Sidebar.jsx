import React from 'react';
import { Layout, Menu } from 'antd';
import {
  UserOutlined,
  HomeOutlined,
  CalendarOutlined,
  TagsOutlined,
  DashboardOutlined,
} from '@ant-design/icons';
import { Link, useLocation } from 'react-router-dom'; // Giả sử dùng React Router

const { Sider } = Layout;

const Sidebar = () => {
  const location = useLocation();

  return (
    <Sider width={200} className="site-layout-background">
      <Menu
        mode="inline"
        defaultSelectedKeys={[location.pathname]} // Chọn menu item dựa trên path hiện tại
        style={{ height: '100%', borderRight: 0 }}
      >
        <Menu.Item key="/dashboard" icon={<DashboardOutlined />}>
          <Link to="/dashboard">Dashboard</Link>
        </Menu.Item>
        <Menu.Item key="/dashboard/users" icon={<UserOutlined />}>
          <Link to="/dashboard/users">Users</Link>
        </Menu.Item>
        <Menu.Item key="/dashboard/rooms" icon={<HomeOutlined />}>
          <Link to="/dashboard/rooms">Rooms</Link>
        </Menu.Item>
        <Menu.Item key="/dashboard/bookings" icon={<CalendarOutlined />}>
          <Link to="/dashboard/bookings">Bookings</Link>
        </Menu.Item>
        <Menu.Item key="/dashboard/amenities" icon={<TagsOutlined />}>
          <Link to="/dashboard/amenities">Amenities</Link>
        </Menu.Item>
      </Menu>
    </Sider>
  );
};

export default Sidebar;