
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
import { Card, Flex, Rate } from "antd";
import styles from "./BasicCard.module.css";
import "./BasicCard.css";

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
}) => {
  const [avgRating, setAvgRating] = useState(rating);
  const [dateTimeFormatted, setDateTimeFormatted] = useState(null);

  const convertPriceRange = (priceRange) => {
    const [lower, upper] = priceRange.split("-").map(Number);
    const convertedLower = (lower * (currencyRates?.[currency] || 1)).toFixed(2);
    const convertedUpper = (upper * (currencyRates?.[currency] || 1)).toFixed(2);
    return `${convertedLower} - ${convertedUpper}`;
  };

  // Handle `extra` safely to avoid errors with `.split()`
  const convertedPrice = typeof extra === "string" && extra.includes("-")
    ? convertPriceRange(extra)
    : ((Number(extra) || 0) * (currencyRates?.[currency] || 1)).toFixed(2);

  useEffect(() => {
    if (dateTime) setDateTimeFormatted(formatDateTime(dateTime));
  }, [dateTime]);

  return (
    <Card
      title={<div onClick={onClick}>{title}</div>}
      extra={<div>{`${convertedPrice} ${currency}`}</div>}
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
        {Object.entries(fields).map(([key, value]) => (
          value !== undefined && (
            <div
              key={key}
              style={{
                width: "100%",
                textOverflow: "ellipsis",
                overflowX: "hidden",
              }}
            >
              <span style={{ fontWeight: "bold" }}>{key}</span>: {String(value)}
            </div>
          )
        ))}
        {dateTime && dateTimeFormatted && (
          <>
            <div style={{ fontWeight: "bold" }}>Dates/Times Available</div>
            {dateTimeFormatted.map((element, index) => (
              <div key={index}>{element.display}</div>
            ))}
          </>
        )}
        {rateDisplay && (
          <Rate allowHalf disabled={!rateEnabled} value={avgRating} />
        )}
      </div>
    </Card>
  );
};

export default BasicCard;
