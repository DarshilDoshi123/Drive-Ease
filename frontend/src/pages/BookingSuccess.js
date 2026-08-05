import React, {
  useEffect,
  useState,
} from "react";
import { getCarImageUrl, handleImageError } from "../utils/constants";
import {
  Button,
  Card,
  Col,
  Divider,
  Empty,
  Row,
  Spin,
  Tag,
  Typography,
} from "antd";
import {
  CalendarOutlined,
  CarOutlined,
  CheckCircleFilled,
  ClockCircleOutlined,
  CreditCardOutlined,
  EnvironmentOutlined,
  HomeOutlined,
  PrinterOutlined,
  SafetyCertificateOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Link,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { useDispatch } from "react-redux";

import DefaultLayout from "../components/DefaultLayout";
import { getBookingById } from "../redux/actions/bookingActions";

const { Title, Text, Paragraph } = Typography;

const formatMoney = (amount) =>
  Number(amount || 0).toLocaleString("en-IN");

const formatDateTime = (value) => {
  if (!value) {
    return "-";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

function BookingSuccess() {
  const { bookingId } = useParams();

  const dispatch = useDispatch();

  const [searchParams] = useSearchParams();

  const [booking, setBooking] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const loadBooking = async () => {
      const bookingData = await dispatch(
        getBookingById(bookingId)
      );

      setBooking(bookingData);
      setLoading(false);
    };

    loadBooking();
  }, [bookingId, dispatch]);

  useEffect(() => {
    if (
      booking &&
      searchParams.get("print") === "true"
    ) {
      const timer = setTimeout(() => {
        window.print();
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [booking, searchParams]);

  if (loading) {
    return (
      <DefaultLayout>
        <div className="booking-success-loading">
          <Spin size="large" />
        </div>
      </DefaultLayout>
    );
  }

  if (!booking) {
    return (
      <DefaultLayout>
        <Card className="booking-receipt-card">
          <Empty description="Booking not found">
            <Link to="/userbookings">
              <Button type="primary">
                My Bookings
              </Button>
            </Link>
          </Empty>
        </Card>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      <section className="booking-success-page">
        <div className="booking-success-header">
          <CheckCircleFilled />

          <Title>
            Booking Confirmed
          </Title>

          <Paragraph>
            Your reservation has been created
            successfully.
          </Paragraph>

          <Tag color="green">
            {booking.bookingStatus}
          </Tag>
        </div>

        <Card
          bordered={false}
          className="booking-receipt-card"
        >
          <div className="receipt-top">
            <div className="receipt-brand">
              <Title level={2}>
                DriveEase
              </Title>

              <Text type="secondary">
                Official Rental Invoice
              </Text>
            </div>

            <div className="receipt-meta">
              <div>
                <Text type="secondary">Invoice Date: </Text>
                <strong>
                  {formatDateTime(booking.createdAt || booking.bookedTimeSlots?.from)}
                </strong>
              </div>

              <div>
                <Text type="secondary">Booking ID: </Text>
                <strong>{booking._id}</strong>
              </div>

              <div style={{ marginTop: 4 }}>
                <Tag color={booking.paymentStatus === "Paid" ? "green" : "blue"}>
                  {booking.paymentStatus === "Paid" ? "PAID" : booking.bookingStatus || "CONFIRMED"}
                </Tag>
              </div>
            </div>
          </div>

          <Divider style={{ margin: "12px 0" }} />

          <Row gutter={[24, 16]} className="receipt-billing-section">
            <Col sm={12} xs={24}>
              <div className="billing-box">
                <Title level={5}>Billed To</Title>
                <p><strong>Customer:</strong> {booking.user?.username || booking.user?.name || "Customer"}</p>
                <p><strong>Email:</strong> {booking.customerEmail || booking.user?.email || "N/A"}</p>
                <p><strong>Mobile:</strong> {booking.customerMobile || booking.user?.phone || booking.user?.mobile || booking.user?.phoneNumber || "N/A"}</p>
              </div>
            </Col>

            <Col sm={12} xs={24}>
              <div className="billing-box company-box">
                <Title level={5}>Issued By</Title>
                <p><strong>DriveEase Rental Services</strong></p>
                <p><strong>Support Email:</strong> support@driveease.com</p>
                <p><strong>Contact Helpline:</strong> +91 98765 43210</p>
              </div>
            </Col>
          </Row>

          <Divider style={{ margin: "12px 0" }} />

          <Row gutter={[24, 16]}>
            <Col lg={8} xs={24}>
              <div className="receipt-car-image">
                <img
                  src={getCarImageUrl(booking.car)}
                  alt={
                    booking.car?.name ||
                    "Rental car"
                  }
                  onError={handleImageError}
                />
              </div>
            </Col>

            <Col lg={16} xs={24}>
              <Title level={4} style={{ marginTop: 0, marginBottom: 8 }}>
                {booking.car?.name ||
                  "Rental Car"}
              </Title>

              <div className="receipt-details-grid">
                <div>
                  <CalendarOutlined />
                  <span>Pickup</span>
                  <strong>
                    {formatDateTime(
                      booking.bookedTimeSlots
                        ?.from
                    )}
                  </strong>
                </div>

                <div>
                  <CalendarOutlined />
                  <span>Return</span>
                  <strong>
                    {formatDateTime(
                      booking.bookedTimeSlots
                        ?.to
                    )}
                  </strong>
                </div>

                <div>
                  <ClockCircleOutlined />
                  <span>Duration</span>
                  <strong>
                    {booking.totalHours} hours
                  </strong>
                </div>

                <div>
                  <EnvironmentOutlined />
                  <span>Pickup Location</span>
                  <strong>
                    {booking.pickupLocation || booking.car?.location || "City Center Hub"}
                  </strong>
                </div>

                <div>
                  <UserOutlined />
                  <span>Driver</span>
                  <strong>
                    {booking.driverRequired
                      ? "Professional Driver"
                      : "Self Drive"}
                  </strong>
                </div>

                <div>
                  <CreditCardOutlined />
                  <span>Payment Method</span>
                  <strong>
                    {booking.paymentMethod ===
                    "card"
                      ? "Card Payment"
                      : "Pay at Pickup"}
                  </strong>
                </div>

                <div>
                  <SafetyCertificateOutlined />
                  <span>Payment Status</span>
                  <strong>
                    {booking.paymentStatus}
                  </strong>
                </div>
              </div>
            </Col>
          </Row>

          <Divider style={{ margin: "12px 0" }} />

          <Title level={5} style={{ marginTop: 0, marginBottom: 8 }}>
            Price Breakdown
          </Title>

          <div className="receipt-price-list">
            <div>
              <span>
                Base Rent (
                {booking.totalHours} × ₹
                {formatMoney(
                  booking.rentPerHour
                )}
                )
              </span>

              <strong>
                ₹
                {formatMoney(
                  booking.baseAmount
                )}
              </strong>
            </div>

            <div>
              <span>Driver Charge</span>

              <strong>
                ₹
                {formatMoney(
                  booking.driverCharge
                )}
              </strong>
            </div>

            <div>
              <span>Service Fee</span>

              <strong>
                ₹
                {formatMoney(
                  booking.serviceFee
                )}
              </strong>
            </div>
          </div>

          <div className="receipt-grand-total">
            <span>Total Amount</span>

            <strong>
              ₹
              {formatMoney(
                booking.totalAmount
              )}
            </strong>
          </div>

          {booking.transactionId && (
            <div className="receipt-transaction">
              <Text type="secondary">
                Transaction ID:
              </Text>{" "}
              <strong>
                {booking.transactionId}
              </strong>
            </div>
          )}

          <div className="receipt-actions no-print">
            <Button
              size="large"
              icon={<PrinterOutlined />}
              onClick={() => window.print()}
            >
              Print Receipt
            </Button>

            <Link to="/userbookings">
              <Button
                size="large"
                icon={<CarOutlined />}
              >
                My Bookings
              </Button>
            </Link>

            <Link to="/">
              <Button
                type="primary"
                size="large"
                icon={<HomeOutlined />}
              >
                Return Home
              </Button>
            </Link>
          </div>
        </Card>
      </section>
    </DefaultLayout>
  );
}

export default BookingSuccess;