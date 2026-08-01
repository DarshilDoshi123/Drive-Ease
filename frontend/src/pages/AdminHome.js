import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import DefaultLayout from "../components/DefaultLayout";
import { deleteCar, getAllCars } from "../redux/actions/carsActions";
import { Row, Col, Popconfirm } from "antd";
import Spinner from "../components/Spinner";
import { Link } from "react-router-dom";
import {
  DeleteOutlined,
  EditOutlined,
  PlusCircleOutlined,
  CarOutlined,
  CheckCircleOutlined,
  UserOutlined,
} from "@ant-design/icons";

function AdminHome() {
  const user = JSON.parse(localStorage.getItem("user"));

  // Only Owner / Admin
  if (!user?.isAdmin && user?.username !== "parthpatel79_") {
    window.location.href = "/";
  }

  const dispatch = useDispatch();

  const carsReducer = useSelector((state) => state.carsReducer);

const cars = carsReducer?.cars || [];
  const alertsReducer = useSelector((state) => state.alertsReducer);

const loading = alertsReducer?.loading || false;

  const [totalCars, setTotalCars] = useState([]);

  useEffect(() => {
    dispatch(getAllCars());
  }, []);

  useEffect(() => {
    setTotalCars(cars);
  }, [cars]);

  return (
    <DefaultLayout>

      {loading && <Spinner />}

      {/* Top Banner */}

      <div
        style={{
          background: "linear-gradient(135deg,#2563eb,#4f46e5)",
          padding: "35px",
          borderRadius: "20px",
          color: "white",
          marginBottom: "30px",
        }}
      >
        <Row justify="space-between" align="middle">

          <Col>

            <h1
              style={{
                color: "white",
                marginBottom: "10px",
              }}
            >
              🚗 Admin Dashboard
            </h1>

            <p
              style={{
                color: "white",
                opacity: ".9",
                fontSize: "17px",
              }}
            >
              Manage Cars • Edit Cars • Delete Cars
            </p>

          </Col>

          <Col>

            <Link to="/addcar">

              <button
                className="btn1"
                style={{
                  background: "white",
                  color: "#2563eb",
                  fontWeight: "700",
                }}
              >
                <PlusCircleOutlined /> Add New Car
              </button>

            </Link>

          </Col>

        </Row>
      </div>

      {/* Stats */}

      <Row gutter={[20, 20]} style={{ marginBottom: "30px" }}>

        <Col lg={8} xs={24} style={{ display: "flex" }}>

          <div
            className="bs1"
            style={{
              padding: "25px",
              textAlign: "center",
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <CarOutlined
              style={{
                fontSize: "38px",
                color: "#2563eb",
                marginBottom: "8px"
              }}
            />

            <h2 style={{ fontSize: "28px", fontWeight: "700", margin: "2px 0", color: "#0f172a" }}>
              {totalCars.length}
            </h2>

            <p style={{ color: "#64748b", fontWeight: "500", fontSize: "14px" }}>Total Cars</p>

          </div>

        </Col>

        <Col lg={8} xs={24} style={{ display: "flex" }}>

          <div
            className="bs1"
            style={{
              padding: "25px",
              textAlign: "center",
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <CheckCircleOutlined
              style={{
                fontSize: "38px",
                color: "#16a34a",
                marginBottom: "8px"
              }}
            />

            <h2 style={{ fontSize: "28px", fontWeight: "700", margin: "2px 0", color: "#16a34a" }}>
              {totalCars.length}
            </h2>

            <p style={{ color: "#64748b", fontWeight: "500", fontSize: "14px" }}>Available Cars</p>

          </div>

        </Col>

        <Col lg={8} xs={24} style={{ display: "flex" }}>

          <div
            className="bs1"
            style={{
              padding: "25px",
              textAlign: "center",
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <UserOutlined
              style={{
                fontSize: "38px",
                color: "#f97316",
                marginBottom: "8px"
              }}
            />

            <h2
              style={{
                fontSize: "20px",
                fontWeight: "700",
                margin: "6px 0",
                color: "#f97316",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxWidth: "100%"
              }}
              title={user?.username}
            >
              {user?.username || "Admin"}
            </h2>

            <p style={{ color: "#64748b", fontWeight: "500", fontSize: "14px" }}>Owner</p>

          </div>

        </Col>

      </Row>

      {/* Cars */}

      <Row gutter={[24, 24]}>

        {Array.isArray(totalCars) &&
totalCars.map((car) => (

          <Col lg={6} md={8} sm={12} xs={24} key={car._id} style={{ display: "flex" }}>

            <div
              className="bs1"
              style={{
                borderRadius: "18px",
                overflow: "hidden",
                transition: ".35s",
                display: "flex",
                flexDirection: "column",
                width: "100%",
                height: "100%"
              }}
            >

              <img
                src={car.image || "https://via.placeholder.com/400x250"}
                alt={car.name}
                style={{
                  width: "100%",
                  height: "200px",
                  objectFit: "cover",
                }}
              />

              <div style={{ padding: "18px", display: "flex", flexDirection: "column", flex: 1, justifyContent: "space-between" }}>

                <div>
                  <h3
                    style={{
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis"
                    }}
                    title={car.name}
                  >
                    {car.name}
                  </h3>

                  <p>
                    💰 ₹{car.rentPerHour} / Hour
                  </p>

                  <p>
                    ⛽ {car.fuelType || "-"}
                  </p>

                  <p>
                    👥 {car.capacity || "-"} Seats
                  </p>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: "15px",
                  }}
                >

                  <Link to={`/editcar/${car._id}`}>

                    <button
                      className="btn1"
                      style={{
                        background: "#16a34a",
                      }}
                    >
                      <EditOutlined /> Edit
                    </button>

                  </Link>

                  <Popconfirm
                    title="Delete this Car?"
                    okText="Delete"
                    cancelText="Cancel"
                    onConfirm={() =>
                      dispatch(deleteCar({ carid: car._id }))
                    }
                  >
                    <button
                      className="btn1"
                      style={{
                        background: "#dc2626",
                      }}
                    >
                      <DeleteOutlined /> Delete
                    </button>
                  </Popconfirm>

                </div>

              </div>

            </div>

          </Col>

        ))}

      </Row>

    </DefaultLayout>
  );
}

export default AdminHome;