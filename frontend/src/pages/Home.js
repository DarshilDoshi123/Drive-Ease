import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import DefaultLayout from "../components/DefaultLayout";
import { getAllCars } from "../redux/actions/carsActions";
import { Row, Col, DatePicker, Card, Tag } from "antd";
import { Link } from "react-router-dom";
import Spinner from "../components/Spinner";
import moment from "moment";

import {
  CarOutlined,
  ClockCircleOutlined,
  SafetyCertificateOutlined,
  ThunderboltOutlined,
  CalendarOutlined,
} from "@ant-design/icons";

const { RangePicker } = DatePicker;

function Home() {
  const dispatch = useDispatch();

  const carsReducer = useSelector((state) => state.carsReducer);
  const cars = carsReducer?.cars || [];
  const alertsReducer = useSelector((state) => state.alertsReducer);
  const loading = alertsReducer?.loading || false;

  const [totalCars, setTotalCars] = useState([]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    dispatch(getAllCars());
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    setTotalCars(cars);
  }, [cars]);

  function setFilter(values) {
    if (!values) {
      setTotalCars(cars);
      return;
    }

    const selectedFrom = moment(values[0]);
    const selectedTo = moment(values[1]);

    let temp = [];

    for (let car of cars) {
      if (!car.bookedTimeSlots || car.bookedTimeSlots.length === 0) {
        temp.push(car);
      } else {
        let available = true;

        for (let booking of (car.bookedTimeSlots || [])) {
          if (
            selectedFrom.isBetween(booking.from, booking.to) ||
            selectedTo.isBetween(booking.from, booking.to) ||
            moment(booking.from).isBetween(selectedFrom, selectedTo) ||
            moment(booking.to).isBetween(selectedFrom, selectedTo)
          ) {
            available = false;
          }
        }

        if (available) {
          temp.push(car);
        }
      }
    }

    setTotalCars(temp);
  }

  return (
    <DefaultLayout>
      {loading && <Spinner />}

      {/* Hero Banner */}
      <div
        style={{
          background: "linear-gradient(135deg,#2563eb,#4f46e5)",
          color: "white",
          padding: "50px 30px",
          borderRadius: "24px",
          textAlign: "center",
          marginBottom: "30px",
          boxShadow: "0 20px 40px rgba(37, 99, 235, 0.25)"
        }}
      >
        <h1
          style={{
            color: "white",
            fontSize: "46px",
            fontWeight: "800",
            marginBottom: "10px"
          }}
        >
          Drive Ease
        </h1>
        <p
          style={{
            fontSize: "18px",
            opacity: 0.95
          }}
        >
          Luxury • Sports • SUV • Family Cars
        </p>
      </div>

      {/* Stats Cards */}
      <Row gutter={[20, 20]} style={{ marginBottom: 30 }}>
        <Col lg={6} md={12} sm={12} xs={24}>
          <Card className="stats-card">
            <CarOutlined style={{ fontSize: 38, color: "#2563eb" }} />
            <h2>{cars.length}+</h2>
            <p>Total Fleet Cars</p>
          </Card>
        </Col>

        <Col lg={6} md={12} sm={12} xs={24}>
          <Card className="stats-card">
            <ClockCircleOutlined style={{ fontSize: 38, color: "#2563eb" }} />
            <h2>24/7</h2>
            <p>Customer Support</p>
          </Card>
        </Col>

        <Col lg={6} md={12} sm={12} xs={24}>
          <Card className="stats-card">
            <SafetyCertificateOutlined style={{ fontSize: 38, color: "#2563eb" }} />
            <h2>100%</h2>
            <p>Verified & Secure</p>
          </Card>
        </Col>

        <Col lg={6} md={12} sm={12} xs={24}>
          <Card className="stats-card">
            <ThunderboltOutlined style={{ fontSize: 38, color: "#2563eb" }} />
            <h2>Instant</h2>
            <p>Easy Booking</p>
          </Card>
        </Col>
      </Row>

      {/* Date Search Bar Container */}
      <div
        className="bs1"
        style={{
          padding: "25px 30px",
          marginBottom: "35px",
          borderRadius: "20px",
          textAlign: "center",
          background: "#ffffff"
        }}
      >
        <h3 style={{ fontSize: "20px", color: "#0f172a", marginBottom: "15px", fontWeight: "700" }}>
          <CalendarOutlined style={{ color: "#2563eb", marginRight: "8px" }} />
          Select Booking Date & Time
        </h3>

        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <RangePicker
            style={{ width: "100%", height: "48px" }}
            showTime={{ use12Hours: true, format: "hh:mm A" }}
            format="MMM DD YYYY hh:mm A"
            onChange={setFilter}
            placeholder={["Start Date & Time", "End Date & Time"]}
          />
        </div>
      </div>

      {/* Car Grid with Interactive Hover Selection Effects & Equal Height Cards */}
      <Row gutter={[24, 24]} style={{ display: "flex", flexWrap: "wrap" }}>
        {Array.isArray(totalCars) &&
          totalCars.map((car) => (
            <Col lg={6} md={8} sm={12} xs={24} key={car._id} style={{ display: "flex" }}>
              <div
                className="car-card"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  width: "100%",
                  height: "100%"
                }}
              >
                <div>
                  <div style={{ overflow: "hidden", height: "200px" }}>
                    <img
                      src={car.image || "https://via.placeholder.com/400x250"}
                      alt={car.name}
                      className="carimg"
                    />
                  </div>

                  <div style={{ padding: "20px 20px 10px" }}>
                    <h3
                      style={{
                        fontSize: "19px",
                        fontWeight: "700",
                        color: "#0f172a",
                        marginBottom: "12px",
                        minHeight: "52px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        textAlign: "center"
                      }}
                    >
                      {car.name}
                    </h3>

                    <div
                      style={{
                        background: "#f8fafc",
                        padding: "12px",
                        borderRadius: "14px",
                        border: "1px solid #f1f5f9",
                        marginBottom: "15px",
                        textAlign: "center"
                      }}
                    >
                      <Row gutter={[8, 8]} justify="center">
                        <Col span={12}>
                          <Tag color="blue" style={{ width: "100%", textAlign: "center", padding: "4px 0" }}>
                            👥 <b>{car.capacity || "-"}</b> Seats
                          </Tag>
                        </Col>
                        <Col span={12}>
                          <Tag color="green" style={{ width: "100%", textAlign: "center", padding: "4px 0" }}>
                            ⛽ <b>{car.fuelType || "-"}</b>
                          </Tag>
                        </Col>
                        <Col span={24} style={{ marginTop: "4px" }}>
                          <Tag color="gold" style={{ width: "100%", textAlign: "center", padding: "6px 0", fontSize: "14px" }}>
                            💰 ₹ <b>{car.rentPerHour}</b> / Hour
                          </Tag>
                        </Col>
                      </Row>
                    </div>
                  </div>
                </div>

                <div style={{ padding: "0 20px 20px" }}>
                  <Link to={`/booking/${car._id}`} style={{ width: "100%", display: "block" }}>
                    <button
                      className="btn1"
                      style={{
                        width: "100%",
                        fontSize: "15px",
                        padding: "11px 0"
                      }}
                    >
                      🚗 Book Now
                    </button>
                  </Link>
                </div>
              </div>
            </Col>
          ))}
      </Row>
    </DefaultLayout>
  );
}

export default Home;