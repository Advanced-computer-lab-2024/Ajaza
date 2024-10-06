import React, { useState, useEffect } from "react";
import { Form, Input, Upload, message, Table } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import CustomButton from "../Common/CustomButton";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
// import SellerPage from "./Components/Seller/SellerPage";
// import CreateFormPage from "./Components/Seller/CreateSeller";
// import SellerForm from "./Components/Seller/SellerForm";

const CreateSeller = () => {
  const [sellerData, setSellerData] = useState([]);
  const navigate = useNavigate();

  let decodedToken = null;
  const token = localStorage.getItem("token");
  if (token) {
    decodedToken = jwtDecode(token);
  }
  const userid = decodedToken ? decodedToken.userId : null;

  const createSeller = async (values) => {
    try {
      console.log("Values:", values);
      console.log(values.email);
      console.log(values.username);
      console.log(values.password);

      const headers = {
        'Content-Type': 'multipart/form-data',
      }

      const response = await axios.post(
        "http://localhost:5000/seller/guestSellerCreateProfile",
        {
          id: values.document1,
          username: values.username,
          pass: values.password,
          email: values.email,
          taxationRegCard: values.document2,
        }
        , headers
      );
      const newSellerId = response.data._id;

      message.success("Seller created successfully!");
      if (response.status == 201) {
        navigate("/auth/signin");
      }
      setSellerData(response.data);

      return newSellerId;
    } catch (error) {
      console.error("Error creating seller:", error);
      message.error("Failed to create seller.");
    }
  };

  const onFinish = async (values) => {
    await createSeller(values);
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
            <Upload name="doc1" listType="text " beforeUpload={() => false}>
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
            <Upload name="doc2" listType="text" beforeUpload={() => false}>
              <CustomButton size="m" icon={<UploadOutlined />} value="Upload" />
            </Upload>
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <CustomButton type="primary" htmlType="submit" value="Register" />
          </Form.Item>
        </Form>
      </div>
      {/* <Routes>
        <Route path="/seller" element={<SellerPage />} />
        <Route path="/createform" element={<CreateFormPage />} />
        <Route path="/seller-form" element={<SellerForm />} />
      </Routes> */}
    </>
  );
};

export default CreateSeller;
