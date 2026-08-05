import React from "react";
import { handleImageError } from "../utils/constants";

import {
  Alert,
  Button,
  Card,
  Col,
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
  PictureOutlined,
  PlusCircleOutlined,
  SaveOutlined,
  TeamOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import AdminLayout from "../components/AdminLayout";
import AdminPageHero from "../components/AdminPageHero";
import Spinner from "../components/Spinner";

import {
  addCar,
} from "../redux/actions/carsActions";

const {
  Title,
  Text,
} = Typography;

function AddCar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [form] = Form.useForm();

  const loading = useSelector(
    (state) =>
      state.alertsReducer?.loading || false
  );

  const imageUrl = Form.useWatch(
    "image",
    form
  );

  const onFinish = async (values) => {
    const requestData = {
      ...values,

      name: values.name.trim(),

      image: values.image.trim(),

      fuelType: values.fuelType,

      capacity: Number(values.capacity),

      rentPerHour: Number(
        values.rentPerHour
      ),

      bookedTimeSlots: [],
    };

    const result = await dispatch(
      addCar(requestData)
    );

    /*
      Your current addCar action normally redirects
      to /admin automatically.

      This check is kept only for compatibility if
      your action later starts returning a result.
    */
    if (result?.success) {
      navigate("/admin");
    }
  };

  return (
    <AdminLayout>
      {loading && <Spinner />}

      <section className="admin-form-page">
        <AdminPageHero
          eyebrow="FLEET MANAGEMENT"
          title="Add a New Rental Car"
          description="Create a complete rental vehicle listing with its image, passenger capacity, fuel type and hourly rental price."
          icon={<PlusCircleOutlined />}
          theme="purple"
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
                <div className="admin-form-heading-icon">
                  <CarOutlined />
                </div>

                <div>
                  <Title level={3}>
                    Vehicle Information
                  </Title>

                  <Text type="secondary">
                    Fill in all required details
                    before adding the vehicle.
                  </Text>
                </div>
              </div>

              <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                requiredMark="optional"
                initialValues={{
                  fuelType: "Petrol",
                  capacity: 5,
                }}
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
                  name="image"
                  label="Car Image URL"
                  extra="For now, provide a direct public image URL. We will replace this with device upload in the next step."
                  rules={[
                    {
                      required: true,
                      message:
                        "Please enter the car image URL",
                    },
                    {
                      type: "url",
                      message:
                        "Please enter a valid image URL",
                    },
                  ]}
                >
                  <Input
                    prefix={<PictureOutlined />}
                    placeholder="https://example.com/car.jpg"
                  />
                </Form.Item>

                <Alert
                  type="info"
                  showIcon
                  message="Review before submitting"
                  description="The vehicle becomes visible on the booking platform after it is successfully added."
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
                    Add Vehicle
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
                LIVE PREVIEW
              </div>

              <div className="admin-preview-image">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt="Car preview"
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
                          "Your Vehicle"}
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

export default AddCar;