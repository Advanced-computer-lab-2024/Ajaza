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
    if (!token) return;
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
      {/* <SelectCurrency
        currency={currency}
        onCurrencyChange={handleCurrencyChange}
        style={{ left: -7, top: 45 }}
      /> */}
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
        currency={currency}
      />
    </>
  );
};

export default Venue;
