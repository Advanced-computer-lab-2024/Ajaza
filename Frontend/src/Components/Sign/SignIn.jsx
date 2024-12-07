import { Input } from "antd";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button, Form, Typography, message, Card } from "antd";
import { Box } from "@mui/material";
import image from "../../Assets/signinfinal.png";
import plainImage from "../../Assets/Register.png";
import { Colors } from "../Common/Constants";
import CustomButton from "../Common/CustomButton";
import { apiUrl } from "../Common/Constants";
import { jwtDecode } from "jwt-decode";
import LoadingSpinner from "../Common/LoadingSpinner";

const SignIn = () => {
  const [response, setResponse] = useState(null);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [clientReady, setClientReady] = useState(false);
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);

  useEffect(() => {
    setClientReady(true);
  }, []);

  const info = async (e) => {
    e.preventDefault();
    setForgotPasswordLoading(true);
    const username = form.getFieldValue("username");

    if (username && username.trim()) {
      try {
        await axios.post(`${apiUrl}api/auth/forgot-password/`, { username });
        message.info("Check your email or OTP sent!");
        localStorage.setItem("forgetUsername", username);
        navigate("forgot-password");
      } catch (error) {
        setForgotPasswordLoading(false);
        if (error?.response?.data?.message) {
          message.error(error?.response?.data?.message);
        } else {
          message.error("Error sending your OTP");
        }
        console.error(error?.response?.data?.message);
      }
    } else {
      message.error("Please enter your username first!");
    }
    setForgotPasswordLoading(false);
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
          console.log(token);

          const decodedToken = jwtDecode(token);
          const role = decodedToken.role;
          console.log("role:", role);
          console.log(
            "requesting deletion:",
            decodedToken?.userDetails?.requestingDeletion
          );
          console.log(
            "accepted terms:",
            decodedToken?.userDetails?.acceptedTerms
          );
          console.log("pending:", decodedToken?.userDetails?.pending);
          if (decodedToken?.userDetails?.requestingDeletion) {
            message.error(<>You have requested to delete your account</>);
            return;
          }

          if (
            // condition 0,0 --not pending and did not accept terms
            decodedToken?.userDetails?.pending === false &&
            decodedToken?.userDetails?.acceptedTerms === false
          ) {
            // Redirect to Terms and Conditions page
            if (
              role === "guide" ||
              role === "advertiser" ||
              role === "seller"
            ) {
              console.log("is pending:", decodedToken.userDetails.pending);
              navigate(`/auth/terms-and-conditions?role=${decodedToken.role}`); // Redirect to terms and conditions page
              localStorage.setItem("token", apiResponse.data.token);
              return;
            } else {
              // Redirect to the user's respective page
              navigate(`/${decodedToken.role}`);
              localStorage.setItem("token", apiResponse.data.token);
            }
          } else if (decodedToken?.userDetails?.pending === true) {
            // conditions 1,0 and 1,1 --pending
            message.error("Account is still pending");
            return;
          } else {
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

  const handleSignUpClick = () => {
    navigate("/auth/signup");
  };

  const handleGuestClick = () => {
    localStorage.removeItem("token");
    navigate("/guest");
  };

  return (
    <div
      style={{
        width: "100vw",
        display: "grid",
        gridTemplateColumns: "60% 40%",
        height: "100vh  ",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          backgroundImage: `url(${image})`,
          backgroundSize: "170% 100%",
          backgroundPositionX: "0px",
        }}
      ></div>
      <div
        style={{
          width: "100%",
          height: "100%",
          backgroundImage: `url(${plainImage})`,
          backgroundSize: "170% 100%",
          backgroundPositionX: "0px",
        }}
      >
        <Card
          title={
            <h2 style={{ fontWeight: "bold", textAlign: "center" }}>Sign In</h2>
          }
          //bordered={false}
          style={{
            width: "100%",
            height: "100%",
            padding: "20px", // Padding inside the box
            backgroundColor: "rgba(255, 255, 255, 0.85)", // Slight transparency
            textAlign: "left",
            borderRadius: "0px",

            alignContent: "center",
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
            style={{ padding: "30px" }}
          >
            <Form.Item
              style={{ top: 90 }}
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

            {!forgotPasswordLoading ? (
              <Form.Item>
                <Typography.Link
                  href="/forgot-password"
                  onClick={info}
                  style={{
                    color: Colors.primary.default,
                    margin: "0 0 20px 5px",
                    textDecoration: "underline",
                  }}
                >
                  Forgot password?
                </Typography.Link>
              </Form.Item>
            ) : (
              <LoadingSpinner
                containerStyle={{
                  marginTop: "0px",
                  justifyContent: "center",
                  marginBottom: "16px",
                }}
                spinStyle={{ fontSize: "25px" }}
              />
            )}
            <Form.Item style={{ textAlign: "center" }} shouldUpdate>
              {() => (
                <CustomButton
                  size="s"
                  value={"Sign in"}
                  style={{ width: "80%", margin: "auto 0" }}
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
            <Form.Item style={{ textAlign: "center" }}>
              <Typography.Text
                style={{ marginBottom: "9px", display: "block" }}
              >
                Don't have an account?{" "}
                <Typography.Link
                  onClick={handleSignUpClick}
                  style={{
                    color: Colors.primary.default,
                    //margin: "0 0 20px 5px",
                    textDecoration: "underline",
                  }}
                >
                  Sign Up
                </Typography.Link>
              </Typography.Text>

              <Typography.Link
                onClick={handleGuestClick}
                style={{
                  color: Colors.primary.default,
                  //margin: "0 0 20px 5px",
                  textDecoration: "underline",
                  marginBottom: "9px",
                  display: "block",
                }}
              >
                Continue as Guest
              </Typography.Link>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default SignIn;
