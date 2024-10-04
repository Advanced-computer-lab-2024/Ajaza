import React, { createContext, useContext, useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { Form, Input, Select, DatePicker, Typography, Upload, message } from "antd";
// import CustomButton from './Components/Common/CustomButton';
// import CustomLayout from './Components/Common/CustomLayout';
import CustomButton from "../Common/CustomButton";
import { CustomLayout } from "../Common";
import { UserOutlined, UploadOutlined } from "@ant-design/icons";
import CustomCard from "../Card";

const CreateFormPage = () => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const navigate = useNavigate();

    const onFinish = (values) => {
        console.log("Saved values:", values);
        const { name, description } = values;
        // Redirect to the new page and pass the form data using 'state'
        navigate("/seller-form", {
            state: {
                name,
                description
            },
        });
    };

    const onFinishFailed = (errorInfo) => {
        console.log("Failed:", errorInfo);
    };


    return (
        <CustomLayout>
            <div style={{ textAlign: "center", alignItems: "center", marginTop: "20px" }}>
                <h1 style={{ fontSize: "24px", fontWeight: "bold" }}>
                    Create Seller
                </h1>
            </div>
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: "100vh",
                }}
            >
                <Form
                    name="basic"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    style={{ maxWidth: 600, width: "100%" }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                    <Form.Item
                        label="Name"
                        name="name"
                        rules={[{ required: true, message: "Please input a name!" }]}
                    >
                        <Input.TextArea
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            rows={1}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Description"
                        name="description"
                        rules={[{ required: true, message: "Please input a description!" }]}
                    >
                        <Input.TextArea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={4}
                        />
                    </Form.Item>

                    <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                        <CustomButton type="default" htmlType="submit" value="Save" size={"m"}>
                        </CustomButton>
                    </Form.Item>
                </Form>
            </div>
        </CustomLayout>
    );
};

export default CreateFormPage