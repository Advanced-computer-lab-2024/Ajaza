


import React from "react";
import { Select } from "antd";

const { Option } = Select;

const SelectCurrency = ({ currency, onCurrencyChange, style = {} }) => {
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
  USD: 1,
  VND: 24000.00,
  ZAR: 18.0887,
  };

  const handleCurrencyChange = (value) => {
    onCurrencyChange(value); 
  };

  return (
    <Select value={currency} onChange={handleCurrencyChange} style={{ width: 70, ...style , }}>
      {Object.keys(currencyRates).map((curr) => (
        <Option key={curr} value={curr}>
          {curr}
        </Option>
      ))}
    </Select>
  );
};

export default SelectCurrency;

