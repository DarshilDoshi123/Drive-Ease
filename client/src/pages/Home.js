import CustomerReviews from "../components/CustomerReviews";
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  Card,
  Col,
  DatePicker,
  Empty,
  Input,
  Row,
  Select,
  Slider,
  Tag,
  Typography,
} from "antd";
import {
  CarOutlined,
  ClockCircleOutlined,
  FilterOutlined,
  ReloadOutlined,
  SafetyCertificateOutlined,
  SearchOutlined,
  TeamOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";

import DefaultLayout from "../components/DefaultLayout";
import Spinner from "../components/Spinner";
import { getAllCars } from "../redux/actions/carsActions";

const { RangePicker } = DatePicker;
const { Title, Paragraph, Text } = Typography;

const MAX_RENT = 10000;

function Home() {
  const dispatch = useDispatch();

  const carsState = useSelector((state) => state.carsReducer);
  const alertsState = useSelector((state) => state.alertsReducer);

  const cars = useMemo(
    () => (Array.isArray(carsState?.cars) ? carsState.cars : []),
    [carsState?.cars]
  );

  const loading = alertsState?.loading || false;

  const [searchText, setSearchText] = useState("");
  const [fuelType, setFuelType] = useState("all");
  const [capacity, setCapacity] = useState("all");
  const [sortOrder, setSortOrder] = useState("default");
  const [maximumRent, setMaximumRent] = useState(MAX_RENT);
  const [selectedRange, setSelectedRange] = useState(null);

  useEffect(() => {
    dispatch(getAllCars());
  }, [dispatch]);

  const fuelOptions = useMemo(() => {
    const uniqueFuelTypes = [
      ...new Set(
        cars
          .map((car) => car.fuelType)
          .filter(Boolean)
      ),
    ];

    return uniqueFuelTypes.map((fuel) => ({
      label: fuel,
      value: fuel,
    }));
  }, [cars]);

  const capacityOptions = useMemo(() => {
    const uniqueCapacities = [
      ...new Set(
        cars
          .map((car) => Number(car.capacity))
          .filter((value) => Number.isFinite(value))
      ),
    ].sort((a, b) => a - b);

    return uniqueCapacities.map((value) => ({
      label: `${value} Seats`,
      value: String(value),
    }));
  }, [cars]);

  const maximumAvailableRent = useMemo(() => {
    const highestRent = Math.max(
      ...cars.map((car) => Number(car.rentPerHour) || 0),
      1000
    );

    return Math.ceil(highestRent / 500) * 500;
  }, [cars]);

  useEffect(() => {
    setMaximumRent(maximumAvailableRent);
  }, [maximumAvailableRent]);

  const isCarAvailable = (car) => {
    if (!selectedRange) {
      return true;
    }

    const [selectedFrom, selectedTo] = selectedRange;

    const bookedSlots = Array.isArray(car.bookedTimeSlots)
      ? car.bookedTimeSlots
      : [];

    return !bookedSlots.some((slot) => {
      const bookedFrom = new Date(slot.from).getTime();
      const bookedTo = new Date(slot.to).getTime();

      if (
        Number.isNaN(bookedFrom) ||
        Number.isNaN(bookedTo)
      ) {
        return false;
      }

      // Two ranges overlap when:
      // selected start is before booked end
      // and selected end is after booked start.
      return selectedFrom < bookedTo && selectedTo > bookedFrom;
    });
  };

  const filteredCars = useMemo(() => {
    let result = [...cars];

    if (searchText.trim()) {
      const searchValue = searchText.toLowerCase().trim();

      result = result.filter((car) =>
        car.name?.toLowerCase().includes(searchValue)
      );
    }

    if (fuelType !== "all") {
      result = result.filter(
        (car) => car.fuelType === fuelType
      );
    }

    if (capacity !== "all") {
      result = result.filter(
        (car) => String(car.capacity) === capacity
      );
    }

    result = result.filter(
      (car) =>
        Number(car.rentPerHour) <= maximumRent
    );

    if (selectedRange) {
      result = result.filter(isCarAvailable);
    }

    if (sortOrder === "price-low") {
      result.sort(
        (firstCar, secondCar) =>
          Number(firstCar.rentPerHour) -
          Number(secondCar.rentPerHour)
      );
    }

    if (sortOrder === "price-high") {
      result.sort(
        (firstCar, secondCar) =>
          Number(secondCar.rentPerHour) -
          Number(firstCar.rentPerHour)
      );
    }

    if (sortOrder === "name") {
      result.sort((firstCar, secondCar) =>
        firstCar.name.localeCompare(secondCar.name)
      );
    }

    return result;
  }, [
    cars,
    searchText,
    fuelType,
    capacity,
    maximumRent,
    selectedRange,
    sortOrder,
  ]);

  const handleDateChange = (values) => {
    if (!values || values.length !== 2) {
      setSelectedRange(null);
      return;
    }

    const selectedFrom = values[0].valueOf();
    const selectedTo = values[1].valueOf();

    if (selectedTo <= selectedFrom) {
      setSelectedRange(null);
      return;
    }

    setSelectedRange([selectedFrom, selectedTo]);
  };

  const disablePastDates = (current) => {
    if (!current) {
      return false;
    }

    return current.endOf("day").valueOf() < Date.now();
  };

  const resetFilters = () => {
    setSearchText("");
    setFuelType("all");
    setCapacity("all");
    setSortOrder("default");
    setMaximumRent(maximumAvailableRent);
    setSelectedRange(null);
  };

  return (
    <DefaultLayout>
      {loading && <Spinner />}

      {/* Hero Section */}
      <section className="home-hero">
        <div className="home-hero-overlay" />

        <div className="home-hero-content">
          <Tag className="hero-badge">
            Premium Car Rental Experience
          </Tag>

          <Title className="hero-title">
            Find the perfect car for every journey
          </Title>

          <Paragraph className="hero-description">
            Choose from premium, luxury, sports and family cars.
            Book securely and manage your complete rental journey
            from one convenient platform.
          </Paragraph>

          <div className="hero-actions">
            <Button
              type="primary"
              size="large"
              icon={<CarOutlined />}
              onClick={() => {
                document
                  .getElementById("available-cars")
                  ?.scrollIntoView({
                    behavior: "smooth",
                  });
              }}
            >
              Explore Cars
            </Button>

            <Link to="/userbookings">
              <Button size="large">
                View My Bookings
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="stats-section">
        <Row gutter={[20, 20]}>
          <Col lg={6} md={12} xs={24}>
            <Card className="modern-stats-card" bordered={false}>
              <div className="stats-icon">
                <CarOutlined />
              </div>

              <div>
                <Title level={2}>
                  {cars.length}+
                </Title>
                <Text>Total Premium Cars</Text>
              </div>
            </Card>
          </Col>

          <Col lg={6} md={12} xs={24}>
            <Card className="modern-stats-card" bordered={false}>
              <div className="stats-icon">
                <ClockCircleOutlined />
              </div>

              <div>
                <Title level={2}>24/7</Title>
                <Text>Customer Support</Text>
              </div>
            </Card>
          </Col>

          <Col lg={6} md={12} xs={24}>
            <Card className="modern-stats-card" bordered={false}>
              <div className="stats-icon">
                <SafetyCertificateOutlined />
              </div>

              <div>
                <Title level={2}>100%</Title>
                <Text>Secure Booking</Text>
              </div>
            </Card>
          </Col>

          <Col lg={6} md={12} xs={24}>
            <Card className="modern-stats-card" bordered={false}>
              <div className="stats-icon">
                <ThunderboltOutlined />
              </div>

              <div>
                <Title level={2}>Fast</Title>
                <Text>Instant Reservation</Text>
              </div>
            </Card>
          </Col>
        </Row>
      </section>

      {/* Search and Filters */}
      <section className="filter-section">
        <div className="section-heading">
          <div>
            <Text className="section-label">
              FIND YOUR CAR
            </Text>

            <Title level={2}>
              Search available vehicles
            </Title>

            <Paragraph>
              Select your booking period and use filters to find
              the right vehicle.
            </Paragraph>
          </div>

          <Button
            icon={<ReloadOutlined />}
            onClick={resetFilters}
          >
            Reset Filters
          </Button>
        </div>

        <Card className="filter-card" bordered={false}>
          <Row gutter={[18, 18]}>
            <Col lg={8} md={12} xs={24}>
              <Text className="filter-label">
                Booking date and time
              </Text>

              <RangePicker
                className="full-width-control"
                showTime={{
                  format: "HH:mm",
                  minuteStep: 15,
                }}
                format="DD MMM YYYY, HH:mm"
                disabledDate={disablePastDates}
                onChange={handleDateChange}
                placeholder={[
                  "Pickup date and time",
                  "Return date and time",
                ]}
              />
            </Col>

            <Col lg={6} md={12} xs={24}>
              <Text className="filter-label">
                Search car
              </Text>

              <Input
                className="full-width-control"
                prefix={<SearchOutlined />}
                placeholder="Search by car name"
                value={searchText}
                onChange={(event) =>
                  setSearchText(event.target.value)
                }
                allowClear
              />
            </Col>

            <Col lg={5} md={12} xs={24}>
              <Text className="filter-label">
                Fuel type
              </Text>

              <Select
                className="full-width-control"
                value={fuelType}
                onChange={setFuelType}
                options={[
                  {
                    label: "All Fuel Types",
                    value: "all",
                  },
                  ...fuelOptions,
                ]}
              />
            </Col>

            <Col lg={5} md={12} xs={24}>
              <Text className="filter-label">
                Seating capacity
              </Text>

              <Select
                className="full-width-control"
                value={capacity}
                onChange={setCapacity}
                options={[
                  {
                    label: "All Capacities",
                    value: "all",
                  },
                  ...capacityOptions,
                ]}
              />
            </Col>

            <Col lg={8} md={12} xs={24}>
              <Text className="filter-label">
                Maximum rent: ₹{maximumRent}/hour
              </Text>

              <Slider
                min={0}
                max={maximumAvailableRent}
                step={100}
                value={maximumRent}
                onChange={setMaximumRent}
                tooltip={{
                  formatter: (value) => `₹${value}`,
                }}
              />
            </Col>

            <Col lg={6} md={12} xs={24}>
              <Text className="filter-label">
                Sort vehicles
              </Text>

              <Select
                className="full-width-control"
                value={sortOrder}
                onChange={setSortOrder}
                suffixIcon={<FilterOutlined />}
                options={[
                  {
                    label: "Default Order",
                    value: "default",
                  },
                  {
                    label: "Price: Low to High",
                    value: "price-low",
                  },
                  {
                    label: "Price: High to Low",
                    value: "price-high",
                  },
                  {
                    label: "Name: A to Z",
                    value: "name",
                  },
                ]}
              />
            </Col>
          </Row>
        </Card>
      </section>

      {/* Car Listing */}
      <section
        id="available-cars"
        className="cars-section"
      >
        <div className="section-heading">
          <div>
            <Text className="section-label">
              AVAILABLE FLEET
            </Text>

            <Title level={2}>
              Choose your perfect ride
            </Title>

            <Paragraph>
              Showing {filteredCars.length} of {cars.length} cars
            </Paragraph>
          </div>
        </div>

        {filteredCars.length === 0 ? (
          <Card className="empty-state-card" bordered={false}>
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <div>
                  <Title level={4}>
                    No matching cars found
                  </Title>

                  <Text type="secondary">
                    Try changing your filters or selecting another
                    booking period.
                  </Text>
                </div>
              }
            >
              <Button
                type="primary"
                icon={<ReloadOutlined />}
                onClick={resetFilters}
              >
                Reset Filters
              </Button>
            </Empty>
          </Card>
        ) : (
          <Row gutter={[24, 24]} className="car-grid">
  {filteredCars.map((car, index) => {
    const available = isCarAvailable(car);

    return (
      <Col
        xl={6}
        lg={8}
        md={12}
        sm={12}
        xs={24}
        key={car._id}
        className="car-grid-column"
      >
        <Card
          className="premium-car-card"
          bordered={false}
          style={{
            animationDelay: `${index * 80}ms`,
          }}
          cover={
            <div className="car-image-wrapper">
              <img
                src={
                  car.image ||
                  "https://placehold.co/600x400?text=DriveEase"
                }
                alt={`${car.name} rental car`}
                className="car-card-image"
              />

              <div className="car-image-overlay" />

              <div className="car-card-shine" />

              <Tag
                className="availability-tag"
                color={available ? "green" : "red"}
              >
                {available ? "Available" : "Booked"}
              </Tag>

              <div className="car-floating-price">
                ₹{Number(car.rentPerHour || 0).toLocaleString("en-IN")}
                <small>/hr</small>
              </div>
            </div>
          }
        >
          <div className="car-card-content">
            <div className="car-card-top">
              <div className="car-title-area">
                <Title
                  level={3}
                  className="car-name"
                  title={car.name}
                >
                  {car.name}
                </Title>

                <Text className="car-category-text">
                  Premium Rental Vehicle
                </Text>
              </div>

              <div className="car-specification-grid">
                <div className="car-specification">
                  <div className="specification-icon">
                    <TeamOutlined />
                  </div>

                  <div className="specification-text">
                    <small>Capacity</small>
                    <strong>
                      {car.capacity || "-"} Seats
                    </strong>
                  </div>
                </div>

                <div className="car-specification">
                  <div className="specification-icon">
                    <ThunderboltOutlined />
                  </div>

                  <div className="specification-text">
                    <small>Fuel Type</small>
                    <strong>
                      {car.fuelType || "Not specified"}
                    </strong>
                  </div>
                </div>
              </div>
            </div>

            <div className="car-card-bottom">
              <div className="car-price-row">
                <div>
                  <Text type="secondary">
                    Rental price
                  </Text>

                  <div className="car-price">
                    ₹
                    {Number(
                      car.rentPerHour || 0
                    ).toLocaleString("en-IN")}

                    <small>/hour</small>
                  </div>
                </div>

                <div className="car-status-circle">
                  <CarOutlined />
                </div>
              </div>

              <Link
                to={`/booking/${car._id}`}
                className="full-width-link"
              >
                <Button
                  type="primary"
                  size="large"
                  block
                  icon={<CarOutlined />}
                  disabled={
                    selectedRange && !available
                  }
                  className="car-booking-button"
                >
                  {selectedRange && !available
                    ? "Not Available"
                    : "View & Book"}
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </Col>
    );
  })}
</Row>
        )}
      </section>

      {/* Why Choose Us */}
      <section className="why-choose-section">
        <div className="centered-section-heading">
          <Text className="section-label">
            WHY DRIVEEASE
          </Text>

          <Title level={2}>
            A better way to rent your next car
          </Title>

          <Paragraph>
            Reliable vehicles, transparent pricing and an easy
            booking experience.
          </Paragraph>
        </div>

        <Row gutter={[24, 24]}>
          <Col lg={8} md={12} xs={24}>
            <Card className="feature-card" bordered={false}>
              <SafetyCertificateOutlined />

              <Title level={4}>
                Safe and Reliable
              </Title>

              <Paragraph>
                Every booking is securely processed and your data
                is protected.
              </Paragraph>
            </Card>
          </Col>

          <Col lg={8} md={12} xs={24}>
            <Card className="feature-card" bordered={false}>
              <ThunderboltOutlined />

              <Title level={4}>
                Fast Booking
              </Title>

              <Paragraph>
                Select your vehicle and complete your booking in a
                few simple steps.
              </Paragraph>
            </Card>
          </Col>

          <Col lg={8} md={12} xs={24}>
            <Card className="feature-card" bordered={false}>
              <ClockCircleOutlined />

              <Title level={4}>
                Flexible Rentals
              </Title>

              <Paragraph>
                Select the rental duration according to your exact
                travel requirements.
              </Paragraph>
            </Card>
          </Col>
        </Row>
        
      </section>
      <CustomerReviews />
    </DefaultLayout>
  );
}

export default Home;