import React from 'react';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Avatar, Card, Space } from 'antd';
import Button from './Button';
import CustomLayout from './CustomLayout';

const actions = [
  <EditOutlined key="edit" />,
  <DeleteOutlined key="delete" />,
];

const Activities = () => {
  // Dummy data for activities, will fetch real data in the future
  const activitiesData = [
    {
      id: 1,
      title: "Activity 1",
      description: "This is the first activity description",
      avatar: "https://api.dicebear.com/7.x/miniavs/svg?seed=1",
    },
    {
      id: 2,
      title: "Activity 2",
      description: "This is the second activity description",
      avatar: "https://api.dicebear.com/7.x/miniavs/svg?seed=2",
    },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <CustomLayout>
        
        <h2>Activities</h2>
                <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'flex-start' }}>
          <Button size={"s"} value={"Create Activity"} rounded={true} />
        </div>

        <Space direction="horizontal" size="middle" style={{ display: 'flex' }}>
          {activitiesData.map((activity) => (
            <Card
              key={activity.id}
              actions={actions}
              style={{ minWidth: 300 }}
            >
              <Card.Meta
                avatar={<Avatar src={activity.avatar} />}
                title={activity.title}
                description={<p>{activity.description}</p>}
              />
            </Card>
          ))}
        </Space>
      </CustomLayout>
    </div>
  );
};

export default Activities;
