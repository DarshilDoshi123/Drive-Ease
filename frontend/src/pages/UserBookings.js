import React, {
  useEffect,
  useMemo,
  useState,
} from "react";
import { getCarImageUrl, handleImageError } from "../utils/constants";

import {
  Button,
  Card,
  Empty,
  Popconfirm,
  Tag,
  Typography,
} from "antd";

import {
  CalendarOutlined,
  CarOutlined,
  ClockCircleOutlined,
  DollarCircleOutlined,
  EyeOutlined,
  ReloadOutlined,
  StarOutlined,
} from "@ant-design/icons";

import {
  Link,
} from "react-router-dom";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import moment from "moment";

import DefaultLayout from "../components/DefaultLayout";
import Spinner from "../components/Spinner";
import ReviewModal from "../components/ReviewModal";

import {
  cancelBooking,
  getAllBookings,
} from "../redux/actions/bookingActions";

import "./UserBookings.css";

const {
  Title,
  Text,
  Paragraph,
} = Typography;

const formatMoney = (amount) =>
  Number(amount || 0).toLocaleString("en-IN");

function UserBookings() {
  const dispatch = useDispatch();

  const bookings = useSelector(
    (state) => state.bookingsReducer?.bookings || []
  );

  const loading = useSelector(
    (state) => state.alertsReducer?.loading || false
  );

  const [filter, setFilter] = useState("all");
  const [reviewOpen, setReviewOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    dispatch(getAllBookings());
  }, [dispatch]);

  const userBookings = useMemo(
    () =>
      bookings.filter(
        (booking) =>
          booking.user === user?._id ||
          booking.user?._id === user?._id
      ),
    [bookings, user?._id]
  );

  const getStatus = (booking) => {
    if (booking.bookingStatus === "cancelled") {
      return "cancelled";
    }

    const now = Date.now();
    const from = new Date(booking.bookedTimeSlots?.from).getTime();
    const to = new Date(booking.bookedTimeSlots?.to).getTime();

    if (Number.isNaN(from) || Number.isNaN(to)) {
      return "upcoming";
    }

    if (now < from) {
      return "upcoming";
    }

    if (now >= from && now <= to) {
      return "ongoing";
    }

    return "completed";
  };

  const filteredBookings = useMemo(() => {
    if (filter === "all") {
      return userBookings;
    }

    return userBookings.filter(
      (booking) => getStatus(booking) === filter
    );
  }, [filter, userBookings]);

  const getStatusTag = (status) => {
    const statusDetails = {
      upcoming: { color: "processing", label: "Upcoming" },
      ongoing: { color: "warning", label: "Ongoing" },
      completed: { color: "success", label: "Completed" },
      cancelled: { color: "error", label: "Cancelled" },
    };

    const details = statusDetails[status] || statusDetails.upcoming;

    return (
      <Tag color={details.color} className="booking-status-tag">
        {details.label}
      </Tag>
    );
  };

  const getCarName = (booking) => {
    const name = booking.car?.name?.trim();

    if (
      name &&
      !name.startsWith("http://") &&
      !name.startsWith("https://")
    ) {
      return name;
    }

    return (
      [booking.car?.brand, booking.car?.model]
        .filter(Boolean)
        .join(" ") || "Rental Car"
    );
  };

  const openReview = (booking) => {
    setSelectedBooking(booking);
    setReviewOpen(true);
  };

  return (
    <DefaultLayout>
      {loading && <Spinner />}

      <section className="user-bookings-container">
        {/* Header Section */}
        <div className="bookings-header">
          <div className="header-info">
            <Text className="section-badge">YOUR JOURNEYS</Text>
            <Title level={2} className="page-title">
              🚗 My Trips & Bookings
            </Title>

            <Paragraph className="page-description">
              Manage your upcoming trips, ongoing rentals, completed journeys, and cancelled bookings in one place.
            </Paragraph>
          </div>
        </div>

        {/* Filter Controls & Refresh Bar */}
        <div className="bookings-controls-bar">
          <div className="filter-tabs-group">
            {[
              { key: "all", label: "All" },
              { key: "upcoming", label: "Upcoming" },
              { key: "ongoing", label: "Ongoing" },
              { key: "completed", label: "Completed" },
              { key: "cancelled", label: "Cancelled" },
            ].map((item) => {
              const count =
                item.key === "all"
                  ? userBookings.length
                  : userBookings.filter((b) => getStatus(b) === item.key).length;

              return (
                <Button
                  key={item.key}
                  type={filter === item.key ? "primary" : "default"}
                  danger={item.key === "cancelled" && filter === item.key}
                  className={`filter-pill-btn ${filter === item.key ? "active" : ""}`}
                  onClick={() => setFilter(item.key)}
                >
                  {item.label}
                  <span className="filter-count-badge">{count}</span>
                </Button>
              );
            })}
          </div>

          <Button
            icon={<ReloadOutlined />}
            className="refresh-action-btn"
            onClick={() => dispatch(getAllBookings())}
          >
            Refresh
          </Button>
        </div>

        {/* Bookings Grid or Empty State */}
        {filteredBookings.length === 0 ? (
          <Card bordered={false} className="empty-bookings-card">
            <Empty description="No bookings found in this category">
              <Link to="/">
                <Button type="primary" icon={<CarOutlined />} size="large">
                  Explore Available Cars
                </Button>
              </Link>
            </Empty>
          </Card>
        ) : (
          <div className="bookings-grid-container">
            {filteredBookings.map((booking) => {
              const status = getStatus(booking);
              const carName = getCarName(booking);

              return (
                <Card
                  key={booking._id}
                  bordered={false}
                  className={`booking-card ${status}`}
                  cover={
                    <div className="booking-card-image-wrapper">
                      <img
                        src={getCarImageUrl(booking.car)}
                        alt={carName}
                        className="booking-card-img"
                        onError={handleImageError}
                      />
                      <div className="image-overlay-gradient" />
                      {getStatusTag(status)}
                    </div>
                  }
                >
                  <div className="booking-card-body">
                    <div className="booking-card-title-section">
                      <Title level={4} className="booking-car-title">
                        {carName}
                      </Title>
                      <Text type="secondary" className="booking-id-tag">
                        Booking #{booking._id?.slice(-8)}
                      </Text>
                    </div>

                    <div className="booking-card-details">
                      <div className="detail-row">
                        <DollarCircleOutlined className="detail-icon" />
                        <span className="detail-label">Rate:</span>
                        <strong className="detail-value rate-value">
                          ₹ {formatMoney(booking.rentPerHour || booking.car?.rentPerHour)} / hr
                        </strong>
                      </div>

                      <div className="detail-row">
                        <DollarCircleOutlined className="detail-icon" />
                        <span className="detail-label">Total Amount:</span>
                        <strong className="detail-value total-amount">
                          ₹ {formatMoney(booking.totalAmount)}
                        </strong>
                      </div>

                      <div className="detail-row">
                        <CalendarOutlined className="detail-icon" />
                        <span className="detail-label">Pickup:</span>
                        <strong className="detail-value">
                          {moment(booking.bookedTimeSlots?.from).format("DD MMM YYYY")}
                        </strong>
                      </div>

                      <div className="detail-row">
                        <ClockCircleOutlined className="detail-icon" />
                        <span className="detail-label">Return:</span>
                        <strong className="detail-value">
                          {moment(booking.bookedTimeSlots?.to).format("DD MMM YYYY")}
                        </strong>
                      </div>
                    </div>

                    <div className="booking-card-actions">
                      {status === "upcoming" && (
                        <>
                          <Link to={`/booking-success/${booking._id}`} className="action-link-btn">
                            <Button block icon={<EyeOutlined />} className="btn-secondary">
                              Receipt
                            </Button>
                          </Link>

                          <Popconfirm
                            title="Cancel this booking?"
                            description="Are you sure you want to cancel this booking?"
                            okText="Cancel Booking"
                            cancelText="Keep Booking"
                            okButtonProps={{ danger: true }}
                            onConfirm={() => dispatch(cancelBooking(booking._id))}
                          >
                            <Button danger block className="btn-danger">
                              Cancel
                            </Button>
                          </Popconfirm>
                        </>
                      )}

                      {status === "ongoing" && (
                        <Link to={`/booking-success/${booking._id}`} className="action-link-btn full-width">
                          <Button type="primary" block icon={<EyeOutlined />} className="btn-primary">
                            View Trip
                          </Button>
                        </Link>
                      )}

                      {status === "completed" && (
                        <>
                          <Button
                            type="primary"
                            block
                            icon={<StarOutlined />}
                            onClick={() => openReview(booking)}
                            className="btn-primary"
                          >
                            Leave Review
                          </Button>

                          {booking.car?._id && (
                            <Link to={`/bookingcar/${booking.car._id}`} className="action-link-btn">
                              <Button block icon={<ReloadOutlined />} className="btn-secondary">
                                Book Again
                              </Button>
                            </Link>
                          )}
                        </>
                      )}

                      {status === "cancelled" && booking.car?._id && (
                        <Link to={`/bookingcar/${booking.car._id}`} className="action-link-btn full-width">
                          <Button type="primary" block icon={<ReloadOutlined />} className="btn-primary">
                            Book Again
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        <ReviewModal
          open={reviewOpen}
          bookingId={selectedBooking?._id}
          onClose={() => {
            setReviewOpen(false);
            setSelectedBooking(null);
          }}
          onSuccess={() => {
            setReviewOpen(false);
            setSelectedBooking(null);
          }}
        />
      </section>
    </DefaultLayout>
  );
}

export default UserBookings;