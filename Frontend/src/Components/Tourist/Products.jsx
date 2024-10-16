import React, { useEffect, useState } from "react";
import SearchFilterSortContainer from "../Common/SearchFilterSortContainer";
import {
  apiUrl,
  calculateYourPrice,
  comparePriceRange,
  getAvgRating,
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

const Products = () => {
  const [combinedElements, setCombinedElements] = useState([]);
  const propMapping = {
    title: "name",
    extra: "price",
    rating: "avgRating",
    photo: "photo",
  };
  const fields = {
    Description: "desc",
    Seller: "sellerName",
    "Quantity Available": "quantity",
  };
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
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productResponse] = await Promise.all([
          axios.get(`${apiUrl}product`),
        ]);
        let products = productResponse.data;

        let combinedArray = products;

        combinedArray = combinedArray.map((element) => {
          return { ...element, avgRating: getAvgRating(element.feedback) };
        });

        console.log(combinedArray);

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

export default Products;
