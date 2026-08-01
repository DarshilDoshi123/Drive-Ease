import React, { useEffect, useMemo } from "react";
import {
  Alert,
  Button,
  Card,
  Col,
  Empty,
  Row,
  Space,
  Tag,
  Typography,
} from "antd";
import {
  CalendarOutlined,
  CarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  DollarCircleOutlined,
  EditOutlined,
  EnvironmentOutlined,
  FileSearchOutlined,
  PlusCircleOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import DefaultLayout from "../components/DefaultLayout";
import Spinner from "../components/Spinner";
import { getMyCarListings } from "../redux/actions/listingActions";

const { Title, Text, Paragraph } = Typography;

const formatMoney = (amount) =>
  Number(amount || 0).toLocaleString("en-IN");

const formatDate = (value) => {
  if (!value) {
    return "-";
  }

  return new Date(value).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
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
        label: "Changes Requested",
        icon: <EditOutlined />,
      };

    default:
      return {
        color: "blue",
        label: "Pending Review",
        icon: <ClockCircleOutlined />,
      };
  }
};

function MyCarListings() {
  const dispatch = useDispatch();

  const listings = useSelector(
    (state) =>
      state.listingReducer?.myListings || []
  );

  const loading = useSelector(
    (state) =>
      state.alertsReducer?.loading || false
  );

  useEffect(() => {
    dispatch(getMyCarListings());
  }, [dispatch]);

  const statistics = useMemo(
    () => ({
      total: listings.length,

      pending: listings.filter(
        (item) => item.status === "pending"
      ).length,

      approved: listings.filter(
        (item) => item.status === "approved"
      ).length,

      actionRequired: listings.filter((item) =>
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
        <div className="my-listings-header">
          <div>
            <Text className="section-label">
              HOST DASHBOARD
            </Text>

            <Title level={1}>
              My Car Listings
            </Title>

            <Paragraph>
              Track verification status, admin feedback
              and approved vehicles.
            </Paragraph>
          </div>

          <Link to="/list-your-car">
            <Button
              type="primary"
              size="large"
              icon={<PlusCircleOutlined />}
            >
              List Another Car
            </Button>
          </Link>
        </div>

        <Row gutter={[18, 18]} className="listing-stats">
          <Col lg={6} sm={12} xs={24}>
            <Card bordered={false}>
              <FileSearchOutlined />

              <div>
                <Text>Total Requests</Text>
                <Title level={2}>
                  {statistics.total}
                </Title>
              </div>
            </Card>
          </Col>

          <Col lg={6} sm={12} xs={24}>
            <Card bordered={false}>
              <ClockCircleOutlined />

              <div>
                <Text>Pending</Text>
                <Title level={2}>
                  {statistics.pending}
                </Title>
              </div>
            </Card>
          </Col>

          <Col lg={6} sm={12} xs={24}>
            <Card bordered={false}>
              <CheckCircleOutlined />

              <div>
                <Text>Approved</Text>
                <Title level={2}>
                  {statistics.approved}
                </Title>
              </div>
            </Card>
          </Col>

          <Col lg={6} sm={12} xs={24}>
            <Card bordered={false}>
              <SyncOutlined />

              <div>
                <Text>Action Required</Text>
                <Title level={2}>
                  {statistics.actionRequired}
                </Title>
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
                    Submit your first vehicle to begin
                    earning through DriveEase.
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
          <Row gutter={[24, 24]}>
            {listings.map((listing) => {
              const status = getStatusDetails(
                listing.status
              );

              const canResubmit = [
                "rejected",
                "changes_requested",
              ].includes(listing.status);

              return (
                <Col
                  xl={8}
                  lg={12}
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
                            listing.carImages?.[0] ||
                            "https://placehold.co/700x450?text=DriveEase"
                          }
                          alt={
                            listing.carDetails?.name ||
                            "Owner car"
                          }
                        />

                        <Tag
                          color={status.color}
                          icon={status.icon}
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
                          title={
                            listing.carDetails?.name
                          }
                        >
                          {listing.carDetails?.name}
                        </Title>

                        <Text type="secondary">
                          {
                            listing.carDetails
                              ?.registrationNumber
                          }
                        </Text>

                        <div className="owner-listing-details">
                          <div>
                            <DollarCircleOutlined />

                            <span>Rent</span>

                            <strong>
                              ₹
                              {formatMoney(
                                listing.carDetails
                                  ?.rentPerHour
                              )}
                              /hour
                            </strong>
                          </div>

                          <div>
                            <EnvironmentOutlined />

                            <span>Location</span>

                            <strong>
                              {listing.carDetails
                                ?.location || "-"}
                            </strong>
                          </div>

                          <div>
                            <CarOutlined />

                            <span>Vehicle</span>

                            <strong>
                              {listing.carDetails
                                ?.brand}{" "}
                              {
                                listing.carDetails
                                  ?.model
                              }
                            </strong>
                          </div>

                          <div>
                            <CalendarOutlined />

                            <span>Submitted</span>

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
                            className="listing-feedback"
                            message="Your car is live"
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
                        {listing.approvedCar?._id && (
                          <Link
                            to={`/booking/${listing.approvedCar._id}`}
                          >
                            <Button block>
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