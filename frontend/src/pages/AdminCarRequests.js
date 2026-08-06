import React, {
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
  Descriptions,
  Divider,
  Empty,
  Image,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Row,
  Select,
  Tag,
  Typography,
} from "antd";

import {
  ArrowLeftOutlined,
  CalendarOutlined,
  CarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  DollarCircleOutlined,
  DeleteOutlined,
  EnvironmentOutlined,
  EyeOutlined,
  FileProtectOutlined,
  FilterOutlined,
  IdcardOutlined,
  ReloadOutlined,
  SafetyCertificateOutlined,
  SyncOutlined,
  UserOutlined,
} from "@ant-design/icons";

import {
  Link,
  Navigate,
} from "react-router-dom";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import AdminLayout from "../components/AdminLayout";
import Spinner from "../components/Spinner";
import AdminPageHero from "../components/AdminPageHero";

import {
  approveCarListing,
  deleteCarListing,
  getAdminCarListings,
  reviewCarListing,
} from "../redux/actions/listingActions";


const {
  Title,
  Text,
} = Typography;

const { TextArea } = Input;

const formatMoney = (amount) =>
  Number(amount || 0).toLocaleString("en-IN");

const formatDate = (value) => {
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
        icon: <SyncOutlined />,
      };

    default:
      return {
        color: "blue",
        label: "Pending Review",
        icon: <FileProtectOutlined />,
      };
  }
};

function AdminCarRequests() {
  const dispatch = useDispatch();

  const loading = useSelector(
    (state) =>
      state.alertsReducer?.loading || false
  );

  const requests = useSelector(
    (state) =>
      state.listingReducer?.adminListings || []
  );

  const [statusFilter, setStatusFilter] =
    useState("all");

  const [selectedRequest, setSelectedRequest] =
    useState(null);

  const [detailsOpen, setDetailsOpen] =
    useState(false);

  const [reviewOpen, setReviewOpen] =
    useState(false);

  const [reviewAction, setReviewAction] =
    useState("");

  const [adminRemark, setAdminRemark] =
    useState("");

  const [commissionRate, setCommissionRate] =
    useState(10);

  let user = null;

  try {
    user = JSON.parse(
      localStorage.getItem("user") || "null"
    );
  } catch (error) {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  }

  useEffect(() => {
    dispatch(
      getAdminCarListings(statusFilter)
    );
  }, [dispatch, statusFilter]);

  const statistics = useMemo(
    () => ({
      total: requests.length,

      pending: requests.filter(
        (request) =>
          request.status === "pending"
      ).length,

      approved: requests.filter(
        (request) =>
          request.status === "approved"
      ).length,

      actionRequired: requests.filter(
        (request) =>
          request.status ===
          "changes_requested"
      ).length,

      rejected: requests.filter(
        (request) =>
          request.status === "rejected"
      ).length,
    }),
    [requests]
  );

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  if (user.isAdmin !== true) {
    return (
      <Navigate
        to="/"
        replace
      />
    );
  }

  const openDetails = (request) => {
    setSelectedRequest(request);

    setCommissionRate(
      Number(request.commissionRate || 10)
    );

    setAdminRemark(
      request.adminRemark || ""
    );

    setDetailsOpen(true);
  };

  const openReviewModal = (
    request,
    action
  ) => {
    setSelectedRequest(request);
    setReviewAction(action);

    setAdminRemark("");

    setCommissionRate(
      Number(request.commissionRate || 10)
    );

    setReviewOpen(true);
  };

  const closeReviewModal = () => {
    setReviewOpen(false);
    setSelectedRequest(null);
    setReviewAction("");
    setAdminRemark("");
    setCommissionRate(10);
  };

  const handleReviewSubmit = async () => {
    if (!selectedRequest?._id) {
      return;
    }

    if (reviewAction === "approve") {
      const result = await dispatch(
        approveCarListing(
          selectedRequest._id,
          {
            commissionRate,
            adminRemark,
          }
        )
      );

      if (result) {
        closeReviewModal();
      }

      return;
    }

    if (!adminRemark.trim()) {
      return;
    }

    const result = await dispatch(
      reviewCarListing(
        selectedRequest._id,
        {
          status:
            reviewAction === "reject"
              ? "rejected"
              : "changes_requested",

          adminRemark:
            adminRemark.trim(),
        }
      )
    );

    if (result) {
      closeReviewModal();
    }
  };

  const refreshRequests = () => {
    dispatch(
      getAdminCarListings(statusFilter)
    );
  };

  return (
    <AdminLayout>
      {loading && <Spinner />}

      <section className="admin-requests-page">
        <AdminPageHero
          eyebrow="OWNER MARKETPLACE"
          title="Review & Approve Vehicle Listings"
          description="Verify vehicle owners, review submitted documents, request corrections and publish trusted rental vehicles on the DriveEase marketplace."
          icon={<FileProtectOutlined />}
          theme="purple"
          actions={
            <>
              <Link to="/admin">
                <Button
                  size="large"
                  icon={<ArrowLeftOutlined />}
                >
                  Fleet Dashboard
                </Button>
              </Link>

              <Button
                type="primary"
                size="large"
                icon={<ReloadOutlined />}
                onClick={refreshRequests}
              >
                Refresh
              </Button>
            </>
          }
          stats={[
            {
              label: "Total Requests",
              value: statistics.total,
              icon: <CarOutlined />,
            },
            {
              label: "Pending Review",
              value: statistics.pending,
              icon: <ClockCircleOutlined />,
            },
            {
              label: "Approved",
              value: statistics.approved,
              icon: <CheckCircleOutlined />,
            },
            {
              label: "Changes Needed",
              value: statistics.actionRequired,
              icon: <SyncOutlined />,
            },
            {
              label: "Rejected",
              value: statistics.rejected,
              icon: <CloseCircleOutlined />,
            },
          ]}
        />

        <Card
          bordered={false}
          className="admin-request-filter-card"
        >
          <div className="admin-request-filter">
            <div>
              <Title level={3}>
                Verification Queue
              </Title>

              <Text type="secondary">
                Showing {requests.length} listing
                requests
              </Text>
            </div>

            <Select
              value={statusFilter}
              onChange={setStatusFilter}
              suffixIcon={<FilterOutlined />}
              className="request-status-filter"
              options={[
                {
                  label: "All Requests",
                  value: "all",
                },
                {
                  label: "Pending",
                  value: "pending",
                },
                {
                  label: "Approved",
                  value: "approved",
                },
                {
                  label: "Changes Requested",
                  value: "changes_requested",
                },
                {
                  label: "Rejected",
                  value: "rejected",
                },
              ]}
            />
          </div>
        </Card>

        {requests.length === 0 ? (
          <Card
            bordered={false}
            className="admin-request-empty"
          >
            <Empty
              description="No listing requests found"
            >
              <Button
                type="primary"
                onClick={() =>
                  setStatusFilter("all")
                }
              >
                View All Requests
              </Button>
            </Empty>
          </Card>
        ) : (
          <Row gutter={[24, 24]}>
            {requests.map((request, index) => {
              const status =
                getStatusDetails(request.status);

              return (
                <Col
                  xl={8}
                  lg={12}
                  xs={24}
                  key={request._id}
                  className="admin-request-column"
                >
                  <Card
                    bordered={false}
                    className="admin-request-card"
                    style={{
                      animationDelay: `${
                        index * 70
                      }ms`,
                    }}
                    cover={
                      <div className="admin-request-image">
                        <img
                          src={request.carImages?.[0] || getCarImageUrl(request.carDetails)}
                          alt={
                            request.carDetails?.name ||
                            "Submitted car"
                          }
                          onError={handleImageError}
                        />

                        <div className="admin-request-image-overlay" />

                        <Tag
                          color={status.color}
                          icon={status.icon}
                        >
                          {status.label}
                        </Tag>
                      </div>
                    }
                  >
                    <div className="admin-request-content">
                      <div className="admin-request-content-top">
                        <Title
                          level={3}
                          title={
                            request.carDetails?.name
                          }
                        >
                          {request.carDetails?.name ||
                            "Unnamed Car"}
                        </Title>

                        <Text type="secondary">
                          {request.carDetails
                            ?.registrationNumber ||
                            "Registration unavailable"}
                        </Text>

                        <div className="admin-request-summary-grid">
                          <div>
                            <UserOutlined />

                            <span>Owner</span>

                            <strong>
                              {request.ownerDetails
                                ?.fullName || "-"}
                            </strong>
                          </div>

                          <div>
                            <EnvironmentOutlined />

                            <span>Location</span>

                            <strong>
                              {request.carDetails
                                ?.location || "-"}
                            </strong>
                          </div>

                          <div>
                            <DollarCircleOutlined />

                            <span>Requested Rent</span>

                            <strong>
                              ₹
                              {formatMoney(
                                request.carDetails
                                  ?.rentPerHour
                              )}
                              /hour
                            </strong>
                          </div>

                          <div>
                            <CalendarOutlined />

                            <span>Submitted</span>

                            <strong>
                              {formatDate(
                                request.createdAt
                              )}
                            </strong>
                          </div>
                        </div>

                        {request.adminRemark && (
                          <Alert
                            className="request-admin-remark"
                            type={
                              request.status ===
                              "rejected"
                                ? "error"
                                : request.status ===
                                  "approved"
                                ? "success"
                                : "warning"
                            }
                            showIcon
                            message="Admin Remark"
                            description={
                              request.adminRemark
                            }
                          />
                        )}
                      </div>

                      <div className="admin-request-actions">

  <Button
    block
    icon={<EyeOutlined />}
    onClick={() => openDetails(request)}
  >
    View Details
  </Button>

  {request.status !== "approved" && (
    <>
      <Button
        block
        type="primary"
        icon={<CheckCircleOutlined />}
        onClick={() =>
          openReviewModal(request, "approve")
        }
      >
        Approve
      </Button>

      <Button
        block
        className="request-change-button"
        icon={<SyncOutlined />}
        onClick={() =>
          openReviewModal(request, "changes")
        }
      >
        Request Changes
      </Button>

      <Button
        block
        danger
        icon={<CloseCircleOutlined />}
        onClick={() =>
          openReviewModal(request, "reject")
        }
      >
        Reject
      </Button>
    </>
  )}

  {/* DELETE BUTTON */}
  <Popconfirm
    title="Delete this listing?"
    description="This action cannot be undone."
    okText="Delete"
    cancelText="Cancel"
    okButtonProps={{ danger: true }}
    onConfirm={() =>
      dispatch(deleteCarListing(request._id))
    }
  >
    <Button
      block
      danger
      icon={<DeleteOutlined />}
    >
      Delete Listing
    </Button>
  </Popconfirm>

</div>
                    </div>
                  </Card>
                </Col>
              );
            })}
          </Row>
        )}
      </section>

      {/* Complete details modal */}
      <Modal
        title="Car Listing Verification"
        open={detailsOpen}
        width={1000}
        footer={null}
        onCancel={() => {
          setDetailsOpen(false);
          setSelectedRequest(null);
        }}
      >
        {selectedRequest && (
          <div className="listing-details-modal">
            <div className="listing-details-title">
              <div>
                <Title level={3}>
                  {selectedRequest.carDetails
                    ?.name || "Submitted Car"}
                </Title>

                <Text type="secondary">
                  {selectedRequest.carDetails
                    ?.registrationNumber || "-"}
                </Text>
              </div>

              <Tag
                color={
                  getStatusDetails(
                    selectedRequest.status
                  ).color
                }
                icon={
                  getStatusDetails(
                    selectedRequest.status
                  ).icon
                }
              >
                {
                  getStatusDetails(
                    selectedRequest.status
                  ).label
                }
              </Tag>
            </div>

            <Divider />

            <Title level={4}>
              Car Images
            </Title>

            {selectedRequest.carImages?.length >
            0 ? (
              <Image.PreviewGroup>
                <Row gutter={[14, 14]}>
                  {selectedRequest.carImages.map(
                    (imageUrl, index) => (
                      <Col
                        md={8}
                        xs={24}
                        key={`${imageUrl}-${index}`}
                      >
                        <Image
                          src={imageUrl}
                          alt={`Car view ${
                            index + 1
                          }`}
                          className="request-preview-image"
                        />
                      </Col>
                    )
                  )}
                </Row>
              </Image.PreviewGroup>
            ) : (
              <Empty
                description="No car images submitted"
                image={
                  Empty.PRESENTED_IMAGE_SIMPLE
                }
              />
            )}

            <Divider />

            <Title level={4}>
              Owner Details
            </Title>

            <Descriptions
              bordered
              column={{
                xs: 1,
                sm: 1,
                md: 2,
              }}
            >
              <Descriptions.Item
                label="Full Name"
              >
                {selectedRequest.ownerDetails
                  ?.fullName || "-"}
              </Descriptions.Item>

              <Descriptions.Item
                label="Username"
              >
                {selectedRequest.owner
                  ?.username || "-"}
              </Descriptions.Item>

              <Descriptions.Item label="Email">
                {selectedRequest.ownerDetails
                  ?.email || "-"}
              </Descriptions.Item>

              <Descriptions.Item label="Phone">
                {selectedRequest.ownerDetails
                  ?.phone || "-"}
              </Descriptions.Item>

              <Descriptions.Item
                label="Address"
                span={2}
              >
                {selectedRequest.ownerDetails
                  ?.address || "-"}
              </Descriptions.Item>
            </Descriptions>

            <Divider />

            <Title level={4}>
              Vehicle Details
            </Title>

            <Descriptions
              bordered
              column={{
                xs: 1,
                sm: 1,
                md: 2,
              }}
            >
              <Descriptions.Item label="Brand">
                {selectedRequest.carDetails
                  ?.brand || "-"}
              </Descriptions.Item>

              <Descriptions.Item label="Model">
                {selectedRequest.carDetails
                  ?.model || "-"}
              </Descriptions.Item>

              <Descriptions.Item label="Year">
                {selectedRequest.carDetails
                  ?.manufacturingYear || "-"}
              </Descriptions.Item>

              <Descriptions.Item label="Fuel">
                {selectedRequest.carDetails
                  ?.fuelType || "-"}
              </Descriptions.Item>

              <Descriptions.Item label="Transmission">
                {selectedRequest.carDetails
                  ?.transmission || "-"}
              </Descriptions.Item>

              <Descriptions.Item label="Capacity">
                {selectedRequest.carDetails
                  ?.capacity || "-"}{" "}
                Seats
              </Descriptions.Item>

              <Descriptions.Item label="Location">
                {selectedRequest.carDetails
                  ?.location || "-"}
              </Descriptions.Item>

              <Descriptions.Item label="Rent">
                ₹
                {formatMoney(
                  selectedRequest.carDetails
                    ?.rentPerHour
                )}
                /hour
              </Descriptions.Item>

              <Descriptions.Item
                label="Description"
                span={2}
              >
                {selectedRequest.carDetails
                  ?.description ||
                  "No description provided"}
              </Descriptions.Item>
            </Descriptions>

            <Divider />

            <Title level={4}>
              Verification Documents
            </Title>

            <Row gutter={[14, 14]}>
              <Col md={12} xs={24}>
                {selectedRequest.documents
                  ?.rcDocument ? (
                  <a
                    href={
                      selectedRequest.documents
                        .rcDocument
                    }
                    target="_blank"
                    rel="noreferrer"
                    className="document-open-card"
                  >
                    <IdcardOutlined />

                    <div>
                      <strong>
                        RC Document
                      </strong>

                      <span>
                        Open submitted document
                      </span>
                    </div>
                  </a>
                ) : (
                  <div className="document-open-card document-missing-card">
                    <IdcardOutlined />

                    <div>
                      <strong>
                        RC Document
                      </strong>

                      <span>
                        Not submitted
                      </span>
                    </div>
                  </div>
                )}
              </Col>

              <Col md={12} xs={24}>
                {selectedRequest.documents
                  ?.insuranceDocument ? (
                  <a
                    href={
                      selectedRequest.documents
                        .insuranceDocument
                    }
                    target="_blank"
                    rel="noreferrer"
                    className="document-open-card"
                  >
                    <SafetyCertificateOutlined />

                    <div>
                      <strong>
                        Insurance Document
                      </strong>

                      <span>
                        Open submitted document
                      </span>
                    </div>
                  </a>
                ) : (
                  <div className="document-open-card document-missing-card">
                    <SafetyCertificateOutlined />

                    <div>
                      <strong>
                        Insurance Document
                      </strong>

                      <span>
                        Not submitted
                      </span>
                    </div>
                  </div>
                )}
              </Col>

              <Col md={12} xs={24}>
                {selectedRequest.documents
                  ?.pucDocument ? (
                  <a
                    href={
                      selectedRequest.documents
                        .pucDocument
                    }
                    target="_blank"
                    rel="noreferrer"
                    className="document-open-card"
                  >
                    <FileProtectOutlined />

                    <div>
                      <strong>
                        PUC Document
                      </strong>

                      <span>
                        Open submitted document
                      </span>
                    </div>
                  </a>
                ) : (
                  <div className="document-open-card document-missing-card">
                    <FileProtectOutlined />

                    <div>
                      <strong>
                        PUC Document
                      </strong>

                      <span>
                        Not submitted
                      </span>
                    </div>
                  </div>
                )}
              </Col>

              <Col md={12} xs={24}>
                {selectedRequest.documents
                  ?.ownerIdDocument ? (
                  <a
                    href={
                      selectedRequest.documents
                        .ownerIdDocument
                    }
                    target="_blank"
                    rel="noreferrer"
                    className="document-open-card"
                  >
                    <UserOutlined />

                    <div>
                      <strong>
                        Owner ID Document
                      </strong>

                      <span>
                        Open submitted document
                      </span>
                    </div>
                  </a>
                ) : (
                  <div className="document-open-card document-missing-card">
                    <UserOutlined />

                    <div>
                      <strong>
                        Owner ID Document
                      </strong>

                      <span>
                        Not submitted
                      </span>
                    </div>
                  </div>
                )}
              </Col>
            </Row>

            {selectedRequest.approvedCar?._id && (
              <>
                <Divider />

                <Alert
                  type="success"
                  showIcon
                  message="Car is publicly listed"
                  description={
                    <Link
                      to={`/booking/${selectedRequest.approvedCar._id}`}
                    >
                      Open public car listing
                    </Link>
                  }
                />
              </>
            )}
          </div>
        )}
      </Modal>

      {/* Review modal */}
      <Modal
        title={
          reviewAction === "approve"
            ? "Approve Car Listing"
            : reviewAction === "reject"
            ? "Reject Car Listing"
            : "Request Changes"
        }
        open={reviewOpen}
        okText={
          reviewAction === "approve"
            ? "Approve & Publish"
            : reviewAction === "reject"
            ? "Reject Request"
            : "Send Change Request"
        }
        okButtonProps={{
          danger:
            reviewAction === "reject",

          disabled:
            reviewAction !== "approve" &&
            !adminRemark.trim(),
        }}
        cancelText="Cancel"
        onOk={handleReviewSubmit}
        onCancel={closeReviewModal}
        confirmLoading={loading}
      >
        {selectedRequest && (
          <div className="review-request-modal">
            <Alert
              type={
                reviewAction === "approve"
                  ? "success"
                  : reviewAction === "reject"
                  ? "error"
                  : "warning"
              }
              showIcon
              message={
                reviewAction === "approve"
                  ? `Approve ${selectedRequest.carDetails?.name}`
                  : reviewAction === "reject"
                  ? `Reject ${selectedRequest.carDetails?.name}`
                  : `Request changes for ${selectedRequest.carDetails?.name}`
              }
            />

            {reviewAction === "approve" && (
              <div className="commission-input-block">
                <Text strong>
                  Platform Commission Percentage
                </Text>

                <InputNumber
                  min={0}
                  max={100}
                  value={commissionRate}
                  onChange={(value) =>
                    setCommissionRate(
                      Number(value || 0)
                    )
                  }
                  addonAfter="%"
                  className="full-width-control"
                />

                <Text type="secondary">
                  Example: On ₹1,000 base rent
                  with 10% commission, DriveEase
                  earns ₹100 and the owner earns
                  ₹900.
                </Text>
              </div>
            )}

            <div className="admin-remark-block">
              <Text strong>
                {reviewAction === "approve"
                  ? "Approval Note (Optional)"
                  : "Admin Remark"}
              </Text>

              <div className="textarea-container">
                <TextArea
                  rows={5}
                  value={adminRemark}
                  onChange={(event) =>
                    setAdminRemark(
                      event.target.value
                    )
                  }
                  placeholder={
                    reviewAction === "approve"
                      ? "Optional message for the car owner"
                      : "Clearly explain rejection reason or required changes"
                  }
                  maxLength={500}
                  showCount
                />
              </div>
            </div>
          </div>
        )}
      </Modal>
    </AdminLayout>
  );
}

export default AdminCarRequests;