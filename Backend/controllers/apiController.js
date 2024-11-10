const axios = require('axios');
const qs = require('qs');
const express = require('express');
const HotelBooking = require('../models/HotelBooking');
const FlightBooking = require('../models/FlightBooking');
const TransportationBooking = require('../models/TransportationBooking');
const Tourist = require('../models/Tourist');
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
  }
}

async function filterFlightsOutput(data) {
    return data.data.map((offer) => {
      const { price, itineraries } = offer;

      const itinerary = itineraries[0]; 

      const totalDuration = itinerary.duration;

      const departureSegment = itinerary.segments[0];

      const arrivalSegment = itinerary.segments[itinerary.segments.length - 1];

      return {
          price: price.grandTotal,
          currency: price.currency,
          totalDuration,
          departureAirport: departureSegment.departure.iataCode,
          departureTime: departureSegment.departure.at,
          departureTerminal: departureSegment.departure.terminal,
          arrivalAirport: arrivalSegment.arrival.iataCode,
          arrivalTime: arrivalSegment.arrival.at,
          arrivalTerminal: arrivalSegment.arrival.terminal || "N/A",
          carrier: data.dictionaries.carriers[departureSegment.carrierCode],
          flightNumber: departureSegment.number,
          airCraft: data.dictionaries.aircraft[departureSegment.aircraft.code],
          stops: departureSegment.numberOfStops
      };
  });
}

const axiosInstance1 = axios.create({
  timeout: 10000000, //  seconds timeout
});

// Function to search flights
async function searchFlights(accessToken,origin,destination,departureDate,count) {
  console.log("ahmed amrrrrrr",origin,destination,departureDate,count);
  try {
    const response = await axiosInstance1.get('https://test.api.amadeus.com/v2/shopping/flight-offers', {
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

    return filterFlightsOutput(response.data);
  } catch (error) {
    console.error('Error searching for flights:', error.response ? error.response.data : error.message);
    return {};
  }
}

exports.searchFlights = async (req,res) => {
    const accessToken = await getAccessToken();
    const {origin,destination,departureDate,count} = req.body;
    console.log("mariem",req.body);
    if(!accessToken) {
        return res.status(500).json({ error: "error getting access token" });
    }

    if(!origin || !destination || !departureDate || !count) {
        return res.status(500).json({ error:"Missing params" });
    }

    try {
        const returned = await searchFlights(accessToken,origin,destination,departureDate,count);
        return res.status(200).json(returned);
    } catch(error) {
        return res.status(500).json({ error: error.message });
    }
};

exports.bookFlight = async (req,res) => {
    const touristId = req.params.id;
    const { departureAirport, totalDuration, currency, price, departureTime, departureTerminal, arrivalAirport, arrivalTime, arrivalTerminal, carrier, flightNumber, aircraft, stops } = req.body;

    try {
      const tourist = await Tourist.findById(touristId);
      if (!tourist) {
          return res.status(404).json({ error: 'Tourist not found' });
      }

      if(tourist.wallet < price) {
        return res.status(400).json({ error: 'Insufficient funds in wallet' });
      } else {
        tourist.wallet -= price;
        await tourist.save();
      }

        const flightBooking = new FlightBooking({
            touristId,
            departureAirport,
            totalDuration,
            currency,
            price,
            departureTime,
            departureTerminal,
            arrivalAirport,
            arrivalTime,
            arrivalTerminal,
            carrier,
            flightNumber,
            aircraft,
            stops,
        });

        await flightBooking.save();
        res.status(200).json({ message: "Flight booked successfully", flightBooking });
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log(error);
    }
}

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

exports.fetchImagesPlz = async (req,res) => {
  const { hotelName } = req.params;
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
    res.status(200).json(images);
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

function filterHotelFields(hotel) {
    // Extract price from the accessibilityLabel string
  let priceMatch = null;
  let priceMatchb = null;
    if(hotel.accessibilityLabel) {
      priceMatch = hotel.accessibilityLabel.match(/Current price (\d+) USD/);
      priceMatchb = hotel.accessibilityLabel.match(/Current price (\d+)/);
    } else {
      priceMatch = 1500;
      priceMatchb = 1000;
    }

    const price = priceMatch ? priceMatch[1] : (priceMatchb ? priceMatchb[1] : 1000);

    return {
      name: hotel.property?.name ?? "Default name",
      city: hotel.property?.wishlistName ?? "Default city",
      price: price ?? 10000,  // Default price if undefined
      currency: 'USD',  // Ensure this matches the price currency
      checkin: hotel.property?.checkinDate ?? "2021-01-01",
      checkout: hotel.property?.checkoutDate ?? "2021-01-02",
      score: hotel.property?.reviewScore ?? 8.0,
  };
};


//known prague = '-553173'
async function searchHotels(dest_id , checkInDate, checkOutDate , count = 1) {
    try {
        const response = await axiosInstance.get('https://booking-com15.p.rapidapi.com/api/v1/hotels/searchHotels', {
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
        if(response.data.data) {
          const filteredHotels = await Promise.all(response.data.data.hotels.map(filterHotelFields));
          return filteredHotels;  // Return the filtered hotels
        } else {
          return [];
        }
    } catch (error) {
        console.error("Error fetching hotels:", error);
    }
}

exports.searchHotels = async (req,res) => {
    const {dest_id, checkInDate,checkOutDate,count} = req.body;

    if(!dest_id || !checkInDate || !checkOutDate || !count) {
      return res.status(500).json({ error:"Missing params" });
    }
    try {
        const returned = await searchHotels(dest_id, checkInDate,checkOutDate,count);
        if (returned.length === 0) {
          return res.status(404).json({ error: "No hotels found" }); // Use 404 for not found
      }
      return res.status(200).json(returned);
    } catch(error) {
        return res.status(500).json({ error: error.message });
    }
};

exports.bookHotel = async (req,res) => {
  console.log(req.params);
    const touristId  = req.params.id;
    const { hotelName, city, price, currency, checkin, checkout, score } = req.body;

    try {
      console.log("Tourist ID: ", touristId);
      const tourist = await Tourist.findById(touristId);
      if (!tourist) {
          return res.status(404).json({ error: 'Tourist not found' });
      }

      if(tourist.wallet < price) {
        return res.status(400).json({ error: 'Insufficient funds in wallet' });
      } else {
        tourist.wallet -= price;
        await tourist.save();
      }

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

//Transportation

function filterTransferOffer(data) {
  return data.data.map((offer) => {
      const { transferType, start, end, vehicle, quotation } = offer;

      return {
          transferType,
          startLocation: start.locationCode,
          startDateTime: start.dateTime,
          endLocation: {
              address: end.address.line,
              city: end.address.cityName,
              countryCode: end.address.countryCode,
              latitude: end.address.latitude,
              longitude: end.address.longitude,
          },
          distance: distance.value + ' ' + distance.unit,
          vehicle: vehicle.description,
          price: quotation.monetaryAmount + ' ' + quotation.currencyCode,
      };
  });
}

async function searchTransportation(accessToken,requestBody) {
  try {
    const response = await axiosInstance.post('https://test.api.amadeus.com/v1/shopping/transfer-offers', 
      requestBody, 
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    );

    return filterTransferOffer(response.data);
  } catch (error) {
    console.error('Error searching for transportation:', error.response ? error.response.data : error.message);
  }
}

exports.searchTransportation = async (req, res) => {
  try {
    const { IATA, startDateTime, transferType, endGeoCode, passengers } = req.body;

    if (!IATA || !startDateTime || !transferType || !endGeoCode || !passengers) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const passengerCharacteristics = Array.from({ length: passengers }, () => ({
        passengerTypeCode: 'ADT',
        age: 30
    }));

    const requestBody = {
        startLocationCode: IATA,
        startDateTime,
        transferType,
        endGeoCode,
        passengers,
        passengerCharacteristics
    };

    const accessToken = await getAccessToken();

    if(!accessToken) {
        res.status(500).json({ error: "error getting access token" });
    }
    try {
        const returned = await searchTransportation(accessToken,requestBody);
        res.status(200).json(returned);
    } catch(error) {
        res.status(500).json({ error: error.message });
    }

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const flattenTransferData = (data) => {
  return data.data.map(entry => ({
      transferType: entry.transferType,
      start_dateTime: entry.start?.dateTime,
      start_locationCode: entry.start?.locationCode,
      end_dateTime: entry.end?.dateTime,
      end_address_line: entry.end?.address?.line,
      end_address_cityName: entry.end?.address?.cityName,
      vehicle_code: entry.vehicle?.code,
      vehicle_description: entry.vehicle?.description,
      vehicle_seats: entry.vehicle?.seats?.[0]?.count,
      quotation_monetaryAmount: entry.quotation?.monetaryAmount,
      quotation_currencyCode: entry.quotation?.currencyCode,
      distance_value: entry.distance?.value,
      distance_unit: entry.distance?.unit,
  }));
};

//try outs

/*
you can always use
{
    "address": "Avenue Anatole France, 5"
}
{
    "latitude": "48.8053318",
    "longitude": "2.5828656"
}
*/

const getGeolocation = async (address) => {
  try {
      const encodedAddress = encodeURIComponent(address);

      // Use Nominatim's OpenStreetMap API
      const response = await axios.get(`https://nominatim.openstreetmap.org/search?q=${encodedAddress}&format=json&addressdetails=1&limit=1`, {
          headers: {
              'User-Agent': 'Ajaza/1.0 (reservy.me@gmail.com)' // replace with your app details and email
          }
      });
      
      // Check if any results were returned
      if (response.data.length === 0) {
          return null;
      }

      // Extract latitude and longitude from the response
      const location = response.data[0];
      return location.lat + ","+ location.lon;

  } catch (error) {
      console.error("Error fetching geolocation:", error.message);
      return null;
  }
};

exports.testGeoLocation = async (req,res) => {
  const { address } = req.body;

  if (!address) {
      return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
      const location = await getGeolocation(address);
      res.status(200).json(location);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};

exports.searchTransfer7 = async (req,res) => {
  const { IATA, endAddressLine, startDateTime } = req.body;
  console.log(req.body);
  let endCityName;
  let endCountryCode;
  let endGeoCode = await getGeolocation(endAddressLine);
  if(!endGeoCode) {
    return res.status(404).json({ error: "Invalid address line" });
  }
  switch(IATA) {
    case "CDG":
      endCityName = "Paris";
      endCountryCode = "FR";
      break;
    case "JFK":
      endCityName = "New York";
      endCountryCode = "US";
      break;
    case "LON":
      endCityName = "London";
      endCountryCode = "GB";
      break;
    case "DXB":
      endCityName = "Dubai";
      endCountryCode = "AE";
      break;
    case "LAX":
      endCityName = "Los Angeles";
      endCountryCode = "US";
      break;
    default:
      endCityName = "Paris";
      endCountryCode = "FR";
  }


  try {
    const token = await getAccessToken();
    const transferRequestBody = {
      startLocationCode: IATA,
      endAddressLine: endAddressLine,
      endCityName: endCityName,
      endCountryCode: endCountryCode,
      endGeoCode: endGeoCode,
      transferType: "PRIVATE",
      startDateTime: startDateTime,
      passengers: 1,
      passengerCharacteristics: [
        { passengerTypeCode: "ADT", age: 30 }
      ],
      max: 5,
    };
    if(token) {
      const response = await axios.post(
        'https://test.api.amadeus.com/v1/shopping/transfer-offers',
        transferRequestBody,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      )
      if(response.data.data) {
        res.status(200).json(flattenTransferData(response.data));
      } else {
        console.log(response.data);
        res.status(404).json({ error: "No data found" });
      }
     } else {
      res.status(500).json({ error: "Error getting access token" });
     }
  } catch(error) {
    console.log(error.message);
    res.status(500).json({ error: error.message });
  }
}

exports.bookTransfer = async (req,res) => {
  const touristId  = req.params.id;
  const { transferType, start_dateTime, start_locationCode, end_dateTime, end_address_line, end_address_cityName, vehicle_code, vehicle_description, vehicle_seats, quotation_monetaryAmount, quotation_currencyCode, distance_value, distance_unit } = req.body;

  try {
    const tourist = await Tourist.findById(touristId);
    if (!tourist) {
        return res.status(404).json({ error: 'Tourist not found' });
    }

    if(tourist.wallet < quotation_monetaryAmount) {
      return res.status(400).json({ error: 'Insufficient funds in wallet' });
    } else {
      tourist.wallet -= quotation_monetaryAmount;
      await tourist.save();
    }

    const transportationBooking = new TransportationBooking({
      touristId,
      transferType,
      start_dateTime,
      start_locationCode,
      end_dateTime,
      end_address_line,
      end_address_cityName,
      vehicle_code,
      vehicle_description,
      vehicle_seats,
      quotation_monetaryAmount,
      quotation_currencyCode,
      distance_value,
      distance_unit,
    });

    await transportationBooking.save();
    res.status(200).json({message: "Transportation booked successfully", transportationBooking});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAll3rdPartyData = async (req,res) => {
  try {
    const touristId = req.params.id;
    const tourist = await Tourist.findById(touristId);
    if (!tourist) {
        return res.status(404).json({ error: 'Tourist not found' });
    }
    const hotelBookings = await HotelBooking.find({ touristId });
    const flightBookings = await FlightBooking.find({ touristId });
    const transportationBookings = await TransportationBooking.find({ touristId });
    res.status(200).json({ hotelBookings, flightBookings, transportationBookings });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};