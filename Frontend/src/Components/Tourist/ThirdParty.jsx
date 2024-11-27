import React, { useEffect, useState } from "react";
import { message, Card } from "antd";
import axios from "axios";
import { apiUrl } from "../Common/Constants"; 
import {jwtDecode} from "jwt-decode";
import SelectCurrency from "./SelectCurrency"; 
import { useCurrency } from "./CurrencyContext";

const ThirdParty = () => {
  const [hotels, setHotels] = useState([]);
  const [flights, setFlights] = useState([]);
  const [transportations, setTransportations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [touristId, setTouristId] = useState(null);
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
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwtDecode(token);
      const userDetails = decodedToken.userDetails;
      setTouristId(userDetails._id);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (touristId) {
        try {
          const response = await axios.get(`${apiUrl}tourist/3rdparty/${touristId}`);
          setHotels(response.data.hotelBookings);
          setFlights(response.data.flightBookings);
          setTransportations(response.data.transportationBookings);
          if(response.data.hotelBookings.length === 0 && response.data.flightBookings.length === 0 && response.data.transportationBookings.length === 0) {
            message.info("No services bookings yet.");
          }
        } catch (error) {
          message.error(error.response?.data?.message);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [touristId]);



  const convertPrice = (price, priceCurrency) => {
    const basePrice = price / currencyRates[priceCurrency];
    return (basePrice * currencyRates[currency]).toFixed(2);
  };

  return (
    <div>
    
      <div style={{ marginBottom: "20px" }}>
        <SelectCurrency currency={currency} onCurrencyChange={handleCurrencyChange} style={{left:170 , top: 57}}/>
      </div>

      <div>
        {loading ? (
          <p>Loading flights bookings...</p>
        ) : (flights.length > 0) ? (
          <div>
            <h2>Flights Bookings</h2><hr />
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "16px",
                justifyContent: "flex-start"
              }}
            >
              {flights.map((flight) => (
                <Card
                  key={flight._id}
                  title={flight.arrivalAirport}
                  bordered={false}
                  style={{
                    width: "100%",
                    maxWidth: "300px",
                    marginBottom: "16px",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                    borderRadius: "8px",
                    padding: "16px"
                  }}
                >
                  <p><strong>Departure Airport:</strong> {flight.departureAirport}</p>
                  <p><strong>Carrier:</strong> {flight.carrier}</p>
                  <p><strong>Flight Number:</strong> {flight.flightNumber}</p>
                  <p><strong>Price:</strong> {convertPrice(flight.price, flight.currency)} {currency}</p>
                  <p><strong>Departure Time:</strong> {new Date(flight.departureTime).toISOString().slice(0, 16).replace("T", " ")}</p>
                  <p><strong>Arrival Time:</strong> {new Date(flight.arrivalTime).toISOString().slice(0, 16).replace("T", " ")}</p>
                  <p><strong>Stops:</strong> {flight.stops}</p>
                </Card>
              ))}
            </div>
          </div>
        ) : (<br />)}
      </div>

     
      <div>
        {loading ? (
          <p>Loading hotels bookings...</p>
        ) : (hotels.length > 0) ? (
          <div>
            <h2>Hotel Bookings</h2><hr />
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "16px",
                justifyContent: "flex-start"
              }}
            >
              {hotels.map((hotel) => (
                <Card
                  key={hotel._id}
                  title={hotel.city}
                  bordered={false}
                  style={{
                    width: "100%",
                    maxWidth: "300px",
                    marginBottom: "16px",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                    borderRadius: "8px",
                    padding: "16px"
                  }}
                >
                  <p><strong>Hotel:</strong> {hotel.hotelName}</p>
                  <p><strong>Price:</strong> {convertPrice(hotel.price, hotel.currency)} {currency}</p>
                  <p><strong>Checkin:</strong> {new Date(hotel.checkin).toISOString().slice(0, 10)}</p>
                  <p><strong>Checkout:</strong> {new Date(hotel.checkout).toISOString().slice(0, 10)}</p>
                  <p><strong>Score:</strong> {hotel.score}</p>
                </Card>
              ))}
            </div>
          </div>
        ) : (<br />)}
      </div>

      <div>
        {loading ? (
          <p>Loading transportation bookings...</p>
        ) : (transportations.length > 0) ? (
          <div>
            <h2>Transportation Bookings</h2><hr />
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "16px",
                justifyContent: "flex-start"
              }}
            >
              {transportations.map((transportation) => (
                <Card
                  key={transportation._id}
                  title={"to " + transportation.end_address_line}
                  bordered={false}
                  style={{
                    width: "100%",
                    maxWidth: "300px",
                    marginBottom: "16px",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                    borderRadius: "8px",
                    padding: "16px"
                  }}
                >
                  <div style={{ fontSize: "14px", color: "gray", marginBottom: "10px" }}>
                    <strong>Price:</strong> {((transportation.quotation_monetaryAmount)?(convertPrice(transportation.quotation_monetaryAmount, transportation.quotation_currencyCode)):"NA")} {currency}
                  </div>
                  <p><strong>From:</strong> {transportation.start_locationCode + ", " + transportation.end_address_cityName}</p>
                  <p><strong>Vehicle Description:</strong> {transportation.vehicle_description + ", " + transportation.vehicle_code}</p>
                  <p><strong>Pickup Time:</strong> {new Date(transportation.start_dateTime).toISOString().slice(0, 16).replace("T", " ")}</p>
                  <p><strong>Estimated Arrival Time:</strong> {new Date(transportation.end_dateTime).toISOString().slice(0, 16).replace("T", " ")}</p>
                  <p><strong>Transfer Type:</strong> {transportation.transferType}</p>
                  <p><strong>Maximum Passengers:</strong> {transportation.vehicle_seats}</p>
                  <p><strong>Distance:</strong> {((transportation.distance_value)?transportation.distance_value+ " " + transportation.distance_unit:"NA")}</p>
                </Card>
              ))}
            </div>
          </div>
        ) : (<br />)}
      </div>
    </div>
  );
};

export default ThirdParty;
