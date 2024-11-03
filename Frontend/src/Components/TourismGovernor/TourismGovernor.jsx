import React from "react";
import { CustomLayout } from "../Common";
import { Route, Routes, useNavigate } from "react-router-dom";
import Venues from "../Venues";
import { CalendarOutlined, ContainerOutlined } from "@ant-design/icons";
import Profile from "../Common/Profile";
import ChangePasswordForm from "../Common/changePassword"; 


const TourismGovernor = () => {
  const navigate = useNavigate();
  const sideBarItems = [
    // {
    //   key: "1",
    //   icon: <CalendarOutlined />,
    //   label: "Itineraries",
    //   onClick: () => navigate("itineraries"),
    // },
    // {
    //   key: "2",
    //   icon: <CalendarOutlined />,
    //   label: "Actiivities",
    //   onClick: () => navigate("activities"),
    // },
    {
      key: "3",
      icon: <CalendarOutlined />,
      label: "Venues",
      onClick: () => navigate("/governor/"),
    },
  ];

  return (
    <CustomLayout sideBarItems={sideBarItems}>
      <Routes>
        <Route path="/" element={<Venues />} />
        <Route path="profile" element={<Profile />} />
        <Route path="change-password"  element={<ChangePasswordForm />}  />
      </Routes>
    </CustomLayout>
  );
};

export default TourismGovernor;
