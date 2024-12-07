import React, { useState, useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { CalendarOutlined, ContainerOutlined } from "@ant-design/icons";
import { apiUrl } from "../Common/Constants";
import axios from "axios";
import CustomButton from "../Common/CustomButton";
import CustomLayout from "../Common/CustomLayout";
import { Form, Input } from "antd";
import { DatePicker, Select, message, Card } from "antd";
import Profile from "../Common/Profile";
import Plans from "../Tourist/Plans";
import { jwtDecode } from "jwt-decode";
import image from "../../Assets/Register.png";

const CreateTourist = () => {
  const [touristData, setTouristData] = useState([]);
  const navigate = useNavigate();

  let decodedToken = null;
  const token = localStorage.getItem("token");
  if (token) {
    decodedToken = jwtDecode(token);
  }

  const createTourist = async (values) => {
    try {
      console.log("Values:", values);
      console.log(values.email);
      console.log(values.username);
      console.log(values.password);
      console.log(values.mobile_number);
      console.log(values.nationality);
      console.log(values.dob);
      console.log(values.occupation);

      const response = await axios.post(
        "http://localhost:5000/tourist/guestTouristCreateProfile",
        {
          username: values.username,
          email: values.email,
          pass: values.password,
          mobile: values.mobile_number,
          nationality: values.nationality,
          dob: values.dob,
          occupation: values.occupation,
        }
      );
      setTouristData(response.data);
      message.success("Tourist created successfully!");
      if (response.status == 201) {
        navigate("/auth/signin");
      }
    } catch (error) {
      console.error("Error creating tourist:", error);
      const errorDetails =
        error.response?.data?.error || "Failed to create tourist.";
      // Display the error message with the custom prefix
      message.error(`Failed to create tourist: ${errorDetails}`);
    }
  };

  const onFinish = async (values) => {
    await createTourist(values);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
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
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "20px",
        }}
      >
        <Card
          style={{
            width: 650,
            height: 550,
            background: "rgba(255, 255, 255, 0.60)",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            borderRadius: "10px",
            padding: "20px",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: "15px" }}>
            <h1 style={{ fontSize: "24px", fontWeight: "bold" }}>
              Registeration
            </h1>
          </div>
          <Form
            name="basic"
            style={{
              maxWidth: 600,
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item
              //label="Email"
              name="email"
              rules={[
                { required: true, message: "Please input your email!" },
                { type: "email", message: "Please enter a valid email!" },
              ]}
              style={{ width: "80%" }}
            >
              <Input placeholder="Email" />
            </Form.Item>

            <Form.Item
              //label="Username"
              name="username"
              rules={[
                { required: true, message: "Please input your username!" },
              ]}
              style={{ width: "80%" }}
            >
              <Input placeholder="Username" />
            </Form.Item>

            <Form.Item
              //label="Password"
              name="password"
              rules={[
                { required: true, message: "Please input your password!" },
                { validator: passwordStrengthValidator },
              ]}
              style={{ width: "80%" }}
            >
              <Input.Password placeholder="Password" />
            </Form.Item>

            <Form.Item
              //label="Mobile number"
              name="mobile_number"
              rules={[
                { required: true, message: "Please input your mobile number!" },
                { len: 13, message: "Mobile number must be 13 digits!" },
                {
                  pattern: /^\+20\d{10}$/,
                  message: "Mobile number must start with +20",
                },
              ]}
              style={{ width: "80%" }}
            >
              <Input placeholder="Mobile Number" />
            </Form.Item>

            <Form.Item
              //label="Nationality"
              name="nationality"
              rules={[
                { required: true, message: "Please input your nationality!" },
              ]}
              style={{ width: "80%" }}
            >
              <Input placeholder="Nationality" />
            </Form.Item>

            <Form.Item
              //label="DOB"
              name="dob"
              rules={[
                { required: true, message: "Please input your DOB!" },
                {
                  validator: (_, value) =>
                    value && value.isAfter(new Date())
                      ? Promise.reject(
                          new Error("DOB cannot be in the future!")
                        )
                      : Promise.resolve(),
                },
              ]}
              style={{ width: "100%" }}
            >
              <DatePicker placeholder="Date of Birth" style={{ width: "80%" }}/>
            </Form.Item>

            <Form.Item
              //label="Occupation"
              name="occupation"
              rules={[
                { required: true, message: "Please select your occupation!" },
              ]}
              style={{ width: "80%" }}
            >
              <Select placeholder="Select your occupation">
                <Select.Option value="job">Job</Select.Option>
                <Select.Option value="student">Student</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item>
              <CustomButton
                type="primary"
                htmlType="submit"
                value="Register"
                size="s"
                rounded={true}
                loading={false}
              ></CustomButton>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </>
  );
};

export default CreateTourist;
