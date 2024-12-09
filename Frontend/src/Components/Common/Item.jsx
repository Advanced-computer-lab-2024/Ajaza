import React, { Modal, useEffect, useState } from "react";
import { Flex, Row, Col } from "antd";
import Feedbacks from "./Feedbacks";
import HeaderInfo from "./HeaderInfo";
import { jwtDecode } from "jwt-decode";
import { getAvgRating } from "./Constants";
import LocationOpeningHours from "./LocationOpeningHours";
import { camelCaseToNormalText } from "./Constants";
import Timeline from "./Timeline";
import FeedbackMini from "./FeedbackMini";

const Item = ({
  id,
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
  priceLower,
  priceUpper,
  category,
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
  openingHours,
  desc,
  availableDates,
  isFlagged,
  handleFlagClick,
  currency,
  creatorFeedback,
  productCurrentQuantity,
}) => {
  const [user, setUser] = useState(null);
  const [avgRating, setAvgRating] = useState(null);
  const [colSpan, setColSpan] = useState(16);

  const timelineFeedbackSpan = 9;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    const decodedToken = jwtDecode(token);
    setUser(decodedToken.userDetails);
  }, []);

  useEffect(() => {
    setAvgRating(getAvgRating(feedbacks));
  }, [feedbacks]);
  // Product fields done
  // Activity fields done
  console.log(creatorFeedback);

  // Itinerary maxTourists
  return (
    <>
      <HeaderInfo
        id={id}
        name={name}
        photos={photos}
        bookItem={bookItem}
        cancelBookingItem={cancelBookingItem}
        type={type}
        user={user}
        tags={tags}
        price={price}
        priceLower={priceLower}
        priceUpper={priceUpper}
        category={category}
        location={location}
        sellerName={sellerName}
        sales={sales}
        quantity={quantity}
        isOpen={isOpen}
        spots={spots}
        date={date}
        creatorName={creatorName}
        discounts={discounts}
        language={language}
        pickUp={pickUp}
        dropOff={dropOff}
        accessibility={accessibility}
        avgRating={avgRating}
        colSpan={colSpan}
        desc={desc}
        availableDates={availableDates}
        isFlagged={isFlagged}
        handleFlagClick={handleFlagClick}
        currency={currency}
        productCurrentQuantity={productCurrentQuantity}
      />

      {type == "venue" ? (
        <LocationOpeningHours
          colSpan={colSpan}
          location={location}
          openingHours={openingHours}
        />
      ) : null}
      {timelineItems && (
        <Row style={{ marginTop: "10px" }}>
          <Col span={timelineFeedbackSpan}>
            <Row justify="center">
              {Object.entries(timelineItems).map(([key, value]) => {
                return (
                  <Col
                    span={key == "availableDateTime" ? 16 : 8}
                    key={key}
                    className={`${key} scrollModern`}
                    style={{
                      maxHeight: "270px",
                      overflowY: "auto",
                      overflowX: "hidden",
                    }}
                  >
                    <h3>{camelCaseToNormalText(key)}</h3>
                    <Timeline key={key} timelineItems={value} fieldName={key} />
                  </Col>
                );
              })}
            </Row>
          </Col>
          <Col span={24 - timelineFeedbackSpan}>
            {creatorFeedback?.length > 0 ? (
              <h3 style={{ marginBottom: "0px" }}>{creatorName} Feedback</h3>
            ) : null}
            <FeedbackMini feedbacks={creatorFeedback} numOfItems={3} />
          </Col>
        </Row>
      )}
      {type == "activity" ? (
        <Row>
          <Col span={colSpan}>
            <FeedbackMini feedbacks={feedbacks} numOfItems={3} />
          </Col>
        </Row>
      ) : null}
      {type != "activity" ? (
        <Feedbacks
          writeReviewForm={writeReviewForm}
          onSubmitWriteReview={onSubmitWriteReview}
          feedbacks={feedbacks}
          setFeedbacks={setFeedbacks}
        />
      ) : null}
      {creatorFeedback?.length > 0 && !timelineItems && type != "activity" ? (
        <div>
          <h4
            style={{
              textAlign: "left",
              marginBottom: "-15px",
              marginTop: "20px",
            }}
          >
            {creatorName} Feedback
          </h4>
          <Feedbacks feedbacks={creatorFeedback} />
        </div>
      ) : null}
    </>
  );
};

export default Item;
