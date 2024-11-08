import React, { useState } from "react";
import { CustomLayout } from "../Common";
import { Route, Routes, useNavigate } from "react-router-dom";
import Activities from "../Activities";
import Itineraries from "../Itineraries";
import { CalendarOutlined, UploadOutlined } from "@ant-design/icons";
import { Form, Input, Upload, message } from "antd";
import CustomButton from "../Common/CustomButton";
import axios from "axios";
import SignIn from "./SignIn";

const CreateSeller = () => {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    document1: [],
    document2: [],
  });
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false); // Loading state for displaying the wait message
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFileChange = (name) => (info) => {
    let fileList = [...info.fileList];
    setFormData((prevData) => ({ ...prevData, [name]: fileList }));
  };

  const nextStep = async () => {
    setLoading(true)
    // Validate the registration form before moving to the next step
    try {
      await validateRegistrationForm();
      setCurrentStep(2);
    } catch (error) {
      message.error(error.message);
    }
    finally{
      setLoading(false)
    }
  };

  const previousStep = () => {
    setCurrentStep(1);
  };

  const validateRegistrationForm = async () => {
    const { email, username, password } = formData;

    // Basic client-side validation
    if (!email || !username || !password) {
      throw new Error("All fields are required!");
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      throw new Error("Please enter a valid email!");
    }
    if (password.length < 6) {
      throw new Error("Password must be at least 6 characters!");
    }

    // Check for existing username and email in the database
    try {
      const response = await axios.post("http://localhost:5000/seller/validateEmailUsername", {
        email,
        username,
      });

      if (response.data.exists) {
        throw new Error(response.data.message); // Use custom error message from backend
      }
      
    } catch (error) {
      throw new Error(error.response?.data?.message || "Validation failed.");
    }
  };

  const registerSeller = async () => {
  setLoading(true)
  try {
    await validateUploadForm(); // Validate upload form before submitting

    const formDataToSubmit = new FormData();
    formDataToSubmit.append("username", formData.username);
    formDataToSubmit.append("pass", formData.password);
    formDataToSubmit.append("email", formData.email);

    if (formData.document1 && formData.document1.length > 0) {
      formDataToSubmit.append("id", formData.document1[0].originFileObj);
    }

    if (formData.document2 && formData.document2.length > 0) {

      formDataToSubmit.append("taxationRegCard", formData.document2[0].originFileObj);
      
    }
    navigate("/auth/signin");

    const response = await axios.post(
      "http://localhost:5000/seller/guestSellerCreateProfile",
      formDataToSubmit,
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

  } catch (error) {
    if (error.message === "Please upload your ID!" || error.message === "Please upload your Taxation Registry Card!") {
      message.error(error.message);
    } else {
      const errorDetails = error.response?.data?.message || error.response?.data?.error || "Failed to create Seller.";
      message.error(`Failed to Seller: ${errorDetails}`);
    }
    
  }
  finally{
    setLoading(false)
  }
};

const validateUploadForm = () => {
  return new Promise((resolve, reject) => {
    if (!formData.document1 || formData.document1.length === 0) {
      reject(new Error("Please upload your ID!"));
    }
    if (!formData.document2 || formData.document2.length === 0) {
      reject(new Error("Please upload your Taxation Registry Card!"));
    }
    resolve();
  });
};

const beforeUpload = (file) => {
  const isImage = file.type.startsWith("image/");
  if (!isImage) {
    message.error("You can only upload image files!");
  }
  return isImage || Upload.LIST_IGNORE;
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
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600, width: "100%" }}
          autoComplete="off"
        >
          {currentStep === 1 && (
            <>
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: "Please input your email!" },
                  { type: "email", message: "Please enter a valid email!" },
                ]}
              >
                <Input name="email" value={formData.email} onChange={handleInputChange} />
              </Form.Item>

              <Form.Item
                label="Username"
                name="username"
                rules={[{ required: true, message: "Please input your username!" }]}
              >
                <Input name="username" value={formData.username} onChange={handleInputChange} />
              </Form.Item>

              <Form.Item
                label="Password"
                name="password"
                rules={[
                  { required: true, message: "Please input your password!" },
                  { min: 6, message: "Password must be at least 6 characters!" },
                ]}
              >
                <Input.Password name="password" value={formData.password} onChange={handleInputChange} />
              </Form.Item>

              <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                <CustomButton
                  type="primary"
                  onClick={nextStep}
                  size="s"
                  value={loading?"":"Next"}
                  rounded={true}
                  loading={loading}
                />
              </Form.Item>
            </>
          )}

          {currentStep === 2 && (
            <>
              {/* Upload ID */}
              <Form.Item
                label="ID"
                name="document1"
                valuePropName="fileList"
                getValueFromEvent={(e) => e.fileList}
                extra="Upload your ID."
              >
                <Upload
                  name="doc1"
                  listType="text"
                  beforeUpload={beforeUpload}
                  maxCount={1}
                  fileList={formData.document1}
                  onChange={handleFileChange("document1")}
                  accept="image/*" // Only accept image files
                >
                  <CustomButton icon={<UploadOutlined />} size="m" value="Upload" />
                </Upload>
              </Form.Item>

              {/* Upload Taxation Registry Card */}
              <Form.Item
                label="Taxation Registry Card"
                name="document2"
                valuePropName="fileList"
                getValueFromEvent={(e) => e.fileList}
                extra="Upload your Taxation Registry Card."
              >
                <Upload
                  name="doc2"
                  listType="text"
                  beforeUpload={beforeUpload}
                  maxCount={1}
                  fileList={formData.document2}
                  onChange={handleFileChange("document2")}
                  accept="image/*" // Only accept image files
                >
                  <CustomButton icon={<UploadOutlined />} size="m" value="Upload" />
                </Upload>
              </Form.Item>

              <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                <CustomButton
                  type="default"
                  onClick={previousStep}
                  size="s"
                  value="Previous"
                  rounded={true}
                />
                
                <CustomButton
                  type="primary"
                  onClick={registerSeller}
                  size="s"
                  value="Register"
                  rounded={true}
                />
              </Form.Item>
            </>
          )}
        </Form>
      </div>

      <Routes>
        <Route path="/itineraries" element={<Itineraries />} />
        <Route path="/auth/signin" element={<SignIn />} />
        {/* Add other routes as needed */}
      </Routes>
    </>
  );
};

export default CreateSeller;