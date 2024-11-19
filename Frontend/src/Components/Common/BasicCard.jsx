// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { Card, Flex, Rate } from "antd";
// import SelectCurrency from "../Tourist/SelectCurrency";
// import styles from "./BasicCard.module.css";
// import "./BasicCard.css";
// import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

// function formatDateTime(availableDateTime) {
//   return availableDateTime.map((item) => {
//     const date = new Date(item.date);
//     const formattedDate = date.toLocaleDateString("en-US", {
//       year: "numeric",
//       month: "long",
//       day: "numeric",
//     });
//     const formattedTime = date.toLocaleTimeString("en-US", {
//       hour: "2-digit",
//       minute: "2-digit",
//     });
//     return {
//       id: item._id,
//       display: `${formattedDate} at ${formattedTime} - Spots: ${item.spots}`,
//     };
//   });
// }

// const BasicCard = ({
//   title,
//   extra,
//   rateDisplay = false,
//   rateEnabled = false,
//   fields = {},
//   actions,
//   rating,
//   dateTime,
//   photo,
//   onClick,
//   hoverable,
//   currency,
//   currencyRates,
// }) => {
//   const navigate = useNavigate();
//   const [avgRating, setAvgRating] = useState(rating);
//   const [dateTimeFormatted, setDateTimeFormatted] = useState(null);

//   const convertPriceRange = (priceRange) => {
//     const [lower, upper] = priceRange.split("-").map(Number);
//     const convertedLower = (lower * (currencyRates?.[currency] || 1)).toFixed(2);
//     const convertedUpper = (upper * (currencyRates?.[currency] || 1)).toFixed(2);
//     return `${convertedLower} - ${convertedUpper}`;
//   };

//   const convertedPrice =
//     typeof extra === "string" && extra.includes("-") ? convertPriceRange(extra) :
//     ((Number(extra) || 0) * (currencyRates?.[currency] || 1)).toFixed(2);

//   useEffect(() => {
//     if (dateTime) setDateTimeFormatted(formatDateTime(dateTime));
//   }, [dateTime]);

//   return (
//     <Card
//       title={<div onClick={onClick}>{title}</div>}
//       extra={<div>{`${convertedPrice} ${currency}`}</div>}
//       actions={actions}
//       cover={
//         photo ? (
//           <Flex justify="center" onClick={onClick}>
//             <img
//               alt={photo}
//               style={{ height: "150px", width: "80%" }}
//               src={`/uploads/${photo}.jpg`}
//             />
//           </Flex>
//         ) : null
//       }
//       className="myCard"
//       hoverable={hoverable}
//     >
//       <div onClick={onClick} style={{ padding: "24px" }}>
//         {Object.entries(fields).map(([key, value]) => (
//           value !== undefined && (
//             <div
//               key={key}
//               style={{
//                 width: "100%",
//                 textOverflow: "ellipsis",
//                 overflowX: "hidden",
//               }}
//             >
//               <span style={{ fontWeight: "bold" }}>{key}</span>: {String(value)}
//             </div>
//           )
//         ))}
//         {dateTime && dateTimeFormatted && (
//           <>
//             <div style={{ fontWeight: "bold" }}>Dates/Times Available</div>
//             {dateTimeFormatted.map((element, index) => (
//               <div key={index}>{element.display}</div>
//             ))}
//           </>
//         )}
//         {rateDisplay && (
//           <Rate allowHalf disabled={!rateEnabled} value={avgRating} />
//         )}
//       </div>
//     </Card>
//   );
// };

// export default BasicCard;

import React, { useEffect, useState } from "react";
import { Card, Divider, Flex, Rate } from "antd";
import styles from "./BasicCard.module.css";
import "./BasicCard.css";
import { Colors } from "./Constants";

function formatDateTime(availableDateTime) {
  return availableDateTime.map((item) => {
    const date = new Date(item.date);
    const formattedDate = date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const formattedTime = date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
    return {
      id: item._id,
      display: `${formattedDate} at ${formattedTime} - Spots: ${item.spots}`,
    };
  });
}

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
  const [priceBeforeCurrency, setPriceBeforeCurrency] = useState(null);
  const [convertedPrice, setConvertedPrice] = useState(null);
  const [currencySymbol, setCurrencySymbol] = useState(
    currency == "EGP" ? "£" : currency == "EUR" ? "€" : "$"
  );
  const [extraConv, setExtraConv] = useState(extra);

  useEffect(() => {
    if (discounts) {
      if (typeof extra === "string" && extra.includes("-")) {
        const [priceLower, priceUpper] = extra.split("-").map(Number);
        if (priceLower == priceUpper) {
          const priceLowerTemp = (
            priceLower -
            (discounts / 100) * priceLower
          ).toFixed(2);
          setPriceBeforeCurrency(`${priceLowerTemp}`);
        } else if (priceLower && priceUpper && priceLower !== priceUpper) {
          const priceLowerTemp = (
            priceLower -
            (discounts / 100) * priceLower
          ).toFixed(2);
          console.log(priceLowerTemp);
          const priceUpperTemp = (
            priceUpper -
            (discounts / 100) * priceUpper
          ).toFixed(2);
          setPriceBeforeCurrency(`${priceLowerTemp} - ${priceUpperTemp}`);
        }
      }
    } else {
      setPriceBeforeCurrency(extra);
    }
  }, [extra, discounts]);

  useEffect(() => {
    const conv =
      typeof extra === "string" && extra.includes("-")
        ? convertPriceRange(extra)
        : ((Number(extra) || 0) * (currencyRates?.[currency] || 1)).toFixed(2);
    setExtraConv(conv);
  }, [extra]);

  useEffect(() => {
    setCurrencySymbol(currency == "EGP" ? "£" : currency == "EUR" ? "€" : "$");
  }, [currency]);

  const convertPriceRange = (priceRange) => {
    const [lower, upper] = priceRange.split("-").map(Number);
    const convertedLower = (lower * (currencyRates?.[currency] || 1)).toFixed(
      2
    );
    const convertedUpper = (upper * (currencyRates?.[currency] || 1)).toFixed(
      2
    );
    return `${convertedLower}-${convertedUpper}`;
  };

  // Handle `extra` safely to avoid errors with `.split()`
  useEffect(() => {
    const conv =
      typeof priceBeforeCurrency === "string" &&
      priceBeforeCurrency.includes("-")
        ? convertPriceRange(priceBeforeCurrency)
        : (
            (Number(priceBeforeCurrency) || 0) *
            (currencyRates?.[currency] || 1)
          ).toFixed(2);
    setConvertedPrice(conv);
  }, [priceBeforeCurrency, currencyRates]);

  useEffect(() => {
    if (dateTime) setDateTimeFormatted(formatDateTime(dateTime));
  }, [dateTime]);

  return (
    <Card
      title={<div onClick={onClick}>{title}</div>}
      extra={
        <div style={{ position: "relative" }}>
          {`${currencySymbol}${convertedPrice}`}
          {discounts ? (
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
                {currencySymbol}
                {extraConv}
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
          ) : null}
        </div>
      }
      actions={renderActions ? [renderActions()] : actions} // Display the custom action button if provided
      cover={
        photo ? (
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
      <div onClick={onClick} style={{ padding: "24px" }}>
        {Object.entries(fields).map(
          ([key, value]) =>
            value !== undefined && (
              <div
                key={key}
                style={{
                  width: "100%",
                  textOverflow: "ellipsis",
                  overflowX: "hidden",
                  marginTop: "10px",
                }}
              >
                <span style={{ fontWeight: "bold" }}>{key}</span>:{" "}
                {String(value)}
              </div>
            )
        )}
        {dateTime && dateTimeFormatted && (
          <>
            <div style={{ fontWeight: "bold" }}>Dates/Times Available</div>
            {dateTimeFormatted.map((element, index) => (
              <div key={index}>{element.display}</div>
            ))}
          </>
        )}
        <Divider />
        {rateDisplay && (
          <Rate allowHalf disabled={!rateEnabled} value={avgRating} />
        )}
      </div>
    </Card>
  );
};

export default BasicCard;
