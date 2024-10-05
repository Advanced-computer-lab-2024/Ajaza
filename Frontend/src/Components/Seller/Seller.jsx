import React from "react";
import { CustomLayout } from "../Common";
import { Route, Routes, useNavigate } from "react-router-dom";
import Itineraries from "../Itineraries";
import { CalendarOutlined, ContainerOutlined } from "@ant-design/icons";

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
    // {
    //   key: "2",
    //   icon: <CalendarOutlined />,
    //   label: "Actiivities",
    //   onClick: () => navigate("activities"),
    // },
    // {
    //   key: "3",
    //   icon: <CalendarOutlined />,
    //   label: "Venues",
    //   onClick: () => navigate("venues"),
    // },
    // {
    //   key: "4",
    //   icon: <ContainerOutlined />,
    //   label: "Report",
    // },
  ];
  return (
    <CustomLayout sideBarItems={sideBarItems}>
      <Routes>
        <Route path="/" element={<div>Seller Default</div>} />
        <Route path="/itineraries" element={<Itineraries />} />
        <Route path="Report" element={<div>Report</div>} />
      </Routes>
    </CustomLayout>
  );
};

export default Seller;
