import React, { useState, useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import Activities from "../Activities";
import { CalendarOutlined } from "@ant-design/icons";
import CustomLayout from "../Common/CustomLayout";
import Profile from "../Common/Profile";

const Advertiser = () => {
  const navigate = useNavigate();
  const sideBarItems = [
    {
      key: "1",
      icon: <CalendarOutlined />,
      label: "Activites",
      onClick: () => {
        navigate("activities");
      },
    },
  ];
  return (
    <CustomLayout sideBarItems={sideBarItems}>
      <Routes>
        <Route path="/" />
        <Route path="activities" element={<Activities />} />
        <Route path="Report" element={<div>Report</div>} />
        <Route path="profile" element={<Profile />} />
      </Routes>
    </CustomLayout>
  );
};

export default Advertiser;
