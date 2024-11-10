import React from "react";
import { Form, Input, Button, Space } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { Card, Spin, Avatar, Typography, message } from "antd";
import {
  UserOutlined,
  EditOutlined,
  SaveOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import "./Profile.css";
import { useNavigate } from "react-router-dom";

import { apiUrl } from "../Common/Constants";
import { useEffect, useState } from "react";
import LoadingSpinner from "./LoadingSpinner";

const ChangePasswordForm = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState("");
  const [userId, setUserId] = useState(null);
  const [token, setToken] = useState("");

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

    if (values?.oldPassword == values?.newPassword) {
      message.error("New password must be different than the old password");
      setLoading(false);

      return;
    }
    if (!userId) {
      message.error("User ID is missing. Unable to update password.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${apiUrl}api/auth/change-password/${userId}`,
        {
          oldPassword: values.oldPassword,
          newPassword: values.newPassword,
          role: role,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Password update response:", response.data);

      message.success("Password updated successfully!");
      if (role === "governor") {
        navigate("/governor/");
      } else if (role === "admin") {
        navigate("/admin");
      } else {
        if (role) {
          navigate(`/${role}/profile`);
        } else {
          navigate("/profile");
        }
      }
    } catch (error) {
      console.error(
        "Failed to update password:",
        error.response ? error.response.data : error.message
      );
      message.error("Failed to update password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }
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
    <div className="change-pw">
      <Card
        title={
          <Typography.Title level={3} style={{ textAlign: "center" }}>
            Change Password
          </Typography.Title>
        }
        style={{
          width: "100%",
          maxWidth: 600,
          margin: "50px auto",
          padding: "20px",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
        }}
        actions={[
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSave}
            style={{ width: "100%" }}
          >
            <Form.Item
              name="oldPassword"
              rules={[
                { required: true, message: "Please enter your old password!" },
              ]}
              style={{ marginBottom: 12 }}
            >
              <Input.Password
                placeholder="Enter Old Password"
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

            <Form.Item>
              <Button type="primary" htmlType="submit">
                Save Password
              </Button>
            </Form.Item>
          </Form>,
        ]}
      >
        <Space direction="vertical" align="center" style={{ width: "100%" }}>
          <Avatar
            size={100}
            icon={<UserOutlined />}
            style={{ backgroundColor: "#87d068" }}
          />
        </Space>
      </Card>
    </div>
  );
};

export default ChangePasswordForm;
