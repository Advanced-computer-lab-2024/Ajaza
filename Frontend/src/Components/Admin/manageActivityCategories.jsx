import React, { useEffect, useState } from "react";
import { Card, Button, Typography, Modal, Input, message } from "antd";
import { PlusOutlined } from "@ant-design/icons"; // Importing the Plus icon
import AdminCustomLayout from "./AdminCustomLayout";
import { Search } from "../Common";

const { Title } = Typography;

const ManageActivityCategories = () => {
  const [categories, setCategories] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [updatedName, setUpdatedName] = useState("");
  const [newCategoryName, setNewCategoryName] = useState("");
  const [addingCategory, setAddingCategory] = useState(false); // State to control adding category

  // Dummy data for demonstration
  const dummyData = [
    { id: 1, name: "Outdoor Activities" },
    { id: 2, name: "Indoor Activities" },
    { id: 3, name: "Water Sports" },
  ];

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          "https://api.example.com/activity-categories"
        );
        if (!response.ok) throw new Error("Failed to fetch categories");

        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error(error);
        setCategories(dummyData);
      }
    };

    fetchCategories();
  }, []);

  const showUpdateModal = (category) => {
    setCurrentCategory(category);
    setUpdatedName(category.name);
    setIsModalVisible(true);
  };

  const handleUpdate = () => {
    if (!updatedName) {
      message.error("Please provide a name for the category.");
      return;
    }

    const updatedCategories = categories.map((category) =>
      category.id === currentCategory.id
        ? { ...category, name: updatedName }
        : category
    );
    setCategories(updatedCategories);
    setIsModalVisible(false);
    message.success("Category updated successfully!");
  };

  const handleDelete = (categoryId) => {
    const updatedCategories = categories.filter(
      (category) => category.id !== categoryId
    );
    setCategories(updatedCategories);
    message.success("Category deleted successfully!");
  };

  const handleAddCategory = () => {
    if (!newCategoryName) {
      message.error("Please provide a name for the new category.");
      return;
    }

    const newCategory = { id: Date.now(), name: newCategoryName }; // Temporary ID for demonstration
    setCategories([...categories, newCategory]);
    setNewCategoryName("");
    setAddingCategory(false); // Close the input field
    message.success("Category added successfully!");
  };

  return (
     
      <div>
    <div>
      <Title level={2} style={{ display: "inline-block" }}>
        Activity Categories
      </Title>

      <div
        style={{
          position: "absolute",
          top: "16px",
          right: "16px",
          display: "flex",
          alignItems: "center",
        }}
      >
        {/* Input field for adding a new category */}
        {addingCategory && (
          <div
            style={{
              marginRight: "8px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Input
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Enter new category name"
              style={{ width: "200px", marginRight: "8px" }} // Set a width for the input
            />
            <Button type="primary" onClick={handleAddCategory}>
              Add
            </Button>
          </div>
        )}

        {/* Button for adding a new category */}
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setAddingCategory(!addingCategory)} // Toggle input on click
        >
          Add Category
        </Button>
      </div>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "16px",
          marginTop: "80px",
        }}
      >
        {categories.map((category) => (
          <Card key={category.id} title={category.name} style={{ width: 300 }}>
            <Button type="primary" onClick={() => showUpdateModal(category)}>
              Update
            </Button>
            <Button
              type="default"
              onClick={() => handleDelete(category.id)}
              style={{
                marginLeft: "8px",
                backgroundColor: "blue",
                color: "white",
              }} // Set the background color to blue
            >
              Delete
            </Button>
          </Card>
        ))}
      </div>

      {/* Modal for updating category */}
      <Modal
        title="Update Category"
        visible={isModalVisible}
        onOk={handleUpdate}
        onCancel={() => setIsModalVisible(false)}
      >
        <Input
          value={updatedName}
          onChange={(e) => setUpdatedName(e.target.value)}
          placeholder="Enter new category name"
        />
      </Modal>
      <Search />
    </div>
    </div>);
  
};

export default ManageActivityCategories;
