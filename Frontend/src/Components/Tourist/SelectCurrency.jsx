


import React from "react";
import { Select } from "antd";

const { Option } = Select;

const SelectCurrency = ({ currency, onCurrencyChange, style = {} }) => {
  const currencyRates = {
    EGP: 48.58,
    USD: 1,
    EUR: 0.91,
  };

  const handleCurrencyChange = (value) => {
    onCurrencyChange(value); 
  };

  return (
    <Select value={currency} onChange={handleCurrencyChange} style={{ width: 70, ...style}}>
      {Object.keys(currencyRates).map((curr) => (
        <Option key={curr} value={curr}>
          {curr}
        </Option>
      ))}
    </Select>
  );
};

export default SelectCurrency;

