import React, { useState, useEffect } from "react";
import { CustomLayout } from "../Common";
import { Route, Routes, useNavigate } from "react-router-dom";
import Itineraries from "../Itineraries";
import { CalendarOutlined } from "@ant-design/icons";
import { jwtDecode } from "jwt-decode";

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
        navigate("itineraries");
      },
    },
  ];

  return (
    <CustomLayout sideBarItems={sideBarItems}>
      <Routes>
        <Route path="/" element={<div>Tour Guide</div>} />
        <Route path="/itineraries" element={<div>iten</div>} />
        <Route path="Report" element={<div>Report</div>} />
      </Routes>
    </CustomLayout>
  );
};

export default TourGuide;
