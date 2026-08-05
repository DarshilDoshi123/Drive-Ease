import React, { useState } from "react";
import { Upload, message } from "antd";
import {
  PlusOutlined,
  FileImageOutlined,
  FilePdfOutlined,
} from "@ant-design/icons";

import api from "../services/api";

function FileUploader({
  form,
  fieldName,
  label,
  isDocument = false,
  value,
  onChange,
}) {
  const [uploading, setUploading] = useState(false);

  const fileUrl = value || (form && form.getFieldValue ? form.getFieldValue(fieldName) : "");

  const uploadFile = async ({ file, onSuccess, onError }) => {
    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("file", file);

      const response = await api.post("/api/uploads/single", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const uploadedUrl = response.data?.data?.url;

      if (!uploadedUrl) {
        throw new Error("Upload URL was not returned");
      }

      if (form && form.setFieldsValue && fieldName) {
        form.setFieldsValue({
          [fieldName]: uploadedUrl,
        });
      }

      if (onChange) {
        onChange(uploadedUrl);
      }

      message.success(`${label || "File"} uploaded successfully`);

      onSuccess?.(response.data);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Upload failed";

      console.error(
        "UPLOAD ERROR:",
        error.response?.status,
        error.response?.data || error.message
      );

      message.error(errorMessage);

      onError?.(error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ marginBottom: 20 }}>
      {label && (
        <label
          style={{
            fontWeight: 600,
            display: "block",
            marginBottom: 8,
          }}
        >
          {label}
        </label>
      )}

      <Upload
        name="file"
        showUploadList={false}
        customRequest={uploadFile}
        accept={isDocument ? ".pdf,image/*" : "image/*"}
      >
        {fileUrl ? (
          isDocument ? (
            <div
              style={{
                border: "1px solid #d9d9d9",
                borderRadius: 8,
                padding: 20,
                textAlign: "center",
                cursor: "pointer",
                background: "#fafafa",
              }}
            >
              <FilePdfOutlined
                style={{
                  fontSize: 40,
                  color: "#1677ff",
                }}
              />

              <p
                style={{
                  marginTop: 10,
                  marginBottom: 0,
                  fontWeight: 500,
                }}
              >
                Uploaded Successfully
              </p>

              <small style={{ color: "#6b7280" }}>Click to Change</small>
            </div>
          ) : (
            <div style={{ position: "relative", display: "inline-block" }}>
              <img
                src={fileUrl}
                alt={label || "Uploaded file"}
                style={{
                  width: 220,
                  height: 150,
                  objectFit: "cover",
                  borderRadius: 10,
                  border: "1px solid #ddd",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  bottom: 6,
                  right: 6,
                  background: "rgba(0, 0, 0, 0.65)",
                  color: "#fff",
                  padding: "2px 8px",
                  borderRadius: 4,
                  fontSize: 11,
                  cursor: "pointer",
                }}
              >
                Change
              </div>
            </div>
          )
        ) : (
          <div
            style={{
              width: 220,
              height: 150,
              border: "1px dashed #bfbfbf",
              borderRadius: 10,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              cursor: "pointer",
              background: "#fafafa",
              transition: "border-color 0.2s ease",
            }}
          >
            {isDocument ? (
              <FilePdfOutlined style={{ fontSize: 35, color: "#1677ff" }} />
            ) : (
              <FileImageOutlined style={{ fontSize: 35, color: "#8c8c8c" }} />
            )}

            <PlusOutlined style={{ marginTop: 10, marginBottom: 4 }} />

            <div style={{ fontSize: 13, fontWeight: 500 }}>
              {uploading ? "Uploading..." : "Upload"}
            </div>
          </div>
        )}
      </Upload>
    </div>
  );
}

export default FileUploader;