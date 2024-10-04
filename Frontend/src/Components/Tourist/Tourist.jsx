import React from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { CalendarOutlined, ContainerOutlined } from "@ant-design/icons";
import { apiUrl } from "../Common/Constants";
import { useEffect, useState } from "react";
import axios from "axios";
import CustomButton from "../Common/CustomButton";
import CustomLayout from "../Common/CustomLayout";
import { Form, Input } from "antd";
import { DatePicker, Select } from "antd";
import { useRole } from "../Sign/SignUp"; // Adjust path if needed
import { TouristProfile } from "./TouristProfile";
import Profile from "../Common/Profile";


const Tourist = () => {
  const [response, setResponse] = useState([]);
  const navigate = useNavigate();
  const { role, setRole } = useRole(); // Get role and setRole from context

  const onFinish = (values) => {
    console.log("Success:", values);
    navigate("/blank"); // Redirect to the blank page after successful submission
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  const sideBarItems = [
    {
      key: "1",
      icon: <CalendarOutlined />,
      label: "Itineraries",
      onClick: () => {
        navigate("itineraries");
      },
    },
    {
      key: "2",
      icon: <CalendarOutlined />,
      label: "Activities",
      onClick: () => navigate("activities"),
    },
    {
      key: "3",
      icon: <CalendarOutlined />,
      label: "Venues",
      onClick: () => navigate("/venues"),
    },
    {
      key: "4",
      icon: <ContainerOutlined />,
      label: "Report",
    },
  ];

  useEffect(() => {
    const urlExtension = "tourist/";

    const token = localStorage.getItem("token");
    let decodedToken = null;
    if (token) {
      //decodedToken = jwtDecode(token);
    }

    const fetchData = async () => {
      const body = {
        id: "123",
        // Add more key-value pairs as needed
      };

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json", // Example header, adjust as needed
        },
      };
      try {
        const apiResponse = await axios.get(
          apiUrl + urlExtension,
          body,
          config
        );
        console.log(response);

        if (apiResponse.status === 200) {
          setResponse(apiResponse.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);
  return (
    <CustomLayout sideBarItems={sideBarItems}>
      <div style={{ textAlign: "center", alignItems: "center", marginTop: "20px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: "bold" }}>
          Register as a {role} {/* Display the current role */}
        </h1>
      </div>

      {/* Role Selection CustomButtons */}
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
            rules={[
              { required: true, message: "Please input your email!" },
              { type: "email", message: "Please enter a valid email!" },
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
              { min: 6, message: "Password must be at least 6 characters!" },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            label="Mobile number"
            name="mobile number"
            rules={[
              { required: true, message: "Please input your mobile number!" },
              { len: 11, message: "Mobile number must be 11 digits!" },
              { pattern: /^[0-9]+$/, message: "Mobile number must contain only numbers!" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Nationality"
            name="nationality"
            rules={[{ required: true, message: "Please input your nationality!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="DOB"
            name="dob"
            rules={[{ required: true, message: "Please input your DOB!" }]}
          >
            <DatePicker />
          </Form.Item>

          <Form.Item
            label="Occupation"
            name="occupation"
            rules={[{ required: true, message: "Please select your occupation!" }]}
          >
            <Select placeholder="Select your occupation">
              <Select.Option value="job">Job</Select.Option>
              <Select.Option value="student">Student</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            wrapperCol={{
              offset: 8,
              span: 16,
            }}
          >
            <CustomButton
              type="primary"
              htmlType="submit"
              value="Register"
              size="s"
              rounded={true}
              loading={false}
            >
            </CustomButton>
          </Form.Item>

        </Form>
      </div>
      <Routes>
        <Route path="itineraries" element={<div>Itineraries Page</div>} />
        <Route path="account" element={<Profile />} />
        <Route path="profile" element={<TouristProfile />} />
      </Routes>
    </CustomLayout>
  );
};

export default Tourist;
