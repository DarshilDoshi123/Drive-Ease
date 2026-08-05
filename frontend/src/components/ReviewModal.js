import React, { useState } from "react";
import { Modal, Rate, Input, Button, message } from "antd";
import api from "../services/api";

const { TextArea } = Input;

function ReviewModal({
  open,
  onClose,
  bookingId,
  onSuccess,
}) {
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [comment, setComment] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const submitReview = async () => {
    if (!comment.trim()) {
      return message.error(
        "Please write a review."
      );
    }

    try {
      setLoading(true);

      const response = await api.post(
        "/api/reviews",
        {
          bookingId,
          rating,
          title,
          comment,
        }
      );

      message.success(
        response.data.message
      );

      onClose();

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      message.error(
        error.response?.data?.message ||
          "Unable to submit review"
      );
    }

    setLoading(false);
  };

  return (
    <Modal
      title="Leave Review"
      open={open}
      onCancel={onClose}
      footer={null}
      centered
    >
      <div
        style={{
          textAlign: "center",
        }}
      >
        <Rate
          value={rating}
          onChange={setRating}
        />

        <Input
          style={{
            marginTop: 20,
          }}
          placeholder="Review Title"
          value={title}
          onChange={(e) =>
            setTitle(e.target.value)
          }
        />

        <TextArea
          rows={5}
          style={{
            marginTop: 15,
          }}
          placeholder="Share your experience..."
          value={comment}
          onChange={(e) =>
            setComment(e.target.value)
          }
        />

        <Button
          type="primary"
          block
          loading={loading}
          style={{
            marginTop: 20,
          }}
          onClick={submitReview}
        >
          Submit Review
        </Button>
      </div>
    </Modal>
  );
}

export default ReviewModal;