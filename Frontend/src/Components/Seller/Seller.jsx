import React from "react";
import { Form, Input, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import CustomButton from "../Common/CustomButton";
import CustomLayout from "../Common/CustomLayout";
import { useNavigate } from "react-router-dom";
import { useRole } from "../Sign/SignUp"; // Adjust path if needed


const Seller = () => {
    const { role, setRole } = useRole(); // Get role and setRole from context
    const navigate = useNavigate();

    const onFinish = (values) => {
        console.log("Success:", values);
        navigate("/seller");
    };

    const onFinishFailed = (errorInfo) => {
        console.log("Failed:", errorInfo);
    };

    const normFile = (e) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e?.fileList;
    };

    return (
        <CustomLayout>
            {/* sideBarItems={sideBarItems} */}
            <div style={{ textAlign: "center", alignItems: "center", marginTop: "20px" }}>
                <h1 style={{ fontSize: "24px", fontWeight: "bold" }}>
                    Register as a {role} {/* Display the current role */}
                </h1>
            </div>
            <div style={{ textAlign: "center", marginBottom: "20px" }}>
                <CustomButton
                    type={role === "Tourist" ? "primary" : "default"}
                    onClick={() => setRole("Tourist")}
                    value="Tourist"
                    size="m"
                    style={{ margin: "10px" }}
                >
                </CustomButton>
                <CustomButton
                    type={role === "Tour Guide" ? "primary" : "default"}
                    onClick={() => setRole("Tour Guide")}
                    value="Tour Guide"
                    size="m"
                    style={{ margin: "10px" }}
                >
                </CustomButton>
                <CustomButton
                    type={role === "Seller" ? "primary" : "default"}
                    onClick={() => setRole("Seller")}
                    value="Seller"
                    size="m"
                    style={{ margin: "10px" }}
                >
                </CustomButton>
                <CustomButton
                    type={role === "Advertiser" ? "primary" : "default"}
                    onClick={() => setRole("Advertiser")}
                    value="Advertiser"
                    size="m"
                    style={{ margin: "10px" }}
                >
                </CustomButton>
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
                        label="Email"
                        name="email"
                        rules={[
                            { required: true, message: "Please input your email!" },
                            { type: "email", message: "Please enter a valid email!" },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Username"
                        name="username"
                        rules={[{ required: true, message: "Please input your username!" }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[
                            { required: true, message: "Please input your password!" },
                            { min: 6, message: "Password must be at least 6 characters!" },
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item
                        label="ID"
                        name="document1"
                        valuePropName="fileList"
                        getValueFromEvent={normFile}
                        extra="Upload the ID."
                    >
                        <Upload name="doc1" action="/upload.do" listType="text">
                            <CustomButton size="m" icon={<UploadOutlined />} value="Upload" />
                        </Upload>
                    </Form.Item>

                    <Form.Item
                        label="Taxation Registery Card"
                        name="document2"
                        valuePropName="fileList"
                        getValueFromEvent={normFile}
                        extra="Upload the taxation registery card."
                    >
                        <Upload name="doc2" action="/upload.do" listType="text">
                            <CustomButton size="m" icon={<UploadOutlined />} value="Upload" />
                        </Upload>
                    </Form.Item>

                    <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                        <CustomButton type="primary" htmlType="submit" value="Register" />
                    </Form.Item>
                </Form>
            </div>
        </CustomLayout>
    );
};

export default Seller;
