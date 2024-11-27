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
