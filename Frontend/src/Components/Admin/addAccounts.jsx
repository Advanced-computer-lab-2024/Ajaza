import React, { useState } from "react";
import {
  Breadcrumb,
  Layout,
  Menu,
  theme,
  Button,
  Input,
  Form,
  message,
} from "antd";
import axios from "axios"; // Import axios
import AdminCustomLayout from "./AdminCustomLayout";
import { apiUrl } from "../Common/Constants";

const { Header, Content } = Layout;

const menuItems = [
  { key: "1", label: "Add Admin" },
  { key: "2", label: "Add Tourism Governor" },
];

const AddAccounts = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const [selectedKey, setSelectedKey] = useState("1");
  const [form] = Form.useForm();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleMenuClick = (e) => {
    setSelectedKey(e.key);
    setIsSubmitted(false);
    setSuccessMessage("");
    setErrorMessage("");
    form.resetFields();
  };

  const handleFirstFormSubmit = async (values) => {
    console.log("Form submitted:", values);
    try {
      const response = await axios.post(apiUrl + "admin/addAdmin", {
        username: values.username,
        pass: values.password,
      });

      if (response.status === 201) {
        form.resetFields();
        setIsSubmitted(true);
        setErrorMessage("");
        setSuccessMessage("Admin Account Added successfully!"); // Set success message
        message.success("Admin Account Added successfully!");

        // Hide success message after 2 seconds
        setTimeout(() => {
          setSuccessMessage("");
        }, 2000);
      }
    } catch (error) {
      // Handle error response
      if (error.response) {
        // Request made and server responded
        setErrorMessage(error.response.data.error || "Something went wrong");
        message.error(error.response.data.error || "Submission failed");
      } else {
        // The request was made but no response was received
        setErrorMessage("Network error, please try again later");
        message.error("Network error, please try again later");
      }
    }
  };

  const handleSecondFormSubmit = async (values) => {
    console.log("Form submitted:", values);
    try {
      const response = await axios.post(apiUrl + "governor/addGovernor", {
        // Update URL here
        username: values.username,
        pass: values.password, // Ensure the password field matches your API
      });

      if (response.status === 201) {
        form.resetFields();
        setIsSubmitted(true);
        setErrorMessage("");
        setSuccessMessage("Tourism Governor Account Added successfully!"); // Set success message
        message.success("Tourism Governor Account Added successfully!");

        // Hide success message after 2 seconds
        setTimeout(() => {
          setSuccessMessage("");
        }, 2000);
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message || "Something went wrong");
        message.error(errorData.message || "Submission failed");
      }
    } catch (error) {
      if (error.response) {
        // Request made and server responded
        setErrorMessage(error.response.data.error || "Something went wrong");
        message.error(error.response.data.error || "Submission failed");
      } else {
        // The request was made but no response was received
        setErrorMessage("Network error, please try again later");
        message.error("Network error, please try again later");
      }
    }
  };

  const renderContent = () => {
    switch (selectedKey) {
      case "1":
        return (
          <div className="admin-menu">
            <Form
              form={form}
              layout="vertical"
              onFinish={handleFirstFormSubmit}
            >
              <Form.Item
                name="username"
                label="Admin Username"
                rules={[
                  { required: true, message: "Please input Admin Username!" },
                ]}
              >
                <Input placeholder="Username" />
              </Form.Item>
              <Form.Item
                name="password"
                label="Admin Password"
                rules={[
                  { required: true, message: "Please input Admin Password!" },
                ]}
              >
                <Input placeholder="Password" type="password" />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" style={{backgroundColor:"#1b696a"}}>
                  Add Admin Account
                </Button>
              </Form.Item>
            </Form>
            {successMessage && (
              <div style={{ marginTop: "20px", color: "green" }}>
                {successMessage}
              </div> // Display success message
            )}
            {errorMessage && (
              <div style={{ marginTop: "20px", color: "red" }}>
                {errorMessage}
              </div>
            )}
          </div>
        );
      case "2":
        return (
          <div>
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSecondFormSubmit}
            >
              <Form.Item
                name="username"
                label="Tourism Governor Username"
                rules={[
                  {
                    required: true,
                    message: "Please input Tourism Governor Username!",
                  },
                ]}
              >
                <Input placeholder="Username" />
              </Form.Item>
              <Form.Item
                name="password"
                label="Tourism Governor Password"
                rules={[
                  {
                    required: true,
                    message: "Please input Tourism Governor Password!",
                  },
                ]}
              >
                <Input placeholder="Password" type="password" />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" style={{backgroundColor:"#1b696a"}}>
                  Add Tourism Governor Account
                </Button>
              </Form.Item>
            </Form>
            {successMessage && (
              <div style={{ marginTop: "20px", color: "green" }}>
                {successMessage}
              </div> // Display success message
            )}
            {errorMessage && (
              <div style={{ marginTop: "20px", color: "red" }}>
                {errorMessage}
              </div>
            )}
          </div>
        );
      default:
        return <div>Default Content</div>;
    }
  };

  return (
    <Layout>
      <Header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 1,
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor:"#1b696a"
        }}
      >
        <div className="demo-logo" />
        <Menu
         className="admin-menu"
          //theme="dark"
          mode="horizontal"
          defaultSelectedKeys={["1"]}
          items={menuItems.map((item) => ({
            key: item.key,
            label: item.label,
            style: { 
              paddingLeft: "20px",
               paddingRight: "20px" ,
               backgroundColor: "#1b696a",
               color: "white",
            }, }))}
          onClick={handleMenuClick}
          style={{
            flex: 0,
            display: "flex",
            justifyContent: "center",
            gap: "50px", // Add spacing between menu items
            backgroundColor:"#1b696a",
            color:"white"
          }}
        />
      </Header>
      <Content
        style={{
          padding: "0 48px",
          color:"white"
        }}
      >
        <div
          style={{
            padding: 24,
            minHeight: 380,
            //background: colorBgContainer,
            //borderRadius: borderRadiusLG,
            
          }}
        >
          {renderContent()}
        </div>
      </Content>
    </Layout>
  );
};

export default AddAccounts;
