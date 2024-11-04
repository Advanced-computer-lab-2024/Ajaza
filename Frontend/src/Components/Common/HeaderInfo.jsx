import React, { useEffect, useState } from "react";
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
} from "antd";
import { Colors, apiUrl } from "./Constants";
import CustomButton from "./CustomButton";
import axios from "axios";
import {
  ShareAltOutlined,
  HeartOutlined,
  HeartFilled,
} from "@ant-design/icons";
import { jwtDecode } from "jwt-decode";

import MapView from "./MapView";
import { convertDateToString, camelCaseToNormalText } from "./Constants";
import Timeline from "./Timeline";
import { Dropdown } from "antd";
import { useLocation } from "react-router-dom";
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
  availableDateTime,
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
}) => {
  const [multiplePhotos, setMultiplePhotos] = useState(false);

  const [isBooked, setIsBooked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [priceString, setPriceString] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    // check user
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
        setPriceString(price - (discounts / 100) * price);
      }

      if (priceLower && priceUpper) {
        const priceLowerTemp = priceLower - (discounts / 100) * priceLower;
        const priceUpperTemp = priceUpper - (discounts / 100) * priceUpper;

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

    const shareLink = `${window.locationUrl.origin}/tourist/${type}/${objectId}`;
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
            onChange={(e) => setEmail(e.target.value)}
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
        await new Promise((resolve) => setTimeout(resolve, 50));
        const shareLink = `${window.locationUrl.origin}/tourist/${type}/${objectId}`;
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
        setEmail("");
      },
    });
  };

  const shareItem = () => {
    // i think nenazel drop down fih copy link w email
    //done fo2eha by zeina req50
  };

  // product wishlist

  const updateTokenInLocalStorage = (newToken) => {
    localStorage.setItem("token", newToken);
  };

  const bookItem = async () => {
    try {
      const touristId = userid;
      const useWallet = user.wallet > 0;
      const total = Number(price);
      let FinalDate = selectedDate;
      if (type === "activity") {
        FinalDate = date;
      }
      if (spots <= 0) {
        alert(`Error booking ${type}: No spots available.`);
        return; // Early return if no spots are available
      }
      const endpoint =
        type === "activity"
          ? `${apiUrl}tourist/${touristId}/activity/${id}/book`
          : `${apiUrl}tourist/${touristId}/itinerary/${id}/book`;
      console.log("Booking endpoint:", endpoint);
      console.log(type);

      const response = await axios.post(endpoint, {
        useWallet,
        total,
        date: FinalDate,
        promoCode: promoCode || null,
      });
      console.log(price);
      alert(`${type} booked successfully!`);

      if (response.data.token) {
        updateTokenInLocalStorage(response.data.token);
      }
      setIsBooked(true);
    } catch (error) {
      console.error(`Error booking ${type}:`, error);
      alert(`Error booking ${type}: ${error.message}`);
    }
  };

  const showBookingModal = () => {
    Modal.confirm({
      title: `Confirm Booking for ${name}`,
      content: (
        <div>
          {type === "itinerary" && availableDateTime?.length > 0 && (
            <Select
              placeholder="Select booking date"
              onChange={setSelectedDate}
              style={{ width: "100%", marginBottom: 10 }}
            >
              {availableDateTime.map((slot, index) => (
                <Option key={index} value={slot.date}>
                  {new Date(slot.date).toLocaleString()} - {slot.spots} spots
                  left
                </Option>
              ))}
            </Select>
          )}
          <Input
            placeholder="Enter promo code"
            onChange={(e) => setPromoCode(e.target.value)}
            style={{ marginTop: 10 }}
          />
        </div>
      ),
      onOk: bookItem, // Call bookItem when the user confirms
      onCancel: () => {
        setSelectedDate(null);
        setPromoCode("");
      },
    });
  };

  const cancelBookingItem = async () => {
    try {
      const touristId = userid;
      const endpoint =
        type === "activity"
          ? `${apiUrl}tourist/${touristId}/activity/${id}/cancel`
          : `${apiUrl}tourist/${touristId}/itinerary/${id}/cancel`;

      const response = await axios.delete(endpoint);
      if (response.status === 200) {
        alert(`${type} booking canceled successfully!`);
      } else {
        alert(`Problem: ${response.data.message}`);
      }

      if (response.data.token) {
        updateTokenInLocalStorage(response.data.token);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Please try again.";
      console.error(`Error canceling ${type} booking:`, error);
      alert(`Failed to cancel the booking: ${errorMessage}`);
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
            ${priceString}
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
                ${price}
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
                console.log(timelineItems);

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

              {isBooked ? (
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
                  //onClick={bookItem}
                  onClick={showBookingModal}
                />
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
