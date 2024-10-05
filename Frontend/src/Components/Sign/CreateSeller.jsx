import React, { useState, useEffect } from "react";
import { Form, Input, Upload, message, Table } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import CustomButton from "../Common/CustomButton";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const CreateSeller = () => {
  const [sellerData, setSellerData] = useState([]);
  const navigate = useNavigate();

  let decodedToken = null;
  const token = localStorage.getItem("token");
  if (token) {
    decodedToken = jwtDecode(token);
  }
  const userid = decodedToken ? decodedToken.userId : null;

  // const fetchSeller = async () => {
  //     setLoading(true);
  //     try {
  //         const response = await apiClient.get('/guestSellerCreateProfile');
  //         setSellerData(response.data);
  //     } catch (error) {
  //         console.error("Error fetching sellers:", error);
  //         message.error("Failed to fetch sellers.");
  //     } finally {
  //         setLoading(false);
  //     }
  // };

  // useEffect(() => {
  //     fetchSeller(); // Fetch sellers on component mount
  // }, []);

  const createSeller = async (values) => {
    try {
      console.log("Values:", values);
      console.log(values.email);
      console.log(values.username);
      console.log(values.password);

      const response = await axios.post(
        "http://localhost:5000/seller/guestSellerCreateProfile",
        {
          username: values.username,
          email: values.email,
          pass: values.password,
        }
      );
      const newSellerId = response.data._id;
      console.log("New seller ID:", newSellerId);
      setSellerData(response.data);
      message.success("Seller created successfully!");
      return newSellerId;
    } catch (error) {
      console.error("Error creating seller:", error);
      message.error("Failed to create seller.");
    }
  };

  useEffect(() => {
    //createSeller();
  }, []);

  const onFinish = async (values) => {
    const newSellerId = await createSeller(values);
    if (newSellerId) {
      navigate("/seller", { state: { newSellerId } });
      // Pass the actual newSellerId here
    }
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

  const columns = [
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => <CustomButton type="primary" value="Edit" />,
    },
  ];

  return (
    <>
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
            label="ID"
            name="document1"
            valuePropName="fileList"
            getValueFromEvent={normFile}
            extra="Upload the ID."
          >
            <Upload name="doc1" listType="text">
              <CustomButton size="m" icon={<UploadOutlined />} value="Upload" />
            </Upload>
          </Form.Item>

          <Form.Item
            label="Taxation Registery Card"
            name="document2"
            valuePropName="fileList"
            getValueFromEvent={normFile}
            extra="Upload the taxation registery card."
          >
            <Upload name="doc2" listType="text">
              <CustomButton size="m" icon={<UploadOutlined />} value="Upload" />
            </Upload>
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <CustomButton type="primary" htmlType="submit" value="Register" />
          </Form.Item>
        </Form>
      </div>
    </>
  );
};

export default CreateSeller;
