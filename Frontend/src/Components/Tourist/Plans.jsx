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
import SelectCurrency from "./SelectCurrency";
import { useNavigate } from "react-router-dom";
import { useCurrency } from "./CurrencyContext";
import { jwtDecode } from "jwt-decode";

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
  const navigate = useNavigate();
  const [combinedElements, setCombinedElements] = useState([]);
  const propMapping = {
    title: "name",
    extra: "price",
    rating: "avgRating",
    photo: "pictures",
    discounts: "discounts",
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

  const { currency, setCurrency } = useCurrency();

  const handleCurrencyChange = (newCurrency) => {
    setCurrency(newCurrency);
  };
  const fields = {};
  const searchFields = ["name", "category", "tags"];
  const [isLoading, setIsLoading] = useState(true);
  const constProps = { rateDisplay: true, currency, currencyRates };
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
        const token = localStorage.getItem("token");
        let decodedToken = null;
        if (token) {
          decodedToken = jwtDecode(token);
        }
        const user = decodedToken?.userDetails;

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

        // console.log(activities);
        // console.log(itineraries);
        // console.log(venues);
        // console.log(categories);
        // console.log(tags);

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

        if (user) {
          venues = venues.map((venue) => {
            return calculateYourPrice(
              venue,
              user?.nationality,
              user?.occupation
            );
          });
        } else {
          venues = venues.map((venue) => {
            const calculatedPrice = calculateYourPrice(
              venue,
              "egypt",
              "student"
            );

            return {
              ...venue,
              basePrice: `${calculateYourPrice}`,
            };
          });
        }

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
          return {
            ...element,
            avgRating: getAvgRating(element.feedback),
            basePrice: element.price,
          };
        });
        console.log(combinedArray);

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
      prevElements.map((element) => {
        if (element.type !== "Activity") {
          return {
            ...element,
            price: (element.basePrice * currencyRates[currency]).toFixed(2),
          };
        }
        // If it's an activity, return it without modifying
        return element;
      })
    );
  }, [currency]);

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
        {/* <SelectCurrency
          //basePrice={null}
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
        cardOnclick={(element) => {
          var type = "activities";
          if (element?.type.toLowerCase() == "itinerary") {
            type = "itineraries";
          } else if (element?.type.toLowerCase() == "venue") {
            type = "venues";
          }
          navigate(`${type}/${element?._id}`);
        }}
        isLoading={isLoading}
      />
    </div>
  );
};

export default Plans;
