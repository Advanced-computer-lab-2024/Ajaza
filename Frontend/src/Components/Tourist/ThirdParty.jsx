

// import React, { useEffect, useState } from "react";
// import { message , Card} from "antd";
// import axios from "axios";
// import { apiUrl } from "../Common/Constants"; 
// import { jwtDecode } from "jwt-decode";

// const ThirdParty = () => {
//   const [hotels, setHotels] = useState([]);
//   const [flights, setFlights] = useState([]);
//   const [transportations, setTransportations] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [touristId, setTouristId] = useState(null);

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       const decodedToken = jwtDecode(token);
//       const userDetails = decodedToken.userDetails;
//       setTouristId(userDetails._id);
//     }
//   }, []);

//   useEffect(() => {
//     const fetchData = async () => {
//       if (touristId) {
//         try {
//           const response = await axios.get(`${apiUrl}tourist/3rdparty/${touristId}`);
//             setHotels(response.data.hotelBookings);
//             setFlights(response.data.flightBookings);
//             setTransportations(response.data.transportationBookings);
//         } catch (error) {
//           message.error(error.response?.data?.message);
//         } finally {
//           setLoading(false);
//         }
//       }
//     };

//     fetchData();
//   }, [touristId]);

//   return (
//     <div>
//     <div>
//       {loading ? (
//         <p>Loading flights bookings...</p>
//       ) : (flights.length > 0) ? (
//         <div>
//         <h2>Flights Bookings</h2><hr />
//         <div
//           style={{
//             display: "flex",
//             flexWrap: "wrap",       
//             gap: "16px",             
//             justifyContent: "flex-start" 
//           }}
//         >
//           {flights && flights.map((flight) => (
//             <div>
//             <Card
//               key={flight._id}
//               title={flight.arrivalAirport}
//               bordered={false} 
//               style={{
//                 width: "100%",
//                 maxWidth: "300px",     
//                 marginBottom: "16px",  
//                 boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
//                 borderRadius: "8px",
//                 padding: "16px"
//               }}
//             >
//                 <p><strong>Departure Airport:</strong> {flight.departureAirport}</p>
//                 <p><strong>Carrier:</strong> {flight.carrier}</p>
//                 <p><strong>Flight Number:</strong> {flight.flightNumber}</p>
//                 <p><strong>Price:</strong> {flight.price + flight.currency}</p>
//                 <p><strong>Departure Time:</strong> {new Date(flight.departureTime).toISOString().slice(0, 16).replace("T", " ")}</p>
//                 <p><strong>Arrival Time:</strong> {new Date(flight.arrivalTime).toISOString().slice(0, 16).replace("T", " ")}</p>
//                 <p><strong>Stops:</strong> {flight.stops}</p>
//             </Card>
//             </div>
//           ))}
//         </div>
//         </div>
//       ) : (<br />)}
//     </div>
//     <div>
//       {loading ? (
//         <p>Loading hotels bookings...</p>
//       ) : (hotels && hotels.length > 0) ? (
//         <div>
//         <h2>Hotel Bookings</h2><hr />
//         <div
//           style={{
//             display: "flex",
//             flexWrap: "wrap",       
//             gap: "16px",             
//             justifyContent: "flex-start" 
//           }}
//         >
//           {hotels.map((hotel) => (
//             <div>
//             <Card
//               key={hotel._id}
//               title={hotel.city}
//               bordered={false} 
//               style={{
//                 width: "100%",
//                 maxWidth: "300px",     
//                 marginBottom: "16px",  
//                 boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
//                 borderRadius: "8px",
//                 padding: "16px"
//               }}
//             >
//                 <p><strong>Hotel:</strong> {hotel.hotelName}</p>
//                 <p><strong>Price:</strong> {hotel.price + " " + hotel.currency}</p>
//                 <p><strong>Checkin:</strong> {new Date(hotel.checkin).toISOString().slice(0, 10)}</p>
//                 <p><strong>Checkout:</strong> {new Date(hotel.checkout).toISOString().slice(0, 10)}</p>
//                 <p><strong>Score:</strong> {hotel.score}</p>
//             </Card>
//             </div>
//           ))}
//         </div>
//         </div>
//       ) : (<br />)}
//     </div>
//     <div>
//       {loading ? (
//         <p>Loading transportation bookings...</p>
//       ) : (transportations && transportations.length > 0) ? (
//         <div>
//         <h2>Transportation Bookings</h2><hr />
//         <div
//           style={{
//             display: "flex",
//             flexWrap: "wrap",       
//             gap: "16px",             
//             justifyContent: "flex-start" 
//           }}
//         >

//           {transportations.map((transportation) => (
//             <div>
//             <Card
//               key={transportation._id}
//               title={"to " + transportation.end_address_line}
//               bordered={false} 
//               style={{
//                 width: "100%",
//                 maxWidth: "300px",     
//                 marginBottom: "16px",  
//                 boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
//                 borderRadius: "8px",
//                 padding: "16px"
//               }}
//             >
//               <div style={{ fontSize: "14px", color: "gray", marginBottom: "10px" }}>
//               <strong>Price:</strong> {transportation.quotation_monetaryAmount + " " + transportation.quotation_currencyCode}
//               </div>
//                 <p><strong>From:</strong> {transportation.start_locationCode + ", " + transportation.end_address_cityName}</p>
//                 <p><strong>Vehicle Description:</strong> {transportation.vehicle_description +", "+transportation.vehicle_code}</p>
//                 <p><strong>Pickup Time:</strong> {new Date(transportation.start_dateTime).toISOString().slice(0, 16).replace("T", " ")}</p>
//                 <p><strong>Estimated Arrival Time:</strong> {new Date(transportation.end_dateTime).toISOString().slice(0, 16).replace("T", " ")}</p>
//                 <p><strong>Transfer Type:</strong> {transportation.transferType}</p>
//                 <p><strong>Maximum Passengers:</strong> {transportation.vehicle_seats}</p>
//                 <p><strong>Distance:</strong> {transportation.distance_value + " " +transportation.distance_unit}</p>
//             </Card>
//             </div>
//           ))}
//         </div>
//         </div>
//       ) : (<br />)}
//         </div>
//         </div>
//   );
//   };
// export default ThirdParty;  

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
    EGP: 48.58,
    USD: 1,
    EUR: 0.91,
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
                    <strong>Price:</strong> {convertPrice(transportation.quotation_monetaryAmount, transportation.quotation_currencyCode)} {currency}
                  </div>
                  <p><strong>From:</strong> {transportation.start_locationCode + ", " + transportation.end_address_cityName}</p>
                  <p><strong>Vehicle Description:</strong> {transportation.vehicle_description + ", " + transportation.vehicle_code}</p>
                  <p><strong>Pickup Time:</strong> {new Date(transportation.start_dateTime).toISOString().slice(0, 16).replace("T", " ")}</p>
                  <p><strong>Estimated Arrival Time:</strong> {new Date(transportation.end_dateTime).toISOString().slice(0, 16).replace("T", " ")}</p>
                  <p><strong>Transfer Type:</strong> {transportation.transferType}</p>
                  <p><strong>Maximum Passengers:</strong> {transportation.vehicle_seats}</p>
                  <p><strong>Distance:</strong> {transportation.distance_value + " " + transportation.distance_unit}</p>
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
