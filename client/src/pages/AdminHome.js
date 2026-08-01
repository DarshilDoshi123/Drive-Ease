import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Button,
  Card,
  Empty,
  Input,
  Popconfirm,
  Select,
  Space,
  Table,
  Tag,
  Typography,
} from "antd";

import {
  CarOutlined,
  CheckCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  FilterOutlined,
  PlusCircleOutlined,
  SearchOutlined,
  ToolOutlined,
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

import {
  deleteCar,
  getAllCars,
} from "../redux/actions/carsActions";

const {
  Title,
  Text,
  Paragraph,
} = Typography;

function AdminHome() {
  const dispatch = useDispatch();

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

  const [searchText, setSearchText] =
    useState("");

  const [fuelFilter, setFuelFilter] =
    useState("all");

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
    dispatch(getAllCars());
  }, [dispatch]);

  const fuelOptions = useMemo(() => {
    const fuelTypes = [
      ...new Set(
        cars
          .map((car) => car.fuelType)
          .filter(Boolean)
      ),
    ];

    return fuelTypes.map((fuelType) => ({
      label: fuelType,
      value: fuelType,
    }));
  }, [cars]);

  const filteredCars = useMemo(() => {
    let result = [...cars];

    if (searchText.trim()) {
      const query = searchText
        .trim()
        .toLowerCase();

      result = result.filter((car) => {
        return (
          car.name
            ?.toLowerCase()
            .includes(query) ||
          car.brand
            ?.toLowerCase()
            .includes(query) ||
          car.model
            ?.toLowerCase()
            .includes(query)
        );
      });
    }

    if (fuelFilter !== "all") {
      result = result.filter(
        (car) =>
          car.fuelType === fuelFilter
      );
    }

    return result;
  }, [
    cars,
    searchText,
    fuelFilter,
  ]);

  const bookedCars = useMemo(
    () =>
      cars.filter(
        (car) =>
          Array.isArray(
            car.bookedTimeSlots
          ) &&
          car.bookedTimeSlots.length > 0
      ).length,
    [cars]
  );

  const availableCars =
    cars.length - bookedCars;

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

  const handleDelete = (carId) => {
    dispatch(
      deleteCar({
        carid: carId,
      })
    );
  };

  const columns = [
    {
      title: "Car",
      key: "car",
      width: 320,

      render: (_, car) => (
        <div className="admin-table-car">
          <img
            src={
              car.image ||
              "https://placehold.co/150x100?text=DriveEase"
            }
            alt={car.name}
          />

          <div>
            <strong>
              {car.name || "Car"}
            </strong>

            <span>
              {car.capacity || "-"} Seats
              {" • "}
              {car.fuelType || "-"}
            </span>
          </div>
        </div>
      ),
    },

    {
      title: "Fuel",
      dataIndex: "fuelType",
      key: "fuelType",

      render: (fuelType) => (
        <Tag color="blue">
          {fuelType || "Unknown"}
        </Tag>
      ),
    },

    {
      title: "Price",
      dataIndex: "rentPerHour",
      key: "rentPerHour",

      render: (rentPerHour) => (
        <strong>
          ₹
          {Number(
            rentPerHour || 0
          ).toLocaleString("en-IN")}
          /hour
        </strong>
      ),
    },

    {
      title: "Bookings",
      key: "bookings",

      render: (_, car) => (
        <span>
          {car.bookedTimeSlots?.length || 0}
        </span>
      ),
    },

    {
      title: "Status",
      key: "status",

      render: (_, car) => {
        const hasBookings =
          Array.isArray(
            car.bookedTimeSlots
          ) &&
          car.bookedTimeSlots.length > 0;

        return (
          <Tag
            color={
              hasBookings
                ? "orange"
                : "green"
            }
          >
            {hasBookings
              ? "Has Bookings"
              : "Available"}
          </Tag>
        );
      },
    },

    {
      title: "Actions",
      key: "actions",
      width: 190,

      render: (_, car) => (
        <Space>
          <Link
            to={`/editcar/${car._id}`}
          >
            <Button
              icon={<EditOutlined />}
              className="admin-table-edit-button"
            >
              Edit
            </Button>
          </Link>

          <Popconfirm
            title="Delete this car?"
            description="This action cannot be undone."
            okText="Delete"
            cancelText="Cancel"
            okButtonProps={{
              danger: true,
            }}
            onConfirm={() =>
              handleDelete(car._id)
            }
          >
            <Button
              danger
              icon={<DeleteOutlined />}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <AdminLayout>
      {loading && <Spinner />}

      <section className="admin-dashboard-page">
        <div className="admin-page-heading">
          <div>
            <Text className="admin-page-label">
              FLEET MANAGEMENT
            </Text>

            <Title level={1}>
              Manage Cars
            </Title>

            <Paragraph>
              View all listed cars, update their
              details or remove them from the
              booking platform.
            </Paragraph>
          </div>

          <Link to="/addcar">
            <Button
              type="primary"
              size="large"
              icon={<PlusCircleOutlined />}
              className="admin-primary-action"
            >
              Add New Car
            </Button>
          </Link>
        </div>

        <div className="admin-summary-grid">
          <Card
            bordered={false}
            className="admin-summary-card"
          >
            <div className="admin-summary-icon blue">
              <CarOutlined />
            </div>

            <div>
              <Text>Total Cars</Text>

              <Title level={2}>
                {cars.length}
              </Title>
            </div>
          </Card>

          <Card
            bordered={false}
            className="admin-summary-card"
          >
            <div className="admin-summary-icon green">
              <CheckCircleOutlined />
            </div>

            <div>
              <Text>Available</Text>

              <Title level={2}>
                {availableCars}
              </Title>
            </div>
          </Card>

          <Card
            bordered={false}
            className="admin-summary-card"
          >
            <div className="admin-summary-icon orange">
              <ToolOutlined />
            </div>

            <div>
              <Text>Cars With Bookings</Text>

              <Title level={2}>
                {bookedCars}
              </Title>
            </div>
          </Card>
        </div>

        <Card
          bordered={false}
          className="admin-table-container"
        >
          <div className="admin-table-toolbar">
            <div>
              <Title level={3}>
                All Vehicles
              </Title>

              <Text type="secondary">
                Showing{" "}
                {filteredCars.length} of{" "}
                {cars.length} cars
              </Text>
            </div>

            <Space wrap>
              <Input
                prefix={<SearchOutlined />}
                placeholder="Search car"
                allowClear
                value={searchText}
                onChange={(event) =>
                  setSearchText(
                    event.target.value
                  )
                }
                className="admin-table-search"
              />

              <Select
                value={fuelFilter}
                onChange={setFuelFilter}
                suffixIcon={
                  <FilterOutlined />
                }
                className="admin-table-filter"
                options={[
                  {
                    label:
                      "All Fuel Types",
                    value: "all",
                  },
                  ...fuelOptions,
                ]}
              />
            </Space>
          </div>

          {filteredCars.length === 0 ? (
            <Empty
              description="No cars found"
              className="admin-table-empty"
            >
              <Button
                type="primary"
                onClick={() => {
                  setSearchText("");
                  setFuelFilter("all");
                }}
              >
                Reset Filters
              </Button>
            </Empty>
          ) : (
            <Table
              rowKey="_id"
              columns={columns}
              dataSource={filteredCars}
              pagination={{
                pageSize: 6,
                showSizeChanger: false,
              }}
              scroll={{
                x: 950,
              }}
              className="admin-cars-table"
            />
          )}
        </Card>
      </section>
    </AdminLayout>
  );
}

export default AdminHome;