import React, { useEffect, useState } from "react";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Avatar, Card, Space, Modal, message, Form, Input, Button as AntButton, Select } from "antd"; 
import axios from "axios";
import Button from "./Common/CustomButton";
import { jwtDecode } from "jwt-decode";
import { apiUrl } from "./Common/Constants";

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
    
    let decodedToken = null;
    const token = localStorage.getItem("token");
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
            console.log(response.data)
        } catch (error) {
            console.error("Error fetching categories:", error);
            setCategories([]);
        }
    };

    const fetchTags = async () => {
        try {
            const response = await apiClient.get("tag");
            setTags(response.data);
            console.log(response.data)
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
                location: values.location,
                upper: values.upper,
                lower: values.lower,
                category: values.category,
                tags: values.tags,
                discounts: values.discounts,
                spots: values.spots,
                isOpen: values.isOpen,
                feedback: values.feedback,
                transportation: values.transportation,
            };

            const response = await apiClient.post(`activity/createSpecifiedActivity/${userid}`, newActivity);
            setActivitiesData([...activitiesData, response.data]);
            message.success("Activity created successfully!");
            setIsModalVisible(false);
            form.resetFields();
        } catch (error) {
            message.error("Failed to create activity.");
        }
    };

    const editActivity = async (values) => {
        try {
            const originalActivity = activitiesData.find((activity) => activity._id === editingActivityId);
            const updatedFields = {};
            
            Object.keys(values).forEach((key) => {
                if (values[key] !== originalActivity[key]) {
                    updatedFields[key] = values[key];
                }
            });
    
            const response = await apiClient.put(`activity/updateActivityFilteredFields/${userid}/${editingActivityId}`,updatedFields);
            setActivitiesData(
                activitiesData.map((activity) => 
                    activity._id === editingActivityId ? response.data : activity
                )
            );
            
            message.success("Activity updated successfully!");
            setIsModalVisible(false);
            form.resetFields();
            setEditingActivityId(null);
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
                    await apiClient.delete(`activity/deleteSpecificActivity/${userid}/${id}`);
                    setActivitiesData(activitiesData.filter((activity) => activity._id !== id));
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
        setIsModalVisible(true);
        form.setFieldsValue({
            name: activity.name,
            date: activity.date,
            location: activity.location,
            upper: activity.upper,
            lower: activity.lower,
            category: activity.category,
            tags: activity.tags,
            discounts: activity.discounts,
            spots: activity.spots,
            isOpen: activity.isOpen,
        });
        setEditingActivityId(activity._id);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setEditingActivityId(null);
        form.resetFields();
    };

    return (
        <div style={{ padding: "20px" }}>
            <h2>My Activities</h2>
            <div style={{ marginBottom: "20px", display: "flex", justifyContent: "flex-start" }}>
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
                                        <p><strong>Location:</strong> {activity.location}</p>
                                        <p><strong>Date:</strong> {new Date(activity.date).toLocaleDateString()}</p>
                                        <p><strong>Upper Limit:</strong> {activity.upper}</p>
                                        <p><strong>Lower Limit:</strong> {activity.lower}</p>
                                        <p><strong>Categories:</strong> {categories.find(cat => cat._id.toString() === activity.category.toString())?.category || 'None'}</p>                                     
                                        <p><strong>Tags:</strong> {activity.tags.map((tagId) => tags.find(tag => tag._id === tagId)?.tag || tagId).join(", ")}</p>                                        <p><strong>Available Spots:</strong> {activity.spots}</p>
                                        <p><strong>Discounts:</strong> {activity.discounts}</p>
                                    </div>
                                }
                            />
                        </Card>
                    ))}
                </Space>
            )}

            <Modal title={editingActivityId ? "Edit Activity" : "Create Activity"} open={isModalVisible} onCancel={handleCancel} footer={null}>
                <Form form={form} layout="vertical" onFinish={editingActivityId ? editActivity : createActivity}>
                    <Form.Item name="name" label="Activity Name" rules={[{ required: true, message: "Please input the activity name!" }]}>
                        <Input />
                    </Form.Item>

                    <Form.Item name="date" label="Date" rules={[{ required: true, message: "Please input the activity date!" }]}>
                        <Input type="date" />
                    </Form.Item>

                    <Form.Item name="location" label="Location" rules={[{ required: true, message: "Please input the location!" }]}>
                        <Input />
                    </Form.Item>

                    <Form.Item name="upper" label="Upper Limit" rules={[{ required: true, message: "Please input the upper limit!" }]}>
                        <Input type="number" />
                    </Form.Item>

                    <Form.Item name="lower" label="Lower Limit" rules={[{ required: true, message: "Please input the lower limit!" }]}>
                        <Input type="number" />
                    </Form.Item>

                    <Form.Item name="category" label="Category">
                        <Select placeholder="Select a category" allowClear>
                            {categories.map((category) => (
                                <Select.Option key={category._id} value={category._id}>
                                    {category.category}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item name="tags" label="Tags">
                        <Select
                            mode="multiple"
                            placeholder="Select Tags"
                            allowClear
                        >
                            {tags.map((tag) => (
                                <Select.Option key={tag._id} value={tag._id}>
                                    {tag.tag}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item name="spots" label="Available Spots" rules={[{ required: true, message: "Please input the number of available spots!" }]}>
                        <Input type="number" />
                    </Form.Item>

                    <Form.Item name="discounts" label="Discounts">
                        <Input placeholder="Enter discount details" />
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
