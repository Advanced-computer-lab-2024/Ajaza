
import React, { useEffect, useState } from "react";
import { List, Button, message, Empty } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { apiUrl } from "../Common/Constants";
import { useCurrency } from "../Tourist/CurrencyContext";
import { MinusOutlined, PlusOutlined, DeleteOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import LoadingSpinner from "./LoadingSpinner";
import Item from "./Item";
import SelectCurrency from "../Tourist/SelectCurrency";
import {jwtDecode} from "jwt-decode";
import CustomButton from "./CustomButton";

const Product = () => {
  let { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [touristId, setTouristId] = useState(null);
  const { currency, setCurrency } = useCurrency();
  const [quantity, setQuantity] = useState(0);

  const handleCurrencyChange = (newCurrency) => {
    setCurrency(newCurrency);
  };
  const [currencyRates] = useState({
        AED: 3.6725 ,
    ARS: 1004.0114 ,
    AUD: 1.5348,
    BDT: 110.50,
    BHD: 0.3760,
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
    IDR: 15911.8070,
    ILS: 3.7184,
    INR: 84.5059,
    JPY: 154.4605,
    KRW: 1399.3230,
    KWD: 0.3077,
    LKR: 291.0263,
    MAD: 10.50,
    MXN: 20.4394,
    MYR: 4.4704,
    NOK: 11.0668,
    NZD: 1.7107,
    OMR: 0.3850,
    PHP: 58.9091,
    PKR: 279.0076,
    PLN: 4.1476,
    QAR: 3.6400,
    RUB: 101.2963,
    SAR: 3.7500,
    SEK: 11.0630,
    SGD: 1.3456,
    THB: 34.7565,
    TRY: 34.5345,
    TWD: 32.5602,
    UAH: 36.90,
    USD : 1,
    VND: 24000.00,
    ZAR: 18.0887,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productResponse = await axios.get(`${apiUrl}product/${id}`);
        let product = productResponse.data;
        setProduct(product);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwtDecode(token);
      setTouristId(decodedToken.userId);
    } else {
      message.error("User not authenticated");
    }
  }, []);

  useEffect(() => {
    if (touristId && product) {
      const fetchCartData = async () => {
        try {
          const response = await axios.get(`${apiUrl}tourist/cart/${touristId}`);
          const cartItem = response.data.find((item) => item.productId === product._id);
          if (cartItem) {
            setQuantity(cartItem.quantity);
          }
        } catch (error) {
          console.error("Error fetching cart data:", error);
        }
      };
      fetchCartData();
    }
  }, [touristId, product]);


  const handleAddToCart = async () => {
    try {
      const response = await axios.post(`${apiUrl}tourist/cart/${touristId}`, {
        productId: product?._id,
      });
      message.success(response.data.message);
      setQuantity(1); 
      setProduct((prevProduct) => ({
        ...prevProduct,
        quantity: prevProduct.quantity - 1,
      })); 
    } catch (error) {
      console.error("Error adding product to cart:", error);
      message.error(error.response?.data?.message || "Failed to add product to cart");
    }
  };

  const handleIncrement = async () => {
    try {
      const response = await axios.post(`${apiUrl}tourist/cart/plus/${touristId}`, {
        productId: product?._id,
        quantity: quantity + 1,
      });
      message.success(response.data.message);
      setQuantity((prev) => prev + 1); 
      setProduct((prevProduct) => ({
        ...prevProduct,
        quantity: prevProduct.quantity - 1,
      })); 
    } catch (error) {
      console.error("Error incrementing quantity:", error);
      message.error(error.response?.data?.message || "Failed to increment quantity");
    }
  };

  const handleDecrement = async () => {
    try {
      const response = await axios.post(`${apiUrl}tourist/cart/minus/${touristId}`, {
        productId: product?._id,
        quantity: quantity - 1,
      });
      message.success(response.data.message);
      setQuantity((prev) => (prev > 1 ? prev - 1 : 0)); 
      setProduct((prevProduct) => ({
        ...prevProduct,
        quantity: prevProduct.quantity + 1,
      })); 
    } catch (error) {
      console.error("Error decrementing quantity:", error);
      message.error(error.response?.data?.message || "Failed to decrement quantity");
    }
  };

  const handleRemoveFromCart = async () => {
    try {
      const response = await axios.post(`${apiUrl}tourist/cart/remove/${touristId}`, {
        productId: product?._id,
      });
      message.success(response.data.message);
      setQuantity(0);
      setProduct((prevProduct) => ({
        ...prevProduct,
        quantity: prevProduct.quantity + quantity,
      })); 
    } catch (error) {
      console.error("Error removing product from cart:", error);
      message.error(error.response?.data?.message || "Failed to remove product from cart");
    }
  };


  if (!product) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <div style={{ display: "flex", justifyContent: "flex-end", padding: "10px" }}>
        
          <ShoppingCartOutlined 
          style={{fontSize: '24px'}}
          onClick={() => navigate(`/tourist/cart/${touristId}`)}
          />
      </div>

      <SelectCurrency
        currency={currency}
        onCurrencyChange={handleCurrencyChange}
        style={{ left: -7, top: 45 }}
      />

      <Item
        name={product?.name}
        photos={product?.photo}
        price={(product.price * currencyRates[currency]).toFixed(2)}
        desc={product?.desc}
        sellerName={product?.sellerName}
        quantity={product?.quantity}
        sales={product?.sales}
        feedbacks={product?.feedback}
        type={"product"}
        currency={currency}
      />

   
      <div style={{ display: "flex", alignItems: "center", marginTop: "20px" }}>
      {quantity === 0 ? (
        <CustomButton
          size = "s"
          onClick={handleAddToCart}
          value= "Add to Cart"
        />
       
      ): (
      <>
      <MinusOutlined
        onClick={handleDecrement}
        style={{
          fontSize: "24px",
          color: quantity > 1 ? "#FF0000" : "#d9d9d9",
          cursor: quantity > 1 ? "pointer" : "not-allowed",
          marginRight: "10px",
        }}
      />
      <span style={{ fontSize: "18px", margin: "0 10px" }}>{quantity}</span>
      <PlusOutlined
        onClick={handleIncrement}
        style={{
          fontSize: "24px",
          color: "#4CAF50",
          cursor: "pointer",
          marginRight: "10px",
        }}
      />
      <DeleteOutlined
        onClick={handleRemoveFromCart}
        style={{
          fontSize: "24px",
          color: "#FF0000",
          cursor: "pointer",
        }}
      />
    </>
  )}
      </div>
    </>
  );
};

export default Product;