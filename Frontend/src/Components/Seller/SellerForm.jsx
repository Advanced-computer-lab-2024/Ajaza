import React, { useState, useEffect } from "react";
import { Input, message } from "antd";
import CustomButton from "../Common/CustomButton";
import { CustomLayout } from "../Common";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const SellerForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const newSellerId = location.state?.newSellerId;

  console.log("ID in SellerForm page:", newSellerId);
  // State for holding seller information
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const handleAddProductClick = () => {
    navigate("/product", { state: { newSellerId } });
  };
  const handleUpdateClick = () => {
    setIsEditing(true);
  };

  // Sidebar items including the "Add Product" button
  const sideBarItems = [
    {
      key: "addProduct",
      label: "Add Product",
      onClick: handleAddProductClick,
    },
    // You can add more items here if needed
  ];

  // Fetch seller data when component mounts or sellerId changes
  useEffect(() => {
    const fetchSeller = async () => {
      if (!newSellerId) return; // If there's no sellerId, exit early
      try {
        console.log("Seller ID:", newSellerId);
        const response = await axios.get(
          `http://localhost:5000/seller/sellerReadProfile/${newSellerId}`
        );
        // Set the name and description with the fetched data
        setName(response.data.name || ""); // Ensure it defaults to an empty string if undefined
        setDesc(response.data.desc || ""); // Ensure it defaults to an empty string if undefined
      } catch (error) {
        console.error("Error fetching seller data:", error);
        message.error("Failed to load seller data.");
      }
    };
    fetchSeller();
  }, [newSellerId]);

  // Handle save updates to seller data
  const handleSaveClick = async () => {
    if (!name || !desc) {
      message.error("Please provide a name and description for the seller.");
      return;
    }

    try {
      await axios.patch(
        `http://localhost:5000/seller/sellerUpdateProfile/${newSellerId}`,
        {
          name,
          desc,
        }
      );

      message.success("Seller updated successfully!");
    } catch (error) {
      console.error("Error updating seller:", error);
      message.error("Failed to update seller.");
    }
  };

  return (
    <CustomLayout sideBarItems={sideBarItems}>
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <Input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter seller name"
          disabled={!isEditing} // Disable input if not editing
        />
        <Input
          type="text"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          placeholder="Enter seller description"
          style={{ marginTop: "10px" }}
          disabled={!isEditing} // Disable input if not editing
        />
        <CustomButton
          type="primary"
          size="m"
          value={isEditing ? "Update" : "Edit"}
          onClick={() => {
            if (isEditing) {
              handleSaveClick();
            } else {
              setIsEditing(true); // Enable editing mode
            }
          }}
        >
          {isEditing ? "Update" : "Edit"}
        </CustomButton>
      </div>
    </CustomLayout>
  );
};

export default SellerForm;
