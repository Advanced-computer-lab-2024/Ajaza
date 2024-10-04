import React from "react";
import { CustomLayout } from "../Common";
import { Route, Routes, useNavigate } from "react-router-dom";
import Activities from "../Activities";
import { CalendarOutlined, ContainerOutlined } from "@ant-design/icons";

const Advertiser = () => {
  const navigate = useNavigate();
  
  const sideBarItems = [
    // {
    //   key: "1",
    //   icon: <CalendarOutlined />,
    //   label: "Itineraries",
    //   onClick: () => {
    //     navigate("itineraries");
    //   },
    // },
    {
      key: "2",
      icon: <CalendarOutlined />,
      label: "Activities",
      onClick: () => navigate("activities"),
    },
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
  return(
    <CustomLayout sideBarItems={sideBarItems}>
      <Routes>
        <Route path="/" element={<div>Advertiser Default</div>} />
        <Route path="activities" element={<Activities />}/>
        <Route path="Report" element={<div>Report</div>} />
      </Routes>
    </CustomLayout>
  );
};

export default Advertiser;
