import React from "react";
import { CustomLayout } from "../Common";
import { Route, Routes, useNavigate } from "react-router-dom";
import Itineraries from "../Itineraries";
import { CalendarOutlined, ContainerOutlined } from "@ant-design/icons";

const Tourist = () => {
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
      <button onClick={() => navigate("/tourist/itineraries")}>iten</button>
      <Routes>
        <Route path="/" element={<div>Tourist Default</div>} />
        <Route path="itineraries" element={<div>Itineraries Page</div>} />
      </Routes>
    </CustomLayout>
  );
};

export default Tourist;
