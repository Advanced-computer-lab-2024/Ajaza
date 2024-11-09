const axios = require('axios');
const qs = require('qs');
require('dotenv').config();


const clientId = process.env.AMADEUS_API_KEY;
const clientSecret = process.env.AMADEUS_API_SECRET;

async function getAccessToken() {
  try {
    const response = await axios.post('https://test.api.amadeus.com/v1/security/oauth2/token', qs.stringify({
      grant_type: 'client_credentials'
    }), {
      auth: {
        username: clientId,
        password: clientSecret
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    return response.data.access_token;
  } catch (error) {
    console.error('Error generating access token:', error.response ? error.response.data : error.message);
    throw error;
  }
}

// Function to search flights
async function searchFlights(accessToken) {
  try {
    const response = await axios.get('https://test.api.amadeus.com/v2/shopping/flight-offers', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      },
      params: {
        originLocationCode: 'CAI', // Cairo Airport Code
        destinationLocationCode: 'FCO', // Rome Airport Code (you can change to any airport in Italy)
        departureDate: '2024-10-01', // Specify your desired departure date
        adults: 1 // Specify the number of passengers
      }
    });

  } catch (error) {
    console.error('Error searching for flights:', error.response ? error.response.data : error.message);
  }
}

//Function to book flights
async function bookFlight(accessToken, flightOfferId, data) {
    try {
      const response = await axios.post(`https://test.api.amadeus.com/v1/booking/flight-orders`, {
        data: data, // Include passenger details, payment info, etc.
        flightOfferId: flightOfferId // The ID of the flight offer you want to book
      }, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
  
      return response.data; // Return booking confirmation details
    } catch (error) {
      console.error('Error booking flight:', error.response ? error.response.data : error.message);
      throw error;
    }
  }

//Function to search for hotels
async function searchHotels(accessToken, cityCode, checkInDate, checkOutDate) {
    try {
        const response = await axios.get('https://test.api.amadeus.com/v3/shopping/hotel-offers', {
        headers: {
            Authorization: `Bearer ${accessToken}`
        },
        params: {
            hotelIds: "MCLONGHM",
            //hotelIds: ["MCLONGHM"],
            //cityCode: cityCode, // City code for hotel search
            checkInDate: checkInDate, // Check-in date in format YYYY-MM-DD
            checkOutDate: checkOutDate, // Check-out date in format YYYY-MM-DD
            adults: 1 // Number of adults (adjust as needed)
        }
        });

        return response.data; // Return hotel offers
    } catch (error) {
        console.error('Error searching hotels:', error.response ? error.response.data : error.message);
        throw error;
    }
}

//Function to book hotels
async function bookHotel(accessToken, hotelOfferId, data) {
    try {
        const response = await axios.post(`https://test.api.amadeus.com/v1/booking/hotel-orders`, {
        data: data, // Include guest details, payment info, etc.
        hotelOfferId: hotelOfferId // The ID of the hotel offer you want to book
        }, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
        });

        return response.data; // Return booking confirmation details
    } catch (error) {
        console.error('Error booking hotel:', error.response ? error.response.data : error.message);
        throw error;
    }
}
  
  
  

// Main function to get the token and search for flights
async function main() {
    try {
      const accessToken = await getAccessToken();
      
      // Search for flights
      //await searchFlights(accessToken);
      
      // Search for hotels
      await searchHotels(accessToken, 'PAR', '2024-10-01', '2024-10-10');
      
      // Book a flight (provide necessary data)
      //const flightOfferId = 'YOUR_FLIGHT_OFFER_ID'; // Replace with the actual flight offer ID
      //const flightData = {}; // Include necessary passenger and payment info
      //await bookFlight(accessToken, flightOfferId, flightData);
      
      // Book a hotel (provide necessary data)
      //const hotelOfferId = 'YOUR_HOTEL_OFFER_ID'; // Replace with the actual hotel offer ID
      //const hotelData = {}; // Include necessary guest and payment info
      //await bookHotel(accessToken, hotelOfferId, hotelData);
    } catch (error) {
      console.error('Error:', error.message);
    }
  }
  

main();
