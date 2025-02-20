import React from 'react';
import AdminLayout from '../../components/admin/Layout/AdminLayout';
import { Card, Row, Col, Statistic } from 'antd';
import { UserOutlined, HomeOutlined, CalendarOutlined, DollarCircleOutlined } from '@ant-design/icons';

const DashboardPage = () => {
  // Dữ liệu thống kê mẫu (thay bằng API call sau)
  const totalUsers = 150;
  const totalRooms = 50;
  const totalBookings = 320;
  const expectedRevenue = 55000;

  return (
    <AdminLayout>
      <h2>Dashboard</h2>

      <Row gutter={16}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Tổng số Users"
              value={totalUsers}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Tổng số Rooms"
              value={totalRooms}
              prefix={<HomeOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Tổng số Bookings"
              value={totalBookings}
              prefix={<CalendarOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Doanh thu dự kiến"
              value={expectedRevenue}
              prefix={<DollarCircleOutlined />}
              suffix="$"
            />
          </Card>
        </Col>
      </Row>

      {/* Thêm các biểu đồ, danh sách bookings mới nhất, ... ở đây */}
      <div style={{ marginTop: 24 }}>
        <h3>Bookings gần đây</h3>
        {/* Hiển thị danh sách bookings gần đây ở đây (sử dụng Table hoặc List của Ant Design) */}
        <p>Sẽ được thêm vào sau...</p>
      </div>
    </AdminLayout>
  );
};

export default DashboardPage;