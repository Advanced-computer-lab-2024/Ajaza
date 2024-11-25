import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import SearchFilterSortContainer from "../Common/SearchFilterSortContainer";
import BasicCard from "../Common/BasicCard";
import { apiUrl, comparePriceRange, getAvgRating } from "../Common/Constants";
import SelectCurrency from "./SelectCurrency";
import { useCurrency } from "./CurrencyContext";
import LoadingSpinner from "../Common/LoadingSpinner";
import { ShoppingCartOutlined } from "@ant-design/icons";
import { Space, message } from "antd";
const Wishlist = () => {
  const navigate = useNavigate();
  //const { touristId } = useParams(); // Get touristId from the URL
  const [wishlist, setWishlist] = useState(null);
  const [loading, setLoading] = useState(true);
  const { currency, setCurrency } = useCurrency();

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
    currencyRates: { EGP: 48.58, USD: 1, EUR: 0.91 },
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
  const [isInCart, setIsInCart] = useState(false);
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
        const decTemp = jwtDecode(newToken);
        setDecodedToken(decTemp);
        setUserid(decTemp?.userId);
        // console.log(newToken);
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
    ...props
  }) => {
    const addToCartFromWishlist = async () => {
      const productId = id;
      try {
        if (!userid || !productId) {
          console.error("Tourist ID or Product ID is missing!");
          return;
        }

        const response = await axios.post(
          `${apiUrl}tourist/add-to-cart-from-wishlist`,
          {
            touristId: userid,
            productId,
            quantity, // Pass the quantity to the backend
          }
        );

        if (response.status === 200) {
          setWishlist((prevWishlist) =>
            prevWishlist.filter((product) => product._id !== productId)
          );
          setIsInCart(true);
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
    const [quantity, setQuantity] = useState(0); // Initialize quantity with 1
    const increaseQuantity = () => {
      setQuantity((prevQuantity) => prevQuantity + 1);
    };

    const decreaseQuantity = () => {
      setQuantity((prevQuantity) => (prevQuantity > 0 ? prevQuantity - 1 : 0)); // Ensure it doesn't go below 1
    };
    console.log("quantity is:", quantity); // Debugging

    return (
      <div style={{ position: "relative" }}>
        {/* Render the BasicCard */}
        <BasicCard element={element} propMapping={propMapping} {...props} />

        {/* Render the Cart Icon */}
        <div
          style={{
            position: "absolute",
            top: "20px",
            left: "10px",
            cursor: "pointer",
          }}
          onClick={addToCartFromWishlist} // Pass quantity along with element
        >
          <ShoppingCartOutlined
            style={{
              marginLeft: "10px",
              fontSize: "20px",
              color: "green",
              cursor: "pointer",
            }}
          />
        </div>

        {/* Quantity Adjustment Section */}
        <div
          style={{
            position: "absolute",
            top: "35px",
            left: "10px",
            display: "flex",
            alignItems: "center",
          }}
        >
          <button
            onClick={decreaseQuantity}
            style={{
              width: "10px",
              height: "10px",
              // borderRadius: "5px",
              border: "none",
              //backgroundColor: "#ddd",
              cursor: "pointer",
            }}
          >
            -
          </button>
          <span
            style={{
              margin: "0 10px",
              fontSize: "16px",
              fontWeight: "bold",
            }}
          >
            {quantity}
          </span>
          <button
            onClick={increaseQuantity}
            style={{
              width: "10px",
              height: "10px",
              //borderRadius: "5px",
              border: "none",
              // backgroundColor: "#ddd",
              cursor: "pointer",
            }}
          >
            +
          </button>
        </div>
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
        <SelectCurrency
          basePrice={null}
          currency={currency}
          onCurrencyChange={handleCurrencyChange}
          style={{ left: 1000, top: 55 }}
        />
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
        <div>No products in your wishlist.</div>
      )}
    </div>
  );
};

export default Wishlist;
