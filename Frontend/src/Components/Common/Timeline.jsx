import React, { useEffect, useState } from "react";
import { Timeline as TimelineAnt } from "antd";
import "./Timeline.css";

const Timeline = ({ timelineItems, fieldName }) => {
  const [mode, setMode] = useState("left");
  const [timelineItemsAdjusted, setTimelineItemsAdjusted] = useState(null);
  const onChange = (e) => {
    setMode(e.target.value);
  };

  console.log(timelineItems);

  useEffect(() => {
    let temp = timelineItems;
    if (fieldName == "timeline") {
      temp = timelineItems.sort((a, b) => a.start - b.start);
      temp = temp?.map((timelineItem) => {
        return {
          children: timelineItem?.id.name,
          label: `${timelineItem?.start}:00`,
        };
      });
    } else {
      // availableDateTime
      temp = timelineItems.sort((a, b) => a.date - b.date);
      temp = temp?.map((timelineItem) => {
        return {
          children: timelineItem.spots,
          label: String(timelineItem.date),
        };
      });
    }

    setTimelineItemsAdjusted(temp);
    console.log(temp);
  }, [timelineItems]);

  return (
    <div className="timeline-container" style={{ marginTop: 40 }}>
      <TimelineAnt mode={"left"} items={timelineItemsAdjusted} />
    </div>
  );
};

export default Timeline;
