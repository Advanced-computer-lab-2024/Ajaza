import React from 'react';
import { Card, Avatar, Typography, Space } from 'antd';
import { UserOutlined, EditOutlined} from '@ant-design/icons';
import './Profile.css';

const { Title, Text } = Typography;

const Profile = () => {
  // Dummy data for the profile but soon we get it from a global context variable from the backend and edit it as needed
  const userData = {
    name: "John Doe",
    email: "john.doe@example.com",
    age: 28,
    bio: "Software engineer with 5+ years of experience in web development, passionate about creating efficient and scalable solutions.",
    location: "San Francisco, CA",
  };

  const actions = [
    <EditOutlined key="edit" />,
  ];

  return (
    <div className="profile-page">
      <Card
        style={{
          width: "100%",
          maxWidth: 600,
          margin: "50px auto",
          padding: "20px",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
        }}
        actions={actions}
      >
        <Space direction="vertical" align="center" style={{ width: "100%" }}>
          <Avatar
            size={120}
            icon={<UserOutlined />}
            style={{ backgroundColor: '#87d068' }}
          />
          <Title level={2}>{userData.name}</Title>
          <Text type="secondary">{userData.email}</Text>
          <Text>Age: {userData.age}</Text>
          <Text>{userData.bio}</Text>
          <Text>Location: {userData.location}</Text>
        </Space>
      </Card>
    </div>
  );
};

export default Profile;
