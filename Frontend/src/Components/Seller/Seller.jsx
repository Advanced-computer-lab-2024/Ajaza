import React, { useState, useEffect } from "react";
import { CustomLayout } from "../Common";
import { Route, Routes, useNavigate } from "react-router-dom";
import Itineraries from "../Itineraries";
import { CalendarOutlined, ContainerOutlined, FileOutlined } from "@ant-design/icons";
import { jwtDecode } from "jwt-decode";
import SearchFilterSortContainerEditCreate from "../Common/SearchFilterSortContainerEditCreate";
import Profile from "../Common/Profile";
import Image from "../Common/Image";
import Products from "../Tourist/Products";
import MyProducts from "../Admin/MyProducts";
import ArchivedProds from "../Seller/ArchivedProds";
import ChangePasswordForm from "../Common/changePassword";
import SignIn from "../Sign/SignIn";
import Report from "../Seller/Report";


const Seller = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("Token:", token);
    console.log("decodedToken:", jwtDecode(token));
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        // Check if the token is valid and if the user role is 'advertiser'
        if (!decodedToken || decodedToken.role !== "seller") {
          navigate("/auth/signin");
        }
      } catch (error) {
        console.error("Invalid token:", error);
        navigate("/auth/signin");
      }
    } else {
      navigate("/auth/signin");
    }
  }, [navigate]);

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
    {
      key: "3",
      icon: <ContainerOutlined />,
      label: "Archived Products",
      onClick: () => {
        navigate("archive");
      },
    },
    {
      key: "4",
      icon: <FileOutlined />,
      label: "Report",
      onClick: () => {
        navigate("report");
      },
    },
  ];

  return (
    <CustomLayout sideBarItems={sideBarItems}>
      <Routes>
        <Route path="/" element={<Products />} />
        <Route path="myProducts" element={<MyProducts />} />
        <Route path="archive" element={<ArchivedProds />} />
        <Route path="report" element={<Report />} />
        <Route path="profile" element={<Profile />} />
        <Route path="change-password" element={<ChangePasswordForm />} />
        <Route path="image" element={<Image />} />
        <Route path="auth/signin" element={<SignIn />} />
      </Routes>
    </CustomLayout>
  );
};

export default Seller;
