import React from "react";
import { CustomLayout } from "../Common";
import { Route, Routes, useNavigate } from "react-router-dom";
import Itineraries from "./Itineraries";
import {
  CalendarOutlined,
  ContainerOutlined,
  CheckOutlined,
  BookOutlined,
  HomeOutlined,
  HeartOutlined,
  CarOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import { apiUrl } from "../Common/Constants";
import { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import SearchFilterSortContainer from "../Common/SearchFilterSortContainer";
import Profile from "../Common/Profile";
import Notifications from "../Common/Notifications";
import Plans from "./Plans";
import Venues from "./Venues";
import Products from "./Products";
import Orders from "./Orders";
import Product from "../Common/Product";
import Venue from "../Common/Venue";
import RedeemPoints from "./RedeemPoints";
import RedeemIcon from "@mui/icons-material/Redeem";
import Activities from "./Activities";
import ReportGmailerrorredOutlinedIcon from "@mui/icons-material/ReportGmailerrorredOutlined";
import FileComplaint from "./FileComplaint";
import Complaints from "./Complaints";
import RateReviewOutlinedIcon from "@mui/icons-material/RateReviewOutlined";
import TouristHistory from "./TouristHistory";
import Activity from "../Common/Activity";
import ChangePasswordForm from "../Common/changePassword";
import Itinerary from "../Common/Itinerary";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import BookFlight from "./BookFlight";
import { Colors } from "../Common/Constants";
import Hotels from "./Hotels";
import SignIn from "../Sign/SignIn";
import ThirdParty from "./ThirdParty";
import Transportations from "./Transportations";
import TouristSelectedComplaint from "./TouristSelectedComplaint";
import FutureBooking from "./FutureBooking";
import BookingHistory from "./BookingHistory";
import Cart from "../Common/Cart";
import BookmarkedPlans from "./BookmarkedPlans";
import Wishlist from "./Wishlist";
import { useParams } from "react-router-dom";
import OrderDetails from "./OrderDetails";
import Help from "./Help";

const Tourist = () => {
  const [response, setResponse] = useState([]);
  const navigate = useNavigate();
  const [touristId, setTouristId] = useState();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setTouristId(decodedToken?.userId);

        // Check if the token is valid and if the user role is 'advertiser'
        if (!decodedToken || decodedToken.role !== "tourist") {
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
      label: "Plans",
      onClick: () => {
        navigate("/tourist/");
      },
    },
    {
      key: "2",
      icon: <CalendarOutlined />,
      label: "Itineraries",
      onClick: () => navigate("itineraries"),
    },
    {
      key: "3",
      icon: <CalendarOutlined />,
      label: "Venues",
      onClick: () => navigate("venues"),
    },
    {
      key: "4",
      icon: <CalendarOutlined />,
      label: "Activities",
      onClick: () => navigate("activities"),
    },
    {
      key: "5",
      icon: <ContainerOutlined />,
      label: "Products",
      onClick: () => navigate("products"),
    },
    {
      key: "6",
      icon: <RedeemIcon />,
      label: "Redeem Points",
      onClick: () => navigate("redeemPoints"),
    },
    {
      key: "18",
      label: "Complaints",
      icon: <ReportGmailerrorredOutlinedIcon />,
      children: [
        {
          key: "7",
          icon: <ReportGmailerrorredOutlinedIcon />,
          label: "File Complaint",
          onClick: () => navigate("FileComplaint"),
        },
        {
          key: "8",
          icon: <ReportGmailerrorredOutlinedIcon />,
          label: "My Complaints",
          onClick: () => navigate("Complaints"),
        },
      ],
    },
    {
      key: "9",
      icon: <RateReviewOutlinedIcon />,
      label: "Feedback",
      onClick: () => navigate("TouristHistory"),
    },
    {
      key: "10",
      icon: <CheckOutlined />,
      label: "Future Bookings",
      onClick: () => navigate("futureBookings"),
    },
    {
      key: "11",
      icon: <CheckOutlined />,
      label: "Booking History",
      onClick: () => navigate("bookingHistory"),
    },
    {
      key: "12",
      icon: <CheckOutlined />,
      label: "Bookmarked Plans",
      onClick: () => navigate("bookmarked"),
    },
    {
      key: "13",
      icon: <HeartOutlined />,
      label: "Wishlist",
      onClick: () => navigate(`wishlist/${touristId}`),
    },
    {
      key: "14",
      icon: <BookOutlined />,
      label: "Orders",
      onClick: () => navigate(`orders/${touristId}`),
    },
    {
      key: "16",
      label: "Services",
      icon: <ContainerOutlined />,
      children: [
        {
          key: "17",
          label: "Services Bookings",
          icon: <CalendarOutlined />,
          onClick: () => navigate("services"),
        },
        {
          key: "15",
          label: "Flights",
          icon: <FlightTakeoffIcon />,
          onClick: () => navigate("BookFlight"),
        },
        {
          key: "18",
          label: "Hotels",
          icon: <HomeOutlined />,
          onClick: () => navigate("hotels"),
        },
        {
          key: "19",
          label: "Transportation",
          icon: <CarOutlined />,
          onClick: () => navigate("transportations"),
        },
      ],
    },
    {
      key: "99",
      icon: <QuestionCircleOutlined />,
      label: "Help",
      onClick: () => navigate("help"),
      
    }

    // TODO put them in nested like current and past bookings ---- products,wishlist,orders
  ];

  return (
    <CustomLayout sideBarItems={sideBarItems}>
      <Routes>
        <Route path="/" element={<Plans />} />
        <Route path="profile" element={<Profile />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="change-password" element={<ChangePasswordForm />} />
        <Route path="itineraries" element={<Itineraries />} />
        <Route path="itineraries/:id" element={<Itinerary />} />
        <Route path="help" element={<Help/>} />


        <Route path="venues" element={<Venues />} />
        <Route path="venues/:id" element={<Venue />} />
        <Route path="activities" element={<Activities />} />
        <Route path="activities/:id" element={<Activity />} />

        <Route path="products" element={<Products />} />
        <Route path="products/:id" element={<Product />} />
        <Route path ="cart/:id" element={<Cart />} />
        <Route path="redeemPoints" element={<RedeemPoints />} />
        <Route path="fileComplaint" element={<FileComplaint />} />
        <Route path="complaints" element={<Complaints />} />
        <Route path="complaints/:id" element={<TouristSelectedComplaint />} />
        <Route path="touristHistory" element={<TouristHistory />} />
        <Route path="bookingHistory" element={<BookingHistory />} />
        <Route path="bookmarked" element={<BookmarkedPlans />} />
        <Route path="orders/:id" element={<Orders />} />
        <Route path="orders/:touristId/:date" element={<OrderDetails />} />
        <Route path="auth/signin" element={<SignIn />} />

        <Route path="hotels" element={<Hotels />} />
        <Route path="services" element={<ThirdParty />} />
        <Route path="transportations" element={<Transportations />} />

        <Route path="bookFlight" element={<BookFlight />} />

        <Route path="futureBookings" element={<FutureBooking />} />
        <Route path="wishlist/:id" element={<Wishlist />} />
      </Routes>
    </CustomLayout>
  );
};

export default Tourist;
