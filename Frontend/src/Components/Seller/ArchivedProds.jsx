import React, { useEffect, useState } from "react";
import axios from "axios";
import { Modal, message, Card } from "antd";
import UnarchiveIcon from '@mui/icons-material/Unarchive';
import { jwtDecode } from "jwt-decode";
import { apiUrl } from "../Common/Constants";

const ArchivedProducts = () => {
    const [archivedProducts, setArchivedProducts] = useState([]);
    const [refreshArchived, setRefreshArchived] = useState(false);
    const [isUnarchiveModalVisible, setIsUnarchiveModalVisible] = useState(false);
    const [unarchivingProductId, setUnarchivingProductId] = useState(null);
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const fetchArchivedProducts = async () => {
            const token = localStorage.getItem("token");
            let decodedToken = null;
            if (token) {
                decodedToken = jwtDecode(token);
            }
            const userId = decodedToken.userDetails["_id"];
            setUserId(userId);

            try {
                // Fetch all products for the user
                const productResponse = await axios.get(`${apiUrl}product/viewMyProducts/${userId}`);
                const products = productResponse.data;

                // Filter only archived products
                const archivedProductsList = products.filter((product) => product.archived);
                setArchivedProducts(archivedProductsList); // Store archived products in state
            } catch (error) {
                console.error("Error fetching archived products:", error);
            }
        };

        fetchArchivedProducts();
    }, [refreshArchived]);

    const unarchiveProduct = async (product) => {
        try {
            await axios.patch(`${apiUrl}product/${userId}/product/${product._id}/adminSellerArchiveProduct`, {
                archived: false, // Mark the product as unarchived
            });
            setRefreshArchived((prev) => !prev); // Refresh archived products
            message.success("Product unarchived successfully!");
            setIsUnarchiveModalVisible(false);
        } catch (error) {
            message.error(`Failed to unarchive product: ${error.response?.data?.message || error.message}`);
        }
    };

    const showUnarchiveModal = (product) => {
        setUnarchivingProductId(product._id);
        setIsUnarchiveModalVisible(true);
    };

    return (
        <>
            <h2>Archived Products</h2>
            {archivedProducts.length === 0 ? (
                <p>No archived products available</p>
            ) : (
                archivedProducts.map((product) => (
                    <Card key={product._id} title={product.name} extra={<UnarchiveIcon onClick={() => showUnarchiveModal(product)} />} >
                        <p>{product.desc}</p>
                        <p>Price: {product.price}</p>
                    </Card>
                ))
            )}

            <Modal
                title="Confirm Unarchive"
                visible={isUnarchiveModalVisible}
                onOk={() => {
                    const productToUnarchive = archivedProducts.find(item => item._id === unarchivingProductId);
                    if (productToUnarchive) {
                        unarchiveProduct(productToUnarchive);
                    } else {
                        message.error("Product not found for unarchiving.");
                    }
                }}
                onCancel={() => setIsUnarchiveModalVisible(false)}
            >
                <p>Are you sure you want to unarchive this product?</p>
            </Modal>
        </>
    );
};

export default ArchivedProducts;
