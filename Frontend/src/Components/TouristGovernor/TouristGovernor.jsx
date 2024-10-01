import React from "react";
import { useNavigate } from "react-router-dom";
import { CalendarOutlined, ContainerOutlined } from "@ant-design/icons";

const TouristGovernor = () => {
  const navigate = useNavigate();
  const sideBarItems = [
    {
      key: "1",
      icon: <CalendarOutlined />,
      label: "Itineraries",
      onClick: () => navigate("/itineraries"),
    },
    {
      key: "2",
      icon: <CalendarOutlined />,
      label: "Actiivities",
      onClick: () => navigate("/activities"),
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

  return <div>TouristGovernor</div>;
};

export default TouristGovernor;
