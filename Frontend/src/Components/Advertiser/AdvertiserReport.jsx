import React, { useState, useEffect } from 'react';
import { Table, message } from 'antd';
import {jwtDecode} from "jwt-decode"; // Correct import
import axios from 'axios';

const AdvertiserReport = () => {
    const [salesData, setSalesData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [AdvertiserId, setAdvertiserId] = useState(null);
    const [totalSales, setTotalSales] = useState(0); // State for total sales

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const decoded = jwtDecode(token); // Decode the JWT token
                const AdvertiserIdFromToken = decoded?.userId || decoded?.AdvertiserId || null;
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
        if (!AdvertiserId) return;

        const fetchSalesData = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`http://localhost:5000/advertiser/viewSalesReport/${AdvertiserId}`);
                const { totalSales, report } = response.data;

                if (Array.isArray(report)) {
                    const transformedData = report.map((activity, index) => ({
                        key: index, // Unique key for table rows
                        activityName: activity.name || "Unnamed Activity", // Activity name
                        activityDate: activity.activityDate 
                            ? new Date(activity.activityDate).toLocaleDateString() 
                            : "No Date", // Format date
                        price: activity.price || 0, // Price
                        category: activity.category?.join(", ") || "Uncategorized", // Convert category array to string
                    }));
                    setSalesData(transformedData);
                    setTotalSales(totalSales || 0); // Set total sales
                } else {
                    console.error("Invalid data format:", report);
                    setSalesData([]);
                    setTotalSales(0);
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
            title: 'Activity Date',
            dataIndex: 'activityDate',
            key: 'activityDate',
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
            render: (text) => `$${text.toFixed(2)}`, // Format as currency
        },
        {
            title: 'Category',
            dataIndex: 'category',
            key: 'category',
        },
    ];

    return (
        <div>
            <h2>Advertiser Sales Report</h2>
            <p>Total Sales: <strong>${totalSales.toFixed(2)}</strong></p> {/* Display total sales */}
            <Table
                columns={columns}
                dataSource={salesData} // Pass the sales data to the table
                loading={loading}
                rowKey={(record) => record.key || record.activityName}
            />
        </div>
    );
};

export default AdvertiserReport;
