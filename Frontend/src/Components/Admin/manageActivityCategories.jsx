import React, { useEffect, useState } from "react"; 
import axios from "axios";
import { Card, Button, Typography, Modal, Input, message } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";

const { Title } = Typography;

const ManageActivityCategories = () => {
  const [categories, setCategories] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [updatedName, setUpdatedName] = useState("");
  const [newCategoryName, setNewCategoryName] = useState("");
  const [addingCategory, setAddingCategory] = useState(false);

  // Fetch categories from the server
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:5000/category");
        setCategories(response.data);
      } catch (error) {
        console.error(error);
        message.error("Failed to load categories.");
      }
    };

    fetchCategories();
  }, []);

  // Show update modal and set the selected category
  const showUpdateModal = (category) => {
    setCurrentCategory(category);
    setUpdatedName(category.category);
    setIsModalVisible(true);
  };

  // Handle update category
  const handleUpdate = async () => {
    if (!updatedName) {
      message.error("Please provide a name for the category.");
      return;
    }

    try {
      await axios.patch(`http://localhost:5000/category/${currentCategory._id}`, {
        category: updatedName,
      });

      const updatedCategories = categories.map((category) =>
        category._id === currentCategory._id
          ? { ...category, category: updatedName }
          : category
      );
      setCategories(updatedCategories);
      setIsModalVisible(false);
      message.success("Category updated successfully!");
    } catch (error) {
      console.error(error);
      message.error("Failed to update category.");
    }
  };

  // Handle delete category
  const handleDelete = async (categoryId) => {
    try {
      await axios.delete(`http://localhost:5000/category/${categoryId}`);
      const updatedCategories = categories.filter(
        (category) => category._id !== categoryId
      );
      setCategories(updatedCategories);
      message.success("Category deleted successfully!");
    } catch (error) {
      console.error(error);
      message.error("Failed to delete category.");
    }
  };

  // Handle add new category
  const handleAddCategory = async () => {
    if (!newCategoryName) {
      message.error("Please provide a name for the new category.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/category", {
        category: newCategoryName,
      });

      if (response.status === 201) {
        setCategories([...categories, response.data]);
        setNewCategoryName("");
        setAddingCategory(false);
        message.success("Category added successfully!");
      }
    } catch (error) {
      console.error(error);
      message.error("Failed to add category.");
    }
  };

  return (
    <div>
      <Title level={2} style={{ display: "inline-block" }}>
        Activity Categories
      </Title>

      {/* Updated Add Category Functionality Positioned Below Title */}
      <div
        style={{
          marginTop: "16px",
          marginBottom: "24px",
          display: "flex",
          alignItems: "center",
        }}
      >
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
              style={{ width: "200px", marginRight: "8px" }}
            />
            <Button type="primary" onClick={handleAddCategory}>
              Add
            </Button>
          </div>
        )}

        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setAddingCategory(!addingCategory)}
        >
          Add Category
        </Button>
      </div>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        {categories.map((category) => (
          <Card key={category._id} title={category.category} style={{ width: 300 }}>
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => showUpdateModal(category)}
            />
            <Button
              type="text"
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(category._id)}
              style={{
                marginLeft: "8px",
                color: "red",
              }}
            />
          </Card>
        ))}
      </div>

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
    </div>
  );
};

export default ManageActivityCategories;
