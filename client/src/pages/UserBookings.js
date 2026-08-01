import React, { useEffect } from "react";
import DefaultLayout from "../components/DefaultLayout";
import { useDispatch, useSelector } from "react-redux";
import { getAllBookings } from "../redux/actions/bookingActions";
import { Col, Row, Tag } from "antd";
import Spinner from "../components/Spinner";
import moment from "moment";

function UserBookings() {
  const dispatch = useDispatch();

  const { bookings = [] } = useSelector((state) => state.bookingsReducer);
  const { loading } = useSelector((state) => state.alertsReducer);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    dispatch(getAllBookings());
  }, [dispatch]);

  const userBookings = bookings.filter(
    (booking) => booking.user === user?._id || booking.user?._id === user?._id
  );

  function formatDisplayDate(dateVal) {
    if (!dateVal) return "-";
    const m = moment(dateVal, ["MMM DD YYYY, hh:mm A", "MMM DD YYYY HH:mm", "YYYY-MM-DD HH:mm", moment.ISO_8601]);
    if (m.isValid()) {
      return m.format("MMM DD YYYY, hh:mm A");
    }
    return dateVal;
  }

  return (
    <DefaultLayout>
      {loading && <Spinner />}

      <h3 className="text-center mt-2" style={{ fontSize: "26px", fontWeight: "800", color: "#0f172a", marginBottom: "25px" }}>
        My Bookings
      </h3>

      <Row justify="center">
        <Col lg={18} sm={24}>
          {userBookings.length === 0 ? (
            <div className="text-center mt-5" style={{ padding: "40px", background: "white", borderRadius: "20px" }}>
              <h4 style={{ color: "#64748b" }}>No Bookings Found</h4>
            </div>
          ) : (
            userBookings.map((booking) => (
              <Row
                gutter={16}
                className="bs1 mt-3"
                key={booking._id}
                style={{
                  padding: "20px",
                  marginBottom: "20px",
                  borderRadius: "20px",
                  background: "#ffffff",
                  alignItems: "center"
                }}
              >
                <Col lg={7} sm={24}>
                  <h3 style={{ color: "#2563eb", marginBottom: "10px", fontSize: "20px", fontWeight: "700" }}>
                    {booking.car?.name || "Car Name"}
                  </h3>

                  <p style={{ margin: "6px 0", color: "#334155" }}>
                    Total Hours: <b>{booking.totalHours} hrs</b>
                  </p>

                  <p style={{ margin: "6px 0", color: "#334155" }}>
                    Rent Per Hour: <b>₹{booking.car?.rentPerHour}</b>
                  </p>

                  <p style={{ margin: "6px 0", color: "#16a34a", fontSize: "16px" }}>
                    Total Amount: <b>₹{booking.totalAmount}</b>
                  </p>
                </Col>

                <Col lg={11} sm={24}>
                  <p style={{ margin: "6px 0", color: "#64748b", fontSize: "13px" }}>
                    Transaction ID: <b style={{ color: "#0f172a" }}>{booking.transactionId}</b>
                  </p>

                  <div
                    style={{
                      background: "#f8fafc",
                      padding: "12px 16px",
                      borderRadius: "14px",
                      border: "1px solid #e2e8f0",
                      marginTop: "10px"
                    }}
                  >
                    <p style={{ margin: "4px 0", color: "#334155" }}>
                      📅 <b>Pickup (From):</b> {formatDisplayDate(booking.bookedTimeSlots?.from)}
                    </p>

                    <p style={{ margin: "4px 0", color: "#334155" }}>
                      🏁 <b>Return (To):</b> {formatDisplayDate(booking.bookedTimeSlots?.to)}
                    </p>

                    <p style={{ margin: "4px 0", color: "#64748b", fontSize: "13px" }}>
                      💳 <b>Reserved On:</b> {formatDisplayDate(booking.createdAt)}
                    </p>
                  </div>
                </Col>

                <Col lg={6} sm={24} style={{ textAlign: "center" }}>
                  {booking.car?.image ? (
                    <img
                      src={booking.car.image}
                      alt={booking.car.name}
                      style={{
                        width: "100%",
                        height: "130px",
                        borderRadius: "14px",
                        objectFit: "cover",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                      }}
                    />
                  ) : (
                    <Tag color="default">No Image</Tag>
                  )}
                </Col>
              </Row>
            ))
          )}
        </Col>
      </Row>
    </DefaultLayout>
  );
}

export default UserBookings;