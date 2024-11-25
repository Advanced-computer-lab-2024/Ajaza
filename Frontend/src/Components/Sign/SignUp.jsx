import React, { useState, useEffect, useRef } from "react";
import { Layout, Menu, theme } from "antd";
import { Route, Routes, useNavigate } from "react-router-dom";
import CustomButton from "../Common/CustomButton";
import CreateTourist from "./CreateTourist";
import CreateTourGuide from "./CreateTourGuide";
import CreateSeller from "./CreateSeller";
import CreateAdvertiser from "./CreateAdvertiser";

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
      const navigatePath = selectedRole.role === "tourist" ? "/auth/signup" : `/auth/signup/${selectedRole.key}`;
      navigate(navigatePath);
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
          backgroundColor: "#2C3E50",
        }}
      >
        <Menu
          mode="horizontal"
          selectedKeys={[role]}
          items={menuItems.map((item) => ({
            key: item.key,
            label: item.label,
            style: { 
              paddingLeft: "20px",
               paddingRight: "20px" ,
               backgroundColor: "#2C3E50",
            },
          }))}
          onClick={handleMenuClick}
          style={{
            display: "flex",
            justifyContent: "center",
            width: "100%",              // Take full width of the header
            maxWidth: "800px",
            backgroundColor: "#2C3E50",
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
          <div style={{ textAlign: "center", marginBottom: "20px" }}>
            <h1 style={{ fontSize: "24px", fontWeight: "bold" }}>
              Registeration
            </h1>
          </div>
          <Routes>
            <Route path="/" element={<CreateTourist />} />
            <Route path="guide" element={<CreateTourGuide />} />
            <Route path="seller" element={<CreateSeller />} />
            <Route path="advertiser" element={<CreateAdvertiser />} />
          </Routes>
        </div>
      </Content>
    </Layout>
  );
};

export default SignUp;
