import React from "react";
import { CustomLayout } from "../Common";
import { Route, Routes, useNavigate } from "react-router-dom";
import Itineraries from "./Itineraries";
import { CalendarOutlined, ContainerOutlined } from "@ant-design/icons";
import { apiUrl } from "../Common/Constants";
import { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import SearchFilterSortContainer from "../Common/SearchFilterSortContainer";
import Profile from "../Common/Profile";
import Plans from "./Plans";
import Venues from "./Venues";
import Products from "./Products";
import RedeemPoints from "./RedeemPoints";
import RedeemIcon from "@mui/icons-material/Redeem";
import Activities from "./Activities";
import ReportGmailerrorredOutlinedIcon from '@mui/icons-material/ReportGmailerrorredOutlined';
import FileComplaint from "./FileComplaint";
import Complaints from "./Complaints";


const Tourist = () => {
  const [response, setResponse] = useState([]);
  const navigate = useNavigate();

  const sideBarItems = [
    {
      key: "1",
      icon: <CalendarOutlined />,
      label: "Plans",
      onClick: () => {
        navigate("/tourist/");
      },
    },
    {
      key: "2",
      icon: <CalendarOutlined />,
      label: "Itineraries",
      onClick: () => navigate("itineraries"),
    },
    {
      key: "3",
      icon: <CalendarOutlined />,
      label: "Venues",
      onClick: () => navigate("venues"),
    },
    {
      key: "4",
      icon: <CalendarOutlined />,
      label: "Activities",
      onClick: () => navigate("activities"),
    },
    {
      key: "5",
      icon: <ContainerOutlined />,
      label: "Products",
      onClick: () => navigate("products"),
    },
    {
      key: "6",
      icon: <RedeemIcon />,
      label: "Redeem Points",
      onClick: () => navigate("redeemPoints"),
    },
    {
      key: "7",
      icon: <ReportGmailerrorredOutlinedIcon />,
      label: "File Complaint",
      onClick: () => navigate("FileComplaint"),
    },
    {
      key: "8",
      icon: <ReportGmailerrorredOutlinedIcon />,
      label: "My Complaints",
      onClick: () => navigate("Complaints"),
    },

  ];

  return (
    <CustomLayout sideBarItems={sideBarItems}>
      <Routes>
        <Route path="/" element={<Plans />} />
        <Route path="profile" element={<Profile />} />
        <Route path="itineraries" element={<Itineraries />} />
        <Route path="venues" element={<Venues />} />
        <Route path="activities" element={<Activities />} />
        <Route path="products" element={<Products />} />
        <Route path="redeemPoints" element={<RedeemPoints />} />
        <Route path="fileComplaint" element={<FileComplaint />} />
        <Route path="complaints" element={<Complaints />} />
      </Routes>
    </CustomLayout>
  );
};

export default Tourist;
