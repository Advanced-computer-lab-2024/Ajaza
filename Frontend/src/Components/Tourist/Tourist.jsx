import React from "react";
import { CustomLayout } from "../Common";
import { Route, Routes, useNavigate } from "react-router-dom";
import Itineraries from "../Itineraries";
import { CalendarOutlined, ContainerOutlined } from "@ant-design/icons";
import { apiUrl } from "../Common/Constants";
import { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import SearchFilterSortContainer from "../Common/SearchFilterSortContainer";
import Profile from "../Common/Profile";

const Tourist = () => {
  const [response, setResponse] = useState([]);
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

  useEffect(() => {
    const urlExtension = "tourist/";

    const token = localStorage.getItem("token");
    let decodedToken = null;
    if (token) {
      decodedToken = jwtDecode(token);
    }

    const fetchData = async () => {
      const body = {
        id: "123",
        // Add more key-value pairs as needed
      };

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json", // Example header, adjust as needed
        },
      };
      try {
        const apiResponse = await axios.get(
          apiUrl + urlExtension,
          body,
          config
        );
        console.log(response);

        if (apiResponse.status === 200) {
          setResponse(apiResponse.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <CustomLayout sideBarItems={sideBarItems}>
      <Routes>
        <Route path="/" element={<SearchFilterSortContainer />} />
        <Route path="itineraries" element={<div>Itineraries Page</div>} />
        <Route path="account" element={<Profile />} />
        {/* <Route path="profile" element={<TouristProfile />} /> */}
      </Routes>
    </CustomLayout>
  );
};

export default Tourist;
