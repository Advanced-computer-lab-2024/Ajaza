const axios = require('axios');
const qs = require('qs');
const express = require('express');
require('dotenv').config();

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const CX = process.env.CX;

async function main() {
    try {
      const response = await axios.get('https://booking-com15.p.rapidapi.com/api/v1/hotels/searchDestination', {
        headers: {
            'X-RapidAPI-Key': process.env.RAPID_API_KEY,
            'X-RapidAPI-Host': 'booking-com15.p.rapidapi.com',
        },
        params: {
            query: 'Munich',
        },
      });

      console.log(response.data);

      return response.data;

    }
    catch (error) {
      console.error('Error fetching images:', error);
      return null;
    }
}

main().catch((e) => console.log(e));
