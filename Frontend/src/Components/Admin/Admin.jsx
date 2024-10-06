import React from "react";
import { Layout } from "antd";

import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import AdminCustomLayout from "./AdminCustomLayout";
import ManageActivityCategories from "./ManageActivityCategories";
import ManagePreferenceTags from "./ManagePreferenceTags";
import AllAccounts from "./AllAccounts"; // Create a new AllAccounts component
import AddAccounts from "./addAccounts";
import Profile from "../Common/Profile";
import MyProducts from "./MyProducts";
import Products from "../Tourist/Products";

const { Content } = Layout;

const Admin = () => {
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
          <Route path="preference-tags" element={<ManagePreferenceTags />} />
          <Route path="myProducts" element={<MyProducts />} />
          <Route path="products" element={<Products />} />
          <Route path="profile" element={<Profile />} />
        </Routes>
      </Content>
    </AdminCustomLayout>
  );
};

export default Admin;
