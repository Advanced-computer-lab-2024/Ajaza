import { Input } from "antd";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button, Form, Typography, message, Card } from "antd";
import { Box } from "@mui/material";
import image from "../../Assets/login.jpg";
import { Colors } from "../Common/Constants";
import CustomButton from "../Common/CustomButton";
import { apiUrl } from "../Common/Constants";
import { jwtDecode } from "jwt-decode";

const SignIn = () => {
  const [response, setResponse] = useState(null);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [clientReady, setClientReady] = useState(false);

  useEffect(() => {
    setClientReady(true);
  }, []);

  const info = (e) => {
    e.preventDefault();
    const username = form.getFieldValue("username");

    if (username && username.trim()) {
      message.info("Check your email or OTP sent!");
    } else {
      message.error("Please enter your username first!");
    }
  };

  const onFinish = (values) => {
    console.log("Success:", values);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const signIn = async () => {
    const fetchData = async () => {
      const body = {
        username: form.getFieldValue("username"),
        password: form.getFieldValue("password"),
      };

      // const config = {
      //   headers: {
      //     Authorization: `Bearer ${token}`,
      //     "Content-Type": "application/json",
      //   },
      // };

      try {
        const apiResponse = await axios.post(
          "http://localhost:5000/api/auth/login",
          body
        );

        if (apiResponse.status === 200) {
          console.log(apiResponse.data);

          const token = apiResponse.data.token;
          const decodedToken = jwtDecode(token);
          if (decodedToken?.userDetails?.pending) {
            message.error("Account is still pending");
            return;
          }
          if (!decodedToken?.userDetails?.acceptedTerms) {
            message.error(
              "Account has not yet accepted the terms of services (TODO redirect to term)"
            );
          }
          localStorage.setItem("token", apiResponse.data.token);

          navigate(`/${decodedToken.role}`);
        }

        if (apiResponse?.data?.message) {
          setFeedbackMessage(apiResponse.data.message);
          message.error(feedbackMessage);
        }
      } catch (error) {
        if (error?.response?.data?.message) {
          setFeedbackMessage(error?.response?.data?.message);
          message.error(feedbackMessage);
        }
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  };

  return (
    <>
      <Box
        display="flex"
        justifyContent="flex-start" // Align the items to the left
        alignItems="center"
        height="100vh"
        style={{
          backgroundImage: `url(${image})`, // Set the background image
          backgroundSize: "cover", // Cover the entire screen
          backgroundPosition: "center", // Center the background image
          paddingLeft: "20px", // Add some padding on the left for spacing
        }}
      >
        <Card
          title={<strong>User Login</strong>}
          bordered={false}
          style={{
            width: 450,
            padding: "20px", // Padding inside the box
            backgroundColor: "rgba(255, 255, 255, 0.55)", // Slight transparency
            textAlign: "left",
            marginLeft: "550px",
            marginTop: "100px",
          }}
        >
          <Form
            form={form}
            name="basic"
            layout="vertical" // Ensures the form fields stack vertically
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item
              name="username"
              rules={[
                { required: true, message: "Please input your username!" },
              ]}
            >
              <Input placeholder="Username" />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
            >
              <Input.Password placeholder="Password" />
            </Form.Item>

            <Form.Item>
              <Typography.Link
                href="/forgot-password"
                onClick={info}
                style={{ color: Colors.primary.default }}
              >
                Forgot password?
              </Typography.Link>
            </Form.Item>

            <Form.Item shouldUpdate>
              {() => (
                <CustomButton
                  size="s"
                  value={"Log in"}
                  style={{ marginLeft: "-8px", width: 370 }}
                  onClick={() => signIn()}
                  disabled={
                    !clientReady ||
                    !form.isFieldsTouched(true) ||
                    !!form
                      .getFieldsError()
                      .filter(({ errors }) => errors.length).length
                  }
                />
              )}
            </Form.Item>
          </Form>
        </Card>
      </Box>
    </>
  );
};

export default SignIn;
