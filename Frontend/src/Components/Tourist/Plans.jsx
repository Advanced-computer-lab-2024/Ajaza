import React, { useEffect, useState } from "react";
import SearchFilterSortContainer from "../Common/SearchFilterSortContainer";
import { apiUrl, calculateYourPrice, getAvgRating } from "../Common/Constants";
import axios from "axios";
import BasicCard from "../Common/BasicCard";

const convertCategoriesToValues = (categoriesArray) => {
  return categoriesArray.map((categoryObj) => {
    return {
      displayName: categoryObj.category,
      filterCriteria: categoryObj.category,
    };
  });
};

const Plans = () => {
  const [combinedElements, setCombinedElements] = useState([]);
  const propMapping = {
    title: "name",
    extra: "price",
    rating: "avgRating",
  };
  const fields = { Categories: "category", Tags: "tags" };
  const searchFields = ["name", "category", "tags"];
  const constProps = { rateDisplay: true };
  const sortFields = ["avgRating", "price"];
  const filterFields = {
    tags: {
      displayName: "Tags",
      values: [
        { displayName: "kayaking", filterCriteria: "kayaking" },
        { displayName: "history", filterCriteria: "history" },
        { displayName: "mountain", filterCriteria: "mountain" },
      ],
      compareFn: (filterCriteria, element) => {
        if (!element.tags) {
          return false;
        }
        // filterCriteria is one of the values that we can filter with
        return element?.tags.includes(filterCriteria);
      },
    },
    price: {
      displayName: "Price",
      values: [
        { displayName: "0-20", filterCriteria: [0, 20] },
        { displayName: "21-60", filterCriteria: [21, 60] },
        { displayName: "61-100", filterCriteria: [61, 100] },
        { displayName: "101+", filterCriteria: [101, 9999999999] },
      ],
      compareFn: (filterCriteria, element) => {
        if (!element.price) {
          return false;
        }
        // filterCriteria is one of the values that we can filter with
        const [num1, num2] = filterCriteria;
        const min = Math.min(num1, num2);
        const max = Math.max(num1, num2);
        if (!Number.isInteger(element["price"])) {
          if (element.upper < max && element.lower > min) {
            return true;
          }
          return false;
        }

        return element?.price >= min && element.price <= max; // inclusive range
      },
    },
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          activityResponse,
          itineraryResponse,
          venueResponse,
          categoryResponse,
        ] = await Promise.all([
          axios.get(`${apiUrl}activity`),
          axios.get(`${apiUrl}itinerary`),
          axios.get(`${apiUrl}venue`),
          axios.get(`${apiUrl}category`),
        ]);
        let activities = activityResponse.data;
        let itineraries = itineraryResponse.data;
        let venues = venueResponse.data;
        let categories = categoryResponse.data;
        filterFields.categories = {
          category: {
            displayName: "Categories",
            values: convertCategoriesToValues(categories),
            compareFn: (filterCriteria, element) => {
              if (!element.category) {
                return false;
              }

              const returnValue = element?.category.includes(filterCriteria);
              // filterCriteria is one of the values that we can filter with
              return returnValue;
            },
          },
        };

        venues = venues.map((venue) => {
          return calculateYourPrice(venue, "egypt", "student");
        });

        activities = activities.map((activity) => {
          return { ...activity, price: `${activity.lower}-${activity.upper}` };
        });

        let combinedArray = [
          ...activities.map((activity) => ({ ...activity, type: "Activity" })),
          ...itineraries.map((itinerary) => ({
            ...itinerary,
            type: "Itinerary",
          })),
          ...venues.map((venue) => ({ ...venue, type: "Venue" })),
        ];

        combinedArray = combinedArray.map((element) => {
          return { ...element, avgRating: getAvgRating(element.feedback) };
        });

        setCombinedElements(combinedArray);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);
  return (
    <SearchFilterSortContainer
      cardComponent={BasicCard}
      elements={combinedElements}
      propMapping={propMapping}
      searchFields={searchFields}
      constProps={constProps}
      fields={fields}
      sortFields={sortFields}
      filterFields={filterFields}
    />
  );
};

export default Plans;

// let activities = [
//   {
//     advertiserId: "60a763e9230f7b002ba19b01", // Example ObjectId
//     name: "City Walking Tour",
//     date: new Date("2024-11-15"),
//     location: "https://goo.gl/maps/xyz123",
//     upper: 30,
//     lower: 10,
//     category: ["Tourism", "Outdoor"],
//     tags: ["walking", "guided tour", "history"],
//     discounts: "10% for groups of 5 or more",
//     isOpen: true,
//     feedback: [
//       {
//         rating: 4,
//         comments: "Great experience, but it was a bit crowded.",
//       },
//       {
//         rating: 5,
//         comments: "The guide was fantastic and very knowledgeable!",
//       },
//     ],
//     spots: 25,
//     hidden: false,
//     transportation: {
//       from: "City Center",
//       to: "Historical District",
//     },
//   },
//   {
//     advertiserId: "60a763e9230f7b002ba19b02",
//     name: "Kayaking Adventure",
//     date: new Date("2024-11-20"),
//     location: "https://goo.gl/maps/abc456",
//     upper: 20,
//     lower: 5,
//     category: ["Water Sports", "Adventure"],
//     tags: ["kayaking", "lake", "fun"],
//     discounts: "5% off for early bookings",
//     isOpen: true,
//     feedback: [
//       {
//         rating: 5,
//         comments: "Amazing adventure! Highly recommend.",
//       },
//     ],
//     spots: 15,
//     hidden: false,
//     transportation: {
//       from: "Lake Entrance",
//       to: "Main Dock",
//     },
//   },
//   {
//     advertiserId: "60a763e9230f7b002ba19b03",
//     name: "Cooking Class: Traditional Cuisine",
//     date: new Date("2024-11-25"),
//     location: "123 Culinary Street, Foodtown",
//     upper: 15,
//     lower: 10,
//     category: ["Cooking", "Cultural"],
//     tags: ["cooking", "food", "culture"],
//     discounts: "None",
//     isOpen: true,
//     feedback: [
//       {
//         rating: 5,
//         comments: "A delicious experience and lots of fun!",
//       },
//       {
//         rating: 4,
//         comments: "Great class, but could have used more time.",
//       },
//     ],
//     spots: 12,
//     hidden: false,
//     transportation: {
//       from: "Central Market",
//       to: "Cooking Studio",
//     },
//   },
//   {
//     advertiserId: "60a763e9230f7b002ba19b04",
//     name: "Mountain Biking Trail",
//     date: new Date("2024-12-01"),
//     location: "https://goo.gl/maps/def789",
//     upper: 10,
//     lower: 8,
//     category: ["Outdoor", "Sports"],
//     tags: ["biking", "mountain", "adventure"],
//     discounts: "20% off for students",
//     isOpen: true,
//     feedback: [
//       {
//         rating: 3,
//         comments: "Challenging trail, but amazing views!",
//       },
//     ],
//     spots: 8,
//     hidden: false,
//     transportation: {
//       from: "Bike Rental Shop",
//       to: "Mountain Trail Start",
//     },
//   },
//   {
//     advertiserId: "60a763e9230f7b002ba19b05",
//     name: "Museum Guided Tour",
//     date: new Date("2024-12-05"),
//     location: "https://goo.gl/maps/ghi101",
//     upper: 50,
//     lower: 50,
//     category: ["Museum", "History"],
//     tags: ["museum", "history", "guided tour"],
//     discounts: "Free for children under 12",
//     isOpen: true,
//     feedback: [
//       {
//         rating: 4,
//         comments: "Informative and well organized.",
//       },
//       {
//         rating: 5,
//         comments: "A wonderful journey through history.",
//       },
//     ],
//     spots: 50,
//     hidden: false,
//     transportation: {
//       from: "City Bus Stop",
//       to: "Museum Entrance",
//     },
//   },
// ];

// const itineraries = [
//   {
//     guideId: "60a763e9230f7b002ba19b06", // Example ObjectId
//     name: "Historical City Tour",
//     timeline: [
//       {
//         start: 9,
//         id: "60a763e9230f7b002ba19b01", // Example Activity or Venue ObjectId
//         type: "Activity",
//         duration: 2,
//       },
//       {
//         start: 11,
//         id: "60a763e9230f7b002ba19b07",
//         type: "Venue",
//         duration: 1,
//       },
//     ],
//     language: "English",
//     price: 50,
//     availableDateTime: [
//       {
//         date: new Date("2024-12-01"),
//         spots: 20,
//       },
//       {
//         date: new Date("2024-12-05"),
//         spots: 15,
//       },
//     ],
//     accessibility: "Wheelchair accessible, audio tour available",
//     pickUp: "Main Bus Station",
//     dropOff: "City Center",
//     active: true,
//     feedback: [
//       {
//         rating: 4,
//         comments: "Great tour, very informative!",
//       },
//       {
//         rating: 5,
//         comments:
//           "The guide was excellent and the itinerary was well planned.",
//       },
//     ],
//     maxTourists: 20,
//     hidden: false,
//   },
//   {
//     guideId: "60a763e9230f7b002ba19b07",
//     name: "Foodie Adventure",
//     timeline: [
//       {
//         start: 10,
//         id: "60a763e9230f7b002ba19b03",
//         type: "Activity",
//         duration: 3,
//       },
//       {
//         start: 14,
//         id: "60a763e9230f7b002ba19b08",
//         type: "Venue",
//         duration: 2,
//       },
//     ],
//     language: "Spanish",
//     price: 75,
//     availableDateTime: [
//       {
//         date: new Date("2024-12-10"),
//         spots: 10,
//       },
//       {
//         date: new Date("2024-12-12"),
//         spots: 12,
//       },
//     ],
//     accessibility: "Audio tour available",
//     pickUp: "Central Market",
//     dropOff: "Gourmet Plaza",
//     active: true,
//     feedback: [
//       {
//         rating: 5,
//         comments: "A wonderful experience for food lovers!",
//       },
//     ],
//     maxTourists: 15,
//     hidden: false,
//   },
//   {
//     guideId: "60a763e9230f7b002ba19b08",
//     name: "Mountain Adventure",
//     timeline: [
//       {
//         start: 8,
//         id: "60a763e9230f7b002ba19b04",
//         type: "Activity",
//         duration: 4,
//       },
//       {
//         start: 14,
//         id: "60a763e9230f7b002ba19b09",
//         type: "Venue",
//         duration: 2,
//       },
//     ],
//     language: "French",
//     price: 100,
//     availableDateTime: [
//       {
//         date: new Date("2024-12-15"),
//         spots: 8,
//       },
//     ],
//     accessibility: "Railings available",
//     pickUp: "Mountain Base Camp",
//     dropOff: "Mountain Lodge",
//     active: true,
//     feedback: [
//       {
//         rating: 4,
//         comments: "Exciting adventure, but a bit exhausting.",
//       },
//       {
//         rating: 5,
//         comments: "Amazing experience! Beautiful views.",
//       },
//     ],
//     maxTourists: 10,
//     hidden: false,
//   },
//   {
//     guideId: "60a763e9230f7b002ba19b09",
//     name: "Cultural Museum Tour",
//     timeline: [
//       {
//         start: 10,
//         id: "60a763e9230f7b002ba19b05",
//         type: "Venue",
//         duration: 3,
//       },
//       {
//         start: 14,
//         id: "60a763e9230f7b002ba19b02",
//         type: "Activity",
//         duration: 2,
//       },
//     ],
//     language: "German",
//     price: 60,
//     availableDateTime: [
//       {
//         date: new Date("2024-12-20"),
//         spots: 20,
//       },
//       {
//         date: new Date("2024-12-25"),
//         spots: 18,
//       },
//     ],
//     accessibility: "Wheelchair accessible",
//     pickUp: "Museum Entrance",
//     dropOff: "City Park",
//     active: true,
//     feedback: [
//       {
//         rating: 5,
//         comments: "Very educational, loved the guide's insights.",
//       },
//     ],
//     maxTourists: 25,
//     hidden: false,
//   },
//   {
//     guideId: "60a763e9230f7b002ba19b10",
//     name: "Evening River Cruise",
//     timeline: [
//       {
//         start: 17,
//         id: "60a763e9230f7b002ba19b11",
//         type: "Activity",
//         duration: 2,
//       },
//       {
//         start: 19,
//         id: "60a763e9230f7b002ba19b12",
//         type: "Venue",
//         duration: 1,
//       },
//     ],
//     language: "English",
//     price: 80,
//     availableDateTime: [
//       {
//         date: new Date("2024-12-22"),
//         spots: 30,
//       },
//     ],
//     accessibility: "Wheelchair accessible, audio tour available",
//     pickUp: "River Dock",
//     dropOff: "Downtown Marina",
//     active: true,
//     feedback: [
//       {
//         rating: 5,
//         comments: "Romantic and peaceful evening on the river.",
//       },
//     ],
//     maxTourists: 30,
//     hidden: false,
//   },
// ];

// let venues = [
//   {
//     governorId: "60a763e9230f7b002ba19b20", // Example ObjectId
//     name: "The Grand Museum",
//     desc: "A large museum showcasing the region's historical artifacts and art.",
//     pictures: ["60a763e9230f7b002ba19b21", "60a763e9230f7b002ba19b22"], // Example Img ObjectIds
//     location: "https://maps.google.com/?q=30.0001,31.0002",
//     openingHours: {
//       suno: 9,
//       sunc: 17,
//       mono: 9,
//       monc: 17,
//       tueo: 9,
//       tuec: 17,
//       wedo: 9,
//       wedc: 17,
//       thuo: 9,
//       thuc: 17,
//       frio: 9,
//       fric: 17,
//       sato: 10,
//       satc: 18,
//     },
//     price: {
//       foreigner: 20,
//       native: 10,
//       student: 5,
//     },
//     tags: ["Museums"],
//     isVisible: true,
//   },
//   {
//     governorId: "60a763e9230f7b002ba19b23",
//     name: "Historic Castle",
//     desc: "A medieval castle with guided tours available.",
//     pictures: ["60a763e9230f7b002ba19b24", "60a763e9230f7b002ba19b25"],
//     location: "https://maps.google.com/?q=30.1001,31.1002",
//     openingHours: {
//       suno: 10,
//       sunc: 18,
//       mono: 10,
//       monc: 18,
//       tueo: 10,
//       tuec: 18,
//       wedo: 10,
//       wedc: 18,
//       thuo: 10,
//       thuc: 18,
//       frio: 10,
//       fric: 18,
//       sato: 10,
//       satc: 18,
//     },
//     price: {
//       foreigner: 25,
//       native: 15,
//       student: 8,
//     },
//     tags: ["Palaces/Castles"],
//     isVisible: true,
//   },
//   {
//     governorId: "60a763e9230f7b002ba19b26",
//     name: "Ancient Monument Park",
//     desc: "A park with several ancient monuments and informative displays.",
//     pictures: ["60a763e9230f7b002ba19b27", "60a763e9230f7b002ba19b28"],
//     location: "https://maps.google.com/?q=30.2001,31.2002",
//     openingHours: {
//       suno: 8,
//       sunc: 20,
//       mono: 8,
//       monc: 20,
//       tueo: 8,
//       tuec: 20,
//       wedo: 8,
//       wedc: 20,
//       thuo: 8,
//       thuc: 20,
//       frio: 8,
//       fric: 20,
//       sato: 8,
//       satc: 20,
//     },
//     price: {
//       foreigner: 15,
//       native: 10,
//       student: 5,
//     },
//     tags: ["Monuments"],
//     isVisible: true,
//   },
//   {
//     governorId: "60a763e9230f7b002ba19b29",
//     name: "Sacred Temple",
//     desc: "A religious site known for its stunning architecture and cultural significance.",
//     pictures: ["60a763e9230f7b002ba19b30", "60a763e9230f7b002ba19b31"],
//     location: "https://maps.google.com/?q=30.3001,31.3002",
//     openingHours: {
//       suno: 7,
//       sunc: 19,
//       mono: 7,
//       monc: 19,
//       tueo: 7,
//       tuec: 19,
//       wedo: 7,
//       wedc: 19,
//       thuo: 7,
//       thuc: 19,
//       frio: 7,
//       fric: 19,
//       sato: 7,
//       satc: 19,
//     },
//     price: {
//       foreigner: 10,
//       native: 5,
//       student: 2,
//     },
//     tags: ["Religious Sites"],
//     isVisible: true,
//   },
//   {
//     governorId: "60a763e9230f7b002ba19b32",
//     name: "Royal Palace Museum",
//     desc: "An old palace converted into a museum displaying royal artifacts.",
//     pictures: ["60a763e9230f7b002ba19b33", "60a763e9230f7b002ba19b34"],
//     location: "https://maps.google.com/?q=30.4001,31.4002",
//     openingHours: {
//       suno: 9,
//       sunc: 17,
//       mono: 9,
//       monc: 17,
//       tueo: 9,
//       tuec: 17,
//       wedo: 9,
//       wedc: 17,
//       thuo: 9,
//       thuc: 17,
//       frio: 9,
//       fric: 17,
//       sato: 9,
//       satc: 17,
//     },
//     price: {
//       foreigner: 30,
//       native: 20,
//       student: 10,
//     },
//     tags: ["Palaces/Castles", "Museums"],
//     isVisible: true,
//   },
// ];
