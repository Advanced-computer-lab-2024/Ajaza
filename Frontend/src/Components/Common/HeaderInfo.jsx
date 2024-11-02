import React, { useEffect, useState } from "react";
import { Carousel, Row, Col, Rate, Flex } from "antd";
import { Colors, apiUrl } from "./Constants";
import CustomButton from "./CustomButton";
import axios from "axios";
import {
  ShareAltOutlined,
  HeartOutlined,
  HeartFilled,
} from "@ant-design/icons";
import { jwtDecode } from "jwt-decode";

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
  category,
}) => {
  const [multiplePhotos, setMultiplePhotos] = useState(false);
  const [photosDetailsSpan, setPhotosDetailsSpan] = useState(16);
  const [isBooked, setIsBooked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    // check user
    // get if this item is booked setIsBooked accordingly
    // get if this item is saved: wishlist (if product), bookmarked (if not) setIsSaved
  }, [user]);

  useEffect(() => {
    if (photos?.length > 0) {
      setMultiplePhotos(true);
    }
  }, [photos]);

  const shareItem = () => {
    // i think nenazel drop down fih copy link w email
  };

  // product wishlist

  const updateTokenInLocalStorage = (newToken) => {
    localStorage.setItem("token", newToken);
  };

  const bookItem = async () => {
    try {
      const touristId = userid;
      const endpoint = type === "Activity"
        ? `${apiUrl}/${touristId}/activity/${id}/book`
        : `${apiUrl}/${touristId}/itinerary/${id}/book`;

      const response = await axios.post(endpoint);
      alert(`${type} booked successfully!`);

      if (response.data.token) {
        updateTokenInLocalStorage(response.data.token);
      }
    } catch (error) {
      console.error(`Error booking ${type}:`, error);
      alert(`Error booking ${type}: ${error.message}`);
    }
  };

  const cancelBookingItem = async () => {
    try {
      const touristId = userid;
      const endpoint = type === "Activity"
        ? `${apiUrl}/${touristId}/activity/${id}/cancel`
        : `${apiUrl}/${touristId}/itinerary/${id}/cancel`;

      const response = await axios.delete(endpoint);
      alert(`${type} booking canceled successfully!`);

      if (response.data.token) {
        updateTokenInLocalStorage(response.data.token);
      }
    } catch (error) {
      console.error(`Error canceling ${type} booking:`, error);
      alert(`Failed to cancel the booking. Please try again.`);
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
        style={{ marginBottom: "20px", paddingRight: "30px" }}
      >
        <h1 style={{ textAlign: "left" }}>{name}</h1>
        <Flex
          align="center"
          style={{
            fontSize: "25px",
            textDecoration: "underline",
            color: Colors.grey[700],
          }}
        >
          ${price}
        </Flex>
      </Flex>

      <Row>
        {photos ? (
          multiplePhotos ? (
            <Col span={photosDetailsSpan}>
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
            <Col span={photosDetailsSpan}>
              <Carousel arrows infinite={true}>
                <div>
                  <div style={contentStyle}></div>
                </div>
                <div>
                  <div style={contentStyle}></div>
                </div>
              </Carousel>
            </Col>
          )
        ) : null}

        <Col span={24 - photosDetailsSpan} style={{ padding: "0 20px" }}>
          <Flex justify="space-between" align="center">
            <div>
              <Rate value={3.5} allowHalf disabled />
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
              <ShareAltOutlined
                style={{
                  fontSize: "20px",
                  marginLeft: "20px",
                  marginRight: "20px",
                }}
                onClick={shareItem}
              />

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
                  onClick={bookItem}
                />
              )}
            </Flex>
          </Flex>
          <Flex
            className="scrollModern"
            style={{
              marginTop: "10px",
              justifyContent: "space-between",
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
                      }}
                    >{`#${tag.toUpperCase()}`}</div>
                  );
                })
              : null}
          </Flex>
          {category ? (
            <Flex style={{ marginTop: "10px" }}>
              <h4>Categories</h4>
              todo
            </Flex>
          ) : null}
        </Col>
      </Row>
    </>
  );
};

export default HeaderInfo;
