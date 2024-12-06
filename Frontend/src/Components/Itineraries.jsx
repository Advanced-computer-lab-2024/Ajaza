import React, { useEffect, useState } from "react";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  MinusCircleOutlined,
  FlagOutlined,
  InboxOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Card,
  Space,
  Modal,
  message,
  Form,
  Input,
  Button as AntButton,
  Select,
  InputNumber,
  Switch,
  Divider,
  Flex,
  Tag,
  Typography,
  Upload,
  Empty,
} from "antd";
import axios from "axios";
import Button from "./Common/CustomButton";
import { jwtDecode } from "jwt-decode";
import { apiUrl, Colors } from "./Common/Constants";
import { Color } from "antd/es/color-picker";
import LoadingSpinner from "./Common/LoadingSpinner";
import dayjs from "dayjs";

const { Option } = Select;
const { Dragger } = Upload;

const apiClient = axios.create({
  baseURL: apiUrl,
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

const Itineraries = () => {
  const [itinerariesData, setItinerariesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingItineraryId, setEditingItineraryId] = useState(null);
  const [tags, setTags] = useState([]);
  const [canEdit, setCanEdit] = useState(true);
  const [touristsData, setTouristsData] = useState([]);
  const { Title, Text } = Typography;
  const [fileList, setFileList] = useState([]);

  const [form] = Form.useForm();
  const [options, setOptions] = useState([]);

  useEffect(() => {
    // Fetch the list of activities/venues
    const fetchOptions = async () => {
      try {
        //const response = await axios.get('http://localhost:5000/itinerary/fetchOptions');
        const response = await apiClient.get(
          `/itinerary/fetchOptions/fetchOptions`
        );
        console.log("Options:", response.data); // Debugging line
        const data = await response.data;
        setOptions(data); // Set the fetched data to state
      } catch (error) {
        console.error("Failed to fetch options:", error);
      }
    };

    fetchOptions();
  }, []);

  const optionsMap = options.reduce((acc, option) => {
    acc[option.id] = option; // Use option.id as the key
    return acc;
  }, {});

  let decodedToken = null;
  const token = localStorage.getItem("token");
  if (token) {
    decodedToken = jwtDecode(token);
  }
  const userid = decodedToken ? decodedToken.userId : null;

  const fetchItineraries = async () => {
    try {
      const response = await apiClient.get(
        `/itinerary/readItinerariesOfGuide/${userid}`
      );
      setItinerariesData(response.data);
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Please try again.";
      message.error(`${errorMessage}`);
    } finally {
      setLoading(false);
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

  const fetchTourists = async () => {
    try {
      const response = await apiClient.get("/tourist/");
      setTouristsData(response.data);
      console.log("Tourists:", response.data); // Debugging line
    } catch (error) {
      console.error("Error fetching tourists:", error);
    }
  };

  useEffect(() => {
    if (decodedToken?.role == "guide") {
      fetchItineraries();
      fetchTags();
      fetchTourists();
    }
  }, []);

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  const createItinerary = async (values) => {
    try {
      console.log("Form Values:", values); // Debugging line
      const newItinerary = {
        name: values.name,
        language: values.language,
        price: values.price,
        availableDateTime: (values.availableDateTime || []).map((date) => ({
          date: new Date(date.date),
          spots: date.spots,
        })),
        pickUp: values.pickUp,
        dropOff: values.dropOff,
        accessibility: values.accessibility,
        maxTourists: values.maxTourists,
        tags: values.tags,
        active: values.active !== undefined ? values.active : false,
        timeline: (values.timeline || []).map((entry) => ({
          start: entry.start,
          id: entry.id,
          type: optionsMap[entry.id]?.type || null,
          duration: entry.duration,
        })),
        feedback: [],
      };

      const formData = new FormData();
      if (values.pictures && values.pictures.length > 0) {
        for (let i = 0; i < values.pictures.length; i++) {
          formData.append("pictures", values.pictures[i].originFileObj);
        }
      }

      const response = await apiClient.post(
        `/itinerary/createSpecifiedItinerary/${userid}`,
        newItinerary
      );

      const picResponse = await apiClient.post(
        `itinerary/uploadPhotos/${response.data._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setItinerariesData([...itinerariesData, response.data]);
      message.success("Itinerary created successfully!");
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Please try again.";
      message.error(`Failed to create itinerary,${errorMessage}`);
    }
  };

  const editItinerary = async (values) => {
    try {
      const originalItinerary = itinerariesData.find(
        (itinerary) => itinerary._id === editingItineraryId
      );
      console.log("Original Itinerary:", originalItinerary);
      console.log("Form Values:", values);

      const updatedFields = {};

      const timelineWithTypes = (values.timeline || []).map((entry) => ({
        ...entry,
        type: optionsMap[entry.id]?.type || null, // Ensure type is included
      }));

      // Deep comparison for timeline
      if (
        JSON.stringify(timelineWithTypes) !==
        JSON.stringify(originalItinerary.timeline)
      ) {
        updatedFields.timeline = timelineWithTypes;
      }
      console.log("edit:", updatedFields);

      // Only include the fields that have changed
      Object.keys(values).forEach((key) => {
        if (key !== "timeline" && values[key] !== originalItinerary[key]) {
          updatedFields[key] = values[key];
        }
      });

      if (Object.keys(updatedFields).length === 0) {
        message.info("No changes detected.");
        return;
      }

      const response = await apiClient.patch(
        `itinerary/updateItineraryFilteredFields/${userid}/${editingItineraryId}`,
        updatedFields
      );
      setItinerariesData(
        itinerariesData.map((itinerary) =>
          itinerary._id === editingItineraryId ? response.data : itinerary
        )
      );

      message.success("Itinerary updated successfully!");
      setIsModalVisible(false);
      form.resetFields();
      setEditingItineraryId(null);
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Please try again.";
      message.error(`Failed to update itinerary,${errorMessage}`);
    }
  };

  const deleteItinerary = async (id) => {
    Modal.confirm({
      title: "Are you sure?",
      content: "Do you want to delete this itinerary?",
      onOk: async () => {
        try {
          await apiClient.delete(
            `itinerary/deleteSpecificItinerary/${userid}/${id}`
          );
          setItinerariesData(
            itinerariesData.filter((itinerary) => itinerary._id !== id)
          );
          message.success("Itinerary deleted successfully!");
        } catch (error) {
          const errorMessage =
            error.response?.data?.message || "Please try again.";
          message.error(`Failed to delete itinerary,${errorMessage}`);
        }
      },
    });
  };

  const openEditModal = (itineraryId) => {
    const isBooked = touristsData.some((tourist) =>
      tourist.itineraryBookings?.some(
        (booking) => booking.itineraryId === itineraryId
      )
    );
    setCanEdit(isBooked);

    setEditingItineraryId(itineraryId);
    const itineraryToEdit = itinerariesData.find(
      (itinerary) => itinerary._id === itineraryId
    );

    form.setFieldsValue({
      ...itineraryToEdit,
      timeline:
        itineraryToEdit.timeline.length > 0 ? itineraryToEdit.timeline : [{}],
    });

    setIsModalVisible(true);
  };

  const handleFileChange = ({ fileList: newFileList }) =>
    setFileList(newFileList);

  const showModal = () => {
    setEditingItineraryId(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  return (
    <div style={{ display: "flex" }}>
      <div style={{ padding: "20px", flexGrow: 1 }}>
        <h2>My Itineraries</h2>
        <div
          style={{
            marginBottom: "20px",
            display: "flex",
            justifyContent: "flex-start",
          }}
        >
          {/* <AntButton
            style={{
              width: "30px",
              height: "30px",
              borderRadius: "10px",
              backgroundColor: Colors.primary.default,
            }}
            icon={<PlusOutlined style={{ color: "white" }} />}
            onClick={showModal}
          /> */}
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
        ) : itinerariesData.length == 0 ? (
          <Empty />
        ) : (
          <Space
            direction="horizontal"
            size="middle"
            style={{ display: "flex", flexWrap: "wrap" }}
          >
            {itinerariesData.map((itinerary) => (
              <Card
                key={itinerary._id}
                actions={[
                  <EditOutlined
                    key="edit"
                    onClick={() => openEditModal(itinerary._id)}
                  />,
                  <DeleteOutlined
                    key="delete"
                    onClick={() => deleteItinerary(itinerary._id)}
                  />,
                ]}
                cover={
                  itinerary.pictures?.length != 0 ? (
                    <Flex justify="center">
                      <img
                        alt={itinerary.pictures[0]}
                        style={{ height: "150px", width: "80%" }}
                        src={`/uploads/${itinerary.pictures[0]}.jpg`}
                      />
                    </Flex>
                  ) : null
                }
                style={{
                  minWidth: 370,
                  maxWidth: 370,
                  maxHeight: 700,
                  minHeight: 700,
                  marginBottom: "8px",
                  marginRight: "12px",
                  border:
                    itinerary.isFlagged && itinerary.hidden
                      ? "3px solid red"
                      : "1px solid #e8e8e8",
                  position: "relative", // Set position to relative for positioning flag
                  borderRadius: "12px", // Rounded corners
                  padding: "16px", // Padding inside the card
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                }}
              >
                {itinerary.isFlagged && itinerary.hidden && (
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
                      {itinerary.name}
                    </Title>
                  }
                  description={
                    <div>
                      <p
                        style={{
                          overflow: "hidden", // Hides overflowing content
                          textOverflow: "ellipsis", // Adds "..." to truncated text
                          display: "-webkit-box", // Required for line clamping
                          WebkitBoxOrient: "vertical", // Required for line clamping
                          WebkitLineClamp: 3, // Number of lines to display
                          lineHeight: "1.2em", // Ensure consistent line height
                          maxHeight: "2.6em", // Adjust according to line height * line clamp
                        }}
                      >
                        {itinerary.description}
                      </p>
                      <p>
                        <Text strong>Price:</Text>{" "}
                        <span style={{ color: "#5b8b77" }}>
                          {itinerary.price}
                        </span>
                      </p>
                      <p>
                        <Text strong>Language:</Text> {itinerary.language}
                      </p>
                      <p>
                        <Text strong>Pick Up Location:</Text> {itinerary.pickUp}
                      </p>
                      <p>
                        <Text strong>Drop Off Location:</Text>{" "}
                        {itinerary.dropOff}
                      </p>
                      <p>
                        <Text strong>Maximum Tourists:</Text>{" "}
                        {itinerary.maxTourists}
                      </p>
                      <p>
                        <Text strong>Active:</Text>{" "}
                        {itinerary.active ? "Yes" : "No"}
                      </p>
                      <p>
                        <Text strong>Accessibility:</Text>{" "}
                        <span>
                          {itinerary.accessibility || "Not specified"}
                        </span>
                      </p>
                      <p>
                        <Text strong>Tags:</Text>{" "}
                        {itinerary.tags?.map((tagId) => (
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
                      <p
                        style={{
                          overflow: "hidden", // Hides overflowing content
                          textOverflow: "ellipsis", // Adds "..." at the end of the truncated text
                          display: "-webkit-box", // Enables multi-line truncation
                          WebkitBoxOrient: "vertical", // Required for line clamping
                          WebkitLineClamp: 1, // Limits the text to 2 lines
                        }}
                      >
                        <Text strong>Available Dates:</Text>{" "}
                        <span>
                          {itinerary.availableDateTime.length > 0
                            ? itinerary.availableDateTime
                                .map(
                                  (dateEntry) =>
                                    `${new Date(
                                      dateEntry.date
                                    ).toLocaleDateString()} (Spots: ${
                                      dateEntry.spots
                                    })`
                                )
                                .join(", ")
                            : "No available dates"}
                        </span>
                      </p>
                      <p
                        style={{
                          overflow: "hidden", // Hides overflowing content
                          textOverflow: "ellipsis", // Adds "..." at the end of the truncated text
                          display: "-webkit-box", // Enables multi-line truncation
                          WebkitBoxOrient: "vertical", // Required for line clamping
                          WebkitLineClamp: 1, // Limits the text to 2 lines
                        }}
                      >
                        <Text strong>Timeline:</Text>{" "}
                        <span>
                          {itinerary.timeline.length > 0
                            ? itinerary.timeline
                                .map(
                                  (entry) =>
                                    `Start: ${entry.start}, Duration: ${entry.duration} mins, type: ${entry.type}`
                                )
                                .join(", ")
                            : "No timeline available"}
                        </span>
                      </p>

                      <p>
                        <Text strong>Flagged:</Text>{" "}
                        <span
                          style={{
                            color: itinerary.isFlagged ? "red" : "#555",
                          }}
                        >
                          {itinerary.isFlagged ? "Yes" : "No"}
                        </span>
                      </p>
                    </div>
                  }
                />
              </Card>
            ))}
          </Space>
        )}

        {/* Modal for creating/editing an itinerary */}
        <Modal
          title={editingItineraryId ? "Edit Itinerary" : "Create Itinerary"}
          visible={isModalVisible}
          onCancel={handleCancel}
          footer={null}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={editingItineraryId ? editItinerary : createItinerary}
          >
            <Form.Item
              name="name"
              label="Itinerary Name"
              rules={[
                { required: true, message: "Please enter the itinerary name" },
              ]}
            >
              <Input placeholder="Enter itinerary name" />
            </Form.Item>

            <Form.Item
              name="language"
              label="Language"
              rules={[{ required: true, message: "Please select a language" }]}
            >
              <Select placeholder="Select a language">
                <Option value="English">English</Option>
                <Option value="Spanish">Spanish</Option>
                <Option value="French">French</Option>
                <Option value="Arabic">Arabic</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="price"
              label="Price"
              rules={[{ required: true, message: "Please enter the price" }]}
            >
              <InputNumber
                placeholder="Enter price"
                style={{ width: "100%" }}
              />
            </Form.Item>

            <Form.Item
              name="pickUp"
              label="Pick Up Location"
              rules={[
                {
                  required: true,
                  message: "Please enter the pick up location",
                },
              ]}
            >
              <Input placeholder="Enter pick up location" />
            </Form.Item>

            <Form.Item
              name="dropOff"
              label="Drop Off Location"
              rules={[
                {
                  required: true,
                  message: "Please enter the drop off location",
                },
              ]}
            >
              <Input placeholder="Enter drop off location" />
            </Form.Item>

            <Form.Item name="accessibility" label="Accessibility">
              <Input placeholder="Enter accessibility options" />
            </Form.Item>

            <Form.Item
              name="maxTourists"
              label="Maximum Tourists"
              rules={[
                {
                  required: true,
                  message: "Please enter the max number of tourists",
                },
              ]}
            >
              <InputNumber
                min={1}
                placeholder="Enter max tourists"
                style={{ width: "100%" }}
              />
            </Form.Item>

            <Form.Item name="active" label="Active" valuePropName="checked">
              <Switch disabled={!canEdit} />
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

            <Form.List name="timeline">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <div key={key} style={{ display: "flex", marginBottom: 8 }}>
                      <Form.Item
                        {...restField}
                        name={[name, "start"]}
                        label="Start Time"
                        rules={[
                          {
                            required: true,
                            message: "Please enter the start time",
                          },
                        ]}
                        style={{ flex: 1, marginRight: 8 }}
                      >
                        <InputNumber
                          min={0}
                          max={2359}
                          placeholder="Enter start time (e.g. 1300 for 1 PM)"
                        />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, "id"]}
                        label="Activity/Venue"
                        rules={[
                          {
                            required: true,
                            message: "Please select an option",
                          },
                        ]}
                        style={{ flex: 1, marginRight: 8 }}
                      >
                        <Select placeholder="Select an option" allowClear>
                          {options.map((option) => (
                            //<Select.Option key={option.id} value={option.id}>
                            <Select.Option key={option.id} value={option.id}>
                              {option.name}{" "}
                              {/* Adjust this based on your options' structure */}
                            </Select.Option>
                          ))}
                        </Select>
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, "duration"]}
                        label="Duration"
                        rules={[
                          { required: true, message: "Please enter duration" },
                        ]}
                        style={{ flex: 1, marginRight: 8 }}
                      >
                        <InputNumber
                          min={1}
                          placeholder="Enter duration in minutes"
                        />
                      </Form.Item>
                      <AntButton
                        type="link"
                        onClick={() => remove(name)}
                        icon={<MinusCircleOutlined />}
                      >
                        Remove
                      </AntButton>
                    </div>
                  ))}
                  <AntButton
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                  >
                    Add Timeline Entry
                  </AntButton>
                </>
              )}
            </Form.List>

            {/* Available date time entries */}
            <Form.List name="availableDateTime">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, fieldKey, name }) => (
                    <div key={key} style={{ display: "flex", marginBottom: 8 }}>
                      <Form.Item
                        {...fieldKey}
                        name={[name, "date"]}
                        fieldKey={[fieldKey[0], "date"]}
                        label="Available Date"
                        rules={[
                          { required: true, message: "Missing date" },
                          {
                            validator: (_, value) => {
                              const today = dayjs().startOf("day");
                              if (value && dayjs(value).isBefore(today)) {
                                return Promise.reject(
                                  new Error(
                                    "Itinerary date cannot be in the past"
                                  )
                                );
                              }
                              return Promise.resolve();
                            },
                          },
                        ]}
                        style={{ marginRight: 16 }} // Add margin to separate available date and available spots in the form
                      >
                        <Input type="date" />
                      </Form.Item>
                      <Form.Item
                        {...fieldKey}
                        name={[name, "spots"]}
                        fieldKey={[fieldKey[0], "spots"]}
                        label="Available Spots"
                        rules={[{ required: true, message: "Missing spots" }]}
                      >
                        <InputNumber min={1} placeholder="Enter spots" />
                      </Form.Item>
                      <AntButton type="link" onClick={() => remove(name)}>
                        Remove
                      </AntButton>
                    </div>
                  ))}
                  <AntButton
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                  >
                    Add Available Date
                  </AntButton>
                </>
              )}
            </Form.List>

            {!editingItineraryId && (
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
                style={{
                  marginTop: "10px",
                  backgroundColor: Colors.primary.default,
                }}
              >
                {editingItineraryId ? "Update Itinerary" : "Create Itinerary"}
              </AntButton>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

//backup
/*<Form.Item
  {...restField}
  name={[name, 'type']}
  label="Type"
  rules={[{ required: true, message: "Please select a type" }]}
  style={{ flex: 1, marginRight: 8 }}
>
  <Select placeholder="Select type">
    <Select.Option value="Venue">Venue</Select.Option>
    <Select.Option value="Activity">Activity</Select.Option>
  </Select>
</Form.Item> */

export default Itineraries;
