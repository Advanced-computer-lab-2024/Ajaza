import React, { useState, useEffect } from "react";
import { CustomLayout } from "../Common";
import { Route, Routes, useNavigate } from "react-router-dom";
import Venues from "../Venues";
import { CalendarOutlined, ContainerOutlined } from "@ant-design/icons";
import Profile from "../Common/Profile";
import Notifications from "../Common/Notifications";
import ChangePasswordForm from "../Common/changePassword";
import SignIn from "../Sign/SignIn";
import { jwtDecode } from "jwt-decode";

const TourismGovernor = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        // Check if the token is valid and if the user role is 'advertiser'
        if (!decodedToken || decodedToken.role !== "governor") {
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

  const commonStyle = {
    color: 'black', 
    // backgroundColor: '#5b8b77'
    };

  const sideBarItems = [
    // {
    //   key: "1",
    //   icon: <CalendarOutlined />,
    //   label: "Itineraries",
    //   onClick: () => navigate("itineraries"),
    // },
    // {
    //   key: "2",
    //   icon: <CalendarOutlined />,
    //   label: "Actiivities",
    //   onClick: () => navigate("activities"),
    // },
    {
      key: "3",
      icon: <CalendarOutlined />,
      label: "Venues",
      onClick: () => navigate("/governor/"),
      style: commonStyle,
    },
    {
      key: "4",
      icon: <CalendarOutlined />,
      label: "Change Password",
      onClick: () => navigate("change-password"),
      style: commonStyle,
    },
  ];

  return (
    <CustomLayout sideBarItems={sideBarItems}>
      <Routes>
        <Route path="/" element={<Venues />} />
        <Route path="profile" element={<Profile />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="change-password" element={<ChangePasswordForm />} />
        <Route path="auth/signin" element={<SignIn />} />
      </Routes>
    </CustomLayout>
  );
};

export default TourismGovernor;
