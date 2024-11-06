import React, { useState, useEffect } from "react";
import { Layout } from "antd";

import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import AdminCustomLayout from "./AdminCustomLayout";
import ManageActivityCategories from "./manageActivityCategories";
import ManagePreferenceTags from "./managePreferenceTags";
import AllAccounts from "./AllAccounts"; // Create a new AllAccounts component
import AddAccounts from "./addAccounts";
import Profile from "../Common/Profile";
import MyProducts from "./MyProducts";
import Products from "../Tourist/Products";
import ExamineAccounts from "./ExamineAccounts";
import ChangePasswordForm from "../Common/changePassword"; 
import SignIn from "../Sign/SignIn";
import { jwtDecode } from "jwt-decode";


const { Content } = Layout;

const Admin = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("Token:", token);
    console.log("decodedToken:", jwtDecode(token));
   /* if (token) {
      try {
        const decodedToken = jwtDecode(token);
        // Check if the token is valid and if the user role is 'advertiser'
        if (!decodedToken || decodedToken.role !== "admin") {
          navigate("/auth/signin");
        }
      } catch (error) {
        console.error("Invalid token:", error);
        navigate("/auth/signin");
      }
    } else {
      navigate("/auth/signin");
    }*/
  }, [navigate]);
  return (
    <AdminCustomLayout>
      <Content style={{ padding: "24px", minHeight: "280px" }}>
        <Routes>
          <Route
            path="manage-activity-categories"
            element={<ManageActivityCategories />}
          />
          <Route path="add-Accounts" element={<AddAccounts />} />
          <Route path="/" element={<AllAccounts />} />
          <Route path="examine-Accounts" element={<ExamineAccounts />} />
          <Route path="preference-tags" element={<ManagePreferenceTags />} />
          <Route path="myProducts" element={<MyProducts />} />
          <Route path="products" element={<Products />} />
          <Route path="profile" element={<Profile />} />
          <Route path="change-password"  element={<ChangePasswordForm />}  />
          <Route path="auth/signin" element={<SignIn />} />
        </Routes>
      </Content>
    </AdminCustomLayout>
  );
};

export default Admin;
