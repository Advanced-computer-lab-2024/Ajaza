import React, { useEffect, useState } from "react";
import Item from "./Item";
import { Form, Spin, Flex } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { useParams } from "react-router-dom";
import axios from "axios";
import { apiUrl, Colors } from "./Constants";
import LoadingSpinner from "./LoadingSpinner";
import SelectCurrency from "../Tourist/SelectCurrency";
import { useCurrency } from "../Tourist/CurrencyContext";

const Itinerary = () => {
  const { id } = useParams();
  const [itinerary, setItinerary] = useState(null);
  const [timelineItems, setTimelineItems] = useState(null);
  const [creatorFeedback, setCreatorFeedback] = useState([]);
  const [writeReviewForm] = Form.useForm();
  const { currency, setCurrency } = useCurrency();

  const handleCurrencyChange = (newCurrency) => {
    setCurrency(newCurrency);
  };
  const [currencyRates] = useState({
    EGP: 48.58,
    USD: 1,
    EUR: 0.91,
  });

  useEffect(() => {
    const fetchItinerary = async () => {
      try {
        const response = await axios.get(`${apiUrl}itinerary/future/${id}`);
        setItinerary(response.data);
      } catch (error) {
        console.error("Error fetching itinerary:", error);
      }
    };

    fetchItinerary();
  }, [id]);

  useEffect(() => {
    if (itinerary) {
      setCreatorFeedback(itinerary?.guideId?.feedback);

      setTimelineItems({
        timeline: itinerary?.timeline,
        availableDateTime: itinerary?.availableDateTime,
      });
      console.log(itinerary?.timeline);
    }
  }, [itinerary]);

  const onSubmitWriteReview = (values) => {
    console.log(values); // Handle review form submission logic here
  };

  // Ensure we handle the state when feedback is added or modified
  const handleFeedbackUpdate = (newFeedback) => {
    setItinerary((prevItinerary) => ({
      ...prevItinerary,
      feedback: newFeedback,
    }));
  };

  // Extract relevant data from the itinerary
  // const availableDates =
  //   itinerary?.availableDateTime?.map((d) => d.date).join(", ") || "";

  if (!itinerary) {
    return <LoadingSpinner />;
  }

  const convertedPrice = itinerary
    ? (itinerary.price * currencyRates[currency]).toFixed(2)
    : 0;

  return (
    <>
      <SelectCurrency
        currency={currency}
        onCurrencyChange={handleCurrencyChange}
        style={{ left: -7, top: 45 }}
      />
      {itinerary && (
        <Item
          id={itinerary._id}
          name={itinerary.name}
          feedbacks={itinerary.feedback}
          setFeedback={handleFeedbackUpdate}
          timelineItems={timelineItems}
          writeReviewForm={writeReviewForm}
          onSubmitWriteReview={onSubmitWriteReview}
          tags={itinerary?.tags}
          price={convertedPrice}
          transportation={{ from: itinerary?.pickUp, to: itinerary?.dropOff }}
          active={itinerary?.active}
          accessibility={itinerary?.accessibility} // Optional: If you want to display accessibility info
          maxTourists={itinerary?.maxTourists} // Optional: If you want to display max tourists
          language={itinerary?.language}
          pickUp={itinerary?.pickUp}
          dropOff={itinerary?.dropOff}
          creatorName={itinerary?.guideId?.username}
          type={"itinerary"}
          availableDates={itinerary.availableDateTime}
          currency={currency}
          creatorFeedback={creatorFeedback}
        />
      )}
    </>
  );
};

export default Itinerary;
