import logo from "./logo.svg";
import "./App.css";
import {
  Button,
  Search,
  CircularButton,
  CustomLayout,
} from "./Components/Common";
import { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import { BellFilled, UserOutlined } from "@ant-design/icons";
import { IconButton, SideBar } from "./Components/Common";
import { Colors } from "./Components/Common/Constants";
import Profile from "./Components/Common/Profile";
import Itineraries from "./Components/Itineraries";
import Activities from "./Components/Activities";
import Venues from "./Components/Venues";

import ManageAccounts from "./manageAccounts";
import AddAccounts from "./addAccounts";

import ManageActivityCategories from "./manageActivityCategories";
import ManagePreferenceTags from "./managePreferenceTags";
import LandingPage from "./Components/LandingPage";
import SignIn from "./Components/Sign/SignIn";
import SignUp from "./Components/Sign/SignUp";
import AuthLayout from "./Components/Sign/AuthLayout";
import Tourist from "./Components/Tourist/Tourist";
import Seller from "./Components/Seller/Seller";
import { Flex, Layout, theme } from "antd";
import TourGuide from "./Components/TourGuide/TourGuide";
import Advertiser from "./Components/Advertiser/Advertiser";
import Admin from "./Components/Admin/Admin";
import { CardTemp } from "./Components/Tourist/CardTemp";
import CustomCard from "./Components/Card";
import AdminCustomLayout from "./Components/AdminCustomLayout";
const { Header, Footer, Sider, Content } = Layout;

function App() {
  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate(); // Use navigate for routing

  const testFunction = (param1, param2) => {
    console.log(param1, param2);
  };

  return (
    <div className="App">
      <Layout>
        <Content>
          <Routes>
            <Route
              path="/"
              element={
                <AuthLayout>
                  <LandingPage />
                </AuthLayout>
              }
            />
            <Route
              path="auth/*"
              element={
                <AuthLayout>
                  <Routes>
                    <Route path="signin" element={<SignIn />} />
                    <Route path="signup" element={<SignUp />} />
                  </Routes>
                </AuthLayout>
              }
            />
            <Route path="/tourist/*" element={<Tourist />} />
            <Route path="/tourGuide/*" element={<TourGuide />} />

            <Route path="/advertiser/*" element={<Advertiser />} />
            <Route path="/admin/*" element={<Admin />} />
            <Route path="/adminCustom" element={<AdminCustomLayout />} />
            <Route path="/seller/*" element={<Seller />} />
          </Routes>
        </Content>
      </Layout>
    </div>
  );
}

export default function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}
