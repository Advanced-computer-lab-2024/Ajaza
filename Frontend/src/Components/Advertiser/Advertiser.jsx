import React, { useState, useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import Activities from "../Activities";
import { CalendarOutlined, FileOutlined } from "@ant-design/icons";
import CustomLayout from "../Common/CustomLayout";
import Profile from "../Common/Profile";
import Notifications from "../Common/Notifications";
import Image from "../Common/Image";
import ChangePasswordForm from "../Common/changePassword";
import SignIn from "../Sign/SignIn";
import { jwtDecode } from "jwt-decode";
import AdvertiserReport from "./AdvertiserReport";
import AdvTourReport from "./AdvTourReport";

const Advertiser = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        // Check if the token is valid and if the user role is 'advertiser'
        if (!decodedToken || decodedToken.role !== "advertiser") {
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

  const sideBarItems = [
    {
      key: "1",
      icon: <CalendarOutlined />,
      label: "Activites",
      onClick: () => {
        navigate("/advertiser/");
      },
    },
    {
      key: "2",
      icon: <FileOutlined />,
      label: "Sales Report",
      onClick: () => {
        navigate("salesReport");
      },
    },
    {
      key: "3",
      icon: <FileOutlined />,
      label: "Tourist Report",
      onClick: () => {
        navigate("touristReport");
      }
    },
  ];
  return (
    <CustomLayout sideBarItems={sideBarItems}>
      <Routes>
        <Route path="/" element={<Activities />} />
        <Route path="salesReport" element={<AdvertiserReport />} />
        <Route path="touristReport" element={<AdvTourReport />} />
        <Route path="profile" element={<Profile />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="change-password" element={<ChangePasswordForm />} />
        <Route path="image" element={<Image />} />
        <Route path="auth/signin" element={<SignIn />} />
      </Routes>
    </CustomLayout>
  );
};

export default Advertiser;
