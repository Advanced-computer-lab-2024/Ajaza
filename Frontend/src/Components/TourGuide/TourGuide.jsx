import React, { useState, useEffect } from "react";
import { CustomLayout } from "../Common";
import { Route, Routes, useNavigate } from "react-router-dom";
import Itineraries from "../Itineraries";
import { CalendarOutlined, UploadOutlined } from "@ant-design/icons";
import { Form, Input, Upload, message } from "antd";
import CustomButton from "../Common/CustomButton";
import { useRole } from "../Sign/SignUp";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const TourGuide = () => {
  const [tourGuideData, settourGuideData] = useState([]);
  const { role, setRole } = useRole();
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
      key: "1",
      icon: <CalendarOutlined />,
      label: "Itineraries",
      onClick: () => {
        navigate("itineraries");
      },
    },
  ];
  const createTourGuide = async (values) => {

    try {
      console.log("Values:", values);
      console.log(values.email)
      console.log(values.username)
      console.log(values.password)

      const response = await axios.post("http://localhost:5000/guide/guestGuideCreateProfile", {
        username: values.username,
        email: values.email,
        pass: values.password,
      })
      console.log("ENGY")
      settourGuideData(response.data);
      message.success("TourGuide created successfully!");

    } catch (error) {
      console.error("Error creating tour guide:", error);
      message.error("Failed to create tour guide.");
    }
  };

  useEffect(() => {
    //createSeller();
  }, []);

  const onFinish = async (values) => {
    await createTourGuide(values);
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
        />
        <CustomButton
          type={role === "Tour Guide" ? "primary" : "default"}
          onClick={() => setRole("Tour Guide")}
          value="Tour Guide"
          size="m"
          style={{ margin: "10px" }}
        />
        <CustomButton
          type={role === "Seller" ? "primary" : "default"}
          onClick={() => setRole("Seller")}
          value="Seller"
          size="m"
          style={{ margin: "10px" }}
        />
        <CustomButton
          type={role === "Advertiser" ? "primary" : "default"}
          onClick={() => setRole("Advertiser")}
          value="Advertiser"
          size="m"
          style={{ margin: "10px" }}
        />
      </div>

      {/* Registration Form */}
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
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
            rules={[
              { required: true, message: "Please input your email!" },
              { type: "email", message: "Please enter a valid email!" }
            ]}
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
            rules={[
              { required: true, message: "Please input your password!" },
              { min: 6, message: "Password must be at least 6 characters!" }
            ]}
          >
            <Input.Password />
          </Form.Item>

          {/* Upload ID */}
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

          {/* Upload Certificates */}
          <Form.Item
            label="Certificates"
            name="document2"
            valuePropName="fileList"
            getValueFromEvent={normFile}
            extra="Upload your certificates."
          >
            <Upload name="doc2" listType="text">
              <CustomButton icon={<UploadOutlined />} size="m" value="Upload" />
            </Upload>
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <CustomButton
              type="primary"
              htmlType="submit"
              size="s"
              value="Register"
              rounded={true}
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
