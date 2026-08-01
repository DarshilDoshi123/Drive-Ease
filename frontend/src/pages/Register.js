import React, { useState } from "react";
import { Form, Input, message, Spin, Row, Col } from "antd";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { UserOutlined, LockOutlined, CarOutlined } from "@ant-design/icons";

function Register() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      setLoading(true);

      const response = await axios.post(
        "https://car-rental-system-dkt6.onrender.com/api/users/register",
        {
          username: values.username,
          password: values.password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Register response:", response.data);

      message.success("Registration successful");

      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (error) {
      console.error("Registration error:", error);
      console.error("Server response:", error.response?.data);

      message.error(
        error.response?.data?.message ||
          "Registration failed. Check server connection."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0f172a, #1e3a8a, #2563eb)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
      }}
    >
      <Spin spinning={loading} size="large">
        <div className="auth-container">
          <Row>
            {/* Left Supercar Showcase */}
            <Col lg={12} xs={0}>
              <div className="auth-image-box">
                <img
                  src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200"
                  alt="Drive Ease Registration"
                />
                <div className="auth-image-overlay">
                  <h2><CarOutlined style={{ marginRight: 10 }} /> Drive Ease</h2>
                  <p>Join thousands of satisfied drivers. Rent your dream vehicle in seconds.</p>
                </div>
              </div>
            </Col>

            {/* Right Form Card */}
            <Col lg={12} xs={24}>
              <div style={{ padding: "60px 45px" }}>
                <h1
                  style={{
                    fontSize: "42px",
                    fontWeight: "800",
                    textAlign: "center",
                    marginBottom: "8px",
                    color: "#2563eb",
                    letterSpacing: "-0.5px"
                  }}
                >
                  Create Account
                </h1>

                <p
                  style={{
                    textAlign: "center",
                    color: "#64748b",
                    marginBottom: "35px",
                    fontSize: "15px",
                    fontWeight: "500"
                  }}
                >
                  Enter your details to create your new account.
                </p>

                <Form layout="vertical" onFinish={onFinish}>
                  <Form.Item
                    label={<span style={{ fontWeight: 600, color: "#334155" }}>Username</span>}
                    name="username"
                    rules={[
                      {
                        required: true,
                        message: "Please enter your username",
                      },
                    ]}
                  >
                    <Input
                      size="large"
                      prefix={<UserOutlined style={{ color: "#94a3b8", marginRight: 6 }} />}
                      placeholder="Choose a username"
                      style={{ borderRadius: "12px", height: "48px" }}
                    />
                  </Form.Item>

                  <Form.Item
                    label={<span style={{ fontWeight: 600, color: "#334155" }}>Password</span>}
                    name="password"
                    rules={[
                      {
                        required: true,
                        message: "Please enter your password",
                      },
                    ]}
                  >
                    <Input.Password
                      size="large"
                      prefix={<LockOutlined style={{ color: "#94a3b8", marginRight: 6 }} />}
                      placeholder="Create a password"
                      style={{ borderRadius: "12px", height: "48px" }}
                    />
                  </Form.Item>

                  <button
                    className="btn1"
                    style={{
                      width: "100%",
                      height: "48px",
                      marginTop: "15px",
                      fontSize: "16px"
                    }}
                  >
                    REGISTER
                  </button>

                  <div style={{ textAlign: "center", marginTop: "25px" }}>
                    <Link
                      to="/login"
                      style={{
                        color: "#2563eb",
                        fontWeight: "600",
                        fontSize: "15px"
                      }}
                    >
                      Already have an account? <span style={{ textDecoration: "underline" }}>Sign In</span>
                    </Link>
                  </div>
                </Form>
              </div>
            </Col>
          </Row>
        </div>
      </Spin>
    </div>
  );
}

export default Register;