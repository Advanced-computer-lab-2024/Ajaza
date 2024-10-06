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
} from "antd";
import {
  UserOutlined,
  EditOutlined,
  SaveOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import "./Profile.css";
import { apiUrl } from "../Common/Constants";

const { Title } = Typography;

const Profile = () => {
  const [response, setResponse] = useState(null); // Store decoded token or API data
  const [userDetails, setUserDetails] = useState(null); // Store user details from token
  const [isEditing, setIsEditing] = useState(false); // Edit mode toggle
  const [form] = Form.useForm();
  const [role, setRole] = useState(""); // Store user role
  const [pending, setPending] = useState(false); // Store pending status

  useEffect(() => {
    const token = localStorage.getItem("token");
    let decodedToken = null;
    if (token) {
      decodedToken = jwtDecode(token);
      console.log("Decoded Token:", decodedToken); // Debugging
      setResponse(decodedToken); // Set initial profile data
      setRole(decodedToken.role); // Set user role

      // Extract user details from the token
      const userDetails = decodedToken.userDetails;
      console.log("User Details:", userDetails); // Debugging
      setUserDetails(userDetails);
      setPending(userDetails.pending); // Set pending status from userDetails

      // Populate form fields with userDetails values
      form.setFieldsValue({
        ...userDetails,
        "companyProfile.name": userDetails?.companyProfile?.name || "",
        "companyProfile.desc": userDetails?.companyProfile?.desc || "",
        "companyProfile.location": userDetails?.companyProfile?.location || "",
      });
    }
  }, [form]);

  // Handle saving profile changes
  const handleSave = async (values) => {
    try {
      const token = localStorage.getItem("token");
      let urlExtension;

      // Determine the URL extension based on the user's role
      if (role === "guide") {
        urlExtension = `guide/updateGuideProfile/${response.userId}`;
      } else if (role === "advertiser") {
        urlExtension = `advertiser/advertiserUpdateProfile/${response.userId}`;
      }

      // Extract companyProfile fields from values
      const {
        "companyProfile.name": name,
        "companyProfile.desc": desc,
        "companyProfile.location": location,
        previousWork,
        ...rest
      } = values;
      const updatedProfile = {
        ...rest,
        companyProfile: { name, desc, location },
        previousWork: previousWork ? previousWork.split(" ") : [],
      };

      await axios.put(`${apiUrl}${urlExtension}`, updatedProfile, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUserDetails((prev) => ({ ...prev, ...updatedProfile })); // Update the local profile data
      form.setFieldsValue(updatedProfile); // Update form initial values
      setIsEditing(false); // Exit edit mode
      message.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      message.error("Failed to update profile.");
    }
  };

  // Handle entering edit mode
  const handleEdit = () => {
    setIsEditing(true);

    // Ensure the form is populated with the latest user details
    if (userDetails) {
      form.setFieldsValue({
        ...userDetails,
        "companyProfile.name": userDetails?.companyProfile?.name || "",
        "companyProfile.desc": userDetails?.companyProfile?.desc || "",
        "companyProfile.location": userDetails?.companyProfile?.location || "",
        previousWork: userDetails.previousWork
          ? userDetails.previousWork.join(" ")
          : "",
      });
    }
  };

  // Cancel editing
  const handleCancel = () => {
    setIsEditing(false);
    form.setFieldsValue(userDetails); // Reset the form to initial values
  };

  // Utility function to format keys
  const formatKey = (key) => {
    // Remove keys like 'id' and '_id'
    if (key === "id" || key === "_id") {
      return null;
    }

    // Replace dots with spaces
    key = key.replace(/\./g, " ");

    // Convert camelCase to separate words with spaces
    key = key.replace(/([a-z])([A-Z])/g, "$1 $2");

    // Capitalize the first letter of each word
    key = key.replace(/\b\w/g, (char) => char.toUpperCase());

    return key;
  };

  return (
    <div className="profile-page">
      <Card
        style={{
          width: "100%",
          maxWidth: 600,
          margin: "50px auto",
          padding: "20px",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
        }}
        actions={[
          isEditing ? (
            <SaveOutlined key="save" onClick={() => form.submit()} />
          ) : (
            !pending && <EditOutlined key="edit" onClick={handleEdit} />
          ),
          isEditing && <CloseOutlined key="cancel" onClick={handleCancel} />,
        ]}
      >
        <Space direction="vertical" align="center" style={{ width: "100%" }}>
          <Avatar
            size={120}
            icon={<UserOutlined />}
            style={{ backgroundColor: "#87d068" }}
          />
          {isEditing ? (
            <Form
              form={form}
              layout="vertical"
              initialValues={form.getFieldsValue()}
              onFinish={handleSave}
              style={{ width: "100%" }}
            >
              {/* Form fields for advertiser */}
              {role === "advertiser" && (
                <>
                  <Form.Item name="email" label="Email">
                    <Input />
                  </Form.Item>
                  <Form.Item name="link" label="Link">
                    <Input />
                  </Form.Item>
                  <Form.Item name="hotline" label="Hotline">
                    <Input />
                  </Form.Item>

                  {/* Company Profile fields */}
                  <Form.Item
                    name="companyProfile.name"
                    label="Company Profile Name"
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    name="companyProfile.desc"
                    label="Company Profile Description"
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    name="companyProfile.location"
                    label="Company Profile Location"
                  >
                    <Input />
                  </Form.Item>
                </>
              )}

              {/* Form fields for guide */}
              {role === "guide" && (
                <>
                  <Form.Item name="email" label="Email">
                    <Input />
                  </Form.Item>
                  <Form.Item name="mobile" label="Mobile">
                    <Input />
                  </Form.Item>
                  <Form.Item
                    name="yearsOfExperience"
                    label="Years of Experience"
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item name="previousWork" label="Previous Work">
                    <Input.TextArea />
                  </Form.Item>
                </>
              )}
            </Form>
          ) : (
            // Display profile details (non-edit view)
            userDetails && (
              <div>
                <Title level={2}>{userDetails.username}</Title>
                <div>
                  <strong>Email: </strong>
                  <span>{userDetails.email}</span>
                </div>
                {role === "guide" && (
                  <>
                    {userDetails.mobile && (
                      <div>
                        <strong>Mobile: </strong>
                        <span>{userDetails.mobile}</span>
                      </div>
                    )}
                    {userDetails.yearsOfExperience && (
                      <div>
                        <strong>Years of Experience: </strong>
                        <span>{userDetails.yearsOfExperience}</span>
                      </div>
                    )}
                    {Array.isArray(userDetails.previousWork) &&
                      userDetails.previousWork.length > 0 && (
                        <div>
                          <strong>Previous Work: </strong>
                          <span>{userDetails.previousWork.join(", ")}</span>
                        </div>
                      )}
                  </>
                )}
                {role === "advertiser" && (
                  <>
                    <div>
                      <strong>Link: </strong>
                      <span>{userDetails.link}</span>
                    </div>
                    <div>
                      <strong>Hotline: </strong>
                      <span>{userDetails.hotline}</span>
                    </div>
                  </>
                )}
              </div>
            )
          )}
        </Space>
      </Card>
    </div>
  );
};

export default Profile;
