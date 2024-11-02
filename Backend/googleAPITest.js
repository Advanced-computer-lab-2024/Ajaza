const axios = require('axios');
const qs = require('qs');
const express = require('express');
require('dotenv').config();

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const CX = process.env.CX;

async function main() {
    try {
        const response = await axios.get('https://www.googleapis.com/customsearch/v1', {
        params: {
          key: GOOGLE_API_KEY,
          cx: CX,
          q: "cat",
          searchType: 'image',
          num: 3,
        },
      });
  
      const images = response.data.items.map(item => item.link);
      console.log(images);
      return images;
    }
    catch (error) {
      console.error('Error fetching images:', error);
      return null;
    }
}

main().catch((e) => console.log(e));
