import { Col, Row } from "antd";
import React from "react";
import MapView from "./MapView";
import Timeline from "./Timeline";

const LocationOpeningHours = ({ colSpan, location, openingHours }) => {
  console.log(openingHours);

  return (
    <Row>
      <Col span={colSpan}>
        <MapView googleMapsLink={location} />
      </Col>
      <Col span={24 - colSpan}>
        <h3>Opening Hours</h3>
        <Timeline timelineItems={openingHours} fieldName={"openingHours"} />
      </Col>
    </Row>
  );
};

export default LocationOpeningHours;
