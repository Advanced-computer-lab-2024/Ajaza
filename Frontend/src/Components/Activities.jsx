import React, { useEffect, useState } from "react";
import { EditOutlined, DeleteOutlined, FlagOutlined } from "@ant-design/icons";
import {
  InputNumber,
  Card,
  Space,
  Modal,
  message,
  Form,
  Input,
  Button as AntButton,
  Select,
  DatePicker,
  Switch,
  Tag,
} from "antd";
import axios from "axios";
import Button from "./Common/CustomButton";
import { jwtDecode } from "jwt-decode";
import { apiUrl } from "./Common/Constants";
import MapComponent from "./Common/Map";
import dayjs from "dayjs";

// Create an axios instance with default headers
const apiClient = axios.create({
  baseURL: apiUrl,
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`, // Set the token from localStorage
  },
});

const Activities = () => {
  const [activitiesData, setActivitiesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingActivityId, setEditingActivityId] = useState(null);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [form] = Form.useForm();
  const [selectedLocation, setSelectedLocation] = useState(null);

  const token = localStorage.getItem("token");
  let decodedToken = null;
  if (token) {
    decodedToken = jwtDecode(token);
  }
  const userid = decodedToken ? decodedToken.userId : null;

  const fetchActivities = async () => {
    try {
      const response = await apiClient.get(`activity/readActivities/${userid}`);
      setActivitiesData(response.data);
    } catch (error) {
      message.error("Failed to fetch activities.");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await apiClient.get("category");
      setCategories(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategories([]);
    }
  };

  const fetchTags = async () => {
    try {
      const response = await apiClient.get("tag");
      setTags(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching tags:", error);
      setTags([]);
    }
  };

  useEffect(() => {
    fetchActivities();
    fetchCategories();
    fetchTags();
  }, []);

  const createActivity = async (values) => {
    try {
      const newActivity = {
        // advertiserId: userid,
        name: values.name,
        date: values.date,
        location: selectedLocation,
        upper: values.upper,
        lower: values.lower,
        category: values.category,
        tags: values.tags,
        discounts: values.discounts || 0,
        spots: values.spots,
        isOpen: values.isOpen,
        feedback: values.feedback,
        transportation: values.transportation,
      };

      const response = await apiClient.post(
        `activity/createSpecifiedActivity/${userid}`,
        newActivity
      );
      setActivitiesData([...activitiesData, response.data]);
      console.log("activity:", response.data);
      message.success("Activity created successfully!");
      setIsModalVisible(false);
      form.resetFields();
      setSelectedLocation("");
    } catch (error) {
      message.error("Failed to create activity.");
    }
  };

  const editActivity = async (values) => {
    try {
      const originalActivity = activitiesData.find(
        (activity) => activity._id === editingActivityId
      );
      const updatedFields = {};

      Object.keys(values).forEach((key) => {
        if (key === "tags") {
          const originalTags = originalActivity.tags.map((tag) =>
            tag.toString()
          );
          const newTags = values.tags.map((tag) => tag.toString());

          if (JSON.stringify(originalTags) !== JSON.stringify(newTags)) {
            updatedFields[key] = newTags;
          }
        } else if (key === "category") {
          const selectedCategories = values.category || []; // Ensure it’s an array

          // If selectedCategories is empty, set it to an empty array
          if (selectedCategories.length === 0) {
            updatedFields[key] = []; // or use `null` based on your requirement
          } else {
            // Only update if the selected categories have changed
            if (
              JSON.stringify(originalActivity.category) !==
              JSON.stringify(selectedCategories)
            ) {
              updatedFields[key] = selectedCategories; // Store the selected category IDs directly
            }
          }
        } else if (values[key] !== originalActivity[key]) {
          updatedFields[key] = values[key];
        }
        console.log(updatedFields);
      });

      if (Object.keys(updatedFields).length === 0) {
        message.info("No changes detected.");
        return;
      }

      const response = await apiClient.put(
        `activity/updateActivityFilteredFields/${userid}/${editingActivityId}`,
        updatedFields
      );
      setActivitiesData(
        activitiesData.map((activity) =>
          activity._id === editingActivityId ? response.data : activity
        )
      );

      message.success("Activity updated successfully!");
      setIsModalVisible(false);
      form.resetFields();
      setEditingActivityId(null);
      setSelectedLocation(updatedFields.location);
    } catch (error) {
      message.error("Failed to update activity.");
    }
  };

  const deleteActivity = async (id) => {
    Modal.confirm({
      title: "Are you sure?",
      content: "Do you want to delete this activity?",
      onOk: async () => {
        try {
          await apiClient.delete(
            `activity/deleteSpecificActivity/${userid}/${id}`
          );
          setActivitiesData(
            activitiesData.filter((activity) => activity._id !== id)
          );
          message.success("Activity deleted successfully!");
        } catch (error) {
          message.error("Failed to delete activity.");
        }
      },
    });
  };

  const showModal = () => {
    setEditingActivityId(null);
    setIsModalVisible(true);
    form.resetFields();
  };

  const showEditModal = (activity) => {
    const date = dayjs(activity.date); // Convert activity.date to a dayjs object

    setIsModalVisible(true);
    form.setFieldsValue({
      name: activity.name,
      date: date, // Set the date as a dayjs object
      location: activity.location,
      upper: activity.upper,
      lower: activity.lower,
      category: activity.category.length > 0 ? activity.category : null,
      tags: activity.tags,
      discounts: activity.discounts,
      spots: activity.spots,
      isOpen: activity.isOpen,
    });
    setEditingActivityId(activity._id);
    setSelectedLocation(activity.location);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingActivityId(null);
    form.resetFields();
  };

  const handleLocationSelect = (location) => {
    const { lat, lng } = location; // Destructure latitude and longitude
    console.log("Latitude:", lat, "Longitude:", lng); // This should log numbers
    const locationLink = `https://www.google.com/maps?q=${lat},${lng}`;
    setSelectedLocation(locationLink);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>My Activities</h2>
      <div
        style={{
          marginBottom: "20px",
          display: "flex",
          justifyContent: "flex-start",
        }}
      >
        <Button
          size={"s"}
          value={"Create Activity"}
          rounded={true}
          onClick={showModal}
        />
      </div>
      {loading ? (
        <p>Loading activities...</p>
      ) : (
        <Space
          direction="horizontal"
          size="middle"
          style={{ display: "flex", flexWrap: "wrap" }}
        >
          {activitiesData.map((activity) => (
            <Card
              key={activity._id}
              actions={[
                <EditOutlined
                  key="edit"
                  onClick={() => showEditModal(activity)}
                />,
                <DeleteOutlined
                  key="delete"
                  onClick={() => deleteActivity(activity._id)}
                />,
              ]}
              style={{
                minWidth: 300,
                border:
                  activity.isFlagged && activity.hidden
                    ? "3px solid red"
                    : "none",
                position: "relative", // Set position to relative for positioning flag
              }}
            >
              {activity.isFlagged && activity.hidden && (
                <FlagOutlined
                  style={{
                    position: "absolute",
                    top: "8px",
                    right: "8px",
                    color: "red",
                    fontSize: "25px",
                  }}
                />
              )}

              <Card.Meta
                title={activity.name}
                description={
                  <div>
                    <p>{activity.description}</p>
                    <p>
                      <strong>Location:</strong>{" "}
                      {
                        <a
                          href={activity.location}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {activity.location}
                        </a>
                      }
                    </p>
                    <p>
                      <strong>Datetime:</strong>{" "}
                      {new Date(activity.date).toLocaleString()}
                    </p>
                    <p>
                      <strong>Upper Limit:</strong> {activity.upper}
                    </p>
                    <p>
                      <strong>Lower Limit:</strong> {activity.lower}
                    </p>
                    <p>
                      <strong>Categories:</strong> {activity.category}
                    </p>
                    <p>
                      <strong>Tags:</strong>{" "}
                      {activity.tags
                        .map(
                          (tagId) =>
                            tags.find((tag) => tag._id === tagId)?.tag || tagId
                        )
                        .join(", ")}
                    </p>{" "}
                    <p>
                      <strong>Available Spots:</strong> {activity.spots}
                    </p>
                    <p>
                      <strong>IsOpen:</strong> {activity.isOpen ? "Yes" : "No"}
                    </p>
                    <p>
                      <strong>Discounts:</strong> {activity.discounts}%
                    </p>
                    <p>
                      <strong>Flagged:</strong>{" "}
                      {activity.isFlagged ? "Yes" : "No"}
                    </p>
                  </div>
                }
              />
            </Card>
          ))}
        </Space>
      )}

      <Modal
        title={editingActivityId ? "Edit Activity" : "Create Activity"}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={editingActivityId ? editActivity : createActivity}
        >
          <Form.Item
            name="name"
            label="Activity Name"
            rules={[
              { required: true, message: "Please input the activity name!" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="date"
            label="Date"
            rules={[
              { required: true, message: "Please input the activity date!" },
            ]}
          >
            <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />
          </Form.Item>

          <Form.Item
            label="Location"
            required
            validateStatus={!selectedLocation ? "error" : ""}
            help={!selectedLocation ? "Please select a location." : ""}
          >
            <div>
              <MapComponent onLocationSelect={handleLocationSelect} />
              <p>
                Selected Location:{" "}
                {selectedLocation ? (
                  <a
                    href={selectedLocation}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {selectedLocation}
                  </a>
                ) : (
                  "None"
                )}
              </p>
            </div>
          </Form.Item>

          <Form.Item
            name="upper"
            label="Upper Limit"
            rules={[
              { required: true, message: "Please input the upper limit!" },
            ]}
          >
            <Input type="number" />
          </Form.Item>

          <Form.Item
            name="lower"
            label="Lower Limit"
            rules={[
              { required: true, message: "Please input the lower limit!" },
            ]}
          >
            <Input type="number" />
          </Form.Item>

          <Form.Item name="category" label="Category">
            <Select placeholder="Select a category" allowClear>
              {categories.map((category) => (
                <Select.Option key={category._id} value={category.category}>
                  {category.category}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="tags" label="Tags">
            <Select mode="multiple" placeholder="Select Tags" allowClear>
              {tags.map((tag) => (
                <Select.Option key={tag._id} value={tag.tag}>
                  {tag.tag}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="spots"
            label="Available Spots"
            rules={[
              {
                required: true,
                message: "Please input the number of available spots!",
              },
            ]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item name="isOpen" label="isOpen" valuePropName="checked">
            <Switch />
          </Form.Item>

          <Form.Item name="discounts" label="Discount" initialValue={0}>
            <InputNumber min={0} max={100} placeholder="Enter discount value" />
          </Form.Item>

          <Form.Item>
            <AntButton type="primary" htmlType="submit">
              {editingActivityId ? "Save Changes" : "Create Activity"}
            </AntButton>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Activities;
