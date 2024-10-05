import React, { useEffect, useState } from "react";
import { Card, Rate } from "antd";

const BasicCard = ({
  title,
  extra,
  rateDisplay = false,
  rateEnabled = false,
  fields = {},
  actions,
  rating,
}) => {
  const [avgRating, setAvgRating] = useState(rating);

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
      {rateDisplay ? (
        <Rate allowHalf disabled={!rateEnabled} value={avgRating} />
      ) : null}
    </Card>
  );
};

export default BasicCard;
