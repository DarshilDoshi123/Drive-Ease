import React, {
  useEffect,
  useMemo,
} from "react";

import {
  Alert,
  Button,
  Card,
  Col,
  Empty,
  Row,
  Tag,
  Typography,
} from "antd";

import {
  BarChartOutlined,
  CalendarOutlined,
  CarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  DollarCircleOutlined,
  EditOutlined,
  EnvironmentOutlined,
  EyeOutlined,
  FileSearchOutlined,
  PlusCircleOutlined,
  RiseOutlined,
  SafetyCertificateOutlined,
  SyncOutlined,
} from "@ant-design/icons";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  Link,
} from "react-router-dom";

import DefaultLayout from "../components/DefaultLayout";
import Spinner from "../components/Spinner";

import {
  getMyCarListings,
} from "../redux/actions/listingActions";

const {
  Title,
  Text,
  Paragraph,
} = Typography;

const formatMoney = (amount) =>
  Number(amount || 0).toLocaleString(
    "en-IN"
  );

const formatDate = (value) => {
  if (!value) {
    return "-";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
};

const getStatusDetails = (status) => {
  switch (status) {
    case "approved":
      return {
        color: "green",
        label: "Approved",
        icon: <CheckCircleOutlined />,
      };

    case "rejected":
      return {
        color: "red",
        label: "Rejected",
        icon: <CloseCircleOutlined />,
      };

    case "changes_requested":
      return {
        color: "orange",
        label: "Changes Required",
        icon: <SyncOutlined />,
      };

    default:
      return {
        color: "blue",
        label: "Pending Review",
        icon: <ClockCircleOutlined />,
      };
  }
};

const getDisplayName = (listing) => {
  const rawName =
    listing.carDetails?.name?.trim();

  const fallbackName = [
    listing.carDetails?.brand,
    listing.carDetails?.model,
  ]
    .filter(Boolean)
    .join(" ")
    .trim();

  if (
    !rawName ||
    rawName.startsWith("http://") ||
    rawName.startsWith("https://")
  ) {
    return (
      fallbackName ||
      "DriveEase Rental Car"
    );
  }

  return rawName;
};

function MyCarListings() {
  const dispatch = useDispatch();

  const listings = useSelector(
    (state) =>
      state.listingReducer
        ?.myListings || []
  );

  const loading = useSelector(
    (state) =>
      state.alertsReducer?.loading ||
      false
  );

  useEffect(() => {
    dispatch(getMyCarListings());
  }, [dispatch]);

  const statistics = useMemo(
    () => ({
      total: listings.length,

      pending: listings.filter(
        (item) =>
          item.status === "pending"
      ).length,

      approved: listings.filter(
        (item) =>
          item.status === "approved"
      ).length,

      actionRequired:
        listings.filter((item) =>
          [
            "rejected",
            "changes_requested",
          ].includes(item.status)
        ).length,
    }),
    [listings]
  );

  return (
    <DefaultLayout>
      {loading && <Spinner />}

      <section className="my-listings-page">
        <div className="my-listings-hero">
  <div className="my-listings-hero-content">
    <Text className="my-listings-hero-label">
      <CarOutlined />
      HOST DASHBOARD
    </Text>

    <Title level={1}>
      My Car Listings
    </Title>

    <Paragraph className="my-listings-hero-description">
      Track verification status, admin feedback and approved
      vehicles from one convenient dashboard.
    </Paragraph>

    <div className="my-listings-benefits">
      {/* your existing 3 benefit blocks stay here */}
    </div>
  </div>

  {/* PASTE DECORATIVE PANEL HERE */}
  <div className="my-listings-hero-decoration">
    <div className="listing-decoration-card">
      <SafetyCertificateOutlined />

      <div>
        <strong>Verified Marketplace</strong>
        <span>
          Secure listing review process
        </span>
      </div>
    </div>

    <div className="listing-decoration-card">
      <CheckCircleOutlined />

      <div>
        <strong>
          {statistics.approved} Cars Live
        </strong>
        <span>
          Published on DriveEase
        </span>
      </div>
    </div>

    <div className="listing-decoration-card">
      <RiseOutlined />

      <div>
        <strong>Grow Your Earnings</strong>
        <span>
          Reach more rental customers
        </span>
      </div>
    </div>
  </div>

  <Link
    to="/list-your-car"
    className="my-listings-add-link"
  >
    <Button
      type="primary"
      size="large"
      icon={<PlusCircleOutlined />}
      className="my-listings-add-button"
    >
      List Another Car
    </Button>
  </Link>
</div>
          
        <Row
          gutter={[18, 18]}
          className="listing-stats"
        >
          <Col
            xl={6}
            md={12}
            xs={24}
          >
            <Card
              bordered={false}
              className="listing-stat-card"
            >
              <span className="listing-stat-icon total">
                <FileSearchOutlined />
              </span>

              <div>
                <Text>
                  Total Requests
                </Text>

                <Title level={2}>
                  {statistics.total}
                </Title>

                <small className="stat-description blue">
                  All-time requests
                </small>
              </div>
            </Card>
          </Col>

          <Col
            xl={6}
            md={12}
            xs={24}
          >
            <Card
              bordered={false}
              className="listing-stat-card"
            >
              <span className="listing-stat-icon pending">
                <ClockCircleOutlined />
              </span>

              <div>
                <Text>Pending</Text>

                <Title level={2}>
                  {statistics.pending}
                </Title>

                <small className="stat-description purple">
                  Awaiting review
                </small>
              </div>
            </Card>
          </Col>

          <Col
            xl={6}
            md={12}
            xs={24}
          >
            <Card
              bordered={false}
              className="listing-stat-card"
            >
              <span className="listing-stat-icon approved">
                <CheckCircleOutlined />
              </span>

              <div>
                <Text>Approved</Text>

                <Title level={2}>
                  {statistics.approved}
                </Title>

                <small className="stat-description green">
                  Live on platform
                </small>
              </div>
            </Card>
          </Col>

          <Col
            xl={6}
            md={12}
            xs={24}
          >
            <Card
              bordered={false}
              className="listing-stat-card"
            >
              <span className="listing-stat-icon action">
                <SyncOutlined />
              </span>

              <div>
                <Text>
                  Action Required
                </Text>

                <Title level={2}>
                  {
                    statistics.actionRequired
                  }
                </Title>

                <small className="stat-description orange">
                  Needs attention
                </small>
              </div>
            </Card>
          </Col>
        </Row>

        {listings.length === 0 ? (
          <Card
            bordered={false}
            className="my-listings-empty"
          >
            <Empty
              description={
                <div>
                  <Title level={4}>
                    No car listings submitted
                  </Title>

                  <Text type="secondary">
                    Submit your first vehicle
                    to begin earning through
                    DriveEase.
                  </Text>
                </div>
              }
            >
              <Link to="/list-your-car">
                <Button
                  type="primary"
                  icon={<CarOutlined />}
                >
                  List Your Car
                </Button>
              </Link>
            </Empty>
          </Card>
        ) : (
          <Row
            gutter={[22, 22]}
            className="owner-listings-grid"
          >
            {listings.map((listing) => {
              const status =
                getStatusDetails(
                  listing.status
                );

              const canResubmit = [
                "rejected",
                "changes_requested",
              ].includes(listing.status);

              const displayName =
                getDisplayName(listing);

              return (
                <Col
  xxl={8}
  xl={8}
  lg={8}
  md={12}
  sm={24}
  xs={24}
  key={listing._id}
  className="owner-listing-column"
>
                  <Card
                    bordered={false}
                    className="owner-listing-card"
                    cover={
                      <div className="owner-listing-image">
                        <img
                          src={
                            listing
                              .carImages?.[0] ||
                            "https://placehold.co/900x500?text=DriveEase"
                          }
                          alt={displayName}
                        />

                        <div className="owner-listing-image-overlay" />

                        <Tag
                          color={status.color}
                          icon={status.icon}
                          className="owner-listing-status"
                        >
                          {status.label}
                        </Tag>
                      </div>
                    }
                  >
                    <div className="owner-listing-content">
                      <div className="owner-listing-top">
                        <Title
                          level={3}
                          title={displayName}
                        >
                          {displayName}
                        </Title>

                        <Text
                          type="secondary"
                          className="listing-registration"
                        >
                          {listing.carDetails
                            ?.registrationNumber ||
                            "Registration pending"}
                        </Text>

                        <div className="owner-listing-details">
                          <div>
                            <DollarCircleOutlined />

                            <span>Rent</span>

                            <strong>
                              ₹
                              {formatMoney(
                                listing
                                  .carDetails
                                  ?.rentPerHour
                              )}
                              /hour
                            </strong>
                          </div>

                          <div>
                            <EnvironmentOutlined />

                            <span>
                              Location
                            </span>

                            <strong>
                              {listing
                                .carDetails
                                ?.location ||
                                "-"}
                            </strong>
                          </div>

                          <div>
                            <CarOutlined />

                            <span>
                              Vehicle
                            </span>

                            <strong>
                              {[
                                listing
                                  .carDetails
                                  ?.brand,
                                listing
                                  .carDetails
                                  ?.model,
                              ]
                                .filter(Boolean)
                                .join(" ") ||
                                "-"}
                            </strong>
                          </div>

                          <div>
                            <CalendarOutlined />

                            <span>
                              Submitted
                            </span>

                            <strong>
                              {formatDate(
                                listing.createdAt
                              )}
                            </strong>
                          </div>
                        </div>

                        {listing.status ===
                          "approved" && (
                          <Alert
                            type="success"
                            showIcon
                            className="listing-feedback listing-live-alert"
                            message="Your car is live and visible to customers"
                            description={`Platform commission: ${
                              listing.commissionRate ||
                              10
                            }% per booking.`}
                          />
                        )}

                        {listing.adminRemark && (
                          <Alert
                            type={
                              listing.status ===
                              "rejected"
                                ? "error"
                                : "warning"
                            }
                            showIcon
                            className="listing-feedback"
                            message="Admin Feedback"
                            description={
                              listing.adminRemark
                            }
                          />
                        )}
                      </div>

                      <div className="owner-listing-actions">
                        {listing
                          .approvedCar
                          ?._id && (
                          <Link
                            to={`/booking/${listing.approvedCar._id}`}
                          >
                            <Button
                              block
                              icon={<EyeOutlined />}
                            >
                              View Public Listing
                            </Button>
                          </Link>
                        )}

                        {canResubmit && (
                          <Link
                            to={`/edit-car-listing/${listing._id}`}
                          >
                            <Button
                              type="primary"
                              block
                              icon={<EditOutlined />}
                            >
                              Edit & Resubmit
                            </Button>
                          </Link>
                        )}
                      </div>
                    </div>
                  </Card>
                </Col>
              );
            })}
          </Row>
        )}
      </section>
    </DefaultLayout>
  );
}

export default MyCarListings;