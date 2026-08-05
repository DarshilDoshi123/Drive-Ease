import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { getCarImageUrl, handleImageError } from "../utils/constants";

import {
  Alert,
  Button,
  Card,
  Col,
  Empty,
  Row,
  Select,
  Tag,
  Typography,
} from "antd";

import {
  BankOutlined,
  CalendarOutlined,
  CarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  DollarCircleOutlined,
  PercentageOutlined,
  ReloadOutlined,
  RiseOutlined,
  TeamOutlined,
  WalletOutlined,
} from "@ant-design/icons";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import AdminLayout from "../components/AdminLayout";
import AdminPageHero from "../components/AdminPageHero";
import Spinner from "../components/Spinner";

import {
  getAdminRevenue,
  updatePayoutStatus,
} from "../redux/actions/bookingActions";

const {
  Title,
  Text,
} = Typography;

const formatMoney = (amount) =>
  Number(amount || 0).toLocaleString(
    "en-IN"
  );

const getPayoutTagColor = (status) => {
  switch (status) {
    case "paid":
      return "green";

    case "processing":
      return "orange";

    case "pending":
      return "blue";

    default:
      return "default";
  }
};

const getBookingTagColor = (status) => {
  switch (status) {
    case "completed":
      return "green";

    case "cancelled":
      return "red";

    case "confirmed":
      return "blue";

    case "pending":
      return "orange";

    default:
      return "default";
  }
};

function AdminRevenue() {
  const dispatch = useDispatch();

  const loading = useSelector(
    (state) =>
      state.alertsReducer?.loading ||
      false
  );

  const [statistics, setStatistics] =
    useState({});

  const [bookings, setBookings] =
    useState([]);

  const loadRevenue = useCallback(
    async () => {
      const result = await dispatch(
        getAdminRevenue()
      );

      if (!result) {
        setStatistics({});
        setBookings([]);
        return;
      }

      setStatistics(
        result.statistics || {}
      );

      setBookings(
        Array.isArray(result.bookings)
          ? result.bookings
          : []
      );
    },
    [dispatch]
  );

  useEffect(() => {
    loadRevenue();
  }, [loadRevenue]);

  const changePayoutStatus = async (
    bookingId,
    payoutStatus
  ) => {
    const result = await dispatch(
      updatePayoutStatus(
        bookingId,
        payoutStatus
      )
    );

    if (result) {
      await loadRevenue();
    }
  };

  const ownerBookings = useMemo(
    () =>
      bookings.filter(
        (booking) =>
          Boolean(booking.carOwner)
      ),
    [bookings]
  );

  const paidPayoutCount = useMemo(
    () =>
      ownerBookings.filter(
        (booking) =>
          booking.payoutStatus === "paid"
      ).length,
    [ownerBookings]
  );

  const processingPayoutCount = useMemo(
    () =>
      ownerBookings.filter(
        (booking) =>
          booking.payoutStatus ===
          "processing"
      ).length,
    [ownerBookings]
  );

  const pendingPayoutCount = useMemo(
    () =>
      ownerBookings.filter(
        (booking) =>
          booking.payoutStatus ===
          "pending"
      ).length,
    [ownerBookings]
  );

  return (
    <AdminLayout>
      {loading && <Spinner />}

      <section className="earnings-page">
        <AdminPageHero
          eyebrow="PLATFORM ANALYTICS"
          title="Revenue & Owner Payouts"
          description="Track booking revenue, marketplace commission, owner earnings and pending payouts from one professional finance dashboard."
          icon={<DollarCircleOutlined />}
          theme="blue"
          actions={
            <Button
              size="large"
              icon={<ReloadOutlined />}
              onClick={loadRevenue}
            >
              Refresh Data
            </Button>
          }
          stats={[
            {
              label: "Total Bookings",
              value:
                statistics.totalBookings ||
                bookings.length ||
                0,
              icon: <CalendarOutlined />,
            },
            {
              label: "Booking Revenue",
              value: formatMoney(
                statistics.totalBookingRevenue
              ),
              prefix: "₹",
              icon: <RiseOutlined />,
            },
            {
              label: "Platform Commission",
              value: formatMoney(
                statistics.platformCommission
              ),
              prefix: "₹",
              icon: <PercentageOutlined />,
            },
            {
              label: "Pending Payout",
              value: formatMoney(
                statistics.pendingPayout
              ),
              prefix: "₹",
              icon: <WalletOutlined />,
            },
          ]}
        />

        <Card
          bordered={false}
          className="admin-request-filter-card"
          style={{
            marginBottom: 24,
          }}
        >
          <div className="admin-request-filter">
            <div>
              <Title level={3}>
                Owner Payout Management
              </Title>

              <Text type="secondary">
                Review marketplace bookings and
                update owner payout progress.
              </Text>
            </div>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 10,
              }}
            >
              <Tag
                color="blue"
                icon={<ClockCircleOutlined />}
              >
                Pending: {pendingPayoutCount}
              </Tag>

              <Tag
                color="orange"
                icon={<ReloadOutlined />}
              >
                Processing:{" "}
                {processingPayoutCount}
              </Tag>

              <Tag
                color="green"
                icon={<CheckCircleOutlined />}
              >
                Paid: {paidPayoutCount}
              </Tag>
            </div>
          </div>
        </Card>

        {ownerBookings.length === 0 ? (
          <Card
            bordered={false}
            className="earnings-empty"
          >
            <Empty
              description="No marketplace bookings found"
            >
              <Button
                type="primary"
                icon={<ReloadOutlined />}
                onClick={loadRevenue}
              >
                Refresh Data
              </Button>
            </Empty>
          </Card>
        ) : (
          <Row gutter={[22, 22]}>
            {ownerBookings.map(
              (booking) => {
                const bookingStatus =
                  booking.bookingStatus ||
                  "confirmed";

                const payoutStatus =
                  booking.payoutStatus ||
                  "pending";

                return (
                  <Col
                    xl={8}
                    lg={12}
                    xs={24}
                    key={booking._id}
                  >
                    <Card
                      bordered={false}
                      className="earning-booking-card"
                    >
                      <div className="earning-car-header">
                        <img
                          src={getCarImageUrl(booking.car)}
                          alt={
                            booking.car?.name ||
                            "Car"
                          }
                          onError={handleImageError}
                        />

                        <div>
                          <Title level={4}>
                            {booking.car?.name ||
                              "Rental Car"}
                          </Title>

                          <Text type="secondary">
                            Owner:{" "}
                            {booking.carOwner
                              ?.username ||
                              "Owner"}
                          </Text>
                        </div>
                      </div>

                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 8,
                          marginBottom: 16,
                        }}
                      >
                        <Tag
                          color={getBookingTagColor(
                            bookingStatus
                          )}
                        >
                          Booking:{" "}
                          {bookingStatus}
                        </Tag>

                        <Tag
                          color={getPayoutTagColor(
                            payoutStatus
                          )}
                        >
                          Payout:{" "}
                          {payoutStatus}
                        </Tag>
                      </div>

                      <div className="earning-detail-list">
                        <div>
                          <TeamOutlined />

                          <span>Customer</span>

                          <strong>
                            {booking.user
                              ?.username ||
                              "Customer"}
                          </strong>
                        </div>

                        <div>
                          <DollarCircleOutlined />

                          <span>
                            Base Rent
                          </span>

                          <strong>
                            ₹
                            {formatMoney(
                              booking.baseAmount
                            )}
                          </strong>
                        </div>

                        <div>
                          <PercentageOutlined />

                          <span>
                            Commission
                          </span>

                          <strong>
                            ₹
                            {formatMoney(
                              booking.platformCommission
                            )}
                          </strong>
                        </div>

                        <div>
                          <BankOutlined />

                          <span>
                            Owner Earning
                          </span>

                          <strong>
                            ₹
                            {formatMoney(
                              booking.ownerEarning
                            )}
                          </strong>
                        </div>

                        <div>
                          <WalletOutlined />

                          <span>
                            Total Amount
                          </span>

                          <strong>
                            ₹
                            {formatMoney(
                              booking.totalAmount
                            )}
                          </strong>
                        </div>

                        <div>
                          <CarOutlined />

                          <span>
                            Payment Status
                          </span>

                          <strong>
                            {booking.paymentStatus ||
                              "pending"}
                          </strong>
                        </div>
                      </div>

                      {booking.bookingStatus ===
                      "cancelled" ? (
                        <Alert
                          type="error"
                          showIcon
                          message="Booking Cancelled"
                          description="Payout status cannot be updated for a cancelled booking."
                          style={{
                            marginTop: 16,
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            marginTop: 18,
                          }}
                        >
                          <Text
                            strong
                            style={{
                              display: "block",
                              marginBottom: 8,
                            }}
                          >
                            Update Payout Status
                          </Text>

                          <Select
                            value={
                              payoutStatus
                            }
                            onChange={(value) =>
                              changePayoutStatus(
                                booking._id,
                                value
                              )
                            }
                            className="payout-status-select"
                            style={{
                              width: "100%",
                            }}
                            options={[
                              {
                                label:
                                  "Pending Payout",
                                value:
                                  "pending",
                              },
                              {
                                label:
                                  "Processing",
                                value:
                                  "processing",
                              },
                              {
                                label:
                                  "Paid",
                                value:
                                  "paid",
                              },
                            ]}
                          />
                        </div>
                      )}
                    </Card>
                  </Col>
                );
              }
            )}
          </Row>
        )}
      </section>
    </AdminLayout>
  );
}

export default AdminRevenue;