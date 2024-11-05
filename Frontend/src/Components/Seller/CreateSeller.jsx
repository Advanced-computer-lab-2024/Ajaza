import React, { createContext, useContext, useParams, useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { Form, Input, Select, DatePicker, Typography, Upload, message } from "antd";
// import CustomButton from './Components/Common/CustomButton';
// import CustomLayout from './Components/Common/CustomLayout';
import CustomButton from "../Common/CustomButton";
import CustomLayout from "../Common/CustomLayout";
import { UserOutlined, UploadOutlined } from "@ant-design/icons";
import CustomCard from "../Card";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import SellerForm from "./SellerForm";


const CreateFormPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const newSellerId = location.state?.newSellerId;  // Access the passed state
    console.log("ID in second page:", newSellerId);
    const [name, setName] = useState(""); // Initialize as an empty string
    const [description, setDescription] = useState(""); // Initialize as an empty string
    const [sellerData, setSellerData2] = useState([]);
    const [loading, setLoading] = useState(true);

    let decodedToken = null;
    const token = localStorage.getItem("token");
    if (token) {
        decodedToken = jwtDecode(token);
    }
    const userid = decodedToken ? decodedToken.userId : null;

    const handleAddProductClick = () => {
        navigate("/product", { state: { newSellerId } });
    };

    // Sidebar items including the "Add Product" button
    const sideBarItems = [
        {
            key: "addProduct",
            label: "Add Product",
            onClick: handleAddProductClick,
        },
        // You can add more items here if needed
    ];
    const createSellerForm = async (values) => {
        try {
            console.log("Values:", values);
            console.log(values.name);
            console.log(values.description);

            const response = await axios.post(`http://localhost:5000/seller/sellerCreateProfile/${newSellerId}`, {
                name: values.name,
                desc: values.description,
            });
            console.log("ENGY");
            setSellerData2(response.data);
            message.success("Seller created successfully!");
        } catch (error) {
            console.error("Error creating seller:", error);
            message.error("Failed to create seller.");
        }
    };

    useEffect(() => {
    }, []);

    const onFinish = async (values) => {
        console.log("Form submitted with values:", values);
        await createSellerForm(values);
        navigate("seller-form", {
            state: {
                name: values.name,
                description: values.description,
                newSellerId,
            },
        });
    };

    const onFinishFailed = (errorInfo) => {
        console.log("Failed:", errorInfo);
    };


    return (
        <>
            <CustomLayout sideBarItems={sideBarItems}>
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

            <Routes>
                <Route path="seller-form" element={<SellerForm />} />
            </Routes>
        </>
    );

};

export default CreateFormPage