

import React, { useEffect, useState } from "react";
import { message , Card} from "antd";
import axios from "axios";
import { apiUrl } from "../Common/Constants"; 
import { jwtDecode } from "jwt-decode";

const ThirdParty = () => {
  const [hotels, setHotels] = useState([]);
  const [flights, setFlights] = useState([]);
  const [transportations, setTransportations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [touristId, setTouristId] = useState(null);

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

  return (
    <div>
    <div>
      {loading ? (
        <p>Loading flights bookings...</p>
      ) : (flights.length > 0) ? (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",       
            gap: "16px",             
            justifyContent: "flex-start" 
          }}
        >
          {flights && flights.map((flight) => (
            <div>
            <h2>Flights Bookings</h2><hr />
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
                <p><strong>Price:</strong> {flight.price + flight.currency}</p>
                <p><strong>Departure Time:</strong> {flight.departureTime}</p>
                <p><strong>Arrival Time:</strong> {flight.arrivalTime}</p>
                <p><strong>Stops:</strong> {flight.stops}</p>
            </Card>
            </div>
          ))}
        </div>
      ) : (<br />)}
    </div>
    <div>
      {loading ? (
        <p>Loading hotels bookings...</p>
      ) : (hotels && hotels.length > 0) ? (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",       
            gap: "16px",             
            justifyContent: "flex-start" 
          }}
        >
          {hotels.map((hotel) => (
            <div>
            <h2>Hotel Bookings</h2><hr />
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
                <p><strong>City:</strong> {hotel.hotelName}</p>
                <p><strong>Price:</strong> {hotel.price + " " + hotel.currency}</p>
                <p><strong>Checkin:</strong> {(hotel.checkin).slice(0, -14)}</p>
                <p><strong>Checkout:</strong> {(hotel.checkout).slice(0, -14)}</p>
                <p><strong>Score:</strong> {hotel.score}</p>
            </Card>
            </div>
          ))}
        </div>
      ) : (<br />)}
    </div>
    <div>
      {loading ? (
        <p>Loading transportation bookings...</p>
      ) : (transportations && transportations.length > 0) ? (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",       
            gap: "16px",             
            justifyContent: "flex-start" 
          }}
        >
          {transportations.map((transportation) => (
            <div>
            <h2>Transportation Bookings</h2><hr />
            <Card
              key={transportation._id}
              title={transportation.end_address_line}
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

                <p><strong>Transfer Type:</strong> {transportation.transferType}</p>
                <p><strong>Start Date Time:</strong> {transportation.start_dateTime.slice(0, -14)}</p>
                <p><strong>Start Location Code:</strong> {transportation.start_locationCode}</p>
                <p><strong>End Date Time:</strong> {transportation.end_dateTime.slice(0, -14)}</p>
                <p><strong>End Address Line:</strong> {transportation.end_address_line}</p>
                <p><strong>End Address City Name:</strong> {transportation.end_address_cityName}</p>
                <p><strong>Vehicle Code:</strong> {transportation.vehicle_code}</p>
                <p><strong>Vehicle Description:</strong> {transportation.vehicle_description}</p>
                <p><strong>Vehicle Seats:</strong> {transportation.vehicle_seats}</p>
                <p><strong>Price:</strong> {transportation.quotation_monetaryAmount + " " + transportation.quotation_currencyCode}</p>
                <p><strong>Distance:</strong> {transportation.distance_value + " " +transportation.distance_unit}</p>
            </Card>
            </div>
          ))}
        </div>
      ) : (<br />)}
        </div>
        </div>
  );
  };
export default ThirdParty;  