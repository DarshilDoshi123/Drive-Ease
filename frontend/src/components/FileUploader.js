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
}) {
  const [uploading, setUploading] =
    useState(false);

  const fileUrl =
    form.getFieldValue(fieldName);

  const uploadFile = async ({
  file,
  onSuccess,
  onError,
}) => {
  try {
    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post(
      "/api/uploads/single",
      formData
    );

    const uploadedUrl =
      response.data?.data?.url;

    if (!uploadedUrl) {
      throw new Error(
        "Upload URL was not returned"
      );
    }

    form.setFieldsValue({
      [fieldName]: uploadedUrl,
    });

    message.success(
      "File uploaded successfully"
    );

    onSuccess?.(response.data);
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Upload failed";

    console.error(
      "UPLOAD ERROR:",
      error.response?.status,
      error.response?.data ||
        error.message
    );

    message.error(errorMessage);

    onError?.(error);
  } finally {
    setUploading(false);
  }
};
  return (
    <div style={{ marginBottom: 20 }}>
      <label
        style={{
          fontWeight: 600,
          display: "block",
          marginBottom: 8,
        }}
      >
        {label}
      </label>

      <Upload
        name="file"
        showUploadList={false}
        customRequest={uploadFile}
      >
        {fileUrl ? (
          isDocument ? (
            <div
              style={{
                border:
                  "1px solid #d9d9d9",
                borderRadius: 8,
                padding: 20,
                textAlign: "center",
                cursor: "pointer",
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
                }}
              >
                Uploaded Successfully
              </p>

              <small>
                Click to Change
              </small>
            </div>
          ) : (
            <img
              src={fileUrl}
              alt=""
              style={{
                width: 220,
                height: 150,
                objectFit: "cover",
                borderRadius: 10,
                border:
                  "1px solid #ddd",
              }}
            />
          )
        ) : (
          <div
            style={{
              width: 220,
              height: 150,
              border:
                "1px dashed #bfbfbf",
              borderRadius: 10,
              display: "flex",
              flexDirection:
                "column",
              justifyContent:
                "center",
              alignItems: "center",
              cursor: "pointer",
            }}
          >
            {isDocument ? (
              <FilePdfOutlined
                style={{
                  fontSize: 35,
                }}
              />
            ) : (
              <FileImageOutlined
                style={{
                  fontSize: 35,
                }}
              />
            )}

            <PlusOutlined
              style={{
                marginTop: 10,
              }}
            />

            <div>
              {uploading
                ? "Uploading..."
                : "Upload"}
            </div>
          </div>
        )}
      </Upload>
    </div>
  );
}

export default FileUploader;