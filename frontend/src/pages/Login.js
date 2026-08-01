import React from "react";
import { Form, Input, Row, Col } from "antd";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { userLogin } from "../redux/actions/userActions";
import Spinner from "../components/Spinner";
import { UserOutlined, LockOutlined, CarOutlined } from "@ant-design/icons";

function Login() {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.alertsReducer);

  function onFinish(values) {
    dispatch(userLogin(values));
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg,#0f172a,#1e3a8a,#2563eb)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px"
      }}
    >
      {loading && <Spinner />}

      <div className="auth-container">
        <Row>
          {/* Left Supercar Showcase */}
          <Col lg={12} xs={0}>
            <div className="auth-image-box">
              <img
                src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1200"
                alt="Drive Ease Luxury Fleet"
              />
              <div className="auth-image-overlay">
                <h2><CarOutlined style={{ marginRight: 10 }} /> Drive Ease</h2>
                <p>Experience unmatched luxury, comfort, and performance with our premium fleet.</p>
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
                Drive Ease
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
                Welcome back! Please sign in to your account.
              </p>

              <Form layout="vertical" onFinish={onFinish}>
                <Form.Item
                  label={<span style={{ fontWeight: 600, color: "#334155" }}>Username</span>}
                  name="username"
                  rules={[{ required: true, message: "Please enter your username" }]}
                >
                  <Input
                    size="large"
                    prefix={<UserOutlined style={{ color: "#94a3b8", marginRight: 6 }} />}
                    placeholder="Enter your username"
                    style={{ borderRadius: "12px", height: "48px" }}
                  />
                </Form.Item>

                <Form.Item
                  label={<span style={{ fontWeight: 600, color: "#334155" }}>Password</span>}
                  name="password"
                  rules={[{ required: true, message: "Please enter your password" }]}
                >
                  <Input.Password
                    size="large"
                    prefix={<LockOutlined style={{ color: "#94a3b8", marginRight: 6 }} />}
                    placeholder="Enter your password"
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
                  LOGIN
                </button>

                <div style={{ textAlign: "center", marginTop: "25px" }}>
                  <Link
                    to="/register"
                    style={{
                      color: "#2563eb",
                      fontWeight: "600",
                      fontSize: "15px"
                    }}
                  >
                    Don't have an account? <span style={{ textDecoration: "underline" }}>Create New Account</span>
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
