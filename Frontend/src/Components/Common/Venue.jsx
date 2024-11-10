import React, { useEffect, useState } from "react";
import Item from "./Item";
import { Form } from "antd";
import { useParams } from "react-router-dom";
import axios from "axios";
import { apiUrl, calculateYourPriceRet } from "./Constants";
import { jwtDecode } from "jwt-decode";
import LoadingSpinner from "./LoadingSpinner";
import SelectCurrency from "../Tourist/SelectCurrency";
import { useCurrency } from "../Tourist/CurrencyContext";
const Venue = () => {
  const { id } = useParams();
  const [venue, setVenue] = useState(null);
  const [price, setPrice] = useState(null);
  const [user, setUser] = useState(null);
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
    const fetchVenue = async () => {
      try {
        const response = await axios.get(`${apiUrl}venue/${id}`);
        setVenue(response.data);
      } catch (error) {
        console.error("Error fetching itinerary:", error);
      }
    };

    fetchVenue();
  }, [id]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const decodedToken = jwtDecode(token);
    setUser(decodedToken?.userDetails);
  }, []);

  useEffect(() => {
    // set price of venue according to user
    if (user && venue) {
      setPrice(
        calculateYourPriceRet(venue, user?.nationality, user?.occupation)
      );
    }
  }, [user, venue]);

  if (!venue) {
    return <LoadingSpinner />;
  }

  const convertedPrice = venue
    ? (price * currencyRates[currency]).toFixed(2)
    : 0;

  return (
    <>
      <SelectCurrency
        currency={currency}
        onCurrencyChange={handleCurrencyChange}
        style={{ left: 500, top: 45 }}
      />
      <Item
        name={venue?.name}
        photos={venue?.pictures}
        price={convertedPrice}
        tags={venue?.tags}
        location={venue?.location}
        type={"venue"}
        openingHours={venue?.openingHours}
        creatorName={venue?.governorId?.username}
        desc={venue?.desc}
      />
    </>
  );
};

export default Venue;
