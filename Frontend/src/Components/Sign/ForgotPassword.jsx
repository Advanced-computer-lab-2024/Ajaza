import React from "react";
import { Form, Input, Button, Space } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { Card, Spin, Avatar, Typography, message } from "antd";
import image from "../../Assets/login.jpg";
import {
  UserOutlined,
  EditOutlined,
  SaveOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { apiUrl } from "../Common/Constants";
import { useEffect, useState } from "react";
import LoadingSpinner from "../Common/LoadingSpinner";

import { useAdminMenuKey } from "../Admin/AdminMenuKeyContext";
import { Box } from "@mui/material";
import CustomButton from "../Common/CustomButton";

import "./ForgotPassword.css";
const ForgotPassword = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState("");
  const [userId, setUserId] = useState(null);
  const [token, setToken] = useState("");

  //const { selectedMenuKey, updateSelectedMenuKey } = useAdminMenuKey();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      if (decodedToken.exp < currentTime) {
        message.error("Session expired. Please log in again.");
        navigate("/login");
        return;
      }

      const userDetails = decodedToken.userDetails;
      setUserId(userDetails._id);
      setRole(decodedToken.role);
      setToken(token);
    }
  }, [navigate]);

  const handleSave = async (values) => {
    setLoading(true);
    const username = localStorage.getItem("forgetUsername");

    try {
      const response = await axios.post(`${apiUrl}api/auth/verify-otp`, {
        username,
        otp: values?.oldPassword,
        newPassword: values?.newPassword,
      });

      message.success("Password updated successfully!");
      navigate("/auth/signin");
    } catch (error) {
      console.error(error);
      if (error?.response?.data?.message) {
        message.error(error?.response?.data?.message);
      } else {
        message.error("Failed to update password. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const passwordStrengthValidator = (_, value) => {
    if (!value) {
      return Promise.resolve(); // Skip validation if no value is present (the 'required' rule will handle this)
    }

    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;

    if (!regex.test(value)) {
      return Promise.reject(
        new Error(
          "Password must be at least 8 characters long, contain an uppercase letter, a lowercase letter, a number, and a special character."
        )
      );
    }

    return Promise.resolve(); // pw is strong
  };

  return (
    <Box
      className="forgotPassword"
      display="flex"
      justifyContent="flex-start" // Align the items to the left
      alignItems="center"
      height="100vh"
      style={{
        backgroundImage: `url(${image})`, // Set the background image>
        backgroundSize: "cover", // Cover the entire screen
        backgroundPosition: "center", // Center the background image
        paddingLeft: "20px", // Add some padding on the left for spacing
      }}
    >
      <Card
        title={
          <Typography.Title level={3} style={{ textAlign: "center" }}>
            Forgot Password
          </Typography.Title>
        }
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.75)",
          width: "100%",
          maxWidth: 600,
          margin: "50px auto",
          padding: "20px",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSave}
          style={{ width: "100%" }}
        >
          <Form.Item
            name="oldPassword"
            rules={[{ required: true, message: "Please enter your OTP!" }]}
            style={{ marginBottom: 12 }}
          >
            <Input.Password
              placeholder="Enter OTP"
              style={{ fontSize: "14px", padding: "8px", width: "50%" }}
            />
          </Form.Item>

          <Form.Item
            name="newPassword"
            rules={[
              { required: true, message: "Please enter your new password!" },
              { validator: passwordStrengthValidator },
            ]}
            style={{ marginBottom: 12 }}
          >
            <Input.Password
              placeholder="Enter New Password"
              style={{ fontSize: "14px", padding: "8px", width: "50%" }}
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            dependencies={["newPassword"]}
            rules={[
              {
                required: true,
                message: "Please confirm your new password!",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("newPassword") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("The two passwords do not match")
                  );
                },
              }),
            ]}
            style={{ marginBottom: 12 }}
          >
            <Input.Password
              placeholder="Confirm New Password"
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
              style={{ fontSize: "14px", padding: "8px", width: "50%" }}
            />
          </Form.Item>

          {
            <Form.Item style={{ marginBottom: "0px" }}>
              <CustomButton
                type="primary"
                htmlType="submit"
                style={{ marginTop: "15px", width: "130px" }}
                size={"s"}
                value={"Change Password"}
                loadingOnly={loading}
              />
            </Form.Item>
          }
        </Form>
      </Card>
    </Box>
  );
};

export default ForgotPassword;
