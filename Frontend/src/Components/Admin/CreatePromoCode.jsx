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
  Slider,
  InputNumber,
  DatePicker,
} from "antd";
import axios from "axios"; // Import axios
import AdminCustomLayout from "./AdminCustomLayout";
import { apiUrl } from "../Common/Constants";

const { Header, Content } = Layout;

const items = [
  { key: "1", label: "Promo Code" }
  
];

const CreatePromoCode = () => {
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
      const response = await axios.post(apiUrl + "Promocode", {
        birthday: { "date": values.birthdate.format("YYYY-MM-DD")},
        code: values.code,
        value: values.value/100,
      });

      if (response.status === 201) {
        form.resetFields();
        setIsSubmitted(true);
        setErrorMessage("");
        setSuccessMessage("Promocode created successfully!"); // Set success message
        message.success("Promocode created successfully!");

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

  

  const renderContent = () => {
    switch (selectedKey) {
      case "1":
        return (
          <div>
            <Form
  form={form}
  layout="vertical"
  onFinish={handleFirstFormSubmit}
>
  <Form.Item
    name="code"
    label="Code"
    rules={[{ required: true, message: "Please input code!" }]}
  >
    <Input placeholder="Code" />
  </Form.Item>

  <Form.Item
    name="value"
    label="Promocode Value (% Percentage)"
    rules={[{ required: true, message: "Please input a number between 1 and 100!" }]}
  >
    <InputNumber
      min={1}
      max={100}
      placeholder="Enter a value"
      style={{ width: "100%" }}
      onKeyPress={(event) => {
        const charCode = event.which || event.keyCode;
        const charStr = String.fromCharCode(charCode);
        if (!/[0-9]/.test(charStr)) {
          event.preventDefault();
        }
      }}
    />
  </Form.Item>

  <Form.Item
    name="birthdate"
    label="Birthdate"
    rules={[{ required: true, message: "Please select a birthdate!" }]}
  >
    <DatePicker style={{ width: "100%" }} placeholder="Select a birthdate" />
  </Form.Item>

  <Form.Item>
    <Button type="primary" htmlType="submit">
      Add PromoCode
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
        }}
      >
        <div className="demo-logo" />
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={["1"]}
          items={items}
          onClick={handleMenuClick}
          style={{
            flex: 0,
            display: "flex",
            justifyContent: "center",
            gap: "50px", // Add spacing between menu items
          }}
        />
      </Header>
      <Content
        style={{
          padding: "0 48px",
        }}
      >
        <div
          style={{
            padding: 24,
            minHeight: 380,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          {renderContent()}
        </div>
      </Content>
    </Layout>
  );
};

export default CreatePromoCode;
