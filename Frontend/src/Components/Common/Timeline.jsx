import React, { useEffect, useState } from "react";
import { Timeline as TimelineAnt } from "antd";
import "./Timeline.css";
import { convertDateToString } from "./Constants";

const Timeline = ({ timelineItems, fieldName }) => {
  const [mode, setMode] = useState("left");
  const [timelineItemsAdjusted, setTimelineItemsAdjusted] = useState(null);
  const onChange = (e) => {
    setMode(e.target.value);
  };

  useEffect(() => {
    let temp = timelineItems;
    if (fieldName == "timeline") {
      temp = timelineItems?.sort((a, b) => a.start - b.start);
      temp = temp?.map((timelineItem) => {
        return {
          children: timelineItem?.id?.name,
          label: `${timelineItem?.start}:00`,
        };
      });
    } else if (fieldName == "availableDateTime") {
      // availableDateTime
      temp = timelineItems?.sort((a, b) => a.date - b.date);
      temp = temp?.map((timelineItem) => {
        return {
          children: `Spots Available: ${timelineItem.spots}`,
          label: convertDateToString(timelineItem.date),
        };
      });
    } else {
      // openingHours
      console.log(timelineItems);

      temp = [
        {
          children: `${timelineItems?.suno}-${timelineItems?.sunc}`,
          label: "Sunday",
        },
        {
          children: `${timelineItems?.mono}-${timelineItems?.monc}`,
          label: "Monday",
        },
        {
          children: `${timelineItems?.tueo}-${timelineItems?.tuec}`,
          label: "Tuesday",
        },
        {
          children: `${timelineItems?.wedo}-${timelineItems?.wedc}`,
          label: "Wednesday",
        },
        {
          children: `${timelineItems?.thuo}-${timelineItems?.thuc}`,
          label: "Thursday",
        },
        {
          children: `${timelineItems?.frio}-${timelineItems?.fric}`,
          label: "Friday",
        },
        {
          children: `${timelineItems?.sato}-${timelineItems?.satc}`,
          label: "Saturday",
        },
      ];
    }

    setTimelineItemsAdjusted(temp);
  }, [timelineItems]);

  return (
    <div className="timeline-container" style={{ marginTop: 40 }}>
      <TimelineAnt mode={"left"} items={timelineItemsAdjusted} />
    </div>
  );
};

export default Timeline;
