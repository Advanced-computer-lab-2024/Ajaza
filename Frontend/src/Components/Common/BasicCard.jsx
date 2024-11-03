import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Flex, Rate } from "antd";
import SelectCurrency from "../Tourist/SelectCurrency";
import styles from "./BasicCard.module.css";
import "./BasicCard.css";

import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

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
  onClick,
  hoverable,
  currency,
  currencyRates,
}) => {
  const navigate = useNavigate();
  const [avgRating, setAvgRating] = useState(rating);
  const [dateTimeFormatted, setDateTimeFormatted] = useState(null);
  const [isEditable, setIsEditable] = useState(false);
  const [img, setImg] = useState(null);

  const convertedPrice = ((extra || 0) * (currencyRates?.[currency] || 1)).toFixed(2);

  useEffect(() => {
    if (dateTime) setDateTimeFormatted(formatDateTime(dateTime));
  }, [dateTime]);

  const handleEdit = (prev) => {
    if (prev != true) setIsEditable(true);
  };

  return (
    <Card
      title={<div onClick={onClick}>{title}</div>}
      extra={<div>{`${convertedPrice} ${currency}`}</div>}
      actions={actions}
      // onClick={onClick}
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
      className={"myCard"}
      hoverable={hoverable}
    >
      <div onClick={onClick} style={{ padding: "24px" }}>
        {Object.entries(fields).map(([key, value]) => {
          if (value !== undefined) {
            return (
              <div
                style={{
                  width: "100%",
                  textOverflow: "ellipsis",
                  overflowX: "hidden",
                }}
                key={key}
              >
                <span style={{ fontWeight: "bold" }}>{key}</span>:{" "}
                {String(value)}
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
      </div>
    </Card>
  );
};

export default BasicCard;
