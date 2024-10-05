import React, { useState, useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import Activities from "../Activities";
import { CalendarOutlined } from "@ant-design/icons";
import CustomButton from "../Common/CustomButton";
import { Form, Input, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios"; // Import axios
import { jwtDecode } from "jwt-decode";

const Advertiser = () => {
  const [advertiserData, setAdvertiserData] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  let decodedToken = null;
  const token = localStorage.getItem("token");
  if (token) {
    decodedToken = jwtDecode(token);
  }
  const userid = decodedToken ? decodedToken.userId : null;

  const sideBarItems = [
    {
      key: "2",
      icon: <CalendarOutlined />,
      label: "Activities",
      onClick: () => navigate("activities"),
    },
  ];

  const createAdvertiser = async (values) => {
    try {
      console.log("Values:", values);
      console.log(values.email);
      console.log(values.username);
      console.log(values.password);

      const response = await axios.post(
        "http://localhost:5000/advertiser/guestAdvertiserCreateProfile",
        {
          username: values.username,
          email: values.email,
          pass: values.password,
        }
      );
      console.log("ENGY");
      setAdvertiserData(response.data);
      message.success("Advertiser created successfully!");
    } catch (error) {
      console.error("Error creating advertiser:", error);
      message.error("Failed to create advertiser.");
    }
  };

  useEffect(() => {
    //createSeller();
  }, []);

  const onFinish = async (values) => {
    await createAdvertiser(values);
    navigate("/blank");
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  return (
    <>
      {/* Form */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600, width: "100%" }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          {/* Email */}
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please input your email!" },
              { type: "email", message: "Please enter a valid email!" },
            ]}
          >
            <Input />
          </Form.Item>

          {/* Username */}
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input />
          </Form.Item>

          {/* Password */}
          <Form.Item
            label="Password"
            name="password"
            rules={[
              { required: true, message: "Please input your password!" },
              { min: 6, message: "Password must be at least 6 characters!" },
            ]}
          >
            <Input.Password />
          </Form.Item>

          {/* Upload Document 1 */}
          <Form.Item
            label="ID"
            name="document1"
            valuePropName="fileList"
            getValueFromEvent={normFile}
            extra="Upload your ID."
          >
            <Upload name="doc1" listType="text">
              <CustomButton icon={<UploadOutlined />} size="m" value="Upload" />
            </Upload>
          </Form.Item>

          {/* Upload Document 2 */}
          <Form.Item
            label="Taxation Registry Card"
            name="document2"
            valuePropName="fileList"
            getValueFromEvent={normFile}
            extra="Upload the taxation registry card."
          >
            <Upload name="doc2" listType="text">
              <CustomButton icon={<UploadOutlined />} size="m" value="Upload" />
            </Upload>
          </Form.Item>

          {/* Submit Button */}
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <CustomButton
              type="primary"
              htmlType="submit"
              size="s"
              value="Register"
              rounded={true}
              loading={false}
            />
          </Form.Item>
        </Form>
      </div>
    </>
  );
};

export default Advertiser;
