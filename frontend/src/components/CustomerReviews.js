import React from "react";

import {
  Avatar,
  Card,
  Col,
  Rate,
  Row,
  Typography,
} from "antd";

import {
  CheckCircleFilled,
  MessageOutlined,
} from "@ant-design/icons";

const {
  Title,
  Text,
  Paragraph,
} = Typography;

const reviews = [
  {
    name: "Rahul Shah",
    location: "Ahmedabad",
    rating: 5,
    text: "The booking process was smooth and the car was in excellent condition. DriveEase made the complete rental experience simple and reliable.",
    initials: "RS",
  },
  {
    name: "Priya Mehta",
    location: "Gandhinagar",
    rating: 5,
    text: "I booked a car for a weekend trip. The pricing was transparent, pickup was quick and the vehicle was clean and comfortable.",
    initials: "PM",
  },
  {
    name: "Aman Patel",
    location: "Vadodara",
    rating: 4,
    text: "A professional car rental platform with a clean interface. The booking summary and payment choices were particularly useful.",
    initials: "AP",
  },
  {
    name: "Neha Desai",
    location: "Surat",
    rating: 5,
    text: "Listing my car was easy and I could track the approval status directly. The owner marketplace is a very useful feature.",
    initials: "ND",
  },
  {
    name: "Kunal Joshi",
    location: "Rajkot",
    rating: 5,
    text: "The car options, booking receipt and responsive support made the experience much better than a normal rental process.",
    initials: "KJ",
  },
  {
    name: "Riya Sharma",
    location: "Ahmedabad",
    rating: 4,
    text: "I liked the modern design and clear price breakdown. Everything from selecting dates to receiving confirmation worked smoothly.",
    initials: "RS",
  },
];

function CustomerReviews() {
  return (
    <section className="customer-reviews-section">
      <div className="reviews-heading">
        <div>
          <Text className="section-label">
            CUSTOMER STORIES
          </Text>

          <Title level={2}>
            Trusted by DriveEase customers
          </Title>

          <Paragraph>
            Realistic demo feedback showing the rental
            experience for customers and vehicle owners.
          </Paragraph>
        </div>

        <div className="reviews-rating-summary">
          <strong>4.8</strong>

          <div>
            <Rate
              disabled
              allowHalf
              value={4.8}
            />

            <Text>
              Excellent rental experience
            </Text>
          </div>
        </div>
      </div>

      <div className="reviews-slider">
        <div className="reviews-track">
          {[...reviews, ...reviews].map(
            (review, index) => (
              <Card
                bordered={false}
                className="customer-review-card"
                key={`${review.name}-${index}`}
              >
                <div className="review-quote-icon">
                  <MessageOutlined />
                </div>

                <Rate
                  disabled
                  value={review.rating}
                  className="review-stars"
                />

                <Paragraph>
                  “{review.text}”
                </Paragraph>

                <div className="review-user">
                  <Avatar size={48}>
                    {review.initials}
                  </Avatar>

                  <div>
                    <strong>
                      {review.name}
                      <CheckCircleFilled />
                    </strong>

                    <Text type="secondary">
                      {review.location}
                    </Text>
                  </div>
                </div>
              </Card>
            )
          )}
        </div>
      </div>
    </section>
  );
}

export default CustomerReviews;