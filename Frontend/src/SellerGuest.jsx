import React, { createContext, useContext, useState } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { Form, Input, Select, DatePicker, Typography } from "antd";
import { CustomLayout, Button, IconButton } from "./Components"; // Adjust the import according to your project structure
import { UserOutlined } from "@ant-design/icons";
import { Colors } from "./Components/Constants";
import CustomCard from './Components/Card';



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

      {/* Render the selected role's form directly below the buttons */}
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

  const handleButtonClick = () => {
    navigate("/createform");
  };

  const handleButtonClick2 = () => {
    navigate("/product");
  };



  return (
    <CustomLayout user="seller">
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <h1>Welcome to Seller Page!</h1>
      </div>
      <div>
        <IconButton
          icon={UserOutlined}
          backgroundColor={Colors.primary.default}
          onClick={() => testFunction(1, 2)}
          shape="circle"
          style={{ marginLeft: "50px" }}
        />
      </div>
      <Button
        type="primary"
        htmlType="submit"
        size="m"
        value="Create Seller"
        rounded={true}
        loading={false}
        onClick={handleButtonClick} // Set the onClick handler for the button
      >
      </Button>

      <Button
        type="primary"
        htmlType="submit"
        size="m"
        value="Add Product"
        rounded={true}
        loading={false}
        onClick={handleButtonClick2} // Set the onClick handler for the button
      >
      </Button>
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

      {/* Role Selection Buttons */}
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <Button
          type={role === "Tourist" ? "primary" : "default"}
          onClick={() => setRole("Tourist")}
          value="Tourist"
          size="m"
          style={{ margin: "10px" }}
        >
        </Button>
        <Button
          type={role === "Tour Guide" ? "primary" : "default"}
          onClick={() => setRole("Tour Guide")}
          value="Tour Guide"
          size="m"
          style={{ margin: "10px" }}
        >
        </Button>
        <Button
          type={role === "Seller" ? "primary" : "default"}
          onClick={() => setRole("Seller")}
          value="Seller"
          size="m"
          style={{ margin: "10px" }}
        >
        </Button>
        <Button
          type={role === "Advertiser" ? "primary" : "default"}
          onClick={() => setRole("Advertiser")}
          value="Advertiser"
          size="m"
          style={{ margin: "10px" }}
        >
        </Button>
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
            <Button
              type="primary"
              htmlType="submit"
              size="s"
              rounded={true}
              loading={false}
            >
              Register
            </Button>
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

  return (
    <CustomLayout>
      <div style={{ textAlign: "center", alignItems: "center", marginTop: "20px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: "bold" }}>
          Register as a {role} {/* Display the current role */}
        </h1>
      </div>

      {/* Role Selection Buttons */}
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <Button
          type={role === "Tourist" ? "primary" : "default"}
          onClick={() => setRole("Tourist")}
          value="Tourist"
          size="m"
          style={{ margin: "10px" }}
        >
        </Button>
        <Button
          type={role === "Tour Guide" ? "primary" : "default"}
          onClick={() => setRole("Tour Guide")}
          value="Tour Guide"
          size="m"
          style={{ margin: "10px" }}
        >
        </Button>
        <Button
          type={role === "Seller" ? "primary" : "default"}
          onClick={() => setRole("Seller")}
          value="Seller"
          size="m"
          style={{ margin: "10px" }}
        >
        </Button>
        <Button
          type={role === "Advertiser" ? "primary" : "default"}
          onClick={() => setRole("Advertiser")}
          value="Advertiser"
          size="m"
          style={{ margin: "10px" }}
        >
        </Button>
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

          <Form.Item
            wrapperCol={{
              offset: 8,
              span: 16,
            }}
          >
            <Button
              type="primary" // Optionally, you can set this as needed
              htmlType="submit" // Set the button type to submit
              size="s" // Use size 's' for small
              value="Register" // Set the button text
              rounded={true} // Enable rounding
              loading={false} // Set loading state if necessary
            >
            </Button>
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
    navigate("/seller"); // Redirect to the blank page after successful submission
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

      {/* Role Selection Buttons */}
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <Button
          type={role === "Tourist" ? "primary" : "default"}
          onClick={() => setRole("Tourist")}
          value="Tourist"
          size="m"
          style={{ margin: "10px" }}
        >
        </Button>
        <Button
          type={role === "Tour Guide" ? "primary" : "default"}
          onClick={() => setRole("Tour Guide")}
          value="Tour Guide"
          size="m"
          style={{ margin: "10px" }}
        >
        </Button>
        <Button
          type={role === "Seller" ? "primary" : "default"}
          onClick={() => setRole("Seller")}
          value="Seller"
          size="m"
          style={{ margin: "10px" }}
        >
        </Button>
        <Button
          type={role === "Advertiser" ? "primary" : "default"}
          onClick={() => setRole("Advertiser")}
          value="Advertiser"
          size="m"
          style={{ margin: "10px" }}
        >
        </Button>
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

          <Form.Item
            wrapperCol={{
              offset: 8,
              span: 16,
            }}
          >
            <Button
              type="primary" // Optionally, you can set this as needed
              htmlType="submit" // Set the button type to submit
              size="s" // Use size 's' for small
              value="Register" // Set the button text
              rounded={true} // Enable rounding
              loading={false} // Set loading state if necessary
            >

            </Button>
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

  return (
    <CustomLayout>
      <div style={{ textAlign: "center", alignItems: "center", marginTop: "20px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: "bold" }}>
          Register as a {role} {/* Display the current role */}
        </h1>
      </div>

      {/* Role Selection Buttons */}
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <Button
          type={role === "Tourist" ? "primary" : "default"}
          onClick={() => setRole("Tourist")}
          value="Tourist"
          size="m"
          style={{ margin: "10px" }}
        >
        </Button>
        <Button
          type={role === "Tour Guide" ? "primary" : "default"}
          onClick={() => setRole("Tour Guide")}
          value="Tour Guide"
          size="m"
          style={{ margin: "10px" }}
        >
        </Button>
        <Button
          type={role === "Seller" ? "primary" : "default"}
          onClick={() => setRole("Seller")}
          value="Seller"
          size="m"
          style={{ margin: "10px" }}
        >
        </Button>
        <Button
          type={role === "Advertiser" ? "primary" : "default"}
          onClick={() => setRole("Advertiser")}
          value="Advertiser"
          size="m"
          style={{ margin: "10px" }}
        >
        </Button>
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

          <Form.Item
            wrapperCol={{
              offset: 8,
              span: 16,
            }}
          >
            <Button
              type="primary" // Optionally, you can set this as needed
              htmlType="submit" // Set the button type to submit
              size="s" // Use size 's' for small
              value="Register" // Set the button text
              rounded={true} // Enable rounding
              loading={false} // Set loading state if necessary
            >
            </Button>
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
            <Button type="default" htmlType="submit" value="Save" size={"m"}>
            </Button>
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
        <Button type="primary" size="m" value="Update" onClick={handleSaveClick}>
        </Button>
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
            <Button type="default" htmlType="submit" value="Save" size={"m"}>
            </Button>
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
              <Button type="primary" value="Save" size="m" onClick={handleSaveClick}>

              </Button>
            </div>
          ) : (
            <div>
              <p><strong>Name:</strong> {name}</p>
              <p><strong>Description:</strong> {description}</p>
              <Button type="default" value="Update" size="m" onClick={handleUpdateClick}>

              </Button>
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
const AppWrapper = () => (
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


export default AppWrapper;