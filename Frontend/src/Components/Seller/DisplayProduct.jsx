import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { Input, Typography, message } from "antd";
import CustomButton from "../Common/CustomButton";
import CustomLayout from "../Common/CustomLayout";
import CustomCard from '../Card';
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";


const { Title } = Typography;

const DisplayForm = () => {
    const location = useLocation();
    const { quantity, name: initialName, desc: initialDesc, price: initialPrice, productId } = location.state || {};

    const [name, setName] = useState(initialName);
    const [desc, setDesc] = useState(initialDesc);
    const [price, setPrice] = useState(initialPrice);
    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const newSellerId = location.state?.newSellerId;
    const prodId = location.state?.prodId;
    console.log("SALAH")
    console.log("ID in prod1 page:", newSellerId);
    console.log("PROD ID in prod1 page:", prodId);


    const handleUpdateClick = () => {
        setIsEditing(true);
    };

    // Save the updated values
    const handleSaveClick = async (values) => {
        setIsEditing(false); // Exit editing mode
        console.log("Updated values:", { name, desc, price });

        // Validate data
        if (!name || !desc || !price) {
            message.error("Please provide valid details and price.");
            return;
        }

        // Update the product details in the backend
        try {
            setLoading(true);
            if (!newSellerId || !prodId) return; // If there's no sellerId, exit early
            console.log("Seller ID:", newSellerId);
            console.log("Product ID:", prodId);
            const response = await axios.patch(`http://localhost:5000/product/${newSellerId}/product/${prodId}/adminSellerEditProduct`, {
                name,
                desc,
                price
            });

            console.log(values)
            if (response.status === 200) {
                message.success("Product updated successfully!");

            } else {
                message.error("Failed to update product.");
            }
        } catch (error) {
            console.error("Error updating product:", error);
            message.error("Error updating product. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <CustomLayout>
            <div style={{ textAlign: "center", marginTop: "20px" }}>
                <Title level={1}>Product Details</Title>

                <CustomCard
                    name={isEditing ? (
                        <Input.TextArea
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            rows={2}
                        />
                    ) : (
                        name
                    )}
                    desc={isEditing ? (
                        <Input.TextArea
                            value={desc}
                            onChange={(e) => setDesc(e.target.value)}
                            rows={2}
                        />
                    ) : (
                        desc
                    )}

                    price={isEditing ? (
                        <Input
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                        />
                    ) : (
                        price
                    )}
                    quantity={quantity}
                    onClick={handleUpdateClick} // Trigger update on card click
                />

                {isEditing && (
                    <CustomButton type="primary" size="m" value="Save" onClick={handleSaveClick} loading={loading} />
                )}
            </div>
        </CustomLayout>
    );
};

export default DisplayForm;
