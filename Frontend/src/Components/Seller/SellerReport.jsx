import React, { useState, useEffect } from 'react';
import { Table, message } from 'antd';
import { jwtDecode } from "jwt-decode";
import axios from 'axios';

const SellerReport = () => {
    const [salesData, setSalesData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [SellerId, setSellerId] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("token"); // Replace with your token source
        if (token) {
            try {
                const decoded = jwtDecode(token); // Decode the JWT token
                const sellerIdFromToken = decoded?.userId || decoded?.sellerId || null; // Adjust key based on your token structure
                console.log("Decoded SellerId:", sellerIdFromToken);
                setSellerId(sellerIdFromToken);
            } catch (error) {
                console.error("Invalid token:", error);
                message.error("Unable to decode token.");
            }
        } else {
            console.warn("No token found.");
            message.warning("You are not logged in.");
        }
    }, []);

    useEffect(() => {
        if (!SellerId) return;  // Do nothing if SellerId is not set

        const fetchSalesData = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`http://localhost:5000/seller/viewSalesReport/${SellerId}`);
                const { salesDetails } = response.data;

                if (Array.isArray(salesDetails)) {
                    // Transform the data to match the format expected for the table
                    const transformedData = salesDetails.map(product => ({
                        productName: product.productName,
                        quantitySold: product.sales,
                        salePrice: product.price,
                        sellerName: product.sellerName,
                        totalRevenue: product.sales * product.price,
                    }));
                    // Set the transformed data to the salesData state
                    setSalesData(transformedData);
                } else {
                    console.error("Invalid data format:", salesDetails);
                    setSalesData([]);  // Clear sales data if invalid format
                }
            } catch (error) {
                console.error("Error fetching sales data:", error);
                message.error("Failed to load sales report.");
            } finally {
                setLoading(false);
            }
        };

        fetchSalesData();
    }, [SellerId]); 
    

    const columns = [
        {
            title: 'Product Name',
            dataIndex: 'productName',
            key: 'productName',
        },
        {
            title: 'Quantity Sold',
            dataIndex: 'quantitySold',
            key: 'quantitySold',
        },
        {
            title: 'Date Sold',
            dataIndex: 'dateSold',
            key: 'dateSold',
        },
        {
            title: 'Sale Price',
            dataIndex: 'salePrice',
            key: 'salePrice',
        },
        {
            title: 'Total Revenue',
            dataIndex: 'totalRevenue',
            key: 'totalRevenue',
        },
    ];

    return (
        <div>
            <h2>Sales Report</h2>
            <Table
                 columns={columns}
                 dataSource={salesData}  // Pass the sales data to the table
                 loading={loading}
                 rowKey={(record) => record.productName}  
            />
        </div>
    );
};

export default SellerReport;
