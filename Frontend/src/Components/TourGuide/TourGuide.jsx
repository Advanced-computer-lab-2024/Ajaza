import React, { useState, useEffect } from "react";
import { CustomLayout } from "../Common";
import { Route, Routes, useNavigate } from "react-router-dom";
import Itineraries from "../Itineraries";
import { CalendarOutlined } from "@ant-design/icons";
import { jwtDecode } from "jwt-decode";
import Profile from "../Common/Profile";
import Image from "../Common/Image";
import ChangePasswordForm from "../Common/changePassword";  
import SignIn from "../Sign/SignIn";


const TourGuide = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("Token:", token);
    console.log("decodedToken:", jwtDecode(token));
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        // Check if the token is valid and if the user role is 'advertiser'
        if (!decodedToken || decodedToken.role !== "guide") {
          navigate("/auth/signin");
        }
      } catch (error) {
        console.error("Invalid token:", error);
        navigate("/auth/signin");
      }
    } else {
      navigate("/auth/signin");
    }
  }, [navigate]);

  let decodedToken = null;
  const token = localStorage.getItem("token");

  if (token) {
    decodedToken = jwtDecode(token);
  }

  const sideBarItems = [
    {
      key: "1",
      icon: <CalendarOutlined />,
      label: "Itineraries",
      onClick: () => {
        navigate("/guide/");
      },
    },
  ];

  return (
    <CustomLayout sideBarItems={sideBarItems}>
      <Routes>
        <Route path="/" element={<Itineraries />} />
        <Route path="profile" element={<Profile />} />
        <Route path="change-password"  element={<ChangePasswordForm />}  />
        <Route path="image" element={<Image />} />
        <Route path="auth/signin" element={<SignIn />} />
      </Routes>
    </CustomLayout>
  );
};

export default TourGuide;
