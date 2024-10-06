import React, { useEffect, useState } from "react";
import SearchFilterSortContainer from "../Common/SearchFilterSortContainer";
import {
  apiUrl,
  calculateYourPrice,
  getAvgRating,
  getUniqueTags,
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

const structureTags = (tags) => {
  return tags.map((tag) => ({
    displayName: tag,
    filterCriteria: tag.toLowerCase(),
  }));
};

const Venues = () => {
  const [combinedElements, setCombinedElements] = useState([]);

  // propName:fieldName
  const propMapping = {
    title: "name",
    extra: "price",
    rating: "avgRating",
  };
  const fields = {
    Description: "desc",
    Tags: "tags",
  };
  const searchFields = ["name", "tags"];
  const constProps = { rateDisplay: true };
  const sortFields = ["avgRating", "price"];
  const [filterFields, setfilterFields] = useState({
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
        const [venueResponse] = await Promise.all([
          axios.get(`${apiUrl}venue/notHidden`),
          axios.get(`${apiUrl}tag`),
        ]);
        let venues = venueResponse.data;
        venues = venues.map((venue) => {
          return calculateYourPrice(venue, "egypt", "student");
        });

        filterFields.tags = {
          displayName: "Tags",
          values: structureTags(getUniqueTags(venues)),
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

        let combinedArray = venues;

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

export default Venues;
