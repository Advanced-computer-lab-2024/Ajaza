import React, { useState, useEffect } from "react";
import { CustomLayout } from "../Common";
import { Route, Routes, useNavigate } from "react-router-dom";
import Itineraries from "../Itineraries";
import { CalendarOutlined } from "@ant-design/icons";
import { jwtDecode } from "jwt-decode";
import Profile from "../Common/Profile";
import ChangePasswordForm from "../Common/changePassword";  

const TourGuide = () => {
  const navigate = useNavigate();

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
      </Routes>
    </CustomLayout>
  );
};

export default TourGuide;
