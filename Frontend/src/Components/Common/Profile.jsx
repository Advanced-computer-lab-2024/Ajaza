// import React, { useEffect, useState } from "react";
// import { Card, Avatar, Typography, Space, Input, Button, Form, message } from "antd";
// import { UserOutlined, EditOutlined, SaveOutlined, CloseOutlined } from "@ant-design/icons";
// import { jwtDecode } from "jwt-decode";
// import axios from "axios";
// import "./Profile.css";
// import { apiUrl } from "../Common/Constants";


// const { Title } = Typography;

// const Profile = ({ touristData }) => {
//   const [response, setResponse] = useState(null); // Store decoded token or API data
//   const [isEditing, setIsEditing] = useState(false); // Edit mode toggle
//   const [form] = Form.useForm();


//   useEffect(() => {
//     if (touristData) {
//       setResponse(touristData); // Update state when new touristData is received
//     }
//   }, [touristData]);


//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     let decodedToken = null;
//     if (token) {
//       decodedToken = jwtDecode(token);
//       setResponse(decodedToken); // Set initial profile data
//     }

//     // Simulate an API call to fetch profile data if needed
//     // const fetchData = async () => {
//     //   try {
//     //     const urlExtension = `${decodedToken.type}/${decodedToken.id}`;
//     //     const apiResponse = await axios.get(`apiUrl/${urlExtension}`, {
//     //       headers: {
//     //         Authorization: `Bearer ${token}`,
//     //       },
//     //     });
//     //     setResponse(apiResponse.data);
//     //   } catch (error) {
//     //     console.error("Error fetching data:", error);
//     //   }
//     // };

//     // fetchData();
//   }, []);

//   // Handle saving profile changes
//   const handleSave = async (values) => {
//     try {
//       const token = localStorage.getItem("token");
//       const urlExtension = response.id // URL extension for the PATCH request

//       const updatedProfile = { ...values };

//       await axios.patch(`${apiUrl}/${urlExtension}`, updatedProfile, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       setResponse((prev) => ({ ...prev, ...updatedProfile })); // Update the local profile data
//       setIsEditing(false); // Exit edit mode
//       message.success("Profile updated successfully!");
//     } catch (error) {
//       console.error("Error updating profile:", error);
//       message.error("Failed to update profile.");
//     }
//   };

//   // Cancel editing
//   const handleCancel = () => {
//     setIsEditing(false);
//     form.resetFields(); // Reset the form to initial values
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
//         actions={[
//           isEditing ? (
//             <SaveOutlined key="save" onClick={() => form.submit()} />
//           ) : (
//             <EditOutlined key="edit" onClick={() => setIsEditing(true)} />
//           ),
//           isEditing && <CloseOutlined key="cancel" onClick={handleCancel} />,
//         ]}
//       >
//         <Space direction="vertical" align="center" style={{ width: "100%" }}>
//           <Avatar
//             size={120}
//             icon={<UserOutlined />}
//             style={{ backgroundColor: "#87d068" }}
//           />
//           {isEditing ? (
//             <Form
//               form={form}
//               layout="vertical"
//               initialValues={response}
//               onFinish={handleSave}
//               style={{ width: "100%" }}
//             >
//               {Object.entries(response).map(([key, value]) => (
//                 <Form.Item
//                   key={key}
//                   name={key}
//                   label={key.charAt(0).toUpperCase() + key.slice(1)}
//                   // rules={[{ required: key !== "", message: `Please input your ${key}!` }]} // Adjust validation as needed
//                 >
//                   {key === "comments" ? (
//                     <Input.TextArea rows={2} />
//                   ) : (
//                     <Input type={key === "mobile" ? "number" : "text"} />
//                   )}
//                 </Form.Item>
//               ))}
//             </Form>
//           ) : (
//             // Display profile details when not in edit mode
//             response && (
//               <div>
//                 <Title level={2}>{response.name}</Title>
//                 {Object.entries(response).map(([key, value]) => (
//                   <div key={key}>
//                     <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong> {value}
//                   </div>
//                 ))}
//               </div>
//             )
//           )}
//         </Space>
//       </Card>
//     </div>
//   );
// };

// export default Profile;

import React, { useEffect, useState } from "react";
import { Card, Avatar, Typography, Space, Input, Button, Form, message } from "antd";
import { UserOutlined, EditOutlined, SaveOutlined, CloseOutlined } from "@ant-design/icons";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import "./Profile.css";
import { apiUrl } from "../Common/Constants";

const { Title } = Typography;

const Profile = ({ touristData  }) => {
  const [response, setResponse] = useState(null); // Store decoded token or API data
  const [isEditing, setIsEditing] = useState(false); // Edit mode toggle
  const [form] = Form.useForm();

  useEffect(() => {
    if (touristData) {
      setResponse(touristData); // Update state when new touristData is received
      form.setFieldsValue(touristData);
    }
  }, [touristData]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    let decodedToken = null;
    if (token) {
      decodedToken = jwtDecode(token);
      setResponse(decodedToken); // Set initial profile data
    }
  }, []);

  // Handle saving profile changes
  const handleSave = async (values) => {
    try {
      const token = localStorage.getItem("token");
      const urlExtension = response.id; // URL extension for the PATCH request

      const updatedProfile = { ...values };

      await axios.patch(`${apiUrl}/${urlExtension}`, updatedProfile, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setResponse((prev) => ({ ...prev, ...updatedProfile })); // Update the local profile data
      setIsEditing(false); // Exit edit mode
      message.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      message.error("Failed to update profile.");
    }
  };

  // Cancel editing
  const handleCancel = () => {
    setIsEditing(false);
    form.resetFields(); // Reset the form to initial values
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
        actions={[
          isEditing ? (
            <SaveOutlined key="save" onClick={() => form.submit()} />
          ) : (
            <EditOutlined key="edit" onClick={() => setIsEditing(true)} />
          ),
          isEditing && <CloseOutlined key="cancel" onClick={handleCancel} />,
        ]}
      >
        <Space direction="vertical" align="center" style={{ width: "100%" }}>
          <Avatar
            size={120}
            icon={<UserOutlined />}
            style={{ backgroundColor: "#87d068" }}
          />
          {isEditing ? (
            <Form
              form={form}
              layout="vertical"
              initialValues={response}
              onFinish={handleSave}
              style={{ width: "100%" }}
            >
              {Object.entries(response).map(([key, value]) => (
                <Form.Item
                  key={key}
                  name={key}
                  label={key.charAt(0).toUpperCase() + key.slice(1)}
                >
                  {key === "comments" ? (
                    <Input.TextArea rows={2} />
                  ) : (
                    <Input
                      disabled={key === "username" || key === "wallet"} 
                    />
                  )}
                </Form.Item>
              ))}
            </Form>
          ) : (
            // Display profile details when not in edit mode
            response && (
              <div>
                <Title level={2}>{response.name}</Title>
                {Object.entries(response).map(([key, value]) => (
                  <div key={key}>
                    <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong> {value}
                  </div>
                ))}
              </div>
            )
          )}
        </Space>
      </Card>
    </div>
  );
};

export default Profile;
