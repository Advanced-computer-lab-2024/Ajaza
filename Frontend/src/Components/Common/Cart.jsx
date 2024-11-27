
import React, { useEffect, useState } from "react";
import { List, Button, message, Empty } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { apiUrl } from "../Common/Constants";
import { useCurrency } from "../Tourist/CurrencyContext";
import { MinusOutlined, PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { jwtDecode } from "jwt-decode";
import CustomButton from "./CustomButton";

export const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const { currency } = useCurrency();
  const [loading, setLoading] = useState(true); 
  const [touristId, setTouristId] = useState(null);


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
    const token = localStorage.getItem("token");
    if (!token) {
      message.error("User not authenticated");
      navigate("/auth/signin");
      return;
    }

    const decodedToken = jwtDecode(token);
    setTouristId(decodedToken.userId);
  }, [navigate]);

  useEffect(() => {
    if (!touristId) return; 
    const fetchCartItems = async () => {
      try {
        setLoading(true); 
        const response = await axios.get(`${apiUrl}tourist/cart/${touristId}`);
        console.log("tourist Id:" , touristId);
        console.log("Cart Items:", response.data);
        setCartItems(response.data.map((item) => ({
            name: item.productId.name,
            price: item.productId.price,
            quantity: item.quantity,
            photo: item.productId.photo,
            productId: item.productId._id ,
            stock : item.productId.quantity
          }))); 
        console.log("Marioumi:", cartItems);
      } catch (error) {
        console.error("Error fetching cart items:", error);
        message.error("Failed to load cart items");
        setCartItems([]); 
      } finally {
        setLoading(false); 
      }
    };

    fetchCartItems();
  }, [touristId ]);

  const handleIncrement = async (productId) => {
    try {
      const currentItem = cartItems.find((item) => item.productId === productId);
      if (currentItem && currentItem.quantity < currentItem.stock) {
        const response = await axios.post(`${apiUrl}tourist/cart/plus/${touristId}`, { productId });
        message.success(response.data.message);
        setCartItems((prevItems) =>
          prevItems.map((item) =>
            item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item
          )
        );
      } else {
        message.warning("Cannot add more items, reached the stock limit");
      }
    } catch (error) {
      console.error("Error incrementing quantity:", error);
      message.error("Failed to increment quantity");
    }
  };

  const handleDecrement = async (productId) => {
    try {
      const response = await axios.post(`${apiUrl}tourist/cart/minus/${touristId}`, { productId ,});
      message.success(response.data.message);
      setCartItems((prevItems) =>
        prevItems
          .map((item) =>
            item.productId === productId && item.quantity > 1
              ? { ...item, quantity: item.quantity - 1 }
              : item
          )
          .filter((item) => item.quantity > 0)
      );
    } catch (error) {
      console.error("Error decrementing quantity:", error);
      message.error("Failed to decrement quantity");
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
      console.log("mimiiii", productId);
      await axios.post(`${apiUrl}tourist/cart/remove/${touristId}` , { productId });
      message.success("Item removed from cart");
      setCartItems((prevItems) => prevItems.filter((item) => item.productId !== productId));
    } catch (error) {
      console.error("Error removing item from cart:", error);
      message.error("Failed to remove item from cart");
    }
  };

  if (loading) {
    return <div>Loading...</div>; 
  }

  if (!loading && (!cartItems || cartItems.length === 0)) {
    return <Empty description="Your cart is empty" style={{ marginTop: "20px" }} />;
  }
console.log("Cartttt", cartItems);


  return (
    <div style={{ padding: "20px" }}>
      <h2>Your Cart</h2>
      <List
        itemLayout="horizontal"
        dataSource={cartItems}
        renderItem={(item) => (
          <List.Item
          actions={
           item.quantity > 1
              ? [
                  <Button
                    icon={<MinusOutlined />}
                    onClick={() => handleDecrement(item.productId)}
                  />,
                  <span>{item.quantity}</span>,
                  <Button
                    icon={<PlusOutlined />}
                    onClick={() => handleIncrement(item.productId)}
                  />,
                  <Button
                    icon={<DeleteOutlined />}
                    danger
                    onClick={() => handleRemoveItem(item.productId)}
                  />,
                ]
              : [
                  <Button
                    icon={<DeleteOutlined />}
                    danger
                    onClick={() => handleRemoveItem(item.productId)}
                  />,
                  <span>{item.quantity}</span>,
                  <Button
                    icon={<PlusOutlined />}
                    onClick={() => handleIncrement(item.productId)}
                  />,
                ]
          }
        >
        

            <List.Item.Meta
              style={{ marginLeft: '18px' }} 
              avatar={
                item.photo && (
                  <img
                    src={`/uploads/${item.photo}`}
                    alt={item.productName}
                    style={{ width: "50px", height: "50px", objectFit: "cover" }}
                  />
                )
              }
              title={item.name}
              description={`Price: ${(item.quantity * item.price * currencyRates[currency]).toFixed(2)} ${currency}`}
            />
          </List.Item>
        )}
      />
      <CustomButton size = "s" value={"Checkout"}  onClick={() => navigate(`/tourist/cart/${touristId}`)}/>
    </div>
  );
};

export default Cart;

