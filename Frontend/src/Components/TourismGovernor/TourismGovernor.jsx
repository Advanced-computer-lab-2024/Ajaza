import React, { useState, useEffect } from "react";
import { CustomLayout } from "../Common";
import { Route, Routes, useNavigate } from "react-router-dom";
import Venues from "../Venues";
import { CalendarOutlined, ContainerOutlined } from "@ant-design/icons";
import Profile from "../Common/Profile";
import ChangePasswordForm from "../Common/changePassword"; 
import SignIn from "../Sign/SignIn";
import { jwtDecode } from "jwt-decode";


const TourismGovernor = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("Token:", token);
    console.log("decodedToken:", jwtDecode(token));
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
    },
    {
      key: "4",
      icon: <CalendarOutlined />,
      label: "Change My Password",
      onClick: () => navigate("change-password"),
    },
  ];

  return (
    <CustomLayout sideBarItems={sideBarItems}>
      <Routes>
        <Route path="/" element={<Venues />} />
        <Route path="profile" element={<Profile />} />
        <Route path="change-password"  element={<ChangePasswordForm />}  />
        <Route path="auth/signin" element={<SignIn />} />
      </Routes>
    </CustomLayout>
  );
};

export default TourismGovernor;
