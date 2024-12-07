import React, { useEffect, useState } from "react";
import SearchFilterSortContainer from "../Common/SearchFilterSortContainer";
import { apiUrl, getAvgRating, comparePriceRange } from "../Common/Constants";
import axios from "axios";
import BasicCard from "../Common/BasicCard";
import { jwtDecode } from "jwt-decode";
import SelectCurrency from "./SelectCurrency";
import { useNavigate } from "react-router-dom";
import { useCurrency } from "./CurrencyContext";
import * as Frigade from "@frigade/react";
import CustomButton from "../Common/CustomButton";
import { Button } from "antd";


const token = localStorage.getItem("token");
let decodedToken = null;
let role = null;
if (token) {
  decodedToken = jwtDecode(token);
  role = decodedToken?.role; // Extract the role from the token

}
console.log("itin role nour", role);
const userid = decodedToken ? decodedToken.userId : null;

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

const currencyRates = {
  AED: 3.6725,
  ARS: 1004.0114,
  AUD: 1.5348,
  BDT: 110.5,
  BHD: 0.376,
  BND: 1.3456,
  BRL: 5.8149,
  CAD: 1.3971,
  CHF: 0.8865,
  CLP: 973.6481,
  CNY: 7.2462,
  COP: 4389.3228,
  CZK: 24.2096,
  DKK: 7.1221,
  EGP: 48.58,
  EUR: 0.9549,
  GBP: 0.7943,
  HKD: 7.7825,
  HUF: 392.6272,
  IDR: 15911.807,
  ILS: 3.7184,
  INR: 84.5059,
  JPY: 154.4605,
  KRW: 1399.323,
  KWD: 0.3077,
  LKR: 291.0263,
  MAD: 10.5,
  MXN: 20.4394,
  MYR: 4.4704,
  NOK: 11.0668,
  NZD: 1.7107,
  OMR: 0.385,
  PHP: 58.9091,
  PKR: 279.0076,
  PLN: 4.1476,
  QAR: 3.64,
  RUB: 101.2963,
  SAR: 3.75,
  SEK: 11.063,
  SGD: 1.3456,
  THB: 34.7565,
  TRY: 34.5345,
  TWD: 32.5602,
  UAH: 36.9,
  USD: 1,
  VND: 24000.0,
  ZAR: 18.0887,
};

const Itineraries = () => {
  const navigate = useNavigate();
  const cardOnclick = (element) => {
    navigate(element["_id"]);
  };
  const [combinedElements, setCombinedElements] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // propName:fieldName
  const propMapping = {
    title: "name",
    extra: "price",
    rating: "avgRating",
    dateTime: "availableDateTime",
    photo: "pictures",
  };
  const fields = {
    Language: "language",
    Tags: "tags",
  };
  const { currency, setCurrency } = useCurrency();
  const { Tour, useFrigade } = Frigade; // Access Tour and useFrigade from Frigade default export

  const { flowStatus, resetFlow } = useFrigade(); // Importing flow management functions
  const [showFrigade, setShowFrigade] = useState(false);


  const handleCurrencyChange = (newCurrency) => {
    setCurrency(newCurrency);
  };
  const searchFields = ["name"];
  const constProps = { rateDisplay: true, currency, currencyRates };
  const sortFields = ["avgRating", "price"];

  const [filterFields, setfilterFields] = useState({
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
      compareFn: (filterCriteria, element) =>
        comparePriceRange(filterCriteria, element),
    },
    language: {
      displayName: "Languages",
      values: [
        { displayName: "Arabic", filterCriteria: "Arabic" },
        { displayName: "English", filterCriteria: "English" },
        { displayName: "Spanish", filterCriteria: "Spanish" },
        { displayName: "German", filterCriteria: "German" },
        { displayName: "Italian", filterCriteria: "Italian" },
        { displayName: "French", filterCriteria: "French" },
      ],
      compareFn: (filterCriteria, element) => {
        if (!element.language) {
          return false;
        }
        // filterCriteria is one of the values that we can filter with
        return element?.language.includes(filterCriteria);
      },
    },
    availableDateTime: {
      displayName: "Available Dates/Times",
      values: [
        {
          displayName: "January",
          filterCriteria: ["2024-01-01", "2024-01-31"],
        },
        {
          displayName: "February",
          filterCriteria: ["2024-02-01", "2024-02-29"],
        },
        {
          displayName: "March",
          filterCriteria: ["2024-03-01", "2024-03-31"],
        },
        {
          displayName: "April",
          filterCriteria: ["2024-04-01", "2024-04-30"],
        },
        {
          displayName: "May",
          filterCriteria: ["2024-05-01", "2024-05-31"],
        },
        {
          displayName: "June",
          filterCriteria: ["2024-06-01", "2024-06-30"],
        },
        {
          displayName: "July",
          filterCriteria: ["2024-07-01", "2024-07-31"],
        },
        {
          displayName: "August",
          filterCriteria: ["2024-08-01", "2024-08-31"],
        },
        {
          displayName: "September",
          filterCriteria: ["2024-09-01", "2024-09-30"],
        },
        {
          displayName: "October",
          filterCriteria: ["2024-10-01", "2024-10-31"],
        },
        {
          displayName: "November",
          filterCriteria: ["2024-11-01", "2024-11-30"],
        },
        {
          displayName: "December",
          filterCriteria: ["2024-12-01", "2024-12-31"],
        },
      ],
      compareFn: (filterCriteria, element) => {
        // Extract the month from filterCriteria
        const startMonth = new Date(filterCriteria[0]).getMonth(); // Get the start month (0-11)
        const endMonth = new Date(filterCriteria[1]).getMonth(); // Get the end month (0-11)

        if (!element.availableDateTime) {
          return false;
        }

        // Check if any of the dates in availableDateTime fall within the given month range
        return element.availableDateTime.some((available) => {
          const availableDate = new Date(available.date);
          const availableMonth = availableDate.getMonth(); // Get the month (0-11)

          // Compare only the month, ignoring the year
          return availableMonth >= startMonth && availableMonth <= endMonth;
        });
      },
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [itineraryResponse, tagResponse] = await Promise.all([
          axios.get(`${apiUrl}itinerary/notHidden`),
          axios.get(`${apiUrl}tag`),
        ]);
        let itineraries = itineraryResponse.data;
        let tags = tagResponse.data;

        filterFields.tags = {
          displayName: "Tags",
          values: convertTagsToValues(tags),
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
        console.log(itineraries);

        let combinedArray = itineraries;

        combinedArray = combinedArray.map((element) => {
          return {
            ...element,
            avgRating: getAvgRating(element.feedback),
            basePrice: element.price,
          };
        });

        setCombinedElements(combinedArray);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    setCombinedElements((prevElements) =>
      prevElements.map((element) => ({
        ...element,
        price: (element.basePrice * currencyRates[currency]).toFixed(2),
      }))
    );
  }, [currency]);

  const renderFrigadeProvider = () => {
    if (role === null) {
      return (
        <Frigade.Provider
          apiKey="api_public_qO3GMS6zamh9JNuyKBJlI8IsQcnxTuSVWJLu3WUUTUyc8VQrjqvFeNsqTonlB3Ik"
          userId={userid}
          onError={(error) => console.error("Frigade Error:", error)}
        >
          <Frigade.Tour flowId="flow_CHZzYUZG" />
        </Frigade.Provider>
      );
    } else if (role === "tourist") {
      return (
        <Frigade.Provider
          apiKey="api_public_qO3GMS6zamh9JNuyKBJlI8IsQcnxTuSVWJLu3WUUTUyc8VQrjqvFeNsqTonlB3Ik"
          userId={userid}
          onError={(error) => console.error("Frigade Error:", error)}
        >
          <Frigade.Tour flowId="flow_skhaNY2m" />
        </Frigade.Provider>
      );
    }
  }

  const handleShowFrigade = () => {
    if (flowStatus === "ENDED") {
      resetFlow(); // Reset the flow to start from the first step
    }
    setShowFrigade(false); // Temporarily hide Frigade to force re-render
    setTimeout(() => {
      setShowFrigade(true); // Show Frigade after resetting
    }, 0);
  };
  

  return (
    <div>
           
      <CustomButton size={"s"} value={"Hint"} onClick={handleShowFrigade} style={{ marginBottom: "16px" }}/>
      
      {showFrigade && renderFrigadeProvider()}
     <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px",
        }}
      >
        {/* <SelectCurrency
          basePrice={null}
          currency={currency}
          onCurrencyChange={handleCurrencyChange}
          style={{ left: 1000, top: 55 }}
        /> */}
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
        isLoading={isLoading}
      />
    </div>
    </div>
  );
};

export default Itineraries;
