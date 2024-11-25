import React, { useState, useEffect } from 'react';
import { Table, message } from 'antd';
import { jwtDecode } from "jwt-decode";
import axios from 'axios';

const AdvertiserReport = () => {
    const [salesData, setSalesData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [AdvertiserId, setAdvertiserId] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("token"); // Replace with your token source
        if (token) {
            try {
                const decoded = jwtDecode(token); // Decode the JWT token
                const AdvertiserIdFromToken = decoded?.userId || decoded?.AdvertiserId || null; // Adjust key based on your token structure
                console.log("Decoded AdvertiserId:", AdvertiserIdFromToken);
                setAdvertiserId(AdvertiserIdFromToken);
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
        if (!AdvertiserId) return;  // Do nothing if AdvertiserId is not set

        const fetchSalesData = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`http://localhost:5000/advertiser/viewSalesReport/${AdvertiserId}`);
                const { salesDetails } = response.data;

                if (Array.isArray(salesDetails)) {
                    const transformedData = salesDetails.map((activity, index) => ({
                        key: index, // Unique key for table rows
                        activityName: activity.name || "Unnamed Activity", // Activity name
                        quantitySold: activity.spots || 0, // Number of spots booked
                        salePrice: activity.lower || 0, // Price per booking
                        advertiserName: activity.advertiserId?.name || "Unknown", // Fetch advertiser name
                        dateSold: activity.date || "No date available", // Date of activity
                        totalRevenue: (activity.spots || 0) * (activity.lower || 0) * (1 - (activity.discounts || 0) / 100), // Revenue with discounts
                        category: activity.category.join(", ") || "Uncategorized", // Convert category array to string
                    }));
                    setSalesData(transformedData); // Set transformed data
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
    }, [AdvertiserId]); 
    

    const columns = [
        {
            title: 'Activity Name',
            dataIndex: 'activityName',
            key: 'activityName',
        },
        {
            title: 'Quantity Sold',
            dataIndex: 'quantitySold',
            key: 'quantitySold',
        },
        {
            title: 'Category',
            dataIndex: 'category',
            key: 'category',
        },
        {
            title: 'Date of Activity',
            dataIndex: 'dateSold',
            key: 'dateSold',
        },
        {
            title: 'Price per Booking',
            dataIndex: 'salePrice',
            key: 'salePrice',
            render: (text) => `$${text.toFixed(2)}`, // Format as currency
        },
        {
            title: 'Total Revenue',
            dataIndex: 'totalRevenue',
            key: 'totalRevenue',
            render: (text) => `$${text.toFixed(2)}`, // Format as currency
        },
    ];
    
    return (
        <div>
            <h2>Sales Report</h2>
            <Table
                 columns={columns}
                 dataSource={salesData}  // Pass the sales data to the table
                 loading={loading}
                 rowKey={(record) => record.key || record.productName}
                
            />
        </div>
    );
};

export default AdvertiserReport;
