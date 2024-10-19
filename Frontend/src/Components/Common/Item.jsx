import React, { Modal } from "react";
import { Flex, Row, Col } from "antd";
import Feedbacks from "./Feedbacks";
import Timeline from "./Timeline";
import { camelCaseToNormalText, Colors } from "./Constants";
import CustomButton from "./CustomButton";
import { ShareAltOutlined } from "@ant-design/icons";

const Item = ({
  timelineItems,
  setTimeline,
  feedbacks,
  setFeedbacks,
  writeReviewForm,
  onSubmitWriteReview,
  bookItem,
  cancelBookingItem,
}) => {
  const shareItem = () => {};
  return (
    <>
      {
        <Row justify="center">
          {Object.entries(timelineItems).map(([key, value]) => {
            console.log(value);

            return (
              <Col span={12}>
                <h3>{camelCaseToNormalText(key)}</h3>
                <Timeline key={key} timelineItems={value} fieldName={key} />
              </Col>
            );
          })}
        </Row>
      }
      {/* {timelineItems ? <Timeline timelineItems={timelineItems} /> : null} */}
      <Feedbacks
        writeReviewForm={writeReviewForm}
        onSubmitWriteReview={onSubmitWriteReview}
        feedbacks={feedbacks}
        setFeedbacks={setFeedbacks}
      />
      <CustomButton size={"m"} value={"Book"} onClick={bookItem} />
      <CustomButton
        size={"m"}
        style={{ width: "200px", backgroundColor: Colors.warning }}
        value={"Cancel Booking"}
        onClick={cancelBookingItem}
      />
      <CustomButton
        size={"s"}
        style={{ width: "40px" }}
        icon={
          <ShareAltOutlined style={{ fontSize: "23px" }} onClick={shareItem} />
        }
      />
    </>
  );
};

export default Item;
