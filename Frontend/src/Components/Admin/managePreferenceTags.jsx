import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Button, Typography, Modal, Input, message } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { apiUrl } from "../Common/Constants";
import Admin from "./Admin";
import { jwtDecode } from "jwt-decode";


const { Title } = Typography;

const ManagePreferenceTags = () => {
  const [categories, setCategories] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currenttag, setCurrenttag] = useState(null);
  const [updatedName, setUpdatedName] = useState("");
  const [newtagName, setNewtagName] = useState("");
  const [addingtag, setAddingtag] = useState(false);

  // Fetch categories from the server
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(apiUrl + "tag");
        setCategories(response.data);
      } catch (error) {
        console.error(error);
        message.error("Failed to load preference tags.");
      }
    };

    fetchCategories();
  }, []);

  // Show update modal and set the selected tag
  const showUpdateModal = (tag) => {
    setCurrenttag(tag);
    setUpdatedName(tag.tag);
    setIsModalVisible(true);
  };

  // Handle update tag
  const handleUpdate = async () => {
    if (!updatedName) {
      message.error("Please provide a name for the Preference Tag.");
      return;
    }

    try {
      await axios.patch(apiUrl + `tag/${currenttag._id}`, {
        tag: updatedName,
      });

      const updatedCategories = categories.map((tag) =>
        tag._id === currenttag._id ? { ...tag, tag: updatedName } : tag
      );
      setCategories(updatedCategories);
      setIsModalVisible(false);
      message.success("Preference Tag updated successfully!");
    } catch (error) {
      console.error(error);
      message.error("Failed to update Preference Tag.");
    }
  };

  // Handle delete tag
  const handleDelete = async (tagId) => {
    try {
      await axios.delete( apiUrl + `tag/${tagId}`);
      const updatedCategories = categories.filter((tag) => tag._id !== tagId);
      setCategories(updatedCategories);
      message.success("Preference Tag deleted successfully!");
    } catch (error) {
      console.error(error);
      message.error("Failed to delete preference tag.");
    }
  };

  // Handle add new tag
  const handleAddtag = async () => {
    if (!newtagName) {
      message.error("Please provide a name for the new preference tag.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const decodedToken = jwtDecode(token);
      console.log(decodedToken);
      const response = await axios.post( apiUrl + "tag", {
        tag: newtagName, adminId: decodedToken.userDetails._id,
      });

      if (response.status === 201) {
        setCategories([...categories, response.data]);
        setNewtagName("");
        setAddingtag(false);
        message.success("Preference Tag added successfully!");
      }
    } catch (error) {
      console.error(error);
      message.error("Failed to add tag.");
    }
  };

  return (
    <div>
      <Title level={2} style={{ display: "inline-block" }}>
        Preference Tags
      </Title>

      {/* Updated Add Tag Functionality Positioned Below Title */}
      <div
        style={{
          marginTop: "16px",
          marginBottom: "24px",
          display: "flex",
          alignItems: "center",
        }}
      >
        {addingtag && (
          <div
            style={{
              marginRight: "8px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Input
              value={newtagName}
              onChange={(e) => setNewtagName(e.target.value)}
              placeholder="Enter new tag name"
              style={{ width: "200px", marginRight: "8px" }}
            />
            <Button type="primary" onClick={handleAddtag}>
              Add
            </Button>
          </div>
        )}

        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setAddingtag(!addingtag)}
        >
          Add Tag
        </Button>
      </div>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        {categories.map((tag) => (
          <Card key={tag._id} title={tag.tag} style={{ width: 300 }}>
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => showUpdateModal(tag)}
            />
            <Button
              type="text"
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(tag._id)}
              style={{
                marginLeft: "8px",
                color: "red",
              }}
            />
          </Card>
        ))}
      </div>

      <Modal
        title="Update Preference Tag"
        visible={isModalVisible}
        onOk={handleUpdate}
        onCancel={() => setIsModalVisible(false)}
      >
        <Input
          value={updatedName}
          onChange={(e) => setUpdatedName(e.target.value)}
          placeholder="Enter new preference tag name"
        />
      </Modal>
    </div>
  );
};

export default ManagePreferenceTags;

