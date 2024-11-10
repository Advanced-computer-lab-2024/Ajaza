import React, { useState, useEffect } from "react";
import { Form, Input, message, Card } from "antd";
import axios from "axios";
import { apiUrl } from "../Common/Constants";
import { jwtDecode } from "jwt-decode";
import CustomButton from "../Common/CustomButton";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../Common/LoadingSpinner";

const FileComplaint = () => {
  const [touristId, setTouristId] = useState(null);
  const currentDate = new Date().toLocaleDateString();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [form] = Form.useForm();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwtDecode(token);
      const userDetails = decodedToken.userDetails;
      console.log(userDetails);
      setTouristId(userDetails._id);
    }
  }, []);

  const handleSubmit = async (values) => {
    const { title, body } = values;

    try {
      const response = await axios.post(
        `${apiUrl}complaint/fileComplaint/${touristId}`,
        {
          title,
          body,
        }
      );
      form.setFieldsValue({ title: "", body: "" });
      message.success(response.data.message);
      localStorage.setItem("selectedMenuKey", 8);

      navigate("../Complaints");
    } catch (error) {
      message.error("Failed to file complaint.");
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div
      style={{
        padding: "20px",
        background: "#ffffff",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Card
        style={{
          background: "#fff",
          padding: "15px",
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
          width: "400px",
        }}
      >
        <h2 style={{ fontSize: "20px", textAlign: "center" }}>
          File a Complaint
        </h2>
        <p style={{ textAlign: "center" }}>Date: {currentDate}</p>
        <Form onFinish={handleSubmit} layout="vertical">
          <Form.Item
            name="title"
            rules={[{ required: true, message: "Title is required." }]}
          >
            <Input placeholder="Title" />
          </Form.Item>
          <Form.Item
            name="body"
            rules={[
              { required: true, message: "Problem description is required." },
            ]}
          >
            <Input.TextArea
              autoSize={{ minRows: 3, maxRows: 6 }}
              placeholder="Problem"
            />
          </Form.Item>
          <Form.Item>
            <CustomButton size="s" value="File Complaint" htmlType="submit" />
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default FileComplaint;
