import React from 'react';
import { EditOutlined, DeleteOutlined} from '@ant-design/icons';
import { Avatar, Card, Space } from 'antd';
import Button from './Button';
import  CustomLayout  from './CustomLayout';

const actions = [
  <EditOutlined key="edit" />,
  <DeleteOutlined  key="delete" />,
];

const Itineraries = () => {
  // Dummy data for itineraries, will fetch real data in the future
  const itinerariesData = [
    {
      id: 1,
      title: "Itinerary 1",
      description: "This is the first itinerary description",
      avatar: "https://api.dicebear.com/7.x/miniavs/svg?seed=1",
    },
    {
      id: 2,
      title: "Itinerary 2",
      description: "This is the second itinerary description",
      avatar: "https://api.dicebear.com/7.x/miniavs/svg?seed=2",
    },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <CustomLayout>
      <h2>Itineraries</h2>
      <div style={{ marginBottom: '20px',display: 'flex', justifyContent: 'flex-start'}}>
        <Button size={"s"} value={"Create Itinerary"} rounded={true} />
      </div>

      <Space direction="horizontal" size="middle" style={{ display: 'flex' }}>
        {itinerariesData.map((itinerary) => (
          <Card
            key={itinerary.id}
            actions={actions}
            style={{ minWidth: 300 }}
          >
            <Card.Meta
              avatar={<Avatar src={itinerary.avatar} />}
              title={itinerary.title}
              description={<p>{itinerary.description}</p>}
            />
          </Card>
        ))}
      </Space>
      </CustomLayout>
    </div>
  );
};

export default Itineraries;
