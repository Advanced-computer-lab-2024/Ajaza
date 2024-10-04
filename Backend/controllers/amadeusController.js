

const axios = require('axios');
const qs = require('qs');

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
async function searchFlights(accessToken,origin,destination,departureDate,count) {
  try {
    const response = await axios.get('https://test.api.amadeus.com/v2/shopping/flight-offers', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      },
      params: {
        originLocationCode: origin, // Cairo Airport Code
        destinationLocationCode: destination, // Rome Airport Code (you can change to any airport in Italy)
        departureDate: departureDate, // Specify your desired departure date
        adults: count // Specify the number of passengers
      }
    });

    return response.data;

    //console.log('Flight Offers:', response.data);
  } catch (error) {
    //return (error.response ? error.response.data : error.message)
    console.error('Error searching for flights:', error.response ? error.response.data : error.message);
    throw error;
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
  
      console.log('Flight booked successfully:', response.data);
      return response.data; // Return booking confirmation details
    } catch (error) {
      console.error('Error booking flight:', error.response ? error.response.data : error.message);
      throw error;
    }
  }

//Function to search for hotels
async function searchHotels(accessToken, checkInDate, checkOutDate) {
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

        console.log('Hotel Offers:', response.data);
        return response.data; // Return hotel offers
    } catch (error) {
        console.error('Error searching hotels:',error.message);
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

        console.log('Hotel booked successfully:', response.data);
        return response.data; // Return booking confirmation details
    } catch (error) {
        console.error('Error booking hotel:', error.response ? error.response.data : error.message);
        throw error;
    }
}

exports.searchFlights = async (req,res) => {
    const accessToken = getAccessToken();
    const {origin,destination,departureDate,count} = req.body;

    if(!accessToken) {
        res.status(500).json({ error: "error getting access token" });
    }

    if(!origin || !destination || !departureDate || !count) {
        res.status(500).json({ error:"Missing params" });
    }

    try {
        const returned = searchFlights(accessToken,origin,destination,departureDate,count);
        res.status(200).json(returned);
    } catch(error) {
        res.status(500).json({ error: error.message });
    }
};

exports.searchHotels = async (req,res) => {
    const accessToken = getAccessToken();
    const {checkInDate,checkOutDate,count} = req.body;

    if(!accessToken) {
        res.status(500).json({ error: "error getting access token" });
    }

    /*if(!checkInDate || !checkOutDate || !count) {
        res.status(500).json({ error:"Missing params" });
    }*/

    try {
        const returned = searchHotels(accessToken,checkInDate,checkOutDate,count);
        res.status(200).json(returned);
    } catch(error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    searchFlights,
    searchHotels
  };
