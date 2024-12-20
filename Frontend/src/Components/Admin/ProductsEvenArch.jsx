import React, { useEffect, useState } from "react";
import SearchFilterSortContainer from "../Common/SearchFilterSortContainer";
import { apiUrl, comparePriceRange, getAvgRating } from "../Common/Constants";
import axios from "axios";
import BasicCard from "../Common/BasicCard";
import SelectCurrency from "../Tourist/SelectCurrency";
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

const currencyRates = {
  AED: 3.6725 ,
ARS: 1004.0114 ,
AUD: 1.5348,
BDT: 110.50,
BHD: 0.3760,
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
IDR: 15911.8070,
ILS: 3.7184,
INR: 84.5059,
JPY: 154.4605,
KRW: 1399.3230,
KWD: 0.3077,
LKR: 291.0263,
MAD: 10.50,
MXN: 20.4394,
MYR: 4.4704,
NOK: 11.0668,
NZD: 1.7107,
OMR: 0.3850,
PHP: 58.9091,
PKR: 279.0076,
PLN: 4.1476,
QAR: 3.6400,
RUB: 101.2963,
SAR: 3.7500,
SEK: 11.0630,
SGD: 1.3456,
THB: 34.7565,
TRY: 34.5345,
TWD: 32.5602,
UAH: 36.90,
USD : 1,
VND: 24000.00,
ZAR: 18.0887,
};

const ProductsEvenArch = () => {
  const navigate = useNavigate();
  const cardOnclick = (element) => {
    navigate(element["_id"]);
  };
  const [combinedElements, setCombinedElements] = useState([]);
  const [currency, setCurrency] = useState("USD");
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
          return { ...element, avgRating: getAvgRating(element.feedback) , basePrice: element.price };
        });

        console.log(combinedArray);

        setCombinedElements(combinedArray);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);


  const handleCurrencyChange = (selectedCurrency) => {
    setCurrency(selectedCurrency);
  };

  useEffect(() => {
    setCombinedElements((prevElements) =>
      prevElements.map((element) => ({
        ...element,
        price: (element.basePrice * currencyRates[currency]).toFixed(2), 
      }))
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
          basePrice={null}
          currency={currency}
          onCurrencyChange={handleCurrencyChange}
          style={{ left: 1070, top: 55 }}
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
      />
    </div>
  );
};

export default ProductsEvenArch;
