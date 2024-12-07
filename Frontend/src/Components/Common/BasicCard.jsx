import React, { useEffect, useState } from "react";
import { Card, Divider, Flex, Rate } from "antd";
import styles from "./BasicCard.module.css";
import "./BasicCard.css";
import { Colors, convertDateToString } from "./Constants";

function formatDateTime(availableDateTime) {
  return availableDateTime.map((item) => {
    const date = new Date(item.date);
    const formatted = convertDateToString(date);
    return {
      id: item._id,
      display: `${formatted} - Spots: ${item.spots}`,
    };
  });
}

const getCurrencySymbol = (currency) => {
  const symbols = {
    AED: "د.إ",
    ARS: "$",
    AUD: "A$",
    BDT: "৳",
    BHD: ".د.ب",
    BND: "B$",
    BRL: "R$",
    CAD: "C$",
    CHF: "CHF",
    CLP: "$",
    CNY: "¥",
    COP: "$",
    CZK: "Kč",
    DKK: "kr",
    EGP: "EGP",
    EUR: "€",
    GBP: "£",
    HKD: "HK$",
    HUF: "Ft",
    IDR: "Rp",
    ILS: "₪",
    INR: "₹",
    JPY: "¥",
    KRW: "₩",
    KWD: "د.ك",
    LKR: "Rs",
    MAD: "MAD",
    MXN: "$",
    MYR: "RM",
    NOK: "kr",
    NZD: "NZ$",
    OMR: "ر.ع.",
    PHP: "₱",
    PKR: "₨",
    PLN: "zł",
    QAR: "ر.ق",
    RUB: "₽",
    SAR: "ر.س",
    SEK: "kr",
    SGD: "S$",
    THB: "฿",
    TRY: "₺",
    TWD: "NT$",
    UAH: "₴",
    USD: "$",
    VND: "₫",
    ZAR: "R",
  };
  return symbols[currency] || currency;
};

const BasicCard = ({
  title,
  extra,
  rateDisplay = false,
  rateEnabled = false,
  fields = {},
  actions,
  rating,
  dateTime,
  photo,
  onClick,
  hoverable,
  currency,
  currencyRates,
  renderActions, // This prop will receive a custom button for specific components
  discounts,
}) => {
  const [avgRating, setAvgRating] = useState(rating);
  const [dateTimeFormatted, setDateTimeFormatted] = useState(null);

  const convertPrice = (price) => {
    return (price * (currencyRates?.[currency] || 1)).toFixed(2);
  };

  const applyDiscount = (price) => {
    if (discounts) {
      const discountFactor = 1 - discounts / 100;
      return (price * discountFactor).toFixed(2);
    }
    return price.toFixed(2);
  };

  const convertPriceRange = (priceRange) => {
    const [lower, upper] = priceRange.split("-").map(Number);
    const convertedLower = convertPrice(lower);
    const convertedUpper = convertPrice(upper);
    return `${convertedLower} - ${convertedUpper}`;
  };

  const convertAndApplyDiscountToRange = (priceRange) => {
    const [lower, upper] = priceRange.split("-").map(Number);
    const discountedLower = applyDiscount(lower);
    const discountedUpper = applyDiscount(upper);
    return `${convertPrice(discountedLower)} - ${convertPrice(
      discountedUpper
    )}`;
  };

  const convertedPrice =
    typeof extra === "string" && extra.includes("-")
      ? convertAndApplyDiscountToRange(extra)
      : applyDiscount(Number(extra));

  const originalPrice =
    typeof extra === "string" && extra.includes("-")
      ? convertPriceRange(extra)
      : convertPrice(Number(extra));

  useEffect(() => {
    if (dateTime) {
      setDateTimeFormatted(formatDateTime(dateTime));
    }
  }, [dateTime]);

  return (
    <Card

    
      title={<div id ="test"onClick={onClick}>{title}</div>}
      extra={
        <div style={{ position: "relative" }}>
          {`${getCurrencySymbol(currency)}${convertedPrice}`}
          {discounts && (
            <Flex
              style={{
                position: "absolute",
                bottom: "90%",
                right: "-25px",
              }}
            >
              <div
                style={{
                  color: Colors.warningDark,
                  fontSize: "12px",
                  textDecoration: "line-through underline",
                  marginRight: "5px",
                  whiteSpace: "nowrap",
                }}
              >
                {getCurrencySymbol(currency)}
                {originalPrice}
              </div>
              <div
                style={{
                  backgroundColor: Colors.warningDark,
                  color: "white",
                  padding: "2px 4px",
                  borderRadius: "4px",
                  fontSize: "11px",
                }}
              >
                -{discounts}%
              </div>
            </Flex>
          )}
        </div>
      }
      actions={renderActions ? [renderActions()] : actions} // Display the custom action button if provided
      cover={
        Array.isArray(photo) && photo?.length > 0 ? (
          <Flex justify="center" onClick={onClick}>
            <img
              alt={photo[0]}
              style={{ height: "150px", width: "80%" }}
              src={`/uploads/${photo[0]}.jpg`}
            />
          </Flex>
        ) : photo ? (
          <Flex justify="center" onClick={onClick}>
            <img
              alt={photo}
              style={{ height: "150px", width: "80%" }}
              src={`/uploads/${photo}.jpg`}
            />
          </Flex>
        ) : null
      }
      className="myCard"
      hoverable={hoverable}
    >
      {Object.entries(fields).length > 0 && (
        <div onClick={onClick} style={{ padding: "24px" }}>
          {Object.entries(fields).map(([key, value]) => {
            if (key == "Date") {
              value = convertDateToString(value);
            }
            let style = {};
            if (key.toLowerCase() == "description") {
              style = {
                display: "-webkit-box",
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                WebkitLineClamp: 2, // Change this number to set max lines
                textOverflow: "ellipsis",
              };
            }
            return (
              value !== undefined && (
                <div
                  key={key}
                  style={{
                    width: "100%",
                    textOverflow: "ellipsis",
                    overflowX: "hidden",
                    marginTop: "8px",
                    ...style,
                  }}
                >
                  <span style={{ fontWeight: "bold" }}>{key}</span>:{" "}
                  {String(value)}
                </div>
              )
            );
          })}
          {dateTime && dateTimeFormatted && (
            <>
              <div style={{ fontWeight: "bold", marginTop: "10px" }}>
                Dates/Times Available
              </div>
              {dateTimeFormatted.map((element, index) => {
                if (index > 2) return null;
                return <div key={index}>{element.display}</div>;
              })}
            </>
          )}
        </div>
      )}
      <Divider style={{ marginTop: "15px", marginBottom: "15px" }} />
      {rateDisplay && (
        <Rate
          allowHalf
          disabled={!rateEnabled}
          value={avgRating}
          style={{ marginBottom: "20px" }}
        />
      )}
    </Card>
  );
};

export default BasicCard;
