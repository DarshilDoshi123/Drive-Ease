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
            <div>
              <Title level={2}>
                DriveEase
              </Title>

              <Text>
                Premium Car Rental
              </Text>
            </div>

            <div className="receipt-number">
              <Text type="secondary">
                Booking ID
              </Text>

              <strong>{booking._id}</strong>
            </div>
          </div>

          <Divider />

          <Row gutter={[25, 25]}>
            <Col lg={9} xs={24}>
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

            <Col lg={15} xs={24}>
              <Title level={3}>
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
                  <span>Payment</span>
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

          <Divider />

          <Title level={4}>
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
                Transaction ID
              </Text>

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