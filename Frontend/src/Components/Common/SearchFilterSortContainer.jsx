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
  elements, // array of objects to be displayed
  propMapping,
  // This is for your own Card Component !!!!!!!!!!!!!!!!!!!! (IF PASSED A CARD COMPONENT)
  // Objects will be
  //   {...all fields and their values,
  //     propName1: field name to use
  //     propName2: field name to use
  //     propName3: field name to use
  //     propName4: field name to use
  // } eg:
  // const propsMapping = {
  //   size: 'btnSize',
  //   style: 'btnStyle',
  //   rounded: 'roundShape',
  //   value: 'label',
  //   onClick: 'action',
  //   disabled: 'isDisabled',
  //   loading: 'isLoading',
  //   htmlType: 'type'
  // };
  constProps, // props that are consistent throughout the components
  cardsPerRow = 3,
  horizontalGap = 30,
  verticalGap = 30,
  loading,
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
      <Row gutter={[horizontalGap, verticalGap]}>
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
