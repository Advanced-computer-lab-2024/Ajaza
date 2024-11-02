import React, { Modal, useEffect, useState } from "react";
import { Flex, Row, Col } from "antd";
import Feedbacks from "./Feedbacks";
import Timeline from "./Timeline";
import { camelCaseToNormalText, Colors } from "./Constants";
import HeaderInfo from "./HeaderInfo";
import { jwtDecode } from "jwt-decode";

const Item = ({
  name,
  photos,
  timelineItems,
  setTimeline,
  feedbacks,
  setFeedbacks,
  writeReviewForm,
  onSubmitWriteReview,
  bookItem,
  cancelBookingItem,
  type, // Activity, Venue, Itinerary, Product, etc
  tags,
  price,
  category,
}) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const decodedToken = jwtDecode(token);
    setUser(decodedToken.userDetails);
  }, []);

  return (
    <>
      <HeaderInfo
        name={name}
        photos={photos}
        bookItem={bookItem}
        cancelBookingItem={cancelBookingItem}
        type={type}
        user={user}
        tags={tags}
        price={price}
        category={category}
      />
      {
        <Row justify="center">
          {Object.entries(timelineItems).map(([key, value]) => {
            return (
              <Col span={12} key={key}>
                <h3>{camelCaseToNormalText(key)}</h3>
                <Timeline key={key} timelineItems={value} fieldName={key} />
              </Col>
            );
          })}
        </Row>
      }
      {/* {timelineItems ? <Timeline timelineItems={timelineItems} /> : null} */}
      <Feedbacks
        writeReviewForm={writeReviewForm}
        onSubmitWriteReview={onSubmitWriteReview}
        feedbacks={feedbacks}
        setFeedbacks={setFeedbacks}
      />
    </>
  );
};

export default Item;
