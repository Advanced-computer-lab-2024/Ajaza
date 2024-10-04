import React from "react";
import { useNavigate } from "react-router-dom";
import CustomButton from "../Common/CustomButton";
import { CustomLayout } from "../Common";

const SellerPage = () => {
    const navigate = useNavigate();

    // Navigation function for creating a form
    const handleCustomButtonClick = () => {
        navigate("/createform");
    };

    // Navigation function for adding a product
    const handleAddProductClick = () => {
        navigate("/product");
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

    return (
        <CustomLayout user="seller" sideBarItems={sideBarItems}>
            <div style={{ textAlign: "center", marginTop: "20px" }}>
                <h1>Welcome to Seller Page!</h1>
            </div>
            {/* Create Seller Button */}
            <CustomButton
                type="primary"
                htmlType="submit"
                size="m"
                value="Create Seller"
                rounded={true}
                loading={false}
                onClick={handleCustomButtonClick} // Set the onClick handler for the "Create Seller" button
            />
        </CustomLayout>
    );
};

export default SellerPage;
