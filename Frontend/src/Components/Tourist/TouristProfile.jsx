// import React, { useEffect, useState } from "react";
// import Profile from "../Common/Profile"; 
// import axios from "axios";
// import { message } from "antd";
// import { apiUrl } from "../Common/Constants";
// import { useParams } from "react-router-dom";

// const TouristProfile = () => {
//   const [touristData, setTouristData] = useState(null); 
//   const { id } = useParams();


//   useEffect(() => {
//     const fetchProfile = async () => {
//       console.log(id);

//       try {
//         const response = await axios.get(`http://localhost:5000/tourist/touristReadProfile/${id}`);

//         const { username, email, mobile , points , wallet , badge , occupation , dob , nationality} = response.data; // Only select fields you want to display
//         setTouristData({ username, email, mobile, points , wallet , badge , occupation ,dob , nationality}); // Pass selected fields to state

//       } catch (error) {
//         console.error('Error fetching tourist profile:', error);
//       }
//     };

//     fetchProfile(); 
//   }, [id]); 



//   return (
//     <div>
//       {touristData ? (
//         <Profile touristData={touristData} />  
//       ) : (
//         <div>No tourist data available</div>
//       )}
//     </div>
//   );
// };

// export default TouristProfile;


import React, { useEffect, useState } from "react";
import Profile from "../Common/Profile";
import axios from "axios";
import { message } from "antd";
import { useParams } from "react-router-dom";

const TouristProfile = () => {
  const [touristData, setTouristData] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/tourist/touristReadProfile/${id}`);
        const { username, email, mobile, points, wallet, badge, occupation, dob, nationality } = response.data;
        setTouristData({ username, email, mobile, points, wallet, badge, occupation, dob, nationality });
      } catch (error) {
        console.error('Error fetching tourist profile:', error);
      }
    };

    fetchProfile();
  }, [id]);

  // Handle saving profile changes
  // const handleUpdate = async (values) => {
  //   try {
  //     console.log('didnt update db');
  //     const response = await axios.patch(`http://localhost:5000/tourist/touristUpdateProfile/${id}`, values);
  //     message.success('Profile updated successfully!');
  //     setTouristData(response.data); // Update local state with new values
  //   } catch (error) {
  //     console.error('Error updating profile:', error);
  //     message.error('Failed to update profile.');
  //   }
  // };

  return (
    <div>
      {touristData ? (
        <Profile touristData={touristData} />
      ) : (
        <div>No tourist data available</div>
      )}
    </div>
  );
};

export default TouristProfile;
