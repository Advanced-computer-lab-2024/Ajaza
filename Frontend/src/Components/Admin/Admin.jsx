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
import Notifications from "../Common/Notifications";
import MyProducts from "./MyProducts";
import ArchivedProds from "./ArchivedProds";
//import Products from "../Tourist/Products";
import Products from "./ProductsEvenArch";
import Product from "../Common/Product";
import AdminReport from "./AdminReport";

import ExamineAccounts from "./ExamineAccounts";
import ChangePasswordForm from "../Common/changePassword";
import SignIn from "../Sign/SignIn";
import { jwtDecode } from "jwt-decode";
import TouristsComplaints from "./TouristsComplaints";
import Events from "./Events";
import Event from "./Event";
import ItinerariesAdmin from "./ItinerariesAdmin";
import ItineraryAdmin from "./ItineraryAdmin";
import ComplaintDetails from "./ComplaintDetails";
import ExamineAccountDetails from "./ExamineAccountDetails";
import CreatePromoCode from "./CreatePromoCode";
import { AdminMenuKeyProvider } from "./AdminMenuKeyContext";
import NumberOfUsers from "./NumberOfUsers";
import AccountsToBeDeleted from "./AccountsToBeDeleted";
import Itinerary from "../Common/Itinerary";
import Itineraries from "../Tourist/Itineraries";
import Activities from "../Tourist/Activities";
import Activity from "../Common/Activity";
const { Content } = Layout;
// username: alisuper
// password: 12345a
const Admin = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("token");

    console.log("Token:", token);
    console.log("decodedToken:", jwtDecode(token));

    if (token) {
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
    }
  }, [navigate]);
  return (
    <AdminMenuKeyProvider>
      <AdminCustomLayout>
        <Content style={{ padding: "24px", minHeight: "280px" }}>
          <Routes>
            <Route
              path="manage-activity-categories"
              element={<ManageActivityCategories />}
            />
            <Route path="add-Accounts" element={<AddAccounts />} />
            <Route path="deletionRequests" element={<AccountsToBeDeleted />} />
            <Route path="/" element={<AllAccounts />} />
            <Route path="examine-Accounts" element={<ExamineAccounts />} />
            <Route
              path="examine-Accounts/:accountId/:accountType"
              element={<ExamineAccountDetails />}
            />
            <Route
              path="tourists-Complaints"
              element={<TouristsComplaints />}
            />
            <Route
              path="tourists-Complaints/:id"
              element={<ComplaintDetails />}
            />
            <Route path="events" element={<Activities />} />
            <Route path="events/:id" element={<Activity />} />
            <Route path="promocode" element={<CreatePromoCode />} />
            <Route path="report" element={<AdminReport />} />

            <Route path="numberOfUsers" element={<NumberOfUsers />} />
            <Route path="itinerariesAdmin" element={<Itineraries />} />
            <Route path="itinerariesAdmin/:id" element={<Itinerary />} />

            <Route path="preference-tags" element={<ManagePreferenceTags />} />
            <Route path="myProducts" element={<MyProducts />} />

            <Route path="profile" element={<Profile />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="products" element={<Products />} />
            <Route path="products/:id" element={<Product />} />

            <Route path="archive" element={<ArchivedProds />} />
            <Route path="change-password" element={<ChangePasswordForm />} />
            <Route path="auth/signin" element={<SignIn />} />
          </Routes>
        </Content>
      </AdminCustomLayout>
    </AdminMenuKeyProvider>
  );
};

export default Admin;
