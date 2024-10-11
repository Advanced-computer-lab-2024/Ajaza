import React, { useEffect, useState } from "react";
import { Card, Flex, Rate } from "antd";
import SelectCurrency from "../Tourist/SelectCurrency";

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
  photo,
}) => {
  const [avgRating, setAvgRating] = useState(rating);
  const [dateTimeFormatted, setDateTimeFormatted] = useState(null);
  const [isEditable, setIsEditable] = useState(false);
  const [img, setImg] = useState(null);

  useEffect(() => {
    if (dateTime) setDateTimeFormatted(formatDateTime(dateTime));
  }, [dateTime]);

  const handleEdit = (prev) => {
    if (prev != true) setIsEditable(true);
  };
  return (
    <Card
      title={title}
      extra={<SelectCurrency basePrice={extra} />}
      actions={actions}
      onClick={(prev) => handleEdit}
      cover={
        photo ? (
          <Flex justify="center">
            <img
              alt={photo}
              style={{ height: "150px", width: "80%" }}
              src={`/uploads/${photo}.jpg`}
            />
          </Flex>
        ) : null
      }
    >
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
