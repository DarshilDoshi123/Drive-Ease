import React, {
  useEffect,
  useState,
} from "react";

import {
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
  CarOutlined,
  DollarCircleOutlined,
  PercentageOutlined,
  ReloadOutlined,
  TeamOutlined,
  WalletOutlined,
} from "@ant-design/icons";

import {
  useDispatch,
  useSelector,
} from "react-redux";
import AdminLayout from "../components/AdminLayout";
import Spinner from "../components/Spinner";

import {
  getAdminRevenue,
  updatePayoutStatus,
} from "../redux/actions/bookingActions";

const {
  Title,
  Text,
  Paragraph,
} = Typography;

const formatMoney = (amount) =>
  Number(amount || 0).toLocaleString(
    "en-IN"
  );

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

  const loadRevenue = async () => {
    const result = await dispatch(
      getAdminRevenue()
    );

    setStatistics(
      result.statistics || {}
    );

    setBookings(
      result.bookings || []
    );
  };

  useEffect(() => {
    loadRevenue();
  }, []);

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
      loadRevenue();
    }
  };

  const ownerBookings =
    bookings.filter(
      (booking) => booking.carOwner
    );

  return (
    <AdminLayout>
      {loading && <Spinner />}

      <section className="earnings-page">
        <div className="admin-revenue-hero">
          <div>
            <Text className="admin-dashboard-label">
              PLATFORM FINANCE
            </Text>

            <Title>
              Revenue & Payouts
            </Title>

            <Paragraph>
              Monitor booking revenue,
              marketplace commission and owner
              payouts.
            </Paragraph>
          </div>

          <Button
            size="large"
            icon={<ReloadOutlined />}
            onClick={loadRevenue}
          >
            Refresh Data
          </Button>
        </div>

        <Row
          gutter={[18, 18]}
          className="earnings-stats"
        >
          <Col xl={6} md={12} xs={24}>
            <Card>
              <CarOutlined />

              <div>
                <Text>Total Bookings</Text>
                <Title level={2}>
                  {statistics.totalBookings ||
                    0}
                </Title>
              </div>
            </Card>
          </Col>

          <Col xl={6} md={12} xs={24}>
            <Card>
              <DollarCircleOutlined />

              <div>
                <Text>
                  Booking Revenue
                </Text>

                <Title level={2}>
                  ₹
                  {formatMoney(
                    statistics.totalBookingRevenue
                  )}
                </Title>
              </div>
            </Card>
          </Col>

          <Col xl={6} md={12} xs={24}>
            <Card>
              <PercentageOutlined />

              <div>
                <Text>
                  Platform Commission
                </Text>

                <Title level={2}>
                  ₹
                  {formatMoney(
                    statistics.platformCommission
                  )}
                </Title>
              </div>
            </Card>
          </Col>

          <Col xl={6} md={12} xs={24}>
            <Card>
              <WalletOutlined />

              <div>
                <Text>
                  Pending Payout
                </Text>

                <Title level={2}>
                  ₹
                  {formatMoney(
                    statistics.pendingPayout
                  )}
                </Title>
              </div>
            </Card>
          </Col>
        </Row>

        <Title level={2}>
          Owner Payout Management
        </Title>

        {ownerBookings.length === 0 ? (
          <Card className="earnings-empty">
            <Empty description="No marketplace bookings found" />
          </Card>
        ) : (
          <Row gutter={[22, 22]}>
            {ownerBookings.map(
              (booking) => (
                <Col
                  xl={8}
                  lg={12}
                  xs={24}
                  key={booking._id}
                >
                  <Card className="earning-booking-card">
                    <div className="earning-car-header">
                      <img
                        src={
                          booking.car?.image ||
                          "https://placehold.co/500x300?text=DriveEase"
                        }
                        alt={
                          booking.car?.name ||
                          "Car"
                        }
                      />

                      <div>
                        <Title level={4}>
                          {booking.car?.name}
                        </Title>

                        <Text type="secondary">
                          Owner:{" "}
                          {booking.carOwner
                            ?.username ||
                            "Owner"}
                        </Text>
                      </div>
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
                        <span>Base Rent</span>
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
                    </div>

                    <Tag
                      color={
                        booking.bookingStatus ===
                        "cancelled"
                          ? "red"
                          : "blue"
                      }
                    >
                      {booking.bookingStatus}
                    </Tag>

                    <Select
                      value={
                        booking.payoutStatus
                      }
                      disabled={
                        booking.bookingStatus ===
                        "cancelled"
                      }
                      onChange={(value) =>
                        changePayoutStatus(
                          booking._id,
                          value
                        )
                      }
                      className="payout-status-select"
                      options={[
                        {
                          label:
                            "Pending Payout",
                          value: "pending",
                        },
                        {
                          label:
                            "Processing",
                          value:
                            "processing",
                        },
                        {
                          label: "Paid",
                          value: "paid",
                        },
                      ]}
                    />
                  </Card>
                </Col>
              )
            )}
          </Row>
        )}
      </section>
    </AdminLayout>
  );
}

export default AdminRevenue;
