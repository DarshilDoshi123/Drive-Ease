import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Button,
  Card,
  Col,
  Empty,
  Popconfirm,
  Row,
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
  Number(amount || 0).toLocaleString(
    "en-IN"
  );

function UserBookings() {
  const dispatch = useDispatch();

  const bookings = useSelector(
    (state) =>
      state.bookingsReducer?.bookings || []
  );

  const loading = useSelector(
    (state) =>
      state.alertsReducer?.loading || false
  );

  const [filter, setFilter] =
    useState("all");

  const [reviewOpen, setReviewOpen] =
    useState(false);

  const [
    selectedBooking,
    setSelectedBooking,
  ] = useState(null);

  const user = JSON.parse(
    localStorage.getItem("user")
  );

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
    if (
      booking.bookingStatus === "cancelled"
    ) {
      return "cancelled";
    }

    const now = Date.now();

    const from = new Date(
      booking.bookedTimeSlots?.from
    ).getTime();

    const to = new Date(
      booking.bookedTimeSlots?.to
    ).getTime();

    if (
      Number.isNaN(from) ||
      Number.isNaN(to)
    ) {
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
      (booking) =>
        getStatus(booking) === filter
    );
  }, [filter, userBookings]);

  const getStatusTag = (status) => {
    const statusDetails = {
      upcoming: {
        color: "blue",
        label: "Upcoming",
      },

      ongoing: {
        color: "orange",
        label: "Ongoing",
      },

      completed: {
        color: "green",
        label: "Completed",
      },

      cancelled: {
        color: "red",
        label: "Cancelled",
      },
    };

    const details =
      statusDetails[status] ||
      statusDetails.upcoming;

    return (
      <Tag
        color={details.color}
        className="trip-status-tag"
      >
        {details.label}
      </Tag>
    );
  };

  const getCarName = (booking) => {
    const name =
      booking.car?.name?.trim();

    if (
      name &&
      !name.startsWith("http://") &&
      !name.startsWith("https://")
    ) {
      return name;
    }

    return (
      [
        booking.car?.brand,
        booking.car?.model,
      ]
        .filter(Boolean)
        .join(" ") ||
      "Rental Car"
    );
  };

  const openReview = (booking) => {
    setSelectedBooking(booking);
    setReviewOpen(true);
  };

  return (
    <DefaultLayout>
      {loading && <Spinner />}

      <section className="my-trips-page">
        <div className="my-trips-header">
          <div>
            <Text className="section-label">
              YOUR JOURNEYS
            </Text>

            <Title level={1}>
              🚗 My Trips
            </Title>

            <Paragraph>
              Manage your upcoming, ongoing,
              completed and cancelled journeys.
            </Paragraph>
          </div>

          <Button
            icon={<ReloadOutlined />}
            onClick={() =>
              dispatch(getAllBookings())
            }
          >
            Refresh
          </Button>
        </div>

        <div className="trip-filter-buttons">
          {[
            "all",
            "upcoming",
            "ongoing",
            "completed",
            "cancelled",
          ].map((item) => (
            <Button
              key={item}
              type={
                filter === item
                  ? "primary"
                  : "default"
              }
              danger={
                item === "cancelled" &&
                filter === item
              }
              onClick={() =>
                setFilter(item)
              }
            >
              {item.charAt(0).toUpperCase() +
                item.slice(1)}
            </Button>
          ))}
        </div>

        {filteredBookings.length === 0 ? (
          <Card
            bordered={false}
            className="trips-empty-card"
          >
            <Empty
              description="No trips found"
            >
              <Link to="/">
                <Button
                  type="primary"
                  icon={<CarOutlined />}
                >
                  Explore Cars
                </Button>
              </Link>
            </Empty>
          </Card>
        ) : (
          <Row
            gutter={[20, 20]}
            className="trips-grid"
          >
            {filteredBookings.map(
              (booking) => {
                const status =
                  getStatus(booking);

                const carName =
                  getCarName(booking);

                return (
                  <Col
                    xl={8}
                    lg={12}
                    md={12}
                    xs={24}
                    key={booking._id}
                    className="trip-card-column"
                  >
                    <Card
                      bordered={false}
                      className={`modern-trip-card ${status}`}
                      cover={
                        <div className="trip-image-wrapper">
                          <img
                            src={
                              booking.car?.image ||
                              "https://placehold.co/800x500?text=DriveEase"
                            }
                            alt={carName}
                          />

                          <div className="trip-image-overlay" />

                          {getStatusTag(status)}
                        </div>
                      }
                    >
                      <div className="trip-card-content">
                        <div>
                          <Title
                            level={3}
                            className="trip-car-name"
                          >
                            {carName}
                          </Title>

                          <Text
                            type="secondary"
                            className="trip-booking-id"
                          >
                            Booking #
                            {booking._id?.slice(-8)}
                          </Text>

                          <div className="trip-details-grid">
                            <div>
                              <DollarCircleOutlined />

                              <span>Rent</span>

                              <strong>
                                ₹
                                {formatMoney(
                                  booking.rentPerHour ||
                                  booking.car
                                    ?.rentPerHour
                                )}
                                /hr
                              </strong>
                            </div>

                            <div>
                              <DollarCircleOutlined />

                              <span>Amount</span>

                              <strong>
                                ₹
                                {formatMoney(
                                  booking.totalAmount
                                )}
                              </strong>
                            </div>

                            <div>
                              <CalendarOutlined />

                              <span>Pickup</span>

                              <strong>
                                {moment(
                                  booking
                                    .bookedTimeSlots
                                    ?.from
                                ).format(
                                  "DD MMM YYYY"
                                )}
                              </strong>
                            </div>

                            <div>
                              <ClockCircleOutlined />

                              <span>Return</span>

                              <strong>
                                {moment(
                                  booking
                                    .bookedTimeSlots
                                    ?.to
                                ).format(
                                  "DD MMM YYYY"
                                )}
                              </strong>
                            </div>
                          </div>
                        </div>

                        <div className="trip-action-buttons">
                          {status ===
                            "upcoming" && (
                            <>
                              <Link
                                to={`/booking-success/${booking._id}`}
                              >
                                <Button
                                  block
                                  icon={
                                    <EyeOutlined />
                                  }
                                >
                                  Receipt
                                </Button>
                              </Link>

                              <Popconfirm
                                title="Cancel this booking?"
                                description="This action cannot be undone."
                                okText="Cancel Booking"
                                cancelText="Keep Booking"
                                okButtonProps={{
                                  danger: true,
                                }}
                                onConfirm={() =>
                                  dispatch(
                                    cancelBooking(
                                      booking._id
                                    )
                                  )
                                }
                              >
                                <Button
                                  danger
                                  block
                                >
                                  Cancel
                                </Button>
                              </Popconfirm>
                            </>
                          )}

                          {status ===
                            "ongoing" && (
                            <Link
                              to={`/booking-success/${booking._id}`}
                            >
                              <Button
                                type="primary"
                                block
                                icon={
                                  <EyeOutlined />
                                }
                              >
                                View Trip
                              </Button>
                            </Link>
                          )}

                          {status ===
                            "completed" && (
                            <>
                              <Button
                                type="primary"
                                block
                                icon={
                                  <StarOutlined />
                                }
                                onClick={() =>
                                  openReview(
                                    booking
                                  )
                                }
                              >
                                Leave Review
                              </Button>

                              {booking.car?._id && (
                                <Link
                                  to={`/bookingcar/${booking.car._id}`}
                                >
                                  <Button
                                    block
                                    icon={
                                      <ReloadOutlined />
                                    }
                                  >
                                    Book Again
                                  </Button>
                                </Link>
                              )}
                            </>
                          )}

                          {status ===
                            "cancelled" &&
                            booking.car?._id && (
                              <Link
                                to={`/bookingcar/${booking.car._id}`}
                              >
                                <Button
                                  type="primary"
                                  block
                                  icon={
                                    <ReloadOutlined />
                                  }
                                >
                                  Book Again
                                </Button>
                              </Link>
                            )}
                        </div>
                      </div>
                    </Card>
                  </Col>
                );
              }
            )}
          </Row>
        )}

        <ReviewModal
          open={reviewOpen}
          bookingId={
            selectedBooking?._id
          }
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