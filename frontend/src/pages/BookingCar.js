import { Col, Row, Divider, DatePicker, Checkbox, Modal, Tag } from "antd";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import DefaultLayout from "../components/DefaultLayout";
import Spinner from "../components/Spinner";
import { getAllCars } from "../redux/actions/carsActions";
import moment from "moment";
import { bookCar } from "../redux/actions/bookingActions";
import StripeCheckout from "react-stripe-checkout";
import { useLoaderData } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";

import {
  CarOutlined,
  SafetyCertificateOutlined,
  ClockCircleOutlined,
  ThunderboltOutlined,
  DollarCircleOutlined,
} from "@ant-design/icons";

AOS.init();

const { RangePicker } = DatePicker;

function BookingCar() {
  const match = useLoaderData();
  const carsReducer = useSelector((state) => state.carsReducer);
  const cars = carsReducer?.cars || [];
  const alertsReducer = useSelector((state) => state.alertsReducer);
  const loading = alertsReducer?.loading || false;
  const dispatch = useDispatch();

  const [car, setcar] = useState({});
  const [from, setFrom] = useState();
  const [to, setTo] = useState();
  const [totalHours, setTotalHours] = useState(0);
  const [driver, setdriver] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (cars.length === 0) {
      dispatch(getAllCars());
    } else {
      setcar(cars.find((o) => o._id === match));
    }
  }, [cars]);

  const rentPerHour = car.rentPerHour || 500;
  const fuelType = car.fuelType || "Petrol";
  const capacity = car.capacity || 5;

  useEffect(() => {
    let amount = totalHours * rentPerHour;
    if (driver) {
      amount += totalHours * 30;
    }
    setTotalAmount(amount);
  }, [driver, totalHours, rentPerHour]);

  function selectTimeSlots(values) {
    if (!values || !values[0] || !values[1]) {
      setFrom(null);
      setTo(null);
      setTotalHours(0);
      return;
    }

    const startMom = moment(values[0]);
    const endMom = moment(values[1]);

    const formattedFrom = startMom.format("MMM DD YYYY, hh:mm A");
    const formattedTo = endMom.format("MMM DD YYYY, hh:mm A");
    const hours = Math.max(1, endMom.diff(startMom, "hours"));

    setFrom(formattedFrom);
    setTo(formattedTo);
    setTotalHours(hours);
  }

  function onToken(token) {
    const reqObj = {
      token,
      user: JSON.parse(localStorage.getItem("user"))._id,
      car: car._id,
      totalHours,
      totalAmount,
      driverRequired: driver,
      bookedTimeSlots: {
        from,
        to,
      },
    };

    dispatch(bookCar(reqObj));
  }

  return (
    <DefaultLayout>
      {loading && <Spinner />}

      <Row
        gutter={[35, 35]}
        justify="center"
        align="top"
        style={{
          padding: "20px 0",
        }}
      >
        {/* LEFT SIDE */}
        <Col lg={12} md={24} sm={24} xs={24}>
          <img
            src={car.image || "https://via.placeholder.com/400x250"}
            alt={car.name}
            className="carimg2"
            data-aos="zoom-in"
          />

          <div
            className="bs1"
            style={{
              marginTop: 20,
              padding: 25,
              borderRadius: "18px"
            }}
          >
            <h2
              style={{
                color: "#2563eb",
                marginBottom: 15,
                fontSize: "26px",
                fontWeight: "700"
              }}
            >
              {car.name}
            </h2>

            <Divider />

            <Row gutter={[12, 12]}>
              <Col span={12}>
                <Tag color="blue" style={{ padding: "6px 12px", width: "100%", textAlign: "center", fontSize: "14px" }}>
                  🚗 {capacity} Seats
                </Tag>
              </Col>

              <Col span={12}>
                <Tag color="green" style={{ padding: "6px 12px", width: "100%", textAlign: "center", fontSize: "14px" }}>
                  ⛽ {fuelType}
                </Tag>
              </Col>

              <Col span={12}>
                <Tag color="gold" style={{ padding: "6px 12px", width: "100%", textAlign: "center", fontSize: "14px" }}>
                  💰 ₹ {rentPerHour}/Hour
                </Tag>
              </Col>

              <Col span={12}>
                <Tag color="purple" style={{ padding: "6px 12px", width: "100%", textAlign: "center", fontSize: "14px" }}>
                  ⭐ Premium
                </Tag>
              </Col>
            </Row>

            <Divider />

            <Row gutter={[15, 15]}>
              <Col span={8} style={{ textAlign: "center" }}>
                <SafetyCertificateOutlined
                  style={{
                    fontSize: 32,
                    color: "#16a34a",
                    marginBottom: "4px"
                  }}
                />
                <p style={{ fontSize: "13px", fontWeight: "600", color: "#64748b" }}>Safe Ride</p>
              </Col>

              <Col span={8} style={{ textAlign: "center" }}>
                <ClockCircleOutlined
                  style={{
                    fontSize: 32,
                    color: "#2563eb",
                    marginBottom: "4px"
                  }}
                />
                <p style={{ fontSize: "13px", fontWeight: "600", color: "#64748b" }}>24/7 Support</p>
              </Col>

              <Col span={8} style={{ textAlign: "center" }}>
                <ThunderboltOutlined
                  style={{
                    fontSize: 32,
                    color: "#f97316",
                    marginBottom: "4px"
                  }}
                />
                <p style={{ fontSize: "13px", fontWeight: "600", color: "#64748b" }}>Instant Booking</p>
              </Col>
            </Row>
          </div>
        </Col>

        {/* RIGHT SIDE */}
        <Col lg={12} md={24} sm={24} xs={24}>
          <div
            className="bs1"
            style={{
              padding: 30,
              borderRadius: "18px"
            }}
          >
            <h2
              style={{
                color: "#2563eb",
                fontSize: "24px",
                fontWeight: "700"
              }}
            >
              <CarOutlined /> Book Your Ride
            </h2>

            <Divider />

            <p
              style={{
                fontWeight: 600,
                color: "#334155",
                marginBottom: 10
              }}
            >
              Select Pickup & Return Time
            </p>

            <RangePicker
              showTime={{ use12Hours: true, format: "hh:mm A" }}
              format="MMM DD YYYY hh:mm A"
              style={{ width: "100%", height: "46px" }}
              onChange={selectTimeSlots}
              placeholder={["Start Date & Time", "End Date & Time"]}
            />

            <button
              className="btn1"
              style={{
                width: "100%",
                marginTop: 20,
                background: "linear-gradient(90deg, #64748b, #475569)",
                boxShadow: "none"
              }}
              onClick={() => setShowModal(true)}
            >
              View Booked Slots
            </button>

            {from && to && (
              <>
                <Divider />

                <h3
                  style={{
                    color: "#2563eb",
                    marginBottom: 15,
                    fontSize: "20px"
                  }}
                >
                  Booking Summary
                </h3>

                <div className="booking-info">
                  <span>Total Hours</span>
                  <b>{totalHours} hrs</b>
                </div>

                <div className="booking-info">
                  <span>Rent / Hour</span>
                  <b>₹ {rentPerHour}</b>
                </div>

                <div className="booking-info">
                  <span>Pickup Date & Time</span>
                  <b>{from}</b>
                </div>

                <div className="booking-info">
                  <span>Return Date & Time</span>
                  <b>{to}</b>
                </div>

                <Divider />

                <Checkbox
                  onChange={(e) => setdriver(e.target.checked)}
                  style={{ fontSize: "15px", fontWeight: "600" }}
                >
                  Need Driver (+₹30/hour)
                </Checkbox>

                <Divider />

                <div style={{ textAlign: "center", margin: "20px 0" }}>
                  <span style={{ fontSize: "16px", color: "#64748b", display: "block" }}>Total Amount Payable</span>
                  <h2
                    style={{
                      color: "#16a34a",
                      fontSize: "36px",
                      fontWeight: "800",
                      marginTop: "5px"
                    }}
                  >
                    <DollarCircleOutlined /> ₹ {totalAmount}
                  </h2>
                </div>

                <StripeCheckout
                  shippingAddress
                  token={onToken}
                  currency="inr"
                  amount={totalAmount * 100}
                  stripeKey="pk_test_51NFtVGSAZAXtdYSkpJntFLfuU3dQNlk1BVqldJWCWQUyDqAtoE1wHVhRCB2GEnGurggdZOd1L08afXnaMN0H7qcO00yUPQevQp"
                >
                  <button
                    className="btn1"
                    style={{
                      width: "100%",
                      fontSize: "18px",
                      padding: "14px"
                    }}
                  >
                    💳 Proceed To Payment
                  </button>
                </StripeCheckout>
              </>
            )}
          </div>
        </Col>
      </Row>

      <Modal
        title="Booked Time Slots"
        open={showModal}
        footer={null}
        onCancel={() => setShowModal(false)}
      >
        {car.bookedTimeSlots?.length > 0 ? (
          car.bookedTimeSlots.map((slot, index) => (
            <Tag
              key={index}
              color="red"
              style={{
                marginBottom: 10,
                padding: 10,
                width: "100%",
                fontSize: "14px"
              }}
            >
              {slot.from} → {slot.to}
            </Tag>
          ))
        ) : (
          <p style={{ textAlign: "center", padding: "20px", color: "#64748b" }}>No Bookings Yet for this vehicle.</p>
        )}
      </Modal>
    </DefaultLayout>
  );
}

export default BookingCar;