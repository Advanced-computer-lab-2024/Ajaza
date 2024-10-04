import React, { createContext, useContext, useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { Form, Input, Select, DatePicker, Typography, Upload, message } from "antd";
// import CustomButton from './Components/Common/CustomButton';
// import CustomLayout from './Components/Common/CustomLayout';
import CustomButton from "../Common/CustomButton";
import CustomLayout from "../Common/CustomLayout";
import CustomCard from '../Card';

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
    <CustomLayout>
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
    </CustomLayout>
  );
};

export default DisplayForm
