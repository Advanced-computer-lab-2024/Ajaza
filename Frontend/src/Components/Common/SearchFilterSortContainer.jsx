import React from "react";
import { Col, Row, Card, Avatar } from "antd";
import {
  EditOutlined,
  EllipsisOutlined,
  SettingOutlined,
} from "@ant-design/icons";
const { Meta } = Card;

const SearchFilterSortContainer = ({
  cardComponent: CardComponent = Card, // Pass your custom Card (IF NEEDED)
  search = true,
  filter = true,
  sort = true,
  elements, // array of objects
  // Objects will be
  // This is for antd Card
  //   {...all fields and their values,
  //     cardTitle:"field to use for cardTitle",
  //     coverImage:"field for img url",
  //     actions = [
  //     <SettingOutlined key="setting" onClick={() => console.log("1st")} />,
  //     <EditOutlined key="edit" onClick={() => console.log("2nd")} />,
  //     <EllipsisOutlined key="ellipsis" onClick={() => console.log("3rd")} />,
  //   ],
  //     meta:{
  //              avatarImage:"url for avatar image",
  //              title:"field to use for meta title",
  //              description:"field to use for meta description"
  //          }
  // }

  // This is for your own Card Component !!!!!!!!!!!!!!!!!!!! (IF PASSED A CARD COMPONENT)
  // Objects will be
  //   {...all fields and their values,
  //     propName1: field name to use
  //     propName2: field name to use
  //     propName3: field name to use
  //     propName4: field name to use
  // }
  setElements,
  cardsPerRow = 3,
  horizontalGap = 30,
  verticalGap = 30,
  loading,
  actions = [
    <SettingOutlined key="setting" onClick={() => console.log("1st")} />,
    <EditOutlined key="edit" onClick={() => console.log("2nd")} />,
    <EllipsisOutlined key="ellipsis" onClick={() => console.log("3rd")} />,
  ],
}) => {
  const span = 24 / cardsPerRow;
  elements = [
    {
      title: "value1",
    },
    {
      prop1: "value1",
      prop2: "value2",
      prop3: "value3",
      prop4: "value4",
    },
  ];
  return (
    <>
      {/* <Row gutter={[horizontalGap, 10]}>
        <Col span={span}>
          <div style={{ backgroundColor: "red" }}>adam</div>
        </Col>
        <Col span={span}>
          <div style={{ backgroundColor: "red" }}>adham</div>
        </Col>
        <Col span={span}>
          <div style={{ backgroundColor: "red" }}>mohamed</div>
        </Col>
        <Col span={span}>
          <div style={{ backgroundColor: "red" }}>adam</div>
        </Col>
        <Col span={span}>
          <div style={{ backgroundColor: "red" }}>adham</div>
        </Col>
        <Col span={span}>
          <div style={{ backgroundColor: "red" }}>mohamed</div>
        </Col>
      </Row> */}
      <Row gutter={[horizontalGap, 10]}>
        <Col span={span}>
          <CardComponent
          // title="Card Title"
          // cover={
          //   <img
          //     alt="example"
          //     src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
          //   />
          // }
          // actions={actions}
          >
            <Meta title="Meta title" description="This is the description" />
          </CardComponent>
        </Col>
        <Col span={span}>
          <div style={{ backgroundColor: "red" }}>adham</div>
        </Col>
        <Col span={span}>
          <div style={{ backgroundColor: "red" }}>mohamed</div>
        </Col>
        <Col span={span}>
          <div style={{ backgroundColor: "red" }}>adam</div>
        </Col>
        <Col span={span}>
          <div style={{ backgroundColor: "red" }}>adham</div>
        </Col>
        <Col span={span}>
          <div style={{ backgroundColor: "red" }}>mohamed</div>
        </Col>
      </Row>
    </>
  );
};

export default SearchFilterSortContainer;
