import React, {
  useEffect,
  useMemo,
} from "react";
import { handleImageError } from "../utils/constants";

import {
  Alert,
  Button,
  Card,
  Col,
  Empty,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  Typography,
} from "antd";

import {
  ArrowLeftOutlined,
  CarOutlined,
  DollarCircleOutlined,
  EditOutlined,
  PictureOutlined,
  SaveOutlined,
  TeamOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";

import {
  Link,
  useLoaderData,
} from "react-router-dom";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import AdminLayout from "../components/AdminLayout";
import AdminPageHero from "../components/AdminPageHero";
import Spinner from "../components/Spinner";
import FileUploader from "../components/FileUploader";

import {
  editCar,
  getAllCars,
} from "../redux/actions/carsActions";

const {
  Title,
  Text,
} = Typography;

function EditCar() {
  const carId = useLoaderData();
  const dispatch = useDispatch();

  const [form] = Form.useForm();

  const carsState = useSelector(
    (state) => state.carsReducer
  );

  const loading = useSelector(
    (state) =>
      state.alertsReducer?.loading || false
  );

  const cars = useMemo(
    () =>
      Array.isArray(carsState?.cars)
        ? carsState.cars
        : [],
    [carsState?.cars]
  );

  const car = useMemo(
    () =>
      cars.find(
        (item) => item._id === carId
      ),
    [cars, carId]
  );

  const imageUrl = Form.useWatch(
    "image",
    form
  );

  useEffect(() => {
    if (cars.length === 0) {
      dispatch(getAllCars());
    }
  }, [cars.length, dispatch]);

  useEffect(() => {
    if (!car) {
      return;
    }

    form.setFieldsValue({
      name: car.name || "",
      image: car.image || "",
      rentPerHour: Number(
        car.rentPerHour || 0
      ),
      capacity: Number(
        car.capacity || 0
      ),
      fuelType: car.fuelType || "",
    });
  }, [car, form]);

  const onFinish = (values) => {
    if (!car?._id) {
      return;
    }

    const requestData = {
      _id: car._id,

      name: values.name.trim(),

      image: values.image.trim(),

      fuelType: values.fuelType,

      capacity: Number(values.capacity),

      rentPerHour: Number(
        values.rentPerHour
      ),
    };

    dispatch(
      editCar(requestData)
    );
  };

  if (!car && !loading && cars.length > 0) {
    return (
      <AdminLayout>
        <Card
          bordered={false}
          className="admin-form-empty-card"
        >
          <Empty description="Selected car was not found">
            <Link to="/admin">
              <Button
                type="primary"
                icon={<ArrowLeftOutlined />}
              >
                Return to Fleet
              </Button>
            </Link>
          </Empty>
        </Card>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      {loading && <Spinner />}

      <section className="admin-form-page">
        <AdminPageHero
          eyebrow="VEHICLE MANAGEMENT"
          title={`Edit ${
            car?.name || "Rental Vehicle"
          }`}
          description="Update the vehicle image, rental price, passenger capacity and fuel information."
          icon={<EditOutlined />}
          theme="orange"
          actions={
            <Link to="/admin">
              <Button
                size="large"
                icon={<ArrowLeftOutlined />}
              >
                Back to Fleet
              </Button>
            </Link>
          }
        />

        <Row
          gutter={[24, 24]}
          align="stretch"
        >
          <Col
            xl={16}
            lg={15}
            xs={24}
          >
            <Card
              bordered={false}
              className="admin-vehicle-form-card"
            >
              <div className="admin-form-heading">
                <div className="admin-form-heading-icon edit">
                  <EditOutlined />
                </div>

                <div>
                  <Title level={3}>
                    Update Vehicle Details
                  </Title>

                  <Text type="secondary">
                    Make the required changes and
                    save the updated vehicle.
                  </Text>
                </div>
              </div>

              <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                requiredMark="optional"
              >
                <Row gutter={[20, 0]}>
                  <Col
                    lg={12}
                    xs={24}
                  >
                    <Form.Item
                      name="name"
                      label="Car Name"
                      rules={[
                        {
                          required: true,
                          message:
                            "Please enter the car name",
                        },
                        {
                          min: 2,
                          message:
                            "Car name must contain at least 2 characters",
                        },
                      ]}
                    >
                      <Input
                        prefix={<CarOutlined />}
                        placeholder="Example: BMW M4"
                      />
                    </Form.Item>
                  </Col>

                  <Col
                    lg={12}
                    xs={24}
                  >
                    <Form.Item
                      name="rentPerHour"
                      label="Rent Per Hour"
                      rules={[
                        {
                          required: true,
                          message:
                            "Please enter the hourly rent",
                        },
                        {
                          type: "number",
                          min: 1,
                          message:
                            "Rent must be greater than zero",
                        },
                      ]}
                    >
                      <InputNumber
                        min={1}
                        precision={0}
                        prefix="₹"
                        placeholder="1500"
                        className="full-width-control"
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={[20, 0]}>
                  <Col
                    lg={12}
                    xs={24}
                  >
                    <Form.Item
                      name="capacity"
                      label="Passenger Capacity"
                      rules={[
                        {
                          required: true,
                          message:
                            "Please enter passenger capacity",
                        },
                        {
                          type: "number",
                          min: 1,
                          max: 20,
                          message:
                            "Capacity must be between 1 and 20",
                        },
                      ]}
                    >
                      <InputNumber
                        min={1}
                        max={20}
                        precision={0}
                        prefix={<TeamOutlined />}
                        placeholder="5"
                        className="full-width-control"
                      />
                    </Form.Item>
                  </Col>

                  <Col
                    lg={12}
                    xs={24}
                  >
                    <Form.Item
                      name="fuelType"
                      label="Fuel Type"
                      rules={[
                        {
                          required: true,
                          message:
                            "Please select a fuel type",
                        },
                      ]}
                    >
                      <Select
                        suffixIcon={
                          <ThunderboltOutlined />
                        }
                        placeholder="Select fuel type"
                        options={[
                          {
                            label: "Petrol",
                            value: "Petrol",
                          },
                          {
                            label: "Diesel",
                            value: "Diesel",
                          },
                          {
                            label: "Electric",
                            value: "Electric",
                          },
                          {
                            label: "CNG",
                            value: "CNG",
                          },
                          {
                            label: "Hybrid",
                            value: "Hybrid",
                          },
                        ]}
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item
                  name="description"
                  label="Vehicle Description"
                >
                  <Input.TextArea
                    rows={4}
                    maxLength={1000}
                    showCount
                    placeholder="Condition, features and vehicle details..."
                  />
                </Form.Item>

                <Form.Item
                  name="image"
                  label="Car Photo Upload *"
                  extra="Upload a new vehicle photo directly from your device or provide an image URL below."
                  rules={[
                    {
                      required: true,
                      message: "Please upload a photo or provide an image URL",
                    },
                  ]}
                >
                  <FileUploader
                    form={form}
                    fieldName="image"
                    label="Vehicle Photo"
                  />
                </Form.Item>

                <Form.Item
                  name="image"
                  label="Or Direct Image URL"
                >
                  <Input
                    prefix={<PictureOutlined />}
                    placeholder="https://example.com/car.jpg"
                  />
                </Form.Item>

                <Alert
                  type="warning"
                  showIcon
                  message="Existing bookings are preserved"
                  description="Updating the vehicle details will not remove its existing booked time slots."
                  className="admin-form-alert"
                />

                <div className="admin-form-actions">
                  <Link to="/admin">
                    <Button
                      size="large"
                      icon={
                        <ArrowLeftOutlined />
                      }
                    >
                      Cancel
                    </Button>
                  </Link>

                  <Button
                    type="primary"
                    size="large"
                    htmlType="submit"
                    loading={loading}
                    icon={<SaveOutlined />}
                  >
                    Save Changes
                  </Button>
                </div>
              </Form>
            </Card>
          </Col>

          <Col
            xl={8}
            lg={9}
            xs={24}
          >
            <Card
              bordered={false}
              className="admin-car-preview-card"
            >
              <div className="admin-preview-label">
                VEHICLE PREVIEW
              </div>

              <div className="admin-preview-image">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={
                      car?.name ||
                      "Car preview"
                    }
                    onError={handleImageError}
                  />
                ) : (
                  <div className="admin-preview-placeholder">
                    <PictureOutlined />

                    <span>
                      Image preview will appear
                      here
                    </span>
                  </div>
                )}
              </div>

              <Form.Item
                noStyle
                shouldUpdate
              >
                {() => {
                  const values =
                    form.getFieldsValue();

                  return (
                    <div className="admin-preview-content">
                      <Title level={3}>
                        {values.name ||
                          car?.name ||
                          "Rental Vehicle"}
                      </Title>

                      <div className="admin-preview-detail">
                        <TeamOutlined />

                        <span>
                          {values.capacity || "-"}{" "}
                          Seats
                        </span>
                      </div>

                      <div className="admin-preview-detail">
                        <ThunderboltOutlined />

                        <span>
                          {values.fuelType ||
                            "Fuel Type"}
                        </span>
                      </div>

                      <div className="admin-preview-price">
                        <DollarCircleOutlined />

                        <div>
                          <small>
                            Rental price
                          </small>

                          <strong>
                            ₹
                            {Number(
                              values.rentPerHour ||
                                0
                            ).toLocaleString(
                              "en-IN"
                            )}
                            /hour
                          </strong>
                        </div>
                      </div>
                    </div>
                  );
                }}
              </Form.Item>
            </Card>
          </Col>
        </Row>
      </section>
    </AdminLayout>
  );
}

export default EditCar;