import React from "react";
import { Row, Col, Button, Avatar, Space } from "antd";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  HomeOutlined,
  CalendarOutlined,
  DashboardOutlined,
  UserOutlined,
  LogoutOutlined,
  CarOutlined,
} from "@ant-design/icons";

function DefaultLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "null");

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const isHomeActive = location.pathname === "/" || location.pathname.startsWith("/booking");
  const isBookingsActive = location.pathname === "/userbookings";
  const isAdminActive = location.pathname === "/admin";

  return (
    <div>
      {/* Sticky Glassmorphic Header */}
      <div className="header">
        <Row justify="center">
          <Col xs={23} lg={22}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 15,
              }}
            >
              {/* Logo */}
              <Link
                to="/"
                style={{
                  display: "flex",
                  alignItems: "center",
                  textDecoration: "none",
                  color: "white",
                }}
              >
                <CarOutlined
                  style={{
                    fontSize: 32,
                    color: "#60a5fa",
                    marginRight: 10,
                  }}
                />
                <div>
                  <h2
                    style={{
                      color: "white",
                      margin: 0,
                    }}
                  >
                    Drive Ease
                  </h2>
                  <small
                    style={{
                      color: "#cbd5e1",
                    }}
                  >
                    Premium Car Rental
                  </small>
                </div>
              </Link>

              {/* Navigation Menu */}
              <Space wrap size="middle" style={{ alignItems: "center" }}>
                <Link to="/">
                  <Button
                    className={`header-nav-btn ${isHomeActive ? "active-nav" : ""}`}
                    icon={<HomeOutlined />}
                  >
                    Home
                  </Button>
                </Link>

                <Link to="/userbookings">
                  <Button
                    className={`header-nav-btn ${isBookingsActive ? "active-nav" : ""}`}
                    icon={<CalendarOutlined />}
                  >
                    My Bookings
                  </Button>
                </Link>

                {(user?.isAdmin || user?.username === "Darshil Doshi" || user?.username === "darshildoshi" || user?.username === "parthpatel79_") && (
                  <Link to="/admin">
                    <Button
                      className={`header-nav-btn ${isAdminActive ? "active-nav" : ""}`}
                      icon={<DashboardOutlined />}
                    >
                      Admin
                    </Button>
                  </Link>
                )}

                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    background: "rgba(255, 255, 255, 0.08)",
                    padding: "4px 12px 4px 6px",
                    borderRadius: "20px",
                    border: "1px solid rgba(255, 255, 255, 0.12)"
                  }}
                >
                  <Avatar icon={<UserOutlined />} size={32} style={{ backgroundColor: "#2563eb" }} />
                  <span
                    style={{
                      color: "white",
                      fontWeight: "600",
                      fontSize: "14px"
                    }}
                  >
                    {user?.username}
                  </span>
                </div>

                <Button
                  danger
                  icon={<LogoutOutlined />}
                  onClick={logout}
                  style={{
                    borderRadius: "12px",
                    height: "40px",
                    fontWeight: "600"
                  }}
                >
                  Logout
                </Button>
              </Space>
            </div>
          </Col>
        </Row>
      </div>

      {/* Main Content */}
      <div className="content">{children}</div>

      {/* Footer */}
      <div className="footer">
        <h3>Drive Ease - Premium Car Rental</h3>
        <p>Developed with ❤️ by <strong>Darshil Doshi</strong></p>
        <p>© 2026 Drive Ease Enterprise. All rights reserved.</p>
      </div>
    </div>
  );
}

export default DefaultLayout;