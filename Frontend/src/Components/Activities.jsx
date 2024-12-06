import React, { useEffect, useState } from "react";
import {
  EditOutlined,
  DeleteOutlined,
  FlagOutlined,
  PlusOutlined,
  InboxOutlined,
} from "@ant-design/icons";
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
  Divider,
  Typography,
  Rate,
  Upload,
  Empty,
  Flex,
} from "antd";
import axios from "axios";
import Button from "./Common/CustomButton";
import { jwtDecode } from "jwt-decode";
import { apiUrl, getAvgRating } from "./Common/Constants";
import MapComponent from "./Common/Map";
import dayjs from "dayjs";
import { Colors } from "./Common/Constants";
import LoadingSpinner from "./Common/LoadingSpinner";

const { Dragger } = Upload;
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
  const { Title, Text } = Typography;
  const [fileList, setFileList] = useState([]);

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
      const errorMessage = error.response?.data?.message || "Please try again.";
      message.error(`Failed to fetch activities: ${errorMessage}`);
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
      const errorMessage = error.response?.data?.message || "Please try again.";
      message.error(`Error fetching categories: ${errorMessage}`);
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
      const errorMessage = error.response?.data?.message || "Please try again.";
      message.error(`Error fetching tags: ${errorMessage}`);
      console.error("Error fetching tags:", error);
      setTags([]);
    }
  };

  useEffect(() => {
    fetchActivities();
    fetchCategories();
    fetchTags();
  }, []);

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  const handleFileChange = ({ fileList: newFileList }) =>
    setFileList(newFileList);

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

      const formData = new FormData();
      if (values.pictures && values.pictures.length > 0) {
        for (let i = 0; i < values.pictures.length; i++) {
          formData.append("pictures", values.pictures[i].originFileObj);
        }
      }

      const response = await apiClient.post(
        `activity/createSpecifiedActivity/${userid}`,
        newActivity
      );

      const picResponse = await apiClient.post(
        `activity/uploadPhotos/${response.data._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setActivitiesData([...activitiesData, response.data]);
      console.log("activity:", response.data);
      message.success("Activity created successfully!");
      setIsModalVisible(false);
      form.resetFields();
      setSelectedLocation("");
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Please try again.";
      message.error(`Failed to create activity: ${errorMessage}`);
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
      const errorMessage = error.response?.data?.message || "Please try again.";
      message.error(`Failed to edit activity: ${errorMessage}`);
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
          const errorMessage =
            error.response?.data?.message || "Please try again.";
          message.error(`Failed to delete activity: ${errorMessage}`);
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
        <AntButton
          style={{
            backgroundColor: Colors.primary.default,
            border: "none",
            width: "30px",
            height: "30px",
            marginLeft: "auto",
          }}
          icon={<PlusOutlined style={{ color: "white" }} />}
          rounded={true}
          onClick={showModal}
        />
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : activitiesData.length > 0 ? (
        <Space
          direction="horizontal"
          size="middle"
          style={{ display: "flex", flexWrap: "wrap" }}
        >
          {activitiesData.map((activity) => {
            const avgRating = getAvgRating(activity?.feedback);
            return (
              <Card
                key={activity._id}
                cover={
                  activity.pictures?.length != 0 ? (
                    <Flex justify="center">
                      <img
                        alt={activity.pictures[0]}
                        style={{ height: "150px", width: "80%" }}
                        src={`/uploads/${activity.pictures[0]}.jpg`}
                      />
                    </Flex>
                  ) : null
                }
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
                  minWidth: 370,
                  maxWidth: 370,
                  maxHeight: 700,
                  minHeight: 700,
                  marginBottom: "8px",
                  marginRight: "14px",
                  border:
                    activity.isFlagged && activity.hidden
                      ? "3px solid red"
                      : "1px solid #e8e8e8",
                  position: "relative", // Set position to relative for positioning flag
                  borderRadius: "12px", // Rounded corners
                  padding: "16px", // Padding inside the card
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)", // Subtle shadow effect
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
                  title={
                    <Title
                      level={4}
                      style={{
                        fontWeight: "600",
                        marginBottom: "10px",
                        fontSize: "18px",
                        color: Colors.primary.default, // You can customize this color as needed
                      }}
                    >
                      {activity.name}
                    </Title>
                  }
                  description={
                    <div>
                      <p
                        style={{
                          overflow: "hidden", // Hides overflowing content
                          textOverflow: "ellipsis", // Adds "..." at the end of the truncated text
                          display: "-webkit-box", // Required for line clamping
                          WebkitBoxOrient: "vertical", // Required for line clamping
                          WebkitLineClamp: 3, // Number of lines to display
                          maxHeight: "2.5em",
                        }}
                      >
                        {activity.description}
                      </p>
                      <p
                        style={{
                          overflow: "hidden", // Hides overflowing content
                          textOverflow: "ellipsis", // Adds "..." to the truncated text
                          whiteSpace: "nowrap", // Prevents wrapping to a new line
                        }}
                      >
                        <Text strong>Location:</Text>{" "}
                        <a
                          href={activity.location}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            color: "#1890ff",
                            textDecoration: "none",
                          }}
                        >
                          {activity.location}
                        </a>
                      </p>
                      <p>
                        <Text strong>Datetime:</Text>{" "}
                        {new Date(activity.date).toLocaleString()}
                      </p>
                      <p>
                        <Text strong>Upper Limit:</Text> {activity.upper}
                      </p>
                      <p>
                        <Text strong>Lower Limit:</Text> {activity.lower}
                      </p>

                      <p>
                        <Text strong>Categories:</Text> {activity.category}
                      </p>

                      <p>
                        <Text strong>Tags:</Text>
                        {activity.tags.map((tagId) => (
                          <Tag
                            key={tagId}
                            color={Colors.primary.default}
                            style={{ margin: "3px" }}
                          >
                            {tags.find((tag) => tag._id === tagId)?.tag ||
                              tagId}
                          </Tag>
                        )) || "None"}
                      </p>

                      <p>
                        <Text strong>Available Spots:</Text> {activity.spots}
                      </p>
                      <p>
                        <Text strong>Is Open:</Text>{" "}
                        {activity.isOpen ? "Yes" : "No"}
                      </p>
                      <p>
                        <Text strong>Discounts:</Text> {activity.discounts}%
                      </p>
                      <p>
                        <Text strong>Flagged:</Text>{" "}
                        <span
                          style={{
                            color: activity.isFlagged ? "red" : "#555",
                          }}
                        >
                          {activity.isFlagged ? "Yes" : "No"}
                        </span>{" "}
                      </p>

                      <Rate value={avgRating} />
                    </div>
                  }
                />
              </Card>
            );
          })}
        </Space>
      ) : (
        <Empty description="Create your activity" />
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
              ({ getFieldValue }) => ({
                validator(_, value) {
                  const today = dayjs().startOf("day");
                  if (value && value.isBefore(today)) {
                    return Promise.reject(
                      new Error("The date cannot be in the past")
                    );
                  }
                  return Promise.resolve();
                },
              }),
            ]}
          >
            <DatePicker
              showTime
              format="YYYY-MM-DD HH:mm:ss"
              disabledDate={(current) =>
                current && current < dayjs().endOf("day")
              } // Disable dates before today
            />
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
              ({ getFieldValue }) => ({
                validator(_, value) {
                  let lower = getFieldValue("lower");
                  console.log("low", lower);
                  if (
                    lower !== undefined &&
                    value !== undefined &&
                    lower > value
                  ) {
                    return Promise.reject(
                      new Error(
                        "Upper limit must be greater than or equal to Lower limit"
                      )
                    );
                  }
                  return Promise.resolve();
                },
              }),
            ]}
          >
            <Input type="number" />
          </Form.Item>

          <Form.Item
            name="lower"
            label="Lower Limit"
            rules={[
              { required: true, message: "Please input the lower limit!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  let upper = getFieldValue("upper");
                  console.log("up", upper);
                  if (
                    upper !== undefined &&
                    value !== undefined &&
                    value > upper
                  ) {
                    return Promise.reject(
                      new Error(
                        "Lower limit must be less than or equal to Upper limit"
                      )
                    );
                  }
                  return Promise.resolve();
                },
              }),
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
              {
                validator: (_, value) =>
                  value >= 0
                    ? Promise.resolve()
                    : Promise.reject(
                        new Error(
                          "The number of spots must be greater than or equal to zero"
                        )
                      ),
              },
            ]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item name="isOpen" label="isOpen" valuePropName="checked">
            <Switch />
          </Form.Item>

          <Form.Item name="discounts" label="Discount %" initialValue={0}>
            <InputNumber min={0} max={100} placeholder="Enter discount value" />
          </Form.Item>

          {!editingActivityId && (
            <Form.Item
              label="Pictures"
              name="pictures"
              valuePropName="fileList"
              getValueFromEvent={normFile}
            >
              <Dragger
                name="pictures"
                listType="text"
                fileList={fileList}
                onChange={handleFileChange}
                beforeUpload={() => false}
                maxCount={3}
              >
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">
                  Click or drag file to this area to upload
                </p>
              </Dragger>
            </Form.Item>
          )}

          <Form.Item>
            <AntButton
              type="primary"
              htmlType="submit"
              style={{ backgroundColor: "#1b696a" }}
            >
              {editingActivityId ? "Save Changes" : "Create Activity"}
            </AntButton>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Activities;
