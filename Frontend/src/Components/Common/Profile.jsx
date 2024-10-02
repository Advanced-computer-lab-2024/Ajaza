import React from "react";
import { Card, Avatar, Typography, Space } from "antd";
import { UserOutlined, EditOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { apiUrl } from "./Constants";
import "./Profile.css";

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
  const [response, setResponse] = useState(null);
  const actions = [<EditOutlined key="edit" />];

  useEffect(() => {
    const token = localStorage.getItem("token");
    let decodedToken = null;
    if (token) {
      decodedToken = jwtDecode(token);
    }

    const urlExtension = `${decodedToken.type}/${decodedToken.id}`;

    const fetchData = async () => {
      const body = {
        id: "123",
        // Add more key-value pairs as needed
      };

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json", // Example header, adjust as needed
        },
      };
      try {
        const apiResponse = await axios.get(
          apiUrl + urlExtension,
          body,
          config
        );
        console.log(response);

        if (apiResponse.status === 200) {
          setResponse(apiResponse.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

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
            style={{ backgroundColor: "#87d068" }}
          />
          {/* <Title level={2}>{userData.name}</Title>
          {response.map}
          <Text type="secondary">{userData.email}</Text>
          <Text>Age: {userData.age}</Text>
          <Text>{userData.bio}</Text>
          <Text>Location: {userData.location}</Text> */}
          {Object.entries(userData).map(([key, value]) => (
            <div key={key}>
              <strong>{key}:</strong> {value}
            </div>
          ))}
        </Space>
      </Card>
    </div>
  );
};

export default Profile;

// THIS IS USING API REQUESTS!!!!!!!!!!!!!!!!!!!!!!!!!!!
// import React, { useEffect, useState } from 'react';
// import { Card, Avatar, Typography, Space } from 'antd';
// import { UserOutlined, EditOutlined } from '@ant-design/icons';
// import { useUser } from './UserContext';
// import { useNavigate } from 'react-router-dom'; // For route navigation
// import './Profile.css';

// const { Title, Text } = Typography;

// const Profile = () => {
//   const navigate = useNavigate();
//   const { userData } = useUser(); // Get user data from context
//   const [profileData, setProfileData] = useState(null); // State for profile data

//   // Fetch user data based on role
//   const fetchUserData = async () => {
//     let response;

//     // Check user role and fetch data accordingly
//     if (userData.role === "Tourist") {
//       response = await fetch(`/api/tourist/${userData.id}`);
//     } else if (userData.role === "Tour Guide") {
//       response = await fetch(`/api/tour-guide/${userData.id}`);
//     } else {
//       console.error("Unknown user role");
//       return;
//     }

//     if (response.ok) {
//       const data = await response.json();
//       setProfileData(data); // Store the fetched data
//     } else {
//       console.error("Failed to fetch user data");
//     }
//   };

//   // Call fetchUserData when component mounts
//   useEffect(() => {
//     fetchUserData();
//   }, [userData]);

//   const handleEditClick = () => {
//     if (userData.role === "Tourist") {
//       navigate(`/tourist/${userData.id}/edit`);
//     } else if (userData.role === "Tour Guide") {
//       navigate(`/tour-guide/${userData.id}/edit`);
//     }
//   };

//   const actions = [
//     <EditOutlined key="edit" onClick={handleEditClick} />,
//   ];

//   if (!profileData) return <div>Loading...</div>; // Loading state

//   return (
//     <div className="profile-page">
//       <Card
//         style={{
//           width: "100%",
//           maxWidth: 600,
//           margin: "50px auto",
//           padding: "20px",
//           boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
//         }}
//         actions={actions}
//       >
//         <Space direction="vertical" align="center" style={{ width: "100%" }}>
//           <Avatar
//             size={120}
//             icon={<UserOutlined />}
//             style={{ backgroundColor: '#87d068' }}
//           />
//           <Title level={2}>{profileData.name}</Title>
//           <Text type="secondary">{profileData.email}</Text>
//           {userData.role === "Tourist" && <Text>Destination: {profileData.destination}</Text>}
//           {userData.role === "Tour Guide" && <Text>Activity: {profileData.activity || "Not specified"}</Text>}
//         </Space>
//       </Card>
//     </div>
//   );
// };

// export default Profile;

// THIS IS USING THE GLOBAL CONTEXT VARIABLE DIRECTLY BUT HOW WILL I DISPLAY THE DIFFERENT ATTRTIUBES OF DIFFERENT USERS??
// import React, { useContext } from 'react';
// import { Card, Avatar, Typography, Space } from 'antd';
// import { UserOutlined, EditOutlined } from '@ant-design/icons';
// import { UserContext } from './UserContext'; // Import the context

// const { Title, Text } = Typography;

// const Profile = () => {
//   const { userData } = useContext(UserContext); // Access the user data from context
//   const userType = userData?.type; // Get the user type

//   const handleEdit = () => {
//     // Redirect to the edit route based on user type
//     if (userType === 'tour_guide') {
//       window.location.href = '/edit/tour_guide';
//     } else if (userType === 'tourist') {
//       window.location.href = '/edit/tourist';
//     }
//   };

//   return (
//     <div className="profile-page">
//       <Card
//         style={{
//           width: "100%",
//           maxWidth: 600,
//           margin: "50px auto",
//           padding: "20px",
//           boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
//         }}
//         actions={[<EditOutlined key="edit" onClick={handleEdit} />]}
//       >
//         <Space direction="vertical" align="center" style={{ width: "100%" }}>
//           <Avatar
//             size={120}
//             icon={<UserOutlined />}
//             style={{ backgroundColor: '#87d068' }}
//           />
//           <Title level={2}>{userData?.name}</Title>
//           <Text type="secondary">{userData?.email}</Text>
//           {userType === 'tour_guide' && (
//             <>
//               <Text>Activity: {userData?.activity}</Text>
//               {/* Be cautious about displaying sensitive information like passwords */}
//             </>
//           )}
//           {userType === 'tourist' && (
//             <>
//               <Text>Destination: {userData?.destination}</Text>
//               <Text>Travel History: {userData?.travelHistory}</Text>
//             </>
//           )}
//         </Space>
//       </Card>
//     </div>
//   );
// };

// export default Profile;
