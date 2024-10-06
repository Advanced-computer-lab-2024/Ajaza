import React, { useEffect, useState } from "react";
import { Card, Rate } from "antd";

function formatDateTime(availableDateTime) {
  return availableDateTime.map((item) => {
    // Convert the date to a more readable format
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

    // Return an object with formatted values
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
}) => {
  const [avgRating, setAvgRating] = useState(rating);
  const [dateTimeFormatted, setDateTimeFormatted] = useState(null);

  useEffect(() => {
    if (dateTime) setDateTimeFormatted(formatDateTime(dateTime));
  }, [dateTime]);

  return (
    <Card title={title} extra={extra ? `$${extra}` : null} actions={actions}>
      {Object.entries(fields).map(([key, value]) => {
        if (value) {
          return (
            <div
              style={{
                width: "100%",
                textOverflow: "ellipsis",
                overflowX: "hidden",
              }}
              key={key}
            >
              <span style={{ fontWeight: "bold" }}>{key}</span>: {String(value)}
            </div>
          );
        }
      })}
      {dateTime && dateTimeFormatted ? (
        <>
          <div style={{ fontWeight: "bold" }}>Dates/Times Available</div>
          {dateTimeFormatted.map((element, index) => {
            console.log(element);

            return <div key={index}>{element.display}</div>;
          })}
        </>
      ) : null}

      {rateDisplay ? (
        <Rate allowHalf disabled={!rateEnabled} value={avgRating} />
      ) : null}
    </Card>
  );
};

export default BasicCard;
