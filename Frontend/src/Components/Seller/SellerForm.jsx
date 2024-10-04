import React, { createContext, useContext, useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { Form, Input, Select, DatePicker, Typography, Upload, message } from "antd";
// import CustomButton from './Components/Common/CustomButton';
// import CustomLayout from './Components/Common/CustomLayout';
import CustomButton from "../Common/CustomButton";
import { CustomLayout } from "../Common";
import { UserOutlined, UploadOutlined } from "@ant-design/icons";
import CustomCard from '../Card';

const SellerForm = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { name: initialName, description: initialDescription } = location.state || {};

    // Editable state for seller info
    const [name, setName] = useState(initialName || "");
    const [description, setDescription] = useState(initialDescription || "");
    const [isEditing, setIsEditing] = useState(false);

    // Toggle edit mode
    const handleUpdateClick = () => {
        setIsEditing(true);
    };

    // Save the updated values
    const handleSaveClick = () => {
        setIsEditing(false); // Exit editing mode
        console.log("Updated values:", { name, description });
    };

    return (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
            <h1>Seller Details</h1>
            {location.state ? (
                <div>
                    {isEditing ? (
                        <div>
                            <Form
                                name="sellerForm"
                                labelCol={{ span: 8 }}
                                wrapperCol={{ span: 16 }}
                                style={{ maxWidth: 600, width: "100%" }}
                                autoComplete="off"
                            >
                                <Form.Item label="Name">
                                    <Input.TextArea
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        rows={2}
                                        placeholder="Enter seller name"
                                    />
                                </Form.Item>
                                <Form.Item label="Description">
                                    <Input.TextArea
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        rows={4}
                                        placeholder="Enter seller description"
                                    />
                                </Form.Item>
                            </Form>
                            <CustomButton type="primary" value="Save" size="m" onClick={handleSaveClick}>

                            </CustomButton>
                        </div>
                    ) : (
                        <div>
                            <p><strong>Name:</strong> {name}</p>
                            <p><strong>Description:</strong> {description}</p>
                            <CustomButton type="default" value="Update" size="m" onClick={handleUpdateClick}>

                            </CustomButton>
                        </div>
                    )}
                </div>
            ) : (
                <p>No seller data available. Please go back and fill the form.</p>
            )}
        </div>
    );
};

export default SellerForm