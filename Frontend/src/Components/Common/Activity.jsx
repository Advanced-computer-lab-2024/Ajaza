import React, { useEffect, useState } from "react";
import Item from "./Item";
import { Form } from "antd";
import { useParams } from "react-router-dom";
import axios from "axios";
import { apiUrl } from "./Constants";
import LoadingSpinner from "./LoadingSpinner";
import SelectCurrency from "../Tourist/SelectCurrency";
import { useCurrency } from "../Tourist/CurrencyContext";
const Activity = () => {
  const { id } = useParams();
  const [activity, setActivity] = useState(null);
  const [advertiser, setAdvertiser] = useState(null);
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
    const fetchActivity = async () => {
      try {
        const response = await axios.get(`${apiUrl}activity/${id}`);
        setActivity(response.data);
      } catch (error) {
        console.error("Error fetching activity:", error);
      }
    };

    fetchActivity();
  }, [id]);

  useEffect(() => {
    const fetchAdvertiser = async () => {
      try {
        const response = await axios.get(
          `${apiUrl}advertiser/${activity.advertiserId}`
        );
        setAdvertiser(response.data);
      } catch (error) {
        console.error("Error fetching activity:", error);
      }
    };
    if (activity) {
      fetchAdvertiser();
    }
  }, [activity]);
  const [writeReviewForm] = Form.useForm();

  const onSubmitWriteReview = (values) => {
    console.log(values); // Process the review form submission
  };

  if (!activity) {
    return <LoadingSpinner />;
  }

  const convertedLowerPrice = activity
    ? (activity.lower * currencyRates[currency]).toFixed(2)
    : 0;
  const convertedUpperPrice = activity
    ? (activity.upper * currencyRates[currency]).toFixed(2)
    : 0;
  return (
    <>
      <SelectCurrency
        currency={currency}
        onCurrencyChange={handleCurrencyChange}
        style={{ left: 600, top: -15 }}
      />

      <Item
        id={activity?._id}
        name={activity?.name}
        feedbacks={activity?.feedback}
        setFeedback={(newFeedback) =>
          setActivity({ ...activity, feedback: newFeedback })
        }
        tags={activity?.tags || []}
        price={`${convertedLowerPrice} - ${convertedUpperPrice}`}
        priceLower={convertedLowerPrice}
        priceUpper={convertedUpperPrice}
        category={activity?.category}
        location={activity?.location}
        transportation={activity?.transportation}
        date={activity?.date}
        isOpen={activity?.isOpen}
        spots={activity?.spots}
        discounts={activity?.discounts}
        creatorName={advertiser?.username}
        type={"activity"}
        currency={currency}
      />
    </>
  );
};

export default Activity;
