import React from "react";
import { CustomLayout } from "../Common";
import { Route, Routes, useNavigate } from "react-router-dom";
import Itineraries from "../Itineraries";
import { CalendarOutlined, UploadOutlined } from "@ant-design/icons";
import { Form, Input, Upload } from "antd";
import CustomButton from "../Common/CustomButton";
import { useRole } from "../Sign/SignUp";

const TourGuide = () => {
  const navigate = useNavigate();
  const { role, setRole } = useRole(); // Get role and setRole from context
  const sideBarItems = [
    {
      key: "1",
      icon: <CalendarOutlined />,
      label: "Itineraries",
      onClick: () => {
        navigate("itineraries");
      },
    },
    // Additional sidebar items can be uncommented and added here
  ];

  const onFinish = (values) => {
    console.log("Success:", values);
    navigate("/blank"); // Redirect to the blank page after successful submission
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
    <CustomLayout sideBarItems={sideBarItems}>
      <div style={{ textAlign: "center", alignItems: "center", marginTop: "20px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: "bold" }}>
          Register as a {role} {/* Display the current role */}
        </h1>
      </div>
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <CustomButton
          type={role === "Tourist" ? "primary" : "default"}
          onClick={() => setRole("Tourist")}
          value="Tourist"
          size="m"
          style={{ margin: "10px" }}
        >
        </CustomButton>
        <CustomButton
          type={role === "Tour Guide" ? "primary" : "default"}
          onClick={() => setRole("Tour Guide")}
          value="Tour Guide"
          size="m"
          style={{ margin: "10px" }}
        >
        </CustomButton>
        <CustomButton
          type={role === "Seller" ? "primary" : "default"}
          onClick={() => setRole("Seller")}
          value="Seller"
          size="m"
          style={{ margin: "10px" }}
        >
        </CustomButton>
        <CustomButton
          type={role === "Advertiser" ? "primary" : "default"}
          onClick={() => setRole("Advertiser")}
          value="Advertiser"
          size="m"
          style={{ margin: "10px" }}
        >
        </CustomButton>
      </div>

      {/* Registration Form for Tourists */}
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
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: "Please input your email!" },
            { type: "email", message: "Please enter a valid email!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input your password!" },
            { min: 6, message: "Password must be at least 6 characters!" }]}
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
            <Upload name="doc1" action="/upload.do" listType="text">
              <CustomButton icon={<UploadOutlined />}
                size="m"
                value="Upload"
              />
            </Upload>
          </Form.Item>

          {/* Upload Document 2 */}
          <Form.Item
            label="Certificates"
            name="document2"
            valuePropName="fileList"
            getValueFromEvent={normFile}
            extra="Upload your certificates."
          >
            <Upload name="doc2" action="/upload.do" listType="text">
              <CustomButton icon={<UploadOutlined />}
                size="m"
                value="Upload"
              />
            </Upload>
          </Form.Item>

          <Form.Item
            wrapperCol={{
              offset: 8,
              span: 16,
            }}
          >
            <CustomButton
              type="primary" // Optionally, you can set this as needed
              htmlType="submit" // Set the CustomButton type to submit
              size="s" // Use size 's' for small
              value="Register" // Set the CustomButton text
              rounded={true} // Enable rounding
              loading={false} // Set loading state if necessary
            />
          </Form.Item>
        </Form>
      </div>

      <Routes>
        <Route path="/itineraries" element={<Itineraries />} />
        <Route path="Report" element={<div>Report</div>} />
      </Routes>
    </CustomLayout>
  );
};

export default TourGuide;
