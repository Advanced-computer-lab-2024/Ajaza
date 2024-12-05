import React, { useEffect, useState } from "react";
import {
  Card,
  Avatar,
  Typography,
  Space,
  Input,
  InputNumber,
  Button,
  Form,
  message,
  Modal,
  Flex,
  Menu,
  Dropdown,
  Row, 
  Col,
  Tooltip,
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
import { apiUrl, getSetNewToken } from "../Common/Constants";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useCurrency } from "../Tourist/CurrencyContext";
import LogoutIcon from '@mui/icons-material/Logout';
import SelectCurrency from "../Tourist/SelectCurrency";
import CustomButton from "./CustomButton";
const { Title } = Typography;

const currencyRates = {
  AED: 3.6725,
  ARS: 1004.0114,
  AUD: 1.5348,
  BDT: 110.5,
  BHD: 0.376,
  BND: 1.3456,
  BRL: 5.8149,
  CAD: 1.3971,
  CHF: 0.8865,
  CLP: 973.6481,
  CNY: 7.2462,
  COP: 4389.3228,
  CZK: 24.2096,
  DKK: 7.1221,
  EGP: 48.58,
  EUR: 0.9549,
  GBP: 0.7943,
  HKD: 7.7825,
  HUF: 392.6272,
  IDR: 15911.807,
  ILS: 3.7184,
  INR: 84.5059,
  JPY: 154.4605,
  KRW: 1399.323,
  KWD: 0.3077,
  LKR: 291.0263,
  MAD: 10.5,
  MXN: 20.4394,
  MYR: 4.4704,
  NOK: 11.0668,
  NZD: 1.7107,
  OMR: 0.385,
  PHP: 58.9091,
  PKR: 279.0076,
  PLN: 4.1476,
  QAR: 3.64,
  RUB: 101.2963,
  SAR: 3.75,
  SEK: 11.063,
  SGD: 1.3456,
  THB: 34.7565,
  TRY: 34.5345,
  TWD: 32.5602,
  UAH: 36.9,
  USD: 1,
  VND: 24000.0,
  ZAR: 18.0887,
};

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
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [formDelivery] = Form.useForm();
  const [addresses, setAddresses] = useState([]);
  const navigate = useNavigate(); // useNavigate hook for programmatic navigation
  const { currency , setCurrency } = useCurrency();
  const [walletConverted, setWalletConverted] = useState(0);
  const [points, setPoints] = useState(0);
  const [wallet, setWallet] = useState(0);
  const [loading, setLoading] = useState(false);

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
      setAddresses(userDetails.deliveryAddresses || []);

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

  useEffect(() => {
    if (userDetails?.wallet !== undefined && currency) {
      const convertedValue = (userDetails.wallet * (currencyRates[currency] || 1)).toFixed(2);
      setWalletConverted(convertedValue);
    }
  }, [userDetails, currency]);


  const handleCurrencyChange = (selectedCurrency) => {
    setCurrency(selectedCurrency);
  };
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

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancelDelivery = () => {
    formDelivery.resetFields();
    setIsModalVisible(false);
  };

  const handleAddAddress = async (values) => {

    const response = await axios.post(
      `${apiUrl}tourist/address/${userDetails._id}`,
      values,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if(response.status == 200) {
      const newToken = response.data.token;

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

      message.success("Delivery address added successfully");  
      setAddresses([...addresses, values]);
    } else {
      message.error("An error has occurred. Please try again later.")
    }

    formDelivery.resetFields();
    setIsModalVisible(false);
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
          // console.log(`${apiUrl}${role}/requestDeletion/${userDetails._id}`);

          const response = await axios.patch(
            `${apiUrl}${role}/requestDeletion/${userDetails._id}`
          );

          navigate("/");
          localStorage.removeItem("token");

          message.success("Deletion Request Sent!");
        } catch (error) {
          message.error(error?.response?.data?.message);
        }
      },
    });
  };

  const confirmLogOut = async (id) => {
    Modal.confirm({
      title: "Are you sure you want to log out?",
      // content: "This action is irreversable",
      okText: "Log Out",
      okType: "danger",
      icon: <WarningFilled style={{ color: "#ff4d4f" }} />,
      onOk: () => {
        localStorage.removeItem("token");
        localStorage.removeItem("selectedMenuKey");
        message.success("Logged Out");
        navigate("/");
      },
    });
  };

  const [preferences, setPreferences] = useState({
    preferredTags: [],
    preferredCategories: [],
  });
  const [tags, setTags] = useState([]);
  const additionalTags = [
    "Monuments",
    "Museums",
    "Religious Sites",
    "Palaces/Castles",
    "1800s-1850s",
    "1850s-1900s",
    "1900s-1950s",
    "1950s-2000s",
  ];
  const [categories, setCategories] = useState([]);
  const token = localStorage.getItem("token");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [openKeys, setOpenKeys] = useState(["preferences"]);
  const [open, setOpen] = useState(false); //for submenu
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
        const response = await axios.get(
          `${apiUrl}tourist/touristReadProfile/${touristId}`
        );
        const { preferredTags, preferredCategories , wallet , points } = response.data;
        setPreferences({ preferredTags, preferredCategories });
        setWallet(wallet);
        setPoints(points);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };
    fetchProfile();

    const fetchTags = async () => {
      try {
        const response = await axios.get(`${apiUrl}tag`);
        const fetchedTags = response.data.map((tag) => tag.tag);
        setTags([...fetchedTags, ...additionalTags]);
      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${apiUrl}category`);
        setCategories(response.data.map((category) => category.category));
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchTags();
    fetchCategories();
  }, []);

  const redeemPoints = async () => {
 
    try {
      const response = await axios.patch(
        `http://localhost:5000/tourist/redeemPoints/${touristId}`
      );
      const { wallet, points } = response.data;
      setWallet(wallet);
      setPoints(points);
      message.success(response.data.message);
    } catch (error) {
      message.error(error.response?.data?.message || "Error redeeming points.");
    }
  };

  const handleTagsChange = async (tag) => {
    const updatedTags = preferences.preferredTags.includes(tag)
      ? preferences.preferredTags.filter((t) => t !== tag)
      : [...preferences.preferredTags, tag];

    setPreferences((prev) => ({ ...prev, preferredTags: updatedTags }));

    try {
      await axios.patch(`${apiUrl}tourist/${touristId}`, {
        preferredTags: updatedTags,
        preferredCategories: preferences.preferredCategories,
      });

      const dec = jwtDecode(localStorage.getItem("token"));
      await getSetNewToken(dec?.userDetails?._id, dec?.role);

      message.success("Tags updated");
    } catch (error) {
      console.error("Error saving tags:", error);
      message.error("Failed to update tags");
    }
    //setDropdownOpen(true);
    setOpenKeys(["preferences"]);
  };

  const handleCategoriesChange = async (category) => {
    const updatedCategories = preferences.preferredCategories.includes(category)
      ? preferences.preferredCategories.filter((c) => c !== category)
      : [...preferences.preferredCategories, category];

    setPreferences((prev) => ({
      ...prev,
      preferredCategories: updatedCategories,
    }));
    try {
      await axios.patch(`${apiUrl}tourist/${touristId}`, {
        preferredTags: preferences.preferredTags,
        preferredCategories: updatedCategories,
      });
      message.success("Categories updated");
    } catch (error) {
      console.error("Error saving categories:", error);
      message.error("Failed to update categories");
    }
    //setDropdownOpen(true);
    setOpenKeys(["preferences"]);
  };

  const handleOpenChange = (nextOpen) => {
    if (nextOpen) {
      setOpen(nextOpen);
    }
  };

  const preferencesMenu = (
    <Menu
      selectedKeys={[
        ...preferences.preferredTags,
        ...preferences.preferredCategories,
      ]}
      openKeys={openKeys}
      onOpenChange={(keys) => setOpenKeys(keys)}
    >
      <Menu.SubMenu key="preferences" title="Preferences">
        <div style={{ maxHeight: "300px", overflowY: "auto" }}>
          <Menu.ItemGroup title="Tags">
            {tags.map((tag) => (
              <Menu.Item
                key={tag}
                onClick={(e) => {
                  e.domEvent.preventDefault();
                  handleTagsChange(tag);
                  handleOpenChange(true);
                }}
                style={{
                  backgroundColor: preferences.preferredTags.includes(tag)
                    ? "#e6f7ff"
                    : "white",
                }}
              >
                {tag}
              </Menu.Item>
            ))}
          </Menu.ItemGroup>
          <Menu.ItemGroup title="Categories">
            {categories.map((category) => (
              <Menu.Item
                key={category}
                onClick={(e) => {
                  e.domEvent.preventDefault();
                  handleCategoriesChange(category);
                  handleOpenChange(true);
                }}
                open={dropdownOpen}
                onOpenChange={(open) => setDropdownOpen(open)}
                style={{
                  backgroundColor: preferences.preferredCategories.includes(
                    category
                  )
                    ? "#e6f7ff"
                    : "white",
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

  const [hovered, setHovered] = useState(false);


  return (
    <>
      <Flex justify="left">
        <Button
          type="primary"
          style={{fontWeight: "bold",
            color: hovered? "white" : "red",
            //backgroundColor: "white",
            backgroundColor: hovered ? "#ff6961" : "white",}}
          danger
          onClick={() => confirmLogOut()}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          icon={<LogoutIcon/>}
        >
          Log Out
        </Button>

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
      <SelectCurrency
         currency={currency}
         onCurrencyChange={handleCurrencyChange}
         style={{borderColor:"#1b696a", color:"#1b696a" , left: -240 , top: -20}}
      />
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
              <img
                src={logo}
                alt="Logo"
                style={{ width: "100px", height: "100px", borderRadius: "50%" }}
              />
            </div>
          )}
          {role === "advertiser" && (
            <div>
              <img
                src={logo}
                alt="Logo"
                style={{ width: "100px", height: "100px", borderRadius: "50%" }}
              />
            </div>
          )}
          {role === "guide" && photo && (
            <div>
              <img
                src={photo}
                alt="Photo"
                style={{ width: "100px", height: "100px", borderRadius: "50%" }}
              />
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
                      onOpenChange={handleOpenChange}
                      trigger={["click"]}
                      open={dropdownOpen}
                      //onOpenChange={(open) => setDropdownOpen(open)}
                    >
                      <Button
                        style={{
                          position: "absolute",
                          top: 20,
                          right: 20,
                          border: "none",
                          background: "none",
                          color: "#5b8b77",
                          fontSize: "16px",
                        }}
                        onClick={(e) => {
                          e.preventDefault();
                          setDropdownOpen(!dropdownOpen);
                        }}
                      >
                        View and Edit Preferences
                      </Button>
                    </Dropdown>
                    {userDetails && userDetails.badge && (
                      <div style={{ marginTop: "10px" }}>
                        {userDetails.badge === 1 && (
                          <img
                            src="http://localhost:3000/1.jpg"
                            alt="Bronze Badge"
                            style={{ width: "50px", height: "50px" }}
                          />
                        )}
                        {userDetails.badge === 2 && (
                          <img
                            src="http://localhost:3000/2.jpg"
                            alt="Silver Badge"
                            style={{ width: "50px", height: "50px" }}
                          />
                        )}
                        {userDetails.badge === 3 && (
                          <img
                            src="http://localhost:3000/3.jpg"
                            alt="Gold Badge"
                            style={{ width: "50px", height: "50px" }}
                          />
                        )}
                      </div>
                    )}
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
                        <span>{userDetails.nationality.charAt(0).toUpperCase()+ userDetails.nationality.slice(1)}</span>
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
                        <span>
                    {walletConverted} {currency}
                  </span>
                      </div>
                    )}
                    {userDetails.totalPoints !== undefined && (
                      <div>
                        <strong>Points: </strong>
                        <span>{userDetails.points || 0}</span>
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
      {role === "tourist" && (
        <Card
          style={{
            width: "100%",
            maxWidth: 600,
            margin: "50px auto",
            padding: "20px",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Space direction="vertical" align="center" style={{ width: "100%" }}></Space>
            <h3 style={{ textAlign: "center", flex: 1, margin: 0 }}>Delivery Addresses</h3>
            <Button type="primary" icon="+" onClick={showModal} style={{ marginBottom: 0 }}>
            Add Address
            </Button>
          </div>
          <hr />
          {addresses !== undefined && (
                        <Row gutter={[16, 16]}>
                        {userDetails.deliveryAddresses.map((address, index) => (
                          <Col xs={84} sm={12} md={8} key={index}>
                            <Card
                              title={`${address.city}, ${address.country}`}
                              bordered={true}
                              hoverable
                            >
                              <p><strong>Area:</strong> {address.area}</p>
                              <p><strong>Street:</strong> {address.street}</p>
                              <p><strong>House:</strong> {address.house}</p>
                              <p><strong>Apartment:</strong> {address.app}</p>
                              <p><strong>Description:</strong> {address.desc}</p>
                            </Card>
                          </Col>
                        ))}
                      </Row>
                      
                      )}
              {isModalVisible && (

            <Modal
              title="Add Delivery Address"
              visible={isModalVisible}
              onCancel={handleCancelDelivery}
              style={{backgroundColor: '#1b696a'}}
              footer={null}
            >
              <Form
                form={form}
                layout="vertical"
                onFinish={handleAddAddress}
              >
                <Form.Item
                  label="Country"
                  name="country"
                  rules={[{ required: true, message: "Please input the country!" }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  label="City"
                  name="city"
                  rules={[{ required: true, message: "Please input the city!" }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  label="Area"
                  name="area"
                  rules={[{ required: true, message: "Please input the area!" }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  label="Street"
                  name="street"
                  rules={[{ required: true, message: "Please input the street!" }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  label="House Number"
                  name="house"
                  rules={[{ required: true, message: "Please input the house number!" }]}
                >
                  <InputNumber min={1} style={{ width: "100%" }} />
                </Form.Item>
                <Form.Item
                  label="Apartment Number"
                  name="app"
                  rules={[{ required: true, message: "Please input the apartment number!" }]}
                >
                  <InputNumber min={1} style={{ width: "100%" }} />
                </Form.Item>
                <Form.Item
                  label="Description"
                  name="desc"
                  rules={[{ required: false }]}
                >
                  <Input.TextArea rows={3} />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit" style={{backgroundColor:"#1b696a"}} block>
                    Add Address
                  </Button>
                </Form.Item>
              </Form>
            </Modal>)}
        </Card>
        )}
        {role === "tourist" && (  // Conditionally render this part if the role is "tourist"
        <Card
          style={{
            width: "100%",
            maxWidth: 600,
            margin: "50px auto",
            padding: "20px",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
          }}
        >
          <h2>Redeem Points</h2>
          <p>Your current points: {points}</p>
          <p>Your wallet balance: USD {wallet.toFixed(2)}</p>
          {points < 10000 ? (
            <Tooltip title="You must have at least 10000 points to redeem">
              <span>
                <CustomButton
                  size="m"
                  value="Redeem Points"
                  onClick={redeemPoints}
                  disabled
                  loading={loading}
                />
              </span>
            </Tooltip>
          ) : (
            <CustomButton
              size="m"
              value="Redeem Points"
              onClick={redeemPoints}
              disabled={false}
              loading={loading}
            />
          )}
        </Card>
      )}
    </>
  );
};

export default Profile;
