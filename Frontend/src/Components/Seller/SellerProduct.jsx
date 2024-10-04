import React, { createContext, useContext, useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { Form, Input, Select, DatePicker, Typography, Upload, message } from "antd";
// import CustomButton from './Components/Common/CustomButton';
// import CustomLayout from './Components/Common/CustomLayout';
import CustomButton from "../Common/CustomButton";
import { CustomLayout } from "../Common";
import { UserOutlined, UploadOutlined } from "@ant-design/icons";
import CustomCard from '../Card';

const Product = () => {
    const [quantity, setQuantity] = useState("");
    const [details, setDetails] = useState("");
    const [price, setPrice] = useState("");
    const navigate = useNavigate();

    const onFinish = (values) => {
        console.log("Saved values:", values);
        const { quantity, details, price } = values;
        // Redirect to the new page and pass the form data using 'state'
        navigate("/display", {
            state: {
                quantity,
                details,
                price,
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
                    Add Product
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
                        label="Details"
                        name="details"
                        rules={[{ required: true, message: "Please input the details!" }]}
                    >
                        <Input.TextArea
                            value={details}
                            onChange={(e) => setDetails(e.target.value)}
                            rows={2}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Price"
                        name="price"
                        rules={[{ required: true, message: "Please input the price!" }]}
                    >
                        <Input
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            type="number"
                        />
                    </Form.Item>

                    <Form.Item
                        label="Quantity"
                        name="quantity"
                        rules={[{ required: true, message: "Please input the quantity!" }]}
                    >
                        <Input
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            type="number"
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

export default Product