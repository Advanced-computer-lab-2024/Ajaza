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
  height: "260px",
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
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleCancel = () => {
    setIsModalVisible(false);
    writeReviewForm.resetFields();
  };

  console.log(writeReviewForm);

  return (
    <>
      <Flex justify="right">
        {writeReviewForm ? (
          <CustomButton
            value={"Review"}
            size={"s"}
            onClick={() => setIsModalVisible(true)}
          />
        ) : null}
      </Flex>
      <Carousel arrows infinite={true}>
        {feedbacks
          ?.reduce((result, feedback, index) => {
            // Group feedbacks into batches of 3
            if (index % 3 === 0) {
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
                    span={8}
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
                      <Flex style={{ fontSize: 16, marginBottom: 20 }}>
                        <div style={titleStyle}>Anonymous</div>
                        <Rate
                          allowHalf
                          disabled
                          defaultValue={0}
                          value={feedbackItem.rating}
                          style={{ marginLeft: "auto" }}
                        />
                      </Flex>

                      <div className="desc">{feedbackItem.comments}</div>
                    </Card>
                  </Col>
                ))}
              </Row>
            </div>
          ))}
      </Carousel>
      {writeReviewForm ? (
        <Modal
          title={"Write your Review"}
          visible={isModalVisible}
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
                <AntButton type="primary" htmlType="submit">
                  Review
                </AntButton>
              </Flex>
            </Form.Item>
          </Form>
        </Modal>
      ) : null}
    </>
  );
};

export default Feedbacks;