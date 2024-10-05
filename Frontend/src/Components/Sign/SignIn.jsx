// import { Input } from "antd";
// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import CustomButton from "../Common/CustomButton";
// import axios from "axios";
// import { apiUrl } from "../Common/Constants";
// import { Button, Form, Typography, message, Card } from 'antd';
// import { Box } from '@mui/material';

// const SignIn = () => {
//   const [response, setResponse] = useState(null);
//   const [feedbackMessage, setFeedbackMessage] = useState("");
//   const [username, setUsername] = useState("tourist1");
//   const [password, setPassword] = useState("hashed_password_1");

//   const info = (e) => {
//     e.preventDefault();
//     // Check if the username is empty
//     if (!username.trim()) {
//       message.error('Please enter your username first!');
//     } else {
//       message.info('Check your email or OTP sent!');
//     }
//   };

//   const onFinish = (values) => {
//     console.log('Success:', values);
//   };

//   const onFinishFailed = (errorInfo) => {
//     console.log('Failed:', errorInfo);
//   };

//   const navigate = useNavigate();

//   const signIn = async () => {
//     const token = "authToken";
//     const urlExtension = "api/auth/login";
//     const fetchData = async () => {
//       const body = {
//         username: username,
//         password: password,
//       };

//       const config = {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       };
//       try {
//         const apiResponse = await axios.post(
//           "http://localhost:5000/api/auth/login",
//           body
//         );

//         if (apiResponse.status === 200) {
//           setResponse(apiResponse.data);
//           localStorage.setItem("token", apiResponse.data.token);
//         }

//         if (apiResponse?.data?.message) {
//           setFeedbackMessage(apiResponse.data.message);
//         }
//       } catch (error) {
//         if (error?.response?.data?.message) {
//           setFeedbackMessage(error?.response?.data?.message);
//         }
//         console.error("Error fetching data:", error);
//       }
//     };
//     fetchData();
//   };

//   return (
//     <>
//       <Box
//         display="flex"
//         justifyContent="center"
//         alignItems="center"
//         height="100vh"
//       >
//         <Card
//           title="User Login"
//           bordered={false}
//           style={{
//             maxWidth: 400,
//             margin: 'auto',
//           }}
//         >
//           <Form
//             name="basic"
//             layout="vertical"
//             initialValues={{
//               remember: true,
//             }}
//             onFinish={onFinish}
//             onFinishFailed={onFinishFailed}
//             autoComplete="off"
//           >
//             <Form.Item
//               label="Username"
//               name="username"
//               rules={[
//                 {
//                   required: true,
//                   message: 'Please input your username!',
//                 },
//               ]}
//             >
//              <Input value={username} onChange={(e) => setUsername(e.target.value)} />
//             </Form.Item>

//             <Form.Item
//               label="Password"
//               name="password"
//               rules={[
//                 {
//                   required: true,
//                   message: 'Please input your password!',
//                 },
//               ]}
//             >
//               <Input.Password />
//             </Form.Item>

//             <Form.Item>
//               <Typography.Link href="/forgot-password" onClick={info}>
//                 Forgot password?
//               </Typography.Link>
//             </Form.Item>

//             <Form.Item>
//               <Button type="primary" htmlType="submit" block>
//                 Submit
//               </Button>
//             </Form.Item>
//           </Form>
//         </Card>
//       </Box>
//     </>
//   );
// };

// export default SignIn;

// import { Input } from "antd";
// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { Button, Form, Typography, message, Card , Flex} from 'antd';
// import { Box } from '@mui/material';
// import image from '../../Assets/landingPage.png';
// import { Colors } from "../Common/Constants";

// const SignIn = () => {
//   const [response, setResponse] = useState(null);
//   const [feedbackMessage, setFeedbackMessage] = useState("");
//   const [form] = Form.useForm();

//   const info = (e) => {
//     e.preventDefault();
//     const username = form.getFieldValue('username');
//     console.log("Username value:", username); // Debug log

//     if (username && username.trim()) {
//         message.info('Check your email or OTP sent!');
//     } else {
//         message.error('Please enter your username first!');
//     }
//   };

//   const onFinish = (values) => {
//     console.log('Success:', values);
//   };

//   const onFinishFailed = (errorInfo) => {
//     console.log('Failed:', errorInfo);
//   };

//   const signIn = async () => {
//     const token = "authToken";
//     const fetchData = async () => {
//       const body = {
//         username: form.getFieldValue('username'),
//         password: form.getFieldValue('password'),
//       };

//       const config = {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       };
//       try {
//         const apiResponse = await axios.post(
//           "http://localhost:5000/api/auth/login",
//           body
//         );

//         if (apiResponse.status === 200) {
//           setResponse(apiResponse.data);
//           localStorage.setItem("token", apiResponse.data.token);
//         }

//         if (apiResponse?.data?.message) {
//           setFeedbackMessage(apiResponse.data.message);
//         }
//       } catch (error) {
//         if (error?.response?.data?.message) {
//           setFeedbackMessage(error?.response?.data?.message);
//         }
//         console.error("Error fetching data:", error);
//       }
//     };
//     fetchData();
//   };

//   return (

//     <>
//       <Box
//         display="flex"
//         justifyContent="space-between"
//         alignItems="center"
//         height="100vh"
//         paddingX={10}
//       >
//         <Card
//           title="User Login"
//           bordered={false}
//           style={{
//             width: 500,
//             height: 450 ,
//             left : 85

//           }}
//         >

//           <Form
//            form={form}
//             name="basic"
//             initialValues={{ remember: true }}
//             onFinish={onFinish}
//             onFinishFailed={onFinishFailed}
//             autoComplete="off"
//           >
//             <Form.Item
//               label="Username"
//               name="username"
//               rules={[{ required: true, message: 'Please input your username!' }]}
//             >
//               <Input />
//             </Form.Item>

//             <Form.Item
//               label="Password"
//               name="password"
//               rules={[{ required: true, message: 'Please input your password!' }]}
//             >
//               <Input.Password />
//             </Form.Item>

//             <Form.Item>
//               <Typography.Link href="/forgot-password" onClick={info} style={{color: Colors.primary.default}}>
//                 Forgot password?
//               </Typography.Link>
//             </Form.Item>

//             <Form.Item>
//               <Button type="primary" htmlType="submit" block style={{backgroundColor: Colors.primary.default}}>
//                 Submit
//               </Button>
//             </Form.Item>
//           </Form>
//         </Card>

//         <img
//           style={{

//             height: "680px",
//             width: "auto",
//             maxWidth: "100%",
//             maxHeight: "100%",
//             objectFit: "cover",
//             position: "relative",
//             left:200
//           }}
//           src={image}
//           alt="Landing Page"
//         />
//       </Box>
//     </>
//   );
// };

// export default SignIn;

import { Input } from "antd";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button, Form, Typography, message, Card } from "antd";
import { Box } from "@mui/material";
import image from "../../Assets/login.svg";
import { Colors } from "../Common/Constants";
import CustomButton from "../Common/CustomButton";
import { apiUrl } from "../Common/Constants";
import { jwtDecode } from "jwt-decode";

const SignIn = () => {
  const [response, setResponse] = useState(null);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const info = (e) => {
    e.preventDefault();
    const username = form.getFieldValue("username");

    if (username && username.trim()) {
      message.info("Check your email or OTP sent!");
    } else {
      message.error("Please enter your username first!");
    }
  };

  const onFinish = async (values) => {
    console.log("Success:", values);
    await signIn(); // Call signIn function on form submission
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const signIn = async () => {
    const token = "authToken";
    const fetchData = async () => {
      const body = {
        username: form.getFieldValue("username"),
        password: form.getFieldValue("password"),
      };

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };
      try {
        const apiResponse = await axios.post(
          "http://localhost:5000/api/auth/login",
          body
        );

        if (apiResponse.status === 200) {
          setResponse(apiResponse.data);
          localStorage.setItem("token", apiResponse.data.token);

          const decodedToken = jwtDecode(apiResponse.data.token);
          navigate(`/${decodedToken.role}`);
        }

        if (apiResponse?.data?.message) {
          setFeedbackMessage(apiResponse.data.message);
        }
      } catch (error) {
        if (error?.response?.data?.message) {
          setFeedbackMessage(error?.response?.data?.message);
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
                style={{ color: Colors.primary.light }}
              >
                Forgot password?
              </Typography.Link>
            </Form.Item>

            <Form.Item>
              <CustomButton
                size="s"
                value={"Submit"}
                style={{ marginLeft: "-8px", width: 370 }}
                onClick={form.submit}
              />
            </Form.Item>
          </Form>
        </Card>
      </Box>
    </>
  );
};

export default SignIn;
