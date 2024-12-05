import logo from "./logo.svg";
import "./App.css";
import { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import CustomButton from "./Components/Common/CustomButton";
import CustomLayout from "./Components/Common";
import { BellFilled, UserOutlined } from "@ant-design/icons";
import { IconButton, SideBar } from "./Components/Common";
import { Colors } from "./Components/Common/Constants";
import Profile from "./Components/Common/Profile";
import Notifications from "./Components/Common/Notifications";
import Itineraries from "./Components/Itineraries";
import Activities from "./Components/Activities";
import Venues from "./Components/Venues";
import BlankPage from "./Components/Blank";
import SellerPage from "./Components/Seller/SellerPage";
import CreateFormPage from "./Components/Seller/CreateSeller";
import SellerForm from "./Components/Seller/SellerForm";
import Product from "./Components/Seller/SellerProduct";
import DisplayForm from "./Components/Seller/DisplayProduct";
import TermsAndConditions from "./Components/Seller/TermsAndConditions";
import ForgotPassword from "./Components/Sign/ForgotPassword";
import { jwtDecode } from "jwt-decode";

//import ManageAccounts from "./manageAccounts";
//import AddAccounts from "./addAccounts";

//import ManageActivityCategories from "./Components/Admin/manageActivityCategories";
//import ManagePreferenceTags from "./Components/Admin/managePreferenceTags";
import LandingPage from "./Components/LandingPage";
import SignIn from "./Components/Sign/SignIn";
import SignUp from "./Components/Sign/SignUp";
import AuthLayout from "./Components/Sign/AuthLayout";
import Tourist from "./Components/Tourist/Tourist";
import Seller from "./Components/Seller/Seller";
import { Flex, Layout, theme } from "antd";
import TourGuide from "./Components/TourGuide/TourGuide";
import Advertiser from "./Components/Advertiser/Advertiser";
import TourismGovernor from "./Components/TourismGovernor/TourismGovernor";
import Admin from "./Components/Admin/Admin";
import Guest from "./Components/Guest/Guest";
import AddAccounts from "./Components/Admin/addAccounts";
import CustomCard from "./Components/Card";
import CreateTourist from "./Components/Sign/CreateTourist";
import CreateSeller from "./Components/Sign/CreateSeller";
import { CurrencyProvider } from "./Components/Tourist/CurrencyContext";
const { Header, Footer, Sider, Content } = Layout;

function App() {
  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate(); // Use navigate for routing
  const location = useLocation();

  const testFunction = (param1, param2) => {
    console.log(param1, param2);
  };

  const params = new URLSearchParams(location.search);
  const role = params.get("role");

  return (
    <div className="App">
      <Layout>
        <Content>
          <Routes>
            <Route
              path="/"
              element={
                <AuthLayout>
                  <SignIn />
                </AuthLayout>
              }
            />
            <Route
              path="auth/*"
              element={
                <AuthLayout>
                  <Routes>
                    <Route path="signin" element={<SignIn />} />
                    <Route path="signup/*" element={<SignUp />} />
                    <Route
                      path="terms-and-conditions"
                      element={<TermsAndConditions />}
                    />
                    <Route
                      path="signin/forgot-password"
                      element={<ForgotPassword />}
                    />
                  </Routes>
                </AuthLayout>
              }
            />
            <Route path="/tourist/*" element={<Tourist />} />
            <Route path="/guide/*" element={<TourGuide />} />
            <Route path="/advertiser/*" element={<Advertiser />} />
            <Route path="/admin/*" element={<Admin />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/governor/*" element={<TourismGovernor />} />
            <Route path="/seller/*" element={<Seller />} />
            <Route path="/guest/*" element={<Guest />} />

            {/* here */}
            {/* Tourist registration page */}

            {/* Advertiser registration page */}
          </Routes>
        </Content>
      </Layout>
    </div>
  );
}

export default function AppWrapper() {
  return (
    <Router>
      <CurrencyProvider>
        <App />
      </CurrencyProvider>
    </Router>
  );
}
