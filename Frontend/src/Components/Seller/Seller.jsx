import React, { useState, useEffect } from "react";
import { CustomLayout } from "../Common";
import { Route, Routes, useNavigate } from "react-router-dom";
import Itineraries from "../Itineraries";
import {
  CalendarOutlined,
  ContainerOutlined,
  FileOutlined,
} from "@ant-design/icons";
import { jwtDecode } from "jwt-decode";
import Profile from "../Common/Profile";
import Notifications from "../Common/Notifications";
import Image from "../Common/Image";
import Products from "../Tourist/Products";
import MyProducts from "../Admin/MyProducts";
import ArchivedProds from "../Seller/ArchivedProds";
import ChangePasswordForm from "../Common/changePassword";
import SignIn from "../Sign/SignIn";
import SellerReport from "../Seller/SellerReport";
import Product from "../Common/Product";

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
      label: "Sales Report",
      onClick: () => {
        navigate("report");
      },
    },
  ];

  return (
    <CustomLayout sideBarItems={sideBarItems}>
      <Routes>
        <Route path="/" element={<Products />} />
        <Route path="/:id" element={<Product />} />
        <Route path="myProducts" element={<MyProducts />} />
        <Route path="archive" element={<ArchivedProds />} />
        <Route path="report" element={<SellerReport />} />
        <Route path="profile" element={<Profile />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="change-password" element={<ChangePasswordForm />} />
        <Route path="image" element={<Image />} />
        <Route path="auth/signin" element={<SignIn />} />
      </Routes>
    </CustomLayout>
  );
};

export default Seller;
