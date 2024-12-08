import React from "react";
import { Collapse, Typography } from "antd";
import ReactPlayer from "react-player";
const { Panel } = Collapse;
const { Title } = Typography;

const Help = () => {
  return (
    <div style={{ padding: "20px" }}>
      <Title level={3}>Help - How to Begin Your Vacation</Title>
      <Collapse accordion>
        <Panel header="Itineraries" key="2">
          <img 
            src="/gifs/TouristItin.gif" 
            alt="Itineraries" 
            style={{ width: "100%", height: "400px", objectFit: "cover" }}
          />
        </Panel>
        <Panel header="Activities" key="4">
          <img 
            src="/gifs/TouristAct.gif" 
            alt="Activities" 
            style={{ width: "100%", height: "400px", objectFit: "cover" }}
          />
        </Panel>
      </Collapse>
    </div>
  );
};

export default Help;
