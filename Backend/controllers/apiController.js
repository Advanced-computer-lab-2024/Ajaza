

const axios = require('axios');
const qs = require('qs');
const express = require('express');
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
    const {details, grandTotal, currency} = req.body;
    res.status(200).json({ message:"Flight temporarily booked successfuly, proceed to payment to confirm", grandTotal:grandTotal, currency:currency, details:details });
}

function filterHotelFields(hotel) {
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

async function searchHotels(dest_id = '-553173', checkInDate, checkOutDate , count = 1) {
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
        console.log(filteredHotels);
        return filteredHotels;  // Return the filtered hotels
    } catch (error) {
        console.error("Error fetching hotels:", error);
        throw error;  // Optionally rethrow the error if you want to handle it later
    }
}

exports.searchHotels = async (req,res) => {
    const {dest_id, checkInDate,checkOutDate,count} = req.body;

    if(!dest_id, !checkInDate || !checkOutDate || !count) {
        res.status(500).json({ error:"Missing params" });
    }
    try {
        const returned = searchHotels(checkInDate,checkOutDate,count);
        res.status(200).json(returned);
    } catch(error) {
        res.status(500).json({ error: error.message });
    }
};

exports.bookHotel = async (req,res) => {
    const {details, grandTotal, currency} = req.body;
    res.status(200).json({ message:"Hotel temporarily booked successfuly, proceed to payment to confirm",grandTotal:grandTotal, currency: currency, details:details });
}
