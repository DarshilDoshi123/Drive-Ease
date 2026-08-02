import React, { useEffect, useMemo, useState } from "react";
import DefaultLayout from "../components/DefaultLayout";
import { useDispatch, useSelector } from "react-redux";
import ReviewModal from "../components/ReviewModal";
import {
  getAllBookings,
  cancelBooking,
} from "../redux/actions/bookingActions";
import {
  Row,
  Col,
  Card,
  Tag,
  Button,
  Empty,
  Typography,
} from "antd";

import {
  CalendarOutlined,
  CarOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  PlayCircleOutlined,
  DollarCircleOutlined,
  EyeOutlined,
  ReloadOutlined,
  StarOutlined,
} from "@ant-design/icons";

import Spinner from "../components/Spinner";
import moment from "moment";
import "./UserBookings.css";
import { Link } from "react-router-dom";

const { Title, Text } = Typography;

function UserBookings() {

  const dispatch = useDispatch();

  const { bookings = [] } = useSelector(
    (state) => state.bookingsReducer
  );

  const { loading } = useSelector(
    (state) => state.alertsReducer
  );

  const user = JSON.parse(localStorage.getItem("user"));
  const [reviewOpen, setReviewOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    dispatch(getAllBookings());
  }, [dispatch]);

  const userBookings = bookings.filter(
    (booking) =>
      booking.user === user?._id ||
      booking.user?._id === user?._id
  );

  const getStatus = (booking) => {

    if (booking.bookingStatus === "cancelled")
      return "cancelled";

    const now = new Date();

    const from = new Date(
      booking.bookedTimeSlots?.from
    );

    const to = new Date(
      booking.bookedTimeSlots?.to
    );

    if (now < from)
      return "upcoming";

    if (now >= from && now <= to)
      return "ongoing";

    return "completed";
  };

  const filteredBookings = useMemo(() => {

    if (filter === "all")
      return userBookings;

    return userBookings.filter(
      (booking) =>
        getStatus(booking) === filter
    );

  }, [userBookings, filter]);

  const getTag = (status) => {

    switch (status) {

      case "upcoming":
        return (
          <Tag color="blue">
            Upcoming
          </Tag>
        );

      case "ongoing":
        return (
          <Tag color="orange">
            Ongoing
          </Tag>
        );

      case "completed":
        return (
          <Tag color="green">
            Completed
          </Tag>
        );

      default:
        return (
          <Tag color="red">
            Cancelled
          </Tag>
        );
    }

  };
  return (

<DefaultLayout>

{loading && <Spinner />}

<div className="my-bookings-page">

<div className="my-bookings-header">

<div>

<h1>🚗 My Trips</h1>

<p>
Manage all your upcoming, ongoing and completed journeys.
</p>

</div>

<Button
icon={<ReloadOutlined />}
onClick={() => dispatch(getAllBookings())}
>
Refresh
</Button>

</div>

<div className="booking-filters">

<Button
type={filter==="all"?"primary":"default"}
onClick={()=>setFilter("all")}
>
All
</Button>

<Button
type={filter==="upcoming"?"primary":"default"}
onClick={()=>setFilter("upcoming")}
>
Upcoming
</Button>

<Button
type={filter==="ongoing"?"primary":"default"}
onClick={()=>setFilter("ongoing")}
>
Ongoing
</Button>

<Button
type={filter==="completed"?"primary":"default"}
onClick={()=>setFilter("completed")}
>
Completed
</Button>

<Button
danger={filter==="cancelled"}
type={filter==="cancelled"?"primary":"default"}
onClick={()=>setFilter("cancelled")}
>
Cancelled
</Button>

</div>

{
filteredBookings.length===0 ?

(

<Empty
description="No trips found"
/>

)

:

(

<Row gutter={[24,24]}>

{

filteredBookings.map((booking)=>{

const status=getStatus(booking);

return(

<Col
lg={12}
xs={24}
key={booking._id}
>

<Card
className="booking-card"
hoverable
>

<img
className="booking-image"
src={
booking.car?.image ||
"https://placehold.co/600x350"
}
alt=""
/>

<div className="booking-content">

<div className="booking-top">

<Title level={4}>
{booking.car?.name}
</Title>

{getTag(status)}

</div>

<Row gutter={[10,10]}>

<Col span={12}>

<Text strong>

<CarOutlined />

{" "}
Rent

</Text>

<br/>

₹{booking.rentPerHour}

</Col>

<Col span={12}>

<Text strong>

<DollarCircleOutlined/>

{" "}
Amount

</Text>

<br/>

₹{booking.totalAmount}

</Col>

<Col span={12}>

<Text strong>

<CalendarOutlined/>

{" "}
Pickup

</Text>

<br/>

{moment(
booking.bookedTimeSlots?.from
).format("DD MMM YYYY")}

</Col>

<Col span={12}>

<Text strong>

<ClockCircleOutlined/>

{" "}
Return

</Text>

<br/>

{moment(
booking.bookedTimeSlots?.to
).format("DD MMM YYYY")}

</Col>

</Row>

<div className="booking-buttons">
  {status === "upcoming" && (
  <>
    <Link to={`/booking-success/${booking._id}`}>
      <Button
        icon={<EyeOutlined />}
      >
        View Receipt
      </Button>
    </Link>

    <Button
  danger
  onClick={() =>
    dispatch(cancelBooking(booking._id))
  }
>
  Cancel Booking
</Button>
  </>
)}

{status === "ongoing" && (
  <>
    <Link to={`/booking-success/${booking._id}`}>
      <Button
        type="primary"
        icon={<EyeOutlined />}
      >
        Track Trip
      </Button>
    </Link>
  </>
)}

{status === "completed" && (
  <>
    <Button
  type="primary"
  icon={<StarOutlined />}
  onClick={() => {
    setSelectedBooking(booking);
    setReviewOpen(true);
  }}
>
  Leave Review
</Button>

    <Link
      to={`/bookingcar/${booking.car?._id}`}
    >
      <Button
        icon={<ReloadOutlined />}
      >
        Book Again
      </Button>
    </Link>
  </>
)}

{status === "cancelled" && (
  <>
    <Link
      to={`/bookingcar/${booking.car?._id}`}
    >
      <Button
        type="primary"
        icon={<ReloadOutlined />}
      >
        Book Again
      </Button>
    </Link>
  </>
)}

</div>

</div>

</Card>

</Col>

);

})

}

</Row>

)

}

</div>
<ReviewModal
  open={reviewOpen}
  onClose={() => setReviewOpen(false)}
  bookingId={selectedBooking?._id}
  onSuccess={() => {
    setReviewOpen(false);
  }}
/>
</DefaultLayout>

);

}

export default UserBookings;
