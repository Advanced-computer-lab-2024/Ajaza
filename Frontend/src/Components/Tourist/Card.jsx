

import React from 'react';
import { Card } from 'antd';

export const CardTemp = ({ profileData }) => {
  console.log(profileData);
  
  return (
    <div>
      <Card
        title={`Profile of ${profileData.username}`} 
        bordered={false}
        style={{ width: 300, margin: '20px auto' }}
      >
        <p><strong>Username:</strong> {profileData.username}</p>
        <p><strong>Email:</strong> {profileData.email}</p>
        <p><strong>Mobile:</strong> {profileData.mobile}</p>
        <p><strong>Points:</strong> {profileData.points}</p>
        <p><strong>Wallet:</strong> ${profileData.wallet}</p>
        <p><strong>Badge:</strong> Level {profileData.badge}</p>
        <p><strong>Occupation:</strong> {profileData.occupation}</p>
        <p><strong>Date of Birth:</strong> {new Date(profileData.dob).toLocaleDateString()}</p>
        <p><strong>Nationality:</strong> {profileData.nationality}</p>


    
      </Card>
    </div>
  );
};

export default CardTemp;
