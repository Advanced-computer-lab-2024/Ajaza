import React from "react";
import { CustomLayout } from "../Common";
import { Route, Routes, useNavigate } from "react-router-dom";
import { CalendarOutlined, ContainerOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import { apiUrl } from "../Common/Constants";
import { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import SearchFilterSortContainer from "../Common/SearchFilterSortContainer";
import Profile from "../Common/Profile";
import Plans from "../Tourist/Plans";
import Itineraries from "../Tourist/Itineraries";
import Itinerary from "../Common/Itinerary";
import Products from "../Tourist/Products";
import Product from "../Common/Product";
import Venues from "../Tourist/Venues";
import Venue from "../Common/Venue";
import Activities from "../Tourist/Activities";
import Activity from "../Common/Activity";
import Help from "../Guest/Help";

const Guest = () => {
  const [response, setResponse] = useState([]);
  const navigate = useNavigate();


  const commonStyle = {
    color: 'black', 
    // backgroundColor: '#5b8b77'
    };
  const sideBarItems = [
    {
      key: "1",
      icon: <CalendarOutlined />,
      label: "Plans",
      onClick: () => {
        navigate("/guest/");
      },
      style: commonStyle,
    },
    {
      key: "2",
      icon: <CalendarOutlined />,
      label: "Itineraries",
      onClick: () => navigate("itineraries"),
      style: commonStyle,
    },
    {
      key: "3",
      icon: <CalendarOutlined />,
      label: "Venues",
      onClick: () => navigate("venues"),
      style: commonStyle,
    },
    {
      key: "4",
      icon: <ContainerOutlined />,
      label: "Activities",
      onClick: () => navigate("activities"),
      style: commonStyle,
    },
    {
      key: "5",
      icon: <QuestionCircleOutlined />,
      label: "Help",
      onClick: () => navigate("help"),
      style: commonStyle,
    }
  ];
  return (
    <CustomLayout guest={true} sideBarItems={sideBarItems}>
      <Routes>
        <Route path="/" element={<Plans />} />
        <Route path="itineraries" element={<Itineraries />} />
        <Route path="itineraries/:id" element={<Itinerary />} />
        <Route path="help" element={<Help/>} />

        <Route path="venues" element={<Venues />} />
        <Route path="venues/:id" element={<Venue />} />

        <Route path="activities" element={<Activities />} />
        <Route path="activities/:id" element={<Activity />} />
      </Routes>
    </CustomLayout>
  );
};

export default Guest;
