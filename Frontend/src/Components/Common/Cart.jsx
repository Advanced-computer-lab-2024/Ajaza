import React, { useEffect, useState } from "react";
import { List, Button, message, Empty, Modal, Input, Radio, notification } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { apiUrl } from "../Common/Constants";
import { useCurrency } from "../Tourist/CurrencyContext";
import { MinusOutlined, PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { jwtDecode } from "jwt-decode";
import CustomButton from "./CustomButton";
import StripeContainer from "./StripeContainer";

export const Cart = () => {
  const navigate = useNavigate();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [cartItems, setCartItems] = useState([]);
  const { currency } = useCurrency();
  const [loading, setLoading] = useState(true);
  const [touristId, setTouristId] = useState(null);
  const [price, setPrice] = useState();
  const [leave, setLeave] = useState(false);
  const [decodedToken, setDecodedToken] = useState(null);
  const [token, setToken] = useState(null);
  const [deliveryAddresses, setDeliveryAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(-1);
  const [promo, setPromo] = useState(1);
  const [promocode, setPromocode] = useState("");

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

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      message.error("User not authenticated");
      navigate("/auth/signin");
      return;
    }
    setToken(token);
    if (token) {
      const decTemp = jwtDecode(token);
      setDecodedToken(decTemp);
      setTouristId(decTemp?.userId);
      setDeliveryAddresses(decTemp.userDetails.deliveryAddresses);
    }
  }, [navigate]);

  useEffect(() => {
    if (!touristId) return;
    const fetchCartItems = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${apiUrl}tourist/cart/${touristId}`);
        //console.log("tourist Id:", touristId);
        //console.log("Cart Items:", response.data);
        const items = response.data.map((item) => ({
          name: item.productId.name,
          price: item.productId.price,
          quantity: item.quantity,
          photo: item.productId.photo,
          productId: item.productId._id,
          stock: item.productId.quantity,
        }));
        
        // Calculate total price
        const totalPrice = items.reduce(
          (acc, item) => acc + item.price * item.quantity, 
          0
        );
        setPrice(totalPrice); // Update price state
  
        setCartItems(items);
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
  }, [touristId]);

  const handleIncrement = async (productId) => {
    try {
      const currentItem = cartItems.find(
        (item) => item.productId === productId
      );
      if (currentItem && currentItem.quantity < currentItem.stock) {
        const response = await axios.post(
          `${apiUrl}tourist/cart/plus/${touristId}`,
          { productId }
        );
        message.success(response.data.message);
        setCartItems((prevItems) =>
          prevItems.map((item) =>
            item.productId === productId
              ? { ...item, quantity: item.quantity + 1 }
              : item
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

  const handleSelection = (index) => {
    setSelectedAddress(index);
  };

  const handleCheckout = async () => {
    if(!paymentMethod || !deliveryAddress || !price ) {
      message.error("Please fill in all fields");
    } else {
      message.success("success");
    }
  }

  const handleDecrement = async (productId) => {
    try {
      const response = await axios.post(
        `${apiUrl}tourist/cart/minus/${touristId}`,
        { productId }
      );
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
      //console.log("mimiiii", productId);
      await axios.post(`${apiUrl}tourist/cart/remove/${touristId}`, {
        productId,
      });
      message.success("Item removed from cart");
      setCartItems((prevItems) =>
        prevItems.filter((item) => item.productId !== productId)
      );
    } catch (error) {
      console.error("Error removing item from cart:", error);
      message.error("Failed to remove item from cart");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!loading && (!cartItems || cartItems.length === 0)) {
    return (
      <Empty description="Your cart is empty" style={{ marginTop: "20px" }} />
    );
  }
  //console.log("Cartttt", cartItems);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    if (selectedAddress === -1 || paymentMethod === "") {
      message.error("Please fill out all fields!");
    } else {
      // Proceed with checkout logic here (e.g., API call) ya Ahmed
      // console.log("Delivery Address:", selectedAddress);
      // console.log("Payment Method:", paymentMethod);

      const response = await axios.post(
        `${apiUrl}tourist/cart/checkout/${touristId}`,
        { useWallet: (paymentMethod==="wallet") ,cod: (paymentMethod === "cod") ,deiveryAddress: selectedAddress, total: price*promo}
      );
      setIsModalVisible(false); // Close modal after checkout

      if(response.status === 200) {
        notification.success({
          message: 'Purchase Success',
          description: 'Order placed successfully.',
        });        
        window.location.href = "http://localhost:3000/tourist/orders";
      } else {
        message.error("An error has occurred. Please try again.");
      }
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleApplyPromo = async () => {
    //setPromo(promo);
    if(promo === 1) {
      try {
      console.log(promocode);
      const response = await axios.post(`http://localhost:5000/promocode/checkValid/${promocode}`, { touristId });

      if (response.status === 200) {
        console.log('Promo value:', response.data.value);
        setPromo(response.data.value);
      } else {
        message.error("Invalid promo code");
      }
    } catch(error) {
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
    setPromocode(e.target.value); // Update the promoCode state when the input changes
  };

  const navigateToSection = () => {
    window.location.href = "http://localhost:3000/tourist/profile#addresses";
  };

  // const getNewToken = async () => {
  //   try {
  //     const response = await axios.post(`${apiUrl}api/auth/generate-token`, {
  //       id: userid,
  //       role: decodedToken.role,
  //     });

  //     const { token: newToken } = response.data;

  //     if (newToken) {
  //       localStorage.setItem("token", newToken); // Store the new token
  //       const decTemp = jwtDecode(newToken);
  //       setDecodedToken(decTemp);
  //       setUserid(decTemp?.userId);
  //       user = decTemp.userDetails;
  //     }
  //   } catch (error) {
  //     console.error("Error getting new token:", error);
  //     message.error("Failed to refresh token. Please try again.");
  //   }
  // };

  // if (leave) {
  //   getNewToken();
  //   Modal.destroyAll();
  //   setTimeout(() => {
  //     navigate("/tourist/");
  //   }, 500);
  // }

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
                      icon={<DeleteOutlined />}
                      danger
                      onClick={() => handleRemoveItem(item.productId)}
                    />,
                    <Button
                      icon={<MinusOutlined />}
                      onClick={() => handleDecrement(item.productId)}
                    />,
                    <span>{item.quantity}</span>,
                    <Button
                      icon={<PlusOutlined />}
                      onClick={() => handleIncrement(item.productId)}
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
              style={{ marginLeft: "18px" }}
              avatar={
                item.photo && (
                  <img
                    src={`/uploads/${item.photo}`}
                    alt={item.productName}
                    style={{
                      width: "50px",
                      height: "50px",
                      objectFit: "cover",
                    }}
                  />
                )
              }
              title={item.name}
              description={`Price: ${(
                item.quantity *
                item.price *
                currencyRates[currency]
              ).toFixed(2)} ${currency}`}
            />
          </List.Item>
        )}
      />
      <CustomButton size="s" value="Checkout" onClick={showModal} />

      {/* Modal for Checkout */}
      <Modal
        //title="Checkout"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Place Order"
        okButtonProps={{
          style: {
            display: paymentMethod === "card" ? "none" : "inline-block",
          },
        }}
        cancelText="Cancel"
      >
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50px" }}><h1>Checkout</h1></div>
        <div>
          <h6>Order Summary</h6>
          <div>
          {cartItems.map((item, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                justifyContent: "space-between",
                border: "1px solid #ccc",
                padding: "10px",
                paddingBottom: "0px",
                marginBottom: "5px",
                borderRadius: "5px",
              }}
            >
              <div>
                <strong>{item.quantity}x {item.name}</strong>
                <p>Price: ${item.price.toFixed(2)}</p>
              </div>
              <div><br />
                <p>Total: ${(item.quantity * item.price).toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
        <h4>Total: <strong></strong>
        {promo !== 1 && (
          <span style={{ textDecoration: 'line-through', marginRight: '10px' }}>
            ${price.toFixed(2)}
          </span>
        )}
        <span style={{ color: promo !== 1 ? 'green' : 'black' }}>
          ${(price*promo).toFixed(2)}
        </span>
      </h4>
        <div style={{ marginTop: "15px" }}>
          <h6>Promo Code</h6>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Input
              type="text"
              placeholder="Enter text"
              value={promocode}
              onChange={handleInputChange}
              style={{ flex: "1" }} // Optional: Allows the input to take remaining space
            />
            {promo === 1 && (
              <Button onClick={handleApplyPromo} style={{
                backgroundColor: "#1b696a",
                color: "white",
                borderColor: "#1b696a",
              }}>
                Apply
              </Button>
            )}
            {promo !== 1 && (
              <Button onClick={handleRemovePromo} style={{
                backgroundColor: "#cc0b38",
                color: "white",
                borderColor: "#cc0b38",
              }}>
                Cancel
              </Button>
            )}
          </div>
        </div>
        </div>
        <div style={{ marginTop: "15px" }}>
          <h6>Delivery Address</h6>
          {deliveryAddresses.length > 0 && (
            <Radio.Group
              value={selectedAddress}
              onChange={(e) => handleSelection(e.target.value)}
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              {deliveryAddresses.map((address, index) => (
                <Radio key={index} value={index}>
                  {`${address.house}, ${address.street}, ${address.area}, ${address.city}, ${address.country}. Appartment.: ${address.app}, Description: ${address.desc}`}
                </Radio>
              ))}
            </Radio.Group>
          )}<br />
          <a onClick={navigateToSection} style={{
            color: "blue",
            textDecoration: "underline",
            cursor: "pointer",
          }}>
            Add delivery address
          </a>
        </div>
        <div style={{ marginTop: "20px" }}>
          <h6>Payment Method</h6>
          <Radio.Group
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            <Radio value="wallet" style={{ marginRight: "15px" }}>Wallet</Radio>
            <Radio value="card" style={{ marginRight: "15px" }}>Credit/Debit Card</Radio>
            <Radio value="cod" style={{ marginRight: "15px" }}>Cash on Delivery</Radio>
          </Radio.Group>
        </div>
        {/* Wallet Balance */}
        {paymentMethod === "wallet" && decodedToken?.userDetails?.wallet && (
          <p>
            <strong>Current balance: </strong>
            {decodedToken.userDetails.wallet.toFixed(2)} USD
          </p>
        )}

        {/* Stripe Payment Form */}
        {paymentMethod === "card" && (
          <StripeContainer
            amount={price} // The price to charge
            type={"product"} // Or pass any relevant type
            userid={touristId} // User ID for payment processing
            useWallet={paymentMethod === "wallet"} // Indicate if wallet is being used
            id={null}
            setLeave={setLeave} // Pass down state to indicate if payment was processed
            deliveryAddress={selectedAddress}
          />
        )}
      </Modal>
    </div>
  );
};

export default Cart;
