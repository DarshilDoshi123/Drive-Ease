import React from "react";
import { Form, Input, Row, Col, Button, Typography } from "antd";
import { Link, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  CarOutlined,
  LockOutlined,
  UserOutlined,
} from "@ant-design/icons";

import { userLogin } from "../redux/actions/userActions";
import Spinner from "../components/Spinner";

const { Title, Text } = Typography;

function Login() {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.alertsReducer);

  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");

  if (token && user) {
    return <Navigate to="/" replace />;
  }

  const onFinish = (values) => {
    dispatch(userLogin(values));
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "24px",
        background:
          "linear-gradient(135deg, #020617 0%, #172554 50%, #1d4ed8 100%)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {loading && <Spinner />}

      <div
        style={{
          width: "100%",
          maxWidth: "1100px",
          background: "rgba(255,255,255,0.98)",
          borderRadius: "24px",
          overflow: "hidden",
          boxShadow: "0 25px 80px rgba(0,0,0,0.35)",
        }}
      >
        <Row>
          <Col lg={12} xs={0}>
            <div
              style={{
                height: "650px",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1200"
                alt="Premium rental car"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />

              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(to top, rgba(2,6,23,.90), rgba(2,6,23,.08))",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-end",
                  padding: "48px",
                  color: "white",
                }}
              >
                <Title level={2} style={{ color: "white", marginBottom: 8 }}>
                  Premium mobility made simple
                </Title>

                <Text style={{ color: "#e2e8f0", fontSize: 16 }}>
                  Browse premium vehicles, select your preferred dates and
                  manage bookings from one secure platform.
                </Text>
              </div>
            </div>
          </Col>

          <Col lg={12} xs={24}>
            <div
              style={{
                minHeight: "650px",
                padding: "55px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <div style={{ textAlign: "center", marginBottom: 32 }}>
                <CarOutlined
                  style={{
                    fontSize: 48,
                    color: "#2563eb",
                    marginBottom: 12,
                  }}
                />

                <Title
                  style={{
                    margin: 0,
                    color: "#0f172a",
                  }}
                >
                  Welcome to DriveEase
                </Title>

                <Text type="secondary">
                  Login to continue to your car-rental account
                </Text>
              </div>

              <Form
                layout="vertical"
                onFinish={onFinish}
                requiredMark={false}
                size="large"
              >
                <Form.Item
                  label="Username"
                  name="username"
                  rules={[
                    {
                      required: true,
                      message: "Please enter your username",
                    },
                    {
                      min: 3,
                      message: "Username must contain at least 3 characters",
                    },
                  ]}
                >
                  <Input
                    prefix={<UserOutlined />}
                    placeholder="Enter username"
                    autoComplete="username"
                  />
                </Form.Item>

                <Form.Item
                  label="Password"
                  name="password"
                  rules={[
                    {
                      required: true,
                      message: "Please enter your password",
                    },
                  ]}
                >
                  <Input.Password
                    prefix={<LockOutlined />}
                    placeholder="Enter password"
                    autoComplete="current-password"
                  />
                </Form.Item>

                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  block
                  style={{
                    height: 48,
                    marginTop: 8,
                    fontWeight: 600,
                  }}
                >
                  LOGIN
                </Button>

                <div
                  style={{
                    textAlign: "center",
                    marginTop: 24,
                  }}
                >
                  <Text type="secondary">New to DriveEase? </Text>

                  <Link to="/register">
                    <strong>Create an account</strong>
                  </Link>
                </div>
              </Form>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default Login;