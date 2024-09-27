import React from 'react';
import { Card, Avatar, Typography, Space } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import './Profile.css';

const { Title, Text } = Typography;

const Profile = () => {
  // Dummy data for the profile but soon we get it from a globle context variable from the backend
  const userData = {
    name: "John Doe",
    email: "john.doe@example.com",
    age: 28,
    bio: "Software engineer with 5+ years of experience in web development, passionate about creating efficient and scalable solutions.",
    location: "San Francisco, CA",
  };

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







// const Profile = () => {
//   const user = {
//     name: 'John Doe',
//     email: 'john.doe@example.com',
//     bio: 'This is a sample bio for the user profile page.'
//   };

//   return (
//     <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
//       <Card 
//         title="User Profile"
//         style={{ width: 300 }}
//       >
//         <p><strong>Name:</strong> {user.name}</p>
//         <p><strong>Email:</strong> {user.email}</p>
//         <p><strong>Bio:</strong> {user.bio}</p>
//       </Card>
//     </div>
//   );
// };