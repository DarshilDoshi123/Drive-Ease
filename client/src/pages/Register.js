import React from "react";
import {
  Button,
  Col,
  Form,
  Input,
  Row,
  Typography,
} from "antd";
import { Link, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  CarOutlined,
  LockOutlined,
  UserOutlined,
} from "@ant-design/icons";

import { userRegister } from "../redux/actions/userActions";
import Spinner from "../components/Spinner";

const { Title, Text } = Typography;

function Register() {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.alertsReducer);

  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");

  if (token && user) {
    return <Navigate to="/" replace />;
  }

  const onFinish = (values) => {
    dispatch(
      userRegister({
        username: values.username,
        password: values.password,
      })
    );
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
                height: "690px",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200"
                alt="Sports car available for rental"
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
                }}
              >
                <Title level={2} style={{ color: "white", marginBottom: 8 }}>
                  Start your next journey
                </Title>

                <Text style={{ color: "#e2e8f0", fontSize: 16 }}>
                  Create your account and book premium rental vehicles with a
                  fast and convenient process.
                </Text>
              </div>
            </div>
          </Col>

          <Col lg={12} xs={24}>
            <div
              style={{
                minHeight: "690px",
                padding: "50px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <div style={{ textAlign: "center", marginBottom: 28 }}>
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
                  Create Account
                </Title>

                <Text type="secondary">
                  Join DriveEase and start booking your preferred vehicle
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
                      message: "Please enter a username",
                    },
                    {
                      min: 3,
                      message: "Username must contain at least 3 characters",
                    },
                    {
                      max: 30,
                      message: "Username cannot exceed 30 characters",
                    },
                    {
                      pattern: /^[a-zA-Z0-9_]+$/,
                      message:
                        "Use only letters, numbers and underscores",
                    },
                  ]}
                >
                  <Input
                    prefix={<UserOutlined />}
                    placeholder="Choose a username"
                    autoComplete="username"
                  />
                </Form.Item>

                <Form.Item
                  label="Password"
                  name="password"
                  rules={[
                    {
                      required: true,
                      message: "Please enter a password",
                    },
                    {
                      min: 8,
                      message: "Password must contain at least 8 characters",
                    },
                  ]}
                >
                  <Input.Password
                    prefix={<LockOutlined />}
                    placeholder="Create a secure password"
                    autoComplete="new-password"
                  />
                </Form.Item>

                <Form.Item
                  label="Confirm Password"
                  name="confirmPassword"
                  dependencies={["password"]}
                  rules={[
                    {
                      required: true,
                      message: "Please confirm your password",
                    },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (
                          !value ||
                          getFieldValue("password") === value
                        ) {
                          return Promise.resolve();
                        }

                        return Promise.reject(
                          new Error("Passwords do not match")
                        );
                      },
                    }),
                  ]}
                >
                  <Input.Password
                    prefix={<LockOutlined />}
                    placeholder="Re-enter your password"
                    autoComplete="new-password"
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
                  CREATE ACCOUNT
                </Button>

                <div
                  style={{
                    textAlign: "center",
                    marginTop: 24,
                  }}
                >
                  <Text type="secondary">
                    Already have an account?{" "}
                  </Text>

                  <Link to="/login">
                    <strong>Login here</strong>
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

export default Register;