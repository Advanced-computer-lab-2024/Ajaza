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
import SelectCurrency from "./SelectCurrency";
import { useCurrency } from "./CurrencyContext";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

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

const currencyRates = {
  EGP: 48.58,
  USD: 1,
  EUR: 0.91,
};

const Venues = () => {
  const navigate = useNavigate();
  const cardOnclick = (element) => {
    navigate(element["_id"]);
  };
  const [combinedElements, setCombinedElements] = useState([]);
  const [user, setUser] = useState(null);
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

  const { currency, setCurrency } = useCurrency();

  const handleCurrencyChange = (newCurrency) => {
    setCurrency(newCurrency);
  };  const searchFields = ["name", "tags"];
  const constProps = { rateDisplay: true, currency, currencyRates };
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
    tags: {
      displayName: "Tags",
      values: [
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
          return calculateYourPrice(venue, user?.nationality, user?.occupation);
        });

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
  }, [user]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const decodedToken = jwtDecode(token);
    setUser(decodedToken?.userDetails);
  }, []);



  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px",
        }}
      >
        <SelectCurrency
          basePrice={null}
          currency={currency}
          onCurrencyChange={handleCurrencyChange}
          style={{left:1000 , top:55}}
        />
      </div>
      <SearchFilterSortContainer
        cardComponent={BasicCard}
        elements={combinedElements}
        propMapping={propMapping}
        searchFields={searchFields}
        constProps={constProps}
        fields={fields}
        sortFields={sortFields}
        filterFields={filterFields}
        cardOnclick={cardOnclick}
      />
    </div>
  );
};

export default Venues;
