import React, { useEffect, useState } from "react";
import SearchFilterSortContainer from "../Common/SearchFilterSortContainer";
import {
  apiUrl,
  calculateYourPrice,
  getAvgRating,
  comparePriceRange,
} from "../Common/Constants";
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

const convertTagsToValues = (tagsArray) => {
  return tagsArray.map((tagObj) => {
    return {
      displayName: tagObj.tag,
      filterCriteria: tagObj.tag,
    };
  });
};

const Plans = () => {
  const [combinedElements, setCombinedElements] = useState([]);
  const propMapping = {
    title: "name",
    extra: "price",
    rating: "avgRating",
    photo: "photo",
  };
  const fields = { Categories: "category", Tags: "tags", Type: "type" };
  const searchFields = ["name", "category", "tags"];
  const constProps = { rateDisplay: true };
  const sortFields = ["avgRating", "price"];
  const [filterFields, setfilterFields] = useState({
    tags: {
      displayName: "Tags",
      values: [
        { displayName: "Kayaking", filterCriteria: "kayaking" },
        { displayName: "History", filterCriteria: "history" },
        { displayName: "Mountain", filterCriteria: "mountain" },
      ],
      compareFn: (filterCriteria, element) => {
        if (!element.tags) {
          return false;
        }
        // Convert filterCriteria to lowercase
        const lowerFilterCriteria = filterCriteria.toLowerCase();
        // Check if any of the tags (converted to lowercase) match the filterCriteria
        return element.tags.some(
          (tag) => tag.toLowerCase() === lowerFilterCriteria
        );
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
      compareFn: (filterCriteria, element) =>
        comparePriceRange(filterCriteria, element),
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          activityResponse,
          itineraryResponse,
          venueResponse,
          categoryResponse,
          tagResponse,
        ] = await Promise.all([
          axios.get(`${apiUrl}activity/notHidden`),
          axios.get(`${apiUrl}itinerary/notHidden`),
          axios.get(`${apiUrl}venue/notHidden`),
          axios.get(`${apiUrl}category`),
          axios.get(`${apiUrl}tag`),
        ]);
        let activities = activityResponse.data;
        let itineraries = itineraryResponse.data;
        let venues = venueResponse.data;
        let categories = categoryResponse.data;
        let tags = tagResponse.data;

        filterFields.category = {
          displayName: "Categories",
          values: convertCategoriesToValues(categories),
          compareFn: (filterCriteria, element) => {
            if (!element.category) {
              return false;
            }
            const lowerFilterCriteria = filterCriteria.toLowerCase();
            // Check if any of the tags (converted to lowercase) match the filterCriteria
            return element?.category.some(
              (tag) => tag.toLowerCase() === lowerFilterCriteria
            );
          },
        };

        filterFields.tags = {
          displayName: "Tags",
          values: [
            ...convertTagsToValues(tags),
            { displayName: "Monuments", filterCriteria: "Monuments" },
            { displayName: "Museums", filterCriteria: "Museums" },
            {
              displayName: "Religious Sites",
              filterCriteria: "Religious Sites",
            },
            {
              displayName: "Palaces/Castles",
              filterCriteria: "Palaces/Castles",
            },
            { displayName: "1800s-1850s", filterCriteria: "1800s-1850s" },
            { displayName: "1850s-1900s", filterCriteria: "1850s-1900s" },
            { displayName: "1900s-1950s", filterCriteria: "1900s-1950s" },
            { displayName: "1950s-2000s", filterCriteria: "1950s-2000s" },
          ],
          compareFn: (filterCriteria, element) => {
            if (!element.tags) {
              return false;
            }
            // Convert filterCriteria to lowercase
            const lowerFilterCriteria = filterCriteria.toLowerCase();
            // Check if any of the tags (converted to lowercase) match the filterCriteria
            return element?.tags.some(
              (tag) => tag.toLowerCase() === lowerFilterCriteria
            );
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
