import React, { useEffect, useState } from "react";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Avatar, Card, Space, Modal, message, Form, Input, Button as AntButton, Select } from "antd";
import axios from "axios";
import Button from "./Common/CustomButton";
import { jwtDecode } from "jwt-decode";
import { apiUrl } from "./Common/Constants";

const { Option } = Select;

// Create an axios instance with default headers
const apiClient = axios.create({
    baseURL: apiUrl,
    headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`, // Set the token from localStorage
    },
});

const Venues = () => {
    const [venuesData, setVenuesData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();

    const token = localStorage.getItem("token");
    let decodedToken = null;
    if (token) {
        decodedToken = jwtDecode(token);
    }
    const userid = decodedToken.userId;

    const fetchVenues = async () => {
        try {
            const response = await apiClient.get(`governor/getMyVenues/${userid}`);
            setVenuesData(response.data);
        } catch (error) {
            console.error("Error fetching venues:", error);
            message.error("Failed to fetch venues.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVenues();
    }, []);

    // Function to handle creating a new venue
    const createVenue = async (values) => {
        try {
            const newVenue = {
                governorId: userid, // Replace with the actual governor ID
                name: values.name,
                desc: values.desc,
                pictures: [], // Handle picture upload later
                location: values.location,
                openingHours: values.openingHours,
                price: values.price,
                tags: values.tags,
            };

            const response = await apiClient.post("governor/createGovernorVenue/", newVenue);
            setVenuesData([...venuesData, response.data]);
            message.success("Venue created successfully!");
            setIsModalVisible(false); // Close the modal after success
            form.resetFields(); // Reset the form fields
        } catch (error) {
            console.error("Error creating venue:", error);
            message.error("Failed to create venue.");
        }
    };

    // Function to handle editing a venue
    const editVenue = async (id) => {
        const venueToEdit = venuesData.find((venue) => venue._id === id);
        const updatedVenue = { ...venueToEdit, name: "Updated Venue" }; // Update as needed

        try {
            const response = await apiClient.patch(`governor/editVenue/${id}`, updatedVenue);
            setVenuesData(
                venuesData.map((venue) => (venue._id === id ? response.data : venue))
            );
            message.success("Venue updated successfully!");
        } catch (error) {
            console.error("Error updating venue:", error);
            message.error("Failed to update venue.");
        }
    };

    // Function to handle deleting a venue
    const deleteVenue = async (id) => {
        Modal.confirm({
            title: "Are you sure?",
            content: "Do you want to delete this venue?",
            onOk: async () => {
                try {
                    await apiClient.delete(`governor/deleteGovernorVenue/${id}`);
                    setVenuesData(venuesData.filter((venue) => venue._id !== id));
                    message.success("Venue deleted successfully!");
                } catch (error) {
                    console.error("Error deleting venue:", error);
                    message.error("Failed to delete venue.");
                }
            },
        });
    };

    // Function to show the modal
    const showModal = () => {
        setIsModalVisible(true);
    };

    // Function to handle modal cancellation
    const handleCancel = () => {
        setIsModalVisible(false);
    };

    return (
        <div style={{ display: "flex" }}>
            <div style={{ padding: "20px", flexGrow: 1 }}>
                <h2>My Venues</h2>
                <div
                    style={{
                        marginBottom: "20px",
                        display: "flex",
                        justifyContent: "flex-start",
                    }}
                >
                    <Button size={"s"} value={"Create Venue"} rounded={true} onClick={showModal} />
                </div>

                {loading ? (
                    <p>Loading venues...</p>
                ) : (
                    <Space
                        direction="horizontal"
                        size="middle"
                        style={{ display: "flex", flexWrap: "wrap" }}
                    >
                        {venuesData.map((venue) => (
                            <Card
                                key={venue._id}
                                actions={[
                                    <EditOutlined
                                        key="edit"
                                        onClick={() => editVenue(venue._id)}
                                    />,
                                    <DeleteOutlined
                                        key="delete"
                                        onClick={() => deleteVenue(venue._id)}
                                    />,
                                ]}
                                style={{ minWidth: 300, margin: "10px" }} // Adding margin for better spacing
                            >
                                <Card.Meta
                                    avatar={
                                        <Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=1" />
                                    } // Use a relevant avatar
                                    title={venue.name}
                                    description={
                                        <p>
                                            {`Location: ${venue.location}, Price (Foreigner): ${
                                                venue.price.foreigner
                                            }, Price (Native): ${
                                                venue.price.native
                                            }, Tags: ${venue.tags.join(", ")}`}
                                        </p>
                                    }
                                />
                            </Card>
                        ))}
                    </Space>
                )}

                {/* Modal for creating a new venue */}
                <Modal
                    title="Create Venue"
                    visible={isModalVisible}
                    onCancel={handleCancel}
                    footer={null}
                >
                    <Form form={form} layout="vertical" onFinish={createVenue}>
                        <Form.Item
                            name="name"
                            label="Venue Name"
                            rules={[
                                { required: true, message: "Please input the venue name!" },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name="desc"
                            label="Description"
                            rules={[{ required: true, message: "Please input the venue description!" }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name="location"
                            label="Location"
                            rules={[{ required: true, message: "Please input the location!" }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name="price"
                            label="Price"
                            rules={[{ required: true, message: "Please input the price!" }]}
                        >
                            <Input.Group compact>
                                <Form.Item name={["price", "foreigner"]} noStyle>
                                    <Input
                                        style={{ width: "50%" }}
                                        placeholder="Foreigner price"
                                    />
                                </Form.Item>
                                <Form.Item name={["price", "native"]} noStyle>
                                    <Input
                                        style={{ width: "50%" }}
                                        placeholder="Native price"
                                    />
                                </Form.Item>
                            </Input.Group>
                        </Form.Item>
                        <Form.Item name="tags" label="Tags">
                            <Select mode="multiple" placeholder="Select tags">
                                <Option value="Monuments">Monuments</Option>
                                <Option value="Museums">Museums</Option>
                                <Option value="Religious Sites">Religious Sites</Option>
                                <Option value="Palaces/Castles">Palaces/Castles</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item>
                            <AntButton type="primary" htmlType="submit">
                                Create Venue
                            </AntButton>
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        </div>
    );
};

export default Venues;
