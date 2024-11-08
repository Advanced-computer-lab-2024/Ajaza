import React, { useEffect, useState } from "react";
import {
  Card,
  Avatar,
  Typography,
  Space,
  Input,
  Button,
  Form,
  message,
  Modal,
  Flex,
  Menu,
  Dropdown,
} from "antd";
import {
  UserOutlined,
  EditOutlined,
  SaveOutlined,
  CloseOutlined,
  DeleteOutlined,
  MailOutlined,
  WarningFilled,
} from "@ant-design/icons";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import "./Profile.css";
import { apiUrl } from "../Common/Constants";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;

const Profile = () => {
  const [response, setResponse] = useState(null); // Store decoded token or API data
  const [userDetails, setUserDetails] = useState(null); // Store user details from token
  const [isEditing, setIsEditing] = useState(false); // Edit mode toggle
  const [form] = Form.useForm();
  const [role, setRole] = useState(""); // Store user role
  const [pending, setPending] = useState(false); // Store pending status
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false); // State to toggle password form visibility
  const [logo, setLogo] = useState("http://localhost:3000/uploads/logo.svg"); // Store logo image
  const [photo, setPhoto] = useState("http://localhost:3000/uploads/logo.svg"); // Store photo image
  const navigate = useNavigate(); // useNavigate hook for programmatic navigation

  useEffect(() => {
    const token = localStorage.getItem("token");
    let decodedToken = null;
    if (token) {
      decodedToken = jwtDecode(token);
      setResponse(decodedToken); // Set initial profile data
      setRole(decodedToken.role); // Set user role

      // Extract user details from the token
      const userDetails = decodedToken.userDetails;
      setUserDetails(userDetails);
      setPending(userDetails.pending); // Set pending status from userDetails

      // Populate form fields with userDetails values
      form.setFieldsValue({
        ...userDetails,
        "companyProfile.name": userDetails?.companyProfile?.name || "",
        "companyProfile.desc": userDetails?.companyProfile?.desc || "",
        "companyProfile.location": userDetails?.companyProfile?.location || "",
        dob: userDetails?.dob ? formatDate(userDetails.dob) : "",
        joined: userDetails?.joined ? formatDate(userDetails.joined) : "",
      });

      if (userDetails.logo) {
        const logoPath = `/uploads/${userDetails.logo}.jpg`;
        setLogo(logoPath);
      }
      if (userDetails.photo) {
        const photoPath = `/uploads/${userDetails.photo}.jpg`;
        setPhoto(photoPath);
      }
    }
  }, [form]);

  // Handle saving profile changes
  const handleSave = async (values) => {
    try {
      const token = localStorage.getItem("token");
      let urlExtension;

      // Determine the URL extension based on the user's role
      if (role === "guide") {
        urlExtension = `guide/updateGuideProfile/${response.userId}`;
      } else if (role === "advertiser") {
        urlExtension = `advertiser/advertiserUpdateProfile/${response.userId}`;
      } else if (role === "tourist") {
        urlExtension = `tourist/touristUpdateProfile/${response.userId}`;
      } else if (role === "seller") {
        urlExtension = `seller/${response.userId}`;
      } else if (role == "governor") {
        urlExtension = `governor/${response.userId}`;
      } else if (role == "admin") {
        urlExtension = `admin/${response.userId}`;
      }

      // Extract companyProfile fields from values
      const {
        "companyProfile.name": name,
        "companyProfile.desc": desc,
        "companyProfile.location": location,
        previousWork,
        ...rest
      } = values;
      const updatedProfile = {
        ...rest,
        companyProfile: { name, desc, location },
        previousWork: previousWork ? previousWork.split(" ") : [],
      };

      // Make API request to update profile
      const apiResponse = await axios.patch(
        `${apiUrl}${urlExtension}`,
        updatedProfile,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Extract the new JWT token from the API response
      const newToken = apiResponse.data.token;

      // Check if newToken is valid
      if (!newToken || typeof newToken !== "string") {
        throw new Error("Invalid token returned from API");
      }

      // Update the token in localStorage
      localStorage.setItem("token", newToken);

      // Decode the new token and update user details locally
      const decodedToken = jwtDecode(newToken);
      setResponse(decodedToken);
      setUserDetails(decodedToken.userDetails); // Update the local profile data
      form.setFieldsValue(decodedToken.userDetails); // Update form initial values

      setIsEditing(false); // Exit edit mode
      message.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      message.error("Failed to update profile.");
    }
  };

  // Handle entering edit mode
  const handleEdit = () => {
    setIsEditing(true);

    // Ensure the form is populated with the latest user details
    if (userDetails) {
      form.setFieldsValue({
        ...userDetails,
        "companyProfile.name": userDetails?.companyProfile?.name || "",
        "companyProfile.desc": userDetails?.companyProfile?.desc || "",
        "companyProfile.location": userDetails?.companyProfile?.location || "",
        previousWork: userDetails.previousWork
          ? userDetails.previousWork.join(" ")
          : "",
        dob: userDetails?.dob ? formatDate(userDetails.dob) : "",
        joined: userDetails?.joined ? formatDate(userDetails.joined) : "",
      });
    }
  };

  // Cancel editing
  const handleCancel = () => {
    setIsEditing(false);
    form.setFieldsValue(userDetails); // Reset the form to initial values
  };

  // Utility function to format keys
  const formatKey = (key) => {
    // Remove keys like 'id' and '_id'
    if (key === "id" || key === "_id") {
      return null;
    }

    // Replace dots with spaces
    key = key.replace(/\./g, " ");

    // Convert camelCase to separate words with spaces
    key = key.replace(/([a-z])([A-Z])/g, "$1 $2");

    // Capitalize the first letter of each word
    key = key.replace(/\b\w/g, (char) => char.toUpperCase());

    return key;
  };

  // Format date to remove time
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const confirmDelete = async (id) => {
    Modal.confirm({
      title: "Are you sure? This action is irreversible",
      content: "Do you want to request deletion of your account?",
      okText: "Delete",
      okType: "danger",
      icon: <WarningFilled style={{ color: "#ff4d4f" }} />,
      onOk: async () => {
        try {
          console.log(`${apiUrl}${role}/requestDeletion/${userDetails._id}`);

          const response = await axios.patch(
            `${apiUrl}${role}/requestDeletion/${userDetails._id}`
          );

          navigate("/");
          localStorage.removeItem("token");

          message.success("Deletion Request Sent!");
        } catch (error) {
          message.error(error);
        }
      },
    });
  };

  const [preferences, setPreferences] = useState({
    preferredTags: [],
    preferredCategories: [],
  });
  const [tags, setTags] = useState([]); 
  const additionalTags = [
    "Monuments", "Museums", "Religious Sites", "Palaces/Castles",
    "1800s-1850s", "1850s-1900s", "1900s-1950s", "1950s-2000s"
  ];
  const [categories, setCategories] = useState([]); 
  const token = localStorage.getItem("token");
  let decodedToken = null;
  if (token) {
    decodedToken = jwtDecode(token);
  }
  const userid = decodedToken ? decodedToken.userId : null;
  const touristId = userid;

  //req39
  useEffect(() => {

  
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${apiUrl}tourist/touristReadProfile/${touristId}`);
        const { preferredTags, preferredCategories } = response.data;
        setPreferences({ preferredTags, preferredCategories });
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };
    fetchProfile();

  const fetchTags = async () => {
    try {
      const response = await axios.get(`${apiUrl}tag`);
      const fetchedTags = response.data.map(tag => tag.tag);
      setTags([...fetchedTags, ...additionalTags]); 
    } catch (error) {
      console.error('Error fetching tags:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${apiUrl}category`);
      setCategories(response.data.map(category => category.category)); 
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  fetchTags();
  fetchCategories();
},[]);


  const handleTagsChange = async (tag) => {
    const updatedTags = preferences.preferredTags.includes(tag)
      ? preferences.preferredTags.filter(t => t !== tag)
      : [...preferences.preferredTags, tag];

    setPreferences(prev => ({ ...prev, preferredTags: updatedTags }));

    try {
      await axios.patch(`${apiUrl}tourist/${touristId}`, {
        preferredTags: updatedTags,
        preferredCategories: preferences.preferredCategories,
      });
      message.success('Tags updated');
    } catch (error) {
      console.error('Error saving tags:', error);
      message.error('Failed to update tags');
    }
  };

  const handleCategoriesChange = async (category) => {
    const updatedCategories = preferences.preferredCategories.includes(category)
      ? preferences.preferredCategories.filter(c => c !== category)
      : [...preferences.preferredCategories, category];

    setPreferences(prev => ({ ...prev, preferredCategories: updatedCategories }));
    try {
      await axios.patch(`${apiUrl}tourist/${touristId}`, {
        preferredTags: preferences.preferredTags,
        preferredCategories: updatedCategories,
      });
      message.success('Categories updated');
    } catch (error) {
      console.error('Error saving categories:', error);
      message.error('Failed to update categories');
    }
  };

  const preferencesMenu = ( 
    <Menu>
      <Menu.SubMenu key="preferences"  title="Preferences">
      <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
        <Menu.ItemGroup title="Tags">
        {tags.map(tag => (
            <Menu.Item
              key={tag}
              onClick={() => handleTagsChange(tag)}
              style={{
                backgroundColor: preferences.preferredTags.includes(tag) ? '#e6f7ff' : 'white',
              }}
            >
              {tag}
            </Menu.Item>
          ))}
        </Menu.ItemGroup>
        <Menu.ItemGroup title="Categories">
        {categories.map(category => (
            <Menu.Item
              key={category}
              onClick={() => handleCategoriesChange(category)}
              style={{
                backgroundColor: preferences.preferredCategories.includes(category) ? '#e6f7ff' : 'white',
              }}
            >
              {category}
            </Menu.Item>
          ))}
        </Menu.ItemGroup>
        </div>
      </Menu.SubMenu>
    </Menu>
  );




  return (
    <>
      <Flex justify="right">
        <Button
          style={{ marginLeft: "auto" }}
          type="primary"
          danger
          icon={<DeleteOutlined />}
          onClick={() => confirmDelete()}
        ></Button>
      </Flex>

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
            !pending && <EditOutlined key="edit" onClick={handleEdit} />
          ),
          isEditing && <CloseOutlined key="cancel" onClick={handleCancel} />,
        ]}
      >
        <Space direction="vertical" align="center" style={{ width: "100%" }}>
          {role === "tourist" && (
            <Avatar
              size={120}
              icon={<UserOutlined />}
              style={{ backgroundColor: "#87d068" }}
            />
          )}
            {role === "seller" && (
                <div>
                <img src={logo} alt="Logo" style={{ width: '100px', height: '100px' }} />
                </div>
            )}
            {role === "advertiser" && (
                <div>
                <img src={logo} alt="Logo" style={{ width: '100px', height: '100px' }} />
                </div>
            )}
            {role === "guide" && photo && (
                <div>
                <img src={photo} alt="Photo" style={{ width: '100px', height: '100px' }} />
                </div>
            )}
          {isEditing ? (
            <Form
              form={form}
              layout="vertical"
              initialValues={form.getFieldsValue()}
              onFinish={handleSave}
              style={{ width: "100%" }}
            >
              {/* Form fields for advertiser */}
              {role === "advertiser" && (
                <>
                  <Form.Item name="email" label="Email">
                    <Input />
                  </Form.Item>
                  <Form.Item name="link" label="Link">
                    <Input />
                  </Form.Item>
                  <Form.Item
                    name="hotline"
                    label="Hotline"
                    rules={[
                      {
                        pattern: /^\d+$/,
                        message: "Enter valid hotline",
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item>
                    <Button
                      name="Change Password"
                      style={{ width: 150 }}
                      onClick={() => navigate("/advertiser/change-password")} // Redirect to password change page
                    >
                      Change Password
                    </Button>
                  </Form.Item>
                  {/* Company Profile fields */}
                  <Form.Item
                    name="companyProfile.name"
                    label="Company Profile Name"
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    name="companyProfile.desc"
                    label="Company Profile Description"
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    name="companyProfile.location"
                    label="Company Profile Location"
                  >
                    <Input />
                  </Form.Item>
                </>
              )}

              {/* Form fields for guide */}
              {role === "guide" && (
                <>
                  <Form.Item name="email" label="Email">
                    <Input />
                  </Form.Item>
                  <Form.Item
                    name="mobile"
                    label="Mobile"
                    rules={[
                      {
                        required: true,
                        message: "Please input your mobile number!",
                      },
                      { len: 13, message: "Mobile number must be 13 digits!" },
                      {
                        pattern: /^\+20\d{10}$/,
                        message: "Mobile number must start with +20",
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    name="yearsOfExperience"
                    label="Years of Experience"
                  >
                    <Input type="number" />
                  </Form.Item>
                  <Form.Item name="previousWork" label="Previous Work">
                    <Input.TextArea />
                  </Form.Item>
                  <Form.Item>
                    <Button
                      name="Change Password"
                      style={{ width: 150 }}
                      onClick={() => navigate("/guide/change-password")} // Redirect to password change page
                    >
                      Change Password
                    </Button>
                  </Form.Item>
                </>
              )}

              {/* Form fields for tourist */}
              {role === "tourist" && (
                <>
                  <Form.Item name="email" label="Email">
                    <Input />
                  </Form.Item>
                  <Form.Item
                    name="mobile"
                    label="Mobile"
                    rules={[
                      {
                        required: true,
                        message: "Please input your mobile number!",
                      },
                      { len: 13, message: "Mobile number must be 13 digits!" },
                      {
                        pattern: /^\+20\d{10}$/,
                        message: "Mobile number must start with +20",
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item name="nationality" label="Nationality">
                    <Input />
                  </Form.Item>
                  <Form.Item name="occupation" label="Occupation">
                    <Input />
                  </Form.Item>
                  <div>
                    <div>
                      <Form.Item>
                        <Button
                          name="Change Password"
                          style={{ width: 150 }}
                          onClick={() => navigate("/tourist/change-password")} // Redirect to password change page
                        >
                          Change Password
                        </Button>
                      </Form.Item>
                    </div>
                  </div>
                </>
              )}

              {/* Form fields for seller */}
              {role === "seller" && (
                <>
                  <Form.Item name="name" label="Name">
                    <Input />
                  </Form.Item>
                  <Form.Item name="desc" label="Description">
                    <Input />
                  </Form.Item>
                  <Form.Item>
                    <Button
                      name="Change Password"
                      style={{ width: 150 }}
                      onClick={() => navigate("/seller/change-password")} // Redirect to password change page
                    >
                      Change Password
                    </Button>
                  </Form.Item>
                </>
              )}
              {/*Form fields for governor */}
              {role === "governor" && (
                <>
                  <Form.Item name="name" label="Name">
                    <Input />
                  </Form.Item>
                  <Form.Item name="desc" label="Description">
                    <Input />
                  </Form.Item>
                  <Form.Item>
                    <Button
                      name="Change Password"
                      style={{ width: 150 }}
                      onClick={() => navigate("/governor/change-password")} // Redirect to password change page
                    >
                      Change Password
                    </Button>
                  </Form.Item>
                </>
              )}
              {/*Form fields for admin */}
              {role === "admin" && (
                <>
                  <Form.Item name="name" label="Name">
                    <Input />
                  </Form.Item>
                  <Form.Item name="desc" label="Description">
                    <Input />
                  </Form.Item>
                  <Form.Item>
                    <Button
                      name="Change Password"
                      style={{ width: 150 }}
                      onClick={() => navigate("/admin/change-password")} // Redirect to password change page
                    >
                      Change Password
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form>
          ) : (
            // Display profile details (non-edit view)
            userDetails && (
                <div>
                {role === "guide" && (
                  <>
                  <a href="image">
                      <EditOutlined />
                    </a>
                  <Title level={2}>{userDetails.username}</Title>
                <div>
                  <strong>Email: </strong>
                  <span>{userDetails.email}</span>
                </div>
                    {userDetails.mobile && (
                      <div>
                        <strong>Mobile: </strong>
                        <span>{userDetails.mobile}</span>
                      </div>
                    )}
                    {userDetails.yearsOfExperience && (
                      <div>
                        <strong>Years of Experience: </strong>
                        <span>{userDetails.yearsOfExperience}</span>
                      </div>
                    )}
                    {Array.isArray(userDetails.previousWork) &&
                      userDetails.previousWork.length > 0 && (
                        <div>
                          <strong>Previous Work: </strong>
                          <span>{userDetails.previousWork.join(", ")}</span>
                        </div>
                      )}
                  </>
                )}
                {role === "advertiser" && (
                  <>
                  <a href="image">
                      <EditOutlined />
                    </a>
                  <Title level={2}>{userDetails.username}</Title>
                <div>
                  <strong>Email: </strong>
                  <span>{userDetails.email}</span>
                </div>
                    <div>
                      <strong>Link: </strong>
                      <span>{userDetails.link}</span>
                    </div>
                    <div>
                      <strong>Hotline: </strong>
                      <span>{userDetails.hotline}</span>
                    </div>
                  </>
                )}
                {role === "tourist" && (
                  <>

  

                   {/* Preferences Menu */}
                   <Dropdown 
                    overlay={preferencesMenu}
                    trigger={['click']}
                    dropdownRender={(menu) => (
                      <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                        {menu}
                      </div>
                    )}
                  >
                    <Button style={{
                      position: "absolute",
                      top: 20,
                      right: 20,
                      border: "none",
                      background: "none",
                      color: "#1890ff",
                      fontSize: "16px",
                    }}>
                      View and Edit Preferences 
                    </Button>
                  </Dropdown>
                  <Title level={2}>{userDetails.username}</Title>
                <div>
                  <strong>Email: </strong>
                  <span>{userDetails.email}</span>
                </div>
                    {userDetails.mobile && (
                      <div>
                        <strong>Mobile: </strong>
                        <span>{userDetails.mobile}</span>
                      </div>
                    )}
                    {userDetails.nationality && (
                      <div>
                        <strong>Nationality: </strong>
                        <span>{userDetails.nationality}</span>
                      </div>
                    )}
                    {userDetails.dob && (
                      <div>
                        <strong>Date of Birth: </strong>
                        <span>{formatDate(userDetails.dob)}</span>
                      </div>
                    )}
                    {userDetails.occupation && (
                      <div>
                        <strong>Occupation: </strong>
                        <span>{userDetails.occupation}</span>
                      </div>
                    )}
                    {userDetails.joined && (
                      <div>
                        <strong>Joined: </strong>
                        <span>{formatDate(userDetails.joined)}</span>
                      </div>
                    )}
                    {userDetails.wallet !== undefined && (
                      <div>
                        <strong>Wallet: </strong>
                        <span>{userDetails.wallet || 0}</span>
                      </div>
                    )}
                    {userDetails.totalPoints !== undefined && (
                      <div>
                        <strong>Total Points: </strong>
                        <span>{userDetails.totalPoints || 0}</span>
                      </div>
                    )}

                    {userDetails.badge && (
                      <div>
                        <strong>Badge: </strong>
                        <span>{userDetails.badge}</span>
                      </div>
                    )}
                  </>
                )}
                {role === "seller" && (
                  <>
                  <a href="image">
                      <EditOutlined />
                    </a>
                  <Title level={2}>{userDetails.username}</Title>
                <div>
                  <strong>Email: </strong>
                  <span>{userDetails.email}</span>
                </div>
                    {userDetails.name && (
                      <div>
                        <strong>Name: </strong>
                        <span>{userDetails.name}</span>
                      </div>
                    )}
                    {userDetails.desc && (
                      <div>
                        <strong>Description: </strong>
                        <span>{userDetails.desc}</span>
                      </div>
                    )}
                  </>
                )}
              </div>
            )
          )}
        </Space>
      </Card>
    </>
  );
};

export default Profile;
