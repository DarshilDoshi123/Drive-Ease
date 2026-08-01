import React, { useEffect, useState } from "react";
import {
  Avatar,
  Button,
  Modal,
  Upload,
  message,
} from "antd";
import {
  CameraOutlined,
  DeleteOutlined,
  UserOutlined,
} from "@ant-design/icons";

function ProfileAvatar({
  size = 44,
  editable = true,
  className = "",
}) {
  const [profileImage, setProfileImage] =
    useState("");

  const [previewOpen, setPreviewOpen] =
    useState(false);

  useEffect(() => {
    const savedImage =
      localStorage.getItem("profileImage");

    if (savedImage) {
      setProfileImage(savedImage);
    }
  }, []);

  const beforeUpload = (file) => {
    const validTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ];

    if (!validTypes.includes(file.type)) {
      message.error(
        "Please select a JPG, PNG or WebP image"
      );

      return Upload.LIST_IGNORE;
    }

    const isLessThanTwoMB =
      file.size / 1024 / 1024 < 2;

    if (!isLessThanTwoMB) {
      message.error(
        "Profile image must be smaller than 2 MB"
      );

      return Upload.LIST_IGNORE;
    }

    const reader = new FileReader();

    reader.onload = (event) => {
      const imageData = event.target.result;

      setProfileImage(imageData);

      localStorage.setItem(
        "profileImage",
        imageData
      );

      message.success(
        "Profile image updated successfully"
      );
    };

    reader.readAsDataURL(file);

    return false;
  };

  const removeProfileImage = () => {
    localStorage.removeItem("profileImage");

    setProfileImage("");
    setPreviewOpen(false);

    message.success("Profile image removed");
  };

  const avatar = (
    <Avatar
      size={size}
      src={profileImage || undefined}
      icon={!profileImage && <UserOutlined />}
      className={`profile-upload-avatar ${className}`}
      onClick={() => {
        if (profileImage) {
          setPreviewOpen(true);
        }
      }}
    />
  );

  return (
    <>
      {editable ? (
        <Upload
          accept="image/png,image/jpeg,image/webp"
          showUploadList={false}
          beforeUpload={beforeUpload}
        >
          <div
            className="profile-avatar-wrapper"
            title="Click to change profile photo"
          >
            {avatar}

            <span className="profile-camera-icon">
              <CameraOutlined />
            </span>
          </div>
        </Upload>
      ) : (
        avatar
      )}

      <Modal
        title="Profile Photo"
        open={previewOpen}
        footer={null}
        centered
        onCancel={() => setPreviewOpen(false)}
      >
        <div className="profile-preview-content">
          <img
            src={profileImage}
            alt="Profile"
          />

          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={removeProfileImage}
          >
            Remove Photo
          </Button>
        </div>
      </Modal>
    </>
  );
}

export default ProfileAvatar;