import React, { useState, useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import Activities from "../Activities";
import { CalendarOutlined } from "@ant-design/icons";
import CustomLayout from "../Common/CustomLayout";
import Profile from "../Common/Profile";
import ChangePasswordForm from "../Common/changePassword";  

const Advertiser = () => {
  const navigate = useNavigate();
  const sideBarItems = [
    {
      key: "1",
      icon: <CalendarOutlined />,
      label: "Activites",
      onClick: () => {
        navigate("/advertiser/");
      },
    },
  ];
  return (
    <CustomLayout sideBarItems={sideBarItems}>
      <Routes>
        <Route path="/" element={<Activities />} />
        <Route path="profile" element={<Profile />} />
        <Route path="change-password"  element={<ChangePasswordForm />}  />
      </Routes>
    </CustomLayout>
  );
};

export default Advertiser;
