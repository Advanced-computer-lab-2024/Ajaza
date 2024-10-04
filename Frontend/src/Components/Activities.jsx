import React, { useEffect, useState } from "react";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Avatar, Card, Space, Modal, message, Form, Input, Button as AntButton } from "antd";
import axios from "axios";
import Button from "./Common/CustomButton";

const Activities = () => {
    const [activitiesData, setActivitiesData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingActivityId, setEditingActivityId] = useState(null);
    const [form] = Form.useForm();

    const fetchActivities = async () => {
        try {
            const response = await axios.get("http://localhost:4000/activity/readActivities/63f1a2b2e5a1f81b9f6c0e23/");
            console.log("Response:", response);
            setActivitiesData(response.data);
        } catch (error) {
            console.error("Error fetching activities:", error);
            message.error("Failed to fetch activities.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchActivities();
    }, []);

    const createActivity = async (values) => {
        try {
            const newActivity = {
                advertiserId: "63f1a2b2e5a1f81b9f6c0e23",
                name: values.name,
                date: values.date,
                location: values.location,
                upper: values.upper,
                lower: values.lower,
                category: values.category.split(",").map((cat) => cat.trim()),
                tags: values.tags.split(",").map((tag) => tag.trim()),
                discounts: values.discounts,
                spots: values.spots,
                isOpen: values.isOpen,
                feedback: values.feedback,
                transportation: values.transportation
            };

            const response = await axios.post("http://localhost:4000/activity/createSpecifiedActivity/", newActivity);
            setActivitiesData([...activitiesData, response.data]);
            message.success("Activity created successfully!");
            setIsModalVisible(false); // Close the modal after success
            form.resetFields(); // Reset the form fields
        } catch (error) {
            console.error("Error creating activity:", error);
            message.error("Failed to create activity.");
        }
    };

    const editActivity = async (values) => {
        try {
            const updatedActivity = {
                name: values.name,
                date: values.date,
                location: values.location,
                upper: values.upper,
                lower: values.lower,
                category: values.category.split(",").map((cat) => cat.trim()),
                tags: values.tags.split(",").map((tag) => tag.trim()),
                discounts: values.discounts,
                spots: values.spots,
                isOpen: values.isOpen,
                // feedback: values.feedback,
                // transportation: values.transportation
            };

            const response = await axios.patch(`http://localhost:4000/activity/editActivity/${editingActivityId}`, updatedActivity);
            setActivitiesData(activitiesData.map(activity => 
                activity._id === editingActivityId ? response.data : activity
            ));
            message.success("Activity updated successfully!");
            setIsModalVisible(false); // Close the modal after success
            form.resetFields(); // Reset the form fields
            setEditingActivityId(null); // Reset editing ID
        } catch (error) {
            console.error("Error editing activity:", error);
            message.error("Failed to update activity.");
        }
    };

    // Function to handle deleting an activity
    const deleteActivity = async (id) => {
        Modal.confirm({
            title: "Are you sure?",
            content: "Do you want to delete this activity?",
            onOk: async () => {
                try {
                    await axios.delete(`http://localhost:4000/activity/deleteSpecificActivity/${id}`);
                    setActivitiesData(activitiesData.filter((activity) => activity._id !== id));
                    message.success("Activity deleted successfully!");
                } catch (error) {
                    console.error("Error deleting activity:", error);
                    message.error("Failed to delete activity.");
                }
            },
        });
    };

    // Show modal for creating a new activity
    const showModal = () => {
        setIsModalVisible(true);
        form.resetFields(); // Reset fields for new entry
    };

    // Show modal for editing an activity
    const showEditModal = (activity) => {
        setIsModalVisible(true);
        form.setFieldsValue({
            name: activity.name,
            date: activity.date,
            location: activity.location,
            upper: activity.upper,
            lower: activity.lower,
            category: activity.category.join(", "),
            tags: activity.tags.join(", "),
            discounts: activity.discounts,
            spots: activity.spots,
            isOpen: activity.isOpen,
            // feedback: activity.feedback,
            // transportation: activity.transportation,
        });
        setEditingActivityId(activity._id); // Set the ID of the activity to be edited
    };

    // Handle modal cancellation
    const handleCancel = () => {
        setIsModalVisible(false);
        setEditingActivityId(null); // Reset editing ID
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
                    <Button size={"s"} value={"Create Activity"} rounded={true} onClick={showModal} />
                </div>
                {loading ? (
                    <p>Loading activities...</p>
                ) : (
                    <Space direction="horizontal" size="middle" style={{ display: "flex" }}>
                        {activitiesData.map((activity) => (
                            <Card
                                key={activity._id}
                                actions={[
                                    <EditOutlined key="edit" onClick={() => showEditModal(activity)} />,
                                    <DeleteOutlined key="delete" onClick={() => deleteActivity(activity._id)} />,
                                ]}
                                style={{ minWidth: 300 }}
                            >
                                <Card.Meta
                                    title={activity.name}
                                    description={
                                        <div>
                                            <p>{activity.description}</p>
                                            <p>
                                                <strong>Location:</strong> {activity.location}
                                            </p>
                                            <p>
                                                <strong>Date:</strong> {new Date(activity.date).toLocaleDateString()}
                                            </p>
                                            <p>
                                                <strong>Upper Limit:</strong> {activity.upper}
                                            </p>
                                            <p>
                                                <strong>Lower Limit:</strong> {activity.lower}
                                            </p>
                                            <p>
                                                <strong>Category:</strong> {activity.category.join(", ")}
                                            </p>
                                            <p>
                                                <strong>Tags:</strong> {activity.tags.join(", ")}
                                            </p>
                                            <p>
                                                <strong>Available Spots:</strong> {activity.spots}
                                            </p>
                                            {/* <p>
                                                <strong>Feedback:</strong> {activity.feedback}
                                            </p>
                                            <p>
                                                <strong>Transportation:</strong> {activity.transportation}
                                            </p> */}
                                        </div>
                                    }
                                />
                            </Card>
                        ))}
                    </Space>
                )}

                {/* Modal for creating or editing an activity */}
                <Modal title={editingActivityId ? "Edit Activity" : "Create Activity"} open={isModalVisible} onCancel={handleCancel} footer={null}>
                    <Form form={form} layout="vertical" onFinish={editingActivityId ? editActivity : createActivity}>
                        <Form.Item
                            name="name"
                            label="Activity Name"
                            rules={[{ required: true, message: "Please input the activity name!" }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            name="date"
                            label="Date"
                            rules={[{ required: true, message: "Please input the activity date!" }]}
                        >
                            <Input type="date" />
                        </Form.Item>

                        <Form.Item
                            name="location"
                            label="Location"
                            rules={[{ required: true, message: "Please input the location!" }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            name="upper"
                            label="Upper Limit"
                            rules={[{ required: true, message: "Please input the upper limit!" }]}
                        >
                            <Input type="number" />
                        </Form.Item>

                        <Form.Item
                            name="lower"
                            label="Lower Limit"
                            rules={[{ required: true, message: "Please input the lower limit!" }]}
                        >
                            <Input type="number" />
                        </Form.Item>

                        <Form.Item
                            name="category"
                            label="Category"
                            rules={[{ required: true, message: "Please input the category!" }]}
                        >
                            <Input placeholder="Comma-separated categories" />
                        </Form.Item>

                        <Form.Item name="tags" label="Tags">
                            <Input placeholder="Comma-separated tags" />
                        </Form.Item>

                        <Form.Item
                            name="spots"
                            label="Available Spots"
                            rules={[{ required: true, message: "Please input the number of available spots!" }]}
                        >
                            <Input type="number" />
                        </Form.Item>

                        {/* <Form.Item name="feedback" label="Feedback">
                            <Input placeholder="Enter feedback" />
                        </Form.Item>

                        <Form.Item name="transportation" label="Transportation">
                            <Input placeholder="Enter transportation details" />
                        </Form.Item> */}

                        <Form.Item>
                            <AntButton type="primary" htmlType="submit">
                                {editingActivityId ? "Update Activity" : "Create Activity"}
                            </AntButton>
                        </Form.Item>
                    </Form>
                </Modal>
        </div>
    );
};

export default Activities;
