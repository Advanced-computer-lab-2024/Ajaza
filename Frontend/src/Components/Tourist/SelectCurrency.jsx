import React, { useState } from "react";
import { Select } from "antd"; 

const { Option } = Select; 

const SelectCurrency = ({ basePrice }) => {
  const [currency, setCurrency] = useState("USD");

  const currencyRates = {
    EGP: 48.58,
    USD: 1,
    EUR: 0.91,
  };

  const handleCurrencyChange = (value) => {
    setCurrency(value);
  };

  let lowerPrice, upperPrice;

  if (typeof basePrice === "string" && basePrice.includes("-")) {
    [lowerPrice, upperPrice] = basePrice.split("-").map(Number);
  } else {
    lowerPrice = upperPrice = parseFloat(basePrice);
  }

  const convertedLowerPrice = (lowerPrice * currencyRates[currency]).toFixed(2);
  const convertedUpperPrice = (upperPrice * currencyRates[currency]).toFixed(2);

  return (
    <div>
      <Select value={currency} onChange={handleCurrencyChange} style={{ width: 70 }}>
        {Object.keys(currencyRates).map((curr) => (
          <Option key={curr} value={curr}>
            {curr}
          </Option>
        ))}
      </Select>
      <span>
        {lowerPrice === upperPrice
          ? `${convertedLowerPrice} ${currency}`
          : `${convertedLowerPrice} - ${convertedUpperPrice} ${currency}`}
      </span>
    </div>
  );
};

export default SelectCurrency;
