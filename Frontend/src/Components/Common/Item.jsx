import React, { Modal, useEffect, useState } from "react";
import { Flex, Row, Col } from "antd";
import Feedbacks from "./Feedbacks";
import HeaderInfo from "./HeaderInfo";
import { jwtDecode } from "jwt-decode";
import { getAvgRating } from "./Constants";
import LocationOpeningHours from "./LocationOpeningHours";

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
}) => {
  const [user, setUser] = useState(null);
  const [avgRating, setAvgRating] = useState(null);
  const [colSpan, setColSpan] = useState(16);

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
        timelineItems={timelineItems}
        accessibility={accessibility}
        avgRating={avgRating}
        colSpan={colSpan}
        desc={desc}
        availableDates={availableDates}
        isFlagged={isFlagged}
        handleFlagClick={handleFlagClick}
        currency={currency}
      />

      {type == "venue" ? (
        <LocationOpeningHours
          colSpan={colSpan}
          location={location}
          openingHours={openingHours}
        />
      ) : null}
      <Feedbacks
        writeReviewForm={writeReviewForm}
        onSubmitWriteReview={onSubmitWriteReview}
        feedbacks={feedbacks}
        setFeedbacks={setFeedbacks}
      />
      {creatorFeedback ? (
        <div>
          <h4
            style={{
              textAlign: "left",
              marginBottom: "-15px",
              marginTop: "30px",
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
