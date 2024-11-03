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
import Product from "../Common/Product";
import Venue from "../Common/Venue";
import RedeemPoints from "./RedeemPoints";
import RedeemIcon from "@mui/icons-material/Redeem";
import Activities from "./Activities";
import ReportGmailerrorredOutlinedIcon from "@mui/icons-material/ReportGmailerrorredOutlined";
import FileComplaint from "./FileComplaint";
import Complaints from "./Complaints";
import RateReviewOutlinedIcon from "@mui/icons-material/RateReviewOutlined";
import TouristHistory from "./TouristHistory";
import Activity from "../Common/Activity";

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
    {
      key: "9",
      icon: <RateReviewOutlinedIcon />,
      label: "Feedback",
      onClick: () => navigate("TouristHistory"),
    },
    {
      key: "10",
      icon: <RateReviewOutlinedIcon />,
      label: "Current Bookings",
      onClick: () => navigate("bookings"),
    },
    {
      key: "11",
      icon: <RateReviewOutlinedIcon />,
      label: "Booking History",
      onClick: () => navigate("history"),
    },
    {
      key: "12",
      icon: <RateReviewOutlinedIcon />,
      label: "Saved Plans",
      onClick: () => navigate("saved"),
    },
    {
      key: "13",
      icon: <RateReviewOutlinedIcon />,
      label: "Wishlist",
      onClick: () => navigate("wishlist"),
    },
    {
      key: "14",
      icon: <RateReviewOutlinedIcon />,
      label: "Orders",
      onClick: () => navigate("orders"),
    },
    // TODO put them in nested like current and past bookings ---- products,wishlist,orders
  ];

  return (
    <CustomLayout sideBarItems={sideBarItems}>
      <Routes>
        <Route path="/" element={<Plans />} />
        <Route path="profile" element={<Profile />} />
        <Route path="itineraries" element={<Itineraries />} />
        <Route path="venues" element={<Venues />} />
        <Route path="venues/:id" element={<Venue />} />
        <Route path="activities" element={<Activities />} />
        <Route path="activities/:id" element={<Activity />} />

        <Route path="products" element={<Products />} />
        <Route path="products/:id" element={<Product />} />
        <Route path="redeemPoints" element={<RedeemPoints />} />
        <Route path="fileComplaint" element={<FileComplaint />} />
        <Route path="complaints" element={<Complaints />} />
        <Route path="touristHistory" element={<TouristHistory />} />
      </Routes>
    </CustomLayout>
  );
};

export default Tourist;
