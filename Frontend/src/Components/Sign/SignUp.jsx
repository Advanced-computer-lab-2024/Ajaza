import React, { useState, useEffect, useRef } from "react";
import { Layout, Menu, theme, Tabs } from "antd";
import { Route, Routes, useNavigate } from "react-router-dom";
import CustomButton from "../Common/CustomButton";
import CreateTourist from "./CreateTourist";
import CreateTourGuide from "./CreateTourGuide";
import CreateSeller from "./CreateSeller";
import CreateAdvertiser from "./CreateAdvertiser";
import image from "../../Assets/Register.png";
import "./SignUp.css";
import { Box } from "@mui/material";
import { Colors } from "../Common/Constants";

const { TabPane } = Tabs;
const tabTitleStyles = {
  color: Colors.primary.lighter,
  fontSize: "18px",
  fontWeight: "600",
};

const { Header, Content } = Layout;

// Function to determine the correct article ("a" or "an")
const getArticle = (role) => {
  return role === "advertiser" ? "an" : "a";
};

const SignUp = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const [role, setRole] = useState("tourist");
  const navigate = useNavigate();
  const isFirstRender = useRef(true);

  // Use useEffect to set the role to "tourist" and navigate to the corresponding route on page load
  useEffect(() => {
    if (isFirstRender.current) {
      navigate("/auth/signup");
      setRole("tourist");
      isFirstRender.current = false;
    }
  }, [navigate]);

  const menuItems = [
    { key: "tourist", label: "Tourist", role: "tourist" },
    { key: "guide", label: "Tour Guide", role: "guide" },
    { key: "seller", label: "Seller", role: "seller" },
    { key: "advertiser", label: "Advertiser", role: "advertiser" },
  ];

  const handleMenuClick = (e) => {
    const selectedRole = menuItems.find((item) => item.key === e.key);
    if (selectedRole) {
      setRole(selectedRole.role);
      const navigatePath =
        selectedRole.role === "tourist"
          ? "/auth/signup"
          : `/auth/signup/${selectedRole.key}`;
      navigate(navigatePath);
    }
  };

  return (
    <div
      className="signup"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "calc(100vh - 70px)",
        backgroundImage: `url(${image})`, // Set the background image
        backgroundSize: "cover", // Cover the entire screen
      }}
    >
      <Tabs
        defaultActiveKey="1"
        centered
        size="large"
        style={{
          color: Colors.primary.default,
          textAlign: "center",
          width: "100%",
          height: "100%",
        }}
      >
        <TabPane tab={<div style={tabTitleStyles}>Tourist</div>} key="1">
          <CreateTourist />
        </TabPane>
        <TabPane tab={<div style={tabTitleStyles}>Tour Guide</div>} key="2">
          <CreateTourGuide />
        </TabPane>
        <TabPane tab={<div style={tabTitleStyles}>Seller</div>} key="3">
          <CreateSeller />
        </TabPane>
        <TabPane tab={<div style={tabTitleStyles}>Advertiser</div>} key="4">
          <CreateAdvertiser />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default SignUp;
