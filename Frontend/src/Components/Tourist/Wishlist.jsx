import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import SearchFilterSortContainer from "../Common/SearchFilterSortContainer";
import BasicCard from "../Common/BasicCard";
import {
  apiUrl,
  Colors,
  comparePriceRange,
  getAvgRating,
} from "../Common/Constants";
import SelectCurrency from "./SelectCurrency";
import { useCurrency } from "./CurrencyContext";
import LoadingSpinner from "../Common/LoadingSpinner";
import { ShoppingCartOutlined } from "@ant-design/icons";
import { Empty, Space, message } from "antd";
import PlusMinusPill from "../Common/PlusMinusPill";

const Wishlist = () => {
  const navigate = useNavigate();
  //const { touristId } = useParams(); // Get touristId from the URL
  const [wishlist, setWishlist] = useState(null);
  const [loading, setLoading] = useState(true);
  const { currency, setCurrency } = useCurrency();

  const currencyRates = {
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
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    // console.log("Token:", token);
    // console.log("decodedToken:", jwtDecode(token));
    if (token) {
      try {
        const decodedToken = jwtDecode(token);

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

  const location = useLocation();

  useEffect(() => {
    const extractTouristIdFromUrl = () => {
      const path = location.pathname;
      const parts = path.split("/");
      return parts[parts.length - 1];
    };

    const touristId = extractTouristIdFromUrl();
    console.log("Extracted Tourist ID:", touristId);
    if (!touristId) {
      console.error("Tourist ID is undefined!");
      return;
    }

    const fetchData = async () => {
      try {
        const wishlistResponse = await axios.get(
          `${apiUrl}tourist/wishlist/${touristId}`
        );
        const products = wishlistResponse.data.wishlist.map((product) => ({
          ...product,
          avgRating: getAvgRating(product.feedback), // Calculate average rating
          basePrice: product.price, // Store the base price to use for conversions
          price: product.price * (currencyRates[currency] || 1),
        }));
        setWishlist(products);
      } catch (error) {
        console.error("Error fetching wishlist:", error);
      } finally {
        setLoading(false);
      }
    };

    if (touristId) {
      fetchData();
    } else {
      console.error("Tourist ID not found in the URL!");
    }
  }, [location]);

  const cardOnclick = (product) => {
    navigate(`/tourist/products/${product["_id"]}`);
  };
  const handleCurrencyChange = (newCurrency) => {
    setCurrency(newCurrency);
  };

  const propMapping = {
    id: "_id",
    title: "name",
    extra: "price",
    rating: "avgRating",
    photo: "photo",
    stock: "quantity",
  };

  const fields = {
    Description: "desc",
    Seller: "sellerName",
    "Quantity Available": "quantity",
  };

  const searchFields = ["name"];
  const constProps = {
    rateDisplay: true,
    currency,
    currencyRates,
  };
  const sortFields = ["avgRating", "price"];
  const [filterFields, setfilterFields] = useState({
    price: {
      displayName: "Price",
      values: [
        { displayName: "0-20", filterCriteria: [0, 20] },
        { displayName: "21-60", filterCriteria: [21, 60] },
        { displayName: "61-100", filterCriteria: [61, 100] },
        { displayName: "101+", filterCriteria: [101, 9999999999] },
      ],
      compareFn: (filterCriteria, element) =>
        comparePriceRange(filterCriteria, element),
    },
  });
  const [isSaved, setIsSaved] = useState(false);
  const locationUrl = useLocation();
  const [userid, setUserid] = useState(null);
  const [token, setToken] = useState(null);
  const [decodedToken, setDecodedToken] = useState(null);
  const [productId, setProductId] = useState(null);

  useEffect(() => {
    const tempToken = localStorage.getItem("token");
    setToken(tempToken);
    if (tempToken) {
      const decTemp = jwtDecode(tempToken);
      setDecodedToken(decTemp);
      setUserid(decTemp?.userId);
      if (decTemp?.productId) {
        setProductId(decTemp.productId);
      } else {
        console.error("Product ID is not present in the token!");
      }
    }
  }, []);

  useEffect(() => {
    if (wishlist) {
      const updatedWishlist = wishlist.map((product) => ({
        ...product,
        price: (product.basePrice * (currencyRates[currency] || 1)).toFixed(2),
      }));
      setWishlist(updatedWishlist);
    }
  }, [currency]);

  const getNewToken = async () => {
    try {
      const response = await axios.post(`${apiUrl}api/auth/generate-token`, {
        id: userid,
        role: decodedToken.role,
      });

      const { token: newToken } = response.data;

      if (newToken) {
        localStorage.setItem("token", newToken); // Store the new token
        // console.log("Updated token:", newToken);
        // const decTemp = jwtDecode(newToken);
        // setDecodedToken(decTemp);
        // setUserid(decTemp?.userId);
        // console.log(newToken);
        console.log("new token fetched successfully");
      }
    } catch (error) {
      console.error("Error getting new token:", error);
      message.error("Failed to refresh token. Please try again.");
    }
  };

  const getNewTokenAndUpdate = async () => {
    try {
      const response = await axios.post(`${apiUrl}api/auth/generate-token`, {
        id: userid,
        role: decodedToken.role,
      });

      const { token: newToken } = response.data;

      if (newToken) {
        localStorage.setItem("token", newToken); // Store the new token
        console.log("Updated token:", newToken);
        const decTemp = jwtDecode(newToken);
        setDecodedToken(decTemp);
        setUserid(decTemp?.userId);
        console.log(newToken);
        console.log("new token fetched successfully");
      }
    } catch (error) {
      console.error("Error getting new token:", error);
      message.error("Failed to refresh token. Please try again.");
    }
  };

  const WishlistCard = ({
    id,
    element,
    propMapping,
    onCartClick,
    stock,
    ...props
  }) => {
    const [quantity, setQuantity] = useState(0);
    const increaseQuantity = async () => {
      try {
        if (quantity != element?.stock) {
          const response = await axios.post(
            `${apiUrl}tourist/cart/plus/${userid}`,
            { productId: id }
          );
          message.success(response.data.message);
          setQuantity((prevQuantity) => prevQuantity + 1);
          await getNewToken();
        } else {
          message.warning("Cannot add more items, reached the stock limit");
        }
      } catch (error) {
        console.error("Error incrementing quantity:", error);
        message.error("Failed to increment quantity");
      }
    };

    const decreaseQuantity = async () => {
      try {
        const response = await axios.post(
          `${apiUrl}tourist/cart/minus/${userid}`,
          { productId: id }
        );
        message.success(response.data.message);
        setQuantity((prevQuantity) => prevQuantity - 1);
        await getNewToken();
      } catch (error) {
        console.error("Error decrementing quantity:", error);
        message.error("Failed to decrement quantity");
      }
    };

    const handleRemoveItem = async () => {
      try {
        //console.log("mimiiii", productId);
        await axios.post(`${apiUrl}tourist/cart/remove/${userid}`, {
          productId: id,
        });
        setQuantity(0);
        await getNewToken();
        console.log(wishlist);

        setWishlist((prevWishlist) =>
          prevWishlist.filter((product) => product._id !== id)
        );

        message.success("Item removed from cart");
      } catch (error) {
        console.error("Error removing item from cart:", error);
        message.error("Failed to remove item from cart");
      }
    };

    const addToCartFromWishlist = async () => {
      const productId = id;
      const stockNo = stock;
      try {
        if (!userid || !productId) {
          console.error("Tourist ID or Product ID is missing!");
          return;
        }
        if (stockNo < 1) {
          message.error("Quantity chosen is more than stock limit");
          return;
        }
        const response = await axios.post(
          `${apiUrl}tourist/add-to-cart-from-wishlist`,
          {
            touristId: userid,
            productId,
            quantity: 1,
          }
        );
        console.log(response);

        if (response.status === 200) {
          setQuantity(1);
          await getNewToken();
          message.success("Item added to cart");
        }
      } catch (error) {
        console.error(
          "Error adding product to Cart:",
          error.response?.data.message || error.message
        );
      }
    };

    useEffect(() => {
      console.log(quantity);
    }, [quantity]);

    return (
      <div className="wishlistCard" style={{ position: "relative" }}>
        {/* Render the BasicCard */}
        <BasicCard element={element} propMapping={propMapping} {...props} />

        {/* Render the Cart Icon */}
        {quantity == 0 ? (
          <div
            style={{
              position: "absolute",
              top: "12px",
              left: "20px",
              cursor: "pointer",
            }}
            onClick={addToCartFromWishlist} // Pass quantity along with element
          >
            <ShoppingCartOutlined
              className="cartIcon"
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: "10px",
                fontSize: "18px",
                cursor: "pointer",
                width: "35px",
                height: "35px",
                border: "1px solid",
                borderColor: Colors.grey[100],
              }}
            />
          </div>
        ) : (
          <div
            style={{
              position: "absolute",
              top: "10px",
              left: "7 px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <PlusMinusPill
              handlePlus={increaseQuantity}
              handleMinus={decreaseQuantity}
              quantity={quantity}
              handleDelete={handleRemoveItem}
              containerHeight={35}
              iconSize={14}
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      <h2>Your Wishlist</h2>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px",
        }}
      >
        {/* <SelectCurrency
          //basePrice={null}
          currency={currency}
          onCurrencyChange={handleCurrencyChange}
          style={{ left: 1000, top: 55 }}
        /> */}
      </div>
      {loading ? (
        <LoadingSpinner />
      ) : wishlist && wishlist.length > 0 ? (
        <SearchFilterSortContainer
          cardComponent={WishlistCard}
          elements={wishlist}
          propMapping={propMapping}
          searchFields={searchFields}
          constProps={constProps}
          fields={fields}
          sortFields={sortFields}
          filterFields={filterFields}
          cardOnclick={cardOnclick}
        />
      ) : (
        <Empty />
      )}
    </div>
  );
};

export default Wishlist;
