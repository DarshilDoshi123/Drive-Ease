import React, {
  useEffect,
  useState,
} from "react";
import { getCarImageUrl, handleImageError } from "../utils/constants";

import {
  Card,
  Col,
  Empty,
  Row,
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
  WalletOutlined,
} from "@ant-design/icons";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import DefaultLayout from "../components/DefaultLayout";
import Spinner from "../components/Spinner";

import {
  getOwnerEarnings,
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

const formatDate = (value) =>
  value
    ? new Date(value).toLocaleString(
        "en-IN"
      )
    : "-";

function OwnerEarnings() {
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

  useEffect(() => {
    const loadData = async () => {
      const result = await dispatch(
        getOwnerEarnings()
      );

      setStatistics(
        result.statistics || {}
      );

      setBookings(
        result.bookings || []
      );
    };

    loadData();
  }, [dispatch]);

  return (
    <DefaultLayout>
      {loading && <Spinner />}

      <section className="earnings-page">
        <div className="earnings-hero">
          <div>
            <Text className="section-label">
              HOST FINANCE
            </Text>

            <Title>
              Owner Earnings
            </Title>

            <Paragraph
  style={{
    color: "#dbeafe",
    opacity: 1,
    fontSize: "15px",
    lineHeight: 1.7,
    marginBottom: 0,
  }}
>
  Track bookings, commission, pending payouts and completed
  owner payments.
</Paragraph>
          </div>

          <WalletOutlined />
        </div>

        <Row
          gutter={[18, 18]}
          className="earnings-stats"
        >
          <Col
            xl={6}
            md={12}
            xs={24}
          >
            <Card>
              <CarOutlined />

              <div>
                <Text>
                  Owner Bookings
                </Text>

                <Title level={2}>
                  {statistics.totalBookings ||
                    0}
                </Title>
              </div>
            </Card>
          </Col>

          <Col
            xl={6}
            md={12}
            xs={24}
          >
            <Card>
              <DollarCircleOutlined />

              <div>
                <Text>
                  Total Earnings
                </Text>

                <Title level={2}>
                  ₹
                  {formatMoney(
                    statistics.totalOwnerEarning
                  )}
                </Title>
              </div>
            </Card>
          </Col>

          <Col
            xl={6}
            md={12}
            xs={24}
          >
            <Card>
              <ClockCircleOutlined />

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

          <Col
            xl={6}
            md={12}
            xs={24}
          >
            <Card>
              <CheckCircleOutlined />

              <div>
                <Text>
                  Paid Payout
                </Text>

                <Title level={2}>
                  ₹
                  {formatMoney(
                    statistics.paidPayout
                  )}
                </Title>
              </div>
            </Card>
          </Col>
        </Row>

        <div className="earnings-section-heading">
          <div>
            <Title level={2}>
              Booking Earnings
            </Title>

            <Text type="secondary">
              Earnings generated from your
              approved cars.
            </Text>
          </div>
        </div>

        {bookings.length === 0 ? (
          <Card className="earnings-empty">
            <Empty description="No owner-car bookings yet" />
          </Card>
        ) : (
          <Row gutter={[22, 22]}>
            {bookings.map(
              (booking) => (
                <Col
                  xl={8}
                  lg={12}
                  xs={24}
                  key={booking._id}
                  className="earning-card-column"
                >
                  <Card className="earning-booking-card">
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
                            "Owner Car"}
                        </Title>

                        <Text type="secondary">
                          Booking #
                          {booking._id.slice(
                            -8
                          )}
                        </Text>
                      </div>
                    </div>

                    <div className="earning-detail-list">
                      <div>
                        <CalendarOutlined />
                        <span>Pickup</span>
                        <strong>
                          {formatDate(
                            booking
                              .bookedTimeSlots
                              ?.from
                          )}
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
                          Your Earning
                        </span>
                        <strong>
                          ₹
                          {formatMoney(
                            booking.ownerEarning
                          )}
                        </strong>
                      </div>
                    </div>

                    <div className="earning-status-row">
                      <Tag
                        color={
                          booking.bookingStatus ===
                          "cancelled"
                            ? "red"
                            : "blue"
                        }
                      >
                        Booking:{" "}
                        {booking.bookingStatus}
                      </Tag>

                      <Tag
                        color={
                          booking.payoutStatus ===
                          "paid"
                            ? "green"
                            : booking.payoutStatus ===
                              "processing"
                            ? "blue"
                            : "orange"
                        }
                      >
                        Payout:{" "}
                        {booking.payoutStatus}
                      </Tag>
                    </div>
                  </Card>
                </Col>
              )
            )}
          </Row>
        )}
      </section>
    </DefaultLayout>
  );
}

export default OwnerEarnings;