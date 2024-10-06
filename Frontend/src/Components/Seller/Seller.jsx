import React, { useState, useEffect } from "react";
import { CustomLayout } from "../Common";
import { Route, Routes, useNavigate } from "react-router-dom";
import Itineraries from "../Itineraries";
import { CalendarOutlined, ContainerOutlined } from "@ant-design/icons";
import { jwtDecode } from "jwt-decode";
import SearchFilterSortContainerEditCreate from "../Common/SearchFilterSortContainerEditCreate";

const Seller = () => {
  const navigate = useNavigate();

  const sideBarItems = [
    {
      key: "1",
      icon: <CalendarOutlined />,
      label: "Itineraries",
      onClick: () => {
        navigate("itineraries");
      },
    },
    {
      key: "2",
      icon: <CalendarOutlined />,
      label: "Activities",
      onClick: () => navigate("activities"),
    },
    {
      key: "3",
      icon: <CalendarOutlined />,
      label: "Venues",
      onClick: () => navigate("/venues"),
    },
    {
      key: "4",
      icon: <ContainerOutlined />,
      label: "Report",
    },
  ];

  return (
    <CustomLayout sideBarItems={sideBarItems}>
      <Routes>
        <Route path="/" element={<SearchFilterSortContainerEditCreate />} />
      </Routes>
    </CustomLayout>
  );
};

export default Seller;
