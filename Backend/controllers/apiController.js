

const axios = require('axios');
const qs = require('qs');
const express = require('express');
const HotelBooking = require('../models/HotelBooking');
const FlightBooking = require('../models/FlightBooking');
require('dotenv').config();

const clientId = process.env.AMADEUS_API_KEY;
const clientSecret = process.env.AMADEUS_API_SECRET;
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const CX = process.env.CX;

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

exports.bookFlight = async (req,res) => {
    const { touristId } = req.params;
    const { origin, destination, departureDate, count } = req.body;

    try {
        const flightBooking = new FlightBooking({
            touristId,
            origin,
            destination,
            departureDate,
            count,
        });

        await flightBooking.save();
        res.status(200).json(flightBooking);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

/*search engine id 
<script async src="https://cse.google.com/cse.js?cx=13d3f24ae48c74537">
</script>
<div class="gcse-search"></div>

service account id
ajaza-577@friendly-hangar-437717-q8.iam.gserviceaccount.com
*/

const axiosInstance = axios.create({
  timeout: 10000000, //  seconds timeout
});

exports.getHotelDetails = async (req,res) => {
  try {
    const { hotelName, checkin, checkout, count, dest_id, city, currency, score } = req.body;
    const images = await fetchImages(hotelName);
    res.status(200).json({images, hotelName, checkin, checkout, count, dest_id, city, currency, score});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}


async function fetchImages(hotelName) {
    try {
      const response = await axiosInstance.get('https://www.googleapis.com/customsearch/v1', {
      params: {
        key: GOOGLE_API_KEY,
        cx: CX,
        q: hotelName + " rooms",
        searchType: 'image',
        num: 10,
      },
    });

    const images = response.data.items.map(item => item.link);
    console.log(images);
    return images;
  }
  catch (error) {
    if (error.code === 'ECONNABORTED') {
        console.error("Request timed out");
    } else {
        console.error('Error fetching images:', error);
    }
    return null
  }
}

async function filterHotelFields(hotel) {
    // Extract price from the accessibilityLabel string
    const priceMatch = hotel.accessibilityLabel.match(/Current price (\d+) USD/);
    const priceMatchb = hotel.accessibilityLabel.match(/Current price (\d+)/);

    const price = priceMatch ? priceMatch[1] : (priceMatchb ? priceMatchb[1] : 1000);

    return {
        name: hotel.property.name,
        city: hotel.property.wishlistName,
        price: price,
        currency: 'USD',  // Ensure this matches the price currency
        checkin: hotel.property.checkinDate,
        checkout: hotel.property.checkoutDate,
        score: hotel.property.reviewScore,
    };
};


//known prague = '-553173'
async function searchHotels(dest_id , checkInDate, checkOutDate , count = 1) {
    try {
        const response = await axios.get('https://booking-com15.p.rapidapi.com/api/v1/hotels/searchHotels', {
            headers: {
                'X-RapidAPI-Key': process.env.RAPID_API_KEY,
                'X-RapidAPI-Host': 'booking-com15.p.rapidapi.com',
            },
            params: {
                search_type: 'CITY',
                arrival_date: checkInDate,
                departure_date: checkOutDate,
                dest_id: dest_id,
                dest_type: 'city',
                adults_number: count,
                locale: 'en-gb',
                order_by: 'price',
                units: 'metric',
            },
        });

        const filteredHotels = response.data.data.hotels.map(filterHotelFields);
        return filteredHotels;  // Return the filtered hotels
    } catch (error) {
        console.error("Error fetching hotels:", error);
    }
}

exports.searchHotels = async (req,res) => {
    const {dest_id, checkInDate,checkOutDate,count} = req.body;

    if(!dest_id, !checkInDate || !checkOutDate || !count) {
        res.status(500).json({ error:"Missing params" });
    }
    try {
        const returned = await searchHotels(dest_id, checkInDate,checkOutDate,count);
        console.log(returned);
        res.status(200).json(returned);
    } catch(error) {
        res.status(500).json({ error: error.message });
    }
};

exports.bookHotel = async (req,res) => {
    const { touristId } = req.params;
    const { hotelName, city, price, currency, checkin, checkout, score } = req.body;

    try {
        const hotelBooking = new HotelBooking({
            touristId,
            hotelName,
            city,
            price,
            currency,
            checkin,
            checkout,
            score,
        });

        await hotelBooking.save();
        res.status(200).json(hotelBooking);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
