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
          if (decodedToken?.userDetails?.requestingDeletion) {
            message.error(<>You have requested to delete your account</>);
            return;
          }

          if (  // condition 0,0 --not pending and did not accept terms
            !decodedToken?.userDetails?.pending &&
            !decodedToken?.userDetails?.acceptedTerms
          ) {
            // Redirect to Terms and Conditions page
            console.log("is pending:",decodedToken.userDetails.pending);
            navigate(`/auth/terms-and-conditions?role=${decodedToken.role}`); // Redirect to terms and conditions page --not functioning properly (tatos)
            localStorage.setItem("token", apiResponse.data.token);
            return;
          } 
          else if (decodedToken?.userDetails?.pending) {  // conditions 1,0 and 1,1 --pending
            message.error("Account is still pending");
            return;
          }
          else {
            //conditon 0,1 --not pending and accepted terms
            // Redirect to the user's respective page
            navigate(`/${decodedToken.role}`);
            localStorage.setItem("token", apiResponse.data.token);
          }

          
        }
        // if (apiResponse?.data?.message) {
        //   setFeedbackMessage(apiResponse.data.message);
        //   message.error(feedbackMessage);
        // }
      } catch (error) {
        if (error?.response?.data?.message) {
          setFeedbackMessage(error?.response?.data?.message);
          message.error(error?.response?.data?.message);
        }
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  };

  const handleKeyDown = (event) => {
    // function to enable pressing enter after entering credentials to sign in
    if (event.key === "Enter") {
      const username = form.getFieldValue("username");
      const password = form.getFieldValue("password");
      if (username && password) {
        signIn();
      }
    }
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
            onKeyDown={handleKeyDown} // Add the onKeyDown event listener here
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
