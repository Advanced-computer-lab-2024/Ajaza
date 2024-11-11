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
} from "@ant-design/icons";
import { jwtDecode } from "jwt-decode";

import MapView from "./MapView";
import { convertDateToString, camelCaseToNormalText } from "./Constants";
import Timeline from "./Timeline";
import { Dropdown } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import "./HeaderInfo.css";

const { Option } = Select;

const token = localStorage.getItem("token");
let decodedToken = null;
if (token) {
  decodedToken = jwtDecode(token);
}
const userid = decodedToken ? decodedToken.userId : null;

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
  timelineItems,
  accessibility,
  avgRating,
  colSpan,
  desc,
  isFlagged,
  handleFlagClick,
  currency,
}) => {
  const [multiplePhotos, setMultiplePhotos] = useState(false);

  const [isBooked, setIsBooked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const selectedDateRef = useRef(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [priceString, setPriceString] = useState("");
  const emailRef = useRef(null);
  const [selectedPrice, setSelectedPrice] = useState(price);
  const selectedPriceRef = useRef(null);
  const [currencySymbol, setCurrencySymbol] = useState(
    currency == "EGP" ? "£" : currency == "EUR" ? "€" : "$"
  );
  const navigate = useNavigate();

  useEffect(() => {
    console.log(currency);
    setCurrencySymbol(currency == "EGP" ? "£" : currency == "EUR" ? "€" : "$");
  }, [currency]);

  useEffect(() => {
    console.log(currencySymbol);
  }, [currencySymbol]);

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
        console.log("isItemBooked:", isItemBooked);
        console.log("iten booked", user.itineraryBookings);
        console.log("user.activityBookings:", user.activityBookings);
        console.log("user:", user);

        setIsBooked(isItemBooked);
      }
    };

    checkIfBooked();
    // get if this item is saved: wishlist (if product), bookmarked (if not) setIsSaved
  }, [id, type, user]);

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

  //req50
  const locationUrl = useLocation();
  const copyLink = () => {
    const pathParts = locationUrl.pathname.split("/");
    const type = pathParts[2];
    const objectId = pathParts[3];

    if (!type || !objectId) {
      message.error("Could not extract details from the URL");
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

        if (!email) {
          message.error("Please enter an email address.");
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
              headers: {
                Authorization: `Bearer ${token}`,
              },
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

  // product wishlist

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
        decodedToken = jwtDecode(newToken);
        // console.log(newToken);
        console.log("new token fetched successfully");
      }
    } catch (error) {
      console.error("Error getting new token:", error);
      message.error("Failed to refresh token. Please try again.");
    }
  };

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
      console.log("here1234", touristId);
      // const useWallet = user.wallet > 0;
      const useWallet = true;
      let total;
      let FinalDate;
      if (type === "activity") {
        total = selectedPriceRef.current;
        FinalDate = date;
      } else if (type === "itinerary") {
        total = price;
        FinalDate = selectedDateRef.current;
      }
      // const total =
      //   type === "activity" ? selectedPriceRef.current : price;
      // const FinalDate = type === "activity" ? date : selectedDateRef.current;
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
      // console.error(`Error booking ${type}:`, error);
      // message.error(`Error booking ${type}: ${error.message}`);
      const errorMessage = error.response?.data?.message || "Please try again.";
      console.error(`Error ${type} booking:`, error);
      message.error(`Error booking: ${errorMessage}`);
    }
  };

  const showBookingModal = () => {
    console.log("here");

    if (!decodedToken) {
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
    let currentSelectedDate;
    let currentprice;

    const discountedPriceLower = priceLower - (discounts / 100) * priceLower;
    const discountedPriceUpper = priceUpper - (discounts / 100) * priceUpper;
    const discountedMiddlePrice =
      (discountedPriceLower + discountedPriceUpper) / 2;

    //const middlePrice = (priceLower + priceUpper) / 2;
    Modal.confirm({
      title: `Confirm Booking for ${name}`,
      content: (
        <div>
          {type === "itinerary" && availableDates?.length > 0 && (
            <Select
              placeholder="Select booking date"
              onChange={(value) => {
                setSelectedDate(value);
                currentSelectedDate = value;
                console.log("Selected Date:", value); // Log the selected value directly
              }}
              style={{ width: "100%", marginBottom: 10 }}
            >
              {availableDates.map((slot, index) => (
                <Option key={index} value={slot.date}>
                  {new Date(slot.date).toLocaleString()} - {slot.spots} spots
                  left
                </Option>
              ))}
            </Select>
          )}
          {type === "activity" && (
            <Select
              placeholder="Select price"
              onChange={(value) => {
                setSelectedPrice(value);
                currentprice = value;
                console.log("Selected Price:", currentprice); // Log the selected price
              }}
              style={{ width: "100%", marginBottom: 10 }}
            >
              <Option
                value={discountedPriceLower}
                style={{ color: "#cd7f32", fontWeight: "bold" }}
              >
                Bronze Tier: {currencySymbol}
                {discountedPriceLower.toFixed(2)}
              </Option>
              {priceUpper !== priceLower && (
                <Option
                  value={discountedMiddlePrice}
                  style={{ color: "#c0c0c0", fontWeight: "bold" }}
                >
                  Silver Tier: {currencySymbol}
                  {discountedMiddlePrice.toFixed(2)}
                </Option>
              )}
              {priceUpper !== priceLower && (
                <Option
                  value={discountedPriceUpper}
                  style={{ color: "#ffd700", fontWeight: "bold" }}
                >
                  Gold Tier: {currencySymbol}
                  {discountedPriceUpper.toFixed(2)}
                </Option>
              )}
            </Select>
          )}

          <Input
            placeholder="Enter promo code"
            onChange={(e) => setPromoCode(e.target.value)}
            style={{ marginTop: 10 }}
          />
        </div>
      ),
      //onOk: bookItem,
      onOk: () => {
        console.log("here:", currentSelectedDate);
        if (!selectedDateRef.current && type === "itinerary") {
          Modal.error({
            title: "Booking Date Required",
            content: "Please select a booking date to proceed.",
          }); // Prevents modal from closing
          return false;
        }

        if (!currentprice && type === "activity") {
          Modal.error({
            title: "Price Selection Required",
            content: "Please select a price to proceed with the booking.",
          });
          return false;
        }

        return bookItem({ date: currentSelectedDate, total: currentprice }); // Calls the booking function if date is selected
      },
      onCancel: () => {
        setSelectedDate(null);
        setPromoCode("");
      },
    });
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

        message.success(`${capital} booking canceled successfully!`);
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

  const save = () => {
    // add to saved items
    console.log("saved");
    // NOTE any action that changes user get user again and set token to new one
    // if successful get user again and set token (if not already returned using the func)
  };

  const unSave = () => {
    // add to unSaved items
    console.log("unsaved");
    // if successful get user again and set token (if not already returned using the func)
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

      <Row>
        {photos ? (
          multiplePhotos ? (
            <Col span={colSpan}>
              <Carousel arrows infinite={true} style={{ marginBottom: "50px" }}>
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
          )
        ) : location && type === "activity" ? (
          // No photo and there is a location

          <Col span={colSpan}>
            <MapView googleMapsLink={location} />
          </Col>
        ) : timelineItems ? (
          <Col span={colSpan} style={{ marginTop: "50px" }}>
            <Row justify="center">
              {Object.entries(timelineItems).map(([key, value]) => {
                return (
                  <Col
                    span={key == "availableDateTime" ? 16 : 8}
                    key={key}
                    className={key}
                  >
                    <h3>{camelCaseToNormalText(key)}</h3>
                    <Timeline key={key} timelineItems={value} fieldName={key} />
                  </Col>
                );
              })}
            </Row>
          </Col>
        ) : null}

        <Col span={24 - colSpan} style={{ padding: "0 20px" }}>
          <Flex justify="space-between" align="center">
            <div>
              <Rate value={avgRating} allowHalf disabled />
            </div>
            <Flex>
              {isSaved ? (
                <HeartFilled
                  style={{
                    fontSize: "20px",
                    color: Colors.warning,
                    marginLeft: "20px",
                  }}
                  onClick={unSave}
                />
              ) : (
                <HeartOutlined style={{ fontSize: "20px" }} onClick={save} />
              )}
              {/* Dropdown for sharing options */}
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
                <ShareAltOutlined
                  style={{
                    fontSize: "20px",
                    marginLeft: "20px",
                    marginRight: "20px",
                    cursor: "pointer",
                  }}
                />
              </Dropdown>
              {(type == "activity" || type == "itinerary") &&
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
                      UnFlag
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
                WebkitLineClamp: 4, // Change this number to set max lines
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
        </Col>
      </Row>
    </>
  );
};

export default HeaderInfo;
