import React, { useState } from "react";
import {
  Carousel,
  Col,
  Row,
  Card,
  Rate,
  Flex,
  Modal,
  Form,
  Input,
  Button as AntButton,
} from "antd";
import { UserOutlined } from "@ant-design/icons";
import { Colors } from "./Constants";
import "./Feedbacks.css";
import CustomButton from "./CustomButton";
const contentStyle = {
  margin: 0,
  height: "210px",
  color: "#fff",
  lineHeight: "400px",
  textAlign: "center",
  background: Colors.grey[50], // TODO Remove background color
  padding: "15px 20px 25px 20px",
  borderRadius: "20px",
};

const titleStyle = {
  textAlign: "left",
  paddingLeft: 40,
  fontWeight: 700,
};
const Feedbacks = ({
  feedbacks,
  setFeedbacks,
  writeReviewForm,
  onSubmitWriteReview,
}) => {
  const numOfItems = 4;
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleCancel = () => {
    setIsModalVisible(false);
    writeReviewForm.resetFields();
  };

  return (
    <>
      {/* <Flex justify="right">
        {writeReviewForm ? (
          <CustomButton
            value={"Review"}
            size={"s"}
            onClick={() => setIsModalVisible(true)}
          />
        ) : null}
      </Flex> */}
      {feedbacks?.length > 0 ? (
        <Carousel arrows infinite={true} style={{ marginTop: "30px" }}>
          {feedbacks
            ?.reduce((result, feedback, index) => {
              // Group feedbacks into batches of 3
              if (index % numOfItems === 0) {
                result.push([feedback]);
              } else {
                result[result.length - 1].push(feedback);
              }
              return result;
            }, [])
            .map((batch, idx) => (
              <div key={idx}>
                <Row style={contentStyle} gutter={[20, 10]}>
                  {batch.map((feedbackItem, colIdx) => (
                    <Col
                      key={colIdx}
                      span={24 / numOfItems}
                      style={{ height: "100%", display: "flex" }}
                    >
                      <Card
                        className="feedbackCard"
                        style={{
                          width: "100%",
                          height: "100%",
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            position: "absolute",
                            left: 20,
                            top: 20,
                            height: 35,
                            width: 35,
                            display: "flex",
                            justifyContent: "center",
                            borderRadius: "50%",
                            backgroundColor: Colors.primary.default,
                          }}
                        >
                          <UserOutlined
                            style={{ fontSize: 17, color: "white" }}
                          />
                        </div>
                        <Flex
                          style={{
                            fontSize: 16,
                            marginBottom: 20,
                            alignItems: "center",
                          }}
                        >
                          <div style={titleStyle}>
                            {feedbackItem?.touristId?.username ? (
                              feedbackItem?.touristId?.username
                            ) : (
                              <span>{feedbackItem?.touristName}</span>
                            )}
                          </div>
                          <Rate
                            allowHalf
                            disabled
                            defaultValue={0}
                            value={feedbackItem.rating}
                            style={{ marginLeft: "auto" }}
                          />
                        </Flex>

                        <div
                          className="desc"
                          style={{
                            display: "-webkit-box",
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            WebkitLineClamp: 3, // Change this number to set max lines
                            textOverflow: "ellipsis",
                          }}
                        >
                          {feedbackItem.comments}
                        </div>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </div>
            ))}
        </Carousel>
      ) : null}
      {/* {writeReviewForm ? (
        <Modal
          title={"Write your Review"}
          open={isModalVisible}
          onCancel={handleCancel}
          footer={null}
        >
          <Form
            form={writeReviewForm}
            layout="vertical"
            onFinish={onSubmitWriteReview}
          >
            <Form.Item
              name="rating"
              label="Rating"
              rules={[{ required: true, message: "Please your rating" }]}
            >
              <Rate allowHalf />
            </Form.Item>
            <Form.Item
              name="comments"
              label="Comments"
              rules={[{ required: true, message: "Please your comments" }]}
            >
              <Input placeholder="Enter your comments" />
            </Form.Item>
            <Form.Item style={{ marginBottom: "10px" }}>
              <Flex justify="center">
                <AntButton
                  htmlType="submit"
                  style={{
                    backgroundColor: Colors.primary.default,
                    color: "white",
                  }}
                >
                  Review
                </AntButton>
              </Flex>
            </Form.Item>
          </Form>
        </Modal>
      ) : null} */}
    </>
  );
};

export default Feedbacks;
