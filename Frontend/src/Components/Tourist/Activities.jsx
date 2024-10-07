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

const Activities = () => {
  const [combinedElements, setCombinedElements] = useState([]);
  // propName:fieldName
  const propMapping = {
    title: "name",
    extra: "price",
    rating: "avgRating",
    dateTime: "availableDateTime",
  };
  const fields = { Categories: "category", Tags: "tags" };
  const searchFields = ["name"];
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
    avgRating: {
      displayName: "Rating",
      values: [
        { displayName: "1+", filterCriteria: 1 },
        { displayName: "2+", filterCriteria: 2 },
        { displayName: "3+", filterCriteria: 3 },
        { displayName: "4+", filterCriteria: 4 },
        { displayName: "5+", filterCriteria: 5 },
      ],
      compareFn: (filterCriteria, element) => {
        if (!element.avgRating) {
          return false;
        }
        if (element.avgRating >= filterCriteria) {
          return true;
        }
        return false;
      },
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [activityResponse, categoryResponse, tagResponse] =
          await Promise.all([
            axios.get(`${apiUrl}activity/notHidden`),
            axios.get(`${apiUrl}category`),
            axios.get(`${apiUrl}tag`),
          ]);
        let activities = activityResponse.data;
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
          values: [...convertTagsToValues(tags)],
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

        activities = activities.map((activity) => {
          return { ...activity, price: `${activity.lower}-${activity.upper}` };
        });

        let combinedArray = activities;

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

export default Activities;
