import React, { useState, useEffect } from "react";
import { CustomLayout } from "../Common";
import { Route, Routes, useNavigate } from "react-router-dom";
import Itineraries from "../Itineraries";
import { CalendarOutlined, ContainerOutlined } from "@ant-design/icons";
import { jwtDecode } from "jwt-decode";
import SearchFilterSortContainerEditCreate from "../Common/SearchFilterSortContainerEditCreate";
import Profile from "../Common/Profile";
import Products from "../Tourist/Products";
import MyProducts from "../Admin/MyProducts";

const Seller = () => {
  const navigate = useNavigate();

  const sideBarItems = [
    {
      key: "1",
      icon: <CalendarOutlined />,
      label: "Products",
      onClick: () => {
        navigate("/seller");
      },
    },
    {
      key: "2",
      icon: <CalendarOutlined />,
      label: "My Products",
      onClick: () => {
        navigate("myProducts");
      },
    },
  ];

  return (
    <CustomLayout sideBarItems={sideBarItems}>
      <Routes>
        <Route path="/" element={<Products />} />
        <Route path="myProducts" element={<MyProducts />} />
        <Route path="profile" element={<Profile />} />
      </Routes>
    </CustomLayout>
  );
};

export default Seller;
