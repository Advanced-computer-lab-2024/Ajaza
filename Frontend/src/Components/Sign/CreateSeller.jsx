import React, { useState, useRef } from "react";
import { Form, Input, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import CustomButton from "../Common/CustomButton";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const CreateSeller = () => {
  const [sellerData, setSellerData] = useState([]);
  const navigate = useNavigate();
  const formRef = useRef(); // Create a ref for the form

  let decodedToken = null;
  const token = localStorage.getItem("token");
  if (token) {
    decodedToken = jwtDecode(token);
  }
  const userid = decodedToken ? decodedToken.userId : null;

  const createSeller = async (values) => {
    try {
      const formData = new FormData();

      formData.append("username", values.username);
      formData.append("pass", values.password);
      formData.append("email", values.email);

      console.log("Values:", values);

      if (values.document1 && values.document1.length > 0) {
        formData.append('id', values.document1[0].originFileObj);
      }

      if (values.document2 && values.document2.length > 0) {
        formData.append('taxationRegCard', values.document2[0].originFileObj);
      }

      const response = await axios.post(
        "http://localhost:5000/seller/guestSellerCreateProfile",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      message.success("Seller created successfully!");
      if (response.status === 201) {
        navigate("/auth/signin");
      }
      setSellerData(response.data);

      return response.data._id;
    } catch (error) {
      console.error("Error creating seller:", error);
      const errorDetails =
        error.response?.data?.message || error.response?.data?.error || "Failed to create seller.";
      message.error(`Failed to create seller: ${errorDetails}`);
    }
  };

  const Submit = async () => {
    // Capture the form values
    const values = formRef.current.getFieldsValue(); // Get form values
    console.log("Form values:", values); // Log the form values
    await createSeller(values); // Pass them to createSeller
  };



  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

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
          ref={formRef} // Attach the ref to the Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600, width: "100%" }}
          // onFinish={onFinish}
          // onFinishFailed={onFinishFailed}
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
            <Upload
              name="doc1"
              listType="text"
              beforeUpload={() => false}
              maxCount={1}
            >
              <CustomButton size="m" icon={<UploadOutlined />} value="Upload" />
            </Upload>
          </Form.Item>

          <Form.Item
            label="Taxation Registry Card"
            name="document2"
            valuePropName="fileList"
            getValueFromEvent={normFile}
            extra="Upload the taxation registry card."
          >
            <Upload
              name="doc2"
              listType="text"
              beforeUpload={() => false}
              maxCount={1}
            >
              <CustomButton size="m" icon={<UploadOutlined />} value="Upload" />
            </Upload>
          </Form.Item>

          {/* Submit Button */}
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <CustomButton
              type="primary"
              // htmlType="submit" 
              size="s"
              value="Register"
              rounded={true}
              loading={false}
              onClick={Submit} // Call Submit on button click
            />
          </Form.Item>
        </Form>
      </div>
    </>
  );
};

export default CreateSeller;