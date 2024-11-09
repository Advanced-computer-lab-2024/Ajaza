import React, { useEffect, useState } from "react";
import {
  Card,
  Avatar,
  Typography,
  Space,
  Input,
  Button,
  Form,
  message,
  Modal,
  Flex,
  Upload,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import CustomButton from "./CustomButton";
import {
  UserOutlined,
  EditOutlined,
  SaveOutlined,
  CloseOutlined,
  DeleteOutlined,
  WarningFilled,
} from "@ant-design/icons";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import "./Image.css";
import { apiUrl } from "../Common/Constants";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;

const Image = () => {
  const [response, setResponse] = useState(null); // Store decoded token or API data
  const [userDetails, setUserDetails] = useState(null); // Store user details from token
  const [role, setRole] = useState(""); // Store user role
  const [logo, setLogo] = useState("http://localhost:3000/uploads/logo.svg"); // Store logo image
  const [photo, setPhoto] = useState("http://localhost:3000/uploads/logo.svg"); // Store photo image
  const navigate = useNavigate(); // useNavigate hook for programmatic navigation

  useEffect(() => {
    const token = localStorage.getItem("token");
    let decodedToken = null;
    if (token) {
      decodedToken = jwtDecode(token);
      setResponse(decodedToken); // Set initial profile data
      setRole(decodedToken.role);
      const userDetails = decodedToken.userDetails;
      setUserDetails(userDetails);
      if (userDetails.logo) {
        const logoPath = `/uploads/${userDetails.logo}.jpg`;
        setLogo(logoPath);
      }
      if (userDetails.photo) {
        const photoPath = `/uploads/${userDetails.photo}.jpg`;
        setPhoto(photoPath);
      }
    }
  }, []);

  const handleSave = async (values) => {
    try {
      const token = localStorage.getItem("token");
      let urlExtension;

      // Determine the URL extension based on the user's role
      if (role === "guide") {
        urlExtension = `guide/updateGuideProfile/${response.userId}`;
      } else if (role === "advertiser") {
        urlExtension = `advertiser/advertiserUpdateProfile/${response.userId}`;
      } else if (role === "seller") {
        urlExtension = `seller/sellerUpdateProfile/${response.userId}`;
      }

      const updatedProfile = new FormData();
      if (values.logo && values.logo.length > 0) {
        updatedProfile.append("logo", values.logo[0].originFileObj);
      }

      if (values.photo && values.photo.length > 0) {
        updatedProfile.append("photo", values.photo[0].originFileObj);
      }

      // Make API request to update profile
      const apiResponse = await axios.patch(
        `${apiUrl}${urlExtension}`,
        updatedProfile,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(apiUrl, urlExtension);

      if (apiResponse.status === 200) {
        const newToken = apiResponse.data.token;
        if (!newToken || typeof newToken !== "string") {
          throw new Error("Invalid token returned from API");
        }
        localStorage.setItem("token", newToken);

        const decodedToken = jwtDecode(newToken);
        const responseData = apiResponse.data;
        setResponse(decodedToken);
        if (role !== "guide") {
          if (!responseData.updatedSeller) {
            setLogo(`/uploads/${responseData.updatedAdvertiser.logo}.jpg`);
          } else {
            setLogo(`/uploads/${responseData.updatedSeller.logo}.jpg`);
          }
        } else {
          setPhoto(`/uploads/${responseData.updatedGuide.photo}.jpg`);
        }

        setUserDetails(decodedToken.userDetails);
        message.success("Profile updated successfully!");
      } else {
        message.error("Failed to update profile.");
        console.log("Error updating profile:", apiResponse);
      }
    } catch (error) {
      console.error("Error uploading Image:", error);
      message.error("Failed to upload Image.");
    }
  };

  const onFinish = async (values) => {
    await handleSave(values);
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

  return (
    <>
      <Card
        style={{
          width: "100%",
          maxWidth: 600,
          margin: "50px auto",
          padding: "20px",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h1>Change Image</h1>
        <br></br>
        <Space direction="vertical" align="center" style={{ width: "100%" }}>
          {/* Display the logo if the role is seller */}
          {role === "seller" && (
            <div>
              <img
                src={logo}
                alt="Logo"
                style={{ width: "100px", height: "100px" }}
              />
              {console.log("Logo path:", logo, "end")} {/* Check logo path */}
            </div>
          )}
          {role === "advertiser" && (
            <div>
              <img
                src={logo}
                alt="Logo"
                style={{ width: "100px", height: "100px" }}
              />
              {console.log("Logo path:", logo, "end")} {/* Check logo path */}
            </div>
          )}
          {/* Display the logo if the role is seller */}
          {role === "guide" && photo && (
            <div>
              <img
                src={photo}
                alt="Photo"
                style={{ width: "100px", height: "100px" }}
              />
            </div>
          )}
          <Form
            name="basic"
            layout="vertical"
            onFinish={handleSave}
            onFinishFailed={onFinishFailed}
            style={{ width: "100%" }}
          >
            {/* Form fields for advertiser */}
            {role === "advertiser" && (
              <>
                <Form.Item
                  label="Logo"
                  name="logo"
                  valuePropName="fileList"
                  getValueFromEvent={normFile}
                  rules={[
                    { required: true, message: "Please upload your Logo!" },
                  ]}
                  extra="Upload the Logo."
                >
                  <Upload
                    name="logo"
                    listType="text"
                    beforeUpload={() => false}
                    maxCount={1}
                  >
                    <CustomButton
                      size="m"
                      icon={<UploadOutlined />}
                      value="Upload"
                    />
                  </Upload>
                </Form.Item>
              </>
            )}

            {/* Form fields for guide */}
            {role === "guide" && (
              <>
                <Form.Item
                  label="Photo"
                  name="photo"
                  valuePropName="fileList"
                  getValueFromEvent={normFile}
                  rules={[
                    { required: true, message: "Please upload your Photo!" },
                  ]}
                  extra="Upload the Photo."
                >
                  <Upload
                    name="doc1"
                    listType="text"
                    beforeUpload={() => false}
                    maxCount={1}
                  >
                    <CustomButton
                      size="m"
                      icon={<UploadOutlined />}
                      value="Upload"
                    />
                  </Upload>
                </Form.Item>
              </>
            )}
            {/* Form fields for seller */}
            {role === "seller" && (
              <>
                <Form.Item
                  label="Logo"
                  name="logo"
                  valuePropName="fileList"
                  getValueFromEvent={normFile}
                  rules={[
                    { required: true, message: "Please upload your Logo!" },
                  ]}
                  extra="Upload the Logo."
                >
                  <Upload
                    name="logo"
                    listType="text"
                    beforeUpload={() => false}
                    maxCount={1}
                  >
                    <CustomButton
                      size="m"
                      icon={<UploadOutlined />}
                      value="Upload"
                    />
                  </Upload>
                </Form.Item>
              </>
            )}
            <Form.Item wrapperCol={{ offset: 4, span: 16 }}>
              <CustomButton
                type="primary"
                htmlType="submit"
                size="s"
                value="Submit"
                rounded={true}
                loading={false}
              />
            </Form.Item>
          </Form>
        </Space>
      </Card>
    </>
  );
};

export default Image;
