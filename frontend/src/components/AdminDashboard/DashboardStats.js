import React from "react";
import {
  Card,
  Col,
  Row,
  Typography,
} from "antd";

import {
  CarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  DollarCircleOutlined,
  FileProtectOutlined,
  UserOutlined,
} from "@ant-design/icons";

import CountUp from "react-countup";

const { Text } = Typography;

function DashboardStats({
  totalCars = 0,
  availableCars = 0,
  bookedCars = 0,
  totalBookings = 0,
  totalRevenue = 0,
  pendingRequests = 0,
}) {
  const statistics = [
    {
      key: "total-cars",
      title: "Total Cars",
      value: totalCars,
      prefix: "",
      icon: <CarOutlined />,
      className: "blue",
      description: "Complete rental fleet",
    },

    {
      key: "available-cars",
      title: "Available Cars",
      value: availableCars,
      prefix: "",
      icon: <CheckCircleOutlined />,
      className: "green",
      description: "Ready for booking",
    },

    {
      key: "booked-cars",
      title: "Booked Cars",
      value: bookedCars,
      prefix: "",
      icon: <ClockCircleOutlined />,
      className: "orange",
      description: "Cars with bookings",
    },

    {
      key: "total-bookings",
      title: "Total Bookings",
      value: totalBookings,
      prefix: "",
      icon: <UserOutlined />,
      className: "purple",
      description: "Customer reservations",
    },

    {
      key: "total-revenue",
      title: "Total Revenue",
      value: totalRevenue,
      prefix: "₹",
      icon: <DollarCircleOutlined />,
      className: "cyan",
      description: "Non-cancelled bookings",
    },

    {
      key: "pending-requests",
      title: "Pending Requests",
      value: pendingRequests,
      prefix: "",
      icon: <FileProtectOutlined />,
      className: "pink",
      description: "Owner verification requests",
    },
  ];

  return (
    <Row
      gutter={[20, 20]}
      className="professional-dashboard-stats"
    >
      {statistics.map((item, index) => (
        <Col
          xl={8}
          lg={8}
          md={12}
          sm={12}
          xs={24}
          key={item.key}
        >
          <Card
            bordered={false}
            className={`professional-stat-card ${item.className}`}
            style={{
              animationDelay: `${index * 80}ms`,
            }}
          >
            <div className="professional-stat-card-top">
              <div
                className={`professional-stat-icon ${item.className}`}
              >
                {item.icon}
              </div>

              <span className="professional-stat-growth">
                Live
              </span>
            </div>

            <div className="professional-stat-content">
              <Text className="professional-stat-title">
                {item.title}
              </Text>

              <div className="professional-stat-value">
                {item.prefix}

                <CountUp
                  start={0}
                  end={Number(item.value || 0)}
                  duration={1.4}
                  separator=","
                  preserveValue
                />
              </div>

              <Text className="professional-stat-description">
                {item.description}
              </Text>
            </div>

            <div className="professional-stat-decoration" />
          </Card>
        </Col>
      ))}
    </Row>
  );
}

export default DashboardStats;