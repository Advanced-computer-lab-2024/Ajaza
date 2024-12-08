import React, { useEffect, useState, useRef } from "react";
import {
  Carousel,
  Row,
  Col,
  Rate,
  Flex,
  Select,
  Modal,
  Input,
  Menu,
  message,
  Button,
  Radio,
  Form,
  notification,
} from "antd";
import { Colors, apiUrl } from "./Constants";
import CustomButton from "./CustomButton";
import axios from "axios";
import {
  ShareAltOutlined,
  HeartOutlined,
  HeartFilled,
  FlagFilled,
  FlagOutlined,
  FlagTwoTone,
  BellFilled,
  BellOutlined,
} from "@ant-design/icons";
import { jwtDecode } from "jwt-decode";

import MapView from "./MapView";
import { convertDateToString, camelCaseToNormalText } from "./Constants";
import StripeContainer from "./StripeContainer";
import { Dropdown } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import "./HeaderInfo.css";
/*import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';*/

const { Option } = Select;

const { PaymentOption } = Select;
//const stripePromise = loadStripe("pk_test_51QONfoIeveJOIzFrIAQIVM7VjUxI8FVUR0VPvCZQtESNQQAu4NqnjZriQEZS0nXD0nT63RQFY8HeixlGp53my1t700Vbu2tFyY");

const contentStyle = {
  margin: 0,
  width: "100%",
  height: "300px",
  color: "#fff",
  textAlign: "center",
  background: Colors.grey[50], // TODO Remove background color
  // padding: "0 30px 25px 30px",
  paddingTop: "10px",
  borderRadius: "20px",
};

const HeaderInfo = ({
  id,
  name,
  photos,
  type,
  user,
  tags,
  price,
  priceLower,
  priceUpper,
  category,
  availableDates,
  location,
  sellerName,
  sales,
  quantity,
  isOpen,
  spots,
  date,
  creatorName,
  discounts,
  language,
  pickUp,
  dropOff,
  accessibility,
  avgRating,
  colSpan,
  desc,
  isFlagged,
  handleFlagClick,
  currency,
  productCurrentQuantity,
}) => {
  const [multiplePhotos, setMultiplePhotos] = useState(false);

  const [leave, setLeave] = useState(false);
  const [isBooked, setIsBooked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [currentSelectedDate, setCurrentSelectedDate] = useState(null);
  const [currentPrice, setCurrentPrice] = useState(null);
  const [isNotif, setIsNotif] = useState(false);
  const [promo, setPromo] = useState(1);
  const [promoCode, setPromoCode] = useState("");
  const [selectedDate, setSelectedDate] = useState(
    availableDates ? availableDates[0].date : null
  );
  const selectedDateRef = useRef(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [priceString, setPriceString] = useState("");
  const emailRef = useRef(null);
  const discountedPriceLower = priceLower - (discounts / 100) * priceLower;
  const discountedPriceUpper = priceUpper - (discounts / 100) * priceUpper;
  const discountedMiddlePrice =
    (discountedPriceLower + discountedPriceUpper) / 2;
  const [selectedPrice, setSelectedPrice] = useState(
    type === "activity" ? discountedPriceUpper : price
  );
  const selectedPriceRef = useRef(null);
  const [currencySymbol, setCurrencySymbol] = useState(
    currency === "AED"
      ? "د.إ"
      : currency === "ARS"
      ? "$"
      : currency === "AUD"
      ? "A$"
      : currency === "BDT"
      ? "৳"
      : currency === "BHD"
      ? ".د.ب"
      : currency === "BND"
      ? "B$"
      : currency === "BRL"
      ? "R$"
      : currency === "CAD"
      ? "C$"
      : currency === "CHF"
      ? "CHF"
      : currency === "CLP"
      ? "$"
      : currency === "CNY"
      ? "¥"
      : currency === "COP"
      ? "$"
      : currency === "CZK"
      ? "Kč"
      : currency === "DKK"
      ? "kr"
      : currency === "EGP"
      ? "EGP"
      : currency === "EUR"
      ? "€"
      : currency === "GBP"
      ? "£"
      : currency === "HKD"
      ? "HK$"
      : currency === "HUF"
      ? "Ft"
      : currency === "IDR"
      ? "Rp"
      : currency === "ILS"
      ? "₪"
      : currency === "INR"
      ? "₹"
      : currency === "JPY"
      ? "¥"
      : currency === "KRW"
      ? "₩"
      : currency === "KWD"
      ? "د.ك"
      : currency === "LKR"
      ? "Rs"
      : currency === "MAD"
      ? "MAD"
      : currency === "MXN"
      ? "$"
      : currency === "MYR"
      ? "RM"
      : currency === "NOK"
      ? "kr"
      : currency === "NZD"
      ? "NZ$"
      : currency === "OMR"
      ? "ر.ع."
      : currency === "PHP"
      ? "₱"
      : currency === "PKR"
      ? "₨"
      : currency === "PLN"
      ? "zł"
      : currency === "QAR"
      ? "ر.ق"
      : currency === "RUB"
      ? "₽"
      : currency === "SAR"
      ? "ر.س"
      : currency === "SEK"
      ? "kr"
      : currency === "SGD"
      ? "S$"
      : currency === "THB"
      ? "฿"
      : currency === "TRY"
      ? "₺"
      : currency === "TWD"
      ? "NT$"
      : currency === "UAH"
      ? "₴"
      : currency === "USD"
      ? "$"
      : currency === "VND"
      ? "₫"
      : currency === "ZAR"
      ? "R"
      : currency
  );

  const [currencyRates] = useState({
    AED: 3.6725,
    ARS: 1004.0114,
    AUD: 1.5348,
    BDT: 110.5,
    BHD: 0.376,
    BND: 1.3456,
    BRL: 5.8149,
    CAD: 1.3971,
    CHF: 0.8865,
    CLP: 973.6481,
    CNY: 7.2462,
    COP: 4389.3228,
    CZK: 24.2096,
    DKK: 7.1221,
    EGP: 48.58,
    EUR: 0.9549,
    GBP: 0.7943,
    HKD: 7.7825,
    HUF: 392.6272,
    IDR: 15911.807,
    ILS: 3.7184,
    INR: 84.5059,
    JPY: 154.4605,
    KRW: 1399.323,
    KWD: 0.3077,
    LKR: 291.0263,
    MAD: 10.5,
    MXN: 20.4394,
    MYR: 4.4704,
    NOK: 11.0668,
    NZD: 1.7107,
    OMR: 0.385,
    PHP: 58.9091,
    PKR: 279.0076,
    PLN: 4.1476,
    QAR: 3.64,
    RUB: 101.2963,
    SAR: 3.75,
    SEK: 11.063,
    SGD: 1.3456,
    THB: 34.7565,
    TRY: 34.5345,
    TWD: 32.5602,
    UAH: 36.9,
    USD: 1,
    VND: 24000.0,
    ZAR: 18.0887,
  });

  const [token, setToken] = useState(null);
  const [decodedToken, setDecodedToken] = useState(null);
  const [userid, setUserid] = useState(null);
  const [inPast, setInPast] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("wallet");
  const [cardDetails, setCardDetails] = useState({
    number: "",
    name: "",
    expiry: "",
    cvv: "",
  });
  const navigate = useNavigate();

  console.log(photos);

  // // //stripe
  // const stripe = useStripe();
  // const elements = useElements();
  // const [loading, setLoading] = useState(false);
  // //

  useEffect(() => {
    const tempToken = localStorage.getItem("token");
    setToken(tempToken);
    if (tempToken) {
      const decTemp = jwtDecode(tempToken);
      setDecodedToken(decTemp);
      setUserid(decTemp?.userId);
    }
  }, []);

  useEffect(() => {
    if (!user) return;
    const dateNow = new Date().getTime();
    user?.itineraryBookings?.forEach((booking) => {
      if (booking.itineraryId == id) {
        // Booked
        const bookDate = new Date(booking.date);
        if (bookDate.getTime() < dateNow) {
          setInPast(true);
        }
      }
    });

    user?.activityBookings?.forEach((booking) => {
      if (booking.activityId == id) {
        // Booked
        const bookDate = new Date(date);
        if (bookDate.getTime() < dateNow) {
          setInPast(true);
        }
      }
    });
  }, [user, id, date]);

  // useEffect(() => {
  //   console.log(past);
  // }, [past]);

  useEffect(() => {
    console.log(currency);
    setCurrencySymbol(
      currency === "AED"
        ? "د.إ"
        : currency === "ARS"
        ? "$"
        : currency === "AUD"
        ? "A$"
        : currency === "BDT"
        ? "৳"
        : currency === "BHD"
        ? ".د.ب"
        : currency === "BND"
        ? "B$"
        : currency === "BRL"
        ? "R$"
        : currency === "CAD"
        ? "C$"
        : currency === "CHF"
        ? "CHF"
        : currency === "CLP"
        ? "$"
        : currency === "CNY"
        ? "¥"
        : currency === "COP"
        ? "$"
        : currency === "CZK"
        ? "Kč"
        : currency === "DKK"
        ? "kr"
        : currency === "EGP"
        ? "EGP"
        : currency === "EUR"
        ? "€"
        : currency === "GBP"
        ? "£"
        : currency === "HKD"
        ? "HK$"
        : currency === "HUF"
        ? "Ft"
        : currency === "IDR"
        ? "Rp"
        : currency === "ILS"
        ? "₪"
        : currency === "INR"
        ? "₹"
        : currency === "JPY"
        ? "¥"
        : currency === "KRW"
        ? "₩"
        : currency === "KWD"
        ? "د.ك"
        : currency === "LKR"
        ? "Rs"
        : currency === "MAD"
        ? "MAD"
        : currency === "MXN"
        ? "$"
        : currency === "MYR"
        ? "RM"
        : currency === "NOK"
        ? "kr"
        : currency === "NZD"
        ? "NZ$"
        : currency === "OMR"
        ? "ر.ع."
        : currency === "PHP"
        ? "₱"
        : currency === "PKR"
        ? "₨"
        : currency === "PLN"
        ? "zł"
        : currency === "QAR"
        ? "ر.ق"
        : currency === "RUB"
        ? "₽"
        : currency === "SAR"
        ? "ر.س"
        : currency === "SEK"
        ? "kr"
        : currency === "SGD"
        ? "S$"
        : currency === "THB"
        ? "฿"
        : currency === "TRY"
        ? "₺"
        : currency === "TWD"
        ? "NT$"
        : currency === "UAH"
        ? "₴"
        : currency === "USD"
        ? "$"
        : currency === "VND"
        ? "₫"
        : currency === "ZAR"
        ? "R"
        : "$"
    );
  }, [currency]);

  useEffect(() => {
    // get if this item is booked setIsBooked accordingly:
    const checkIfBooked = () => {
      if (user) {
        let isItemBooked;
        if (type === "activity") {
          isItemBooked = user.activityBookings?.some(
            (booking) => booking.activityId === id
          );
        } else if (type === "itinerary") {
          isItemBooked = user.itineraryBookings?.some(
            (booking) => booking.itineraryId === id
          );
        }
        setIsBooked(isItemBooked);
      }
    };

    checkIfBooked();
    // get if this item is saved: wishlist (if product), bookmarked (if not) setIsSaved
  }, [id, type, user]);

  useEffect(() => {
    const userTemp = decodedToken?.userDetails;
    let bookmarkFound = false;

    // Check if bookmarked/wishlist
    if (!userTemp) return;
    if (type == "activity") {
      userTemp?.activityBookmarks?.forEach((bookmark) => {
        if (bookmark == id) {
          bookmarkFound = true;
        }
      });
    } else if (type == "itinerary") {
      userTemp?.itineraryBookmarks?.forEach((bookmark) => {
        if (bookmark == id) {
          bookmarkFound = true;
        }
      });
    } else {
      if (userTemp?.wishlist?.includes(id)) {
        bookmarkFound = true;
      }
    }
    setIsSaved(bookmarkFound);

    let notifFound = false;
    // Check if in notifications
    if (type == "activity") {
      userTemp?.activityBells?.forEach((bookmark) => {
        if (bookmark == id) {
          notifFound = true;
        }
      });
    } else if (type == "itinerary") {
      userTemp?.itineraryBells?.forEach((bookmark) => {
        if (bookmark == id) {
          notifFound = true;
        }
      });
    }
    setIsNotif(notifFound);
  }, [decodedToken]);

  useEffect(() => {
    if (Array.isArray(photos) && photos.length > 0) {
      setMultiplePhotos(true);
    }
  }, [photos]);

  useEffect(() => {
    if (discounts) {
      if (price) {
        setPriceString((price - (discounts / 100) * price).toFixed(2));
      }
      if (priceLower == priceUpper) {
        const priceLowerTemp = (
          priceLower -
          (discounts / 100) * priceLower
        ).toFixed(2);
        setPriceString(`${priceLowerTemp}`);
      } else if (priceLower && priceUpper && priceLower !== priceUpper) {
        const priceLowerTemp = (
          priceLower -
          (discounts / 100) * priceLower
        ).toFixed(2);
        const priceUpperTemp = (
          priceUpper -
          (discounts / 100) * priceUpper
        ).toFixed(2);

        setPriceString(`${priceLowerTemp} - ${priceUpperTemp}`);
      }
    } else {
      setPriceString(price);
    }
  }, [price, priceLower, priceUpper, discounts]);

  const handlePaymentChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  const handleCardInputChange = (field, value) => {
    setCardDetails((prev) => ({ ...prev, [field]: value }));
  };

  const handleApplyPromo = async () => {
    if (promo === 1) {
      console.log(promoCode);
      try {
        console.log("Userid:", userid);
        const response = await axios.post(
          `http://localhost:5000/promocode/checkValid/${promoCode}`,
          { touristId: userid }
        );

        if (response.status === 200) {
          console.log("Promo value:", response.data.value);
          setPromo(response.data.value);
        } else {
          message.error("Invalid promo code");
        }
      } catch (error) {
        message.error("Invalid promo code");
      }
    } else {
      setPromo(1);
    }
  };

  const handleRemovePromo = async () => {
    setPromo(1);
  };

  const handleInputChange = (e) => {
    setPromoCode(e.target.value); // Update the promoCode state when the input changes
  };

  //req50
  const locationUrl = useLocation();
  const copyLink = () => {
    const pathParts = locationUrl.pathname.split("/");
    const type = pathParts[2];
    const objectId = pathParts[3];

    if (!type || !objectId) {
      console.log("Could not extract details from the URL");
      return;
    }
    const baseUrl = document.baseURI;
    const shareLink = `${baseUrl}`;
    navigator.clipboard.writeText(shareLink);
    message.success("Link copied to clipboard!");
  };

  const shareViaEmail = () => {
    Modal.confirm({
      title: `Share ${name} via Email`,
      content: (
        <div>
          <Input
            placeholder="Enter recipient's email"
            ref={emailRef}
            style={{ marginBottom: 10 }}
          />
        </div>
      ),
      onOk: async () => {
        const pathParts = locationUrl.pathname.split("/");
        const type = pathParts[2];
        const objectId = pathParts[3];

        if (!type || !objectId) {
          message.error("Could not extract details from the URL");
          return;
        }

        const email = emailRef.current.input.value;

        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (!email) {
          message.error("Please enter an email address.");
          return;
        }

        if (!emailRegex.test(email)) {
          message.error("Please enter a valid email address.");
          return;
        }

        const baseUrl = document.baseURI;
        const shareLink = `${baseUrl}`;
        try {
          const touristId = userid;
          await axios.post(
            `${apiUrl}tourist/emailShare/${touristId}`,
            {
              link: shareLink,
              email: email,
            },
            {
              // headers: {
              //   Authorization: `Bearer ${token}`,
              // },
            }
          );
          message.success("Email sent successfully!");
        } catch (error) {
          console.error("Error sharing via email:", error);
          message.error("Failed to send email. Please try again.");
        }
      },
      onCancel: () => {
        emailRef.current.input.value = "";
      },
    });
  };

  const shareItem = () => {
    // i think nenazel drop down fih copy link w email
    //done fo2eha by zeina req50
  };

  const getNewToken = async () => {
    try {
      const response = await axios.post(`${apiUrl}api/auth/generate-token`, {
        id: userid,
        role: decodedToken.role,
      });

      const { token: newToken } = response.data;

      if (newToken) {
        localStorage.setItem("token", newToken); // Store the new token
        const decTemp = jwtDecode(newToken);
        setDecodedToken(decTemp);
        setUserid(decTemp?.userId);
        user = decTemp.userDetails;
      }
    } catch (error) {
      console.error("Error getting new token:", error);
      message.error("Failed to refresh token. Please try again.");
    }
  };

  if (leave) {
    getNewToken();
    Modal.destroyAll();
    setTimeout(() => {
      navigate("/tourist/futureBookings");
    }, 500);
  }

  useEffect(() => {
    if (selectedDate) {
      selectedDateRef.current = selectedDate; // Update the ref with the new value
    }
  }, [selectedDate]);

  useEffect(() => {
    if (selectedPrice) {
      selectedPriceRef.current = selectedPrice;
    }
  }, [selectedPrice]);

  const bookItem = async () => {
    try {
      const touristId = userid;
      const useWallet = true;
      let total;
      let FinalDate;
      if (type === "activity") {
        total = selectedPriceRef.current * promo;
        FinalDate = date;
      } else if (type === "itinerary") {
        total = price;
        FinalDate = currentSelectedDate;
      }
      if (spots <= 0) {
        message.error(`Error booking ${type}: No spots available.`);
        return;
      }
      let endpoint;
      if (type === "activity") {
        endpoint = `${apiUrl}tourist/${touristId}/activity/${id}/book`;
      } else if (type === "itinerary") {
        endpoint = `${apiUrl}tourist/${touristId}/itinerary/${id}/book`;
      }

      const response = await axios.post(endpoint, {
        useWallet,
        total,
        date: FinalDate,
        promoCode: promoCode || null,
      });

      let capital = "";
      if (type === "activity") {
        capital = "Activity";
      } else {
        capital = "Itinerary";
      }
      message.success(`${capital} booked successfully!`);

      setIsBooked(true);
      await getNewToken();
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Please try again.";
      console.error(`Error ${type} booking:`, error);
      message.error(`Error booking: ${errorMessage}`);
    }
  };

  const showBookingModal = () => {
    const temp = localStorage.getItem("token");

    if (!temp) {
      message.warning(
        <div>
          <a
            style={{
              textDecoration: "underline",
              color: Colors.primary.default,
            }}
            onClick={() => navigate("/auth/signin")}
          >
            Sign In
          </a>{" "}
          in to book
        </div>
      );
      return;
    }

    setIsModalVisible(true); // Open the modal
  };

  // Handle modal submission
  const handleOk = async () => {
    if (!currentSelectedDate && type === "itinerary") {
      Modal.error({
        title: "Booking Date Required",
        content: "Please select a booking date to proceed.",
      });
      return;
    }

    if (!selectedPrice && type === "activity") {
      Modal.error({
        title: "Price Selection Required",
        content: "Please select a price to proceed with the booking.",
      });
      return;
    }

    if (paymentMethod === "wallet") {
      await bookItem({
        date: currentSelectedDate,
        total: currentPrice,
      });
    }

    setIsModalVisible(false); // Close the modal
  };

  // Handle modal cancellation
  const handleCancel = () => {
    setIsModalVisible(false); // Close the modal
    setCurrentSelectedDate(null);
    setPromoCode("");
  };

  const cancelBookingItem = async () => {
    try {
      const touristId = userid;
      let endpoint;
      if (type === "activity") {
        endpoint = `${apiUrl}tourist/${touristId}/activity/${id}/cancel`;
      } else if (type === "itinerary") {
        endpoint = `${apiUrl}tourist/${touristId}/itinerary/${id}/cancel`;
      }

      const response = await axios.delete(endpoint);
      if (response.status === 200) {
        let capital = "";
        if (type === "activity") {
          capital = "Activity";
        } else {
          capital = "Itinerary";
        }

        message.success(response.data.message);
        setIsBooked(false);
        await getNewToken();
      } else {
        message.error(`Problem: ${response.data.message}`);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Please try again.";
      console.error(`Error canceling ${type} booking:`, error);
      message.error(`Failed to cancel the booking: ${errorMessage}`);
    }
  };

  function capitalizeFirstLetter(val) {
    return String(val).charAt(0).toUpperCase() + String(val).slice(1);
  }

  const save = async () => {
    const temp = localStorage.getItem("token");

    if (!temp) {
      message.warning(
        <div>
          <a
            style={{
              textDecoration: "underline",
              color: Colors.primary.default,
            }}
            onClick={() => navigate("/auth/signin")}
          >
            Sign In
          </a>{" "}
          in to book
        </div>
      );
      return;
    }

    if (type == "product") {
      // add to wishlist logic
      if (productCurrentQuantity > 0) {
        message.warning(`${name} is already in cart`);
        return;
      }
      try {
        const response = await axios.post(`${apiUrl}tourist/add-to-wishlist`, {
          touristId: userid,
          productId: id,
        });

        if (response.status === 200) {
          await getNewToken();
          message.success("Product added to wishlist");
        }
      } catch (error) {
        console.error(error);
      }
    } else {
      try {
        const response = await axios.post(
          `${apiUrl}tourist/bookmark/add${capitalizeFirstLetter(
            type
          )}Bookmark/${userid}/${id}`
        );
        await getNewToken();
        message.success(`Successfully bookmarked`);
      } catch (error) {
        if (error?.response?.data?.message) {
          message.warning(error?.response?.data?.message);
        }
      }
    }
    // NOTE any action that changes user get user again and set token to new one
    // if successful get user again and set token (if not already returned using the func)
  };

  const unSave = async () => {
    //const touristId = userid;
    if (type == "product") {
      // remove from wishlist logic
      console.log(`${apiUrl}tourist/remove-from-wishlist`);

      try {
        const response = await axios.post(
          `${apiUrl}tourist/remove-from-wishlist`,
          {
            touristId: userid,
            productId: id,
          }
        );

        if (response.status === 200) {
          await getNewToken();
          message.success("Product successfully removed from wishlist");
        }
      } catch (error) {
        if (error?.response?.data?.message) {
          message.error(error?.response?.data?.message);
        }
        console.error(
          "Error removing product from wishlist:",
          error.response?.data.message || error.message
        );
      }
    } else {
      try {
        const response = await axios.post(
          `${apiUrl}tourist/savedEvent/remove/${type}/${userid}`,
          { [`${type}Id`]: id }
        );
        await getNewToken();
        message.success(`Successfully removed bookmark`);
      } catch (error) {
        if (error?.response?.data?.message) {
          message.warning(error?.response?.data?.message);
        }
        console.error(error);
      }
    }
    // if successful get user again and set token (if not already returned using the func)
  };

  const addNotification = async () => {
    const temp = localStorage.getItem("token");

    if (!temp) {
      message.warning(
        <div>
          <a
            style={{
              textDecoration: "underline",
              color: Colors.primary.default,
            }}
            onClick={() => navigate("/auth/signin")}
          >
            Sign In
          </a>{" "}
          in to book
        </div>
      );
      return;
    }
    try {
      const response = await axios.post(
        `${apiUrl}tourist/bell${capitalizeFirstLetter(type)}/${userid}/${id}`
      );
      await getNewToken();
      message.success(`You will get notified when available to book`);
    } catch (error) {
      if (error?.response?.data?.message) {
        message.warning(error?.response?.data?.message);
      }
    }
  };

  const removeNotification = async () => {
    try {
      const response = await axios.delete(
        `${apiUrl}tourist/bell${capitalizeFirstLetter(type)}/${userid}/${id}`
      );
      await getNewToken();
      message.success(`Removed notifications successfully`);
    } catch (error) {
      if (error?.response?.data?.message) {
        message.warning(error?.response?.data?.message);
      }
    }
  };
  return (
    <>
      <Flex
        align="center"
        justify="space-between"
        style={{ marginBottom: "10px", paddingRight: "30px" }}
      >
        <div style={{ position: "relative" }}>
          <Flex align="end">
            <h1 style={{ textAlign: "left", margin: 0 }}>{name}</h1>
            {creatorName ? (
              <div style={{ marginLeft: "20px", fontWeight: "bold" }}>
                Created By:{" "}
                <span style={{ fontWeight: "normal" }}>{creatorName}</span>
              </div>
            ) : null}
          </Flex>

          <Flex align="center">
            {sellerName ? (
              <div
                style={{
                  fontWeight: "bold",
                  margin: 0,
                  textAlign: "left",
                  paddingLeft: "10px",
                  fontSize: "13px",
                }}
              >
                Sold by:{" "}
                <span style={{ fontWeight: "normal", fontSize: "15px" }}>
                  {sellerName}
                </span>
              </div>
            ) : null}
            {quantity ? (
              <div
                style={{
                  fontWeight: "bold",
                  margin: 0,
                  textAlign: "left",
                  marginLeft: "20px",
                  fontSize: "13px",
                }}
              >
                In Stock:{" "}
                <span style={{ fontWeight: "normal", fontSize: "15px" }}>
                  {quantity}
                </span>
              </div>
            ) : null}
            {isOpen != null ? (
              isOpen ? (
                <div
                  style={{
                    color: Colors.positive,
                    fontWeight: "bold",
                    borderRadius: "5px",
                    fontSize: "16px",
                    paddingLeft: "4px",
                    margin: "0",
                  }}
                >
                  Open
                </div>
              ) : (
                <div
                  style={{
                    color: Colors.warning,
                    fontWeight: "bold",
                    borderRadius: "5px",
                    fontSize: "16px",
                    paddingLeft: "4px",
                    margin: "0",
                  }}
                >
                  Closed
                </div>
              )
            ) : null}

            {date ? (
              <div
                style={{
                  fontWeight: "bold",
                  margin: 0,
                  textAlign: "left",
                  marginLeft: "20px",
                  fontSize: "13px",
                }}
              >
                Date/Time:{" "}
                <span style={{ fontWeight: "normal" }}>
                  {convertDateToString(date)}
                </span>
              </div>
            ) : null}
          </Flex>
        </div>

        <div style={{ position: "relative" }}>
          {type == "venue" ? null : (
            <Flex
              align="center"
              style={{
                fontSize: "25px",
                textDecoration: "underline",
                color: Colors.grey[700],
              }}
            >
              {currencySymbol}
              {priceString}
            </Flex>
          )}
          {discounts ? (
            <Flex
              style={{
                position: "absolute",
                bottom: "90%",
                right: "-20px",
              }}
            >
              <div
                style={{
                  color: Colors.warningDark,
                  fontSize: "13px",
                  textDecoration: "line-through underline",
                  marginRight: "5px",
                }}
              >
                {currencySymbol}
                {price}
              </div>
              <div
                style={{
                  backgroundColor: Colors.warningDark,
                  color: "white",
                  padding: "2px 4px",
                  borderRadius: "4px",
                  fontSize: "12px",
                }}
              >
                -{discounts}%
              </div>
            </Flex>
          ) : null}
          {sales ? (
            <div style={{ fontWeight: "bold", fontSize: "14px" }}>
              Sales:{" "}
              <span style={{ fontWeight: "normal", fontSize: "15px" }}>
                {sales}
              </span>
            </div>
          ) : null}

          {spots ? (
            <div style={{ fontWeight: "bold", fontSize: "14px" }}>
              Spots:{" "}
              <span style={{ fontWeight: "normal", fontSize: "14px" }}>
                {spots}
              </span>
            </div>
          ) : null}
        </div>
      </Flex>

      <Row style={{ marginBottom: "20px" }}>
        {multiplePhotos ? (
          <Col span={colSpan}>
            <Carousel arrows infinite={true}>
              {photos.map((photo, id) => {
                return (
                  <div id={id}>
                    <div id={id} style={contentStyle}>
                      <img
                        src={`/uploads/${photo}.jpg`}
                        style={{
                          width: "95%",
                          height: "92%",
                          margin: "0 auto",
                          borderRadius: "20px",
                        }}
                        alt=""
                      />
                      {/* <div style={contentStyle}>adam</div> */}
                    </div>
                  </div>
                );
              })}
            </Carousel>
          </Col>
        ) : (
          <Col span={colSpan}>
            <Carousel arrows infinite={true}>
              <div>
                <div style={contentStyle}>
                  <img
                    src={`/uploads/${photos}.jpg`}
                    style={{
                      width: "95%",
                      height: "92%",
                      margin: "0 auto",
                      borderRadius: "20px",
                    }}
                    alt=""
                  />
                  {/* <div style={contentStyle}>adam</div> */}
                </div>
              </div>
            </Carousel>
          </Col>
        )}

        <Col span={24 - colSpan} style={{ padding: "0 20px" }}>
          <Flex justify={inPast ? "end" : "space-between"} align="center">
            <div>
              <Rate value={avgRating} allowHalf disabled />
            </div>
            <Flex>
              {inPast ||
              type == "product" ||
              type == "venue" ||
              decodedToken?.role == "admin" ? null : isNotif ? (
                <BellFilled
                  style={{
                    fontSize: "20px",
                    color: Colors.grey[800],
                    marginLeft: "15px",
                  }}
                  onClick={removeNotification}
                />
              ) : (
                <BellOutlined
                  style={{ fontSize: "20px", marginLeft: "15px" }}
                  onClick={addNotification}
                />
              )}
              {inPast ||
              decodedToken?.role == "admin" ||
              decodedToken?.role == "seller" ||
              type == "venue" ? null : isSaved ? (
                <HeartFilled
                  style={
                    type == "product" && decodedToken?.role == "tourist"
                      ? {
                          fontSize: "20px",
                          color: Colors.warning,
                          marginLeft: "15px",
                          position: "relative",
                          right: "100px",
                        }
                      : {
                          fontSize: "20px",
                          color: Colors.warning,
                          marginLeft: "15px",
                        }
                  }
                  onClick={unSave}
                />
              ) : (
                <HeartOutlined
                  style={
                    type == "product" && decodedToken?.role == "tourist"
                      ? {
                          fontSize: "20px",
                          marginLeft: "15px",
                          position: "relative",
                          right: "100px",
                        }
                      : { fontSize: "20px", marginLeft: "15px" }
                  }
                  onClick={save}
                />
              )}
              {/* Dropdown for sharing options */}
              {decodedToken?.role !== "seller" && (
                <Dropdown
                  menu={{
                    items: [
                      {
                        key: "1",
                        label: "Copy Link",
                        onClick: copyLink,
                      },
                      {
                        key: "2",
                        label: "Share via Email",
                        onClick: shareViaEmail,
                      },
                    ],
                  }}
                  trigger={["click"]}
                >
                  {inPast ? (
                    <></>
                  ) : (
                    <ShareAltOutlined
                      style={
                        type == "product" && decodedToken?.role == "tourist"
                          ? {
                              fontSize: "20px",
                              marginLeft: "15px",
                              marginRight: "20px",
                              cursor: "pointer",
                              position: "relative",
                              right: "100px",
                            }
                          : {
                              fontSize: "20px",
                              marginLeft: "15px",
                              marginRight: "20px",
                              cursor: "pointer",
                            }
                      }
                    />
                  )}
                </Dropdown>
              )}

              {inPast ? null : (type == "activity" || type == "itinerary") &&
                decodedToken?.role == "admin" ? (
                isFlagged ? (
                  <Button
                    style={{ height: "40px" }}
                    className="flagButton"
                    icon={
                      <FlagTwoTone
                        twoToneColor={Colors.warningDark}
                        style={{ color: Colors.warning, fontSize: "25px" }}
                      />
                    }
                    onClick={handleFlagClick}
                  >
                    <div
                      style={{ fontWeight: "bold", color: Colors.warningDark }}
                    >
                      Cancel Flagging
                    </div>
                  </Button>
                ) : (
                  <Button
                    className="flagButton"
                    style={{ height: "40px" }}
                    icon={
                      <FlagOutlined
                        style={{ color: Colors.warning, fontSize: "25px" }}
                      />
                    }
                    onClick={handleFlagClick}
                  >
                    <div style={{ fontWeight: "bold", color: Colors.warning }}>
                      Flag
                    </div>
                  </Button>
                )
              ) : (
                (type === "activity" || type === "itinerary") &&
                (isBooked ? (
                  <CustomButton
                    size={"s"}
                    style={{
                      width: "120px",
                      backgroundColor: Colors.warning,
                      fontWeight: "bold",
                      marginLeft: "-5px",
                    }}
                    value={"Cancel Booking"}
                    onClick={cancelBookingItem}
                  />
                ) : (
                  <CustomButton
                    size={"s"}
                    style={{ fontSize: "16px", fontWeight: "bold" }}
                    value={"Book"}
                    onClick={showBookingModal}
                  />
                ))
              )}
              <Modal
                title={`Confirm Booking for ${name}`}
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
                okText="  Book by wallet"
                okButtonProps={{
                  style: {
                    display: paymentMethod === "card" ? "none" : "inline-block",
                  },
                }}
                cancelButtonProps={
                  paymentMethod === "card"
                    ? {
                        style: {
                          position: "absolute",
                          right: "150px",
                          bottom: "31.5px",
                        },
                      }
                    : {}
                }
              >
                <div>
                  {/* Select Date (For Itinerary) */}
                  {type === "itinerary" && availableDates?.length > 0 && (
                    <Select
                      placeholder="Select booking date"
                      onChange={(value) => setCurrentSelectedDate(value)}
                      style={{ width: "100%", marginBottom: 10 }}
                    >
                      {availableDates.map((slot, index) => (
                        <Option key={index} value={slot.date}>
                          {new Date(slot.date).toLocaleString()} - {slot.spots}{" "}
                          spots left
                        </Option>
                      ))}
                    </Select>
                  )}

                  {type === "activity" && (
                    <Select
                      placeholder="Select price"
                      onChange={(value) => {
                        setSelectedPrice(value);
                      }}
                      defaultValue={discountedPriceUpper}
                      style={{ width: "100%", marginBottom: 10 }}
                    >
                      <Option value={discountedPriceLower} style={{}}>
                        Bronze Tier: {currencySymbol}
                        {discountedPriceLower.toFixed(2)}
                      </Option>
                      {priceUpper !== priceLower && (
                        <Option value={discountedMiddlePrice} style={{}}>
                          Silver Tier: {currencySymbol}
                          {discountedMiddlePrice.toFixed(2)}
                        </Option>
                      )}
                      {priceUpper !== priceLower && (
                        <Option value={discountedPriceUpper} style={{}}>
                          Gold Tier: {currencySymbol}
                          {discountedPriceUpper.toFixed(2)}
                        </Option>
                      )}
                    </Select>
                  )}

                  {/* Promo Code Input */}
                  <div style={{ marginTop: "15px" }}>
                    <h6>Promo code</h6>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                      <Input
                        type="text"
                        placeholder="Enter promo code"
                        value={promoCode}
                        onChange={handleInputChange}
                      />
                      {promo === 1 && (
                        <Button
                          onClick={handleApplyPromo}
                          style={{
                            backgroundColor: Colors.primary.default,
                            color: "white",
                            borderColor: Colors.primary.default,
                          }}
                        >
                          Apply
                        </Button>
                      )}
                      {promo !== 1 && (
                        <Button
                          onClick={handleRemovePromo}
                          style={{
                            backgroundColor: Colors.warning,
                            color: "white",
                            borderColor: Colors.warning,
                          }}
                        >
                          Cancel
                        </Button>
                      )}
                    </div>
                  </div>
                  <h4 style={{ marginTop: "15px" }}>
                    Price:{" "}
                    {promo !== 1 && (
                      <span
                        style={{
                          textDecoration: "line-through",
                          marginRight: "10px",
                        }}
                      >
                        {selectedPrice}
                        {currency}
                      </span>
                    )}
                    <span style={{ color: promo !== 1 ? "green" : "black" }}>
                      {selectedPrice * promo}
                      {currency}
                    </span>
                  </h4>

                  {/* Payment Method */}
                  <div style={{ marginTop: 15 }}>
                    <Radio.Group
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    >
                      <Radio value="wallet">Pay by Wallet</Radio>
                      <Radio value="card">Pay by Credit/Debit Card</Radio>
                    </Radio.Group>
                  </div>

                  {/* Wallet Balance */}
                  {paymentMethod === "wallet" &&
                    decodedToken?.userDetails?.wallet && (
                      <p style={{ marginTop: "15px" }}>
                        <strong>Current balance: </strong>
                        {currency}{decodedToken.userDetails.wallet*(currencyRates[currency] || 1).toFixed(2)}
                      </p>
                    )}

                  {/* Stripe Payment Form */}
                  {paymentMethod === "card" && (
                    <StripeContainer
                      amount={
                        type === "activity" ? selectedPrice * promo : price
                      }
                      type={type}
                      selectedDate={
                        type === "itinerary" ? currentSelectedDate : date
                      }
                      userid={userid}
                      id={id}
                      useWallet={paymentMethod === "wallet"}
                      setLeave={setLeave}
                    />
                  )}
                </div>
              </Modal>
            </Flex>
          </Flex>
          <Flex
            className="scrollModern"
            style={{
              marginTop: "10px",
              width: "100%",
              overflow: "auto",
            }}
          >
            {tags
              ? tags.map((tag, id) => {
                  return (
                    <div
                      id={id}
                      style={{
                        backgroundColor: Colors.primary.light,
                        color: "white",
                        marginRight: "5px",
                        padding: "5px 10px",
                        borderRadius: "5px",
                        fontSize: "14px",
                        textWrap: "nowrap",
                      }}
                    >{`#${tag.toUpperCase()}`}</div>
                  );
                })
              : null}
          </Flex>
          {category ? (
            <div style={{ marginTop: "15px" }}>
              <h4 style={{ textAlign: "left" }}>Categories</h4>
              <Flex
                className="scrollModern"
                style={{ marginTop: "10px", width: "100%", overflow: "auto" }}
              >
                {category?.map((categoryStr, id) => {
                  return (
                    <div
                      style={{
                        backgroundColor: Colors.grey[100],
                        padding: "5px 10px",
                        marginRight: "5px",
                        borderRadius: "5px",
                      }}
                    >
                      {categoryStr}
                    </div>
                  );
                })}
              </Flex>
            </div>
          ) : null}
          {language ? (
            <div
              style={{
                textAlign: "left",
                fontWeight: "bold",
                marginTop: "15px",
              }}
            >
              <div
                style={{
                  fontWeight: "bold",
                }}
              >
                Language:{" "}
                <span style={{ fontWeight: "normal" }}>{language}</span>
              </div>
            </div>
          ) : null}
          {pickUp && dropOff ? (
            <Flex justify="space-between" style={{ marginTop: "15px" }}>
              <div
                style={{
                  fontWeight: "bold",
                }}
              >
                PickUp: <span style={{ fontWeight: "normal" }}>{pickUp}</span>
              </div>
              <div
                style={{
                  fontWeight: "bold",
                }}
              >
                DropOff: <span style={{ fontWeight: "normal" }}>{dropOff}</span>
              </div>
            </Flex>
          ) : null}
          {accessibility ? (
            <div
              style={{
                fontWeight: "bold",
                textAlign: "left",
                marginTop: "15px",
                overflow: "hidden",
                width: "100%",
                textOverflow: "ellipsis",
                textWrap: "nowrap",
              }}
            >
              Accessibility:{" "}
              <span
                style={{
                  fontWeight: "normal",
                }}
              >
                {accessibility}
              </span>
            </div>
          ) : null}

          {desc ? (
            <div
              style={{
                fontWeight: "bold",
                textAlign: "left",
                marginTop: "15px",
                display: "-webkit-box",
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                WebkitLineClamp: 9, // Change this number to set max lines
                textOverflow: "ellipsis",
              }}
            >
              Description:{" "}
              <span
                style={{
                  fontWeight: "normal",
                  textOverflow: "ellipsis",
                }}
              >
                {desc}
              </span>
            </div>
          ) : null}
          {type == "activity" && (
            <div style={{ width: "100%", height: "100%", marginTop: "30px" }}>
              <MapView googleMapsLink={location} />
            </div>
          )}
        </Col>
      </Row>
    </>
  );
};

export default HeaderInfo;
