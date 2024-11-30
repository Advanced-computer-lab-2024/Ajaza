import React from "react";
import { Collapse, Typography } from "antd";
import ReactPlayer from "react-player";
const { Panel } = Collapse;
const { Title } = Typography;

const Help = () => {
  const videoData = {
    plans: "https://www.example.com/video-plans.mp4",
    itineraries: "https://www.example.com/video-itineraries.mp4",
    venues: "https://www.example.com/video-venues.mp4",
    activities: "https://www.example.com/video-activities.mp4",
  };

  return (
    <div style={{ padding: "20px" }}>
      <Title level={3}>Help - How to Begin Your Vacation</Title>
      <Collapse accordion>
        <Panel header="Plans" key="1">
          <ReactPlayer 
            url="/videos/Gplan.mp4" 
            controls={true}
            width="100%"
            height="400px"
          />
        </Panel>
        <Panel header="Itineraries" key="2">
          <ReactPlayer 
            url="/videos/Gitin.mp4" 
            controls={true} 
            width="100%" 
            height="400px" 
          />
        </Panel>
        <Panel header="Venues" key="3">
          <ReactPlayer 
            url="/videos/Gvenue.mp4"
            controls={true} 
            width="100%" 
            height="400px" 
          />
        </Panel>
        <Panel header="Activities" key="4">
          <ReactPlayer 
            url="/videos/Gactiv.mp4"
            controls={true} 
            width="100%" 
            height="400px" 
          />
        </Panel>
      </Collapse>
    </div>
  );
};

export default Help;
