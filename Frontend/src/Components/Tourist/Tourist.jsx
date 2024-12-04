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
import PastOrderDetails from "./PastOrderDetails";
import PastOrders from "./PastOrders";
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

  const commonStyle = {
  color: 'black', 
  // backgroundColor: '#5b8b77'
  };

  const sideBarItems = [
    {
      key: "1",
      icon: <CalendarOutlined />,
      label: "Plans",
      onClick: () => {
        navigate("/tourist/");
      },
      style: commonStyle,
    },
    {
      key: "2",
      icon: <CalendarOutlined />,
      label: "Itineraries",
      onClick: () => navigate("itineraries"),
      style: commonStyle,
    },
    {
      key: "3",
      icon: <CalendarOutlined />,
      label: "Venues",
      onClick: () => navigate("venues"),
      style: commonStyle,
    },
    {
      key: "4",
      icon: <CalendarOutlined />,
      label: "Activities",
      onClick: () => navigate("activities"),
      style: commonStyle,
    },
    {
      key: "5",
      icon: <ContainerOutlined />,
      label: "Products",
      onClick: () => navigate("products"),
      style: commonStyle,
    },
    {
      key: "6",
      icon: <RedeemIcon />,
      label: "Redeem Points",
      onClick: () => navigate("redeemPoints"),
      style: commonStyle,
    },
    {
      key: "18",
      label: "Complaints",
      style: commonStyle,
      icon: <ReportGmailerrorredOutlinedIcon />,
      style: commonStyle,
      children: [
        {
          key: "7",
          icon: <ReportGmailerrorredOutlinedIcon />,
          label: "File Complaint",
          onClick: () => navigate("FileComplaint"),
          style: commonStyle,
        },
        {
          key: "8",
          icon: <ReportGmailerrorredOutlinedIcon />,
          label: "My Complaints",
          onClick: () => navigate("Complaints"),
          style: commonStyle,
        },
      ],
    },
    {
      key: "9",
      icon: <RateReviewOutlinedIcon />,
      label: "Feedback",
      onClick: () => navigate("TouristHistory"),
      style: commonStyle,
    },
    {
      key: "10",
      icon: <CheckOutlined />,
      label: "Future Bookings",
      onClick: () => navigate("futureBookings"),
      style: commonStyle,
    },
    {
      key: "11",
      icon: <CheckOutlined />,
      label: "Booking History",
      onClick: () => navigate("bookingHistory"),
      style: commonStyle,
    },
    {
      key: "12",
      icon: <CheckOutlined />,
      label: "Bookmarked Plans",
      onClick: () => navigate("bookmarked"),
      style: commonStyle,
    },
    {
      key: "13",
      icon: <HeartOutlined />,
      label: "Wishlist",
      onClick: () => navigate(`wishlist/${touristId}`),
      style: commonStyle,
    },
    {
      key: "14",
      icon: <BookOutlined />,
      label: "Orders",
      style: commonStyle,
     
      children: [
        {
          key: "101",
          label: "Current Orders",
          icon: <BookOutlined />,
          onClick: () => navigate(`orders/${touristId}`),
          style: commonStyle,
        },
        {
          key: "102",
          label: "Past Orders",
          icon: <BookOutlined />,
          onClick: () => navigate(`pastOrders/${touristId}`),
          style: commonStyle,
        },
      ],
    },
    {
      key: "16",
      label: "Services",
      style: commonStyle,
      icon: <ContainerOutlined />,
      children: [
        {
          key: "17",
          label: "Services Bookings",
          icon: <CalendarOutlined />,
          onClick: () => navigate("services"),
          style: commonStyle,
        },
        {
          key: "15",
          label: "Flights",
          icon: <FlightTakeoffIcon />,
          onClick: () => navigate("BookFlight"),
          style: commonStyle,
        },
        {
          key: "18",
          label: "Hotels",
          icon: <HomeOutlined />,
          onClick: () => navigate("hotels"),
          style: commonStyle,
        },
        {
          key: "19",
          label: "Transportation",
          icon: <CarOutlined />,
          onClick: () => navigate("transportations"),
          style: commonStyle,
        },
      ],
    },
    {
      key: "99",
      icon: <QuestionCircleOutlined />,
      label: "Help",
      onClick: () => navigate("help"),
      style: commonStyle,
      
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


        <Route path="pastOrders/:id" element={<PastOrders />} />
        <Route path="pastOrders/:touristId/:date" element={<PastOrderDetails />} />



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
