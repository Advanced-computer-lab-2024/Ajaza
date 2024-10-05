import React, { createContext, useContext, useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { Form, Input, Select, DatePicker, Typography, Upload, message } from "antd";
// import CustomButton from './Components/Common/CustomButton';
// import CustomLayout from './Components/Common/CustomLayout';
import CustomButton from "./Common/CustomButton";
import { CustomLayout } from "./Common";
import { UserOutlined, UploadOutlined } from "@ant-design/icons";
import CustomCard from './Card';



const RoleContext = createContext();

// Provide the Role Context to the application
const RoleProvider = ({ children }) => {
  const [role, setRole] = useState('Tourist'); // Default role is "Tourist"
  return (
    <RoleContext.Provider value={{ role, setRole }}>
      {children}
    </RoleContext.Provider>
  );
};

const useRole = () => {
  return useContext(RoleContext);
};

const RoleFormPage = () => {
  const { role, setRole } = useRole();

  // Function to render the form based on the selected role
  const renderForm = () => {
    switch (role) {
      case "Tourist":
        return <Tourist />;
      case "Tour Guide":
        return <TourGuide />;
      case "Seller":
        return <Seller />;
      case "Advertiser":
        return <Advertiser />;
      default:
        return <Tourist />;
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>

      {/* Render the selected role's form directly below the CustomButtons */}
      <div style={{ marginTop: "20px" }}>{renderForm()}</div>
    </div>
  );
};

const BlankPage = () => {
  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <h1>Welcome to the Blank Page!</h1>
      <p>This is a blank page after form submission.</p>
    </div>
  );
};

const SellerPage = () => {
  const navigate = useNavigate();

  const testFunction = (a, b) => {
    console.log("Function called with:", a, b);
  };

  const handleCustomButtonClick = () => {
    navigate("/createform");
  };

  const handleCustomButtonClick2 = () => {
    navigate("/product");
  };



  return (
    <CustomLayout user="seller">
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <h1>Welcome to Seller Page!</h1>
      </div>
      <CustomButton
        type="primary"
        htmlType="submit"
        size="m"
        value="Create Seller"
        rounded={true}
        loading={false}
        onClick={handleCustomButtonClick} // Set the onClick handler for the CustomButton
      >
      </CustomButton>

      <CustomButton
        type="primary"
        htmlType="submit"
        size="m"
        value="Add Product"
        rounded={true}
        loading={false}
        onClick={handleCustomButtonClick2} // Set the onClick handler for the CustomButton
      >
      </CustomButton>
    </CustomLayout>
  );
};

const Tourist = () => {
  const navigate = useNavigate(); // Initialize useNavigate
  const { role, setRole } = useRole(); // Get role and setRole from context

  const onFinish = (values) => {
    console.log("Success:", values);
    navigate("/blank"); // Redirect to the blank page after successful submission
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <CustomLayout>
      <div style={{ textAlign: "center", alignItems: "center", marginTop: "20px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: "bold" }}>
          Register as a {role} {/* Display the current role */}
        </h1>
      </div>

      {/* Role Selection CustomButtons */}
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <CustomButton
          type={role === "Tourist" ? "primary" : "default"}
          onClick={() => setRole("Tourist")}
          value="Tourist"
          size="m"
          style={{ margin: "10px" }}
        >
        </CustomButton>
        <CustomButton
          type={role === "Tour Guide" ? "primary" : "default"}
          onClick={() => setRole("Tour Guide")}
          value="Tour Guide"
          size="m"
          style={{ margin: "10px" }}
        >
        </CustomButton>
        <CustomButton
          type={role === "Seller" ? "primary" : "default"}
          onClick={() => setRole("Seller")}
          value="Seller"
          size="m"
          style={{ margin: "10px" }}
        >
        </CustomButton>
        <CustomButton
          type={role === "Advertiser" ? "primary" : "default"}
          onClick={() => setRole("Advertiser")}
          value="Advertiser"
          size="m"
          style={{ margin: "10px" }}
        >
        </CustomButton>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600, width: "100%" }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please input your email!" },
              { type: "email", message: "Please enter a valid email!" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              { required: true, message: "Please input your password!" },
              { min: 6, message: "Password must be at least 6 characters!" },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            label="Mobile number"
            name="mobile number"
            rules={[
              { required: true, message: "Please input your mobile number!" },
              { len: 11, message: "Mobile number must be 11 digits!" },
              { pattern: /^[0-9]+$/, message: "Mobile number must contain only numbers!" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Nationality"
            name="nationality"
            rules={[{ required: true, message: "Please input your nationality!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="DOB"
            name="dob"
            rules={[{ required: true, message: "Please input your DOB!" }]}
          >
            <DatePicker />
          </Form.Item>

          <Form.Item
            label="Occupation"
            name="occupation"
            rules={[{ required: true, message: "Please select your occupation!" }]}
          >
            <Select placeholder="Select your occupation">
              <Select.Option value="job">Job</Select.Option>
              <Select.Option value="student">Student</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            wrapperCol={{
              offset: 8,
              span: 16,
            }}
          >
            <CustomButton
              type="primary"
              htmlType="submit"
              value="Register"
              size="s"
              rounded={true}
              loading={false}
            >
            </CustomButton>
          </Form.Item>

        </Form>
      </div>
    </CustomLayout>
  );
};


const TourGuide = () => {
  const navigate = useNavigate(); // Initialize useNavigate
  const { role, setRole } = useRole(); // Get role and setRole from context

  const onFinish = (values) => {
    console.log("Success:", values);
    navigate("/blank"); // Redirect to the blank page after successful submission
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  return (
    <CustomLayout>
      <div style={{ textAlign: "center", alignItems: "center", marginTop: "20px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: "bold" }}>
          Register as a {role} {/* Display the current role */}
        </h1>
      </div>

      {/* Role Selection CustomButtons */}
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <CustomButton
          type={role === "Tourist" ? "primary" : "default"}
          onClick={() => setRole("Tourist")}
          value="Tourist"
          size="m"
          style={{ margin: "10px" }}
        >
        </CustomButton>
        <CustomButton
          type={role === "Tour Guide" ? "primary" : "default"}
          onClick={() => setRole("Tour Guide")}
          value="Tour Guide"
          size="m"
          style={{ margin: "10px" }}
        >
        </CustomButton>
        <CustomButton
          type={role === "Seller" ? "primary" : "default"}
          onClick={() => setRole("Seller")}
          value="Seller"
          size="m"
          style={{ margin: "10px" }}
        >
        </CustomButton>
        <CustomButton
          type={role === "Advertiser" ? "primary" : "default"}
          onClick={() => setRole("Advertiser")}
          value="Advertiser"
          size="m"
          style={{ margin: "10px" }}
        >
        </CustomButton>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600, width: "100%" }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: "Please input your email!" },
            { type: "email", message: "Please enter a valid email!" },]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input your password!" },
            { min: 6, message: "Password must be at least 6 characters!" },]}
          >
            <Input.Password />
          </Form.Item>
          {/* Upload Document 1 */}
          <Form.Item
            label="ID"
            name="document1"
            valuePropName="fileList"
            getValueFromEvent={normFile}
            extra="Upload the ID."
          >
            <Upload name="doc1" action="/upload.do" listType="text">
              <CustomButton icon={<UploadOutlined />}
                size="m"
                value="Upload"
              />
            </Upload>
          </Form.Item>

          {/* Upload Document 2 */}
          <Form.Item
            label="Certificates"
            name="document2"
            valuePropName="fileList"
            getValueFromEvent={normFile}
            extra="Upload the certificates."
          >
            <Upload name="doc2" action="/upload.do" listType="text">
              <CustomButton icon={<UploadOutlined />}
                size="m"
                value="Upload"
              />
            </Upload>
          </Form.Item>
          <Form.Item
            wrapperCol={{
              offset: 8,
              span: 16,
            }}
          >
            <CustomButton
              type="primary" // Optionally, you can set this as needed
              htmlType="submit" // Set the CustomButton type to submit
              size="s" // Use size 's' for small
              value="Register" // Set the CustomButton text
              rounded={true} // Enable rounding
              loading={false} // Set loading state if necessary
            >
            </CustomButton>
          </Form.Item>

        </Form>
      </div>
    </CustomLayout>
  );
};

const Seller = () => {
  const navigate = useNavigate(); // Initialize useNavigate
  const { role, setRole } = useRole(); // Get role and setRole from context

  const onFinish = (values) => {
    console.log("Success:", values);
    navigate("/seller");
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  return (
    <CustomLayout>
      <div style={{ textAlign: "center", alignItems: "center", marginTop: "20px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: "bold" }}>
          Register as a {role} {/* Display the current role */}
        </h1>
      </div>

      {/* Role Selection CustomButtons */}
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <CustomButton
          type={role === "Tourist" ? "primary" : "default"}
          onClick={() => setRole("Tourist")}
          value="Tourist"
          size="m"
          style={{ margin: "10px" }}
        >
        </CustomButton>
        <CustomButton
          type={role === "Tour Guide" ? "primary" : "default"}
          onClick={() => setRole("Tour Guide")}
          value="Tour Guide"
          size="m"
          style={{ margin: "10px" }}
        >
        </CustomButton>
        <CustomButton
          type={role === "Seller" ? "primary" : "default"}
          onClick={() => setRole("Seller")}
          value="Seller"
          size="m"
          style={{ margin: "10px" }}
        >
        </CustomButton>
        <CustomButton
          type={role === "Advertiser" ? "primary" : "default"}
          onClick={() => setRole("Advertiser")}
          value="Advertiser"
          size="m"
          style={{ margin: "10px" }}
        >
        </CustomButton>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600, width: "100%" }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: "Please input your email!" },
            { type: "email", message: "Please enter a valid email!" },]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input your password!" },
            { min: 6, message: "Password must be at least 6 characters!" },]}
          >
            <Input.Password />
          </Form.Item>
          {/* Upload Document 1 */}
          <Form.Item
            label="ID"
            name="document1"
            valuePropName="fileList"
            getValueFromEvent={normFile}
            extra="Upload the ID."
          >
            <Upload name="doc1" action="/upload.do" listType="text">
              <CustomButton icon={<UploadOutlined />}
                size="m"
                value="Upload"
              />
            </Upload>
          </Form.Item>

          {/* Upload Document 2 */}
          <Form.Item
            label="Taxation Registery Card"
            name="document2"
            valuePropName="fileList"
            getValueFromEvent={normFile}
            extra="Upload the taxation registery card."
          >
            <Upload name="doc2" action="/upload.do" listType="text">
              <CustomButton icon={<UploadOutlined />}
                size="m"
                value="Upload"
              />
            </Upload>
          </Form.Item>

          <Form.Item
            wrapperCol={{
              offset: 8,
              span: 16,
            }}
          >
            <CustomButton
              type="primary" // Optionally, you can set this as needed
              htmlType="submit" // Set the CustomButton type to submit
              size="s" // Use size 's' for small
              value="Register" // Set the CustomButton text
              rounded={true} // Enable rounding
              loading={false} // Set loading state if necessary
            >

            </CustomButton>
          </Form.Item>

        </Form>
      </div>
    </CustomLayout>
  );
};

const Advertiser = () => {
  const navigate = useNavigate(); // Initialize useNavigate
  const { role, setRole } = useRole(); // Get role and setRole from context

  const onFinish = (values) => {
    console.log("Success:", values);
    navigate("/blank"); // Redirect to the blank page after successful submission
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };
  return (
    <CustomLayout>
      <div style={{ textAlign: "center", alignItems: "center", marginTop: "20px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: "bold" }}>
          Register as a {role} {/* Display the current role */}
        </h1>
      </div>

      {/* Role Selection CustomButtons */}
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <CustomButton
          type={role === "Tourist" ? "primary" : "default"}
          onClick={() => setRole("Tourist")}
          value="Tourist"
          size="m"
          style={{ margin: "10px" }}
        >
        </CustomButton>
        <CustomButton
          type={role === "Tour Guide" ? "primary" : "default"}
          onClick={() => setRole("Tour Guide")}
          value="Tour Guide"
          size="m"
          style={{ margin: "10px" }}
        >
        </CustomButton>
        <CustomButton
          type={role === "Seller" ? "primary" : "default"}
          onClick={() => setRole("Seller")}
          value="Seller"
          size="m"
          style={{ margin: "10px" }}
        >
        </CustomButton>
        <CustomButton
          type={role === "Advertiser" ? "primary" : "default"}
          onClick={() => setRole("Advertiser")}
          value="Advertiser"
          size="m"
          style={{ margin: "10px" }}
        >
        </CustomButton>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600, width: "100%" }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: "Please input your email!" },
            { type: "email", message: "Please enter a valid email!" },]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input your password!" },
            { min: 6, message: "Password must be at least 6 characters!" },]}
          >
            <Input.Password />
          </Form.Item>
          {/* Upload Document 1 */}
          <Form.Item
            label="ID"
            name="document1"
            valuePropName="fileList"
            getValueFromEvent={normFile}
            extra="Upload the ID."
          >
            <Upload name="doc1" action="/upload.do" listType="text">
              <CustomButton icon={<UploadOutlined />}
                size="m"
                value="Upload"
              />
            </Upload>
          </Form.Item>

          {/* Upload Document 2 */}
          <Form.Item
            label="Taxation Registery Card"
            name="document2"
            valuePropName="fileList"
            getValueFromEvent={normFile}
            extra="Upload the taxation registery card."
          >
            <Upload name="doc2" action="/upload.do" listType="text">
              <CustomButton icon={<UploadOutlined />}
                size="m"
                value="Upload"
              />
            </Upload>
          </Form.Item>


          <Form.Item
            wrapperCol={{
              offset: 8,
              span: 16,
            }}
          >
            <CustomButton
              type="primary" // Optionally, you can set this as needed
              htmlType="submit" // Set the CustomButton type to submit
              size="s" // Use size 's' for small
              value="Register" // Set the CustomButton text
              rounded={true} // Enable rounding
              loading={false} // Set loading state if necessary
            >
            </CustomButton>
          </Form.Item>

        </Form>
      </div>
    </CustomLayout>
  );
};

const Product = () => {
  const [quantity, setQuantity] = useState("");
  const [details, setDetails] = useState("");
  const [price, setPrice] = useState("");
  const navigate = useNavigate();

  const onFinish = (values) => {
    console.log("Saved values:", values);
    const { quantity, details, price } = values;
    // Redirect to the new page and pass the form data using 'state'
    navigate("/display", {
      state: {
        quantity,
        details,
        price,
      },
    });
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <CustomLayout>
      <div style={{ textAlign: "center", alignItems: "center", marginTop: "20px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: "bold" }}>
          Add Product
        </h1>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600, width: "100%" }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="Details"
            name="details"
            rules={[{ required: true, message: "Please input the details!" }]}
          >
            <Input.TextArea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              rows={2}
            />
          </Form.Item>

          <Form.Item
            label="Price"
            name="price"
            rules={[{ required: true, message: "Please input the price!" }]}
          >
            <Input
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              type="number"
            />
          </Form.Item>

          <Form.Item
            label="Quantity"
            name="quantity"
            rules={[{ required: true, message: "Please input the quantity!" }]}
          >
            <Input
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              type="number"
            />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <CustomButton type="default" htmlType="submit" value="Save" size={"m"}>
            </CustomButton>
          </Form.Item>
        </Form>
      </div>
    </CustomLayout>
  );
};
const { Title } = Typography;

const DisplayForm = () => {
  const location = useLocation();
  const { quantity, details: initialDetails, price: initialPrice } = location.state || {};

  // Maintain editable state
  const [details, setDetails] = useState(initialDetails);
  const [price, setPrice] = useState(initialPrice);

  // Maintain state for edit mode
  const [isEditing, setIsEditing] = useState(false);

  // Toggle edit mode
  const handleUpdateClick = () => {
    setIsEditing(true);
  };

  // Save the updated values
  const handleSaveClick = () => {
    setIsEditing(false); // Exit editing mode
    console.log("Updated values:", { details, price });
    // Handle further logic here, like sending the updated data to an API if needed
  };

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <Title level={1}>Product Details</Title>

      <CustomCard
        title={isEditing ? (
          <Input.TextArea
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            rows={2}
          />
        ) : (
          details
        )}
        price={isEditing ? (
          <Input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        ) : (
          price
        )}
        quantity={quantity}
        onClick={handleUpdateClick} // Trigger update on card click
      />

      {isEditing && (
        <CustomButton type="primary" size="m" value="Update" onClick={handleSaveClick}>
        </CustomButton>
      )}
    </div>
  );
};

const CreateFormPage = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();

  const onFinish = (values) => {
    console.log("Saved values:", values);
    const { name, description } = values;
    // Redirect to the new page and pass the form data using 'state'
    navigate("/seller-form", {
      state: {
        name,
        description
      },
    });
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };


  return (
    <CustomLayout>
      <div style={{ textAlign: "center", alignItems: "center", marginTop: "20px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: "bold" }}>
          Create Seller
        </h1>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600, width: "100%" }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please input a name!" }]}
          >
            <Input.TextArea
              value={name}
              onChange={(e) => setName(e.target.value)}
              rows={1}
            />
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: "Please input a description!" }]}
          >
            <Input.TextArea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <CustomButton type="default" htmlType="submit" value="Save" size={"m"}>
            </CustomButton>
          </Form.Item>
        </Form>
      </div>
    </CustomLayout>
  );
};

const SellerForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { name: initialName, description: initialDescription } = location.state || {};

  // Editable state for seller info
  const [name, setName] = useState(initialName || "");
  const [description, setDescription] = useState(initialDescription || "");
  const [isEditing, setIsEditing] = useState(false);

  // Toggle edit mode
  const handleUpdateClick = () => {
    setIsEditing(true);
  };

  // Save the updated values
  const handleSaveClick = () => {
    setIsEditing(false); // Exit editing mode
    console.log("Updated values:", { name, description });
  };

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <h1>Seller Details</h1>
      {location.state ? (
        <div>
          {isEditing ? (
            <div>
              <Form
                name="sellerForm"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                style={{ maxWidth: 600, width: "100%" }}
                autoComplete="off"
              >
                <Form.Item label="Name">
                  <Input.TextArea
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    rows={2}
                    placeholder="Enter seller name"
                  />
                </Form.Item>
                <Form.Item label="Description">
                  <Input.TextArea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    placeholder="Enter seller description"
                  />
                </Form.Item>
              </Form>
              <CustomButton type="primary" value="Save" size="m" onClick={handleSaveClick}>

              </CustomButton>
            </div>
          ) : (
            <div>
              <p><strong>Name:</strong> {name}</p>
              <p><strong>Description:</strong> {description}</p>
              <CustomButton type="default" value="Update" size="m" onClick={handleUpdateClick}>

              </CustomButton>
            </div>
          )}
        </div>
      ) : (
        <p>No seller data available. Please go back and fill the form.</p>
      )}
    </div>
  );
};


// Replace RoleSelection with RoleFormPage
const AppWrapper2 = () => (
  <RoleProvider>
    <Router>
      <Routes>
        <Route path="/" element={<RoleFormPage />} /> {/* Changed to RoleFormPage */}
        <Route path="/register-tourist" element={<Tourist />} /> {/* Tourist registration page */}
        <Route path="/blank" element={<BlankPage />} />
        <Route path="/seller" element={<SellerPage />} />
        <Route path="/createform" element={<CreateFormPage />} />
        <Route path="/seller-form" element={<SellerForm />} />
        <Route path="/product" element={<Product />} />
        <Route path="/display" element={<DisplayForm />} />
        <Route path="/register-guide" element={<TourGuide />} /> {/* TourGuide registration page */}
        <Route path="/register-seller" element={<Seller />} /> {/* Seller registration page */}
        <Route path="/register-advertiser" element={<Advertiser />} /> {/* Advertiser registration page */}
      </Routes>
    </Router>
  </RoleProvider>
);
